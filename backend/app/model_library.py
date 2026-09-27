"""Local file library, shared by Docker and native development."""
import json
import os
from pathlib import Path
from urllib.parse import quote

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

ROOT = Path(os.getenv("MODELS_DIR", Path(__file__).resolve().parents[2] / "models"))
FILES = ROOT / "files"
router = APIRouter()
ALLOWED = {".glb", ".gltf", ".stl", ".bin", ".png", ".jpg", ".jpeg", ".webp", ".ktx2"}


def resolve_file(name: str) -> Path:
    path = (FILES / name).resolve()
    if not path.is_relative_to(FILES.resolve()) or path.suffix.lower() not in ALLOWED:
        raise HTTPException(400, "Invalid model file path or extension")
    return path


def catalogue():
    try:
        data = json.loads((ROOT / "catalog.json").read_text())
        entries = data["models"]
        if not isinstance(entries, list):
            raise ValueError()
        ids = set()
        for item in entries:
            if not all(isinstance(item.get(k), str) and item[k] for k in ("id", "name", "file")):
                raise ValueError()
            if item["id"] in ids or Path(item["file"]).suffix.lower() not in {".glb", ".gltf", ".stl"}:
                raise ValueError()
            ids.add(item["id"])
            item["available"] = resolve_file(item["file"]).is_file()
            item["url"] = "/api/v1/model-files/" + quote(item["file"], safe="/")
        if data.get("active") is not None and data["active"] not in ids:
            raise ValueError()
        return data
    except (OSError, ValueError, KeyError, TypeError, AttributeError) as exc:
        raise HTTPException(503, "Invalid or missing models/catalog.json") from exc


def active_model():
    data = catalogue()
    for item in data["models"]:
        if item["id"] == data.get("active"):
            if not item["available"]:
                raise HTTPException(404, "Active model file is missing")
            mode = "stl" if Path(item["file"]).suffix.lower() == ".stl" else "glb"
            return {"url": item["url"], "mode": mode, "name": item["name"], "id": item["id"]}
    return None


@router.get("/api/v1/models")
def list_models():
    return catalogue()


@router.get("/api/v1/model-files/{file_path:path}")
def serve_model(file_path: str):
    path = resolve_file(file_path)
    if not path.is_file():
        raise HTTPException(404, "Model file not found")
    return FileResponse(path, headers={"Cache-Control": "no-cache"})

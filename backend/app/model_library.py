"""Local file library, shared by Docker and native development."""
import json
import os
from pathlib import Path
from urllib.parse import quote

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

ROOT = Path(os.getenv("MODELS_DIR", Path(__file__).resolve().parents[2] / "models"))
router = APIRouter()
ALLOWED = {".glb", ".gltf", ".stl", ".bin", ".png", ".jpg", ".jpeg", ".webp", ".ktx2"}


def resolve_file(name: str) -> Path:
    path = (ROOT / name).resolve()
    if not path.is_relative_to(ROOT.resolve()) or path.suffix.lower() not in ALLOWED:
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
            if "components" in item:
                if not isinstance(item["components"], str) or not item["components"].endswith(".json"):
                    raise ValueError()
            if "camera" in item:
                camera = item["camera"]
                if not isinstance(camera, dict) or not all(isinstance(camera.get(key), list) and len(camera[key]) == 3 and all(isinstance(value, (int, float)) for value in camera[key]) for key in ("position", "target")):
                    raise ValueError()
        if data.get("active") is not None and data["active"] not in ids:
            raise ValueError()
        return data
    except (OSError, ValueError, KeyError, TypeError, AttributeError) as exc:
        raise HTTPException(503, "Invalid or missing models/catalog.json") from exc


def model_by_id(model_id: str | None = None):
    data = catalogue()
    for item in data["models"]:
        if item["id"] == (model_id or data.get("active")):
            if not item["available"]:
                raise HTTPException(404, "Active model file is missing")
            mode = "stl" if Path(item["file"]).suffix.lower() == ".stl" else "glb"
            return {"url": item["url"], "mode": mode, "name": item["name"], "id": item["id"], "camera": item.get("camera")}
    return None


def components_for_model(model_id: str | None = None):
    data = catalogue()
    active = next((item for item in data["models"] if item["id"] == (model_id or data.get("active"))), None)
    if not active or "components" not in active:
        return None
    path = (ROOT / active["components"]).resolve()
    if not path.is_relative_to(ROOT.resolve()):
        raise HTTPException(400, "Invalid component manifest path")
    try:
        components = json.loads(path.read_text())
        if not isinstance(components, list):
            raise ValueError()
        for component in components:
            if not isinstance(component, dict) or not all(isinstance(component.get(key), str) and component[key] for key in ("id", "name", "system", "modelObjectName")):
                raise ValueError()
        return components
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        raise HTTPException(503, "Invalid or missing component manifest") from exc


@router.get("/api/v1/models")
def list_models():
    return catalogue()


@router.get("/api/v1/model-files/{file_path:path}")
def serve_model(file_path: str):
    path = resolve_file(file_path)
    if not path.is_file():
        raise HTTPException(404, "Model file not found")
    media_types = {
        ".glb": "model/gltf-binary",
        ".gltf": "model/gltf+json",
        ".stl": "model/stl",
        ".ktx2": "image/ktx2",
    }
    return FileResponse(
        path,
        media_type=media_types.get(path.suffix.lower()),
        headers={"Cache-Control": "no-cache"},
    )

import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException
from app import model_library as library


class LibraryTest(unittest.TestCase):
    def test_catalogue_selection_and_files(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            files = root / "files"
            files.mkdir()
            (files / "engine.glb").write_bytes(b"fixture")
            (root / "catalog.json").write_text(json.dumps({"active": "engine", "models": [
                {"id": "engine", "name": "Engine", "file": "files/engine.glb"}]}))
            with patch.object(library, "ROOT", root):
                self.assertTrue(library.catalogue()["models"][0]["available"])
                self.assertEqual(library.model_by_id()["url"], "/api/v1/model-files/files/engine.glb")
                self.assertEqual(library.serve_model("files/engine.glb").path, files / "engine.glb")
                for invalid in ("../secret.glb", "/etc/passwd", "secret.env"):
                    with self.assertRaises(HTTPException):
                        library.resolve_file(invalid)
                (files / "outside.glb").symlink_to("/tmp/outside.glb")
                with self.assertRaises(HTTPException):
                    library.resolve_file("files/outside.glb")
                (files / "engine.glb").unlink()
                with self.assertRaises(HTTPException) as missing:
                    library.model_by_id()
                self.assertEqual(missing.exception.status_code, 404)


if __name__ == "__main__":
    unittest.main()

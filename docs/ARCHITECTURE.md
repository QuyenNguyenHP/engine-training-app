# Architecture

```text
Browser: React + R3F/Three.js + Drei + Zustand
  ├── component library and information panel
  ├── schematic scene or imported GLB
  └── /api → Vite proxy (development) / Nginx (Docker)
                     ↓
                FastAPI
                  ├── SQLAlchemy → PostgreSQL (Docker) / SQLite (local)
                  └── S3 signed URL → browser loads private asset from MinIO
```

`frontend/src/store.ts` owns selection and display state. `Viewer.tsx` owns scene
objects, camera controls, picking and exploded offsets. `main.tsx` renders the
page and fetches the catalogue. `backend/app/main.py` owns the API, seed catalogue
and persistence. Component IDs are stable application identities; exported node
names bridge metadata to meshes. No learner records are stored in this MVP.

Database tables are initialized at startup for this prototype. Before growing
the backend, introduce schema migrations and separate API, service and persistence
modules. Future lesson steps should reference component IDs, camera targets and
validated declarative actions. Assessment scoring and progress belong on the
server once authentication exists.

Object storage keeps binaries; the database keeps their metadata. The model
endpoint returns an explicit schematic mode when no asset is configured. Model
download failures are surfaced in the viewer instead of silently changing models.

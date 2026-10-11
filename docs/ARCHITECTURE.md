# Architecture

```text
Browser: React + R3F/Three.js + Drei + Zustand
  |-- component library and information panel
  |-- schematic scene or imported GLB
  `-- /api -> Vite proxy (development) / Nginx (Docker)
                    |
                    v
                 FastAPI
                   |-- JSON catalogue and component manifests
                   `-- optional S3 signed URLs for private assets
```

`frontend/src/store.ts` owns selection and display state. `Viewer.tsx` owns scene
objects, camera controls, picking and exploded offsets. `main.tsx` renders the
page and fetches the catalogue. `backend/app/main.py` owns the stateless API, and
`backend/app/model_library.py` validates and serves the JSON model library.

Component IDs are stable application identities. Exported GLB node names bridge
component metadata to meshes. `models/catalog.json` defines the available models,
and each `models/library/<model-id>/components.json` file contains that model's
component learning content.

The current application has no database and stores no learner records. Future
lesson steps should reference component IDs, camera targets and validated
declarative actions. If accounts, assessment scoring or learner progress are
introduced later, add a persistence layer at that time.

Local files store model metadata and component learning content. Optional object
storage can keep private model binaries. Model download failures are surfaced in
the viewer instead of silently changing models.

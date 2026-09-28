# Technology Stack

This document records the technologies currently configured in the Engine Lab repository. Version numbers come from the checked-in package and container configuration.

## Frontend

| Technology | Version | Purpose |
| --- | --- | --- |
| React | 18.3.1 | User interface and component rendering |
| React DOM | 18.3.1 | Browser rendering |
| TypeScript | 5.7.3 | Static typing |
| Vite | 6.4.3 | Development server and production bundling |
| Three.js | 0.170.0 | WebGL 3D rendering |
| React Three Fiber | 8.18.0 | React renderer for Three.js |
| Drei | 9.122.0 | GLTF loading, orbit controls, grids and Three.js helpers |
| Zustand | 5.0.3 | Viewer state management |

The frontend supports GLB/glTF and STL models. It provides component selection, isolation, visibility controls, exploded view, X-ray mode, camera presets, fullscreen mode and automatic camera rotation.

## Backend

| Technology | Version | Purpose |
| --- | --- | --- |
| Python | 3.12 | Backend runtime |
| FastAPI | 0.115.12 | HTTP API |
| Uvicorn | 0.34.2 | ASGI application server |
| SQLAlchemy | 2.0.40 | Database access and local seed data |
| Psycopg | 3.2.6 | PostgreSQL driver |
| Boto3 | 1.37.38 | S3-compatible object storage integration |

The backend reads `models/catalog.json`, validates component manifests, serves local model files and exposes the model catalogue through `/api/v1` endpoints.

## Data and Storage

- PostgreSQL 16 Alpine is the main database in Docker Compose.
- SQLite is the backend fallback for native local development.
- MinIO is available through the optional `assets` Docker Compose profile for S3-compatible storage.
- Production model metadata is stored as JSON under `models/library/<model-id>/`.
- Model assets use GLB/glTF by preference, with STL supported for single-part imports.

## Infrastructure

| Technology | Configuration |
| --- | --- |
| Docker Compose | Coordinates frontend, backend, PostgreSQL and optional MinIO services |
| Node.js | Node 22 Alpine build image |
| Nginx | Serves the built frontend and proxies `/api/` to FastAPI |
| Python container | Python 3.12 Slim |

The frontend is exposed at `http://localhost:8088`. Inside Docker, Nginx proxies API requests to the backend on port `8000`.

## Development Commands

Run the complete application:

```powershell
docker compose up --build
```

Run the frontend without Docker:

```powershell
cd frontend
npm install
npm run dev
```

Run the frontend production check:

```powershell
cd frontend
npm run build
```

The frontend build runs TypeScript validation before creating the Vite production bundle.

## Main Source Locations

- `frontend/src/main.tsx`: application layout and component-library UI.
- `frontend/src/Viewer.tsx`: Three.js scene, model interaction and camera controls.
- `frontend/src/store.ts`: shared viewer state and actions.
- `frontend/src/style.css`: responsive application styling.
- `backend/app/main.py`: API application and database setup.
- `backend/app/model_library.py`: model catalogue, manifest validation and asset serving.
- `models/catalog.json`: available models and camera presets.
- `models/library/`: GLB assets and component manifests.


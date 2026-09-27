# Engine Lab

Runnable first prototype from `3D_Engine_Learning_System.md`: a React / React
Three Fiber / Drei / Zustand viewer, FastAPI catalogue, PostgreSQL and MinIO.
The supplied engine is an illustrative procedural schematic, not an accurate
engineering model. No GLB was supplied with the project.

## Start with Docker (recommended)

Install Docker Engine with the Compose plugin, then:

```bash
cd /home/dq/engine-training-app
docker compose up --build -d
```

- Application: http://localhost:8088
- API health: http://localhost:8088/api/v1/health
- Optional object-storage console: http://localhost:9001
- MinIO local login: `engine_local` / `engine_local_password`

```bash
docker compose logs -f backend
docker compose down
```

Database and asset volumes survive `docker compose down`. This configuration
binds to localhost and uses development credentials. Public hosting requires
your domain/server, HTTPS, private storage and replacement secrets.

MinIO is optional for the procedural demo. Start it when adding real assets:

```bash
docker compose --profile assets up -d storage
```

The MinIO registry returned authorization errors in the current environment, so
its container deployment has not been verified. You can instead configure an
existing S3-compatible store through the backend environment variables.

## Start without Docker

Requires Node 20.19+ and Python 3.10+. This mode uses a local SQLite database;
PostgreSQL is used by Compose.

Terminal 1:

```bash
cd /home/dq/engine-training-app
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements.txt
cd backend
../.venv/bin/uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Terminal 2:

```bash
cd /home/dq/engine-training-app/frontend
npm ci
npm run dev
```

Open http://localhost:5173. Vite proxies `/api` to FastAPI. API documentation
is at http://localhost:8000/docs in this mode.

## Use the viewer

Select a component from the tree or click its mesh. Drag to rotate, scroll to
zoom and right-drag to pan. Use X-ray or exploded view to access internal parts.
Isolate shows the selected component alone. Reset all restores hidden parts,
assembly transforms and the default camera. Previous/Next cycles the catalogue.

## Add your real engine GLB

For local models, use the new **`models/files/`** directory and select an entry
in **`models/catalog.json`**. See [model-library instructions](models/README.md)
for adding, renaming, switching and removing entries. This route works without
MinIO. The following instructions describe the optional S3 route.

1. Export distinct, uniquely named parts from your authoring tool. Use metres,
   Y-up, and centre the model near the origin.
2. Update the seed catalogue in `backend/app/main.py` so `modelObjectName`
   matches exported node names, and define exploded offsets in each node's
   parent coordinate space. Existing database rows are not overwritten by
   seeding: update them explicitly when changing a populated database.
3. In MinIO's console, create the private bucket `engine-assets`, then upload
   `engine.glb`. Do not enable public bucket access.
4. Add `ENGINE_MODEL_KEY: engine.glb` to the backend environment in
   `compose.yaml`, then run `docker compose up -d --build backend`.
5. The API signs a download URL valid for 15 minutes. Refresh the page to renew
   it. `S3_PUBLIC_ENDPOINT` must be reachable from the browser. Configure bucket
   CORS for your frontend origin if using a different object-storage provider.

The GLB loader supports Draco through Drei's default decoder. KTX2 textures
need a KTX2Loader/transcoder configuration before supplying compressed textures;
that pipeline is not implemented in this prototype. Imported models should have
non-overlapping selectable nodes; nested selectable assemblies need additional
visibility/material rules. All selectable parts need matching catalogue rows.

## Validation

```bash
cd frontend
npm run build
```

## Scope

Implemented: first-prototype viewer, catalogue persistence, health endpoint,
optional object-storage URL signing, Docker packaging. UI uses plain CSS.
Guided lessons, accounts, learner progress, assessments, operating animations,
fault simulations and certificates remain later roadmap phases.

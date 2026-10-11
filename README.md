# Engine Lab

Engine Lab is an interactive 3D marine-engine training application. The frontend
uses React, React Three Fiber, Drei and Zustand. The backend uses FastAPI and
serves the model catalogue, component learning content and 3D model files.

## Architecture

### Local development

```text
Browser :5173
    |
    | /api (Vite proxy)
    v
FastAPI :8000
    |
    +-- SQLite
    +-- models/
```

### Production deployment

```text
https://3d.dqtech.cloud
    |
    v
Apache2 :443
    |
    v
Frontend container (Nginx) 127.0.0.1:9900
    |                         |
    | /api                   | static React files
    v                         |
Backend container :8000 <----+
    |
    +-- PostgreSQL container
    +-- read-only models/ mount
```

Only Apache2 is public. Docker publishes the frontend on the server loopback
interface, and the backend and database remain inside the Docker network.

## Requirements

For terminal-based development:

- Node.js 20.19 or newer
- npm
- Python 3.10 or newer

For Docker deployment:

- Docker Engine
- Docker Compose plugin (`docker compose`)
- Apache2
- Certbot with the Apache plugin
- A Linux server with ports 80 and 443 open
- DNS for `3d.dqtech.cloud` pointing to the server's public IP address

## Run locally with a terminal

The backend and frontend run in separate terminals. Local development uses
SQLite, so PostgreSQL is not required.

### Windows PowerShell

Open PowerShell in the project directory.

Terminal 1 — backend:

```powershell
cd C:\Users\duyqu\Desktop\githup\engine-training-app
py -3 -m venv .venv-win
.\.venv-win\Scripts\python.exe -m pip install --upgrade pip
.\.venv-win\Scripts\python.exe -m pip install -r backend\requirements.txt
cd backend
..\.venv-win\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Terminal 2 — frontend:

```powershell
cd C:\Users\duyqu\Desktop\githup\engine-training-app\frontend
npm ci
npm run dev
```

### Linux, macOS or WSL

Terminal 1 — backend:

```bash
cd /path/to/engine-training-app
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r backend/requirements.txt
cd backend
../.venv/bin/python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Terminal 2 — frontend:

```bash
cd /path/to/engine-training-app/frontend
npm ci
npm run dev
```

Open the following addresses:

- Application: http://localhost:5173
- Backend health check: http://localhost:8000/api/v1/health
- FastAPI documentation: http://localhost:8000/docs

Vite forwards requests beginning with `/api` to the backend at
`http://127.0.0.1:8000`.

## Run locally with Docker

From the project root:

```bash
docker compose up --build -d
docker compose ps
```

Open:

- Application: http://localhost:9900
- Health check: http://localhost:9900/api/v1/health

Follow the service logs:

```bash
docker compose logs -f frontend backend db
```

Stop the application:

```bash
docker compose down
```

`docker compose down` preserves the PostgreSQL and asset volumes. Do not add
`-v` unless you intentionally want to delete the stored Docker data.

The optional MinIO service is not required for models stored in `models/`. To
start it for S3-compatible asset development:

```bash
docker compose --profile assets up -d storage
```

> **Port note:** The project uses host port `9900` for the frontend. The
> container still listens on port `80`. If the host port is changed again,
> update both `compose.yaml` and `deploy/apache/3d.dqtech.cloud.conf`.

## Deploy `3d.dqtech.cloud` with Docker and Apache2

These instructions target Ubuntu or Debian. The repository's deployment script
expects the project at `/home/dq/engine-training-app`. If the project is stored
elsewhere, update `project_dir` in `deploy/public.sh` first.

### 1. Configure DNS

At the DNS provider, create an `A` record:

```text
Type: A
Name: 3d
Value: <server-public-ipv4-address>
```

Add an `AAAA` record only when the server has working public IPv6. Confirm DNS
before requesting a certificate:

```bash
getent hosts 3d.dqtech.cloud
```

### 2. Install server packages

```bash
sudo apt update
sudo apt install -y apache2 certbot python3-certbot-apache
sudo a2enmod proxy proxy_http headers rewrite ssl
sudo systemctl enable --now apache2
```

Install Docker Engine and the Docker Compose plugin if they are not already
available, then verify:

```bash
docker --version
docker compose version
```

If a firewall is enabled, allow SSH, HTTP and HTTPS before continuing:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Apache Full'
sudo ufw status
```

### 3. Build and start the frontend, backend and database

```bash
cd /home/dq/engine-training-app
docker compose up --build -d
docker compose ps
curl --fail http://127.0.0.1:9900/api/v1/health
```

The expected health response is:

```json
{"status":"ok"}
```

The Compose stack starts:

- `frontend`: builds React and serves it with Nginx on `127.0.0.1:9900`.
- `backend`: runs FastAPI on the private Docker network.
- `db`: runs PostgreSQL with a persistent named volume.
- `storage`: optional MinIO service enabled only through the `assets` profile.

Before a production launch, replace the example database and storage credentials
in `compose.yaml` with private values. Do not publish the backend, PostgreSQL or
MinIO ports directly to the internet.

### 4. Enable the Apache virtual host

The repository includes `deploy/apache/3d.dqtech.cloud.conf`, which proxies the
domain to the loopback-only frontend container.

```bash
cd /home/dq/engine-training-app
sudo install -m 644 deploy/apache/3d.dqtech.cloud.conf /etc/apache2/sites-available/3d.dqtech.cloud.conf
sudo a2ensite 3d.dqtech.cloud.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

`apache2ctl configtest` must report `Syntax OK`. Test HTTP before enabling TLS:

```bash
curl --fail http://3d.dqtech.cloud/api/v1/health
```

### 5. Enable HTTPS with Let's Encrypt

```bash
sudo certbot --apache -d 3d.dqtech.cloud
```

Choose the HTTPS redirect when prompted. Certbot creates the TLS virtual host
and configures HTTP-to-HTTPS redirection. Verify the result:

```bash
sudo apache2ctl configtest
sudo certbot renew --dry-run
curl --fail https://3d.dqtech.cloud/api/v1/health
```

The application is then available at https://3d.dqtech.cloud.

### Optional deployment script

After DNS, Docker and Apache prerequisites are ready, the included script can
perform the Docker build, install the Apache virtual host, request the
certificate and run the health check:

```bash
cd /home/dq/engine-training-app
bash deploy/public.sh
```

For a server's first Certbot registration, the manual Certbot command above is
recommended because it allows you to provide the certificate notification email
and confirm the redirect options.

## Update an existing deployment

After pulling or copying new source code to the server:

```bash
cd /home/dq/engine-training-app
git pull
docker compose up --build -d
docker compose ps
curl --fail https://3d.dqtech.cloud/api/v1/health
```

Apache and Certbot do not need to be reconfigured for a normal application
update. The `models/` directory is mounted read-only into the backend, but a
container restart is useful after catalogue changes:

```bash
docker compose restart backend
```

## Operations and troubleshooting

Check containers and logs:

```bash
cd /home/dq/engine-training-app
docker compose ps
docker compose logs --tail=200 frontend backend db
```

Check Apache:

```bash
sudo apache2ctl configtest
sudo systemctl status apache2
sudo tail -n 100 /var/log/apache2/3d.dqtech.cloud_error.log
```

Check each layer independently:

```bash
curl -I http://127.0.0.1:9900
curl http://127.0.0.1:9900/api/v1/health
curl -I https://3d.dqtech.cloud
curl https://3d.dqtech.cloud/api/v1/health
```

Common causes of deployment failure:

- DNS does not point to the current server.
- Ports 80 or 443 are blocked by the cloud firewall or UFW.
- Apache proxy modules are not enabled.
- Port 9900 is already in use.
- A model filename in `models/catalog.json` does not match the file on disk.
- Docker cannot read the model files because of server filesystem permissions.

## Model library

Each production model lives under `models/library/<model-id>/`. The catalogue is
stored in `models/catalog.json`, and component metadata is stored beside each
model in `components.json`.

See [models/README.md](models/README.md) for instructions on adding models,
matching `modelObjectName` values to GLB nodes and configuring camera presets.

## Validation

Frontend build:

```bash
cd frontend
npm ci
npm run build
```

Backend test:

```bash
python -m unittest discover -s backend -p "test*.py"
```

Production health check:

```bash
curl --fail https://3d.dqtech.cloud/api/v1/health
```

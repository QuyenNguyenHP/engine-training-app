# Public deployment

The Docker application binds only to `127.0.0.1:8088`. Apache proxies the
public domain to that local port, so the container is not exposed directly.

DNS for `3d.dqtech.cloud` must point to this server before certificate issuance.
Run the deployment on the server:

```bash
cd /home/dq/engine-training-app
bash deploy/public.sh
```

The script asks for the server's sudo password. It rebuilds Docker, enables the
Apache vhost, validates and reloads Apache, obtains/renews a Let's Encrypt
certificate, redirects HTTP to HTTPS, then verifies the health endpoint.

Useful checks:

```bash
docker compose ps
curl -I https://3d.dqtech.cloud
curl https://3d.dqtech.cloud/api/v1/health
```

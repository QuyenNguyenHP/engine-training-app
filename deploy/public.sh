#!/usr/bin/env bash
set -euo pipefail

project_dir="/home/dq/engine-training-app"
site_name="3d.dqtech.cloud"

cd "$project_dir"
docker compose up --build -d

sudo install -m 644 "deploy/apache/$site_name.conf" "/etc/apache2/sites-available/$site_name.conf"
sudo a2ensite "$site_name.conf"
sudo apache2ctl configtest
sudo systemctl reload apache2

sudo certbot --apache --redirect --non-interactive --agree-tos -d "$site_name"

curl --fail --silent --show-error --location "https://$site_name/api/v1/health"

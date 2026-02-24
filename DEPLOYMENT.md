# Production deployment (VPS, Docker + Traefik + MariaDB)

This is a copy/paste friendly "production-like" deployment guide for a single VPS (Hostinger KVM, Ubuntu).

## What you will end up with

- **One Traefik** reverse proxy for all sites (ports `80/443`, automatic Let's Encrypt TLS)
- **One shared MariaDB** container for all sites (one DB + user per site)
- **One Next.js container per site** (this repo is one site: `natalie`)

Recommended server filesystem layout:

```
/srv/infra/traefik
/srv/infra/mariadb
/srv/apps/natalie
/srv/apps/<site2>
/srv/apps/<site3>
...
```

## Fresh start (make the VPS empty)

You already created a VPS snapshot. From here you have two clean options.

### Option A (best): reinstall the OS from Hostinger

This is the cleanest way to guarantee the VPS is empty.

1. Hostinger panel -> VPS -> Manage -> **OS / Reinstall**
2. Prefer an Ubuntu LTS (for example 24.04) if available. Non-LTS is OK, but LTS is easier to maintain long-term.
3. After reinstall, SSH back in and continue from **Section 0** below.

### Option B: wipe Docker + /srv (keeps the OS)

This removes containers, images, volumes, and the `/srv` layout.

```bash
# Stop and remove all running containers
docker ps -q | xargs -r docker stop
docker ps -aq | xargs -r docker rm -f

# Remove all images, volumes, and networks not used by containers
docker system prune -a --volumes -f

# Remove the deployment folders
sudo rm -rf /srv/*
```

Then continue from **Section 1** (hardening) or **Section 2** (Docker) below.

## 0) Before you start (DNS + ports)

1. Make sure your domain(s) A record points to your VPS public IP.
2. Make sure ports `80` and `443` are open to the internet in Hostinger firewall/security group.
3. SSH in as `root` or a sudo user:

```bash
ssh root@<VPS_IP>
```

If your local SSH shows **"REMOTE HOST IDENTIFICATION HAS CHANGED"** (common after OS reinstall / snapshot restore), remove the old key on your **local** machine and reconnect:

```bash
ssh-keygen -R <VPS_IP>
ssh root@<VPS_IP>
```

Check OS version:

```bash
cat /etc/os-release
uname -a
```

## 1) (Recommended) Basic server hardening

### 1.1 Update packages

```bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y ufw fail2ban git curl ca-certificates jq openssl
```

### 1.2 Firewall (UFW)

If you use the default SSH port 22:

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose
```

If you use a custom SSH port, allow that instead of `22/tcp`.

### 1.3 Fail2ban (basic)

On most Ubuntu installs, the defaults are already helpful. At minimum:

```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-client status
```

### 1.4 (Optional) Create a non-root deploy user

If you currently SSH as `root`, create a deploy user for day-to-day work:

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
```

Copy your SSH key (from your laptop/PC):

```bash
ssh-copy-id deploy@<VPS_IP>
```

If `ssh-copy-id` is not available (common on Windows PowerShell), use this instead (replace the `.pub` path if needed):

```powershell
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | ssh deploy@<VPS_IP> "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

Verify you can login as `deploy` before you do any SSH hardening:

```bash
ssh deploy@<VPS_IP>
sudo -v
```

From this point on, stay logged in as your non-root user (for example `deploy`). Only use `sudo` for OS-level tasks.

## 2) Docker + Docker Compose (v2)

On a fresh Ubuntu VPS, Docker is usually **not** installed by default. Install it once, then you can deploy unlimited sites via `docker compose`.

### 2.1 Check existing install

```bash
docker --version
docker compose version
sudo systemctl is-enabled docker && sudo systemctl is-active docker
```

### 2.2 Recommended: install Docker Engine from Docker's official apt repo (best)

```bash
# (Optional but recommended) remove any old/conflicting packages
sudo apt-get remove -y docker docker-engine docker.io containerd runc || true

sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list >/dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo systemctl enable --now docker
sudo systemctl is-enabled docker && sudo systemctl is-active docker

# Allow your non-root user to run docker without sudo (log out/in after this)
sudo usermod -aG docker "$USER"
newgrp docker

docker --version
docker compose version
```

### 2.3 Alternative: install via Ubuntu packages (works, but versions may lag)

On Ubuntu 24.04+ the Compose v2 package name is usually `docker-compose-v2` (not `docker-compose-plugin`).

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-v2

sudo systemctl enable --now docker
sudo systemctl is-enabled docker && sudo systemctl is-active docker

sudo usermod -aG docker "$USER"
newgrp docker

docker --version
docker compose version
```

## 3) Create shared Docker networks (one-time)

These networks are referenced by the Compose files. Create them once:

```bash
docker network inspect proxy >/dev/null 2>&1 || docker network create proxy
docker network inspect internal >/dev/null 2>&1 || docker network create internal
```

## 4) Deploy Traefik (one-time)

### 4.1 Create the Traefik folder + config

```bash
sudo mkdir -p /srv/infra/traefik
sudo chown -R "$USER":"$USER" /srv/infra/traefik
cd /srv/infra/traefik
```

Create `/srv/infra/traefik/.env`:

```bash
tee .env >/dev/null <<'EOF'
TRAEFIK_ACME_EMAIL=you@example.com
EOF
chmod 600 .env
```

Create Let's Encrypt storage (Traefik writes `acme.json` here):

```bash
mkdir -p letsencrypt
touch letsencrypt/acme.json
chmod 600 letsencrypt/acme.json
```

Create `/srv/infra/traefik/docker-compose.yml`:

```bash
tee docker-compose.yml >/dev/null <<'YAML'
services:
  traefik:
    image: traefik:v2.11
    command:
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --providers.docker.network=proxy

      - --entrypoints.web.address=:80
      - --entrypoints.web.http.redirections.entryPoint.to=websecure
      - --entrypoints.web.http.redirections.entryPoint.scheme=https

      - --entrypoints.websecure.address=:443

      - --certificatesresolvers.le.acme.email=${TRAEFIK_ACME_EMAIL}
      - --certificatesresolvers.le.acme.storage=/letsencrypt/acme.json
      - --certificatesresolvers.le.acme.httpchallenge=true
      - --certificatesresolvers.le.acme.httpchallenge.entrypoint=web

      - --log.level=INFO
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./letsencrypt:/letsencrypt
    networks:
      - proxy
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    security_opt:
      - no-new-privileges:true
    restart: unless-stopped

networks:
  proxy:
    external: true
YAML
```

### 4.2 Start Traefik

```bash
cd /srv/infra/traefik
docker compose up -d
docker compose ps
docker compose logs -n 100 --timestamps
```

Note: Traefik will not request certificates until at least one router exists (i.e., after you start your app container with domain labels).

## 5) Deploy MariaDB (one-time)

### 5.1 Create folder + env

```bash
sudo mkdir -p /srv/infra/mariadb
sudo chown -R "$USER":"$USER" /srv/infra/mariadb
cd /srv/infra/mariadb
```

Create `/srv/infra/mariadb/.env`:

```bash
tee .env >/dev/null <<'EOF'
# Required
MARIADB_ROOT_PASSWORD=change-me-root-password

# Optional: only used ON FIRST START when the data volume is empty.
# After the volume is initialized, changing these does nothing.
# MARIADB_DATABASE=example_db
# MARIADB_USER=example_user
# MARIADB_PASSWORD=example_pass
EOF
chmod 600 .env
```

Tip (generate strong passwords):

```bash
openssl rand -base64 32
```

Create `/srv/infra/mariadb/docker-compose.yml`:

```bash
tee docker-compose.yml >/dev/null <<'YAML'
services:
  mariadb:
    image: mariadb:11.4
    env_file: .env
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    volumes:
      - mariadb_data:/var/lib/mysql
    networks:
      - internal
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "mariadb-admin ping -h 127.0.0.1 -u root -p\"$${MARIADB_ROOT_PASSWORD}\" --silent",
        ]
      interval: 30s
      timeout: 5s
      retries: 5
      start_period: 30s
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    restart: unless-stopped

volumes:
  mariadb_data:

networks:
  internal:
    external: true
YAML
```

### 5.2 Start MariaDB

```bash
cd /srv/infra/mariadb
docker compose up -d
docker compose ps
docker compose logs -n 100 --timestamps
```

Wait until it is healthy:

```bash
docker compose ps
docker inspect --format='{{.State.Health.Status}}' "$(docker compose ps -q mariadb)"
```

## 6) Create database + app user (per site)

For this site (`natalie`), run:

```bash
cd /srv/infra/mariadb
set -a
source .env
set +a

DB_NAME="natalie_segal"
DB_USER="natalie_app"
DB_PASS="$(openssl rand -base64 32)"

  docker compose exec -T mariadb mariadb -u root -p"$MARIADB_ROOT_PASSWORD" <<SQL
  CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASS}';
  GRANT SELECT, INSERT, UPDATE, DELETE ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%';
  FLUSH PRIVILEGES;
  SQL

  echo "DB_NAME=$DB_NAME"
  echo "DB_USER=$DB_USER"
  echo "DB_PASSWORD=$DB_PASS"
  ```

Save the generated password (printed as `DB_PASSWORD=...`) somewhere safe and put it into the app env file as `DB_PASSWORD` (Section 8.2). Do **not** use a `DB_PASS` key in the app `.env`.

Repeat this section for every additional website (use a unique DB and user).

## 7) Import schema / data (one-time per database)

This repo includes `sql/schema.sql`. If you already have a full SQL dump (for example `natalie_segal.sql`), you can import that instead.

### 7.1 Copy SQL file(s) to the VPS

Create the destination folder first (on the VPS):

```bash
sudo mkdir -p /srv/apps/natalie
sudo chown -R "$USER":"$USER" /srv/apps/natalie
```

From your laptop/PC (in the repo root) upload the schema:

```bash
scp sql/schema.sql deploy@<VPS_IP>:/srv/apps/natalie/schema.sql
```

If you have an existing dump (example filename `natalie_segal.sql`), upload it too:

```bash
scp natalie_segal.sql deploy@<VPS_IP>:/srv/apps/natalie/natalie_segal.sql
```

### 7.2 Import into the site database

Pick **ONE**:

- **Schema only** (empty site data): import `schema.sql`.
- **Full restore** (schema + data): import your dump file (example: `natalie_segal.sql`) and **do not** import `schema.sql` first.

If you see an error like `ERROR 1050 (42S01): Table '...' already exists`, your DB is not empty (most commonly: you already imported `schema.sql`).

Recommended fix for a fresh deploy: **reset the DB**, then import the dump:

```bash
cd /srv/infra/mariadb
set -a
source .env
set +a

DB_NAME="natalie_segal"

# WARNING: this deletes ALL data in the DB
docker compose exec -T mariadb mariadb -u root -p"$MARIADB_ROOT_PASSWORD" <<SQL
DROP DATABASE IF EXISTS \`${DB_NAME}\`;
CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SQL
```

Import the schema (fast):

```bash
cd /srv/infra/mariadb
set -a
source .env
set +a
docker compose exec -T mariadb mariadb -u root -p"$MARIADB_ROOT_PASSWORD" natalie_segal < /srv/apps/natalie/schema.sql
```

Import the dump (may take time):

```bash
cd /srv/infra/mariadb
set -a
source .env
set +a
docker compose exec -T mariadb mariadb -u root -p"$MARIADB_ROOT_PASSWORD" natalie_segal < /srv/apps/natalie/natalie_segal.sql
```

If your dump file contains `CREATE DATABASE` and/or `USE natalie_segal;`, import it **without** specifying the DB on the command line:

```bash
cd /srv/infra/mariadb
set -a
source .env
set +a
docker compose exec -T mariadb mariadb -u root -p"$MARIADB_ROOT_PASSWORD" < /srv/apps/natalie/natalie_segal.sql
```

## 8) Deploy the app container (`natalie`)

### 8.1 Create the app folder + uploads

```bash
sudo mkdir -p /srv/apps/natalie/uploads
sudo chown -R "$USER":"$USER" /srv/apps/natalie
cd /srv/apps/natalie
```

Because the container runs as the `node` user (UID/GID 1000), make sure uploads is writable:

```bash
sudo chown -R 1000:1000 /srv/apps/natalie/uploads
sudo chmod -R u+rwX,g+rwX /srv/apps/natalie/uploads
```

### 8.2 Create `/srv/apps/natalie/.env`

```bash
tee .env >/dev/null <<'EOF'
# The image to run. GitHub Actions overrides this during deploy, but keep it set
# so local `docker compose` commands always work.
# IMPORTANT: replace <owner>/<repo> with your real image name.
# Example: APP_IMAGE=ghcr.io/adnanrahim110/nataliesegal:latest
# If you leave `<...>` it will fail with: "invalid reference format"
APP_IMAGE=ghcr.io/<owner>/<repo>:latest

NODE_ENV=production
PORT=3000

DB_HOST=mariadb
DB_PORT=3306
DB_USER=natalie_app
# IMPORTANT: use DB_PASSWORD (exact key name). Do NOT use DB_PASS here.
DB_PASSWORD=change-me-app-password
DB_NAME=natalie_segal
DB_CONNECTION_LIMIT=5

NEXT_PUBLIC_SITE_URL=https://natalie-segal.com
NEXT_PUBLIC_TINYMCE_API_KEY=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Natalie Segal Admin <you@gmail.com>"

# One-time admin bootstrap (ONLY for a brand new empty DB):
# - set a strong random value
# - create the first admin (Section 8.5)
# - then REMOVE this value and restart the app
BOOTSTRAP_TOKEN=
EOF
chmod 600 .env
```

### 8.3 Create `/srv/apps/natalie/docker-compose.yml`

```bash
tee docker-compose.yml >/dev/null <<'YAML'
services:
  natalie:
    image: ${APP_IMAGE}
    env_file: .env
    networks:
      - proxy
      - internal
    init: true
    volumes:
      - ./uploads:/app/public/uploads
    healthcheck:
      test:
        [
          "CMD",
          "node",
          "-e",
          "const http=require('http');const get=(p)=>new Promise((res,rej)=>{const req=http.get('http://127.0.0.1:3000'+p,(r)=>{r.resume();res(r.statusCode);});req.on('error',rej);req.setTimeout(4000,()=>req.destroy(new Error('timeout')));});(async()=>{try{const s=await get('/api/healthz');if(s===200)process.exit(0);if(s!==404)process.exit(1);}catch(e){};try{const s2=await get('/');process.exit(s2===200?0:1);}catch(e){process.exit(1);}})();",
        ]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 20s
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    labels:
      - traefik.enable=true
      - traefik.http.routers.natalie.rule=Host(`natalie-segal.com`)
      - traefik.http.routers.natalie.entrypoints=websecure
      - traefik.http.routers.natalie.tls.certresolver=le
      - traefik.http.services.natalie.loadbalancer.server.port=3000

      - traefik.http.routers.natalie-www.rule=Host(`www.natalie-segal.com`)
      - traefik.http.routers.natalie-www.entrypoints=websecure
      - traefik.http.routers.natalie-www.tls.certresolver=le
      - traefik.http.routers.natalie-www.service=natalie
      - traefik.http.routers.natalie-www.middlewares=natalie-www-redirect
      - traefik.http.middlewares.natalie-www-redirect.redirectregex.regex=^https?://www\\.natalie-segal\\.com/(.*)
      - traefik.http.middlewares.natalie-www-redirect.redirectregex.replacement=https://natalie-segal.com/$${1}
      - traefik.http.middlewares.natalie-www-redirect.redirectregex.permanent=true
    restart: unless-stopped

networks:
  proxy:
    external: true
  internal:
    external: true
YAML
```

### 8.4 Pull and start the app

If your GHCR package is private, login first:

```bash
echo "<GHCR_TOKEN>" | docker login ghcr.io -u "<GHCR_USERNAME>" --password-stdin
```

Start:

```bash
cd /srv/apps/natalie
docker compose config >/dev/null
docker compose pull
docker compose up -d --remove-orphans
docker compose ps
docker compose logs -n 200 --timestamps
```

Wait for health:

```bash
docker inspect --format='{{.State.Health.Status}}' "$(docker compose ps -q natalie)"
```

Test through your domain (after DNS is pointing):

```bash
curl -fsS https://natalie-segal.com/api/healthz
```

### 8.5 Create the first admin user (one-time bootstrap)

For a brand new database, there are no users yet. This app provides a one-time bootstrap endpoint:

- URL: `POST /api/admin/bootstrap`
- It only works when `BOOTSTRAP_TOKEN` is set in the app `.env`
- It refuses to run if any user already exists

1) Set a strong bootstrap token in `/srv/apps/natalie/.env`:

```bash
cd /srv/apps/natalie
BOOTSTRAP_TOKEN="$(openssl rand -base64 32)"
sed -i "s|^BOOTSTRAP_TOKEN=.*|BOOTSTRAP_TOKEN=${BOOTSTRAP_TOKEN}|" .env
echo "BOOTSTRAP_TOKEN=$BOOTSTRAP_TOKEN"
docker compose up -d
```

2) Create the admin user (run from your PC or from the VPS):

```bash
curl -fsS -X POST "https://natalie-segal.com/api/admin/bootstrap" \
  -H "Content-Type: application/json" \
  -H "x-bootstrap-token: ${BOOTSTRAP_TOKEN}" \
  -d '{"email":"admin@example.com","password":"use-a-strong-password-12+","name":"Admin"}'
```

If TLS is not issued yet and you are still seeing a self-signed cert, temporarily add `-k` (insecure) just to complete bootstrap, then fix TLS immediately:

```bash
curl -kfsS -X POST "https://natalie-segal.com/api/admin/bootstrap" \
  -H "Content-Type: application/json" \
  -H "x-bootstrap-token: ${BOOTSTRAP_TOKEN}" \
  -d '{"email":"admin@example.com","password":"use-a-strong-password-12+","name":"Admin"}'
```

3) Immediately remove the token (disables bootstrap) and restart:

```bash
cd /srv/apps/natalie
sed -i "s|^BOOTSTRAP_TOKEN=.*|BOOTSTRAP_TOKEN=|" .env
docker compose up -d
```

Now login at:

- `https://natalie-segal.com/admin/login`

## 9) CI/CD (GitHub Actions) - exact setup

This repo includes `.github/workflows/deploy.yml` which:

- Builds and pushes an image to GHCR on every push to `main`
- SSHes to the VPS and runs `docker compose pull/up` in your app folder
- Waits for container health
- Prunes only older images (keeps recent for rollback)

### 9.1 Create an SSH key for GitHub Actions (on your laptop/PC)

```bash
ssh-keygen -t ed25519 -C "github-actions@natalie" -f natalie_actions_key
```

Copy public key to the VPS (recommended: use the `deploy` user if you created it):

```bash
ssh-copy-id -i natalie_actions_key.pub deploy@<VPS_IP>
```

If `ssh-copy-id` is not available (Windows PowerShell), run:

```powershell
Get-Content .\natalie_actions_key.pub | ssh deploy@<VPS_IP> "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

Test the key works (should print `ok`):

```bash
ssh -i natalie_actions_key deploy@<VPS_IP> "echo ok"
```

### 9.2 Add GitHub repository secrets

In GitHub: `Repo → Settings → Secrets and variables → Actions → Secrets`

If the arrows look broken, the path is: `Repo -> Settings -> Secrets and variables -> Actions -> Secrets`

- `VPS_HOST` = `<VPS_IP or hostname>`
- `VPS_USER` = `deploy` (or `root`)
- `VPS_PORT` = `22` (or your SSH port)
- `VPS_SSH_KEY` = contents of `natalie_actions_key` (PRIVATE key)
- `DEPLOY_PATH` = `/srv/apps/natalie`
- `GHCR_USERNAME` = your GitHub username (or org) (optional if the package is public)
- `GHCR_TOKEN` = a GitHub PAT with `read:packages` (optional if the package is public)

### 9.3 Add GitHub repository variables (build args)

In GitHub: `Repo → Settings → Secrets and variables → Actions → Variables`

If the arrows look broken, the path is: `Repo -> Settings -> Secrets and variables -> Actions -> Variables`

- `NEXT_PUBLIC_SITE_URL` = `https://natalie-segal.com`
- `NEXT_PUBLIC_TINYMCE_API_KEY` = your TinyMCE public key (optional)

### 9.4 First deploy

Push to `main`. In GitHub Actions, watch the `build-and-deploy` workflow.

On the VPS, confirm:

```bash
cd /srv/apps/natalie
docker compose ps
docker compose logs -n 200 --timestamps
```

## 10) Backups (highly recommended)

### 10.1 Database dumps (daily)

Create a backup folder:

```bash
sudo mkdir -p /srv/backups/mariadb
sudo chmod 700 /srv/backups/mariadb
```

Create `/usr/local/bin/backup-mariadb-natalie.sh`:

```bash
sudo tee /usr/local/bin/backup-mariadb-natalie.sh >/dev/null <<'SH'
#!/usr/bin/env bash
set -euo pipefail

cd /srv/infra/mariadb
set -a
source .env
set +a

ts="$(date +%F_%H%M%S)"
out="/srv/backups/mariadb/natalie_segal_${ts}.sql.gz"

docker compose exec -T mariadb mariadb-dump \
  -u root -p"$MARIADB_ROOT_PASSWORD" \
  --single-transaction --quick \
  natalie_segal | gzip -c > "$out"

# Keep 14 days
find /srv/backups/mariadb -type f -name '*.sql.gz' -mtime +14 -delete
SH
sudo chmod 700 /usr/local/bin/backup-mariadb-natalie.sh
```

Test it:

```bash
sudo /usr/local/bin/backup-mariadb-natalie.sh
ls -lh /srv/backups/mariadb | tail
```

Schedule it (daily at 02:15):

```bash
sudo tee /etc/cron.d/backup-mariadb-natalie >/dev/null <<'CRON'
15 2 * * * root /usr/local/bin/backup-mariadb-natalie.sh >/var/log/backup-mariadb-natalie.log 2>&1
CRON
```

### 10.2 Uploads backup (daily)

```bash
sudo mkdir -p /srv/backups/uploads
sudo chmod 700 /srv/backups/uploads

sudo tee /usr/local/bin/backup-uploads-natalie.sh >/dev/null <<'SH'
#!/usr/bin/env bash
set -euo pipefail

ts="$(date +%F_%H%M%S)"
out="/srv/backups/uploads/natalie_uploads_${ts}.tar.gz"

tar -C /srv/apps/natalie -czf "$out" uploads

find /srv/backups/uploads -type f -name '*.tar.gz' -mtime +14 -delete
SH
sudo chmod 700 /usr/local/bin/backup-uploads-natalie.sh

sudo tee /etc/cron.d/backup-uploads-natalie >/dev/null <<'CRON'
30 2 * * * root /usr/local/bin/backup-uploads-natalie.sh >/var/log/backup-uploads-natalie.log 2>&1
CRON
```

Important: keep copies off the VPS (S3/Backblaze/etc.). Local backups alone don't protect against disk failure.

## 11) Adding 4 more websites (repeatable)

For each new website:

1. Create a folder:

```bash
sudo mkdir -p /srv/apps/<site>/uploads
```

2. Create DB + user (Section 6) with a new `DB_NAME`, `DB_USER`, `DB_PASS`.
3. Apply schema (Section 7) for that DB.
4. Create `/srv/apps/<site>/.env` and `/srv/apps/<site>/docker-compose.yml` (copy the `natalie` pattern).
5. Start it:

```bash
cd /srv/apps/<site>
docker compose pull
docker compose up -d --remove-orphans
```

### 11.1 Resource guardrails (recommended)

To prevent one site from exhausting the VPS, set conservative defaults per app:

- Keep `DB_CONNECTION_LIMIT=3` to `5` per app
- Optionally cap container CPU/memory

Example (add under the app service in `/srv/apps/<site>/docker-compose.yml`):

```yaml
    cpus: "0.50"
    mem_limit: 512m
```

If the app gets traffic spikes, raise these limits.

### 11.2 Disk guardrails (recommended)

Docker images and logs can slowly fill disk if you never prune.

You already have per-container log rotation in the Compose templates. Also run a weekly prune:

```bash
sudo tee /etc/cron.d/docker-prune-weekly >/dev/null <<'CRON'
# Prune unused images/containers/networks weekly (keeps volumes)
0 4 * * 0 root /usr/bin/docker image prune -f --filter "until=168h" >/var/log/docker-prune.log 2>&1
CRON
```

## 12) Useful ops commands

```bash
docker stats --no-stream

cd /srv/apps/natalie
docker compose ps
docker compose logs -n 200 --timestamps

cd /srv/infra/traefik
docker compose logs -n 200 --timestamps

cd /srv/infra/mariadb
docker compose ps
docker compose logs -n 200 --timestamps
```

If a site is unhealthy:

```bash
cd /srv/apps/natalie
docker inspect --format='{{json .State.Health}}' "$(docker compose ps -q natalie)" | jq .
```

## 13) Rollbacks (quick)

### 13.1 Roll back manually on the VPS

List images you have locally:

```bash
docker images --format 'table {{.Repository}}\t{{.Tag}}\t{{.CreatedSince}}' | head -n 40
```

Edit `/srv/apps/natalie/.env` and set `APP_IMAGE` to a previous known-good tag (for example the old commit SHA tag), then:

```bash
cd /srv/apps/natalie
docker compose pull
docker compose up -d --remove-orphans
```

### 13.2 Roll back via GitHub Actions

Because the workflow tags images with the commit SHA, you can redeploy an older version by running the workflow for that commit/branch (GitHub UI: Actions → build-and-deploy → Run workflow).

## 14) Troubleshooting

### 14.1 TLS/Let's Encrypt not issuing

Check DNS points to the VPS:

```bash
getent hosts natalie-segal.com
getent hosts www.natalie-segal.com
```

If you see an IPv6 (AAAA) record but your VPS does not have IPv6, remove the AAAA record (Let's Encrypt may try IPv6 first and fail):

```bash
getent ahosts natalie-segal.com
```

Check that port 80 is reachable from the internet (run from your laptop/PC):

```bash
curl -I http://natalie-segal.com
```

Check ports 80/443 are listening:

```bash
sudo ss -ltnp | grep -E ':80|:443' || true
```

Check Traefik logs (look for `acme` errors):

```bash
cd /srv/infra/traefik
docker compose logs -n 300 --timestamps | grep -i acme || true
```

Check that Traefik can write its cert store:

```bash
ls -l /srv/infra/traefik/letsencrypt/acme.json
```

### 14.2 App container is unhealthy

```bash
cd /srv/apps/natalie
docker compose ps
docker compose logs -n 300 --timestamps
docker inspect --format='{{json .State.Health}}' "$(docker compose ps -q natalie)" | jq .
```

### 14.3 App cannot connect to DB

Confirm MariaDB is healthy:

```bash
cd /srv/infra/mariadb
docker compose ps
docker compose logs -n 200 --timestamps
```

Confirm the app env matches the DB you created:

```bash
cd /srv/apps/natalie
grep -E '^(DB_HOST|DB_PORT|DB_USER|DB_NAME)=' .env
```

### 14.4 `docker compose` says a variable is not set

Most commonly: `APP_IMAGE` is missing.

```bash
cd /srv/apps/natalie
grep '^APP_IMAGE=' .env
```

### 14.5 Bootstrap endpoint not working

- If it returns `404`: `BOOTSTRAP_TOKEN` is not set in the app `.env` (Section 8.5).
- If it returns `401`: `x-bootstrap-token` does not match `BOOTSTRAP_TOKEN`.
- If it returns `409`: a user already exists (bootstrap is intentionally disabled).

### 14.6 `open .../.env: permission denied`

This happens when `.env` is owned by `root` with `chmod 600` (often from using `sudo tee`).

Recommended fix (make the stack folder owned by your deploy user):

```bash
sudo chown -R "$USER":"$USER" /srv/infra/traefik /srv/infra/mariadb /srv/apps/natalie
chmod 600 /srv/infra/traefik/.env /srv/infra/mariadb/.env /srv/apps/natalie/.env
```

If you intentionally want root-owned env files, then run **every** docker/compose command with `sudo` (including commands inside `$()`).

## 15) (Optional) systemd units for Compose stacks

Docker restart policies are usually enough, but systemd units can make reboots and ops more predictable.

Example for Traefik:

```bash
sudo tee /etc/systemd/system/traefik-compose.service >/dev/null <<'UNIT'
[Unit]
Description=Traefik (Docker Compose)
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/srv/infra/traefik
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable --now traefik-compose.service
sudo systemctl status --no-pager traefik-compose.service
```

Repeat the same pattern for `/srv/infra/mariadb` and `/srv/apps/natalie` if you want.

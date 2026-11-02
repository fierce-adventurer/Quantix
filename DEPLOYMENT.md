# Quantix Deployment Guide

This guide details the complete deployment setup for Quantix on a remote Linux server (Ubuntu 22.04 / 24.04 LTS), containerized using Docker, Docker Compose, and automated via GitHub Actions CI/CD.

---

## 1. Architecture Overview

- **Frontend Container**: Nginx Alpine serving the React + Vite SPA on port 80, routing API calls via reverse proxy to `/api/` on the backend container.
- **Backend Container**: Spring Boot 3.3.5 on Eclipse Temurin Java 21 runtime exposing port 8080 with health checks on `/api/health`.
- **Database**: Neon Serverless PostgreSQL with PgBouncer connection pooling.

---

## 2. Server Prerequisites

On your target cloud instance (AWS EC2, DigitalOcean Droplet, Hetzner, or Linode):

1. **Install Docker & Docker Compose**:
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER
```

2. **Prepare Target Directory**:
```bash
sudo mkdir -p /opt/quantix
sudo chown -R $USER:$USER /opt/quantix
```

---

## 3. GitHub Actions CI/CD Setup

In your GitHub repository settings under **Settings > Secrets and variables > Actions**, add the following repository secrets:

| Secret Name | Description | Example |
|---|---|---|
| `SERVER_HOST` | Public IP or DNS of the remote server | `198.51.100.1` or `api.yourdomain.com` |
| `SERVER_USER` | SSH user on the remote server | `ubuntu` or `deploy` |
| `SERVER_SSH_KEY` | Private SSH Key (ed25519 or rsa) with access to server | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SERVER_PORT` | SSH Port (optional, defaults to 22) | `22` |
| `DATABASE_URL` | Neon PostgreSQL connection string (pooler) | `jdbc:postgresql://ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `DATABASE_USERNAME` | Neon PostgreSQL user | `neondb_owner` |
| `DATABASE_PASSWORD` | Neon PostgreSQL password | `npg_secret123` |
| `JWT_SECRET` | 256-bit Hex JWT signing key | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
| `JWT_EXPIRATION` | Token validity in milliseconds | `86400000` |
| `VITE_API_URL` | Base API URL for frontend (leave blank for relative `/api`) | `` |

Whenever a push occurs on the `main` branch:
1. `build-and-test` verifies all Java integration tests and builds the frontend bundle.
2. `deploy` connects via SSH to `/opt/quantix`, pulls the latest commits, populates `.env`, and builds and launches the containers with zero downtime.

---

## 4. Manual Deployment

To run manually on the server without GitHub Actions:

```bash
git clone https://github.com/fierce-adventurer/Quantix.git /opt/quantix
cd /opt/quantix

cp .env.example .env
nano .env

docker compose up -d --build
```

---

## 5. Domain & HTTPS / SSL Configuration

For public internet deployment with Let's Encrypt SSL, configure host Nginx or Caddy:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

Configure `/etc/nginx/sites-available/quantix`:
```nginx
server {
    server_name quantix.yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and obtain certificate:
```bash
sudo ln -s /etc/nginx/sites-available/quantix /etc/nginx/sites-enabled/
sudo certbot --nginx -d quantix.yourdomain.com
```

---

## 6. Verification & Troubleshooting

Check running containers:
```bash
docker compose ps
```

View application logs:
```bash
docker compose logs -f backend
docker compose logs -f frontend
```

Check backend health check:
```bash
curl -f http://localhost:8080/api/health
```

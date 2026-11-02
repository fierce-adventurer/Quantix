# Quantix Production Deployment Guide

This guide details the modern production deployment setup for Quantix:
- **Frontend**: Deployed directly to **Vercel** via GitHub integration with automatic preview and production deployments.
- **Backend**: Containerized in a lightweight **Alpine Linux Java 21** image orchestrated with Docker Compose on your cloud server (Ubuntu 22.04 / 24.04 LTS).
- **Database**: **Neon Serverless PostgreSQL** with connection pooling.
- **CI/CD**: **GitHub Actions** for automated testing and server deployment.

---

## 1. Frontend Deployment (Vercel)

Deploying the frontend on Vercel takes advantage of edge caching, instant rollbacks, and built-in global CDN.

1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New... > Project** and import the `Quantix` repository.
3. Configure the Project Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   - `VITE_API_URL`: `https://api.yourdomain.com` (Your backend server domain or public IP)
5. Click **Deploy**. Vercel will automatically configure SPA rewrites via `frontend/vercel.json`.

---

## 2. Backend Server Deployment (Docker Compose)

### Server Prerequisites

On your cloud instance (Ubuntu 22.04 or 24.04 LTS):

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

Prepare deployment directory:
```bash
sudo mkdir -p /opt/quantix
sudo chown -R $USER:$USER /opt/quantix
```

### Manual Backend Launch

```bash
git clone https://github.com/fierce-adventurer/Quantix.git /opt/quantix
cd /opt/quantix

cp .env.example .env
nano .env

docker compose up -d --build
```

---

## 3. GitHub Actions Automated CI/CD

In your GitHub repository settings under **Settings > Secrets and variables > Actions**, add the following repository secrets:

| Secret Name | Description | Example |
|---|---|---|
| `SERVER_HOST` | Server IP or hostname | `198.51.100.1` or `api.yourdomain.com` |
| `SERVER_USER` | SSH user | `ubuntu` or `deploy` |
| `SERVER_SSH_KEY` | Private SSH Key (ed25519/rsa) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SERVER_PORT` | SSH Port (optional, defaults to 22) | `22` |
| `DATABASE_URL` | Neon PostgreSQL connection string (pooler) | `jdbc:postgresql://ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `DATABASE_USERNAME` | Neon PostgreSQL user | `neondb_owner` |
| `DATABASE_PASSWORD` | Neon PostgreSQL password | `npg_secret123` |
| `JWT_SECRET` | 256-bit Hex JWT signing key | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
| `JWT_EXPIRATION` | Token validity in milliseconds | `86400000` |

Whenever code is pushed to `main`:
1. `build-and-test` verifies all backend tests and ensures the frontend compiles cleanly.
2. `deploy` connects to your remote server via SSH, pulls updates, updates `.env`, and launches the lightweight backend container.
3. Vercel automatically deploys the frontend from the push.

---

## 4. HTTPS & Domain Setup for Backend API

To enable HTTPS on your backend API (`https://api.yourdomain.com`):

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

Configure `/etc/nginx/sites-available/quantix-api`:
```nginx
server {
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site and acquire SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/quantix-api /etc/nginx/sites-enabled/
sudo certbot --nginx -d api.yourdomain.com
```

---

## 5. Operations & Health Verification

Check container status:
```bash
docker compose ps
```

View live logs:
```bash
docker compose logs -f backend
```

Check health status:
```bash
curl -f http://localhost:8080/api/health
```

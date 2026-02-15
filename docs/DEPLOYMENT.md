# Despliegue — Runbook mínimo

Target recomendado: VPS + PM2 + Nginx

## Variables por stage
- Definir `.env` desde `.env.example` en cada entorno (local, staging, prod)
- No subir secretos al repo

## Build y arranque
```
# instalar dependencias (reproducible)
npm ci

# construir
cd apps/web
npm ci
npm run build

# arrancar
npm run start
```

## PM2 (Node 20)
```
pm2 start npm --name web -- start --prefix apps/web
pm2 save
pm2 status
```

## Nginx (reverse proxy)
- Proxy a `http://127.0.0.1:3000`
- SSL con Let’s Encrypt (certbot)

## Docker (opcional)
- Crear Dockerfile multi-stage (build + runtime)
- docker-compose.yml con servicio `web` si aplica
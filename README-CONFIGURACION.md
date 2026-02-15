# Configuración de Trader Deportivo - PostgreSQL y Docker

## 🚀 Inicio Rápido

### 1. Iniciar Servicios con Docker

```bash
# Iniciar todos los servicios (PostgreSQL, Redis, PgAdmin)
npm run docker:up

# Verificar que los servicios estén corriendo
npm run docker:logs
```

### 2. Configuración de Base de Datos

```bash
# Inicializar la base de datos con el esquema y datos demo
npm run db:init

# Si necesitas reiniciar la base de datos
npm run db:reset
```

### 3. Instalar Dependencias

```bash
# Instalar todas las dependencias del proyecto
npm install

# Instalar dependencias específicas de la app web
cd apps/web && npm install
```

### 4. Iniciar la Aplicación

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm run start:prod
```

## 📋 Puertos de Servicios

| Servicio | Puerto Local | Puerto Docker | Descripción |
|----------|-------------|---------------|-------------|
| PostgreSQL | 5435 | 5432 | Base de datos principal |
| Redis | 6380 | 6379 | Cache y sesiones |
| PgAdmin | 5055 | 80 | Administrador de BD |
| Next.js App | 3000 | - | Aplicación web |

## 🔐 Acceso a Servicios

### PostgreSQL
- **Host**: localhost:5435
- **Database**: traderdeportivo
- **Usuario**: trader_admin
- **Password**: TraderSecure2024!

### PgAdmin
- **URL**: http://localhost:5055
- **Email**: admin@traderdeportivo.co
- **Password**: AdminTrader2024!

### Conexión a BD desde aplicación
```javascript
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://trader_admin:TraderSecure2024!@localhost:5435/traderdeportivo'
});
```

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

1. **users** - Usuarios del sistema (admin, tipster, user)
2. **tipster_profiles** - Perfiles específicos de tipsters
3. **wallets** - Billeteras de usuarios
4. **signals** - Señales/picks de tipsters
5. **subscriptions** - Suscripciones de usuarios a tipsters
6. **followers** - Seguidores de tipsters
7. **transactions** - Transacciones financieras
8. **audit_logs** - Registro de auditoría

## 🔧 Comandos Útiles de Docker

```bash
# Ver contenedores activos
docker ps

# Ver logs de un servicio específico
docker logs trader-deportivo-db
docker logs trader-deportivo-redis
docker logs trader-deportivo-pgadmin

# Acceder a la consola de PostgreSQL
docker exec -it trader-deportivo-db psql -U trader_admin -d traderdeportivo

# Acceder a la consola de Redis
docker exec -it trader-deportivo-redis redis-cli

# Detener y eliminar todo
docker-compose down -v
```

## 🚨 Solución de Problemas

### Puerto en uso
Si algún puerto ya está en uso, modifica el archivo `docker-compose.yml`:

```yaml
ports:
  - "5436:5432"  # Cambia 5435 por otro puerto disponible
```

### Contenedor no inicia
```bash
# Verificar logs
docker-compose logs postgres-trader

# Reiniciar servicio específico
docker-compose restart postgres-trader
```

### Conexión a BD falla
1. Verifica que PostgreSQL esté corriendo: `docker ps`
2. Comprueba los logs: `docker logs trader-deportivo-db`
3. Asegúrate de que el puerto 5435 esté libre
4. Verifica las credenciales en `.env.local`

## 📊 Monitoreo

### PostgreSQL
- Usa PgAdmin en http://localhost:5055
- Credenciales en `CREDENCIALES-PRODUCCION.md`

### Redis
```bash
# Monitor en tiempo real
docker exec -it trader-deportivo-redis redis-cli monitor

# Estadísticas
docker exec -it trader-deportivo-redis redis-cli info
```

## 🔒 Seguridad

⚠️ **Importante**: 
- Cambia todas las contraseñas por defecto antes de producción
- Usa variables de entorno para credenciales sensibles
- Habilita SSL/TLS en producción
- Implementa backups automáticos
- Configura firewall adecuadamente

## 📁 Archivos de Configuración

- `docker-compose.yml` - Configuración de servicios Docker
- `.env.local` - Variables de entorno
- `init.sql` - Esquema y datos iniciales de BD
- `CREDENCIALES-PRODUCCION.md` - Credenciales de producción

## 🆘 Soporte

Para problemas con la configuración:
1. Verifica los logs de Docker
2. Comprueba que los puertos estén libres
3. Asegúrate de tener Docker y Docker Compose instalados
4. Revisa la documentación en `CREDENCIALES-PRODUCCION.md`
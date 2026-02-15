# Script de configuración de Docker para Trader Deportivo
# Este script configura PostgreSQL, Redis y PgAdmin con puertos que no conflictúan

Write-Host "🚀 Configurando Trader Deportivo con Docker..." -ForegroundColor Green

# Verificar si Docker está corriendo
try {
    docker info | Out-Null
    Write-Host "✅ Docker está corriendo correctamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está corriendo. Por favor inicia Docker Desktop primero." -ForegroundColor Red
    exit 1
}

# Iniciar servicios Docker
Write-Host "📦 Iniciando servicios Docker..." -ForegroundColor Yellow
Write-Host "PostgreSQL en puerto 5435" -ForegroundColor Cyan
Write-Host "Redis en puerto 6380" -ForegroundColor Cyan
Write-Host "PgAdmin en puerto 5055" -ForegroundColor Cyan

docker-compose up -d

# Esperar a que los servicios estén listos
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar estado de los contenedores
Write-Host "🔍 Verificando estado de contenedores..." -ForegroundColor Yellow
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Inicializar base de datos
Write-Host "🗄️ Inicializando base de datos..." -ForegroundColor Yellow
$initScript = Get-Content -Path "init-basic.sql" -Raw
docker exec -i trader-deportivo-db psql -U trader_admin -d traderdeportivo -c "$initScript"

# Verificar conexión a base de datos
Write-Host "🔍 Verificando conexión a base de datos..." -ForegroundColor Yellow
try {
    docker exec trader-deportivo-db psql -U trader_admin -d traderdeportivo -c "SELECT COUNT(*) as total_users FROM users;"
    Write-Host "✅ Base de datos inicializada correctamente" -ForegroundColor Green
} catch {
    Write-Host "⚠️  La base de datos ya estaba inicializada" -ForegroundColor Yellow
}

# Verificar Redis
Write-Host "🔍 Verificando Redis..." -ForegroundColor Yellow
$redisResponse = docker exec trader-deportivo-redis redis-cli ping
if ($redisResponse -eq "PONG") {
    Write-Host "✅ Redis está funcionando correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ Redis no responde correctamente" -ForegroundColor Red
}

# Mostrar información de acceso
Write-Host ""
Write-Host "🎉 ¡Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Información de acceso:" -ForegroundColor Cyan
Write-Host "PostgreSQL: localhost:5435" -ForegroundColor White
Write-Host "  - Usuario: trader_admin" -ForegroundColor White
Write-Host "  - Contraseña: TraderSecure2024!" -ForegroundColor White
Write-Host "  - Base de datos: traderdeportivo" -ForegroundColor White
Write-Host ""
Write-Host "Redis: localhost:6380" -ForegroundColor White
Write-Host ""
Write-Host "PgAdmin: http://localhost:5055" -ForegroundColor White
Write-Host "  - Email: admin@traderdeportivo.co" -ForegroundColor White
Write-Host "  - Contraseña: AdminTrader2024!" -ForegroundColor White
Write-Host ""
Write-Host "👥 Cuentas de usuario:" -ForegroundColor Cyan
Write-Host "Admin: admin@traderdeportivo.co / AdminTD!2024" -ForegroundColor White
Write-Host "Usuario: usuario@traderdeportivo.co / UserTD!2024" -ForegroundColor White
Write-Host "Tipster: tipster@traderdeportivo.co / TipsterTD!2024" -ForegroundColor White
Write-Host ""
Write-Host "📚 Comandos útiles:" -ForegroundColor Cyan
Write-Host "Ver logs: docker-compose logs -f" -ForegroundColor White
Write-Host "Detener servicios: docker-compose down" -ForegroundColor White
Write-Host "Reiniciar: docker-compose restart" -ForegroundColor White
Write-Host "Acceder a BD: docker exec -it trader-deportivo-db psql -U trader_admin -d traderdeportivo" -ForegroundColor White
Write-Host ""
Write-Host "🚀 ¡Listo para usar!" -ForegroundColor Green
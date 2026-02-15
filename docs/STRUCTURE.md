# Estructura de Rutas y Reglas (Next.js App Router)

Estado: congelado

## Route Groups Permitidos
- (marketing)
- (auth)
- (dashboard)

## Prohibiciones
- Prohibido crear `src/app/(app)`
- Prohibido tener `apps/web/app` fuera de `apps/web/src/app`
- Prohibido duplicar grupos o carpetas de app fuera de `src/app`

## Rutas definitivas
- /login (user+tipster)
- /admin/login (solo admin)
- /user (dashboard usuario)
- /tipster (dashboard tipster)
- /admin (dashboard admin)

## Ubicación de App Router
- Solo en: `apps/web/src/app`
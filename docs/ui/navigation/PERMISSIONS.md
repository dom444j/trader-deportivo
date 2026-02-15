# Permisos (RBAC/Scopes) – traderdeportivo.co

## Scopes (MVP ampliado)

Core lectura
- signals:read
- bets:read
- wallet:read
- tipsters:read

Acciones usuario
- bets:place
- wallet:deposit
- wallet:withdraw
- subscriptions:create
- subscriptions:patch
- tipsters:follow
- risk:profile:read
- risk:profile:patch

Tipster
- signals:create
- signals:patch
- signals:settle
- tipster:profile:patch
- tipster:followers:read
- wallet:read

Admin
- admin:users:block
- admin:tipsters:block
- compliance:rules:read
- compliance:rules:write
- alerts:ack
- audit:read
- risk:override

Community
- community:read
- community:write
- community:moderate

Support
- support:read
- support:write
- support:manage

Credits (opcional fino)
- credits:read
- credits:purchase
- credits:spend

## Mapeo rol → scopes (MVP)
- USER: [signals:read, tipsters:read, bets:read, wallet:read, bets:place, wallet:deposit, wallet:withdraw, subscriptions:create, subscriptions:patch, tipsters:follow, risk:profile:read, risk:profile:patch, community:read, community:write, support:read, support:write, credits:read, credits:purchase, credits:spend]
- TIPSTER: [signals:read, tipsters:read, wallet:read, signals:create, signals:patch, signals:settle, tipster:profile:patch, tipster:followers:read, community:read, community:write, support:read, support:write]
- ADMIN: [signals:read, tipsters:read, bets:read, wallet:read, admin:users:block, admin:tipsters:block, compliance:rules:read, compliance:rules:write, alerts:ack, audit:read, risk:override, community:read, community:moderate, support:read, support:manage]

## Acceso por rutas (ejemplos)
- /risk: USER [risk:profile:read], PATCH requiere [risk:profile:patch]
- /tipster/signals/new: TIPSTER [signals:create]
- /admin/compliance: ADMIN [compliance:rules:read] y acciones [compliance:rules:write]
- /wallet: USER/TIPSTER [wallet:read]; depósitos/retiros requieren [wallet:deposit]/[wallet:withdraw]
- /community/discussions: USER/TIPSTER [community:read]; crear/participar requiere [community:write]
- /admin/community: ADMIN [community:moderate]
- /support: USER/TIPSTER [support:read]; crear ticket requiere [support:write]  <!-- no visible en landing; solo dentro del dashboard -->
- /admin/support: ADMIN [support:manage]
- /premium/credits: USER [credits:read]; compra/gasto requieren [credits:purchase]/[credits:spend]

Notas:
- Los scopes se incluyen en el token JWT; middleware valida por ruta/acción.
- El diseño permite futuros roles finos (moderadores, analistas) sin romper el contrato.
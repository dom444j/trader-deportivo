# Rutas (Pages Router) – traderdeportivo.co

Nota: Estas rutas reflejan 1:1 los tres sidebars finales. Aunque algunas pantallas sean Fase 2, igualmente deben existir como placeholders en el router.

## Usuario
- /dashboard
- /agents                          # Agents Hub — ver agents-hub.md
- /signals                         # Signals Market
- /signals/pre                     # Opcional: listado PRE
- /signals/live                    # Opcional: listado LIVE
- /trader-master                   # Trader Master (convención elegida)
- /portfolio                       # Smart Portfolio (si se mantiene)
- /bankroll                        # Bankroll & Accounting
- /watchlist                       # Watchlist
- /risk                            # Risk Alerts + Risk Guard UI
- /premiumhub/plans                   # Planes
- /premiumhub/credits                 # Créditos
- /premiumhub/promotions              # Promociones
- /community/leaderboard           # Leaderboard
- /community/discussions           # Discussions
- /community/following             # Following
- /support                         # Soporte (no visible en landing; solo en dashboard)
- /coach                           # Trading Coach / AI Assistant
- /stats                           # My Stats
- /referrals                       # Referidos
- /settings                        # Configuración

## Tipster
- /tipster/dashboard               # Estado rápido (o /tipster/status)
- /tipster/signals                 # Mis señales
- /tipster/signals/new             # Crear señal
- /tipster/settlements             # Liquidaciones (si se separa)
- /tipster/subscribers             # Suscriptores
- /tipster/wallet                  # Billetera & ingresos
- /tipster/profile                 # Perfil profesional
- /tipster/support                 # Soporte (si atiende tickets)
- /tipster/settings                # Configuración del Tipster

## Admin
- /admin                           # Dashboard Ejecutivo
- /admin/users                     # Gestión de Usuarios
- /admin/tipsters                  # Gestión de Tipsters
- /admin/signals                   # Señales (moderación/monitoring)
- /admin/bets                      # Apuestas (monitoring)
- /admin/subscriptions             # Suscripciones
- /admin/credits                   # Créditos
- /admin/referrals                 # Referidos
- /admin/community                 # Comunidad (moderación)
- /admin/support                   # Soporte
- /admin/alerts                    # Alertas
- /admin/compliance                # Compliance & Riesgos
- /admin/finance                   # Finanzas & Tesorería
- /admin/audit                     # Auditoría
- /admin/analytics                 # Analytics y Reportes
- /admin/trading-coach             # Trading Coach AI
- /admin/risk-guard                # Risk Guard - Protección de Capital
- /admin/agents-hub                # Agents Hub - Gestión de Agentes

Notas:
- Pages Router confirmado (directorio pages/ en la app web).
- Trader Master vive en /trader-master (se elimina duplicado /signals/master).
- Las rutas “opcional” pueden activarse en Fase 2; se mantienen como placeholders en el router para consistencia con el sidebar.
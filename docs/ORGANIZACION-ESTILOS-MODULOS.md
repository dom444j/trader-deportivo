# ORGANIZACIÓN DE ESTILOS POR MÓDULOS (App Dashboard)

Este documento define cómo organizar los estilos del área interna (dashboard/app) para los tres roles: Admin, Usuarios y Tipsters. No afecta a Marketing (landing pages), ni a Auth (login usuarios, login admin, registro). El alcance se limita a App Router (grupo `(app)`).

## Alcance y no-impacto
- Sin cambios en:
  - Landing/Marketing (styles/marketing.css y `(marketing)`)
  - Login/Registro (styles/auth.css y `(auth)`)
- Cambios y definiciones SOLO para el dashboard interno (styles/app.css y `(app)`)

## Fuentes de verdad y referencias
- Vistas y especificaciones por rol:
  - Admin: <mcfolder name="admin" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\admin"></mcfolder>
  - Tipsters: <mcfolder name="Tipsters" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Tipsters"></mcfolder>
  - Usuarios: <mcfolder name="Usuarios" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Usuarios"></mcfolder>
- CSS de referencia (layout Admin): <mcfile name="admin.css" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\styles\admin.css"></mcfile>
- Comparativas funcionales:
  - <mcfile name="comparacion-modulos-admin-vs-usuarios.md" path="c:\Users\DOM\Desktop\trading-deportivo\comparacion-modulos-admin-vs-usuarios.md"></mcfile>
  - <mcfile name="comparacion-modulos-tipsters-vs-usuarios.md" path="c:\Users\DOM\Desktop\trading-deportivo\comparacion-modulos-tipsters-vs-usuarios.md"></mcfile>
- Código actual relevante (App Router):
  - Layout de app: <mcfile name="(app)/layout.tsx" path="c:\Users\DOM\Desktop\trading-deportivo\apps\web\src\app\(app)\layout.tsx"></mcfile>
  - Páginas con estilos inline a migrar: <mcfile name="dashboard/page.tsx" path="c:\Users\DOM\Desktop\trading-deportivo\apps\web\src\app\(app)\dashboard\page.tsx"></mcfile> y <mcfile name="users/page.tsx" path="c:\Users\DOM\Desktop\trading-deportivo\apps\web\src\app\(app)\users\page.tsx"></mcfile>
  - Sidebar Admin (componente): <mcfile name="Sidebar.tsx" path="c:\Users\DOM\Desktop\trading-deportivo\apps\web\src\components\admin\Sidebar.tsx"></mcfile>

## Arquitectura de estilos
- Global (sin cambios): `styles/tokens.css`, `styles/base.css`, `styles/utilities.css`, `styles/marketing.css`, `styles/auth.css`.
- App/Dashboard:
  - Único archivo de estilos zonales: `styles/app.css` (ya importado desde el layout de `(app)`)
  - Contiene: shell del dashboard (sidebar, topbar, main), componentes transversales (cards/KPI, tablas, botones) y utilidades específicas de app.
  - Variación por rol mediante wrappers y tokens (no duplicar CSS por rol).

## Convenciones de nombres
- Wrappers por rol (aplicarlos en el layout/grupo de rutas):
  - `.app-role--admin`, `.app-role--tipster`, `.app-role--user`
- Clases neutrales (reutilizables por todos):
  - Estructura: `.app-sidebar`, `.app-topbar`, `.app-main`, `.app-content`, `.app-section`
  - Navegación: `.app-nav`, `.app-nav-section`, `.app-nav-item`, `.app-nav-item.active`
  - Componentes: `.kpi-card`, `.card`, `.card-header`, `.card-body`
  - Tablas: `.table`, `.table-striped`, `.table-responsive`
  - Botones: `.btn`, `.btn-primary`, `.btn-success`, `.btn-warning`, `.btn-danger`, `.btn-info`
- Variables neutrales: `--sidebar-width`, `--topbar-height`

## Tokens por rol (definir en tokens.css)
- Admin (rojo): `--admin-primary`, `--admin-secondary`, `--admin-accent`, `--admin-gradient`, `--admin-glow`
- Tipster (violeta): `--tipster-primary`, `--tipster-secondary`, `--tipster-accent`, `--tipster-gradient`, `--tipster-glow` (tomados de <mcfile name="tipster-dashboard.md" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Tipsters\tipster-dashboard.md"></mcfile>)
- Usuario (verde): `--user-primary`, `--user-secondary`, `--user-accent`, `--user-gradient`, `--user-glow` (mantener línea visual de docs de Usuarios)
- Aplicación de acentos (ejemplos, implementarlos en `app.css`):
  - `.app-role--admin .btn-primary { background: var(--admin-gradient); }`
  - `.app-role--tipster .app-nav-item.active { color: var(--tipster-primary); }`
  - `.app-role--user .badge-primary { background: var(--user-primary); }`

## Patrones de layout a centralizar en app.css
- Sidebar
  - `.app-sidebar` (posición fija, ancho `--sidebar-width`, altura 100vh, scroll y sombra)
  - Navegación segmentada por secciones; resaltar `.app-nav-item.active` con acento del rol
- Topbar
  - `.app-topbar` (altura `--topbar-height`, sombra, título `.app-page-title`, migas `.app-breadcrumbs`, acciones `.app-actions`)
- Main
  - `.app-main` con margen izquierdo = `--sidebar-width`; `.app-content` para áreas con padding; `.app-section` para bloques
- Componentes trasversales
  - Tarjetas/KPIs: `.kpi-card`, `.card`, `.card-header`, `.card-body`
  - Tablas: `.table`, `.table-striped`, `.table-responsive { overflow-x: auto; }`
  - Botones: `.btn` + variantes; gradientes y estados activos según tokens del rol
- Responsivo
  - Colapso del sidebar en móvil con overlay; conservar usabilidad del topbar y scroll horizontal en tablas

## Mapa de módulos por rol (rutas y piezas mínimas)

### Admin (rutas en docs)
- Paneles principales:
  - <mcfile name="admin-dashboard.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\admin\admin-dashboard.html"></mcfile>
  - <mcfile name="admin-users.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\admin\admin-users.html"></mcfile>
  - <mcfile name="admin-tipsters.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\admin\admin-tipsters.html"></mcfile>
  - <mcfile name="admin-signals.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\admin\admin-signals.html"></mcfile>
  - <mcfile name="admin-bets.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\admin\admin-bets.html"></mcfile>
  - <mcfile name="admin-finance.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\admin\admin-finance.html"></mcfile>
  - <mcfile name="admin-credits.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\admin\admin-credits.html"></mcfile>
  - <mcfile name="admin-subscriptions.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\admin\admin-subscriptions.html"></mcfile>
  - <mcfile name="admin-support.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\admin\admin-support.html"></mcfile>
- Bloques mínimos (por página):
  - Sidebar con secciones (principal, gestión, soporte)
  - Topbar con título y acciones (buscar/filtros/refresh/export donde aplique)
  - KPIs/cards + tablas con filtros
- Acento: tokens Admin (rojo) para botones primarios, badges y estado activo del nav

### Tipsters (rutas en docs)
- Paneles principales:
  - <mcfile name="tipster-dashboard.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Tipsters\tipster-dashboard.html"></mcfile>
  - <mcfile name="tipster-signals.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Tipsters\tipster-signals.html"></mcfile> / <mcfile name="tipster-create-signal.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Tipsters\tipster-create-signal.html"></mcfile>
  - <mcfile name="tipster-settlements.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Tipsters\tipster-settlements.html"></mcfile>
  - <mcfile name="tipster-subscribers.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Tipsters\tipster-subscribers.html"></mcfile>
  - <mcfile name="tipster-wallet.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Tipsters\tipster-wallet.html"></mcfile>
  - <mcfile name="tipster-profile.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Tipsters\tipster-profile.html"></mcfile> / <mcfile name="tipster-settings.md" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Tipsters\tipster-settings.md"></mcfile>
  - <mcfile name="tipster-support.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Tipsters\tipster-support.html"></mcfile>
- Bloques mínimos: igual estructura que Admin (sidebar/topbar/main), con acento violeta del rol

### Usuarios (rutas en docs)
- Paneles principales (extracto):
  - <mcfile name="dashboard_profesional.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Usuarios\dashboard_profesional.html"></mcfile>
  - <mcfile name="signals.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Usuarios\signals.html"></mcfile> / <mcfile name="watchlist.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Usuarios\watchlist.html"></mcfile>
  - <mcfile name="bankroll_module.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Usuarios\bankroll_module.html"></mcfile> / <mcfile name="store.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Usuarios\store.html"></mcfile>
  - <mcfile name="stats.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Usuarios\stats.html"></mcfile> / <mcfile name="smart_portfolio.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Usuarios\smart_portfolio.html"></mcfile>
  - <mcfile name="settings.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Usuarios\settings.html"></mcfile> / <mcfile name="support.html" path="c:\Users\DOM\Desktop\trading-deportivo\docs\ui\vista-modulos\Usuarios\support.html"></mcfile>
  - Otros: Agents Hub, Community, Notifications, Referidos, Risk-Guard, Trader Master, Trading Coach (ver carpeta Usuarios)
- Bloques mínimos: misma estructura (sidebar/topbar/main), con acento verde del rol

## Plan de migración (App Dashboard)
1. Base y limpieza
   - Consolidar en `styles/app.css`: `.app-sidebar`, `.app-topbar`, `.app-main`, `.table-responsive`, `.kpi-card`, `.card`
   - Registrar variables neutrales `--sidebar-width` y `--topbar-height` en `tokens.css`
   - Definir tokens por rol en `tokens.css`: `--admin-*`, `--tipster-*`, `--user-*`
   - Eliminar estilos inline en páginas:
     - <mcfile name="dashboard/page.tsx" path="c:\Users\DOM\Desktop\trading-deportivo\apps\web\src\app\(app)\dashboard\page.tsx"></mcfile>
     - <mcfile name="users/page.tsx" path="c:\Users\DOM\Desktop\trading-deportivo\apps\web\src\app\(app)\users\page.tsx"></mcfile>
   - Normalizar <mcfile name="Sidebar.tsx" path="c:\Users\DOM\Desktop\trading-deportivo\apps\web\src\components\admin\Sidebar.tsx"></mcfile> a clases `.app-sidebar` y derivados
2. Acentos por rol
   - Aplicar wrappers `.app-role--{rol}` en layouts de rol
   - Mapear estado `active` del nav y `.btn-primary` al token del rol
3. Específico por módulo
   - Ajustes finos para tablas densas, filtros sticky, drawers, grids KPI
   - Documentar overrides mínimos por módulo en secciones dentro de `app.css`

## Checklist de aceptación (por página)
- Layout: sin estilos inline; utiliza `.app-sidebar`, `.app-topbar`, `.app-main`, `.table-responsive`
- Acento: wrapper `.app-role--{rol}` aplicado; botones y navegación activos con tokens del rol
- Accesibilidad: foco visible; contraste adecuado; tablas con scroll horizontal en móvil
- Reutilización: tarjetas y KPIs con `.kpi-card`/`.card`; utilidades globales en lugar de duplicados
- Navegación: items y rutas alineadas con los documentos del módulo correspondiente

## Prioridad de implementación
- Admin: Dashboard → Users → Tipsters → Signals
- Tipsters: Dashboard → Signals → Subscribers
- Usuarios: Dashboard Profesional → Signals/Watchlist → Bankroll/Store

## Notas de implementación (App Router)
- Mantener import de `styles/app.css` en el layout de `(app)` (<mcfile name="(app)/layout.tsx" path="c:\Users\DOM\Desktop\trading-deportivo\apps\web\src\app\(app)\layout.tsx"></mcfile>)
- Añadir wrappers `.app-role--admin|tipster|user` en los layouts de grupo de rutas correspondientes
- No tocar `(marketing)` ni `(auth)`; los estilos y metadatos de esas zonas permanecen intactos

---
Este documento sirve como guía operativa para terminar el área de App/Dashboard basándonos en los HTML y MD más completos de `docs/ui/vista-modulos`. Cualquier excepción o particularidad debe anotarse en comentarios de sección dentro de `styles/app.css`.
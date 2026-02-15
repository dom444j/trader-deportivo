# Dashboard de Usuario — Estructura de diseño (apps/web)

Este documento resume la estructura de UI/UX del dashboard de usuario en `apps/web`, incluyendo colocación de tarjetas, contenido, sidebar, topbar, estilos, tamaños de componentes y fuentes de datos actuales.

## 1) App Shell (layout del dashboard)
- Componente: `components/shared/layout/DashboardShell.tsx`
- Estilos: `components/shared/layout/DashboardShell.module.css`
- Tokens de diseño (scoped al dashboard):
  - Dimensiones: `--sidebar-width: 280px`, `--sidebar-collapsed-width: 80px`, `--topbar-height: 70px`.
  - Colores base: `--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--bg-elevated`, `--border-color`.
  - Gradientes: `--gradient-primary`, `--gradient-success`, `--gradient-premium`, `--gradient-ai`.
- Estructura: Sidebar (izq) + Main (der) con Topbar fijo y `main` para el contenido.

## 2) Sidebar (navegación y estado rápido)
- Componente: `components/shared/sidebar/AppSidebar.tsx`
- Estilos: `components/shared/sidebar/AppSidebar.module.css`
- Contenido:
  - Logo + Wordmark.
  - Bloque "Estado Rápido": Bankroll, ROI Mes, PnL Mes, Alertas (fetch de `/api/user/dashboard/kpis` y `/api/user/alerts`).
  - Grupos y secciones con badges (colapsables): provenientes de `src/lib/config/navigation.ts`.
- Comportamiento: colapsable en desktop; modal/overlay en mobile.

## 3) Topbar (acciones y KPI global)
- Componente: `components/shared/header/DashboardTopbar.tsx`
- Estilos: `components/shared/header/DashboardTopbar.module.css`
- Contenido:
  - Left: botón de menú (móvil) + breadcrumb.
  - Center: buscador + pill "Bank Total" (fetch `/api/user/bankroll/current`).
  - Right: notificaciones (badge vía `/api/user/alerts`), ajustes, menú de usuario (perfil, configuración, logout).

## 4) Página de Usuario
- Ruta: `src/app/(dashboard)/user/page.tsx`
- Carga de datos (SSR):
  - KPIs: `/api/user/dashboard/kpis` → `lib/user-kpis.ts` (mock).
  - Señales activas: `/api/signals/active`.
  - Próximos eventos: `/api/events/upcoming`.
- Render principal:
  - `ExecutiveHeader` (KPIs rápidos)
  - `TopStatsGrid` (tarjetas superiores)
  - Secciones secundarias: Señales, Tipsters favoritos, Rendimiento, Progreso, Eventos.

## 5) Executive Header (KPIs rápidos)
- Componente: `components/dashboard/user/ExecutiveHeader.tsx`
- Diseño:
  - Grid de 5 columnas (3 en ≥1000px, 2 en ≤640px).
  - `kpiLabel` (11px, uppercase) + `kpiValue` (18px, monospace bold).
  - Tarjetas con fondo gradiente y borde sutil.

## 6) Top Stats Grid (tarjetas superiores)
- Componente: `components/dashboard/user/TopStatsGrid.tsx`
- Estilos: `app/(dashboard)/user/UserDashboard.module.css`
- Grid y áreas:
  - Mobile (1 col): `plan`, `rango`, `equipo`, `pool`, `saldo`, `creditos`, `proximo`, `alertas`, `directos`.
  - Tablet (≥768, 2 cols): `"plan rango" / "equipo pool" / "saldo creditos" / "proximo alertas" / "directos directos"`.
  - Desktop (≥1024, 4 cols): `"plan rango equipo pool" / "saldo creditos proximo alertas" / "directos directos directos directos"`.
- Tarjeta base (`.statCard`): padding 18×16px, gap 12px, fondo gradiente, borde 1px, radio 14px, min-height 92px, glow decorativo.
- Barra de progreso (`.progressBar`): altura 8px, borde 1px, radio 6px, relleno con `--gradient-primary`.
- Contenido por tarjeta:
  1) Plan actual
     - Título + badge de estado; nombre del plan; meta de activación; CTA "Renovar".
  2) Rango
     - Rango actual (ej. R3) + disciplina (0–100).
  3) Equipo Binario (A/B)
     - Líneas: `Bank A: €xx · Bank B: €yy`; total; "Balance A/B" + barra con relación min/max.
  4) Pool semanal estimado
     - Valor (€); meta: `ROI Mes` y `DD`.
  5) Saldo disponible
     - Bankroll actual; meta: `PnL Mes` con signo.
  6) Créditos (señales)
     - Créditos disponibles esta semana.
  7) Próximo pago
     - Yes/No; meta con días restantes; CTA "Renovar".
  8) Alertas de Señales
     - Conteo de alertas activas.
  9) Directos (referidos 10%)
     - Número de directos activos.

## 7) Tipos y datos (KPIs)
- Tipos: `src/types/user-dashboard.ts` → `UserKpis` incluye: bankroll, pnlMonth, roiMonth, drawdown, discipline, planName, planStatus, planActivationRemainingDays, planActivationTotalDays, nextPaymentDue, rankName, binaryBankA, binaryBankB, weeklyPoolEstimate, creditsAvailable, alertsCount, directsCount.
- Mock: `src/lib/user-kpis.ts` con valores de demo (e.g., Bank A 30k, Bank B 27k, Pool 57k, etc.).

## 8) API (ámbito usuario)
- `src/app/api/user/dashboard/kpis/route.ts` → KPIs del dashboard.
- `src/app/api/user/bankroll/current/route.ts` → Bank total.
- `src/app/api/user/alerts/route.ts` → Alertas.
- `src/app/api/user/discipline/score/route.ts` → Disciplina.
- `src/app/api/user/drawdown/current/route.ts` → DD.
- `src/app/api/user/pnl/summary/route.ts` → PnL.
- `src/app/api/user/progress/route.ts` → Progreso.

## 9) Navegación (estructura del sidebar)
- Fuente: `src/lib/config/navigation.ts` (grupos: Inteligencia, Capital & Control, Tienda, Comunidad, IA & Mejora, Referidos, Otros).
- Ejemplos de nodos: Señales (con PRE/LIVE), Premium Hub (Planes/Créditos/Promos), Comunidad, Referidos (Directos, Equipo Binario, Pagos).

## 10) Estructura de carpetas relevante (apps/web)
```
apps/web/
├─ src/
│  ├─ app/
│  │  ├─ (dashboard)/user/
│  │  │  ├─ page.tsx
│  │  │  └─ UserDashboard.module.css
│  │  ├─ api/user/(alerts|bankroll/current|dashboard/kpis|discipline/score|drawdown/current|pnl/summary|progress)/route.ts
│  │  └─ (marketing)/(auth)/...
│  ├─ components/
│  │  ├─ dashboard/user/(TopStatsGrid.tsx|ExecutiveHeader.tsx)
│  │  └─ shared/
│  │     ├─ layout/(DashboardShell.tsx|DashboardShell.module.css)
│  │     ├─ sidebar/(AppSidebar.tsx|AppSidebar.module.css)
│  │     └─ header/(DashboardTopbar.tsx|DashboardTopbar.module.css)
│  ├─ lib/(user-kpis.ts|config/navigation.ts|...)
│  ├─ navigation/(userNav.ts|tipsterNav.ts|adminNav.ts)
│  ├─ styles/(globals.css|tokens.css|base.css|utilities.css)
│  └─ types/user-dashboard.ts
└─ public/brand/(favicon_option1.svg|referral_binary_final.svg)
```

## 11) Notas y pendientes
- "Equipo Binario" requiere refinamiento visual para igualar 1:1 el HTML de referencia (título en uppercase, badge info, líneas de resumen y counts laterales, glow/contorno específico).
- Conectar tarjetas a fuentes reales progresivamente (créditos, directos, etc.).

— Fin del documento —
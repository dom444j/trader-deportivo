# 📊 Módulo: Admin Dashboard

## 🎯 Objetivo
Dashboard ejecutivo para control operativo, métricas clave, salud del sistema y gestión de alertas críticas. Vista centralizada para administración global.

**Rol:** Admin (control total del sistema)  
**Ruta:** `/admin`  
**Acento visual:** Rojo/Admin (diferenciar de Usuario = verde, Tipster = violeta)

---

## 📋 Interfaces Principales del Módulo

### `AdminDashboardModule`
```typescript
interface AdminDashboardModule {
  id: 'admin-dashboard'
  name: 'Admin Dashboard'
  description: 'Dashboard ejecutivo para control operativo y métricas clave'
  route: '/admin'
  accent_color: 'red'
  role: 'ADMIN'
  status: ModuleStatus
  last_updated: string
  refresh_interval: number // milliseconds
  auto_refresh: boolean
}
```

### `AdminDashboardHeader`
```typescript
interface AdminDashboardHeader {
  dashboard_title: string
  current_period: 'today' | '7d' | '30d' | 'custom'
  system_status: SystemStatus
  refresh_controls: RefreshControls
  export_options: ExportOptions
  quick_filters: QuickFilters
  last_updated: string
}

interface SystemStatus {
  api: 'healthy' | 'degraded' | 'down'
  providers: ProviderSystemStatus
  queue_jobs: 'ok' | 'warn' | 'error'
  critical_alerts: number
  overall_health: 'excellent' | 'good' | 'warning' | 'critical'
}

interface ProviderSystemStatus {
  sport_data: 'healthy' | 'degraded' | 'down'
  odds: 'healthy' | 'degraded' | 'down'
  execution: 'healthy' | 'degraded' | 'down'
  last_check: string
}

interface RefreshControls {
  auto_refresh: boolean
  interval: number // seconds
  last_refresh: string
  is_refreshing: boolean
}

interface QuickFilters {
  scope: 'global' | 'sport' | 'tipster' | 'league'
  sport?: string
  tipster?: string
  league?: string
}
```

### `AdminDashboardLayout`
```typescript
interface AdminDashboardLayout {
  header: AdminDashboardHeader
  kpi_section: DashboardKPISection
  system_health_section: SystemHealthSection
  alerts_section: CriticalAlertsSection
  quick_actions_section: QuickActionsSection
  analytics_section: AnalyticsSection
  support_section: SupportSection
  audit_section: AuditSection
  navigation_section: NavigationSection
}

interface DashboardKPISection {
  cards: KPICard[]
  layout: 'grid-4' | 'grid-2' | 'grid-1'
  show_trends: boolean
  clickable_cards: boolean
}

interface SystemHealthSection {
  health_check: SystemHealthWidget
  show_providers: boolean
  show_metrics: boolean
  actions_available: string[]
}

interface CriticalAlertsSection {
  max_displayed: number
  severity_filter: AlertSeverity[]
  show_acknowledged: boolean
  actions: AlertActions
}

interface QuickActionsSection {
  actions: QuickAction[]
  layout: 'grid' | 'list'
  require_confirmation: boolean
}

interface AnalyticsSection {
  top_performers: TopPerformersWidget
  anomalies: AnomaliesWidget
  activity_feed: ActivityFeedWidget
}

interface SupportSection {
  open_tickets: SupportTicketsWidget
  sla_overview: SLAOverviewWidget
  priority_distribution: PriorityDistributionWidget
}

interface AuditSection {
  recent_logs: RecentAuditLogsWidget
  risk_events: RiskEventsWidget
  compliance_status: ComplianceStatusWidget
}

interface NavigationSection {
  main_modules: NavigationLink[]
  quick_access: QuickAccessLink[]
  pending_approvals: PendingApprovalsWidget
}
```

### `DashboardKPIs`
```typescript
interface DashboardKPIs {
  users: UsersKPI
  tipsters: TipstersKPI
  signals: SignalsKPI
  revenue: RevenueKPI
  credits: CreditsKPI
  support: SupportKPI
  system_health: SystemHealthKPI
  compliance: ComplianceKPI
}

interface UsersKPI {
  active_users: number
  new_registrations: number
  churned_users: number
  reactivated_users: number
  total_users: number
  growth_rate: number
  trend: 'up' | 'down' | 'neutral'
}

interface TipstersKPI {
  active_tipsters: number
  verified_tipsters: number
  under_review: number
  suspended: number
  total_tipsters: number
  growth_rate: number
  trend: 'up' | 'down' | 'neutral'
}

interface SignalsKPI {
  active_signals: number
  pre_match_signals: number
  live_signals: number
  expired_signals: number
  total_signals: number
  growth_rate: number
  trend: 'up' | 'down' | 'neutral'
}

interface RevenueKPI {
  total_revenue: number
  subscriptions: number
  credits: number
  other: number
  growth_rate: number
  trend: 'up' | 'down' | 'neutral'
}

interface CreditsKPI {
  sold_credits: number
  spent_credits: number
  current_balance: number
  refunded_credits: number
  growth_rate: number
  trend: 'up' | 'down' | 'neutral'
}

interface SupportKPI {
  open_tickets: number
  critical_tickets: number
  high_priority: number
  sla_breached: number
  total_tickets: number
  trend: 'up' | 'down' | 'neutral'
}

interface SystemHealthKPI {
  uptime_percentage: number
  average_latency: number
  error_rate: number
  active_providers: number
  total_providers: number
  health_score: number // 0-100
}

interface ComplianceKPI {
  compliance_score: number // 0-100
  open_issues: number
  resolved_issues: number
  risk_level: 'low' | 'medium' | 'high' | 'critical'
}
```

---

## 🎨 Estilo Visual

### Paleta de Colores Admin
```css
--admin-primary: #dc2626;      /* Rojo Admin */
--admin-secondary: #991b1b;    /* Rojo oscuro */
--admin-accent: #ef4444;       /* Rojo claro */
--admin-gradient: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
--admin-glow: 0 0 20px rgba(220, 38, 38, 0.4);
```

### Reglas de Consistencia
- ✅ **MANTENER**: Layout, estructura, componentes base
- ✅ **CAMBIAR SOLO**: Color de botón primario, badges, sidebar active, highlights
- ❌ **NO CAMBIAR**: Grid, tipografía, espaciado, iconos

---

## 📋 Estructura del Dashboard

### 1) Header del Dashboard

**Elementos:**
```
┌─────────────────────────────────────────────────────────┐
│ ⚙️ Admin Dashboard                                     │
│ Estado operativo y control ejecutivo                   │
│                                                         │
│ [Rango: Hoy | 7d | 30d | Custom] [Refresh] [Export]  │
│                                                         │
│ 🟢 API: Healthy  🟢 Providers: OK  🔴 3 Alertas      │
└─────────────────────────────────────────────────────────┘
```

**Componentes:**
- **Título del módulo** con badge de estado del sistema
- **Selector de rango de fechas**:
  - Hoy
  - 7 días
  - 30 días
  - Personalizado
- **Controles rápidos**:
  - Refresh (actualizar datos)
  - Export (CSV/JSON)
- **Indicadores de estado del sistema** (chips):
  - API: Healthy / Degraded / Down
  - Providers: Sport data / Odds / Execution
  - Queue/Jobs: OK / Warn
  - Alertas críticas abiertas: número (badge)

**Mockup:**
```typescript
interface AdminHeader {
  dashboard_title: string
  current_period: 'today' | '7d' | '30d' | 'custom'
  system_status: {
    api: 'healthy' | 'degraded' | 'down'
    providers: {
      sport_data: 'healthy' | 'degraded' | 'down'
      odds: 'healthy' | 'degraded' | 'down'
      execution: 'healthy' | 'degraded' | 'down'
    }
    queue_jobs: 'ok' | 'warn' | 'error'
    critical_alerts: number
  }
  last_updated: string
}
```

**Estados UI:**
- Loading: skeleton en controles y chips
- Error: banner alto con detalle
- Partial: chips en estado Warn con tooltip

Título: "Admin Dashboard"
Subtítulo: "Estado operativo y control ejecutivo"

Controles rápidos (derecha):
- Selector de rango de fechas: Hoy | 7d | 30d | Custom
- Filtro de “scope”: Global | Por deporte | Por tipster | Por liga
- Botón "Refresh"
- Botón "Export" (CSV/JSON) (placeholder si es Fase 2)

Indicadores de estado (chips):
- API: Healthy / Degraded / Down
- Providers (3 chips): Sport data / Odds / Execution
- Queue/Jobs: OK / Warn
- Alertas críticas abiertas: número (badge)

Estados UI:
- Loading: skeleton en controles y chips
- Error: banner alto con detalle
- Partial: chips en estado Warn con tooltip

---

### 2) KPI Cards (Métricas Clave)

**Grid de 6-8 cards:**
```
┌─────────────┬─────────────┬─────────────┐
│ Usuarios    │ Tipsters    │ Señales     │
│ 1,247       │ 89          │ 342         │
│ ▲ +5.2%     │ ▲ +2.1%     │ ▲ +12.3%    │
└─────────────┴─────────────┴─────────────┘
┌─────────────┬─────────────┬─────────────┐
│ Ingresos    │ Créditos    │ Soporte     │
│ $45,230     │ 8,420       │ 23 Abiertos │
│ ▲ +18.5%    │ ▲ +25.1%    │ ▼ -15%      │
└─────────────┴─────────────┴─────────────┘
```

**Detalle de cada KPI:**

#### A) Usuarios Activos
```typescript
interface UsersKPI {
  label: "Usuarios Activos"
  value: number          // 1,247
  change: number         // +5.2%
  trend: 'up' | 'down' | 'neutral'
  description: "Usuarios activos en el período"
  color: "admin-primary"
  icon: "👥"
  link: "/admin/users"
  sub_metrics: {
    new_registrations: number
    churned_users: number
    reactivated: number
  }
}
```

#### B) Tipsters Activos
```typescript
interface TipstersKPI {
  label: "Tipsters Activos"
  value: number          // 89
  change: number         // +2.1%
  trend: 'up' | 'down' | 'neutral'
  description: "Tipsters con actividad en el período"
  color: "admin-secondary"
  icon: "📊"
  link: "/admin/tipsters"
  sub_metrics: {
    verified: number
    under_review: number
    suspended: number
  }
}
```

#### C) Señales Activas
```typescript
interface SignalsKPI {
  label: "Señales Activas"
  value: number          // 342
  change: number         // +12.3%
  trend: 'up' | 'down' | 'neutral'
  description: "Señales PRE y LIVE activas"
  color: "admin-accent"
  icon: "📡"
  link: "/admin/signals"
  sub_metrics: {
    pre_match: number
    live: number
    expired: number
  }
}
```

#### D) Ingresos
```typescript
interface RevenueKPI {
  label: "Ingresos"
  value: number          // $45,230
  change: number         // +18.5%
  trend: 'up' | 'down' | 'neutral'
  description: "Ingresos totales del período"
  color: "admin-primary"
  icon: "💰"
  link: "/admin/finance"
  sub_metrics: {
    subscriptions: number
    credits: number
    other: number
  }
}
```

#### E) Créditos Vendidos
```typescript
interface CreditsKPI {
  label: "Créditos Vendidos"
  value: number          // 8,420
  change: number         // +25.1%
  trend: 'up' | 'down' | 'neutral'
  description: "Créditos vendidos en el período"
  color: "admin-secondary"
  icon: "🪙"
  link: "/admin/credits"
  sub_metrics: {
    sold: number
    spent: number
    balance: number
  }
}
```

#### F) Tickets de Soporte
```typescript
interface SupportKPI {
  label: "Tickets de Soporte"
  value: number          // 23
  change: number         // -15%
  trend: 'up' | 'down' | 'neutral'
  description: "Tickets abiertos"
  color: "admin-accent"
  icon: "🎫"
  link: "/admin/support"
  sub_metrics: {
    critical: number
    high_priority: number
    sla_breached: number
  }
}
```

**Estados UI por card:**
- Loading: skeleton del valor
- Empty: "Sin datos en rango"
- Error: icono de error y tooltip
- Partial: mostrar solo valor principal sin delta

**Interactividad:**
- Hover: Tooltip con descripción y sub-métricas
- Click: Redirección al módulo correspondiente

---

### 3) System Health & Providers

**Card ancho (2/3):**
```
┌─────────────────────────────────────────────────────────┐
│ 🔧 System Health & Providers                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ API Status: 🟢 Healthy                                 │
│ Latencia p95: 120ms | Error rate: 0.2% | Uptime: 99.9% │
│                                                         │
│ 📋 Providers Status:                                  │
│ ┌────────────┬─────────┬──────────┬──────────┬─────────┐ │
│ │ Provider   │ Status  │ Latencia │ Error %  │ Límite  │ │
│ ├────────────┼─────────┼──────────┼──────────┼─────────┤ │
│ │ SportData  │ 🟢 OK   │ 85ms     │ 0.1%     │ 2,450   │ │
│ │ OddsAPI    │ 🟢 OK   │ 110ms    │ 0.3%     │ 8,200   │ │
│ │ Execution  │ 🟡 Warn │ 250ms    │ 1.2%     │ N/A     │ │
│ └────────────┴─────────┴──────────┴──────────┴─────────┘ │
│                                                         │
│ [Run Health Check] [Ver Historial →]                   │
└─────────────────────────────────────────────────────────┘
```

**Interfaces de datos:**
```typescript
interface SystemHealth {
  api_status: 'healthy' | 'degraded' | 'down'
  metrics: {
    latency_p95: number      // 120ms
    error_rate: number      // 0.2%
    uptime_percentage: number // 99.9%
    requests_per_minute: number
  }
  timestamp: string
}

interface ProviderStatus {
  name: string
  status: 'healthy' | 'degraded' | 'down'
  latency: number         // ms
  error_rate: number      // %
  rate_limit_remaining: number | null
  last_check: string
  type: 'sport_data' | 'odds' | 'execution'
}

interface SystemHealthWidget {
  health: SystemHealth
  providers: ProviderStatus[]
  actions: {
    run_health_check: boolean
    view_history: string  // link to /admin/alerts or /admin/audit
  }
}
```

**Acciones disponibles:**
- "Run Health Check" (manual test)
- "Ver historial" (link a `/admin/alerts` o `/admin/audit`)

**Estados UI:**
- Loading: tabla con filas skeleton
- Error: banner de conexión
- Partial: filas con Status Warn

---

### 4) Alertas & Riesgo (Panel Crítico)

**Card ancho (1/3) o debajo del bloque 3:**
```
┌─────────────────────────────────────────────────────────┐
│ 🚨 Alertas Críticas (Top 6)                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔴 CRITICAL  │ Hace 2 min │ User #1234 │ Ver → │ │
│ │ Suspicious betting pattern detected               │ │
│ │ [Acknowledge]                                     │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ 🟠 ERROR     │ Hace 5 min │ Signal #567 │ Ver →│ │
│ │ Odds manipulation detected                         │ │
│ │ [Acknowledge]                                     │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ 🟡 WARNING   │ Hace 8 min │ API Rate │ Ver → │ │
│ │ Limit approaching: 85% consumed                  │ │
│ │ [Acknowledge]                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [Ir a Alertas →] [Ir a Compliance →]                     │
└─────────────────────────────────────────────────────────┘
```

**Interfaces de datos:**
```typescript
enum AlertType {
  RISK = 'RISK'
  COMPLIANCE = 'COMPLIANCE'
  SYSTEM = 'SYSTEM'
  PERFORMANCE = 'PERFORMANCE'
  SECURITY = 'SECURITY'
}

enum AlertSeverity {
  CRITICAL = 'CRITICAL'
  ERROR = 'ERROR'
  WARNING = 'WARNING'
  INFO = 'INFO'
}

interface Alert {
  id: string
  timestamp: string
  type: AlertType
  severity: AlertSeverity
  entity_type: 'user' | 'tipster' | 'signal' | 'system' | 'api'
  entity_id: string
  message: string
  acknowledged: boolean
  acknowledged_by?: string
  acknowledged_at?: string
}

interface CriticalAlertsWidget {
  alerts: Alert[]
  total_critical: number
  total_error: number
  total_warning: number
  actions: {
    acknowledge_alert: boolean
    view_details: string
    go_to_alerts: string
    go_to_compliance: string
  }
}
```

**Estados vacíos:**
- "No hay alertas críticas 🎉"

**Estados UI:**
- Loading: 6 filas skeleton
- Error: banner de error
- Partial: solo CRITICAL/ERROR cargadas

---

## 5) Actividad en tiempo real (opcional / placeholder)

Mini feed:
- "usuario compró créditos"
- "tipster publicó señal"
- "señal fue liquidada"
- "ticket creado"

Toggle: "Live / last 30m / last 24h"

Sin backend: dejar placeholder con ejemplos.

Estados UI:
- Loading: shimmer
- Empty: "Sin actividad reciente"
- Error: mensaje simple

---

## 6) Top Tipsters / Top Señales (control de calidad)

Tablas pequeñas lado a lado:

A) Top Tipsters (30d)
- Columnas: Tipster | ROI | Winrate | Drawdown | Seguidores | Flags compliance | Acción (ver/moderar)
- Link: `/admin/tipsters`

B) Señales con anomalías
- Columnas: Señal | Tipster | EV | Odds drift | Reportes | Estado | Acción (pause/review)
- Link: `/admin/signals`

Estados UI:
- Loading: tablas skeleton
- Empty: "Sin datos"
- Error: banner
- Partial: columnas sin EV/odds si faltan proveedores

---

## 7) Finanzas resumidas

Card con 2 tabs:
- Suscripciones: revenue, refunds, churn (placeholder si no está implementado)
- Créditos: ventas, gasto, balance total

Botón: "Ir a Finanzas & Tesorería" → `/admin/finance`

Estados UI:
- Loading: skeleton en ambos tabs
- Empty: "Sin transacciones en rango"
- Error: banner
- Partial: solo métricas agregadas

---

## 8) Soporte

Tabla:
- Columnas: Ticket | Usuario | Categoría | Prioridad | Estado | Asignado | Creado | Acción
- Link: `/admin/support`

Estados UI:
- Loading: skeleton filas
- Empty: "Sin tickets abiertos"
- Error: banner
- Partial: sin asignado

---

## 9) Auditoría rápida

Mini tabla (últimos 10 audit logs):
- Columnas: actor | action | entity | risk_level | timestamp | "ver"
- Link: `/admin/audit`

Estados UI:
- Loading: skeleton
- Empty: "Sin eventos"
- Error: banner

---

### 10) Contrato de Navegación (Links del Dashboard)

**Accesos directos organizados por categoría:**

```typescript
interface AdminNavigation {
  users: {
    path: '/admin/users'
    label: 'Gestión de Usuarios'
    icon: '👥'
    description: 'Administrar usuarios, roles y permisos'
  }
  tipsters: {
    path: '/admin/tipsters'
    label: 'Gestión de Tipsters'
    icon: '📊'
    description: 'Administrar tipsters y su rendimiento'
  }
  signals: {
    path: '/admin/signals'
    label: 'Gestión de Señales'
    icon: '📡'
    description: 'Monitorear y moderar señales'
  }
  bets: {
    path: '/admin/bets'
    label: 'Gestión de Apuestas'
    icon: '🎯'
    description: 'Revisar apuestas y patrones'
  }
  subscriptions: {
    path: '/admin/subscriptions'
    label: 'Suscripciones'
    icon: '💳'
    description: 'Gestionar suscripciones y planes'
  }
  credits: {
    path: '/admin/credits'
    label: 'Créditos'
    icon: '🪙'
    description: 'Administrar sistema de créditos'
  }
  referrals: {
    path: '/admin/referrals'
    label: 'Sistema de Referidos'
    icon: '🔗'
    description: 'Gestionar programa de referidos'
  }
  community: {
    path: '/admin/community'
    label: 'Comunidad'
    icon: '👨‍👩‍👧‍👦'
    description: 'Moderar actividad comunitaria'
  }
  support: {
    path: '/admin/support'
    label: 'Soporte'
    icon: '🎧'
    description: 'Gestionar tickets de soporte'
  }
  alerts: {
    path: '/admin/alerts'
    label: 'Alertas'
    icon: '🚨'
    description: 'Monitorear alertas del sistema'
  }
  compliance: {
    path: '/admin/compliance'
    label: 'Compliance'
    icon: '⚖️'
    description: 'Gestionar cumplimiento y regulaciones'
  }
  finance: {
    path: '/admin/finance'
    label: 'Finanzas'
    icon: '💰'
    description: 'Control financiero y reportes'
  }
  audit: {
    path: '/admin/audit'
    label: 'Auditoría'
    icon: '📋'
    description: 'Logs de auditoría y trazabilidad'
  }
}
```

---

### 11) Permisos y Acciones (Tabla Detallada)

**Estructura de permisos por rol:**

```typescript
interface AdminPermission {
  action: string
  required_role: 'ADMIN' | 'SUPER_ADMIN'
  audit_log: boolean
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  justification_required: boolean
  approval_chain?: string[]
}

interface AdminActionLog {
  action_id: string
  admin_user_id: string
  target_entity: string
  target_id: string
  action_type: string
  timestamp: string
  ip_address: string
  user_agent: string
  justification?: string
  approval_status?: 'pending' | 'approved' | 'rejected'
  approved_by?: string
}
```

**Tabla de acciones críticas:**

| Acción | Rol | Audit | Riesgo | Justificación | Aprobación | Notas |
|--------|-----|--------|---------|---------------|------------|--------|
| Suspender usuario | ADMIN | ✅ | HIGH | ✅ | Opcional | Bloquea todas las acciones del usuario |
| Eliminar usuario | SUPER_ADMIN | ✅ | CRITICAL | ✅ | Requerida | Acción irreversible |
| Marcar alerta como acknowledged | ADMIN | ✅ | MEDIUM | ❌ | No requerida | Quita del panel crítico |
| Pausar tipster/señal | ADMIN | ✅ | HIGH | ✅ | Opcional | Requiere justificación escrita |
| Modificar saldo de créditos | SUPER_ADMIN | ✅ | CRITICAL | ✅ | Requerida | Afecta economía del usuario |
| Aprobar verificación tipster | ADMIN | ✅ | HIGH | ✅ | Opcional | Impacta reputación del sistema |
| Generar reporte financiero | ADMIN | ✅ | MEDIUM | ❌ | No requerida | Acceso a información sensible |
| Modificar configuración sistema | SUPER_ADMIN | ✅ | CRITICAL | ✅ | Requerida | Afecta a todos los usuarios |
| Acceder a datos personales | ADMIN | ✅ | HIGH | ✅ | Opcional | GDPR compliance required |
| Ejecutar acciones masivas | SUPER_ADMIN | ✅ | CRITICAL | ✅ | Requerida | Afecta múltiples usuarios |

**Estados de auditoría:**
- ✅ **Sí**: Siempre se registra en log de auditoría
- ❌ **No**: No requiere registro especial
- 🔍 **Opcional**: Depende del contexto y criticidad

Estados UI:
- Confirmaciones con modal y nota de riesgo
- Mensaje de éxito/error

---

## 12) Estados UI obligatorios

Para cada bloque/component:
- Loading
- Empty
- Error
- Partial (degraded providers / datos incompletos)

Notas:
- Consistencia visual con cards/tablas del dashboard
- Tooltips para estados parciales

---

## 📋 Interfaces de Componentes Específicos

### `DashboardFilters`
```typescript
interface DashboardFilters {
  date_range: DateRangeFilter
  scope: ScopeFilter
  provider_status: ProviderStatusFilter
  severity: SeverityFilter
  refresh_interval: RefreshIntervalFilter
}

interface DateRangeFilter {
  type: 'today' | '7d' | '30d' | 'custom'
  custom_start?: string
  custom_end?: string
  quick_selects: QuickSelectOption[]
}

interface ScopeFilter {
  type: 'global' | 'sport' | 'tipster' | 'league'
  sport_id?: string
  tipster_id?: string
  league_id?: string
  available_options: ScopeOption[]
}

interface ProviderStatusFilter {
  show_healthy: boolean
  show_degraded: boolean
  show_down: boolean
  selected_providers: string[]
}

interface SeverityFilter {
  show_critical: boolean
  show_error: boolean
  show_warning: boolean
  show_info: boolean
}

interface RefreshIntervalFilter {
  interval: number // seconds
  auto_refresh: boolean
  available_intervals: number[]
}
```

### `DashboardWidgets`
```typescript
interface DashboardWidgets {
  kpi_cards: KPICardWidget
  system_health: SystemHealthWidget
  critical_alerts: CriticalAlertsWidget
  quick_actions: QuickActionsWidget
  top_performers: TopPerformersWidget
  activity_feed: ActivityFeedWidget
  support_summary: SupportSummaryWidget
  audit_summary: AuditSummaryWidget
}

interface KPICardWidget {
  cards: KPICard[]
  layout: 'grid-4' | 'grid-2' | 'grid-1'
  show_trends: boolean
  clickable: boolean
  refresh_interval: number
}

interface KPICard {
  id: string
  title: string
  value: number | string
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon: string
  color: string
  link?: string
  description: string
  sub_metrics?: SubMetric[]
  loading: boolean
  error?: string
}

interface SystemHealthWidget {
  api_health: APIHealthStatus
  provider_status: ProviderHealthStatus[]
  system_metrics: SystemMetrics
  last_updated: string
  actions_available: HealthAction[]
}

interface CriticalAlertsWidget {
  alerts: CriticalAlert[]
  max_displayed: number
  show_acknowledged: boolean
  severity_order: AlertSeverity[]
  actions: AlertWidgetActions
}

interface QuickActionsWidget {
  actions: QuickAction[]
  layout: 'grid' | 'list'
  require_confirmation: boolean
  confirmation_modal?: ConfirmationModalConfig
}

interface TopPerformersWidget {
  tipsters: TopTipster[]
  signals: TopSignal[]
  time_period: string
  metrics_shown: string[]
}

interface ActivityFeedWidget {
  events: ActivityEvent[]
  max_events: number
  auto_scroll: boolean
  show_timestamps: boolean
  event_types: EventType[]
}

interface SupportSummaryWidget {
  open_tickets: SupportTicket[]
  sla_status: SLAStatus
  priority_breakdown: PriorityBreakdown
  assigned_tickets: AssignedTicketSummary
}

interface AuditSummaryWidget {
  recent_logs: AuditLog[]
  risk_events: RiskEvent[]
  compliance_status: ComplianceStatus
  high_risk_actions: HighRiskAction[]
}
```

### `DashboardTables`
```typescript
interface DashboardTables {
  alerts_table: AlertsTable
  top_tipsters_table: TopTipstersTable
  support_tickets_table: SupportTicketsTable
  audit_logs_table: AuditLogsTable
}

interface AlertsTable {
  columns: AlertColumn[]
  data: CriticalAlert[]
  pagination: TablePagination
  sorting: TableSorting
  filtering: AlertFiltering
  actions: TableActions
}

interface TopTipstersTable {
  columns: TipsterColumn[]
  data: TopTipster[]
  time_period: string
  metrics: TipsterMetric[]
  pagination: TablePagination
  sorting: TableSorting
}

interface SupportTicketsTable {
  columns: TicketColumn[]
  data: SupportTicket[]
  filters: TicketFilter[]
  pagination: TablePagination
  sorting: TableSorting
  actions: TableActions
}

interface AuditLogsTable {
  columns: AuditColumn[]
  data: AuditLog[]
  filters: AuditFilter[]
  pagination: TablePagination
  sorting: TableSorting
  export_options: ExportOption[]
}
```

### `DashboardState`
```typescript
interface DashboardState {
  loading: DashboardLoadingState
  error: DashboardErrorState
  empty: DashboardEmptyState
  partial: DashboardPartialState
  refresh: DashboardRefreshState
}

interface DashboardLoadingState {
  is_loading: boolean
  loading_components: string[]
  skeleton_type: 'card' | 'table' | 'chart' | 'widget'
  progress_percentage?: number
}

interface DashboardErrorState {
  has_error: boolean
  error_components: string[]
  error_messages: ErrorMessage[]
  retry_available: boolean
  fallback_data?: any
}

interface DashboardEmptyState {
  is_empty: boolean
  empty_components: string[]
  empty_messages: EmptyMessage[]
  suggestions?: string[]
}

interface DashboardPartialState {
  is_partial: boolean
  partial_components: string[]
  missing_data: MissingDataInfo[]
  degraded_providers: string[]
}

interface DashboardRefreshState {
  is_refreshing: boolean
  last_refresh: string
  next_refresh?: string
  refresh_interval: number
  auto_refresh: boolean
}
```

### `DashboardExport`
```typescript
interface DashboardExport {
  formats: ExportFormat[]
  sections: ExportableSection[]
  scheduling: ExportScheduling
  templates: ExportTemplate[]
}

interface ExportFormat {
  type: 'csv' | 'json' | 'pdf' | 'excel'
  available: boolean
  options: ExportOptions
}

interface ExportableSection {
  id: string
  name: string
  description: string
  available: boolean
  data_types: string[]
}

interface ExportScheduling {
  enabled: boolean
  frequencies: ExportFrequency[]
  delivery_methods: DeliveryMethod[]
}

interface ExportTemplate {
  id: string
  name: string
  description: string
  sections: string[]
  format: ExportFormat
  schedule?: ExportSchedule
}
```

### Tipos Auxiliares
```typescript
type ModuleStatus = 'active' | 'inactive' | 'maintenance' | 'error'
type AlertSeverity = 'CRITICAL' | 'ERROR' | 'WARNING' | 'INFO'
type TrendDirection = 'up' | 'down' | 'neutral'
type HealthStatus = 'healthy' | 'degraded' | 'down'
type SystemComponent = 'api' | 'database' | 'queue' | 'providers' | 'cache'
type ExportFrequency = 'daily' | 'weekly' | 'monthly' | 'custom'
type DeliveryMethod = 'email' | 'download' | 'webhook' | 'sftp'

interface QuickSelectOption {
  label: string
  value: string
  days?: number
}

interface ScopeOption {
  id: string
  name: string
  type: 'sport' | 'tipster' | 'league'
  count?: number
}

interface SubMetric {
  label: string
  value: number | string
  change?: number
  trend?: TrendDirection
}

interface HealthAction {
  id: string
  label: string
  action: string
  requires_confirmation: boolean
  risk_level: 'low' | 'medium' | 'high'
}

interface CriticalAlert {
  id: string
  timestamp: string
  severity: AlertSeverity
  type: AlertType
  entity_type: 'user' | 'tipster' | 'signal' | 'system' | 'api'
  entity_id: string
  message: string
  acknowledged: boolean
  acknowledged_by?: string
  acknowledged_at?: string
  actions_available: AlertAction[]
}

interface AlertAction {
  id: string
  label: string
  action: string
  requires_confirmation: boolean
  risk_level: 'low' | 'medium' | 'high'
}

interface QuickAction {
  id: string
  label: string
  icon: string
  action: string
  category: 'user' | 'tipster' | 'signal' | 'finance' | 'support'
  requires_confirmation: boolean
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  permissions_required: string[]
}

interface TablePagination {
  current_page: number
  total_pages: number
  page_size: number
  total_items: number
  show_size_changer: boolean
  page_size_options: number[]
}

interface TableSorting {
  column: string
  direction: 'asc' | 'desc'
  available_columns: string[]
}

interface ErrorMessage {
  component: string
  message: string
  code?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  retry_possible: boolean
}

interface EmptyMessage {
  component: string
  message: string
  icon?: string
  suggestion?: string
  action?: string
}
```

## Definiciones de métricas (Glosario)

- Usuarios activos (rango D/W/M): cuentas no suspendidas/banneadas con al menos una de estas acciones en el rango: login exitoso, compra confirmada (suscripción/créditos), publicación o venta de señal, mensaje enviado en soporte/chat. No incluye visitas sin login ni eventos de bots.
- Ingresos: suma neta de pagos confirmados y liquidados en el periodo. Excluye pagos pendientes, fallidos y reembolsos completados. Para desglose, usar "Ingresos brutos" (incluye pendientes) y "Ingresos netos" (excluye reembolsos).
- Créditos vendidos: total de créditos confirmados y abonados al balance de usuarios en el periodo (neto). Excluye órdenes pendientes/fallidas y descuenta reembolsos.
- Créditos gastados: créditos consumidos en compras de señales/productos dentro del periodo (neto), excluye pruebas/demo.
- Señales publicadas: señales que pasaron de borrador a estado publicado dentro del periodo. No incluye borradores.
- Señales vendidas: ventas confirmadas de señales en el periodo. Excluye órdenes pendientes/fallidas.
- Tasa de conversión: (usuarios que realizaron al menos una compra confirmada en el periodo) / (usuarios activos del periodo). Mostrar porcentaje.
- Winrate promedio: promedio ponderado de aciertos de señales vendidas en el periodo, ponderado por número de picks/eventos por señal.
- ROI promedio: promedio ponderado de ROI de señales vendidas (ganancia neta / inversión) × 100, ponderado por stake/importe.
- Tickets abiertos: número de tickets de soporte en estados abiertos (nuevo, en curso, en espera). Excluye cerrados/resueltos.
- SLA cumplido: porcentaje de tickets cerrados dentro del SLA definido (por severidad) sobre el total de tickets cerrados en el periodo.
- Reembolsos procesados: reembolsos finalizados/abonados en el periodo. Excluye solicitudes pendientes.
- Pagos pendientes: pagos iniciados y aún no confirmados/liquidados en el periodo.
- Payouts procesados: retiros/transferencias a wallet externos completados en el periodo.
- Créditos en balance: créditos disponibles actuales en todos los usuarios (snapshot), no es una métrica de flujo.

## Umbrales y colores de estado (Health/Warn/Degraded/Down)

Reglas generales por proveedor/sistema (aplican a System Health & Providers):
- Healthy (Verde): error_rate < 1% y p95_latency < 500 ms y uptime ≥ 99.9% (últimos 15 min) y backlog en cola < umbral bajo.
- Warn (Amarillo): 1% ≤ error_rate < 3% o 500 ms ≤ p95_latency < 800 ms o backlog medio. Sin pérdida de funcionalidad.
- Degraded (Naranja): 3% ≤ error_rate < 10% o 800 ms ≤ p95_latency < 1200 ms o funcionalidad parcial (timeouts intermitentes, rate limits). Uptime < 99.5%.
- Down (Rojo): sin respuesta > 60 s, 5xx sostenido > 5 min, throughput ~ 0 o dependencia crítica caída. Uptime < 98%.
Notas: los umbrales pueden parametrizarse por proveedor. El estado global se calcula por la peor dependencia crítica.

## Acciones rápidas (Quick Actions)

Bloque superior de acciones operativas (placeholder; enlaces pueden ajustarse según módulos disponibles):
- Crear anuncio/noticia → /admin/news/create
- Revisar pagos pendientes → /admin/payments?status=pending
- Ver retiros/payouts/referrals pendientes → /admin/payouts?status=pending y /admin/referrals?status=review
- Abrir soporte crítico → /admin/support/new?severity=critical
- Revisar tickets VIP → /admin/support?vip=true

## Pending Approvals / Cola de trabajo

Panel tipo inbox con contadores y enlaces directos:
- Tipsters por aprobar (N) → /admin/tipsters/approvals
- Señales en revisión (N) → /admin/signals/review
- Tickets sin asignar (N) → /admin/support/inbox?assigned=false
- Pagos por verificar (N) → /admin/payments/review
- Refunds pendientes (N) → /admin/refunds
Cada ítem muestra badge de severidad/edad cuando aplique.

## Paginación y límites de tablas (contrato HTML)

- Alertas: mostrar Top 6 en dashboard. CTA "Ver más" → /admin/alerts
- Top Tipsters: 10 filas por página. Orden por ROI descendente; desempate por Winrate descendente. CTA "Ver más" → /admin/tipsters/top
- Auditoría rápida: 10 filas por página. CTA "Ver más" → /admin/audit
- Actividad en tiempo real: mostrar últimos 20 eventos con autoscroll suave; CTA "Ver más" → /admin/activity
- Finanzas resumidas: tablas/cards con Top 5 ítems por categoría; CTA "Ver más" → /admin/finance

## Reglas de layout responsive

- Desktop: KPI 4 por fila; luego 2 columnas: Health (2/3) + Alertas (1/3); resto de bloques apilados; tablas en ancho completo dentro de su columna.
- Tablet: KPI 2 por fila; bloques apilados en 1 columna; tablas ancho completo; chips reflow.
- Mobile: todo 1 columna; tablas con scroll horizontal (overflow-x) y columnas clave visibles; chips y badges envuelven.
- Breakpoints sugeridos: ≥1200px (desktop), 768–1199px (tablet), <768px (mobile).
- Cards mantienen padding consistente y tipografías escaladas por viewport.
- Barra de acciones rápidas se contrae a menú en mobile.

## Placeholders de datos — Modo "sin backend"

Patrón único cuando no hay conexión a providers/datos reales:
- Mostrar datos dummy en cards/tablas + badge "Demo" visible en el header del dashboard.
- Incluir CTA primario: "Conectar / habilitar provider" en System Health y en cada bloque dependiente.
- Mostrar mensaje contextual: "Sin conexión" con icono y enlace a configuración de providers.
- Skeleton loaders para tablas; números ejemplo con formato realista; botones en estado disabled donde aplique.
- Toggle "Demo mode" sólo para presentación interna; nunca en producción.
- Al reconectar, reemplazar dummy por datos reales y ocultar badge "Demo" automáticamente.

## Mapa de layout final (orden de secciones)

- Fila 0: Header (título, filtros, chips de estado) — ancho completo.
- Fila 1: KPI Cards (4 por fila en desktop, 2 en tablet, 1 en mobile).
- Fila 2: System Health (2/3) + Alertas & Riesgo (1/3).
- Fila 3: Quick Actions (1/3) + Pending Approvals / Inbox (2/3).
- Fila 4: Top Tipsters (1/2) + Señales con anomalías (1/2).
- Fila 5: Actividad en tiempo real — ancho completo.
- Fila 6: Finanzas resumidas — ancho completo con tabs.
- Fila 7: Soporte — ancho completo.
- Fila 8: Auditoría rápida — ancho completo.

## Iconset y estilo de componentes

- Iconset: usar lucide-react (stroke 1.5) para consistencia; si el proyecto tiene otro set activo, mantenerlo pero seguir tamaños.
- Tamaños: KPI cards ícono 24px; chips 16px; acciones de tabla 18px; colores y estados desde PALETA-COLORES.md.
- Alineación: íconos alineados a texto base, espaciado 8px entre ícono y label; hover con leve cambio de color.
- Accesibilidad: texto alternativo/aria-label en acciones; contraste AA mínimo.

## Estados de acciones peligrosas (Ack/Pause/Suspend)

- Modal de confirmación: campos Motivo (textarea, mínimo 10 caracteres), Checkbox “Confirmo la acción y entiendo el impacto” (requerido), ID de referencia (solo lectura).
- Proceso: al confirmar, deshabilitar botón y mostrar spinner en acción; registrar intento en Audit.
- Si falla: mostrar toast de error, revertir cualquier cambio visual (rollback) y re-habilitar acción.
- Si éxito: toast de éxito, actualizar estado/flag en tabla (Ack/Pause/Suspend) y resaltar fila brevemente.
- Notas: todas estas acciones requieren rol ADMIN y quedan logueadas en Auditoría.
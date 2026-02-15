# 🔧 Módulo: Admin Tipsters

## 🎯 Objetivo
Panel de administración para revisión, verificación, moderación y supervisión de tipsters. Herramienta de compliance y performance para administradores - NO es el perfil del tipster.

**Rol:** Administrador (compliance, moderación, verificación)  
**Ruta:** `/admin/tipsters`  
**Acento visual:** Rojo/Admin (diferenciar de Tipster = violeta, Usuario = verde)

---

## 🎨 Estilo Visual

### Paleta de Colores Admin
```css
--admin-primary: #ef4444;        /* Red */
--admin-secondary: #dc2626;      /* Red oscuro */
--admin-accent: #f87171;         /* Red claro */
--admin-gradient: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
--admin-glow: 0 0 20px rgba(239, 68, 68, 0.4);
```

### Reglas de Consistencia
- ✅ **MANTENER**: Layout, estructura, componentes base
- ✅ **CAMBIAR SOLO**: Color de botón primario, badges, sidebar active, highlights
- ❌ **NO CAMBIAR**: Grid, tipografía, espaciado, iconos

---

## 0. Interfaces Principales del Módulo

```typescript
// Información general del módulo
interface AdminTipstersModule {
  id: 'admin-tipsters'
  name: 'Admin Tipsters'
  description: 'Gestión, revisión y moderación de tipsters'
  route: '/admin/tipsters'
  accent: 'red'
  permissions: ['admin.tipsters.read', 'admin.tipsters.write', 'admin.tipsters.verify']
}

// Header del módulo
interface AdminTipstersHeader {
  title: 'Gestión de Tipsters'
  subtitle: 'Revisión, verificación y moderación de tipsters'
  actions: {
    search: {
      placeholder: 'Buscar por handle, nombre o email...'
      enabled: true
    }
    filters: {
      enabled: true
      quickFilters: ['active', 'review', 'suspended', 'verified']
    }
    refresh: {
      enabled: true
      interval: 30000 // 30 segundos
    }
    export: {
      enabled: true
      formats: ['csv', 'xlsx', 'pdf']
    }
  }
}

// Layout del módulo
interface AdminTipstersLayout {
  container: 'full-width'
  maxWidth: '1920px'
  sections: {
    header: {
      sticky: true
      height: '80px'
    }
    filters: {
      collapsible: true
      defaultOpen: false
    }
    content: {
      type: 'table-with-drawer'
      padding: '24px'
    }
  }
}

// KPIs principales
interface TipstersKPIs {
  total: TotalTipstersKPI
  active: ActiveTipstersKPI
  review: ReviewTipstersKPI
  suspended: SuspendedTipstersKPI
  verified: VerifiedTipstersKPI
  flags: ActiveFlagsKPI
}

interface TotalTipstersKPI {
  label: 'Total Tipsters'
  value: number
  trend: 'up' | 'down' | 'neutral'
  change: number // porcentaje
  icon: 'users'
}

interface ActiveTipstersKPI {
  label: 'Activos'
  value: number
  trend: 'up' | 'down' | 'neutral'
  change: number
  icon: 'activity'
}

interface ReviewTipstersKPI {
  label: 'En Revisión'
  value: number
  trend: 'up' | 'down' | 'neutral'
  change: number
  icon: 'clock'
}

interface SuspendedTipstersKPI {
  label: 'Suspendidos'
  value: number
  trend: 'up' | 'down' | 'neutral'
  change: number
  icon: 'ban'
}

interface VerifiedTipstersKPI {
  label: 'Verificados'
  value: number
  trend: 'up' | 'down' | 'neutral'
  change: number
  icon: 'check-circle'
}

interface ActiveFlagsKPI {
  label: 'Flags Activos'
  value: number
  trend: 'up' | 'down' | 'neutral'
  change: number
  icon: 'flag'
  severity: 'low' | 'medium' | 'high'
}
```

---

## 📋 Estructura del Panel de Administración

---

### 1. Header del Panel de Administración

**Elementos:**
```
┌─────────────────────────────────────────────────────────┐
│ 🔧 Gestión de Tipsters                                  │
│ Verificación, performance y control de calidad           │
│                                                         │
│ [🔍 Search] [⚡ Quick Filters] [🔄 Refresh] [📊 Export]  │
└─────────────────────────────────────────────────────────┘
```

**Componentes:**
```typescript
interface AdminTipstersHeader {
  title: "Gestión de Tipsters"
  subtitle: "Verificación, performance y control de calidad"
  controls: {
    search: {
      placeholder: "Buscar por handle, email o displayName..."
      icon: "🔍"
      debounce: 300
    }
    quickFilters: {
      label: "Filtros rápidos"
      icon: "⚡"
      options: [
        { key: 'all', label: 'Todos', count: 0 },
        { key: 'active', label: 'Activos', count: 0 },
        { key: 'review', label: 'En revisión', count: 0 },
        { key: 'suspended', label: 'Suspendidos', count: 0 }
      ]
    }
    refresh: {
      label: "Actualizar"
      icon: "🔄"
      loadingIcon: "⏳"
    }
    export: {
      label: "Exportar CSV"
      icon: "📊"
      format: 'csv'
      includeFilters: true
    }
  }
}
```

---

### 2. KPIs de Administración (Cards Principales)

**Grid de 6 cards:**
```
┌─────────────┬─────────────┬─────────────┐
│ Total       │ Activos     │ En Revisión │
│ 247         │ 198 (80%)   │ 32 (13%)    │
└─────────────┴─────────────┴─────────────┘
┌─────────────┬─────────────┬─────────────┐
│ Suspendidos │ Verificados │ Flags Activos│
│ 17 (7%)     │ 156 (63%)   │ 89           │
│ ▲ +3        │ ▲ +12       │ ▼ -5        │
└─────────────┴─────────────┴─────────────┘
```

**Detalle de cada KPI:**

#### A) Total Tipsters
```typescript
interface TotalTipstersKPI {
  label: "Total Tipsters"
  value: number
  change: number
  trend: "up" | "down" | "neutral"
  description: "Total de tipsters registrados"
  color: "admin-primary"
  icon: "👥"
  sub_metrics: {
    new_this_month: number
    growth_rate: string
  }
}
```

#### B) Tipsters Activos
```typescript
interface ActiveTipstersKPI {
  label: "Activos"
  value: number
  percentage: string
  change: number
  trend: "up" | "down" | "neutral"
  description: "Tipsters con estado ACTIVE"
  color: "admin-secondary"
  icon: "✅"
  sub_metrics: {
    publishing_signals: number
    avg_signals_per_month: number
  }
}
```

#### C) En Revisión
```typescript
interface ReviewTipstersKPI {
  label: "En Revisión"
  value: number
  percentage: string
  change: number
  trend: "up" | "down" | "neutral"
  description: "Tipsters en proceso de revisión"
  color: "admin-accent"
  icon: "👁️"
  sub_metrics: {
    pending_verification: number
    flagged_compliance: number
  }
}
```

#### D) Suspendidos
```typescript
interface SuspendedTipstersKPI {
  label: "Suspendidos"
  value: number
  percentage: string
  change: number
  trend: "up" | "down" | "neutral"
  description: "Tipsters suspendidos temporalmente"
  color: "red"
  icon: "🚫"
  sub_metrics: {
    suspension_reasons: {
      compliance: number
      performance: number
      user_reports: number
    }
  }
}
```

#### E) Verificados
```typescript
interface VerifiedTipstersKPI {
  label: "Verificados"
  value: number
  percentage: string
  change: number
  trend: "up" | "down" | "neutral"
  description: "Tipsters con verificación completa"
  color: "green"
  icon: "✓"
  sub_metrics: {
    verification_rate: string
    avg_verification_time: string
  }
}
```

#### F) Flags Activos
```typescript
interface ActiveFlagsKPI {
  label: "Flags Activos"
  value: number
  change: number
  trend: "up" | "down" | "neutral"
  description: "Total de flags de compliance activos"
  color: "orange"
  icon: "⚠️"
  sub_metrics: {
    by_severity: {
      high: number
      medium: number
      low: number
    }
    resolution_rate: string
  }
}
```

**Interactividad:**
- Hover: Tooltip con descripción extendida y sub-métricas
- Click: Filtro automático aplicado a la tabla principal

---

### 3. Tabla Principal (Tipster Explorer)

**Visualización de la tabla:**
```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ 👤 Tipster    │ Estado │ Verif. │ ROI 30d │ Win 30d │ DD 30d │ Seg. │ Señales │ Flags │ Actividad │ ⚙️ │
├─────────────────┼────────┼────────┼─────────┼─────────┼────────┼────────┼─────────┼─────────┼─────────────┼────┤
│ 🎯 @CarlosM    │ 🟢 ACT │ ✅ VER │ +12.5%  │ 58.2%   │ -8.3%  │ 1,247  │ 142     │ ⚠️ 2    │ 2h ago      │ 👁️ │
│ ⚽ @MariaTips   │ 🟡 REV │ ⏳ PEN │ +8.7%   │ 52.1%   │ -5.2%  │ 892    │ 89      │ ⚠️ 1    │ 5h ago      │ 👁️ │
│ 🏀 @LuisBet     │ 🔴 SUS │ ❌ UNV │ -2.1%   │ 45.8%   │ -15.7% │ 234    │ 23      │ ⚠️ 4    │ 1d ago      │ 👁️ │
└─────────────────┴────────┴────────┴─────────┴─────────┴────────┴────────┴─────────┴─────────┴─────────────┴────┘
```

**Interfaces TypeScript:**

#### A) Columnas de la Tabla
```typescript
interface TipsterExplorerColumn {
  // Columna: Tipster
  tipster: {
    field: 'tipster'
    label: 'Tipster'
    sortable: true
    render: (tipster: AdminTipster) => {
      avatar: string
      handle: string
      displayName: string
      link: `/admin/tipsters?tipsterId=${tipster.id}`
    }
  }
  
  // Columna: Estado
  status: {
    field: 'status'
    label: 'Estado'
    sortable: true
    render: (status: TipsterStatus) => {
      color: 'green' | 'yellow' | 'red'
      icon: '●'
      label: 'ACTIVE' | 'REVIEW' | 'SUSPENDED'
      actions: {
        pause: { label: 'Pausar', nextStatus: 'REVIEW' }
        activate: { label: 'Activar', nextStatus: 'ACTIVE' }
        suspend: { label: 'Suspender', nextStatus: 'SUSPENDED' }
      }
    }
  }
  
  // Columna: Verificación
  verification: {
    field: 'verification'
    label: 'Verif.'
    sortable: true
    render: (verification: VerificationStatus) => {
      color: 'gray' | 'yellow' | 'green'
      icon: '○' | '⏳' | '✅'
      label: 'UNVERIFIED' | 'PENDING' | 'VERIFIED'
    }
  }
  
  // Columna: ROI 30d
  roi30d: {
    field: 'roi30d'
    label: 'ROI 30d'
    sortable: true
    render: (roi: number) => {
      value: string  // "+12.5%"
      color: 'green' | 'red'
      trend: 'up' | 'down'
    }
  }
  
  // Columna: Winrate 30d
  winrate30d: {
    field: 'winrate30d'
    label: 'Win 30d'
    sortable: true
    render: (winrate: number) => {
      value: string  // "58.2%"
      color: 'green' | 'orange' | 'red'
    }
  }
  
  // Columna: Drawdown 30d
  drawdown30d: {
    field: 'drawdown30d'
    label: 'DD 30d'
    sortable: true
    render: (dd: number) => {
      value: string  // "-8.3%"
      color: 'red'
      severity: 'low' | 'medium' | 'high'
    }
  }
  
  // Columna: Seguidores
  followers: {
    field: 'followers'
    label: 'Seg.'
    sortable: true
    render: (count: number) => {
      value: string  // "1,247"
      growth: number // Cambio vs período anterior
    }
  }
  
  // Columna: Señales 30d
  signals30d: {
    field: 'signals30d'
    label: 'Señales'
    sortable: true
    render: (count: number) => {
      value: number
      avg_per_week: number
    }
  }
  
  // Columna: Flags Compliance
  flags: {
    field: 'flags'
    label: 'Flags'
    sortable: true
    render: (flags: ComplianceFlag[]) => {
      count: number
      severity: {
        high: number
        medium: number
        low: number
      }
      tooltip: string[]
    }
  }
  
  // Columna: Última Actividad
  lastActivity: {
    field: 'lastActivity'
    label: 'Actividad'
    sortable: true
    render: (date: Date) => {
      relative: string  // "2h ago"
      exact: string     // "2024-01-15 14:30"
    }
  }
  
  // Columna: Acciones
  actions: {
    field: 'actions'
    label: '⚙️'
    sortable: false
    render: () => {
      view: { label: 'Ver', icon: '👁️' }
      review: { label: 'Revisar', icon: '📝' }
      quickActions: [
        { label: 'Pausar', action: 'pause' },
        { label: 'Suspender', action: 'suspend' }
      ]
    }
  }
}
```

#### B) Comportamiento de la Tabla
```typescript
interface TipsterExplorerTable {
  // Configuración
  defaultSort: {
    field: 'lastActivity'
    order: 'desc'
  }
  
  // Paginación
  pagination: {
    pageSize: 25
    pageSizeOptions: [10, 25, 50, 100]
    showSizeChanger: true
  }
  
  // Selección
  rowSelection: {
    enabled: true
    type: 'checkbox'
    onSelect: (selectedRows: AdminTipster[]) => void
  }
  
  // Scroll
  scroll: {
    x: 'max-content'  // Scroll horizontal en móviles
    y: 'calc(100vh - 300px)'  // Altura fija con scroll
  }
  
  // Responsive
  responsive: {
    breakpoint: 'md'
    mobileColumns: ['tipster', 'status', 'roi30d', 'flags', 'actions']
  }
  
  // Loading
  loading: {
    skeleton: true
    rows: 10
  }
  
  // Empty state
  emptyState: {
    message: "No se encontraron tipsters"
    description: "Intenta ajustar los filtros o buscar con otros términos"
    action: {
      label: "Limpiar filtros"
      onClick: () => void
    }
  }
}
```

---

## 3. Compliance Flags (MVP)

Listado base de flags de cumplimiento para el MVP, con su severidad y visualización.

| Flag Code              | Descripción                                       | Severidad | UI en Tabla                                      |
| ---------------------- | ------------------------------------------------- | :-------: | ------------------------------------------------ |
| `ODDS_DRIFT_HIGH`      | Desviación de cuota > 15% entre publicación y cierre. |   HIGH    | Chip rojo en tooltip.                            |
| `LATE_BETS_FREQUENT`   | > 20% de señales publicadas < 5 min antes del evento. |   HIGH    | Chip rojo en tooltip.                            |
| `STAKE_INCONSISTENCY`  | Variación de stake > 3x la media sin justificación. |  MEDIUM   | Chip naranja en tooltip.                         |
| `LOW_ACTIVITY`         | < 5 señales en los últimos 30 días.               |    LOW    | Chip amarillo en tooltip.                        |
| `HIGH_CANCEL_RATE`     | > 10% de señales canceladas post-publicación.     |  MEDIUM   | Chip naranja en tooltip.                         |
| `USER_REPORTS_HIGH`    | > 3 reportes de usuarios en una misma señal.      |   HIGH    | Chip rojo en tooltip.                            |
| `PROFILE_INCOMPLETE`   | Perfil profesional con menos del 70% completado.  |    LOW    | Chip amarillo en tooltip.                        |

- **Visualización:** La columna "Flags compliance" muestra un contador (`+N`). Al hacer hover, un tooltip lista los flags activos con chips de color según la severidad.

---

## 4. Filtros Avanzados

```typescript
interface TipstersFilters {
  // Estado
  status: {
    label: 'Estado'
    type: 'checkbox-group'
    options: ['ACTIVE', 'REVIEW', 'SUSPENDED']
    defaultValue: ['ACTIVE']
  }
  
  // Verificación
  verification: {
    label: 'Verificación'
    type: 'checkbox-group'
    options: ['UNVERIFIED', 'PENDING', 'VERIFIED']
    defaultValue: []
  }
  
  // Riesgo/Compliance
  risk: {
    label: 'Flags de Compliance'
    type: 'multiselect'
    options: [
      'ODDS_DRIFT_HIGH',
      'LATE_BETS_FREQUENT', 
      'STAKE_INCONSISTENCY',
      'LOW_ACTIVITY',
      'HIGH_CANCEL_RATE',
      'USER_REPORTS_HIGH',
      'PROFILE_INCOMPLETE'
    ]
    defaultValue: []
  }
  
  // Métricas de Performance
  performance: {
    roi: {
      label: 'ROI (%)'
      type: 'range'
      min: -100
      max: 100
      step: 0.1
    }
    winrate: {
      label: 'Winrate (%)'
      type: 'range'
      min: 0
      max: 100
      step: 1
    }
    drawdown: {
      label: 'Drawdown Máx (%)'
      type: 'range'
      min: 0
      max: 100
      step: 1
    }
  }
  
  // Rango de fechas
  dateRange: {
    label: 'Última Actividad'
    type: 'date-range'
    presets: ['today', 'yesterday', 'last7days', 'last30days', 'last90days']
  }
  
  // Deporte/Liga (placeholder)
  sport: {
    label: 'Especialidad'
    type: 'multiselect'
    options: string[] // dinámico
    placeholder: 'Seleccionar deportes...'
  }
  
  // Búsqueda
  search: {
    label: 'Búsqueda'
    type: 'text'
    placeholder: 'Handle, nombre o email...'
  }
}

Panel colapsable sobre la tabla para refinar la búsqueda.

- **Estado:** Checkboxes para `ACTIVE`, `REVIEW`, `SUSPENDED`.
- **Verificación:** Checkboxes para `UNVERIFIED`, `PENDING`, `VERIFIED`.
- **Riesgo/Compliance:**
  - Dropdown para seleccionar flags específicos (e.g., `ODDS_DRIFT_HIGH`, `LATE_BETS_FREQUENT`).
  - Checkbox "Tiene anomalías" para filtrar tipsters con cualquier flag.
- **Métricas de Performance:**
  - `ROI min/max`: Rango de ROI.
  - `Winrate min/max`: Rango de Winrate.
  - `Drawdown max`: Drawdown máximo aceptado.
- **Rango de fechas:** Para `Última actividad`.
- **Deporte/Liga:** (Placeholder) Filtro por especialidad.

---

## 5. Tipster Detail Drawer

Se abre al hacer clic en un tipster. Usa tabs para organizar la información.

### A) Overview

```typescript
interface TipsterDetailDrawer {
  // Información básica
  tipster: AdminTipster
  
  // Tabs disponibles
  tabs: {
    overview: TipsterOverviewTab
    signals: TipsterSignalsTab
    compliance: TipsterComplianceTab
    subscribers: TipsterSubscribersTab
    finances: TipsterFinancesTab
    support: TipsterSupportTab
    audit: TipsterAuditTab
  }
  
  // Estado del drawer
  state: {
    loading: boolean
    activeTab: string
    hasChanges: boolean
  }
  
  // Acciones
  actions: {
    close: () => void
    refresh: () => void
    save: () => void
  }
}

interface TipsterOverviewTab {
  // Identidad
  identity: {
    avatar: string
    handle: string
    displayName: string
    email: string
    joinDate: string
  }
  
  // Estado actual
  status: {
    current: 'ACTIVE' | 'REVIEW' | 'SUSPENDED'
    changeable: boolean
    lastStatusChange: string
    statusHistory: StatusChange[]
  }
  
  // Verificación
  verification: {
    status: 'UNVERIFIED' | 'PENDING' | 'VERIFIED'
    documents: VerificationDocument[]
    reviewNotes: string
    reviewer: string
    reviewedAt: string
  }
  
  // KPIs rápidos
  kpis: {
    roi: {
      '7d': number
      '30d': number
      '90d': number
      'ytd': number
    }
    winrate: {
      '7d': number
      '30d': number
      '90d': number
      'ytd': number
    }
    drawdown: {
      '30d': number
      '90d': number
      'ytd': number
    }
    followers: {
      current: number
      growth30d: number
    }
    signals: {
      total30d: number
      averagePerWeek: number
    }
  }
}

interface TipsterSignalsTab {
  // Tabla de señales recientes
  recentSignals: {
    data: AdminSignal[]
    columns: string[]
    pagination: PaginationConfig
    loading: boolean
  }
  
  // Indicadores de calidad
  qualityIndicators: {
    oddsDrift: number // porcentaje de señales con drift
    userReports: number // reportes por señal
    cancellations: number // cancelaciones
    inconsistencies: number // inconsistencias detectadas
  }
  
  // Acciones
  actions: {
    viewAllSignals: () => void // navega a /admin/signals?tipsterId={id}
    exportSignals: () => void
  }
}

interface TipsterComplianceTab {
  // Flags activos
  activeFlags: {
    flags: ComplianceFlag[]
    total: number
    bySeverity: {
      high: number
      medium: number
      low: number
    }
  }
  
  // Historial de revisiones
  reviewHistory: {
    actions: ModerationAction[]
    total: number
    lastAction: string
  }
  
  // Acciones disponibles
  availableActions: {
    markForReview: {
      enabled: boolean
      requiresReason: boolean
    }
    approveVerification: {
      enabled: boolean
      requiresDocuments: boolean
    }
    rejectVerification: {
      enabled: boolean
      requiresReason: boolean
    }
    suspend: {
      enabled: boolean
      requiresConfirmation: boolean
      requiresCheckbox: boolean
    }
  }
}
- **Identidad:** Avatar, `handle`, `displayName`, `email`.
- **Estado:** `ACTIVE`, `REVIEW`, `SUSPENDED` con opción de cambio.
- **Verificación:** `UNVERIFIED`, `PENDING`, `VERIFIED` con acciones.
- **KPIs rápidos:**
  - ROI (7d / 30d / 90d / YTD)
  - Winrate (7d / 30d / 90d / YTD)
  - Drawdown (30d / 90d / YTD)
  - Seguidores y Señales (30d)

### B) Señales & Calidad
- **Tabla de señales recientes:**
  - `Evento`, `Cuota`, `Stake`, `Resultado`, `EV` (placeholder), `Estado`.
- **Indicadores de calidad:**
  - Iconos junto a cada señal para `Odds drift`, `Reportes de usuarios`, `Cancelaciones`, `Inconsistencias`.
- **CTA:** Botón "Ver todas las señales" que lleva a `/admin/signals?tipsterId={id}`.

### C) Compliance / Riesgo
- **Flags activos:** Lista de flags de riesgo actuales con descripción.
- **Historial de revisiones:** Log de acciones de moderación (`SUSPENDED`, `REVIEW_MARK`, etc.).
- **Botones de acción:**
  - `Marcar en revisión`
  - `Aprobar verificación`
  - `Rechazar verificación`
  - `Suspender tipster`
  - (Todas las acciones requieren un motivo y abren un modal de confirmación).

### D) Suscriptores
- **KPIs:** Suscriptores activos, cancelaciones, tasa de churn (placeholder).
- **Tabla de suscriptores recientes.**
- **CTA:** Link a `/admin/subscriptions?tipsterId={id}`.

### E) Finanzas (Placeholder)
- **KPIs:** Ingresos generados, créditos recibidos.
- **CTA:** Link a `/admin/finance?tipsterId={id}`.

### F) Soporte
- **Tickets relacionados:** Lista de tickets de soporte abiertos por este usuario.
- **CTA:** Link a `/admin/support?userId={id}`.

### G) Auditoría
- **Log de eventos:** Cambios de estado, verificaciones, etc., realizados por administradores.
- **CTA:** Link a `/admin/audit?entity=tipster&entityId={id}`.

---

## 6. Acciones Masivas

Disponibles al seleccionar múltiples tipsters en la tabla principal.

- **Acciones:**
  - `Pausar tipsters` (mueve a REVIEW)
  - `Reactivar tipsters`
  - `Exportar seleccionados`
- **Reglas:**
  - Modal de confirmación si se seleccionan >10 tipsters.
  - Preview de los afectados antes de ejecutar la acción.

---

## 7. Modales Críticos

### Aprobar/Rechazar Verificación

```typescript
interface VerificationModal {
  // Tipo de acción
  action: 'approve' | 'reject'
  
  // Tipster objetivo
  tipster: {
    id: string
    handle: string
    displayName: string
  }
  
  // Campos del formulario
  form: {
    reason: {
      label: string
      required: boolean
      placeholder: string
      maxLength: number
    }
    internalNote: {
      label: string
      required: boolean
      placeholder: string
      maxLength: number
      adminOnly: boolean
    }
    notifyUser: {
      label: string
      default: boolean
      type: 'toggle'
    }
  }
  
  // Acciones
  actions: {
    confirm: {
      label: string
      loading: boolean
      disabled: boolean
    }
    cancel: {
      label: string
    }
  }
  
  // Estado
  state: {
    isOpen: boolean
    isSubmitting: boolean
    errors: Record<string, string>
  }
}

interface SuspensionModal {
  // Tipster objetivo
  tipster: {
    id: string
    handle: string
    displayName: string
  }
  
  // Advertencia
  warning: {
    title: string
    message: string
    severity: 'warning' | 'error'
  }
  
  // Campos del formulario
  form: {
    reason: {
      label: string
      required: true
      placeholder: string
      maxLength: number
      minLength: number
    }
    acknowledgment: {
      label: string
      required: true
      type: 'checkbox'
    }
  }
  
  // Acciones
  actions: {
    suspend: {
      label: string
      loading: boolean
      disabled: boolean // requiere checkbox marcado
    }
    cancel: {
      label: string
    }
  }
  
  // Estado
  state: {
    isOpen: boolean
    isSubmitting: boolean
    errors: Record<string, string>
    canSuspend: boolean // checkbox marcado
  }
}
- **Campos del modal:**
  - **Motivo:** (Opcional para aprobar, obligatorio para rechazar) Textarea para justificar la decisión.
  - **Nota interna:** (Opcional) Campo de texto solo visible para administradores.
  - **Notificar al tipster:** (Toggle, activado por defecto) Checkbox para enviar una notificación al usuario sobre el cambio de estado.
- **Acciones:** `Confirmar Aprobación` / `Confirmar Rechazo`, `Cancelar`.
- **Audit Log:** Al confirmar, se registra un evento en la pestaña "Auditoría" con: `adminId`, `tipsterId`, `acción` (VERIFIED/REJECTED), `motivo`, `nota_interna`, `notificado` (true/false).

### Suspender Tipster
- **Contenido:** "ADVERTENCIA: Vas a SUSPENDER a {handle}."
- **Input:** Motivo (obligatorio, textarea).
- **Checkbox:** "Entiendo que esta acción bloqueará el acceso del tipster."
- **Acciones:** `Suspender` (deshabilitado hasta marcar el checkbox), `Cancelar`.

---

## 8. Estados de la Interfaz (UI States)

- **Loading:** Skeletons para la tabla y el drawer.
- **Empty:** Mensaje "No se encontraron tipsters" con un CTA para "Limpiar filtros".
- **Error:** Mensaje de error general con opción de "Reintentar".
- **Partial:**
  - **Caso 1: Falla en proveedor de métricas.** La tabla de tipsters se muestra, pero las columnas de performance (ROI, Winrate, etc.) aparecen como `--` con un icono de advertencia. El tooltip explica: "No se pudieron cargar las métricas de performance".
  - **Caso 2: Falla en una pestaña del drawer.** El drawer carga, pero una de las pestañas (e.g., "Señales") falla y muestra un mensaje de error localizado con un botón "Reintentar" solo para esa sección.

---

## 10. Tipos Auxiliares y Enums

```typescript
// Tipos de estado del tipster
type TipsterStatus = 'ACTIVE' | 'REVIEW' | 'SUSPENDED'
type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED'
type RiskSeverity = 'low' | 'medium' | 'high'

// Tipos de flags de compliance
type ComplianceFlagCode = 
  | 'ODDS_DRIFT_HIGH'
  | 'LATE_BETS_FREQUENT'
  | 'STAKE_INCONSISTENCY'
  | 'LOW_ACTIVITY'
  | 'HIGH_CANCEL_RATE'
  | 'USER_REPORTS_HIGH'
  | 'PROFILE_INCOMPLETE'

interface ComplianceFlag {
  code: ComplianceFlagCode
  description: string
  severity: RiskSeverity
  triggeredAt: string
  triggeredBy: string
  context?: Record<string, any>
}

// Acciones de moderación
interface ModerationAction {
  id: string
  action: 'SUSPENDED' | 'REVIEW_MARK' | 'VERIFIED' | 'REJECTED'
  reason: string
  adminId: string
  adminName: string
  timestamp: string
  internalNote?: string
  notified: boolean
}

// Documentos de verificación
interface VerificationDocument {
  id: string
  type: 'IDENTITY' | 'ADDRESS' | 'BANK' | 'EXPERIENCE'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  fileUrl: string
  uploadedAt: string
  reviewedAt?: string
  reviewer?: string
  rejectionReason?: string
}

// Cambios de estado
interface StatusChange {
  from: TipsterStatus
  to: TipsterStatus
  changedAt: string
  changedBy: string
  reason?: string
}

// Acciones masivas
interface BulkAction {
  action: 'pause' | 'reactivate' | 'export'
  selectedTipsters: AdminTipster[]
  requiresConfirmation: boolean
  confirmationThreshold: number // 10 tipsters
}

// Estados de UI
interface UIState {
  loading: boolean
  error: string | null
  empty: boolean
  partial: boolean
}

// Configuración de paginación
interface PaginationConfig {
  current: number
  pageSize: number
  total: number
  showSizeChanger: boolean
  pageSizeOptions: number[]
}

// Configuración de exportación
interface ExportConfig {
  formats: Array<'csv' | 'xlsx' | 'pdf'>
  sections: Array<'overview' | 'signals' | 'compliance' | 'subscribers'>
  filters: Partial<TipstersFilters>
  selectedIds?: string[]
}
  - **Caso 1: Falla en proveedor de métricas.** La tabla de tipsters se muestra, pero las columnas de performance (ROI, Winrate, etc.) aparecen como `--` con un icono de advertencia. El tooltip explica: "No se pudieron cargar las métricas de performance".
  - **Caso 2: Falla en una pestaña del drawer.** El drawer carga, pero una de las pestañas (e.g., "Señales") falla y muestra un mensaje de error localizado con un botón "Reintentar" solo para esa sección.

---

## 9. Query Params Estándar

La URL debe reflejar el estado de la interfaz para poder compartirla. Los filtros multi-selección usarán el formato CSV (Comma-Separated Values).

`?q={search}&status=ACTIVE,REVIEW&verification=VERIFIED&risk=ODDS_DRIFT_HIGH&roiMin={min}&roiMax={max}&page={num}&limit={num}&sort=roi30d:desc&tipsterId={id}&tab=overview`
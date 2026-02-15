# 📡 Módulo: Admin Signals

## 🎯 Objetivo
Centro de control global para supervisión, moderación y control operativo de TODAS las señales del sistema: tipsters humanos, IA y Curated (editorial/sistema).

**Enfoque administrativo:** calidad, compliance, riesgos, anomalías, trazabilidad y acciones de moderación.

**Rol:** Admin (control total del sistema)  
**Ruta:** `/admin/signals`  
**Acento visual:** Rojo/Admin (diferenciar de Usuario = verde, Tipster = violeta)

## 📋 Interfaces TypeScript

### Interfaces Principales

```typescript
// Información general del módulo
interface AdminSignalsModule {
  module: 'admin-signals';
  role: 'admin';
  route: '/admin/signals';
  visualAccent: 'red-admin';
  keyPrinciple: 'Control y supervisión global de señales';
}

// Header del panel
interface AdminSignalsHeader {
  title: string; // "Gestión de Señales"
  subtitle: string; // "Supervisión y control de todas las señales del sistema"
  search: {
    placeholder: string;
    enabled: boolean;
  };
  quickActions: Array<{
    icon: string;
    label: string;
    action: 'export_csv' | 'refresh_data' | 'open_settings' | 'bulk_actions';
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

// Layout principal
interface AdminSignalsLayout {
  sidebar: 'admin-sidebar';
  kpis: SignalKPIs;
  mainContent: {
    tabs: SignalTabsConfig;
    activeTab: string;
  };
  queryParams: AdminSignalsQueryParams;
}

// KPIs principales
interface SignalKPIs {
  totalSignals: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
    description: string;
  };
  activeSignals: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
    description: string;
  };
  inReview: {
    value: number;
    urgent: boolean;
    description: string;
  };
  anomalies: {
    value: number;
    critical: boolean;
    description: string;
  };
  revokedSignals: {
    value: number;
    change: number;
    description: string;
  };
  executedRate: {
    value: number;
    percentage: number;
    description: string;
  };
}

// Configuración de tabs
interface SignalTabsConfig {
  overview: {
    label: 'Resumen';
    icon: '📊';
    description: 'KPIs generales y métricas de sistema';
    badge?: number;
  };
  review: {
    label: 'Revisión';
    icon: '👁️';
    description: 'Cola de moderación y aprobación';
    badge?: number;
    columns: SignalTableColumn[];
  };
  anomalies: {
    label: 'Anomalías';
    icon: '🚨';
    description: 'Detección de patrones sospechosos';
    badge?: number;
    columns: SignalTableColumn[];
  };
  revoked: {
    label: 'Revocadas';
    icon: '❌';
    description: 'Señales revocadas por moderación';
    badge?: number;
    columns: SignalTableColumn[];
  };
  executed: {
    label: 'Ejecutadas';
    icon: '✅';
    description: 'Señales ejecutadas por usuarios';
    badge?: number;
    columns: SignalTableColumn[];
  };
  providers: {
    label: 'Proveedores';
    icon: '🔗';
    description: 'Análisis de fuentes de señales';
    badge?: number;
    columns: ProviderTableColumn[];
  };
}
```

### Interfaces de Tablas y Filtros

```typescript
// Columnas de tabla para señales
interface SignalTableColumn {
  key: string;
  label: string;
  sortable: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any) => string;
}

// Columnas de tabla para proveedores
interface ProviderTableColumn {
  key: string;
  label: string;
  sortable: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

// Filtros avanzados
interface SignalFilters {
  mode: 'pre' | 'live' | 'all';
  status: string[];
  source: string[];
  sport?: string;
  league?: string;
  tipsterId?: string;
  hasReports?: boolean;
  flagged?: boolean;
  complianceHold?: boolean;
  dateRange: {
    from?: string;
    to?: string;
    preset?: 'today' | '7d' | '30d' | 'custom';
  };
}

// Query params oficiales
interface AdminSignalsQueryParams {
  tab: 'overview' | 'review' | 'anomalies' | 'revoked' | 'executed' | 'providers';
  mode?: 'pre' | 'live' | 'all';
  status?: string;
  source?: string;
  tipsterId?: string;
  sport?: string;
  league?: string;
  from?: string;
  to?: string;
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  hasReports?: boolean;
  flagged?: boolean;
  complianceHold?: boolean;
}
```

### Interfaces de Componentes

```typescript
// Componente de tabla de señales
interface SignalsTable {
  data: Signal[];
  columns: SignalTableColumn[];
  loading: boolean;
  pagination: {
    current: number;
    total: number;
    pageSize: number;
  };
  sortConfig?: {
    field: string;
    order: 'ASC' | 'DESC';
  };
  selectedRows: string[];
  bulkActions: Array<{
    key: string;
    label: string;
    action: () => void;
    confirm?: boolean;
  }>;
}

// Componente de detalle de señal (Drawer)
interface SignalDetailDrawer {
  signal: Signal;
  activeTab: 'overview' | 'quality' | 'execution' | 'reports' | 'audit';
  tabs: Array<{
    key: string;
    label: string;
    content: React.Component;
  }>;
  actions: Array<{
    key: string;
    label: string;
    variant: 'primary' | 'secondary' | 'danger';
    confirm?: boolean;
    reasonRequired?: boolean;
  }>;
}

// Componente de filtros
interface SignalFiltersPanel {
  filters: SignalFilters;
  onFiltersChange: (filters: SignalFilters) => void;
  onReset: () => void;
  quickFilters: Array<{
    key: string;
    label: string;
    active: boolean;
    count?: number;
  }>;
}

// Componente de acciones masivas
interface BulkActionsModal {
  selectedSignals: string[];
  action: 'block' | 'revoke' | 'approve' | 'flag';
  reason: string;
  requireConfirmation: boolean;
  safetyChecks: Array<{
    type: string;
    message: string;
    passed: boolean;
  }>;
}
```

### Tipos Auxiliares

```typescript
// Estados de señal
type SignalStatus = 'new' | 'active' | 'expired' | 'suggested' | 'executed' | 'blocked' | 'not_eligible' | 'revoked' | 'withdrawn' | 'archived';

// Fuentes de señal
type SignalSource = 'tipster' | 'ai' | 'master' | 'curated';

// Tipos de anomalía
type AnomalyType = 'odds_drift' | 'late_signal' | 'spam_pattern' | 'duplicate' | 'low_confidence' | 'suspicious_timing';

// Razones de moderación
type ModerationReason = 'ODDS_DRIFT' | 'MARKET_CLOSED' | 'LATE_SIGNAL' | 'INVALID_SELECTION' | 'DUPLICATE_SIGNAL' | 'SPAM_PATTERN' | 'LOW_CONFIDENCE' | 'PROVIDER_ERROR' | 'MANUAL_ADMIN_BLOCK' | 'COMPLIANCE_REVIEW';

// Etiquetas de calidad
type QualityLabel = 'clean' | 'review' | 'flagged';

// Tipos de proveedor
type ProviderType = 'api' | 'webhook' | 'ai' | 'curated';

// Estado de proveedor
type ProviderStatus = 'healthy' | 'degraded' | 'offline';
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

## 📋 Estructura del Módulo

### 1) Concepto Central y Propósito (Admin)

**Centro de control global de TODAS las señales:**
- ✅ Tipsters humanos verificados y en revisión
- ✅ Señales generadas por IA (algoritmos)
- ✅ Señales Curated (editorial/sistema)

**Funciones principales:**
- 🔍 **Supervisión de calidad** - Monitorear métricas y patrones
- ⚖️ **Compliance y regulación** - Asegurar cumplimiento normativo
- 🚨 **Gestión de riesgos** - Detectar anomalías y patrones sospechosos
- 📊 **Trazabilidad completa** - Auditoría de todas las acciones
- 🛠️ **Moderación activa** - Aprobar, bloquear, revocar señales

**Diferencias clave con otros módulos:**
- ❌ **NO es marketplace de usuario** (consumo/ejecución)
- ❌ **NO es gestión personal del tipster** (creación/lifecycle propio)
- ✅ **ES supervisión y control operativo** - Vista administrativa global

### 2) Ruta y Navegación

#### 2.1. Ruta Principal
```
/admin/signals
```

#### 2.2. Query Params Oficiales (Sincronización UI/URL)
```typescript
interface AdminSignalsQueryParams {
  // Tabs principales
  tab: 'overview' | 'review' | 'anomalies' | 'revoked' | 'executed' | 'providers'
  
  // Filtros de modalidad
  mode: 'pre' | 'live' | 'all'
  
  // Filtros de estado
  status: 'new' | 'active' | 'expired' | 'suggested' | 'executed' | 'blocked' | 'not_eligible' | 'revoked' | 'withdrawn' | 'archived'
  
  // Filtros de fuente
  source: 'tipster' | 'ai' | 'master' | 'all'
  
  // Filtros específicos
  tipsterId?: string        // Deep link desde /admin/tipsters
  sport?: string
  league?: string
  
  // Rango de fechas (ISO)
  from?: string            // Fecha inicio (YYYY-MM-DD)
  to?: string              // Fecha fin (YYYY-MM-DD)
  
  // Búsqueda y paginación
  q?: string               // Search query
  page?: number            // Página actual
  limit?: number           // Items por página
  sort?: string            // Campo de ordenamiento
  order?: 'ASC' | 'DESC'   // Dirección de orden
  
  // Filtros de calidad
  hasReports?: boolean      // Con reportes
  flagged?: boolean        // Marcadas para revisión
  complianceHold?: boolean // En hold de compliance
}
```

#### 2.3. Ejemplos de URLs
```
/admin/signals?tab=overview&mode=all
/admin/signals?tab=review&source=tipster&from=2026-02-01&to=2026-02-11
/admin/signals?tipsterId=tipster_001&mode=pre&status=active
/admin/signals?tab=anomalies&source=all&hasReports=true
```

#### 2.4. Sidebar Navigation
**Usar SIDEBAR-ADMIN con item activo:**
```typescript
interface AdminSidebar {
  sections: [
    {
      title: "Gestión",
      items: [
        { icon: "⚙️", label: "Dashboard", path: "/admin", active: false },
        { icon: "📡", label: "Señales", path: "/admin/signals", active: true },
        { icon: "👥", label: "Usuarios", path: "/admin/users", active: false },
        { icon: "📊", label: "Tipsters", path: "/admin/tipsters", active: false }
      ]
    }
  ]
}
```

### 3) Estructura de la Página (Wireframe)

#### 3.1. Header Principal
```typescript
interface AdminSignalsHeader {
  title: "Gestión de Señales"
  subtitle: "Supervisión y control de todas las señales del sistema"
  actions: [
    { icon: "📊", label: "Exportar CSV", action: "export_csv" },
    { icon: "🔄", label: "Refrescar", action: "refresh_data" },
    { icon: "⚙️", label: "Configuración", action: "open_settings" }
  ]
}
```

#### 3.2. Quick Controls (Sticky)
```typescript
interface QuickControls {
  modeSelector: {
    options: [
      { value: 'pre', label: 'Pre-Partido', icon: '⏰' },
      { value: 'live', label: 'En Vivo', icon: '⚡' },
      { value: 'all', label: 'Todas', icon: '🔄' }
    ]
  }
  dateRange: {
    presets: [
      { value: 'today', label: 'Hoy' },
      { value: '7d', label: '7 días' },
      { value: '30d', label: '30 días' },
      { value: 'custom', label: 'Personalizado' }
    ]
  }
  quickFilters: [
    { key: 'flagged', label: 'Con Reportes', badge: true },
    { key: 'anomalies', label: 'Anomalías', badge: true },
    { key: 'compliance', label: 'Compliance', badge: true }
  ]
}
```

#### 3.3. Tabs Principales
```typescript
interface AdminSignalsTabs {
  tabs: [
    {
      key: 'overview',
      label: 'Resumen',
      icon: '📊',
      badge?: number,        // Total señales
      description: 'KPIs generales y métricas de sistema'
    },
    {
      key: 'review',
      label: 'Revisión',
      icon: '👁️',
      badge?: number,        // Pendientes revisión
      description: 'Cola de moderación y aprobación'
    },
    {
      key: 'anomalies',
      label: 'Anomalías',
      icon: '🚨',
      badge?: number,        // Anomalías detectadas
      description: 'Detección de patrones sospechosos'
    },
    {
      key: 'revoked',
      label: 'Revocadas',
      icon: '❌',
      badge?: number,        // Señales revocadas
      description: 'Señales revocadas por moderación'
    },
    {
      key: 'executed',
      label: 'Ejecutadas',
      icon: '✅',
      badge?: number,        // Señales ejecutadas
      description: 'Métricas de ejecución y rendimiento'
    },
    {
      key: 'providers',
      label: 'Proveedores',
      icon: '🔗',
      badge?: 'status',      // Estado de salud
      description: 'Salud de proveedores y feeds'
    }
  ]
}
```

#### 3.4. Contenido por Tab

**📊 Tab: Overview**
```typescript
interface OverviewTab {
  kpis: [
    { label: 'Total Señales', value: number, trend: number, icon: '📡' },
    { label: 'Activas', value: number, trend: number, icon: '🟢' },
    { label: 'Flagged', value: number, trend: number, icon: '🚩' },
    { label: 'Ejecutadas', value: number, trend: number, icon: '✅' }
  ]
  charts: {
    executionChart: 'line',      // Gráfico de ejecución temporal
    distributionChart: 'donut',  // Distribución por fuente
    qualityChart: 'bar'          // Métricas de calidad
  }
}
```

**👁️ Tab: Review**
```typescript
interface ReviewTab {
  queue: SignalReviewItem[]
  filters: ReviewFilters
  actions: ReviewActions
  bulkOperations: boolean
}
```

**🚨 Tab: Anomalies**
```typescript
interface AnomaliesTab {
  detectionTypes: [
    'odds_drift',     // Desviación de cuotas
    'spam_patterns',  // Patrones spam
    'quality_drop',   // Caída de calidad
    'timing_issues'   // Problemas de timing
  ]
  alerts: AnomalyAlert[]
  autoActions: AutoActionConfig
}
```

#### 3.5. Sticky Filters Avanzados
```typescript
interface AdminSignalsFilters {
  search: {
    placeholder: "Buscar por evento, tipster, ID..."
    fields: ['event', 'tipster', 'market', 'id']
  }
  source: {
    options: [
      { value: 'all', label: 'Todas las fuentes' },
      { value: 'tipster', label: 'Tipsters' },
      { value: 'ai', label: 'IA' },
      { value: 'master', label: 'Curated' }
    ]
  }
  status: {
    options: StatusOption[]  // Ver sección 5 para detalles
  }
  quality: {
    minConfidence: number   // 0-100
    minEV: number          // Expected Value
    maxDrift: number       // Máximo drift permitido
  }
  tipsterId: {
    type: 'select' | 'search'
    allowMultiple: boolean
  }
}
```

### 4) Filtros Sticky (Siempre Visibles)

#### 4.1. Layout de Filtros
```
┌─────────────────────────────────────────────────────────────────────┐
│ 🔍 Search │ 📡 Source │ ⚡ Status │ 🏆 Sport │ 📅 Date Range │ ... │
└─────────────────────────────────────────────────────────────────────┘
```

#### 4.2. Interfaces de Filtros
```typescript
interface AdminSignalsFilters {
  // Búsqueda principal
  search: {
    placeholder: "Buscar por evento, tipster, ID de señal..."
    debounceMs: 300
    fields: ['event.name', 'tipster.name', 'signal.id', 'market.name']
  }
  
  // Fuente de la señal
  source: {
    type: 'multi-select'
    options: [
      { value: 'tipster', label: 'Tipsters Verificados', icon: '👤' },
      { value: 'ai', label: 'IA/Algoritmos', icon: '🤖' },
      { value: 'master', label: 'Curated/Sistema', icon: '⭐' }
    ]
    default: ['tipster', 'ai', 'master']
  }
  
  // Estado de la señal
  status: {
    type: 'multi-select'
    options: StatusOption[]  // Ver sección 5.2
    groupBy: 'category'       // Agrupar por categoría
  }
  
  // Deporte y liga
  sport: {
    type: 'cascading'
    placeholder: "Seleccionar deporte..."
    showLeagueCount: true
  }
  
  // Rango de fechas
  dateRange: {
    type: 'date-range-picker'
    presets: [
      { label: 'Hoy', value: 'today' },
      { label: 'Últimos 7 días', value: '7d' },
      { label: 'Últimos 30 días', value: '30d' },
      { label: 'Este mes', value: 'month' },
      { label: 'Personalizado', value: 'custom' }
    ]
    maxRange: 90  // Días máximos permitidos
  }
  
  // Banderas y calidad
  flags: {
    hasReports: {
      label: 'Con reportes'
      description: 'Señales reportadas por usuarios'
    }
    flagged: {
      label: 'Marcadas para revisión'
      description: 'Marcadas por sistema o moderadores'
    }
    complianceHold: {
      label: 'Hold de compliance'
      description: 'Bloqueadas por compliance'
    }
  }
  
  // Métricas de calidad
  quality: {
    minConfidence: {
      label: 'Confianza mínima'
      type: 'slider'
      range: [0, 100]
      step: 5
    }
    minEV: {
      label: 'EV mínimo'
      type: 'number'
      suffix: '%'
    }
    maxDrift: {
      label: 'Drift máximo'
      type: 'number'
      suffix: '%'
    }
  }
  
  // Tipster específico
  tipsterId: {
    type: 'search-select'
    placeholder: "Buscar tipster..."
    allowMultiple: true
    showVerificationStatus: true
  }
}
```

#### 4.3. Query Params de Filtros
```typescript
// Mapeo directo a URL
interface FilterQueryParams {
  q?: string                    // Search
  source?: string               // tipster|ai|master|all
  mode?: string                 // pre|live|all
  status?: string               // new|suggested|active|expired|executed|blocked|not_eligible|revoked|withdrawn|archived
  sport?: string                // Sport ID
  league?: string               // League ID
  from?: string                 // Fecha inicio ISO
  to?: string                   // Fecha fin ISO
  hasReports?: boolean        // Con reportes
  flagged?: boolean           // Marcadas revisión
  complianceHold?: boolean    // Hold compliance
  minConfidence?: number      // Confianza mínima
  minEV?: number               // EV mínimo
  maxDrift?: number           // Drift máximo
  tipsterId?: string          // ID tipster
  verifiedOnly?: boolean      // Solo verificados
}
```

**⚠️ IMPORTANTE:** La lista de status en URL debe ser EXACTAMENTE la misma que en filtros para evitar pérdida de estado en refrescos

### 5) Tabla Principal (Core)

#### 5.1. Visualización de Columnas
```
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 📅 Fecha │ 📡 Fuente │ 👤 Tipster │ 🏆 Evento │ 📊 Mercado │ 💰 Odds │ ⚡ Mode │ 🎯 Conf │ 💎 EV │ 📈 CLV │ 🔄 Drift │ ⚡ Status │ 🚩 Flags │ ⚙️ Acciones │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 5.2. Interfaces de Columnas
```typescript
interface AdminSignalsTableColumn {
  // Columnas principales
  publicationDate: {
    label: "Fecha/Hora"
    format: 'datetime'
    sortKey: 'createdAt'
    width: '120px'
  }
  
  source: {
    label: "Fuente"
    type: 'badge'
    options: [
      { value: 'tipster', label: 'Tipster', color: 'blue', icon: '👤' },
      { value: 'ai', label: 'IA', color: 'purple', icon: '🤖' },
      { value: 'master', label: 'Curated', color: 'gold', icon: '⭐' }
    ]
    sortKey: 'source'
    width: '100px'
  }
  
  tipster: {
    label: "Tipster"
    type: 'user-info'
    showVerificationBadge: true
    showSuspensionStatus: true
    sortKey: 'tipster.name'
    width: '150px'
  }
  
  event: {
    label: "Evento"
    type: 'event-info'
    showLeague: true
    showStartTime: true
    sortKey: 'event.startTime'
    width: '200px'
  }
  
  market: {
    label: "Mercado"
    type: 'market-info'
    showSelection: true
    sortKey: 'market.name'
    width: '150px'
  }
  
  odds: {
    label: "Cuotas"
    type: 'odds-info'
    showOpening: true
    showCurrent: true
    highlightDrift: true
    sortKey: 'odds.current'
    width: '100px'
  }
  
  mode: {
    label: "Modo"
    type: 'badge'
    options: [
      { value: 'pre', label: 'Pre', color: 'blue', icon: '⏰' },
      { value: 'live', label: 'Live', color: 'green', icon: '⚡' }
    ]
    sortKey: 'mode'
    width: '80px'
  }
  
  confidence: {
    label: "Confianza"
    type: 'progress'
    showPercentage: true
    colorScale: 'green-red'
    sortKey: 'confidence'
    width: '100px'
  }
  
  ev: {
    label: "EV"
    type: 'percentage'
    showSign: true
    colorPositive: true
    sortKey: 'ev'
    width: '80px'
  }
  
  clv: {
    label: "CLV"
    type: 'percentage'
    showSign: true
    colorPositive: true
    sortKey: 'clv'
    width: '80px'
  }
  
  drift: {
    label: "Drift"
    type: 'percentage'
    showSign: true
    highlightThreshold: 5
    sortKey: 'drift'
    width: '80px'
  }
  
  status: {
    label: "Estado"
    type: 'status-badge'
    options: StatusBadgeOption[]  // Ver sección 5.3
    sortKey: 'status'
    width: '120px'
  }
  
  flags: {
    label: "Banderas"
    type: 'flags'
    showReportCount: true
    showRiskBadge: true
    showQualityBadge: true
    width: '100px'
  }
  
  actions: {
    label: "Acciones"
    type: 'actions-dropdown'
    actions: AdminSignalAction[]  // Ver sección 8
    width: '80px'
  }
}
```

#### 5.3. Opciones de Estado (Status)
```typescript
interface StatusBadgeOption {
  value: string
  label: string
  color: 'green' | 'blue' | 'yellow' | 'red' | 'gray' | 'purple'
  icon: string
  description: string
  category: 'active' | 'inactive' | 'moderation' | 'archived'
}

const STATUS_OPTIONS: StatusBadgeOption[] = [
  {
    value: 'new',
    label: 'Nueva',
    color: 'blue',
    icon: '🆕',
    description: 'Estado técnico interno',
    category: 'inactive'
  },
  {
    value: 'suggested',
    label: 'Sugerida',
    color: 'blue',
    icon: '💡',
    description: 'Visible como sugerencia',
    category: 'active'
  },
  {
    value: 'active',
    label: 'Activa',
    color: 'green',
    icon: '✅',
    description: 'Visible y ejecutable',
    category: 'active'
  },
  {
    value: 'expired',
    label: 'Expirada',
    color: 'gray',
    icon: '⏰',
    description: 'Ventana cerrada',
    category: 'inactive'
  },
  {
    value: 'executed',
    label: 'Ejecutada',
    color: 'green',
    icon: '💰',
    description: 'Ejecutada por usuarios',
    category: 'inactive'
  },
  {
    value: 'blocked',
    label: 'Bloqueada',
    color: 'red',
    icon: '🚫',
    description: 'Bloqueada por moderación',
    category: 'moderation'
  },
  {
    value: 'not_eligible',
    label: 'No Elegible',
    color: 'yellow',
    icon: '⚠️',
    description: 'No pasa risk guard',
    category: 'moderation'
  },
  {
    value: 'revoked',
    label: 'Revocada',
    color: 'red',
    icon: '❌',
    description: 'Revocada por administrador',
    category: 'moderation'
  },
  {
    value: 'withdrawn',
    label: 'Retirada',
    color: 'gray',
    icon: '🔄',
    description: 'Cancelada por tipster',
    category: 'archived'
  },
  {
    value: 'archived',
    label: 'Archivada',
    color: 'gray',
    icon: '📁',
    description: 'Archivada automáticamente',
    category: 'archived'
  }
]
```

#### 5.4. Comportamiento de la Tabla
```typescript
interface TableBehavior {
  // Ordenamiento
  sort: {
    defaultSort: 'createdAt'
    defaultOrder: 'DESC'
    allowedKeys: [
      'createdAt', 'startTime', 'confidence', 'ev', 'clv', 
      'drift', 'reportsCount', 'executedCount', 'totalOdds',
      'tipster.name', 'event.startTime', 'market.name'
    ]
  }
  
  // Paginación
  pagination: {
    defaultLimit: 50
    limits: [25, 50, 100, 200]
    showTotal: true
    showPages: true
  }
  
  // Selección múltiple
  bulkSelection: {
    enabled: true
    selectAll: true
    showSelectedCount: true
    bulkActions: BulkAction[]  // Ver sección 8
  }
  
  // Estado de carga
  loading: {
    showSkeleton: true
    rows: 10
    preserveScroll: true
  }
  
  // Estados vacíos
  empty: {
    showIllustration: true
    showCreateButton: false  // No crear desde admin
    showFiltersReset: true
  }
}
```

### 6) Drawer / Detalle de Señal (Click Row)

#### 6.1. Estructura del Drawer
```
┌─────────────────────────────────────────────────────────────────────┐
│ 🔍 Signal Detail │ [X]                                          │
├─────────────────────────────────────────────────────────────────────┤
│ 📡 Signal #SIG-12345 │ ⚡ Pre-Match │ 🟢 Activa │ ⭐ 4.2/5     │
├─────────────────────────────────────────────────────────────────────┤
│ [Overview] [Calidad] [Ejecución] [Reports] [Audit]                │
├─────────────────────────────────────────────────────────────────────┤
│                    Contenido del Tab Seleccionado                  │
└─────────────────────────────────────────────────────────────────────┘
```

#### 6.2. Interfaces de Tabs
```typescript
interface SignalDetailDrawer {
  // Información del header
  header: {
    signalId: string
    signalTitle: string
    mode: 'pre' | 'live'
    status: SignalStatus
    rating?: number
    createdAt: string
    updatedAt: string
  }
  
  // Tabs disponibles
  tabs: [
    {
      key: 'overview'
      label: 'Overview'
      icon: '📊'
      component: 'SignalOverviewTab'
    },
    {
      key: 'quality'
      label: 'Calidad'
      icon: '💎'
      component: 'SignalQualityTab'
    },
    {
      key: 'execution'
      label: 'Ejecución'
      icon: '💰'
      component: 'SignalExecutionTab'
      condition: (signal) => signal.status === 'executed'
    },
    {
      key: 'reports'
      label: 'Reports'
      icon: '🚩'
      component: 'SignalReportsTab'
    },
    {
      key: 'audit'
      label: 'Audit'
      icon: '📋'
      component: 'SignalAuditTab'
    }
  ]
  
  // Acciones disponibles
  actions: SignalDetailAction[]  // Ver sección 8
}
```

#### 6.3. Contenido por Tab

**📊 Tab: Overview**
```typescript
interface SignalOverviewTab {
  // Información básica
  snapshot: {
    event: {
      name: string
      league: string
      sport: string
      startTime: string
    }
    market: {
      name: string
      selection: string
      odds: {
        opening: number
        current: number
        drift: number
      }
    }
    timestamps: {
      created: string
      published: string
      expires: string
      executed?: string
    }
  }
  
  // Badges de estado
  badges: {
    riskGuard: {
      status: 'allowed' | 'blocked' | 'not_eligible'
      reason?: string
      appliedAt?: string
    }
    reasonCode?: string
    qualityScore?: number
  }
  
  // Metadata
  metadata: {
    source: 'tipster' | 'ai' | 'master'
    tipster?: {
      id: string
      name: string
      verification: 'verified' | 'review' | 'suspended'
    }
    confidence: number
    mode: 'pre' | 'live'
  }
}
```

**💎 Tab: Calidad**
```typescript
interface SignalQualityTab {
  // Métricas principales
  metrics: {
    confidence: {
      value: number
      trend: 'up' | 'down' | 'stable'
      history: QualityHistoryPoint[]
    }
    ev: {
      value: number
      trend: 'up' | 'down' | 'stable'
      history: QualityHistoryPoint[]
    }
    clv: {
      value: number
      trend: 'up' | 'down' | 'stable'
      history: QualityHistoryPoint[]
    }
    drift: {
      value: number
      trend: 'up' | 'down' | 'stable'
      threshold: number
    }
  }
  
  // Historial de cambios
  history: {
    timeline: QualityTimelineEvent[]
    significantChanges: QualityChangeEvent[]
  }
  
  // Alertas de calidad
  alerts: QualityAlert[]
}

interface QualityHistoryPoint {
  timestamp: string
  value: number
  context?: string
}

interface QualityTimelineEvent {
  timestamp: string
  type: 'confidence_change' | 'ev_change' | 'clv_change' | 'drift_alert'
  description: string
  severity: 'low' | 'medium' | 'high'
}
```

**💰 Tab: Ejecución (Solo si ejecutada)**
```typescript
interface SignalExecutionTab {
  // Información de ejecución
  execution: {
    count: number
    firstExecution?: string
    lastExecution?: string
    totalVolume: number
    averageStake: number
  }
  
  // Resultados
  results: {
    status: 'pending' | 'won' | 'lost' | 'void' | 'half_won' | 'half_lost'
    profit: number
    roi: number
    settledAt?: string
  }
  
  // Usuarios que ejecutaron
  executors: {
    total: number
    list: Array<{
      userId: string
      username: string
      stake: number
      executedAt: string
      result?: 'won' | 'lost' | 'pending'
    }>
  }
}
```

**🚩 Tab: Reports & Moderación**
```typescript
interface SignalReportsTab {
  // Lista de reportes
  reports: {
    total: number
    open: number
    resolved: number
    list: ReportItem[]
  }
  
  // Notas de administrador
  adminNotes: {
    canEdit: boolean  // false si archived
    notes: AdminNote[]
    addNote: (note: string) => void
  }
  
  // Decisiones de moderación
  moderation: {
    currentDecision?: ModerationDecision
    history: ModerationDecision[]
    canModerate: boolean  // false si archived
  }
}

interface ReportItem {
  id: string
  reporter: {
    id: string
    username: string
  }
  reason: string
  description: string
  status: 'open' | 'resolved' | 'dismissed'
  createdAt: string
  resolvedAt?: string
  resolvedBy?: string
}

interface AdminNote {
  id: string
  content: string
  createdBy: string
  createdAt: string
  isInternal: boolean
}
```

**📋 Tab: Audit**
```typescript
interface SignalAuditTab {
  // Historial completo
  history: {
    totalActions: number
    timeline: AuditEvent[]
    significantEvents: AuditEvent[]
  }
  
  // Acciones administrativas
  adminActions: {
    total: number
    byType: Record<string, number>
    recent: AdminAction[]
  }
  
  // Cambios de estado
  stateChanges: StateChangeEvent[]
}

interface AuditEvent {
  id: string
  timestamp: string
  actor: {
    type: 'user' | 'admin' | 'system'
    id: string
    name: string
  }
  action: string
  details: any
  metadata?: Record<string, any>
}
```

#### 6.4. Comportamiento Especial por Estado

**🔒 Señal Archivada (archived=true)**
```typescript
interface ArchivedSignalBehavior {
  // Banner de advertencia
  banner: {
    show: true
    type: 'warning'
    message: "🔒 Señal archivada - Solo lectura"
    description: "Esta señal ha sido archivada y no puede ser modificada"
  }
  
  // Restricciones
  restrictions: {
    hideActionButtons: true      // Ocultar todos los botones de acción
    disableEditableFields: true  // Deshabilitar campos editables
    disableModerationActions: true // Deshabilitar acciones de moderación
    disableNoteCreation: true    // No permitir nuevas notas
  }
  
  // Funcionalidad permitida
  allowed: {
    viewAllTabs: true           // Tabs funcionales
    viewHistory: true           // Ver historial
    exportData: true           // Exportar información
    readNotes: true            // Leer notas existentes
  }
}
```

### 7) Acciones Admin (Single + Bulk)

#### 7.1. Acciones Individuales (Single Actions)

```typescript
interface AdminSignalAction {
  // Acciones principales
  sendToReview: {
    label: "Enviar a Revisión"
    icon: "👁️"
    description: "Marcar señal para revisión manual"
    confirmation: {
      title: "¿Enviar señal a revisión?"
      message: "La señal será marcada para revisión manual por el equipo de moderación."
      requireReason: true
      reasonPlaceholder: "Motivo de la revisión..."
    }
    effects: {
      setReviewRequired: true
      setFlagged: true
      notifyModerators: true
    }
  }
  
  approve: {
    label: "Aprobar"
    icon: "✅"
    description: "Aprobar señal y limpiar flags"
    confirmation: {
      title: "¿Aprobar señal?"
      message: "Se limpiarán todos los flags y la señal quedará aprobada."
      requireReason: false
    }
    effects: {
      clearFlags: true
      setStatus: 'active'
      removeFromReview: true
    }
  }
  
  revoke: {
    label: "Revocar"
    icon: "❌"
    description: "Revocar señal completamente"
    confirmation: {
      title: "¿Revocar señal?"
      message: "Esta acción es irreversible. La señal será marcada como revocada."
      requireReason: true
      reasonPlaceholder: "Motivo de la revocación..."
      danger: true
    }
    effects: {
      setStatus: 'revoked'
      preventExecution: true
      logReason: true
    }
    restrictions: {
      prohibitedIfExecuted: true  // No revocar si tiene ejecuciones
    }
  }
  
  block: {
    label: "Bloquear"
    icon: "🚫"
    description: "Bloquear ejecución de la señal"
    confirmation: {
      title: "¿Bloquear señal?"
      message: "La señal no podrá ser ejecutada por usuarios."
      requireReason: true
      reasonPlaceholder: "Motivo del bloqueo..."
    }
    effects: {
      setStatus: 'blocked'
      preventExecution: true
      logReason: true
    }
  }
  
  markNotEligible: {
    label: "Marcar No Elegible"
    icon: "⚠️"
    description: "Marcar como no elegible por risk guard"
    confirmation: {
      title: "¿Marcar como no elegible?"
      message: "La señal será marcada como no elegible por el sistema de riesgo."
      requireReason: true
      reasonPlaceholder: "Motivo..."
    }
    effects: {
      setStatus: 'not_eligible'
      applyRiskGuard: true
      logReason: true
    }
  }
  
  adjustQuality: {
    label: "Ajustar Calidad"
    icon: "⚖️"
    description: "Ajustar etiqueta de calidad"
    confirmation: {
      title: "¿Ajustar etiqueta de calidad?"
      message: "Seleccione la nueva etiqueta de calidad para la señal."
      requireReason: false
      qualityOptions: [
        { value: 'clean', label: 'Limpia', color: 'green' },
        { value: 'review', label: 'Revisar', color: 'yellow' },
        { value: 'flagged', label: 'Flagged', color: 'red' }
      ]
    }
    effects: {
      setQualityLabel: true
      logChange: true
    }
  }
  
  export: {
    label: "Exportar"
    icon: "📊"
    description: "Exportar información de la señal"
    confirmation: {
      title: "¿Exportar señal?"
      message: "Se generará un archivo CSV con la información de la señal."
      requireReason: false
    }
    effects: {
      generateCSV: true
      includeHistory: true
    }
  }
}
```

#### 7.2. Acciones Masivas (Bulk Actions)

```typescript
interface BulkSignalActions {
  // Acciones disponibles para selección múltiple
  actions: [
    {
      key: 'bulk_send_to_review'
      label: "Enviar a Revisión (Seleccionadas)"
      icon: "👁️"
      confirmation: {
        title: "¿Enviar {count} señales a revisión?"
        message: "Las {count} señales seleccionadas serán marcadas para revisión."
        requireReason: true
      }
      restrictions: {
        maxItems: 100
        excludeStatuses: ['executed', 'archived', 'withdrawn']
      }
    },
    {
      key: 'bulk_approve'
      label: "Aprobar (Seleccionadas)"
      icon: "✅"
      confirmation: {
        title: "¿Aprobar {count} señales?"
        message: "Se aprobarán todas las señales seleccionadas."
        requireReason: false
      }
      restrictions: {
        maxItems: 100
        excludeStatuses: ['executed', 'archived', 'withdrawn']
      }
    },
    {
      key: 'bulk_block'
      label: "Bloquear (Seleccionadas)"
      icon: "🚫"
      confirmation: {
        title: "¿Bloquear {count} señales?"
        message: "Las señales seleccionadas serán bloqueadas."
        requireReason: true
      }
      restrictions: {
        maxItems: 50
        excludeStatuses: ['executed', 'archived', 'withdrawn']
      }
    },
    {
      key: 'bulk_export'
      label: "Exportar (Seleccionadas)"
      icon: "📊"
      confirmation: {
        title: "¿Exportar {count} señales?"
        message: "Se generará un archivo CSV con las señales seleccionadas."
        requireReason: false
      }
      restrictions: {
        maxItems: 1000
      }
    }
  ]
  
  // Límites y restricciones generales
  limits: {
    maxSelection: 1000
    warningThreshold: 100
    requireConfirmation: true
  }
  
  // Validaciones
  validations: {
    checkPermissions: true
    validateStatuses: true
    preventMixedActions: true
  }
}
```

#### 7.3. Modal de Confirmación Estándar

```typescript
interface ConfirmationModal {
  // Estructura del modal
  title: string
  message: string
  icon?: string
  type: 'info' | 'warning' | 'danger'
  
  // Campos requeridos
  requireReason: boolean
  reasonPlaceholder?: string
  reasonMinLength?: number
  
  // Opciones de calidad (si aplica)
  qualityOptions?: QualityOption[]
  
  // Botones
  buttons: {
    confirm: {
      label: string
      variant: 'primary' | 'danger'
      disabled?: boolean
    }
    cancel: {
      label: string
      variant: 'secondary'
    }
  }
  
  // Validaciones
  validations: {
    preventEmptyReason: boolean
    confirmDelay?: number  // Segundos de delay para acciones peligrosas
  }
}
```

#### 7.4. Reglas Importantes

**⚠️ Reglas de Negocio:**
1. **No afectan liquidación**: Estas acciones solo cambian el estado operativo/visibilidad
2. **No liquidan picks**: La liquidación sigue en el módulo de tipster settlements/resultados
3. **Requieren auditoría**: Todas las acciones se registran en el log de auditoría
4. **Prohibiciones específicas**:
   - No revocar señales ejecutadas (con executions > 0)
   - No hacer bulk actions sobre executed/archived/withdrawn
   - No bloquear señales ya expiradas (excepto por compliance)
5. **Confirmaciones obligatorias**: Todas las acciones destructivas requieren confirmación
6. **Razones requeridas**: Las acciones de moderación deben incluir motivo

### 10.9 Action Guardrails por Status (Matriz Detallada)

```typescript
interface ActionGuardrail {
  // Estado de la señal
  status: SignalStatus
  
  // Permisos por acción
  permissions: {
    sendToReview: ActionPermission
    approve: ActionPermission
    revoke: ActionPermission
    block: ActionPermission
    markNotEligible: ActionPermission
    adjustQuality: ActionPermission
    export: ActionPermission
  }
  
  // Reglas específicas
  rules: string[]
}

interface ActionPermission {
  allowed: boolean
  requiresReason: boolean
  requiresConfirmation: boolean
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  restrictions?: string[]
  specialConditions?: string[]
}
```

#### Matriz de Permisos Detallada

| Estado       | Enviar a Revisión | Aprobar | Revocar | Bloquear | No Elegible | Ajustar Calidad | Exportar |
|--------------|-------------------|---------|---------|----------|-------------|-----------------|----------|
| **new**      | ✅ (Low)          | ✅ (Low) | ✅ (Med) | ✅ (Med)  | ✅ (Med)     | ✅ (Low)        | ✅ (Low) |
| **suggested**| ✅ (Low)          | ✅ (Low) | ✅ (Med) | ✅ (Med)  | ✅ (Med)     | ✅ (Low)        | ✅ (Low) |
| **active**   | ✅ (Med)          | ✅ (Low) | ✅ (High)| ✅ (High) | ✅ (Med)     | ✅ (Low)        | ✅ (Low) |
| **expired**  | ✅ (Med)          | ✅ (Low) | ⚠️ (Crit)| ⚠️ (High) | ✅ (Med)     | ✅ (Low)        | ✅ (Low) |
| **executed** | ❌                | ❌      | ❌      | ❌       | ❌          | ✅ (Low)        | ✅ (Low) |
| **blocked**  | ✅ (Low)          | ✅ (Low) | ✅ (Med) | ❌       | ✅ (Med)     | ✅ (Low)        | ✅ (Low) |
| **not_eligible**| ✅ (Med)       | ✅ (Low) | ✅ (Med) | ✅ (Med)  | ❌          | ✅ (Low)        | ✅ (Low) |
| **revoked**  | ❌                | ❌      | ❌      | ❌       | ❌          | ✅ (Low)        | ✅ (Low) |
| **withdrawn**| ❌                | ❌      | ❌      | ❌       | ❌          | ✅ (Low)        | ✅ (Low) |
| **archived** | ❌                | ❌      | ❌      | ❌       | ❌          | ❌              | ✅ (Low) |

#### Reglas Detalladas por Estado

```typescript
const ACTION_GUARDRAILS: ActionGuardrail[] = [
  {
    status: 'new',
    permissions: {
      sendToReview: { allowed: true, requiresReason: false, requiresConfirmation: false, riskLevel: 'low' },
      approve: { allowed: true, requiresReason: false, requiresConfirmation: false, riskLevel: 'low' },
      revoke: { allowed: true, requiresReason: true, requiresConfirmation: true, riskLevel: 'medium' },
      block: { allowed: true, requiresReason: true, requiresConfirmation: true, riskLevel: 'medium' },
      markNotEligible: { allowed: true, requiresReason: true, requiresConfirmation: true, riskLevel: 'medium' },
      adjustQuality: { allowed: true, requiresReason: false, requiresConfirmation: false, riskLevel: 'low' },
      export: { allowed: true, requiresReason: false, requiresConfirmation: false, riskLevel: 'low' }
    },
    rules: [
      'Todas las acciones permitidas',
      'No hay restricciones especiales'
    ]
  },
  {
    status: 'active',
    permissions: {
      sendToReview: { allowed: true, requiresReason: true, requiresConfirmation: false, riskLevel: 'medium' },
      approve: { allowed: true, requiresReason: false, requiresConfirmation: false, riskLevel: 'low' },
      revoke: { allowed: true, requiresReason: true, requiresConfirmation: true, riskLevel: 'high', restrictions: ['No permitido si tiene executions > 0'] },
      block: { allowed: true, requiresReason: true, requiresConfirmation: true, riskLevel: 'high' },
      markNotEligible: { allowed: true, requiresReason: true, requiresConfirmation: true, riskLevel: 'medium' },
      adjustQuality: { allowed: true, requiresReason: false, requiresConfirmation: false, riskLevel: 'low' },
      export: { allowed: true, requiresReason: false, requiresConfirmation: false, riskLevel: 'low' }
    },
    rules: [
      'Revisar impacto en usuarios activos',
      'Notificar cambios a suscriptores'
    ]
  },
  {
    status: 'expired',
    permissions: {
      sendToReview: { allowed: true, requiresReason: true, requiresConfirmation: false, riskLevel: 'medium' },
      approve: { allowed: true, requiresReason: false, requiresConfirmation: false, riskLevel: 'low' },
      revoke: { 
        allowed: true, 
        requiresReason: true, 
        requiresConfirmation: true, 
        riskLevel: 'critical',
        specialConditions: [
          'Requiere aprobación de compliance',
          'Verificar si hay picks ganadores pagados',
          'Evaluar impacto legal/regulatorio'
        ]
      },
      block: { allowed: true, requiresReason: true, requiresConfirmation: true, riskLevel: 'high' },
      markNotEligible: { allowed: true, requiresReason: true, requiresConfirmation: true, riskLevel: 'medium' },
      adjustQuality: { allowed: true, requiresReason: false, requiresConfirmation: false, riskLevel: 'low' },
      export: { allowed: true, requiresReason: false, requiresConfirmation: false, riskLevel: 'low' }
    },
    rules: [
      'CRÍTICO: Puede haber picks ganadores ya pagados',
      'Requiere validación de compliance',
      'Verificar liquidaciones completadas'
    ]
  },
  {
    status: 'executed',
    permissions: {
      sendToReview: { allowed: false, restrictions: ['No permitido post-ejecución'] },
      approve: { allowed: false, restrictions: ['No permitido post-ejecución'] },
      revoke: { allowed: false, restrictions: ['No permitido post-ejecución'] },
      block: { allowed: false, restrictions: ['No permitido post-ejecución'] },
      markNotEligible: { allowed: false, restrictions: ['No permitido post-ejecución'] },
      adjustQuality: { allowed: true, requiresReason: false, requiresConfirmation: false, riskLevel: 'low' },
      export: { allowed: true, requiresReason: false, requiresConfirmation: false, riskLevel: 'low' }
    },
    rules: [
      'Estado final: no se permiten cambios operativos',
      'Solo operaciones de lectura',
      'Auditoría completa requerida'
    ]
  }
]
```

#### Reglas Generales de Bulk Actions

```typescript
interface BulkActionRules {
  // Prohibiciones absolutas
  absoluteRestrictions: [
    'No bulk actions sobre executed',
    'No bulk actions sobre archived',
    'No bulk actions sobre withdrawn',
    'No bulk actions mixtas con executed/archived'
  ]
  
  // Límites por tipo de acción
  limits: {
    review: { maxItems: 100, warningThreshold: 50 },
    approve: { maxItems: 100, warningThreshold: 50 },
    block: { maxItems: 50, warningThreshold: 25 },
    revoke: { maxItems: 10, warningThreshold: 5 },  // Muy restrictivo
    export: { maxItems: 1000, warningThreshold: 500 }
  }
  
  // Validaciones adicionales
  validations: {
    requireSupervisorApproval: boolean  // Para acciones > X items
    checkMixedStatuses: boolean          // Validar consistencia de estados
    verifyUserPermissions: boolean       // Verificar permisos de usuario
    validateBusinessHours: boolean       // Restricciones horarias
  }
}
```

#### Proceso de Aprobación para Acciones Críticas

```typescript
interface CriticalActionApproval {
  // Acciones que requieren aprobación
  criticalActions: [
    'revoke on expired signals',
    'bulk revoke > 5 items',
    'block active signals > 10',
    'any action on compliance-flagged signals'
  ]
  
  // Proceso de aprobación
  approvalProcess: {
    requiredRoles: ['admin', 'compliance', 'supervisor']
    approvalChain: [
      { role: 'admin', timeout: 3600 },           // 1 hora
      { role: 'compliance', timeout: 7200 },      // 2 horas
      { role: 'supervisor', timeout: 10800 }        // 3 horas
    ]
    escalation: {
      autoEscalate: true
      notifyManagement: true
      emergencyOverride: false
    }
  }
  
  // Documentación requerida
  documentation: {
    requireDetailedReason: true
    requireBusinessJustification: true
    requireImpactAssessment: boolean  // Para acciones masivas
    attachEvidence: boolean           // Para acciones de compliance
  }
}
```

### 10.10 Sort Keys Permitidas (MVP)
Lista oficial de campos por los que se puede ordenar la tabla:

| Sort Key | Descripción | Dirección Default |
|----------|-------------|-------------------|
| createdAt | Fecha de creación de la señal | DESC |
| startTime | Hora de inicio del evento | ASC |
| confidence | Nivel de confianza de la señal | DESC |
| ev | Expected Value calculado | DESC |
| clv | Closing Line Value | DESC |
| drift | Cambio en odds desde publicación | ASC |
| reportsCount | Número de reportes acumulados | DESC |
| executedCount | Veces que fue ejecutada | DESC |
| totalOdds | Cuota total (para combinadas) | DESC |

**Formato de URL**: `?sort=createdAt&order=DESC`
**Valores permitidos**: sort=[createdAt|startTime|confidence|ev|clv|drift|reportsCount|executedCount|totalOdds]
**Order**: ASC o DESC (mayúsculas)

## 8) Empty states y errores
- Empty por tab y por filtros activos.
- Mensajes con CTA: “Limpiar filtros”, “Volver a overview”.
- Estados estándar: loading, empty, error, partial (mismos bloques que admin-tipsters para consistencia).

## 9) Conexiones con otros módulos
- Desde admin-tipsters: botón “Ver todas las señales” → /admin/signals?tipsterId=… (soportar filtro por query param).
- Desde dashboard admin: card “Señales en revisión” → /admin/signals?tab=review.
- Desde alertas: /admin/signals?tab=anomalies.

## 10) Contratos Operativos (MVP)

### 10.1 Reason Codes Oficiales
Lista oficial de códigos de motivo para estados bloqueados/revocados:

| Reason Code | Descripción | Bloquea Ejecución | Requiere Review |
|-------------|-------------|-------------------|-----------------|
| ODDS_DRIFT | Odds cambiaron fuera de rango permitido | ✅ | ❌ |
| MARKET_CLOSED | Mercado cerrado antes de ejecución | ✅ | ❌ |
| LATE_SIGNAL | Señal publicada muy cerca del evento | ✅ | ✅ |
| INVALID_SELECTION | Selección no válida o error de datos | ✅ | ✅ |
| DUPLICATE_SIGNAL | Señal duplicada detectada | ✅ | ✅ |
| SPAM_PATTERN | Patrón detectado como spam | ✅ | ✅ |
| LOW_CONFIDENCE | Confianza por debajo del umbral | ❌ | ✅ |
| PROVIDER_ERROR | Error del proveedor de datos | ✅ | ✅ |
| MANUAL_ADMIN_BLOCK | Bloqueo manual por administrador | ✅ | ✅ |
| COMPLIANCE_REVIEW | Revisión de compliance requerida | ✅ | ✅ |

### 10.2 State Transitions (Flujo de Estados)
Tabla de transiciones permitidas entre estados:

| Estado Actual | Puede Ir A | Requiere Razón | Actor Permitido | Notas |
|---------------|------------|----------------|-----------------|-------|
| new | active | ❌ | Sistema automático | Transición automática al publicar |
| new | blocked | ✅ | Admin / Risk Guard | Bloqueo preventivo |
| new | not_eligible | ✅ | Risk Guard | Risk Guard detecta problema |
| active | expired | ❌ | Sistema automático | Ventana de ejecución terminó |
| active | blocked | ✅ | Admin / Risk Guard | Bloqueo por moderación |
| active | not_eligible | ✅ | Risk Guard | No cumple criterios de riesgo |
| active | revoked | ✅ | Admin | Solo administradores pueden revocar |
| active | executed | ❌ | Usuario vía agente | Usuario ejecuta la señal |
| active | withdrawn | ✅ | Tipster | Tipster cancela (módulo tipster) |
| blocked | active | ✅ | Admin | Admin desbloquea |
| blocked | revoked | ✅ | Admin | Admin revoca definitivamente |
| not_eligible | active | ✅ | Admin | Admin corrige estado |
| revoked | archived | ❌ | Sistema | Cierre técnico automático |
| executed | archived | ❌ | Sistema | Cierre técnico automático |
| withdrawn | archived | ❌ | Sistema | Cierre técnico automático |

**IMPORTANTE**: 
- "En revisión" (review) no es un estado, es una cola basada en flags lógicos
- `flagged=true` o `review_required=true` indica que la señal está en cola de revisión
- La tab "En Revisión" muestra señales con estos flags activos
- `withdrawn` es exclusivo del módulo tipster (no aparece en admin salvo como histórico)
- `archived` es un estado técnico de cierre automático, solo visible en administración

### 10.3 Definición de Ejecución y Estados Finales
Clarificación de términos relacionados con ejecución:

**Estados principales del ciclo de vida:**
- **new**: Señal creada, pendiente de revisión inicial
- **suggested**: Señal visible como sugerencia pero aún no ejecutable (estado inicial para usuarios)
- **active**: Señal está disponible y dentro de la ventana de ejecución
- **executed**: La señal fue realmente apostada por al menos 1 usuario (vía agente o manual)
- **expired**: Ventana de ejecución terminó automáticamente
- **not_eligible**: Bloqueada por Risk Guard (no cumple criterios)
- **revoked**: Cancelada por administrador (solo Admin puede revocar)
- **withdrawn**: Cancelada por tipster (solo en módulo tipster)
- **archived**: Cierre técnico automático (solo visible en admin)
- **KPI Execution Rate**: executed_count / (executed_count + suggested_count + expired_count)

### 10.4 Quality Label System
Sistema de etiquetas de calidad para señales:

| Quality Label | Condición | Badge Color | Afecta Visibilidad |
|---------------|-----------|-------------|-------------------|
| clean | Sin reports, métricas normales | Verde | ✅ Visible normal |
| review | 1-2 reports o métricas bajas | Amarillo | ✅ Visible con advertencia |
| flagged | 3+ reports o anomalías graves | Rojo | ⚠️ Puede ser limitada |

**Reglas automáticas:**
- 1-2 reports → quality_label = review
- 3+ reports → quality_label = flagged
- Admin puede override manual
- Se muestra como badge en tabla y drawer

### 10.5 Reglas de Reports y Moderación
Sistema automático de moderación basado en reportes:

| Número de Reports | Acción Automática | Quality Label | Requiere Review |
|-------------------|-------------------|---------------|-----------------|
| 1-2 | flagged=true | review | ❌ |
| 3-4 | review_required=true | flagged | ✅ |
| 5+ | blocked + flagged=true | flagged | ✅ |

- Los reports pueden venir de usuarios, otros tipsters o sistema
- Admin puede ignorar reports o confirmar la acción
- Razones de report: spam, error, mala calidad, sospechosa

### 10.6 Reglas de Seguridad para Bulk Actions
Medidas de seguridad para acciones masivas:

- **Límite de 20 señales** para revocar/bloquear sin confirmación adicional
- **Confirmación doble** requerida para >20 señales
- **Preview obligatorio** mostrando lista de señales afectadas
- **Texto de confirmación** "CONFIRMAR" debe escribirse manualmente
- **No permitir** bulk actions sobre señales con estado "executed"
- **Log de auditoría** obligatorio para todas las bulk actions

### 10.7 Columnas de Tabla - Reglas de Datos
Reglas para manejar datos faltantes en la tabla principal:

| Columna | Si Falta Dato | Mostrar | Tooltip |
|---------|---------------|---------|---------|
| Confidence | -- | "--" | "No disponible" |
| EV | -- | "--" | "No disponible" |
| CLV | -- | "--" | "No disponible" |
| Drift | -- | "--" | "No disponible" |
| Total Odds | -- | "-" | "Single bet" |

**Estado "Partial"**: Cuando >30% de las métricas de calidad faltan para señales activas
- Mostrar badge "Parcial" amarillo
- Tooltip: "Métricas incompletas del proveedor"

### 10.8 Tabla Providers & Calidad - Fuentes Técnicas
Tabla exclusiva para fuentes técnicas (API/AI/Curated - NO tipsters individuales):

| Columna | Tipo | Descripción |
|---------|------|-------------|
| Nombre técnico | string | Nombre técnico del proveedor (ej: "ai-betanalyzer", "api-sportradar") |
| Tipo de integración | enum | api, webhook, ai, curated |
| Estado | enum | healthy, degraded, offline |
| Última señal | datetime | Timestamp de la última señal recibida |
| Señales hoy | number | Número de señales procesadas hoy |
| Tasa de éxito | % | Porcentaje de señales exitosas vs fallidas |
| Tiempo promedio de procesamiento | ms | Latencia promedio de procesamiento |
| Error rate | % | Porcentaje de errores en las últimas 24h |
| Señales en revisión | number | Cantidad de señales marcadas para revisión |
| Calidad promedio | 1-5 | Score de calidad basado en métricas |

**IMPORTANTE**: Esta tabla es EXCLUSIVA para fuentes técnicas (API, AI, Curated). Los tipsters individuales NO aparecen aquí. Sus métricas se muestran en el módulo `admin-tipsters`.

## 11) Checklist "listo para HTML"
- Sidebar activo "📡 Señales" usando SIDEBAR-ADMIN.
- Parsear y sincronizar todos los query params listados.
- Header con controles: rango, mode, refresh, export CSV.
- Tabs principales renderizadas y con deep-links por tab.
- Bloque de filtros sticky (toma/actualiza query params).
- Tabla con columnas definidas + sort/paginación/bulk select.
- Drawer de detalle con tabs internos (overview/calidad/ejecución/reports/audit).
- Acciones admin (single/bulk) con modales y campo reason.
- Empty states por tab/filtros + bloques loading/error/partial.
- Deep link desde /admin/tipsters vía tipsterId.
- Soporte de status del dominio usuario (signals.md) y lifecycle editorial (tipster-signals.md).
- **NUEVO**: Implementar reason codes oficiales en modales.
- **NUEVO**: Validar state transitions en acciones (review es cola, no estado).
- **NUEVO**: Implementar quality label system con badges.
- **NUEVO**: Implementar reglas de reports y moderación automática.
- **NUEVO**: Aplicar reglas de seguridad para bulk actions.
- **NUEVO**: Mostrar tabla de providers con columnas definidas (solo fuentes técnicas).
- **NUEVO**: Manejar datos faltantes con "--" y tooltips.
- **NUEVO**: Mostrar estado "Partial" cuando >30% métricas faltan.
- **CLAVE**: review NO es estado → usar flags (flagged, review_required).
- **CLAVE**: revoked solo puede ser ejecutado por Admin (tipster usa withdrawn).
- **CLAVE**: Providers tab eliminar tipsters; solo fuentes técnicas (API/AI/Curated).
- **CLAVE**: Definir estado archived (cierre técnico automático, solo visible en admin).
- **CLAVE**: Diferenciar expired (ventana terminó) vs not_eligible (bloqueado por Risk Guard).
- **NUEVO**: Cambiar acción "Marcar en revisión" → "Enviar a cola de revisión" (set flags).
- **NUEVO**: Implementar Action Guardrails (acciones prohibidas por estado).
- **NUEVO**: Definir suggested como status=suggested (no atributo).
- **NUEVO**: Usar sort keys oficiales (createdAt, startTime, confidence, etc.).
- **CRÍTICO**: Status URL debe ser idéntica a lista de filtros (evita pérdida en refresh).
- **CRÍTICO**: new es estado técnico NO visible en UI (solo suggested/active para usuarios).
- **CRÍTICO**: No permitir revoke sobre expired si executed_count > 0 (protege estadísticas).
- **UX**: Drawer archived = solo lectura + banner "Señal archivada" + sin botones acción.
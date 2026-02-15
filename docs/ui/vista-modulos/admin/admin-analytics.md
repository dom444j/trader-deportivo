### Interfaces Principales

```typescript
// Información general del módulo
interface AdminAnalyticsModule {
  id: 'analytics';
  name: 'Analytics y Reportes';
  route: '/admin/analytics';
  description: 'Panel de análisis avanzado y business intelligence';
  icon: '📊';
  accentColor: '#6366f1';
  priority: 'high';
  permissions: ['admin', 'analyst', 'manager'];
}

// Header del módulo
interface AdminAnalyticsHeader {
  title: string;
  subtitle: string;
  timeRangeSelector: {
    quickOptions: Array<{
      value: 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
      label: string;
      default?: boolean;
    }>;
    customRange: {
      enabled: boolean;
      dateFormat: string;
      maxRange: number; // días máximos
    };
  };
  actions: Array<{
    key: 'refresh' | 'export' | 'save_view' | 'share';
    label: string;
    icon: string;
    variant: 'primary' | 'secondary' | 'ghost';
  }>;
}

// Layout principal
interface AdminAnalyticsLayout {
  tabs: AnalyticsTabs;
  filters: AnalyticsFilters;
  kpis: AnalyticsKPIs;
  widgets: AnalyticsWidget[];
  exportOptions: ExportOptions;
}

// Configuración de tabs
interface AnalyticsTabs {
  overview: {
    key: 'overview';
    label: 'Vista General';
    icon: '📈';
    description: 'Dashboard ejecutivo con KPIs principales';
  };
  users: {
    key: 'users';
    label: 'Análisis de Usuarios';
    icon: '👥';
    description: 'Comportamiento y segmentación de usuarios';
  };
  financial: {
    key: 'financial';
    label: 'Análisis Financiero';
    icon: '💰';
    description: 'Métricas financieras y de revenue';
  };
  operational: {
    key: 'operational';
    label: 'Análisis Operacional';
    icon: '⚙️';
    description: 'Performance del sistema y operaciones';
  };
  custom: {
    key: 'custom';
    label: 'Reportes Personalizados';
    icon: '📋';
    description: 'Constructor de reportes personalizados';
  };
}

// KPIs principales
interface AnalyticsKPIs {
  overview: {
    totalActiveUsers: number;
    monthlyTradingVolume: number;
    totalRevenue: number;
    retentionRate: number;
    netPromoterScore: number;
    avgTicketResolutionTime: number;
  };
  users: {
    totalUsers: number;
    activeUsers: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    newUsers: {
      today: number;
      thisWeek: number;
      thisMonth: number;
    };
    churnRate: number;
    retentionRate: number;
    lifetimeValue: number;
    avgSessionDuration: number;
  };
  financial: {
    mrr: number;
    arr: number;
    totalRevenue: number;
    revenueGrowth: number;
    avgTransactionValue: number;
    transactionVolume: number;
    conversionRate: number;
    churnRate: number;
  };
  operational: {
    uptime: number;
    avgResponseTime: number;
    errorRate: number;
    supportTickets: {
      total: number;
      open: number;
      resolved: number;
      avgResolutionTime: number;
    };
    alerts: {
      total: number;
      bySeverity: Record<string, number>;
    };
  };
}
```

### Interfaces de Filtros y Widgets

```typescript
// Filtros avanzados
interface AnalyticsFilters {
  timeRange: {
    type: 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
    custom?: {
      from: string;
      to: string;
    };
    compareWith?: 'previous_period' | 'year_over_year' | 'month_over_month';
  };
  userSegment: {
    plans: string[];
    activityLevel: 'all' | 'active' | 'casual' | 'dormant';
    volume: 'all' | 'small' | 'medium' | 'large';
    geography: string[];
    device: 'all' | 'desktop' | 'mobile' | 'tablet';
    acquisitionChannel: string[];
  };
  transaction: {
    types: string[];
    amountRange: {
      min?: number;
      max?: number;
    };
    status: 'all' | 'completed' | 'pending' | 'failed';
    paymentMethod: string[];
    currency: string[];
  };
  system: {
    services: string[];
    severity: 'all' | 'info' | 'warning' | 'error' | 'critical';
    timeGrouping: 'day' | 'week' | 'month' | 'quarter' | 'year';
  };
}

// Widget de análisis
interface AnalyticsWidget {
  id: string;
  type: 'kpi_card' | 'line_chart' | 'bar_chart' | 'pie_chart' | 'heatmap' | 'table' | 'gauge' | 'funnel';
  title: string;
  description?: string;
  size: 'small' | 'medium' | 'large' | 'full_width';
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  dataSource: {
    metric: string;
    filters?: Partial<AnalyticsFilters>;
    aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
    timeGrouping?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  };
  visualization: {
    colors?: string[];
    showLegend?: boolean;
    showGrid?: boolean;
    animation?: boolean;
    interactive?: boolean;
  };
  exportable?: boolean;
  refreshInterval?: number; // segundos
}

// Configuración de exportación
interface ExportOptions {
  formats: Array<'csv' | 'pdf' | 'json' | 'excel'>;
  dataTypes: Array<'raw' | 'aggregated' | 'chart' | 'dashboard'>;
  scheduling?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    format: 'pdf' | 'excel';
  };
  customization: {
    includeCharts: boolean;
    includeFilters: boolean;
    includeDateRange: boolean;
    template?: string;
  };
}

// Reporte personalizado
interface CustomReport {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  sharedWith: string[];
  widgets: AnalyticsWidget[];
  filters: AnalyticsFilters;
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    format: 'pdf' | 'excel';
  };
}
```

### Interfaces de Componentes

```typescript
// Componente de dashboard
interface AnalyticsDashboard {
  widgets: AnalyticsWidget[];
  layout: 'grid' | 'list' | 'custom';
  isCustomizable: boolean;
  savedViews: Array<{
    id: string;
    name: string;
    isDefault: boolean;
    widgets: AnalyticsWidget[];
  }>;
  refresh: {
    auto: boolean;
    interval: number; // segundos
    lastUpdate: string;
  };
}

// Componente de selector de métricas
interface MetricSelector {
  availableMetrics: Array<{
    category: string;
    metrics: Array<{
      key: string;
      name: string;
      description: string;
      type: 'count' | 'sum' | 'avg' | 'percentage' | 'currency';
      aggregationOptions: string[];
    }>;
  }>;
  selectedMetrics: string[];
  onSelectionChange: (metrics: string[]) => void;
  searchEnabled: boolean;
  dragAndDrop: boolean;
}

// Componente de visualización de datos
interface DataVisualization {
  type: 'chart' | 'table' | 'kpi' | 'map';
  data: any[];
  config: {
    title: string;
    description?: string;
    showLegend: boolean;
    interactive: boolean;
    responsive: boolean;
  };
  filters: AnalyticsFilters;
  export: {
    enabled: boolean;
    formats: string[];
  };
}

// Componente de alertas y umbrales
interface MetricAlert {
  id: string;
  metric: string;
  threshold: {
    type: 'above' | 'below' | 'equals';
    value: number;
    comparison?: 'absolute' | 'percentage';
  };
  notification: {
    enabled: boolean;
    channels: Array<'email' | 'slack' | 'webhook'>;
    recipients: string[];
    cooldown: number; // minutos
  };
  isActive: boolean;
  lastTriggered?: string;
}
```

### Tipos Auxiliares

```typescript
// Tipo de visualización
type VisualizationType = 'line' | 'area' | 'bar' | 'column' | 'pie' | 'donut' | 'heatmap' | 'gauge' | 'funnel' | 'table' | 'kpi';

// Agrupación temporal
type TimeGrouping = 'day' | 'week' | 'month' | 'quarter' | 'year';

// Tipo de dato
type MetricType = 'count' | 'sum' | 'avg' | 'min' | 'max' | 'percentage' | 'currency' | 'duration';

// Formato de exportación
type ExportFormat = 'csv' | 'pdf' | 'json' | 'excel';

// Estado de carga
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Período de comparación
type ComparisonPeriod = 'previous_period' | 'year_over_year' | 'month_over_month' | 'custom';

// Canal de notificación
type NotificationChannel = 'email' | 'slack' | 'webhook' | 'sms';

// Tamaño de widget
type WidgetSize = 'small' | 'medium' | 'large' | 'full_width';
```

# Analytics y Reportes (Admin)

## Propósito del módulo
- Panel de análisis avanzado y business intelligence
- Visualización de métricas clave del negocio (KPIs)
- Generación de reportes personalizados
- Análisis de tendencias y patrones
- Exportación de datos para análisis externos

## Rutas y query params
- Ruta exacta: `/admin/analytics`
- Query params:
  - `tab = overview | users | financial | operational | custom`
  - `timeRange = today | yesterday | week | month | quarter | year | custom`
  - `from`, `to` (fechas personalizadas)
  - `groupBy = day | week | month | quarter | year`
  - `metrics` (array de métricas seleccionadas)
  - `filters` (objeto con filtros aplicados)
  - `export = csv | pdf | json`
  - `refresh = auto | manual`

## Estructura de página

### Header
- Título: "📊 Analytics y Reportes"
- Subtítulo: "Business Intelligence y análisis avanzado"
- Controles:
  - Selector de rango de tiempo rápido
  - Selector de rango de tiempo personalizado
  - Botón de refresh
  - Exportar (CSV, PDF, JSON)
  - Guardar vista personalizada

### Tabs principales

#### 1. Overview (Vista General)
Dashboard ejecutivo con KPIs principales:

**Tarjetas de métricas principales:**
- Total de usuarios activos
- Volumen de trading mensual
- Revenue total
- Tasa de retención
- NPS (Net Promoter Score)
- Tiempo promedio de resolución de tickets

**Gráficos principales:**
- Línea de tiempo: Usuarios activos vs tiempo
- Gráfico de barras: Revenue por mes
- Gráfico circular: Distribución de usuarios por plan
- Mapa de calor: Actividad por día/hora
- Tabla: Top 10 usuarios por volumen

#### 2. Users (Análisis de Usuarios)
Análisis detallado del comportamiento de usuarios:

**Secciones:**

**Adquisición y Retención:**
- Embudo de conversión: Visitante → Registro → Activo → Pagante
- Cohort analysis: Retención por mes de registro
- Churn rate por segmento
- Lifetime Value (LTV) promedio

**Segmentación:**
- Usuarios por plan (Free, Basic, Pro, VIP)
- Usuarios por nivel de actividad (Activo, Casual, Dormant)
- Usuarios por volumen de trading (Pequeño, Mediano, Grande)
- Geografía (país, región)

**Comportamiento:**
- Frecuencia de uso
- Duración de sesión
- Features más utilizadas
- Ruta típica del usuario

**Tablas detalladas:**
- Usuarios nuevos por día/semana/mes
- Usuarios activos diarios/semanales/mensuales (DAU/WAU/MAU)
- Tasa de crecimiento por segmento

#### 3. Financial (Análisis Financiero)
Análisis de métricas financieras clave:

**Revenue Analysis:**
- Revenue mensual recurrente (MRR)
- Revenue anual recurrente (ARR)
- Revenue por fuente (suscripciones, trading, otros)
- Revenue por segmento de usuario
- Tendencias de crecimiento

**Transacciones:**
- Volumen total de transacciones
- Número de transacciones por tipo
- Tamaño promedio de transacción
- Frecuencia de transacciones
- Tasa de éxito/fallo

**Análisis de Pagos:**
- Tasa de conversión de free a pagante
- Tasa de cancelación (churn)
- Razones de cancelación
- Tiempo promedio como cliente
- Customer Acquisition Cost (CAC)

**Métricas de salud financiera:**
- Gross margin
- Operating margin
- Burn rate
- Runway
- Cash flow

#### 4. Operational (Análisis Operacional)
Métricas de rendimiento del sistema y operaciones:

**Performance del Sistema:**
- Uptime por servicio
- Latencia promedio por endpoint
- Tasa de error por servicio
- Tiempo de respuesta de soporte
- Tiempo de resolución de incidentes

**Calidad del Servicio:**
- Satisfacción del cliente (CSAT)
- Net Promoter Score (NPS)
- Tasa de resolución en primer contacto
- Número de tickets por categoría
- Tendencias de calidad

**Análisis de Trading:**
- Volumen total de trades
- Tasa de éxito de señales
- ROI promedio por usuario
- Distribución de tamaños de trade
- Análisis de riesgo

**Alertas e Incidentes:**
- Número de alertas por severidad
- Tiempo de respuesta a alertas
- Incidentes críticos por mes
- Causas principales de incidentes

#### 5. Custom (Reportes Personalizados)
Constructor de reportes personalizados:

**Builder de Reportes:**
- Selector de métricas (drag & drop)
- Filtros avanzados múltiples
- Agrupación y segmentación
- Operaciones matemáticas
- Comparativas temporales

**Tipos de visualizaciones:**
- Líneas y áreas
- Barras y columnas
- Pastel y donut
- Tablas dinámicas
- Mapas de calor
- Gauge y medidores

**Opciones de guardado:**
- Guardar vistas personalizadas
- Programar envío por email
- Compartir con otros admins
- Exportar en múltiples formatos

## Tipos de Métricas Disponibles

### Métricas de Usuario
```typescript
interface UserMetrics {
  totalUsers: number;
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  newUsers: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  churnRate: number;
  retentionRate: number;
  ltv: number;
  avgSessionDuration: number;
}
```

### Métricas Financieras
```typescript
interface FinancialMetrics {
  mrr: number;
  arr: number;
  totalRevenue: number;
  revenueGrowth: number;
  avgTransactionValue: number;
  transactionVolume: number;
  conversionRate: number;
  churnRate: number;
}
```

### Métricas Operativas
```typescript
interface OperationalMetrics {
  uptime: number;
  avgResponseTime: number;
  errorRate: number;
  supportTickets: {
    total: number;
    open: number;
    resolved: number;
    avgResolutionTime: number;
  };
  alerts: {
    total: number;
    bySeverity: Record<string, number>;
  };
}
```

## Filtros Avanzados

### Filtros de Tiempo
- Rango predefinido (hoy, ayer, esta semana, este mes, etc.)
- Rango personalizado con selector de fecha
- Comparación con período anterior
- Año sobre año (YoY)
- Mes sobre mes (MoM)

### Filtros de Usuario
- Por plan de suscripción
- Por nivel de actividad
- Por volumen de trading
- Por geografía (país, región, ciudad)
- Por dispositivo (desktop, móvil, tablet)
- Por canal de adquisición

### Filtros de Transacción
- Por tipo de transacción
- Por monto (rangos)
- Por estado (completado, pendiente, fallido)
- Por método de pago
- Por moneda

## Exportación de Datos

### Formatos disponibles
- **CSV**: Para análisis en Excel/Google Sheets
- **PDF**: Para reportes formales/presentaciones
- **JSON**: Para integración con otros sistemas
- **Excel**: Con múltiples hojas y formateo

### Opciones de exportación
- Exportar datos crudos o agregados
- Incluir gráficos o solo datos
- Exportar vista actual o todos los datos
- Programar exportaciones recurrentes

## Integraciones

### Con otros módulos admin
- **admin-users.html**: Análisis detallado de usuarios específicos
- **admin-finance.html**: Ver transacciones y métricas financieras
- **admin-bets.html**: Análisis de patrones de apuestas
- **admin-alerts.html**: Ver métricas de alertas e incidentes

### APIs externas
- Google Analytics para tráfico web
- Stripe para métricas de pago detalladas
- SendGrid para métricas de email
- Sistemas de BI externos (Tableau, Power BI)

## Configuración y Personalización

### Dashboard personalizable
- Arrastrar y soltar widgets
- Redimensionar paneles
- Guardar múltiples vistas
- Compartir vistas con equipo

### Alertas de métricas
- Configurar umbrales para métricas clave
- Notificaciones cuando se crucen límites
- Alertas de tendencias inusuales
- Reportes automáticos por email

### Seguridad y permisos
- Control de acceso por rol
- Auditoría de quién ve qué datos
- Máscara de datos sensibles
- Cumplimiento de regulaciones (GDPR, etc.)

## Mejores Prácticas

### Performance
- Cache de consultas frecuentes
- Paginación para grandes conjuntos de datos
- Carga progresiva de gráficos
- Compresión de datos exportados

### UX/UI
- Loading states claros
- Mensajes cuando no hay datos
- Tooltips explicativos
- Responsive design para móviles

### Mantenimiento
- Logs de errores detallados
- Monitoreo de performance
- Validación de datos
- Tests de integridad
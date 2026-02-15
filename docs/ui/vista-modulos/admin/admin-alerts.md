### Interfaces Principales

```typescript
// Información general del módulo
interface AdminAlertsModule {
  id: 'admin-alerts';
  name: 'Alertas del Sistema';
  description: 'Panel de monitoreo de alertas y notificaciones críticas del sistema';
  route: '/admin/alerts';
  accentColor: 'red';
  icon: 'alert-triangle';
  permissions: ['admin:alerts:view', 'admin:alerts:manage', 'admin:alerts:configure'];
  navigation: {
    parent: 'admin';
    order: 4;
    breadcrumb: ['Admin', 'Alertas'];
  };
}

// Header del módulo
interface AdminAlertsHeader {
  title: '🚨 Alertas del Sistema';
  subtitle: 'Monitoreo y gestión de alertas críticas';
  controls: {
    dateRange: {
      from: string;
      to: string;
      onChange: (range: { from: string; to: string }) => void;
    };
    refresh: {
      loading: boolean;
      onClick: () => void;
      lastUpdated: string;
    };
    export: {
      enabled: boolean;
      formats: ['csv', 'json', 'pdf'];
      onExport: (format: string) => void;
    };
    settings: {
      onClick: () => void;
      tooltip: 'Configurar reglas de alertas';
    };
  };
}

// Layout del módulo
interface AdminAlertsLayout {
  tabs: Array<{
    id: 'overview' | 'active' | 'history' | 'rules';
    label: string;
    icon: string;
    count?: number;
    badge?: 'warning' | 'error' | 'info';
  }>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  content: {
    overview: AlertsOverview;
    active: AlertsActivePanel;
    history: AlertsHistoryPanel;
    rules: AlertsRulesPanel;
  };
}

// KPIs principales
interface AlertsKPIs {
  activeAlerts: {
    total: number;
    bySeverity: {
      emergency: number;
      critical: number;
      warning: number;
      info: number;
    };
    trend: number; // porcentaje de cambio
  };
  resolutionRate: {
    value: number; // porcentaje
    target: number;
    trend: 'up' | 'down' | 'stable';
  };
  avgResolutionTime: {
    value: string; // "2h 15m"
    target: string; // "< 4h"
    trend: 'up' | 'down' | 'stable';
  };
  topAlertSources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
}

// Configuración de tabs
interface AlertsTabsConfig {
  overview: {
    title: 'Resumen';
    description: 'Vista general del estado de alertas';
    components: ['kpi-cards', 'severity-chart', 'sources-chart', 'trend-chart'];
  };
  active: {
    title: 'Alertas Activas';
    description: 'Alertas que requieren acción inmediata';
    components: ['alerts-table', 'bulk-actions', 'filters'];
  };
  history: {
    title: 'Historial';
    description: 'Alertas resueltas y archivadas';
    components: ['alerts-table', 'resolution-stats', 'export-tools'];
  };
  rules: {
    title: 'Reglas';
    description: 'Gestión de reglas de alertas';
    components: ['rules-table', 'rule-editor', 'notification-settings'];
  };
}
```

### Interfaces de Filtros y Tablas

```typescript
// Filtros de alertas
interface AlertFilters {
  type: 'all' | 'system' | 'security' | 'performance' | 'finance' | 'user';
  severity: 'all' | 'info' | 'warning' | 'critical' | 'emergency';
  status: 'all' | 'active' | 'resolved' | 'acknowledged' | 'snoozed';
  dateRange: {
    from: string;
    to: string;
  };
  assignedTo: string;
  source: string;
  tags: string[];
  searchQuery: string;
}

// Columnas de tabla
interface AlertTableColumn {
  key: string;
  label: string;
  sortable: boolean;
  width?: number;
  formatter?: (value: any, row: Alert) => string | ReactNode;
}

// Configuración de tabla
interface AlertsTable {
  data: Alert[];
  columns: AlertTableColumn[];
  loading: boolean;
  pagination: {
    current: number;
    total: number;
    pageSize: number;
  };
  selectedAlerts: string[];
  filters: AlertFilters;
  onFilterChange: (filters: AlertFilters) => void;
  onSelectionChange: (selected: string[]) => void;
  onSort: (key: string, order: 'asc' | 'desc') => void;
}

// Panel de alertas activas
interface AlertsActivePanel {
  alerts: Alert[];
  stats: {
    total: number;
    bySeverity: Record<string, number>;
    avgAge: string; // "2h 15m"
  };
  bulkActions: Array<{
    key: 'acknowledge' | 'assign' | 'resolve' | 'escalate';
    label: string;
    icon: string;
    requiresSelection: boolean;
    requiresConfirmation: boolean;
  }>;
  quickActions: Array<{
    key: 'acknowledge' | 'assign' | 'resolve' | 'snooze';
    label: string;
    icon: string;
    onClick: (alertId: string) => void;
  }>;
}

// Panel de historial
interface AlertsHistoryPanel {
  alerts: Alert[];
  resolutionStats: {
    totalResolved: number;
    avgResolutionTime: string;
    resolutionRate: number;
    topResolvers: Array<{
      adminId: string;
      name: string;
      resolvedCount: number;
      avgTime: string;
    }>;
  };
  exportOptions: {
    formats: ['csv', 'json', 'pdf'];
    datePresets: ['today', 'yesterday', 'last7days', 'last30days', 'custom'];
  };
}

// Panel de reglas
interface AlertsRulesPanel {
  rules: AlertRule[];
  categories: Array<{
    id: string;
    name: string;
    description: string;
    ruleCount: number;
  }>;
  ruleEditor: {
    isOpen: boolean;
    editingRule?: AlertRule;
    templates: AlertRuleTemplate[];
  };
}
```

### Interfaces de Componentes Específicos

```typescript
// Visor de alerta individual
interface AlertDetail {
  alert: Alert;
  timeline: Array<{
    timestamp: string;
    action: 'created' | 'acknowledged' | 'assigned' | 'resolved' | 'escalated';
    user: string;
    notes?: string;
  }>;
  relatedAlerts: Alert[];
  affectedEntities: Array<{
    type: 'user' | 'system' | 'service' | 'transaction';
    id: string;
    name: string;
    impact: 'low' | 'medium' | 'high';
  }>;
  resolution: {
    steps: string[];
    recommendedActions: Array<{
      priority: 'high' | 'medium' | 'low';
      action: string;
      automated: boolean;
    }>;
    similarResolutions: Array<{
      alertId: string;
      resolution: string;
      successRate: number;
    }>;
  };
}

// Configurador de reglas
interface AlertRuleEditor {
  rule: AlertRule;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'regex';
    value: string | number;
    logic: 'and' | 'or';
  }>;
  actions: Array<{
    type: 'notify' | 'assign' | 'escalate' | 'create_ticket';
    config: Record<string, any>;
  }>;
  notifications: {
    channels: Array<'email' | 'sms' | 'slack' | 'teams' | 'webhook'>;
    recipients: string[];
    cooldown: number; // segundos
    escalation: {
      enabled: boolean;
      after: number; // segundos
      to: string[];
    };
  };
}

// Panel de métricas
interface AlertMetrics {
  timeRange: {
    start: string;
    end: string;
  };
  metrics: {
    totalAlerts: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    mttr: string; // Mean Time To Resolution
    mtta: string; // Mean Time To Acknowledge
    falsePositiveRate: number;
  };
  trends: Array<{
    date: string;
    total: number;
    resolved: number;
    avgResolutionTime: number;
  }>;
  topSources: Array<{
    source: string;
    count: number;
    severity: Record<string, number>;
  }>;
}
```

### Tipos Auxiliares

```typescript
// Severidad de alerta
type AlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';

// Tipo de alerta
type AlertType = 'system' | 'security' | 'performance' | 'finance' | 'user';

// Estado de alerta
type AlertStatus = 'active' | 'resolved' | 'acknowledged' | 'snoozed' | 'escalated';

// Acción de alerta
type AlertAction = 'acknowledge' | 'assign' | 'resolve' | 'escalate' | 'snooze';

// Canal de notificación
type NotificationChannel = 'email' | 'sms' | 'slack' | 'teams' | 'webhook' | 'in-app';

// Regla de alerta
interface AlertRule {
  id: string;
  name: string;
  description: string;
  type: AlertType;
  severity: AlertSeverity;
  condition: string;
  threshold?: number;
  duration: number; // segundos
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
}

// Plantilla de regla
interface AlertRuleTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  conditions: Array<{
    field: string;
    operator: string;
    value: string;
    description: string;
  }>;
  recommendedSeverity: AlertSeverity;
  recommendedActions: string[];
}
```

# Alertas del Sistema (Admin)

## Propósito del módulo
- Panel de monitoreo de alertas y notificaciones críticas del sistema
- Gestión de alertas por tipo: sistema, seguridad, rendimiento, finanzas
- Configuración de umbrales y reglas de alertas
- Historial y análisis de alertas

## Rutas y query params
- Ruta exacta: `/admin/alerts`
- Query params:
  - `tab = overview | active | history | rules`
  - `type = system | security | performance | finance | user`
  - `severity = info | warning | critical | emergency`
  - `status = active | resolved | acknowledged`
  - `from`, `to` (rango de fechas)
  - `assignedTo` (admin asignado)
  - `page`, `limit`, `sort`

## Estructura de página

### Header
- Título: "🚨 Alertas del Sistema"
- Subtítulo: "Monitoreo y gestión de alertas críticas"
- Controles: rango de fechas, refresh, exportar, configurar reglas

### Tabs principales

#### 1. Overview (Resumen)
- KPIs principales:
  - Alertas activas (por severidad)
  - Tasa de resolución
  - Tiempo promedio de resolución
  - Top fuentes de alertas
  - Alertas por tipo (gráfico de donut)

#### 2. Active (Alertas Activas)
- Tabla con alertas que requieren acción:
  - Timestamp
  - Severidad (badge con color)
  - Tipo (icono)
  - Mensaje/descripción
  - Origen/afectado
  - Asignado a
  - Tiempo activo
  - Acciones rápidas (acknowledge, assign, resolve)

#### 3. History (Historial)
- Tabla con alertas resueltas:
  - Mismas columnas que activas
  - Tiempo de resolución
  - Resuelto por
  - Notas de resolución
  - Filtros adicionales por resuelto por

#### 4. Rules (Reglas)
- Gestión de reglas de alertas:
  - Nombre de la regla
  - Condición/trigger
  - Severidad
  - Notificaciones (email, SMS, in-app)
  - Asignación automática
  - Estado (activa/inactiva)
  - Acciones: editar, duplicar, desactivar

## Tipos de Alertas

### System (Sistema)
- Servicios caídos
- Alta latencia
- Errores de conexión
- Límites de API excedidos
- Problemas de base de datos

### Security (Seguridad)
- Intentos de acceso no autorizado
- Actividad sospechosa
- Violaciones de límites
- Cambios inusuales en patrones

### Performance (Rendimiento)
- CPU/RAM alta
- Tiempo de respuesta elevado
- Queue overflow
- Error rates elevados

### Finance (Finanzas)
- Discrepancias en reconciliación
- Pagos fallidos
- Límites de crédito
- Anomalías en apuestas

### User (Usuario)
- Quejas recurrentes
- Comportamiento inusual
- Violaciones de términos

## Severidad

- **Emergency** 🔴: Requiere acción inmediata, afecta todo el sistema
- **Critical** 🟠: Afecta funcionalidad importante, acción en < 1 hora
- **Warning** 🟡: Problema potencial, acción en < 24 horas
- **Info** 🔵: Información, sin acción inmediata requerida

## Acciones disponibles

### Para alertas individuales:
- **Acknowledge**: Marcar como vista/entendida
- **Assign**: Asignar a admin específico
- **Resolve**: Marcar como resuelta con notas
- **Escalate**: Subir severidad o notificar a superior
- **Snooze**: Silenciar por período (15min, 1h, 4h, 24h)

### Acciones masivas:
- Acknowledge múltiples
- Assign múltiples
- Exportar seleccionadas
- Crear incidente desde selección

## Notificaciones y Escalamiento

### Canales de notificación:
- In-app (obligatorio)
- Email (configurable por tipo)
- SMS (solo emergency/critical)
- Slack/Teams (si integrado)

### Reglas de escalamiento:
- Auto-asignación por tipo de alerta
- Rotación de guardia para emergency
- Escalamiento automático si no se acknowledge en X tiempo

## Integraciones

### Con otros módulos:
- **admin-users.html**: Ver usuario afectado
- **admin-finance.html**: Ver transacciones relacionadas
- **admin-bets.html**: Ver apuestas del período
- **admin-support.html**: Crear ticket de soporte

### APIs externas:
- Webhooks para sistemas de monitoreo (Prometheus, Grafana)
- Integración con servicios de notificación
- Logs centralizados (ELK, Splunk)

## Esquema de datos para alertas

```typescript
interface Alert {
  id: string;
  timestamp: Date;
  type: 'system' | 'security' | 'performance' | 'finance' | 'user';
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  title: string;
  description: string;
  source: string;
  affectedEntity?: {
    type: 'user' | 'system' | 'service';
    id: string;
    name: string;
  };
  metadata?: Record<string, any>;
  assignedTo?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
  resolutionNotes?: string;
  tags: string[];
}
```

## Métricas y reportes

### KPIs principales:
- MTTR (Mean Time To Resolution)
- Alertas por día/semana
- Porcentaje de falsos positivos
- Distribución por tipo y severidad
- Carga de trabajo por admin

### Reportes automáticos:
- Resumen diario de alertas
- Análisis de tendencias
- Reporte de guardia
- Métricas de SLA

## Configuración de guardrails

- Límite de alertas por minuto para evitar spam
- Cooldown entre alertas similares
- Supresión de alertas conocidas
- Umbrales configurables por entorno
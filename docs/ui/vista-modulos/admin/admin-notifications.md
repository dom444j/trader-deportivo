# 📢 Admin: Gestión de Notificaciones (`/admin/notifications`)

## 🎯 Objetivo
Panel administrativo para gestionar el sistema de notificaciones global: envío masivo, plantillas, programación, análisis de efectividad y control de comunicaciones con usuarios.

**Rol:** Administrador  
**Ruta:** `/admin/notifications`  
**Acento visual:** Rojo/Admin

**Principio Clave:** El control total sobre las comunicaciones de la plataforma, con capacidad de segmentación avanzada, análisis de engagement y gestión de preferencias globales.

---

## 🎨 Guía de Estilo Visual

### Paleta de Colores Admin
```css
--admin-primary: #DC2626;
--admin-secondary: #7F1D1D;
--admin-accent: #EF4444;
--admin-success: #10B981;
--admin-warning: #F59E0B;
--admin-danger: #DC2626;
--admin-info: #3B82F6;
```

### Reglas de Consistencia
- ✅ **MANTENER:** Layout, estructura, componentes base
- ✅ **CAMBIAR:** Colores de botones, badges, sidebar activo, highlights
- ✅ **USAR:** Esquema de color rojo para identificación admin
- ✅ **PRIORIDAD:** Control y análisis sobre estética

---

---

## 1. Estructura y Layout de la Página

### Header Fijo

```typescript
interface AdminNotificationsHeader {
  title: string;           // "Gestión de Notificaciones"
  subtitle: string;        // "Control total del sistema de comunicaciones"
  controls: {
    search: {
      placeholder: string; // "Buscar notificaciones..."
      value: string;
      onChange: (value: string) => void;
    };
    quickActions: {
      newNotification: { 
        label: string; 
        onClick: () => void;
        icon: string;
      };
      templates: { 
        label: string; 
        onClick: () => void;
        icon: string;
      };
      export: { 
        label: string; 
        onClick: () => void;
        icon: string;
        disabled?: boolean;
      };
      refresh: { 
        label: string; 
        loading: boolean; 
        onClick: () => void;
        icon: string;
      };
    };
  };
}
```

### Body

```typescript
interface AdminNotificationsLayout {
  kpis: NotificationKPIs;
  mainContent: {
    activeTab: NotificationTab;
    tabs: NotificationTabsConfig;
  };
  sidebar?: {
    component: 'NotificationPreview' | 'TemplateSelector';
    open: boolean;
  };
}
```

---

## 2. KPIs de Notificaciones (Cards Superiores)

```typescript
interface NotificationKPIs {
  totalSent: {
    value: number;
    change: number; // porcentaje
    trend: 'up' | 'down' | 'stable';
    icon: 'send' | 'trending-up' | 'trending-down';
    color: 'blue' | 'green' | 'red';
    description: string;
  };
  deliveryRate: {
    value: number; // porcentaje
    change: number;
    trend: 'up' | 'down' | 'stable';
    icon: 'check-circle' | 'x-circle';
    color: 'green' | 'red';
    description: string;
  };
  openRate: {
    value: number; // porcentaje
    change: number;
    trend: 'up' | 'down' | 'stable';
    icon: 'eye' | 'eye-off';
    color: 'blue' | 'orange';
    description: string;
  };
  clickRate: {
    value: number; // porcentaje
    change: number;
    trend: 'up' | 'down' | 'stable';
    icon: 'mouse-pointer' | 'hand';
    color: 'purple' | 'gray';
    description: string;
  };
  bounceRate: {
    value: number; // porcentaje
    change: number;
    trend: 'up' | 'down' | 'stable';
    icon: 'return' | 'ban';
    color: 'red' | 'orange';
    description: string;
  };
  scheduledCount: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
    icon: 'clock' | 'calendar';
    color: 'indigo' | 'blue';
    description: string;
  };
}
```

---

## 3. Sistema de Tabs y Navegación

```typescript
interface NotificationTabsConfig {
  compose: {
    id: 'compose';
    label: 'Redactar';
    icon: 'edit';
    component: 'NotificationComposer';
  };
  templates: {
    id: 'templates';
    label: 'Plantillas';
    icon: 'template';
    component: 'TemplateManager';
  };
  history: {
    id: 'history';
    label: 'Historial';
    icon: 'history';
    component: 'NotificationHistory';
  };
  analytics: {
    id: 'analytics';
    label: 'Analíticas';
    icon: 'chart';
    component: 'NotificationAnalytics';
  };
  settings: {
    id: 'settings';
    label: 'Configuración';
    icon: 'settings';
    component: 'NotificationSettings';
  };
}

type NotificationTab = keyof NotificationTabsConfig;
```

---

## 4. Componente: NotificationComposer

```typescript
interface NotificationComposer {
  // Información básica
  type: NotificationType;
  channels: NotificationChannel[];
  
  // Destinatarios
  recipients: {
    mode: 'all' | 'segmented' | 'individual';
    segments?: UserSegment[];
    individualUsers?: User[];
    customFilters?: UserFilters;
  };
  
  // Contenido
  content: {
    subject: string;
    body: string;
    template?: NotificationTemplate;
    variables?: Record<string, any>;
    attachments?: File[];
  };
  
  // Programación
  scheduling: {
    sendNow: boolean;
    scheduledTime?: Date;
    timezone?: string;
    recurring?: {
      enabled: boolean;
      frequency: 'daily' | 'weekly' | 'monthly';
      endDate?: Date;
    };
  };
  
  // Validación y preview
  validation: {
    errors: ValidationError[];
    warnings: ValidationWarning[];
    isValid: boolean;
  };
  
  // Estado
  state: {
    isComposing: boolean;
    isPreviewing: boolean;
    isScheduling: boolean;
    draftSaved: boolean;
  };
}

// Tipos auxiliares
interface NotificationTemplate {
  id: string;
  name: string;
  category: 'marketing' | 'system' | 'transactional' | 'alert';
  variables: TemplateVariable[];
  preview: string;
}

interface UserSegment {
  id: string;
  name: string;
  filters: UserFilters;
  userCount: number;
  description: string;
}

interface UserFilters {
  roles?: UserRole[];
  registrationDate?: DateRange;
  activityStatus?: 'active' | 'inactive' | 'suspended';
  riskLevel?: RiskLevel[];
  bankrollRange?: NumberRange;
  subscriptionStatus?: 'free' | 'premium' | 'vip';
  geographic?: {
    countries?: string[];
    languages?: string[];
  };
}

type NotificationType = 'marketing' | 'system' | 'transactional' | 'alert' | 'announcement';
type NotificationChannel = 'email' | 'sms' | 'push' | 'in-app';
```

---

## 5. Componente: TemplateManager

```typescript
interface TemplateManager {
  templates: NotificationTemplate[];
  categories: TemplateCategory[];
  
  // Gestión de plantillas
  actions: {
    create: () => void;
    edit: (templateId: string) => void;
    duplicate: (templateId: string) => void;
    delete: (templateId: string) => void;
    preview: (templateId: string) => void;
  };
  
  // Filtros y búsqueda
  filters: {
    search: string;
    category: string;
    status: 'active' | 'draft' | 'archived';
    sortBy: 'name' | 'created' | 'modified' | 'usage';
    sortOrder: 'asc' | 'desc';
  };
  
  // Estadísticas
  stats: {
    totalTemplates: number;
    activeTemplates: number;
    mostUsed: TemplateUsage[];
    performance: TemplatePerformance[];
  };
}

interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  templateCount: number;
}

interface TemplateUsage {
  templateId: string;
  templateName: string;
  usageCount: number;
  lastUsed: Date;
}

interface TemplatePerformance {
  templateId: string;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
}
```

---

## 6. Componente: NotificationHistory

```typescript
interface NotificationHistory {
  notifications: HistoricalNotification[];
  
  // Filtros avanzados
  filters: {
    dateRange: DateRange;
    type: NotificationType[];
    channel: NotificationChannel[];
    status: NotificationStatus[];
    sender: string;
    search: string;
  };
  
  // Vista y ordenamiento
  view: {
    mode: 'list' | 'grid' | 'timeline';
    sortBy: 'date' | 'type' | 'status' | 'sender' | 'recipients';
    sortOrder: 'asc' | 'desc';
    pageSize: number;
  };
  
  // Acciones masivas
  bulkActions: {
    selected: string[];
    actions: ('export' | 'resend' | 'cancel' | 'archive')[];
  };
}

interface HistoricalNotification {
  id: string;
  type: NotificationType;
  channel: NotificationChannel;
  status: NotificationStatus;
  
  // Información de envío
  sentAt: Date;
  scheduledFor?: Date;
  sender: {
    id: string;
    name: string;
    role: UserRole;
  };
  
  // Contenido
  subject: string;
  preview: string;
  recipientCount: number;
  
  // Métricas
  metrics: {
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    complaints: number;
  };
  
  // Estado y errores
  errors: NotificationError[];
  tags: string[];
  archived: boolean;
}

type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'cancelled' | 'bounced';

interface NotificationError {
  type: 'delivery' | 'validation' | 'system';
  message: string;
  timestamp: Date;
  recipient?: string;
}
```

---

## 7. Componente: NotificationAnalytics

```typescript
interface NotificationAnalytics {
  // Métricas principales
  overview: {
    totalNotifications: number;
    totalRecipients: number;
    averageDeliveryRate: number;
    averageOpenRate: number;
    averageClickRate: number;
    totalBounces: number;
    totalComplaints: number;
  };
  
  // Gráficos y tendencias
  charts: {
    deliveryTrend: TimeSeriesData;
    engagementTrend: TimeSeriesData;
    channelPerformance: ChannelData[];
    typePerformance: TypeData[];
    hourlyHeatmap: HeatmapData;
    geographicDistribution: GeographicData[];
  };
  
  // Análisis de segmentos
  segmentAnalysis: {
    byRole: RolePerformance[];
    byRiskLevel: RiskPerformance[];
    bySubscription: SubscriptionPerformance[];
    byRegistrationDate: RegistrationPerformance[];
  };
  
  // Predicciones y recomendaciones
  insights: {
    bestSendTimes: TimeRecommendation[];
    optimalFrequency: FrequencyRecommendation;
    contentSuggestions: ContentSuggestion[];
    riskAlerts: RiskAlert[];
  };
  
  // Configuración de visualización
  config: {
    dateRange: DateRange;
    granularity: 'hour' | 'day' | 'week' | 'month';
    comparisonMode: boolean;
    comparisonPeriod?: DateRange;
  };
}

interface TimeSeriesData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
    type: 'line' | 'bar' | 'area';
  }[];
}

interface ChannelData {
  channel: NotificationChannel;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}

interface RolePerformance {
  role: UserRole;
  notificationsSent: number;
  averageOpenRate: number;
  averageClickRate: number;
  unsubscribeRate: number;
  engagementScore: number;
}

interface TimeRecommendation {
  dayOfWeek: number; // 0-6
  hour: number; // 0-23
  score: number; // 0-100
  reason: string;
}

interface ContentSuggestion {
  type: 'subject' | 'body' | 'cta';
  suggestion: string;
  expectedImprovement: number;
  basedOn: string;
}
```

---

## 8. Componente: NotificationSettings

```typescript
interface NotificationSettings {
  // Configuración global
  global: {
    defaultChannels: NotificationChannel[];
    maxDailyNotifications: number;
    quietHours: {
      enabled: boolean;
      start: string; // HH:MM
      end: string;   // HH:MM
      timezone: string;
    };
    rateLimiting: {
      enabled: boolean;
      maxPerHour: number;
      maxPerDay: number;
    };
  };
  
  // Integraciones
  integrations: {
    email: EmailIntegration;
    sms: SMSIntegration;
    push: PushIntegration;
  };
  
  // Preferencias de usuario
  userPreferences: {
    defaultOptIn: boolean;
    categories: PreferenceCategory[];
    languages: string[];
  };
  
  // Seguridad y cumplimiento
  compliance: {
    gdpr: GDPRSettings;
    canSpam: CanSpamSettings;
    unsubscribe: UnsubscribeSettings;
  };
  
  // Monitoreo y alertas
  monitoring: {
    alertThresholds: AlertThreshold[];
    notificationChannels: NotificationChannel[];
    escalationRules: EscalationRule[];
  };
}

interface EmailIntegration {
  provider: 'sendgrid' | 'mailgun' | 'ses' | 'smtp';
  apiKey: string;
  fromAddress: string;
  fromName: string;
  replyTo: string;
  tracking: {
    opens: boolean;
    clicks: boolean;
    unsubscribe: boolean;
  };
}

interface SMSIntegration {
  provider: 'twilio' | 'nexmo' | 'plivo' | 'sns';
  apiKey: string;
  fromNumber: string;
  maxLength: number;
  unicode: boolean;
}

interface GDPRSettings {
  consentRequired: boolean;
  dataRetention: number; // días
  rightToBeForgotten: boolean;
  dataPortability: boolean;
}

interface PreferenceCategory {
  id: string;
  name: string;
  description: string;
  defaultOptIn: boolean;
  channels: NotificationChannel[];
}
```

## 📋 Tipos de TypeScript Complementarios

### Interfaces Principales del Módulo

```typescript
interface AdminNotificationsModule {
  id: 'admin-notifications'
  name: 'Gestión de Notificaciones'
  description: 'Control total del sistema de comunicaciones'
  version: string
  enabled: boolean
  features: NotificationFeatures
}

interface NotificationFeatures {
  bulkMessaging: boolean
  templateManagement: boolean
  scheduling: boolean
  analytics: boolean
  multiChannel: boolean
  automation: boolean
  segmentation: boolean
}

interface AdminNotificationsHeader {
  title: string
  subtitle: string
  quickStats: NotificationQuickStats
  controls: HeaderControls
}

interface NotificationQuickStats {
  totalSent: QuickStat
  deliveryRate: QuickStat
  openRate: QuickStat
  clickRate: QuickStat
  bounceRate: QuickStat
  scheduledCount: QuickStat
}

interface QuickStat {
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: string
  color: string
  description: string
}

interface HeaderControls {
  search: SearchControl
  quickActions: QuickActions
}

interface SearchControl {
  placeholder: string
  value: string
  onChange: (value: string) => void
}

interface QuickActions {
  newNotification: ActionButton
  templates: ActionButton
  export: ActionButton
  refresh: ActionButton
}

interface ActionButton {
  label: string
  onClick: () => void
  icon: string
  disabled?: boolean
  loading?: boolean
}
```

### Filtros y Segmentación Avanzada

```typescript
interface AdvancedFilters {
  userSegmentation: UserSegmentationFilters
  temporalFilters: TemporalFilters
  contentFilters: ContentFilters
  engagementFilters: EngagementFilters
  geographicFilters: GeographicFilters
}

interface UserSegmentationFilters {
  roles: UserRole[]
  riskLevels: RiskLevel[]
  subscriptionTiers: SubscriptionTier[]
  activityStatus: UserActivityStatus[]
  registrationDate: DateRangeFilter
  bankrollRange: NumberRangeFilter
  verificationStatus: VerificationStatus[]
  tradingExperience: ExperienceLevel[]
}

interface TemporalFilters {
  dateRange: DateRangeFilter
  timeOfDay: TimeRangeFilter
  dayOfWeek: number[]
  timezone: string
  recurrence: RecurrencePattern
}

interface ContentFilters {
  notificationTypes: NotificationType[]
  channels: NotificationChannel[]
  templateCategories: TemplateCategory[]
  languages: string[]
  priorityLevels: PriorityLevel[]
}

interface EngagementFilters {
  minOpenRate: number
  maxOpenRate: number
  minClickRate: number
  maxClickRate: number
  minEngagementScore: number
  unsubscribeStatus: UnsubscribeStatus
}

interface GeographicFilters {
  countries: string[]
  regions: string[]
  languages: string[]
  timezones: string[]
}

interface DateRangeFilter {
  from?: string
  to?: string
  preset?: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'last30Days' | 'thisYear' | 'custom'
}

interface TimeRangeFilter {
  start?: string
  end?: string
}

interface NumberRangeFilter {
  min?: number
  max?: number
}

interface RecurrencePattern {
  type: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval?: number
  daysOfWeek?: number[]
  daysOfMonth?: number[]
  endDate?: string
  maxOccurrences?: number
}
```

### Análisis y Reportes Avanzados

```typescript
interface AdvancedAnalytics {
  cohortAnalysis: CohortAnalysis
  funnelAnalysis: FunnelAnalysis
  predictiveAnalytics: PredictiveAnalytics
  comparativeAnalysis: ComparativeAnalysis
  realTimeMetrics: RealTimeMetrics
}

interface CohortAnalysis {
  cohorts: UserCohort[]
  retentionRates: RetentionData[]
  engagementTrends: EngagementTrend[]
  lifetimeValue: LTVData[]
}

interface UserCohort {
  id: string
  name: string
  criteria: CohortCriteria
  userCount: number
  createdAt: string
}

interface CohortCriteria {
  registrationDate: DateRangeFilter
  firstActivity: DateRangeFilter
  acquisitionChannel: string
  initialSubscription: SubscriptionTier
}

interface RetentionData {
  cohortId: string
  day: number
  retentionRate: number
  activeUsers: number
}

interface FunnelAnalysis {
  stages: FunnelStage[]
  conversionRates: ConversionRate[]
  dropOffPoints: DropOffPoint[]
  optimizationSuggestions: OptimizationSuggestion[]
}

interface FunnelStage {
  id: string
  name: string
  description: string
  event: string
  filters: Record<string, any>
}

interface ConversionRate {
  fromStage: string
  toStage: string
  rate: number
  userCount: number
}

interface PredictiveAnalytics {
  engagementPrediction: EngagementPrediction
  churnPrediction: ChurnPrediction
  optimalTiming: OptimalTimingPrediction
  contentOptimization: ContentOptimizationPrediction
}

interface EngagementPrediction {
  userId: string
  predictedEngagement: number
  confidence: number
  factors: EngagementFactor[]
}

interface ChurnPrediction {
  userId: string
  churnRisk: number
  confidence: number
  reasons: string[]
  preventionActions: string[]
}

interface RealTimeMetrics {
  activeNotifications: number
  currentDeliveryRate: number
  realTimeEngagement: RealTimeEngagement
  systemHealth: SystemHealth
}

interface RealTimeEngagement {
  opensPerMinute: number
  clicksPerMinute: number
  unsubscribesPerMinute: number
  bouncesPerMinute: number
}

interface SystemHealth {
  queueSize: number
  processingRate: number
  errorRate: number
  responseTime: number
  status: 'healthy' | 'degraded' | 'critical'
}
```

### Gestión de Plantillas Avanzada

```typescript
interface AdvancedTemplateManager {
  templateLibrary: TemplateLibrary
  dynamicContent: DynamicContentSystem
  personalizationEngine: PersonalizationEngine
  versionControl: TemplateVersionControl
  performanceOptimization: TemplateOptimization
}

interface TemplateLibrary {
  categories: TemplateCategory[]
  templates: NotificationTemplate[]
  search: TemplateSearch
  recommendations: TemplateRecommendation[]
}

interface DynamicContentSystem {
  variables: TemplateVariable[]
  conditionalBlocks: ConditionalBlock[]
  dynamicImages: DynamicImage[]
  personalizedLinks: PersonalizedLink[]
}

interface PersonalizationEngine {
  userAttributes: UserAttribute[]
  behaviorTriggers: BehaviorTrigger[]
  preferenceLearning: PreferenceLearning
  contentAdaptation: ContentAdaptation
}

interface TemplateVersionControl {
  versions: TemplateVersion[]
  changelog: TemplateChange[]
  rollbackCapabilities: RollbackConfig
  approvalWorkflow: ApprovalWorkflow
}

interface TemplateOptimization {
  abTesting: ABTestConfig
  performanceMetrics: TemplatePerformance[]
  optimizationSuggestions: OptimizationSuggestion[]
  autoOptimization: AutoOptimizationConfig
}

interface ABTestConfig {
  testId: string
  templateId: string
  variants: ABTestVariant[]
  successMetrics: SuccessMetric[]
  duration: number
  sampleSize: number
}

interface ABTestVariant {
  id: string
  name: string
  content: string
  weight: number
  targetAudience: AudienceSegment
}
```

### Monitoreo y Alertas

```typescript
interface MonitoringAndAlerts {
  systemMonitoring: SystemMonitoring
  performanceAlerts: PerformanceAlertSystem
  userBehaviorAlerts: UserBehaviorAlertSystem
  complianceMonitoring: ComplianceMonitoring
  escalationProcedures: EscalationProcedures
}

interface SystemMonitoring {
  infrastructureMetrics: InfrastructureMetric[]
  applicationMetrics: ApplicationMetric[]
  notificationMetrics: NotificationMetric[]
  healthChecks: HealthCheck[]
}

interface PerformanceAlertSystem {
  thresholds: PerformanceThreshold[]
  alertRules: AlertRule[]
  notificationChannels: AlertChannel[]
  responseProcedures: ResponseProcedure[]
}

interface UserBehaviorAlertSystem {
  anomalyDetection: AnomalyConfig
  engagementAlerts: EngagementAlert[]
  complaintMonitoring: ComplaintMonitor
  unsubscribeSpikes: UnsubscribeSpikeAlert
}

interface ComplianceMonitoring {
  gdprCompliance: GDPRMonitor
  canSpamCompliance: CanSpamMonitor
  dataRetention: DataRetentionMonitor
  consentManagement: ConsentMonitor
}

interface EscalationProcedures {
  levels: EscalationLevel[]
  triggers: EscalationTrigger[]
  contacts: EscalationContact[]
  procedures: EscalationProcedure[]
}

interface EscalationLevel {
  level: number
  name: string
  responseTime: number
  contacts: string[]
  authority: string[]
}

// Tipos auxiliares adicionales
type UserRole = 'admin' | 'moderator' | 'analyst' | 'trader' | 'tipster' | 'premium' | 'vip' | 'suspended'
type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
type SubscriptionTier = 'free' | 'basic' | 'premium' | 'vip' | 'enterprise'
type UserActivityStatus = 'active' | 'inactive' | 'suspended' | 'banned' | 'deleted'
type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'
type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'
type PriorityLevel = 'low' | 'normal' | 'high' | 'urgent' | 'critical'
type UnsubscribeStatus = 'subscribed' | 'unsubscribed' | 'pending'
type AudienceSegment = 'all' | 'new_users' | 'active_users' | 'premium_users' | 'churned_users'
type SuccessMetric = 'open_rate' | 'click_rate' | 'conversion_rate' | 'engagement_score' | 'retention_rate'

---

## 🎨 Diseño Visual

### Esquema de Colores (Admin)
```css
:root {
  --primary-admin: #f59e0b;        /* Amber 500 */
  --primary-admin-dark: #d97706;   /* Amber 600 */
  --secondary-admin: #f97316;      /* Orange 500 */
  --accent-admin: #fb923c;        /* Orange 400 */
  --background-admin: #111827;     /* Gray 900 */
  --surface-admin: #1f2937;        /* Gray 800 */
  --text-admin: #f9fafb;           /* Gray 50 */
  --text-secondary-admin: #d1d5db; /* Gray 300 */
  --success: #10b981;                /* Green 500 */
  --warning: #f59e0b;               /* Amber 500 */
  --error: #ef4444;                 /* Red 500 */
}
```

### Tipografías
- **Principal**: 'Rajdhani', sans-serif (títulos y encabezados)
- **Monoespaciada**: 'JetBrains Mono', monospace (datos técnicos)
- **Secundaria**: Inter, sans-serif (texto de notificaciones)

## 🏗️ Estructura HTML Propuesta

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Gestión de Notificaciones</title>
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../styles/admin.css">
</head>
<body>
    <!-- Sidebar Admin -->
    <aside class="admin-sidebar">
        <div class="sidebar-header">
            <div class="logo">
                <span class="logo-text">ADMIN</span>
            </div>
        </div>
        <nav class="sidebar-nav">
            <a href="admin-dashboard.html" class="nav-item">Dashboard</a>
            <a href="admin-users.html" class="nav-item">Usuarios</a>
            <a href="admin-agents.html" class="nav-item">Agentes IA</a>
            <a href="admin-notifications.html" class="nav-item active">Notificaciones</a>
            <!-- ... más items -->
        </nav>
    </aside>

    <!-- Contenido Principal -->
    <main class="admin-main">
        <header class="admin-header">
            <h1>Gestión de Notificaciones</h1>
            <div class="header-actions">
                <button class="btn btn-primary">Nueva Notificación</button>
                <button class="btn btn-secondary">Plantillas</button>
            </div>
        </header>

        <!-- KPI Cards -->
        <section class="kpi-grid">
            <div class="kpi-card">
                <h3>Total Enviadas</h3>
                <div class="kpi-value">24,567</div>
                <div class="kpi-change positive">+12.3%</div>
            </div>
            <div class="kpi-card">
                <h3>Tasa de Apertura</h3>
                <div class="kpi-value">68.4%</div>
                <div class="kpi-change positive">+5.2%</div>
            </div>
            <div class="kpi-card">
                <h3>Tasa de Click</h3>
                <div class="kpi-value">23.7%</div>
                <div class="kpi-change negative">-2.1%</div>
            </div>
            <div class="kpi-card">
                <h3>Errores de Envío</h3>
                <div class="kpi-value">124</div>
                <div class="kpi-change neutral">0.5%</div>
            </div>
        </section>

        <!-- Tabs de Navegación -->
        <section class="tabs-section">
            <div class="tabs">
                <button class="tab active" data-tab="compose">Redactar</button>
                <button class="tab" data-tab="templates">Plantillas</button>
                <button class="tab" data-tab="history">Historial</button>
                <button class="tab" data-tab="analytics">Analíticas</button>
                <button class="tab" data-tab="settings">Configuración</button>
            </div>
        </section>

        <!-- Panel de Redacción -->
        <section id="compose-panel" class="panel active">
            <div class="compose-container">
                <div class="compose-form">
                    <div class="form-group">
                        <label>Tipo de Notificación</label>
                        <select class="notification-type">
                            <option value="email">Email</option>
                            <option value="push">Push Notification</option>
                            <option value="sms">SMS</option>
                            <option value="in-app">In-App</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Destinatarios</label>
                        <div class="recipient-selector">
                            <select class="recipient-type">
                                <option value="all">Todos los usuarios</option>
                                <option value="segment">Segmento específico</option>
                                <option value="individual">Usuarios individuales</option>
                                <option value="tipsters">Solo tipsters</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Asunto/Título</label>
                        <input type="text" class="notification-subject" placeholder="Ingrese el asunto...">
                    </div>
                    
                    <div class="form-group">
                        <label>Mensaje</label>
                        <textarea class="notification-message" placeholder="Escriba su mensaje aquí..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn btn-secondary preview-btn">Vista Previa</button>
                        <button class="btn btn-primary schedule-btn">Programar Envío</button>
                        <button class="btn btn-success send-btn">Enviar Ahora</button>
                    </div>
                </div>
                
                <div class="preview-panel">
                    <h3>Vista Previa</h3>
                    <div class="preview-content">
                        <!-- Vista previa dinámica -->
                    </div>
                </div>
            </div>
        </section>

        <!-- Panel de Plantillas -->
        <section id="templates-panel" class="panel">
            <div class="templates-container">
                <div class="templates-header">
                    <h2>Plantillas de Notificaciones</h2>
                    <button class="btn btn-primary">Nueva Plantilla</button>
                </div>
                
                <div class="templates-grid">
                    <!-- Plantillas dinámicas -->
                </div>
            </div>
        </section>

        <!-- Panel de Historial -->
        <section id="history-panel" class="panel">
            <div class="history-container">
                <div class="history-filters">
                    <input type="date" class="date-filter" placeholder="Fecha desde">
                    <input type="date" class="date-filter" placeholder="Fecha hasta">
                    <select class="type-filter">
                        <option>Todos los tipos</option>
                        <option>Email</option>
                        <option>Push</option>
                        <option>SMS</option>
                    </select>
                    <select class="status-filter">
                        <option>Todos los estados</option>
                        <option>Enviado</option>
                        <option>En progreso</option>
                        <option>Error</option>
                    </select>
                </div>
                
                <div class="history-table">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Tipo</th>
                                <th>Asunto</th>
                                <th>Destinatarios</th>
                                <th>Estado</th>
                                <th>Apertura</th>
                                <th>Clicks</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Historial dinámico -->
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </main>
</body>
</html>
```

## 🔧 Funcionalidades JavaScript

### Gestión de Notificaciones
```javascript
// Estado de la aplicación
const notificationsState = {
    activeTab: 'compose',
    templates: [],
    history: [],
    analytics: {},
    currentNotification: {
        type: 'email',
        recipients: 'all',
        subject: '',
        message: '',
        scheduled: false,
        scheduledDate: null
    }
};

// Funciones principales
const switchTab = (tabName) => {
    // Cambiar entre pestañas
};

const loadTemplates = async () => {
    // Cargar plantillas desde API
};

const loadHistory = async (filters) => {
    // Cargar historial con filtros
};

const sendNotification = async (notification) => {
    // Enviar notificación
};

const scheduleNotification = async (notification, date) => {
    // Programar notificación para fecha futura
};
```

### Vista Previa Dinámica
```javascript
// Actualizar vista previa en tiempo real
const updatePreview = () => {
    const type = document.querySelector('.notification-type').value;
    const subject = document.querySelector('.notification-subject').value;
    const message = document.querySelector('.notification-message').value;
    
    const previewContent = document.querySelector('.preview-content');
    
    switch(type) {
        case 'email':
            previewContent.innerHTML = `
                <div class="email-preview">
                    <div class="email-header">
                        <strong>Asunto:</strong> ${subject}
                    </div>
                    <div class="email-body">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;
            break;
        case 'push':
            previewContent.innerHTML = `
                <div class="push-preview">
                    <div class="push-notification">
                        <div class="push-title">${subject}</div>
                        <div class="push-message">${message}</div>
                    </div>
                </div>
            `;
            break;
        // ... más tipos
    }
};
```

## 📊 Integración con API

### Endpoints Requeridos
```
GET    /api/admin/notifications              // Listar notificaciones
POST   /api/admin/notifications              // Crear nueva notificación
GET    /api/admin/notifications/:id          // Detalle de notificación
PUT    /api/admin/notifications/:id          // Actualizar notificación
POST   /api/admin/notifications/:id/send     // Enviar notificación
GET    /api/admin/notifications/stats        // Estadísticas
GET    /api/admin/notifications/templates    // Plantillas
POST   /api/admin/notifications/templates    // Crear plantilla
GET    /api/admin/notifications/history      // Historial completo
```

### Formatos de Respuesta
```json
{
  "notifications": [
    {
      "id": "notif_123",
      "type": "email",
      "subject": "¡Nuevas señales disponibles!",
      "message": "Tenemos 5 nuevas señales de trading para ti...",
      "recipients": {
        "type": "segment",
        "count": 1250,
        "criteria": "active_traders"
      },
      "status": "sent",
      "sentAt": "2024-01-14T10:30:00Z",
      "stats": {
        "delivered": 1200,
        "opened": 820,
        "clicked": 195,
        "bounced": 50
      }
    }
  ],
  "stats": {
    "totalSent": 24567,
    "openRate": 68.4,
    "clickRate": 23.7,
    "bounceRate": 2.1
  }
}
```

## 🚨 Consideraciones de Seguridad

### Prevención de Spam
- [ ] Rate limiting por usuario/IP
- [ ] Validación de contenido
- [ ] Revisión manual de masivos
- [ ] Unsubscribe automático

### Protección de Datos
- [ ] Encriptar mensajes sensibles
- [ ] No almacenar datos de usuarios innecesarios
- [ ] Logs de auditoría de envíos
- [ ] Cumplimiento CAN-SPAM/GDPR

### Gestión de Errores
- [ ] Manejo de bounces
- [ ] Reintentos automáticos
- [ ] Notificación de fallos
- [ ] Blacklist management

## 📊 Analytics y Reportes

### Métricas Principales
1. **Tasa de Entrega**: % de mensajes entregados
2. **Tasa de Apertura**: % de mensajes abiertos
3. **Tasa de Click**: % de clicks en enlaces
4. **Tasa de Rebote**: % de mensajes rechazados
5. **Tasa de Cancelación**: % de usuarios que se dan de baja

### Segmentación de Datos
- Por tipo de usuario (trader, tipster, admin)
- Por canal de notificación
- Por fecha y hora de envío
- Por contenido de la notificación
- Por dispositivo del receptor

### Reportes Automáticos
- [ ] Reporte diario de envíos
- [ ] Reporte semanal de métricas
- [ ] Alertas de anomalías
- [ ] Tendencias de engagement

## 🧪 Testing

### Casos de Prueba
- [ ] Envío a grandes volúmenes (10k+ usuarios)
- [ ] Programación de notificaciones
- [ ] Manejo de diferentes tipos de receptores
- [ ] Vista previa en todos los formatos
- [ ] Tiempos de respuesta (< 3 segundos)

### Validaciones
- [ ] Validación de formato de email
- [ ] Límite de caracteres por canal
- [ ] Prevención de duplicados
- [ ] Manejo de caracteres especiales
- [ ] Compatibilidad cross-browser

## 📚 Recursos

### Archivos Relacionados
- `notifications.html` (vista de usuario)
- `admin-dashboard.html` (dashboard principal)
- `admin-users.html` (gestión de usuarios)
- `PALETA-COLORES.md` (esquema de colores)

### Integraciones Externas
- **Email**: SendGrid, Mailgun, AWS SES
- **SMS**: Twilio, AWS SNS
- **Push**: Firebase Cloud Messaging
- **In-App**: WebSocket o Server-Sent Events

### Tecnologías Recomendadas
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Rich Text Editor**: Quill.js o TinyMCE
- **Date Picker**: Flatpickr o native HTML5
- **Validación**: Validity API o custom validation

---

## 📝 Notas de Implementación

### Prioridades de Desarrollo
1. **Fase 1**: Panel de redacción y envío básico
2. **Fase 2**: Sistema de plantillas y vista previa
3. **Fase 3**: Programación y envío masivo
4. **Fase 4**: Analytics y reportes
5. **Fase 5**: Gestión de errores y reintentos

### Decisiones de Diseño
- Mantener consistencia con otros módulos admin
- Priorizar funcionalidad sobre estética
- Optimizar para grandes volúmenes de envío
- Implementar sistema de colas si es necesario

### Próximos Pasos
1. Crear archivo HTML base con estructura
2. Implementar CSS con estilos admin
3. Desarrollar funcionalidad JavaScript
4. Integrar con API del backend
5. Testing y validación
6. Configurar integraciones externas

---

**✨ Estado**: Documentación completa - Listo para implementación  
**🎯 Siguiente**: Crear archivo HTML base
# Comunidad - Moderación y Gestión (Admin)

## Propósito del módulo
- Panel de moderación y gestión de la red social/comunidad
- Monitoreo de actividad y contenido generado por usuarios
- Gestión de reportes y violaciones de normas
- Herramientas de moderación proactiva y reactiva
- Análisis de engagement y salud de la comunidad

## Rutas y query params
- Ruta exacta: `/admin/community`
- Query params:
  - `tab = overview | posts | users | reports | moderation | settings`
  - `filter = all | reported | flagged | blocked | trending`
  - `timeRange = hour | day | week | month | all`
  - `sortBy = recent | popular | reported | controversial`
  - `search` (búsqueda de usuarios o contenido)
  - `userId` (filtrar por usuario específico)
  - `page`, `limit`

## Estructura de página

### Header
- Título: "🌐 Gestión de Comunidad"
- Subtítulo: "Moderación y análisis de la red social"
- Controles:
  - Búsqueda global (usuarios, posts, comentarios)
  - Filtros rápidos (tiempo, tipo de contenido)
  - Botón de refresh
  - Notificaciones de moderación pendiente

### Tabs principales

#### 1. Overview (Resumen de Comunidad)
Dashboard ejecutivo con métricas clave:

**KPIs principales:**
- Usuarios activos en comunidad (diario/semanal/mensual)
- Posts publicados (por período)
- Tasa de engagement (likes, comentarios, shares)
- Contenido reportado (pendiente de revisión)
- Usuarios bloqueados/suspendidos
- Salud general de la comunidad (score 0-100)

**Gráficos y visualizaciones:**
- Línea de tiempo: Actividad diaria
- Gráfico de barras: Posts por categoría/tema
- Word cloud: Términos más usados
- Mapa de calor: Actividad por hora del día
- Top 10 usuarios más activos
- Tendencias de hashtags

**Señales de alerta:**
- Picos inusuales de actividad
- Aumento de contenido reportado
- Usuarios nuevos con comportamiento sospechoso
- Temas controversiales emergentes

#### 2. Posts (Gestión de Publicaciones)
Panel de control de todo el contenido publicado:

**Filtros y búsqueda:**
- Por tipo: posts, comentarios, reacciones
- Por estado: activo, reportado, oculto, eliminado
- Por fecha: rango personalizable
- Por usuario: buscar por nombre/ID
- Por contenido: búsqueda en texto
- Por categoría/tema

**Tabla de posts:**
- Usuario (avatar + nombre + badge de verificación)
- Contenido (preview con límite de caracteres)
- Imagenes/adjuntos (miniatura)
- Métricas (likes, comments, shares, views)
- Estado (normal, reportado, flaggeado)
- Timestamp
- Acciones rápidas (ver, ocultar, eliminar, bloquear usuario)

**Acciones de moderación:**
- **Ver detalle**: Modal con post completo y contexto
- **Ocultar**: Quitar de la vista pública (soft delete)
- **Eliminar**: Remover permanentemente
- **Editar**: Modificar contenido (con log de cambios)
- **Marcar como spam**: Aplicar penalización
- **Bloquear usuario**: Suspender cuenta temporal o permanentemente

#### 3. Users (Gestión de Usuarios de Comunidad)
Análisis y gestión de usuarios activos en la comunidad:

**Perfiles de usuario:**
- Información básica (nombre, avatar, fecha de registro)
- Estadísticas de actividad (posts, comentarios, likes)
- Score de reputación (algoritmo propio)
- Historial de violaciones
- Estado de la cuenta (activa, advertida, suspendida)
- Última actividad

**Segmentación de usuarios:**
- **Influencers**: Usuarios con alta influencia/reach
- **Top contributors**: Más activos y valiosos
- **Nuevos usuarios**: Registrados recientemente
- **Reportados**: Con múltiples reportes en contra
- **Bots sospechosos**: Comportamiento automatizado
- **Inactivos**: Sin actividad reciente

**Herramientas de gestión:**
- Enviar mensaje directo
- Aplicar advertencia
- Suspender temporalmente (1d, 3d, 7d, 30d)
- Ban permanente
- Remover verificación
- Resetear reputación

#### 4. Reports (Gestión de Reportes)
Sistema de gestión de reportes de usuarios:

**Tipos de reportes:**
- **Spam**: Contenido no deseado o repetitivo
- **Abuso**: Lenguaje ofensivo o acoso
- **Información falsa**: Datos incorrectos o engañosos
- **Contenido inapropiado**: NSFW o violencia
- **Fraude**: Estafas o intentos de engaño
- **Copyright**: Violación de derechos de autor
- **Otro**: Cualquier otro motivo

**Proceso de revisión:**
1. **Nuevo**: Reporte recibido, pendiente de revisión
2. **En revisión**: Moderador asignado investigando
3. **Acción tomada**: Se aplicó sanción o se desestimó
4. **Escalado**: Requiere revisión de supervisor
5. **Resuelto**: Caso cerrado con notas

**Interfaz de revisión:**
- Post/reportado mostrado con contexto
- Historial del reportante (es credible?)
- Historial del reportado (tiene antecedentes?)
- Número de reportes similares
- Pruebas adjuntadas (capturas, links)
- Chat interno entre moderadores

#### 5. Moderation (Herramientas de Moderación)
Herramientas avanzadas para moderadores:

**Moderación proactiva:**
- **Filtros de contenido**: Palabras prohibidas automáticas
- **Detección de spam**: Patrones de comportamiento
- **Análisis de sentimiento**: Negatividad extrema
- **Detección de bots**: Comportamiento no humano
- **Prevención de raids**: Múltiples cuentas nuevas atacando

**Moderación automatizada:**
- Auto-eliminar posts con cierto score de reportes
- Auto-advertir usuarios con múltiples violaciones
- Sombra-ban (usuario no se da cuenta que está baneado)
- Rate limiting para posts/comentarios

**Herramientas de equipo:**
- Chat interno entre moderadores
- Sistema de asignación de casos
- Notas internas en perfiles de usuario
- Historial de acciones del equipo
- Estadísticas de cada moderador

#### 6. Settings (Configuración de Comunidad)
Gestión de políticas y configuraciones:

**Políticas de comunidad:**
- Reglas de publicación (editor WYSIWYG)
- Guías de contenido permitido/prohibido
- Proceso de apelación de baneos
- Términos de servicio actualizables

**Configuración técnica:**
- Umbrales de auto-moderación
- Límites de publicación (posts por hora/día)
- Palabras clave para filtrado
- Configuración de notificaciones

**Gestión de equipo:**
- Roles de moderador (niveles de permiso)
- Asignación de responsabilidades
- Horarios de guardia
- Capacitación y documentación

## Algoritmos y Sistemas Automáticos

### Sistema de Reputación
```typescript
interface ReputationScore {
  baseScore: number; // 0-100
  factors: {
    accountAge: number;
    verificationStatus: number;
    contentQuality: number;
    communityEngagement: number;
    violationHistory: number;
    reportRate: number;
  };
  lastUpdated: Date;
}
```

## 📋 Tipos de TypeScript

### Interfaces Principales

```typescript
// Módulo principal de comunidad
interface AdminCommunityModule {
  id: 'admin-community'
  name: 'Gestión de Comunidad'
  description: 'Moderación y análisis de la red social'
  version: string
  enabled: boolean
  features: CommunityFeatures
}

interface CommunityFeatures {
  contentModeration: boolean
  userManagement: boolean
  reportingSystem: boolean
  automatedDetection: boolean
  analytics: boolean
  teamCollaboration: boolean
}

// Header del módulo
interface AdminCommunityHeader {
  title: string
  description: string
  quickStats: CommunityQuickStats
  actions: HeaderAction[]
}

interface CommunityQuickStats {
  activeUsersToday: number
  postsPublishedToday: number
  reportsPending: number
  usersSuspended: number
  communityHealthScore: number
  flaggedContent: number
}

interface HeaderAction {
  id: string
  label: string
  icon: string
  action: () => void
  variant: 'primary' | 'secondary'
}

// Layout principal
interface AdminCommunityLayout {
  tabs: CommunityTab[]
  activeTab: string
  content: CommunityTabContent
  sidebar?: SidebarConfig
}

interface CommunityTab {
  id: 'overview' | 'posts' | 'users' | 'reports' | 'moderation' | 'settings'
  label: string
  icon: string
  component: string
  badge?: number
}

interface CommunityTabContent {
  overview: OverviewTab
  posts: PostsTab
  users: UsersTab
  reports: ReportsTab
  moderation: ModerationTab
  settings: SettingsTab
}

// KPIs de la comunidad
interface CommunityKPIs {
  activity: ActivityKPIs
  content: ContentKPIs
  moderation: ModerationKPIs
  users: UserKPIs
  health: HealthKPIs
}

interface ActivityKPIs {
  dailyActiveUsers: number
  weeklyActiveUsers: number
  monthlyActiveUsers: number
  postsPerDay: number
  commentsPerDay: number
  likesPerDay: number
  engagementRate: number
}

interface ContentKPIs {
  totalPosts: number
  postsToday: number
  postsThisWeek: number
  averagePostLength: number
  postsWithImages: number
  postsWithLinks: number
  trendingHashtags: TrendingHashtag[]
}

interface ModerationKPIs {
  reportsPending: number
  reportsResolved: number
  reportsToday: number
  averageResolutionTime: number
  contentRemoved: number
  usersSuspended: number
  autoModerated: number
}

interface UserKPIs {
  totalCommunityUsers: number
  newUsersToday: number
  newUsersThisWeek: number
  verifiedUsers: number
  influencers: number
  topContributors: number
  suspendedUsers: number
}

interface HealthKPIs {
  overallScore: number
  contentQualityScore: number
  userSatisfactionScore: number
  moderationEfficiencyScore: number
  safetyScore: number
  trend: 'improving' | 'stable' | 'declining'
}
```

### Filtros Avanzados

```typescript
interface CommunityFilters {
  timeRange?: TimeRange
  contentType?: ContentType[]
  userSegment?: UserSegment[]
  moderationStatus?: ModerationStatus[]
  search?: string
  userId?: string
  hashtag?: string
  language?: string
  country?: string
}

interface TimeRange {
  type: 'hour' | 'day' | 'week' | 'month' | 'all' | 'custom'
  from?: string
  to?: string
}

interface ContentType {
  type: 'post' | 'comment' | 'reaction' | 'share'
  subtype?: string
}

interface UserSegment {
  type: 'influencer' | 'top_contributor' | 'new_user' | 'reported' | 'suspicious_bot' | 'inactive'
}

interface ModerationStatus {
  status: 'normal' | 'reported' | 'flagged' | 'hidden' | 'removed' | 'pending_review'
}
```

### Componentes de Tabs

```typescript
interface OverviewTab {
  kpis: CommunityKPIs
  charts: OverviewCharts
  recentActivity: CommunityActivity[]
  trendingContent: TrendingItem[]
  alerts: CommunityAlert[]
  topUsers: TopCommunityUser[]
}

interface OverviewCharts {
  activityTimeline: TimeSeriesData
  postsByCategory: CategoryData
  wordCloud: WordCloudData
  activityHeatmap: HeatmapData
  engagementTrend: TrendData
}

interface PostsTab {
  posts: CommunityPost[]
  filters: CommunityFilters
  pagination: PaginationConfig
  selectedPost?: PostDetail
  bulkActions: BulkAction[]
}

interface CommunityPost {
  id: string
  user: PostUser
  content: PostContent
  metrics: PostMetrics
  status: PostStatus
  timestamps: PostTimestamps
  moderation: PostModeration
}

interface PostUser {
  id: string
  name: string
  avatar: string
  isVerified: boolean
  reputationScore: number
  joinDate: string
}

interface PostContent {
  text: string
  images: string[]
  links: string[]
  hashtags: string[]
  mentions: string[]
  language: string
  category?: string
}

interface PostMetrics {
  likes: number
  comments: number
  shares: number
  views: number
  engagementRate: number
}

interface PostStatus {
  visibility: 'public' | 'hidden' | 'removed'
  moderation: 'normal' | 'reported' | 'flagged' | 'auto_flagged'
  reportCount: number
}

interface UsersTab {
  users: CommunityUser[]
  filters: UserFilters
  selectedUser?: UserDetail
  actions: UserAction[]
  segments: UserSegment[]
}

interface CommunityUser {
  id: string
  profile: UserProfile
  activity: UserActivity
  reputation: ReputationScore
  moderation: UserModeration
  status: UserStatus
}

interface UserProfile {
  name: string
  avatar: string
  bio: string
  location?: string
  website?: string
  joinDate: string
  verificationStatus: 'none' | 'pending' | 'verified' | 'rejected'
}

interface UserActivity {
  postsCount: number
  commentsCount: number
  likesGiven: number
  likesReceived: number
  lastActivity: string
  averageDailyActivity: number
}

interface UserModeration {
  violations: Violation[]
  warnings: Warning[]
  suspensions: Suspension[]
  reportStats: ReportStats
}

interface ReportsTab {
  reports: CommunityReport[]
  filters: ReportFilters
  selectedReport?: ReportDetail
  assignees: Moderator[]
  actions: ReportAction[]
}

interface CommunityReport {
  id: string
  reporter: ReportUser
  reported: ReportUser
  content: ReportContent
  reason: ReportReason
  status: ReportStatus
  timestamps: ReportTimestamps
  evidence: ReportEvidence
}

interface ReportReason {
  type: 'spam' | 'abuse' | 'false_info' | 'inappropriate' | 'fraud' | 'copyright' | 'other'
  description: string
  category: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface ReportStatus {
  current: 'new' | 'under_review' | 'action_taken' | 'escalated' | 'resolved' | 'dismissed'
  assignedTo?: string
  reviewedBy?: string
  resolution?: 'confirmed' | 'dismissed' | 'escalated'
}

interface ModerationTab {
  tools: ModerationTool[]
  automation: AutomationConfig
  team: ModerationTeam
  queue: ModerationQueue
  settings: ModerationSettings
}

interface ModerationTool {
  id: string
  name: string
  type: 'content_filter' | 'spam_detection' | 'sentiment_analysis' | 'bot_detection' | 'raid_prevention'
  enabled: boolean
  config: ToolConfig
  stats: ToolStats
}

interface SettingsTab {
  policies: CommunityPolicies
  technical: TechnicalSettings
  team: TeamSettings
  legal: LegalSettings
}

interface CommunityPolicies {
  postingRules: PolicyDocument
  contentGuidelines: PolicyDocument
  appealProcess: PolicyDocument
  termsOfService: PolicyDocument
  privacyPolicy: PolicyDocument
}

interface TechnicalSettings {
  autoModeration: AutoModerationConfig
  rateLimits: RateLimitConfig
  contentFilters: ContentFilterConfig
  notificationSettings: NotificationConfig
}
```

### Modales Críticos

```typescript
interface PostDetailModal {
  post: CommunityPost
  context: PostContext
  moderation: PostModerationActions
  history: ModerationHistory[]
}

interface PostModerationActions {
  hide: ModerationAction
  remove: ModerationAction
  edit: EditAction
  markAsSpam: SpamAction
  blockUser: UserBlockAction
}

interface UserModerationModal {
  user: CommunityUser
  actions: UserModerationActions
  history: UserHistory
  communication: UserCommunication
}

interface UserModerationActions {
  sendMessage: MessageAction
  applyWarning: WarningAction
  suspend: SuspensionAction
  ban: BanAction
  removeVerification: VerificationAction
  resetReputation: ReputationAction
}

interface ReportReviewModal {
  report: CommunityReport
  evidence: ReportEvidenceDisplay
  context: ReportContext
  decision: ReportDecision
  actions: ReportActions
}

interface ReportDecision {
  type: 'confirm' | 'dismiss' | 'escalate'
  reason: string
  notes: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface PolicyEditorModal {
  policy: PolicyDocument
  editor: PolicyEditor
  history: PolicyHistory[]
  preview: PolicyPreview
}

interface PolicyEditor {
  content: string
  format: 'markdown' | 'html' | 'wysiwyg'
  validation: PolicyValidation
  autosave: AutosaveConfig
}
```

### Tipos Auxiliares y Enums

```typescript
// Tipos principales
type ContentVisibility = 'public' | 'hidden' | 'removed'
type ModerationStatus = 'normal' | 'reported' | 'flagged' | 'auto_flagged'
type ReportType = 'spam' | 'abuse' | 'false_info' | 'inappropriate' | 'fraud' | 'copyright' | 'other'
type ReportStatusType = 'new' | 'under_review' | 'action_taken' | 'escalated' | 'resolved' | 'dismissed'
type UserVerificationStatus = 'none' | 'pending' | 'verified' | 'rejected'
type ModerationLevel = 'auto' | 'level1' | 'level2' | 'level3' | 'legal'

// Entidades auxiliares
interface TrendingHashtag {
  tag: string
  count: number
  trend: 'up' | 'down' | 'stable'
  sentiment: 'positive' | 'negative' | 'neutral'
}

interface CommunityActivity {
  type: 'post' | 'comment' | 'like' | 'share' | 'report' | 'moderation'
  user: PostUser
  content: string
  timestamp: string
  metadata?: Record<string, any>
}

interface TrendingItem {
  type: 'post' | 'hashtag' | 'user' | 'topic'
  item: any
  score: number
  trend: 'rising' | 'falling' | 'stable'
}

interface CommunityAlert {
  id: string
  type: 'activity_spike' | 'report_surge' | 'suspicious_users' | 'controversial_topics'
  severity: 'info' | 'warning' | 'critical'
  title: string
  description: string
  data: AlertData
  createdAt: string
  acknowledged: boolean
}

interface TopCommunityUser {
  user: CommunityUser
  rank: number
  score: number
  category: 'influencer' | 'contributor' | 'newcomer'
}

// Datos para gráficos
interface TimeSeriesData {
  labels: string[]
  datasets: Dataset[]
}

interface Dataset {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
  fill?: boolean
}

interface CategoryData {
  categories: string[]
  data: number[]
  colors: string[]
}

interface WordCloudData {
  words: Array<{
    text: string
    size: number
    color: string
  }>
}

interface HeatmapData {
  days: string[]
  hours: number[]
  data: number[][]
}

interface TrendData {
  direction: 'up' | 'down' | 'stable'
  percentage: number
  period: string
}

// Configuraciones
interface PaginationConfig {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface BulkAction {
  id: string
  label: string
  action: (selectedIds: string[]) => void
  requiresConfirmation: boolean
  confirmationMessage?: string
}

interface UserFilters {
  segment?: UserSegment[]
  activityLevel?: ('high' | 'medium' | 'low' | 'inactive')[]
  reputationRange?: NumberRange
  joinDateRange?: DateRange
  verificationStatus?: UserVerificationStatus[]
  moderationStatus?: ('clean' | 'warned' | 'suspended' | 'banned')[]
}

interface NumberRange {
  min?: number
  max?: number
}

interface DateRange {
  from?: string
  to?: string
}

interface UserAction {
  id: string
  label: string
  icon: string
  action: (user: CommunityUser) => void
  variant: 'primary' | 'secondary' | 'danger'
  requiresConfirmation?: boolean
}

interface PostTimestamps {
  created: string
  updated?: string
  moderated?: string
  reported?: string
}

interface PostModeration {
  actions: ModerationAction[]
  notes: string
  moderator?: string
  reason?: string
}

interface ModerationAction {
  type: 'hide' | 'remove' | 'edit' | 'mark_spam' | 'restore'
  timestamp: string
  moderator: string
  reason: string
  notes?: string
}

interface Violation {
  id: string
  type: string
  severity: 'minor' | 'major' | 'severe'
  date: string
  moderator: string
  action: string
  expires?: string
}

interface Warning {
  id: string
  reason: string
  date: string
  moderator: string
  severity: 'low' | 'medium' | 'high'
  expires?: string
}

interface Suspension {
  id: string
  reason: string
  startDate: string
  endDate: string
  moderator: string
  type: 'temporary' | 'permanent'
}

interface ReportStats {
  totalReports: number
  validReports: number
  falseReports: number
  reportRate: number
}

interface UserStatus {
  account: 'active' | 'suspended' | 'banned' | 'deleted'
  posting: 'allowed' | 'limited' | 'blocked'
  visibility: 'public' | 'restricted' | 'private'
}

interface PostContext {
  thread?: ThreadInfo
  replies: CommunityPost[]
  userHistory: UserPostHistory
  similarContent: SimilarContent[]
}

interface ThreadInfo {
  id: string
  title: string
  posts: number
  lastActivity: string
}

interface UserPostHistory {
  totalPosts: number
  recentPosts: CommunityPost[]
  violationRate: number
  averageEngagement: number
}

interface SimilarContent {
  posts: CommunityPost[]
  similarity: number
  detectedAt: string
}

interface ModerationHistory {
  action: string
  moderator: string
  timestamp: string
  reason: string
  notes?: string
}

interface UserHistory {
  violations: Violation[]
  warnings: Warning[]
  suspensions: Suspension[]
  moderatorNotes: ModeratorNote[]
}

interface ModeratorNote {
  id: string
  moderator: string
  note: string
  timestamp: string
  type: 'internal' | 'user_visible'
}

interface UserCommunication {
  messages: DirectMessage[]
  warnings: UserWarning[]
  appeals: UserAppeal[]
}

interface DirectMessage {
  id: string
  from: string
  to: string
  subject: string
  content: string
  timestamp: string
  read: boolean
}

interface UserWarning {
  id: string
  reason: string
  severity: 'low' | 'medium' | 'high'
  issuedAt: string
  expiresAt?: string
  acknowledged: boolean
}

interface UserAppeal {
  id: string
  type: 'suspension' | 'content_removal' | 'warning'
  reason: string
  status: 'pending' | 'reviewing' | 'approved' | 'denied'
  submittedAt: string
  reviewedAt?: string
  decision?: string
}

interface ReportEvidenceDisplay {
  screenshots: string[]
  links: string[]
  userHistory: UserReportHistory
  contentSnapshots: ContentSnapshot[]
}

interface UserReportHistory {
  reportsFiled: number
  validReports: number
  falseReports: number
  reportAccuracy: number
}

interface ContentSnapshot {
  timestamp: string
  content: string
  reason: string
  capturedBy: string
}

interface ReportContext {
  similarReports: CommunityReport[]
  userPattern: UserPatternAnalysis
  contentAnalysis: ContentAnalysis
  communityImpact: CommunityImpact
}

interface UserPatternAnalysis {
  behavior: 'normal' | 'suspicious' | 'malicious'
  frequency: 'isolated' | 'repeated' | 'pattern'
  severity: 'low' | 'medium' | 'high'
}

interface ContentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  toxicity: number
  spamScore: number
  authenticity: number
}

interface CommunityImpact {
  reach: number
  engagement: number
  controversy: number
  influence: number
}

interface ReportActions {
  confirm: () => void
  dismiss: () => void
  escalate: () => void
  requestMoreInfo: () => void
  assignTo: (moderatorId: string) => void
}

interface PolicyDocument {
  id: string
  title: string
  content: string
  version: string
  effectiveDate: string
  createdBy: string
  lastModified: string
  status: 'draft' | 'active' | 'archived'
}

interface PolicyEditor {
  content: string
  format: 'markdown' | 'html' | 'wysiwyg'
  validation: PolicyValidation
  autosave: AutosaveConfig
}

interface PolicyValidation {
  requiredFields: string[]
  minLength: number
  maxLength: number
  prohibitedTerms: string[]
}

interface AutosaveConfig {
  enabled: boolean
  interval: number
  maxVersions: number
}

interface PolicyHistory {
  version: string
  changes: string
  modifiedBy: string
  modifiedAt: string
  reason: string
}

interface PolicyPreview {
  rendered: string
  formatting: boolean
  mobileOptimized: boolean
  accessibility: AccessibilityCheck
}

interface AccessibilityCheck {
  passed: boolean
  issues: AccessibilityIssue[]
}

interface AccessibilityIssue {
  type: string
  severity: 'low' | 'medium' | 'high'
  description: string
  suggestion: string
}

// Interfaces de configuración
interface AutomationConfig {
  contentFilters: ContentFilter[]
  spamDetection: SpamDetectionConfig
  autoModeration: AutoModerationConfig
  rateLimiting: RateLimitConfig
}

interface ContentFilter {
  id: string
  name: string
  type: 'word' | 'phrase' | 'regex' | 'category'
  pattern: string
  action: 'flag' | 'hide' | 'remove' | 'review'
  severity: 'low' | 'medium' | 'high'
  enabled: boolean
}

interface SpamDetectionConfig {
  duplicateThreshold: number
  frequencyThreshold: number
  linkThreshold: number
  mentionThreshold: number
  action: 'flag' | 'hide' | 'review'
}

interface AutoModerationConfig {
  reportThreshold: number
  hideThreshold: number
  removeThreshold: number
  reviewThreshold: number
  escalationThreshold: number
}

interface RateLimitConfig {
  postsPerHour: number
  postsPerDay: number
  commentsPerHour: number
  likesPerHour: number
  sharesPerHour: number
}

interface ModerationTeam {
  moderators: Moderator[]
  supervisors: Supervisor[]
  schedules: Schedule[]
  assignments: Assignment[]
}

interface Moderator {
  id: string
  name: string
  level: 'junior' | 'senior' | 'supervisor'
  permissions: string[]
  stats: ModeratorStats
  status: 'active' | 'inactive' | 'suspended'
}

interface Supervisor extends Moderator {
  team: string[]
  escalationAuthority: boolean
  legalReviewAuthority: boolean
}

interface ModeratorStats {
  casesResolved: number
  averageResolutionTime: number
  accuracyRate: number
  userSatisfaction: number
  escalatedCases: number
}

interface ModerationQueue {
  pending: CommunityReport[]
  underReview: CommunityReport[]
  escalated: CommunityReport[]
  assigned: AssignedCase[]
}

interface AssignedCase {
  reportId: string
  moderatorId: string
  assignedAt: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: string
}

interface ModerationSettings {
  thresholds: ModerationThresholds
  notifications: ModerationNotifications
  escalation: EscalationRules
  audit: AuditSettings
}

interface ModerationThresholds {
  reportAutoHide: number
  reportAutoRemove: number
  userAutoWarn: number
  userAutoSuspend: number
  contentAutoFlag: number
}

interface TechnicalSettings {
  apiRateLimits: ApiRateLimits
  contentProcessing: ContentProcessing
  notificationDelivery: NotificationDelivery
  dataRetention: DataRetention
}

interface ApiRateLimits {
  requestsPerMinute: number
  requestsPerHour: number
  burstCapacity: number
  cooldownPeriod: number
}

interface ContentProcessing {
  maxImageSize: number
  maxVideoSize: number
  allowedFormats: string[]
  processingTimeout: number
}

interface NotificationDelivery {
  emailEnabled: boolean
  pushEnabled: boolean
  smsEnabled: boolean
  batchSize: number
  retryAttempts: number
}

interface DataRetention {
  posts: number
  messages: number
  reports: number
  auditLogs: number
  unit: 'days' | 'months' | 'years'
}

interface TeamSettings {
  roles: TeamRole[]
  permissions: PermissionMatrix
  schedules: TeamSchedule
  training: TrainingProgram
}

interface LegalSettings {
  privacyPolicy: PrivacyPolicy
  termsOfService: TermsOfService
  contentLiability: ContentLiability
  userRights: UserRights
  compliance: ComplianceRequirements
}

interface AlertData {
  metric: string
  value: number
  threshold: number
  affectedItems: string[]
  recommendations: string[]
}

interface ToolConfig {
  parameters: Record<string, any>
  thresholds: Record<string, number>
  integrations: string[]
  customRules: CustomRule[]
}

interface ToolStats {
  executions: number
  successes: number
  failures: number
  averageExecutionTime: number
  lastExecution: string
}

interface CustomRule {
  id: string
  name: string
  condition: string
  action: string
  enabled: boolean
}

interface Schedule {
  id: string
  name: string
  moderatorId: string
  startTime: string
  endTime: string
  days: string[]
  timezone: string
}

interface Assignment {
  caseId: string
  moderatorId: string
  assignedAt: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: string
  status: 'assigned' | 'in_progress' | 'completed' | 'escalated'
}

interface ModerationNotifications {
  email: boolean
  push: boolean
  sms: boolean
  desktop: boolean
  frequency: 'immediate' | 'digest' | 'daily' | 'weekly'
}

interface EscalationRules {
  timeBased: TimeBasedEscalation
  severityBased: SeverityBasedEscalation
  volumeBased: VolumeBasedEscalation
  manual: ManualEscalation
}

interface AuditSettings {
  logAllActions: boolean
  logUserActions: boolean
  logModeratorActions: boolean
  retentionPeriod: number
  exportFormat: 'json' | 'csv' | 'pdf'
}

interface PrivacyPolicy {
  dataCollection: string
  dataUsage: string
  dataSharing: string
  userRights: string
  contactInfo: string
}

interface TermsOfService {
  userObligations: string
  contentOwnership: string
  serviceLimitations: string
  termination: string
  liability: string
}

interface ContentLiability {
  userGenerated: string
  moderation: string
  removal: string
  legalRequests: string
}

interface UserRights {
  access: string
  correction: string
  deletion: string
  portability: string
  objection: string
}

interface ComplianceRequirements {
  gdpr: boolean
  ccpa: boolean
  copa: boolean
  dmca: boolean
  localRegulations: string[]
}

### Detección de Spam
- Análisis de frecuencia de posts
- Detección de contenido duplicado
- Patrones de comportamiento automatizado
- Uso de URLs sospechosas
- Múltiples menciones/mensajes idénticos

### Filtros de Contenido
- Lista de palabras prohibidas (actualizable)
- Detección de lenguaje ofensivo
- Prevención de doxxing
- Detección de contenido NSFW
- Protección contra scams

## Métricas y KPIs de Comunidad

### Salud General
- Tasa de crecimiento de usuarios activos
- Engagement rate promedio
- Tiempo promedio en plataforma
- Número de interacciones por usuario

### Calidad del Contenido
- Porcentaje de contenido reportado
- Tiempo promedio de resolución de reportes
- Tasa de resolución (favor del reportero)
- Número de posts eliminados por día

### Satisfacción de Usuarios
- Encuestas de satisfacción periódicas
- Tasa de churn de usuarios activos
- Número de apelaciones exitosas
- Feedback cualitativo en soporte

### Eficiencia de Moderación
- Tiempo promedio de respuesta a reportes
- Casos resueltos por moderador
- Tasa de errores de moderación
- Satisfacción del equipo de moderación

## Integraciones

### Con otros módulos admin
- **admin-users.html**: Ver perfil completo de usuario
- **admin-support.html**: Crear tickets de soporte
- **admin-alerts.html**: Alertas de actividad inusual
- **admin-analytics.html**: Análisis detallado de métricas

### APIs externas
- Google Vision API para análisis de imágenes
- Perspective API para análisis de toxicidad
- Sistemas de ML personalizados
- Herramientas de análisis de sentimiento

## Flujos de Trabajo

### Proceso de Moderación
1. **Detección**: Automática o por reporte
2. **Revisión**: Moderador evalúa el caso
3. **Acción**: Se toma decisión y se documenta
4. **Notificación**: Se informa al usuario afectado
5. **Apelación**: Proceso para apelar la decisión
6. **Revisión**: Segunda opinión si es necesario

### Escalamiento
- **Nivel 1**: Moderadores regulares
- **Nivel 2**: Moderadores senior
- **Nivel 3**: Administradores
- **Nivel 4**: Equipo legal (casos complejos)

## Consideraciones Legales y Éticas

### Privacidad
- Respeto a la privacidad de usuarios
- Transparencia en algoritmos de moderación
- Derecho a ser olvidado
- Portabilidad de datos

### Transparencia
- Publicación de políticas de moderación
- Proceso claro de apelación
- Razones específicas para acciones
- Auditoría regular de decisiones

### Derechos de Usuario
- presunción de inocencia
- Derecho a responder
- Proceso justo de revisión
- Protección contra abuso de poder

## Enums y Tipos Auxiliares

```typescript
enum ContentType {
  POST = 'post',
  COMMENT = 'comment',
  REPLY = 'reply',
  MEDIA = 'media',
  LINK = 'link'
}

enum ModerationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FLAGGED = 'flagged',
  UNDER_REVIEW = 'under_review',
  ESCALATED = 'escalated'
}

enum ReportReason {
  SPAM = 'spam',
  HARASSMENT = 'harassment',
  HATE_SPEECH = 'hate_speech',
  MISINFORMATION = 'misinformation',
  COPYRIGHT = 'copyright',
  PRIVACY = 'privacy',
  VIOLENCE = 'violence',
  SEXUAL_CONTENT = 'sexual_content',
  SELF_HARM = 'self_harm',
  ILLEGAL_ACTIVITY = 'illegal_activity',
  IMPERSONATION = 'impersonation',
  OTHER = 'other'
}

enum ReportStatus {
  OPEN = 'open',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
  ESCALATED = 'escalated',
  REOPENED = 'reopened'
}

enum UserLevel {
  NEWBIE = 'newbie',
  REGULAR = 'regular',
  TRUSTED = 'trusted',
  VIP = 'vip',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  PENDING_VERIFICATION = 'pending_verification',
  DELETED = 'deleted'
}

enum ModerationAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  FLAG = 'flag',
  HIDE = 'hide',
  DELETE = 'delete',
  WARN = 'warn',
  SUSPEND = 'suspend',
  BAN = 'ban',
  SHADOW_BAN = 'shadow_ban',
  RESTORE = 'restore'
}

enum AutoActionType {
  FLAG_CONTENT = 'flag_content',
  HIDE_CONTENT = 'hide_content',
  NOTIFY_MODERATOR = 'notify_moderator',
  BLOCK_USER = 'block_user',
  QUARANTINE_CONTENT = 'quarantine_content',
  REQUIRE_APPROVAL = 'require_approval'
}

enum ComponentType {
  DASHBOARD = 'dashboard',
  POSTS = 'posts',
  USERS = 'users',
  REPORTS = 'reports',
  MODERATION = 'moderation',
  SETTINGS = 'settings',
  ANALYTICS = 'analytics',
  AUTOMATION = 'automation'
}

enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
  CRITICAL = 'critical',
  UNKNOWN = 'unknown'
}

enum SystemLoad {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  CRITICAL = 'critical'
}

enum NotificationType {
  REPORT_ASSIGNED = 'report_assigned',
  ESCALATION_REQUIRED = 'escalation_required',
  SYSTEM_ALERT = 'system_alert',
  USER_APPEAL = 'user_appeal',
  POLICY_VIOLATION = 'policy_violation',
  CONTENT_FLAGGED = 'content_flagged'
}

enum TimeRange {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  CUSTOM = 'custom'
}

enum ContentSortBy {
  DATE = 'date',
  LIKES = 'likes',
  COMMENTS = 'comments',
  SHARES = 'shares',
  VIEWS = 'views',
  REPORTS = 'reports'
}

enum UserSortBy {
  JOIN_DATE = 'join_date',
  ACTIVITY = 'activity',
  REPUTATION = 'reputation',
  POSTS = 'posts',
  FOLLOWERS = 'followers'
}

enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  IN = 'in',
  NOT_IN = 'not_in'
}

enum EscalationLevel {
  LEVEL_1 = 1,
  LEVEL_2 = 2,
  LEVEL_3 = 3,
  LEVEL_4 = 4,
  LEGAL = 5
}

enum EvidenceType {
  SCREENSHOT = 'screenshot',
  URL = 'url',
  TIMESTAMP = 'timestamp',
  USER_DATA = 'user_data',
  SYSTEM_LOG = 'system_log',
  THIRD_PARTY_DATA = 'third_party_data'
}

enum PolicyType {
  COMMUNITY_GUIDELINES = 'community_guidelines',
  PRIVACY_POLICY = 'privacy_policy',
  TERMS_OF_SERVICE = 'terms_of_service',
  CONTENT_POLICY = 'content_policy',
  MODERATION_POLICY = 'moderation_policy',
  DATA_RETENTION = 'data_retention'
}

enum ComplianceFramework {
  GDPR = 'gdpr',
  CCPA = 'ccpa',
  COPPA = 'coppa',
  DMCA = 'dmca',
  PIPEDA = 'pipeda',
  LGPD = 'lgpd'
}

enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
  PDF = 'pdf',
  XML = 'xml',
  EXCEL = 'excel'
}

enum IntegrationType {
  API = 'api',
  WEBHOOK = 'webhook',
  DATABASE = 'database',
  FILE_IMPORT = 'file_import',
  THIRD_PARTY_SERVICE = 'third_party_service'
}

enum ModerationQueue {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  ESCALATED = 'escalated',
  APPEALS = 'appeals',
  PRIORITY = 'priority'
}

enum ReputationAction {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral'
}

enum SpamDetectionLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  AGGRESSIVE = 'aggressive'
}

enum ContentSafetyLevel {
  SAFE = 'safe',
  WARNING = 'warning',
  UNSAFE = 'unsafe',
  DANGEROUS = 'dangerous'
}

// Tipos de utilidad
type ModerationScore = {
  spam: number
  toxicity: number
  safety: number
  quality: number
  overall: number
}

type TimeBasedRule = {
  timeWindow: number // en minutos
  maxActions: number
  action: AutoActionType
  cooldown: number // en minutos
}

type SeverityBasedRule = {
  severityThreshold: number
  autoActions: AutoActionType[]
  escalationLevel: EscalationLevel
}

type VolumeBasedRule = {
  volumeThreshold: number
  timeWindow: number // en minutos
  action: AutoActionType
  notificationTargets: string[]
}

type GeographicRule = {
  countries: string[]
  regions: string[]
  restrictions: string[]
  customActions: Record<string, any>
}

type AgeBasedRule = {
  minAge: number
  maxAge: number
  contentRestrictions: string[]
  featureRestrictions: string[]
}

type DeviceRule = {
  deviceTypes: string[]
  osTypes: string[]
  restrictions: string[]
  customSettings: Record<string, any>
}

type ModerationMetrics = {
  totalPosts: number
  moderatedPosts: number
  approvedPosts: number
  rejectedPosts: number
  flaggedPosts: number
  deletedPosts: number
  averageModerationTime: number
  moderatorProductivity: Record<string, number>
  accuracyRate: number
  userAppeals: number
  successfulAppeals: number
}

type CommunityHealthMetrics = {
  activeUsers: number
  engagementRate: number
  contentQuality: number
  userSatisfaction: number
  moderationEfficiency: number
  safetyScore: number
  growthRate: number
  retentionRate: number
}

type ContentQualityMetrics = {
  averagePostLength: number
  mediaUsage: number
  linkUsage: number
  hashtagUsage: number
  languageQuality: number
  originalityScore: number
  engagementScore: number
}

type UserEngagementMetrics = {
  dailyActiveUsers: number
  weeklyActiveUsers: number
  monthlyActiveUsers: number
  averageSessionDuration: number
  postsPerUser: number
  commentsPerUser: number
  likesPerUser: number
  sharesPerUser: number
}

type ModerationEfficiencyMetrics = {
  averageResponseTime: number
  resolutionRate: number
  escalationRate: number
  moderatorUtilization: number
  automationRate: number
  accuracyRate: number
  userFeedbackScore: number
}
```
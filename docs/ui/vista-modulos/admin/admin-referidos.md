# 🎪 Referidos - Panel de Administración

## 🎯 Propósito del Módulo
Panel administrativo completo para gestionar el sistema de referidos multinivel, incluyendo tracking de referencias, cálculo de comisiones, administración del plan de compensación binario, análisis de red, y monitoreo de fraude o abuso del sistema.

## 🚀 Rutas y Navegación

### Rutas Principales
```
GET  /admin/referidos                     # Dashboard principal de referidos
GET  /admin/referidos/users/:id           # Árbol de referidos de usuario
GET  /admin/referidos/commissions         # Gestión de comisiones
GET  /admin/referidos/binary-tree         # Visualización del árbol binario
GET  /admin/referidos/analytics          # Analytics de la red de referidos
GET  /admin/referidos/fraud-detection    # Detección de fraude
POST /admin/referidos/calculate-commissions # Cálculo de comisiones
```

### Query Parameters
```
?level=all|1|2|3|4|5+                      # Nivel de referido
?status=all|active|inactive|suspended       # Estado del referido
?commission_type=direct|binary|matching|residual # Tipo de comisión
?timeframe=today|week|month|quarter|year    # Período temporal
?tree_view=binary|unilevel|matrix          # Tipo de estructura
```

## 📋 Estructura del Panel

### 📊 Pestaña: "Dashboard de Referidos"
- **Total usuarios referidos**: Número y crecimiento mensual
- **Comisiones pagadas**: Total y por tipo (directas, binarias, matching)
- **Top referidores**: Usuarios con más referidos activos
- **Tasa de conversión**: Visitas → Registros → Usuarios activos
- **Valor promedio por referido**: LTV del usuario referido
- **Red de distribución**: Usuarios por nivel y país

### 🌳 Pestaña: "Árbol de Referidos"
- **Visualización gráfica**: Árbol jerárquico interactivo
- **Búsqueda de usuarios**: Encontrar en el árbol global
- **Estadísticas por nivel**: Usuarios, comisiones, actividad
- **Relaciones padre-hijo**: Tracking completo de referencias
- **Exportar estructura**: PDF, CSV, imágenes del árbol
- **Gestión de rupturas**: Manejo de usuarios suspendidos

### 💰 Pestaña: "Comisiones y Pagos"
- **Comisiones pendientes**: Por aprobar y pagar
- **Historial de pagos**: Registro completo de comisiones
- **Tipos de comisión**: Directas, binarias, matching, residuales
- **Cálculos automáticos**: Procesamiento según plan de compensación
- **Facturas y recibos**: Documentación para referidores
- **Métodos de pago**: Transferencia, crypto, PayPal, etc.

### 🔍 Pestaña: "Analytics y Reportes"
- **Crecimiento de la red**: Métricas de expansión
- **Análisis geográfico**: Distribución por país/región
- **Performance por campaña**: Eficacia de diferentes métodos
- **Análisis de retención**: Qué referidos se mantienen activos
- **Predicciones**: Proyecciones de crecimiento futuro
- **Comparativas**: Benchmark con períodos anteriores

### 🛡️ Pestaña: "Fraude y Seguridad"
- **Detección de patrones sospechosos**: Creación de cuentas múltiples
- **Análisis de IP addresses**: Detección de usuarios falsos
- **Verificación de identidad**: KYC para referidores mayores
- **Reglas de prevención**: Límites y restricciones automáticas
- **Investigación manual**: Casos que requieren revisión
- **Sanciones y bloqueos**: Gestión de usuarios fraudulentos

## 🏗️ Plan de Compensación

### 📈 Estructura Binaria
```
NIVEL 1: Directos (personales)
- 20% de comisión sobre el producto/suscripción
- Bono de bienvenida: $50 por cada directo activo

NIVEL 2-5: Red binaria
- 10% nivel 2, 5% nivel 3, 3% nivel 4, 2% nivel 5
- Binary bonus: 10% del volumen del pier débil mensual
- Matching bonus: 20-50% de comisiones de downline directo

BONOS ADICIONALES:
- Leadership bonus: $1000+ mensual para top performers
- Rank advancement: Bonos únicos por ascensos de rango
- Car program: Lease de vehículo para líderes
- Travel incentives: Viajes pagados para top referidores
```

### 💎 Rangos y Recompensas
```
BRONZE (0-9 activos): 20% directo, 5% binario
SILVER (10-24 activos): 25% directo, 8% binario, 20% matching
GOLD (25-49 activos): 30% directo, 10% binario, 30% matching
PLATINUM (50-99 activos): 35% directo, 12% binario, 40% matching
DIAMOND (100+ activos): 40% directo, 15% binario, 50% matching
```

### 📊 Tipos de Comisiones

#### 💵 Comisiones Directas (Fast Start)
- **Porcentaje**: 20-40% según rango
- **Base**: Precio de producto/suscripción
- **Frecuencia**: Inmediata o mensual
- **Requisitos**: Referido activo (mínimo 1 mes)
- **Tope**: Sin límite en número de directos

#### 🔄 Comisiones Binarias (Team Builder)
- **Estructura**: Dos piernas (izquierda y derecha)
- **Cálculo**: 10-15% del volumen de la pierna débil
- **Flush**: Puntos no usados se eliminan mensualmente
- **Carry over**: Puntos excedentes se acumulan
- **Activación**: Mínimo personal de 2 referidos activos

#### 🎯 Matching Bonus (Leadership)
- **Nivel 1**: 20-50% de comisiones de directos
- **Nivel 2**: 10-25% de comisiones de nivel 2
- **Nivel 3**: 5-10% de comisiones de nivel 3
- **Requisitos**: Rango mínimo Silver+
- **Tope**: Basado en volumen personal mensual

#### 💰 Comisiones Residuales (Long-term)
- **Suscripciones mensuales**: 5-10% de pagos recurrentes
- **Renovaciones anuales**: 3-5% de renovaciones
- **Upsells**: 10-20% de ventas adicionales
- **Productos adicionales**: 15-25% de nuevos productos
- **Vitalicio**: Mientras el referido permanezca activo

## 🔍 Sistema de Tracking

### 📊 Tracking de Referencias
```javascript
// Métodos de tracking soportados
{
  "referral_code": "USER123",
  "referral_link": "https://app.com/?ref=USER123",
  "qr_code": "generado_automaticamente",
  "social_media": "link_trackable_para_redes",
  "email_tracking": "links_personalizados_en_emails",
  "landing_pages": "paginas_personalizadas_para_cada_usuario"
}
```

### 📈 Attribution Analytics
- **First click**: Quién refirió primero
- **Last click**: Quién refirió último (modelo principal)
- **Multi-touch**: Distribución equitativa entre referidores
- **Time decay**: Más peso a referencias recientes
- **Position based**: 40% primera, 40% última, 20% intermedias

### 🎯 Conversion Funnel
```
IMPRESIONES → CLICKS → VISITAS → REGISTROS → ACTIVACIÓN → COMPRA
     ↓          ↓        ↓         ↓          ↓         ↓
   100%       10%      8%        5%         3%        2%
```

## 🛡️ Prevención de Fraude

### 🚨 Patrones de Fraude Comunes
- **Creación múltiple de cuentas**: Mismo usuario creando varias cuentas
- **Self-referral**: Usuario creando cuentas con sus propios links
- **Referidos falsos**: Usuarios inventados o bots
- **VPN/proxy usage**: Ocultar ubicación real
- **Documentación falsa**: KYC con documentos falsificados
- **Actividad coordinada**: Grupos trabajando juntos para beneficiarse

### 🔍 Sistema de Detección
```python
# Algoritmos de detección
- Análisis de IP addresses y geolocalización
- Detección de dispositivos únicos (fingerprinting)
- Análisis de patrones de comportamiento
- Sistema de reputación basado en múltiples factores
- Machine learning para detectar anomalías
- Cross-referencing con bases de datos externas
```

### ⚖️ Medidas Disciplinarias
- **Advertencia**: Primera infracción menor
- **Suspensión temporal**: 7-30 días según gravedad
- **Suspensión permanente**: Para fraudes graves
- **Reversión de comisiones**: Recuperación de pagos indebidos
- **Acciones legales**: Para casos de fraude significativo
- **Blacklist**: Compartir información con otras plataformas

## 📊 Analytics Avanzados

### 📈 Métricas de Red
- **Network growth rate**: Velocidad de crecimiento
- **Network depth**: Niveles promedio de profundidad
- **Network width**: Ancho promedio por nivel
- **Virality coefficient**: Cuánto se replica el crecimiento
- **Network density**: Interconexión entre usuarios
- **Geographic distribution**: Distribución global

### 💰 Métricas Financieras
- **Customer acquisition cost (CAC)**: Costo por usuario referido
- **Lifetime value (LTV)**: Valor total del usuario
- **LTV/CAC ratio**: Eficiencia de adquisición
- **Commission payout ratio**: % de ingresos pagados en comisiones
- **Network ROI**: Retorno de inversión del programa
- **Cash flow analysis**: Flujo de caja del sistema

### 🎯 Performance por Campaña
- **Email campaigns**: Tasa de conversión de emails
- **Social media**: Eficacia por plataforma social
- **Landing pages**: Performance de diferentes páginas
- **Referral contests**: Eficacia de competencias
- **Influencer partnerships**: ROI de colaboraciones
- **Content marketing**: Impacto de contenido educativo

## 🔧 Herramientas de Gestión

### 🎛️ Panel de Control Avanzado
- **Gestión masiva**: Acciones bulk sobre usuarios
- **Automatización**: Reglas y triggers automáticos
- **Segmentación**: Agrupación de usuarios por características
- **Personalización**: Experiencias personalizadas por segmento
- **Testing A/B**: Experimentación con diferentes enfoques
- **Integraciones**: APIs para herramientas externas

### 📱 Herramientas Móviles
- **App para referidores**: Dashboard móvil completo
- **Generador de contenido**: Herramientas para crear material
- **Tracking offline**: Códigos QR para eventos presenciales
- **Social sharing**: Integración con redes sociales
- **Push notifications**: Alertas de comisiones y logros
- **Gamification**: Sistema de logros y recompensas

## 🛡️ Compliance y Legal

### 📋 Requisitos Regulatorios
- **KYC/AML**: Verificación de identidad y prevención de lavado
- **Licencias**: Requisitos por jurisdicción
- **Tax reporting**: Reporte de ingresos a autoridades fiscales
- **Consumer protection**: Derechos de los consumidores
- **Data privacy**: GDPR, CCPA y otras regulaciones
- **Terms of service**: Términos claros y cumplimiento

### 🏛️ Consideraciones Legales por País
```
🇺🇸 USA: Requisitos de SEC para programas de inversión
🇪🇺 EU: Directivas de ML y consumer protection
🇬🇧 UK: FCA regulations y financial promotions
🇦🇺 Australia: ASIC requirements para financial services
🇨🇦 Canada: Provincial regulations y securities laws
🌎 LATAM: Varía significativamente por país
```

## 🔮 Desarrollos Futuros

### Fase 2
- **Smart contracts**: Pagos automáticos via blockchain
- **Tokenización**: Creación de token propio para recompensas
- **DeFi integration**: Staking y yield farming para comisiones
- **NFT achievements**: Coleccionables por logros
- **DAO governance**: Gobierno descentralizado del programa
- **Cross-platform**: Integración con otras plataformas

### Fase 3
- **AI optimization**: Optimización de comisiones con IA
- **Predictive analytics**: Predicción de comportamiento de referidos
- **Virtual reality**: Experiencias inmersivas para líderes
- **Metaverse presence**: Oficinas virtuales para equipos
- **Quantum security**: Seguridad cuántica para protección
- **Global expansion**: Herramientas para expansión global

## 📋 Tipos de TypeScript

### Interfaces Principales

```typescript
// Módulo principal de referidos
interface AdminReferidosModule {
  id: 'admin-referidos'
  name: 'Sistema de Referidos'
  description: 'Gestión completa del sistema de referidos multinivel'
  version: string
  enabled: boolean
  features: ReferidosFeatures
}

interface ReferidosFeatures {
  tracking: boolean
  binaryTree: boolean
  fraudDetection: boolean
  analytics: boolean
  mobileApp: boolean
  autoPayout: boolean
}

// Header del módulo
interface AdminReferidosHeader {
  title: string
  description: string
  quickStats: QuickStats
  actions: HeaderAction[]
}

interface QuickStats {
  totalUsers: number
  totalCommissions: number
  activeReferrers: number
  conversionRate: number
}

interface HeaderAction {
  id: string
  label: string
  icon: string
  action: () => void
  variant: 'primary' | 'secondary'
}

// Layout principal
interface AdminReferidosLayout {
  tabs: ReferidosTab[]
  activeTab: string
  content: TabContent
  sidebar?: SidebarConfig
}

interface ReferidosTab {
  id: string
  label: string
  icon: string
  component: string
  badge?: number
}

interface TabContent {
  dashboard: DashboardTab
  treeView: TreeViewTab
  commissions: CommissionsTab
  analytics: AnalyticsTab
  fraudDetection: FraudDetectionTab
}

// KPIs del sistema
interface ReferidosKPIs {
  network: NetworkKPIs
  financial: FinancialKPIs
  performance: PerformanceKPIs
  fraud: FraudKPIs
}

interface NetworkKPIs {
  totalReferrers: number
  totalReferrals: number
  activeReferrers: number
  averageReferralsPerUser: number
  networkDepth: number
  networkWidth: number
  geographicDistribution: CountryDistribution[]
}

interface FinancialKPIs {
  totalCommissionsPaid: number
  pendingCommissions: number
  monthlyCommissionGrowth: number
  averageCommissionPerReferrer: number
  commissionPayoutRatio: number
  totalCommissionVolume: number
}

interface PerformanceKPIs {
  conversionRate: number
  averageConversionTime: number
  retentionRate: number
  viralityCoefficient: number
  topPerformers: TopPerformer[]
  campaignPerformance: CampaignPerformance[]
}

interface FraudKPIs {
  flaggedAccounts: number
  confirmedFraudCases: number
  blockedCommissions: number
  fraudDetectionAccuracy: number
  falsePositiveRate: number
}
```

### Filtros Avanzados

```typescript
interface ReferidosFilters {
  userId?: string
  referrerId?: string
  level?: number[]
  status?: ReferidoStatus[]
  commissionType?: CommissionType[]
  dateRange?: DateRange
  geographic?: GeographicFilter
  fraudStatus?: FraudStatus
  search?: string
}

interface GeographicFilter {
  countries?: string[]
  regions?: string[]
  cities?: string[]
}

interface DateRange {
  from: string
  to: string
  preset?: 'today' | 'week' | 'month' | 'quarter' | 'year'
}
```

### Componentes de Tabs

```typescript
interface DashboardTab {
  kpis: ReferidosKPIs
  charts: DashboardCharts
  recentActivity: ActivityItem[]
  topReferrers: TopReferrer[]
  conversionFunnel: FunnelStage[]
}

interface DashboardCharts {
  networkGrowth: TimeSeriesData
  commissionTrends: TimeSeriesData
  geographicDistribution: PieChartData
  performanceComparison: BarChartData
}

interface TreeViewTab {
  treeData: TreeNode
  searchQuery: string
  selectedNode?: TreeNode
  viewMode: 'binary' | 'unilevel' | 'matrix'
  levelFilter: number
  stats: TreeStats
}

interface TreeNode {
  id: string
  user: UserInfo
  referrer?: string
  level: number
  children: TreeNode[]
  stats: NodeStats
  position?: 'left' | 'right'
}

interface UserInfo {
  id: string
  name: string
  email: string
  avatar?: string
  status: 'active' | 'inactive' | 'suspended'
  joinDate: string
  country: string
}

interface NodeStats {
  totalReferrals: number
  activeReferrals: number
  totalCommissions: number
  lastActivity: string
}

interface CommissionsTab {
  pendingCommissions: Commission[]
  paidCommissions: Commission[]
  commissionSummary: CommissionSummary
  payoutMethods: PayoutMethod[]
  autoPayoutConfig: AutoPayoutConfig
}

interface Commission {
  id: string
  referrerId: string
  referralId: string
  type: CommissionType
  amount: number
  currency: string
  status: 'pending' | 'approved' | 'paid' | 'reversed'
  period: string
  description: string
  createdAt: string
  paidAt?: string
}

interface CommissionSummary {
  totalPending: number
  totalPaid: number
  totalReversed: number
  byType: Record<CommissionType, number>
  byPeriod: Record<string, number>
}

interface AnalyticsTab {
  networkAnalytics: NetworkAnalytics
  performanceMetrics: PerformanceMetrics
  campaignAnalytics: CampaignAnalytics
  predictiveInsights: PredictiveInsights
  exportOptions: ExportConfig[]
}

interface NetworkAnalytics {
  growthRate: number
  retentionCurves: RetentionData[]
  geographicHeatmap: HeatmapData
  userJourneys: UserJourney[]
}

interface FraudDetectionTab {
  flaggedUsers: FlaggedUser[]
  fraudPatterns: FraudPattern[]
  detectionRules: DetectionRule[]
  manualReviewQueue: ReviewItem[]
  fraudStatistics: FraudStatistics
}

interface FlaggedUser {
  userId: string
  user: UserInfo
  riskScore: number
  flags: FraudFlag[]
  status: 'pending' | 'reviewing' | 'cleared' | 'confirmed'
  assignedTo?: string
  createdAt: string
}

interface FraudFlag {
  type: FraudType
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  evidence: Evidence[]
}
```

### Modales Críticos

```typescript
interface CommissionPayoutModal {
  type: 'single' | 'bulk'
  commissions: Commission[]
  totalAmount: number
  currency: string
  payoutMethod: PayoutMethod
  confirmationRequired: boolean
  actions: {
    confirm: () => void
    cancel: () => void
  }
}

interface UserInvestigationModal {
  userId: string
  user: UserInfo
  flags: FraudFlag[]
  networkTree: TreeNode
  activityLog: ActivityItem[]
  actions: {
    clear: () => void
    suspend: () => void
    ban: () => void
    requestKYC: () => void
  }
}

interface CommissionAdjustmentModal {
  commissionId: string
  currentAmount: number
  adjustmentType: 'increase' | 'decrease' | 'reverse'
  reason: string
  internalNote: string
  userNotification: boolean
  actions: {
    apply: () => void
    cancel: () => void
  }
}
```

### Tipos Auxiliares y Enums

```typescript
// Tipos principales
type ReferidoStatus = 'active' | 'inactive' | 'suspended' | 'pending'
type CommissionType = 'direct' | 'binary' | 'matching' | 'residual' | 'leadership'
type FraudType = 'multiple_accounts' | 'self_referral' | 'fake_referral' | 'vpn_usage' | 'fake_documents' | 'coordinated_activity'
type FraudStatus = 'clear' | 'flagged' | 'under_review' | 'confirmed' | 'resolved'
type TreeViewMode = 'binary' | 'unilevel' | 'matrix'
type AttributionModel = 'first_click' | 'last_click' | 'multi_touch' | 'time_decay' | 'position_based'

// Rangos del sistema
type UserRank = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'

interface RankConfig {
  rank: UserRank
  minActiveReferrals: number
  directCommission: number
  binaryCommission: number
  matchingBonus: number
  leadershipBonus?: number
  requirements: RankRequirement[]
}

interface RankRequirement {
  type: 'referrals' | 'volume' | 'team_volume' | 'personal_volume'
  value: number
  period: 'monthly' | 'quarterly' | 'annual'
}

// Configuración del plan de compensación
interface CompensationPlan {
  ranks: RankConfig[]
  commissionTypes: CommissionTypeConfig[]
  binaryStructure: BinaryStructure
  matchingBonus: MatchingBonusConfig
  leadershipBonus?: LeadershipBonusConfig
}

interface CommissionTypeConfig {
  type: CommissionType
  enabled: boolean
  percentage: number
  requirements: string[]
  limits?: CommissionLimits
}

interface BinaryStructure {
  maxDepth: number
  flushPeriod: 'daily' | 'weekly' | 'monthly'
  carryOver: boolean
  activationRequirement: number
}

interface MatchingBonusConfig {
  enabled: boolean
  levels: MatchingLevel[]
}

interface MatchingLevel {
  level: number
  percentage: number
  requirements: string[]
}

// Configuraciones del sistema
interface SystemConfig {
  tracking: TrackingConfig
  fraudDetection: FraudDetectionConfig
  payouts: PayoutConfig
  notifications: NotificationConfig
}

interface TrackingConfig {
  attributionModel: AttributionModel
  cookieDuration: number
  trackingMethods: string[]
  crossDeviceTracking: boolean
}

interface FraudDetectionConfig {
  enabled: boolean
  autoFlagThreshold: number
  manualReviewThreshold: number
  detectionRules: DetectionRule[]
  mlModels: MLModelConfig[]
}

interface PayoutConfig {
  autoPayout: boolean
  payoutFrequency: 'daily' | 'weekly' | 'monthly'
  minimumPayoutAmount: number
  payoutMethods: PayoutMethod[]
  taxReporting: TaxReportingConfig
}

interface NotificationConfig {
  commissionNotifications: boolean
  rankAdvancement: boolean
  fraudAlerts: boolean
  systemUpdates: boolean
}

// Interfaces de datos para gráficos
interface TimeSeriesData {
  labels: string[]
  datasets: Dataset[]
}

interface Dataset {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
}

interface PieChartData {
  labels: string[]
  datasets: Array<{
    data: number[]
    backgroundColor: string[]
  }>
}

interface BarChartData {
  labels: string[]
  datasets: Dataset[]
}

interface HeatmapData {
  coordinates: Array<{
    lat: number
    lng: number
    intensity: number
  }>
}

// Interfaces auxiliares
interface ActivityItem {
  id: string
  type: string
  userId: string
  description: string
  timestamp: string
  metadata?: Record<string, any>
}

interface TopPerformer {
  userId: string
  user: UserInfo
  referrals: number
  commissions: number
  conversionRate: number
  rank: UserRank
}

interface CampaignPerformance {
  campaignId: string
  name: string
  impressions: number
  clicks: number
  conversions: number
  cost: number
  roi: number
}

interface FunnelStage {
  stage: string
  users: number
  conversionRate: number
  dropOffRate: number
}

interface TreeStats {
  totalNodes: number
  maxDepth: number
  averageWidth: number
  activeNodes: number
}

interface PayoutMethod {
  id: string
  name: string
  type: 'bank_transfer' | 'crypto' | 'paypal' | 'other'
  enabled: boolean
  fees: number
  minimumAmount: number
  processingTime: string
}

interface AutoPayoutConfig {
  enabled: boolean
  threshold: number
  frequency: 'daily' | 'weekly' | 'monthly'
  minimumAmount: number
  excludedUsers: string[]
}

interface PerformanceMetrics {
  conversionRate: number
  retentionRate: number
  averageOrderValue: number
  customerLifetimeValue: number
  returnOnInvestment: number
}

interface CampaignAnalytics {
  impressions: number
  clicks: number
  conversions: number
  costPerAcquisition: number
  returnOnAdSpend: number
  conversionRate: number
}

interface PredictiveInsights {
  networkGrowth: Forecast
  commissionTrends: Forecast
  userBehavior: BehaviorPrediction
  riskAssessment: RiskPrediction
}

interface Forecast {
  trend: 'growing' | 'stable' | 'declining'
  confidence: number
  prediction: number[]
  timeframe: string
}

interface BehaviorPrediction {
  userId: string
  predictedAction: string
  probability: number
  factors: string[]
}

interface RiskPrediction {
  riskLevel: 'low' | 'medium' | 'high'
  riskFactors: string[]
  mitigationStrategies: string[]
}

interface DetectionRule {
  id: string
  name: string
  type: 'behavioral' | 'network' | 'financial' | 'geographic'
  conditions: RuleCondition[]
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
  autoAction?: 'flag' | 'suspend' | 'review'
}

interface RuleCondition {
  field: string
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'in_range'
  value: any
  weight: number
}

interface MLModelConfig {
  modelId: string
  name: string
  type: 'anomaly_detection' | 'classification' | 'prediction'
  accuracy: number
  trainingDataSize: number
  lastTrained: string
  enabled: boolean
}

interface Evidence {
  type: 'ip_address' | 'device_fingerprint' | 'behavior_pattern' | 'financial_pattern' | 'document'
  value: string
  confidence: number
  timestamp: string
}

interface FraudStatistics {
  totalFlagged: number
  confirmedFraud: number
  falsePositives: number
  accuracyRate: number
  averageDetectionTime: number
  topFraudTypes: Array<{
    type: FraudType
    count: number
    percentage: number
  }>
}

interface ReviewItem {
  id: string
  userId: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo: string
  status: 'pending' | 'in_review' | 'resolved'
  createdAt: string
  dueDate: string
}

interface TaxReportingConfig {
  enabled: boolean
  threshold: number
  forms: string[]
  filingFrequency: 'annual' | 'quarterly' | 'monthly'
}

interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf'
  includeCharts: boolean
  dateRange: DateRange
  filters: Partial<ReferidosFilters>
}

interface RetentionData {
  period: string
  retentionRate: number
  cohortSize: number
}

interface UserJourney {
  userId: string
  stages: JourneyStage[]
  totalDuration: number
  conversionPoints: ConversionPoint[]
}

interface JourneyStage {
  stage: string
  timestamp: string
  duration: number
  actions: string[]
}

interface ConversionPoint {
  stage: string
  conversionRate: number
  dropOffRate: number
  factors: string[]
}
```

## 📋 Checklist de Implementación

### ✅ Fase 1 - MVP (Mes 1-2)
- [ ] Sistema básico de tracking de referidos
- [ ] Cálculo y pago de comisiones directas
- [ ] Dashboard administrativo básico
- [ ] Prevención básica de fraude
- [ ] Integración con sistema de pagos

### 🔄 Fase 2 - Mejora (Mes 3-4)
- [ ] Sistema binario completo
- [ ] Analytics avanzados
- [ ] Herramientas móviles para referidores
- [ ] Sistema de detección de fraude mejorado
- [ ] Programa de incentivos y bonos

### 🚀 Fase 3 - Optimización (Mes 5-6)
- [ ] Machine learning para optimización
- [ ] Integración blockchain
- [ ] Expansión internacional
- [ ] Herramientas avanzadas de marketing
- [ ] Sistema completo de compliance
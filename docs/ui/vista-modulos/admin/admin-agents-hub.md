# 🤖 Agents Hub - Panel de Administración

## 🎯 Propósito del Módulo
Panel administrativo centralizado para gestionar el ecosistema completo de agentes (IA y humanos), incluyendo creación, configuración, monitoreo de performance, aprobación de señales, y administración de suscripciones y compensaciones.

## 🚀 Rutas y Navegación

### Rutas Principales
```
GET  /admin/agents-hub                      # Dashboard principal del hub
GET  /admin/agents-hub/agents/:id           # Detalle de agente específico
GET  /admin/agents-hub/create               # Formulario de creación de agente
GET  /admin/agents-hub/signals              # Gestión de señales de agentes
GET  /admin/agents-hub/analytics            # Analytics de performance
GET  /admin/agents-hub/subscriptions        # Gestión de suscripciones
POST /admin/agents-hub/approve-signal        # Aprobar/rechazar señales
```

### Query Parameters
```
?type=all|ai|human|hybrid                   # Tipo de agente
?status=all|active|inactive|pending        # Estado del agente
?performance=top|average|underperforming   # Nivel de performance
?category=football|basketball|tennis|all   # Deporte principal
?subscription=free|basic|premium|elite     # Nivel de suscripción
```

## 📋 Estructura del Panel

### 🏠 Pestaña: "Dashboard Agents"
- **Total agentes activos**: IA + Humanos + Híbridos
- **Performance general**: Win rate promedio, ROI, suscriptores
- **Agentes destacados**: Top performers del mes
- **Señales pendientes**: Aprobación pendiente por moderación
- **Distribución por deportes**: Fútbol, basket, tenis, otros
- **Tendencias**: Crecimiento de suscriptores, nuevos agentes

### 🤖 Pestaña: "Gestión de Agentes"
- **Agentes IA**: Configuración, algoritmos, parámetros
- **Agentes humanos**: Perfiles, verificación, documentación
- **Agentes híbridos**: Combinación IA + humano
- **Estado de agentes**: Activos, pausados, en revisión
- **Categorización**: Por deporte, mercado, estilo
- **Documentación**: Certificados, track record, validaciones

### 📊 Pestaña: "Performance Analytics"
- **Métricas individuales**: Por agente (win rate, ROI, drawdown)
- **Comparativas**: Ranking entre agentes
- **Histórico**: Evolución temporal de performance
- **Análisis por mercado**: Efectividad por tipo de apuesta
- **Predicciones vs realidad**: Precisión de señales
- **Satisfacción de usuarios**: Ratings y feedback

### 💰 Pestaña: "Compensaciones y Finanzas"
- **Modelos de revenue**: Por suscripción, por performance, híbrido
- **Pagos pendientes**: A agentes por performance/suscripciones
- **Comisiones**: Estructura y cálculos
- **Bonificaciones**: Incentivos por hitos y logros
- **Reportes financieros**: Ingresos, pagos, rentabilidad
- **Facturación**: Generación y gestión de facturas

### ⚙️ Pestaña: "Configuración y Moderación"
- **Aprobación de señales**: Workflow de revisión
- **Parámetros de IA**: Ajuste de algoritmos
- **Reglas de negocio**: Límites, restricciones, políticas
- **Calidad y compliance**: Verificación de cumplimiento
- **Moderación de contenido**: Reviews, validaciones
- **Sistema de reputación**: Puntuación y rankings

## 🤖 Tipos de Agentes

### 🤖 Agentes IA (Artificial Intelligence)
- **Algoritmos base**: Machine learning, deep learning
- **Entrenamiento**: Datos históricos, actualización continua
- **Deportes cubiertos**: Fútbol, basket, tenis, otros
- **Mercados**: Moneyline, handicap, totals, props
- **Frecuencia de señales**: Real-time, diario, semanal
- **Niveles de confianza**: Alta (70%+), media (50-70%), baja (<50%)

### 👨‍💼 Agentes Humanos (Tipsters Profesionales)
- **Verificación de identidad**: KYC completo
- **Track record validado**: Historial auditado mínimo 1 año
- **Especialización**: Deporte, liga, mercado específico
- **Certificaciones**: Licencias, títulos relevantes
- **Análisis fundamental**: Expertise deportivo
- **Gestion de riesgo**: Estrategias probadas

### 🔄 Agentes Híbridos (IA + Humano)
- **IA asistente**: Generación de insights y análisis
- **Validación humana**: Confirmación de señales IA
- **Mejora continua**: Feedback loop humano-IA
- **Escalabilidad**: Mayor cobertura manteniendo calidad
- **Precisión mejorada**: Combinación de ambos enfoques
- **Costo-eficiencia**: Balance entre calidad y precio

## 📈 Sistema de Performance

### Métricas Principales
- **Win Rate**: % de señales ganadoras
- **ROI**: Retorno sobre inversión promedio
- **Yield**: Rentabilidad por unidad apostada
- **Drawdown**: Máxima pérdida consecutiva
- **Strikes**: Racha de aciertos/errores
- **Confianza**: Precisión de probabilidades asignadas

### Benchmarks por Categoría
```
AGENTES TOP (Top 10%):
- Win Rate: >60%
- ROI: >15%
- Drawdown: <15%
- Señales mínimas: 100+ mensuales

AGENTES PROMEDIO (40%):
- Win Rate: 52-60%
- ROI: 5-15%
- Drawdown: 15-25%
- Señales mínimas: 50+ mensuales

AGENTES BAJO PERFORMANCE (Bottom 20%):
- Win Rate: <52%
- ROI: <5%
- Drawdown: >25%
- Revisión/reentrenamiento requerido
```

### Sistema de Recompensas
- **Bonos por performance**: Pagos extra por hitos
- **Programa de lealtad**: Beneficios por antigüedad
- **Ranking mensual**: Premios a top performers
- **Incentivos de crecimiento**: Por aumentar suscriptores
- **Bonos por referidos**: Por traer nuevos usuarios
- **Reconocimientos especiales**: Badges, certificados

## 💰 Modelos de Negocio

### Suscripción por Niveles
- **FREE**: 3-5 señales básicas semanales
- **BASIC**: 10-15 señales, deportes principales
- **PREMIUM**: 25-30 señales, todos los deportes
- **ELITE**: 50+ señales, acceso VIP, soporte prioritario

### Revenue Share Models
- **Modelo 1**: 70% agente / 30% plataforma
- **Modelo 2**: 60% agente / 40% plataforma (con garantías)
- **Modelo 3**: 50% agente / 50% plataforma (con marketing incluido)
- **Modelo Híbrido**: Fijo + variable por performance

### Pagos y Facturación
- **Pagos mensuales**: Basado en suscriptores activos
- **Pagos por performance**: Bonos por hitos alcanzados
- **Retenciones**: Garantías y devoluciones
- **Métodos de pago**: Transferencia, crypto, PayPal
- **Monedas soportadas**: USD, EUR, GBP, criptomonedas
- **Reportes financieros**: Dashboard de ingresos

## ⚙️ Sistema de Aprobación de Señales

### Workflow de Moderación
1. **Generación**: IA o humano crea señal
2. **Validación automática**: Checks técnicos y de calidad
3. **Revisión humana**: Moderador evalúa (si aplica)
4. **Aprobación/Rechazo**: Decisión final
5. **Publicación**: Señal va a suscriptores
6. **Monitoreo**: Seguimiento de resultado

### Criterios de Aprobación
- **Odds mínimas**: 1.50+ (configurable)
- **Probabilidad mínima**: 55%+ según análisis
- **Mercados válidos**: Solo mercados aprobados
- **Timing adecuado**: Con suficiente tiempo para apostar
- **Información completa**: Deporte, evento, mercado, stake sugerido
- **Justificación**: Razón del análisis (especialmente humanos)

### Sistema de Revisión
- **Moderadores senior**: Expertos en cada deporte
- **Rotación de revisores**: Evitar sesgos
- **Tiempo de revisión**: SLA según tipo de señal
- **Feedback loop**: Mejora continua del proceso
- **Escalación**: Segundo nivel para casos complejos
- **Auditoría**: Registro de decisiones y razones

## 📊 Analytics Avanzados

### Performance por Deporte
- **Fútbol**: Win rate, ROI por liga/competición
- **Basket**: NBA, Euroliga, otros torneos
- **Tenis**: ATP, WTA, challengers
- **Otros deportes**: Hockey, béisbol, e-sports
- **Mercados especiales**: Política, entretenimiento

### Análisis Temporal
- **Performance por día**: Mejores/peores días de la semana
- **Estacionalidad**: Patrones mensuales/anuales
- **Eventos especiales**: Grandes torneos, playoffs
- **Horarios de trading**: Efectividad por franja horaria
- **Zonas horarias**: Impacto de diferentes regiones

### Análisis de Usuarios
- **Satisfacción**: Ratings y reviews de señales
- **Retención**: Qué agentes mantienen suscriptores
- **Crecimiento**: Agentes con mayor aumento de followers
- **Engagement**: Interacción con señales (clicks, apuestas)
- **Valoración cualitativa**: Feedback escrito de usuarios

## 🔧 Herramientas de Gestión

### Para Agentes IA
- **Backtesting**: Testing de estrategias con datos históricos
- **Optimización**: Ajuste automático de parámetros
- **Monitoreo en tiempo real**: Performance live
- **Retraining**: Actualización periódica de modelos
- **A/B testing**: Comparación de versiones de algoritmos
- **Explainability**: Explicación de decisiones de IA

### Para Agentes Humanos
- **Plataforma de análisis**: Herramientas profesionales
- **Gestión de portfolio**: Tracking de señales y resultados
- **Comunicación**: Chat con suscriptores
- **Educación**: Recursos y materiales de apoyo
- **Marketing**: Herramientas para crecer audiencia
- **Soporte**: Asistencia técnica y comercial

## 🛡️ Compliance y Seguridad

### Verificación de Agentes
- **KYC completo**: Identidad, dirección, edad
- **Verificación de expertise**: Títulos, certificaciones
- **Background check**: Antecedentes penales/financieros
- **Validación de track record**: Auditoría de historial
- **Pruebas de conocimiento**: Tests técnicos y prácticos
- **Entrevistas**: Evaluación personal y profesional

### Monitoreo Continuo
- **Análisis de señales**: Detección de patrones sospechosos
- **Verificación de resultados**: Cross-check con datos oficiales
- **Monitoreo de comportamiento**: Cambios en patrones de trading
- **Actualización de documentación**: Renovación de licencias/certificados
- **Auditorías periódicas**: Revisión de procesos y cumplimiento
- **Sistema de reportes**: Incidentes y anomalías

## 🔮 Desarrollos Futuros

### Fase 2
- **Agentes multi-deporte**: IA especializada en varios deportes
- **Social trading**: Agentes que siguen a otros agentes
- **NFT de performance**: Tokenización de track records
- **DAO de agentes**: Gobierno descentralizado del hub
- **Metaverso**: Interacción inmersiva con agentes

### Fase 3
- **Quantum computing**: Procesamiento avanzado para IA
- **Biometric integration**: Análisis de estado emocional
- **Augmented reality**: Visualización de datos en tiempo real
- **Voice agents**: Asistentes de voz para trading
- **Autonomous agents**: Agentes completamente autónomos y auto-gestionados

---

## TypeScript Interfaces

```typescript
// Módulo principal del Agents Hub
interface AdminAgentsHubModule {
  id: string;
  name: string;
  version: string;
  status: ModuleStatus;
  config: AgentsHubConfig;
  features: AgentsHubFeatures;
  permissions: AgentsHubPermissions;
  dashboard: AgentsHubDashboard;
  agents: Agent[];
  analytics: AgentsHubAnalytics;
  lastUpdated: Date;
  integrations: Integration[];
}

// Configuración del módulo
interface AgentsHubConfig {
  general: GeneralConfig;
  agentTypes: AgentTypeConfig[];
  approvalWorkflow: ApprovalWorkflow;
  revenueModels: RevenueModel[];
  performanceBenchmarks: PerformanceBenchmark[];
  compliance: ComplianceConfig;
  moderation: ModerationConfig;
}

interface GeneralConfig {
  maxActiveAgents: number;
  maxSignalsPerAgent: number;
  signalApprovalRequired: boolean;
  autoModerationEnabled: boolean;
  revenueShareEnabled: boolean;
  multiLanguageSupport: boolean;
  timezone: string;
  currency: string;
}

interface AgentTypeConfig {
  type: AgentType;
  enabled: boolean;
  maxAgents: number;
  features: string[];
  requirements: string[];
  approvalProcess: ApprovalProcess;
}

interface ApprovalWorkflow {
  enabled: boolean;
  stages: ApprovalStage[];
  autoApprovalThreshold: number;
  escalationRules: EscalationRule[];
  slaHours: number;
}

interface ApprovalStage {
  id: string;
  name: string;
  type: 'automatic' | 'manual';
  validators: string[];
  required: boolean;
  timeoutHours: number;
}

// Features del módulo
interface AgentsHubFeatures {
  main: MainFeatures;
  advanced: AdvancedFeatures;
  integrations: IntegrationFeatures;
}

interface MainFeatures {
  agentManagement: boolean;
  signalApproval: boolean;
  performanceTracking: boolean;
  revenueManagement: boolean;
  userSubscriptions: boolean;
  analyticsDashboard: boolean;
}

interface AdvancedFeatures {
  aiAgentTraining: boolean;
  automatedModeration: boolean;
  predictiveAnalytics: boolean;
  socialTrading: boolean;
  multiLanguage: boolean;
  realTimeMonitoring: boolean;
}

interface IntegrationFeatures {
  externalDataProviders: boolean;
  paymentProcessors: boolean;
  complianceTools: boolean;
  marketingPlatforms: boolean;
  crmSystems: boolean;
  notificationServices: boolean;
}

// Permisos del módulo
interface AgentsHubPermissions {
  admin: AdminPermissions;
  moderator: ModeratorPermissions;
  agent: AgentPermissions;
  viewer: ViewerPermissions;
}

interface AdminPermissions {
  createAgents: boolean;
  deleteAgents: boolean;
  approveSignals: boolean;
  manageRevenue: boolean;
  configureSystem: boolean;
  viewAnalytics: boolean;
  manageUsers: boolean;
  complianceActions: boolean;
}

interface ModeratorPermissions {
  reviewSignals: boolean;
  approveContent: boolean;
  flagContent: boolean;
  viewAgentProfiles: boolean;
  moderateComments: boolean;
  escalateIssues: boolean;
}

interface AgentPermissions {
  createSignals: boolean;
  editProfile: boolean;
  viewAnalytics: boolean;
  manageSubscribers: boolean;
  respondToFeedback: boolean;
  viewRevenue: boolean;
}

interface ViewerPermissions {
  viewPublicAgents: boolean;
  viewPublicSignals: boolean;
  subscribeToAgents: boolean;
  rateAgents: boolean;
  viewAgentStats: boolean;
}

// Dashboard del Agents Hub
interface AgentsHubDashboard {
  overview: HubOverview;
  agentDistribution: AgentDistribution;
  performanceMetrics: HubPerformanceMetrics;
  topPerformers: TopPerformer[];
  pendingSignals: PendingSignal[];
  recentActivity: Activity[];
}

interface HubOverview {
  totalAgents: number;
  activeAgents: number;
  totalSignals: number;
  pendingSignals: number;
  totalSubscribers: number;
  totalRevenue: number;
  averageWinRate: number;
  systemHealth: HealthStatus;
}

interface AgentDistribution {
  byType: AgentTypeCount[];
  bySport: SportDistribution[];
  byStatus: StatusDistribution[];
  bySubscription: SubscriptionDistribution[];
  byPerformance: PerformanceDistribution[];
}

interface HubPerformanceMetrics {
  overallWinRate: number;
  averageROI: number;
  averageYield: number;
  maxDrawdown: number;
  signalAccuracy: number;
  userSatisfaction: number;
}

interface TopPerformer {
  agentId: string;
  agentName: string;
  agentType: AgentType;
  winRate: number;
  roi: number;
  subscribers: number;
  sport: string;
  trend: 'up' | 'down' | 'stable';
}

interface PendingSignal {
  signalId: string;
  agentId: string;
  agentName: string;
  sport: string;
  event: string;
  market: string;
  odds: number;
  confidence: number;
  submittedAt: Date;
  priority: 'high' | 'medium' | 'low';
}

// Agente individual
interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  profile: AgentProfile;
  performance: AgentPerformance;
  configuration: AgentConfiguration;
  subscription: AgentSubscription;
  compliance: AgentCompliance;
  createdAt: Date;
  updatedAt: Date;
}

interface AgentProfile {
  displayName: string;
  description: string;
  avatar: string;
  specialties: string[];
  experience: number; // años
  certifications: Certification[];
  languages: string[];
  location: string;
  timezone: string;
}

interface AgentPerformance {
  overall: PerformanceMetrics;
  bySport: SportPerformance[];
  byMarket: MarketPerformance[];
  byTime: TimePerformance[];
  history: PerformanceHistory[];
  rankings: AgentRanking;
}

interface PerformanceMetrics {
  winRate: number;
  roi: number;
  yield: number;
  maxDrawdown: number;
  totalSignals: number;
  winningSignals: number;
  averageOdds: number;
  averageStake: number;
  profit: number;
  lastUpdated: Date;
}

interface SportPerformance {
  sport: string;
  winRate: number;
  roi: number;
  totalSignals: number;
  averageOdds: number;
  profit: number;
  trend: 'up' | 'down' | 'stable';
}

interface MarketPerformance {
  market: string;
  winRate: number;
  roi: number;
  totalSignals: number;
  averageOdds: number;
  profit: number;
}

interface TimePerformance {
  period: string;
  winRate: number;
  roi: number;
  totalSignals: number;
  profit: number;
}

interface AgentRanking {
  overall: number;
  bySport: SportRanking[];
  byMarket: MarketRanking[];
  trend: 'rising' | 'falling' | 'stable';
}

interface AgentConfiguration {
  aiConfig?: AIConfiguration;
  humanConfig?: HumanConfiguration;
  hybridConfig?: HybridConfiguration;
  signalSettings: SignalSettings;
  riskManagement: RiskManagement;
  notificationSettings: NotificationSettings;
}

interface AIConfiguration {
  algorithm: string;
  modelVersion: string;
  trainingData: TrainingData;
  hyperparameters: HyperParameters;
  updateSchedule: string;
  backtestingResults: BacktestingResult[];
}

interface HumanConfiguration {
  analysisMethod: string;
  researchTools: string[];
  dataSources: string[];
  bettingStrategy: string;
  riskProfile: RiskProfile;
  specialization: Specialization;
}

interface HybridConfiguration {
  aiWeight: number; // 0-1
  humanWeight: number; // 0-1
  collaborationMode: 'sequential' | 'parallel' | 'hierarchical';
  overrideRules: OverrideRule[];
  feedbackLoop: FeedbackLoop;
}

interface SignalSettings {
  maxDailySignals: number;
  minOdds: number;
  maxOdds: number;
  minConfidence: number;
  markets: string[];
  sports: string[];
  timeFrames: string[];
  stakeSizing: StakeSizing;
}

interface RiskManagement {
  maxDrawdown: number;
  maxStake: number;
  stopLoss: number;
  takeProfit: number;
  diversification: Diversification;
}

interface AgentSubscription {
  tier: SubscriptionTier;
  price: number;
  currency: string;
  features: string[];
  limits: SubscriptionLimits;
  subscribers: Subscriber[];
  revenue: Revenue;
}

interface SubscriptionLimits {
  maxSubscribers: number;
  maxSignalsPerDay: number;
  maxSports: number;
  maxMarkets: number;
  analyticsAccess: boolean;
  prioritySupport: boolean;
}

interface Revenue {
  total: number;
  monthly: number;
  lastMonth: number;
  growth: number;
  sharePercentage: number;
}

interface AgentCompliance {
  kycStatus: KYCStatus;
  certifications: Certification[];
  backgroundCheck: BackgroundCheck;
  auditHistory: AuditRecord[];
  violations: Violation[];
  riskLevel: RiskLevel;
}

// Sistema de señales
interface Signal {
  id: string;
  agentId: string;
  sport: string;
  event: string;
  market: string;
  selection: string;
  odds: number;
  stake: number;
  confidence: number;
  reasoning: string;
  status: SignalStatus;
  result?: SignalResult;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

interface SignalResult {
  outcome: 'win' | 'loss' | 'push' | 'void';
  profit: number;
  settledAt: Date;
  actualOdds: number;
  notes?: string;
}

interface SignalApproval {
  signalId: string;
  reviewerId: string;
  decision: 'approved' | 'rejected' | 'pending';
  reason: string;
  confidence: number;
  reviewedAt: Date;
  expiresAt: Date;
}

// Analytics del hub
interface AgentsHubAnalytics {
  overview: AnalyticsOverview;
  agentPerformance: AgentAnalytics[];
  signalAnalytics: SignalAnalytics;
  userAnalytics: UserAnalytics;
  financialAnalytics: FinancialAnalytics;
  complianceAnalytics: ComplianceAnalytics;
}

interface AnalyticsOverview {
  dateRange: DateRange;
  totalAgents: number;
  newAgents: number;
  churnedAgents: number;
  totalSignals: number;
  activeSignals: number;
  totalRevenue: number;
  growth: number;
}

interface AgentAnalytics {
  agentId: string;
  performance: AgentPerformanceMetrics;
  subscriberAnalytics: SubscriberAnalytics;
  signalAnalytics: AgentSignalAnalytics;
  revenueAnalytics: RevenueAnalytics;
  trend: Trend;
}

interface SignalAnalytics {
  totalSignals: number;
  approvedSignals: number;
  rejectedSignals: number;
  averageWinRate: number;
  averageROI: number;
  bySport: SportAnalytics[];
  byMarket: MarketAnalytics[];
  temporal: TemporalAnalytics;
}

interface UserAnalytics {
  totalSubscribers: number;
  activeSubscribers: number;
  newSubscribers: number;
  churnedSubscribers: number;
  satisfaction: number;
  engagement: number;
  byTier: SubscriptionAnalytics[];
}

interface FinancialAnalytics {
  totalRevenue: number;
  revenueBySource: RevenueSource[];
  agentPayments: AgentPayment[];
  platformCommission: number;
  growth: number;
  projections: FinancialProjection[];
}

interface ComplianceAnalytics {
  kycCompletion: number;
  violationRate: number;
  auditCompletion: number;
  riskDistribution: RiskDistribution[];
  complianceScore: number;
}

// Configuración de revenue
interface RevenueModel {
  id: string;
  name: string;
  type: RevenueModelType;
  agentShare: number;
  platformShare: number;
  conditions: RevenueCondition[];
  bonuses: BonusStructure;
}

interface RevenueCondition {
  type: 'performance' | 'subscriber' | 'longevity' | 'volume';
  threshold: number;
  multiplier: number;
  description: string;
}

interface BonusStructure {
  performanceBonuses: PerformanceBonus[];
  referralBonuses: ReferralBonus[];
  loyaltyRewards: LoyaltyReward[];
  specialAchievements: SpecialAchievement[];
}

// Sistema de moderación
interface ModerationConfig {
  autoModeration: AutoModeration;
  manualReview: ManualReview;
  escalation: EscalationConfig;
  qualityControl: QualityControl;
}

interface AutoModeration {
  enabled: boolean;
  rules: AutoModerationRule[];
  confidenceThreshold: number;
  action: 'approve' | 'flag' | 'reject';
}

interface ManualReview {
  enabled: boolean;
  reviewers: Reviewer[];
  workload: WorkloadDistribution;
  slaHours: number;
}

interface Reviewer {
  id: string;
  name: string;
  specialties: string[];
  workload: number;
  performance: ReviewerPerformance;
}

// Tipos auxiliares y enums
enum AgentType {
  AI = 'ai',
  HUMAN = 'human',
  HYBRID = 'hybrid'
}

enum AgentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  UNDER_REVIEW = 'under_review'
}

enum SignalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
  EXPIRED = 'expired',
  SETTLED = 'settled',
  CANCELLED = 'cancelled'
}

enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
  ELITE = 'elite'
}

enum RevenueModelType {
  PERFORMANCE_BASED = 'performance_based',
  SUBSCRIPTION_BASED = 'subscription_based',
  HYBRID = 'hybrid',
  FIXED = 'fixed'
}

enum KYCStatus {
  NOT_STARTED = 'not_started',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

enum HealthStatus {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  WARNING = 'warning',
  CRITICAL = 'critical'
}

interface DateRange {
  start: Date;
  end: Date;
}

interface Trend {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
  period: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: Date;
  expiry?: Date;
  verified: boolean;
}

interface BackgroundCheck {
  status: 'pending' | 'clear' | 'flagged';
  date: Date;
  notes?: string;
}

interface Violation {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  date: Date;
  resolved: boolean;
  penalty?: string;
}

interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  config: any;
  lastSync: Date;
}
```
# 🛡️ Risk Guard - Panel de Administración

## 🎯 Propósito del Módulo
Panel administrativo para gestionar el sistema de protección de capital que automatiza límites de riesgo, monitorea patrones de trading riesgosos y protege a los usuarios de pérdidas significativas mediante intervenciones inteligentes.

## 🚀 Rutas y Navegación

### Rutas Principales
```
GET  /admin/risk-guard                     # Dashboard principal de riesgo
GET  /admin/risk-guard/users/:id           # Análisis individual de riesgo
GET  /admin/risk-guard/alerts              # Gestión de alertas activas
GET  /admin/risk-guard/rules               # Configuración de reglas de riesgo
POST /admin/risk-guard/interventions       # Crear intervenciones manuales
GET  /admin/risk-guard/analytics           # Analytics de riesgo y compliance
```

### Query Parameters
```
?risk_level=all|low|medium|high|critical     # Nivel de riesgo actual
?status=active|blocked|warning|review        # Estado del usuario
?violation=none|daily_limit|stake_size|pattern # Tipo de violación
?timeframe=today|week|month|quarter          # Período de análisis
```

## 📋 Estructura del Panel

### 📊 Pestaña: "Dashboard de Riesgo"
- **Usuarios en riesgo crítico**: Número y tendencia
- **Intervenciones activas**: Bloqueos y límites aplicados
- **Tasa de violaciones**: % de usuarios que rompen reglas
- **Efectividad del sistema**: % de protecciones exitosas
- **Distribución por niveles**: Usuarios por nivel de riesgo

### 👤 Pestaña: "Análisis Individual"
- **Perfil de riesgo del usuario**: Conservador/Moderado/Agresivo
- **Historial de violaciones**: Registro de límites excedidos
- **Patrones de trading**: Análisis de comportamiento riesgoso
- **Medidas aplicadas**: Reglas y límites personalizados
- **Evolución temporal**: Gráfica de riesgo a través del tiempo

### ⚠️ Pestaña: "Alertas y Violaciones"
- **Alertas activas**: Violaciones en tiempo real
- **Severidad de alertas**: Crítica/Alta/Media/Baja
- **Tiempo de respuesta**: Rapidez en aplicar protecciones
- **Acciones tomadas**: Bloqueos, límites, advertencias
- **Resolución de casos**: Cómo se resolvieron las alertas

### 🔧 Pestaña: "Configuración de Reglas"
- **Reglas por defecto**: Estándares del sistema
- **Reglas personalizadas**: Por tipo de usuario
- **Umbrales ajustables**: Límites configurables
- **Excepciones y whitelist**: Casos especiales
- **Testing de reglas**: Simulación antes de aplicar

## 🛡️ Sistema de Protección Multi-Capas

### 🔒 Capa 1: Protecciones Automáticas (Hard Limits)
- **Límite diario de pérdidas**: Porcentaje configurable del bankroll
- **Límite por sesión LIVE**: Restricciones en apuestas en vivo
- **Stake máximo automático**: Límite dinámico basado en bankroll
- **Bloqueo por horario**: Restricciones en horarios específicos
- **Cooling-off automático**: Pausas forzadas tras pérdidas

### ⚠️ Capa 2: Advertencias Inteligentes (Soft Limits)
- **Alertas de aproximación**: Cuando se acerca a límites
- **Recordatorios de disciplina**: Mensajes contextuales
- **Sugerencias de stake**: Recomendaciones de tamaño de apuesta
- **Análisis de patrones**: Detección de comportamientos riesgosos
- **Intervenciones suaves**: Sugerencias antes de acciones drásticas

### 🎯 Capa 3: Coaching Preventivo (Proactive)
- **Educación contextual**: Tips en momentos clave
- **Refuerzo positivo**: Reconocimiento de buenas decisiones
- **Análisis post-apuesta**: Feedback después de cada trade
- **Plan de mejora personalizado**: Ruta de progreso individual
- **Soporte prioritario**: Atención especial a usuarios en riesgo

## 📊 Tipos de Intervención

### 🚫 Bloqueos Inmediatos (Hard Stop)
```
- Drawdown >30% en 24 horas
- Stake >20% del bankroll actual
- 5+ pérdidas consecutivas
- Patrón de martingala detectado
- Trading bajo influencia (horarios sospechosos)
```

### ⚡ Límites Dinámicos (Dynamic Limits)
```
- Reducción automática de stakes
- Restricción temporal de mercados LIVE
- Límite de apuestas por hora/día
- Exclusión de mercados de alta volatilidad
- Requerimiento de confirmación manual
```

### 📢 Advertencias Contextuales (Soft Warnings)
```
- "Has superado el 80% de tu límite diario"
- "Considera reducir tu stake actual"
- "Tu performance está por debajo del promedio"
- "Recuerda seguir tu plan de trading"
- "Hoy NO es un buen día para apostar"
```

## 🎯 Perfiles de Riesgo

### 🟢 Conservador (Low Risk)
- **Límite diario**: 5% del bankroll
- **Stake máximo**: 2% por apuesta
- **Intervenciones**: Tempranas y frecuentes
- **Educación**: Enfoque en preservación de capital
- **Mercados**: Solo mercados principales, no LIVE

### 🟡 Moderado (Medium Risk)
- **Límite diario**: 10% del bankroll
- **Stake máximo**: 5% por apuesta
- **Intervenciones**: Balanceadas
- **Educación**: Mix de preservación y crecimiento
- **Mercados**: Principales + secundarios, LIVE limitado

### 🔴 Agresivo (High Risk)
- **Límite diario**: 20% del bankroll
- **Stake máximo**: 10% por apuesta
- **Intervenciones**: Mínimas, solo críticas
- **Educación**: Enfoque en optimización
- **Mercados**: Todos los mercados disponibles

## 📈 Integraciones

### Con Módulos del Sistema
- **admin-users**: Perfil y configuración de riesgo
- **admin-bets**: Historial para análisis de patrones
- **admin-bankroll**: Monitoreo en tiempo real de capital
- **admin-signals**: Calidad de señales y su impacto
- **admin-performance**: Métricas de rendimiento global
- **admin-trading-coach**: Coaching preventivo basado en riesgo

### APIs Externas
- **Proveedores de datos**: Odds, resultados, estadísticas
- **Herramientas de análisis**: Indicadores técnicos y fundamentales
- **Calendarios deportivos**: Eventos y su volatilidad esperada
- **Servicios de verificación**: Identidad y edad (responsabilidad)
- **Sistemas de pago**: Detección de problemas financieros

## 🔧 Configuración Avanzada

### Reglas Personalizadas
```javascript
// Ejemplo: Regla anti-martingala
if (consecutive_losses >= 3 && stake_increase > 50%) {
    trigger_intervention("martingale_detected");
    apply_limit("stake_max", bankroll * 0.02);
}

// Ejemplo: Protección por horario
if (hour >= 2 && hour <= 6 && user_activity === "high") {
    trigger_intervention("suspicious_hours");
    require_manual_confirmation();
}
```

### Umbrales Adaptativos
- **Machine Learning**: Ajuste automático basado en datos históricos
- **Benchmarking**: Comparación con usuarios similares
- **Temporalidad**: Ajustes por temporadas y eventos especiales
- **Geolocalización**: Diferencias por país/región
- **Demografía**: Ajustes por edad, experiencia, perfil

## 📊 Métricas y KPIs

### Efectividad del Sistema
- **Tasa de protección exitosa**: % de usuarios protegidos de pérdidas mayores
- **Reducción de drawdowns severos**: Disminución de casos críticos
- **Mejora de disciplina**: Aumento en adherencia a límites
- **Retención mejorada**: Usuarios protegidos se quedan más tiempo
- **Satisfacción del usuario**: Valoración del sistema de protección

### Performance Operativa
- **Tiempo de detección**: Rapidez en identificar riesgos
- **Precisión de alertas**: Ratio de alertas verdaderas vs falsas positivas
- **Tiempo de intervención**: Velocidad en aplicar protecciones
- **Carga del sistema**: Usuarios monitoreados concurrentemente
- **Disponibilidad**: Uptime del sistema de riesgo

## 🛡️ Compliance y Legal

### Cumplimiento Regulatorio
- **Límites legales por jurisdicción**: Adaptación a regulaciones locales
- **Verificación de edad**: Protección de menores
- **Autoexclusión**: Integración con programas oficiales
- **Reportes regulatorios**: Documentación para auditorías
- **Responsible gambling**: Adherencia a estándares de juego responsable

### Protección de Datos
- **Anonimización**: Datos sensibles protegidos
- **Consentimiento**: Aceptación explícita del monitoreo
- **Transparencia**: Usuario sabe qué se monitorea y por qué
- **Derecho a oposición**: Usuario puede limitar el monitoreo
- **Auditoría**: Registro de decisiones y acciones

---

## 📋 Tipos de TypeScript - Interfaces del Módulo Risk Guard

### Interfaces Principales del Módulo

```typescript
interface AdminRiskGuardModule {
  id: 'admin-risk-guard'
  name: 'Gestión de Riesgos y Protección de Capital'
  description: 'Sistema de protección multi-capas para trading responsable'
  version: string
  enabled: boolean
  features: RiskGuardFeatures
  config: RiskGuardConfig
}

interface RiskGuardFeatures {
  multiLayerProtection: boolean
  realTimeMonitoring: boolean
  predictiveAnalytics: boolean
  automatedInterventions: boolean
  manualOverride: boolean
  complianceReporting: boolean
  userCoaching: boolean
  alertManagement: boolean
}

interface RiskGuardConfig {
  protectionLayers: ProtectionLayerConfig[]
  riskProfiles: RiskProfileConfig[]
  interventionRules: InterventionRule[]
  monitoringThresholds: MonitoringThreshold[]
  complianceSettings: ComplianceSettings
}
```

### Dashboard y KPIs de Riesgo

```typescript
interface RiskGuardDashboard {
  overview: RiskOverview
  kpis: RiskKPIs
  alerts: RiskAlertSummary
  interventions: InterventionSummary
  usersByRiskLevel: UserRiskDistribution
  recentViolations: ViolationSummary[]
}

interface RiskOverview {
  totalUsersMonitored: number
  usersAtRisk: number
  activeInterventions: number
  protectionSuccessRate: number
  systemHealth: SystemHealthStatus
}

interface RiskKPIs {
  criticalRiskUsers: RiskKPI
  interventionSuccessRate: RiskKPI
  violationRate: RiskKPI
  averageResponseTime: RiskKPI
  alertAccuracy: RiskKPI
  userRetention: RiskKPI
}

interface RiskKPI {
  currentValue: number
  previousValue: number
  change: number
  trend: 'up' | 'down' | 'stable'
  target?: number
  status: 'good' | 'warning' | 'critical'
}

interface SystemHealthStatus {
  status: 'healthy' | 'degraded' | 'critical'
  uptime: number
  responseTime: number
  errorRate: number
  activeAlerts: number
}

interface UserRiskDistribution {
  low: number
  medium: number
  high: number
  critical: number
  total: number
  percentages: Record<string, number>
}
```

### Análisis Individual de Usuario

```typescript
interface UserRiskAnalysis {
  userId: string
  profile: UserRiskProfile
  currentStatus: RiskStatus
  violationHistory: ViolationRecord[]
  tradingPatterns: TradingPatternAnalysis
  appliedInterventions: AppliedIntervention[]
  riskEvolution: RiskEvolutionData[]
  recommendations: RiskRecommendation[]
}

interface UserRiskProfile {
  riskLevel: 'conservative' | 'moderate' | 'aggressive'
  dailyLossLimit: number
  maxStakePercentage: number
  interventionSensitivity: 'high' | 'medium' | 'low'
  allowedMarkets: string[]
  restrictedHours: TimeRestriction[]
  customRules: CustomRule[]
}

interface RiskStatus {
  currentRiskLevel: 'low' | 'medium' | 'high' | 'critical'
  riskScore: number
  violations24h: number
  interventionsActive: number
  lastIntervention: string
  nextReviewDate: string
}

interface ViolationRecord {
  id: string
  timestamp: string
  violationType: ViolationType
  severity: 'low' | 'medium' | 'high' | 'critical'
  details: ViolationDetails
  interventionApplied: string
  resolution: ViolationResolution
}

interface TradingPatternAnalysis {
  patternType: PatternType
  confidence: number
  frequency: number
  lastOccurrence: string
  riskScore: number
  description: string
  examples: TradingExample[]
}

interface RiskEvolutionData {
  date: string
  riskScore: number
  riskLevel: string
  violations: number
  interventions: number
  tradingVolume: number
  pnl: number
}
```

### Sistema de Alertas y Violaciones

```typescript
interface AlertManagementSystem {
  activeAlerts: RiskAlert[]
  alertHistory: AlertHistory[]
  alertConfiguration: AlertConfig[]
  escalationProcedures: EscalationProcedure[]
  responseMetrics: ResponseMetrics
}

interface RiskAlert {
  id: string
  userId: string
  alertType: AlertType
  severity: 'critical' | 'high' | 'medium' | 'low'
  timestamp: string
  description: string
  details: AlertDetails
  status: 'active' | 'acknowledged' | 'resolved' | 'escalated'
  assignedTo?: string
  responseTime?: number
}

interface AlertDetails {
  violationType?: ViolationType
  riskScore: number
  thresholdExceeded: number
  currentValue: number
  pattern?: PatternType
  recommendations: string[]
  autoActions: string[]
}

interface AlertConfig {
  id: string
  alertType: AlertType
  severity: 'critical' | 'high' | 'medium' | 'low'
  thresholds: AlertThreshold[]
  conditions: AlertCondition[]
  actions: AlertAction[]
  notifications: AlertNotification[]
  enabled: boolean
}

interface EscalationProcedure {
  id: string
  trigger: EscalationTrigger
  levels: EscalationLevel[]
  timeframes: EscalationTimeframe[]
  contacts: EscalationContact[]
  actions: EscalationAction[]
}

interface ResponseMetrics {
  averageResponseTime: number
  resolutionRate: number
  escalationRate: number
  falsePositiveRate: number
  userSatisfaction: number
}
```

### Sistema de Protección Multi-Capas

```typescript
interface MultiLayerProtectionSystem {
  layer1: HardLimitsLayer
  layer2: SoftLimitsLayer  
  layer3: ProactiveCoachingLayer
  orchestration: ProtectionOrchestration
  monitoring: RealTimeMonitoring
}

interface HardLimitsLayer {
  dailyLossLimit: DailyLossConfig
  sessionLimits: SessionLimitConfig
  maxStakeLimits: MaxStakeConfig
  timeRestrictions: TimeRestrictionConfig
  coolingOffPeriods: CoolingOffConfig
}

interface DailyLossConfig {
  percentage: number
  absoluteValue?: number
  resetTime: string
  gracePeriod: number
  escalationSteps: EscalationStep[]
}

interface SoftLimitsLayer {
  approachWarnings: ApproachWarningConfig
  disciplineReminders: DisciplineReminderConfig
  stakeSuggestions: StakeSuggestionConfig
  patternAnalysis: PatternAnalysisConfig
  softInterventions: SoftInterventionConfig
}

interface ProactiveCoachingLayer {
  contextualEducation: EducationConfig
  positiveReinforcement: ReinforcementConfig
  postTradeAnalysis: PostTradeAnalysisConfig
  improvementPlans: ImprovementPlanConfig
  prioritySupport: PrioritySupportConfig
}

interface RealTimeMonitoring {
  userMetrics: UserMetric[]
  systemMetrics: SystemMetric[]
  marketMetrics: MarketMetric[]
  behavioralMetrics: BehavioralMetric[]
  riskIndicators: RiskIndicator[]
}

interface ProtectionOrchestration {
  ruleEngine: RuleEngineConfig
  decisionTree: DecisionNode[]
  prioritySystem: PriorityConfig
  conflictResolution: ConflictResolution
  auditTrail: AuditEntry[]
}
```

### Configuración de Reglas e Intervenciones

```typescript
interface RuleConfiguration {
  defaultRules: DefaultRule[]
  customRules: CustomRule[]
  adaptiveThresholds: AdaptiveThreshold[]
  exceptionRules: ExceptionRule[]
  testingFramework: RuleTestingFramework
}

interface InterventionSystem {
  interventionTypes: InterventionType[]
  interventionRules: InterventionRule[]
  interventionHistory: InterventionHistory[]
  effectivenessMetrics: InterventionMetrics
  manualOverride: ManualOverrideConfig
}

interface InterventionRule {
  id: string
  name: string
  description: string
  trigger: InterventionTrigger
  conditions: RuleCondition[]
  actions: InterventionAction[]
  priority: number
  enabled: boolean
  testingMode: boolean
}

interface InterventionTrigger {
  type: 'metric_threshold' | 'pattern_detection' | 'time_based' | 'manual' | 'composite'
  metric?: string
  threshold?: number
  operator?: '>' | '<' | '>=' | '<=' | '==' | '!='
  pattern?: PatternType
  timeCondition?: TimeCondition
  compositeRules?: CompositeRule[]
}

interface InterventionAction {
  id: string
  type: InterventionActionType
  parameters: Record<string, any>
  execution: 'immediate' | 'delayed' | 'scheduled' | 'manual_confirmation'
  duration?: number
  reversible: boolean
  auditRequired: boolean
}

interface AdaptiveThreshold {
  id: string
  metric: string
  baseValue: number
  adaptationRules: AdaptationRule[]
  learningAlgorithm: LearningAlgorithm
  minValue: number
  maxValue: number
  updateFrequency: number
}

interface RuleTestingFramework {
  testScenarios: TestScenario[]
  simulationEngine: SimulationConfig
  validationRules: ValidationRule[]
  performanceMetrics: TestingMetrics
  rollbackMechanism: RollbackConfig
}
```

### Perfiles de Riesgo y Usuarios

```typescript
interface RiskProfileManagement {
  profiles: RiskProfile[]
  profileAssignments: ProfileAssignment[]
  profileHistory: ProfileHistory[]
  profileRecommendations: ProfileRecommendation[]
  dynamicProfiling: DynamicProfilingConfig
}

interface RiskProfile {
  id: string
  name: string
  description: string
  riskLevel: 'conservative' | 'moderate' | 'aggressive'
  dailyLossLimit: number
  maxStakePercentage: number
  interventionSensitivity: 'high' | 'medium' | 'low'
  allowedMarkets: string[]
  restrictedHours: TimeRestriction[]
  customRules: string[]
  features: ProfileFeature[]
}

interface UserRiskAssessment {
  userId: string
  assessmentDate: string
  riskProfile: RiskProfile
  assessmentMethod: AssessmentMethod
  factors: RiskFactor[]
  score: number
  confidence: number
  recommendations: string[]
  nextAssessmentDate: string
}

interface RiskFactor {
  id: string
  category: RiskFactorCategory
  name: string
  weight: number
  currentValue: number
  riskScore: number
  impact: 'positive' | 'negative' | 'neutral'
  trend: 'improving' | 'worsening' | 'stable'
}

interface DynamicProfilingConfig {
  enabled: boolean
  updateFrequency: number
  learningAlgorithm: string
  factors: DynamicFactor[]
  thresholds: DynamicThreshold[]
  safetyMechanisms: SafetyMechanism[]
}
```

### Compliance y Reportes

```typescript
interface ComplianceManagement {
  regulatoryCompliance: RegulatoryConfig
  dataProtection: DataProtectionConfig
  auditRequirements: AuditConfig
  reporting: ComplianceReporting
  legalFramework: LegalFramework
}

interface RegulatoryConfig {
  jurisdictions: JurisdictionConfig[]
  ageVerification: AgeVerificationConfig
  selfExclusion: SelfExclusionConfig
  responsibleGambling: ResponsibleGamblingConfig
  regulatoryReporting: RegulatoryReportingConfig
}

interface ComplianceReporting {
  dailyReports: DailyReport[]
  weeklyReports: WeeklyReport[]
  monthlyReports: MonthlyReport[]
  incidentReports: IncidentReport[]
  auditReports: AuditReport[]
  customReports: CustomReportConfig[]
}

interface AuditConfig {
  auditTrail: AuditEntry[]
  dataRetention: DataRetentionPolicy
  accessLogs: AccessLog[]
  decisionLogs: DecisionLog[]
  complianceChecks: ComplianceCheck[]
}

// Tipos auxiliares y enums
type ViolationType = 'daily_limit_exceeded' | 'stake_size_violation' | 'pattern_violation' | 'time_violation' | 'martingale_detected' | 'suspicious_hours' | 'consecutive_losses' | 'high_frequency' | 'market_manipulation' | 'account_sharing'
type PatternType = 'martingale' | 'anti_martingale' | 'chasing_losses' | 'overstaking' | 'emotional_trading' | 'copy_trading_risk' | 'arbitrage_abuse' | 'bonus_abuse' | 'multi_accounting'
type AlertType = 'risk_escalation' | 'violation_detected' | 'intervention_triggered' | 'threshold_approach' | 'pattern_detection' | 'compliance_breach' | 'system_anomaly' | 'user_complaint'
type InterventionActionType = 'block_trading' | 'reduce_stake' | 'restrict_markets' | 'require_confirmation' | 'force_cooldown' | 'send_warning' | 'apply_limit' | 'escalate_case' | 'require_review' | 'suspend_account'
type RiskFactorCategory = 'behavioral' | 'financial' | 'temporal' | 'market' | 'social' | 'technical' | 'demographic' | 'historical'
type AssessmentMethod = 'manual' | 'automated' | 'ml_model' | 'composite' | 'expert_system'

## 🔮 Desarrollos Futuros

### Fase 2
- **IA predictiva**: Anticipación a problemas antes de que ocurran
- **Coaching de grupo**: Análisis de comportamiento colectivo
- **Integración biométrica**: Monitoreo de estrés y emociones
- **Gamificación del riesgo**: Sistema de logros por buena gestión
- **Social trading seguro**: Protección en copy trading

### Fase 3
- **Blockchain para transparencia**: Registro inmutable de protecciones
- **Smart contracts**: Ejecución automática de protecciones
- **Realidad aumentada**: Visualización de riesgos en tiempo real
- **Coach de voz**: Alertas y explicaciones por voz
- **Marketplace de protecciones**: Seguros de trading personalizados
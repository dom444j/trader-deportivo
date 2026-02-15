# SUBSCRIPTIONS-ADMIN

## 0. Interfaces Principales del Módulo

```typescript
// Información general del módulo
interface AdminSubscriptionsModule {
  id: 'admin-subscriptions'
  name: 'Admin Subscriptions'
  description: 'Gestión de planes y suscripciones de usuarios'
  route: '/admin/subscriptions'
  accent: 'red'
  permissions: ['admin.subscriptions.read', 'admin.subscriptions.write', 'admin.plans.manage']
}

// Header del módulo
interface AdminSubscriptionsHeader {
  title: 'Gestión de Subscripciones'
  subtitle: 'Planes, suscripciones y control de acceso'
  actions: {
    search: {
      placeholder: 'Buscar por usuario, email o orderId...'
      enabled: true
    }
    filters: {
      enabled: true
      quickFilters: ['active', 'pending', 'expired', 'failed']
    }
    refresh: {
      enabled: true
      interval: 60000 // 60 segundos
    }
    export: {
      enabled: true
      formats: ['csv', 'xlsx', 'pdf']
    }
  }
  statusBadges: {
    financeSyncStatus: 'ok' | 'warning' | 'error'
    jobsStatus: 'running' | 'idle'
  }
}

// Layout del módulo
interface AdminSubscriptionsLayout {
  container: 'full-width'
  maxWidth: '1400px'
  sections: {
    header: {
      sticky: true
      height: '80px'
    }
    dateRange: {
      enabled: true
      defaultPreset: 'last30days'
    }
    content: {
      type: 'tabs-with-table'
      padding: '24px'
    }
    drawer: {
      enabled: true
      width: '600px'
      responsiveWidth: '100%'
    }
  }
}

// KPIs principales
interface SubscriptionsKPIs {
  activeSubscriptions: ActiveSubscriptionsKPI
  mrr: MRRKPI
  churn: ChurnKPI
  conversions: ConversionsKPI
  paymentFailures: PaymentFailuresKPI
}

interface ActiveSubscriptionsKPI {
  label: 'Suscripciones Activas'
  value: number
  trend: 'up' | 'down' | 'neutral'
  change: number // porcentaje
  icon: 'users'
}

interface MRRKPI {
  label: 'MRR'
  value: number // en dólares
  trend: 'up' | 'down' | 'neutral'
  change: number // porcentaje
  icon: 'dollar-sign'
}

interface ChurnKPI {
  label: 'Churn (30d)'
  value: number // porcentaje
  trend: 'up' | 'down' | 'neutral'
  change: number // puntos porcentuales
  icon: 'user-minus'
  severity: 'low' | 'medium' | 'high'
}

interface ConversionsKPI {
  label: 'Conversiones'
  value: number
  trend: 'up' | 'down' | 'neutral'
  change: number // porcentaje
  icon: 'trending-up'
}

interface PaymentFailuresKPI {
  label: 'Fallos de Pago'
  value: number
  trend: 'up' | 'down' | 'neutral'
  change: number // porcentaje
  icon: 'credit-card'
  severity: 'low' | 'medium' | 'high'
}

Definición

Suscripción = licencia/plan que habilita módulos (señales, tipsters, surebets, baccarat) y define límites de uso. No es “crédito”. Puede incluir créditos como beneficio, pero suscripción y créditos son sistemas separados.

Objetivo del módulo (qué controla el admin)

- Diseñar, publicar y versionar planes (ServicePlan)
- Activar/cancelar/expirar/renovar suscripciones de usuarios (UserSubscription)
- Gestionar upgrades/downgrades y extensiones
- Monitorear pagos y activaciones; reconciliar con Finance
- Configurar límites por plan y políticas de renovación
- Registrar auditoría de cambios y eventos

Entidades

- ServicePlan (planes)
  - id, nombre, estado (draft/active/archived)
  - precio, periodo de facturación (mensual/anual), trial si aplica
  - features habilitados (señales, tipsters, surebets, baccarat)
  - límites (requests/día, slots, topes por feature)
  - beneficios de créditos (monto, frecuencia) si existen
  - referralCommission (porcentaje/monto, condiciones)

- UserSubscription (suscripción del usuario)
  - id, userId, planId, status (pending/active/expired/canceled)
  - startDate, endDate, renewMode (manual/auto), origin/source
  - paymentStatus (pending/confirmed/failed), invoiceId/orderId
  - audit: creadoPor, modificadoPor, timestamps

- WalletAssignment (si aplica)
  - userId, walletId, relación con el plan/beneficio

- ReferralCommission / ReferralPayout
  - referralId/affiliateId, subscriptionId
  - commissionAmount, status (accrued/approved/paid), payoutId

- CreditTransaction (si el plan otorga créditos)
  - type (grant/adjust), source (subscriptionBenefit)
  - amount, idempotencyKey, balanceImpact, timestamps

Estados y lifecycle

- pending → active → expired/canceled
- upgrade/downgrade: cambio de plan con fecha efectiva; conserva historial
- renew: manual/auto según renewMode; intenta antes de endDate
- prorrateo: por defecto NO hay prorrateo (claramente explícito). Si se habilita, debe configurarse y auditarse (pro-rata sobre días restantes).

Reglas de negocio

- Activación sólo con pago confirmado (Finance: order completed)
- Límites por plan aplican únicamente estando active; al cambiar plan se recalculan límites
- Al expirar: revocar acceso a módulos, conservar historial (logs, pagos, comisiones). Créditos otorgados por beneficio no se revocan retroactivamente; futuros beneficios se detienen
- Cancelación inmediata o al final del ciclo según política; siempre auditar

Tabs UI Admin (para futuro HTML)

```typescript
interface SubscriptionsTabs {
  overview: OverviewTab
  plans: PlansTab
  subscriptions: SubscriptionsTab
  payments: PaymentsTab
  adjustments: AdjustmentsTab
  config: ConfigTab
}

interface OverviewTab {
  kpis: SubscriptionsKPIs
  charts: {
    mrrOverTime: ChartConfig
    subscriptionsOverTime: ChartConfig
    churnAnalysis: ChartConfig
  }
  recentActivity: {
    data: ActivityItem[]
    loading: boolean
  }
}

interface PlansTab {
  table: PlansTable
  actions: {
    create: () => void
    edit: (plan: ServicePlan) => void
    archive: (plan: ServicePlan) => void
  }
}

interface PlansTable {
  columns: Array<{
    key: string
    label: string
    sortable: boolean
    width?: string
  }>
  data: ServicePlan[]
  pagination: PaginationConfig
  loading: boolean
  emptyState: {
    message: string
    description: string
    action?: {
      label: string
      onClick: () => void
    }
  }
}

interface SubscriptionsTab {
  table: SubscriptionsTable
  filters: SubscriptionsFilters
  bulkActions: BulkActionConfig
}

interface SubscriptionsTable {
  columns: Array<{
    key: string
    label: string
    sortable: boolean
    width?: string
    formatter?: (value: any) => string
  }>
  data: UserSubscription[]
  pagination: PaginationConfig
  loading: boolean
  rowActions: Array<{
    label: string
    action: string
    icon?: string
    danger?: boolean
  }>
}

interface PaymentsTab {
  table: PaymentsTable
  reconcileActions: {
    reconcile: (payment: PaymentRecord) => void
    bulkReconcile: (payments: PaymentRecord[]) => void
  }
}

interface PaymentsTable {
  columns: Array<{
    key: string
    label: string
    sortable: boolean
  }>
  data: PaymentRecord[]
  syncStatus: {
    total: number
    synced: number
    pending: number
    failed: number
  }
}

- Overview (KPIs): suscripciones activas, MRR, churn, conversiones, fallas de pago
- Plans (CRUD planes): crear/editar/publicar/archivar; vista de límites y features
- Subscriptions: lista + filtros + acciones (activar/cancelar/extender/renovar)
- Activations/Payments: confirmadas, fallidas, pendientes; reintentos
- Upgrades & Adjustments: cambios de plan, extensiones, correcciones; todo auditado
- Configuration: parámetros globales (renovación, prorrateo, límites por defecto)
- User Detail Drawer: resumen histórico de suscripciones, timeline de cambios de plan, estado de auto-renew, último intento de pago

Filtros estándar

```typescript
interface SubscriptionsFilters {
  // Usuario y plan
  userId: {
    label: 'Usuario'
    type: 'text'
    placeholder: 'ID de usuario...'
  }
  planId: {
    label: 'Plan'
    type: 'select'
    options: ServicePlan[]
    placeholder: 'Seleccionar plan...'
  }
  
  // Estado
  status: {
    label: 'Estado'
    type: 'checkbox-group'
    options: ['pending', 'active', 'expired', 'canceled', 'failed']
    defaultValue: ['active']
  }
  paymentStatus: {
    label: 'Estado de Pago'
    type: 'checkbox-group'
    options: ['pending', 'confirmed', 'failed', 'refunded']
    defaultValue: []
  }
  
  // Fechas
  dateFrom: {
    label: 'Desde'
    type: 'date'
  }
  dateTo: {
    label: 'Hasta'
    type: 'date'
  }
  
  // Origen
  source: {
    label: 'Origen'
    type: 'multiselect'
    options: ['web', 'app', 'api', 'admin', 'tipster']
    defaultValue: []
  }
  
  // Tipster (si aplica)
  tipsterId: {
    label: 'Tipster'
    type: 'select'
    options: AdminTipster[]
    placeholder: 'Seleccionar tipster...'
  }
  
  // Búsqueda
  search: {
    label: 'Búsqueda'
    type: 'text'
    placeholder: 'Usuario, email o orderId...'
  }
}

userId, planId, status, dateFrom/dateTo, paymentStatus, source, tipsterId

Endpoints Admin (documentar)

- GET /admin/subscriptions/overview: KPIs y métricas
- CRUD /admin/plans: crear, listar, obtener, actualizar, archivar
- GET /admin/subscriptions: listar + filtros estándar (incluye tipsterId)
- GET /admin/subscriptions/tipsters-usage: métricas de consumo por tipster/usuario
- POST /admin/subscriptions/feature-adjust: ajustes de límites por feature (auditado)
- POST /admin/subscriptions/activate: activar por pago confirmado
- POST /admin/subscriptions/cancel: cancelación inmediata/programada
- POST /admin/subscriptions/cancel-by-risk-guard: cancelación automática por estado LOCKED o suspensión
- POST /admin/subscriptions/extend: extender endDate
- POST /admin/subscriptions/upgrade: cambio de plan (sin prorrateo por defecto)
- POST /admin/subscriptions/downgrade: cambio a plan inferior
- POST /admin/subscriptions/reconcile: re-sync payment / reconcile con Finance

Auditoría

- Todo cambio admin genera log: quién, qué, antes/después, motivo
- Logs inmutables; visibles en la UI y exportables
- Eventos clave: creación/edición de plan, activación, cancelación, expiración, upgrade/downgrade, reconciliación

Integraciones

- Finance → Subscriptions: evento "order completed" activa suscripción; fallas cancelan o marcan pending
- Credits: si el plan incluye créditos, crear CreditTransaction grant al activar y según frecuencia
- Referrals: si el plan paga comisión, generar ReferralCommission/ReferralPayout al activar

Edge cases

- Pago duplicado: idempotencia por idempotencyKey/orderId; un sólo activate
- Expiración con renovación: si auto-renew falla, marcar failed y notificar; si confirma, extender endDate
- Rollback si falla activación: revertir beneficios (créditos/comisiones) y dejar en pending
- Usuario bloqueado: impedir activación/renovación; permitir cancelación y auditoría

Formato

- Documento claro, sin ambigüedades, alineado a CREDITS-ADMIN.md en estilo y profundidad. Sin código, centrado en definiciones, reglas, flujos y endpoints.

Sección: Planes por Tipster (scope)

- Relación Plan ↔ Tipster (si aplica)
- scope: global | tipster
- tipsterId: nullable (requerido si scope=tipster)
- Métricas por tipster: suscriptores activos, churn por tipster, ingresos por tipster
- Reglas: planes con scope=tipster sólo habilitan features/tipsters asociados; visibilidad controlada por plan

Sección: Revenue Share Model (Tipster y Referidos)

- TipsterCommission: % configurable por plan (scope=tipster) sobre el ingreso de la suscripción
- Payout schedule: inmediato (por activación) o mensual (accrual → payout)
- Estados: accrued → approved → paid; idempotencia en payoutId
- Convivencia con ReferralCommission: ambos pueden coexistir; se registran como flujos separados
- Auditoría: registrar porcentaje aplicado, base de cálculo y beneficiario (tipsterId / referralId)

Sección: Feature Gating Contract (técnico)

- signals.prematch.enabled: boolean por plan
- signals.live.enabled: boolean por plan
- tipsters.follow.limit: entero máximo de tipsters que puede seguir el usuario
- surebets.enabled: boolean por plan
- baccarat.enabled: boolean por plan
- Validación backend: toda solicitud que consuma estas features debe verificar el gating del plan activo del usuario
- Cambios de plan: recalcular y aplicar límites inmediatamente; registrar en auditoría

Sección: Métricas financieras (definiciones)

- MRR: suma del ingreso mensualizado de suscripciones activas (normalizar planes anuales a valor mensual)
- Churn (mensual): (# de suscripciones activas al inicio del mes que cancelan/expiran durante el mes) / (# activas al inicio del mes)
- ARPU: (Ingresos de suscripciones en período) / (Nº de usuarios con suscripción activa en el período)
- LTV (aproximado): ARPU / churn_rate, opcionalmente multiplicado por margen bruto
- Reportes: las fórmulas deben reflejarse en Overview

Edge cases adicionales

- Cancelación automática por Risk Guard: cuando user.status=LOCKED, cancelar o impedir renovación; auditar
- Tipster suspendido: suspender acceso a contenido asociado; cancelar suscripciones scope=tipster según política (inmediata o fin de ciclo)
- Plan archivado: impedir nuevas activaciones y renovaciones; suscripciones activas pueden continuar hasta fin de ciclo o cancelarse según configuración


Sección: UI States y Persistencia por URL (Query Params)

- Estados UI obligatorios por tab: Loading, Empty, Error, Partial
  - Tabla (Subscriptions):
    - Loading: skeleton rows + spinner
    - Empty: placeholder con mensaje "No hay suscripciones" + CTA crear/filtrar
    - Error: banner con detalle y acción "Reintentar"
    - Partial: KPIs cargados, tabla con datos parciales, aviso de sincronización
  - KPIs (Overview):
    - Loading: skeleton cards
    - Empty: valores en 0 con descripción
    - Error: badge de error por métrica y acción reintentar
    - Partial: métricas disponibles + badge "datos incompletos"
- Persistencia por URL (deep-linking, shareable):
  - tab={overview|plans|subscriptions|activations|adjustments|config}
  - page, limit, sort, order
  - filtros en query params: userId, planId, status, dateFrom, dateTo, paymentStatus, source, tipsterId
  - Drawer abierto:
    - subscriptionId={id} (abre detalle de suscripción)
    - userId={id}&drawer=1 (abre drawer de usuario con resumen/timeline/auto-renew/intento de pago)

- Acciones y políticas:
  - activate: Rol=Admin/FinanceAdmin, Risk=HIGH, requiere motivo, doble confirmación (modal), log obligatorio
  - upgrade: Rol=Admin/FinanceAdmin, Risk=HIGH, requiere motivo, doble confirmación, log obligatorio
  - downgrade: Rol=Admin/FinanceAdmin, Risk=HIGH, requiere motivo, doble confirmación, log obligatorio
  - feature-adjust: Rol=Admin, Risk=HIGH, requiere motivo, doble confirmación, log obligatorio
  - cancel-by-risk-guard: Rol=System/Risk, Risk=HIGH, requiere motivo (sistema), doble confirmación no aplica, log obligatorio
  - cancel (manual): Rol=Admin/Support, Risk=MEDIUM, requiere motivo, confirmación simple, log obligatorio
  - extend: Rol=Admin, Risk=MEDIUM, requiere motivo, confirmación simple, log obligatorio
  - plans CRUD: create/update/archive → Rol=Admin, Risk=MEDIUM, requiere motivo, confirmación simple, log obligatorio
  - list/get overview: Rol=Admin/FinanceAdmin/Support/ReadOnly, Risk=LOW, sin motivo, log opcional

- Header estándar: Idempotency-Key (obligatorio en endpoints que mutan estado)
- Claves únicas sugeridas:
  - UserSubscription(orderId) → UNIQUE cuando la activación viene de Finance
  - ReferralPayout(payoutId) → UNIQUE
  - TipsterCommission(payoutId) → UNIQUE
- Comportamiento esperado ante repetición:
  - Devolver resultado anterior (HTTP 200/201 con recurso existente), sin duplicar efectos secundarios (beneficios, pagos, logs)
- Anti doble activación (activate):
  - Verificar status actual (si active, ignorar repetición)
  - Aplicar idempotencia por Idempotency-Key u orderId
  - Auditar intento duplicado con motivo "duplicate-activation"

- Acciones y políticas:
  - activate: Rol=Admin/FinanceAdmin, Risk=HIGH, requiere motivo, doble confirmación (modal), log obligatorio
  - upgrade: Rol=Admin/FinanceAdmin, Risk=HIGH, requiere motivo, doble confirmación, log obligatorio
  - downgrade: Rol=Admin/FinanceAdmin, Risk=HIGH, requiere motivo, doble confirmación, log obligatorio
  - feature-adjust: Rol=Admin, Risk=HIGH, requiere motivo, doble confirmación, log obligatorio
  - cancel-by-risk-guard: Rol=System/Risk, Risk=HIGH, requiere motivo (sistema), doble confirmación no aplica, log obligatorio
  - cancel (manual): Rol=Admin/Support, Risk=MEDIUM, requiere motivo, confirmación simple, log obligatorio
  - extend: Rol=Admin, Risk=MEDIUM, requiere motivo, confirmación simple, log obligatorio
  - plans CRUD: create/update/archive → Rol=Admin, Risk=MEDIUM, requiere motivo, confirmación simple, log obligatorio
  - list/get overview: Rol=Admin/FinanceAdmin/Support/ReadOnly, Risk=LOW, sin motivo, log opcional

- Flujo de Reconcile con Finance (paso a paso)

## 11. Tipos Auxiliares y Enums

```typescript
// Tipos de estado de suscripción
type SubscriptionStatus = 'pending' | 'active' | 'expired' | 'canceled' | 'failed'
type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded'
type PlanStatus = 'draft' | 'active' | 'archived'
type PlanScope = 'global' | 'tipster'
type RenewalMode = 'manual' | 'auto'
type SubscriptionSource = 'web' | 'app' | 'api' | 'admin' | 'tipster'

// Entidad ServicePlan
interface ServicePlan {
  id: string
  name: string
  description: string
  status: PlanStatus
  scope: PlanScope
  tipsterId?: string // solo si scope = 'tipster'
  price: number
  currency: string
  billingPeriod: 'monthly' | 'annual'
  trialDays?: number
  features: PlanFeatures
  limits: PlanLimits
  creditBenefits?: CreditBenefits
  referralCommission?: ReferralCommissionConfig
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy?: string
}

interface PlanFeatures {
  signals: {
    prematch: boolean
    live: boolean
  }
  tipsters: {
    enabled: boolean
    followLimit: number
  }
  surebets: {
    enabled: boolean
  }
  baccarat: {
    enabled: boolean
  }
}

interface PlanLimits {
  requestsPerDay: number
  maxSlots: number
  // límites específicos por feature
}

interface CreditBenefits {
  amount: number
  frequency: 'once' | 'monthly' | 'quarterly'
  currency: string
}

interface ReferralCommissionConfig {
  percentage?: number
  fixedAmount?: number
  currency?: string
  conditions: string
}

// Entidad UserSubscription
interface UserSubscription {
  id: string
  userId: string
  user: {
    id: string
    name: string
    email: string
  }
  planId: string
  plan: ServicePlan
  status: SubscriptionStatus
  startDate: string
  endDate: string
  renewMode: RenewalMode
  source: SubscriptionSource
  paymentStatus: PaymentStatus
  orderId?: string
  invoiceId?: string
  autoRenew: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy?: string
}

// Entidad PaymentRecord
interface PaymentRecord {
  id: string
  orderId: string
  invoiceId: string
  userId: string
  amount: number
  currency: string
  financeStatus: string
  subscriptionStatus: SubscriptionStatus
  createdAt: string
  reconciled: boolean
  lastReconcileAttempt?: string
}

// Entidad ReferralCommission
interface ReferralCommission {
  id: string
  referralId: string
  subscriptionId: string
  commissionAmount: number
  currency: string
  status: 'accrued' | 'approved' | 'paid'
  payoutId?: string
  createdAt: string
  approvedAt?: string
  paidAt?: string
}

// Entidad TipsterCommission
interface TipsterCommission {
  id: string
  tipsterId: string
  subscriptionId: string
  commissionAmount: number
  currency: string
  percentage: number
  status: 'accrued' | 'approved' | 'paid'
  payoutId?: string
  createdAt: string
  approvedAt?: string
  paidAt?: string
}

// Entidad CreditTransaction
interface CreditTransaction {
  id: string
  userId: string
  type: 'grant' | 'adjust'
  source: 'subscription_benefit'
  amount: number
  currency: string
  balanceImpact: number
  idempotencyKey: string
  subscriptionId?: string
  createdAt: string
  createdBy: string
}

// Configuración global
interface SubscriptionsConfig {
  autoRenew: {
    enabled: boolean
    retryAttempts: number
    retryDelayHours: number[]
  }
  prorating: {
    enabled: boolean
    defaultBehavior: 'no_prorating' | 'prorating'
  }
  limits: {
    resetTime: 'utc_midnight' | 'rolling_24h'
    enforcement: 'strict' | 'warning'
  }
}

// Métricas financieras
interface FinancialMetrics {
  mrr: number
  arpu: number
  churnRate: number
  ltv: number
  totalRevenue: number
  newSubscriptions: number
  canceledSubscriptions: number
}

// Configuración de UI
interface UIConfig {
  dateRangePresets: Array<{
    label: string
    value: string
    days: number
  }>
  tablePageSizes: number[]
  defaultPageSize: number
  refreshInterval: number
}

- Objetivo: reconciliar diferencias entre estados Finance y Subscriptions
- Estados detectados:
  - Finance=completed vs subscription=pending → activar
  - Finance=failed vs subscription=pending → marcar failed
  - Finance=completed pero invoiceId/orderId inconsistente → corregir referencia
  - Finance=refunded/void → evaluar rollback si beneficios ya aplicados
- Acciones de reconcile:
  1) Obtener orden Finance por orderId/invoiceId
  2) Validar estado Finance y comparar con UserSubscription
  3) Si completed y pending → activar suscripción y disparar beneficios (CreditTransaction, Referral/Tipster Commission)
  4) Si failed y pending → marcar failed (no activar)
  5) Si referencias incorrectas → corregir invoiceId/orderId
  6) Si refund/void con beneficios aplicados → disparar rollback de beneficios según política
- Auditoría:
  - Registrar antes/después, motivo "reconcile", origen "system/admin", referencias de Finance (orderId/invoiceId)

- Definición de Limits Usage (medición de consumo)

- Métricas por feature:
  - signals: requests/día o slots consumidos; separar prematch/live si aplica
  - tipsters: follow.limit (máximo tipsters seguidos) + conteo actual de followings
  - surebets: requests/día, sesiones activas
  - baccarat: requests/día, sesiones activas
- Registro de consumo:
  - Contador diario por usuario y feature; event log para operaciones relevantes
  - Reset: por defecto en día UTC (00:00 UTC); opcional modo rolling 24h configurable
  - Visualización: endpoint de usage y métricas en Overview/Tipsters-Usage
- Enforcement:
  - Backend valida contra límites del plan activo; si supera, devuelve error con código específico y recomendación de upgrade

- Jobs Programados (Renovación/Expiración)

- Job de expiración (cron):
  - Frecuencia: diario (p.ej. 00:10 UTC)
  - Acción: marcar suscripciones que superaron endDate como expired; revocar acceso; generar logs
  - Seguridad: idempotente, reintentable
- Job de auto-renew:
  - Ventana: N horas antes de endDate (configurable)
  - Reintentos: política de backoff (p.ej. 3 intentos: 0h, 6h, 24h)
  - Estados: si pago confirmado → extender endDate; si falla → marcar failed y notificar
- Notificaciones (placeholder):
  - "renew failed", "expiring soon" (para usuario/admin)

- Export / Reports

- Export (Overview/Subscriptions): CSV/JSON (placeholder con filtros aplicados)
- Reportes:
  - Por plan: altas, bajas, MRR, ARPU, churn
  - Por tipster: suscriptores activos, churn, revenue share
  - Cohortes: retención por mes de alta
  - Revenue share: totales por TipsterCommission/ReferralCommission


Sección: Wireframe (estructura de página)

- Header (superior):
  - Título: "Subscriptions Admin"
  - Subtítulo: breve descripción del módulo
  - Badges de estado: financeSyncStatus (ok/warning/error), jobsStatus (renew/expire: running/idle)
  - Selector de rango de fechas: dateFrom/dateTo (aplica a Overview, Payments, Adjustments)
- Top controls (debajo del header):
  - Search (usuario/email/orderId)
  - Filtros rápidos: status, paymentStatus, source, tipsterId
  - Botones: Export, Refresh
- Tabs bar:
  - Overview | Plans | Subscriptions | Payments | Adjustments | Config
- Content container:
  - max-width consistente, padding uniforme, sin overflow horizontal
- Drawer (derecha) + overlay:
  - Detalle de suscripción / detalle de usuario
  - Apertura por query param (subscriptionId / userId&drawer=1)
  - Cierre por botón y tecla Escape

Sección: Tablas exactas por tab (columnas mínimas)

- Plans (tabla):
  - Plan | Scope (global/tipster) | Precio | Periodo | Estado | Features (chips) | Límites (resumen) | Últ. actualización | Acción
- Subscriptions (tabla):
  - Usuario | Plan | Status | PaymentStatus | Auto-renew | Start | End | Source | Tipster (si aplica) | Acciones
- Activations/Payments (tabla):
  - OrderId/InvoiceId | Usuario | Monto | Estado Finance | Estado Subscripción | Fecha | Acción (reconcile/activate)
- Upgrades & Adjustments (tabla):
  - Fecha | Usuario | Acción | Plan anterior → nuevo | Motivo | Admin | Resultado

Sección: Modales críticos (campos + validaciones)

- Activate:

```typescript
interface ActivateModal {
  // Información de la orden
  order: {
    orderId: string
    invoiceId: string
    amount: number
    currency: string
    status: string
    user: {
      id: string
      name: string
      email: string
    }
  }
  
  // Campos del formulario
  form: {
    confirm: {
      label: string
      required: true
      type: 'checkbox'
    }
    reason: {
      label: string
      required: true
      placeholder: string
      maxLength: number
    }
  }
  
  // Acciones
  actions: {
    activate: {
      label: string
      loading: boolean
      disabled: boolean // requiere checkbox
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
    canActivate: boolean // checkbox marcado
  }
}

interface CancelModal {
  // Información de la suscripción
  subscription: {
    id: string
    user: {
      name: string
      email: string
    }
    plan: {
      name: string
      price: number
    }
    currentEndDate: string
  }
  
  // Campos del formulario
  form: {
    type: {
      label: string
      type: 'radio'
      options: [
        { value: 'immediate', label: 'Inmediata' },
        { value: 'endOfCycle', label: 'Fin de ciclo' }
      ]
      defaultValue: 'endOfCycle'
    }
    reason: {
      label: string
      required: true
      placeholder: string
      maxLength: number
    }
  }
  
  // Acciones
  actions: {
    cancel: {
      label: string
      loading: boolean
      disabled: boolean
    }
    cancelEndOfCycle: {
      label: string
      loading: boolean
      disabled: boolean
    }
  }
  
  // Estado
  state: {
    isOpen: boolean
    isSubmitting: boolean
    errors: Record<string, string>
    effectiveDate: string // calculado según tipo
  }
}

interface ExtendModal {
  // Información de la suscripción
  subscription: {
    id: string
    user: {
      name: string
    }
    plan: {
      name: string
    }
    currentEndDate: string
  }
  
  // Campos del formulario
  form: {
    extensionType: {
      label: string
      type: 'radio'
      options: [
        { value: 'days', label: 'Días' },
        { value: 'date', label: 'Fecha específica' }
      ]
      defaultValue: 'days'
    }
    days: {
      label: string
      type: 'number'
      min: 1
      max: 365
      visibleWhen: 'extensionType === "days"'
    }
    newEndDate: {
      label: string
      type: 'date'
      min: string // currentEndDate + 1 día
      visibleWhen: 'extensionType === "date"'
    }
    reason: {
      label: string
      required: true
      placeholder: string
      maxLength: number
    }
  }
  
  // Vista previa
  preview: {
    currentEndDate: string
    newEndDate: string
    extensionDays: number
  }
  
  // Acciones
  actions: {
    extend: {
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
  - Campos: orderId (readonly), invoiceId (readonly), confirmar (checkbox), motivo (texto obligatorio)
  - Validaciones: motivo requerido; si falta orderId/invoiceId, bloquear; incluir Idempotency-Key en request
- Cancel:
  - Campos: tipo (inmediata | fin de ciclo), motivo (obligatorio)
  - Validaciones: motivo requerido; si fin de ciclo, calcular fecha efectiva; auditar
- Extend:
  - Campos: días a extender o nueva endDate; motivo
  - Validaciones: endDate nueva > endDate actual; motivo requerido
- Upgrade/Downgrade:
  - Campos: plan destino (selector), fecha efectiva, motivo
  - Validaciones: plan destino distinto al actual; fecha efectiva ≥ hoy; motivo requerido; sin prorrateo por defecto
- Feature-adjust:
  - Campos: featureKey (selector), nuevo límite (numérico), motivo
  - Validaciones: featureKey válido según Feature Gating Contract; límite ≥ 0; motivo requerido
- Reconcile:
  - Campos: orderId/invoiceId; preview del diff (estado Finance vs Subscripción)
  - Validaciones: confirmar cambios; auditar antes/después; aplicar idempotencia

Sección: Contrato del Drawer (tabs y secciones)

- Drawer Header:
  - Usuario (avatar/nombre/email) + Plan actual
  - Chips de estado: status (pending/active/expired/canceled), paymentStatus, auto-renew ON/OFF
- Tabs del drawer:
  - Overview: estado, fechas (start/end), renewMode, fuente (source)
  - Timeline: eventos de cambio de plan, activaciones, cancelaciones, intentos de renovación
  - Payments: último intento y historial (orderId, invoiceId, monto, estado)
  - Limits/Usage: consumo actual vs límite por feature (signals, tipsters follow, surebets, baccarat)
  - Audit: eventos relacionados (quién, qué, antes/después, motivo)

Sección: Datos placeholder (para maquetar)

- Overview KPIs (ejemplo):
  - Suscripciones activas: 124
  - MRR: $3,450
  - Churn (30d): 3.2%
- Subscriptions (3 filas ejemplo):
  - (1) Usuario: Ana R. | Plan: Pro | Status: active | PaymentStatus: confirmed | Auto-renew: ON | Start: 2026-01-12 | End: 2026-02-12 | Source: web | Tipster: —
  - (2) Usuario: Bruno S. | Plan: Tipster Gold | Status: pending | PaymentStatus: pending | Auto-renew: OFF | Start: 2026-02-01 | End: 2026-03-01 | Source: app | Tipster: #T-984
  - (3) Usuario: Carla M. | Plan: Starter | Status: expired | PaymentStatus: failed | Auto-renew: OFF | Start: 2025-12-01 | End: 2026-01-01 | Source: web | Tipster: —
- Plans (3 filas ejemplo):
  - Starter | global | $9 | mensual | active | [signals] | req/día: 50 | 2026-02-10 | Editar
  - Pro | global | $19 | mensual | active | [signals, surebets] | req/día: 200 | 2026-02-11 | Editar
  - Tipster Gold | tipster | $29 | mensual | draft | [tipsters] | follow.limit: 10 | 2026-02-12 | Publicar
- Partial state (ejemplo):
  - Finance desincronizado: 2 órdenes completadas sin activar; badge warning y CTA "Reconcile"

Sección: Selectores/IDs (convenciones para JS)

- Tabs principales:
  - .main-tab[data-tab="overview"], .main-tab[data-tab="plans"], .main-tab[data-tab="subscriptions"], .main-tab[data-tab="payments"], .main-tab[data-tab="adjustments"], .main-tab[data-tab="config"]
  - IDs de contenedor: #tab-overview, #tab-plans, #tab-subscriptions, #tab-payments, #tab-adjustments, #tab-config
- Tablas:
  - #plansTable, #subscriptionsTable, #paymentsTable, #adjustmentsTable
- Drawer y overlays:
  - #drawer, #drawerOverlay, #modalOverlay
- Convención de prefijo:
  - startsWith(tabName) para componentes y listeners (ej.: overviewKpiCard, subscriptionsActionsBar)

Sección: Layout anti-desborde (reglas de ancho)

- Contenedor central:
  - max-width: 1280–1400px; padding: 24px; centrado; sin overflow horizontal
- Tablas:
  - .table-container { overflow-x: auto }
  - Evitar min-width exagerado en columnas; usar truncado con tooltip para textos largos
- Drawer:
  - Ancho fijo: 600–720px; responsive en mobile (100% ancho)
  - Overlay bloquea scroll del fondo

Tabs oficiales (canon): overview | plans | subscriptions | payments | adjustments | config
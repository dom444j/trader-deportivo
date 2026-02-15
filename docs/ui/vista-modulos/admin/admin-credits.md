# Créditos (Admin)

1️⃣ DEFINICIÓN CLARA (OBLIGATORIO)

- Los Créditos son saldo interno virtual del sistema.
- Se usan para: comprar señales, comprar predicciones de tipsters, acceder a features premium y comprar participaciones internas.
- No son transferibles entre usuarios, no se retiran y no representan dinero fiat directo.
- No viven en blockchain ni en proveedor externo; su contabilidad es estrictamente interna y auditable.
- Créditos ≠ Wallet real ≠ USDT.

2️⃣ RELACIÓN CON OTROS MÓDULOS

- Users: visualización y gestión del balance de créditos por usuario (asignados, gastados, comprados, ajustes). Integración con el drawer "Créditos" de Users.
- Tipsters: venta de predicciones y contenidos premium mediante créditos, sin mezclar con USDT real.
- Signals: gating de acceso premium por créditos (validación de saldo y registro de gasto en el ledger interno).
- Subscriptions: planes que incluyen créditos promocionales/bono y/o asignaciones periódicas.
- Finance: si hubo compra de créditos vía depósito/orden, se registra la compra en Finance (USDT/fiat) y la conversión a créditos en el módulo de Créditos. No duplicar lógica financiera real ni mezclar saldos: una vez convertidos, los créditos no afectan el Wallet USDT.

3️⃣ ESTRUCTURA DEL MÓDULO (ADMIN UI)

Tabs obligatorios:

1. Overview
   - KPIs: total créditos en circulación, créditos asignados manualmente, créditos vendidos, créditos gastados hoy, créditos por vencer (si aplica).
   - Rankings: top compradores, top gastadores.
   - Tendencias: evolución diaria/semanal de ventas y de gasto.

2. Transactions (Ledger interno)
   - Tabla completa con columnas: Timestamp, User, Type (purchase/spend/admin_assign/refund/expiration/adjustment), Amount, Balance Before, Balance After, Reference (signalId/predictionId/orderId), Admin (si aplica), Status.
   - Filtros: userId, type, dateFrom/dateTo, minAmount/maxAmount, status.
   - Ordenación y paginación: sort, order, page, limit.

3. User Credits
   - Vista por usuario: créditos actuales, créditos gastados históricos, créditos comprados, créditos asignados manualmente, historial completo.
   - Acciones: ➕ Asignar créditos manualmente, ➖ Quitar créditos, 🔄 Ajuste contable.
   - Cada acción debe generar log en Auditoría (adminId, motivo, dif, timestamp).

4. Credit Packs (Opcional recomendado)
   - Configurar paquetes: p.ej. 10 créditos = $10, 50 créditos = $45, 100 créditos = $80.
   - Campos: nombre, cantidad de créditos, precio, activo/inactivo, bonus %.

5. Configuración
   - ¿Los créditos expiran? (true/false) y días de expiración.
   - ¿Permitir saldo negativo? (default false) y límite máximo por usuario.
   - Conversión credits → USD (informativo, no operativo).

4️⃣ REGLAS DE NEGOCIO (CRÍTICO)

Compra de créditos (purchase)
- Cuando un usuario compra créditos (vía depósito/orden):
  - Se genera CreditTransaction con type = purchase.
  - Se incrementa el balance del usuario (balance_after = balance_before + amount).
  - Se guarda referencia del depósito/orden (reference_type = pack/subscription/order, reference_id).
  - Estado: completed (o pending si la orden aún no liquida en Finance; al completar se ejecuta la conversión a créditos).

Uso de créditos (spend)
- Al comprar una señal/predicción/feature:
  - Validar balance >= costo.
  - Crear CreditTransaction type = spend.
  - Restar balance (balance_after = balance_before − amount).
  - Asociar reference_type (signal/prediction/feature) y reference_id.
  - Estado: completed.

Ajuste manual admin (admin_assign / adjustment)
- Asignación o ajuste contable:
  - type = admin_assign (alta directa) o adjustment (corrección).
  - Guardar admin_id y motivo obligatorio en metadata.
  - Actualizar balance acorde (suma/resta) y reflejar en Auditoría.

Refund (refund)
- Devolver créditos por transacción previa:
  - type = refund.
  - Asociar a la transacción original (reference_id + metadata con relación).
  - Ajustar balance (balance_after = balance_before + amount) y marcar status.

Expiración (expiration)
- Si expiran: generar CreditTransaction type = expiration, restar el monto vencido y dejar rastro auditable.

5️⃣ MODELO DE DATOS (DOCUMENTAR)

Entidad: CreditTransaction
- Campos:
  - id
  - user_id
  - type (purchase/spend/admin_assign/refund/expiration/adjustment)
  - amount (número entero/decimal según política de créditos)
  - balance_before
  - balance_after
  - reference_type (signal/prediction/admin/pack/subscription/order/feature)
  - reference_id
  - status (pending/completed/failed/canceled)
  - admin_id (nullable)
  - metadata (JSON: motivo, notas, relaciones, origen)
  - created_at
- Índices:
  - user_id, type, created_at, reference_id

6️⃣ QUERY PARAMS (Consistencia Finance)

Soporta:
- tab
- userId
- type
- dateFrom
- dateTo
- page
- limit
- sort (p.ej. created_at, amount)
- order (asc/desc)

Ejemplos:
- /admin/credits?tab=transactions&type=spend&dateFrom=2026-02-01&dateTo=2026-02-12&page=1&limit=50&sort=created_at&order=desc
- /admin/credits?tab=userCredits&userId=user_001

7️⃣ ENDPOINTS ADMIN (DOCUMENTAR)

GET /api/admin/credits/overview
- KPIs y rankings del módulo.

GET /api/admin/credits/transactions
- Lista paginada/filtrada del ledger interno.
- Params: userId, type, dateFrom, dateTo, minAmount, maxAmount, page, limit, sort, order, status.

GET /api/admin/credits/user/:userId
- Resumen por usuario + historial completo de transacciones.

POST /api/admin/credits/assign
- Asignación manual (admin_assign). Body: userId, amount, motivo.

POST /api/admin/credits/deduct
- Deducción manual (adjustment negativo). Body: userId, amount, motivo.

POST /api/admin/credits/refund
- Refund por transacción previa. Body: userId, transactionId (original), amount, motivo.

POST /api/admin/credits/packs
- Crear/actualizar packs (si se usa un único endpoint; alternativamente usar PUT para actualizar).

PUT /api/admin/credits/packs/:id
- Actualizar pack existente (nombre, cantidad, precio, activo, bonus).

GET /api/admin/credits/config
- Obtener configuración del módulo.

PUT /api/admin/credits/config
- Actualizar configuración (expiración, saldo negativo, límites, conversión informativa).

8️⃣ ALERTAS ADMIN

- Gasto inusual por usuario (umbral dinámico por ventana de tiempo).
- Usuario con crédito negativo (si permitido) y fuera de rango.
- Uso masivo en poco tiempo (posible abuso o error de pricing).
- Pack mal configurado (precio/cantidad/bonus inconsistentes con políticas).

9️⃣ DIFERENCIAS CLAVES VS FINANCE

- Finance (USDT real, conciliación con provider, exposición, wallet real) vs Credits (saldo virtual, sin conciliación, sin exposición, ledger interno).
- La compra de créditos puede originarse en Finance (depósito/orden); la conversión a créditos se refleja aquí y no modifica el Wallet USDT una vez ejecutada.
- No mezclar estados ni balances: cada módulo mantiene su propia contabilidad.

🔟 FUTURO (ROADMAP)

- Créditos dinámicos por performance.
- Cashback en créditos.
- Créditos promocionales.
- Créditos por referidos.
- Créditos por staking interno.

🔒 RESTRICCIONES

- Nunca mezclar balance USDT con créditos.
- No permitir transferencia usuario → usuario.
- No permitir retiro.
- Siempre auditable (todas las operaciones deben generar CreditTransaction y trazas de Auditoría cuando aplique).

📌 IMPORTANTE

- Mantener el mismo formato estructural que admin-finance (query params, paginación, sort/order, tabs).
- Documento en español técnico, sin código, reglas claras y sin ambigüedades.
- Evitar duplicar lógica financiera real; los créditos se gestionan en su propio ledger interno.

11️⃣ ESTADOS Y TRANSICIONES DE CREDITTRANSACTION
- Estados permitidos: pending, completed, failed, canceled. 
- Transiciones válidas:
  - pending → completed | failed | canceled.
  - completed → (no cambia). Los reembolsos se realizan creando una nueva transacción type=refund que referencia la original.
  - failed y canceled son terminales.
- expiration siempre se registra como una transacción nueva (type=expiration) generada por proceso programado.
- adjustment y admin_assign se registran como completed de forma atómica por acción de admin.

12️⃣ VALIDACIONES Y CONSISTENCIA DE SALDO
- amount: número positivo (> 0) para purchase, spend, admin_assign, refund, adjustment y expiration. El signo contable lo determina el type (crédito/suma vs débito/resta).
- Precisión: usar decimal(18,2) (2 decimales) para almacenamiento y mostrar con redondeo half-up. Prohibido amount=0.
- balance_after = balance_before ± amount según type. Validación obligatoria en cada operación.
- Concurrencia: las operaciones que afectan saldo deben ser atómicas (transacción ACID) y/o bloqueo por fila (row-level lock). Recomendar campo version/sequence para ledger y evitar carreras.
- Saldo negativo: respetar config (permitirSaldoNegativo=false por defecto). Si está deshabilitado, reject en spend/expiration cuando balance_before < amount.

13️⃣ PAGINACIÓN, ORDEN Y VALORES POR DEFECTO
- page: default=1 (mínimo 1).
- limit: default=50, máximo=200.

## 📋 Tipos de TypeScript

### Interfaces Principales

```typescript
// Módulo principal de créditos
interface AdminCreditsModule {
  id: 'admin-credits'
  name: 'Administración de Créditos'
  description: 'Gestión de saldo interno virtual del sistema'
  version: string
  enabled: boolean
  features: CreditsFeatures
}

interface CreditsFeatures {
  manualAssignment: boolean
  creditPacks: boolean
  expiration: boolean
  negativeBalance: boolean
  fraudDetection: boolean
  analytics: boolean
}

// Header del módulo
interface AdminCreditsHeader {
  title: string
  description: string
  quickStats: CreditsQuickStats
  actions: HeaderAction[]
}

interface CreditsQuickStats {
  totalCreditsInCirculation: number
  totalCreditsAssigned: number
  totalCreditsSold: number
  totalCreditsSpent: number
  activeUsersWithCredits: number
  expiredCreditsToday: number
}

interface HeaderAction {
  id: string
  label: string
  icon: string
  action: () => void
  variant: 'primary' | 'secondary'
}

// Layout principal
interface AdminCreditsLayout {
  tabs: CreditsTab[]
  activeTab: string
  content: CreditsTabContent
  sidebar?: SidebarConfig
}

interface CreditsTab {
  id: 'overview' | 'transactions' | 'users' | 'packs' | 'config'
  label: string
  icon: string
  component: string
  badge?: number
}

interface CreditsTabContent {
  overview: OverviewTab
  transactions: TransactionsTab
  users: UsersTab
  packs: PacksTab
  config: ConfigTab
}

// KPIs del sistema
interface CreditsKPIs {
  circulation: CirculationKPIs
  sales: SalesKPIs
  usage: UsageKPIs
  users: UserKPIs
  expiration: ExpirationKPIs
}

interface CirculationKPIs {
  totalInCirculation: number
  totalAssignedManually: number
  totalSold: number
  totalSpent: number
  netCirculation: number
  dailyChange: number
}

interface SalesKPIs {
  totalSales: number
  dailySales: number
  monthlySales: number
  averageSaleAmount: number
  topSellingPacks: CreditPack[]
  salesGrowthRate: number
}

interface UsageKPIs {
  totalSpent: number
  dailySpent: number
  averageSpendPerUser: number
  topSpendingCategories: SpendingCategory[]
  usageGrowthRate: number
}

interface UserKPIs {
  usersWithCredits: number
  averageCreditsPerUser: number
  medianCreditsPerUser: number
  usersWithNegativeBalance: number
  activeUsersToday: number
}

interface ExpirationKPIs {
  expiringToday: number
  expiringThisWeek: number
  expiringThisMonth: number
  totalExpired: number
  expirationRate: number
}
```

### Filtros Avanzados

```typescript
interface CreditsFilters {
  userId?: string
  transactionType?: CreditTransactionType[]
  dateRange?: DateRange
  amountRange?: NumberRange
  status?: TransactionStatus[]
  referenceType?: ReferenceType[]
  referenceId?: string
  adminId?: string
  search?: string
}

interface DateRange {
  from: string
  to: string
  preset?: 'today' | 'week' | 'month' | 'quarter' | 'year'
}

interface NumberRange {
  min?: number
  max?: number
}
```

### Componentes de Tabs

```typescript
interface OverviewTab {
  kpis: CreditsKPIs
  charts: OverviewCharts
  recentTransactions: CreditTransaction[]
  topUsers: TopCreditUser[]
  alerts: CreditAlert[]
}

interface OverviewCharts {
  circulationTrend: TimeSeriesData
  salesVsUsage: ComparisonData
  userDistribution: DistributionData
  expirationForecast: ForecastData
}

interface TransactionsTab {
  transactions: CreditTransaction[]
  filters: CreditsFilters
  pagination: PaginationConfig
  summary: TransactionSummary
  exportOptions: ExportConfig[]
}

interface TransactionSummary {
  totalCount: number
  totalAmount: number
  byType: Record<CreditTransactionType, number>
  byStatus: Record<TransactionStatus, number>
}

interface UsersTab {
  users: CreditUser[]
  searchQuery: string
  filters: UserFilters
  actions: UserAction[]
  selectedUser?: CreditUserDetail
}

interface CreditUser {
  id: string
  name: string
  email: string
  currentBalance: number
  totalSpent: number
  totalPurchased: number
  lastActivity: string
  status: 'active' | 'inactive' | 'suspended'
}

interface CreditUserDetail extends CreditUser {
  transactionHistory: CreditTransaction[]
  creditPacks: PurchasedPack[]
  expirationSchedule: ExpirationItem[]
  manualAdjustments: ManualAdjustment[]
}

interface PacksTab {
  packs: CreditPack[]
  salesData: PackSalesData
  createForm: PackForm
  editModal?: PackEditModal
}

interface CreditPack {
  id: string
  name: string
  description: string
  credits: number
  price: number
  currency: string
  bonusPercentage: number
  active: boolean
  createdAt: string
  updatedAt: string
}

interface ConfigTab {
  settings: CreditsConfig
  validationRules: ValidationRules
  auditConfig: AuditConfig
  updateHistory: ConfigUpdate[]
}

interface CreditsConfig {
  expiration: {
    enabled: boolean
    days: number
    warningDays: number
  }
  negativeBalance: {
    enabled: boolean
    maxLimit: number
  }
  precision: {
    decimals: number
    roundingMode: 'half-up' | 'down' | 'up'
  }
  concurrency: {
    lockingEnabled: boolean
    timeoutMs: number
  }
}
```

### Modales Críticos

```typescript
interface ManualAssignmentModal {
  type: 'assign' | 'deduct' | 'adjust'
  userId: string
  user: CreditUser
  amount: number
  reason: string
  internalNote: string
  userNotification: boolean
  actions: {
    confirm: () => void
    cancel: () => void
  }
}

interface RefundModal {
  transactionId: string
  originalTransaction: CreditTransaction
  refundAmount: number
  maxRefundAmount: number
  reason: string
  internalNote: string
  actions: {
    confirm: () => void
    cancel: () => void
  }
}

interface PackPurchaseModal {
  userId: string
  user: CreditUser
  selectedPack?: CreditPack
  totalAmount: number
  currency: string
  paymentMethod: string
  actions: {
    confirm: () => void
    cancel: () => void
  }
}
```

### Tipos Auxiliares y Enums

```typescript
// Tipos principales
type CreditTransactionType = 'purchase' | 'spend' | 'admin_assign' | 'refund' | 'expiration' | 'adjustment'
type TransactionStatus = 'pending' | 'completed' | 'failed' | 'canceled'
type ReferenceType = 'signal' | 'prediction' | 'admin' | 'pack' | 'subscription' | 'order' | 'feature'
type AlertType = 'low_balance' | 'expiration_warning' | 'unusual_spending' | 'negative_balance' | 'fraud_suspected'

// Entidad principal
interface CreditTransaction {
  id: string
  userId: string
  user: {
    id: string
    name: string
    email: string
  }
  type: CreditTransactionType
  amount: number
  balanceBefore: number
  balanceAfter: number
  referenceType?: ReferenceType
  referenceId?: string
  status: TransactionStatus
  adminId?: string
  admin?: {
    id: string
    name: string
  }
  metadata?: TransactionMetadata
  createdAt: string
  updatedAt?: string
}

interface TransactionMetadata {
  reason?: string
  notes?: string
  originalTransactionId?: string
  packId?: string
  expirationDate?: string
  fraudFlags?: string[]
}

// Configuraciones del sistema
interface ValidationRules {
  amount: {
    min: number
    max: number
    precision: number
  }
  balance: {
    allowNegative: boolean
    maxNegative: number
    minPositive: number
  }
  concurrency: {
    maxRetries: number
    timeoutMs: number
  }
}

interface AuditConfig {
  enabled: boolean
  logManualActions: boolean
  logSystemActions: boolean
  retentionDays: number
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
}

interface ComparisonData {
  categories: string[]
  series: Array<{
    name: string
    data: number[]
  }>
}

interface DistributionData {
  ranges: Array<{
    label: string
    min: number
    max: number
    count: number
    percentage: number
  }>
}

interface ForecastData {
  dates: string[]
  predicted: number[]
  actual?: number[]
  confidence: number
}

// Interfaces auxiliares
interface TopCreditUser {
  userId: string
  user: CreditUser
  currentBalance: number
  totalSpent: number
  totalPurchased: number
  rank: number
}

interface CreditAlert {
  id: string
  type: AlertType
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  userId?: string
  metadata?: Record<string, any>
  createdAt: string
  acknowledged: boolean
}

interface PurchasedPack {
  packId: string
  pack: CreditPack
  purchaseDate: string
  credits: number
  price: number
  bonusCredits: number
  totalCredits: number
}

interface ExpirationItem {
  transactionId: string
  amount: number
  expirationDate: string
  daysRemaining: number
  type: 'purchase' | 'bonus' | 'assignment'
}

interface ManualAdjustment {
  transactionId: string
  adminId: string
  admin: {
    id: string
    name: string
  }
  type: 'assign' | 'deduct' | 'adjust'
  amount: number
  reason: string
  createdAt: string
}

interface UserFilters {
  status?: ('active' | 'inactive' | 'suspended')[]
  balanceRange?: NumberRange
  lastActivityRange?: DateRange
  hasNegativeBalance?: boolean
  hasExpiringCredits?: boolean
}

interface UserAction {
  id: string
  label: string
  icon: string
  action: (user: CreditUser) => void
  variant: 'primary' | 'secondary' | 'danger'
  requiresConfirmation?: boolean
}

interface PackSalesData {
  totalSales: number
  totalRevenue: number
  salesByPack: Record<string, number>
  revenueByPack: Record<string, number>
  topSellingPacks: CreditPack[]
}

interface PackForm {
  name: string
  description: string
  credits: number
  price: number
  currency: string
  bonusPercentage: number
  active: boolean
}

interface PackEditModal {
  pack: CreditPack
  form: PackForm
  isDirty: boolean
  validationErrors: Record<string, string>
}

interface PaginationConfig {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf'
  includeHeaders: boolean
  dateFormat: string
  timezone: string
  filters: Partial<CreditsFilters>
}

interface ConfigUpdate {
  id: string
  configKey: string
  oldValue: any
  newValue: any
  adminId: string
  admin: {
    id: string
    name: string
  }
  reason: string
  createdAt: string
}

interface CountryDistribution {
  country: string
  code: string
  users: number
  percentage: number
}

interface SpendingCategory {
  category: string
  amount: number
  percentage: number
  growth: number
}

interface CreditLimit {
  userId: string
  dailyLimit: number
  weeklyLimit: number
  monthlyLimit: number
  currentUsage: {
    daily: number
    weekly: number
    monthly: number
  }
  lastReset: string
}
- sort: default=created_at. Campos permitidos: created_at, amount, user_id, type, status.
- order: default=desc. Valores permitidos: asc | desc.
- dateFrom/dateTo: formato ISO-8601 (YYYY-MM-DD o timestamp). Si no se especifica, por defecto últimos 7 días en transactions.

14️⃣ CONVENCIONES DE NOMBRE Y IDENTIFICADORES
- Prefijos de IDs:
  - CreditTransaction.id → cred_tx_XXXXXXXX.
  - CreditPack.id → cred_pack_XXXXXXXX.
  - Configuración única → cred_cfg (documento único o clave de configuración).
- Tabs (camelCase): overview, transactions, userCredits, creditPacks, configuration.
- Query params: usar camelCase consistente con Finance (userId, dateFrom, dateTo, minAmount, maxAmount, page, limit, sort, order, status, type, tab).
- metadata: JSON con claves estables (motivo, notas, correlationId, idempotencyKey, origin, relation).

15️⃣ RBAC, SEGURIDAD Y PERMISOS
- Roles sugeridos:
  - superadmin: acceso total.
  - finance_admin: puede ver y operar créditos, configurar packs y config.
  - support_admin: puede ver, crear admin_assign, refunds y ajustes limitados; sin acceso a configuración global.
  - audit_viewer: solo lectura (overview, transactions, userCredits).
- Controles:
  - Idempotencia en POST (ver sección 21).
  - Rate limiting en acciones sensibles (assign, deduct, refund, packs, config).
  - Registro de auditoría obligatorio en operaciones de admin (admin_id, motivo, dif, timestamp, IP/UA opcional).

16️⃣ ERRORES ESTANDARIZADOS (HTTP + CÓDIGO APLICATIVO)
- 400 invalid_parameter (parámetro faltante o inválido).
- 401 unauthorized (no autenticado).
- 403 forbidden (sin permiso para la acción).
- 404 not_found (usuario/pack/transacción no existe).
- 409 conflict (insufficient_credits, negative_limit_exceeded, double_refund, pack_inconsistent).
- 422 validation_error (violación de reglas de negocio). 
- 500 server_error (error interno inesperado).
- Estructura sugerida: { code, message, details?, traceId? }.

17️⃣ ESPECIFICACIÓN DE CREDIT PACKS (VALIDACIONES)
- nombre: único por idioma/segmento, no vacío.
- cantidad_de_créditos: entero positivo (>0).
- precio: decimal positivo (>0). 
- bonus%: rango [0, 100]. Efecto: créditos efectivos = cantidad*(1+bonus/100).
- activo: boolean.
- Reglas de pricing: coherencia (evitar que packs mayores tengan peor precio unitario que packs menores salvo justificación). 
- No permitir precio efectivo negativo o bonus que induzca inconsistencias.

18️⃣ CONFIGURACIÓN Y JOBS PROGRAMADOS
- Expiración: si está habilitada, job diario a las 00:00Z que calcula créditos por vencer y genera transacción type=expiration por usuario.
- Parámetros:
  - expirationEnabled (bool), expirationDays (int), gracePeriodDays (opcional), allowNegativeBalance (bool), negativeLimitPerUser (decimal), conversionRateUSD (informativo).
- Cambios de configuración deben registrarse en Auditoría.

19️⃣ UI (ADMIN) — PATRONES Y SELECTORES
- Tabs principales con selectores .main-tab[data-tab] y contenedores con IDs que inician con el prefijo del tab (para que startsWith(currentTab) funcione).
- Evitar listeners genéricos sobre [data-tab] que capten elementos del drawer. Limitar a .main-tab[data-tab] para navegación principal.
- showTab(tabName): limpia .active y activa solo un tab principal; actualizar URL ?tab= y sincronizar estado.
- Filtros: mapping explícito elementId → filterKey (evitar deducción por texto).

20️⃣ AUDITORÍA Y TRAZABILIDAD
- Campos mínimos por evento: event_id, admin_id (si aplica), user_id (si aplica), action, type, diff (±amount), motivo (obligatorio en admin_assign/deduct/refund/adjustment), timestamp, correlationId, ip, userAgent.
- Toda operación que afecte saldo debe tener rastro en auditoría y en el ledger.

21️⃣ IDEMPOTENCIA EN OPERACIONES POST
- Aceptar encabezado Idempotency-Key (o parámetro) en assign, deduct y refund.
- Si existe una operación con la misma Idempotency-Key y parámetros equivalentes en ventana de 24h, devolver resultado previo sin duplicar efectos.
- Almacenar idempotencyKey en metadata.

22️⃣ EJEMPLOS DE USO (DESCRIPTIVOS)
- Asignación manual: admin ejecuta POST /api/admin/credits/assign con userId, amount (>0) y motivo. Efecto: type=admin_assign, balance_after = balance_before + amount, registro en Auditoría.
- Deducción manual: POST /api/admin/credits/deduct con userId, amount (>0) y motivo. Efecto: type=adjustment (débito), balance_after = balance_before − amount. Respetar allowNegativeBalance.
- Refund: POST /api/admin/credits/refund con userId, transactionId (original), amount (>0) y motivo. Efecto: type=refund, suma al balance y relación con transacción original.
- Compra vía pack: al liquidar orden en Finance, generar purchase en Credits con referencia pack/order y conversión a créditos.
- Gasto en señal: validar saldo suficiente; crear spend con referencia a signal/prediction/feature.

23️⃣ INTEROPERABILIDAD CON FINANCE
- Origen de créditos comprados: depósitos/órdenes en Finance → conversión a purchase en Credits (ledger interno).
- No se modifica el Wallet USDT una vez convertidos. Evitar doble contabilización.
- reference_type y reference_id deben permitir trazar el origen (orderId, packId) y el destino de gasto (signalId, predictionId, featureId).

24️⃣ EJEMPLOS DE PAYLOADS Y RESPUESTAS (ESTÁNDAR)
- GET /api/admin/credits/transactions (ejemplo)
  - Request: /api/admin/credits/transactions?type=spend&dateFrom=2026-02-01&dateTo=2026-02-12&page=1&limit=50&sort=created_at&order=desc
  - Response:
    {
      "page": 1,
      "limit": 50,
      "total": 1234,
      "items": [
        {
          "id": "cred_tx_0001",
          "user_id": "user_001",
          "type": "spend",
          "amount": 10.00,
          "balance_before": 50.00,
          "balance_after": 40.00,
          "reference_type": "signal",
          "reference_id": "signal_abc",
          "status": "completed",
          "admin_id": null,
          "metadata": { "motivo": "compra señal" },
          "created_at": "2026-02-12T10:20:30Z"
        }
      ]
    }
- GET /api/admin/credits/user/:userId (ejemplo)
  - Response:
    {
      "user_id": "user_001",
      "balance": 120.00,
      "stats": { "purchased": 300.00, "spent": 180.00, "assigned": 50.00 },
      "transactions": [ /* mismo formato de items */ ]
    }
- POST /api/admin/credits/assign (ejemplo)
  - Request Body:
    { "userId": "user_001", "amount": 25.00, "motivo": "bono promoción" }
  - Response:
    { "transaction_id": "cred_tx_0456", "status": "completed" }
- POST /api/admin/credits/deduct (ejemplo)
  - Request Body:
    { "userId": "user_001", "amount": 10.00, "motivo": "ajuste por error" }
  - Response:
    { "transaction_id": "cred_tx_0457", "status": "completed" }
- POST /api/admin/credits/refund (ejemplo)
  - Request Body:
    { "userId": "user_001", "transactionId": "cred_tx_0001", "amount": 10.00, "motivo": "refund compra señal" }
  - Response:
    { "transaction_id": "cred_tx_0458", "status": "completed", "refers": "cred_tx_0001" }
- GET /api/admin/credits/overview (ejemplo)
  - Response:
    {
      "kpis": {
        "in_circulation": 50000.00,
        "assigned_manual": 1200.00,
        "sold": 30000.00,
        "spent_today": 1500.00,
        "expiring_next_7d": 250.00
      },
      "rankings": {
        "top_buyers": [ { "user_id": "user_001", "purchased": 1200.00 } ],
        "top_spenders": [ { "user_id": "user_002", "spent": 980.00 } ]
      },
      "trends": {
        "daily_sold": [ { "date": "2026-02-10", "value": 2500.00 } ],
        "daily_spent": [ { "date": "2026-02-10", "value": 1800.00 } ]
      }
    }
- GET/PUT /api/admin/credits/config (ejemplo)
  - GET Response:
    {
      "expirationEnabled": true,
      "expirationDays": 365,
      "allowNegativeBalance": false,
      "negativeLimitPerUser": 0,
      "conversionRateUSD": 1.00
    }
  - PUT Request Body:
    { "expirationEnabled": true, "expirationDays": 365, "allowNegativeBalance": false }
- POST /api/admin/credits/packs (ejemplo)
  - Request Body:
    { "nombre": "Pack 50", "cantidad": 50, "precio": 45.00, "bonus": 0, "activo": true }
  - Response:
    { "id": "cred_pack_0050", "status": "created" }

25️⃣ POLÍTICA DE RETENCIÓN Y EXPORTACIÓN
- Retención: el ledger de créditos es inmutable y se conserva indefinidamente para auditoría. Se puede aplicar archivado a fría a > 2 años manteniendo accesibilidad bajo solicitud.
- Exportación CSV/JSON:
  - Endpoint sugerido: GET /api/admin/credits/transactions/export?type=...&dateFrom=...&dateTo=... (mismos filtros). 
  - Formatos: csv | json. Param: format=csv.
  - Límite: exportaciones grandes pueden requerir job asíncrono con notificación y URL temporal.
- Privacidad: datos exportados deben seguir las políticas de protección de datos; incluir solo campos necesarios.

26️⃣ EVENTOS / WEBHOOKS (OPCIONAL)
- Emisión de eventos internos al bus:
  - credits.purchase.completed
  - credits.spend.completed
  - credits.admin_assign.completed
  - credits.adjustment.completed
  - credits.refund.completed
  - credits.expiration.completed
- Payload mínimo del evento: transaction_id, user_id, type, amount, created_at, reference_type/reference_id.
- Webhooks externos (si aplica): configurable por superadmin; con firma HMAC y reintentos exponenciales.

27️⃣ MODELO “USERCREDITS” (BALANCE AGREGADO — RECOMENDADO)
- Motivo: rendimiento real y lecturas rápidas sin recalcular SUM() del ledger en cada petición. El ledger (CreditTransaction) es la fuente de verdad para auditoría; el snapshot UserCredits es la vista de saldo actual por usuario.
- Tabla: UserCredits
  - user_id (PK)
  - balance decimal(18,2) NOT NULL DEFAULT 0.00
  - updated_at timestamptz NOT NULL
  - version int NOT NULL DEFAULT 0 (optimistic lock)
  - last_transaction_id (opcional, para trazabilidad)
- Índices: UNIQUE(user_id). Opcional: idx_updated_at para housekeeping.
- Invariantes:
  - El saldo se actualiza exclusivamente vía operaciones de Créditos (purchase/spend/admin_assign/refund/expiration/adjustment).
  - No se permiten escrituras directas externas.
  - Reconciliación periódica: SUM(ledger efectos por usuario) ≟ UserCredits.balance. Si difiere, alertar y corregir con adjustment administrativo.
- Alternativa (no recomendada): campo users.credits_balance. Preferible tabla separada para aislar locking y responsabilidades.
- Uso en API: GET /api/admin/credits/user/:userId debe leer UserCredits.balance y adjuntar historial desde CreditTransaction.

28️⃣ PATRÓN OFICIAL ANTI-DOBLE GASTO (OPERACIÓN ATÓMICA)
- Todas las operaciones que afecten saldo deben seguir este patrón en una transacción ACID:
  1) BEGIN TRANSACTION
  2) SELECT balance, version FROM UserCredits WHERE user_id = :userId FOR UPDATE
  3) Validar reglas: allowNegativeBalance, negativeLimitPerUser, expiración si aplica
  4) Calcular balance_after = balance_before ± amount según type
  5) Insertar CreditTransaction con: status, type, amount, balance_before, balance_after, referencias y metadata (incluye idempotencyKey si aplica)
  6) UPDATE UserCredits SET balance = :balance_after, version = version + 1, updated_at = now() WHERE user_id = :userId
  7) COMMIT
- Si falla cualquier validación, ROLLBACK y devolver 409/422 según corresponda.
- Concurrencia distribuida: opcional advisory lock por clave "credits:user:{userId}" para evitar carreras inter-servicio.
- Idempotencia: antes de insertar, chequear existencia por idempotencyKey + parámetros equivalentes para evitar duplicados.

29️⃣ INTEGRACIÓN CON PURCHASE FLOW (FINANCE → CREDITS)
- Regla fuerte: Créditos nunca crea purchase por sí mismo. Solo responde a eventos de Finance cuando una orden/deposito está liquidada (status=completed).
- Flujo exacto:
  1) Finance marca order_id como completed (origen: depósito/checkout de pack/subscripción)
  2) Emite evento interno (outbox) con payload: { order_id, user_id, pack_id?, credits_amount, completed_at }
  3) Créditos consume el evento (inbox), verifica idempotencia por order_id y:
     - Inserta CreditTransaction type=purchase, reference_type=order|pack, reference_id=order_id|pack_id, status=completed
     - Actualiza UserCredits.balance (+credits_amount) de forma atómica (patrón 28)
     - Emite evento credits.purchase.completed
  4) Nunca se duplica conversión: UNIQUE(metadata.origin_order_id) o idempotencyKey=order_id.
- Cancelaciones/chargebacks posteriores en Finance: se gestionan en Créditos vía refund/adjustment masivo (ver sección 32) sin tocar el Wallet USDT.

30️⃣ POLÍTICA DE EXPIRACIÓN DETALLADA (FIFO)
- Si expirationEnabled=true, los créditos expiran siguiendo FIFO por created_at de las compras (purchase).
- Consumo (spend) asigna montos a buckets de compras más antiguas primero. Se recomienda registrar la asignación en metadata.allocations = [ { purchase_tx_id, amount } ... ] para trazabilidad.
- Job de expiración (diario 00:00Z):
  - Para cada usuario, identificar purchases cuyo "edad" > expirationDays y con remanente sin consumir
  - Generar CreditTransaction type=expiration por cada bucket afectado, con reference_id=purchase_tx_id y amount=remanente a expirar
  - Actualizar UserCredits.balance en consecuencia (patrón 28)
- Implementación eficiente (opcional): tabla auxiliar UserCreditBuckets { purchase_tx_id, user_id, remaining_amount, created_at } actualizada en cada spend/refund para evitar recalcular por ledger.
- Reglas de gasto con múltiples compras: siempre descuenta primero los más antiguos (FIFO), luego los siguientes.

31️⃣ MÉTRICAS FINANCIERAS DE CRÉDITOS (CONTROL INTERNO)
- Métricas obligatorias:
  - total_issued = Σ(purchase + admin_assign + refund positivos)
  - total_burned = Σ(spend + expiration + adjustments negativos)
  - ratio_issuance_to_consumption = total_issued / max(total_burned, 1)
  - active_credits = Σ(UserCredits.balance)
  - historical_credits = Σ(ledger efectos netos)
  - integrity_diff = historical_credits − active_credits (debería ser 0; alertar si |diff| > umbral)
- Endpoint sugerido: GET /api/admin/credits/metrics?dateFrom&dateTo
- Alertas:
  - integrity_diff ≠ 0
  - picos anómalos en emisión/consumo
- Persistencia de KPIs diarios para Overview y auditoría.

32️⃣ POLÍTICA DE REVERSIÓN MASIVA (EMERGENCIA)
- Caso: errores sistémicos (p.ej. cobros incorrectos a muchos usuarios) requieren corrección masiva.
- Endpoint administrativo:
  - POST /api/admin/credits/mass-adjustments
    - Body: {
        "operations": [ { "userId": "...", "type": "refund|adjustment", "amount": 10.00, "motivo": "...", "reference_id": "opcional" } ],
        "dryRun": true|false,
        "correlationId": "...",
        "idempotencyKey": "..."
      }
    - Reglas:
      - RBAC: superadmin únicamente.
      - dryRun=true devuelve preview sin efectos (totales por usuario y validaciones).
      - Tamaño máximo por batch (p.ej. 1000 operaciones); chunking si es mayor.
      - Cada operación se aplica con el patrón 28 y se audita (sección 20).
      - Idempotencia por idempotencyKey + correlationId.
- Herramienta CSV (opcional): /api/admin/credits/mass-adjustments/import con validación y preview.

33️⃣ INMUTABILIDAD FUERTE DEL LEDGER
- Principio: una CreditTransaction nunca se edita ni se elimina. Correcciones se realizan siempre mediante nuevas transacciones (type=adjustment/refund/expiration) que referencian la original en metadata.
- Controles:
  - Prohibido UPDATE/DELETE en CreditTransaction a nivel de servicio. Opcional: restricciones de BD (policy/trigger) para bloquear modificaciones.
  - Auditoría obligatoria de todas las operaciones correctivas.
- Consecuencia legal/contable: el ledger es inmutable y conserva trazabilidad completa en el tiempo.
34️⃣ CONSISTENCIA EVENTUAL (MICROSERVICIOS: OUTBOX/INBOX)
- Finance usa patrón Outbox transaccional:
  - Al marcar order=completed, escribe un evento en tabla outbox dentro de la misma transacción de negocio.
  - Un despachador asíncrono publica el evento garantizando al menos-una-vez (at-least-once) y preserva orden por clave (p.ej. user_id).
  - Confirmaciones/offsets sólo se marcan tras persistir en el bus.
- Credits usa patrón Inbox con deduplicación:
  - Consume eventos y registra en tabla inbox { event_id, order_id, user_id, processed_at } con UNIQUE(order_id) o UNIQUE(event_id).
  - Antes de aplicar, verifica existencia por order_id (idempotencia fuerte). Si existe, no re-aplica.
  - Retries con backoff exponencial. En caso de fallo permanente, enviar a DLQ (dead-letter-queue) con alerta.
  - Procesamiento transaccional: consumir → aplicar patrón 28 (atómico) → marcar inbox como processed.
- Observabilidad:
  - Métricas de lag, tasa de errores, tamaño de DLQ, tiempos de procesamiento.
  - Alertas si hay eventos en DLQ > umbral o si lag supera X minutos.

35️⃣ INTEGRIDAD ANTE CRASH INTERMEDIO (SELF-HEALING)
- Obligatorio: INSERT en CreditTransaction y UPDATE en UserCredits deben ocurrir en la misma transacción de base de datos (ACID). Si el proceso muere antes del COMMIT, no queda estado parcial.
- Si por diseño o incidente se detecta estado inconsistente (ej. existe CreditTransaction pero UserCredits no refleja el cambio):
  - Proceso de reconciliación automático (job periódico):
    - Calcula diff = SUM(ledger efectos netos por usuario) − UserCredits.balance.
    - Si diff ≠ 0, genera una CreditTransaction type=adjustment con amount=diff y metadata.origin="reconciliation", relacionando las transacciones que causaron el desbalance.
    - Aplica patrón 28 para actualizar UserCredits y cerrar el diff.
    - Audita el evento y emite alerta.
  - Alternativa (si se mantiene tabla UserCreditBuckets): reparar buckets y snapshot en base a ledger previo y reintentar aplicación idempotente.
- Logging: registrar crash points y correlationId para trazabilidad.

36️⃣ POLÍTICA OFICIAL DE UNIDAD Y PRECISIÓN DE CRÉDITOS
- Definición final: créditos son enteros (int) sin decimales para operaciones de negocio.
  - amounts en API deben ser múltiplos de 1 (p.ej. 1, 2, 10). Prohibidas fracciones (2.5).
  - Almacenamiento: se permite decimal(18,2) por compatibilidad, pero se valida amount % 1 == 0.
  - Conversión desde USD: aplicar redondeo half-up al entero más cercano; cualquier residuo se maneja en la capa de pricing (no se emiten fracciones).
  - UI: mostrar cantidades como enteros; packs definen cantidades enteras.
- Nota: si se requiere en el futuro permitir fracciones, se documentará un cambio de política y migración de datos.

37️⃣ ENUM FUERTE PARA TYPE (BASE DE DATOS)
- type se define como ENUM con valores permitidos: purchase, spend, admin_assign, refund, expiration, adjustment.
- Validaciones:
  - API rechaza valores fuera del ENUM con 422 validation_error.
  - Migración: alterar columna type (string → enum) y mapear valores existentes; agregar constraint CHECK en motores que no soporten ENUM nativo.
- Código de aplicación:
  - Usar tipos enumerados en el dominio/DTOs para evitar strings arbitrarios.

38️⃣ LÍMITES DE EMISIÓN (GOBERNANZA)
- Configuración avanzada:
  - dailyAdminAssignLimitPerAdmin (int): máximo de créditos que cada admin puede asignar por día.
  - dailyAdminAssignLimitGlobal (int): máximo global de admin_assign por día en el sistema.
  - globalIssuanceCap (int): tope de créditos emitidos históricamente (purchase+admin_assign+refund positivos). Al alcanzar X%, generar alerta; al 100% bloquear emisión.
  - dualApprovalThreshold (int): umbral que requiere doble aprobación (dos admins) para una asignación.
- Enforcements:
  - Chequear límites antes de aplicar patrón 28; si excede, devolver 403/409 según caso y auditar intento.
  - Métricas y alertas en Overview (uso de límites, porcentaje consumido, solicitudes bloqueadas).
- Endpoints de governance (opcional): GET/PUT /api/admin/credits/governance para actualizar límites con RBAC superadmin y auditoría obligatoria.
39️⃣ PRIORIDAD SPEND VS EXPIRATION (CONCURRENCIA)
- Regla de prioridad: spend (consumo por usuario) tiene prioridad sobre expiration (job programado) cuando se produce concurrencia en el mismo usuario.
- Implementación (patrón 28 + locking):
  - El job de expiración debe operar por usuario en transacciones aisladas, utilizando SELECT ... FOR UPDATE sobre UserCredits y (si existe) UserCreditBuckets.
  - Antes de expirar, re-evaluar el remanente de cada bucket tras adquirir el lock; si un spend concurrente redujo el remanente, el job ajusta el monto a expirar (nunca expira más de lo disponible). 
  - Orden de ejecución: primero se aplican spends, luego expirations. En caso de carrera, expiration reintenta (backoff) o continúa con el nuevo remanente.
- Idempotencia y trazabilidad del job:
  - Registrar en metadata.run_id y metadata.bucket_snapshot antes/aplicar para evitar expiraciones duplicadas.
  - Mantener DLQ y alertas si el job falla repetidamente por lock o inconsistencias.
- Ventana operativa:
  - Programar el job en horarios de menor actividad para reducir contención (ej. 00:00Z). 
  - Métrica: tasa de conflictos spend-vs-expiration por usuario.

40️⃣ POLÍTICA DE REFUND PARCIAL Y PREVENCIÓN DE DOBLE REFUND
- Refund parcial:
  - Permitido hasta el monto remanente no reembolsado de la transacción original (original.amount − Σ(refund.amount referenciando original)).
  - Responder 409 double_refund si la suma de refunds excede el original o si existe refund idéntico (idempotencyKey/correlationId).
- Prevención de doble refund:
  - Constraint lógico: UNIQUE(refers_tx_id, correlationId?) a nivel de servicio para operaciones idénticas.
  - Validación fuerte antes de insertar: calcular total_refunded de la original; si amount > disponible, bloquear.
- Asignación de buckets (FIFO coherente):
  - Si el refund se origina por revertir un spend con metadata.allocations, devolver créditos a los mismos buckets de purchase asignados inicialmente (proporcional a allocations) para preservar las fechas de expiración.
  - Si no existen allocations, política por defecto: el refund crea un bucket nuevo con created_at=now() y expira según configuración (documentar la política elegida por producto). Recomendación: preferir la restauración por allocations.
- Auditar siempre:
  - Registrar en metadata.refers=cred_tx_original y metadata.allocations_restore cuando se reparte el refund.

41️⃣ PATRÓN TRANSACCIONAL SPEND + GRANT ACCESS
- Objetivo: garantizar que el gasto de créditos y la concesión de acceso (a señal/predicción/feature) resulten exactamente-una-vez, evitando estados intermedios inconsistentes.
- Patrón recomendado (Outbox/Saga):
  1) BEGIN TRANSACTION
  2) Lock por usuario (SELECT ... FOR UPDATE en UserCredits)
  3) Validar saldo y reglas (incluye estado de usuario, ver sección 42)
  4) Insertar CreditTransaction type=spend y actualizar UserCredits.balance (patrón 28)
  5) Insertar registro outbox access_grant con payload { user_id, resource_type, resource_id, spend_tx_id, idempotencyKey }
  6) COMMIT
  7) Publicador asíncrono emite evento access.grant.requested (at-least-once)
  8) Consumidor del módulo destino concede acceso de forma idempotente (UNIQUE por {user_id, resource_id})
- Idempotencia y recuperación:
  - Si el proceso muere después del COMMIT y antes de publicar, el outbox garantiza emisión eventual.
  - El consumidor debe validar que existe spend_tx_id y que no se ha concedido acceso previamente.
- Variante monolítica (misma BD):
  - Insertar la fila de acceso (user_resource_access) dentro de la misma transacción (paso 5) en lugar de outbox. Mantener UNIQUE(user_id, resource_id) para idempotencia.

42️⃣ REGLAS ANTE USUARIO BLOQUEADO/SUSPENDIDO
- Estados operativos del usuario:
  - active: operaciones normales.
  - suspended: bloquear spend y admin_assign/adjustment; permitir refunds (para corregir cobros) y expiration programada.
  - banned: bloquear spend, purchase conversion y asignaciones; permitir expiration. Refund sólo bajo override de superadmin y motivo legal/operativo.
- Implementación:
  - Verificación obligatoria de estado en el paso 3 del patrón 28 antes de cualquier operación que afecte saldo.
  - Respuestas:
    - 403 forbidden para intentos de spend/assign/deduct si estado ≠ active.
    - Auditoría: registrar intento bloqueado con motivo y admin_id (si aplica).
- Configuraciones opcionales:
  - allowPurchaseWhileSuspended (bool, default=false): si true, permitir purchases (conversion desde Finance) incluso en suspended.
  - dualApprovalOverride para aplicar refunds en banned.

43️⃣ (OPCIONAL) INTEGRIDAD REFERENCIAL DE reference_type/reference_id
- Política general:
  - Ledger inmutable no usa FK físicas entre microservicios; se aplica integridad referencial lógica a nivel de aplicación.
- Validación de referencias:
  - Antes de insertar: verificar existencia del recurso según reference_type via API/cache (signals, tipsters, orders, subscriptions).
  - Guardar metadata.reference_validated=true/false y metadata.validation_time. 
  - Si el recurso se elimina posteriormente, el ledger conserva el registro; la UI muestra estado "referencia no disponible".
- Matriz de compatibilidad:
  - purchase → order | pack | subscription
  - spend → signal | prediction | feature
  - refund → cred_tx_original (refers)
  - expiration → purchase_tx_id (bucket origen)
  - admin_assign/adjustment → admin (opcional) o null
- Jobs de verificación:
  - Job diario que revisa transacciones recientes con reference_validated=false, intenta validar y emite alertas si persisten inconsistencias.
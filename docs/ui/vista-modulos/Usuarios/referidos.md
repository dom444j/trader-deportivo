# Referidos Module

## Concepto Central

**Referidos es el sistema de compensación dual que permite a los usuarios ganar comisiones por referidos directos y participar en pools semanales por rangos según su equipo binario.**

No es un MLM tradicional — es un modelo híbrido transparente que separa claramente comisiones directas (10% sobre pago real) de la acumulación de equipo (solo para rangos y pool semanal).

**Principio fundamental:** Transparencia total. El usuario entiende en 10 segundos de dónde viene cada centavo: directos vs rangos.

---

## 1. Propósito del Módulo

Referidos tiene **5 objetivos estratégicos:**

1. **Adquisición viral** — Incentivo claro para referir usuarios
2. **Transparencia total** — Separar directos (10%) vs equipo (rangos)
3. **Gamificación sana** — Rangos como logros, no como "esquema"
4. **Trazabilidad completa** — Idempotencia, auditoría, reversibilidad
5. **Operación controlada** — Admin define beneficio, dispersa, audita

### 1.1. Dos Modelos Separados

**Modelo A: Referidos Directos (10%)**
- ✅ Un solo nivel (directos únicamente)
- ✅ 10% del pago real confirmado
- ✅ No aplica sobre bonos, créditos, pruebas
- ✅ Wallet separada (retirable, convertible, usable)
- ✅ Idempotente: 1 compra = 1 comisión

**Modelo B: Equipo Binario A/B (Rangos)**
- ✅ Estructura binaria (2 equipos: A y B)
- ✅ Bank histórico (nunca se borra ni consume)
- ✅ 7 rangos por acumulado (R1 a R7)
- ✅ Pool semanal (60% del beneficio admin)
- ✅ NO paga comisión por compra, solo rangos

### 1.2. Lo Que Referidos NO Hace

❌ **NO es derrame infinito** — Solo 1 nivel de comisión directa  
❌ **NO paga por "niveles profundos"** — Equipo solo para rangos  
❌ **NO garantiza ingresos** — Pool depende de beneficio admin  
❌ **NO oculta reglas** — Todo visible y auditable  
❌ **NO permite duplicados** — Idempotencia estricta  

---

## 2. Business Rules (Compensation Plan)

### 2.1. Eventos que Generan Dinero

```typescript
enum RevenueSource {
  DIRECT_COMMISSION = 'direct_commission',  // 10% sobre pago real
  WEEKLY_POOL = 'weekly_pool',              // Pool por rango
  ADMIN_BONUS = 'admin_bonus'               // Bonos manuales
}
```

### 2.2. Comisión Directos (10%)

```javascript
const DIRECT_COMMISSION_RULES = {
  percentage: 0.10,  // 10% fijo
  
  applies_to: [
    'subscription_payment',  // pago real confirmado
    'upgrade_payment'        // upgrade de plan
  ],
  
  does_not_apply_to: [
    'admin_credits',         // créditos regalados
    'promotional_bonus',     // bonos promocionales
    'trial_period',          // período de prueba
    'refunded_payment'       // pagos revertidos
  ],
  
  // Montos por plan
  amounts: {
    'basic': {
      plan_price: 29.99,
      commission: 2.99   // 10%
    },
    'pro': {
      plan_price: 129.99,
      commission: 12.99  // 10%
    },
    'premium': {
      plan_price: 799.99,
      commission: 79.99  // 10%
    }
  }
}
```

### 2.3. Binario (Solo Rangos)

```javascript
const BINARY_RULES = {
  // NO paga comisión por compra
  pays_commission_on_purchase: false,
  
  // Solo genera Bank histórico
  generates_bank: true,
  
  // Aportes al Bank por plan
  bank_contributions: {
    'basic': 20,      // $29.99 → +20 Bank
    'pro': 80,        // $129.99 → +80 Bank
    'premium': 500    // $799.99 → +500 Bank
  },
  
  // Bank es histórico (nunca se borra)
  bank_is_cumulative: true,
  bank_never_resets: true,
  
  // Propósito único
  purpose: 'rank_qualification_only'
}
```

### 2.4. Activación y Ciclo de Pago

```javascript
const ACTIVATION_RULES = {
  duration_days: 30,
  
  // Pagos cada miércoles
  pay_day: 'wednesday',
  
  // Cutoff único de elegibilidad
  cutoff: {
    day: 'wednesday',
    time: '00:00 UTC',
    relative_to: 'previous_week'
  },
  
  // Ejemplo de elegibilidad
  examples: {
    purchase_monday: {
      eligible_this_wednesday: false,
      eligible_next_wednesday: true,
      total_wednesdays: 4  // 30 días ≈ 4 miércoles
    }
  }
}
```

### 2.5. Reglas Críticas de Estado y Eventos (Frontend/Backend)

```javascript
// 1) Disponibilidad de comisiones (PENDING → AVAILABLE)
const COMMISSION_AVAILABILITY_RULES = {
  available_after_hours: 24,
  available_after_formula: 'available_date = purchase_confirmed + 24h',
  anti_fraud_window_hours: 24,  // ventana anti-fraude explícita
  rationale: 'Claridad para el usuario y sincronización del frontend: saldo se actualiza tras 24h'
}

// 2) Comportamiento al expirar el plan
const PLAN_EXPIRATION_BEHAVIOR = {
  bank: 'permanece',                 // histórico, nunca se borra ni consume
  base_rank: 'permanece',            // no se pierde avance
  payable_rank: 'inactive',          // queda inactivo (tope de pago)
  pool: 'no participa',              // no se paga en el pool semanal
  notes: 'La expiración NO borra progreso, solo bloquea cobros hasta reactivar plan'
}

// 3) Triggers de recálculo de rango
const RANK_RECALCULATION_TRIGGERS = [
  'team_purchase',            // nueva compra en el equipo
  'plan_upgrade',             // upgrade de plan del usuario
  'weekly_pool_execution',    // al ejecutar el pool semanal (miércoles)
  'admin_reversal'            // reversa admin (refund, corrección)
]

// 4) Prerrequisito: selección de equipo A/B
const TEAM_SELECTION_PREREQUISITE = {
  required: true,
  effects_when_unselected: {
    bank_records: 'no registra aportes al bank',
    rank_calculation: 'no se calcula rango',
    pool_eligibility: 'no participa en pool'
  }
}

// 5) Consecuencias de refund (REVERSED)
const REFUND_CONSEQUENCES = {
  direct_commission: 'se resta o se marca como reversed (ya no disponible)',
  bank_contribution: 'se resta del bank histórico correspondiente (A/B)',
  rank_recalculation: true,
  pool_eligibility_recalculation: true
}

// 6) Estado inicial del usuario (NUEVO) para el frontend
const FRONTEND_STATE_DEFAULTS = {
  user_referral_state_default: 'new',
  behaviors: {
    no_team_selected: { show_team_selector: true, required: true, selector_label: 'Elige Equipo A/B' },
    no_referrals: { show_invite_cta: true, cta_text: 'Invitar' },
    no_active_plan: { show_pool_ineligibility_notice: true, notice_text: 'No eliges al pool hasta activar plan' }
  }
}
```

---

## 3. Modelo A: Referidos Directos (10%)

> ⚠️ ACLARACIÓN CRÍTICA:
> - Comisión Directa 10%: ILIMITADOS directos (1 nivel, sin derrame)
> - Estructura Binaria: Cada usuario tiene 2 “piernas” (Equipo A + Equipo B) para visualización en árbol
> - El “binario” NO limita cuántos referidos puedes tener; solo organiza colocación en el árbol (spillover en A/B)
> - Ejemplo: puedes tener 100 referidos directos → ganas 10% de los 100; en el árbol verás 2 “directos” (1 en A y 1 en B) y el resto como indirectos

### 3.1. Registro y Colocación

```typescript
interface ReferralLink {
  user_id: string
  referral_code: string  // único, ej: "TR-A1B2C3"
  referral_url: string   // https://tradingdeportivo.com/ref/TR-A1B2C3
  
  // Stats
  clicks: number
  signups: number
  conversions: number
  conversion_rate: number
}
```

### 3.2. Comisión por Compra

```typescript
interface DirectCommission {
  commission_id: string
  
  // Who earns
  referrer_user_id: string
  
  // Who bought
  referred_user_id: string
  
  // What bought
  subscription_id: string  // IDEMPOTENCY KEY
  plan_id: string
  plan_price: number
  
  // Commission
  commission_amount: number  // 10%
  commission_percent: 0.10
  
  // Status
  status: 'pending' | 'available' | 'paid' | 'reversed'
  
  // Dates
  purchase_date: timestamp
  available_date?: timestamp
  paid_date?: timestamp
  reversed_date?: timestamp
  
  // Audit
  created_at: timestamp
  updated_at: timestamp
}
```

### 3.3. Estados de Comisión

```javascript
const COMMISSION_STATUS_FLOW = {
  PENDING: {
    description: 'Pago confirmado, comisión generada',
    next_states: ['AVAILABLE', 'REVERSED'],
    actions: ['wait_for_availability']
  },
  
  AVAILABLE: {
    description: 'Disponible para retiro/uso',
    next_states: ['PAID', 'REVERSED'],
    actions: ['withdraw', 'convert_to_credits', 'pay_plan']
  },
  
  PAID: {
    description: 'Retirada/usada',
    next_states: [],
    actions: []
  },
  
  REVERSED: {
    description: 'Revertida (refund del pago original)',
    next_states: [],
    actions: []
  }
}
```

### 3.4. Wallet de Referidos

```typescript
interface ReferralWallet {
  user_id: string
  
  // Balances
  pending_balance: number      // comisiones pending
  available_balance: number    // comisiones available
  total_earned: number         // histórico total
  total_withdrawn: number      // total retirado
  
  // Actions available
  can_withdraw: boolean
  can_convert_to_credits: boolean
  can_pay_plan: boolean
  
  // Limits (opcional)
  min_withdrawal?: number
  max_withdrawal_per_week?: number
  
  updated_at: timestamp
}
```

### 3.5. Idempotencia Directos

```javascript
/**
 * Garantizar que 1 compra = 1 comisión
 * NO duplicados en reintentos
 */
function createDirectCommission(subscription_id, referrer_id, amount) {
  // Check if already exists
  const existing = await getCommissionBySubscriptionId(subscription_id)
  
  if (existing) {
    console.log('Commission already exists for subscription_id:', subscription_id)
    return existing
  }
  
  // Create new
  const commission = {
    commission_id: generateId(),
    referrer_user_id: referrer_id,
    subscription_id: subscription_id,  // UNIQUE KEY
    commission_amount: amount * 0.10,
    status: 'pending',
    created_at: now()
  }
  
  // Insert with unique constraint on subscription_id
  await insertCommission(commission)
  
  // Create ledger entry
  await createLedgerEntry({
    user_id: referrer_id,
    type: 'direct_commission',
    amount: commission.commission_amount,
    reference_id: commission.commission_id,
    status: 'pending'
  })
  
  return commission
}
```

---

## 4. Modelo B: Equipo Binario A/B

### 4.1. Registro y Colocación

```typescript
interface BinaryPlacement {
  user_id: string
  
  // Sponsor (quien refiere)
  sponsor_id: string
  
  // Chosen team
  team: 'A' | 'B'
  
  // Position in tree
  parent_id?: string
  position: 'left' | 'right'  // en el árbol del parent
  
  // Spillover
  is_spillover: boolean  // si fue colocado automáticamente
  
  // Depth
  level: number  // profundidad en el árbol
  
  created_at: timestamp
}
```

**Reglas de colocación:**

```javascript
const PLACEMENT_RULES = {
  // Usuario elige equipo al registrarse
  user_chooses_team: true,
  
  // Spillover dentro del equipo elegido
  spillover_within_team: true,
  
  // Tus directos NO llenan red interna de tu directo
  direct_builds_own_tree: true,
  
  // Máximo 2 directos por usuario (solo aplica al árbol binario de equipo, NO limita el programa 10%)
  max_direct_referrals: 2,
  
  // Resto son indirectos
  overflow_are_indirect: true
}
```

### 4.2. Estructura del Equipo

```typescript
interface TeamStructure {
  user_id: string
  
  // Team A
  team_a: {
    direct_count: number
    indirect_count: number
    total_count: number
    bank_a: number  // histórico acumulado
  }
  
  // Team B
  team_b: {
    direct_count: number
    indirect_count: number
    total_count: number
    bank_b: number  // histórico acumulado
  }
  
  // Total
  bank_total: number  // bank_a + bank_b
  
  updated_at: timestamp
}
```

### 4.3. Bank (Acumulados Históricos)

```javascript
/**
 * Bank = acumulado histórico por equipo
 * NUNCA se borra, NUNCA se consume
 * Solo sirve para calificar rangos
 */
const BANK_RULES = {
  // Aportes por plan
  contributions: {
    basic: 20,
    pro: 80,
    premium: 500
  },
  
  // Propiedades del Bank
  is_cumulative: true,
  never_resets: true,
  never_consumed: true,
  
  // Propósito único
  purpose: 'rank_qualification',
  
  // Cálculo
  calculation: {
    bank_a: 'sum(all_team_a_contributions)',
    bank_b: 'sum(all_team_b_contributions)',
    bank_total: 'bank_a + bank_b'
  }
}
```

**Ejemplo de cálculo:**

```javascript
function calculateBank(user_id) {
  // Get all team A members
  const teamA = getTeamMembers(user_id, 'A')
  const teamB = getTeamMembers(user_id, 'B')
  
  // Sum contributions
  const bankA = teamA.reduce((sum, member) => {
    const contribution = BANK_CONTRIBUTIONS[member.active_plan]
    return sum + contribution
  }, 0)
  
  const bankB = teamB.reduce((sum, member) => {
    const contribution = BANK_CONTRIBUTIONS[member.active_plan]
    return sum + contribution
  }, 0)
  
  return {
    bank_a: bankA,
    bank_b: bankB,
    bank_total: bankA + bankB
  }
}
```

---

## 5. Rangos (7 niveles)

### 5.1. Tabla de Rangos

```typescript
interface RankRequirement {
  rank: 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7'
  min_bank_a: number
  min_bank_b: number
  min_bank_total: number
  
  // Pool participation
  can_earn_pools: string[]  // qué bolsas puede cobrar
}

const RANK_TABLE: RankRequirement[] = [
  {
    rank: 'R1',
    min_bank_a: 400,
    min_bank_b: 400,
    min_bank_total: 800,
    can_earn_pools: ['R1']
  },
  {
    rank: 'R2',
    min_bank_a: 1200,
    min_bank_b: 1200,
    min_bank_total: 2400,
    can_earn_pools: ['R2']
  },
  {
    rank: 'R3',
    min_bank_a: 5000,
    min_bank_b: 5000,
    min_bank_total: 10000,
    can_earn_pools: ['R3']
  },
  {
    rank: 'R4',
    min_bank_a: 12000,
    min_bank_b: 12000,
    min_bank_total: 24000,
    can_earn_pools: ['R4']
  },
  {
    rank: 'R5',
    min_bank_a: 25000,
    min_bank_b: 25000,
    min_bank_total: 50000,
    can_earn_pools: ['R4', 'R5']  // acumulable
  },
  {
    rank: 'R6',
    min_bank_a: 50000,
    min_bank_b: 50000,
    min_bank_total: 100000,
    can_earn_pools: ['R4', 'R5', 'R6']  // acumulable
  },
  {
    rank: 'R7',
    min_bank_a: 100000,
    min_bank_b: 100000,
    min_bank_total: 200000,
    can_earn_pools: ['R4', 'R5', 'R6', 'R7']  // acumulable
  }
]
```

### 5.2. Regla de Participación Acumulable

```javascript
const POOL_PARTICIPATION_RULES = {
  // R1-R3: solo su bolsa
  R1: ['R1'],
  R2: ['R2'],
  R3: ['R3'],
  
  // R4-R7: acumulable desde R4
  R4: ['R4'],
  R5: ['R4', 'R5'],
  R6: ['R4', 'R5', 'R6'],
  R7: ['R4', 'R5', 'R6', 'R7'],
  
  // Regla clave
  key_rule: 'R4+ NUNCA cobran R1-R3'
}
```

### 5.3. Rango Base vs Rango Pagable

```typescript
interface UserRank {
  user_id: string
  
  // Rango base (por Bank histórico)
  base_rank: 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7'
  
  // Rango pagable (limitado por plan)
  payable_rank: 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'inactive'
  
  // Plan activo
  active_plan: 'basic' | 'pro' | 'premium' | null
  
  // Degradación
  is_capped: boolean  // true si base > payable
  cap_reason?: string  // "Plan Básico activo (tope R3)"
  
  // Elegibilidad pool
  is_pool_eligible: boolean
  eligible_pools: string[]  // ['R4', 'R5'] etc
  
  updated_at: timestamp
}
```

**Plan limita el rango pagable:**

```javascript
// Nota: En implementación real, usar RANK_ORDER numérico para comparar (ej: order[R5] > order[R3]) en lugar de comparar strings literal.
function calculatePayableRank(user_id) {
  const baseRank = calculateBaseRank(user_id)
  const activePlan = getActivePlan(user_id)
  
  // Sin plan activo → no participa
  if (!activePlan || !activePlan.is_active) {
    return {
      base_rank: baseRank,
      payable_rank: 'inactive',
      is_capped: true,
      cap_reason: 'Sin plan activo'
    }
  }
  
  // Plan Básico → tope R3
  if (activePlan.plan === 'basic') {
    const payable = baseRank > 'R3' ? 'R3' : baseRank
    
    return {
      base_rank: baseRank,
      payable_rank: payable,
      is_capped: baseRank > 'R3',
      cap_reason: baseRank > 'R3' ? 'Plan Básico (tope R3)' : null
    }
  }
  
  // Pro/Premium → hasta tu base
  return {
    base_rank: baseRank,
    payable_rank: baseRank,
    is_capped: false,
    cap_reason: null
  }
}
```

---

## 6. Pool Semanal (60% del Beneficio)

### 6.1. Beneficio Admin

```typescript
interface WeeklyBenefit {
  week_key: string  // YYYY-Www (ISO week)
  pay_date: string  // miércoles YYYY-MM-DD
  
  // Admin define
  total_benefit_usd: number  // ej: 10,000
  
  // Cálculo automático
  total_to_distribute: number  // benefit * 0.60 = 6,000
  reserve: number  // benefit * 0.40 = 4,000
  
  status: 'draft' | 'executed' | 'reverted'
  
  created_at: timestamp
  executed_at?: timestamp
}
```

### 6.2. Porcentajes por Rango

```javascript
const POOL_PERCENTAGES = {
  R1: 0.12,  // 12% del beneficio semanal
  R2: 0.10,  // 10% del beneficio semanal
  R3: 0.07,  // 7% del beneficio semanal
  R4: 0.07,  // 7% del beneficio semanal
  R5: 0.07,  // 7% del beneficio semanal
  R6: 0.07,  // 7% del beneficio semanal
  R7: 0.10   // 10% del beneficio semanal
  // TOTAL: 60% del beneficio semanal
}

// Ejemplo con beneficio $10,000
const EXAMPLE_BUCKETS = {
  total_benefit: 10000,
  
  buckets: {
    R1: 10000 * 0.12,  // $1,200
    R2: 10000 * 0.10,  // $1,000
    R3: 10000 * 0.07,  // $700
    R4: 10000 * 0.07,  // $700
    R5: 10000 * 0.07,  // $700
    R6: 10000 * 0.07,  // $700
    R7: 10000 * 0.10   // $1,000
  },
  
  total_distributed: 6000  // 60%
}
```

### 6.3. Reparto de Bolsas

```typescript
interface PoolBucket {
  pool_run_id: string
  rank: string  // R1, R2, etc
  
  // Bucket
  bucket_amount: number       // ej: $1,200 para R1
  eligible_count: number      // cuántos usuarios elegibles
  per_user_amount: number     // bucket / eligible_count
  
  // Elegibles
  eligible_users: string[]    // user_ids
  
  created_at: timestamp
}
```

**Reglas de reparto:**

```javascript
const BUCKET_DISTRIBUTION = {
  // Cada bolsa se reparte en partes iguales
  distribution_method: 'equal_split',
  
  // Quién participa en cada bolsa
  bucket_R1: ['R1'],                    // solo R1
  bucket_R2: ['R2'],                    // solo R2
  bucket_R3: ['R3'],                    // solo R3
  bucket_R4: ['R4', 'R5', 'R6', 'R7'],  // R4+
  bucket_R5: ['R5', 'R6', 'R7'],        // R5+
  bucket_R6: ['R6', 'R7'],              // R6+
  bucket_R7: ['R7']                     // solo R7
}
```

**Ejemplo de cálculo:**

```javascript
function calculatePoolPayouts(week_id, benefit_usd) {
  const buckets = {}
  
  // Para cada rango
  for (const rank of ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7']) {
    const percentage = POOL_PERCENTAGES[rank]
    const bucketAmount = benefit_usd * percentage
    
    // Obtener elegibles para esta bolsa
    const eligible = getEligibleUsersForBucket(week_id, rank)
    
    // Calcular monto por usuario
    const perUser = eligible.length > 0 
      ? bucketAmount / eligible.length 
      : 0
    
    buckets[rank] = {
      rank,
      bucket_amount: bucketAmount,
      eligible_count: eligible.length,
      per_user_amount: perUser,
      eligible_users: eligible.map(u => u.user_id)
    }
  }
  
  return buckets
}
```

### 6.4. Elegibilidad por Miércoles

```typescript
interface PoolEligibility {
  user_id: string
  week_key: string
  
  // Requirements
  has_base_rank: boolean        // tiene rango por Bank
  has_payable_rank: boolean     // no capped por plan
  is_within_activation: boolean // dentro de 30 días
  passed_cutoff: boolean        // compra antes del cutoff
  
  // Cutoff único
  cutoff_datetime: timestamp  // miércoles 00:00 UTC semana anterior
  purchase_datetime: timestamp
  
  // Result
  is_eligible: boolean
  eligible_pools: string[]  // ['R4', 'R5'] etc
  
  // Reason if not eligible
  ineligibility_reason?: string
}
```

**Cutoff único:**

```javascript
function checkPoolEligibility(user_id, week_key) {
  const payDate = getPayDateForWeek(week_key)  // miércoles
  
  // Cutoff = miércoles 00:00 UTC semana anterior
  const cutoffDate = subtractDays(payDate, 7)
  cutoffDate.setUTCHours(0, 0, 0, 0)
  
  const purchase = getActivePurchase(user_id)
  
  // Checks
  const checks = {
    has_base_rank: hasRankByBank(user_id),
    has_payable_rank: !isRankCapped(user_id),
    is_within_activation: isWithin30Days(purchase.purchase_date),
    passed_cutoff: purchase.purchase_date < cutoffDate
  }
  
  const isEligible = Object.values(checks).every(v => v === true)
  
  return {
    user_id,
    week_key,
    ...checks,
    cutoff_datetime: cutoffDate,
    purchase_datetime: purchase.purchase_date,
    is_eligible: isEligible,
    eligible_pools: isEligible ? getEligiblePools(user_id) : [],
    ineligibility_reason: isEligible ? null : getIneligibilityReason(checks)
  }
}
```

---

## 7. Operación Admin (Módulo Dedicado)

// Admin-only (no UI usuario): esta sección es exclusiva del panel admin y no debe renderizar acciones en el HTML de usuario.

### 7.1. Dashboard Admin

```typescript
interface AdminDashboard {
  // Bank general (informativo)
  global_stats: {
    total_users: number
    total_bank_a: number
    total_bank_b: number
    total_bank: number
    
    users_by_rank: {
      R1: number
      R2: number
      R3: number
      R4: number
      R5: number
      R6: number
      R7: number
    }
  }
  
  // Próxima semana
  next_week: {
    week_key: string
    pay_date: string
    cutoff_datetime: timestamp
    eligible_count: number
    estimated_payout?: number
  }
  
  // Historial reciente
  recent_weeks: WeeklySummary[]
}
```

### 7.2. Crear Semana

```typescript
interface CreateWeekRequest {
  week_key: string  // YYYY-Www
  pay_date: string  // YYYY-MM-DD (miércoles)
  total_benefit_usd: number
}

interface CreateWeekResponse {
  week_id: string
  week_key: string
  pay_date: string
  
  // Cálculos
  total_benefit: number
  total_to_distribute: number  // 60%
  reserve: number              // 40%
  
  // Buckets calculados
  buckets: PoolBucket[]
  
  // Elegibles
  total_eligible: number
  eligible_by_rank: { [rank: string]: number }
  
  status: 'draft'
}
```

### 7.3. Simular Reparto

```typescript
interface SimulationResult {
  week_id: string
  
  // Input
  total_benefit: number
  
  // Buckets
  buckets: {
    rank: string
    bucket_amount: number
    eligible_count: number
    per_user_amount: number
  }[]
  
  // Totals
  total_distributed: number
  total_reserve: number
  
  // Per user preview
  sample_users: {
    user_id: string
    base_rank: string
    payable_rank: string
    pools_earned: string[]
    total_amount: number
    breakdown: { [pool: string]: number }
  }[]
}
```

### 7.4. Ejecutar Dispersión

```typescript
interface ExecuteDispersionRequest {
  week_id: string
  confirm: boolean
}

interface ExecuteDispersionResponse {
  week_id: string
  executed_at: timestamp
  
  // Results
  total_payouts: number
  total_amount_distributed: number
  
  // Breakdown
  payouts_by_rank: {
    rank: string
    count: number
    total_amount: number
  }[]
  
  // Ledger entries created
  ledger_entries: number
  
  // Errors (if any)
  errors: {
    user_id: string
    error: string
  }[]
  
  status: 'executed'
}
```

### 7.5. Reversar Semana

```typescript
interface RevertWeekRequest {
  week_id: string
  reason: string
  admin_user_id: string
}

interface RevertWeekResponse {
  week_id: string
  reverted_at: timestamp
  reverted_by: string
  reason: string
  
  // What was reverted
  payouts_reverted: number
  total_amount_reverted: number
  
  // What was NOT reverted
  bank_untouched: true
  ranks_untouched: true
  
  status: 'reverted'
}
```

**Alcance de reversa:**

```javascript
const REVERSAL_SCOPE = {
  // SÍ revierte
  reverts: [
    'weekly_pool_payouts (contabilidad)',
    'ledger_entries (movimientos)',
    'wallet_balances (ajustes)'
  ],
  
  // NO revierte
  does_not_revert: [
    'bank_histórico',
    'base_ranks',
    'team_structure'
  ],
  
  // Trazabilidad
  audit: {
    who: 'admin_user_id',
    when: 'reverted_at',
    why: 'reason',
    what: 'week_key + payouts'
  }
}
```

---

## 8. Idempotencia y Trazabilidad

### 8.1. Idempotencia Comisiones Directas

```javascript
// Clave idempotente: subscription_id
const IDEMPOTENCY_DIRECT = {
  key: 'subscription_id',
  rule: '1 compra = 1 comisión',
  
  validation: async (subscription_id) => {
    const existing = await db.query(
      'SELECT * FROM referral_commissions WHERE subscription_id = ?',
      [subscription_id]
    )
    
    if (existing) {
      return { exists: true, commission: existing }
    }
    
    return { exists: false }
  }
}
```

### 8.2. Idempotencia Payout Semanal

```javascript
// Clave idempotente: week_key + user_id
const IDEMPOTENCY_POOL = {
  key: 'week_key + user_id',
  rule: '1 semana = 1 payout por usuario',
  
  validation: async (week_key, user_id) => {
    const existing = await db.query(
      'SELECT * FROM weekly_pool_user_payouts WHERE week_key = ? AND user_id = ?',
      [week_key, user_id]
    )
    
    if (existing) {
      return { exists: true, payout: existing }
    }
    
    return { exists: false }
  }
}
```

### 8.3. Auditoría Completa

```typescript
interface AuditLog {
  audit_id: string
  event_type: AuditEventType
  
  // Who
  actor_type: 'user' | 'admin' | 'system'
  actor_id: string
  
  // What
  action: string
  target_type: string
  target_id: string
  
  // Details
  old_value?: any
  new_value?: any
  
  // Context
  week_key?: string
  amount?: number
  
  // When
  created_at: timestamp
}

enum AuditEventType {
  COMMISSION_CREATED = 'commission_created',
  COMMISSION_PAID = 'commission_paid',
  COMMISSION_REVERSED = 'commission_reversed',
  
  WEEK_CREATED = 'week_created',
  WEEK_EXECUTED = 'week_executed',
  WEEK_REVERTED = 'week_reverted',
  
  RANK_CHANGED = 'rank_changed',
  BANK_UPDATED = 'bank_updated',
  
  BONUS_GRANTED = 'bonus_granted'
}
```

---

## 9. Pantallas UI (Usuario)

// Ruta principal del módulo: /referrals abre siempre "Resumen (Overview)" (no Directos)

### 9.1. Resumen (Overview)

// Nota: Esta vista puede consumir un único endpoint agregado (/referrals/summary) o llamar 3–4 endpoints en paralelo para evitar mezclar responsabilidades en frontend.

```typescript
interface ResumenPage {
  // Convención de moneda y unidades internas
  currency_convention_note: {
    ui_currency: 'USD',
    bank_is_internal_units: true,
    message: 'La UI muestra montos en USD; el “Bank” son unidades internas para rangos y no es dinero retirable.'
  }
  
  // Header
  page_title: "Referidos"

  // Estado inicial del usuario (NUX)
  user_state: {
    user_referral_state: 'new' | 'active'
    has_team_selected: boolean
    has_referrals: boolean
    has_active_plan: boolean
    prompts: {
      team_selector_required: boolean
      invite_cta_visible: boolean
      pool_ineligibility_notice_visible: boolean
    }
  }

  // TARJETA: Tu situación actual (arriba del todo)
  status_card: {
    title: "Tu situación actual"
    current_rank: string         // ej: "R2"
    is_eligible_this_week: boolean
    reason_if_not_eligible?: string  // ej: "Te falta plan activo"
    next_pay_day_label: string   // "Próximo pago: Miércoles"
    what_to_do: {                // recomendación accionable
      text: string               // "Activar plan"
      action: 'navigate_to_store' | 'invite_referrals' | 'choose_team'
    }
  }
  
  // Quick access al link/código de referido (copiar)
  referral_quick_access: {
    referral_code: string
    referral_url: string
    actions: { copy_link: boolean; copy_code: boolean }
  }
  
  // Balances de wallet de referidos en el dashboard
  wallet_balances: {
    pending_balance: number
    available_balance: number
    paid_balance: number
  }
  
  // Bloque mini: Mi estado de elegibilidad
  eligibility_block: {
    active_30d: boolean
    base_rank: string
    payable_rank: string
    eligible_pools_this_week: string[]
  }

  // Contador de cutoff (visible)
  weekly_countdown: {
    week_key: string
    cutoff_datetime: timestamp
    countdown: string  // ej: "2d 4h 21m"
    label: "Participas esta semana en el pool"
    timezone_display: {
      primary: 'UTC',
      secondary_local: 'America/Bogota'
    }
  }
  
  // 4 KPI Cards
  cards: {
    directos: {
      title: "Directos (10%)"
      icon: "👥"
      stats: {
        total_referrals: number
        active_referrals: number
        total_commissions: number
        available_balance: number
      }
      cta: {
        text: "Invitar Ahora"
        action: "copy_referral_link"
      }
      note: "10% sobre pago real (sin bonos/créditos/pruebas)"
    }
    
    equipo_binario: {
      title: "Equipo Binario (A/B)"
      icon: "🏛️"
      stats: {
        bank_a: number
        bank_b: number
        bank_total: number
        team_a_members: { direct: number, indirect: number }
        team_b_members: { direct: number, indirect: number }
      }
      progress: {
        current_rank: string
        next_rank: string
        progress_percent: number
        both_teams_requirement: string  // "A y B deben cumplir"
      }
      note: "El binario no paga comisión por compra, solo rangos"
    }
    
    rango: {
      title: "Rango"
      icon: "🏆"
      stats: {
        base_rank: string
        payable_rank: string
        is_capped: boolean
        cap_message?: string  // "Plan Básico activo (tope R3)"
      }
      upgrade_cta?: {
        visible: boolean
        text: "Sube a Pro para desbloquear R4-R7"
        action: "navigate_to_store"
      }
    }
    
    proximo_pool: {
      title: "Próximo Pool Semanal"
      icon: "💰"
      stats: {
        week_key: string  // "2026-W06"
        pay_date: string  // "12 Feb 2026"
        is_eligible: boolean
        eligible_pools: string[]  // ["R4", "R5"]
        estimated_amount?: number
      }
      cutoff: {
        datetime: timestamp
        countdown: string  // "Faltan 2 días 5h"
        label: "Cutoff: miércoles 00:00 UTC semana anterior"
        tooltip: "Cómo se calcula"
      }
    }
  }
  
  // Cómo ganas dinero aquí (bloque obligatorio, 3 líneas)
  how_it_works: {
    items: [
      "Directos → ganas 10% inmediato",
      "Equipo → subes rango (no paga compra)",
      "Pool → cobras por rango semanal"
    ]
  }
}
```

### 9.2. Directos (10%)

```typescript
interface DirectosPage {
  // Sección A: Mi Link
  referral_link_section: {
    title: "Mi Link de Referido"
    referral_code: string  // "TR-A1B2C3"
    referral_url: string
    
    actions: {
      copy_link: boolean
      copy_code: boolean
      share_whatsapp: boolean
      share_telegram: boolean
      share_email: boolean
    }
    
    stats: {
      clicks: number
      signups: number
      conversions: number
      conversion_rate: number
    }
    
    note: "1 compra = 1 comisión (idempotencia por subscription_id)"
  }
  
  // Tabs internos para separar personas vs dinero
  tabs: ['Mis Referidos', 'Mis Comisiones']
  
  // Sección B: Mis Directos (tabla, centrada en personas)
  direct_referrals_table: {
    columns: [
      { key: 'referred_user', label: 'Referido' },
      { key: 'plan', label: 'Plan' },
      { key: 'activation_status', label: 'Estado' },
      { key: 'purchase_date', label: 'Fecha Compra' },
      { key: 'commission_amount', label: 'Comisión (10%)' },
      { key: 'status', label: 'Estado' }
    ]
    
    rows: {
      referred_user: string  // "Carlos M." (parcial)
      plan: 'Basic' | 'Pro' | 'Premium'
      activation_status: 'Activa' | 'Vencida'
      purchase_date: string
      commission_amount: number
      status: 'Pending' | 'Available' | 'Paid' | 'Reversed'
      status_badge_color: string
      details_link?: string   // ver historial de esa persona
    }[]
  }
  
  // NUEVO: Vista detalle por persona (historial)
  person_history_view?: {
    person_name: string
    person_id: string
    timeline: {
      date: string
      event: 'signup' | 'purchase' | 'upgrade' | 'refund'
      plan?: 'Basic' | 'Pro' | 'Premium'
      amount_paid?: number
      your_commission?: number  // 10%
      status?: 'Pending' | 'Available' | 'Paid' | 'Reversed'
    }[]
    totals: {
      purchases_count: number
      total_amount_paid: number
      total_commission_earned: number
    }
  }
  
  // Tabla B: Mis Comisiones (dinero)
  commissions_table: {
    columns: [
      { key: 'date', label: 'Fecha' },
      { key: 'subscription_id', label: 'Subscription ID' },
      { key: 'amount_paid', label: 'Monto Pagado' },
      { key: 'commission_10', label: '10%' },
      { key: 'status', label: 'Estado' }
    ]
    rows: {
      date: string
      subscription_id: string
      amount_paid: number
      commission_10: number
      status: 'Pending' | 'Available' | 'Paid' | 'Reversed'
    }[]
    note: '10% solo sobre pago real (no bonos/créditos/pruebas)'
  }
  
  // UX Privacidad en tablas
  privacy_rules: {
    names_display: 'partial'          // ej: "Carlos M."
    email_display: 'hidden_full'      // nunca mostrar email completo
  }
  
  // Sección C: Reglas claras
  rules_section: {
    title: "Reglas Claras"
    rules: [
      "✅ 10% del pago real confirmado",
      "❌ No aplica a bonos, créditos regalados o pruebas",
      "💰 Se refleja en Wallet de referidos (separada del balance operativo)",
      "🔄 Puedes retirar, convertir a créditos o pagar planes",
      "🔎 Sin límite de cantidad de directos; el límite de 2 aplica solo al árbol binario A/B (estructura)"
    ]
  }
}
```

### 9.3. Equipo A / Equipo B

```typescript
interface EquipoPage {
  // Tabs
  tabs: ['Equipo A', 'Equipo B']
  
  // Selector de equipo (solo visible si aún no eligió)
  team_selector: {
    visible: boolean
    options: ['A', 'B']
    chosen?: 'A' | 'B'
  }
  
  // Contadores por lado (directos/indirectos)
  side_counters: {
    A: { direct: number; indirect: number }
    B: { direct: number; indirect: number }
  }
  
  // Barras visuales de progreso por rango (lado A y B)
  rank_progress_bars: {
    next_rank: string                 // ej: "R3"
    requirements: { min_bank_a: number; min_bank_b: number; min_bank_total: number }
    progress_by_side: {
      A: { current: number; required: number; percent: number; bar_label: string } // "800 / 1200"
      B: { current: number; required: number; percent: number; bar_label: string } // "600 / 1200"
    }
    note: "El rango depende de ambos lados (A y B deben cumplir)"
  }
  
  // Por cada equipo
  team_view: {
    // KPIs
    kpis: {
      direct_count: number
      indirect_count: number
      total_count: number
      bank: number  // Bank A o Bank B
    }
    
    // Tree view (opcional)
    tree?: {
      user_id: string
      name: string // usar alias o nombre parcial (nunca nombre completo)
      plan: string
      contribution: number
      children: TreeNode[]
    }
    
    // Lista simple (alternativa)
  members_list?: {
      member_id: string
      name: string
      plan: string
      contribution: number
      is_direct: boolean
      joined_date: string
    }[]
  }
  
  // UX Privacidad (Equipo)
  privacy_rules: {
    names_display: 'partial'
    email_display: 'hidden_full'
  }
  
  // Mini-bloque: Aportes por plan (tabla)
  aportes_por_plan_table: {
    rows: {
      plan: 'Básica' | 'Pro' | 'Premium'
      aporte_bank: number // Básica +20, Pro +80, Premium +500
    }[]
  }
  
  // Bank histórico (panel)
  bank_section: {
    title: "Bank (Histórico)"
    stats: {
      bank_a: number
      bank_b: number
      bank_total: number
    }
    
    contributions_info: {
      basic: "+20 por compra",
      pro: "+80 por compra",
      premium: "+500 por compra"
    }
    
    note: "El Bank no se borra, no se consume; sirve para rangos"
  }
  
  // Rangos (tabla ladder)
  ranks_section: {
    title: "Rangos (Base vs Pagable)"
    
    ladder: {
      rank: string
      min_bank_a: number
      min_bank_b: number
      min_bank_total: number
      your_progress: number  // %
      is_achieved: boolean
      can_earn_pools: string[]
    }[]
    
    current_rank: {
      base: string
      payable: string
      is_capped: boolean
      cap_reason?: string
    }
    
    rules: [
      "R4-R7 cobran bolsas acumuladas y nunca R1-R3",
      "Plan Básico: tope R3",
      "Pro/Premium: hasta tu base"
    ]
  }
  
  // Pool semanal (qué me toca)
  pool_section: {
    title: "Pool Semanal"
    
    explanation: "60% del beneficio se reparte por rangos"
    
    your_pools: {
      current_rank: string
      pools_you_earn: string[]  // ["R4", "R5"]
      example: "Si eres R5 cobras R4 + R5"
    }
    
    eligibility: {
      is_eligible: boolean
      activation_days_left: number
      cutoff_datetime: timestamp
      cutoff_label: "Cutoff: miércoles 00:00 UTC semana anterior"
      timezone_display: {
        primary: 'UTC',
        secondary_local: 'America/Bogota'
      }
    }
  }
}
```

### 9.4. Pagos (Historial)

```typescript
interface PagosPage {
  // Tabs
  tabs: [
    { key: 'directos', label: 'Comisiones Directas' },
    { key: 'pool', label: 'Pool Semanal' }
  ]
  
  // Nota de separación de economías
  economies_note: {
    directos: "Dinero inmediato por compra (10%)"
    pool: "Distribución semanal por rango (no depende de compras puntuales)"
  }
  
  // Wallet balance (arriba)
  wallet_summary: {
    pending_balance: number
    available_balance: number
    total_earned: number
    total_withdrawn: number
  }
  
  // Actions (solo UI)
  actions: {
    withdraw: {
      visible: boolean
      enabled: boolean
      min_amount: number
    }
    convert_to_credits: {
      visible: boolean
      enabled: boolean
    }
    pay_plan: {
      visible: boolean
      enabled: boolean
    }
  }
  
  // Tabla de pagos
  payments_table: {
    columns: [
      { key: 'date', label: 'Fecha' },
      { key: 'type', label: 'Tipo' },
      { key: 'amount', label: 'Monto' },
      { key: 'status', label: 'Estado' },
      { key: 'reference', label: 'Referencia' },
      { key: 'actions', label: 'Acciones' }
    ]
    
    rows: {
      date: string
      type: 'Comisión Directa' | 'Pool Semanal' | 'Bono Admin'
      amount: number
      status: 'Pending' | 'Available' | 'Paid' | 'Reversed'
      reference: string  // subscription_id (directo) o week_key (pool)
      details_link?: string // "Ver detalle"
    }[]
    
    pagination: {
      page: number
      per_page: number
      total: number
    }
  }
  
  // Modal UI para ver detalles (sin datos admin)
  details_modal?: {
    visible: boolean
    title: string // "Detalle de pago"
    content: {
      type: 'direct' | 'pool'
      // direct: usar subscription_id y breakdown de pago real y 10%
      direct?: { subscription_id: string; amount_paid: number; commission_10: number }
      // pool: usar week_key y breakdown por rango
      pool?: { week_key: string; rank: string; bucket_amount: number; per_user_amount: number }
    }
  }
  
  // Export
  export_csv: {
    visible: boolean
    action: "download_csv"
    note: "Solo historial propio; sin datos sensibles de terceros; requiere auth + rate limit"
  }
}
```

---

## 10. Mejoras Adicionales (Sin Salir de Contexto)

### 10.1. Separación Visual Fuerte

```javascript
/**
 * Evitar confusión de MLM tradicional
 * Separar claramente: Directos (ganas) vs Equipo (subes rango)
 */
const VISUAL_SEPARATION = {
  // Color coding
  directos: {
    primary_color: 'green',  // comisiones = dinero directo
    icon: '💵',
    message: 'Ganas por referidos directos'
  },
  
  equipo: {
    primary_color: 'gold',   // rangos = logros
    icon: '🏆',
    message: 'Subes de rango por equipo'
  },
  
  // UI placement
  layout: 'separate_tabs_or_sections',
  
  // Messaging
  avoid_terms: ['multinivel', 'network marketing', 'MLM'],
  use_terms: ['referidos', 'equipo', 'rangos', 'pool']
}
```

### 10.2. Cutoff Countdown

```javascript
/**
 * Mostrar countdown al cutoff en tiempo real
 * Reduce tickets de soporte sobre elegibilidad
 */
function CutoffCountdown({ week_key }) {
  const payDate = getPayDateForWeek(week_key)
  const cutoffDate = subtractDays(payDate, 7)
  cutoffDate.setUTCHours(0, 0, 0, 0)
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(cutoffDate))
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(cutoffDate))
    }, 1000)
    
    return () => clearInterval(timer)
  }, [cutoffDate])
  
  return (
    <div className="cutoff-countdown">
      <div className="label">Cutoff para {week_key}</div>
      <div className="countdown">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </div>
      <div className="note">
        Compra antes del cutoff para participar este miércoles
      </div>
    </div>
  )
}
```

### 10.3. Plan Cap Nudge

```javascript
/**
 * Si base_rank > payable_rank (por plan básico)
 * Mostrar nudge para upgrade
 */
function RankCapNudge({ base_rank, payable_rank, active_plan }) {
  const isCapped = RANK_ORDER[base_rank] > RANK_ORDER[payable_rank]
  
  if (!isCapped) return null
  
  const unlockedRanks = RANK_ORDER.slice(
    RANK_ORDER.indexOf(payable_rank) + 1,
    RANK_ORDER.indexOf(base_rank) + 1
  )
  
  return (
    <div className="rank-cap-nudge">
      <div className="icon">⚠️</div>
      <div className="message">
        <strong>Tu rango está limitado por tu plan</strong>
        <p>
          Tienes rango {base_rank} pero solo puedes cobrar hasta {payable_rank} 
          porque tienes Plan Básico.
        </p>
        <p>
          Sube a Pro para desbloquear: {unlockedRanks.join(', ')}
        </p>
      </div>
      <button className="upgrade-cta" onClick={() => navigate('/store')}>
        Ver Planes
      </button>
    </div>
  )
}
```

### 10.4. Idempotencia Visible

```javascript
/**
 * En UI de Directos, explicar que 1 compra = 1 comisión
 * Evita confusión sobre duplicados
 */
const IDEMPOTENCY_EXPLAINER = {
  title: "¿Cómo se generan las comisiones?",
  
  explanation: `
    Cada compra de tu referido genera UNA comisión automáticamente.
    
    • 1 compra = 1 comisión (10%)
    • No hay duplicados
    • Identificamos por subscription_id único
    • Si hay reintento de pago, no genera comisión extra
  `,
  
  icon: '🔒',
  placement: 'info_tooltip_in_directos_page'
}
```

### 10.5. Export CSV (Historial Propio)

```javascript
/**
 * Permitir exportar historial de pagos
 * Útil para usuarios y soporte
 */
async function exportPaymentsCSV(user_id, type = 'all') {
  const payments = await getPayments(user_id, { type })
  
  const csv = [
    // Header
    ['Fecha', 'Tipo', 'Monto', 'Estado', 'Referencia'].join(','),
    
    // Rows
    ...payments.map(p => [
      formatDate(p.date),
      p.type,
      p.amount,
      p.status,
      p.reference
    ].join(','))
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  
  // Trigger download
  const link = document.createElement('a')
  link.href = url
  link.download = `referidos_${user_id}_${Date.now()}.csv`
  link.click()
}
```

### 10.6. Glosario Mini

```typescript
/**
 * Definiciones rápidas de términos clave
 * Tooltip o modal en UI
 */
const GLOSSARY = {
  bank: {
    term: 'Bank',
    definition: 'Acumulado histórico de tu equipo. Nunca se borra ni consume. Sirve solo para calificar rangos.',
    example: 'Bank A: 1200 units + Bank B: 1500 units = Bank Total: 2700 units'
  },
  
  rango_base: {
    term: 'Rango Base',
    definition: 'Rango que alcanzaste por tu Bank histórico. No depende de tu plan mensual.',
    example: 'Si tienes Bank suficiente, eres R5 (base)'
  },
  
  rango_pagable: {
    term: 'Rango Pagable',
    definition: 'Rango máximo que puedes cobrar según tu plan activo. Plan Básico limita a R3.',
    example: 'Base R5 + Plan Básico = Pagable R3'
  },
  
  week_key: {
    term: 'Week Key',
    definition: 'Identificador único de semana ISO (YYYY-Www). Ejemplo: 2026-W06 es la semana 6 de 2026.',
    example: '2026-W06 → Pay date: miércoles 12 Feb'
  },
  
  cutoff: {
    term: 'Cutoff',
    definition: 'Fecha límite para participar en pool semanal. Es el miércoles 00:00 UTC de la semana anterior al pago.',
    example: 'Si cutoff es 5 Feb y compras el 6 Feb, NO participas ese miércoles (12 Feb)'
  }
}
```

---

## 11. API Endpoints (MVP)

```typescript
// Referral Link
GET /referrals/link
Response: {
  referral_code: string
  referral_url: string
  stats: {
    clicks: number
    signups: number
    conversions: number
  }
}

// Directos
GET /referrals/direct
Response: {
  total_referrals: number
  active_referrals: number
  referrals: DirectReferral[]
  wallet: ReferralWallet
}

// Equipo
GET /referrals/team
Query: { team: 'A' | 'B' }
Response: {
  team: 'A' | 'B'
  direct_count: number
  indirect_count: number
  bank: number
  members: TeamMember[]
}

// Rango
GET /referrals/rank
Response: {
  base_rank: string
  payable_rank: string
  is_capped: boolean
  cap_reason?: string
  next_rank: string
  progress: number
}

// Pool Elegibilidad
GET /referrals/pool/eligibility
Query: { week_key: string }
Response: {
  is_eligible: boolean
  eligible_pools: string[]
  cutoff_datetime: timestamp
  ineligibility_reason?: string
}

// Pagos
GET /referrals/payments
Query: {
  type?: 'direct' | 'pool' | 'all'
  status?: string
  page?: number
}
Response: {
  payments: Payment[]
  pagination: Pagination
  wallet_summary: WalletSummary
}

// Export CSV
GET /referrals/export
Query: { type: 'all' | 'direct' | 'pool' }
Response: CSV file download
```

---

## 12. Referencias

- **Store**: store.md (Planes, Precios)
- **Bankroll**: bankroll.md (Balance separado)
- **Data Model**: DATA-MODEL.md (Tablas completas)
- **API Spec**: API-SPEC.md (Endpoints detallados)

---

**Versión:** 1.0  
**Última actualización:** 2025-02-08  
**Autor:** Sistema Trader Deportivo  
**Estado:** Documentación Oficial

---

## 🔍 ANÁLISIS CRÍTICO - Módulo Referidos

### ✅ Funcionalidades Implementadas en referidos.html

**Estructura General:**
- ✅ Sistema de tabs funcionales (Resumen, Directos, Equipo, Pagos)
- ✅ Panel dual innovador para Directos vs Equipo A/B
- ✅ Integración completa con el sidebar de navegación
- ✅ Sistema de compartir en redes sociales (WhatsApp, Telegram, Email)
- ✅ Funcionalidad de copiar link y código de referido
- ✅ Contador de countdown para pool semanal
- ✅ Cards de KPI con métricas clave
- ✅ Sistema de filtros en tabla de pagos (Todos/Directos/Pool)
- ✅ Responsive design con menú hamburguesa para móvil
- ✅ Sistema de badges y tooltips informativos

**Componentes Específicos:**
- ✅ Progress ring visual para rango actual (R2)
- ✅ Tabla de referidos directos con estado y comisión
- ✅ Selector de equipo A/B con explicación
- ✅ Wallet de referidos con balances separados
- ✅ Exportación CSV de pagos
- ✅ Sistema de toast notifications
- ✅ Integración con localStorage para estado

### ⚠️ Problemas de Alineación Visual

**Inconsistencias de Diseño:**
- 🔸 Alturas de cards no uniformes en el panel dual
- 🔸 Espaciado irregular entre elementos de estadísticas
- 🔸 Tamaños de fuente inconsistentes entre tabs
- 🔸 Colores de bordes y sombras no estandarizados
- 🔸 Problemas de overflow en móvil en tablas complejas
- 🔸 Iconos no alineados verticalmente en algunos botones

**Problemas de Layout:**
- 🔸 Grid responsive no optimizado para tablets
- 🔸 Scroll horizontal no deseado en vista de equipo
- 🔸 Cards de progreso con anchos variables
- 🔸 Inconsistencia en bordes redondeados entre componentes

### 🚨 Problemas Críticos de Funcionalidad

**Datos Estáticos:**
- 🔴 **Todos los datos están hardcodeados** - No hay integración con backend
- 🔴 **Sin sistema de autenticación real** - No valida usuario actual
- 🔴 **Sin persistencia de datos** - No guarda cambios de estado
- 🔴 **Sin integración con API** - No consume endpoints documentados

**Funcionalidades Incompletas:**
- 🔴 **Sistema de referidos no funcional** - Links no generan tracking real
- 🔴 **Comisiones no calculadas** - Sin lógica de negocio para 10%
- 🔴 **Pool semanal sin implementar** - Sin cálculo de elegibilidad
- 🔴 **Sistema de rangos estático** - Sin actualización dinámica
- 🔴 **Bank histórico fijo** - Sin acumulación real de volumen

**Integraciones Faltantes:**
- 🔴 **Sin conexión a base de datos** - No persiste información
- 🔴 **Sin sistema de notificaciones** - No alerta de nuevas comisiones
- 🔴 **Sin validación de planes** - No verifica elegibilidad por plan activo
- 🔴 **Sin sistema de pagos** - No procesa retiros o conversiones

### 📊 Brecha Documentación vs Implementación

**Elementos Documentados pero No Implementados:**
- 🔴 **Idempotencia de comisiones** - Sin prevención de duplicados
- 🔴 **Sistema anti-fraude** - Sin ventana de 24h para disponibilidad
- 🔴 **Auditoría y logs** - Sin tracking de cambios
- 🔴 **Recálculo automático de rangos** - Sin triggers de actualización
- 🔴 **Gestión de refunds** - Sin reversión de comisiones

**API Endpoints Documentados pero No Consumidos:**
- 🔴 `GET /referrals/link` - Sin generación dinámica de links
- 🔴 `GET /referrals/direct` - Sin datos de referidos reales
- 🔴 `GET /referrals/team` - Sin información de equipo A/B
- 🔴 `GET /referrals/rank` - Sin cálculo de progreso de rango
- 🔴 `GET /referrals/payments` - Sin historial de pagos real

### 🎯 Conclusión

El módulo de **Referidos** presenta una **implementación visualmente atractiva pero funcionalmente incompleta**. Aunque el HTML demuestra un diseño sofisticado con innovaciones visuales como el panel dual y el progress ring, **carece completamente de funcionalidad real**.

**Puntos Fuertes:**
- Excelente diseño UI/UX con innovaciones visuales
- Estructura bien organizada y responsive
- Sistema de navegación intuitivo
- Claridad en la distinción entre Directos y Equipo A/B

**Puntos Críticos:**
- **Gap total entre documentación y implementación** - 90% de la funcionalidad documentada no está implementada
- **Sin backend integration** - Imposible usar en producción
- **Datos completamente estáticos** - Sin valor operativo real
- **Sin sistema de tracking** - Los links de referido no funcionan

**Recomendación:** Se requiere **desarrollo completo del backend** con integración de APIs, sistema de tracking de referidos, cálculo de comisiones, gestión de rangos y pool semanal para hacer este módulo funcional. El diseño UI está listo, pero la funcionalidad es esencialmente un mockup visual sin valor operativo.


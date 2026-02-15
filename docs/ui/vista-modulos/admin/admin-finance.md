### Interfaces Principales

```typescript
// Información general del módulo
interface AdminFinanceModule {
  id: 'finance';
  name: 'Finanzas';
  route: '/admin/finance';
  description: 'Panel de contabilidad operativa y conciliación financiera';
  icon: '💰';
  accentColor: '#059669';
  priority: 'critical';
  permissions: ['admin', 'finance_manager', 'compliance_officer'];
}

// Header del módulo
interface AdminFinanceHeader {
  title: string;
  subtitle: string;
  kpis: FinanceKPIs;
  alerts: FinanceAlert[];
  controls: {
    refresh: {
      label: string;
      loading: boolean;
      onClick: () => void;
    };
    export: {
      label: string;
      formats: Array<'csv' | 'pdf' | 'json'>;
      onClick: (format: string) => void;
    };
    reconciliation: {
      label: string;
      onClick: () => void;
      disabled: boolean;
    };
  };
}

// Layout principal
interface AdminFinanceLayout {
  tabs: FinanceTabs;
  filters: FinanceFilters;
  widgets: FinanceWidget[];
  reconciliationStatus: ReconciliationStatus;
}

// Configuración de tabs
interface FinanceTabs {
  overview: {
    key: 'overview';
    label: 'Resumen Ejecutivo';
    icon: '📊';
    description: 'KPIs principales y estado financiero';
  };
  wallet: {
    key: 'wallet';
    label: 'Wallet';
    icon: '👛';
    description: 'Transacciones de billetera de usuarios';
  };
  ledger: {
    key: 'ledger';
    label: 'Ledger';
    icon: '📒';
    description: 'Asientos contables del sistema';
  };
  reconciliation: {
    key: 'reconciliation';
    label: 'Conciliación';
    icon: '⚖️';
    description: 'Comparación wallet vs ledger vs provider';
  };
  exposure: {
    key: 'exposure';
    label: 'Exposición';
    icon: '📈';
    description: 'Riesgo y exposición de la casa';
  };
  providerSettlement: {
    key: 'provider-settlement';
    label: 'Provider Settlement';
    icon: '🏦';
    description: 'Liquidación con proveedores';
  };
  audit: {
    key: 'audit';
    label: 'Auditoría';
    icon: '🔍';
    description: 'Registro de auditoría financiera';
  };
  dailyClose: {
    key: 'daily-close';
    label: 'Cierre Diario';
    icon: '📅';
    description: 'Proceso de cierre diario';
  };
  riskGuard: {
    key: 'risk-guard';
    label: 'Risk Guard';
    icon: '🛡️';
    description: 'Controles de riesgo automáticos';
  };
}

// KPIs principales
interface FinanceKPIs {
  totalReserved: {
    value: number;
    currency: string;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  totalLocked: {
    value: number;
    currency: string;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  availableBalance: {
    value: number;
    currency: string;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  withdrawableBalance: {
    value: number;
    currency: string;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  userPnLToday: {
    value: number;
    currency: string;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  housePnLToday: {
    value: number;
    currency: string;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  pendingReconciliation: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  disputedBets: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
}
```

### Interfaces de Filtros y Transacciones

```typescript
// Filtros avanzados
interface FinanceFilters {
  userId: string;
  provider: 'all' | 'cloudbet' | 'stake' | 'pinnacle' | 'betfair' | 'custom';
  currency: 'all' | 'USDT' | 'BTC' | 'USD' | 'mBTC';
  status: 'all' | 'reserved' | 'locked' | 'provider_settled' | 'settlement_pending' | 'credited' | 'debited' | 'released' | 'cashout' | 'withdrawable' | 'reversed';
  settlementStatus: 'all' | 'pending' | 'settled' | 'disputed' | 'corrected';
  dateRange: {
    from: string;
    to: string;
  };
  betId: string;
  signalId: string;
  reconciliationStatus: 'all' | 'matched' | 'mismatch' | 'missing_wallet' | 'missing_ledger' | 'provider_mismatch';
  amountRange: {
    min?: number;
    max?: number;
  };
}

// Transacción de wallet
interface WalletTransaction {
  id: string;
  timestamp: string;
  user_id: string;
  bet_id: string;
  type: 'bet_stake' | 'bet_win' | 'bet_refund' | 'bet_cashout';
  amount: number;
  currency: string;
  balance_before: number;
  balance_after: number;
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  metadata?: Record<string, any>;
}

// Transacción de ledger
interface LedgerTransaction {
  id: string;
  timestamp: string;
  bet_id: string;
  type: 'stake_reserve' | 'stake_release' | 'win_credit' | 'loss_debit' | 'cashout';
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'reversed';
  reference_id: string;
  metadata?: Record<string, any>;
}

// Estado de reconciliación
interface ReconciliationStatus {
  totalTransactions: number;
  matched: number;
  mismatched: number;
  missingWallet: number;
  missingLedger: number;
  providerMismatches: number;
  lastChecked: string;
  healthScore: number; // 0-100
}

// Exposición financiera
interface FinancialExposure {
  totalExposure: number;
  byProvider: Array<{
    provider: string;
    exposure: number;
    liability: number;
    potentialPayout: number;
  }>;
  byUser: Array<{
    userId: string;
    exposure: number;
    liability: number;
  }>;
  riskAlerts: Array<{
    type: 'provider_exceeded' | 'user_exceeded' | 'total_exceeded';
    threshold: number;
    current: number;
    severity: 'warning' | 'critical';
  }>;
}

// Estado de provider settlement
interface ProviderSettlement {
  betId: string;
  userId: string;
  provider: string;
  providerResult: 'WIN' | 'LOSS' | 'VOID' | 'PENDING';
  systemResult: 'WIN' | 'LOSS' | 'VOID' | 'PENDING';
  providerOdds: number;
  systemOdds: number;
  match: boolean;
  status: 'pending' | 'investigating' | 'resolved' | 'disputed';
  action?: 'force_settlement' | 'manual_correction' | 'provider_escalation';
  lastUpdated: string;
}
```

### Interfaces de Componentes

```typescript
// Componente de tabla de transacciones
interface TransactionsTable {
  data: (WalletTransaction | LedgerTransaction)[];
  type: 'wallet' | 'ledger';
  columns: Array<{
    key: string;
    label: string;
    sortable: boolean;
    formatter?: (value: any, row: any) => string;
  }>;
  loading: boolean;
  pagination: {
    current: number;
    total: number;
    pageSize: number;
  };
  filters: FinanceFilters;
  onFilterChange: (filters: FinanceFilters) => void;
}

// Componente de reconciliación
interface ReconciliationPanel {
  status: ReconciliationStatus;
  mismatches: Array<{
    betId: string;
    type: 'wallet_ledger' | 'provider_system' | 'missing_transaction';
    walletAmount?: number;
    ledgerAmount?: number;
    providerResult?: string;
    systemResult?: string;
    difference: number;
    status: 'pending' | 'investigating' | 'resolved';
  }>;
  actions: Array<{
    key: 'mark_investigated' | 'reconcile_manual' | 'force_settlement';
    label: string;
    icon: string;
    requiresConfirmation: boolean;
    requiresReason: boolean;
  }>;
  onAction: (action: string, betId: string, reason?: string) => void;
}

// Componente de exposición
interface ExposureDashboard {
  totalExposure: number;
  exposureByProvider: Array<{
    provider: string;
    exposure: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  topExposures: Array<{
    betId: string;
    userId: string;
    provider: string;
    exposure: number;
    potentialPayout: number;
    liability: number;
  }>;
  riskAlerts: FinancialExposure['riskAlerts'];
  limits: {
    provider: number;
    user: number;
    total: number;
  };
}

// Componente de provider settlement
interface ProviderSettlementPanel {
  settlements: ProviderSettlement[];
  filters: {
    provider: string;
    status: string;
    dateRange: {
      from: string;
      to: string;
    };
  };
  actions: Array<{
    key: 'investigate' | 'force_settle' | 'escalate_provider';
    label: string;
    requiresConfirmation: boolean;
    requiresReason: boolean;
  }>;
  stats: {
    total: number;
    matched: number;
    mismatched: number;
    pending: number;
  };
}
```

### Tipos Auxiliares

```typescript
// Estado de transacción
type TransactionStatus = 'reserved' | 'locked' | 'provider_settled' | 'settlement_pending' | 'credited' | 'debited' | 'released' | 'cashout' | 'withdrawable' | 'reversed';

// Estado de liquidación
type SettlementStatus = 'pending' | 'settled' | 'disputed' | 'corrected';

// Tipo de transacción
type TransactionType = 'bet_stake' | 'bet_win' | 'bet_refund' | 'bet_cashout' | 'stake_reserve' | 'stake_release' | 'win_credit' | 'loss_debit';

// Resultado de provider
type ProviderResult = 'WIN' | 'LOSS' | 'VOID' | 'PENDING';

// Moneda soportada
type SupportedCurrency = 'USDT' | 'BTC' | 'USD' | 'mBTC';

// Proveedor de apuestas
type BettingProvider = 'cloudbet' | 'stake' | 'pinnacle' | 'betfair' | 'custom';

// Tipo de discrepancia
type ReconciliationType = 'wallet_ledger' | 'provider_system' | 'missing_transaction';

// Nivel de riesgo
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// Acción de reconciliación
type ReconciliationAction = 'mark_investigated' | 'reconcile_manual' | 'force_settlement';
```

# Finanzas (Admin)

## Propósito del módulo

Panel de contabilidad operativa y conciliación financiera del sistema de apuestas basado en el contrato ExtendedBet. Este módulo NO es un wallet viewer, es el sistema que valida si la plataforma gana dinero o está pagando dinero que no existe.

**Objetivo principal**: Verificar que los balances cuadran entre:
- **Wallet** (saldo que ve el usuario)
- **Ledger** (asientos contables del sistema)
- **Bets** (eventos financieros origen)

## ⚠️ REGLAS OPERATIVAS CRÍTICAS

### 1. Provider Authority Rule
**El resultado del provider es la fuente de verdad final.**

Cuando `provider_result ≠ system_result`:
1. Se revierte el settlement interno automáticamente
2. Se recalcula el PnL con el resultado del provider
3. Se generan transacciones de ajuste en ledger y wallet
4. Se marca la apuesta como `corrected_bet`
5. **NO se permite retirar fondos de apuestas con `provider_settlement_status = pending`**

### 2. Settlement Funds Flow
**Estado financiero obligatorio: `settlement_pending`**

Flujo correcto de estados:
```
reserved → locked → provider_settled → settlement_pending → credited → withdrawable
```

- `settlement_pending`: Provider confirmó resultado pero fondos aún no disponibles para retiro
- `credited`: Fondos acreditados y disponibles para apuestas nuevas
- `withdrawable`: Fondos completamente líquidos para retiro

### 3. Withdrawable Balance Rule
```
withdrawable_balance = wallet_balance - reserved - locked - settlement_pending
```

**UI Requirements**:
- Mostrar en Overview: **Available Balance** (contable) vs **Withdrawable Balance** (real)
- Bloquear retiros si `withdrawable_balance < amount_requested`
- Alerta roja si withdrawable balance es negativo

## Conexión con otros módulos

### Desde Usuario
- Usuario genera apuestas → reserva saldo → bloquea saldo → gana/pierde saldo
- **Finanzas responde**: ¿Ese saldo realmente existió y cuadró?
- Las apuestas crean: `wallet_transaction`, `ledger_transaction`, `financial_status`

### Desde Tipster
- Tipster genera señales → señales crean apuestas → apuestas crean PnL
- **Finanzas verifica**: El rendimiento del tipster depende del PnL financiero real, no del resultado deportivo
- Finanzas es el verificador real del ROI del tipster

## Rutas y Query Params

**Ruta exacta**: `/admin/finance`

**Query params obligatorios**:
- `tab = overview | wallet | ledger | reconciliation | exposure | provider-settlement | audit | daily-close | risk-guard`
- `userId` - filtrar por usuario específico
- `provider` - cloudbet | stake | pinnacle | betfair | custom
- `currency` - USDT | BTC | USD | mBTC
- `status` - reserved | locked | provider_settled | settlement_pending | credited | debited | released | cashout | withdrawable | reversed
- `settlementStatus` - pending | settled | disputed | corrected
- `dateFrom`, `dateTo` - formato ISO
- `betId` - filtrar por apuesta específica
- `signalId` - filtrar por señal específica
- `page`, `limit`, `sort`, `order`

## Estructura de la Página (9 Tabs Obligatorios)

### 1. Tab Overview (Panel Ejecutivo)

**KPIs principales** (fuentes: `financial_status + pnl`):
- **Total Reserved**: Dinero reservado en apuestas activas
- **Total Locked**: Dinero bloqueado en apuestas aceptadas
- **Available Balance**: Total Balance de Usuarios (USDT) - Contable
- **Withdrawable Balance**: Disponible para retiros (USDT) - Real
- **User PnL Hoy**: Ganancias/pérdidas de usuarios hoy (USDT)
- **House PnL Hoy**: Ganancia/pérdida de la plataforma hoy (USDT)
- **User PnL 30 días**: Ganancias/pérdidas de usuarios últimos 30 días (USDT)
- **House PnL 30 días**: Ganancia/pérdida de la plataforma últimos 30 días (USDT)
- **Pending Reconciliation**: Transacciones sin conciliar
- **Disputed Bets**: Apuestas en disputa con proveedores
- **Corrected Bets**: Apuestas corregidas post-settlement
- **Settlement Pending**: Fondos bloqueados por liquidación (USDT)
- **Active Exposure**: Exposición total de la casa
- **Top Risk Provider**: Proveedor con mayor exposición

**Cálculos Clave**:
```
User PnL = sum(user_winnings) - sum(user_stakes)
House PnL = -User PnL - provider_fees - operational_costs
Available Balance = wallet_balance - reserved - locked
Withdrawable Balance = wallet_balance - reserved - locked - settlement_pending
```

**Gráficos obligatorios**:
- User vs House PnL diario (últimos 30 días)
- House PnL por Provider (torta)
- Exposure Evolution (línea temporal)
- Reconciliation Health Score (últimos 30 días)

### 2. Tab Wallet

**Tabla wallet_transactions**:

| Columna | Descripción |
|---------|-------------|
| timestamp | Momento del movimiento |
| user_id | Usuario afectado |
| bet_id | Apuesta relacionada |
| type | bet_stake, bet_win, bet_refund, bet_cashout |
| amount | Monto en moneda base |
| balance_before | Saldo previo |
| balance_after | Saldo posterior |
| status | pending, completed, failed, reversed |
| currency | Moneda original |

**Filtros**: user, fecha, bet, estado, proveedor

**Responde**: ¿Qué dinero vio el usuario?

### 3. Tab Ledger

**Tabla ledger_transactions**:

| Columna | Descripción |
|---------|-------------|
| timestamp | Momento del asiento |
| bet_id | Apuesta relacionada |
| type | stake_reserve, stake_release, win_credit, loss_debit, cashout |
| amount | Monto en USDT |
| currency | Moneda del asiento |
| status | pending, confirmed, reversed |
| reference_id | ID de referencia contable |

**Responde**: ¿Qué dinero registró el sistema contablemente?

### 4. Tab Reconciliation (EL MÁS IMPORTANTE)

**Vista comparativa** wallet vs ledger vs bet vs provider:

| Columna | Descripción |
|---------|-------------|
| bet_id | ID de la apuesta |
| user | Usuario afectado |
| wallet_amount | Monto en wallet |
| ledger_amount | Monto en ledger |
| bet_pnl | PnL reportado por la bet |
| provider_result | Resultado del proveedor |
| system_result | Resultado del sistema |
| difference | Diferencia calculada |
| status | matched, mismatch, missing_wallet, missing_ledger, provider_mismatch |
| last_checked | Última verificación |

**Flags de conciliación**:
- **mismatch**: wallet ≠ ledger
- **missing_wallet**: transacción en ledger pero no en wallet
- **missing_ledger**: transacción en wallet pero no en ledger
- **duplicated_transaction**: transacción duplicada
- **provider_mismatch**: provider result ≠ system result

**Provider Settlement Check**:
```
Bet ID | User | Provider Result | System Result | Match? | Acción
12345  | Juan | WIN (2.5)      | WIN (2.5)     | ✅ Sí   | -
12346  | Ana  | VOID           | WIN           | ❌ No   | Investigar
12347  | Luis | LOSS           | LOSS          | ✅ Sí   | -
```

**Acciones permitidas**:
- Marcar como investigado
- Reconciliar manualmente (doble confirmación)
- Forzar settlement (doble confirmación)

### 5. Tab Exposure

**Panel de riesgo**:

**Métricas principales**:
- Exposición total: `SUM(house_exposure)`
- Exposición por proveedor: `GROUP BY provider`
- Exposición por usuario: `GROUP BY user_id`
- Apuesta con mayor liability
- Promedio de exposición por apuesta

**Alertas de riesgo**:
- **provider_exceeded**: exposición > límite por proveedor
- **user_exceeded**: exposición > límite por usuario
- **total_exceeded**: exposición total > límite global

**Campos clave**: `house_exposure`, `liability`, `potential_payout`

### 6. Tab Provider Settlement

**Seguimiento de proveedores externos**:

**Estados**:
- **pending**: pendiente de liquidación
- **settled**: liquidado por proveedor
- **disputed**: en disputa
- **corrected**: corregido post-liquidación

**Nota sobre cashout**: `cashout` es un tipo de transacción que se traduce a `credited` o `debited` según el PnL resultante. No se usa como filtro de estado en UI, solo como tipo de transacción.

**Métricas**:
- Total pending por proveedor
- Disputed bets (requieren acción)
- Corrected bets (post-settlement)
- Tiempo promedio de liquidación

**Acciones**:
- Actualizar settlement status
- Abrir disputa
- Marcar como corregido

### 7. Tab Audit

**Registro de acciones financieras**:

**Tipos de acciones**:
- Cambios de `financial_status`
- Reversals de transacciones
- Settlements manuales
- Reconciliaciones forzadas
- Correcciones de PnL

**Campos**:
- timestamp
- user_id (admin que ejecutó)
- action_type
- bet_id afectado
- from_value / to_value
- reason (obligatorio)
- approval_level (single/double)

### Estados Financieros Extendidos

**Flujo completo de estados** (campo `financial_status`):
- `reserved`: stake reservado en apuesta pendiente
- `locked`: stake bloqueado en apuesta aceptada
- `provider_settled`: provider confirmó resultado
- `settlement_pending`: resultado confirmado, fondos no disponibles para retiro
- `credited`: ganancia acreditada y disponible para apuestas
- `debited`: pérdida confirmada
- `released`: devuelto (push/void)
- `cashout`: cashout ejecutado (credited/debited según PnL)
- `withdrawable`: fondos completamente líquidos para retiro

**Regla crítica**: Fondos NO son withdrawable hasta pasar por `settlement_pending` → `credited` → `withdrawable`

**Aclaración importante**:
- `withdrawable` (estado) = fondos ya liquidados y liberados para retiro
- `withdrawable_balance` (métrica) = agregado por usuario de fondos en estado withdrawable

### 8. Tab Daily Close / Financial Snapshot

**Objetivo**: Cierre contable diario automático - punto de verdad histórico inmutable.

**Contenido**:
- **Snapshot Selector**: Calendario para seleccionar fecha de cierre
- **Snapshot Summary**:
  - Total User Balance (USDT)
  - Total House Liability (USDT)
  - Total House PnL (USDT)
  - Total Exposure (USDT)
  - Reconciliation Status
- **Historical Comparison**: Comparación vs día anterior, semana, mes
- **Export**: Reporte de cierre en PDF/Excel

**Tabla de Snapshots**:
```
Fecha       | User Balance | Liability | House PnL | Exposure | Reconciled
2024-02-12  | 125,450.00   | 89,230.00 | +5,420.00 | 67,890   | ✅ Sí
2024-02-11  | 118,320.00   | 92,100.00 | +3,210.00 | 71,234   | ✅ Sí
```

**KPIs**:
- Daily Close Status (✅/❌)
- Balance Evolution (7 días)
- PnL Trend
- Reconciliation Health Score

### 9. Tab Risk Guard

**Objetivo**: Control operativo automático de riesgo - bloqueo cuando se exceden límites.

**Contenido**:
- **Active Blocks**: Lista de bloqueos activos (usuario/provider/mercado)
- **Risk Metrics**: Exposición actual vs límites configurados
- **Block History**: Historial de bloqueos y desbloqueos
- **Manual Controls**: Botones para desbloquear manualmente

**Tipos de Bloqueo**:
- **User Block**: Usuario excedió exposición personal
- **Provider Block**: Provider excedió exposición total
- **Market Block**: Mercado específico en riesgo
- **System Block**: Riesgo sistémico detectado

**Acciones**:
- **Desbloquear**: Requiere doble confirmación y motivo
- **Ajustar Límites**: Modificar umbrales de riesgo
- **Ver Detalle**: Ver transacciones que causaron el bloqueo

**Estados**:
- 🟢 **Active**: Bloqueo operativo en curso
- 🟡 **Warning**: Cerca del límite (80%)
- 🔴 **Blocked**: Límite excedido - bloqueo automático

**KPIs**:
- Bloqueos activos por tipo
- Tiempo promedio de resolución
- Falsos positivos

## Reglas de Seguridad

### Acciones que requieren doble confirmación:
- Manual settlement
- Reversal de transacción
- Manual reconciliation
- Corrección de PnL
- Void de apuesta settled

### Prohibiciones absolutas:
- No editar PnL directamente
- No editar wallet balance directamente
- No bypassar Risk Guard
- No modificar `fx_rate` post-creación

### Límites de exposición (configurables):
- Max exposure per user: 5,000 USDT
- Max exposure per provider: 50,000 USDT
- Max total exposure: 200,000 USDT
- Max single bet exposure: 10,000 USDT

## Estados UI Obligatorios

### Loading states:
- Skeleton para tablas mientras cargan
- Spinner para KPIs en tiempo real
- Progress bar para operaciones largas

### Empty states:
- "No hay apuestas en este período"
- "No hay discrepancias de conciliación"
- "No hay exposición activa"

### Error states:
- **mismatch warning**: discrepancia en conciliación
- **critical alert**: exposición excedida
- **system error**: fallo en cálculos

### Success states:
- Reconciliación completada
- Settlement procesado
- Alerta de riesgo resuelta

## API Endpoints Requeridos

### GET /api/admin/finance/overview
```json
{
  "kpis": {
    "totalReserved": 125000.00,
    "totalLocked": 89000.00,
    "totalCredited": 45000.00,
    "totalDebited": 67000.00,
    "availableBalance": 36000.00,
    "withdrawableBalance": 28000.00,
    "userPnL": -15000.00,
    "housePnL": -7000.00,
    "pendingReconciliation": 12,
    "disputedBets": 3,
    "settlementPending": 8000.00,
    "activeExposure": 234000.50
  },
  "charts": {
    "dailyUserPnL": [...],
    "dailyHousePnL": [...],
    "exposureByProvider": [...]
  }
}
```

### GET /api/admin/finance/wallet-transactions
```json
{
  "transactions": [...],
  "pagination": {...}
}
```

### GET /api/admin/finance/ledger-transactions
```json
{
  "transactions": [...],
  "pagination": {...}
}
```

### GET /api/admin/finance/reconciliation
```json
{
  "discrepancies": [...],
  "summary": {
    "totalChecked": 1000,
    "matched": 980,
    "mismatched": 20,
    "missing": 0
  }
}
```

### GET /api/admin/finance/exposure
```json
{
  "totalExposure": 234000.50,
  "byProvider": {...},
  "byUser": {...},
  "alerts": [...]
}
```

### GET /api/admin/finance/provider-settlements
```json
{
  "byStatus": {
    "pending": 45,
    "settled": 1200,
    "disputed": 3,
    "corrected": 1
  },
  "byProvider": {...}
}
```

### Daily Close / Financial Snapshot
- `GET /api/admin/finance/snapshots` - Lista de snapshots históricos
- `GET /api/admin/finance/snapshot/{date}` - Snapshot específico por fecha
- `POST /api/admin/finance/create-snapshot` - Crear snapshot manual
- `GET /api/admin/finance/snapshot-comparison` - Comparación entre fechas

### Risk Guard
- `GET /api/admin/finance/risk-blocks` - Lista de bloqueos activos
- `POST /api/admin/finance/block-user` - Bloquear usuario por riesgo
- `POST /api/admin/finance/unblock-user` - Desbloquear usuario
- `POST /api/admin/finance/block-provider` - Bloquear provider
- `POST /api/admin/finance/unblock-provider` - Desbloquear provider
- `GET /api/admin/finance/risk-metrics` - Métricas de riesgo actuales

### Withdrawal Control
- `GET /api/admin/finance/withdrawable-balance/{user_id}` - Balance disponible para retiro
- `POST /api/admin/finance/check-withdrawal` - Validar retiro antes de procesar
- `GET /api/admin/finance/settlement-pending` - Lista de fondos en settlement pending
- `POST /api/admin/finance/force-withdrawable` - Forzar fondos a withdrawable (emergencia)

### POST /api/admin/finance/reconcile
```json
{
  "betId": "bet_123",
  "action": "manual_reconciliation",
  "reason": "Discrepancia identificada y corregida",
  "requiresApproval": true
}
```

### POST /api/admin/finance/force-settlement
```json
{
  "betId": "bet_456",
  "result": "win",
  "pnl": 150.00,
  "reason": "Settlement manual por discrepancia",
  "requiresDoubleApproval": true
}
```

## Conexiones con otros módulos

### Desde Signals Admin:
- Link: `/admin/finance?signalId={signalId}`
- Muestra: todas las apuestas generadas por esa señal

### Desde Users Admin:
- Link: `/admin/finance?userId={userId}`
- Muestra: todas las transacciones financieras del usuario

### Desde Bets Admin:
- Link: `/admin/finance?betId={betId}`
- Muestra: conciliación específica de esa apuesta

## Esquema de Base de Datos (Extensiones)

```sql
-- Tabla de transacciones ledger (extensión)
ALTER TABLE ledger_transactions ADD COLUMN (
  reconciliation_status VARCHAR(20) DEFAULT 'pending',
  reconciliation_checked_at TIMESTAMP,
  discrepancy_reason VARCHAR(255),
  investigated_by VARCHAR(100),
  investigation_notes TEXT
);

-- Índices para reconciliación
CREATE INDEX idx_ledger_reconciliation ON ledger_transactions(reconciliation_status, created_at);
CREATE INDEX idx_ledger_discrepancy ON ledger_transactions(discrepancy_reason, created_at);

-- Tabla de límites de exposición
CREATE TABLE exposure_limits (
  id SERIAL PRIMARY KEY,
  limit_type VARCHAR(50) NOT NULL, -- 'user', 'provider', 'total'
  entity_id VARCHAR(100), -- user_id o provider_id, NULL para total
  max_exposure DECIMAL(20,8) NOT NULL,
  current_exposure DECIMAL(20,8) DEFAULT 0,
  warning_threshold DECIMAL(5,2) DEFAULT 0.8, -- 80%
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de alertas de exposición
CREATE TABLE exposure_alerts (
  id SERIAL PRIMARY KEY,
  limit_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(100),
  alert_type VARCHAR(50) NOT NULL, -- 'warning', 'exceeded'
  current_exposure DECIMAL(20,8) NOT NULL,
  max_limit DECIMAL(20,8) NOT NULL,
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_by VARCHAR(100),
  acknowledged_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de snapshots financieros diarios (cierre contable)
CREATE TABLE financial_snapshots (
  id SERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL UNIQUE,
  total_user_balance DECIMAL(20,8) NOT NULL,
  total_house_liability DECIMAL(20,8) NOT NULL,
  total_user_pnl DECIMAL(20,8) NOT NULL,
  total_house_pnl DECIMAL(20,8) NOT NULL,
  total_exposure DECIMAL(20,8) NOT NULL,
  reconciled BOOLEAN DEFAULT false,
  reconciliation_completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100) DEFAULT 'system'
);

-- Índice único por fecha
CREATE UNIQUE INDEX idx_snapshot_date ON financial_snapshots(snapshot_date);

-- Tabla de bloqueos de riesgo (Risk Guard)
CREATE TABLE risk_blocks (
  id SERIAL PRIMARY KEY,
  block_type VARCHAR(50) NOT NULL, -- 'user', 'provider', 'market', 'system'
  entity_id VARCHAR(100), -- user_id, provider_id, market_id
  entity_name VARCHAR(255),
  reason VARCHAR(255) NOT NULL,
  risk_metric VARCHAR(100) NOT NULL, -- 'exposure', 'liability', 'settlement'
  current_value DECIMAL(20,8) NOT NULL,
  limit_value DECIMAL(20,8) NOT NULL,
  auto_blocked BOOLEAN DEFAULT true, -- true = bloqueo automático, false = manual
  blocked_by VARCHAR(100), -- usuario que bloqueó (NULL si es automático)
  blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unblocked_by VARCHAR(100),
  unblocked_at TIMESTAMP,
  unblock_reason TEXT,
  active BOOLEAN DEFAULT true
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_risk_blocks_active ON risk_blocks(active, block_type);
CREATE INDEX idx_risk_blocks_entity ON risk_blocks(block_type, entity_id);

-- Tabla de reconciliación con provider settlement
ALTER TABLE reconciliation_checks ADD COLUMN (
  provider_result VARCHAR(50),
  system_result VARCHAR(50),
  provider_settlement_id VARCHAR(100),
  provider_mismatch BOOLEAN DEFAULT false,
  provider_investigation_notes TEXT
);

-- Agregar settlement_pending al campo financial_status
-- (Asumiendo que la tabla bets ya existe con financial_status)
ALTER TABLE bets ADD COLUMN IF NOT EXISTS settlement_pending_at TIMESTAMP;
ALTER TABLE bets ADD COLUMN IF NOT EXISTS withdrawable_at TIMESTAMP;

-- Índice para búsquedas rápidas de settlement pending
CREATE INDEX idx_bets_settlement_pending ON bets(financial_status, settlement_pending_at) 
WHERE financial_status = 'settlement_pending';

-- Vista para withdrawable balance calculation
-- NOTA: La vista es orientativa; se ajusta a la estructura real (wallet vs bet status)
CREATE OR REPLACE VIEW user_withdrawable_balance AS
SELECT 
  user_id,
  SUM(CASE WHEN financial_status IN ('credited', 'withdrawable') THEN amount ELSE 0 END) as available_balance,
  SUM(CASE WHEN financial_status = 'withdrawable' THEN amount ELSE 0 END) as withdrawable_balance,
  SUM(CASE WHEN financial_status IN ('reserved', 'locked', 'settlement_pending') THEN amount ELSE 0 END) as blocked_balance
FROM wallet_transactions 
GROUP BY user_id;
```

## Validaciones Críticas de Retiro

### Antes de procesar cualquier retiro:
1. **Verificar `withdrawable_balance >= requested_amount`**
2. **Validar que no haya `settlement_pending` del mismo usuario**
3. **Confirmar que `provider_settlement_status = 'settled'` para apuestas recientes**
4. **Bloquear retiro si hay `provider_mismatch` activo**

### Alertas Rojas:
- Withdrawable balance negativo → 🚨 BLOQUEO INMEDIATO
- Settlement pending > 24 horas → 🚨 INVESTIGAR
- Provider mismatch no resuelto → 🚨 RETIRO BLOQUEADO
- Discrepancia wallet vs ledger → 🚨 RETIRO BLOQUEADO

### Integración con Users Module:
- El módulo Users debe consultar `/api/admin/finance/withdrawable-balance/{user_id}` antes de procesar retiros
- Finance debe notificar a Users cuando cambia el withdrawable balance
- Doble validación: Users (UI) + Finance (backend)

## Checklist Final "Listo para HTML"

✅ Sidebar Admin correcto y activo en Finanzas
✅ 9 tabs con query params obligatorios
✅ KPIs de Overview con gráficos
✅ Tablas con columnas especificadas
✅ Filtros sticky + URL sync
✅ Estados UI (loading, empty, error, success)
✅ Acciones con doble confirmación
✅ Alertas de riesgo en tiempo real
✅ Conexiones con otros módulos
✅ Seguridad: sin edición directa de balances

## Notas de Implementación

1. **Moneda base**: Todos los cálculos en USDT (moneda contable del sistema)
2. **Tasas de cambio**: FX rate congelado al crear la apuesta (no se recalcula)
3. **Conciliación**: Proceso automático cada 5 minutos + manual on-demand
4. **Auditoría**: Todos los cambios financieros quedan registrados
5. **Rendimiento**: Índices en base de datos para queries financieros
6. **Seguridad**: Rate limiting en endpoints críticos (10 req/min)

Este módulo es el corazón financiero del sistema: aquí es donde se verifica que los números cuadran y la plataforma opera de forma rentable y segura.
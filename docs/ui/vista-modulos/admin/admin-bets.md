### Interfaces Principales

```typescript
// Información general del módulo
interface AdminBetsModule {
  id: 'admin-bets';
  name: 'Apuestas (Admin)';
  description: 'Panel de monitoring operacional de ejecuciones, fallos, riesgo y auditoría';
  route: '/admin/bets';
  accentColor: 'red';
  icon: 'target';
  permissions: ['admin:bets:view', 'admin:bets:manage', 'admin:bets:audit'];
  navigation: {
    parent: 'admin';
    order: 5;
    breadcrumb: ['Admin', 'Apuestas'];
  };
}

// Header del módulo
interface AdminBetsHeader {
  title: '🎯 Apuestas (Admin)';
  subtitle: 'Ejecuciones, fallos, riesgo y auditoría';
  controls: {
    dateRange: {
      from: string;
      to: string;
      onChange: (range: { from: string; to: string }) => void;
    };
    mode: {
      value: 'pre' | 'live' | 'all';
      onChange: (mode: string) => void;
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
  };
}

// Layout del módulo
interface AdminBetsLayout {
  tabs: Array<{
    id: 'overview' | 'executions' | 'failures' | 'risk' | 'providers' | 'disputes';
    label: string;
    icon: string;
    count?: number;
    badge?: 'warning' | 'error' | 'info';
  }>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  content: {
    overview: BetsOverview;
    executions: BetsExecutionsPanel;
    failures: BetsFailuresPanel;
    risk: BetsRiskPanel;
    providers: BetsProvidersPanel;
    disputes: BetsDisputesPanel;
  };
}

// KPIs principales
interface BetsKPIs {
  totalBets: {
    value: number;
    change: number; // porcentaje
    trend: 'up' | 'down' | 'stable';
  };
  acceptanceRate: {
    value: number; // porcentaje
    target: number;
    trend: 'up' | 'down' | 'stable';
  };
  rejectRate: {
    value: number; // porcentaje
    target: number;
    trend: 'up' | 'down' | 'stable';
  };
  settledBets: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  netPnL: {
    value: number;
    currency: string;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  riskBlocked: {
    value: number; // porcentaje
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  latencyP95: {
    value: string; // "250ms"
    target: string; // "< 500ms"
    trend: 'up' | 'down' | 'stable';
  };
}

// Configuración de tabs
interface BetsTabsConfig {
  overview: {
    title: 'Resumen';
    description: 'Vista general del estado de apuestas';
    components: ['kpi-cards', 'acceptance-chart', 'latency-chart', 'top-users'];
  };
  executions: {
    title: 'Ejecuciones';
    description: 'Apuestas ejecutadas exitosamente';
    components: ['bets-table', 'filters', 'export-tools'];
  };
  failures: {
    title: 'Fallos';
    description: 'Apuestas rechazadas y errores de ejecución';
    components: ['failures-table', 'error-analysis', 'retry-actions'];
  };
  risk: {
    title: 'Riesgo';
    description: 'Evaluación de riesgo y bloqueos';
    components: ['risk-table', 'risk-metrics', 'blocked-bets'];
  };
  providers: {
    title: 'Proveedores';
    description: 'Estado y salud de los brokers';
    components: ['providers-table', 'health-metrics', 'latency-chart'];
  };
  disputes: {
    title: 'Disputas';
    description: 'Gestión de disputas y reclamaciones';
    components: ['disputes-table', 'resolution-workflow'];
  };
}
```

### Interfaces de Filtros y Transacciones

```typescript
// Filtros de apuestas
interface BetFilters {
  status: 'all' | 'placed' | 'accepted' | 'rejected' | 'settled' | 'void' | 'cashout' | 'hedge' | 'pending';
  source: 'all' | 'agent' | 'manual' | 'api';
  mode: 'all' | 'pre' | 'live';
  sport: string;
  league: string;
  tipsterId: string;
  signalId: string;
  userId: string;
  intentId: string;
  ticketId: string;
  riskLevel: 'all' | 'INFO' | 'WARNING' | 'RESTRICT' | 'LOCK';
  provider: string;
  dateRange: {
    from: string;
    to: string;
  };
  searchQuery: string;
  hasError: boolean;
  minStake: number;
  maxStake: number;
}

// Apuesta individual
interface Bet {
  betId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userHandle: string;
  source: 'agent' | 'manual' | 'api';
  agentId?: string;
  mode: 'pre' | 'live';
  sport: string;
  league: string;
  eventName: string;
  eventId: string;
  market: string;
  selection: string;
  oddsRequested: number;
  oddsAccepted?: number;
  stakePlanned: number;
  stakeExecuted?: number;
  status: BetStatus;
  result?: 'WIN' | 'LOSS' | 'VOID' | 'PENDING';
  pnl?: number;
  currency: string;
  signalId?: string;
  intentId?: string;
  ticketId?: string;
  riskLevel: 'INFO' | 'WARNING' | 'RESTRICT' | 'LOCK';
  riskReason?: string;
  provider: string;
  providerBetId?: string;
  latencyMs?: number;
  errorCode?: BetErrorCode;
  retryCount: number;
  metadata?: Record<string, any>;
}

// Estado de la apuesta
type BetStatus = 'pending' | 'placed' | 'accepted' | 'rejected' | 'settled' | 'void' | 'cashout' | 'hedge';

// Códigos de error normalizados
type BetErrorCode = 
  | 'PROVIDER_DOWN'
  | 'RATE_LIMIT'
  | 'REQUEST_TIMEOUT'
  | 'ODDS_CHANGED'
  | 'MARKET_CLOSED'
  | 'INSUFFICIENT_FUNDS'
  | 'AUTH_FAILED'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_PROVIDER_ERROR';

// Categoría de error
type ErrorCategory = 'transient' | 'permanent' | 'conditional';

// Intento de apuesta
interface BetAttempt {
  attemptId: string;
  betId: string;
  attemptNumber: number;
  timestamp: string;
  status: 'pending' | 'success' | 'failed';
  errorCode?: BetErrorCode;
  errorMessage?: string;
  latencyMs?: number;
  providerResponse?: any;
}

// Evaluación de riesgo
interface RiskEvaluation {
  betId: string;
  level: 'INFO' | 'WARNING' | 'RESTRICT' | 'LOCK';
  reason: string;
  details: {
    bankrollCheck: {
      plannedStake: number;
      availableBalance: number;
      sufficient: boolean;
    };
    exposureCheck: {
      currentExposure: number;
      maxExposure: number;
      withinLimits: boolean;
    };
    userRisk: {
      riskProfile: 'low' | 'medium' | 'high';
      restrictions: string[];
    };
    marketRisk: {
      oddsValidity: boolean;
      marketStatus: 'open' | 'suspended' | 'closed';
      volatility: number;
    };
  };
  evaluatedAt: string;
  evaluatedBy: string;
}
```

### Interfaces de Componentes

```typescript
// Tabla de apuestas
interface BetsTable {
  data: Bet[];
  columns: Array<{
    key: string;
    label: string;
    sortable: boolean;
    width?: number;
    formatter?: (value: any, row: Bet) => string | ReactNode;
  }>;
  loading: boolean;
  pagination: {
    current: number;
    total: number;
    pageSize: number;
  };
  selectedBets: string[];
  filters: BetFilters;
  onFilterChange: (filters: BetFilters) => void;
  onSelectionChange: (selected: string[]) => void;
  onSort: (key: string, order: 'asc' | 'desc') => void;
}

// Panel de fallos
interface BetsFailuresPanel {
  failures: Array<{
    betId: string;
    timestamp: string;
    user: string;
    provider: string;
    errorCode: BetErrorCode;
    errorCategory: ErrorCategory;
    retryAllowed: boolean;
    retryCount: number;
    lastError: string;
  }>;
  errorStats: {
    totalFailures: number;
    byErrorCode: Record<BetErrorCode, number>;
    byProvider: Record<string, number>;
    byTimeBucket: Array<{
      time: string;
      count: number;
    }>;
  };
  retryActions: Array<{
    key: 'retry' | 'investigate' | 'mark_resolved';
    label: string;
    icon: string;
    requiresConfirmation: boolean;
  }>;
}

// Panel de riesgo
interface BetsRiskPanel {
  blockedBets: Array<{
    betId: string;
    user: string;
    riskLevel: 'WARNING' | 'RESTRICT' | 'LOCK';
    reason: string;
    timestamp: string;
    evaluatedBy: string;
  }>;
  riskMetrics: {
    totalEvaluated: number;
    blocked: number;
    byRiskLevel: Record<string, number>;
    byReason: Record<string, number>;
  };
  exposureLimits: {
    user: number;
    market: number;
    total: number;
    current: {
      user: Record<string, number>;
      market: Record<string, number>;
      total: number;
    };
  };
}

// Panel de proveedores
interface BetsProvidersPanel {
  providers: Array<{
    name: string;
    status: 'healthy' | 'degraded' | 'down';
    latencyP50: number;
    latencyP95: number;
    errorRate: number;
    rateLimit: {
      current: number;
      limit: number;
      remaining: number;
      resetAt: string;
    };
    lastCheck: string;
  }>;
  healthAlerts: Array<{
    provider: string;
    type: 'high_latency' | 'high_error_rate' | 'rate_limit_near' | 'service_down';
    severity: 'warning' | 'critical';
    message: string;
    triggeredAt: string;
  }>;
}

// Detalle de apuesta
interface BetDetailDrawer {
  bet: Bet;
  traceability: {
    signal?: {
      id: string;
      timestamp: string;
      tipster: string;
      odds: number;
      stake: number;
    };
    intent?: {
      id: string;
      createdAt: string;
      status: string;
      evaluatedBy: string;
    };
    ticket?: {
      id: string;
      provider: string;
      sentAt: string;
      response?: any;
    };
  };
  riskEvaluation?: RiskEvaluation;
  attempts: BetAttempt[];
  auditLog: Array<{
    timestamp: string;
    action: string;
    user: string;
    notes?: string;
  }>;
}
```

### Tipos Auxiliares

```typescript
// Acciones disponibles para apuestas
type BetAction = 
  | 'retry'
  | 'investigate' 
  | 'add_note' 
  | 'void' 
  | 'refund' 
  | 'cashout' 
  | 'hedge';

// Estado de transición
type BetTransition = {
  from: BetStatus;
  to: BetStatus;
  actor: 'system' | 'provider' | 'user' | 'agent' | 'admin';
  reason: string;
  requiresConfirmation: boolean;
  timestamp: string;
};

// Claves de ordenamiento permitidas
type BetSortKey = 
  | 'created_at'
  | 'status'
  | 'latency_ms'
  | 'stake_executed'
  | 'pnl'
  | 'risk_level'
  | 'error_code';

// Modo de apuesta
type BetMode = 'pre' | 'live';

// Fuente de apuesta
type BetSource = 'agent' | 'manual' | 'api';

// Nivel de riesgo
type RiskLevel = 'INFO' | 'WARNING' | 'RESTRICT' | 'LOCK';

// Estado de provider
type ProviderStatus = 'healthy' | 'degraded' | 'down';

// Categoría de riesgo
type RiskCategory = 'bankroll' | 'exposure' | 'user' | 'market';
```

# Apuestas (Admin)

Propósito del módulo (Admin)
- Panel de monitoring operacional de ejecuciones (manuales/agent/API).
- Detección de fallos (latencia, rechazos, cashout/hedge si aplica).
- Auditoría: quién ejecutó, por qué, con qué stake, con qué saldo, qué señal lo originó.
- Trazabilidad obligatoria: signals → bets (signal_id → bet_id(s)).
- Evaluación obligatoria por Risk Guard: todo TradeIntent/TradeTicket pasa por Risk Guard antes de ejecución.
- Bankroll: el stake se define por el plan, pero la ejecución depende del saldo real del broker.

No es
- Marketplace (usuario).
- “Mis bets” (usuario).
- Gestión de señales (eso es /admin/signals).

Rutas y query params (contrato de navegación)
- Ruta exacta: /admin/bets
- Query params (MVP):
  - tab = overview | executions | failures | risk | providers | disputes
  - status = placed | accepted | rejected | settled | void | cashout | hedge | pending
  - source = agent | manual | api
  - mode = pre | live | all (alineado a Signals)
  - sport, league
  - tipsterId (si viene desde señales/tipsters)
  - signalId
  - userId
  - intentId (TradeIntent)
  - ticketId (TradeTicket)
  - riskLevel = INFO | WARNING | RESTRICT | LOCK
  - from, to
  - q
  - page, limit, sort, order
- Regla: todo filtro debe persistir en URL (igual que admin-signals y admin-tipsters).

Estructura de página (wireframe)
- Header
  - Título: “🎯 Apuestas (Admin)”
  - Sub: “Ejecuciones, fallos, riesgo y auditoría”
  - Controles: rango fecha, mode pre/live/all, refresh, export.
- Tabs
  - Overview
    - KPIs: total apuestas, acceptance rate, reject rate, settled, net PnL (si existe), % bloqueadas por Risk Guard, latency p95, top users by volume.
  - Executions
    - Lista principal de apuestas ejecutadas (happy path).
  - Failures
    - Rechazadas/errores (provider down, odds changed, insufficient funds, rate limit, latency).
  - Risk
    - Apuestas/intent con RESTRICT/LOCK + motivos; correlación con overtrading/drawdown (alto nivel).
  - Providers
    - Salud del broker (Cloudbet u otros): latency, error rate, rate limit, heartbeat.
    - Tabla mínima: provider | status | latency_p50/p95 | error_rate | rate_limit | last_check
  - Disputes (placeholder MVP)
    - Tickets internos, reembolsos/void, quejas.

Tabla principal (core)
- Columnas obligatorias (MVP) con foco en trazabilidad:
  - Timestamp
  - User
  - Source (agent/manual/api)
  - Agent (si aplica)
  - Mode (PRE/LIVE)
  - Event / Market / Selection
  - Odds (requested vs accepted)
  - Stake (planned vs executed)
  - Status (placed/accepted/rejected/settled/void…)
  - PnL/Result (si settled)
  - signal_id (si proviene de señal)
  - trade_intent_id / trade_ticket_id
  - Risk Guard: level + reason
  - Broker: latency + error_code (si falla)
  - Actions (dropdown)
- Soportar: pagination, sort, bulk-select.

Drawer de Bet (detalle)
- Tabs dentro del drawer:
  - Overview
    - bet_id, timestamps, status, provider ids, user, source, agent.
  - Traceability
    - Signal snapshot (si signal_id)
    - Intent/Ticket snapshot (si existen)
  - Risk & Bankroll
    - Bankroll plan stake vs executed
    - Broker balance check (insufficient funds)
    - Risk Guard evaluation (level, reason, message)
  - Provider Logs
    - request/response meta (sin datos sensibles), latency, retry count.
  - Audit
    - Acciones admin relacionadas.

### Sort keys permitidas (MVP)

- Para `sort` + `order` en query, claves válidas:
  - created_at
  - status
  - latency_ms
  - stake_executed
  - pnl
  - risk_level
  - error_code

## State Machine de Bets (MVP)

- Estados soportados: pending, placed, accepted, rejected, settled, void, cashout, hedge.
- Transiciones permitidas (con actor, motivo y confirmación):
  - pending → placed — actor: system/provider; motivo: envío al broker; confirmación: no.
  - placed → accepted — actor: provider; motivo: apuesta aceptada; confirmación: no.
  - placed → rejected — actor: provider; motivo: error_code normalizado; confirmación: no.
  - pending → rejected — actor: system/provider; motivo: validación fallida o error; confirmación: no.
  - accepted → settled — actor: provider; motivo: resultado final; confirmación: no.
  - accepted → cashout — actor: user/agent/system; motivo: cierre anticipado; confirmación: sí.
  - accepted → hedge — actor: user/agent/system; motivo: cobertura/gestión de riesgo; confirmación: sí.
  - accepted → void — actor: admin/compliance; motivo: reglas especiales (p. ej., evento cancelado); confirmación: doble.
  - settled → void — actor: admin/compliance; motivo: corrección excepcional/legal; confirmación: doble.
- Acciones habilitadas por estado (MVP):
  - pending/placed: Retry (solo si error transient), Investigar, Nota, Export.
  - accepted: Cashout/Hedge (si aplica), Nota, Investigar.
  - rejected: Retry (si transient y cumple reglas), Nota, Investigar.
  - settled: Export, Nota; cambios requieren doble confirmación.
  - void: registro y auditoría; modificaciones restringidas a compliance/admin.
  - Regla UI: Retry visible solo si `error_code` es transient y `provider_bet_id == null`.
  - Guard explícito: No mostrar Retry si `provider_bet_id != null`.

## Error Codes Normalizados (MVP)

- PROVIDER_DOWN — categoría: transient; permite Retry: sí.
- RATE_LIMIT — categoría: transient; permite Retry: sí.
- REQUEST_TIMEOUT — categoría: transient; permite Retry: sí.
- ODDS_CHANGED — categoría: transient/condicional; permite Retry: condicional (solo si nueva odd aceptable y sin duplicar ejecución).
- MARKET_CLOSED — categoría: permanent; permite Retry: no.
- INSUFFICIENT_FUNDS — categoría: permanent; permite Retry: no (hasta que se sincronice saldo y se reintente manualmente).
- AUTH_FAILED — categoría: permanent; permite Retry: no (requiere corregir credenciales).
- VALIDATION_ERROR — categoría: permanent; permite Retry: no.
- UNKNOWN_PROVIDER_ERROR — categoría: transient (por defecto); permite Retry: sí (limitado).

## Retry Rules + Idempotencia (MVP)

- Solo habilitado para errores transient: PROVIDER_DOWN, RATE_LIMIT, REQUEST_TIMEOUT, ODDS_CHANGED (condicional).
- Máximo intentos: 3.
- Backoff progresivo: 2s → 5s → 15s.
- Idempotency key: derivada de intentId o ticketId (única por intento de ejecución).
- Si existe bet_id del provider (registro previo de envío) → NO reintentar; mostrar estado “ya enviado” y bloquear duplicados.
- Registro y UI: mostrar `retry_count`, `attempt`, `last_error_code`, `latency_ms` por intento.

## Roles & Permissions (MVP)

- Ops: ver, investigar, agregar nota, exportar, ejecutar Retry (limitado a errores transient, sin void/refund).
- Compliance/Admin: realizar void/refund (si negocio lo permite), ver Provider Logs completos (sin secretos), desbloquear acciones, configurar guardrails; doble confirmación obligatoria para acciones sobre settled.
- Read-only: solo lectura (sin acciones).

## Provider Logs Fields (sin secretos)

- Campos visibles: `provider_name`, `provider_request_id`, `http_status`, `latency_ms`, `attempt`, `retry_count`, `endpoint` (sin query sensible), `error_code`, `error_message_sanitized`, `timestamp`.
- Nunca mostrar: `apiKey`, `headers` de autenticación, `payload` completo, `tokens` u otros secretos.

## BetRow Schema (mínimo para tabla/drawer)

- `bet_id`, `created_at`, `user_id`, `user_handle`.
- `source`, `agent_id` (opcional).
- `mode`, `sport`, `league`.
- `event_name`, `market`, `selection`.
- `odds_requested`, `odds_accepted`.
- `stake_planned`, `stake_executed`.
- `status`.
- `pnl`, `result`.
- `signal_id` (opcional), `intent_id` (opcional), `ticket_id` (opcional).
- `risk_level`, `risk_reason`.
- `provider`, `latency_ms`, `error_code` (opcional).

- No destructivas (monitoring/operación):
  - Marcar como “investigar”.
  - Agregar nota.
  - Reintentar (si status rejected por provider transient) — placeholder si no existe backend.
  - Forzar “void” o “refund” — solo si negocio lo permite; si no, dejar Fase 2.
  - Export selected.
- Guardrails
  - No permitir cambios sobre settled sin confirmación doble.
  - Bulk actions con preview + confirm (“CONFIRMAR”).

Estados UI (estándar)
- Loading / Empty / Error / Partial.
- Partial: cuando falten métricas (ej. no hay bankroll/risk evaluation disponible).

Conexiones con otros módulos
- Desde /admin/signals → /admin/bets?signalId=...
- Desde /admin/users → /admin/bets?userId=...
- Desde /admin/alerts → /admin/bets?tab=failures o risk.

Checklist final “Listo para HTML”
- Sidebar Admin correcto y activo en Apuestas.
- Tabs + query params.
- Filtros sticky + URL sync.
- Tabla + drawer + estados UI.
- Bulk safety definido.

### Definiciones (pending vs placed)

- `pending`: pre-envío / en cola.
- `placed`: request enviado al broker (aún sin confirmación).

### Nota sobre Refund (Fase 2)

- `Refund` es Fase 2: se gestiona vía Disputes; no es estado de bet (es transacción financiera).

### Nota sobre Void (Compliance)

- `void` = estado final marcado por compliance por reglas del evento.
- No es reversible en UI; cualquier corrección posterior queda en Audit/Disputes (Fase 2).

## Contrato Tabs/Status (MVP)

- executions: `status ∈ {accepted, settled, cashout, hedge}`
- failures: `status = rejected AND error_code != null`
- risk: `risk_level ∈ {RESTRICT, LOCK}` independiente de `status`
- Nota opcional (Failures, stuck/timeout): incluir también `status ∈ {pending, placed}` con `timeout + error` (stuck) como failures, por ejemplo `REQUEST_TIMEOUT`, `PROVIDER_DOWN`, o marcado `stuck`.
# 🧠 Agents Hub — Fuente de verdad (UI + Backend)

Rol: documento maestro para definir qué es un agente, cómo se comporta, qué puede configurar el usuario, qué estados muestra la UI y cómo se integra con otros módulos (Signals, Bets, Risk).

---

## 1) Propósito del módulo

Agents Hub es el centro donde el usuario visualiza, configura y controla los agentes automáticos y asistidos del sistema. Un Agente es una entidad lógica autónoma que observa datos (señales, mercado, riesgo, estado del usuario), toma decisiones acotadas y ejecuta acciones solo si el plan, el riesgo y los permisos lo permiten. El sistema siempre puede detener al agente.

---

## 2) Tipos de agentes (MVP)

- 🤖 AI Signals Agent
  - Consume señales generadas por IA interna, tipsters verificados y/o un canal Master.
  - Modos según plan: Básico → Notificar; Pro → Sugerir; Premium → Ejecutar (auto).
  - Ejemplo: "Value > X y riesgo < Y → sugerir entrada".

- 📊 Copy-Trade Agent
  - Replica decisiones de tipsters humanos o agentes IA.
  - No analiza el mercado por sí mismo; aplica filtros: stake, riesgo, cooldown, límites por plan.
  - Modos: Básico → Observación; Pro → Semi-auto; Premium → Auto.

- 🧠 Risk Guard Agent (siempre activo)
  - Transversal y prioritario: monitorea drawdown, pérdidas diarias, exceso de operaciones y violaciones de límites.
  - Acciones: Pausar agentes, bloquear ejecución y lanzar alertas.
  - Tiene prioridad absoluta; ningún plan puede desactivarlo.

- 🧪 Simulation / Paper Agent (opcional MVP+)
  - Opera en modo simulación y no impacta la wallet real.
  - Usos: onboarding, pruebas y ranking justo.

---

## 3) Estados de un agente (crítico para UI)

Estado finito aplicable a todos los agentes, siempre visible en la tarjeta:
- OFF → No observa ni actúa.
- ON → Observa y actúa según permisos.
- PAUSED → Pausado temporalmente (usuario o sistema).
- PAUSED_BY_LIMIT → Pausa automática al alcanzar el cupo del plan. Color sugerido: ámbar/naranja. CTA en UI: "Comprar créditos" o "Upgrade plan".
- RUNNING → Procesando ejecución asíncrona; UI: spinner + "enviando a Cloudbet…"; se usa cuando hay operación en curso (colas/confirmaciones).
- LOCKED → Bloqueado por Risk Guard / Admin / Compliance.
- ERROR → Fallo técnico (API, datos, ejecución).

Recomendación UI: Mostrar el estado en la card del agente y en el detalle, con color y explicación breve.

---

## 4) Reglas por plan

- 🟢 Plan Básico – $29.99
  - Agentes solo en observación; notificaciones habilitadas.
  - Sin ejecución automática y sin copy real.
  - Uso de API Cloudbet solo con créditos; cada apuesta se paga con crédito; no incluye apuestas automáticas.

- 🟡 Plan Pro – $129.99
  - Activación parcial de agentes; copy semi-automático.
  - Hasta 12 señales externas visibles.
  - Máx. 8 apuestas vía API al mes; no aplica en LIVE.
  - Permite comprar créditos y usar API Cloudbet.
  - Saldo recomendado sugerido: $1,000 (no obligatorio).

- 🔴 Plan Premium – $799.99
  - Ejecución automática.
  - Hasta 30 apuestas/mes y hasta 8 apuestas LIVE.
  - Selección de fuentes: IA, tipsters humanos o ambos.
  - Apuestas simples y combinadas. Control de riesgo por toploss (definido por usuario o delegable al agente).
  - Si agota cupo, puede comprar créditos.

---

## 5) Configuración por agente

- El usuario SÍ puede (según plan):
  - Stake (flat / %), riesgo máximo, mercados permitidos, horarios activos.
  - Cooldown entre entradas; modo (notify / semi / auto).
  - Selección de fuentes (IA / Tipsters / ambos).

- El usuario NO puede (control del sistema):
  - Lógica IA interna, validaciones core, límites legales, compliance.
  - Risk Guard y reglas internas de cálculo.

Regla clave: El agente nunca rompe el sistema; el sistema rompe al agente.

---

## 6) Relación con otros módulos

- Signals: Fuente primaria de eventos. El agente consume, no crea señales.
- Bets: El agente puede generar apuestas si el plan lo permite; todas las bets quedan auditadas.
- Risk: Subordinación total al Risk Guard. Si Risk dice STOP → el agente se bloquea.

---

## 7) UI/UX del Agents Hub

// ... existing code ...

Coherencia de nombres: usar "Agents Hub" en navegación, sidebars y etiquetas. Mantener el label uniforme y el route "/agents".

---

## 8) Métricas y ranking

- Agent Composite Score (definición técnica en ARCHITECTURE.md).
- Evaluaciones recomendadas: ROI, CLV (Closing Line Value), calibración, consistencia y penalización por drawdown.
- Mostrar ranking profesional y por mercado; permitir filtros por agente, liga y mercado.

---

## 9) Permisos, API y cumplimiento

- API Cloudbet: Pro y Premium pueden usar API según cupos; Básico solo observación/notificaciones y apuestas con créditos.
- Compliance y administración: pueden imponer LOCKED; el sistema registra auditoría de decisiones y ejecuciones.

---

## 10) Roadmap breve

- MVP: AI Signals + Copy-Trade + Risk Guard, estados completos en UI, cards por agente, auditoría básica.
- MVP+: Simulation Agent, simulador personal, ranking avanzado.
- Escala: Más ligas, LIVE robusto, comparativas IA vs tipsters, panel de comunidad y seguimiento.

---

## 11) Referencias cruzadas

- Arquitectura técnica y métricas avanzadas: ver ARCHITECTURE.md.
- Navegación y rutas: ver docs/ui/navigation/ROUTES.md.
- Sidebars y módulos de usuario: ver docs/ui/sidebars/SIDEBAR-USUARIO.md.

---

## 12) Contadores por plan (límites y reset)

- Tipo de conteo: mensual por calendario.
- Reset: 00:00 UTC del primer día de cada mes.
- Créditos: el uso de créditos NO reinicia el contador del plan; solo habilita apuestas adicionales fuera del cupo del plan.
- UI requerida: mostrar "usadas / disponibles / fecha de reset" por agente.
- Backend requerido: contador idempotente por agente y por mes (period_key = YYYY-MM), con auditoría.
- Regla de cómputo de apuesta: cuenta cuando Cloudbet confirma aceptación; intentos fallidos (401/403/429/timeouts/rechazos) no consumen cupo, pero sí generan auditoría (event_type=execute, reason=system). Reintentos idempotentes no duplican conteo.

---

## 13) Agent Quotas / Usage (estándar de UI y Backend)

Estructura recomendada (por agente):
```json
{
  "agentId": "Agent-EPL-01",
  "plan": "basic" | "pro" | "premium",
  "usage": {
    "betsUsedThisMonth": 0,
    "betsRemaining": 0,
    "liveBetsUsedThisMonth": 0,
    "creditsUsedThisMonth": 0,
    "resetDate": "2026-03-01T00:00:00.000Z",
    "lastUpdated": "2026-02-06T12:00:00.000Z"
  },
  "source": {
    "plan": true,
    "credits": {
      "balance": 0,
      "spentThisMonth": 0
    }
  }
}
```
- UI: usar usage.betsUsedThisMonth, usage.betsRemaining y usage.resetDate para el banner de cuota.
- Backend: todos los incrementos deben ser idempotentes (operation_id) y auditados.
- billing_mode: plan_first | credits_first | manual
- Default: plan_first (recomendado)
- Regla de consumo: el sistema aplica el orden definido por billing_mode para evitar uso no deseado de créditos.

---

## 14) Límite alcanzado (regla operativa)

Cuando un agente alcanza su límite comercial del plan:
- Estado operativo cambia a: PAUSED_BY_LIMIT.
- UI muestra CTA: "Comprar créditos" o "Upgrade plan".
- No se usa ERROR ni LOCKED (para no mezclar límites comerciales con riesgo técnico).
- Reanudación automática en el próximo reset mensual o inmediato si se compra crédito (solo operaciones con crédito, sin reiniciar contador del plan).

Nota: PAUSED_BY_LIMIT se considera parte del conjunto de estados del sistema y debe ser visible igual que los otros estados.

---

## 15) Cloudbet API – Alcance por agente y plan

Acción | Básico | Pro | Premium
--- | --- | --- | ---
Ejecutar vía API | ❌ | ⚠️ limitado (hasta 8/mes; sin LIVE) | ✅
LIVE | ❌ | ❌ | ✅ (hasta 8/mes)
Auto | ❌ | ❌ | ✅

- Pro: ejecución vía API limitada y solo PRE; requiere confirmación (semi-auto) con límites estrictos.
- Premium: habilita auto y LIVE dentro de los cupos y del Risk Guard.

---

## 16) Auditoría del Agente (Agent Audit)

Cada decisión del agente genera un evento de auditoría con:
- event_type: observe | suggest | execute | block
- reason: risk | limit | user | system
- source: signal | tipster | ia
- Campos mínimos: timestamp (ISO), agentId, operation_id (idempotencia), betId (opcional si aplica), metadata (mercado, stake, odds_min, odds_exec).

UI: visible en "Historial del agente" con filtros por event_type y reason.
Backend: logs inmutables, firmados/estructurados.

---

## 17) Visibilidad para usuario Básico en Agents Hub

- Acceso: Sí, Agents Hub visible.
- Modo: Read-only en cards; CTAs deshabilitados con badge "Upgrade required".
- Información: métricas, estado y historial visualizables; acciones de ejecución/copy no disponibles.
- Permisos: solo observación y notificaciones (sin ejecución, sin LIVE).

## 18) Toploss y Risk Guard — defaults por plan

- Premium: toploss ON recomendado. Si el usuario no configura nada, aplica Risk Guard con límites del sistema.
- Pro: solo alertas por defecto; el stop automático por toploss requiere configuración explícita del usuario; Risk Guard siempre activo.
- Básico: N/A (observación y alertas); Risk Guard siempre activo.

## 19) Cloudbet API Setup (UI + estados)

- Ubicación de configuración: subpantalla dentro de /agents ("Integración Cloudbet") y/o Settings > Integraciones > Cloudbet.
- Estados de conexión: connected | invalid | revoked | rate_limited.
- Persistencia: se guarda una referencia segura (id/alias cifrado); nunca mostrar ni almacenar la key completa en claro.
- Acciones UI: "Conectar", "Probar conexión", "Revocar".
- Error mapping: 401/403/429/timeouts → estado ERROR con reason=system y detalle; el agente no ejecuta hasta resolver.

## 20) Límites de stake por plan (marco, sin números)

- Básico: stake solo manual con crédito.
- Pro: stake con límites por plan (definidos por sistema/plan; el usuario opera dentro de esos límites).
- Premium: stake avanzado + auto (con controles de riesgo y toploss; sujetos al Risk Guard).

---

## 21) Impacto en Sistema de Compensación

### Aportes al Bank por uso de agentes
- Las suscripciones que habilitan agentes aportan al Bank binario:
  - Básico $29.99 → +$20 Bank
  - Pro $129.99 → +$80 Bank
  - Premium $799.99 → +$500 Bank

### Elegibilidad para Pool Semanal
- Usuario debe tener plan activo (dentro de 30 días de activación)
- Agentes pueden operar, pero el pago del pool depende de:
  - Rango base (calculado por Bank Total)
  - Rango pagable (limitado por plan actual)
  - Cutoff: miércoles 00:00 UTC semana anterior

### Referidos Directos
- Si un referido directo activa un agente (plan Pro/Premium):
  - Referidor cobra 10% sobre el pago real del plan
  - No aplica sobre bonos ni créditos

### Transparencia en UI
- Dashboard debe mostrar:
  - Bank Total impactado por renovaciones de plan
  - Días de activación restantes (afecta elegibilidad pool)
  - Próximos 4 miércoles elegibles

Referencia cruzada: ver REFERIDOS-EQUIPO-COMPENSACION.md para reglas completas

---

## 22) Tablas Relacionadas (DATA-MODEL.md)

### Tablas Core para Agents

users
- Plan del usuario determina límites de agente
- bankroll actualizado por apuestas del agente
- status puede bloquear agentes (SUSPENDED)

subscriptions
- Tabla crítica: determina plan activo
- status (ACTIVE, PAUSED, CANCELLED) afecta disponibilidad de agentes
- end_at determina elegibilidad para pool semanal

credit_wallets + credit_transactions
- Uso de créditos para apuestas fuera del cupo del plan
- balance debe decrementar al usar agente con créditos
- Idempotencia por operation_id

risk_profiles
- locked por Risk Guard bloquea TODOS los agentes
- locked_by (SYSTEM, ADMIN) determina quién puede desbloquear
- daily_loss_limit, max_drawdown, max_bets_per_day limitan agentes

audit_logs
- Cada decisión del agente debe generar log inmutable
- actor_role = SYSTEM cuando agente ejecuta
- action puede ser: observe, suggest, execute, block
- metadata incluye: signalId, stake, odds, reason

bets
- Apuestas generadas por agente deben tener referencia
- metadata.agent_id para tracking
- metadata.auto_executed = true/false

alerts
- Agentes generan alertas de tipo RISK cuando detectan problemas
- entity_type = 'agent', entity_id = agentId
- severity puede pausar agentes automáticamente

### Nuevas tablas sugeridas

agent_configs (nueva, recomendada)
```
CREATE TABLE agent_configs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  agent_type VARCHAR(50), -- 'ai_signals', 'copy_trade', 'risk_guard'
  status VARCHAR(20), -- OFF, ON, PAUSED, PAUSED_BY_LIMIT, etc.
  config JSONB, -- stake, riskLevel, markets, hours, etc.
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

agent_usage_counters (nueva, crítica)
```
CREATE TABLE agent_usage_counters (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  agent_id VARCHAR(50),
  period_key VARCHAR(7), -- 'YYYY-MM'
  bets_used INT DEFAULT 0,
  live_bets_used INT DEFAULT 0,
  credits_spent INT DEFAULT 0,
  last_reset TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  UNIQUE(user_id, agent_id, period_key)
);
```

agent_audit (nueva, para tracking detallado)
```
CREATE TABLE agent_audit (
  id UUID PRIMARY KEY,
  agent_id VARCHAR(50),
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(20), -- observe, suggest, execute, block
  reason VARCHAR(50), -- risk, limit, user, system
  signal_id UUID,
  bet_id UUID,
  operation_id VARCHAR(100), -- idempotencia
  metadata JSONB,
  created_at TIMESTAMPTZ
);
```

---

## 23) Endpoints API (integrar en API-SPEC.md)

### Agents Management

#### GET /agents
- auth: USER|TIPSTER|ADMIN
- query: type?, status?, page?, pageSize?
- resp 200: {
  page, pageSize, total, items: [
    {
      agentId, agentType, status, displayName,
      metrics: { roi, yield, drawdown, operations },
      compositeScore, plan, usage: {
        betsUsedThisMonth, betsRemaining, resetDate
      }
    }
  ]
}
- errores: 401, 403

#### GET /agents/:agentId
- auth: USER|TIPSTER|ADMIN
- resp 200: {
  agentId, agentType, status, config,
  metrics: { roi, clv, calibration, consistency, drawdown },
  compositeScore, usage, audit: [ /* últimas 50 decisiones */ ]
}
- errores: 401, 403, 404

#### PATCH /agents/:agentId/config (USER)
- body: {
  status?: 'ON' | 'OFF' | 'PAUSED',
  config?: {
    stake?: { type: 'flat' | 'percentage', value: number },
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH',
    markets?: ['1X2', 'over_under', ...],
    activeHours?: { start: '08:00', end: '22:00' },
    cooldownMinutes?: number
  }
}
- validaciones:
  - Usuario no puede cambiar a ON si plan no lo permite
  - Usuario no puede modificar Risk Guard
  - Config debe cumplir límites del plan
- resp 200: { agentId, status, config, updatedAt }
- errores: 401, 403, 422

#### POST /agents/:agentId/start (USER)
- precondición: plan permite activación, no hay LOCKED
- efecto: cambia status a ON
- resp 200: { agentId, status: 'ON', startedAt }
- errores: 401, 403 (plan insuficiente), 409 (ya está ON o LOCKED)

#### POST /agents/:agentId/pause (USER|SYSTEM)
- body: { reason?: string }
- efecto: cambia status a PAUSED
- resp 200: { agentId, status: 'PAUSED', pausedAt, reason }
- errores: 401, 403, 404

#### GET /agents/:agentId/usage (USER)
- resp 200: {
    agentId, plan, usage: {
    betsUsedThisMonth, betsRemaining,
    liveBetsUsedThisMonth, liveBetsRemaining,
    creditsSpentThisMonth, resetDate, lastUpdated
  },
  source: { plan: true, credits: { balance, spentThisMonth } }
}
- errores: 401, 403, 404

#### GET /agents/:agentId/audit (USER|ADMIN)
- query: eventType?, reason?, page?, pageSize?
- resp 200: {
  page, pageSize, total, items: [
    {
      eventType, reason, signalId, betId,
      timestamp, metadata: { market, stake, odds }
    }
  ]
}
- errores: 401, 403, 404

### Cloudbet Integration

#### POST /agents/cloudbet/connect (USER)
- body: { apiKey: string }
- efecto: valida key, guarda referencia cifrada
- resp 200: { status: 'connected', validatedAt }
- errores: 401, 403, 422 (key inválida)

#### POST /agents/cloudbet/test (USER)
- precondición: key ya conectada
- efecto: hace test request a Cloudbet API
- resp 200: { status: 'connected', latency, rateLimit }
- errores: 401, 403, 503 (Cloudbet down)

#### DELETE /agents/cloudbet/revoke (USER)
- efecto: revoca acceso, elimina key
- resp 200: { status: 'revoked', revokedAt }
- errores: 401, 403

#### GET /agents/cloudbet/status (USER)
- resp 200: {
  status: 'connected' | 'invalid' | 'revoked' | 'rate_limited',
  lastChecked, nextCheck, rateLimitInfo
}
- errores: 401, 403

### Admin - Agent Management

#### POST /admin/agents/:agentId/lock (ADMIN)
- body: { reason: string }
- efecto: cambia status a LOCKED, registra en audit_logs
- resp 200: { agentId, status: 'LOCKED', lockedBy: 'ADMIN', reason }
- errores: 401, 403, 404

#### POST /admin/agents/:agentId/unlock (ADMIN)
- body: { reason: string }
- efecto: cambia status a OFF, registra en audit_logs
- resp 200: { agentId, status: 'OFF', unlockedBy: 'ADMIN', reason }
- errores: 401, 403, 404

#### GET /admin/agents/stats
- resp 200: {
  totalAgents, activeAgents, pausedAgents, lockedAgents,
  totalBetsThisMonth, avgCompositeScore
}
- errores: 401, 403

---

## 24) Flujo de Decisión del Agente

### Diagrama de Flujo

```
┌─────────────────────────────────────┐
│ 1. SEÑAL DETECTADA                  │
│ (AI Signals / Tipster / Master)    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 2. VALIDACIÓN DE PLAN               │
│ ¿Plan permite observar señal?       │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │ NO          │ SÍ
        ▼             ▼
    [BLOCK]    ┌──────────────────────┐
               │ 3. FILTROS DE CONFIG │
               │ - Mercado permitido? │
               │ - Horario activo?    │
               │ - Cooldown OK?       │
               └──────────┬───────────┘
                          │
                   ┌──────┴──────┐
                   │ NO          │ SÍ
                   ▼             ▼
               [DISCARD]   ┌────────────────────┐
                           │ 4. RISK GUARD      │
                           │ - Drawdown OK?     │
                           │ - Límite diario OK?│
                           │ - Cuenta no LOCKED?│
                           └──────────┬─────────┘
                                      │
                               ┌──────┴──────┐
                               │ NO          │ SÍ
                               ▼             ▼
                           [PAUSE]     ┌──────────────────┐
                                       │ 5. CUPO DE PLAN  │
                                       │ - Bets remaining?│
                                       └──────────┬───────┘
                                                  │
                                           ┌──────┴──────┐
                                           │ NO          │ SÍ
                                           ▼             ▼
                              [PAUSED_BY_LIMIT]   ┌────────────────────┐
                                      │           │ 6. MODO DE AGENTE  │
                                      │           │ - Básico: Notify   │
                                      │           │ - Pro: Suggest     │
                                      │           │ - Premium: Execute │
                                      │           └──────────┬─────────┘
                                      │                      │
                                      │              ┌───────┴────────┐
                                      │              │                │
                                      │              ▼                ▼
                                      │         [NOTIFY]         [SUGGEST]
                                      │                               │
                                      │              ┌────────────────┘
                                      │              │ User confirma?
                                      │              │ (Pro: manual)
                                      │              ▼
                                      │         ┌─────────┐
                                      │         │   NO    │ SÍ
                                      │         ▼         ▼
                                      │     [CANCEL]  [EXECUTE]
                                      │                   │
                                      └───────────────────┤
                                                          │
                                                          ▼
                                              ┌─────────────────────┐
                                              │ 7. CLOUDBET API     │
                                              │ - Validar odds      │
                                              │ - Enviar orden      │
                                              │ - Confirmar         │
                                              └──────────┬──────────┘
                                                         │
                                                  ┌──────┴──────┐
                                                  │ OK          │ ERROR
                                                  ▼             ▼
                                            [SUCCESS]      [ERROR]
                                                  │             │
                                                  │             └─> Reintento?
                                                  │                 (max 3)
                                                  ▼
                                          ┌─────────────────┐
                                          │ 8. AUDITORÍA    │
                                          │ - Guardar en DB │
                                          │ - Actualizar    │
                                          │   contador      │
                                          │ - Alert si need │
                                          └─────────────────┘
```

### Estados del Flujo
1. OBSERVE – Agente detecta señal
2. VALIDATE – Verifica plan y permisos
3. FILTER – Aplica config de usuario
4. RISK_CHECK – Valida Risk Guard
5. QUOTA_CHECK – Verifica cupo del plan
6. DECIDE – Determina acción según modo
7. EXECUTE – Envía a Cloudbet (si aplica)
8. AUDIT – Registra decisión

### Salidas Posibles
- EXECUTED – Apuesta ejecutada exitosamente
- NOTIFIED – Usuario notificado (Básico)
- SUGGESTED – Requiere confirmación (Pro)
- BLOCKED – Plan insuficiente
- DISCARDED – No pasa filtros
- PAUSED – Risk Guard detuvo
- PAUSED_BY_LIMIT – Cupo agotado
- ERROR – Fallo técnico (API/timeout)

### Tiempos de Respuesta
- OBSERVE → DECIDE: <500ms
- DECIDE → EXECUTE: <2s (Cloudbet API)
- Total end-to-end: <3s (objetivo)

---

## 25) Estrategia de Reintentos (Cloudbet API)

### Políticas de Reintento por Error

#### 401/403 Unauthorized/Forbidden
- Acción: NO reintentar
- Motivo: Key inválida o revocada
- Estado agente: ERROR
- UI: "Reconecta tu cuenta Cloudbet"
- Auditoría: event_type=execute, reason=auth_failed

#### 429 Rate Limit
- Acción: Esperar según header Retry-After
- Reintentos: Máx 2 reintentos con backoff exponencial
- Backoff: 1s, 2s, 4s
- Estado agente: RUNNING (esperando)
- UI: "Rate limit alcanzado, reintentando..."
- Auditoría: event_type=execute, reason=rate_limited

#### 503/504 Service Unavailable/Timeout
- Acción: Reintentar con backoff
- Reintentos: Máx 3 reintentos
- Backoff: 2s, 5s, 10s
- Estado agente: RUNNING
- UI: "Cloudbet temporalmente no disponible"
- Auditoría: event_type=execute, reason=api_unavailable

#### 422 Unprocessable Entity
- Acción: NO reintentar
- Motivo: Validación de Cloudbet falló (odds cambió, mercado cerrado)
- Estado agente: Vuelve a ON (espera nueva señal)
- UI: "Odds ya no disponibles"
- Auditoría: event_type=execute, reason=market_changed
- Contador: NO consume cupo (operación fallida)

#### 500 Internal Server Error
- Acción: 1 reintento después de 5s
- Estado agente: ERROR si falla
- UI: "Error en Cloudbet, contacta soporte"
- Auditoría: event_type=execute, reason=cloudbet_error

### Idempotencia de Reintentos

```
interface RetryOperation {
  operation_id: string; // UUID único por intento de apuesta
  signal_id: string;
  agent_id: string;
  attempt: number; // 1, 2, 3
  max_attempts: number; // 3
  status: 'pending' | 'success' | 'failed';
  cloudbet_response?: any;
  created_at: Date;
}
```

Regla: operation_id debe ser el mismo en todos los reintentos de la misma señal. Cloudbet debe recibir el mismo operation_id como referencia para evitar duplicados.

### Contador de Cupo

- Consume cupo: Solo cuando Cloudbet responde 200 OK (apuesta aceptada)
- NO consume cupo:
  - 401/403 (auth)
  - 429 (rate limit)
  - 503/504 (unavailable)
  - 422 (validación falló)
  - 500 (error interno)
  - Timeouts (<30s)

### Alertas Automáticas

```
if (consecutiveFailures >= 3) {
  createAlert({
    type: 'SYSTEM',
    severity: 'ERROR',
    message: 'Cloudbet API failing repeatedly',
    entity_type: 'agent',
    entity_id: agentId,
    metadata: { errors: lastErrors }
  });
  
  // Pausar agente automáticamente
  updateAgentStatus(agentId, 'PAUSED', 'system');
}
```

---

## 26) Testing & QA Checklist

### Unit Tests (Backend)

#### Agent Config
- [ ] Usuario puede cambiar config dentro de límites del plan
- [ ] Usuario NO puede cambiar config que exceda su plan
- [ ] Cambio de status OFF → ON valida plan actual
- [ ] Risk Guard NO puede ser desactivado por usuario

#### Usage Counter
- [ ] Contador incrementa solo cuando Cloudbet acepta
- [ ] Contador NO incrementa en errores 401/403/429/503
- [ ] Reset mensual ocurre exactamente a las 00:00 UTC
- [ ] Idempotencia: mismo operation_id NO incrementa 2 veces

#### Cloudbet API
- [ ] Retry logic con backoff exponencial funciona
- [ ] Máximo 3 reintentos se respeta
- [ ] operation_id se mantiene en reintentos
- [ ] Timeouts <30s NO consumen cupo

### Integration Tests

#### Flujo Completo
- [ ] Señal detectada → Agente ON → Apuesta ejecutada
- [ ] Plan Básico: señal → NOTIFY (sin ejecución)
- [ ] Plan Pro: señal → SUGGEST → confirmación manual
- [ ] Plan Premium: señal → auto EXECUTE

#### Risk Guard
- [ ] Drawdown excedido → todos los agentes pausan
- [ ] Límite diario alcanzado → PAUSED_BY_LIMIT
- [ ] Usuario bloqueado (LOCKED) → agentes bloqueados

#### Cupo de Plan
- [ ] Pro: 8 apuestas → 9na falla con PAUSED_BY_LIMIT
- [ ] Compra de créditos → agente continúa (sin resetear contador plan)
- [ ] Reset mensual → contador vuelve a 0

### E2E Tests (Frontend + Backend)

#### UI Agent Hub
- [ ] Cards muestran estado correcto (OFF, ON, PAUSED, etc.)
- [ ] Badge "usadas / disponibles / reset" actualiza en tiempo real
- [ ] CTA "Comprar créditos" aparece en PAUSED_BY_LIMIT
- [ ] Modal de config solo permite cambios permitidos por plan

#### Dashboard
- [ ] Notificaciones llegan cuando agente NOTIFY
- [ ] Confirmación manual funciona en modo SUGGEST
- [ ] Auto-ejecución en Premium funciona sin confirmación
- [ ] Historial de auditoría muestra todas las decisiones

### Load Tests
- [ ] 100 señales simultáneas → agentes procesan sin bloqueo
- [ ] 1000 usuarios con agentes activos → backend estable
- [ ] Cloudbet API rate limit → sistema maneja 429 correctamente

### Security Tests
- [ ] API keys nunca expuestas en logs
- [ ] Endpoint /agents/:id/config valida permisos
- [ ] Admin puede LOCK cualquier agente
- [ ] Usuario NO puede modificar Risk Guard

### Compliance Tests
- [ ] Toda decisión genera audit log
- [ ] Logs inmutables (no se pueden editar)
- [ ] operation_id garantiza idempotencia
- [ ] Reintentos auditados correctamente

Acceso desde dashboard: /agents
CTAs de la landing apuntan a /login; tras autenticación, el usuario accede al dashboard y desde allí al Agents Hub.

---

# 📋 ANÁLISIS CRÍTICO - AGENTS HUB

## ✅ Funcionalidades Implementadas en UI

### 1. Navegación y Estructura
- **Sidebar activa**: Agents Hub correctamente resaltado en navegación
- **Breadcrumbs funcionales**: Inicio › Agents Hub
- **Layout consistente**: Mantiene el patrón de dashboard establecido

### 2. Visualización de Agentes
- **Ranking semanal**: Top 10 agentes con ROI, CLV y consistencia
- **Cards de agentes personales**: Información clara de estado, métricas y uso
- **Sistema de badges de estado**: ON, PAUSED, RUNNING, LOCKED, ERROR, PAUSED_BY_LIMIT
- **Filtros dinámicos**: Por tipo (IA/Copy), modo (Observe/Semi/Auto), mercado (PRE/LIVE), estado

### 3. Gestión de Agentes
- **Modal de configuración**: Panel lateral con opciones de billing, modo, stakes, mercados
- **Controles de estado**: Botones de pausar/reanudar por agente
- **Integración Cloudbet**: Sección de conexión API con estados
- **Cuotas y créditos**: Visualización de uso mensual y reset

### 4. Interactividad JavaScript
- **Dropdown de referidos**: Funcional en sidebar
- **Modal de configuración**: Abre/cierra correctamente
- **Sistema de billing modes**: Selector plan_first/credits_first/manual
- **Validación de estados**: Cambia colores según estado del agente

## ⚠️ Problemas de Alineación Visual

### 1. Espaciado Inconsistente
- **Cards de agentes**: Alturas variables cuando hay diferentes cantidades de métricas
- **Grid responsive**: Saltos bruscos entre 1-2-3 columnas sin transiciones suaves
- **Padding en modales**: 16px vs 20px en diferentes secciones

### 2. Tipografía Desalineada
- **Tamaños de fuente**: 11px para labels vs 12px en otros módulos
- **Pesos de fuente**: Inconsistente entre Rajdhani y JetBrains Mono
- **Textos truncados**: "PAUSED_BY_LIMIT" demasiado largo para badges

### 3. Iconografía y Colores
- **Badge colors**: Naranja (#FFA500) para PAUSED no coincide con paleta principal
- **Status dots**: 8px pero espaciado irregular con texto
- **Gradientes**: Uso inconsistente de gradientes en botones primarios

## 🚨 Problemas Críticos de Funcionalidad

### 1. Datos Completamente Estáticos
```javascript
// Todos los datos están hardcodeados en HTML
const agents = [
  { name: "AI Signals Agent", roi: "+8.2%", status: "ON" },
  { name: "Copy-Trade Agent", roi: "+3.1%", status: "PAUSED" }
];
```
- **No hay consumo de API**: Todo es HTML estático
- **Sin actualización en tiempo real**: Métricas no se refrescan
- **Sin persistencia**: Configuraciones no se guardan

### 2. Falta de Integración Backend
- **Sin endpoints**: No consume /api/agents, /api/usage, /api/config
- **Sin autenticación**: No valida planes ni permisos de usuario
- **Sin WebSocket**: Sin actualizaciones de estado en tiempo real
- **Sin base de datos**: Sin tabla agents, agent_configs, agent_usage

### 3. Lógica de Negocio Incompleta
- **Sin validación de planes**: No verifica límites de Pro/Basic/Premium
- **Sin contadores**: No rastrea apuestas usadas/disponibles
- **Sin sistema de créditos**: No gestiona compra/consumo de créditos
- **Sin integración Cloudbet**: Conexión API es simulada

### 4. Estados de Agentes Limitados
- **Sin transiciones**: Estados no cambian dinámicamente
- **Sin lógica Risk Guard**: No hay validación de riesgo real
- **Sin reintentos**: No maneja fallos de API
- **Sin auditoría**: Sin logs de decisiones del agente

### 5. Funcionalidades Incompletas
- **Sin creación de agentes**: Botón "Crear agente" no funciona
- **Sin backtesting**: No hay simulación de estrategias
- **Sin ranking dinámico**: Posiciones fijas en tabla
- **Sin notificaciones**: Sin alertas de cambios de estado

## 🔧 Problemas Técnicos

### 1. Rendimiento
- **DOM manipulation ineficiente**: querySelector en cada interacción
- **Sin virtualización**: Renderiza todos los agentes siempre
- **Sin lazy loading**: Carga todo el contenido inicialmente

### 2. Seguridad
- **Sin validación de inputs**: Campos de configuración sin sanitización
- **Sin rate limiting**: Sin protección contra abuso
- **Sin encriptación**: API keys en texto plano (simulado)

### 3. Accesibilidad
- **Sin ARIA labels**: Sin soporte para lectores de pantalla
- **Sin keyboard navigation**: Solo mouse-based
- **Sin estados de carga**: Sin indicadores de procesamiento

## 📊 Resumen del Impacto

### Severidad: 🔴 ALTA
El módulo Agents Hub, aunque visualmente atractivo, es **funcionalmente inoperante**. Representa un mockup avanzado que:

1. **No puede gestionar agentes reales** - Todo es estático
2. **No integra con el ecosistema** - Aislado de Signals, Risk Guard, Bankroll
3. **No cumple requisitos de negocio** - Sin validación de planes ni límites
4. **No proporciona valor al usuario** - Sin automatización real

### Recomendaciones Prioritarias:
1. **Implementar API REST** para agents, usage, configuration
2. **Crear sistema de estados** con transiciones reales
3. **Integrar con Cloudbet API** para ejecución real
4. **Desarrollar contadores** de uso por plan
5. **Implementar Risk Guard** con validaciones en tiempo real

## 🎯 Estado Actual: MOCKUP VISUAL COMPLETO
**Progreso estimado: 15%** - Excelente base visual que requiere desarrollo backend sustancial para ser funcional.
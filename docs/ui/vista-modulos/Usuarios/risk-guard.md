# Risk Guard Module (Risk Alerts)

## Concepto Central

**Risk Guard no es un sistema de control — es un sistema de entrenamiento conductual.**

El módulo evalúa continuamente el comportamiento operativo del usuario y determina cuándo advertir, frenar, bloquear temporalmente o permitir ejecución. Su función es **proteger el capital y el comportamiento del usuario**, no impedir que opere.

**Principio fundamental:** La plataforma no intenta impedir que el usuario opere. La plataforma intenta evitar auto-destrucción.

---

## 1. Propósito del Módulo

Risk Guard es el **guardia de riesgo obligatorio** que se interpone entre la intención y la ejecución.

**Ubicación en el flujo del sistema:**

```
Watchlist (intención)
   ↓
Trader Master (decisión)
   ↓
Risk Guard (evaluación de riesgo) ← ESTE MÓDULO
   ↓
Agents Hub / Execution Engine
   ↓
Cloudbet
```

### 1.3. Objeto de Decisión: TradeIntent vs TradeTicket

Para mantener coherencia en el sistema, definimos dos objetos de decisión:

**TradeIntent** (Exportación directa desde Watchlist):
- Creado cuando el usuario exporta un pick individual desde Watchlist
- Relación 1:1 con un pick
- Flujo: Watchlist → Export → Risk Guard → TradeIntent → Execution

**TradeTicket** (Decisiones combinadas desde Trader Master):
- Creado cuando el usuario genera tickets combinados en Trader Master
- Puede contener múltiples TradeIntent (parlays, sistemas, etc.)
- Flujo: Trader Master → TradeTicket → [TradeIntent 1, TradeIntent 2, ...] → Risk Guard → Execution

```javascript
// Ejemplo de TradeIntent individual
const tradeIntent = {
  id: 'ti_123',
  type: 'SINGLE', // SINGLE, PARLAY, SYSTEM
  source: 'WATCHLIST_EXPORT', // WATCHLIST_EXPORT, TRADER_MASTER
  pick_id: 'pick_456',
  stake: 50,
  odds: 1.95,
  status: 'PENDING',
  risk_evaluation: null // se llena después de Risk Guard
}

// Ejemplo de TradeTicket desde Trader Master
const tradeTicket = {
  id: 'tt_789',
  type: 'PARLAY',
  source: 'TRADER_MASTER',
  trade_intents: ['ti_123', 'ti_124', 'ti_125'],
  total_stake: 100,
  total_odds: 5.2,
  status: 'PENDING'
}
```

**Regla de negocio:** Cada TradeIntent pasa individualmente por Risk Guard antes de poder ser ejecutado, independientemente de si viene de Watchlist o de un TradeTicket.

**Risk Guard es obligatorio:**
- Ninguna ejecución puede pasar al Execution Engine sin evaluación previa
- Ningún agente puede operar si Risk Guard detecta riesgo crítico
- Ningún stake puede exceder los límites definidos sin intervención

### 1.1. Qué Evalúa

Risk Guard analiza **6 dimensiones críticas:**

1. **Overtrading** (sobre-operación)
2. **Exposure excesiva** (capital comprometido)
3. **Violación de stake** (apuestas fuera de plan)
4. **Drawdown** (pérdidas acumuladas)
5. **Tilt detection** (comportamiento emocional)
6. **Selective execution** (ejecución selectiva)

### 1.2. Qué NO Hace

- ❌ NO ejecuta operaciones
- ❌ NO calcula stakes (eso es Bankroll)
- ❌ NO genera señales (eso es Signals)
- ❌ NO juzga la calidad del pick
- ✅ SOLO evalúa si el comportamiento es seguro

---

## 2. Principios del Sistema

### 2.1. Filosofía de Intervención

El sistema:
- ✅ **Nunca juzga** la calidad del análisis
- ✅ **Nunca castiga** permanentemente
- ✅ **Siempre explica** el motivo de la restricción
- ✅ **Educa** sobre gestión de riesgo
- ✅ **Protege** al usuario de sí mismo

**Objetivo:** Crear disciplina operativa sin fricción.

### 2.2. Mensajes Constructivos

**Principio de comunicación:**

| ❌ Evitar | ✅ Usar |
|-----------|---------|
| "Estás apostando mal" | "Tu riesgo actual es alto comparado con tu plan" |
| "Demasiadas apuestas" | "Los traders rentables priorizan calidad sobre cantidad" |
| "Estás en tilt" | "Detectamos un patrón que suele preceder decisiones impulsivas" |
| "Bloqueado" | "Pausa de protección: cooldown hasta mañana" |

---

## 3. Niveles de Intervención

Risk Guard tiene **4 niveles de intervención** progresivos:

| Nivel | Nombre | Acción | Efecto |
|-------|--------|--------|--------|
| **INFO** | Sugerencia | Solo mensaje informativo | Usuario puede continuar |
| **WARNING** | Advertencia | Mensaje persistente + badge | Usuario puede continuar con confirmación |
| **RESTRICT** | Restricción | No permite nuevas ejecuciones | Solo análisis y picks sin ejecutar¹ |
| **LOCK** | Bloqueo temporal | Cierre de sesión operativa | Cooldown obligatorio |

¹ **Aclaración sobre RESTRICT en apuestas deportivas:**
- **Con cashout/hedge disponible:** Se permite cerrar posiciones existentes mediante cashout o hedge
- **Sin cashout/hedge:** Solo permite análisis y registro de picks sin ejecutar
- **Nunca permite nuevas ejecuciones** hasta que se resuelva la condición de riesgo

### 3.1. Progresión de Niveles

```javascript
// Ejemplo de progresión en overtrading
picks_today = 6  → INFO
picks_today = 9  → WARNING
picks_today = 13 → RESTRICT
picks_today = 16 → LOCK (3h cooldown)
```

### 3.2. Estados Visuales en UI

| Estado | Color | Icon | Descripción |
|--------|-------|------|-------------|
| **HEALTHY** | Verde | ✅ | Operación normal |
| **CAUTION** | Amarillo | ⚠️ | Advertencia preventiva |
| **HIGH_RISK** | Naranja | 🚨 | Riesgo elevado |
| **LOCKED** | Rojo | 🔒 | Bloqueo activo |

---

## 4. Señales de Riesgo Evaluadas

### 4.1. Overtrading (Sobre-operación)

**Problema:** Demasiados picks en poco tiempo → baja calidad de análisis.

#### Triggers

```javascript
const overtrading_triggers = {
  picks_last_60min: 4,      // más de 4 picks en 1 hora
  picks_today: 12,          // más de 12 picks en un día
  picks_this_week: 40,      // más de 40 picks semanales
  unique_leagues_today: 5,  // más de 5 ligas diferentes hoy
  unique_markets_today: 7   // más de 7 mercados diferentes hoy
}
```

#### Escalamiento

| Condición | Nivel | Mensaje |
|-----------|-------|---------|
| 6-8 picks hoy | INFO | "6 picks hoy. Considera calidad sobre cantidad." |
| 9-12 picks hoy | WARNING | "9 picks hoy. Los traders rentables promedian 3-5 picks diarios." |
| 13-15 picks hoy | RESTRICT | "13 picks hoy. Sistema en pausa para proteger tu bankroll." |
| 16+ picks hoy | LOCK | "16 picks hoy. Cooldown de 3h para resetear enfoque." |

#### Acción

```javascript
function evaluateOvertrading(user_id) {
  const picks_today = getPicksToday(user_id)
  const picks_60min = getPicksLastHour(user_id)
  
  if (picks_60min >= 5) {
    return {
      level: 'RESTRICT',
      reason: 'OVERTRADING_HOUR',
      message: 'Has registrado 5 picks en la última hora. Pausa obligatoria de 30 minutos.'
    }
  }
  
  if (picks_today >= 13) {
    return {
      level: 'RESTRICT',
      reason: 'OVERTRADING_DAY',
      message: 'Has alcanzado el límite diario de 12 picks. Mañana podrás continuar.'
    }
  }
  
  if (picks_today >= 9) {
    return {
      level: 'WARNING',
      reason: 'OVERTRADING_WARNING',
      message: '9 picks hoy. Los traders rentables promedian 3-5 picks diarios de alta convicción.'
    }
  }
  
  return { level: 'INFO', allowed: true }
}
```

### 4.2. Dimensiones de Análisis Avanzado

Además de los checks básicos, Risk Guard incorpora un análisis conductual y contextual profundo:

#### 4.2.1. Sincronización de Capital
- **Objetivo**: Asegurar que el riesgo se gestiona sobre el capital real y no sobre un plan desactualizado.
- **Lógica**: Compara `plan_bankroll` (declarado por el usuario) con `broker_balance` (real, vía API).
- **Acción**: Si la desviación (`deviation_percent`) supera un umbral (e.g., 20%), se aplica un `stake_multiplier` reductivo. Un `MISALIGNED` severo puede llevar a `RESTRICT`.

#### 4.2.2. Monitor de Rachas (Psicología)
- **Objetivo**: Detectar patrones de comportamiento irracional asociados a rachas de victorias o derrotas.
- **Lógica**:
    - **`after_loss_aggression`**: Se activa si tras N derrotas seguidas, el usuario aumenta el stake o la frecuencia.
    - **`after_win_euphoria`**: Se activa si tras N victorias seguidas, el usuario ignora sus propios criterios de calidad (baja `quality_score`) o aumenta el stake de forma desproporcionada.
- **Acción**:
    - 3 derrotas: `stake_cap` reducido (-20%).
    - 5 derrotas: `cooldown` de 24h.
    - 3 victorias: Bloqueo de aumento de stake.
    - 5 victorias: `WARNING` sobre exceso de confianza.

#### 4.2.3. Riesgo por Horario (IA)
- **Objetivo**: Proteger al usuario de operar en horarios donde históricamente ha demostrado ser poco rentable.
- **Lógica**: El sistema aprende las franjas horarias de mayor y menor rendimiento para el usuario (`user_profitable_hours`). Si detecta operativa en una franja anómala (`is_anomalous_hour`), interviene.
- **Acción**: Reduce el `stake` permitido durante esa franja horaria.

#### 4.2.4. Riesgo Ponderado por Calidad (Watchlist)
- **Objetivo**: Incentivar el análisis y la toma de decisiones fundamentada, conectando el esfuerzo de `Watchlist` con la gestión de riesgo.
- **Lógica**: Se utiliza el `avg_quality_score` de los picks recientes. Un score alto, basado en `reasoning_quality` y `evidence_sources`, demuestra profesionalismo.
- **Acción**: Un `avg_quality_score` alto otorga un `flexibility_bonus`, que puede aumentar ligeramente los umbrales de `exposure` o `stake`. Un score bajo (picks recreativos) los reduce.

#### 4.2.5. Origen de la Operación
- **Objetivo**: Distinguir el contexto de la operación para una evaluación de riesgo más justa.
- **Lógica**: Cada `RiskEvent` se etiqueta con su `operation_source` (`manual_pick`, `trader_ticket`, `ai_signal`, `auto_agent`).
- **Impacto**: La evaluación de `tilt` y otros patrones conductuales pondera de forma diferente los errores. Un error en `auto_agent` tiene un peso psicológico menor que un error en `manual_pick`.


---

### 4.2. Exposure Excesiva (Capital Comprometido)

**Problema:** Demasiado capital en picks pendientes → riesgo de ruina.

#### Métricas

```javascript
const exposure = {
  open_stake: sum(pending_picks.stake),           // capital en picks pendientes
  total_exposure: open_stake,
  available_balance: bankroll - open_stake,
  exposure_ratio: (open_stake / bankroll) * 100   // % del bankroll comprometido
}
```

#### Triggers

| Exposure Ratio | Nivel | Acción |
|----------------|-------|--------|
| < 15% | HEALTHY | Normal |
| 15-25% | INFO | "15% de tu bankroll en juego. Nivel saludable." |
| 25-40% | WARNING | "30% comprometido. Considera resolver picks antes de añadir más." |
| 40-60% | RESTRICT | "45% comprometido. No puedes ejecutar nuevos picks hasta resolver pendientes." |
| > 60% | LOCK | "65% comprometido. Bloqueo hasta que exposure baje a <40%." |

#### Validación Pre-Ejecución

```javascript
function validateExposure(user_id, new_stake) {
  const profile = getBankrollProfile(user_id)
  const current_exposure = calculateExposure(user_id)
  const new_exposure_ratio = ((current_exposure.open_stake + new_stake) / profile.bankroll) * 100
  
  if (new_exposure_ratio > 60) {
    return {
      allowed: false,
      level: 'RESTRICT',
      reason: 'EXPOSURE_CRITICAL',
      message: `Esta operación elevaría tu exposure a ${new_exposure_ratio.toFixed(1)}%. Límite: 60%.`
    }
  }
  
  if (new_exposure_ratio > 40) {
    return {
      allowed: true,
      level: 'WARNING',
      reason: 'EXPOSURE_HIGH',
      message: `Exposure subiría a ${new_exposure_ratio.toFixed(1)}%. ¿Confirmas continuar?`
    }
  }
  
  return { allowed: true, level: 'INFO' }
}
```

---

### 4.3. Violación de Stake

**Problema:** Usuario intenta ejecutar stake mayor al permitido por su plan.

#### Regla

```javascript
max_allowed_stake = recommended_stake * 1.5  // margen de 50%
```

#### Triggers

| Condición | Nivel | Acción |
|-----------|-------|--------|
| stake > recommended * 1.2 | WARNING | "Stake 20% mayor a lo recomendado. ¿Confirmas?" |
| stake > recommended * 1.5 | RESTRICT | "Stake excede límite (+50%). Máximo: $X" |
| stake > recommended * 2.0 | LOCK | "Stake 2x mayor. Bloqueo preventivo." |

#### Validación

```javascript
function validateStake(user_id, stake, pick_id) {
  const recommended = calculateRecommendedStake(user_id, pick_id)
  const ratio = stake / recommended
  
  if (ratio > 2.0) {
    return {
      allowed: false,
      level: 'LOCK',
      reason: 'STAKE_EXCESSIVE',
      message: `Stake de $${stake} es ${(ratio * 100).toFixed(0)}% mayor a lo recomendado ($${recommended}). Máximo permitido: $${recommended * 1.5}.`,
      cooldown_minutes: 60
    }
  }
  
  if (ratio > 1.5) {
    return {
      allowed: false,
      level: 'RESTRICT',
      reason: 'STAKE_OVER_LIMIT',
      message: `Stake excede el límite. Recomendado: $${recommended}. Máximo: $${recommended * 1.5}.`
    }
  }
  
  if (ratio > 1.2) {
    return {
      allowed: true,
      level: 'WARNING',
      reason: 'STAKE_HIGH',
      message: `Stake ${((ratio - 1) * 100).toFixed(0)}% mayor a lo recomendado. ¿Confirmas?`,
      requires_confirmation: true
    }
  }
  
  return { allowed: true, level: 'INFO' }
}
```

---

### 4.4. Drawdown (Pérdidas Acumuladas)

**Problema:** Usuario perdiendo desde su peak → puede entrar en tilt.

#### Cálculo

```javascript
drawdown_percent = ((peak_balance - current_balance) / peak_balance) * 100
```

#### Triggers

| Drawdown | Nivel | Acción |
|----------|-------|--------|
| < 5% | HEALTHY | Normal |
| 5-10% | INFO | "Drawdown de 8%. Revisa tu estrategia." |
| 10-15% | WARNING | "Drawdown de 12%. Reduce tamaño de posiciones." |
| 15-20% | RESTRICT | "Drawdown de 18%. Solo permite cerrar posiciones." |
| 20-30% | LOCK | "Drawdown de 25%. Cooldown de 24h." |
| > 30% | LOCK | "Drawdown crítico de 35%. Cooldown de 72h." |

#### Sistema de Alertas Progresivas

```javascript
function evaluateDrawdown(user_id) {
  const profile = getBankrollProfile(user_id)
  const drawdown = calculateDrawdown(profile)
  
  // Drawdown crítico → lock inmediato
  if (drawdown >= 30) {
    return {
      allowed: false,
      level: 'LOCK',
      reason: 'DRAWDOWN_CRITICAL',
      message: `Drawdown crítico: ${drawdown.toFixed(1)}%. Cooldown de 72h para protección de capital.`,
      cooldown_until: addHours(now(), 72),
      action_required: 'REVIEW_STRATEGY'
    }
  }
  
  // Drawdown severo → bloqueo 24h
  if (drawdown >= 20) {
    return {
      allowed: false,
      level: 'LOCK',
      reason: 'DRAWDOWN_SEVERE',
      message: `Drawdown severo: ${drawdown.toFixed(1)}%. Pausa de 24h para resetear enfoque.`,
      cooldown_until: addHours(now(), 24)
    }
  }
  
  // Drawdown alto → restricción
  if (drawdown >= 15) {
    return {
      allowed: false,
      level: 'RESTRICT',
      reason: 'DRAWDOWN_HIGH',
      message: `Drawdown de ${drawdown.toFixed(1)}%. Solo puedes cerrar posiciones existentes hasta recuperar a <15%.`
    }
  }
  
  // Drawdown moderado → warning
  if (drawdown >= 10) {
    return {
      allowed: true,
      level: 'WARNING',
      reason: 'DRAWDOWN_MODERATE',
      message: `Drawdown de ${drawdown.toFixed(1)}%. Considera reducir tamaño de posiciones a 50%.`,
      suggested_action: 'REDUCE_STAKES'
    }
  }
  
  return { allowed: true, level: 'INFO' }
}
```

#### Recuperación de Drawdown

**Regla de desbloqueo:**
```javascript
// Para salir de LOCK por drawdown
if (current_drawdown < trigger_level * 0.75) {
  unlock()
}

// Ejemplo:
// Bloqueado a 20% drawdown
// Desbloqueo a 15% drawdown (75% de 20%)
```

---

### 4.5. Tilt Detection (Comportamiento Emocional)

**Problema:** Usuario operando emocionalmente tras pérdidas → decisiones irracionales.

#### Patrones de Tilt

```javascript
const tilt_patterns = {
  // Patrón 1: Chase de pérdidas
  chase_losses: {
    trigger: '3 losses consecutivas + nueva ejecución < 15min',
    severity: 'HIGH'
  },
  
  // Patrón 2: Stake creciente tras pérdidas
  escalating_stakes: {
    trigger: 'stake_current > stake_avg * 1.8 después de pérdidas',
    severity: 'HIGH'
  },
  
  // Patrón 3: Horario anómalo
  unusual_hours: {
    trigger: 'picks después de 23h o antes de 6h',
    severity: 'MEDIUM'
  },
  
  // Patrón 4: Ráfaga de picks LIVE
  live_burst: {
    trigger: '>3 picks LIVE en 30min',
    severity: 'HIGH'
  },
  
  // Patrón 5: Mercados atípicos
  unusual_markets: {
    trigger: 'operar mercados que nunca usaba',
    severity: 'MEDIUM'
  },
  
  // Patrón 6: Disciplina rota
  discipline_break: {
    trigger: 'ejecutar después de decir "no operar hoy"',
    severity: 'LOW'
  }
}
```

#### Detección Activa

```javascript
function detectTilt(user_id) {
  const recent_picks = getRecentPicks(user_id, { hours: 2 })
  const recent_results = getRecentResults(user_id, { count: 5 })
  const user_profile = getUserProfile(user_id)
  
  let tilt_score = 0
  let tilt_signals = []
  
  // Señal 1: Chase de pérdidas
  const consecutive_losses = getConsecutiveLosses(recent_results)
  if (consecutive_losses >= 3) {
    const time_since_last_loss = now() - recent_results[0].settled_at
    if (time_since_last_loss < 15 * 60 * 1000) {  // menos de 15 minutos
      tilt_score += 40
      tilt_signals.push('CHASE_LOSSES')
    }
  }
  
  // Señal 2: Stake escalado
  const avg_stake = user_profile.avg_stake_30d
  const current_stake = recent_picks[0]?.planned_stake
  if (current_stake > avg_stake * 1.8) {
    tilt_score += 30
    tilt_signals.push('ESCALATING_STAKES')
  }
  
  // Señal 3: Horario anómalo
  const hour = new Date().getHours()
  if (hour >= 23 || hour <= 6) {
    tilt_score += 15
    tilt_signals.push('UNUSUAL_HOURS')
  }
  
  // Señal 4: Ráfaga LIVE
  const live_picks_30min = recent_picks.filter(p => 
    p.type === 'LIVE' && 
    (now() - p.created_at) < 30 * 60 * 1000
  ).length
  
  if (live_picks_30min >= 3) {
    tilt_score += 35
    tilt_signals.push('LIVE_BURST')
  }
  
  // Evaluación final
  if (tilt_score >= 70) {
    return {
      detected: true,
      level: 'LOCK',
      score: tilt_score,
      signals: tilt_signals,
      message: 'Detectamos un patrón de comportamiento impulsivo. Pausa de 3h para protección.',
      cooldown_hours: 3
    }
  }
  
  if (tilt_score >= 40) {
    return {
      detected: true,
      level: 'RESTRICT',
      score: tilt_score,
      signals: tilt_signals,
      message: 'Tu patrón operativo sugiere decisiones emocionales. Considera una pausa de 30min.',
      suggested_pause: 30
    }
  }
  
  if (tilt_score >= 20) {
    return {
      detected: true,
      level: 'WARNING',
      score: tilt_score,
      signals: tilt_signals,
      message: 'Detectamos señales de posible tilt. ¿Estás operando con tu mejor criterio?',
      requires_reflection: true
    }
  }
  
  return { detected: false, level: 'INFO' }
}
```

#### Mensajes de Tilt

**Progresión:**

| Tilt Score | Mensaje |
|------------|---------|
| 20-39 | "Detectamos señales de posible tilt. ¿Estás operando con tu mejor criterio?" |
| 40-69 | "Tu patrón operativo sugiere decisiones emocionales. Puede ser buen momento para una pausa de 30min." |
| 70+ | "Detectamos comportamiento impulsivo. Pausa de protección de 3h activada." |

---

### 4.6. Selective Execution (Ejecución Selectiva)

**Problema:** Usuario registra picks pero solo ejecuta los "que le gustan" → sesgo de confirmación.

#### Métrica

```javascript
execution_ratio = executed_picks / predicted_picks
```

#### Evaluación

| Ratio | Interpretación | Acción |
|-------|---------------|--------|
| > 0.75 | Disciplinado | ✅ Normal |
| 0.50-0.75 | Selectivo moderado | INFO |
| 0.35-0.50 | Selectivo alto | WARNING |
| < 0.35 | Cherry-picking | WARNING fuerte |

#### Detección

```javascript
function evaluateSelectiveExecution(user_id) {
  const picks = getUserPicks(user_id, { days: 30 })
  const predicted = picks.length
  const executed = picks.filter(p => p.executed === true).length
  const ratio = executed / predicted
  
  if (ratio < 0.35) {
    return {
      level: 'WARNING',
      reason: 'SELECTIVE_EXECUTION_HIGH',
      message: `Has ejecutado solo ${(ratio * 100).toFixed(0)}% de tus picks registrados. Esto indica sesgo de confirmación y puede invalidar tu trackeo de rendimiento.`,
      suggestion: 'Ejecuta todos tus picks o no los registres.'
    }
  }
  
  if (ratio < 0.50) {
    return {
      level: 'INFO',
      reason: 'SELECTIVE_EXECUTION_MODERATE',
      message: `Ejecutas ${(ratio * 100).toFixed(0)}% de tus picks. Para trackeo válido, procura ejecutar >75%.`
    }
  }
  
  return { level: 'INFO', ratio: ratio }
}
```

**Nota:** Esta alerta es **educativa**, no bloquea ejecución.

---

### 4.7. Daily Loss Limit (Límite de Pérdida Diaria)

**Problema:** Pérdidas diarias excesivas que comprometen el capital y la disciplina operativa.

#### Métrica

```javascript
const daily_pnl = getDailyPnl(user_id)  // Sum de P&L del día
const daily_loss_limit = bankroll_config.daily_loss_limit  // Ej: 5% del bankroll
```

#### Triggers

| Condición | Nivel | Acción | Cooldown |
|-----------|-------|--------|----------|
| daily_pnl <= -daily_loss_limit | RESTRICT | "Has alcanzado tu límite de pérdida diaria. Protege tu capital." | Hasta día siguiente 00:00 |
| daily_pnl <= -daily_loss_limit * 1.5 | LOCK | "Pérdida severa detectada. Cooldown obligatorio de 24h." | 24h fijo |

#### Validación

```javascript
function validateDailyLossLimit(user_id, new_stake) {
  const profile = getBankrollProfile(user_id)
  const daily_pnl = getDailyPnl(user_id)
  const daily_loss_limit = profile.daily_loss_limit
  
  // Si ya se alcanzó el límite
  if (daily_pnl <= -daily_loss_limit) {
    return {
      allowed: false,
      level: 'RESTRICT',
      reason: 'DAILY_LOSS_LIMIT_REACHED',
      message: `Has alcanzado tu límite de pérdida diaria de $${daily_loss_limit.toFixed(2)}. Protege tu capital.`,
      cooldown_until: getTomorrowStart(),  // Hasta 00:00 del día siguiente
      action_allowed: 'ANALYSIS_ONLY'  // Solo análisis, no ejecución
    }
  }
  
  // Si hay pérdida severa (1.5x el límite)
  if (daily_pnl <= -daily_loss_limit * 1.5) {
    return {
      allowed: false,
      level: 'LOCK',
      reason: 'DAILY_LOSS_SEVERE',
      message: `Pérdida severa detectada: $${Math.abs(daily_pnl).toFixed(2)}. Cooldown obligatorio de 24h para protección.`,
      cooldown_hours: 24,
      action_allowed: 'NO_OPERATION'  // Ninguna operación permitida
    }
  }
  
  // Advertencia preventiva (80% del límite)
  if (daily_pnl <= -daily_loss_limit * 0.8) {
    return {
      allowed: true,
      level: 'WARNING',
      reason: 'DAILY_LOSS_WARNING',
      message: `Cuidado: estás al ${((Math.abs(daily_pnl) / daily_loss_limit) * 100).toFixed(0)}% de tu límite de pérdida diaria.`,
      remaining_loss_allowed: daily_loss_limit - Math.abs(daily_pnl)
    }
  }
  
  return { allowed: true, level: 'INFO' }
}
```

#### Fuente de Datos

```sql
SELECT COALESCE(SUM(pnl), 0) as daily_pnl
FROM bankroll_ledger
WHERE user_id = ? 
  AND DATE(settled_at) = CURRENT_DATE
  AND status = 'SETTLED'
```

---

### 4.8. Definición de Resultados para Tilt y Daily Loss

**CRÍTICO:** Para evitar inconsistencias, definimos claramente qué cuenta como pérdida/ganancia:

#### Reglas de Clasificación

```javascript
// Para Tilt (rachas) y Daily Loss
const LOSS = settled_pnl < 0        // Pérdida real
const WIN = settled_pnl > 0         // Ganancia real  
const PUSH = settled_pnl === 0      // Empate / devolución
const VOID = status === 'CANCELLED' || status === 'VOID'  // Anulada

// Solo SETTLED cuenta para estadísticas
const VALID_FOR_STATS = status === 'SETTLED'
```

#### Aplicación en Tilt Detection

```javascript
function getConsecutiveLosses(recent_results) {
  let consecutive = 0
  for (const result of recent_results) {
    if (!VALID_FOR_STATS) continue  // Saltar no settled
    
    if (LOSS) {
      consecutive++
    } else if (WIN || PUSH) {
      break  // Rota la racha
    }
    // VOID no afecta la racha
  }
  return consecutive
}
```

#### Aplicación en Daily Loss

```javascript
function getDailyPnl(user_id) {
  return db.bankroll_ledger
    .where('user_id', user_id)
    .where('status', 'SETTLED')  // Solo settled
    .whereDate('settled_at', today())
    .sum('pnl')
}
```

#### Casos Específicos

| Caso | Status | settled_pnl | Cuenta para Tilt? | Cuenta para Daily Loss? |
|------|--------|-------------|-------------------|------------------------|
| Apuesta ganadora | SETTLED | +50 | ✅ WIN | ✅ Sí |
| Apuesta perdedora | SETTLED | -25 | ✅ LOSS | ✅ Sí |
| Empate (push) | SETTLED | 0 | ✅ PUSH (rompe racha) | ✅ Sí (no afecta) |
| Cashout parcial | SETTLED | -10 | ✅ LOSS | ✅ Sí |
| Cashout total | SETTLED | 0 | ✅ PUSH | ✅ Sí |
| Apuesta void | VOID | 0 | ❌ No | ❌ No |
| Apuesta cancelada | CANCELLED | 0 | ❌ No | ❌ No |
| Pending sin settle | PENDING | null | ❌ No | ❌ No |

**Nota:** PUSH/EMPATE rompe rachas de pérdidas (no es una pérdida), pero se incluye en el cálculo del P&L diario.

---

## 5. Cooldown (Bloqueo Temporal)

### 5.1. Cuando se Activa LOCK

**Triggers de cooldown:**

| Motivo | Duración | Condición |
|--------|----------|-----------|
| Drawdown 20-30% | 24h | Hasta drawdown < 15% |
| Drawdown > 30% | 72h | Hasta drawdown < 20% |
| Exposure > 60% | 6h | Hasta exposure < 40% |
| Tilt score > 70 | 3h | Tiempo fijo |
| Overtrading (16+ picks) | 3h | Tiempo fijo |
| Stake 2x límite | 1h | Tiempo fijo |

### 5.2. Durante Cooldown

**Usuario NO puede:**
- ❌ Ejecutar nuevos picks (vía agentes o manual)
- ❌ Activar agentes automáticos
- ❌ Marcar picks como ejecutados

**Usuario SÍ puede:**
- ✅ Ver señales
- ✅ Analizar mercados
- ✅ Registrar picks (sin ejecutar)
- ✅ Revisar historial
- ✅ Consultar métricas
- ✅ Cerrar posiciones abiertas (si aplicable)

### 5.3. Notificación de Cooldown

```javascript
{
  status: 'LOCKED',
  reason: 'DRAWDOWN_SEVERE',
  locked_at: '2025-02-07T14:30:00Z',
  cooldown_until: '2025-02-08T14:30:00Z',
  remaining_hours: 23.5,
  message: 'Pausa de protección activa por drawdown de 22%. Podrás operar mañana a las 14:30.',
  can_view: true,
  can_analyze: true,
  can_execute: false
}
```

### 5.4. Recuperación de Cooldown

**Cooldown por tiempo:**
- Se desbloquea automáticamente al cumplirse el plazo

**Cooldown por condición:**
```javascript
// Ejemplo: Drawdown
if (cooldown_reason === 'DRAWDOWN_SEVERE') {
  if (current_drawdown < 15) {
    unlock()
    notify('Drawdown recuperado. Puedes operar nuevamente.')
  }
}

// Ejemplo: Exposure
if (cooldown_reason === 'EXPOSURE_CRITICAL') {
  if (current_exposure_ratio < 40) {
    unlock()
    notify('Exposure normalizado. Sistema desbloqueado.')
  }
}
```

### 5.5. Recovery Mode (Modo Recuperación)

**Objetivo:** Después de un LOCK, el usuario entra en modo recuperación con límites reducidos temporalmente para prevenir re-tilt inmediato.

**Activación:** Automática al desbloquearse de un LOCK (drawdown severo, tilt extremo, etc.)

**Duración:** 48 horas desde el desbloqueo

**Límites en Recovery Mode:**
```javascript
const RECOVERY_LIMITS = {
  max_picks_per_day: 5,           // Normal: 12
  max_exposure_ratio: 0.25,       // Normal: 0.40
  max_stake_multiplier: 1.2,      // Normal: 1.5
  max_live_picks_per_hour: 1,     // Normal: 3
}
```

**Implementación:**
```javascript
function checkRecoveryMode(user_id) {
  const last_lock = getLastLockEvent(user_id)
  
  if (!last_lock) return { active: false }
  
  const hours_since_unlock = (now() - last_lock.unlocked_at) / (1000 * 60 * 60)
  
  // Primeras 48h post-unlock = recovery mode
  if (hours_since_unlock < 48) {
    return {
      active: true,
      until: new Date(last_lock.unlocked_at + 48 * 60 * 60 * 1000),
      hours_remaining: 48 - hours_since_unlock,
      limits_override: RECOVERY_LIMITS,
      message: 'Estás en modo recuperación. Límites reducidos por 48h.'
    }
  }
  
  return { active: false }
}

// Hook 2 y 3 deben leer estos overrides
function applyRecoveryLimits(user_id, normal_limits) {
  const recovery = checkRecoveryMode(user_id)
  
  if (recovery.active) {
    return {
      ...normal_limits,
      ...recovery.limits_override,
      recovery_mode: true
    }
  }
  
  return normal_limits
}
```

**UI de Recovery Mode:**
```
┌─────────────────────────────────────────┐
│          🔄 MODO RECUPERACIÓN          │
├─────────────────────────────────────────┤
│ Estado post-lock activo                 │
│                                         │
│ Límites temporales:                     │
│ • Máx 5 picks por día                 │
│ • Máx 25% exposure                      │
│ • Stake máx 1.2x recomendado            │
│                                         │
│ Tiempo restante: 36h 15min             │
│                                         │
│ [Entendido]                            │
└─────────────────────────────────────────┘
```

### 10.6. Escalamiento por Warnings Ignorados

**Cuando el usuario ignora 3+ warnings en 24h:**

```
┌─────────────────────────────────────────┐
│          🚨 ESCALAMIENTO ACTIVO          │
├─────────────────────────────────────────┤
│ Has ignorado 4 advertencias en 24h.     │
│                                         │
│ El sistema ahora restringe temporalmente│
│ para proteger tu capital.               │
│                                         │
│ No puedes ejecutar nuevos picks por   │
│ las próximas 24 horas.                  │
│                                         │
│ [Entendido]                             │
└─────────────────────────────────────────┘
```

**Mensaje de advertencia antes del escalamiento (2do warning ignorado):**
```
┌─────────────────────────────────────────┐
│          ⚠️  ÚLTIMA ADVERTENCIA          │
├─────────────────────────────────────────┤
│ Has ignorado 2 advertencias hoy.        │
│                                         │
│ Si ignoras una más, el sistema        │
│ restringirá tus operaciones por 24h.   │
│                                         │
│ ¿Estás seguro de continuar?           │
│                                         │
│ [Cancelar]  [Sí, continuar]           │
└─────────────────────────────────────────┘
```

### 5.6. Política de Permisos y Overrides (Administrador)

**Roles y Permisos:**
```typescript
enum AdminRole {
  ADMIN_VIEW = 'admin_view',        // Solo lectura
  ADMIN_OVERRIDE = 'admin_override',  // Puede hacer overrides
  ADMIN_FULL = 'admin_full'         // Control total
}

// Quién puede hacer qué
const PERMISSION_POLICY = {
  'admin_view': ['view_risk_states', 'view_user_history'],
  'admin_override': [
    'manual_cooldown_override',
    'manual_risk_config_update',
    'unlock_user_early',
    'extend_cooldown'
  ],
  'admin_full': ['all_permissions']
}
```

**Política de Overrides:**

1. **Override Manual de Cooldown:**
```javascript
// POST /risk/cooldown/override
{
  user_id: "123",
  action: "UNLOCK_EARLY",           // o "EXTEND_COOLDOWN"
  reason: "Usuario ha demostrado control emocional",
  duration_hours: 24,              // Solo para EXTEND_COOLDOWN
  admin_id: "admin_456",
  override_type: "MANUAL_OVERRIDE"
}

// Implementación con auditoría
async function manualCooldownOverride(user_id, action, admin_id, reason) {
  // Verificar permisos del admin
  const admin = await getAdmin(admin_id)
  if (!admin.hasPermission('manual_cooldown_override')) {
    throw new Error('No tiene permisos para este override')
  }
  
  // Crear evento de auditoría
  await createRiskEvent({
    user_id,
    event_type: 'ADMIN_OVERRIDE',
    level: 'INFO',
    reason: `Override manual: ${action}`,
    message: reason,
    source_hook: 'MANUAL_OVERRIDE',
    admin_id,
    override_details: {
      action,
      previous_state: await getUserRiskState(user_id),
      override_type: 'MANUAL_COOLDOWN'
    }
  })
  
  // Ejecutar override
  if (action === 'UNLOCK_EARLY') {
    await unlockUserEarly(user_id)
  } else if (action === 'EXTEND_COOLDOWN') {
    await extendCooldown(user_id, duration_hours)
  }
  
  // Notificar al usuario
  await notifyUser(user_id, {
    type: 'ADMIN_OVERRIDE',
    message: `Administrador ${admin.name} ha ${action === 'UNLOCK_EARLY' ? 'desbloqueado' : 'extendido'} tu cooldown.`,
    reason: reason
  })
}
```

2. **Override de Configuración de Riesgo:**
```javascript
// PUT /risk/config/override
{
  user_id: "123",
  overrides: {
    disable_overtrading_check: true,
    disable_tilt_check: true,
    max_picks_per_day: 20,        // Override temporal
    max_exposure_ratio: 0.50      // Override temporal
  },
  ttl_hours: 24,                   // Duración del override
  admin_id: "admin_456",
  reason: "Usuario profesional con historial comprobado"
}

// Política: ¿Qué se puede override?
const OVERRIDE_POLICY = {
  // Siempre permitido (solo WARNING/CAUTION)
  'soft_limits': ['max_picks_per_day', 'max_exposure_ratio', 'max_stake_multiplier'],
  
  // Requiere justificación detallada
  'hard_limits': ['disable_drawdown_check', 'disable_tilt_check'],
  
  // Nunca permitido (LOCK siempre bloquea)
  'never_allowed': ['override_lock_state', 'override_cooldown_safety']
}
```

3. **Auditoría Completa:**
```javascript
// Todos los overrides quedan registrados
interface RiskOverrideEvent {
  id: string
  user_id: string
  admin_id: string
  admin_name: string
  action: string
  override_type: 'MANUAL_COOLDOWN' | 'CONFIG_OVERRIDE' | 'UNLOCK_EARLY'
  previous_values: object
  new_values: object
  reason: string
  ttl_hours?: number
  created_at: timestamp
  expires_at?: timestamp
  source_hook: 'MANUAL_OVERRIDE'
}

// Query de auditoría
GET /admin/audit/overrides?user_id=123&admin_id=456&date_from=2024-01-01
```

**Reglas de Seguridad:**

1. **Override de WARNING/CAUTION:** ✅ Siempre permitido con justificación
2. **Override de RESTRICT:** ⚠️ Requiere aprobación de segundo admin
3. **Override de LOCK:** ❌ Nunca permitido (el usuario debe esperar)
4. **TTL máximo:** 72 horas para cualquier override
5. **Segundo admin:** Override de RESTRICT requiere aprobación de admin senior
6. **Revisión semanal:** Todos los overrides se revisan en reunión semanal

**Mensajes al Usuario:**
```javascript
// Override aprobado
{
  type: 'ADMIN_OVERRIDE_SUCCESS',
  title: 'Override Aprobado',
  message: 'Administrador ha ajustado temporalmente tus límites.',
  duration: '24 horas',
  reason: 'Justificación del admin'
}

// Override denegado
{
  type: 'ADMIN_OVERRIDE_DENIED',
  title: 'Override No Aprobado',
  message: 'Tu solicitud requiere aprobación adicional.',
  next_step: 'Contacta a soporte para más información.'
}
```

---

## 6. Estados del Sistema

### 6.1. Estado Global del Usuario

```typescript
enum RiskState {
  HEALTHY = 'healthy',
  CAUTION = 'caution',
  HIGH_RISK = 'high_risk',
  LOCKED = 'locked'
}
```

### 6.2. Cálculo del Estado

```javascript
function calculateRiskState(user_id, source_hook = 'UNKNOWN') {
  const checks = {
    overtrading: evaluateOvertrading(user_id),
    exposure: evaluateExposure(user_id),
    drawdown: evaluateDrawdown(user_id),
    tilt: detectTilt(user_id),
    stake: evaluateStake(user_id),
    selective_execution: evaluateSelectiveExecution(user_id),
    daily_loss: evaluateDailyLoss(user_id)
  }
  
  // Prioridad de severidad: LOCK > RESTRICT > WARNING > INFO
  const severity_order = ['LOCK', 'RESTRICT', 'WARNING', 'INFO']
  const check_priority = {
    drawdown: 1,        // Mayor prioridad
    exposure: 2,
    stake: 3,
    tilt: 4,
    overtrading: 5,
    daily_loss: 6,
    selective_execution: 7   // Menor prioridad
  }
  
  // Encontrar el peor nivel
  let worst_level = 'INFO'
  let primary_reason = null
  let primary_check = null
  
  for (const [check_name, check_data] of Object.entries(checks)) {
    if (severity_order.indexOf(check_data.level) > severity_order.indexOf(worst_level)) {
      worst_level = check_data.level
      primary_reason = check_data.reason
      primary_check = check_name
    } else if (check_data.level === worst_level) {
      // Si mismo nivel, aplicar prioridad
      if (!primary_check || check_priority[check_name] < check_priority[primary_check]) {
        primary_reason = check_data.reason
        primary_check = check_name
      }
    }
  }
  
  // Construir lista de razones secundarias (todas las alertas activas excepto la primaria)
  const secondary_reasons = []
  for (const [check_name, check_data] of Object.entries(checks)) {
    if (check_data.level !== 'INFO' && check_name !== primary_check) {
      secondary_reasons.push({
        check: check_name,
        level: check_data.level,
        reason: check_data.reason,
        message: check_data.message
      })
    }
  }
  
  // Mapear a estados de Risk Guard
  const state_map = {
    'LOCK': 'LOCKED',
    'RESTRICT': 'HIGH_RISK', 
    'WARNING': 'CAUTION',
    'INFO': 'HEALTHY'
  }
  
  // Construir decisión final con contrato claro
  const final_decision = {
    final_state: state_map[worst_level],
    final_level: worst_level,
    primary_reason: primary_reason,
    primary_check: primary_check,
    secondary_reasons: secondary_reasons,
    requires_confirmation: worst_level === 'WARNING',
    allowed: worst_level !== 'LOCK' && worst_level !== 'RESTRICT',
    blocked: worst_level === 'LOCK',
    restricted: worst_level === 'RESTRICT'
  }
  
  // 🚨 ESCALAMIENTO POR WARNINGS IGNORADOS
  // Si el usuario ignora warnings repetidamente, escalar a RESTRICT
  if (worst_level === 'WARNING') {
    const recent_warnings = await getRecentWarnings(user_id, 24) // Últimas 24h
    const ignored_warnings = recent_warnings.filter(w => w.ignored === true)
    
    // Si ignoró 3+ warnings en 24h → ESCALAR a RESTRICT
    if (ignored_warnings.length >= 3) {
      final_decision.final_level = 'RESTRICT'
      final_decision.final_state = 'HIGH_RISK'
      final_decision.primary_reason = 'WARNINGS_IGNORED_REPEATEDLY'
      final_decision.primary_check = 'warning_escalation'
      final_decision.allowed = false
      final_decision.restricted = true
      final_decision.requires_confirmation = false
      final_decision.escalation_message = `Has ignorado ${ignored_warnings.length} advertencias en 24h. El sistema ahora restringe temporalmente para proteger tu capital.`
      
      // Añadir a razones secundarias
      secondary_reasons.unshift({
        check: 'warning_escalation',
        level: 'RESTRICT',
        reason: 'WARNINGS_IGNORED_REPEATEDLY',
        message: final_decision.escalation_message
      })
    }
  }
  
  // Registrar evento de auditoría
  if (worst_level !== 'INFO') {
    await createRiskEvent({
      user_id,
      event_type: worst_level === 'LOCK' ? 'BLOCK' : 'ALERT',
      level: worst_level,
      reason: primary_reason,
      message: checks[primary_check]?.message || 'Risk check triggered',
      source_hook: source_hook,
      trigger_values: {
        picks_today: checks.overtrading?.picks_today,
        exposure_ratio: checks.exposure?.ratio,
        drawdown: checks.drawdown?.percent,
        tilt_score: checks.tilt?.score,
        daily_pnl: checks.daily_loss?.daily_pnl
      },
      secondary_reasons: secondary_reasons
    })
  }
  
  return final_decision
}

// Función auxiliar para obtener warnings recientes con estado de ignorado
async function getRecentWarnings(user_id, hours = 24) {
  return await db.riskEvents.findAll({
    where: {
      user_id: user_id,
      event_type: 'ALERT',
      level: 'WARNING',
      created_at: {
        [Op.gte]: new Date(Date.now() - hours * 60 * 60 * 1000)
      }
    },
    order: [['created_at', 'DESC']],
    attributes: ['id', 'reason', 'message', 'created_at', 'ignored']
  })
}
```

### 6.3. UI de Estados

```
HEALTHY:   ✅ Sistema operativo normal
CAUTION:   ⚠️ Advertencias activas - revisar antes de continuar
HIGH_RISK: 🚨 Restricciones activas - no puede ejecutar nuevos picks
LOCKED:    🔒 Cooldown activo - operación suspendida
```

---

## 7. Hooks de Ejecución (Momentos Críticos)

**IMPORTANTE:** Risk Guard NO actúa solo al ejecutar. Actúa en **3 momentos distintos** del flujo.

### 7.1. Hook 1: Al CREAR PICK (Watchlist)

**Objetivo:** Evitar spam de picks y tilt LIVE burst.

**Punto de ejecución:**
```javascript
// watchlist.createPick
async function createPick(user_id, pick_data) {
  // HOOK 1: Risk Guard - Validación de creación
  const risk_check = await riskGuard.canCreatePick(user_id, pick_data)
  
  if (!risk_check.allowed) {
    return {
      success: false,
      reason: 'BLOCKED_BY_RISK_GUARD',
      level: risk_check.level,
      message: risk_check.message
    }
  }
  
  // Continuar con creación
  const pick = await db.userPicks.create(pick_data)
  
  // Actualizar estado de Risk Guard
  await riskGuard.recordPickCreated(user_id, pick.id)
  
  return { success: true, pick }
}
```

**Validaciones en este hook:**

| Check | Motivo |
|-------|--------|
| `picks_last_60min > 4` | Overtrading inmediato |
| `picks_today > 12` | Límite diario |
| `live_picks_last_30min > 3` | Tilt LIVE burst |
| `cooldown_active` | Usuario en pausa |

**Ejemplo de bloqueo:**
```javascript
// Usuario intenta crear 5to pick en 1 hora
{
  allowed: false,
  level: 'RESTRICT',
  reason: 'OVERTRADING_HOUR',
  message: 'Has creado 4 picks en la última hora. Pausa obligatoria de 30 minutos para mantener calidad de análisis.'
}
```

---

### 7.2. Hook 2: Al EXPORTAR PICK (TradeIntent)

**Este es el punto MÁS IMPORTANTE del sistema.**

**Objetivo:** Validar ANTES de que el usuario marque como "ejecutado" o lo envíe a un agente.

**Punto de ejecución:**
```javascript
// watchlist.exportPick o watchlist.markAsExecuted
async function exportPick(user_id, pick_id, execution_params) {
  // IDEMPOTENCIA: Verificar si ya existe TradeIntent con mismo client_request_id
  if (execution_params.client_request_id) {
    const existing_intent = await db.tradeIntents.findOne({
      where: {
        user_id: user_id,
        client_request_id: execution_params.client_request_id,
        created_at: {
          [Op.gte]: new Date(Date.now() - 5 * 60 * 1000) // Últimos 5 minutos
        }
      }
    })
    
    if (existing_intent) {
      return {
        success: true,
        trade_intent: existing_intent,
        idempotent: true,
        message: 'TradeIntent ya existente - operación idempotente'
      }
    }
  }
  
  // HOOK 2: Risk Guard - Validación de export/ejecución
  const risk_check = await riskGuard.canExportTradeIntent(user_id, {
    pick_id: pick_id,
    stake: execution_params.stake,
    odds: execution_params.odds
  })
  
  if (!risk_check.allowed) {
    return {
      success: false,
      reason: 'BLOCKED_BY_RISK_GUARD',
      level: risk_check.level,
      message: risk_check.message,
      cooldown_until: risk_check.cooldown_until
    }
  }
  
  // Si es WARNING, requiere confirmación
  if (risk_check.level === 'WARNING') {
    return {
      success: false,
      requires_confirmation: true,
      message: risk_check.message,
      confirm_action: 'EXPORT_WITH_WARNING'
    }
  }
  
  // Crear TradeIntent con idempotencia
  const trade_intent = await createTradeIntent(user_id, pick_id, {
    ...execution_params,
    client_request_id: execution_params.client_request_id || generateUUID()
  })
  
  // Actualizar estado de Risk Guard
  await riskGuard.recordExportAttempt(user_id, trade_intent.id)
  
  return { success: true, trade_intent }
}
```

**Validaciones en este hook:**

| Check | Descripción |
|-------|-------------|
| **Exposure** | Validar que `(current_exposure + stake) / bankroll < max_exposure` |
| **Drawdown** | Bloquear si drawdown >= límite |
| **Stake** | Validar que `stake <= recommended_stake * 1.5` |
| **Tilt** | Detectar patrones emocionales |
| **Cooldown** | Verificar que no esté en pausa |
| **Bankroll Available** | Validar que `available_balance >= stake` |

**Este es el verdadero guardia del sistema.**

---

### 7.3. Hook 3: Al EJECUTAR (Execution Engine)

**Objetivo:** Última verificación antes de enviar al broker.

**Punto de ejecución:**
```javascript
// executionEngine.execute
async function execute(user_id, trade_intent_id, execution_idempotency_key = null) {
  // IDEMPOTENCIA: Verificar si ya existe ejecución con mismo idempotency_key
  if (execution_idempotency_key) {
    const existing_execution = await db.executions.findOne({
      where: {
        user_id: user_id,
        idempotency_key: execution_idempotency_key,
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 60 * 1000) // Últimos 30 minutos
        }
      }
    })
    
    if (existing_execution) {
      return {
        success: true,
        execution: existing_execution,
        idempotent: true,
        message: 'Ejecución ya existente - operación idempotente'
      }
    }
  }
  
  // HOOK 3: Risk Guard - Validación final
  const risk_check = await riskGuard.evaluate(user_id, trade_intent_id)
  
  if (!risk_check.allowed) {
    // Marcar trade intent como bloqueado
    await updateTradeIntent(trade_intent_id, {
      status: 'BLOCKED_BY_RISK_GUARD',
      block_reason: risk_check.reason,
      blocked_at: now()
    })
    
    return {
      success: false,
      reason: 'BLOCKED_BY_RISK_GUARD',
      message: risk_check.message
    }
  }
  
  // Ejecutar en broker con idempotencia
  const result = await broker.placeBet(trade_intent, {
    idempotency_key: execution_idempotency_key || generateUUID()
  })
  
  // Actualizar Risk Guard
  await riskGuard.recordExecution(user_id, result)
  
  return result
}
```

**Validaciones en este hook:**
- Re-validación de todas las checks anteriores
- Verificación de que nada cambió entre export y ejecución
- Double-check de exposure y drawdown

---

### 7.4. Resumen de los 3 Hooks

```
HOOK 1: CREATE PICK (Watchlist)
↓
Bloquea: overtrading inmediato, LIVE burst
Permite: crear el pick pero NO ejecutarlo
↓
HOOK 2: EXPORT/MARK EXECUTED (TradeIntent) ← CRÍTICO
↓
Bloquea: exposure, drawdown, stake, tilt
Este es el verdadero guardia
↓
HOOK 3: EXECUTE (Execution Engine)
↓
Bloquea: re-validación final
Última oportunidad de frenar
↓
BROKER
```

---

## 8. Integración con Otros Módulos

### 8.1. Watchlist

**Creación de pick:**
```javascript
const risk_check = await riskGuard.canCreatePick(user_id, pick_data)
if (!risk_check.allowed) {
  showAlert(risk_check.message)
  return
}
```

**Export/Ejecución:**
```javascript
const risk_check = await riskGuard.canExportTradeIntent(user_id, {
  pick_id,
  stake,
  odds
})

if (!risk_check.allowed) {
  showBlockedModal(risk_check.message)
  return
}

if (risk_check.level === 'WARNING') {
  showConfirmation(risk_check.message)
}
```

### 8.2. Bankroll

**IMPORTANTE:** **Bankroll define los límites. Risk Guard los hace cumplir.**

Risk Guard **NO inventa límites**. Lee la configuración de Bankroll:

```javascript
// Risk Guard lee de Bankroll
const bankroll_config = await bankroll.getConfig(user_id)
const bankroll_profile = await bankroll.getProfile(user_id)

const limits = {
  max_drawdown_percent: bankroll_config.max_drawdown_percent,      // ej: 20%
  max_exposure_ratio: bankroll_config.max_exposure_ratio || 40,    // ej: 40%
  max_daily_loss: bankroll_config.max_daily_loss,                  // ej: -5%
  recommended_stake: bankroll.calculateStake(user_id, pick_id)     // calculado por Bankroll
}

// Risk Guard valida contra estos límites
const current_drawdown = bankroll_profile.drawdown_percent
const current_exposure = calculateExposure(user_id)

if (current_drawdown >= limits.max_drawdown_percent) {
  return { allowed: false, reason: 'DRAWDOWN_LIMIT_REACHED' }
}
```

**Relación clara:**
- **Bankroll** = define stake recomendado, límites, objetivos
- **Risk Guard** = valida que se respeten esos límites

**Datos que Risk Guard recibe de Bankroll:**
- `recommended_stake` (para validar stake)
- `current_balance` (para calcular exposure)
- `peak_balance` (para calcular drawdown)
- `max_drawdown_percent` (límite configurado)
- `max_exposure_ratio` (límite configurado)
- `daily_loss_limit` (límite configurado)

**Risk Guard informa a Bankroll:**
- `risk_state` (para mostrar en dashboard)
- `cooldown_active`
- `restrictions_active`

---

### 8.3. Fuentes de Datos (CRÍTICO PARA IMPLEMENTACIÓN)

**Esta sección es OBLIGATORIA para que el equipo de desarrollo pueda implementar Risk Guard.**

Cada métrica que Risk Guard evalúa tiene una **fuente de datos específica**:

| Métrica | Fuente | Query / Cálculo |
|---------|--------|-----------------|
| **picks_today** | Watchlist (UserPick) | `SELECT COUNT(*) FROM user_picks WHERE user_id = ? AND DATE(created_at) = TODAY` |
| **picks_last_60min** | Watchlist (UserPick) | `SELECT COUNT(*) FROM user_picks WHERE user_id = ? AND created_at >= NOW() - INTERVAL 1 HOUR` |
| **live_picks_last_30min** | Watchlist (UserPick) | `SELECT COUNT(*) FROM user_picks WHERE user_id = ? AND mode = 'LIVE' AND created_at >= NOW() - INTERVAL 30 MINUTE` |
| **unique_leagues_today** | Watchlist (UserPick) | `SELECT COUNT(DISTINCT league) FROM user_picks WHERE user_id = ? AND DATE(created_at) = TODAY` |
| **exposure (open_stake)** | TradeIntent + UserPick | `SELECT SUM(stake) FROM trade_intents WHERE user_id = ? AND status IN ('PENDING', 'EXECUTING')` |
| **available_balance** | Bankroll | `bankroll_profile.current_balance - calculateExposure(user_id)` |
| **current_balance** | Bankroll | `SELECT current_balance FROM bankroll_profiles WHERE user_id = ?` |
| **peak_balance** | Bankroll | `SELECT peak_balance FROM bankroll_profiles WHERE user_id = ?` |
| **drawdown** | Calculado | `(peak_balance - current_balance) / peak_balance * 100` |
| **consecutive_losses** | Watchlist (UserPick) | Ver query específica abajo |
| **stake_avg_30d** | Watchlist (UserPick) | `SELECT AVG(actual_stake) FROM user_picks WHERE user_id = ? AND executed = true AND created_at >= NOW() - INTERVAL 30 DAY` |
| **horario_habitual** | Watchlist (UserPick) | Ver query específica abajo |
| **typical_markets** | Watchlist (UserPick) | `SELECT market, COUNT(*) FROM user_picks WHERE user_id = ? GROUP BY market ORDER BY COUNT(*) DESC` |
| **daily_pnl** | Bankroll Ledger | `SELECT SUM(pnl) FROM bankroll_ledger WHERE user_id = ? AND DATE(settled_at) = TODAY` |
| **execution_ratio** | Watchlist (UserPick) | `(executed_picks / total_picks) WHERE created_at >= NOW() - INTERVAL 30 DAY` |

#### Queries Específicas Detalladas

**1. Consecutive Losses (para Tilt Detection):**
```sql
-- Obtener últimas 5 operaciones resueltas
SELECT status, settled_at
FROM user_picks
WHERE user_id = ?
  AND status IN ('win', 'loss')
ORDER BY settled_at DESC
LIMIT 5
```

```javascript
// Analizar secuencia
const results = await query(sql)
let consecutive_losses = 0

for (const result of results) {
  if (result.status === 'loss') {
    consecutive_losses++
  } else {
    break  // Rompe la racha
  }
}

// Si consecutive_losses >= 3 AND
// existe pick creado en últimos 15min → TILT
```

**2. Horario Habitual (para detectar horario anómalo):**
```sql
SELECT 
  HOUR(created_at) as hour,
  COUNT(*) as pick_count
FROM user_picks
WHERE user_id = ?
  AND created_at >= NOW() - INTERVAL 60 DAY
GROUP BY HOUR(created_at)
ORDER BY pick_count DESC
LIMIT 3
```

```javascript
// Resultado ejemplo:
[
  { hour: 19, pick_count: 45 },  // 7pm - horario más común
  { hour: 20, pick_count: 38 },  // 8pm
  { hour: 18, pick_count: 32 }   // 6pm
]

// Si pick actual es a las 2am → anómalo (no está en top 3)
```

**3. Stake Escalado (para Tilt Detection):**
```sql
SELECT AVG(actual_stake) as avg_stake
FROM user_picks
WHERE user_id = ?
  AND executed = true
  AND created_at >= NOW() - INTERVAL 30 DAY
```

```javascript
const avg_stake = 25.00  // resultado de query
const current_stake = 45.00  // stake del pick actual
const ratio = current_stake / avg_stake  // 1.8

if (ratio > 1.8) {
  tilt_score += 30  // Señal de tilt
}
```

**4. Exposure Calculation (crítico):**
```sql
SELECT COALESCE(SUM(ti.stake), 0) as total_exposure
FROM trade_intents ti
JOIN user_picks up ON ti.pick_id = up.id
WHERE ti.user_id = ?
  AND ti.status IN ('PENDING', 'EXECUTING')
  AND up.status = 'pending'
```

```javascript
// Cálculo completo
const bankroll = 1000
const total_exposure = 120  // resultado de query
const exposure_ratio = (total_exposure / bankroll) * 100  // 12%

if (exposure_ratio > 40) {
  return { allowed: false, reason: 'EXPOSURE_CRITICAL' }
}
```

**5. Drawdown Calculation:**
```javascript
// Datos de Bankroll Profile
const peak_balance = bankroll_profile.peak_balance      // 1250
const current_balance = bankroll_profile.current_balance  // 1150

const drawdown_amount = peak_balance - current_balance  // 100
const drawdown_percent = (drawdown_amount / peak_balance) * 100  // 8%

if (drawdown_percent >= bankroll_config.max_drawdown_percent) {
  return { allowed: false, reason: 'DRAWDOWN_LIMIT' }
}
```

---

#### Cacheo de Datos (Performance)

**Para optimizar performance, Risk Guard mantiene un cache:**

```javascript
// RiskGuardCache (Redis o similar)
const cache_key = `risk:state:${user_id}`
const cache_ttl = 60  // 1 minuto

const cached_state = await cache.get(cache_key)
if (cached_state && !force_recalculate) {
  return cached_state
}

// Si no hay cache, calcular
const state = await calculateRiskState(user_id)
await cache.set(cache_key, state, cache_ttl)

return state
```

**Eventos que invalidan el cache:**
- Usuario crea pick → `cache.del(risk:state:${user_id})`
- Usuario exporta pick → `cache.del(risk:state:${user_id})`
- Pick se resuelve → `cache.del(risk:state:${user_id})`
- Balance cambia → `cache.del(risk:state:${user_id})`
- Cooldown activa/termina → `cache.del(risk:state:${user_id})`

**Recálculo estratégico:**
- Al crear pick → recalcular `overtrading` solo
- Al exportar pick → recalcular TODO
- Al resolver pick → recalcular `drawdown` y `exposure`

---

### 8.4. Agents Hub

**Antes de activar agente:**
```javascript
const risk_check = await riskGuard.canActivateAgent(user_id, agent_id)

if (!risk_check.allowed) {
  agent.status = 'PAUSED'
  notify(user, risk_check.message)
}
```

**Durante operación automática:**
```javascript
// Agent solicita ejecutar señal
const risk_check = await riskGuard.canExecute(user_id, signal_id, stake)

if (!risk_check.allowed) {
  agent.skipSignal(signal_id, risk_check.reason)
  logAudit('AGENT_BLOCKED_BY_RISK_GUARD', { signal_id, reason: risk_check.reason })
}
```

### 7.4. Trader Master

**Antes de enviar ticket a agente:**
```javascript
const risk_check = await riskGuard.canExecuteTicket(user_id, ticket)

if (!risk_check.allowed) {
  ticket.status = 'BLOCKED_BY_RISK'
  ticket.block_reason = risk_check.message
  showAlert(risk_check.message)
}
```

### 7.5. Execution Engine

**OBLIGATORIO antes de toda ejecución:**

```javascript
async function execute(user_id, trade_intent) {
  // PASO 1: Risk Guard (obligatorio)
  const risk_check = await riskGuard.evaluate(user_id, trade_intent)
  
  if (!risk_check.allowed) {
    return {
      success: false,
      reason: 'BLOCKED_BY_RISK_GUARD',
      message: risk_check.message,
      level: risk_check.level
    }
  }
  
  // PASO 2: Ejecutar
  const result = await broker.placeBet(trade_intent)
  
  // PASO 3: Update Risk Guard state
  await riskGuard.recordExecution(user_id, result)
  
  return result
}
```

---

## 9. Cold Start Mode (Usuarios Nuevos)

**Problema:** Risk Guard usa métricas históricas (avg_stake, horario habitual, CLV, etc) pero un usuario nuevo NO tiene historial.

**Solución:** Modo de arranque en frío con reglas especiales.

### 9.1. Detección de Usuario Nuevo

```javascript
function isNewUser(user_id) {
  const stats = getUserStats(user_id)
  return stats.total_picks < 15  // Primeros 10-15 picks
}
```

### 9.2. Límites en Cold Start

**Durante los primeros 10-15 picks:**

| Check | Límite Normal | Límite Cold Start |
|-------|---------------|-------------------|
| **Overtrading** | 12 picks/día | **5 picks/día** |
| **Exposure** | 40% | **25%** |
| **Stake** | recommended * 1.5 | **recommended * 1.2** |
| **Drawdown** | 20% | **15%** |
| **Tilt Detection** | Activado | **DESACTIVADO** |
| **Selective Execution** | Activado | **DESACTIVADO** |
| **Horario Anómalo** | Activado | **DESACTIVADO** |

**Checks que SÍ se aplican:**
- ✅ Overtrading (límites más bajos)
- ✅ Exposure (límites más bajos)
- ✅ Stake validation (límites más bajos)
- ✅ Drawdown (límites más bajos)
- ✅ Cooldown por drawdown

**Checks que NO se aplican:**
- ❌ Tilt detection (no hay baseline)
- ❌ Selective execution (no hay ratio histórico)
- ❌ Horario anómalo (no hay patrón establecido)
- ❌ Stake escalado (no hay avg_stake)

### 9.3. Implementación

```javascript
function getColdStartConfig(user_id) {
  const stats = getUserStats(user_id)
  
  if (stats.total_picks >= 15) {
    return null  // Ya no es usuario nuevo
  }
  
  return {
    mode: 'COLD_START',
    picks_count: stats.total_picks,
    picks_remaining: 15 - stats.total_picks,
    limits: {
      max_picks_per_day: 5,
      max_exposure_ratio: 25,
      max_stake_multiplier: 1.2,
      max_drawdown: 15
    },
    disabled_checks: [
      'TILT_DETECTION',
      'SELECTIVE_EXECUTION',
      'UNUSUAL_HOURS',
      'STAKE_ESCALATION'
    ]
  }
}
```

### 9.4. Evaluación con Cold Start

```javascript
async function evaluate(user_id, trade_intent) {
  const cold_start = getColdStartConfig(user_id)
  
  if (cold_start) {
    // Aplicar límites de Cold Start
    const result = await evaluateWithColdStart(user_id, trade_intent, cold_start)
    
    // Mostrar mensaje al usuario
    if (result.allowed) {
      result.info_message = `Modo aprendizaje: ${cold_start.picks_remaining} picks restantes para análisis completo`
    }
    
    return result
  }
  
  // Evaluación normal
  return await evaluateNormal(user_id, trade_intent)
}
```

### 9.5. UI para Usuarios Nuevos

**Badge en dashboard:**
```
┌──────────────────────────────────────┐
│ 🎓 Modo Aprendizaje                  │
│ 8 picks restantes para completar    │
│ análisis de perfil                   │
└──────────────────────────────────────┘
```

**Mensaje al crear pick:**
```
ℹ️ Estás en modo aprendizaje (pick 7/15).
Límites reducidos para protección:
• Máx 5 picks/día
• Máx 25% exposure
• Stake hasta +20% del recomendado
```

### 9.6. Transición a Modo Normal

**Cuando el usuario alcanza 15 picks:**

```javascript
async function checkColdStartGraduation(user_id) {
  const stats = getUserStats(user_id)
  
  if (stats.total_picks === 15) {
    // Graduar usuario
    await updateUserConfig(user_id, {
      cold_start_completed: true,
      graduated_at: now()
    })
    
    // Calcular baseline metrics
    const baseline = await calculateBaselineMetrics(user_id)
    
    await saveBaselineMetrics(user_id, {
      avg_stake: baseline.avg_stake,
      typical_hours: baseline.typical_hours,
      typical_markets: baseline.typical_markets,
      avg_odds: baseline.avg_odds
    })
    
    // Notificar usuario
    await notifyUser(user_id, {
      title: '🎓 Modo Aprendizaje Completado',
      message: `Has completado 15 picks. Ahora el sistema puede analizar tu perfil completo y ofrecerte protecciones personalizadas.`,
      type: 'MILESTONE',
      actions: [
        { label: 'Ver mi perfil', action: 'VIEW_PROFILE' }
      ]
    })
  }
}
```

### 9.7. Beneficio del Cold Start

**Sin Cold Start:**
- ❌ Usuario nuevo bloqueado injustamente
- ❌ "Tilt detected" sin tener historial
- ❌ "Horario anómalo" cuando no hay patrón
- ❌ Frustración y abandono

**Con Cold Start:**
- ✅ Límites apropiados para principiantes
- ✅ Protección sin sobre-restricción
- ✅ Sistema aprende el perfil del usuario
- ✅ Transición suave a modo normal
- ✅ Mejor retención de usuarios nuevos

---

## 10. API del Módulo

### 10.1. Evaluación de Riesgo

#### Evaluar Ejecución
```
POST /risk/evaluate
Body: {
  user_id: string
  trade_intent_id?: string
  pick_id?: string
  stake?: number
}

Response: {
  allowed: boolean
  level: 'INFO' | 'WARNING' | 'RESTRICT' | 'LOCK'
  reason: string
  message: string
  cooldown_until?: timestamp
  requires_confirmation?: boolean
  suggested_action?: string
}
```

#### Estado Actual del Usuario
```
GET /risk/status/:user_id

Response: {
  state: 'healthy' | 'caution' | 'high_risk' | 'locked'
  checks: {
    overtrading: { level, message },
    exposure: { level, message },
    drawdown: { level, message },
    tilt: { level, message }
  }
  metrics: {
    drawdown_percent: number
    exposure_ratio: number
    picks_today: number
    open_trades: number
  }
  cooldown: {
    active: boolean
    until?: timestamp
    reason?: string
  }
}
```

### 10.1. Gestión de Cooldown

#### Activar Cooldown Manual
```
POST /risk/cooldown/activate
Body: {
  user_id: string
  reason: string
  duration_hours: number
}
```

#### Desbloquear Manualmente (Admin)
```
POST /risk/cooldown/override
Body: {
  user_id: string
  admin_id: string
  reason: string
}
```

### 10.2. Auditoría

#### Log de Eventos de Riesgo
```
GET /risk/audit/:user_id
Query: {
  from?: date
  to?: date
  level?: 'INFO' | 'WARNING' | 'RESTRICT' | 'LOCK'
}

Response: {
  events: [{
    timestamp: timestamp
    event_type: string
    level: string
    reason: string
    action_taken: string
    user_response?: string
  }]
}
```

---

## 9. Modelo de Datos

### 9.1. RiskState (Cache/Session)

```typescript
interface RiskState {
  user_id: string
  state: 'healthy' | 'caution' | 'high_risk' | 'locked'
  
  // Checks individuales
  overtrading_level: AlertLevel
  exposure_level: AlertLevel
  drawdown_level: AlertLevel
  tilt_level: AlertLevel
  
  // Métricas actuales
  picks_today: number
  picks_this_hour: number
  exposure_ratio: number
  drawdown_percent: number
  tilt_score: number
  
  // Cooldown
  cooldown_active: boolean
  cooldown_until?: timestamp
  cooldown_reason?: string

  // Sincronización de Capital
  capital_sync: {
    status: 'SYNCED' | 'MISALIGNED'
    plan_bankroll: number
    broker_balance: number
    deviation_percent: number
  }

  // Psicología de Rachas
  streak_behavior: {
    current_streak_type: 'WIN' | 'LOSS' | 'NONE'
    current_streak_count: number
    after_loss_aggression: boolean // true si se detecta aumento de stake post-pérdida
    after_win_euphoria: boolean    // true si se detecta comportamiento anómalo post-victoria
  }

  // Riesgo por Horario (IA)
  time_of_day_risk: {
    is_anomalous_hour: boolean
    user_profitable_hours: string[] // e.g., ["14:00-18:00 UTC"]
    current_hour_performance: number // e.g., -0.15 (representa un -15% de ROI en esta franja)
  }

  // Riesgo Ponderado por Calidad (Watchlist)
  quality_weighted_risk: {
    avg_quality_score: number // 0-10
    last_pick_quality_score: number
    flexibility_bonus: number // e.g., 1.1 (un 10% más de margen)
  }
  
  // Recovery Mode (modo recuperación post-lock)
  recovery_mode: {
    active: boolean
    until?: timestamp
    limits_override: {
      max_picks_per_day: number
      max_exposure_ratio: number
      max_stake_multiplier: number
    }
  }
  
  // Timestamp
  last_updated: timestamp
  last_check: timestamp
}
```

### 9.2. RiskEvent (Persistencia)

```typescript
interface RiskEvent {
  id: string
  user_id: string
  event_type: 'ALERT' | 'BLOCK' | 'COOLDOWN' | 'UNLOCK'
  level: 'INFO' | 'WARNING' | 'RESTRICT' | 'LOCK'
  reason: string
  message: string
  source_hook: 'PRE_PICK_CREATION' | 'PRE_TICKET_EXECUTION' | 'POST_SETTLEMENT'
  operation_source?: 'manual_pick' | 'trader_ticket' | 'ai_signal' | 'auto_agent'
  metadata?: any
  timestamp: timestamp
}
  // Auditoría - origen del evento
  source_hook: 'CREATE_PICK' | 'EXPORT' | 'EXECUTE' | 'AGENT_ACTIVATE' | 'MANUAL' | 'SYSTEM'
  
  // Context
  trigger_values?: {
    picks_today?: number
    exposure_ratio?: number
    drawdown?: number
    tilt_score?: number
    daily_pnl?: number
  }
  
  // Acción tomada
  action_taken: string
  user_response?: 'ACKNOWLEDGED' | 'CONFIRMED' | 'CANCELLED'
  
  // Cooldown
  cooldown_duration_hours?: number
  cooldown_until?: timestamp
  
  created_at: timestamp
}
```

### 9.3. RiskConfig (Por Usuario)

```typescript
interface RiskConfig {
  user_id: string
  
  // Límites personalizados (opcional)
  max_picks_per_day?: number
  max_exposure_ratio?: number
  max_drawdown_percent?: number
  
  // Preferencias
  tilt_detection_enabled: boolean
  cooldown_notifications: boolean
  strict_mode: boolean              // modo estricto = límites más bajos
  
  // Overrides (Admin)
  overrides: {
    disable_overtrading_check?: boolean
    disable_exposure_check?: boolean
    disable_tilt_check?: boolean
  }
  
  created_at: timestamp
  updated_at: timestamp
}
```

### 9.4. TradeIntentStatus (Enum)

```typescript
enum TradeIntentStatus {
  DRAFT = 'DRAFT',                    // Pick creado pero no exportado
  EXPORTED = 'EXPORTED',              // Exportado desde Watchlist, pendiente de evaluación
  PENDING = 'PENDING',                // En espera de ejecución (pasó Risk Guard)
  EXECUTING = 'EXECUTING',              // En proceso de ejecución con agente
  EXECUTED = 'EXECUTED',              // Ejecutado exitosamente
  SETTLED = 'SETTLED',                  // Resultado confirmado y liquidado
  CANCELLED = 'CANCELLED',              // Cancelado por usuario o sistema
  FAILED = 'FAILED',                    // Falló la ejecución
  BLOCKED_BY_RISK_GUARD = 'BLOCKED_BY_RISK_GUARD'  // Bloqueado por Risk Guard
}

// Estados que cuentan para exposure (capital comprometido)
const EXPOSURE_COUNTING_STATUSES = [
  TradeIntentStatus.PENDING,
  TradeIntentStatus.EXECUTING
]
```

---

## 10. UI Esperada

### 10.1. Risk Guard Dashboard

**Header del módulo:**
```
┌────────────────────────────────────────────────────┐
│ 🚨 Risk Guard                      Status: HEALTHY │
├────────────────────────────────────────────────────┤
│ ✅ Sin alertas activas                              │
│ Drawdown: 8% • Exposure: 12% • Picks hoy: 3       │
└────────────────────────────────────────────────────┘
```

### 10.2. Checks Visuales

```
┌─────────────────────────────────────────┐
│ Overtrading          ✅ HEALTHY          │
│ 3 picks hoy (límite: 12)                │
│                                         │
│ Exposure             ✅ HEALTHY          │
│ 12% en juego (límite: 40%)              │
│                                         │
│ Drawdown             ⚠️  CAUTION         │
│ 8% desde peak (alerta: 10%)             │
│                                         │
│ Tilt Detection       ✅ HEALTHY          │
│ Sin patrones emocionales                │
└─────────────────────────────────────────┘
```

### 10.3. Alert Modal (WARNING)

```
┌─────────────────────────────────────────┐
│          ⚠️  ADVERTENCIA                 │
├─────────────────────────────────────────┤
│ Has registrado 9 picks hoy.             │
│                                         │
│ Los traders rentables promedian 3-5     │
│ picks diarios de alta convicción.       │
│                                         │
│ ¿Quieres continuar?                     │
│                                         │
│ [Cancelar]  [Sí, continuar]            │
└─────────────────────────────────────────┘
```

### 10.4. Block Modal (RESTRICT)

```
┌─────────────────────────────────────────┐
│          🚨 RESTRICCIÓN ACTIVA           │
├─────────────────────────────────────────┤
│ Tu drawdown actual es 18%.              │
│                                         │
│ Para proteger tu capital, el sistema    │
│ no permite nuevas ejecuciones hasta     │
│ que recuperes a menos de 15%.           │
│                                         │
│ Puedes:                                 │
│ • Ver señales y analizar                │
│ • Registrar picks (sin ejecutar)        │
│ • Cerrar posiciones abiertas            │
│                                         │
│ [Entendido]                             │
└─────────────────────────────────────────┘
```

### 10.5. Cooldown Screen (LOCK)

```
┌─────────────────────────────────────────┐
│          🔒 PAUSA DE PROTECCIÓN          │
├─────────────────────────────────────────┤
│ Cooldown activo hasta mañana 14:30      │
│                                         │
│ Motivo: Drawdown severo (22%)           │
│                                         │
│ Esta pausa protege tu capital y te      │
│ ayuda a resetear tu enfoque.            │
│                                         │
│ Tiempo restante: 23h 15min              │
│                                         │
│ Mientras tanto puedes:                  │
│ • Analizar el mercado                   │
│ • Revisar tu historial                  │
│ • Estudiar tus mejores picks            │
│                                         │
│ [Ver mis estadísticas]                  │
└─────────────────────────────────────────┘
```

---

## 11. Filosofía Final

### 11.1. Educación vs Control

Risk Guard **no es un sistema de control punitivo.**

Es un **sistema de entrenamiento conductual** que:

- ✅ Protege al usuario de auto-destrucción
- ✅ Educa sobre gestión de riesgo
- ✅ Crea disciplina operativa
- ✅ Aumenta probabilidad de rentabilidad
- ✅ Reduce abandono de la plataforma

### 11.2. Mensajes Constructivos

**Principio de comunicación:**

El usuario no debe sentir:
- ❌ "La app no me deja operar"
- ❌ "Me está castigando"
- ❌ "Me trata como idiota"

El usuario debe sentir:
- ✅ "La app me ayuda a no cometer errores"
- ✅ "Me protege de mí mismo"
- ✅ "Me entrena para ser mejor trader"

### 11.3. Objetivo Final

**Sin Risk Guard:**
- Usuarios operan impulsivamente
- Se auto-destruyen en semanas
- Abandonan la plataforma
- Nunca llegan a ser rentables

**Con Risk Guard:**
- Sobreviven los primeros meses (crítico)
- Aprenden gestión de riesgo
- Desarrollan disciplina
- Algunos se convierten en tipsters
- Retención 3x mayor

---

## 12. Mejoras Adicionales (Contexto del Sistema)

### 12.1. Risk Score Compuesto

**Nuevo: Score unificado de riesgo**

```javascript
function calculateRiskScore(user_id) {
  const weights = {
    overtrading: 0.20,
    exposure: 0.30,
    drawdown: 0.35,
    tilt: 0.15
  }
  
  const scores = {
    overtrading: normalizeScore(evaluateOvertrading(user_id)),
    exposure: normalizeScore(evaluateExposure(user_id)),
    drawdown: normalizeScore(evaluateDrawdown(user_id)),
    tilt: normalizeScore(detectTilt(user_id))
  }
  
  const risk_score = Object.keys(weights).reduce((sum, key) => {
    return sum + (scores[key] * weights[key])
  }, 0)
  
  return {
    score: risk_score,              // 0-100
    level: getRiskLevel(risk_score),
    breakdown: scores
  }
}

function getRiskLevel(score) {
  if (score >= 80) return 'LOCK'
  if (score >= 60) return 'RESTRICT'
  if (score >= 30) return 'WARNING'
  return 'INFO'
}
```

**Beneficio:** Score único más intuitivo para el usuario.

### 12.2. Adaptive Limits (Límites Adaptativos)

**Concepto:** Los límites se ajustan según el historial del usuario.

```javascript
function getAdaptiveLimits(user_id) {
  const stats = getUserStats(user_id)
  const base_limits = getBaseLimits()
  
  // Usuario con track record positivo → límites más flexibles
  if (stats.win_rate > 60 && stats.total_picks > 100 && stats.avg_clv > 2) {
    return {
      max_picks_per_day: base_limits.max_picks_per_day * 1.3,
      max_exposure_ratio: base_limits.max_exposure_ratio * 1.2,
      max_drawdown: base_limits.max_drawdown * 1.1
    }
  }
  
  // Usuario nuevo → límites más estrictos
  if (stats.total_picks < 25) {
    return {
      max_picks_per_day: Math.min(base_limits.max_picks_per_day, 5),
      max_exposure_ratio: base_limits.max_exposure_ratio * 0.8,
      max_drawdown: base_limits.max_drawdown * 0.8
    }
  }
  
  return base_limits
}
```

**Beneficio:** Sistema que "confía más" en traders probados.

### 12.3. Recovery Mode (Modo Recuperación)

**Concepto:** Después de un LOCK, el usuario entra en "modo recuperación" con límites reducidos temporalmente.

```javascript
function checkRecoveryMode(user_id) {
  const last_lock = getLastLockEvent(user_id)
  
  if (!last_lock) return { active: false }
  
  const hours_since_unlock = (now() - last_lock.unlocked_at) / (1000 * 60 * 60)
  
  // Primeras 48h post-unlock = recovery mode
  if (hours_since_unlock < 48) {
    return {
      active: true,
      hours_remaining: 48 - hours_since_unlock,
      limits: {
        max_picks_per_day: 5,
        max_exposure_ratio: 25,
        max_stake_multiplier: 1.2  // no puede exceder stake recomendado en >20%
      },
      message: 'Estás en modo recuperación. Límites reducidos por 48h.'
    }
  }
  
  return { active: false }
}
```

**Beneficio:** Reduce probabilidad de re-tilt inmediato.

### 12.4. Peer Comparison (Comparación con Pares)

**Concepto:** Mostrar al usuario cómo se compara con otros en su nivel.

```javascript
function getPeerComparison(user_id) {
  const user_stats = getUserStats(user_id)
  const peers = getPeersInSameTier(user_id)  // mismo # de picks aprox
  
  return {
    overtrading: {
      user: user_stats.picks_per_day,
      peer_avg: peers.avg_picks_per_day,
      peer_p90: peers.p90_picks_per_day,
      message: user_stats.picks_per_day > peers.p90_picks_per_day 
        ? 'Operas más que el 90% de traders de tu nivel'
        : null
    },
    exposure: {
      user: user_stats.avg_exposure,
      peer_avg: peers.avg_exposure,
      message: user_stats.avg_exposure > peers.avg_exposure 
        ? 'Tu exposure promedio es mayor al de tus pares'
        : null
    }
  }
}
```

**Beneficio:** Contexto social sin exponer datos privados.

### 12.5. Pre-Session Check (Chequeo Pre-Sesión)

**Concepto:** Antes de cada sesión operativa, mostrar un resumen de estado.

```javascript
function getPreSessionCheck(user_id) {
  const state = calculateRiskState(user_id)
  const recent_performance = getRecentPerformance(user_id, { days: 7 })
  const recovery_mode = checkRecoveryMode(user_id)
  
  return {
    state: state,
    recovery_mode: recovery_mode,
    summary: {
      last_7_days: {
        picks: recent_performance.total_picks,
        win_rate: recent_performance.win_rate,
        roi: recent_performance.roi,
        biggest_win: recent_performance.biggest_win,
        biggest_loss: recent_performance.biggest_loss
      },
      current_drawdown: recent_performance.drawdown,
      current_exposure: recent_performance.exposure,
      recommendations: generateRecommendations(state, recent_performance)
    }
  }
}
```

**UI:**
```
┌─────────────────────────────────────────┐
│     🎯 SESIÓN DE TRADING                 │
├─────────────────────────────────────────┤
│ Estado: ✅ HEALTHY                       │
│ Drawdown: 5% • Exposure: 8%             │
│                                         │
│ Últimos 7 días:                         │
│ • 12 picks • 58% WR • +8% ROI           │
│                                         │
│ ✅ Todo listo para operar               │
│                                         │
│ Recomendación:                          │
│ Mantén tu enfoque en Over/Under.        │
│ Tu mejor rendimiento está ahí.          │
│                                         │
│ [Comenzar sesión]                       │
└─────────────────────────────────────────┘
```

---

## 13. Métricas de Producto

**KPIs a trackear:**

| Métrica | Descripción | Target |
|---------|-------------|--------|
| Alert Rate | % de usuarios con alerts activas | <30% |
| Block Rate | % de usuarios bloqueados en último mes | <5% |
| Cooldown Frequency | Promedio de cooldowns por usuario/mes | <0.5 |
| Override Rate | % de warnings ignorados | <40% |
| Recovery Success | % usuarios que mejoran post-cooldown | >60% |
| Churn Reduction | Reducción de abandono vs sin Risk Guard | >30% |

---

## 14. Roadmap

### Fase 1 (MVP) ✅
- [x] Overtrading detection
- [x] Exposure limits
- [x] Drawdown protection
- [x] Basic cooldown system
- [x] Integration with Bankroll

### Fase 2
- [ ] Tilt detection completo
- [ ] Adaptive limits
- [ ] Recovery mode
- [ ] Pre-session checks
- [ ] Peer comparison

### Fase 3
- [ ] ML para detección de tilt
- [ ] Predicción de riesgo futuro
- [ ] Recomendaciones personalizadas
- [ ] Gamificación de disciplina

---

## 15. Referencias

- **Watchlist**: watchlist.md
- **Bankroll**: bankroll.md
- **Trader Master**: trader-master.md
- **Agents Hub**: agents-hub.md
- **Signals**: signals.md

---

**Versión:** 1.0  
**Última actualización:** 2025-02-07  
**Autor:** Sistema Trader Deportivo  
**Estado:** Documentación Oficial

---

## Análisis Crítico Post-Revisión del HTML

### ✅ Elementos Implementados en la UI
- **Estructura de alertas** con categorías de riesgo (Alto, Medio, Bajo)
- **Sistema de cards** para diferentes tipos de alertas
- **Gráficos de tendencias** con visualización temporal
- **Tabla de eventos de riesgo** con estado y acciones
- **Filtros por tipo** y período temporal
- **Diseño responsive** con adaptación móvil

### ⚠️ Problemas Críticos Identificados en la Implementación

#### 1. **Implementación Visual vs Documentación - Gran Brecha**
- La documentación describe un sistema sofisticado con 6 dimensiones de riesgo
- El HTML solo muestra datos estáticos y simulados
- **Impacto**: La complejidad documentada no se refleja en la implementación
- **Solución**: Desarrollar el sistema completo según especificaciones

#### 2. **Datos Completamente Estáticos**
- Todos los eventos de riesgo están hardcodeados en el HTML
- Sin integración con algoritmos de detección real
- **Impacto**: Sistema de alertas completamente inútil
- **Solución**: Implementar motores de análisis de riesgo dinámicos

#### 3. **Falta de Sistema de Umbrales Adaptativos**
- No hay implementación de límites dinámicos según documentación
- Sin consideración de historial del usuario
- **Impacto**: Alertas genéricas sin contexto personal
- **Solución**: Desarrollar sistema de umbrales adaptativos

#### 4. **Sin Sistema de Cooldown o Bloqueo**
- No hay implementación de niveles de intervención (INFO/WARNING/RESTRICT/LOCK)
- Sin mecanismos de cooldown temporal
- **Impacto**: No protege al usuario de sobreoperación
- **Solución**: Implementar sistema de restricciones progresivas

### 🔧 Bugs de Alineación Visual en el HTML

#### 1. **Inconsistencia de Cards de Alerta**
- Las tarjetas no mantienen altura consistente
- Iconos de riesgo desalineados verticalmente
- **Solución**: Implementar CSS grid con alturas fijas

#### 2. **Problemas de Overflow en Tablas**
- Tabla de eventos genera scroll horizontal en móviles
- Sin adaptación responsive adecuada
- **Solución**: Implementar tabla responsive con columnas colapsables

#### 3. **Gráficos No Adaptativos**
- Los gráficos de tendencias se distorsionan en pantallas pequeñas
- Sin versión móvil optimizada
- **Solución**: Implementar gráficos responsive con D3.js o Chart.js

### 🚨 Problemas de Seguridad en la Implementación

#### 1. **Exposición de Datos de Riesgo**
- Alertas y umbrales visibles sin autenticación
- Sin enmascaramiento de información sensible
- **Impacto**: Información estratégica expuesta

#### 2. **Sin Validación de Acciones**
- Botones de acción (ignorar, marcar como leído) sin confirmación
- Sin registro de quién ignora alertas críticas
- **Impacto**: Responsabilidad legal en disputas

#### 3. **Falta de Rate Limiting**
- Sistema vulnerable a spam de alertas falsas
- Sin protección contra manipulación de umbrales
- **Impacto**: Denegación de servicio o confusión deliberada

### 📊 Brecha Documentación vs Implementación

| Característica | Documentación | HTML Implementado | Estado |
|----------------|---------------|-------------------|---------|
| Overtrading Detection | ✅ Complejo | ❌ No existe | CRÍTICO |
| Exposure Limits | ✅ Adaptativos | ❌ Estáticos | CRÍTICO |
| Drawdown Protection | ✅ Multi-nivel | ❌ Simple alerta | CRÍTICO |
| Tilt Detection | ✅ ML-based | ❌ No existe | CRÍTICO |
| Cooldown System | ✅ 4 niveles | ❌ No existe | CRÍTICO |
| Adaptive Limits | ✅ Personalizados | ❌ Genéricos | ALTO |
| Recovery Mode | ✅ Post-lock | ❌ No existe | MEDIO |

### 🔍 Recomendaciones Prioritarias

1. **CRÍTICO**: Implementar algoritmos de detección según documentación
2. **CRÍTICO**: Desarrollar sistema de umbrales adaptativos
3. **ALTO**: Crear sistema de intervención progresiva (4 niveles)
4. **ALTO**: Integrar con datos de trading en tiempo real
5. **MEDIO**: Implementar sistema de cooldown y recuperación

### 📋 Estado General de Implementación: 3/10
- **Diseño visual**: Aceptable (6/10)
- **Funcionalidad documentada**: Excelente (9/10)
- **Funcionalidad implementada**: Muy pobre (2/10)
- **Seguridad**: Deficiente (4/10)
- **Datos reales**: No existe (0/10)

**Conclusión**: Existe una brecha masiva entre la excelente documentación técnica y la implementación HTML. El sistema documentado es sofisticado y completo, pero la implementación es solo un mockup visual básico. Se requiere desarrollo completo del backend y algoritmos para cumplir con la especificación.

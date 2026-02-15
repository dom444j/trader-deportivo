# Watchlist Module

## Concepto Central

**Watchlist es el "radar personal" del usuario:** lista corta y accionable de partidos/mercados/ligas/equipos que quiere monitorear, más sus propias selecciones de apuestas con tracking de rendimiento.

- **NO ejecuta apuestas** directamente
- Alimenta a Signals y Trader Master con contexto y prioridades
- Rastrea el desempeño del usuario en sus propias selecciones
- Identifica internamente a potenciales tipsters (datos NO públicos)

**Y, sobre todo, es el laboratorio de traders de la plataforma:** aquí nacen futuros tipsters y se diferencia el análisis informado del azar en base a evidencia (CLV, disciplina, especialización y justificación de la entrada).

**Pero más importante aún: es un simulador de trading deportivo con memoria.** Transforma conducta caótica en disciplina operativa mediante intervenciones conductuales invisibles, creando traders profesionales mientras el usuario cree que solo está organizando sus picks.

---

## 1. Propósito del Módulo

Watchlist cumple **tres funciones principales:**

1. **Monitoreo**: Lista de eventos/equipos/ligas de interés
2. **Tracking personal**: Registro de selecciones propias del usuario
3. **Detección de talento**: Sistema interno para identificar usuarios con alto rendimiento

---

## 2. Entidades Soportadas (MVP)

### 2.1. Items de Watchlist (Monitoreo)

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **match** | Partido específico | Real Madrid vs Barcelona |
| **team** | Equipo completo | Liverpool (todos sus partidos) |
| **league** | Liga/torneo | Premier League, Champions League |
| **market** | Mercado específico | Over 2.5, BTTS |
| **tipster** | Seguir a un tipster | Master Elite, IA Core |

### 2.2. Selecciones Propias (User Picks)

**Nuevo:** Los usuarios pueden añadir sus propias selecciones de apuestas para:
- Registrar su criterio antes del evento
- Trackear su rendimiento personal
- Competir en ranking interno (privado)
- Ser detectados como potenciales tipsters

**Estructura de una selección propia:**
```typescript
{
  id: string
  user_id: string
  match_id: string
  market: string              // ej: "ML", "O2.5", "AH -1"
  selection: string           // ej: "Real Madrid", "Over"
  odds_at_pick: number        // cuota al momento de crear
  confidence: number          // 0-100 (auto-declarada)
  reasoning?: string          // opcional: por qué eligió esto
  status: 'pending' | 'win' | 'loss' | 'void' | 'cancelled'
  created_at: timestamp
  resolved_at?: timestamp
  is_public: boolean          // por defecto FALSE
}
```

---

## 3. Sistema de Tracking y Rankings (Interno)

### 3.1. Métricas por Usuario (Actualizadas)

El sistema rastrea **automáticamente** para cada usuario:

| Métrica | Descripción | Notas |
|---------|-------------|-------|
| **Total Picks** | Selecciones registradas | - |
| **Win Rate / ROI** | % de aciertos y retorno | - |
| **Avg CLV** | Valor vs cuota de cierre | Métrica profesional clave |
| **Execution Discipline** | Ratio ejecutadas / predichas | - |
| **Behavior Consistency Score** | Estabilidad temporal (horario, stake, mercados) | 0–100 – predictor fuerte de tipster |
| **Execution Skill Score** | Habilidad de timing y ejecución | Separa analista vs ejecutor |
| **Information Score** | Calidad de evidencia y razonamiento | 0–100 |
| **Reasoning Quality Score** | Coherencia del análisis | Derivado de feedback guiado |
| **Specialization Score** | Concentración en ligas/mercados | - |

> **CLV es la métrica profesional** que separa suerte de habilidad: operar de forma sostenida a mejor cuota que el cierre indica ventaja informada, incluso si el resultado puntual fuese negativo.

> **Behavior Consistency Score** es probablemente el **predictor más fuerte** de tipster real: mide si el usuario opera con horarios similares, stake consistente y mercados concentrados (comportamiento institucional vs caótico).

> CLV es la métrica profesional que separa suerte de habilidad: operar de forma sostenida a mejor cuota que el cierre indica ventaja informada, incluso si el resultado puntual fuese negativo.

### 3.2. Ranking Interno de Top Performers

**IMPORTANTE: Estos datos NO son públicos. Son para uso interno del admin.**

#### Criterios de Ranking

El sistema ordena usuarios por:

1. **CLV positivo sostenido** (media > 0 en últimas 30-60 entradas)
2. **Distribución en el tiempo** (sin ráfagas concentradas que indiquen varianza)
3. **Especialización** (rendimiento consistente por mercado/deporte)
4. **Disciplina de ejecución** (ratio ejecutadas vs omitidas acorde al plan)
5. **ROI y Win Rate** (secundarios respecto a CLV)

#### Tabla de Ranking (Admin Only)

```typescript
{
  user_id: string
  username: string
  total_picks: number
  last_10_results: boolean[]        // [true, true, true, ...]
  consecutive_wins: number
  win_rate: number
  roi_30d: number
  avg_odds: number
  avg_clv: number                   // nuevo: promedio de CLV
  best_category: string             // ej: "Fútbol", "Over/Under"
  specialization_markets?: string[] // mercados con mejor desempeño
  execution_discipline_ratio: number // ejecutadas / (predichas)
  eligible_for_tipster: boolean
  tipster_invite_sent: boolean
  created_at: timestamp
}
```

### 3.3. Detección Automática de Potenciales Tipsters

**Criterios mejorados (anti-varianza):**

- Mínimo 25-50 picks por mercado principal
- CLV promedio positivo y sostenido
- Picks distribuidas en el tiempo (no ráfagas)
- Coherencia de odds (sin ajuste ex post)
- Ratio de omisiones sano (no evitar sistemáticamente las malas)

**Triggers para invitación (ejemplo):**

```javascript
function detectPotentialTipster(user_id) {
  const stats = getUserStats(user_id)
  const clvWindow = getAvgCLV(user_id, { period: '30d' })
  const distributionOK = checkTemporalDistribution(user_id, { min_days: 21 })
  const specializationOK = checkSpecialization(user_id, { min_picks_per_market: 25 })
  
  // Condiciones obligatorias
  if (
    stats.total_picks >= 50 &&
    stats.win_rate >= 55 &&
    stats.roi_30d >= 10 &&
    clvWindow > 0 &&
    distributionOK &&
    specializationOK &&
    !stats.tipster_invite_sent
  ) {
    // Marcar para revisión admin
    flagForTipsterInvite(user_id, {
      reason: 'AUTO_DETECTED',
      metrics: { ...stats, avg_clv: clvWindow },
      flagged_at: now()
    })
  }
}
```

**Proceso de invitación:**

1. Sistema detecta automáticamente
2. Admin revisa manualmente (con foco en CLV y especialización)
3. Admin envía invitación personalizada
4. Usuario acepta/rechaza
5. Si acepta → pasa a verificación como Tipster
6. Si verificado → sus picks pueden volverse públicos (con su permiso)

---

## 4. Tags y Organización

### 4.1. Tags del Sistema

| Tag | Descripción | Uso |
|-----|-------------|-----|
| `PRE` | Pre-match | Filtro |
| `LIVE` | In-play | Filtro |
| `HIGH_PRIORITY` | Alta prioridad | Ordenamiento |
| `VALUE_ONLY` | Solo valuebets | Filtro inteligente |
| `SURE_ONLY` | Solo surebets | Filtro inteligente |
| `AVOID` | Blacklist personal | Exclusión |
| `PINNED` | Fijado arriba | Vista |

### 4.2. Tags Personalizados

Usuarios pueden crear tags custom:
- "Mis ligas favoritas"
- "Solo finales"
- "Derbis"
- "Alto valor EV"

---

## 5. Flujo con Otros Módulos

### 5.1. Watchlist → Signals

```
Usuario marca "Real Madrid" en watchlist
→ Signals prioriza señales de Real Madrid
→ Notificaciones activadas para ese equipo
```

**Integración:**
- Watchlist filtra/ordena vista de señales
- Alertas automáticas por eventos en watchlist
- Señales de equipos watchlist suben en ranking

### 5.2. Watchlist → Trader Master

```
Usuario tiene 3 equipos en watchlist
→ Trader Master sugiere combinadas de esos equipos
→ "Universo preferido" para Top Picks
```

**Integración:**
- Items de alta prioridad pesan más en Top Picks
- Fuentes filtradas por preferencias de watchlist
- Sugerencias de tickets basadas en watchlist
- Privacidad de ticket_link: Enlaces externos de tickets (ticket_link) no se muestran en tarjetas/teasers ni feeds; solo visibles en detalle si el usuario tiene acceso; no indexables; no públicos.

### 5.3. Watchlist → Agents Hub

```
Usuario sigue "Premier League" en watchlist
→ Agents Hub recomienda "EPL Specialist Agent"
→ Notificación: "Este agente opera en tus ligas favoritas"
```

**NO enciende agentes automáticamente**, solo recomienda.

### 5.4. Watchlist → Bankroll

```
Usuario añade selección propia
→ Puede marcar "ejecutada con stake X"
→ Se registra en Bankroll Ledger
→ Trackeo de rendimiento
```

**Flujo de selección propia:**
1. Usuario crea pick en Watchlist
2. Decide ejecutarlo (manual o vía agente)
3. Marca como ejecutado + stake
4. Al resolver → se registra en Bankroll
5. Métricas actualizadas en ranking interno

---

## 6. Estados del Item

| Estado | Descripción | UI |
|--------|-------------|-----|
| `active` | Normal, vigente | Color normal |
| `muted` | Baja prioridad / evitar | Opacidad 50% |
| `expired` | Evento pasado | Gris, strikethrough |
| `pinned` | Fijado arriba | Pin icon, always top |
| `pending` | Pick propio sin resolver | Badge amarillo |
| `resolved` | Pick propio resuelto | Badge verde/rojo |

---

## 7. Reglas de UX (Importantes)

### 7.1. Lista Corta

- **Máximo recomendado:** 20 items de monitoreo
- **Sin límite:** para selecciones propias (user picks)
- Alert si >20 items: "Tu watchlist está saturada"

### 7.2. Lista Rápida

**Filtros obligatorios:**
- PRE / LIVE
- Deporte
- Liga
- Estado (active/pending/resolved)
- Prioridad

**Ordenamiento:**
- Pinned primero
- Luego por prioridad
- Luego por start_time

### 7.3. Lista Accionable

**Cada item debe tener CTAs claros:**

| Item Type | CTAs |
|-----------|------|
| Match | Ver señales • Trader Master • Añadir pick |
| Team | Ver partidos • Seguir tipsters del equipo |
| League | Filtrar señales • Ver stats |
| User Pick | Marcar ejecutado • Editar • Eliminar |

---

## 8. UI Esperada (Boceto)

### 8.1. Header

```
┌─────────────────────────────────────────────────────┐
│ 🎯 Watchlist                    [+ Agregar] [Filtros]│
├─────────────────────────────────────────────────────┤
│ [PRE] [LIVE] [Favoritos] [Alta Prioridad] [Mis Picks]│
└─────────────────────────────────────────────────────┘
```

### 8.2. Tabs

- **Monitoreo** - Items de seguimiento (partidos/equipos/ligas)
- **Mis Picks** - Selecciones propias del usuario
- **Resueltas** - Historial de picks con resultado

### 8.3. Cards (Monitoreo)

```
┌─────────────────────────────────────────┐
│ ⚽ Real Madrid vs Barcelona             │
│ 🏆 La Liga • 🕐 Hoy 15:00               │
│                                         │
│ [PRE] [Alta Prioridad] [📌]             │
│                                         │
│ [Ver Señales] [Trader Master] [×]      │
└─────────────────────────────────────────┘
```

### 8.4. Cards (Mis Picks)

```
┌─────────────────────────────────────────┐
│ ⚽ Real Madrid ML @1.85                  │
│ 🏆 La Liga • 🕐 Hoy 15:00               │
│ 💪 Confianza: 75%                       │
│ 📝 "Racha de 5 victorias locales"      │
│                                         │
│ [PENDING] [Marcar Ejecutado] [×]       │
└─────────────────────────────────────────┘
```

### 8.5. Panel Lateral (Detalle)

**Para items de monitoreo:**
- Notas del usuario
- Tags personalizados
- Recordatorios (15m antes / al iniciar / minuto 60 LIVE)
- Historial de señales de este item

**Para picks propios:**
- Editar confianza
- Añadir/editar razonamiento
- Marcar como ejecutado (stake, odds finales)
- Ver resultado y P&L

---

## 9. Modelos de Datos

### 9.1. WatchlistItem (Monitoreo)

```typescript
{
  id: string
  user_id: string
  type: 'match' | 'team' | 'league' | 'market' | 'tipster'
  ref_id: string                    // ID del proveedor o interno
  sport: string
  league?: string
  teams?: string                    // ej: "Real Madrid vs Barcelona"
  event_name?: string
  start_time?: timestamp
  mode: 'PRE' | 'LIVE'
  priority: 'low' | 'normal' | 'high'
  tags: string[]
  status: 'active' | 'muted' | 'expired' | 'pinned'
  notes?: string                    // notas del usuario
  reminders?: {
    before_15min: boolean
    at_start: boolean
    live_minute_60: boolean
  }
  created_at: timestamp
  updated_at: timestamp
}

> **Nota UX sobre Exposure Management:** El sistema solo alerta, nunca bloquea. Ejemplo: "Tienes 5 picks pendientes. Resuelve algunos antes de añadir más." o "Bankroll disponible insuficiente. Tienes $X en picks pendientes."
```

### 9.2. UserPick (Selección Propia)

```typescript
{
  id: string
  user_id: string
  match_id: string
  sport: string
  league: string
  teams: string
  market: string                    // "ML", "O2.5", "AH -1", etc.
  selection: string                 // "Real Madrid", "Over", etc.
  odds_at_pick: number
  closing_odds?: number             // nuevo: cuota de cierre
  clv?: number                      // odds_at_pick - closing_odds
  
  // Odds Movement Tracking
  odds_at_execution?: number        // cuota al momento de ejecutar (si diferente a pick)
  odds_movement?: 'favorable' | 'unfavorable' | 'neutral'  // movimiento desde pick hasta cierre
  confidence: number                // 0-100 (auto-declarada)
  reasoning?: string                // texto libre
  
  // Professional Feedback (rápido – 4 micro-preguntas)
  analysis_type?: 'model' | 'news' | 'trend' | 'tipster_copy' | 'gut'
  evidence_sources?: string[]           // enlaces o notas breves
  entry_style?: 'studied' | 'opportunistic' | 'recreational'
  market_expectation?: 'odds_down' | 'odds_up' | 'result_only'
  invalidation_triggers?: string[]
  reasoning_quality_score?: number
  
  // Aprendizaje Post-Partido
  reflection_post?: string
  reflection_type?: 'as_expected' | 'good_read_variance' | 'analysis_error' | 'insufficient_info' | 'other'
  learning_score?: number               // 0–100 derivado
  
  // Perfiles y consistencia
  behavior_consistency_score?: number
  execution_skill_score?: number
  specialization_score?: number
  
  // Validación de mercado (crítico para integridad)
  market_source: string              // 'bet365' | 'pinnacle' | 'cloudbet' | 'manual'
  market_snapshot_id?: string       // ID del snapshot de mercado en tiempo real
  odds_verified: boolean             // true si la cuota fue verificada contra feed
  verification_status: 'pending' | 'verified' | 'mismatch' | 'unverifiable'
  verification_timestamp?: timestamp // cuando se verificó
  verification_diff?: number          // diferencia detectada (ej: +0.15)
  
  // Predicción
  prediction_registered_at: timestamp // nuevo: momento de la predicción
  prediction_locked: boolean          // nuevo: true al iniciar el partido
  
  // Ejecución
  executed: boolean
  execution_type: 'none' | 'manual' | 'agent' | 'external_api' // nuevo
  executed_at?: timestamp
  stake_declared_before_event?: number // stake declarado ANTES del evento (protección anti-manipulación)
  stake_planned?: number             // plan sugerido
  stake?: number                     // stake real ejecutado
  stake_modified_after_event: boolean // true si se cambió stake después del evento
  odds_final?: number                // puede cambiar de odds_at_pick
  skipped_reason?: string            // nuevo: por qué se omitió
  
  // Resultado
  status: 'pending' | 'win' | 'loss' | 'void' | 'cancelled'
  profit?: number
  resolved_at?: timestamp
  
  // Reglas anti-trampa
  immutable_since?: timestamp        // nuevo: fecha a partir de la cual no se puede editar
  editable: boolean                  // derivado: true/false
  deletable: boolean                 // derivado: true/false
  
  // Privacidad
  is_public: boolean               // por defecto FALSE
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
}

> **Nota UX importante:** Al crear pick, las 4 preguntas del Professional Feedback se muestran como selecciones rápidas (chips) + texto opcional. Flujo núcleo ≤ 5 segundos.

> **Regla Anti-Manipulación CRÍTICA:** 
> - `prediction_registered_at` debe ser `< start_time - 2 minutos` (tolerancia anti-backfilling)
> - `market_source` obligatorio para picks verificables
> - `stake_declared_before_event` debe registrarse ANTES del evento
> - Cuando `start_time <= now`, `prediction_locked = true`, `editable = false`, `deletable = false`, y `stake_modified_after_event = true` si se intenta cambiar stake

> Si no se cumplen estas reglas, el pick se marca como `unverifiable` y NO entra en rankings ni detección de tipsters.

### 9.2.b. TradeIntent (contrato de exportación)

```typescript
{
  id: string
  user_id: string
  source: 'watchlist_pick'
  pick_id: string
  market: string
  selection: string
  odds_snapshot: number
  stake_planned: number
  broker: 'cloudbet' | 'other'
  execution_status: 'pending' | 'sent' | 'confirmed' | 'rejected'
  external_ticket_id?: string
  created_at: timestamp
  updated_at: timestamp
}
```

> Flujo: Watchlist → TradeIntent → Agents/Execution Engine → Broker. La watchlist no envía directamente al broker.

### 9.2.c. EventCalendar (agenda operativa)

```typescript
{
  user_id: string
  date: string // YYYY-MM-DD
  picks_programados_hoy: number
  partidos_watchlist_hoy: number
  picks_sin_resolver: number
  picks_pendientes_de_marcar_ejecutados: number
  items: Array<{
    ref_type: 'match' | 'team' | 'league' | 'user_pick'
    ref_id: string
    title: string
    start_time?: timestamp
    status: 'scheduled' | 'pending' | 'in_progress' | 'resolved'
  }>
}
```

### 9.3. UserPickStats (Métricas Agregadas)

```typescript
{
  user_id: string
  total_picks: number
  total_executed: number
  total_skipped: number
  execution_discipline_ratio: number // executed / predicted
  avg_clv: number
  avg_information_score?: number
  avg_reasoning_quality_score?: number
  behavior_consistency_score?: number
  execution_skill_score?: number
  specialization_score?: number
  selective_execution_bias?: number   // 0-100: penalización por ejecución selectiva (alto = sesgado)
  verified_picks_ratio?: number        // picks verificados / total picks
  dominant_market?: string
  dominant_league?: string
  trader_profile_summary?: string  // ej: "Especialista en Over/Under ligas sudamericanas pre-match con alta consistencia temporal y buena ejecución"
  
  // Resultados
  wins: number
  losses: number
  voids: number
  win_rate: number
  
  // Financiero
  total_staked: number
  total_profit: number
  roi: number
  avg_odds: number
  
  // Exposure & Risk Management
  pending_picks: number              // picks pendientes
  total_exposure: number             // suma de stakes pendientes
  available_bankroll: number        // bankroll - exposure
  max_concurrent_picks: number       // límite sugerido (ej: 5)
  
  // Confidence Calibration (interno)
  calibration_score?: number         // 0-100: qué tan bien predice su confianza
  calibration_error?: number          // error absoluto promedio
  overconfidence_bias?: number       // declared - actual (positivo = sobreconfiado)
  
  // Rachas
  current_streak: number           // positivo = wins, negativo = losses
  best_win_streak: number
  worst_loss_streak: number
  
  // Por categoría
  best_sport?: string
  best_league?: string
  best_market?: string
  
  // Últimos 10
  last_10_results: boolean[]       // [true, false, true, ...]
  last_10_roi: number
  
  // Flags internos (admin)
  consecutive_wins: number
  eligible_for_tipster: boolean
  tipster_invite_sent: boolean
  tipster_invite_sent_at?: timestamp
  
  // Timestamps
  first_pick_at: timestamp
  last_pick_at: timestamp
  updated_at: timestamp
}
```

### 9.4. TipsterCandidate (Admin Only - Interno)

```typescript
{
  id: string
  user_id: string
  username: string
  email: string
  
  // Métricas de detección
  detection_reason: 'AUTO_DETECTED' | 'MANUAL_FLAG' | 'USER_REQUEST'
  detected_at: timestamp
  
  // Stats relevantes
  total_picks: number
  consecutive_wins: number
  roi_30d: number
  win_rate: number
  avg_odds: number
  consistency_score: number        // 0-100 (basado en volatilidad)
  
  // Especialización
  best_sport: string
  best_league: string
  best_market: string
  
  // Estado del proceso
  review_status: 'pending' | 'approved' | 'rejected' | 'invited'
  reviewed_by?: string             // admin_id
  reviewed_at?: timestamp
  
  // Invitación
  invite_sent: boolean
  invite_sent_at?: timestamp
  invite_accepted?: boolean
  invite_accepted_at?: timestamp
  
  // Notas admin
  admin_notes?: string
  
  created_at: timestamp
  updated_at: timestamp
}
```

---

## 11. Behavioral Guidance Layer (Sistema de Guía Conductual)

> **Objetivo:** Convertir conducta caótica en disciplina operativa sin que el usuario lo perciba como evaluación.

### 11.1. Sistema de Especialización ("Modo Enfoque")

**Problema que resuelve:** Usuario opera 20 ligas y 15 mercados → datos ruido puro.

**Trigger conductual:** Después de 30 picks, el sistema detecta:
- `mercado_dominante`: mercado con mejor CLV + ROI
- `liga_dominante`: liga con mayor consistencia temporal
- `horario_dominante`: franja horaria con más picks

**Intervención suave (no bloqueante):**
```
💡 Tus mejores resultados están en Over/Under pre-match (Franja 18-22h).
Los traders profesionales dominan primero un mercado antes de expandirse.

[Usar como mercado principal] [Seguir explorando]
```

**Efecto al aceptar:**
- Resalta eventos del mercado/liga en UI
- Sugiere picks cuando detecta value en ese foco
- Alerta suave al operar fuera: "¿Nueva oportunidad o distracción?"
- No impide operar otros mercados → solo guía

**Métrica interna:** `specialization_adoption_rate` (cuántos usuarios aceptan el enfoque)

### 11.2. Sistema de Control de Impulsividad ("Diario Operativo")

**Problema que resuelve:** Over-trading y decisiones emocionales.

**Triggers conductuales:**
```javascript
const alerts = {
  daily_picks: picks_today > 8,
  multi_league: unique_leagues_today > 4,
  stake_variance: std_dev(stakes_last_10) > mean(stakes_last_10) * 0.6,
  late_night: picks_after_23h > 2,
  chase_losses: picks_after_3_losses_streak
}
```

**Intervenciones (timing crítico):**

**Antes de crear pick:**
```
⚠️ Has registrado 6 picks hoy. 
Los traders rentables priorizan calidad sobre cantidad.

[Reflexionar 10s] [Soy consciente] [Cancelar]
```

**Durante sesión:**
```
📊 Estás operando 5 ligas distintas hoy.
La consistencia aparece al dominar 1-2 primero.

[Entendido] [Ver mi especialización]
```

**Post-sesión (resumen):**
```
🎯 Resumen de hoy: 4 picks • 3 ligas • ROI +2.3%
Sugerencia: Tus picks de Over/Under tuvieron CLV +3.2%

[Ver análisis] [Ajustar enfoque]
```

**Regla de oro:** Nunca bloquear → solo hacer visible la conducta.

### 11.3. Sistema de Aprendizaje Post-Partido ("Reflexión Guiada")

**Problema que resuelve:** Usuario no aprende de resultados → no mejora.

**Trigger:** Pick resuelto (win/loss/void)

**Micro-reflexión (3 clicks máximo):**

**Pregunta 1:** "¿Cómo fue tu análisis vs el partido real?"
- El partido transcurrió como esperaba
- La lectura fue correcta pero hubo varianza
- Me equivoqué en el análisis
- No revisé suficiente información

**Pregunta 2 (si "varianza" o "error"):** "¿Qué señal te hubiera hevo dudar?"
- Cambio de alineación
- Clima / campo
- Ritmo del partido
- Movimiento de cuotas

**Pregunta 3:** "¿Repetirías este pick con la misma info?"
- Sí, proceso correcto
- Sí, pero con menos stake
- No, esperaría más info
- No, proceso erróneo

**Procesamiento interno:**
```typescript
interface PostMatchReflection {
  pick_id: string
  analysis_accuracy: 'correct' | 'variance' | 'error' | 'incomplete'
  missed_signals?: string[]
  would_repeat: 'yes_same' | 'yes_less' | 'no_wait' | 'no_wrong'
  learning_score: number // 0-100 (auto-calculado)
  reflection_quality: 'superficial' | 'medium' | 'deep' // según respuestas
}
```

**Valor para IA:**
- Separa mala suerte vs mala lectura
- Identifica patrones de error por usuario
- Alimenta modelo de predicción de calidad futura
- Detecta usuarios con capacidad de auto-análisis (futuros tipsters)

### 11.4. Perfiles de Ejecución (Analista vs Ejecutor)

**Nuevo eje de análisis:** Separar habilidades

**Analista (predicción):**
- CLV consistente
- Raz razonamiento alta
- Acierto en expectativa de mercado
- Buena reflexión post-partido

**Ejecutor (timing):**
- Poca diferencia odds_at_pick vs odds_final
- Stake consistente con plan
- Pocos skips por miedo
- Buen timing de entrada

**Ejemplo real:**
```
Usuario A: CLV +2.8% • Execution -1.5% → Perfil: Analista puro
Usuario B: CLV -0.5% • Execution +1.2% → Perfil: Ejecutor disciplinado
```

**Aplicación:**
- Analistas → Futuros tipsters (generan señales)
- Ejecutores → Copy traders profesionales (siguen señales)
- Ambos → Traders completos (generan y ejecutan)

### 11.5. Consistencia Temporal del Comportamiento

**Métrica clave:** `behavior_consistency_score`

**Factores (últimos 30 días):**
```typescript
const consistency_factors = {
  time_variance: std_dev(hour_of_day_picks), // horario similar
  stake_variance: coefficient_variation(stakes),
  market_variance: entropy(market_distribution), // concentración
  league_variance: entropy(league_distribution),
  day_variance: picks_per_day_std_dev
}
```

**Interpretación:**
- Score 80-100: Comportamiento institucional → Alto potencial tipster
- Score 40-79: Patrones emergentes → Necesita guía
- Score 0-39: Comportamiento caótico → Requiere intervención

**Intervención según score:**
- Alto: Ofrecer programa de tipster
- Medio: Sugerir especialización
- Bajo: Activar más nudges conductuales

### 11.6. Principios de Diseño de la Capa Conductual

1. **No evaluar → Guiar:** Lenguaje de mejora, no juicio
2. **Timing perfecto:** Intervenir en momento de decisión
3. **Opción de salida:** Siempre permitir "ignorar"
4. **Progresivo:** Desbloquear funciones con uso responsable
5. **Personalizado:** Basado en datos del usuario, no genérico
6. **Invisible:** Sentirse como ayuda, no control

**Ejemplo de micro-copy:**
```
❌ Mal: "Has fallado 5 picks seguidos → Debes parar"
✅ Bien: "5 picks con resultado negativo. ¿Momento para revisar tu proceso?"
```

### 11.7. Impacto en Detección de Tipsters

**Nuevo orden de prioridades para detección:**
1. **Behavior Consistency Score** (80+ puntos)
2. **CLV sostenido** (30+ picks)
3. **Post-match reflection quality** (medium/deep)
4. **Specialization adoption** (mercado/liga dominante)
5. **Execution discipline** (ratio ejecutadas/predichas)
6. **ROI/Win Rate** (secundario)

**Resultado:** Detectarás usuarios que:
- Operan como instituciones (no como apuestas)
- Aprenden activamente de errores
- Tienen proceso replicable
- Generan valor real (CLV + consistencia)

> **Nota clave:** Esta capa conductual es la diferencia entre una app que registra apuestas vs una plataforma que **crea traders profesionales**. Los datos que generes aquí serán más valiosos que cualquier modelo predictivo externo.

---

## 12. Endpoints API

### 10.1. Watchlist Items (Monitoreo)

```
GET    /watchlist
       ?type=match|team|league
       &mode=PRE|LIVE
       &priority=high|normal|low
       &status=active|pinned

POST   /watchlist
       Body: { type, ref_id, priority, tags, ... }

PATCH  /watchlist/:id
       Body: { priority?, tags?, notes?, status? }

DELETE /watchlist/:id

POST   /watchlist/:id/pin
POST   /watchlist/:id/mute
POST   /watchlist/:id/unmute
```

### 10.2. User Picks (Selecciones Propias)

```
GET    /watchlist/my-picks
       ?status=pending|resolved
       &sport=soccer|basketball
       &executed=true|false
       &execution_type=none|manual|agent|external_api
       &prediction_locked=true|false

POST   /watchlist/my-picks
       Body: {
         match_id,
         market,
         selection,
         odds_at_pick,
         confidence,
         reasoning?,
         analysis_type?,
         entry_style?,                // 'studied'|'opportunistic'|'recreational'
         market_expectation?,         // 'odds_down'|'odds_up'|'result_only'
         invalidation_triggers?       // ['early_goal','lineup_change','market_shift','match_rhythm']
       }
       → Registra predicción, fija `prediction_registered_at` y calcula `reasoning_quality_score`.

PATCH  /watchlist/my-picks/:id
       Body: { confidence?, reasoning?, analysis_type?, entry_style?, market_expectation?, invalidation_triggers? }
       → 403 si `prediction_locked = true` (inmutable).

POST   /watchlist/my-picks/:id/execute
       Body: { stake, odds_final, execution_type }

POST   /watchlist/my-picks/:id/skip
       Body: { reason }
       → Marca `skipped_reason` y no ejecutado.

POST   /watchlist/my-picks/:id/export-intent
       Body: { stake_planned, broker }
       → Crea `TradeIntent` y pasa a Agents/Execution Engine.

POST   /watchlist/my-picks/:id/resolve
       Body: { status: 'win'|'loss'|'void' }

POST   /watchlist/my-picks/:id/post-reflection
       Body: {
         analysis_accuracy: 'correct'|'variance'|'error'|'incomplete',
         missed_signals?: string[],
         would_repeat: 'yes_same'|'yes_less'|'no_wait'|'no_wrong'
       }
       → Crea PostMatchReflection y actualiza learning_score

DELETE /watchlist/my-picks/:id
       → 403 si `prediction_locked = true`.
```

### 10.3. Stats & Rankings (Usuario)

```
GET    /watchlist/my-stats
       Response: UserPickStats

GET    /watchlist/my-performance
       ?period=7d|30d|all
       Response: {
         win_rate,
         roi,
         total_picks,
         by_sport: {...},
         by_league: {...}
       }
```

### 10.4. Admin Endpoints (Interno)

```
GET    /admin/tipster-candidates
       ?review_status=pending|approved
       &min_consecutive_wins=10
       &min_roi=10

GET    /admin/tipster-candidates/:user_id
       Response: TipsterCandidate + full stats

POST   /admin/tipster-candidates/:user_id/review
       Body: {
         review_status: 'approved' | 'rejected',
         admin_notes?
       }

POST   /admin/tipster-candidates/:user_id/invite
       Body: { message }
       → Envía email/notificación al usuario

### 10.5. Behavioral Guidance (Nudges Conductuales)

GET    /watchlist/behavioral-insights
       Response: {
         specialization_suggestion?: {
           market: string,
           league: string,
           performance: number,
           message: string
         },
         overtrading_alerts: string[],
         consistency_score: number,
         behavior_patterns: {
           best_trading_hours: number[],
           preferred_markets: string[],
           stake_variance: number
         }
       }

POST   /watchlist/specialization/accept
       Body: { market: string, league: string }
       → Activa "Modo Enfoque" para ese usuario

POST   /watchlist/nudges/dismiss
       Body: { nudge_id: string, reason?: string }
       → Usuario ignora un nudge conductual

### 10.6. Post-Match Reflection System

GET    /watchlist/my-picks/:id/reflection-prompt
       Response: {
         show_reflection: boolean,
         questions: Array<{
           question: string,
           options: string[],
           type: 'single'|'multiple'|'text'
         }>
       }

POST   /watchlist/my-picks/:id/reflection
       Body: PostMatchReflection (ver §11.3)
       → Actualiza learning_score y behavior_consistency_score
```

### 10.7. Telemetría y Eventos

```typescript
// Eventos de Behavioral Guidance Layer
interface BehavioralEvent {
  event: 'specialization_suggested' | 'specialization_accepted' | 'overtrading_alert_shown' | 'nudge_dismissed' | 'reflection_completed'
  user_id: string
  context: {
    market?: string
    league?: string
    alert_type?: string
    reflection_quality?: 'superficial' | 'medium' | 'deep'
    consistency_score?: number
  }
  timestamp: timestamp
}

// Eventos de creación y ejecución
interface PickEvent {
  event: 'pick_created' | 'pick_executed' | 'pick_skipped' | 'pick_resolved' | 'reflection_prompt_shown'
  user_id: string
  pick_id: string
  properties: {
    market: string
    league: string
    odds: number
    stake?: number
    confidence: number
    execution_type?: string
    reflection_completed?: boolean
  }
  timestamp: timestamp
}
```

**Eventos críticos para IA:**
- `specialization_accepted`: Usuario adopta enfoque profesional
- `reflection_completed`: Usuario completa auto-análisis post-partido
- `overtrading_alert_dismissed`: Usuario ignora alerta (patrón de riesgo)
- `pick_created_after_alert`: Usuario crea pick tras ignorar alerta
- `consistency_score_increased`: Mejora conductual detectada

---

## 11. Lógica de Detección de Tipsters

### 11.1. Cron Job Diario

```javascript
// Ejecutar cada día a las 00:00 UTC
async function detectPotentialTipsters() {
  const users = await getUsersWithMinimumPicks(25)
  
  for (const user of users) {
    const stats = await getUserPickStats(user.id)
    const clvWindow = await getAvgCLV(user.id, { period: '30d' })
    const distributionOK = await checkTemporalDistribution(user.id, { min_days: 21 })
    const specializationOK = await checkSpecialization(user.id, { min_picks_per_market: 25 })
    const disciplineOK = (stats.execution_discipline_ratio >= 0.6)
    
    // Nuevos criterios profesionales: consistencia primero
    const behaviorConsistencyOK = stats.behavior_consistency_score >= 70
    const learningQualityOK = stats.avg_reasoning_quality_score >= 60
    const executionSkillOK = stats.execution_skill_score >= 65
    
    // Criterios profesionales actualizados (prioridad: 1) Consistencia, 2) CLV, 3) Reflexión)
    if (
      stats.total_picks >= 50 &&
      behaviorConsistencyOK &&
      clvWindow > 0 &&
      learningQualityOK &&
      distributionOK &&
      specializationOK &&
      disciplineOK &&
      executionSkillOK &&
      !stats.tipster_invite_sent
    ) {
      await createTipsterCandidate({
        user_id: user.id,
        detection_reason: 'AUTO_DETECTED',
        metrics: { 
          ...stats, 
          avg_clv: clvWindow,
          behavior_consistency_score: stats.behavior_consistency_score,
          avg_reasoning_quality_score: stats.avg_reasoning_quality_score,
          execution_skill_score: stats.execution_skill_score
        }
      })
      await notifyAdmin('NEW_TIPSTER_CANDIDATE', {
        user_id: user.id,
        username: user.username,
        stats: { 
          ...stats, 
          avg_clv: clvWindow,
          behavior_consistency_score: stats.behavior_consistency_score,
          avg_reasoning_quality_score: stats.avg_reasoning_quality_score,
          execution_skill_score: stats.execution_skill_score
        }
      })
    }
  }
}
```

### 11.2. Dashboard Admin

**Vista de candidatos:**

| Usuario | Picks | Racha | ROI 30d | Win Rate | Estado | Acciones |
|---------|-------|-------|---------|----------|--------|----------|
| user123 | 42 | 12W | 18.5% | 62% | Pending | [Revisar] [Invitar] |
| user456 | 35 | 10W | 12.3% | 58% | Approved | [Ver perfil] |

**Filtros:**
- Min consecutive wins
- Min ROI
- Min win rate
- Review status

---

## 12. Eventos y Telemetría

### 12.1. Eventos de Usuario

```javascript
// Monitoreo
'watchlist_item_added'
'watchlist_item_removed'
'watchlist_item_pinned'
'watchlist_open_signals'
'watchlist_open_trader_master'
'watchlist_priority_changed'

// Picks propios
'user_pick_created'
'user_pick_executed'
'user_pick_resolved'
'user_pick_edited'
'user_pick_deleted'

// Navegación
'watchlist_tab_switched'      // monitoreo / my-picks / resolved
'watchlist_filter_applied'
```

### 12.2. Eventos Admin (Internos)

```javascript
'tipster_candidate_detected'
'tipster_candidate_reviewed'
'tipster_invite_sent'
'tipster_invite_accepted'
'tipster_invite_rejected'
'professional_feedback_answered'
'professional_feedback_skipped'
'market_expectation_set'
'invalidation_trigger_defined'
```

---

## 13. Privacidad y Seguridad

### 13.1. Datos Privados por Defecto

**IMPORTANTE:** Los picks del usuario son **PRIVADOS** por defecto.

```javascript
UserPick.is_public = false  // SIEMPRE por defecto
```

**Solo se vuelven públicos si:**
1. Usuario acepta invitación de tipster
2. Pasa proceso de verificación
3. Usuario activa explícitamente "picks públicos"

### 13.2. Ranking NO Público

**El ranking de top performers es SOLO para admin.**

Usuarios NO ven:
- Quién más tiene buenas rachas
- Quién está siendo considerado para tipster
- Stats de otros usuarios sin su permiso

Usuarios SÍ ven:
- Sus propias stats
- Su propio historial
- Su progreso personal

### 13.3. Proceso de Invitación

```
1. Sistema detecta → TipsterCandidate (PRIVADO)
2. Admin revisa → Aprueba/Rechaza (INTERNO)
3. Admin invita → Email personalizado (PRIVADO)
4. Usuario responde → Acepta/Rechaza
5. Si acepta → Verificación adicional
6. Si verificado → Opción de hacer picks públicos
```

---

## 14. Notificaciones y Alertas

### 14.1. Alertas de Watchlist

**Para items de monitoreo:**

| Trigger | Notificación | Configuración |
|---------|--------------|---------------|
| 15 min antes | "Real Madrid vs Barcelona empieza en 15 min" | On/Off |
| Al iniciar | "¡Partido iniciado! Ver señales LIVE" | On/Off |
| Minuto 60 | "Segundo tiempo - Revisa mercados" | On/Off |
| Nueva señal | "Nueva señal HIGH para Real Madrid" | On/Off |

**Para picks propios:**

| Trigger | Notificación |
|---------|--------------|
| Pick cercano | "Tu pick de Real Madrid ML empieza en 1h" |
| Partido iniciado | "¡Partido iniciado! Marca tu pick como ejecutado" |
| Resultado disponible | "Resuelve tu pick: Real Madrid ganó 2-1" |

### 14.2. Alertas Admin

```
Nueva candidatura de tipster:
"user123 alcanzó 12 victorias consecutivas con ROI 18%"

Candidato cumple criterios VIP:
"user456 tiene 50+ picks, 65% win rate, especialista en O/U"
```

---

## 15. Integración con Bankroll

### 15.1. Flujo de Ejecución

```
1. Usuario crea pick en Watchlist
   → UserPick { executed: false }

2. Usuario decide ejecutar
   → Abre modal: "Marcar como ejecutado"
   → Input: Stake, Odds finales

3. Sistema registra en Bankroll Ledger
   → BankrollLedger.entry {
       source: 'watchlist_pick',
       ref_id: user_pick_id,
       planned_stake: X,
       actual_stake: X,
       odds: X
     }

4. Al resolver el partido
   → Usuario marca resultado
   → UserPick.status = 'win' | 'loss'
   → Bankroll se actualiza con P&L
   → Stats del usuario se recalculan
```

### 15.2. Validaciones

**Antes de marcar como ejecutado:**
- Validar que bankroll tenga fondos suficientes
- Validar que odds sean razonables (>1.01)
- Validar que partido no haya iniciado (si PRE)

**Al resolver:**
- Validar que partido haya finalizado
- Cross-check con resultado oficial
- Actualizar peak balance si aplica

---

## 16. Métricas de Producto

### 16.1. KPIs de Watchlist

- % usuarios con ≥1 item en watchlist
- Avg items por usuario
- % usuarios con ≥1 pick propio
- % picks ejecutados vs solo registrados
- Retention de usuarios con picks activos

### 16.2. KPIs de Detección

- Candidatos detectados por semana
- % candidatos aprobados
- % invitaciones aceptadas
- Tiempo promedio desde detección → invitación
- Conversión a tipster verificado

---

## 17. Roadmap

### Fase 1 (MVP)
- [x] Watchlist items básicos (match, team, league)
- [x] User picks con tracking
- [x] Stats básicas (win rate, ROI)
- [x] Detección automática de candidatos
- [ ] Panel admin de candidatos

### Fase 2
- [ ] Alertas configurables
- [ ] Integración completa con Bankroll
- [ ] Tags personalizados
- [ ] Recordatorios avanzados
- [ ] Export de stats

### Fase 3
- [ ] Proceso completo de verificación de tipsters
- [ ] Sistema de reputación interna
- [ ] Análisis predictivo de potencial
- [ ] Recomendación de mejora (ML)
- [ ] Gamificación de rachas

### Fase 4
- [ ] Comunidad privada de top performers
- [ ] Comparación anónima con peers
- [ ] Competencias internas
- [ ] Badges y logros

---

## 18. Casos de Uso

### 18.1. Usuario Casual (Monitoreo)

```
1. Usuario agrega "Real Madrid" a watchlist
2. Activa alertas 15min antes
3. Recibe notificación antes del partido
4. Ve señales filtradas de Real Madrid
5. Decide ejecutar vía Trader Master
```

### 18.2. Usuario Activo (Tracking Personal)

```
1. Usuario cree que Liverpool ganará
2. Crea pick: "Liverpool ML @1.75"
3. Añade confianza 80% y razonamiento
4. Marca como ejecutado con stake $25
5. Liverpool gana → resuelve pick
6. Stats actualizadas: 8 victorias consecutivas
7. Sistema lo detecta como candidato
```

### 18.3. Admin (Detección de Tipster)

```
1. Admin revisa dashboard de candidatos
2. Ve user456: 15W consecutivas, 20% ROI
3. Revisa historial detallado de picks
4. Aprueba candidato
5. Envía invitación personalizada
6. Usuario acepta
7. Inicia proceso de verificación
```

---

## 19. Notas de Seguridad

### 19.1. Prevención de Fraude

**Para evitar manipulación de stats:**

- Timestamp inmutable en picks (no editable)
- Odds_at_pick guardadas al crear (no editables)
- Historial de cambios en auditoría
- Validación de resultados contra fuente oficial
- Cooldown entre picks del mismo evento

### 19.2. Rate Limiting

```javascript
// Límites por usuario
```

---

## 20. Protecciones Operativas Anti-Manipulación

> **CRÍTICO:** Sin estas protecciones, tu plataforma será un casino de datos falsos. Estas reglas son no negociables.

### 20.1. Validación de Mercado (Anti-Fraude de Cuotas)

**Problema:** Usuario registra "Over 2.5 @2.40" cuando el mercado real está @1.80 → parece un genio → la IA aprende basura.

**Solución - Pick Verificable:**

```typescript
interface MarketVerification {
  market_source: 'bet365' | 'pinnacle' | 'cloudbet' | 'manual'
  market_snapshot_id?: string        // ID del snapshot en tiempo real
  odds_at_pick: number                // registrada por usuario
  odds_verified: boolean              // true si verificada contra feed
  verification_status: 'pending' | 'verified' | 'mismatch' | 'unverifiable'
  verification_timestamp?: timestamp  // cuando se verificó
  verification_diff?: number          // diferencia detectada (ej: +0.15)
  
  // Si hay mismatch significativo
  mismatch_threshold?: number        // umbral de tolerancia (±0.10)
  is_significant_mismatch: boolean   // true si diff > threshold
}
```

**Proceso de Verificación:**
```javascript
async function verifyMarketPick(pick: UserPick) {
  // 1. Obtener cuota real del feed en prediction_registered_at
  const realOdds = await getMarketOdds({
    match_id: pick.match_id,
    market: pick.market,
    selection: pick.selection,
    timestamp: pick.prediction_registered_at
  })
  
  // 2. Comparar con tolerancia
  const diff = Math.abs(pick.odds_at_pick - realOdds)
  const threshold = 0.10 // ±10 centavos de tolerancia
  
  // 3. Actualizar estado
  pick.odds_verified = true
  pick.verification_timestamp = now()
  pick.verification_diff = diff
  pick.verification_status = diff <= threshold ? 'verified' : 'mismatch'
  pick.is_significant_mismatch = diff > threshold
  
  // 4. Penalización por fraude
  if (diff > 0.30) { // 30+ centavos = sospecha de fraude
    await flagUserForReview(pick.user_id, 'SUSPICIOUS_ODDS_MANIPULATION')
  }
}
```

**Reglas de Negocio:**
- ✅ Picks `verified` entran en rankings y detección de tipsters
- ⚠️ Picks `mismatch` se marcan pero siguen visibles
- ❌ Picks `unverifiable` NO entran en ningún ranking
- 🔍 Mismatches > 0.30 trigger revisión manual

### 20.2. Control Anti-Backfilling (Tiempo)

**Problema:** Usuario ve partido en minuto 70 → registra pick como si lo hubiera hecho antes → manipula estadísticas.

**Solución - Regla Temporal Dura:**

```javascript
// Regla NO negociable
const ANTI_BACKFILLING_TOLERANCE = 2 * 60 * 1000 // 2 minutos

function validatePickTiming(pick: UserPick, match: Match) {
  const timeDiff = match.start_time - pick.prediction_registered_at
  
  if (timeDiff < ANTI_BACKFILLING_TOLERANCE) {
    // Pick registrado muy cerca del inicio → sospechoso
    pick.verification_status = 'unverifiable'
    pick.flags = ['BACKFILLING_RISK']
    
    // Notificar al usuario
    await notifyUser(pick.user_id, 'PICK_TOO_CLOSE_TO_START', {
      message: "Pick registrado muy cerca del inicio. No será considerado para rankings."
    })
    
    return false
  }
  
  return true
}
```

**Proceso de Detección:**
```javascript
// Cron job cada 5 minutos
async function detectBackfillingAttempts() {
  const recentPicks = await getRecentPicks({ last_hours: 2 })
  
  for (const pick of recentPicks) {
    const match = await getMatch(pick.match_id)
    
    // Si el pick fue registrado DESPUÉS del inicio → fraude obvio
    if (pick.prediction_registered_at > match.start_time) {
      await flagPickAsFraudulent(pick, 'POST_START_REGISTRATION')
      continue
    }
    
    // Si fue registrado en los últimos 2 minutos → sospechoso
    const timeDiff = match.start_time - pick.prediction_registered_at
    if (timeDiff < ANTI_BACKFILLING_TOLERANCE) {
      await flagPickAsUnverifiable(pick, 'BACKFILLING_RISK')
    }
  }
}
```

### 20.3. Control de Stake Anti-Manipulación

**Problema:** Usuario pierde → registra stake bajo. Gana → registra stake alto. Parece rentable cuando no lo es.

**Solución - Declaración Previa Inmutable:**

```typescript
interface StakeProtection {
  stake_declared_before_event?: number  // declarado ANTES del evento
  stake_actual?: number                  // real ejecutado
  stake_modified_after_event: boolean    // true si se cambió después
  modification_history: Array<{
    timestamp: timestamp
    old_stake: number
    new_stake: number
    reason?: string
  }>
}
```

**Reglas de Stake:**
```javascript
// Al crear pick (opcional pero recomendado)
async function createPick(data) {
  const pick = {
    ...data,
    stake_declared_before_event: data.stake_planned, // capturar intención
    stake_modified_after_event: false
  }
}

// Al ejecutar pick
async function executePick(pickId, stake, odds) {
  const pick = await getPick(pickId)
  const match = await getMatch(pick.match_id)
  
  // Si el partido ya empezó → bloquear cambios de stake
  if (now() > match.start_time) {
    if (stake !== pick.stake_declared_before_event) {
      pick.stake_modified_after_event = true
      pick.flags = ['STAKE_MODIFIED_POST_EVENT']
      
      // Penalización en métricas
      await updateUserIntegrityScore(pick.user_id, -10)
    }
  }
  
  // Registrar historial de modificaciones
  if (stake !== pick.stake_declared_before_event) {
    pick.modification_history.push({
      timestamp: now(),
      old_stake: pick.stake_declared_before_event,
      new_stake: stake,
      reason: 'USER_MODIFICATION'
    })
  }
}
```

**Penalizaciones:**
- Stake modificado post-evento → -50% de peso en rankings
- Múltiples modificaciones → revisión manual
- Patrón sistemático → suspensión de rankings

### 20.4. Detección de Ejecución Selectiva (Bias Anti-Tipster)

**Problema:** Usuario solo ejecuta picks cuando se siente seguro → predicciones parecen malas, ejecuciones perfectas → false positive de tipster.

**Solución - Métrica de Sesgo de Ejecución:**

```typescript
interface SelectiveExecutionBias {
  selective_execution_score: number      // 0-100 (alto = muy selectivo)
  skipped_when_odds_worsened: number  // cuántas veces skippeó cuando empeoraron odds
  executed_when_odds_improved: number // cuántas veces ejecutó cuando mejoraron
  execution_consistency: number       // consistencia temporal de ejecución
}
```

**Cálculo del Sesgo:**
```javascript
async function calculateSelectiveExecutionBias(userId) {
  const picks = await getUserPicks(userId, { last_30_days: true })
  
  let skippedWorsened = 0
  let executedImproved = 0
  let totalSkips = 0
  let totalExecutions = 0
  
  for (const pick of picks) {
    const clv = pick.clv || 0
    
    if (pick.executed) {
      totalExecutions++
      if (clv > 0.1) executedImproved++ // ejecutó cuando mejoró
    } else {
      totalSkips++
      if (clv < -0.1) skippedWorsened++ // skippeó cuando empeoró
    }
  }
  
  // Calcular scores
  const skipBias = totalSkips > 0 ? skippedWorsened / totalSkips : 0
  const executionBias = totalExecutions > 0 ? executedImproved / totalExecutions : 0
  
  // Score de 0-100 (mayor = más sesgado)
  const selectiveExecutionScore = Math.round((skipBias + executionBias) * 50)
  
  return {
    selective_execution_score: selectiveExecutionScore,
    skipped_when_odds_worsened: skippedWorsened,
    executed_when_odds_improved: executedImproved,
    execution_consistency: await getExecutionConsistency(userId)
  }
}
```

**Interpretación:**
- Score 0-20: Ejecución consistente → Candidato real a tipster
- Score 21-50: Ligero sesgo → Necesita más datos
- Score 51-80: Sesgo significativo → No apto para tipster
- Score 81-100: Sesgo extremo → Posible manipulación

### 20.5. Sistema de Integridad de Usuario

**Score Global de Integridad:**
```typescript
interface UserIntegrityScore {
  user_id: string
  overall_score: number        // 0-100 (promedio ponderado)
  
  // Sub-scores
  market_verification_score: number    // cuán verificables son sus picks
  timing_compliance_score: number      // anti-backfilling
  stake_consistency_score: number      // anti-manipulación de stake
  execution_bias_score: number        // anti-selección
  
  // Flags
  has_significant_mismatches: boolean
  has_modified_stakes: boolean
  has_selective_execution: boolean
  has_backfilling_attempts: boolean
  
  // Historial
  violations: Array<{
    type: string
    severity: 'low' | 'medium' | 'high'
    timestamp: timestamp
    pick_id?: string
  }>
}
```

**Reglas de Negocio:**
- Score < 60: Usuario NO apto para rankings públicos
- Score < 40: Usuario NO apto para detección de tipsters
- Score < 20: Revisión manual inmediata
- Múltiples violaciones altas → Suspendido de rankings

### 20.6. Training Dataset Schema (Para IA)

**Dataset principal de entrenamiento:**
```typescript
interface TrainingDatasetRow {
  // Identificadores
  user_id: string
  pick_id: string
  match_id: string
  
  // Features de mercado (X)
  market: string
  league: string
  sport: string
  odds_at_pick: number
  closing_odds: number
  clv: number
  market_volatility: number
  
  // Features de usuario (X)
  user_experience_months: number
  behavior_consistency_score: number
  specialization_score: number
  avg_reasoning_quality_score: number
  
  // Features temporales (X)
  hour_of_day: number
  day_of_week: number
  days_since_season_start: number
  
  // Target (y)
  pick_result: 'win' | 'loss' | 'void'
  clv_actual: number  // CLV real vs closing
  
  // Pesos de calidad
  data_quality_score: number      // basado en integridad del usuario
  verification_status: 'verified' | 'mismatch' | 'unverifiable'
  
  // Metadata
  timestamp: timestamp
  is_from_verified_user: boolean
}
```

**Criterios de inclusión:**
- Solo picks `verified` o `mismatch` leve (< 0.10)
- Usuarios con `integrity_score >= 40`
- Picks con `prediction_registered_at < start_time - 2min`
- Mínimo 30 picks por usuario (para estabilidad estadística)

**Exportación:**
```javascript
// Endpoint para data science
GET /admin/training-dataset
?min_data_quality=70
?user_integrity_min=40
?date_from=2024-01-01
?date_to=2024-12-31
&format=csv|json

Response: {
  total_rows: number
  avg_data_quality: number
  user_distribution: object
  download_url: string // URL temporal con datos
}
```

### 20.7. Resumen de Protecciones

| Protección | Problema | Solución | Penalización |
|------------|----------|----------|--------------|
| **Validación de Mercado** | Cuotas falsas | Feed comparison | No ranking si mismatch > 0.30 |
| **Anti-Backfilling** | Picks post-facto | Regla temporal 2min | Unverifiable si infringe |
| **Control de Stake** | Manipulación de stake | Declaración previa | -50% peso en rankings |
| **Anti-Selección** | Ejecución sesgada | Score de consistencia | No tipster si score > 50 |
| **Integridad Global** | Múltiples fraudes | Score compuesto | Suspendido si score < 40 |

> **Nota final:** Estas protecciones transforman tu plataforma de "app de apuestas" a "sistema institucional de trading". Sin ellas, mejor no tener datos que tener datos falsos.

---

## 21. Definiciones Técnicas Críticas (Anti-Error en Producción)

> **CRÍTICO:** Sin estas definiciones, tendrás disputas diarias y datos inconsistentes.

### 21.1. Autoridad de Resultados (Evita Disputas)

**Problema:** Usuario dice "gané", feed dice "void", broker dice "pérdida" → ¿Quién tiene la razón?

**Solución - Fuente Oficial Única:**

```typescript
interface ResultAuthority {
  result_source: 'primary_feed' | 'manual_admin' | 'broker_confirmation'
  result_verification_status: 'pending' | 'confirmed' | 'disputed'
  result_verified_at: timestamp
  result_authority_notes?: string  // por qué esta fuente es la oficial
  
  // En caso de disputa
  dispute_evidence?: Array<{
    source: string
    result: string
    timestamp: timestamp
    confidence: number
  }>
  final_authority_decision?: string
}
```

**Regla de Oro:**
```javascript
// SOLO resultados 'confirmed' afectan rankings y CLV
function canResultAffectRankings(pick: UserPick): boolean {
  return pick.result_verification_status === 'confirmed' &&
         ['primary_feed', 'broker_confirmation'].includes(pick.result_source)
}

// Proceso de confirmación
async function confirmResult(pick: UserPick) {
  const result = await getResultFromPrimaryFeed({
    match_id: pick.match_id,
    market: pick.market,
    selection: pick.selection
  })
  
  pick.result_source = 'primary_feed'
  pick.result_verification_status = 'confirmed'
  pick.result_verified_at = now()
  
  // Si hay discrepancia con resultado reportado por usuario
  if (result !== pick.user_reported_result) {
    await flagForManualReview(pick, 'RESULT_DISCREPANCY')
  }
}
```

**Jerarquía de Fuentes:**
1. `broker_confirmation` - Más confiable (cuenta real)
2. `primary_feed` - Feed oficial (Opta, StatsPerform)
3. `manual_admin` - Solo si las otras fallan

### 21.2. Manejo de Voids (Partidos Cancelados/Mercados Anulados)

**Problema:** Partido suspendido, VAR anula mercado, cambio de formato → ¿Cómo manejar el CLV?

**Solución - Sistema de Voids Estructurado:**

```typescript
interface VoidHandling {
  void_reason: 
    | 'match_cancelled'      // partido no se jugó
    | 'market_removed'       // casa quitó el mercado
    | 'odds_error'          // cuota claramente errónea
    | 'bookmaker_adjustment' // ajuste post-evento
    | 'var_intervention'    // VAR cambió resultado
    | 'abandonment'         // partido abandonado
  
  void_declared_at: timestamp
  void_authority: 'feed' | 'admin' | 'user_request'
  void_evidence?: string    // por qué se declaró void
  
  // Impacto en métricas
  affects_clv: boolean      // false para la mayoría
  affects_streaks: boolean   // true excepto errores de cuota
  affects_rankings: boolean  // false si void por error externo
}
```

**Regla de CLV:**
```javascript
// CLV NO se calcula en voids (destruye métricas)
function calculateCLV(pick: UserPick): number | null {
  if (pick.void_reason) {
    return null // No hay CLV en voids
  }
  
  return (pick.closing_odds - pick.odds_at_pick) / pick.odds_at_pick
}

// Proceso de void inteligente
async function handleVoid(pick: UserPick, reason: string) {
  pick.void_reason = reason
  pick.void_declared_at = now()
  pick.affects_clv = !['odds_error', 'bookmaker_adjustment'].includes(reason)
  pick.affects_streaks = reason !== 'odds_error'
  pick.affects_rankings = !['odds_error', 'bookmaker_adjustment'].includes(reason)
  
  // Notificar al usuario
  await notifyUser(pick.user_id, 'PICK_VOIDED', {
    reason: reason,
    refund_applied: true
  })
}
```

**Casos Comunes:**
- `match_cancelled` → Refund completo, no afecta métricas
- `market_removed` → Refund, no afecta CLV
- `var_intervention` → Afecta streaks pero no CLV
- `odds_error` → No afecta nada (error de la casa)

### 21.3. Protección Anti-Duplicados (Evita Manipulación)

**Problema:** Usuario crea 3 picks idénticos → ejecuta solo el ganador → parece genio.

**Solución - Deduplicación Inteligente:**

```typescript
interface DuplicateProtection {
  duplicate_pick_group_id: string  // mismo mercado + evento + selección
  duplicate_policy: 'allowed' | 'merged' | 'blocked'
  
  // Para análisis
  is_primary_in_group: boolean     // cual se mantiene para rankings
  duplicates_in_group: number      // cuántos hay en total
  group_execution_rate: number     // % ejecutados en el grupo
}
```

**Regla de Negocio:**
```javascript
// Máximo 1 pick por mercado por evento para rankings
async function enforceDuplicatePolicy(pick: UserPick) {
  const existingPicks = await getUserPicksForMarket({
    user_id: pick.user_id,
    match_id: pick.match_id,
    market: pick.market,
    selection: pick.selection
  })
  
  if (existingPicks.length > 0) {
    // Crear grupo de duplicados
    const groupId = `${pick.user_id}-${pick.match_id}-${pick.market}-${pick.selection}`
    pick.duplicate_pick_group_id = groupId
    pick.duplicate_policy = 'merged'
    
    // Solo el primero entra en rankings (evita manipulación)
    pick.is_primary_in_group = existingPicks.length === 0
    
    // Notificar sobre duplicado
    await notifyUser(pick.user_id, 'DUPLICATE_PICK_DETECTED', {
      message: "Este pick duplica uno existente. Solo el primero afectará rankings."
    })
  }
}
```

**Políticas:**
- `blocked` → No permite duplicados (más estricto)
- `merged` → Permite pero solo 1 cuenta para rankings
- `allowed` → Permite completo (no recomendado)

### 21.4. Definición de Cierre de Cuotas (CLV Consistente)

**Problema:** ¿Qué es "closing odds"? ¿Kickoff? ¿Última disponible? ¿Promedio ponderado?

**Solución - Definición Estándar:**

```typescript
interface ClosingOddsDefinition {
  closing_odds_source: 'pinnacle' | 'bet365' | 'weighted_average'
  closing_odds_timestamp: 'kickoff' | 'last_available_5min' | 'market_close'
  closing_odds_method: 'exact_time' | 'weighted_average' | 'median'
  
  // Metadata
  closing_line_capture_at: timestamp
  closing_line_confidence: number  // 0-100
  alternative_closing_lines?: Array<{
    source: string
    odds: number
    timestamp: timestamp
  }>
}
```

**Estándar de la Industria:**
```javascript
// Definición recomendada (más consistente)
const STANDARD_CLOSING_DEFINITION = {
  source: 'pinnacle',           // Más líquido y eficiente
  timestamp: 'kickoff',          // Momento del saque inicial
  method: 'exact_time',          // Cuota exacta a ese momento
  fallback_sources: ['bet365', 'weighted_average']
}

// Implementación
async function getClosingOdds(pick: UserPick): Promise<number> {
  const closingOdds = await getMarketOddsAtTime({
    match_id: pick.match_id,
    market: pick.market,
    selection: pick.selection,
    timestamp: pick.match_start_time, // kickoff
    source: 'pinnacle'
  })
  
  // Fallback si Pinnacle no tiene datos
  if (!closingOdds) {
    return await getWeightedAverageClosingOdds(pick)
  }
  
  return closingOdds
}
```

**Por qué Kickoff:**
- Momento más líquido del mercado
- Menos manipulación por información tardía
- Estándar en la industria de trading

### 21.5. Integración con Bankroll (Risk Management Real)

**Problema:** Watchlist ejecuta → Bankroll no sabe del riesgo → sobreexposición.

**Solución - Risk Guard Integration:**

```typescript
interface BankrollIntegration {
  stake_recommendation_source: 'bankroll_policy' | 'user_manual' | 'agent'
  recommended_stake?: number      // sugerido por política de bankroll
  actual_stake?: number          // lo que ejecutó el usuario
  
  // Violaciones de riesgo
  risk_violation: boolean
  risk_violation_type?: 
    | 'over_stake'        // excedió stake recomendado
    | 'daily_limit'       // superó límite diario
    | 'drawdown_limit'    // excedió drawdown máximo
    | 'var_limit'         // Value at Risk excedido
  
  // Contexto
  bankroll_at_execution: number
  risk_percentage: number        // % del bankroll en riesgo
  daily_exposure_at_execution: number
}
```

**Risk Guard Agent:**
```javascript
// Antes de permitir ejecución
async function validateRiskConstraints(pick: UserPick): Promise<boolean> {
  const bankroll = await getUserBankroll(pick.user_id)
  const riskProfile = await getUserRiskProfile(pick.user_id)
  
  // Calcular riesgo actual
  const currentExposure = await getDailyExposure(pick.user_id)
  const proposedExposure = currentExposure + (pick.stake || 0)
  
  // Validar límites
  if (proposedExposure > riskProfile.daily_limit) {
    pick.risk_violation = true
    pick.risk_violation_type = 'daily_limit'
    
    await blockPickExecution(pick, 'DAILY_LIMIT_EXCEEDED')
    return false
  }
  
  // Stake recomendado
  const recommendedStake = calculateKellyCriterion({
    bankroll: bankroll.balance,
    edge: pick.estimated_edge || 0.02,
    odds: pick.odds_at_pick
  })
  
  pick.stake_recommendation_source = 'bankroll_policy'
  pick.recommended_stake = recommendedStake
  
  return true
}
```

**Alertas Automáticas:**
- Exceso de stake → Notificación inmediata
- Límite diario → Bloqueo temporal
- Drawdown crítico → Pausa de trading

### 21.6. Etiqueta de Calidad del Pick (Para IA)

**Problema:** La IA aprende de resultados, no de procesos → copia picks ganadores en lugar de procesos correctos.

**Solución - Etiquetado por Calidad de Proceso:**

```typescript
interface PickQualityLabel {
  pick_quality_label: 
    | 'high_quality_process'    // razonamiento excelente + timing perfecto
    | 'acceptable_process'       // proceso correcto, resultado irrelevante
    | 'poor_process'            // proceso defectuoso aunque haya ganado
    | 'random_behavior'         // sin lógica aparente
  
  // Criterios de evaluación
  reasoning_quality_score: number      // 0-100
  timing_quality_score: number         // 0-100
  market_selection_score: number       // 0-100
  risk_management_score: number        // 0-100
  
  // Justificación
  quality_assessment_notes?: string
  assessed_by: 'ai_model' | 'expert_reviewer' | 'automated_rules'
}
```

**Sistema de Evaluación:**
```javascript
// Más valioso que el resultado del partido
async function assessPickQuality(pick: UserPick): Promise<string> {
  const scores = {
    reasoning: await assessReasoningQuality(pick.reasoning),
    timing: await assessTimingQuality(pick.prediction_registered_at, pick.match_start_time),
    market: await assessMarketSelection(pick.market, pick.league),
    risk: await assessRiskManagement(pick.stake, pick.bankroll_percentage)
  }
  
  const overallScore = (scores.reasoning + scores.timing + scores.market + scores.risk) / 4
  
  // Etiquetar por proceso, no resultado
  if (overallScore >= 80) {
    return 'high_quality_process'  // Ganó o perdió, proceso excelente
  } else if (overallScore >= 60) {
    return 'acceptable_process'   // Proceso correcto
  } else if (overallScore >= 40) {
    return 'poor_process'        // Proceso defectuoso
  } else {
    return 'random_behavior'     // Sin lógica
  }
}
```

**Para Entrenamiento de IA:**
```javascript
// Dataset con etiquetas de calidad
const trainingData = {
  features: [/* ... */],
  target: pick.pick_quality_label,  // Aprender procesos, no resultados
  weight: pick.quality_score / 100    // Ponderar por calidad
}
```

**Por qué es Crítico:**
- IA aprende a identificar buenos procesos
- No se engaña con picks ganadores por suerte
- Mejora la detección de tipsters reales
- Reduce overfitting a resultados aleatorios

### 21.7. Checklist de Implementación

Antes de lanzar a producción, verificar:

- [ ] **ResultAuthority**: ¿Quién confirma resultados?
- [ ] **VoidHandling**: ¿Cómo afectan los voids a métricas?
- [ ] **AntiDuplicates**: ¿1 pick por mercado para rankings?
- [ ] **ClosingOdds**: ¿Definición estándar de cierre?
- [ ] **RiskIntegration**: ¿Stake validado contra bankroll?
- [ ] **QualityLabels**: ¿IA aprende procesos, no resultados?

> **Sin estas 6 definiciones, tu plataforma será un casino de datos inconsistentes. Con ellas, es un laboratorio de trading profesional.**

---

## 22. Flujo de Exportación y Ejecución Profesional

> **CRÍTICO:** Sin exportación definida, los picks son solo "ideas" sin ejecución controlada.

### 22.1. Sistema de Exportación (Export Intent)

**Problema:** Usuario crea pick → no hay forma controlada de ejecutar → se pierde la trazabilidad.

**Solución - Export Intent como Agenda/Control:**

```typescript
interface ExportIntent {
  // Identificación
  export_intent_id: string
  pick_id: string
  user_id: string
  
  // Configuración de ejecución
  mode: 'PRE' | 'LIVE'                    // cuándo ejecutar
  bookmaker_target: 'cloudbet' | 'bet365' | 'pinnacle'  // dónde
  stake_plan: number                      // cuánto planea apostar
  max_slippage: number                    // % tolerancia (ej: 0.05 = 5%)
  expires_at: timestamp                   // válido hasta
  client_request_id: string                // para idempotencia
  
  // Estados del flujo
  status: 'draft' | 'exported' | 'queued' | 'executed' | 'failed' | 'cancelled'
  status_history: Array<{
    status: string
    timestamp: timestamp
    reason?: string
  }>
  
  // Metadata
  exported_at: timestamp
  executed_at?: timestamp
  execution_result?: {
    success: boolean
    executed_odds?: number
    executed_stake?: number
    slippage?: number
    error_message?: string
  }
}
```

**Estados UI del Flujo:**
```javascript
// Visualización para el usuario
const ExportStatusUI = {
  draft: { 
    label: 'En preparación', 
    color: 'gray',
    actions: ['export', 'edit', 'delete']
  },
  exported: { 
    label: 'Listo para ejecutar', 
    color: 'blue',
    actions: ['queue', 'cancel']
  },
  queued: { 
    label: 'En cola de ejecución', 
    color: 'yellow',
    actions: ['cancel']
  },
  executed: { 
    label: 'Ejecutado', 
    color: 'green',
    actions: ['view_result']
  },
  failed: { 
    label: 'Falló ejecución', 
    color: 'red',
    actions: ['retry', 'cancel']
  },
  cancelled: { 
    label: 'Cancelado', 
    color: 'gray',
    actions: []
  }
}
```

**Botones de Acción en Mis Picks:**
```html
<!-- Botón principal -->
<button class="btn-export-primary">
  Exportar Pick
  <small>Preparar para ejecución</small>
</button>

<!-- Opción profesional -->
<button class="btn-export-pro">
  Exportar + Ejecutar
  <small>Directo a bookmaker</small>
</button>

<!-- Estado visual -->
<div class="export-status-badge" data-status="exported">
  <span class="status-dot"></span>
  Listo para ejecutar
</div>
```

**Proceso de Exportación:**
```javascript
async function exportPick(pickId: string, config: ExportConfig) {
  // 1. Validar pick
  const pick = await validatePickForExport(pickId)
  
  // 2. Crear export intent
  const exportIntent = await createExportIntent({
    pick_id: pickId,
    mode: config.mode,
    bookmaker_target: config.bookmaker,
    stake_plan: config.stake,
    max_slippage: config.slippage || 0.05,
    expires_at: addMinutes(now(), 30), // 30 min válido
    client_request_id: generateUUID()
  })
  
  // 3. Validar contra bankroll
  const riskCheck = await validateRiskConstraints({
    user_id: pick.user_id,
    proposed_stake: config.stake,
    bookmaker: config.bookmaker
  })
  
  if (!riskCheck.allowed) {
    throw new Error(`Riesgo no permitido: ${riskCheck.reason}`)
  }
  
  // 4. Actualizar estado
  await updatePickStatus(pickId, 'exported')
  
  // 5. Notificar
  await notifyUser(pick.user_id, 'PICK_EXPORTED', {
    pick_id: pickId,
    export_intent_id: exportIntent.id,
    expires_at: exportIntent.expires_at
  })
  
  return exportIntent
}
```

### 22.2. Capa Profesional en Creación de Picks

**Problema:** Solo textarea de reasoning → usuario no sabe qué escribir → capturas datos pobres.

**Solución - Form Guiado Profesional (2-4 chips + campo opcional):**

```typescript
interface ProfessionalPickForm {
  // ¿Por qué ves valor? (chips multi-selección)
  value_reasons: Array<
    | 'line_too_high'      // cuota sobrevalorada
    | 'line_too_low'       // cuota infravalorada
    | 'team_news'         // novedades de equipo
    | 'stats_trend'       // tendencia estadística
    | 'match_situation'   // situación del partido
    | 'weather_factor'    // condiciones climáticas
    | 'referee_factor'    // arbitraje
    | 'motivation_factor' // motivación
    | 'fatigue_factor'    // fatiga
    | 'market_overreact'  // mercado reaccionó mal
  >
  
  // Tipo de entrada (1 selección)
  entry_type: 'researched' | 'fresh_info' | 'recreational'
  
  // ¿Qué invalidaría tu pick? (chips + opcional)
  invalidation_triggers: Array<
    | 'lineup_changes'    // cambios en alineación
    | 'odds_drop'        // caída de cuotas
    | 'weather_change'   // cambio climático
    | 'injury_news'      // lesiones
    | 'tactical_news'    // cambios tácticos
  >
  
  // Fuentes / evidencia (opcional, 1-3 líneas)
  evidence_sources?: string
  
  // Confidence interno
  confidence_level: 1 | 2 | 3 | 4 | 5  // 1-5 estrellas
}
```

**UI Component - Formulario Profesional:**
```html
<!-- Sección: ¿Por qué ves valor? -->
<div class="pro-section">
  <h4>¿Por qué ves valor en este pick?</h4>
  <div class="chips-group" data-multiple="true">
    <button class="chip" data-value="line_too_high">Cuota muy alta</button>
    <button class="chip" data-value="team_news">Novedades equipo</button>
    <button class="chip" data-value="stats_trend">Tendencia estadística</button>
    <button class="chip" data-value="market_overreact">Mercado reaccionó mal</button>
    <!-- más chips... -->
  </div>
</div>

<!-- Sección: Tipo de entrada -->
<div class="pro-section">
  <h4>Tipo de entrada</h4>
  <div class="radio-group">
    <label class="radio-option">
      <input type="radio" name="entry_type" value="researched">
      <span class="radio-label">
        <strong>Estudiada</strong>
        <small>Análisis previo, datos sólidos</small>
      </span>
    </label>
    <label class="radio-option">
      <input type="radio" name="entry_type" value="fresh_info">
      <span class="radio-label">
        <strong>Info fresca</strong>
        <small>Novedad recién confirmada</small>
      </span>
    </label>
    <label class="radio-option">
      <input type="radio" name="entry_type" value="recreational">
      <span class="radio-label">
        <strong>Recreativa</strong>
        <small>Intuición, seguimiento</small>
      </span>
    </label>
  </div>
</div>

<!-- Sección: ¿Qué invalidaría tu pick? -->
<div class="pro-section">
  <h4>¿Qué invalidaría tu pick?</h4>
  <div class="chips-group" data-multiple="true">
    <button class="chip" data-value="lineup_changes">Cambios en alineación</button>
    <button class="chip" data-value="odds_drop">Caída de cuotas</button>
    <button class="chip" data-value="weather_change">Cambio climático</button>
    <button class="chip" data-value="injury_news">Lesiones</button>
  </div>
  <textarea 
    class="optional-text" 
    placeholder="Otras condiciones que invalidarían tu pick..."
    rows="2"
  ></textarea>
</div>

<!-- Sección: Fuentes / evidencia -->
<div class="pro-section">
  <h4>Fuentes / evidencia</h4>
  <textarea 
    class="evidence-text" 
    placeholder="Links, estadísticas, noticias que respaldan tu análisis..."
    rows="3"
  ></textarea>
  <small class="help-text">Opcional pero recomendado para tracking futuro</small>
</div>

<!-- Confidence -->
<div class="pro-section">
  <h4>Confianza en el pick</h4>
  <div class="confidence-selector">
    <button class="star" data-rating="1">★</button>
    <button class="star" data-rating="2">★</button>
    <button class="star" data-rating="3">★</button>
    <button class="star" data-rating="4">★</button>
    <button class="star" data-rating="5">★</button>
  </div>
</div>
```

**Procesamiento de Datos Profesionales:**
```javascript
// Convertir form a reasoning estructurado
function processProfessionalForm(formData: ProfessionalPickForm): string {
  const sections = []
  
  // Valor
  if (formData.value_reasons.length > 0) {
    sections.push(`Valor detectado: ${formData.value_reasons.join(', ')}`)
  }
  
  // Tipo
  sections.push(`Tipo de entrada: ${formData.entry_type}`)
  
  // Invalidación
  if (formData.invalidation_triggers.length > 0) {
    sections.push(`Invalidaría si: ${formData.invalidation_triggers.join(', ')}`)
  }
  
  // Fuentes
  if (formData.evidence_sources) {
    sections.push(`Evidencia: ${formData.evidence_sources}`)
  }
  
  // Confidence
  sections.push(`Confianza: ${formData.confidence_level}/5`)
  
  return sections.join('. ')
}

// Calcular Information Score automáticamente
function calculateInformationScore(formData: ProfessionalPickForm): number {
  let score = 0
  
  // Valor específico (+40 puntos)
  if (formData.value_reasons.length >= 2) score += 40
  else if (formData.value_reasons.length === 1) score += 25
  
  // Tipo de entrada (+30 puntos)
  if (formData.entry_type === 'researched') score += 30
  else if (formData.entry_type === 'fresh_info') score += 20
  else score += 10 // recreational
  
  // Invalidación (+20 puntos)
  if (formData.invalidation_triggers.length > 0) score += 20
  
  // Fuentes (+10 puntos)
  if (formData.evidence_sources && formData.evidence_sources.length > 20) score += 10
  
  return Math.min(score, 100)
}
```

**Beneficios para IA:**
- Datos estructurados en lugar de texto libre
- Information Score calculable automáticamente
- Patrones de calidad detectables
- Usuario siente profesionalismo sin fricción

### 22.3. Reflexión Post-Resultado (Aprendizaje)

**Problema:** Sin reflexión post-resultado → no puedes distinguir "azar vs método" → IA aprende mal.

**Solución - Reflexión Corta Opcional:**

```typescript
interface PostResultReflection {
  pick_id: string
  user_id: string
  
  // Reflexión guiada
  reflection_post?: string      // "¿Qué aprendiste?" / "¿Qué cambiarías?"
  
  // Auto-evaluación
  process_quality_self: 1 | 2 | 3 | 4 | 5  // cómo evalúa su propio proceso
  luck_factor_self: 1 | 2 | 3 | 4 | 5     // cuánto fue suerte
  
  // Aprendizaje identificado
  lessons_learned?: Array<
    | 'timing_better'      // mejor timing hubiera ayudado
    | 'research_deeper'    // necesitaba más investigación
    | 'market_reading'     // mal lectura de mercado
    | 'emotional_control'  // problema emocional
    | 'stake_sizing'       // stake incorrecto
    | 'no_lesson'         // no hay lección, variance
  >
  
  // Tracking temporal
  reflected_at: timestamp
  days_after_result: number
}
```

**UI Post-Resultado:**
```html
<!-- Modal/Card que aparece después de conocer resultado -->
<div class="reflection-card">
  <h4>¿Qué aprendiste de este pick?</h4>
  
  <div class="reflection-prompt">
    <p><strong>{{pick.market}}</strong> - {{pick.result}}</p>
    <p class="result-summary">Tu pick de {{pick.selection}} @ {{pick.odds}}</p>
  </div>
  
  <!-- Auto-evaluación rápida -->
  <div class="self-assessment">
    <div class="assessment-row">
      <label>Calidad de tu proceso:</label>
      <div class="star-rating" data-name="process_quality">
        <button class="star" data-value="1">★</button>
        <button class="star" data-value="2">★</button>
        <button class="star" data-value="3">★</button>
        <button class="star" data-value="4">★</button>
        <button class="star" data-value="5">★</button>
      </div>
    </div>
    
    <div class="assessment-row">
      <label>Factor suerte:</label>
      <div class="star-rating" data-name="luck_factor">
        <button class="star" data-value="1">★</button>
        <button class="star" data-value="2">★</button>
        <button class="star" data-value="3">★</button>
        <button class="star" data-value="4">★</button>
        <button class="star" data-value="5">★</button>
      </div>
    </div>
  </div>
  
  <!-- Lecciones aprendidas (chips) -->
  <div class="lessons-section">
    <label>Lecciones identificadas:</label>
    <div class="chips-group" data-multiple="true">
      <button class="chip" data-value="timing_better">Mejor timing</button>
      <button class="chip" data-value="research_deeper">Más investigación</button>
      <button class="chip" data-value="market_reading">Lectura de mercado</button>
      <button class="chip" data-value="emotional_control">Control emocional</button>
      <button class="chip" data-value="stake_sizing">Stake incorrecto</button>
      <button class="chip" data-value="no_lesson">No hay lección</button>
    </div>
  </div>
  
  <!-- Reflexión libre -->
  <div class="reflection-text">
    <label>¿Qué cambiarías? (opcional)</label>
    <textarea 
      placeholder="Reflexión sobre tu proceso, no el resultado..."
      rows="3"
    ></textarea>
    <small>Focus en proceso, no en resultado</small>
  </div>
  
  <div class="actions">
    <button class="btn-secondary">Saltar</button>
    <button class="btn-primary">Guardar reflexión</button>
  </div>
</div>
```

**Procesamiento de Reflexión:**
```javascript
// Análisis automático de calidad de reflexión
function assessReflectionQuality(reflection: PostResultReflection): number {
  let quality = 0
  
  // Auto-evaluación razonable
  if (reflection.process_quality_self >= 3 && reflection.luck_factor_self >= 3) {
    quality += 40 // muestra pensamiento crítico
  }
  
  // Lecciones específicas
  if (reflection.lessons_learned && reflection.lessons_learned.length > 0) {
    if (!reflection.lessons_learned.includes('no_lesson')) {
      quality += 40 // identificó lecciones reales
    }
  }
  
  // Texto reflexivo
  if (reflection.reflection_post && reflection.reflection_post.length > 50) {
    quality += 20 // reflexión sustancial
  }
  
  return Math.min(quality, 100)
}

// Para entrenamiento de IA
function generateTrainingLabel(pick: UserPick, reflection: PostResultReflection): string {
  // Distinguir azar vs método
  if (reflection.luck_factor_self >= 4 && reflection.process_quality_self <= 2) {
    return 'luck_dominant'      // principalmente suerte
  } else if (reflection.process_quality_self >= 4 && reflection.luck_factor_self <= 2) {
    return 'skill_dominant'     // principalmente habilidad
  } else {
    return 'mixed_factors'      // combinación
  }
}
```

**Beneficios del Sistema:**
- **Para usuario:** Aprendizaje consciente y mejora continua
- **Para IA:** Distingue entre picks ganadores por suerte vs por método
- **Para plataforma:** Mejora la detección de tipsters reales
- **Para comunidad:** Cultura de reflexión y mejora profesional

### 22.4. Resumen del Flujo Completo

```
CREAR PICK → [Form Profesional] → EXPORTAR → [Export Intent] → EJECUTAR → [Resultado] → REFLEXIÓN
     ↓              ↓              ↓            ↓              ↓
  Chips GUI    Agenda/Control   Risk Guard   Execution    Aprendizaje
  Datos ricos  Trazabilidad     Validación   Resultado    Azar vs Método
```

**Checklist de Implementación:**
- [ ] Form profesional con chips (razones, tipo, invalidación, fuentes)
- [ ] Export intent con estados visibles (draft → exported → queued → executed)
- [ ] Integración con bankroll para validación de riesgo
- [ ] Reflexión post-resultado con auto-evaluación
- [ ] UI coherente que siente "profesional" sin ser abrumadora

> **Resultado:** Usuario siente que está en una plataforma profesional, tú capturas datos de calidad para IA, y la comunidad aprende del proceso, no solo de los resultados.
MAX_PICKS_PER_DAY = 20
MAX_WATCHLIST_ITEMS = 50
MAX_PICKS_PER_MATCH = 3
```

### 19.3. Auditoría

**Todos estos eventos se registran:**
- Creación de picks
- Marcado como ejecutado
- Resolución de picks
- Cambios de stats
- Detección de candidatos
- Invitaciones enviadas

---

## 20. Referencias

- **Signals Module**: signals.md
- **Trader Master**: trader-master.md
- **Bankroll**: bankroll.md
- **Agents Hub**: agents-hub.md
- **API Spec**: API-SPEC.md
- **Data Model**: DATA-MODEL.md

---

## 21. Glosario

| Término | Definición |
|---------|------------|
| **Watchlist Item** | Entidad de monitoreo (partido/equipo/liga) |
| **User Pick** | Selección propia del usuario con tracking |
| **Consecutive Wins** | Victorias consecutivas sin interrupciones |
| **Tipster Candidate** | Usuario detectado con alto rendimiento |
| **Tipster Invite** | Invitación oficial a unirse como tipster verificado |
| **ROI 30d** | Return on Investment últimos 30 días |
| **Consistency Score** | Medida de volatilidad (0-100, mayor = más consistente) |

---

**Versión:** 1.0  
**Última actualización:** 2025-02-07  
**Autor:** Sistema Trader Deportivo  
**Estado:** Documentación Oficial

---

## 22. Estado actual de implementación vs documentación

### ✅ Elementos implementados en watchlist.html
- **Estructura base**: Sidebar, header, layout responsive con fondo animado
- **Sistema de tabs**: Tres tabs funcionales (Monitoreo, Mis Picks, Resueltas)
- **Monitoreo**: 
  - Cards para partidos, equipos y ligas
  - Sistema de pins para destacar eventos
  - Filtros por PRE/LIVE/Alta Prioridad/Pinned
  - CTAs para ver señales y añadir picks
- **Export Queue**: Panel con gestión básica de picks para exportación
- **Mis Picks**: 
  - Alertas de guía comportamental
  - Agenda operativa con estadísticas diarias
  - Tabla de export queue con estados (QUEUED/EXPORTED/EXECUTED)
- **Estadísticas**: Grid con métricas básicas (Total Picks, Win Rate, ROI, CLV)
- **Modales**: Sistema de modales para exportación, reflexión y configuración

### ❌ Elementos críticos faltantes

#### 1. Sistema de Tracking Profesional
- **CLV (Closing Line Value)**: Sin tracking de ventaja vs cuota de cierre
- **Behavior Consistency Score**: Sin análisis de consistencia temporal
- **Execution Skill Score**: Sin medición de habilidad de ejecución
- **Specialization Score**: Sin puntuación por especialización en mercados
- **Professional Feedback**: Sin sistema de 4 micro-preguntas rápidas

#### 2. Detección de Tipsters
- **Ranking interno**: Sin sistema de detección automática de top performers
- **Métricas anti-varianza**: Sin validación de distribución temporal
- **Sistema de invitación**: Sin flujo para invitar a usuarios destacados
- **Dashboard admin**: Sin interfaz para revisar candidatos a tipster

#### 3. Validación de Mercado
- **Verificación de cuotas**: Sin validación contra feeds en tiempo real
- **Market snapshots**: Sin captura de estado de mercado al crear pick
- **Odds movement tracking**: Sin seguimiento de movimiento de cuotas
- **Sistema anti-manipulación**: Sin protección contra backfilling

#### 4. Gestión de Picks Personales
- **Creación de picks**: Sin formulario completo para crear selecciones propias
- **Edición limitada**: Sin control de edición basado en tiempo de evento
- **Razonamiento**: Sin campo para justificar selecciones
- **Confianza**: Sin sistema de puntuación de confianza

#### 5. Integración con otros módulos
- **Signals**: Sin conexión real para priorizar señales de watchlist
- **Trader Master**: Sin integración para sugerir picks basados en preferencias
- **Risk Guard**: Sin validación de riesgo antes de exportación
- **Agents Hub**: Sin recomendaciones de agentes basadas en watchlist

#### 6. Sistema de Exportación TradeIntent
- **Configuración completa**: Sin opciones de max slippage y expiración
- **Múltiples brokers**: Solo muestra Cloudbet, sin opción de otros brokers
- **Estados detallados**: Sin estados completos de exportación
- **Auditoría**: Sin registro completo de intentos de exportación

#### 7. APIs sin implementar
- `GET /watchlist`: Obtener lista de monitoreo
- `POST /picks`: Crear pick personal
- `GET /analytics/watchlist/stats`: Estadísticas de watchlist
- `GET /analytics/user/rankings`: Ranking interno (admin)

#### 8. Funcionalidades de Agenda
- **EventCalendar**: Sin calendario operativo completo
- **Recordatorios**: Sin sistema de alertas personalizables
- **Notificaciones push**: Sin alertas para eventos cercanos
- **Sincronización**: Sin integración con calendarios externos

#### 9. Sistema de Reflexión Post-Resultado
- **Modal de reflexión**: Sin interfaz para aprender de picks resueltos
- **Auto-evaluación**: Sin sistema de calificación de proceso vs suerte
- **Lecciones aprendidas**: Sin chips de lecciones identificadas
- **Calidad de reflexión**: Sin análisis automático de calidad

#### 10. Conexiones Admin/Tipster
- **Sin conexión con módulos admin**: No hay interfaz administrativa
- **Sin conexión con tipsters**: No hay integración con sistema de tipsters
- **Sin validación cruzada**: No hay verificación entre módulos

### 🔧 Próximos pasos recomendados
1. **Backend prioritario**: Implementar APIs y modelos de datos completos
2. **Sistema de tracking**: Desarrollar métricas profesionales (CLV, consistencia)
3. **Detección tipsters**: Crear algoritmos de identificación y dashboard admin
4. **Validación mercado**: Integrar feeds de cuotas en tiempo real
5. **Integración completa**: Conectar con Signals, Trader Master, Risk Guard

**Nota**: El HTML actual es un mockup visual que muestra la estructura pero requiere implementación completa del backend y integraciones para funcionar según las especificaciones del documento. No hay conexiones con módulos de admin o tipsters identificadas.

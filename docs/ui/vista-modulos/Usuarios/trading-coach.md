# Trading Coach Module

## Concepto Central

**Trading Coach es el sistema de mejora continua basado en IA que convierte los datos del usuario en recomendaciones accionables para mejorar su proceso de trading deportivo.**

No es un tipster ni un bot de picks — es un entrenador personal que analiza tus decisiones, identifica patrones y te guía hacia la consistencia profesional sin prometer resultados financieros.

**Principio fundamental:** Mejoramos el proceso, no prometemos el resultado. El Coach se enfoca en disciplina, especialización y gestión de riesgo, no en ganancias.

---

## 1. Propósito del Módulo

Trading Coach tiene **6 objetivos estratégicos:**

1. **Mejorar decisiones** — Mercado, timing, stake, razonamiento
2. **Detectar patrones** — Ligas fuertes, sesgos, tilt, overtrading
3. **Aumentar disciplina** — Adherencia al plan, consistencia
4. **Especializar enfoque** — Reducir dispersión, dominar nichos
5. **Prevenir errores** — Late entry, overbet, chasing losses
6. **Crear accountability** — Plan semanal, revisión de picks

### 1.1. Lo Que el Coach SÍ Hace

✅ **Recomienda enfoque** — Ligas/mercados donde tienes ventaja  
✅ **Optimiza stake policy** — Según tu Bankroll Plan  
✅ **Identifica errores recurrentes** — Late entry, overbet, chasing  
✅ **Sugiere pausas** — Cooldown basado en Risk Guard  
✅ **Genera insights** — CLV, consistencia, disciplina  
✅ **Mejora razonamientos** — Plantillas estructuradas  
✅ **Crea planes semanales** — 3-5 acciones concretas  

### 1.2. Lo Que el Coach NO Hace

❌ **NO promete ROI** — No hay garantías de ganancias  
❌ **NO ejecuta apuestas** — Eso es Agents Hub  
❌ **NO vende picks** — No da señales directas  
❌ **NO sustituye Risk Guard** — Valida, no reemplaza  
❌ **NO comparte datos de otros** — Privacidad absoluta  
❌ **NO es un chatbot libre** — Respuestas contextuales al proceso  

---

## 2. Inputs (Fuentes de Datos)

### 2.1. Watchlist / User Picks

```typescript
interface PickData {
  // Clasificación
  market: string
  league: string
  timing: 'pre' | 'live'
  odds: number
  
  // Razonamiento
  reasoning: {
    structured: {
      value_thesis: string
      evidence_sources: string[]
      confidence_level: 1-5
      invalidation_triggers: string[]
    }
    free_text?: string
  }
  
  // Resultado
  outcome: 'won' | 'lost' | 'void' | 'pending'
  actual_stake: number
  recommended_stake?: number
  
  // Post-análisis
  post_reflection?: {
    what_worked: string
    what_failed: string
    would_repeat: boolean
  }
  
  // Timestamps
  created_at: timestamp
  executed_at?: timestamp
  resolved_at?: timestamp
}
```

**Métricas derivadas del Coach:**
- Quality of reasoning (0-100)
- Adherence to plan (0-100)
- Timing quality (early/optimal/late)
- Pick category (studied/opportunistic/recreational)

### 2.2. Bankroll

```typescript
interface BankrollData {
  // Plan activo
  bankroll_plan: BankrollPlan
  
  // Política de stake
  stake_policy: {
    type: 'flat' | 'percentage' | 'kelly' | 'confidence'
    base_stake_percent: number
    max_stake_percent: number
  }
  
  // Límites
  max_drawdown_percent: number
  max_daily_loss_percent: number
  
  // Estado actual
  current_balance: number
  current_drawdown: number
  daily_loss: number
}
```

**Usado para:**
- Detectar stake deviation
- Recomendar ajustes de política
- Validar coherencia plan vs ejecución

### 2.3. Risk Guard

```typescript
interface RiskGuardData {
  // Estado actual
  status: 'NORMAL' | 'WARNING' | 'COOLDOWN' | 'LOCKED'
  
  // Eventos recientes
  recent_events: {
    type: 'TILT_DETECTED' | 'OVERTRADING' | 'DRAWDOWN' | 'STAKE_DEVIATION'
    severity: 'LOW' | 'MEDIUM' | 'HIGH'
    triggered_at: timestamp
  }[]
  
  // Thresholds activos
  active_thresholds: {
    daily_loss_limit: number
    max_drawdown: number
    max_stake_deviation: number
  }
}
```

**Usado para:**
- Amplificar warnings
- Sugerir cooldowns
- Crear "recovery mode"

### 2.4. Signals / Trader Master

```typescript
interface SignalsData {
  // Picks generados desde señales
  picks_from_signals: Pick[]
  
  // Tickets
  signals_exported: number
  signals_executed: number
  signals_skipped: number
  
  // Performance
  signals_win_rate: number
  manual_win_rate: number
}
```

**Usado para:**
- Comparar performance manual vs señales
- Recomendar uso de Signals si manual < signals
- Identificar cherry-picking

### 2.5. Store / Plan

```typescript
interface PlanData {
  plan: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE'
  
  // Feature limits
  coach_depth: 'basic' | 'standard' | 'advanced'
  max_insights_per_week: number
  weekly_plan_enabled: boolean
  advanced_segmentation: boolean
}
```

---

## 3. Outputs (Qué Genera)

### 3.1. Coach Insights (Cards)

```typescript
interface CoachInsight {
  insight_id: string
  type: InsightType
  
  // Content
  title: string
  explanation: string
  evidence: {
    data_points: string[]
    sample_size: number
    confidence: 'low' | 'medium' | 'high'
  }
  
  // Action
  suggested_action: string
  action_type: 'focus' | 'reduce' | 'pause' | 'adjust'
  actionable: boolean
  
  // Metadata
  priority: 'low' | 'medium' | 'high'
  created_at: timestamp
  dismissed: boolean
}

enum InsightType {
  FOCUS_RECOMMENDATION = 'focus_recommendation',
  DISCIPLINE_SCORE = 'discipline_score',
  STAKE_DEVIATION = 'stake_deviation',
  OVERTRADING_WARNING = 'overtrading_warning',
  TILT_RISK = 'tilt_risk',
  BEST_SEGMENT = 'best_segment',
  CLV_PERFORMANCE = 'clv_performance',
  TIMING_ANALYSIS = 'timing_analysis',
  REASONING_QUALITY = 'reasoning_quality'
}
```

**Ejemplos de Insights:**

```javascript
// Insight 1: Focus Recommendation
{
  type: 'FOCUS_RECOMMENDATION',
  title: '⚽ Especialízate en Premier League',
  explanation: 'Tu win rate en Premier League (62%) es 12% mayor que en otras ligas. Concentrarte aquí puede mejorar consistencia.',
  evidence: {
    data_points: [
      'Premier League: 62% WR (21 picks)',
      'La Liga: 50% WR (14 picks)',
      'Serie A: 48% WR (8 picks)'
    ],
    sample_size: 43,
    confidence: 'high'
  },
  suggested_action: 'Reduce picks a Premier League + máx 1 liga más por 30 días',
  action_type: 'focus',
  priority: 'high'
}

// Insight 2: Stake Deviation
{
  type: 'STAKE_DEVIATION',
  title: '⚠️ Stakes inconsistentes',
  explanation: 'Has desviado tu stake plan en 8 de últimos 10 picks. Promedio: +42% sobre recomendado.',
  evidence: {
    data_points: [
      'Plan: 2% flat',
      'Real promedio: 2.84%',
      'Desviación máxima: +120%'
    ],
    sample_size: 10,
    confidence: 'high'
  },
  suggested_action: 'Vuelve a stake flat 1% por 14 días para recuperar disciplina',
  action_type: 'adjust',
  priority: 'high'
}

// Insight 3: Overtrading
{
  type: 'OVERTRADING_WARNING',
  title: '🚨 Demasiados mercados',
  explanation: 'Operaste en 7 ligas diferentes esta semana. Los traders pro se enfocan en 1-2.',
  evidence: {
    data_points: [
      '7 ligas diferentes',
      '12 mercados diferentes',
      'Win rate: 48% (disperso)'
    ],
    sample_size: 18,
    confidence: 'medium'
  },
  suggested_action: 'Limita a 2 ligas máximo durante 7 días',
  action_type: 'reduce',
  priority: 'medium'
}
```

### 3.2. Weekly Improvement Plan

```typescript
interface WeeklyPlan {
  plan_id: string
  week_number: number
  year: number
  
  // Objetivo principal
  goal: {
    type: 'consistency' | 'discipline' | 'specialization' | 'risk_management'
    description: string
  }
  
  // Tareas (3-5)
  tasks: {
    task_id: string
    title: string
    objective: string
    duration: string
    how_to: string
    completed: boolean
    completed_at?: timestamp
  }[]
  
  // Progress
  completion_rate: number
  
  created_at: timestamp
  expires_at: timestamp
}
```

**Ejemplo de Plan Semanal:**

```javascript
{
  goal: {
    type: 'specialization',
    description: 'Reducir dispersión y dominar Over/Under en Premier League'
  },
  
  tasks: [
    {
      title: 'Operar solo Premier League',
      objective: 'Reducir dispersión de ligas',
      duration: '7 días',
      how_to: 'Solo añade picks de Premier League a tu Watchlist. Ignora otras ligas temporalmente.',
      completed: false
    },
    
    {
      title: 'Usar stake flat 2%',
      objective: 'Mejorar disciplina de stake',
      duration: '7 días',
      how_to: 'Todas tus apuestas deben ser exactamente 2% de tu bankroll. Sin excepciones.',
      completed: false
    },
    
    {
      title: 'Escribir razonamiento antes de apostar',
      objective: 'Mejorar calidad de análisis',
      duration: '7 días',
      how_to: 'Completa la plantilla de razonamiento ANTES de ejecutar. Min 3 evidencias.',
      completed: false
    },
    
    {
      title: 'Máximo 2 picks por día',
      objective: 'Evitar overtrading',
      duration: '7 días',
      how_to: 'Limítate a tus 2 mejores oportunidades diarias. Calidad > cantidad.',
      completed: false
    },
    
    {
      title: 'Review semanal el domingo',
      objective: 'Reflexión y aprendizaje',
      duration: '30 minutos',
      how_to: 'Revisa tus picks de la semana. ¿Qué funcionó? ¿Qué mejorar?',
      completed: false
    }
  ]
}
```

### 3.3. Session Review

Después de cada 10 picks resueltos, el Coach genera un micro-review:

```typescript
interface SessionReview {
  review_id: string
  picks_reviewed: string[]
  
  // Summary
  session_stats: {
    win_rate: number
    avg_odds: number
    avg_stake_deviation: number
    reasoning_quality_avg: number
  }
  
  // Observations
  positives: string[]
  concerns: string[]
  
  // Suggestions
  immediate_actions: string[]
  
  created_at: timestamp
}
```

**Ejemplo:**

```javascript
{
  positives: [
    'Mantuviste stake consistente en 8/10 picks',
    'Razonamiento detallado en todas las operaciones',
    'CLV positivo en 6/10 picks'
  ],
  
  concerns: [
    '3 picks fueron live betting sin preparación previa',
    '2 picks en ligas nuevas sin historial'
  ],
  
  immediate_actions: [
    'Evita live betting por 48h',
    'Vuelve a ligas que dominas'
  ]
}
```

### 3.4. Risk Interventions

Cuando Risk Guard detecta problemas, el Coach amplifica:

```typescript
interface RiskIntervention {
  intervention_id: string
  trigger: 'TILT_DETECTED' | 'OVERTRADING' | 'DRAWDOWN' | 'STAKE_DEVIATION'
  
  // Severity
  severity: 'LOW' | 'MEDIUM' | 'HIGH'
  
  // Message
  title: string
  message: string
  
  // Recommendation
  recommended_action: 'PAUSE' | 'REDUCE_STAKE' | 'REDUCE_MARKETS' | 'COOLDOWN'
  duration?: string
  
  // Recovery plan (si severity = HIGH)
  recovery_plan?: {
    step_1: string
    step_2: string
    step_3: string
  }
  
  created_at: timestamp
  acknowledged: boolean
}
```

**Ejemplo:**

```javascript
{
  trigger: 'TILT_DETECTED',
  severity: 'HIGH',
  
  title: '🚨 Patrón de Tilt Detectado',
  message: 'Has realizado 5 picks en las últimas 2 horas después de 2 pérdidas. Esto es un patrón clásico de tilt.',
  
  recommended_action: 'COOLDOWN',
  duration: '24 horas',
  
  recovery_plan: {
    step_1: 'Pausa obligatoria de 24h (Risk Guard activo)',
    step_2: 'Reduce stake a 0.5% por 7 días',
    step_3: 'Máximo 1 pick por día durante 7 días'
  },
  
  acknowledged: false
}
```

---

## 4. Pantallas UI (MVP)

### 4.1. Dashboard Coach

```typescript
interface CoachDashboard {
  // Header
  header: {
    title: "Trading Coach"
    plan_badge: "PRO" | "ELITE" | "FREE"
    last_updated: timestamp
  }
  
  // Key metrics cards
  cards: {
    discipline_score: {
      value: number  // 0-100
      trend: 'up' | 'down' | 'stable'
      description: string
    }
    
    current_focus: {
      league: string
      market: string
      rationale: string
    }
    
    risk_status: {
      status: 'SAFE' | 'WARNING' | 'COOLDOWN'
      recent_alerts: number
      last_alert?: string
    }
    
    performance_30d: {
      win_rate: number
      total_picks: number
      consistency_score: number
      // NO dinero
    }
  }
  
  // Main suggestion (hero)
  main_suggestion: {
    title: string
    description: string
    cta_text: string
    cta_action: string
  }
}
```

**UI Elements:**
- 4 cards en grid 2x2
- "Sugerencia Principal Hoy" en panel destacado (gradient)
- CTA button para aplicar sugerencia
- Progress bar de plan semanal

### 4.2. Insights Page

```typescript
interface InsightsPage {
  // Filters
  filters: {
    period: '7d' | '30d' | '90d'
    timing: 'all' | 'pre' | 'live'
    league?: string
    market?: string
  }
  
  // Insights list
  insights: CoachInsight[]
  
  // Actions
  actions: {
    dismiss_insight: (insight_id: string) => void
    apply_suggestion: (insight_id: string) => void
  }
}
```

**UI Elements:**
- Filter bar en top
- Lista de insight cards
- Cada card tiene:
  - Icon según tipo
  - Title + explanation
  - Evidence collapse/expand
  - "Por qué" tooltip
  - Action button
- Empty state si no hay insights

### 4.3. Weekly Plan Page

```typescript
interface WeeklyPlanPage {
  // Current plan
  current_plan: WeeklyPlan
  
  // Checklist
  tasks: {
    task_id: string
    title: string
    objective: string
    duration: string
    how_to: string
    completed: boolean
  }[]
  
  // Progress
  progress: {
    completed: number
    total: number
    percentage: number
  }
  
  // Actions
  actions: {
    mark_complete: (task_id: string) => void
    view_next_week: () => void
  }
}
```

**UI Elements:**
- Header con objetivo semanal
- Progress bar
- Checklist de tareas (checkboxes)
- Cada tarea expandible con "Cómo hacerlo"
- Completion confetti animation

### 4.4. Pick Review Page

```typescript
interface PickReviewPage {
  // Picks con análisis
  picks: {
    pick_id: string
    match: string
    market: string
    outcome: 'won' | 'lost' | 'void'
    
    // Coach analysis
    reasoning_quality: number  // 0-100
    category: 'studied' | 'opportunistic' | 'recreational'
    coach_comment: string
    
    // Improvement suggestion
    improvement_tip?: string
  }[]
  
  // Reasoning templates
  templates: {
    value_thesis_template: string
    evidence_template: string
    invalidation_template: string
  }
}
```

**UI Elements:**
- Tabla de picks con score visual
- Category badges (color-coded)
- Coach comment bubble
- "Mejora tu razonamiento" modal con plantillas
- Filter por outcome/category

### 4.5. Settings Page

```typescript
interface CoachSettings {
  // Goals
  monthly_goal: {
    type: 'consistency' | 'discipline' | 'specialization' | 'risk_management'
    custom_description?: string
  }
  
  // Focus constraints
  focus: {
    allowed_leagues: string[]
    allowed_markets: string[]
    max_daily_picks?: number
  }
  
  // Preferences
  preferences: {
    prompt_style: 'short' | 'detailed'
    coaching_tone: 'direct' | 'gentle'
    notification_frequency: 'immediate' | 'daily_digest' | 'weekly'
  }
  
  // Integrations
  integrations: {
    use_signals_picks: boolean
    use_manual_picks: boolean
    export_to_trader_master: boolean
    sync_with_risk_guard: boolean
  }
}
```

---

## 5. Reglas de Coaching (Sin Parecer Examen)

### 5.1. Micro-Prompts (15-30 segundos)

**Al crear pick:**
```
💭 Quick check:
• ¿Por qué ves valor aquí?
• ¿Qué invalidaría este pick?
• ¿Confías suficiente para tu stake elegido?
```

**Post-resultado:**
```
📝 Reflexión rápida:
• ¿Qué funcionó/falló?
• ¿Repetirías esta decisión?
• ¿Qué aprendiste?
```

### 5.2. Nudges Suaves (No Regaños)

**Overtrading:**
```
🤔 Observo que has abierto 6 mercados diferentes hoy.

Los traders profesionales suelen dominar 1-2 mercados profundamente.

¿Quieres intentar enfocarte en tus 2 mejores mercados mañana?

[Sí, enfocarme] [No, seguir explorando]
```

**Stake deviation:**
```
📊 Nota: Tus últimos 5 picks han sido 3x tu stake planeado.

Esto puede amplificar tanto ganancias como pérdidas.

¿Prefieres volver a tu plan de 2% flat?

[Sí, volver al plan] [Ajustar plan] [Ignorar]
```

**Late entries:**
```
⏰ Noto que este pick fue 10 minutos antes del inicio.

Las decisiones apresuradas suelen tener menor calidad.

Tip: Intenta analizar al menos 2h antes del partido.
```

**Tilt pattern:**
```
🛑 Detecté un patrón:

2 pérdidas → 5 picks en 90 minutos

Esto es común en tilt. Traders pro pausan después de pérdidas.

¿Quieres activar cooldown de 3 horas?

[Sí, pausar] [Continuar consciente]
```

### 5.3. Tone Guidelines

**DO:**
- ✅ Usa preguntas, no órdenes
- ✅ Ofrece opciones, no imposiciones
- ✅ Explica "por qué", no solo "qué"
- ✅ Celebra mejoras pequeñas
- ✅ Usa data, no juicios

**DON'T:**
- ❌ Regañar o juzgar
- ❌ Usar lenguaje absoluto ("nunca", "siempre")
- ❌ Hacer sentir culpable
- ❌ Prometer resultados
- ❌ Comparar con otros usuarios

---

## 6. Scoring Interno (No Visible Directamente)

### 6.1. Discipline Score (0-100)

```javascript
function calculateDisciplineScore(user_id, period_days = 30) {
  const picks = getUserPicks(user_id, { days: period_days })
  const plan = getUserBankrollPlan(user_id)
  
  let score = 100
  
  // Component 1: Stake adherence (40%)
  const stake_deviations = picks.map(p => {
    const recommended = calculateRecommendedStake(p, plan)
    const actual = p.actual_stake
    return Math.abs(actual - recommended) / recommended
  })
  const avg_deviation = average(stake_deviations)
  score -= (avg_deviation * 40)
  
  // Component 2: No tilt patterns (30%)
  const tilt_events = detectTiltPatterns(picks)
  score -= (tilt_events.length * 10)
  
  // Component 3: Execution ratio (15%)
  const execution_ratio = picks.filter(p => p.executed).length / picks.length
  if (execution_ratio < 0.7) {
    score -= (1 - execution_ratio) * 15
  }
  
  // Component 4: Planning ahead (15%)
  const planned_picks = picks.filter(p => 
    (p.executed_at - p.created_at) > 7200000  // 2h+ planning
  ).length
  const planning_ratio = planned_picks / picks.length
  score += (planning_ratio * 15)
  
  return Math.max(0, Math.min(100, score))
}
```

### 6.2. Reasoning Quality Score (0-100)

```javascript
function calculateReasoningQuality(pick) {
  let score = 0
  
  const r = pick.reasoning.structured
  
  // Has value thesis (25 points)
  if (r.value_thesis && r.value_thesis.length > 50) {
    score += 25
  }
  
  // Has evidence sources (30 points)
  if (r.evidence_sources && r.evidence_sources.length >= 3) {
    score += 30
  } else if (r.evidence_sources && r.evidence_sources.length >= 1) {
    score += 15
  }
  
  // Has invalidation triggers (25 points)
  if (r.invalidation_triggers && r.invalidation_triggers.length >= 2) {
    score += 25
  }
  
  // Confidence calibration (20 points)
  if (r.confidence_level >= 3 && r.confidence_level <= 4) {
    score += 20  // realistic confidence
  } else if (r.confidence_level === 5) {
    score += 10  // overconfident
  }
  
  return score
}
```

### 6.3. Specialization Score (0-100)

```javascript
function calculateSpecializationScore(user_id, period_days = 90) {
  const picks = getUserPicks(user_id, { days: period_days })
  
  // Concentration metrics
  const league_distribution = groupBy(picks, 'league')
  const market_distribution = groupBy(picks, 'market')
  
  // Top league concentration
  const top_league_picks = Object.values(league_distribution)
    .sort((a, b) => b.length - a.length)[0]?.length || 0
  const league_concentration = top_league_picks / picks.length
  
  // Top market concentration
  const top_market_picks = Object.values(market_distribution)
    .sort((a, b) => b.length - a.length)[0]?.length || 0
  const market_concentration = top_market_picks / picks.length
  
  // Score
  // 80%+ concentration = 100 points
  // 60-80% = 70 points
  // 40-60% = 40 points
  // <40% = 20 points
  
  const avg_concentration = (league_concentration + market_concentration) / 2
  
  if (avg_concentration >= 0.8) return 100
  if (avg_concentration >= 0.6) return 70
  if (avg_concentration >= 0.4) return 40
  return 20
}
```

### 6.4. Tilt Risk Score (0-100)

```javascript
function calculateTiltRisk(user_id, lookback_hours = 24) {
  const picks = getUserRecentPicks(user_id, { hours: lookback_hours })
  const recent_losses = picks.filter(p => p.outcome === 'lost')
  
  let risk = 0
  
  // Pattern 1: Rapid picks after losses
  for (let i = 0; i < recent_losses.length; i++) {
    const loss = recent_losses[i]
    const picks_after = picks.filter(p => 
      p.created_at > loss.resolved_at &&
      (p.created_at - loss.resolved_at) < 7200000  // 2h window
    )
    
    if (picks_after.length >= 3) {
      risk += 30
    }
  }
  
  // Pattern 2: Increasing stakes after losses
  const stakes = picks.map(p => p.actual_stake)
  if (recent_losses.length > 0 && stakes.length > 2) {
    const last_3_stakes = stakes.slice(-3)
    if (last_3_stakes[2] > last_3_stakes[0] * 1.5) {
      risk += 25
    }
  }
  
  // Pattern 3: Overtrading (>8 picks in 24h)
  if (picks.length > 8) {
    risk += 25
  }
  
  // Pattern 4: New markets after losses
  const markets_before = [...new Set(picks.slice(0, -3).map(p => p.market))]
  const markets_recent = [...new Set(picks.slice(-3).map(p => p.market))]
  const new_markets = markets_recent.filter(m => !markets_before.includes(m))
  
  if (new_markets.length >= 2) {
    risk += 20
  }
  
  return Math.min(100, risk)
}
```

### 6.5. Consistency Score (0-100)

```javascript
function calculateConsistencyScore(user_id, period_days = 30) {
  const picks = getUserPicks(user_id, { days: period_days })
  
  // Divide picks into windows of 10
  const windows = []
  for (let i = 0; i < picks.length; i += 10) {
    windows.push(picks.slice(i, i + 10))
  }
  
  if (windows.length < 2) return 50  // insufficient data
  
  // Calculate win rate per window
  const win_rates = windows.map(w => {
    const wins = w.filter(p => p.outcome === 'won').length
    return wins / w.length
  })
  
  // Calculate standard deviation
  const std_dev = standardDeviation(win_rates)
  
  // Lower std dev = higher consistency
  // std_dev < 0.1 = 100 points
  // std_dev > 0.3 = 20 points
  
  const score = Math.max(20, 100 - (std_dev * 300))
  
  return Math.min(100, score)
}
```

---

## 7. Integración con Risk Guard

### 7.1. Amplificación de Warnings

Cuando Risk Guard activa un threshold, el Coach interviene:

```javascript
async function onRiskGuardEvent(event) {
  const { user_id, type, severity } = event
  
  // Calculate tilt risk
  const tilt_risk = calculateTiltRisk(user_id)
  
  if (severity === 'HIGH' || tilt_risk > 70) {
    // Create intervention
    await createRiskIntervention(user_id, {
      trigger: type,
      severity: 'HIGH',
      
      title: '🚨 Alerta Crítica de Riesgo',
      message: getInterventionMessage(type, tilt_risk),
      
      recommended_action: 'COOLDOWN',
      duration: '24 horas',
      
      recovery_plan: generateRecoveryPlan(user_id, type)
    })
    
    // Update weekly plan with recovery tasks
    await updateWeeklyPlanForRecovery(user_id)
  }
}
```

### 7.2. Recovery Mode

Si usuario está en LOCK (Risk Guard), el Coach muestra "Recovery Mode":

```typescript
interface RecoveryMode {
  status: 'ACTIVE'
  reason: string
  started_at: timestamp
  
  recovery_plan: {
    phase: 1 | 2 | 3
    
    phase_1: {
      title: "Pausa y Reflexión"
      duration: "24-48h"
      tasks: string[]
    }
    
    phase_2: {
      title: "Retorno Controlado"
      duration: "7 días"
      tasks: string[]
    }
    
    phase_3: {
      title: "Normalización"
      duration: "14 días"
      tasks: string[]
    }
  }
  
  current_phase_progress: number
}
```

**Ejemplo:**

```javascript
{
  status: 'ACTIVE',
  reason: 'Tilt detectado + drawdown 18%',
  
  recovery_plan: {
    phase: 1,
    
    phase_1: {
      title: "Pausa y Reflexión (24-48h)",
      tasks: [
        'No nuevos picks durante 24h (obligatorio)',
        'Revisa tus últimos 20 picks y anota patrones',
        'Lee tu plan de Bankroll original',
        'Define 1-2 mercados/ligas para fase 2'
      ]
    },
    
    phase_2: {
      title: "Retorno Controlado (7 días)",
      tasks: [
        'Máximo 1 pick por día',
        'Solo pre-match (NO live)',
        'Stake flat 0.5% (la mitad de tu plan normal)',
        'Solo ligas que decidiste en fase 1',
        'Razonamiento obligatorio antes de ejecutar'
      ]
    },
    
    phase_3: {
      title: "Normalización (14 días)",
      tasks: [
        'Aumenta a 2 picks por día',
        'Vuelve a stake plan normal (2%)',
        'Puedes añadir 1 liga más',
        'Continúa razonamiento obligatorio',
        'Review semanal con Coach'
      ]
    }
  }
}
```

### 7.3. Stake Deviation Sync

```javascript
// Si Coach detecta stake deviation, coordina con Risk Guard
async function handleStakeDeviation(user_id) {
  const deviation = calculateStakeDeviation(user_id)
  
  if (deviation.avg_deviation > 0.5) {  // 50%+ desviación
    // Suggest simpler stake policy
    await createInsight(user_id, {
      type: 'STAKE_DEVIATION',
      title: 'Stakes inconsistentes',
      suggested_action: 'Cambiar a flat stake 1% por 14 días',
      
      // Create auto-adjustment option
      auto_adjustment: {
        new_policy: {
          type: 'flat',
          base_stake_percent: 1.0
        },
        duration_days: 14
      }
    })
    
    // Notify Risk Guard to tighten threshold
    await updateRiskGuardThreshold(user_id, {
      max_stake_deviation: 0.25  // tighter limit
    })
  }
}
```

---

## 8. Integración con Support

### 8.1. Trading Coach Chat Channel (Opcional)

```typescript
interface CoachChatChannel {
  type: 'coach_assistant'
  enabled: boolean  // feature flag por plan
  
  // Características
  capabilities: {
    answer_metrics: true          // "¿Cuál es mi win rate?"
    explain_insights: true        // "¿Por qué recomiendas esto?"
    suggest_improvements: true    // "¿Cómo mejoro mi disciplina?"
    provide_templates: true       // "Dame plantilla de razonamiento"
  }
  
  // Restricciones
  restrictions: {
    no_betting_advice: true       // NO da picks
    no_guaranteed_results: true   // NO promete ROI
    process_only: true            // Solo sobre proceso
  }
}
```

**Ejemplo de interacción:**

```
User: ¿Cuál es mi win rate en Premier League?

Coach: Tu win rate en Premier League es 62% (21 picks).
       Es tu mejor liga, 12% por encima de tu promedio general.
       
       ¿Quieres ver insights sobre cómo especializarte más?

User: ¿Por qué me recomiendas reducir ligas?

Coach: Observo que operas en 5 ligas diferentes, pero:
       
       • Premier League: 62% WR
       • Otras 4 ligas: 50% WR promedio
       
       Especializarte te permite:
       - Conocer equipos profundamente
       - Detectar valor más rápido
       - Mejorar consistencia
       
       Los traders pro dominan 1-2 ligas antes de expandir.

User: Dame una plantilla de razonamiento

Coach: Aquí tienes una plantilla estructurada:
       
       📊 VALUE THESIS:
       ¿Por qué este pick tiene valor?
       
       📈 EVIDENCE (min 3):
       1. [Estadística/dato]
       2. [Tendencia reciente]
       3. [Factor específico]
       
       ❌ INVALIDATION:
       ¿Qué haría inválido este pick?
       
       ⚖️ CONFIDENCE:
       [1-5] ¿Qué tan seguro estás?
       
       ¿Quieres guardarla como template?
```

### 8.2. Escalation a Admin Support

Si usuario pregunta algo fuera del scope del Coach:

```javascript
const OUT_OF_SCOPE_TOPICS = [
  'payment_issues',
  'account_access',
  'technical_bugs',
  'withdrawal_requests',
  'specific_betting_advice'
]

function handleOutOfScope(user_message, detected_topic) {
  return {
    message: `Este tema (${detected_topic}) está fuera de mi área.
    
    Te recomiendo crear un ticket de Admin Support para ayuda directa.
    
    [Crear Ticket] [Volver a Coach]`,
    
    suggested_action: 'CREATE_ADMIN_TICKET',
    category: detected_topic
  }
}
```

---

## 9. Feature Gating por Plan

```typescript
const COACH_FEATURES_BY_PLAN = {
  FREE: {
    dashboard: true,
    insights_per_week: 3,
    insight_types: ['FOCUS_RECOMMENDATION', 'DISCIPLINE_SCORE'],
    weekly_plan: false,
    pick_review: false,
    chat_channel: false,
    advanced_segmentation: false,
    exports: false
  },
  
  STARTER: {
    dashboard: true,
    insights_per_week: 5,
    insight_types: ['FOCUS_RECOMMENDATION', 'DISCIPLINE_SCORE', 'STAKE_DEVIATION'],
    weekly_plan: true,
    pick_review: false,
    chat_channel: false,
    advanced_segmentation: false,
    exports: false
  },
  
  PRO: {
    dashboard: true,
    insights_per_week: 10,
    insight_types: 'ALL',
    weekly_plan: true,
    pick_review: true,
    chat_channel: true,
    advanced_segmentation: true,
    exports: {
      csv: true,
      pdf: false
    }
  },
  
  ENTERPRISE: {
    dashboard: true,
    insights_per_week: -1,  // unlimited
    insight_types: 'ALL',
    weekly_plan: true,
    pick_review: true,
    chat_channel: true,
    advanced_segmentation: true,
    auto_recommendations: true,
    exports: {
      csv: true,
      pdf: true,
      api: true
    }
  }
}
```

---

## 10. API Endpoints (MVP)

### 10.1. Dashboard

```typescript
GET /coach/dashboard
Response: {
  discipline_score: {
    value: number
    trend: 'up' | 'down' | 'stable'
    trend_change: number
  }
  
  current_focus: {
    league: string
    market: string
    rationale: string
  }
  
  risk_status: {
    status: 'SAFE' | 'WARNING' | 'COOLDOWN' | 'LOCKED'
    recent_alerts: number
    last_alert?: RiskGuardEvent
  }
  
  performance_30d: {
    win_rate: number
    total_picks: number
    consistency_score: number
  }
  
  main_suggestion: CoachInsight
}
```

### 10.2. Insights

```typescript
GET /coach/insights
Query: {
  period?: '7d' | '30d' | '90d'
  timing?: 'all' | 'pre' | 'live'
  league?: string
  market?: string
  dismissed?: boolean
}

Response: {
  insights: CoachInsight[]
  total: number
  remaining_this_week?: number  // si hay límite por plan
}

POST /coach/insights/:insight_id/dismiss
Response: {
  success: boolean
}

POST /coach/insights/:insight_id/apply
Body: {
  confirmation: boolean
}
Response: {
  success: boolean
  actions_taken: string[]
}
```

### 10.3. Weekly Plan

```typescript
GET /coach/weekly-plan
Response: {
  current_plan: WeeklyPlan
  previous_plans: WeeklyPlan[]
}

POST /coach/weekly-plan/tasks/:task_id/complete
Response: {
  success: boolean
  task: Task
  plan_progress: number
}

POST /coach/weekly-plan/generate-next
Response: {
  new_plan: WeeklyPlan
}
```

### 10.4. Pick Review

```typescript
GET /coach/picks/review
Query: {
  period?: '7d' | '30d' | '90d'
  outcome?: 'won' | 'lost' | 'void'
  category?: 'studied' | 'opportunistic' | 'recreational'
}

Response: {
  picks: {
    pick_id: string
    match: string
    market: string
    outcome: string
    
    reasoning_quality: number
    category: string
    coach_comment: string
    improvement_tip?: string
  }[]
}
```

### 10.5. Settings

```typescript
GET /coach/settings
Response: CoachSettings

POST /coach/settings
Body: CoachSettings
Response: {
  success: boolean
  updated_settings: CoachSettings
}
```

### 10.6. Chat (si habilitado)

```typescript
POST /coach/chat
Body: {
  message: string
}

Response: {
  response: string
  suggested_actions?: {
    text: string
    action: string
  }[]
}
```

---

## 11. Copy Obligatorio (Legal/Expectativas)

### 11.1. Dashboard Header

```
🎓 Trading Coach

El Trading Coach analiza tu proceso para ayudarte a mejorar.
NO garantiza resultados ni recomienda apuestas específicas.
```

### 11.2. Disclaimer en Insights

```
💡 Estos insights se basan en tus datos históricos.
   No son garantía de resultados futuros.
   Usa Risk Guard para proteger tu banca.
```

### 11.3. Weekly Plan Intro

```
📋 Plan Semanal de Mejora

Este plan se enfoca en mejorar tu PROCESO, no en garantizar ganancias.
Cada tarea es pequeña y accionable.
Completa lo que puedas sin presión.
```

### 11.4. Recovery Mode Banner

```
🛟 Modo Recuperación Activo

Risk Guard detectó señales de riesgo.
Este plan te ayuda a volver al track de forma segura.

Recuerda: Proteger tu banca > Recuperar pérdidas rápido
```

### 11.5. Chat Disclaimer

```
💬 Trading Coach Assistant

Respondo preguntas sobre tu proceso y métricas.
NO doy picks ni garantizo resultados.
Para problemas técnicos, usa Admin Support.
```

---

## 12. Roadmap

### Fase 1 (MVP) ✅
- [x] Dashboard con métricas clave
- [x] Insights básicos (focus, discipline, stake)
- [x] Plan semanal con 3-5 tareas
- [x] Scoring interno (5 scores)
- [x] Integración con Risk Guard
- [x] Feature gating por plan
- [x] Disclaimers y copy legal

### Fase 2
- [ ] CLV tracking (cuando exista en broker)
- [ ] Coach chat dentro del módulo
- [ ] Pick review avanzado con templates
- [ ] Session reviews automáticos (cada 10 picks)
- [ ] Micro-prompts contextuales
- [ ] Exports (CSV, PDF)

### Fase 3
- [ ] Auto-recommendations (ajuste de settings)
- [ ] ML-powered pattern detection
- [ ] Comparative analysis (tu mes vs anterior)
- [ ] Achievement system (gamification)
- [ ] Integration con Agents (sugerir automation)
- [ ] Advanced segmentation (por horario, día semana)

---

## 13. Mejoras Adicionales (Sin Salir de Contexto)

### 13.1. Pick Categories Auto-Tagging

```javascript
// Auto-categorizar picks según calidad de preparación
function categorizePick(pick) {
  const planning_time = pick.executed_at - pick.created_at
  const reasoning_quality = calculateReasoningQuality(pick)
  
  // STUDIED: Bien preparado
  if (planning_time > 7200000 && reasoning_quality >= 70) {
    return 'studied'
  }
  
  // OPPORTUNISTIC: Rápido pero con razonamiento
  if (planning_time < 7200000 && reasoning_quality >= 50) {
    return 'opportunistic'
  }
  
  // RECREATIONAL: Poco análisis
  return 'recreational'
}
```

### 13.2. Confidence Calibration

```javascript
// Medir si el usuario está bien calibrado en su confianza
function analyzeConfidenceCalibration(user_id) {
  const picks = getUserPicks(user_id, { resolved: true })
  
  const buckets = {
    1: { predicted: 0.2, actual: [] },
    2: { predicted: 0.4, actual: [] },
    3: { predicted: 0.6, actual: [] },
    4: { predicted: 0.8, actual: [] },
    5: { predicted: 1.0, actual: [] }
  }
  
  // Group by confidence
  picks.forEach(p => {
    const conf = p.reasoning.structured.confidence_level
    const won = p.outcome === 'won' ? 1 : 0
    buckets[conf].actual.push(won)
  })
  
  // Calculate calibration
  const calibration = Object.entries(buckets).map(([conf, data]) => {
    const actual_win_rate = average(data.actual)
    const error = Math.abs(actual_win_rate - data.predicted)
    
    return {
      confidence_level: conf,
      predicted: data.predicted,
      actual: actual_win_rate,
      sample_size: data.actual.length,
      calibration_error: error
    }
  })
  
  return {
    calibration: calibration,
    is_well_calibrated: calibration.every(c => c.calibration_error < 0.15),
    tendency: calibration.some(c => c.actual < c.predicted) ? 'overconfident' : 'underconfident'
  }
}
```

### 13.3. Best Time of Day Analysis

```javascript
// Identificar mejores horarios para operar
function analyzeBestTimeOfDay(user_id) {
  const picks = getUserPicks(user_id, { resolved: true })
  
  const hourly_performance = {}
  
  picks.forEach(p => {
    const hour = new Date(p.created_at).getHours()
    if (!hourly_performance[hour]) {
      hourly_performance[hour] = { wins: 0, total: 0 }
    }
    
    hourly_performance[hour].total++
    if (p.outcome === 'won') {
      hourly_performance[hour].wins++
    }
  })
  
  // Calculate win rates
  const hourly_win_rates = Object.entries(hourly_performance).map(([hour, data]) => ({
    hour: parseInt(hour),
    win_rate: data.wins / data.total,
    sample_size: data.total
  }))
  
  // Find best hours (min 5 picks)
  const best_hours = hourly_win_rates
    .filter(h => h.sample_size >= 5)
    .sort((a, b) => b.win_rate - a.win_rate)
    .slice(0, 3)
  
  // Find worst hours
  const worst_hours = hourly_win_rates
    .filter(h => h.sample_size >= 5)
    .sort((a, b) => a.win_rate - b.win_rate)
    .slice(0, 3)
  
  return {
    best_hours: best_hours,
    worst_hours: worst_hours,
    
    insight: best_hours.length > 0 ? {
      type: 'TIMING_ANALYSIS',
      title: `⏰ Operas mejor entre ${best_hours[0].hour}h-${best_hours[0].hour + 2}h`,
      explanation: `Tu win rate es ${(best_hours[0].win_rate * 100).toFixed(1)}% en este horario vs ${(average(hourly_win_rates.map(h => h.win_rate)) * 100).toFixed(1)}% promedio.`,
      suggested_action: `Prioriza análisis en este horario. Evita ${worst_hours[0].hour}h-${worst_hours[0].hour + 2}h.`
    } : null
  }
}
```

### 13.4. Market Efficiency Score

```javascript
// Medir en qué mercados el usuario tiene ventaja
function calculateMarketEfficiency(user_id, market) {
  const picks = getUserPicks(user_id, { market: market, resolved: true })
  
  if (picks.length < 20) return null  // insufficient data
  
  // Expected win rate (based on avg odds)
  const avg_odds = average(picks.map(p => p.odds))
  const implied_probability = 1 / avg_odds
  const expected_win_rate = implied_probability * 0.95  // remove vig approx
  
  // Actual win rate
  const actual_win_rate = picks.filter(p => p.outcome === 'won').length / picks.length
  
  // Efficiency = actual / expected
  const efficiency = actual_win_rate / expected_win_rate
  
  return {
    market: market,
    sample_size: picks.length,
    expected_win_rate: expected_win_rate,
    actual_win_rate: actual_win_rate,
    efficiency_ratio: efficiency,
    
    has_edge: efficiency > 1.05,  // 5%+ edge
    
    insight: efficiency > 1.05 ? {
      type: 'BEST_SEGMENT',
      title: `✅ Tienes ventaja en ${market}`,
      explanation: `Tu win rate (${(actual_win_rate * 100).toFixed(1)}%) supera el esperado (${(expected_win_rate * 100).toFixed(1)}%) en este mercado.`,
      suggested_action: `Incrementa exposición en ${market}. Reduce otros mercados.`
    } : null
  }
}
```

### 13.5. Streak Analysis

```javascript
// Analizar rachas y su impacto en decisiones
function analyzeStreaks(user_id) {
  const picks = getUserPicks(user_id, { resolved: true, sorted: true })
  
  let current_streak = 0
  let max_win_streak = 0
  let max_loss_streak = 0
  const streak_impacts = []
  
  picks.forEach((pick, i) => {
    const won = pick.outcome === 'won'
    
    if (won) {
      current_streak = current_streak >= 0 ? current_streak + 1 : 1
      max_win_streak = Math.max(max_win_streak, current_streak)
    } else {
      current_streak = current_streak <= 0 ? current_streak - 1 : -1
      max_loss_streak = Math.min(max_loss_streak, current_streak)
    }
    
    // Analyze behavior during streaks
    if (Math.abs(current_streak) >= 3) {
      const next_pick = picks[i + 1]
      if (next_pick) {
        streak_impacts.push({
          streak_type: current_streak > 0 ? 'winning' : 'losing',
          streak_length: Math.abs(current_streak),
          
          next_pick_behavior: {
            stake_change: (next_pick.actual_stake - pick.actual_stake) / pick.actual_stake,
            market_change: next_pick.market !== pick.market,
            reasoning_quality: calculateReasoningQuality(next_pick)
          }
        })
      }
    }
  })
  
  // Detect tilt after losing streaks
  const tilt_patterns = streak_impacts.filter(s => 
    s.streak_type === 'losing' &&
    s.next_pick_behavior.stake_change > 0.5  // 50%+ stake increase
  )
  
  return {
    max_win_streak: max_win_streak,
    max_loss_streak: Math.abs(max_loss_streak),
    tilt_after_losses: tilt_patterns.length,
    
    insight: tilt_patterns.length >= 2 ? {
      type: 'TILT_RISK',
      title: '⚠️ Patrón de tilt en rachas perdedoras',
      explanation: `Detecté ${tilt_patterns.length} veces que aumentaste stake después de rachas de pérdidas.`,
      suggested_action: 'Establece pausa automática de 2h después de 2 pérdidas seguidas.'
    } : null
  }
}
```

### 13.6. Achievement System

```javascript
// Sistema de logros para gamificación suave
const ACHIEVEMENTS = {
  discipline_master: {
    id: 'discipline_master',
    name: '💪 Discipline Master',
    description: '30 días seguidos sin desviación de stake >10%',
    criteria: {
      consecutive_days: 30,
      max_stake_deviation: 0.10
    },
    reward: {
      badge: true,
      insight_unlock: 'ADVANCED_DISCIPLINE_TIPS'
    }
  },
  
  specialist: {
    id: 'specialist',
    name: '🎯 Specialist',
    description: '50 picks en una sola liga con WR >55%',
    criteria: {
      min_picks_single_league: 50,
      min_win_rate: 0.55
    },
    reward: {
      badge: true,
      feature_unlock: 'LEAGUE_DEEP_ANALYSIS'
    }
  },
  
  consistent_trader: {
    id: 'consistent_trader',
    name: '📊 Consistent Trader',
    description: 'Consistency score >85 durante 60 días',
    criteria: {
      min_consistency_score: 85,
      duration_days: 60
    },
    reward: {
      badge: true,
      community_badge: 'Consistent Trader'  // sync con Community
    }
  }
}
```

---

## 14. Referencias

- **Watchlist**: watchlist.md (Picks, Reasoning)
- **Bankroll**: bankroll.md (Stake Policy, Limits)
- **Risk Guard**: risk-guard.md (Locks, Cooldowns, Thresholds)
- **Signals**: signals.md (Signal-based picks)
- **Trader Master**: Execution tracking
- **Community**: community.md (Badges sync)
- **Support**: support.md (Coach chat channel)

---

## 15. Trader Development Stage (Interno, no visible)

El Coach clasifica al usuario en una etapa de desarrollo para ajustar el feedback según su nivel real. Esta clasificación NO es visible para el usuario, pero afecta tono, tipo de recomendaciones y profundidad de análisis.

```typescript
// Estado del usuario dentro del Coach
export enum TraderStage {
  EXPLORER,     // apuesta sin método
  LEARNER,      // empieza a razonar
  STRUCTURED,   // sigue proceso
  DISCIPLINED,  // respeta plan
  SPECIALIST,   // domina nicho
  CANDIDATE     // potencial tipster
}
```

### 15.1. Inputs para el cálculo
- reasoning_quality (promedio últimos 30-60 picks)
- discipline_score (módulo 6.1)
- specialization_score (módulo 6.3)
- tilt_risk (módulo 6.4)
- constancia 30 días (módulo 6.5: consistency_score)

### 15.2. Regla de clasificación (MVP)
```javascript
function computeTraderStage(user_id) {
  const rq = averageReasoningQuality(user_id, 60)          // 0-100
  const ds = calculateDisciplineScore(user_id, 30)         // 0-100
  const ss = calculateSpecializationScore(user_id, 90)     // 0-100
  const tr = calculateTiltRisk(user_id, 24)                // 0-100
  const cs = calculateConsistencyScore(user_id, 30)        // 0-100
  const picks_count = getUserPicks(user_id, { days: 90 }).length

  // Explorador: bajo proceso o alto riesgo
  if (rq < 40 || ds < 40 || tr > 70) return 'EXPLORER'

  // Aprendiz: empieza a estructurar, aún disperso
  if (rq >= 40 && rq < 60 && ds >= 40 && ds < 60 && ss < 40) return 'LEARNER'

  // Estructurado: proceso estable, riesgo moderado
  if (rq >= 60 && ds >= 60 && cs >= 60 && tr < 60) return 'STRUCTURED'

  // Disciplinado: adherencia alta, consistencia alta
  if (ds >= 75 && cs >= 75 && tr < 40) return 'DISCIPLINED'

  // Especialista: foco claro y ventaja en un nicho
  if (ss >= 70 && ds >= 70 && rq >= 65 && tr < 35) return 'SPECIALIST'

  // Candidato: umbrales de pro con muestra suficiente
  if (rq >= 70 && ds >= 75 && cs >= 75 && ss >= 75 && tr < 30 && picks_count >= 60) return 'CANDIDATE'

  return 'STRUCTURED'
}
```

### 15.3. Estrategia de feedback por etapa
- Explorer → educación básica: plantillas de razonamiento, límites simples, evitar live
- Learner → hábitos: 1-2 ligas, stake flat, evidencia mínima
- Structured → optimización: timing, calibración de confianza, micro-ajustes de plan
- Disciplined → profundidad: segmentación avanzada, análisis de eficiencia por mercado
- Specialist → performance: consolidación de nicho, mejoras marginales, evitar sobreexpansión
- Candidate → pipeline: evaluación privada para tipster (ver sección 18)


## 16. Self-Insight Report (Comportamiento)

Cada 20 picks creados, el sistema genera un informe automático enfocado en comportamiento (no solo resultados). Complementa a SessionReview (resultados) con Self-Insight (conducta).

```typescript
interface SelfInsightReport {
  report_id: string
  user_id: string
  picks_window: number   // e.g., últimos 20
  behavior_findings: {
    losing_patterns: string[]
    winning_patterns: string[]
    stake_behavior: string[]
    best_leagues_markets: string[]
    worst_contexts: string[]
    timing_patterns: string[]
  }
  triggers: string[]      // qué reglas dispararon hallazgos
  suggested_actions: string[]
  created_at: timestamp
}
```

**Ejemplos de hallazgos:**
- “Tus pérdidas ocurren 70% en live betting nocturno”
- “Tus ganancias se concentran en pre-match ligas menores”
- “Tu stake aumenta después de pérdidas”
- “Mejor WR en Over/Under de una sola liga”

```javascript
function generateSelfInsightReport(user_id) {
  const last20 = getUserPicks(user_id, { count: 20, sorted: true })
  const timeInsight = analyzeBestTimeOfDay(user_id)
  const leaguePerf = findBestLeaguesAndMarkets(user_id, last20)
  const stakePattern = detectStakeAfterLossBehavior(last20)

  return {
    behavior_findings: [
      timeInsight?.insight?.title,
      leaguePerf.best?.summary,
      stakePattern?.summary
    ].filter(Boolean),
    suggested_actions: [
      timeInsight?.insight?.suggested_action,
      leaguePerf.best?.action
    ].filter(Boolean)
  }
}
```


## 17. Coach Inline Feedback (Integración con Watchlist)

El Coach interviene dentro del flujo de creación/edición de picks en Watchlist para crear “conciencia” sin bloquear.

```typescript
interface InlineFeedbackEvent {
  trigger: 'HIGH_STAKE' | 'NO_REASONING' | 'TOO_MANY_LEAGUES' | 'IMPULSIVE_LIVE'
  severity: 'info' | 'warning'
  message: string
  suggested_action?: string
  created_at: timestamp
}
```

**Reglas (ejemplos):**
- Stake muy alto → aviso suave: “Tu stake excede el plan +80%. Considera volver a 2% flat.”
- Sin razonamiento → sugerencia: “Completa la plantilla antes de ejecutar. Min 3 evidencias.”
- Demasiadas ligas → alerta: “Operas en 5 ligas esta semana. Enfócate en 1-2.”
- Live impulsivo → advertencia: “Live sin preparación tras pérdida reciente. Pausa 2h.”

```javascript
// Hook en Watchlist al crear/editar pick
function onPickCompose(pick, user_id) {
  const plan = getUserBankrollPlan(user_id)
  const events = []

  if (isStakeHigh(pick, plan)) events.push({ trigger: 'HIGH_STAKE', severity: 'info' })
  if (!hasStructuredReasoning(pick)) events.push({ trigger: 'NO_REASONING', severity: 'warning' })
  if (isLeagueDispersionHigh(user_id)) events.push({ trigger: 'TOO_MANY_LEAGUES', severity: 'warning' })
  if (isImpulsiveLive(user_id, pick)) events.push({ trigger: 'IMPULSIVE_LIVE', severity: 'warning' })

  showCoachInlineNudges(events)  // UI: toast / panel lateral
}
```


## 18. Tipster Detection Engine (Interno Admin)

Perfil de candidato a tipster para scouting privado. NO visible para el usuario.

```typescript
interface TipsterCandidateProfile {
  user_id: string
  clv_positive_sustained: boolean      // cuando exista CLV
  discipline_score: number             // > 75
  specialization_score: number         // alto
  reasoning_quality_avg: number        // > 70
  picks_count_90d: number              // mínimo 60
  tilt_risk_low: boolean               // bajo tilt
  detected_at: timestamp
  status: 'detected' | 'reviewed' | 'contacted'
  admin_notes?: string
}
```

```javascript
function evaluateTipsterCandidate(user_id) {
  const profile = {
    user_id,
    clv_positive_sustained: hasSustainedPositiveCLV(user_id),
    discipline_score: calculateDisciplineScore(user_id, 30),
    specialization_score: calculateSpecializationScore(user_id, 90),
    reasoning_quality_avg: averageReasoningQuality(user_id, 60),
    picks_count_90d: getUserPicks(user_id, { days: 90 }).length,
    tilt_risk_low: calculateTiltRisk(user_id, 24) < 30,
    detected_at: now(),
    status: 'detected'
  }

  const meets = (
    profile.discipline_score > 75 &&
    profile.specialization_score >= 70 &&
    profile.reasoning_quality_avg > 70 &&
    profile.picks_count_90d >= 60 &&
    profile.tilt_risk_low &&
    (profile.clv_positive_sustained || hasMarketEfficiencyEdge(user_id))
  )

  if (meets) {
    createAdminAlert({
      type: 'TIPSTER_CANDIDATE',
      user_id,
      data: profile,
      visibility: 'PRIVATE'  // No pública. No visible. Sin notificar al usuario.
    })
  }

  return profile
}
```

Workflow: al cumplir criterios → alerta privada a ADMIN → revisión manual → contacto.


## 19. Preventive Coaching (Anticipación de errores)

No solo reacciona; anticipa patrones antes de ejecutar el próximo pick.

**Ejemplos:**
- 2 pérdidas seguidas → advertencia antes del tercer pick
- 5 picks en 1h → sugerir pausa
- Apuesta nocturna fuera de patrón → alerta de contexto

```javascript
function evaluatePreventiveCoaching(user_id, next_pick_context) {
  const recent = getUserRecentPicks(user_id, { hours: 6 })
  const losses = recent.filter(p => p.outcome === 'lost')

  const nudges = []
  if (hasTwoConsecutiveLosses(recent)) {
    nudges.push({ type: 'PREVENTIVE', msg: 'Pausa 2h antes del próximo pick.' })
  }
  if (recent.length >= 5 && withinOneHour(recent)) {
    nudges.push({ type: 'PREVENTIVE', msg: 'Has operado 5 picks en 1h. Considera pausa.' })
  }
  if (isNightOutOfPattern(user_id, next_pick_context)) {
    nudges.push({ type: 'PREVENTIVE', msg: 'Contexto nocturno fuera de tu patrón de éxito.' })
  }
  return nudges
}
```

Conecta con Risk Guard para endurecer límites si el usuario ignora repetidamente estas advertencias.


## 20. Gamificación Inteligente (Privada) — Progress Milestones

Sin leaderboard. Sin competición. Incentivos privados que desbloquean insights avanzados.

```javascript
const PROGRESS_MILESTONES = {
  reasoned_streak_10: {
    name: '10 picks razonados seguidos',
    criteria: user => hasConsecutiveReasonedPicks(user, 10),
    reward: { insight_unlock: 'ADVANCED_BEHAVIOR_INSIGHTS' }
  },
  stake_no_deviation_7d: {
    name: '7 días sin desviación de stake',
    criteria: user => stakeDeviationUnder(user, 0.1, 7),
    reward: { insight_unlock: 'ADVANCED_DISCIPLINE_TIPS' }
  },
  single_league_20: {
    name: '20 picks misma liga',
    criteria: user => picksInSingleLeague(user, 20),
    reward: { insight_unlock: 'LEAGUE_DEEP_ANALYSIS' }
  },
  no_tilt_14d: {
    name: '14 días sin tilt',
    criteria: user => tiltRiskUnder(user, 20, 14),
    reward: { insight_unlock: 'RESILIENCE_ADVANCED' }
  }
}

function checkMilestonesAndUnlock(user_id) {
  Object.values(PROGRESS_MILESTONES).forEach(m => {
    if (m.criteria(user_id)) {
      unlockInsightPack(user_id, m.reward.insight_unlock)
      notifyUserPrivately(user_id, `🎯 Has desbloqueado: ${m.name}`)
    }
  })
}
```

Recompensa: NO dinero. NO picks. Solo acceso a análisis/insights más profundos.

---

## 21. Coach Communication Style (Modo del Coach)

El modo de comunicación define CÓMO se comporta el Coach según el contexto del usuario. No todos reciben el mismo tono ni la misma cantidad de intervenciones.

```typescript
export enum CoachMode {
  PASSIVE,     // solo insights en dashboard
  GUIDED,      // sugerencias ocasionales
  ACTIVE,      // interviene en picks
  PROTECTIVE   // interviene por riesgo (Risk Guard)
}
```

Activación (MVP):
- Nuevo usuario → PASSIVE
- Empieza a registrar picks → GUIDED
- Disciplina media → ACTIVE
- Tilt/Drawdown → PROTECTIVE

```javascript
function determineCoachMode(user_id) {
  const risk = getRiskGuardStatus(user_id) // 'SAFE' | 'WARNING' | 'COOLDOWN' | 'LOCKED'
  const picks_count = getUserPicks(user_id, { days: 30 }).length
  const discipline = calculateDisciplineScore(user_id, 30)

  // Prioridad absoluta a Risk Guard
  if (risk === 'LOCKED' || risk === 'COOLDOWN') return 'PROTECTIVE'
  if (risk === 'WARNING') return 'PROTECTIVE' // tono preventivo

  // Nuevo usuario (actividad baja) → PASSIVE
  if (picks_count < 5) return 'PASSIVE'

  // Disciplina media → ACTIVE
  if (discipline >= 55) return 'ACTIVE'

  // Caso por defecto con actividad → GUIDED
  return 'GUIDED'
}
```

Comportamiento por modo:
- PASSIVE: Insights en dashboard, sin prompts intrusivos. Weekly Plan opcional.
- GUIDED: Sugerencias ocasionales, micro-prompts suaves, plan semanal básico.
- ACTIVE: Inline feedback en Watchlist, recomendaciones accionables, respeta Silence Conditions.
- PROTECTIVE: Integración con Risk Guard, “Recovery Mode”, sin sugerir operar, foco en disciplina y seguridad.

---

## 22. Silence Conditions (Cuándo NO intervenir)

Para evitar rechazo psicológico, el Coach debe permanecer en silencio en contextos sensibles:
- Justo después de una pérdida: cooldown emocional de 30 minutos antes de cualquier nudge/sugerencia.
- Durante una apuesta en vivo activa: el Coach no comenta ni sugiere.
- Cadencia mínima entre picks: no intervenir si han pasado menos de 10 minutos desde el último pick.
- Ignorar avisos consecutivos: si el usuario ignora 3 avisos seguidos en 24h, silenciar por 24h y pasar a “daily digest”.
- Ticket abierto en soporte: si existe ticket activo, reducir frecuencia a cero hasta resolución o 24h.

```javascript
function shouldCoachSpeak(user_id, context) {
  const now = Date.now()
  if (context.last_outcome === 'lost' && (now - context.last_outcome_at) < 30 * 60 * 1000) return false
  if (context.live_bet_active) return false
  if (context.minutes_since_last_pick !== undefined && context.minutes_since_last_pick < 10) return false
  if (getCoachIgnoredCount(user_id, { hours: 24 }) >= 3) return false
  if (hasOpenSupportTicket(user_id)) return false
  return true
}
```

Nota: Excepción para alertas críticas del sistema (Risk Guard). Estas pueden mostrarse como banner global; el Coach permanece en silencio.

---

## 23. Authority Rule (Risk Guard > Trading Coach)

Definición de jerarquía para evitar contradicciones:
- Risk Guard tiene prioridad sobre el Coach.
- Si Risk Guard bloquea (LOCKED/COOLDOWN):
  - El Coach NO recomienda operar.
  - Cambia a “Recovery Mode” (ver sección 7.2).
  - Explica el bloqueo con copy respetuoso y ofrece tareas de recuperación.
- Si Risk Guard está en WARNING:
  - El Coach adopta modo PROTECTIVE.
  - Sugiere reducción/pausa, no aumento de exposición.
- Si Risk Guard está SAFE:
  - El Coach opera según determine determineCoachMode.

```javascript
function resolveCoachBehavior(user_id) {
  const risk = getRiskGuardStatus(user_id)
  const mode = determineCoachMode(user_id)

  if (risk === 'LOCKED' || risk === 'COOLDOWN') {
    return {
      mode: 'PROTECTIVE',
      ui_banner: '🛟 Modo Recuperación Activo',
      allow_operate_suggestions: false,
      actions: getRecoveryActions(user_id) // ver sección 7.2
    }
  }

  if (risk === 'WARNING') {
    return {
      mode: 'PROTECTIVE',
      allow_operate_suggestions: false,
      actions: ['Reducir stake', 'Limitar mercados', 'Pausa breve']
    }
  }

  // SAFE → se respeta mode calculado
  return { mode, allow_operate_suggestions: mode !== 'PROTECTIVE' }
}
```

---

## 24. Análisis Crítico del Módulo Trading Coach

### Estado Actual de la Implementación

#### ✅ Funcionalidades Implementadas
- **Estructura visual completa**: Dashboard con 4 pestañas (Dashboard, Insights, Plan Semanal, Review de Picks)
- **Sistema de métricas**: Cards de disciplina, enfoque actual, estado de riesgo y rendimiento 30d
- **Panel de etapa del trader**: Progreso visual hacia la siguiente etapa con barra de progreso
- **Insights de comportamiento**: Grid con patrones detectados (LIVE vs PRE, hábitos de stake, mercados, horarios)
- **Plan semanal**: Lista de tareas con checkboxes y progreso dinámico
- **Review de picks**: Tabla con análisis post-pick y comentarios del coach
- **Modo recuperación**: Banner automático cuando detecta drawdown o pérdidas consecutivas
- **Coach nudge**: Sistema de alertas contextuales para decisiones problemáticas
- **Sistema de tabs**: Funcionalidad completa de navegación entre secciones
- **Diseño responsive**: Adaptación para dispositivos móviles con menú hamburguesa
- **Exportación**: Botón para exportar reviews en CSV

#### ⚠️ Problemas de Alineación Visual
- **Cards de métricas desalineadas**: Las tarjetas del dashboard no tienen alturas consistentes
- **Spacing irregular**: Espaciado variable entre elementos del grid de insights
- **Progreso visual inconsistente**: Las barras de progreso no siguen un patrón uniforme
- **Tipografía desalineada**: Tamaños de fuente inconsistentes entre secciones
- **Iconos sin alineación vertical**: Los emojis y iconos no están perfectamente centrados

#### ❌ Problemas Críticos de Funcionalidad

**Falta de Integración con Backend**
- Todos los datos están hardcodeados en el frontend
- No hay consumo de APIs reales
- Las métricas no se actualizan con datos reales del usuario
- El progreso del trader es estático y simulado

**Sistema de Insights No Funcional**
- Los insights están pre-cargados y no se generan dinámicamente
- No hay análisis real de patrones de comportamiento
- Falta integración con Watchlist para detectar hábitos
- No hay sistema de machine learning para generar recomendaciones

**Plan Semanal Estático**
- Las tareas están pre-definidas y no personalizadas
- No hay generación dinámica basada en el perfil del usuario
- Falta integración con el sistema de notificaciones para recordatorios
- No hay seguimiento real del progreso

**Review de Picks Incompleto**
- Los datos de la tabla están hardcodeados
- No hay integración con el sistema de picks real
- Falta análisis automático de razonamientos
- No hay generación dinámica de comentarios del coach

**Sistema de Nudges Limitado**
- La lógica de detección es muy básica y estática
- No hay análisis en tiempo real de decisiones del usuario
- Falta integración con Risk Guard para decisiones contextualizadas
- Los nudges no se personalizan según el perfil del usuario

**Falta de Personalización**
- No hay sistema de perfiles de usuario para adaptar recomendaciones
- El tono del coach no se ajusta según la experiencia del trader
- Falta integración con el plan de suscripción para limitar funcionalidades
- No hay consideración del nivel de riesgo del usuario

**Problemas de Performance**
- Código JavaScript no optimizado para grandes volúmenes de datos
- No hay lazy loading para contenido extenso
- Falta caché de insights y recomendaciones
- No hay sistema de precarga para mejorar UX

**Falta de Seguimiento y Analytics**
- No hay tracking de interacciones con el coach
- Falta análisis de efectividad de recomendaciones
- No hay métricas de adopción de insights
- No hay sistema de feedback del usuario sobre utilidad

### Recomendaciones para Corrección

1. **Implementar Backend API**: Desarrollar endpoints para obtener métricas, generar insights y actualizar progreso
2. **Sistema de ML Básico**: Implementar algoritmos simples para detectar patrones en picks y comportamiento
3. **Integración con Watchlist**: Conectar el coach con el sistema de picks para análisis real
4. **Personalización por Perfil**: Crear sistema de clasificación de usuarios según experiencia y disciplina
5. **Generación Dinámica de Contenido**: Implementar templates para insights y recomendaciones personalizadas
6. **Sistema de Notificaciones**: Integrar con el módulo de notificaciones para recordatorios del plan semanal
7. **Analytics y Tracking**: Añadir sistema de métricas para medir efectividad del coach
8. **Optimización de Performance**: Implementar lazy loading y caché para mejorar velocidad

### Conclusión
El módulo Trading Coach tiene una excelente base visual y conceptual, pero requiere desarrollo backend significativo para convertirse en un sistema funcional. La implementación actual es principalmente un mockup visual que demuestra el potencial del sistema, pero necesita integración profunda con los datos del usuario y sistemas de análisis para cumplir su propósito de mejorar el proceso de trading deportivo.

---

**Versión:** 1.2  
**Última actualización:** 2026-02-08  
**Autor:** Sistema Trader Deportivo  
**Estado:** Documentación Oficial

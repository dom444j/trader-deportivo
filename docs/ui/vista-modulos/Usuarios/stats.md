# Mis Estadísticas Module

## Concepto Central

**Mis Estadísticas es el panel de análisis de rendimiento y comportamiento que transforma los datos del usuario en métricas accionables para mejorar como trader deportivo.**

No es un panel de "ganancias" — es un espejo que refleja tu proceso, disciplina y especialización sin prometer resultados financieros.

**Principio fundamental:** Conocer tus patrones te permite mejorar tu proceso. Las estadísticas son para aprender, no para presumir.

---

## 1. Propósito del Módulo

Mis Estadísticas tiene **6 objetivos estratégicos:**

1. **Visibilizar consistencia** — ¿Eres predecible en tu proceso?
2. **Medir disciplina** — Plan vs Real, adherencia
3. **Identificar especialización** — Ligas/mercados donde dominas
4. **Evaluar calidad de análisis** — Reasoning, evidencias
5. **Trackear riesgo** — Drawdown, tilt, alertas
6. **Alimentar Trading Coach** — Data-driven insights

### 1.1. Lo Que Mis Estadísticas SÍ Muestra

✅ **Winrate** — Porcentaje de picks ganados  
✅ **Consistency score** — Estabilidad de resultados  
✅ **Discipline score** — Adherencia al plan  
✅ **Risk metrics** — Drawdown, alertas, cooldowns  
✅ **Specialization** — Mejores ligas/mercados  
✅ **Quality scores** — Calidad de razonamiento  
✅ **Process metrics** — Reasoning, evidencias, timing  

### 1.2. Lo Que Mis Estadísticas NO Muestra

❌ **NO muestra balances** — Sin wallets, sin "dinero ganado"  
❌ **NO muestra stakes absolutos** — Solo porcentajes del plan  
❌ **NO promete ROI** — Son datos históricos, no futuros  
❌ **NO compara con otros** — Solo tus datos, privacidad total  
❌ **NO incentiva overtrading** — Métricas favorecen calidad > cantidad  
❌ **NO muestra datos de otros usuarios** — Privacy by default  

---

## 2. Principios (Críticos)

### 2.1. Privacy by Default

```javascript
const PRIVACY_RULES = {
  // Never show
  never_show: [
    'wallet_addresses',
    'broker_balances',
    'absolute_monetary_amounts',
    'other_users_data',
    'payment_information'
  ],
  
  // Always relative
  show_as_relative: [
    'stakes (% of bankroll)',
    'roi (% not $)',
    'drawdown (% not $)',
    'scores (0-100)'
  ],
  
  // Only owner
  visibility: 'OWNER_ONLY'  // nunca público sin consentimiento
}
```

### 2.2. No Incentivar Overtrading

```javascript
// Métricas diseñadas para favorecer calidad
const QUALITY_OVER_QUANTITY = {
  consistency_score: 'penaliza volatilidad',
  overtrading_index: 'penaliza >8 picks/día',
  reasoning_quality: 'premia análisis completo',
  discipline_score: 'premia adherencia al plan'
}
```

### 2.3. Mostrar Métricas Relativas

```javascript
// Todas las métricas son relativas o normalizadas
const RELATIVE_METRICS = {
  winrate: 'percentage (0-100%)',
  roi: 'percentage relative to stake',
  consistency: 'score (0-100)',
  discipline: 'score (0-100)',
  drawdown: 'percentage of peak',
  stake_deviation: 'percentage from plan'
}
```

---

## 3. Fuentes de Datos (Inputs)

### 3.1. Watchlist / User Picks

```typescript
interface PickInput {
  // Pick data
  pick_id: string
  league: string
  market: string
  timing: 'pre' | 'live'
  odds: number
  
  // Reasoning
  reasoning: {
    structured: StructuredReasoning
    free_text?: string
  }
  
  // Outcome
  outcome: 'won' | 'lost' | 'void' | 'pending'
  
  // Stakes
  actual_stake_percent: number
  recommended_stake_percent?: number
  
  // Source
  source: 'manual' | 'signal' | 'ticket'
  
  // Timestamps
  created_at: timestamp
  executed_at?: timestamp
  resolved_at?: timestamp
}
```

**Usado para:**
- Winrate, consistency
- Timing analysis (pre vs live)
- Reasoning quality
- Source performance (manual vs signals)

### 3.2. Bankroll Plan

```typescript
interface BankrollInput {
  bankroll_plan: BankrollPlan
  
  stake_policy: {
    type: 'flat' | 'percentage' | 'kelly' | 'confidence'
    base_stake_percent: number
    max_stake_percent: number
  }
  
  limits: {
    max_drawdown_percent: number
    max_daily_loss_percent: number
  }
}
```

**Usado para:**
- Stake deviation
- Discipline score
- Plan adherence

### 3.3. Risk Guard Events

```typescript
interface RiskGuardInput {
  events: {
    type: 'TILT_DETECTED' | 'OVERTRADING' | 'DRAWDOWN' | 'STAKE_DEVIATION'
    severity: 'LOW' | 'MEDIUM' | 'HIGH'
    triggered_at: timestamp
  }[]
  
  locks: {
    lock_id: string
    reason: string
    started_at: timestamp
    ended_at?: timestamp
  }[]
  
  cooldowns: {
    cooldown_id: string
    duration_hours: number
    triggered_at: timestamp
  }[]
}
```

**Usado para:**
- Risk timeline
- Tilt risk score
- Discipline score (negativo si muchos eventos)

### 3.4. Signals / Trader Master

```typescript
interface SignalsInput {
  picks_by_source: {
    manual: Pick[]
    signal: Pick[]
    ticket: Pick[]
  }
  
  execution_summary: {
    signals_executed: number
    signals_skipped: number
    tickets_executed: number
    tickets_skipped: number
  }
  
  latency?: {
    avg_signal_to_execution_seconds: number
  }
}
```

**Usado para:**
- Source comparison (manual vs signals)
- Execution ratio
- Decision speed

---

## 4. Métricas Principales (KPIs)

### 4.1. Performance (Sin Dinero)

```typescript
interface PerformanceMetrics {
  // Core
  winrate: number  // 0-100%
  total_picks: number
  wins: number
  losses: number
  voids: number
  
  // Consistency
  consistency_score: number  // 0-100
  win_rate_std_dev: number
  
  // Volatility
  volatility_score: number  // 0-100
  max_win_streak: number
  max_loss_streak: number
  
  // ROI (opcional, relativo)
  roi_percent?: number  // basado en stake unitario
  yield_percent?: number
}
```

**Fórmulas:**

```javascript
// Winrate
winrate = (wins / (wins + losses)) * 100

// Consistency Score
function calculateConsistency(picks) {
  const windows = divideIntoWindows(picks, windowSize = 10)
  const winRates = windows.map(w => calculateWinrate(w))
  const stdDev = standardDeviation(winRates)
  
  // Lower std dev = higher consistency
  // std_dev < 0.1 = 100, std_dev > 0.3 = 20
  return Math.max(20, 100 - (stdDev * 300))
}

// Volatility Score (inverse of consistency)
volatility_score = 100 - consistency_score

// ROI (si se trackea stake unitario)
roi_percent = ((total_profit / total_staked) * 100)
```

### 4.2. Proceso / Disciplina

```typescript
interface DisciplineMetrics {
  // Stake adherence
  stake_deviation: {
    avg_deviation_percent: number
    max_deviation_percent: number
    times_over_max: number
  }
  
  // Overtrading
  overtrading_index: {
    avg_picks_per_day: number
    max_picks_in_day: number
    days_over_8_picks: number
  }
  
  // Pre vs Live
  timing_distribution: {
    pre_picks: number
    live_picks: number
    pre_percentage: number
    live_percentage: number
  }
  
  // Reasoning quality
  reasoning_completion: {
    picks_with_reasoning: number
    picks_with_evidence: number
    picks_with_invalidation: number
    picks_with_post_reflection: number
    
    reasoning_completion_rate: number  // %
    evidence_completion_rate: number   // %
    invalidation_completion_rate: number  // %
    reflection_completion_rate: number  // %
  }
  
  // Overall discipline score
  discipline_score: number  // 0-100
}
```

**Fórmulas:**

```javascript
// Stake Deviation
function calculateStakeDeviation(picks, plan) {
  const deviations = picks.map(p => {
    const recommended = calculateRecommendedStake(p, plan)
    const actual = p.actual_stake_percent
    return Math.abs(actual - recommended) / recommended
  })
  
  return {
    avg_deviation_percent: average(deviations) * 100,
    max_deviation_percent: max(deviations) * 100,
    times_over_max: deviations.filter(d => d > 0.5).length
  }
}

// Overtrading Index
function calculateOvertrading(picks) {
  const picksByDay = groupBy(picks, 'created_at_date')
  const picksPerDay = Object.values(picksByDay).map(p => p.length)
  
  return {
    avg_picks_per_day: average(picksPerDay),
    max_picks_in_day: max(picksPerDay),
    days_over_8_picks: picksPerDay.filter(p => p > 8).length
  }
}

// Discipline Score (composite)
function calculateDisciplineScore(picks, plan) {
  let score = 100
  
  // Stake adherence (40%)
  const stakeDeviation = calculateStakeDeviation(picks, plan)
  score -= (stakeDeviation.avg_deviation_percent * 0.4)
  
  // No overtrading (30%)
  const overtrading = calculateOvertrading(picks)
  if (overtrading.avg_picks_per_day > 5) {
    score -= ((overtrading.avg_picks_per_day - 5) * 6)  // -6 per pick over 5
  }
  
  // Reasoning completion (30%)
  const reasoning = calculateReasoningCompletion(picks)
  score += (reasoning.reasoning_completion_rate * 0.3)
  
  return Math.max(0, Math.min(100, score))
}
```

### 4.3. Riesgo

```typescript
interface RiskMetrics {
  // Drawdown
  max_drawdown_percent: number
  current_drawdown_percent: number
  peak_to_current_percent: number
  
  // Daily loss
  daily_loss_breaches: number
  max_daily_loss_percent: number
  
  // Risk Guard events
  cooldowns_triggered: number
  warnings_received: number
  locks_received: number
  
  recent_events: RiskGuardEvent[]
  
  // Tilt risk
  tilt_risk_score: number  // 0-100
  
  // Recovery mode
  in_recovery_mode: boolean
  recovery_phase?: 1 | 2 | 3
}
```

**Fórmulas:**

```javascript
// Max Drawdown (en unidades, no dinero)
function calculateDrawdown(picks) {
  let peak = 0
  let current = 0
  let maxDrawdown = 0
  
  picks.forEach(pick => {
    const result = pick.outcome === 'won' ? 1 : -1
    current += result
    
    if (current > peak) {
      peak = current
    }
    
    const drawdown = ((peak - current) / Math.max(1, peak)) * 100
    maxDrawdown = Math.max(maxDrawdown, drawdown)
  })
  
  return {
    max_drawdown_percent: maxDrawdown,
    current_drawdown_percent: ((peak - current) / Math.max(1, peak)) * 100
  }
}

// Tilt Risk Score (importado de Trading Coach)
function calculateTiltRisk(picks, lookback_hours = 24) {
  const recentPicks = getRecentPicks(picks, { hours: lookback_hours })
  const recentLosses = recentPicks.filter(p => p.outcome === 'lost')
  
  let risk = 0
  
  // Rapid picks after losses
  recentLosses.forEach(loss => {
    const picksAfter = recentPicks.filter(p => 
      p.created_at > loss.resolved_at &&
      (p.created_at - loss.resolved_at) < 7200000  // 2h window
    )
    if (picksAfter.length >= 3) risk += 30
  })
  
  // Increasing stakes after losses
  const stakes = recentPicks.map(p => p.actual_stake_percent)
  if (recentLosses.length > 0 && stakes.length > 2) {
    const last3 = stakes.slice(-3)
    if (last3[2] > last3[0] * 1.5) risk += 25
  }
  
  // Overtrading (>8 picks in 24h)
  if (recentPicks.length > 8) risk += 25
  
  return Math.min(100, risk)
}
```

### 4.4. Especialización

```typescript
interface SpecializationMetrics {
  // Top leagues
  top_leagues_by_volume: {
    league: string
    picks: number
    winrate: number
    percentage_of_total: number
  }[]
  
  top_leagues_by_performance: {
    league: string
    picks: number
    winrate: number
    roi?: number
  }[]
  
  // Top markets
  top_markets_by_volume: {
    market: string
    picks: number
    winrate: number
  }[]
  
  top_markets_by_performance: {
    market: string
    picks: number
    winrate: number
  }[]
  
  // Best time of day
  best_time_slots: {
    time_slot: 'morning' | 'afternoon' | 'evening' | 'night'
    picks: number
    winrate: number
  }[]
  
  // Sweet spot (liga + mercado + timing)
  sweet_spots: {
    league: string
    market: string
    timing: 'pre' | 'live'
    picks: number
    winrate: number
    sample_sufficient: boolean  // min 20 picks
  }[]
  
  // Specialization score
  specialization_score: number  // 0-100
}
```

**Fórmulas:**

```javascript
// Specialization Score
function calculateSpecializationScore(picks) {
  const leagueDistribution = groupBy(picks, 'league')
  const marketDistribution = groupBy(picks, 'market')
  
  // Top league concentration
  const topLeaguePicks = Object.values(leagueDistribution)
    .sort((a, b) => b.length - a.length)[0]?.length || 0
  const leagueConcentration = topLeaguePicks / picks.length
  
  // Top market concentration
  const topMarketPicks = Object.values(marketDistribution)
    .sort((a, b) => b.length - a.length)[0]?.length || 0
  const marketConcentration = topMarketPicks / picks.length
  
  // Score based on concentration
  const avgConcentration = (leagueConcentration + marketConcentration) / 2
  
  if (avgConcentration >= 0.8) return 100
  if (avgConcentration >= 0.6) return 70
  if (avgConcentration >= 0.4) return 40
  return 20
}

// Sweet Spots (mejor segmento)
function findSweetSpots(picks) {
  const segments = {}
  
  picks.forEach(pick => {
    const key = `${pick.league}|${pick.market}|${pick.timing}`
    if (!segments[key]) {
      segments[key] = { picks: [], wins: 0 }
    }
    segments[key].picks.push(pick)
    if (pick.outcome === 'won') segments[key].wins++
  })
  
  return Object.entries(segments)
    .filter(([_, data]) => data.picks.length >= 20)  // min sample
    .map(([key, data]) => {
      const [league, market, timing] = key.split('|')
      return {
        league,
        market,
        timing,
        picks: data.picks.length,
        winrate: (data.wins / data.picks.length) * 100,
        sample_sufficient: true
      }
    })
    .sort((a, b) => b.winrate - a.winrate)
    .slice(0, 5)  // top 5
}
```

### 4.5. Calidad de Análisis

```typescript
interface QualityMetrics {
  // Reasoning quality
  avg_reasoning_quality_score: number  // 0-100
  
  // Information score (si existe)
  avg_information_score?: number  // 0-100
  
  // Pick categories
  pick_categories: {
    studied: number
    opportunistic: number
    recreational: number
    
    studied_percent: number
    opportunistic_percent: number
    recreational_percent: number
  }
  
  // Winrate by category
  winrate_by_category: {
    studied: number
    opportunistic: number
    recreational: number
  }
  
  // CLV proxy (early entry indicator)
  early_entry_metrics?: {
    avg_hours_before_event: number
    picks_2h_plus_before: number
    picks_2h_plus_winrate: number
  }
}
```

**Fórmulas:**

```javascript
// Reasoning Quality Score (importado de Trading Coach)
function calculateReasoningQuality(pick) {
  let score = 0
  const r = pick.reasoning.structured
  
  if (r.value_thesis && r.value_thesis.length > 50) score += 25
  if (r.evidence_sources && r.evidence_sources.length >= 3) score += 30
  else if (r.evidence_sources && r.evidence_sources.length >= 1) score += 15
  if (r.invalidation_triggers && r.invalidation_triggers.length >= 2) score += 25
  if (r.confidence_level >= 3 && r.confidence_level <= 4) score += 20
  else if (r.confidence_level === 5) score += 10
  
  return score
}

// Pick Category (importado de Trading Coach)
function categorizePick(pick) {
  const planningTime = pick.executed_at - pick.created_at
  const reasoningQuality = calculateReasoningQuality(pick)
  
  if (planningTime > 7200000 && reasoningQuality >= 70) return 'studied'
  if (planningTime < 7200000 && reasoningQuality >= 50) return 'opportunistic'
  return 'recreational'
}

// Early Entry Indicator (CLV proxy)
function calculateEarlyEntryMetrics(picks) {
  const hoursBeforeEvent = picks.map(p => 
    (p.event_start_time - p.created_at) / 3600000
  )
  
  const picks2hPlus = picks.filter(p => 
    (p.event_start_time - p.created_at) > 7200000
  )
  
  return {
    avg_hours_before_event: average(hoursBeforeEvent),
    picks_2h_plus_before: picks2hPlus.length,
    picks_2h_plus_winrate: calculateWinrate(picks2hPlus)
  }
}
```

### 4.6. Fuente de Picks

```typescript
interface SourceMetrics {
  // By source
  by_source: {
    manual: {
      picks: number
      winrate: number
      avg_reasoning_quality: number
    }
    signal: {
      picks: number
      winrate: number
      executed: number
      skipped: number
      execution_rate: number
    }
    ticket: {
      picks: number
      winrate: number
      executed: number
      skipped: number
    }
  }
  
  // Execution
  execution_summary: {
    total_planned: number
    total_executed: number
    total_skipped: number
    execution_rate: number
  }
  
  // Latency (opcional)
  latency?: {
    avg_signal_to_execution_seconds: number
    median_signal_to_execution_seconds: number
  }
  
  // Comparative performance
  best_source: 'manual' | 'signal' | 'ticket'
  source_recommendation?: string
}
```

---

## 5. Filtros (MVP Obligatorio)

### 5.1. Filter Interface

```typescript
interface StatsFilters {
  // Period
  period: '7d' | '30d' | '90d' | 'all' | 'custom'
  custom_range?: {
    start_date: timestamp
    end_date: timestamp
  }
  
  // Type
  timing: 'all' | 'pre' | 'live'
  
  // League (multi-select)
  leagues: string[]  // empty = all
  
  // Market (multi-select)
  markets: string[]  // empty = all
  
  // Source
  source: 'all' | 'manual' | 'signal' | 'ticket'
  
  // Status
  status: 'all' | 'active' | 'resolved'
  
  // Reasoning filter
  only_complete_reasoning: boolean
  
  // Min quality (opcional)
  min_reasoning_quality?: number  // 0-100
}
```

### 5.2. Filter Bar UI

```typescript
interface FilterBar {
  // Always visible
  visible: true
  sticky: true  // fixed on scroll
  
  // Responsive
  collapse_on_mobile: true
  
  // Reset
  reset_button: boolean
  
  // Apply
  auto_apply: boolean  // or manual "Apply" button
  
  // Save
  save_preset?: boolean  // guardar filtros favoritos
}
```

---

## 6. Secciones UI (Pantallas)

### 6.1. Overview (Default)

```typescript
interface OverviewPage {
  // KPI Cards (5 cards)
  kpi_cards: {
    winrate: {
      value: number
      trend: 'up' | 'down' | 'stable'
      comparison: string  // "vs 30d anterior"
    }
    
    consistency: {
      value: number  // 0-100
      trend: 'up' | 'down' | 'stable'
      description: string
    }
    
    discipline: {
      value: number  // 0-100
      alerts: number
      status: 'good' | 'warning' | 'critical'
    }
    
    risk: {
      max_drawdown: number
      current_drawdown: number
      status: 'safe' | 'warning' | 'danger'
    }
    
    reasoning_quality: {
      avg_score: number  // 0-100
      picks_with_complete_reasoning: number
      completion_rate: number
    }
  }
  
  // Mini Insights (3 insights)
  mini_insights: {
    best_segment: {
      title: "Tu mejor segmento"
      value: string  // "Premier League - Over/Under"
      winrate: number
      picks: number
    }
    
    biggest_leak: {
      title: "Tu mayor fuga"
      issue: string  // "Live betting: 42% WR vs 58% Pre"
      recommendation: string
    }
    
    last_risk_alert: {
      title: "Última alerta Risk Guard"
      event?: RiskGuardEvent
      message: string  // "Todo bien" o "Tilt detectado hace 3 días"
    }
  }
  
  // Coach CTA
  coach_recommendation: {
    visible: boolean
    title: string
    description: string
    cta_text: "Ver Recomendación Completa"
    cta_link: "/coach"
  }
}
```

### 6.2. Performance

```typescript
interface PerformancePage {
  // Results chart (en unidades, NO dinero)
  results_chart: {
    type: 'line'  // cumulative result in units
    data_points: {
      date: timestamp
      cumulative_result: number  // +/- units
    }[]
  }
  
  // Streak distribution
  streak_distribution: {
    win_streaks: {
      max: number
      avg: number
      current: number
    }
    
    loss_streaks: {
      max: number
      avg: number
      current: number
    }
    
    histogram: {
      bucket: string  // "1-2 picks", "3-5 picks", etc.
      win_streaks: number
      loss_streaks: number
    }[]
  }
  
  // Pre vs Live comparison
  pre_vs_live: {
    pre: {
      picks: number
      winrate: number
      avg_reasoning_quality: number
    }
    
    live: {
      picks: number
      winrate: number
      avg_reasoning_quality: number
    }
    
    recommendation: string
  }
  
  // Performance by day of week
  by_day_of_week?: {
    day: string
    picks: number
    winrate: number
  }[]
}
```

### 6.3. Disciplina

```typescript
interface DisciplinaPage {
  // Stake deviation chart
  stake_deviation_chart: {
    type: 'scatter'
    data_points: {
      pick_number: number
      recommended_stake: number
      actual_stake: number
      deviation_percent: number
    }[]
  }
  
  // Overtrading chart
  overtrading_chart: {
    type: 'bar'
    data_points: {
      date: timestamp
      picks_count: number
      is_overtrading: boolean  // >8 picks
    }[]
  }
  
  // Reasoning completion
  reasoning_completion: {
    picks_with_reasoning: number
    picks_with_evidence: number
    picks_with_invalidation: number
    picks_with_reflection: number
    
    completion_rates: {
      reasoning: number
      evidence: number
      invalidation: number
      reflection: number
    }
  }
  
  // Rules broken table
  rules_broken: {
    rule: string
    times_broken: number
    severity: 'low' | 'medium' | 'high'
    last_occurrence: timestamp
  }[]
  
  // Examples:
  // - "Stake >max permitido"
  // - "Live betting sin análisis previo"
  // - "Pick sin evidencias"
  // - "Stake deviation >50%"
}
```

### 6.4. Segmentación (Muy Importante)

```typescript
interface SegmentacionPage {
  // Heatmap (Liga x Mercado)
  heatmap: {
    toggle: 'pre' | 'live'  // switch between PRE and LIVE
    
    matrix: {
      league: string
      markets: {
        market: string
        picks: number
        winrate: number
        color: string  // green/yellow/red based on winrate
      }[]
    }[]
  }
  
  // Top 5 segments
  top_segments: {
    rank: number
    league: string
    market: string
    timing: 'pre' | 'live'
    picks: number
    winrate: number
    sample_sufficient: boolean
  }[]
  
  // Bottom 5 segments
  bottom_segments: {
    rank: number
    league: string
    market: string
    timing: 'pre' | 'live'
    picks: number
    winrate: number
    warning: string  // "Evita este segmento"
  }[]
  
  // Focus CTA
  focus_cta: {
    title: "Elegir Enfoque"
    description: "Configura tus ligas/mercados principales"
    action: "navigate_to_coach_settings"
  }
}
```

### 6.5. Riesgo

```typescript
interface RiesgoPage {
  // Risk Guard timeline
  risk_timeline: {
    events: {
      date: timestamp
      type: 'WARNING' | 'COOLDOWN' | 'LOCK'
      description: string
      severity: 'LOW' | 'MEDIUM' | 'HIGH'
    }[]
  }
  
  // Drawdown chart
  drawdown_chart: {
    type: 'area'
    data_points: {
      date: timestamp
      drawdown_percent: number
      peak: number
      current: number
    }[]
  }
  
  // Locks/Cooldowns list
  interventions: {
    locks: {
      lock_id: string
      reason: string
      started_at: timestamp
      ended_at?: timestamp
      duration_hours: number
    }[]
    
    cooldowns: {
      cooldown_id: string
      triggered_at: timestamp
      duration_hours: number
      reason: string
    }[]
  }
  
  // Recovery mode (si aplica)
  recovery_mode?: {
    active: boolean
    phase: 1 | 2 | 3
    phase_description: string
    progress: number
    tasks_remaining: number
  }
}
```

### 6.6. Export

```typescript
interface ExportPage {
  // Export options
  export_csv: {
    available: boolean
    fields_included: string[]
    filtered_picks: number
    file_size_estimate: string
  }
  
  export_json: {
    available: boolean  // solo PRO+
    includes_metadata: boolean
    for_ai_analysis: boolean
  }
  
  // Privacy note
  privacy_notice: {
    message: "Los datos exportados son solo tuyos y no se comparten con terceros."
    warning: "No ejecuta apuestas. Solo datos de análisis."
  }
}
```

---

## 7. Scoring (Definiciones Internas)

### 7.1. Consistency Score

```javascript
/**
 * Mide estabilidad de resultados en el tiempo
 * Formula: Basado en std dev de winrate en ventanas
 * Range: 0-100 (100 = muy consistente)
 */
function calculateConsistencyScore(picks) {
  if (picks.length < 20) return 50  // insufficient data
  
  const windows = divideIntoWindows(picks, windowSize = 10)
  const winRates = windows.map(w => calculateWinrate(w))
  const stdDev = standardDeviation(winRates)
  
  // Scoring
  // std_dev < 0.10 → 100 points
  // std_dev = 0.20 → 60 points
  // std_dev > 0.30 → 20 points
  
  const score = Math.max(20, 100 - (stdDev * 300))
  return Math.min(100, score)
}
```

### 7.2. Discipline Score

```javascript
/**
 * Mide adherencia al plan y proceso
 * Formula: Composite de stake adherence + overtrading + reasoning
 * Range: 0-100 (100 = disciplina perfecta)
 */
function calculateDisciplineScore(picks, plan) {
  let score = 100
  
  // Component 1: Stake adherence (40%)
  const stakeDeviations = picks.map(p => {
    const recommended = calculateRecommendedStake(p, plan)
    const actual = p.actual_stake_percent
    return Math.abs(actual - recommended) / recommended
  })
  const avgDeviation = average(stakeDeviations)
  score -= (avgDeviation * 40)
  
  // Component 2: No tilt patterns (30%)
  const tiltEvents = detectTiltPatterns(picks)
  score -= (tiltEvents.length * 10)
  
  // Component 3: Execution ratio (15%)
  const executionRatio = picks.filter(p => p.executed).length / picks.length
  if (executionRatio < 0.7) {
    score -= (1 - executionRatio) * 15
  }
  
  // Component 4: Planning ahead (15%)
  const plannedPicks = picks.filter(p => 
    (p.executed_at - p.created_at) > 7200000  // 2h+ planning
  ).length
  const planningRatio = plannedPicks / picks.length
  score += (planningRatio * 15)
  
  return Math.max(0, Math.min(100, score))
}
```

### 7.3. Tilt Risk Score

```javascript
/**
 * Detecta patrones de tilt en tiempo real
 * Formula: Suma de patrones detectados
 * Range: 0-100 (100 = tilt severo)
 */
function calculateTiltRiskScore(picks, lookback_hours = 24) {
  const recentPicks = getRecentPicks(picks, { hours: lookback_hours })
  const recentLosses = recentPicks.filter(p => p.outcome === 'lost')
  
  let risk = 0
  
  // Pattern 1: Rapid picks after losses (30 points)
  recentLosses.forEach(loss => {
    const picksAfter = recentPicks.filter(p => 
      p.created_at > loss.resolved_at &&
      (p.created_at - loss.resolved_at) < 7200000  // 2h window
    )
    if (picksAfter.length >= 3) risk += 30
  })
  
  // Pattern 2: Increasing stakes after losses (25 points)
  const stakes = recentPicks.map(p => p.actual_stake_percent)
  if (recentLosses.length > 0 && stakes.length > 2) {
    const last3Stakes = stakes.slice(-3)
    if (last3Stakes[2] > last3Stakes[0] * 1.5) risk += 25
  }
  
  // Pattern 3: Overtrading (25 points)
  if (recentPicks.length > 8) risk += 25
  
  // Pattern 4: New markets after losses (20 points)
  const marketsBefore = [...new Set(recentPicks.slice(0, -3).map(p => p.market))]
  const marketsRecent = [...new Set(recentPicks.slice(-3).map(p => p.market))]
  const newMarkets = marketsRecent.filter(m => !marketsBefore.includes(m))
  if (newMarkets.length >= 2) risk += 20
  
  return Math.min(100, risk)
}
```

### 7.4. Reasoning Quality Score

```javascript
/**
 * Evalúa calidad del análisis pre-pick
 * Formula: Suma ponderada de componentes
 * Range: 0-100 (100 = análisis completo)
 */
function calculateReasoningQualityScore(pick) {
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

---

## 8. Integración con Trading Coach

### 8.1. Data Flow

```javascript
// Stats → Coach
const STATS_TO_COACH_FLOW = {
  // Stats generates data
  stats_calculates: [
    'consistency_score',
    'discipline_score',
    'specialization_metrics',
    'tilt_risk_score',
    'best_segments',
    'worst_segments'
  ],
  
  // Coach consumes data
  coach_uses: [
    'generate_insights',
    'create_weekly_plan',
    'customize_recommendations',
    'detect_patterns',
    'suggest_interventions'
  ]
}
```

### 8.2. CTAs en Stats

```typescript
interface StatsToCoachCTAs {
  // En cada sección
  overview: {
    cta: "Ver Recomendación del Coach"
    action: "navigate_to_coach_dashboard"
  }
  
  segmentation: {
    cta: "Aplicar Enfoque"
    action: "navigate_to_coach_settings_focus"
  }
  
  discipline: {
    cta: "Plan de Mejora"
    action: "navigate_to_coach_weekly_plan"
  }
  
  risk: {
    cta: "Ver Plan de Recuperación"
    action: "navigate_to_coach_recovery_mode"
  }
}
```

### 8.3. Coach Usa Stats Para

```javascript
// Weekly Plan Generation
function generateWeeklyPlan(user_id) {
  const stats = getStats(user_id, { period: '30d' })
  
  // Use stats to personalize
  if (stats.specialization_score < 50) {
    plan.goal = 'specialization'
    plan.tasks.push({
      title: 'Reduce a 2 ligas máximo',
      rationale: `Stats muestran dispersión: ${stats.leagues_count} ligas`
    })
  }
  
  if (stats.discipline_score < 70) {
    plan.goal = 'discipline'
    plan.tasks.push({
      title: 'Stake flat 1% por 14 días',
      rationale: `Desviación promedio: ${stats.stake_deviation.avg}%`
    })
  }
  
  return plan
}
```

---

## 9. Feature Gating por Plan

```typescript
const STATS_FEATURES_BY_PLAN = {
  FREE: {
    overview: true,
    performance: {
      basic_charts: true,
      advanced_charts: false
    },
    discipline: false,
    segmentation: false,
    risk: {
      basic_metrics: true,
      timeline: false
    },
    export: {
      csv: false,
      json: false
    },
    filters: {
      period: ['7d', '30d'],
      advanced_filters: false
    }
  },
  
  STARTER: {
    overview: true,
    performance: {
      basic_charts: true,
      advanced_charts: true
    },
    discipline: true,
    segmentation: {
      basic: true,
      heatmap: false
    },
    risk: {
      basic_metrics: true,
      timeline: true
    },
    export: {
      csv: true,
      json: false
    },
    filters: {
      period: ['7d', '30d', '90d'],
      advanced_filters: true
    }
  },
  
  PRO: {
    overview: true,
    performance: {
      basic_charts: true,
      advanced_charts: true,
      comparative: true
    },
    discipline: true,
    segmentation: {
      basic: true,
      heatmap: true,
      advanced_analysis: true
    },
    risk: {
      basic_metrics: true,
      timeline: true,
      advanced_analytics: true
    },
    export: {
      csv: true,
      json: true,
      scheduled_exports: false
    },
    filters: {
      period: ['7d', '30d', '90d', 'all', 'custom'],
      advanced_filters: true,
      save_presets: true
    }
  },
  
  ENTERPRISE: {
    overview: true,
    performance: {
      basic_charts: true,
      advanced_charts: true,
      comparative: true,
      predictive: true
    },
    discipline: true,
    segmentation: {
      basic: true,
      heatmap: true,
      advanced_analysis: true,
      ml_insights: true
    },
    risk: {
      basic_metrics: true,
      timeline: true,
      advanced_analytics: true,
      custom_alerts: true
    },
    export: {
      csv: true,
      json: true,
      scheduled_exports: true,
      api_access: true
    },
    filters: {
      period: ['7d', '30d', '90d', 'all', 'custom'],
      advanced_filters: true,
      save_presets: true,
      share_presets: true
    }
  }
}
```

---

## 10. API Endpoints (MVP)

```typescript
// Summary
GET /stats/summary
Query: {
  period?: '7d' | '30d' | '90d' | 'all'
  filters?: StatsFilters
}
Response: {
  kpis: PerformanceMetrics
  discipline: DisciplineMetrics
  risk: RiskMetrics
  specialization: SpecializationMetrics
  quality: QualityMetrics
  sources: SourceMetrics
}

// Performance
GET /stats/performance
Query: {
  period?: string
  filters?: StatsFilters
}
Response: {
  results_chart: DataPoint[]
  streak_distribution: StreakData
  pre_vs_live: PreVsLiveComparison
  by_day_of_week?: DayOfWeekData[]
}

// Discipline
GET /stats/discipline
Query: {
  period?: string
  filters?: StatsFilters
}
Response: {
  stake_deviation_chart: DataPoint[]
  overtrading_chart: DataPoint[]
  reasoning_completion: ReasoningCompletion
  rules_broken: RuleBroken[]
}

// Segmentation
GET /stats/segments
Query: {
  period?: string
  filters?: StatsFilters
  timing?: 'pre' | 'live'
}
Response: {
  heatmap: HeatmapData
  top_segments: Segment[]
  bottom_segments: Segment[]
}

// Risk
GET /stats/risk
Query: {
  period?: string
}
Response: {
  risk_timeline: RiskEvent[]
  drawdown_chart: DataPoint[]
  interventions: {
    locks: Lock[]
    cooldowns: Cooldown[]
  }
  recovery_mode?: RecoveryMode
}

// Export
GET /stats/export
Query: {
  format: 'csv' | 'json'
  filters?: StatsFilters
}
Response: {
  file_url: string
  filename: string
  size_bytes: number
  expires_at: timestamp
}
```

---

## 11. Copy / Disclaimers

### 11.1. Overview Header

```
📊 Mis Estadísticas

Estas estadísticas reflejan tu historial de trading.
NO garantizan resultados futuros ni recomiendan apuestas específicas.
```

### 11.2. Performance Disclaimer

```
⚠️ Rendimiento histórico no garantiza resultados futuros.
   Las métricas mostradas son para análisis de proceso, no predicción.
```

### 11.3. Segmentation Notice

```
💡 Los segmentos mostrados reflejan tu experiencia pasada.
   Evita sobreoperar. El objetivo es consistencia, no volumen.
```

### 11.4. Privacy Notice

```
🔒 Privacidad Total
   Los datos mostrados pertenecen SOLO a tu cuenta.
   No se comparten con otros usuarios sin tu consentimiento.
```

### 11.5. Export Warning

```
📥 Exportación de Datos

• Los datos exportados son solo tuyos
• No ejecuta apuestas ni transacciones
• Úsalos para análisis personal
• No compartir con terceros no autorizados
```

---

## 12. Roadmap

### Fase 1 (MVP) ✅
- [x] Overview con KPIs principales
- [x] Filtros completos
- [x] Segmentación básica (top/bottom segments)
- [x] Risk timeline
- [x] Export CSV
- [x] Disclaimers y privacy

### Fase 2
- [ ] CLV real (si hay closing odds del broker)
- [ ] Comparación PRE vs LIVE avanzada
- [ ] Heatmap visual interactivo
- [ ] Export JSON con metadata
- [ ] Correlaciones básicas

### Fase 3
- [ ] Correlaciones avanzadas (horario, mercado, stake deviation)
- [ ] ML-powered pattern detection
- [ ] Predictive insights (basado en patrones históricos)
- [ ] Custom alerts
- [ ] API access para Enterprise
- [ ] Scheduled exports

---

## 13. Mejoras Adicionales (Sin Salir de Contexto)

### 13.1. Confidence Calibration Chart

```javascript
/**
 * Medir si el usuario está bien calibrado en su confianza
 * Compare predicted confidence vs actual win rate
 */
function analyzeConfidenceCalibration(picks) {
  const buckets = {
    1: { predicted: 0.2, actual: [] },
    2: { predicted: 0.4, actual: [] },
    3: { predicted: 0.6, actual: [] },
    4: { predicted: 0.8, actual: [] },
    5: { predicted: 1.0, actual: [] }
  }
  
  picks.forEach(p => {
    const conf = p.reasoning.structured.confidence_level
    const won = p.outcome === 'won' ? 1 : 0
    buckets[conf].actual.push(won)
  })
  
  return Object.entries(buckets).map(([conf, data]) => ({
    confidence_level: parseInt(conf),
    predicted_winrate: data.predicted * 100,
    actual_winrate: (average(data.actual) * 100),
    sample_size: data.actual.length,
    calibration_error: Math.abs(average(data.actual) - data.predicted)
  }))
}
```

**UI:** Gráfico de líneas comparando predicted vs actual winrate por nivel de confianza.

### 13.2. Market Efficiency Heatmap

```javascript
/**
 * Identificar en qué mercados el usuario tiene ventaja real
 * Compare expected winrate (from odds) vs actual
 */
function calculateMarketEfficiency(picks, market) {
  const marketPicks = picks.filter(p => p.market === market)
  
  if (marketPicks.length < 20) return null
  
  // Expected win rate (based on avg odds)
  const avgOdds = average(marketPicks.map(p => p.odds))
  const impliedProb = 1 / avgOdds
  const expectedWR = impliedProb * 0.95  // remove vig approx
  
  // Actual win rate
  const actualWR = calculateWinrate(marketPicks)
  
  // Efficiency ratio
  const efficiency = actualWR / expectedWR
  
  return {
    market,
    expected_winrate: expectedWR * 100,
    actual_winrate: actualWR,
    efficiency_ratio: efficiency,
    has_edge: efficiency > 1.05,  // 5%+ edge
    sample_size: marketPicks.length
  }
}
```

**UI:** Heatmap mostrando efficiency ratio por mercado (verde = edge, rojo = no edge).

### 13.3. Session Quality Score

```javascript
/**
 * Puntuar calidad de cada sesión de trading
 * Session = grupo de picks en ventana de 4h
 */
function calculateSessionQuality(session_picks) {
  let score = 100
  
  // Factor 1: Reasoning quality
  const avgReasoning = average(session_picks.map(p => 
    calculateReasoningQuality(p)
  ))
  score = avgReasoning
  
  // Factor 2: Stake discipline
  const stakeDeviation = calculateStakeDeviation(session_picks)
  score -= (stakeDeviation.avg_deviation_percent * 0.3)
  
  // Factor 3: No overtrading in session
  if (session_picks.length > 5) {
    score -= ((session_picks.length - 5) * 5)
  }
  
  // Factor 4: Planning time
  const avgPlanningTime = average(session_picks.map(p => 
    (p.executed_at - p.created_at) / 3600000  // hours
  ))
  if (avgPlanningTime > 2) score += 10
  
  return Math.max(0, Math.min(100, score))
}
```

**UI:** Timeline de sesiones con quality score color-coded (verde/amarillo/rojo).

### 13.4. Optimal Stake Size Recommendation

```javascript
/**
 * Sugerir stake size óptimo basado en histórico
 * Analizar performance por stake size usado
 */
function recommendOptimalStake(picks) {
  const byStakeSize = {}
  
  picks.forEach(p => {
    const bucket = Math.floor(p.actual_stake_percent)  // redondear a entero
    if (!byStakeSize[bucket]) {
      byStakeSize[bucket] = { picks: [], wins: 0, total_return: 0 }
    }
    
    byStakeSize[bucket].picks.push(p)
    if (p.outcome === 'won') byStakeSize[bucket].wins++
  })
  
  // Calculate ROI per stake bucket
  const analysis = Object.entries(byStakeSize).map(([stake, data]) => ({
    stake_percent: parseInt(stake),
    sample_size: data.picks.length,
    winrate: (data.wins / data.picks.length) * 100,
    roi: calculateROI(data.picks)
  }))
  
  // Find optimal (highest ROI with sufficient sample)
  const optimal = analysis
    .filter(a => a.sample_size >= 10)
    .sort((a, b) => b.roi - a.roi)[0]
  
  return {
    recommended_stake: optimal?.stake_percent || 2,
    rationale: `Histórico muestra mejor ROI (${optimal?.roi.toFixed(1)}%) con stake de ${optimal?.stake_percent}%`,
    sample_size: optimal?.sample_size
  }
}
```

**UI:** Card en Overview sugiriendo stake size óptimo basado en data.

### 13.5. Pick Timing Heatmap

```javascript
/**
 * Analizar rendimiento por hora del día y día de semana
 * Crear heatmap 7x24
 */
function createTimingHeatmap(picks) {
  const heatmap = {}
  
  picks.forEach(p => {
    const date = new Date(p.created_at)
    const dayOfWeek = date.getDay()  // 0-6
    const hour = date.getHours()     // 0-23
    
    const key = `${dayOfWeek}-${hour}`
    if (!heatmap[key]) {
      heatmap[key] = { picks: [], wins: 0 }
    }
    
    heatmap[key].picks.push(p)
    if (p.outcome === 'won') heatmap[key].wins++
  })
  
  // Convert to matrix
  const matrix = []
  for (let day = 0; day < 7; day++) {
    const row = []
    for (let hour = 0; hour < 24; hour++) {
      const key = `${day}-${hour}`
      const data = heatmap[key]
      
      row.push({
        day,
        hour,
        picks: data?.picks.length || 0,
        winrate: data ? (data.wins / data.picks.length) * 100 : 0,
        color: getHeatmapColor(data?.picks.length, data?.wins / data?.picks.length)
      })
    }
    matrix.push(row)
  }
  
  return matrix
}
```

**UI:** Heatmap 7x24 mostrando cuándo opera mejor el usuario (verde = alta WR, rojo = baja WR).

### 13.6. Comparative Period Analysis

```javascript
/**
 * Comparar periodo actual vs periodo anterior
 * Mostrar mejoras/empeoramientos
 */
function comparePeriods(current_picks, previous_picks) {
  const current = calculateMetrics(current_picks)
  const previous = calculateMetrics(previous_picks)
  
  return {
    winrate: {
      current: current.winrate,
      previous: previous.winrate,
      change: current.winrate - previous.winrate,
      improved: current.winrate > previous.winrate
    },
    
    consistency: {
      current: current.consistency_score,
      previous: previous.consistency_score,
      change: current.consistency_score - previous.consistency_score,
      improved: current.consistency_score > previous.consistency_score
    },
    
    discipline: {
      current: current.discipline_score,
      previous: previous.discipline_score,
      change: current.discipline_score - previous.discipline_score,
      improved: current.discipline_score > previous.discipline_score
    },
    
    summary: generateComparisonSummary(current, previous)
  }
}
```

**UI:** Cards mostrando "vs periodo anterior" con flechas up/down y % change.

---

## 0. Primera visita al módulo (Onboarding)

La primera experiencia en /stats NO muestra gráficos. Explica propósito y valor de forma humana y accionable.

- Pantalla: "Tu panel profesional"
- Mensajes clave:
  - "Aquí no medimos cuánto ganas"
  - "Medimos cómo operas"
  - "Los traders rentables son repetibles"
  - "Estas métricas detectan dónde realmente eres bueno"
- CTA principal: "Ver mi análisis" (procede al Overview con filtros por defecto)

```typescript
interface StatsOnboarding {
  visible: boolean
  content: {
    title: string
    bullets: string[]
    cta_text: string
  }
}
```

```javascript
function shouldShowOnboarding(user) {
  return !user.flags?.stats_onboarding_seen
}

function completeOnboarding(user) {
  user.flags = { ...(user.flags || {}), stats_onboarding_seen: true }
  // Navegar a Overview
}
```

UI: Pantalla full-width con copy claro, un solo CTA, sin gráficos ni números. Accesible desde menú de ayuda.

---

## Trader Stability Score (0-100)

Métrica psicológica principal que el usuario entiende de inmediato: mide estabilidad operativa (no matemáticas complejas).

```typescript
interface TraderStabilityScore {
  value: number        // 0-100
  category: 'CAOTICO' | 'IMPULSIVO' | 'EN_DESARROLLO' | 'DISCIPLINADO'
  drivers: {
    stake_deviation_percent: number
    overtrading_index: number
    tilt_events_last_30d: number
    avg_picks_per_day: number
    picks_per_day_variance: number
    switching_frequency: {
      leagues_changes_ratio: number
      markets_changes_ratio: number
    }
  }
}
```

Fórmula (composite, acotada 0-100):

```javascript
function calculateTraderStability(picks, plan, riskEvents) {
  const stakeDev = calculateStakeDeviation(picks, plan).avg_deviation_percent // 0-100
  const over = calculateOvertrading(picks) // { avg_picks_per_day, days_over_8_picks }
  const tiltCount = (riskEvents || []).filter(e => e.type === 'TILT_DETECTED').length
  const picksByDay = groupBy(picks, 'created_at_date')
  const picksCounts = Object.values(picksByDay).map(arr => arr.length)
  const variance = varianceOf(picksCounts) // dispersión diaria
  const switching = calculateSwitchingFrequency(picks) // 0-1 ratios

  let score = 100
  // Penalizaciones (pesos)
  score -= stakeDev * 0.35                 // 35%
  if (over.avg_picks_per_day > 5) {
    score -= (over.avg_picks_per_day - 5) * 5 // 25% máx
  }
  score -= Math.min(25, tiltCount * 8)     // hasta -25
  score -= Math.min(10, variance)          // hasta -10
  score -= ((switching.leagues + switching.markets) / 2) * 15 // hasta -15

  score = Math.max(0, Math.min(100, score))

  const category =
    score < 30 ? 'CAOTICO' :
    score < 60 ? 'IMPULSIVO' :
    score < 80 ? 'EN_DESARROLLO' : 'DISCIPLINADO'

  return {
    value: score,
    category,
    drivers: {
      stake_deviation_percent: stakeDev,
      overtrading_index: over.avg_picks_per_day,
      tilt_events_last_30d: tiltCount,
      avg_picks_per_day: over.avg_picks_per_day,
      picks_per_day_variance: variance,
      switching_frequency: {
        leagues_changes_ratio: switching.leagues,
        markets_changes_ratio: switching.markets
      }
    }
  }
}

function calculateSwitchingFrequency(picks) {
  // Ratio de cambios consecutivos de liga/mercado
  let leagueChanges = 0, marketChanges = 0
  for (let i = 1; i < picks.length; i++) {
    if (picks[i].league !== picks[i-1].league) leagueChanges++
    if (picks[i].market !== picks[i-1].market) marketChanges++
  }
  const denom = Math.max(1, picks.length - 1)
  return {
    leagues: leagueChanges / denom,  // 0-1
    markets: marketChanges / denom   // 0-1
  }
}
```

Interpretación visible:
- 0-30 → Caótico
- 30-60 → Impulsivo
- 60-80 → En desarrollo
- 80-100 → Trader disciplinado

UI: Card destacada en Overview con categoría y explicación breve + link "¿Cómo mejorar mi estabilidad?" (lleva a recomendaciones del Coach).

---

## Insights automáticos ("Lo que aprendiste")

Cada periodo (7d / 30d) se generan insights accionables, con evidencia y recomendación.

```typescript
interface AutoInsight {
  id: string
  period: '7d' | '30d'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  evidence: string[]      // datos que lo respaldan
  action_suggestion: string
  linked_coach_action?: string // id de plan/acción en Coach
}
```

Plantillas comunes:
- "Tu live betting reduce tu winrate ~14%"
- "En ligas menores rindes mejor que en ligas top"
- "Tu stake aumenta tras pérdidas (riesgo de tilt)"
- "Operas peor después de medianoche"
- "Confidence calibration: tu confianza 5/5 gana 48% (ajusta tus niveles)"

```javascript
function generateAutoInsights(picks, plan, riskEvents, period = '30d') {
  const insights = []
  // Ejemplos (pseudo):
  const preVsLive = preVsLiveDelta(picks, period)
  if (preVsLive.live_winrate < preVsLive.pre_winrate - 10) {
    insights.push({
      id: 'live_underperforms', period,
      title: 'Live betting bajo rendimiento',
      description: `WR live ${preVsLive.live_winrate.toFixed(1)}% vs pre ${preVsLive.pre_winrate.toFixed(1)}%`,
      severity: 'medium',
      evidence: ['Distribución pre/live', 'Resultados últimos 30d'],
      action_suggestion: 'Reducir exposición live y reforzar análisis pre',
      linked_coach_action: 'coach_plan_live_reduction'
    })
  }
  const confCal = confidenceCalibration(picks)
  if (confCal.max_confidence_winrate < 55) {
    insights.push({
      id: 'confidence_miscalibration', period,
      title: 'Calibración de confianza',
      description: `Tus picks 5/5 ganan ${confCal.max_confidence_winrate.toFixed(0)}%`,
      severity: 'medium',
      evidence: ['Distribución de confianza', 'WR por nivel'],
      action_suggestion: 'Recalibrar criterios de alta confianza',
      linked_coach_action: 'coach_plan_confidence_recalibration'
    })
  }
  // ... más reglas
  return insights
}
```

UI: Sección "Lo que aprendiste" con 3-5 tarjetas por periodo, cada una con botón "Aplicar en mi plan" (envía al Coach con acción prellenada).

---

## Data Sufficiency Warning

Evita conclusiones falsas con baja muestra. Si total_picks < 20, mostrar advertencia persistente.

```typescript
interface DataSufficiencyCheck {
  min_required: number // 20 por defecto
  message: string
}
```

```javascript
function hasSufficientData(picks, min = 20) {
  return (picks?.length || 0) >= min
}
```

UI: Banner fijo en la parte superior del módulo: "Necesitas más registros para análisis confiable." con contador de picks actuales.

---

## Trader Profile Interno (Scouting Tipsters)

Perfil interno NO visible al usuario, usado por IA/Coach/Risk Guard para detectar talento y evolución.

```typescript
interface InternalTraderProfile {
  user_id: string
  league_focus_score: number       // 0-100, concentración y rendimiento
  market_focus_score: number       // 0-100
  emotional_reactivity: number     // 0-100, basada en tilt/variaciones de stake
  discipline_trend: 'up' | 'down' | 'stable'
  learning_speed: number           // 0-100, mejora entre periodos
  recovery_after_losses: number    // 0-100, tiempo y calidad de recuperación
  clv_proxy: number                // 0-100, indicadores de entrada temprana/valor
  last_updated: timestamp
}
```

Generación:
- Derivada de métricas de especialización, riesgo, disciplina y performance comparativa.
- Actualización semanal automática.
- Uso: scouting silencioso (no leaderboard), potenciando programas de tipsters.

Privacidad: OWNER_ONLY, no se expone públicamente sin consentimiento explícito.

---

## 15. Estructura de Base de Datos (OBLIGATORIO)

Definiciones de tablas, columnas e índices para soportar métricas sin cálculos ad-hoc en cada carga de página.

### 15.1. Tabla: user_picks (conecta Watchlist con Stats)

Campos:

| campo | tipo | descripción |
|---|---|---|
| id | uuid (PK) | identificador del pick |
| user_id | uuid (FK -> users.id) | usuario propietario |
| league | string | liga |
| market | string | mercado |
| odds | decimal | cuota |
| stake_percent | decimal | stake usado (% del bankroll plan) |
| recommended_stake | decimal | stake sugerido (% del plan) |
| outcome | enum('won','lost','void','pending') | resultado |
| created_at | timestamp | creado |
| executed_at | timestamp, nullable | ejecutado |
| resolved_at | timestamp, nullable | resuelto |

Índices recomendados:
- IX_user_picks_user_created: (user_id, created_at DESC)
- IX_user_picks_outcome: (user_id, outcome)
- IX_user_picks_league_market: (user_id, league, market)

### 15.2. Tabla: user_stats_snapshots (⭐️ MUY IMPORTANTE)

Las estadísticas NO se calculan al abrir la página; se guardan como snapshots para rapidez y escalabilidad.

Campos:

| campo | tipo | descripción |
|---|---|---|
| id | uuid (PK) | identificador del snapshot |
| user_id | uuid (FK -> users.id) | usuario |
| period | enum('7d','30d','90d','all') | periodo calculado |
| winrate | decimal | porcentaje 0-100 |
| consistency_score | decimal | 0-100 |
| discipline_score | decimal | 0-100 |
| tilt_risk_score | decimal | 0-100 |
| specialization_score | decimal | 0-100 |
| trader_stability_score | decimal | 0-100 (nuevo KPI principal) |
| total_picks | int | picks en el periodo |
| snapshot_date | date | fecha efectiva del snapshot (agregación por día) |
| calculated_at | timestamp | momento del cálculo |

Índices:
- Opción A (solo último por periodo): UNIQUE (user_id, period)
- Opción B (histórico por día): UNIQUE (user_id, period, snapshot_date)
- Índice de consulta: IX_user_period_calculated: (user_id, period, calculated_at DESC)

Nota: UNIQUE (user_id, period, calculated_at) NO garantiza "último", ya que calculated_at varía en cada snapshot.

Notas:
- Puede ampliarse con drawdown y otros KPIs fase 2.
- Mantener historial para comparar periodos.

---

## 16. Motor de Cálculo Automático (Stats Engine Worker)

Proceso automático que recalcula estadísticas y guarda en snapshots.

- Cron: cada 6 horas
- Alcance: usuarios activos en últimas 30/90d
- Salida: registros en user_stats_snapshots
- Periodo "all": "desde inicio". El worker lo calcula con paginación; opcionalmente limitar a últimos 365 días por rendimiento.

Flujo:
Watchlist → Stats Engine → Snapshots → Dashboard → Coach

Pseudocódigo:
```javascript
async function runStatsEngine() {
  const users = await getActiveUsers({ lookbackDays: 90 })
  for (const user of users) {
    const picks = await getUserPicks(user.id)
    const riskEvents = await getRiskEvents(user.id)
    for (const period of ['7d','30d','90d','all']) {
      const periodPicks = filterByPeriod(picks, period)
      const snapshot = calculateSnapshot(periodPicks, user.bankroll_plan, riskEvents)
      await saveSnapshot(user.id, period, snapshot)
    }
  }
}

function calculateSnapshot(picks, plan, riskEvents) {
  const perf = calculatePerformanceMetrics(picks)
  const disc = calculateDisciplineMetrics(picks, plan)
  const spec = calculateSpecializationScore(picks)
  const tilt = calculateTiltRisk(picks)
  const stability = calculateTraderStability(picks, plan, riskEvents)
  return {
    winrate: perf.winrate,
    consistency_score: perf.consistency_score,
    discipline_score: disc.discipline_score,
    tilt_risk_score: tilt,
    specialization_score: spec,
    trader_stability_score: stability.value,
    total_picks: picks.length,
    calculated_at: new Date()
  }
}
```
Consideraciones:
- Idempotencia y backfill inicial (primer corrida).
- Limitar concurrencia y paginar usuarios.
- Observabilidad: logs y métricas de tiempo de cálculo.

---

## 17. Regla de Suficiencia de Datos (Backend Obligatoria)

Debe aplicarse en backend para evitar conclusiones falsas: si user_picks < 20, NO mostrar métricas avanzadas.

Contrato API (ejemplo):
```json
{
  "user_id": "uuid",
  "total_picks": 14,
  "data_sufficient": false,
  "available_metrics": ["winrate"],
  "blocked_metrics": ["consistency_score","discipline_score","specialization_score","tilt_risk_score","trader_stability_score"]
}
```

Guard en backend:
```javascript
function enforceDataSufficiency(picks) {
  const sufficient = (picks?.length || 0) >= 20
  return {
    data_sufficient: sufficient,
    available_metrics: sufficient ? 'ALL' : ['winrate'],
    blocked_metrics: sufficient ? [] : ['consistency_score','discipline_score','specialization_score','tilt_risk_score','trader_stability_score']
  }
}
```

UI: mostrar banner (ya definido) y ocultar paneles avanzados hasta cumplir el mínimo.

---

## 18. Gráficas MVP (solo estas)

Para versión inicial, limitar visualizaciones a 4:
- Curva de resultados (línea): progreso acumulado en unidades (modelo unit-based: cada pick representa +1 unidad si won, -1 si lost, 0 si void).
- Pre vs Live (barra): comparación WR y volumen.
- Drawdown (área): evolución del drawdown porcentual.
- Heatmap liga/mercado (tabla coloreada simple): rendimiento por segmento.

Todo lo demás → Fase 2.

---

## 19. Empty State (UX)

Comportamiento para usuarios sin datos (0–10 picks):

Mensaje:
“Todavía no tenemos suficiente información para analizar tu estilo de trading.
Registra al menos 10 picks en la Watchlist.”

Acción:
- Botón: “Ir a Watchlist” → ruta /watchlist
- Sugerencias: microtips para empezar (cómo registrar un pick, stake del plan, reasoning básico)

---

## 20. Tabs de la UI (orden explícito)

Para implementación 1:1 en HTML, las secciones se exponen como pestañas en este orden:
1) Overview
2) Performance
3) Disciplina
4) Segmentación
5) Riesgo
6) Export

---

## 14. Referencias

- **Watchlist**: watchlist.md (Picks, Reasoning, Outcomes)
- **Bankroll**: bankroll.md (Stake Policy, Limits)
- **Risk Guard**: risk-guard.md (Events, Locks, Cooldowns)
- **Signals**: signals.md (Signal picks, Execution)
- **Trader Master**: Execution tracking
- **Trading Coach**: trading-coach.md (Scores, Insights)
- **Community**: community.md (Public stats opt-in)

---

**Versión:** 1.0  
**Última actualización:** 2025-02-08  
**Autor:** Sistema Trader Deportivo  
**Estado:** Documentación Oficial

---

## 🔍 ANÁLISIS CRÍTICO - STATS MODULE

### ✅ FUNCIONALIDADES IMPLEMENTADAS

1. **Estructura de Tabs Completa**
   - 5 pestañas principales implementadas: Overview, Performance, Disciplina, Segmentación, Riesgo
   - Sistema de navegación funcional con JavaScript
   - Tab adicional de Export con funcionalidad CSV/JSON

2. **Panel de Métricas KPI (Overview)**
   - 5 tarjetas principales con datos estáticos:
     - Winrate: 58.2% (43 picks, 25 ganados, 18 perdidos)
     - Consistency Score: 76/100
     - Discipline Score: 82/100
     - Risk Score: 0 alertas (SAFE)
     - Quality Score: 78/100
   - Sistema de tendencias con colores (up/down/stable)

3. **Sistema de Filtros Avanzado**
   - 5 filtros principales: Periodo, Tipo (Pre/Live), Liga, Fuente, Razonamiento
   - Interfaz responsive con grid layout
   - Filtro multi-select para mercados (implementado dinámicamente)

4. **Insights Cards Inteligentes**
   - 3 cards con análisis automatizado:
     - Mejor segmento: Premier League Over/Under (62% WR)
     - Mayor fuga: Live Betting (42% vs 58% Pre)
     - Estado Risk Guard: Sin alertas
   - Botones de navegación contextual

5. **Funcionalidades de Export**
   - Export CSV de picks filtrados
   - Export JSON de resumen con métricas clave
   - Sistema de descarga automática con filename dinámico

6. **Sistema de Privacidad y Advertencias**
   - Banner de privacidad destacado (🔒)
   - Disclaimer de no garantía de resultados
   - Sistema de suficiencia de datos (< 20 picks)

### ⚠️ ISSUES DE ALINEACIÓN Y BUGS VISUALES

1. **Problemas de Layout Detectados**
   - Altura inconsistente entre tarjetas de métricas (variable por contenido)
   - Espaciado irregular en filtros (12-16px variable)
   - Cards de insights con alturas diferentes

2. **Problemas de Responsive Identificados**
   - Filtros se comprimen en móvil sin wrap adecuado
   - Tabs sin scroll horizontal en resoluciones < 768px
   - Métricas grid pasa de 4 columnas a 1 sin transición intermedia

3. **Inconsistencias Visuales**
   - Colores de tendencia no uniformes (algunas verde/rojo, otras cyan)
   - Sombra de cards variable (algunas con glow, otras sin)
   - Tamaños de fuente inconsistentes entre valores (42px vs 32px)

### 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

1. **Datos Completamente Estáticos**
   - Todas las métricas están hardcodeadas en HTML
   - Sin integración con sistema de picks real
   - No hay cálculo dinámico de estadísticas
   - Los gráficos son placeholders sin implementación

2. **Falta de Integración con Backend**
   - Sin conexión a `user_stats_snapshots` documentado
   - No hay persistencia de filtros o preferencias
   - Sistema de export genera datos ficticios
   - Sin actualización en tiempo real

3. **Funcionalidades Incompletas Críticas**
   - Los gráficos son solo placeholders con mensajes
   - Sin implementación del Stats Engine Worker
   - No hay cálculo de estabilidad real
   - Sistema de segmentación con datos estáticos

4. **Brecha Documentación vs Implementación**
   - Documentación: 2283 líneas detallando sistema complejo
   - Implementación: 1775 líneas de HTML/CSS/JS con datos estáticos
   - Falta el 80% de la funcionalidad documentada

### 📊 MÉTRICAS DE RENDIMIENTO

- **Tamaño del Archivo**: 1,775 líneas de código HTML/CSS/JS
- **Complejidad**: Muy Alta (múltiples componentes interactivos)
- **Estado de Funcionalidad**: 25% implementada (UI completa, lógica ausente)
- **Cobertura de Documentación**: 95% (excelente documentación vs implementación)

### 📈 COMPARACIÓN DOCUMENTACIÓN vs IMPLEMENTACIÓN

| Característica | Documentado | Implementado | Estado |
|----------------|-------------|--------------|---------|
| Stats Engine Worker | ✅ Worker automático | ❌ Sin implementar | 🔴 |
| user_stats_snapshots | ✅ Tabla completa | ❌ Sin backend | 🔴 |
| Gráficos reales | ✅ 4 gráficos MVP | ❌ Solo placeholders | 🔴 |
| Cálculo en tiempo real | ✅ Automático | ❌ Estático | 🔴 |
| Data Sufficiency | ✅ Backend obligatorio | ❌ Solo UI banner | 🔴 |
| Export funcional | ✅ CSV/JSON real | ✅ Genera datos estáticos | 🟡 |
| Filtros dinámicos | ✅ Multi-select | ✅ UI implementada | ✅ |
| Tabs navegación | ✅ 5 secciones | ✅ Todas funcionando | ✅ |
| Métricas KPI | ✅ 5+ scores | ✅ UI con datos estáticos | 🟡 |

### 🎯 RECOMENDACIONES PRIORITARIAS

#### 1. Backend Integration (CRÍTICO - Semana 1-2)
- Implementar `user_stats_snapshots` table con índices
- Crear Stats Engine Worker con cron cada 6 horas
- API endpoints para métricas por periodo:
  - `GET /api/stats/snapshot?period=30d`
  - `POST /api/stats/recalculate`
- Integrar con sistema de picks existente

#### 2. Gráficos y Visualizaciones (ALTO - Semana 3)
- Implementar Chart.js o Recharts para 4 gráficos MVP:
  - Curva resultados acumulados
  - Pre vs Live comparación
  - Drawdown evolución
  - Heatmap liga/mercado
- Conectar con datos reales del backend

#### 3. Sistema de Cálculo Real (ALTO - Semana 2-3)
- Implementar algoritmos de cálculo documentados:
  - Consistency Score (desviación estándar)
  - Discipline Score (adherencia al plan)
  - Specialization Score (performance por segmento)
  - Trader Stability Score (combinación de métricas)

#### 4. Mejoras de UX (MEDIO - Semana 4)
- Implementar loading states mientras calcula
- Añadir animaciones de transición entre tabs
- Mejorar responsive de filtros y tabs
- Sistema de tooltips explicativos para métricas

### 🔒 PROBLEMAS DE SEGURIDAD IDENTIFICADOS

1. **Exposición de Datos**: Las métricas muestran información sensible sin autenticación
2. **Sin Rate Limiting**: El sistema de export podría ser abusado
3. **Validación Client-side Insuficiente**: Los filtros no validan entrada maliciosa
4. **Sin Encriptación**: Los datos exportados no están protegidos

### 🎨 DISEÑO VS FUNCIONALIDAD

**Diseño**: ⭐⭐⭐⭐⭐ (Excelente - 5/5)
- UI moderna y coherente con el sistema de diseño
- Experiencia de usuario intuitiva y profesional
- Responsive bien implementado
- Visualizaciones claras y atractivas

**Funcionalidad**: ⭐ (Muy Deficiente - 1/5)
- Solo UI mockup sin backend real
- Falta el 75% de la funcionalidad documentada
- Sin integración con datos reales
- Gráficos completamente ausentes

### 📋 CONCLUSIÓN

El módulo **Stats** representa el **caso más extremo** de la brecha documentación-implementación en el proyecto. Mientras que la documentación es **excepcionalmente detallada** (2283 líneas describiendo un sistema sofisticado de análisis deportivo), la implementación es **un mockup visual** con datos completamente inventados.

**Estado Actual**: UI espectacular pero **sin funcionalidad real alguna**
**Prioridad CRÍTICA**: Requiere desarrollo backend masivo (4-6 semanas)
**Complejidad**: Extremadamente alta - necesita motor de estadísticas, worker automático, integración con picks, y sistema de snapshots

Este módulo **no puede lanzarse** en su estado actual bajo ninguna circunstancia, ya que **engaña al usuario** mostrando métricas falsas que parecen reales. Representa un riesgo serio para la integridad del producto.

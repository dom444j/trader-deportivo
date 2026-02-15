# Tipster Create Signal Module

## Concepto Central

**Crear Señal es el módulo donde el tipster publica picks estructurados que afectarán directamente su ROI, CLV, reputación, ranking y estadísticas públicas.**

No es un simple mensaje — es un evento medible y verificable que construye el historial profesional del tipster.

**Principio fundamental:** Cada señal publicada es un compromiso público. Una vez iniciado el evento, la señal no puede modificarse. Esto garantiza transparencia y trazabilidad total.

---

## 1. Filosofía del Módulo

### 1.1. Objetivo Central

**El objetivo NO es solo enviar picks — es construir un historial profesional verificable del tipster.**

```javascript
const MODULE_PHILOSOPHY = {
  primary_goal: 'Construir reputación verificable',
  
  not_about: [
    'enviar mensajes rápidos',
    'publicar sin análisis',
    'editar resultados después'
  ],
  
  is_about: [
    'crear historial profesional',
    'transparencia total',
    'compromiso público medible',
    'estadísticas auditables'
  ],
  
  impact: {
    affects_roi: true,
    affects_clv: true,
    affects_reputation: true,
    affects_ranking: true,
    affects_public_stats: true
  }
}
```

### 1.2. Compromiso de Transparencia

```
Una señal publicada = compromiso público

✅ Odds registradas al momento de publicación
✅ Análisis visible (según access_type)
✅ Resultado verificable
✅ CLV calculado automáticamente
✅ Estadísticas actualizadas en tiempo real

❌ No editable después del evento
❌ No borrable una vez published
❌ No modificable después de 3 minutos
```

---

## 2. Propósito del Módulo

Crear Señal tiene **7 objetivos estratégicos:**

1. **Publicación estructurada** — Datos completos y consistentes
2. **Trazabilidad total** — Odds, análisis, resultado registrados
3. **Control de acceso** — FREE, CREDITS, SUBSCRIPTION
4. **Profesionalismo** — Análisis completo, no solo "tips"
5. **Medibilidad** — Cada señal afecta estadísticas
6. **Transparencia** — No editable post-evento
7. **Reputación** — Historial verificable y público

---

## 3. Tipos de Señal (Access Type)

### 3.1. Opciones de Acceso

```typescript
enum AccessType {
  FREE = 'free',                          // Visible para todos
  CREDITS = 'credits',                    // Pago por créditos
  SUBSCRIPTION_GENERAL = 'subscription_general',   // Plan general
  SUBSCRIPTION_PERSONAL = 'subscription_personal'  // Premium personal
}
```

### 3.2. FREE

```typescript
interface FreeSignal {
  access_type: 'free'
  
  visibility: {
    who_can_see: 'cualquier usuario',
    who_can_view_analysis: 'todos',
    appears_in: [
      'public feed',
      'tipster profile',
      'search results'
    ]
  }
  
  monetization: false
  
  purpose: 'Construir audiencia, demostrar skills'
}
```

**Casos de uso:**
- Tipster nuevo construyendo reputación
- Señales de bajo riesgo para atraer seguidores
- Promoción de plan de pago

### 3.3. CREDITS

```typescript
interface CreditsSignal {
  access_type: 'credits'
  
  // Campos adicionales obligatorios
  credit_cost: number  // el tipster elige el precio dentro de rangos min/máx permitidos por la plataforma (pricing administrable)

  visibility: {
    who_can_see_teaser: 'todos',
    who_can_see_analysis: 'usuarios que pagaron créditos',
    appears_in: [
      'public feed (teaser)',
      'tipster profile',
      'marketplace'
    ]
  }
  
  teaser_content: {
    shows: [
      'evento',
      'liga',
      'fecha',
      'cuota aproximada',
      'análisis parcial (primeras 2 líneas)'
    ],
    hides: [
      'selección exacta',
      'análisis completo',
      'stake sugerido'
    ]
  }
  
  unlock_flow: {
    user_clicks: 'Ver Señal',
    user_pays: 'X créditos',
    user_sees: 'análisis completo + selección',
    tipster_earns: 'créditos a su wallet'
  }
}
```

**Casos de uso:**
- Señales premium de alta confianza
- Picks con análisis profundo
- Insider information

**Pricing sugerido:**
- 3 créditos: confianza media
- 5 créditos: alta confianza
- 10 créditos: muy alta confianza
- 15-20 créditos: insider/especial

### 3.4. SUBSCRIPTION_GENERAL

```typescript
interface SubscriptionGeneralSignal {
  access_type: 'subscription_general'
  
  visibility: {
    who_can_see: 'usuarios suscritos al plan del tipster',
    appears_in: [
      'tipster profile (para suscriptores)',
      'subscriber feed',
      'notifications'
    ]
  }
  
  plan_tiers: {
    basic: false,
    pro: true,
    premium: true
  },
  
  purpose: 'Contenido regular para suscriptores de plan'
}
```

**Casos de uso:**
- Señales diarias para suscriptores
- Contenido exclusivo del plan
- Valor recurrente para retención

### 3.5. SUBSCRIPTION_PERSONAL

```typescript
interface SubscriptionPersonalSignal {
  access_type: 'subscription_personal'
  
  visibility: {
    who_can_see: 'solo suscriptores premium personales del tipster',
    appears_in: [
      'private feed (solo premium)',
      'direct notifications'
    ]
  }
  
  exclusivity: 'máxima',
  
  purpose: 'Señales VIP para seguidores más comprometidos'
}
```

**Casos de uso:**
- Picks de máxima confianza
- Información privilegiada
- Relación 1-a-1 con seguidores VIP

---

## 4. Información del Evento Deportivo

### 4.1. Campos Obligatorios

```typescript
interface EventInfo {
  // Deporte
  sport: Sport  // 'football' | 'basketball' | 'tennis' | 'baseball' | 'hockey'
  
  // Liga
  league: string  // 'Premier League', 'NBA', 'ATP', etc.
  
  // Evento
  event_name: string  // auto-generado: "Team A vs Team B"
  
  // Participantes
  team_a: string  // o player_a para individuales
  team_b: string  // o player_b
  
  // Fecha y hora
  event_start_time: timestamp  // ISO 8601
  timezone: string  // 'UTC', 'America/New_York', etc.
  
  // Casa de apuesta (opcional pero recomendado)
  bookmaker_name?: string  // 'Bet365', 'Pinnacle', etc.
}
```

### 4.2. Validaciones de Evento

```javascript
const EVENT_VALIDATIONS = {
  // Fecha - ANTI-FRAUDE CRÍTICO
  start_time: {
    rule: 'must be in future',
    min_advance: '2 minutes',  // Protección anti-post-fraud
    error: 'No puedes publicar señales de eventos que ya iniciaron o iniciarán en menos de 2 minutos',
    fraud_protection: true,
    reason: 'Evita publicar picks cuando ya se conoce el resultado'
  },
  
  // Participantes
  teams: {
    rule: 'both required',
    error: 'Debes especificar ambos equipos/participantes'
  },
  
  // Liga
  league: {
    rule: 'must be from valid list',
    error: 'Liga no reconocida. Selecciona de la lista.'
  }
}
```

### 4.3. Auto-completado (Recomendado)

```javascript
// Sugerir eventos desde API deportiva
const AUTO_COMPLETE_FEATURES = {
  // Al escribir liga
  league_autocomplete: {
    source: 'sports_api',
    shows: 'top 10 ligas más populares',
    searchable: true
  },
  
  // Al escribir equipo
  team_autocomplete: {
    source: 'sports_api + league filter',
    shows: 'equipos de la liga seleccionada',
    prevents: 'typos y errores'
  },
  
  // Al seleccionar fecha
  upcoming_events: {
    source: 'sports_api',
    shows: 'eventos próximos en liga seleccionada',
    quick_fill: true
  }
}
```

---

## 5. Tipo de Mercado

### 5.1. Market Types

```typescript
enum MarketType {
  MONEYLINE = 'moneyline',           // Ganador directo
  OVER_UNDER = 'over_under',         // Totales
  ASIAN_HANDICAP = 'asian_handicap', // Hándicap asiático
  BTTS = 'btts',                     // Both Teams to Score
  CORRECT_SCORE = 'correct_score',   // Resultado exacto
  PROPS = 'props'                    // Props (jugador, sets, etc.)
}
```

### 5.2. Campos por Mercado

```typescript
interface MarketSelection {
  market_type: MarketType
  
  // Selección específica
  selection: string
  // Ejemplos:
  // - Moneyline: "Liverpool ML"
  // - Over/Under: "Over 2.5"
  // - Handicap: "Arsenal -1.5"
  // - BTTS: "Yes"
  // - Correct Score: "2-1"
  // - Props: "Messi 2+ goals"
  
  // Odds al momento de publicación
  odds: number  // ej: 2.50
  
  // IMPORTANTE: Guardado como published_odds
  // published_odds: number  // mismo valor, usado para CLV
  // Regla explícita (COMBO/SYSTEM): published_odds = producto de las cuotas individuales de todos los picks al momento de publicar (total_odds = ∏ picks[i].odds)
  // Línea (si aplica)
  line?: number  // ej: 2.5 en Over/Under, -1.5 en Handicap
}
```

### 5.3. Published Odds (CRÍTICO)

```javascript
/**
 * Las odds al momento de publicación son CRÍTICAS
 * porque se usarán para calcular CLV (Closing Line Value)
 */
const PUBLISHED_ODDS_IMPORTANCE = {
  // Guardado inmutable
  field: 'published_odds',
  immutable: true,
  
  // Usado para
  used_for: {
    clv_calculation: {
      formula: 'CLV = (closing_odds - published_odds) / published_odds',
      example: 'published: 2.50, closing: 2.60 → CLV = +4%'
    },
    
    roi_calculation: {
      based_on: 'published_odds',
      not: 'closing_odds'
    },
    
    transparency: {
      users_see: 'odds cuando tipster publicó',
      not: 'odds cuando usuario vio'
    }
  },
  
  // Validación
  validation: {
    min_odds: 1.20,
    max_odds: 50.00,
    decimals: 2
  }
}
```

### 5.4. Settlement Rule (OBLIGATORIO - Determina cómo se liquida)

```typescript
/**
 * Define cómo el sistema evalúa si la señal gana o pierde
 * Este campo es invisible para usuarios pero crítico para automatización
 * Se guarda automáticamente basado en mercado + selección
 */
enum SettlementRule {
  // Moneyline
  MONEYLINE_HOME = 'moneyline_home',
  MONEYLINE_AWAY = 'moneyline_away',
  MONEYLINE_DRAW = 'moneyline_draw',
  
  // Over/Under
  OVER = 'over',
  UNDER = 'under',
  
  // Handicap
  HANDICAP_HOME = 'handicap_home',
  HANDICAP_AWAY = 'handicap_away',
  
  // Both Teams to Score
  BTTS_YES = 'btts_yes',
  BTTS_NO = 'btts_no',
  
  // Correct Score
  CORRECT_SCORE = 'correct_score',
  
  // Player Props
  PLAYER_WIN = 'player_win',
  PLAYER_OVER = 'player_over',
  PLAYER_UNDER = 'player_under'
}

/**
 * Ejemplos de mapeo mercado → settlement_rule
 */
const SETTLEMENT_RULES_MAP = {
  // Ejemplos reales
  'Over 2.5': SettlementRule.OVER,
  'Under 2.5': SettlementRule.UNDER,
  'Liverpool ML': SettlementRule.MONEYLINE_HOME,
  'Arsenal -1.5': SettlementRule.HANDICAP_HOME,
  'BTTS Yes': SettlementRule.BTTS_YES,
  'Messi 2+ goals': SettlementRule.PLAYER_OVER,
  'Correct Score 2-1': SettlementRule.CORRECT_SCORE
}

/**
 * Cómo se evalúa cada regla
 */
const SETTLEMENT_EVALUATION = {
  [SettlementRule.OVER]: {
    condition: 'goals > line',
    example: 'Over 2.5 → necesita 3+ goles',
    possible_outcomes: ['WON', 'LOST', 'VOID']
  },
  [SettlementRule.HANDICAP_HOME]: {
    condition: 'home_team_goals + handicap > away_team_goals',
    example: 'Handicap -1 → gana por 2+ goles',
    possible_outcomes: ['WON', 'LOST', 'VOID', 'PUSH']
  },
  [SettlementRule.BTTS_YES]: {
    condition: 'both_teams_score === true',
    example: 'Ambos equipos deben anotar',
    possible_outcomes: ['WON', 'LOST', 'VOID']
  }
}

/**
 * Posibles resultados de una señal (para estadísticas correctas)
 */
enum SignalOutcome {
  WON = 'won',
  LOST = 'lost', 
  VOID = 'void',
  PUSH = 'push',
  CANCELLED = 'cancelled'
}

/**
 * Explicación de cada outcome
 */
const OUTCOME_DEFINITIONS = {
  WON: {
    description: 'La selección fue correcta',
    profit: 'stake * (odds - 1)',
    example: 'Stake 1u @2.50 → +1.5u profit'
  },
  LOST: {
    description: 'La selección fue incorrecta', 
    profit: '-stake',
    example: 'Stake 1u → -1u loss'
  },
  VOID: {
    description: 'Evento suspendido/cancelado',
    profit: '0',
    example: 'Stake devuelta (0u profit/loss)'
  },
  PUSH: {
    description: 'Empate técnico (handicap 0, over/under exacto)',
    profit: '0', 
    example: 'Stake devuelta (0u profit/loss)'
  },
  CANCELLED: {
    description: 'Cancelado por tipster antes del evento',
    profit: '0',
    example: 'Stake devuelta (0u profit/loss)'
  }
}
  // Moneyline
  MONEYLINE_HOME = 'moneyline_home',
  MONEYLINE_AWAY = 'moneyline_away',
  MONEYLINE_DRAW = 'moneyline_draw',
  
  // Over/Under
  OVER = 'over',
  UNDER = 'under',
  
  // Handicap
  HANDICAP_HOME = 'handicap_home',
  HANDICAP_AWAY = 'handicap_away',
  
  // Both Teams to Score
  BTTS_YES = 'btts_yes',
  BTTS_NO = 'btts_no',
  
  // Correct Score
  CORRECT_SCORE = 'correct_score',
  
  // Player Props
  PLAYER_WIN = 'player_win',
  PLAYER_OVER = 'player_over',
  PLAYER_UNDER = 'player_under'
}

/**
 * Ejemplos de mapeo mercado → settlement_rule
 */
const SETTLEMENT_RULES_MAP = {
  // Ejemplos reales
  'Over 2.5': SettlementRule.OVER,
  'Under 2.5': SettlementRule.UNDER,
  'Liverpool ML': SettlementRule.MONEYLINE_HOME,
  'Arsenal -1.5': SettlementRule.HANDICAP_HOME,
  'BTTS Yes': SettlementRule.BTTS_YES,
  'Messi 2+ goals': SettlementRule.PLAYER_OVER,
  'Correct Score 2-1': SettlementRule.CORRECT_SCORE
}

/**
 * Cómo se evalúa cada regla
 */
const SETTLEMENT_EVALUATION = {
  [SettlementRule.OVER]: {
    condition: 'goals > line',
    example: 'Over 2.5 → necesita 3+ goles',
    possible_outcomes: ['WON', 'LOST', 'VOID']
  },
  [SettlementRule.HANDICAP_HOME]: {
    condition: 'home_team_goals + handicap > away_team_goals',
    example: 'Handicap -1 → gana por 2+ goles',
    possible_outcomes: ['WON', 'LOST', 'VOID', 'PUSH']
  },
  [SettlementRule.BTTS_YES]: {
    condition: 'both_teams_score === true',
    example: 'Ambos equipos deben anotar',
    possible_outcomes: ['WON', 'LOST', 'VOID']
  }
}
```

### 5.5. Closing Odds (CLV - Closing Line Value)

```typescript
/**
 * Las odds al cierre del evento se usan para calcular CLV
 * Se llena automáticamente cuando el evento empieza
 */
interface ClosingOdds {
  closing_odds: number  // Odds finales del mercado
  closing_time: timestamp  // Cuando se capturaron
  data_source: string  // Proveedor (Bet365, Pinnacle, etc.)
}

/**
 * Fórmula CLV
 */
const CLV_CALCULATION = {
  formula: 'CLV = (closing_odds - published_odds) / published_odds',
  example_positive: 'published: 2.50, closing: 2.60 → CLV = +4% (beat closing line)',
  example_negative: 'published: 2.50, closing: 2.40 → CLV = -4% (behind closing line)',
  
  importance: {
    tipster_skill: 'CLV positivo = tipster consistentemente obtiene mejor valor',
    long_term: 'CLV > 2% sobre 100+ picks = tipster profesional',
    ranking_factor: 'CLV influye fuertemente en ranking y credibilidad'
  }
}

/**
 * Closing Odds (se llena automáticamente cuando el evento empieza)
 */
interface ClosingOdds {
  closing_odds: number  // Odds finales del mercado
  closing_time: timestamp  // Cuando se capturaron
  data_source: string  // Proveedor (Bet365, Pinnacle, etc.)
}
```

---

## 6. Stake y Gestión de Riesgo

### 6.1. El Tipster NO Pone Dinero

```javascript
const STAKE_PHILOSOPHY = {
  tipster_role: 'Recomendar exposición, NO apostar',
  
  tipster_does_not: [
    'put own money',
    'execute bets',
    'guarantee results'
  ],
  
  tipster_does: [
    'suggest stake size',
    'indicate confidence',
    'provide risk assessment'
  ],
  
  user_responsibility: 'Adaptar a su propio bankroll'
}
```

### 6.2. Campos de Stake

```typescript
interface StakeRecommendation {
  // Nivel de confianza (obligatorio)
  confidence_level: 1 | 2 | 3 | 4 | 5  // estrellas
  
  // Unidades sugeridas (obligatorio)
  stake_units: number  // 1u, 2u, 3u, 4u, 5u — Aplica al ticket completo. En COMBO/SYSTEM, stake_units se aplica al total del ticket, no por pick individual.
  
  // Stake normalizado para estadísticas (obligatorio - se calcula automáticamente)
  normalized_stake: number  // Siempre 1.0 para cálculo de ROI estándar
  
  // Sugerencia de porcentaje máximo (opcional)
  max_stake_suggestion?: number  // ej: 3% del bankroll
  
  // Descripción de riesgo (opcional)
  risk_description?: 'low' | 'medium' | 'high'
}
```

### 6.2.1. Stake Normalizado (CRÍTICO para estadísticas)

```javascript
/**
 * El sistema usa unidades normalizadas para calcular estadísticas
 * No usa dinero real - solo unidades estadísticas
 */
const NORMALIZED_STAKE_SYSTEM = {
  // Base de cálculo
  base_unit: 1.0,  // 1 unidad = base estadística
  
  // Cálculo ROI
  roi_formula: 'ROI = (profit_units / total_units) * 100',
  example: '100 picks de 1u → 100u apostados, 110u devueltos = ROI 10%',
  
  // Por qué es importante
  importance: {
    tipster_ranking: 'ROI calculado con stake normalizado',
    comparability: 'Permite comparar tipsters objetivamente',
    no_money_involved: 'Sistema puro de unidades, no dinero real',
    professional_standard: 'Estándar de industria (Blogabet, Tipstrr)'
  },
  
  // Relación con stake_units
  mapping: {
    '0.5u': 0.5,
    '1u': 1.0,
    '2u': 2.0,
    '3u': 3.0,
    '4u': 4.0,
    '5u': 5.0
  }
}
```

### 6.3. Confidence Level

```javascript
const CONFIDENCE_LEVELS = {
  1: {
    stars: '⭐',
    label: 'Baja confianza',
    suggested_stake: '0.5-1u',
    description: 'Pick especulativo o de valor marginal'
  },
  
  2: {
    stars: '⭐⭐',
    label: 'Confianza media-baja',
    suggested_stake: '1-1.5u',
    description: 'Pick con fundamento pero riesgo moderado'
  },
  
  3: {
    stars: '⭐⭐⭐',
    label: 'Confianza media',
    suggested_stake: '1.5-2u',
    description: 'Pick sólido con análisis completo'
  },
  
  4: {
    stars: '⭐⭐⭐⭐',
    label: 'Alta confianza',
    suggested_stake: '2-3u',
    description: 'Pick muy fuerte con múltiples factores a favor'
  },
  
  5: {
    stars: '⭐⭐⭐⭐⭐',
    label: 'Máxima confianza',
    suggested_stake: '3-5u',
    description: 'Best bet, información privilegiada o edge claro'
  }
}
```

### 6.4. Nota al Usuario

```
⚠️ Importante:
El tipster recomienda exposición basada en su análisis.
TÚ decides cuánto apostar según tu bankroll y tolerancia al riesgo.

Ejemplo:
- Tipster sugiere: 3u
- Tu bankroll: $1,000
- Tu unidad: 1% = $10
- Tu stake: 3u × $10 = $30
```

### 6.5. Aviso de Responsabilidad de Confianza (Legal)

- El nivel de estrellas (confidence_level) NO representa una probabilidad matemática ni garantiza el resultado.
- Es una expresión de opinión basada en el análisis del tipster, su metodología y experiencia.
- No debe interpretarse como consejo financiero ni como "apuesta segura" (5⭐ ≠ certeza).
- La plataforma mostrará este aviso en las superficies de UI donde se visualice el confidence_level.

---

## 7. Análisis del Tipster

### 7.1. Campos de Análisis

```typescript
interface TipsterAnalysis {
  // Resumen corto (obligatorio)
  short_reason: string
  // Max: 240 caracteres
  // Aparece en: listas, feeds, teasers
  // Ejemplo: "Liverpool domina en casa vs equipos top 6. City sin KDB. Value en ML @2.50"
  
  // Análisis completo (obligatorio)
  full_analysis: string
  // Max: 5000 caracteres
  // Aparece en: detalle de señal (si tiene acceso)
  // Formato: texto largo, puede incluir markdown
  
  // Tags (opcional pero recomendado)
  tags: string[]
  // Ejemplos: ['lesiones', 'value', 'tendencia', 'estadística', 'info_interna']
  
  // Imagen/Gráfico (opcional)
  image_url?: string
  // Estadísticas visuales, gráficos, tablas
}
```

### 7.2. Short Reason (Aparece en Listas)

**Propósito:** Hook para atraer clicks/compras

**Buenas prácticas:**
```javascript
const SHORT_REASON_EXAMPLES = {
  good: [
    "Liverpool 8-0-2 en casa vs top 6. City sin KDB. Value @2.50",
    "Lakers 12-2 ATS como visitantes. Warriors en B2B. Over tiene valor",
    "Nadal 15-2 H2H en arcilla. Forma ascendente. ML seguro @1.80"
  ],
  
  bad: [
    "Apuesta al Liverpool",  // muy vago
    "Buena cuota",           // sin fundamento
    "Confianza alta"         // sin análisis
  ]
}
```

**Validaciones:**
- Min: 50 caracteres
- Max: 240 caracteres
- Debe incluir: fundamento (no solo opinión)

### 7.3. Full Analysis (Análisis Completo)

**Estructura recomendada:**

```markdown
## Situación del Partido
[Contexto: liga, posiciones, objetivos]

## Factores Clave
1. **Factor A**: [explicación]
2. **Factor B**: [explicación]
3. **Factor C**: [explicación]

## Estadísticas Relevantes
- [Stat 1]
- [Stat 2]
- [Stat 3]

## Por Qué Veo Valor
[Explicación del edge]

## Riesgos a Considerar
[Qué podría salir mal]

## Conclusión
[Resumen + recomendación de stake]
```

**Validaciones:**
- Min: 200 caracteres
- Max: 5000 caracteres
- Debe incluir: fundamento objetivo (no solo corazonada)

### 7.4. Tags

```typescript
const AVAILABLE_TAGS = [
  // Análisis
  'estadística',
  'tendencia',
  'head_to_head',
  'forma_reciente',
  
  // Información
  'lesiones',
  'alineaciones',
  'info_interna',
  'insider',
  
  // Value
  'value',
  'arbitraje',
  'clv_positivo',
  'market_inefficiency',
  
  // Timing
  'early_value',
  'live_opportunity',
  'line_movement',
  
  // Risk
  'high_risk',
  'safe_bet',
  'hedge_opportunity'
]
```

---

## 8. Sistema de Detección de Fraude (CRÍTICO)

### 8.1. Anti-Post Fraud Protection

```typescript
/**
 * PROTECCIÓN PRINCIPAL: Evita publicar señales de eventos ya iniciados
 * Esta es la protección más importante contra tipsters fraudulentos
 */
const ANTI_POST_FRAUD_SYSTEM = {
  // Validación en tiempo real al publicar
  real_time_validation: {
    event_start_time: {
      rule: 'must_be_future',
      minimum_advance: '2 minutes',
      error: 'No puedes publicar señales de eventos que ya iniciaron',
      block_publication: true
    },
    
    market_status: {
      rule: 'must_be_active',
      source: 'sports_api',
      error: 'Este mercado ya está cerrado',
      block_publication: true
    },
    
    odds_freshness: {
      rule: 'validate_current_odds',
      max_age: '5 minutes',
      warning: 'Las odds pueden estar desactualizadas'
    }
  },
  
  // Detección de patrones sospechosos
  pattern_detection: {
    late_publishing: {
      trigger: 'publicar con < 5 minutos de anticipación',
      flag: 'suspicious_timing',
      action: 'review_required'
    },
    
    repeated_late_publishing: {
      trigger: '3+ señales publicadas tarde en 7 días',
      action: 'automatic_review',
      penalty: 'temporary_suspension'
    },
    
    impossible_timing: {
      trigger: 'publicar durante evento en vivo',
      action: 'immediate_block',
      penalty: 'account_flagged'
    }
  },
  
  // Penalizaciones
  penalties: {
    first_violation: {
      action: 'warning + educational_content',
      record: 'permanent_mark'
    },
    
    second_violation: {
      action: 'temporary_suspension_24h',
      notification: 'to_all_subscribers'
    },
    
    repeated_violations: {
      action: 'temporary_suspension_7d',
      penalty: 'loss_of_credits_earned',
      review: 'manual_review_required'
    },
    
    severe_cases: {
      action: 'permanent_ban',
      penalty: 'loss_of_all_credits + funds',
      public_disclosure: 'fraudulent_tipster_list'
    }
  }
}
```

### 8.2. Sistema de Auditoría

```typescript
const AUDIT_SYSTEM = {
  // Toda señal queda registrada permanentemente
  immutable_record: {
    published_odds: 'congeladas al momento de publicar',
    publication_time: 'timestamp exacto',
    event_start_time: 'validado contra API',
    settlement_rule: 'automáticamente asignado',
    user_agent: 'dispositivo usado',
    ip_address: 'para detección de múltiples cuentas'
  },
  
  // Transparencia total
  public_verification: {
    anyone_can_verify: 'odds y timing de publicación',
    blockchain_option: 'hash de señal publicado',
    third_party_verification: 'API deportiva integrada'
  }
}
```

---

## 9. Control de Publicación (Estados)

### 9.1. Signal Lifecycle

```typescript
enum SignalStatus {
  DRAFT = 'draft',            // Guardado, no visible
  SCHEDULED = 'scheduled',    // Programado con countdown
  PUBLISHED = 'published',    // Visible según access_type (compromiso público)
  LOCKED = 'locked',          // Evento iniciado → inmutable
  SETTLING = 'settling',      // Esperando resultado oficial
  SETTLED = 'settled',        // Resultado registrado (Win/Loss/Void/Half Win/Half Loss/Push)
  ARCHIVED = 'archived'       // Histórica (solo lectura)
  // Opcional operativamente: CANCELLED antes de inicio por causas válidas (mantenimiento, duplicado, etc.)
}
```

### 8.2. Reglas por Estado

```javascript
const STATUS_RULES = {
  draft: {
    editable: true,
    deletable: true,
    visible: false,
    transitions: ['scheduled', 'published']
  },
  
  scheduled: {
    editable: true,
    deletable: true,
    visible: true, // visible en countdown (teaser sin selección)
    countdown: true,
    edit_cutoff_minutes: 10,
    // En COMBO/SYSTEM: edit_cutoff_at = MIN(picks[].event_start_time) - 10 minutos
    transitions: ['published']
  },
  
  published: {
    editable: false, // NO editable (bloqueada por compromiso público)
    deletable: false,
    visible: true,
    auto_lock_at: 'event_start_time',
    // COMBO/SYSTEM: event_start_time de la señal = MIN(picks[].event_start_time)
    transitions: ['locked']
  },
  
  locked: {
    editable: false,  // IMMUTABLE
    deletable: false,
    visible: true,
    reason: 'Evento iniciado',
    transitions: ['settling']
  },
  
  settling: {
    editable: false,
    deletable: false,
    visible: true,
    reason: 'Esperando resultado oficial (feed proveedor/house rules)'
    ,transitions: ['settled']
  },
  
  settled: {
    editable: false,  // FINAL
    deletable: false,
    visible: true,
    final_state: true,
    transitions: ['archived']
  },
  
  archived: {
    editable: false,
    deletable: false,
    visible: true, // histórica en perfil/timeline
    final_state: true,
    transitions: []
  }
}

/**
 * Señal Trackeada vs Solo Publicada
 */
const TRACKED_SIGNAL_SYSTEM = {
  /**
   * tracked = true (default): La señal entra en estadísticas públicas del tipster
   * tracked = false: Solo visible, no afecta ROI/ranking
   */
  tracked: {
    default: true,
    purpose: 'Toda señal publicada entra a estadísticas automáticamente',
    exception: 'Solo para señales de marketing que no deben contar para stats'
  },
  
  implications: {
    tracked_true: {
      affects_roi: true,
      affects_ranking: true,
      affects_public_stats: true,
      visible_in: ['profile', 'leaderboards', 'analytics']
    },
    tracked_false: {
      affects_roi: false,
      affects_ranking: false,
      affects_public_stats: false,
      visible_in: ['feed only']
    }
  }
}
```

### 8.3. Edit Rules (Tiempo límite de edición)

```javascript
/**
 * CRÍTICO: La señal puede editarse hasta 10 minutos antes del evento
 * - SINGLE: cutoff = event_start_time - 10 min
 * - COMBO/SYSTEM: cutoff = MIN(picks[].event_start_time) - 10 min
 * Después del cutoff → Pasa a estado "no editable" (mantiene PUBLISHED hasta el inicio, luego LOCKED)
 * Cualquier modificación posterior queda prohibida
 */
const EDIT_RULES = {
  edit_cutoff_minutes: 10,
  compute_cutoff(signal) {
    const firstStart = signal.bet_structure === 'combo' || signal.bet_structure === 'system'
      ? Math.min(...signal.picks.map(p => p.event_start_time))
      : signal.event_start_time
    return firstStart - (10 * 60 * 1000)
  },
  enforcement: {
    ui: 'mostrar countdown hasta cutoff (ej. "Editable por 00:09:59")',
    backend: 'rechazar PUT/PATCH si NOW >= edit_cutoff',
    error: 'No puedes editar señales a menos de 10 minutos del inicio del evento'
  },
  protects: ['CLV', 'ROI', 'transparencia']
}
```

### 8.4. Auto-Lock (Evento Iniciado)

```javascript
/**
 * CRÍTICO: Auto-lock al inicio del evento
 */
const AUTO_LOCK = {
  trigger: 'event_start_time',
  // En COMBO/SYSTEM, usar MIN(picks[].event_start_time)
  cron: '* * * * *',
  query: `
    UPDATE signals
    SET status = 'locked', locked_at = NOW()
    WHERE status = 'published'
    AND event_start_time <= NOW()
  `,
  effects: {
    no_edit: true,
    no_delete: true,
    no_cancel: true,
    ready_to_settle: true
  }
}
```

### 8.5. Public Commitment Rules

- Al publicar una señal el tipster acepta que las odds quedan registradas (published_odds es INMUTABLE). 
- No puede borrar la señal tras publicar. 
- La publicación afecta sus estadísticas públicas (ROI, yield, streaks) y su ranking. 
- Impacta su credibilidad ante la comunidad (audit trail visible). 
- No puede sustituir picks ni cambiar la estructura del ticket después de publicar. 
- El precio (credit_cost) queda congelado al momento de publicación; ver "Pricing Lock Rule".

### 8.5. Settlement Rule (OBLIGATORIO - Determina cómo se liquida)

```typescript
enum SettlementRule {
  // Moneyline
  MONEYLINE_HOME = 'moneyline_home',
  MONEYLINE_AWAY = 'moneyline_away',
  MONEYLINE_DRAW = 'moneyline_draw',
  
  // Over/Under
  OVER = 'over',
  UNDER = 'under',
  
  // Asian Handicap
  HANDICAP_HOME = 'handicap_home',
  HANDICAP_AWAY = 'handicap_away',
  
  // BTTS
  BTTS_YES = 'btts_yes',
  BTTS_NO = 'btts_no',
  
  // Correct Score
  CORRECT_SCORE = 'correct_score',
  
  // Player Props
  PLAYER_TO_SCORE = 'player_to_score',
  PLAYER_ASSISTS = 'player_assists',
  PLAYER_CARDS = 'player_cards'
}
```

**Ejemplos de SETTLEMENT_RULES_MAP:**

```javascript
const SETTLEMENT_RULES_MAP = {
  // Ejemplo 1: Real Madrid vs Barcelona
  '1X2': {
    market: 'Match Winner',
    selection: 'Real Madrid',
    settlement_rule: 'moneyline_home',
    evaluation: 'Real Madrid gana → WIN, empate o pierde → LOSS'
  },
  
  // Ejemplo 2: Over/Under
  'Over 2.5 Goals': {
    market: 'Total Goals',
    selection: 'Over 2.5',
    settlement_rule: 'over',
    evaluation: '3+ goles → WIN, 0-2 goles → LOSS'
  },
  
  // Ejemplo 3: Asian Handicap
  'AH -1 Home': {
    market: 'Asian Handicap',
    selection: 'Home -1',
    settlement_rule: 'handicap_home',
    evaluation: 'Gana por 2+ → WIN, gana por 1 → PUSH, empate/pierde → LOSS'
  },
  
  // Ejemplo 4: BTTS
  'BTTS Yes': {
    market: 'Both Teams to Score',
    selection: 'Yes',
    settlement_rule: 'btts_yes',
    evaluation: 'Ambos anotan → WIN, alguno no → LOSS'
  }
}
```

**SETTLEMENT_EVALUATION detallada:**

```javascript
const SETTLEMENT_EVALUATION = {
  moneyline_home: {
    WIN: 'home_score > away_score',
    LOSS: 'home_score <= away_score',
    VOID: 'partido suspendido/cancelado',
    examples: ['1-0 → WIN', '1-2 → LOSS', 'suspended → VOID']
  },
  
  over: {
    WIN: 'total_goals > line',
    LOSS: 'total_goals < line',
    PUSH: 'total_goals == line',
    VOID: 'partido suspendido',
    examples: ['Over 2.5 + 3 goles → WIN', 'Over 2.5 + 2 goles → LOSS', 'Over 2.5 + 2.5 → PUSH']
  },
  
  handicap_home: {
    WIN: '(home_score - handicap) > away_score',
    LOSS: '(home_score - handicap) < away_score',
    PUSH: '(home_score - handicap) == away_score',
    VOID: 'partido suspendido',
    examples: ['AH -1 + 2-0 → WIN', 'AH -1 + 1-0 → PUSH', 'AH -1 + 0-0 → LOSS']
  },
  
  btts_yes: {
    WIN: 'home_score > 0 && away_score > 0',
    LOSS: 'home_score == 0 || away_score == 0',
    VOID: 'partido suspendido',
    examples: ['1-1 → WIN', '1-0 → LOSS', '0-0 → LOSS']
  }
}
```

**⚠️ CRÍTICO: Este campo es obligatorio y se usa para:**
- Automatizar la liquidación de señales
- Calcular ROI, yield, hit rate correctamente
- Generar rankings confiables
- Evitar disputas sobre resultados

**Sin settlement_rule → el sistema no puede determinar si una señal ganó o perdió.**

### 8.5.1. Closing Odds (CLV - Closing Line Value)

```typescript
interface ClosingOdds {
  closing_odds: number;        // Odds al cierre del mercado
  closing_time: timestamp;     // Momento del cierre
  data_source: string;       // Fuente: Cloudbet, Pinnacle, etc.
  market_suspended: boolean; // Si el mercado fue suspendido
}
```

**CLV_CALCULATION:**

```javascript
const CLV_CALCULATION = {
  formula: 'CLV = closing_odds - published_odds',
  
  positive_clv: {
    description: 'closing_odds > published_odds',
    meaning: 'El tipster obtuvo mejor precio que el cierre',
    skill_indicator: 'ALTO (buen timing)',
    example: 'Publicado @2.20, cierra @2.00 → CLV +0.20'
  },
  
  negative_clv: {
    description: 'closing_odds < published_odds',
    meaning: 'El tipster obtuvo peor precio que el cierre',
    skill_indicator: 'BAJO (mal timing)',
    example: 'Publicado @2.00, cierra @2.20 → CLV -0.20'
  },
  
  zero_clv: {
    description: 'closing_odds = published_odds',
    meaning: 'El precio no se movió',
    skill_indicator: 'NEUTRO',
    example: 'Publicado @2.00, cierra @2.00 → CLV 0.00'
  },
  
  clv_percentage: {
    formula: 'CLV% = (closing_odds - published_odds) / published_odds * 100',
    example: '+0.20 / 2.00 * 100 = +10% CLV',
    importance: 'Métrica clave para ranking de tipsters'
  }
}
```

**Por qué CLV es crítico para rankings:**

```javascript
const CLV_RANKING_IMPORTANCE = {
  correlation: 'CLV positivo → ROI positivo (70%+ correlación)',
  
  skill_measurement: {
    description: 'CLV mide habilidad de timing, no solo suerte',
    advantage: 'Tipsters con +CLV consistente son mejores largo plazo'
  },
  
  platform_credibility: {
    description: 'Mostrar CLV aumenta confianza en rankings',
    transparency: 'Usuarios ven si tipsters baten el cierre'
  },
  
  automated_collection: {
    trigger: 'Evento empieza → sistema captura closing_odds',
    sources: ['Cloudbet API', 'Pinnacle', 'Bet365'],
    timing: '5 minutos antes del evento'
  }
}
```

**⚠️ CLV es la métrica más importante para evaluar skill de tipster a largo plazo.**

### 8.6. Settlement Types (Resultados posibles)

```typescript
enum SettlementOutcome {
  WIN = 'win',
  LOSS = 'loss',
  VOID = 'void',
  HALF_WIN = 'half_win',
  HALF_LOSS = 'half_loss',
  PUSH = 'push',
  CANCELLED = 'cancelled'
}
```

**Definición detallada de cada outcome:**

```javascript
const SETTLEMENT_OUTCOMES = {
  WIN: {
    description: 'Señal ganadora',
    profit_calculation: '+stake_units * (odds - 1)',
    example: '1u @2.50 → +1.5u profit',
    color: 'green',
    impact: 'positivo en ROI'
  },
  
  LOSS: {
    description: 'Señal perdedora',
    profit_calculation: '-stake_units',
    example: '1u @2.50 → -1u loss',
    color: 'red',
    impact: 'negativo en ROI'
  },
  
  VOID: {
    description: 'Evento suspendido/cancelado',
    profit_calculation: '0 (stake devuelto)',
    example: '1u → 0u (sin pérdida ni ganancia)',
    color: 'gray',
    impact: 'neutral en ROI',
    triggers: ['partido suspendido', 'jugador no participa', 'mercado cancelado']
  },
  
  PUSH: {
    description: 'Empate en handicap o línea exacta',
    profit_calculation: '0 (stake devuelto)',
    example: 'Handicap 0-0 → push, stake devuelto',
    color: 'gray',
    impact: 'neutral en ROI',
    triggers: ['handicap 0', 'línea exacta alcanzada']
  },
  
  HALF_WIN: {
    description: 'Medio stake ganador (Asian Handicap +0.25)',
    profit_calculation: '+stake_units * (odds - 1) * 0.5',
    example: '1u @2.00 → +0.5u profit',
    color: 'light-green',
    impact: 'positivo en ROI'
  },
  
  HALF_LOSS: {
    description: 'Medio stake perdedor (Asian Handicap -0.25)',
    profit_calculation: '-stake_units * 0.5',
    example: '1u → -0.5u loss',
    color: 'light-red',
    impact: 'negativo en ROI'
  },
  
  CANCELLED: {
    description: 'Señal cancelada por tipster antes del evento',
    profit_calculation: '0 (no entra en estadísticas)',
    example: 'Cancelada por duplicado → no cuenta',
    color: 'gray',
    impact: 'no afecta estadísticas',
    restrictions: ['solo antes del evento', 'requiere aprobación admin']
  }
}
```

**Casos comunes por mercado:**

```javascript
const COMMON_OUTCOMES_BY_MARKET = {
  'Over/Under': {
    OVER_2_5: {
      '3+ goles': 'WIN',
      '0-2 goles': 'LOSS',
      'partido suspendido 1-1': 'VOID'
    }
  },
  
  'Asian Handicap': {
    HOME_MINUS_1: {
      'gana 2-0': 'WIN',
      'gana 1-0': 'PUSH',
      'empata 0-0': 'LOSS',
      'gana 3-1': 'WIN'
    }
  },
  
  'BTTS': {
    YES: {
      'ambos anotan': 'WIN',
      'solo uno anota': 'LOSS',
      '0-0': 'LOSS',
      'partido suspendido': 'VOID'
    }
  }
}
```

- Estos tipos son obligatorios para el cálculo correcto de ROI y leaderboard. 
- La liquidación debe adherir a las house rules del proveedor (ej. Cloudbet) para consistencia operativa.
- **VOID es crítico**: partidos suspendidos, jugadores que no participan, mercados cancelados.

### 8.7. Combo Settlement Rule (COMBO/SYSTEM)

- Si cualquier leg pierde → Resultado global: LOSS. 
- Si uno o más legs son VOID/PUSH → recalcular published_odds excluyendo legs VOID (odds = 1 para PUSH), y liquidar en base al producto restante. 
- Si todos los legs ganan → Resultado global: WIN. 
- El stake se aplica al ticket completo (no por leg individual). 
- Registrar a nivel de sistema: outcome por leg + outcome global, y published_odds_recalculated si aplica.

### 8.8. Cancel Abuse Protection

- El tipster NO puede borrar picks perdedores, reemplazar picks ni re-publicar con otras odds para la misma señal. 
- La plataforma debe registrar historial permanente (audit log) incluyendo: versions, diffs de análisis, cambios de stake, timestamps, IP/agent. 
- Señales publicadas son inmutables salvo cancelación operativa validada por Admin (ej. duplicado, fraude evidente), con huella de auditoría. 
- Cualquier intento de manipulación debe reflejarse en un flag de riesgo para protección de la comunidad.

### 8.9. Tracked Signal Flag (Estadísticas)

```typescript
interface SignalTracking {
  tracked: boolean;        // true por defecto
  tracking_reason?: string; // Razón si no se trackea
  exclude_from_stats?: boolean;
}
```

**Tipos de señales:**

```javascript
const TRACKED_TYPES = {
  PUBLIC_TRACKED: {
    description: 'Señal pública que entra en estadísticas',
    tracked: true,
    examples: ['Señal FREE', 'Señal de pago', 'Señal de suscripción'],
    impact: 'SÍ afecta ROI, hit rate, ranking'
  },
  
  PUBLIC_NOT_TRACKED: {
    description: 'Señal pública pero NO entra en estadísticas',
    tracked: false,
    examples: ['Señal de marketing', 'Señal de prueba'],
    impact: 'NO afecta estadísticas',
    restrictions: ['debe estar claramente marcada', 'no puede ser engañosa']
  },
  
  PRIVATE_TRACKED: {
    description: 'Señal privada que SÍ entra en estadísticas del tipster',
    tracked: true,
    examples: ['Señal para grupo VIP', 'Señal personal'],
    impact: 'SÍ afecta estadísticas internas'
  }
}
```

**Reglas importantes:**

```javascript
const TRACKING_RULES = {
  default_behavior: 'tracked = true (todas las señales publicadas)',
  
  opt_out: {
    allowed: true,
    requirements: ['razón válida', 'notificación a usuarios', 'no abuso'],
    examples: ['señal educativa', 'señal de análisis']
  },
  
  fraud_prevention: {
    description: 'No se permite excluir señales perdedoras',
    enforcement: 'sistema detecta patrones sospechosos',
    penalty: 'flag de riesgo + revisión manual'
  }
}
```

### 8.9.1. Anti-Fraud Validation (Protección contra post-evento)

```typescript
interface AntiFraudRules {
  min_time_before_event: number; // 2 minutos por defecto
  max_future_event_time: number; // 7 días máximo
  event_started_validation: boolean;
}
```

**VALIDACIONES obligatorias:**

```javascript
const ANTI_FRAUD_VALIDATION = {
  time_validation: {
    rule: 'event_datetime > now + 2 minutes',
    reason: 'Evitar publicar cuando el resultado es conocido',
    error_message: 'No puedes publicar señales para eventos que ya empezaron',
    examples: [
      'Partido 15:00, ahora 14:58 → RECHAZADO',
      'Partido 15:00, ahora 14:30 → ACEPTADO'
    ]
  },
  
  future_limit: {
    rule: 'event_datetime <= now + 7 days',
    reason: 'Evitar señales para eventos muy lejanos',
    error_message: 'El evento debe estar dentro de los próximos 7 días'
  },
  
  market_suspension: {
    rule: 'mercado NO debe estar suspendido',
    check: 'validar contra API del bookmaker',
    error_message: 'El mercado está suspendido, no se puede publicar'
  },
  
  odds_validation: {
    rule: 'odds dentro de rango razonable',
    min_odds: 1.01,
    max_odds: 1000,
    error_message: 'Odds fuera de rango válido'
  }
}
```

**Sistema de detección:**

```javascript
const FRAUD_DETECTION_SYSTEM = {
  real_time_checks: {
    event_time: 'validar al momento de publicar',
    market_status: 'verificar si mercado está activo',
    odds_freshness: 'confirmar odds actuales'
  },
  
  pattern_detection: {
    late_publishing: 'detectar tipsters que siempre publican tarde',
    suspicious_timing: 'flag si publican justo antes de eventos',
    repeated_violations: 'escalar a revisión manual'
  },
  
  penalties: {
    first_violation: 'advertencia + educación',
    repeated_violations: 'suspensión temporal',
    severe_cases: 'ban permanente + pérdida de créditos'
  }
}
```

**⚠️ Esta validación es CRÍTICA para la credibilidad de la plataforma.**

### 8.9.2. Pricing Lock Rule (Créditos)

- El precio (credit_cost) queda CONGELADO al momento de publicación: credit_cost_locked = credit_cost y se registra price_locked_at.
- No puede modificarse después de publicar esa señal.
- Usuarios que compraron mantienen acceso permanente a la señal en su cuenta, incluso si el tipster cambia precios en señales futuras.
- Cambios de precio solo aplican para señales futuras; no son retroactivos.
- Intentos de cambio de precio post-publicación serán rechazados por backend, con registro en audit trail.
- Estos campos deben guardarse en el modelo: credit_cost_locked y price_locked_at.

---

## 8.10. Signal Lifecycle (Flujo completo)

```typescript
enum SignalStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  LOCKED = 'locked',
  RESULT_PENDING = 'result_pending',
  SETTLED = 'settled',
  CANCELLED = 'cancelled'
}
```

**Flujo completo:**

```javascript
const SIGNAL_LIFECYCLE = {
  // 1. Creación
  draft: {
    description: 'Tipster crea señal',
    editable: true,
    visible: false,
    actions: ['guardar borrador', 'publicar ahora', 'programar']
  },
  
  // 2. Publicación
  published: {
    description: 'Señal visible a usuarios',
    editable: true,
    visible: true,
    actions: ['editar hasta cutoff', 'cancelar'],
    triggers: ['notificaciones', 'feed update']
  },
  
  // 3. Cierre de edición
  locked: {
    description: 'Cutoff alcanzado (10 min antes)',
    editable: false,
    visible: true,
    actions: ['esperar resultado'],
    triggers: ['congelar odds', 'bloquear edición']
  },
  
  // 4. Evento finalizado
  result_pending: {
    description: 'Evento terminó, esperando datos',
    editable: false,
    visible: true,
    actions: ['capturar resultado', 'calcular settlement'],
    automation: 'sistema detecta fin del evento'
  },
  
  // 5. Liquidación completa
  settled: {
    description: 'Señal liquidada con resultado',
    editable: false,
    visible: true,
    actions: ['actualizar estadísticas', 'notificar resultado'],
    outcomes: ['WIN', 'LOSS', 'VOID', 'PUSH', 'CANCELLED']
  },
  
  // 6. Cancelación (si aplica)
  cancelled: {
    description: 'Señal cancelada antes del evento',
    editable: false,
    visible: false,
    actions: ['notificar cancelación'],
    impact: 'no afecta estadísticas'
  }
}
```

**Transiciones automáticas:**

```javascript
const AUTOMATIC_TRANSITIONS = {
  // Draft → Published
  publish_now: {
    trigger: 'tipster presiona "Publicar Ahora"',
    validation: ['anti-fraud', 'campos obligatorios'],
    actions: ['enviar notificaciones', 'actualizar feed']
  },
  
  // Published → Locked
  auto_lock: {
    trigger: 'event_datetime - 10 minutes',
    cron: 'cada minuto',
    actions: ['congelar published_odds', 'deshabilitar edición']
  },
  
  // Locked → Result Pending
  event_end: {
    trigger: 'evento finaliza (API)',
    detection: 'sistema monitorea resultados',
    actions: ['capturar closing_odds', 'preparar liquidación']
  },
  
  // Result Pending → Settled
  auto_settle: {
    trigger: 'resultado confirmado',
    source: 'API de datos deportivos',
    actions: ['calcular outcome', 'actualizar stats del tipster']
  }
}
```

**Campos clave por estado:**

```javascript
const STATUS_SPECIFIC_FIELDS = {
  published: {
    published_at: 'timestamp',
    published_odds: 'number',
    credit_cost_locked: 'number'
  },
  
  locked: {
    locked_at: 'timestamp',
    cutoff_reached_at: 'timestamp'
  },
  
  settled: {
    settlement_outcome: 'SettlementOutcome',
    settlement_rule: 'SettlementRule',
    profit_units: 'number',
    closing_odds: 'number',
    clv: 'number'
  }
}
```

**⚠️ Este flujo completo convierte tu sistema en un tracker profesional verificable.**

---

## 9. Programación (Scheduled Publish)

### 9.1. Publish Options

```typescript
interface PublishOptions {
  // Publicar ahora
  publish_now: {
    action: 'immediate',
    status_change: 'draft → published',
    notifications: 'sent immediately'
  }
  
  // Programar publicación
  schedule: {
    publish_at: timestamp,
    status_change: 'draft → scheduled',
    auto_publish: true,
    notifications: 'sent at publish_at'
  }
}
```

### 9.2. Casos de Uso de Scheduled

```javascript
const SCHEDULED_USE_CASES = {
  // Publicar 1h antes del partido
  pre_event: {
    example: 'Partido a las 15:00, publicar a las 14:00',
    reason: 'Odds aún estables, usuarios tienen tiempo de ver'
  },
  
  // Batch publishing
  multiple_signals: {
    example: 'Programar 5 señales para diferentes horarios del día',
    reason: 'No saturar el feed, publicación espaciada'
  },
  
  // Timezone management
  timezone_aware: {
    example: 'Publicar a las 9am hora local de seguidores',
    reason: 'Máxima visibilidad'
  }
}
```

### 9.3. Scheduled → Published (Auto)

```javascript
/**
 * Cron job para auto-publicar señales programadas
 */
const AUTO_PUBLISH_CRON = {
  frequency: '* * * * *',  // cada minuto
  
  query: `
    UPDATE signals
    SET status = 'published', published_at = NOW()
    WHERE status = 'scheduled'
    AND publish_at <= NOW()
  `,
  
  post_action: {
    send_notifications: true,
    update_feed: true,
    increment_tipster_signals_count: true
  }
}
```

---

## 10. Notificaciones Automáticas

### 10.1. Segmentación por Access Type

```typescript
interface NotificationRules {
  FREE: {
    notify: 'todos los seguidores del tipster',
    message: 'full signal details',
    channels: ['push', 'email', 'in_app']
  }
  
  CREDITS: {
    notify: 'usuarios interesados en el tipster',
    message: 'teaser (sin selección exacta)',
    channels: ['push', 'in_app'],
    cta: 'Desbloquear por X créditos'
  }
  
  SUBSCRIPTION_GENERAL: {
    notify: 'suscriptores del plan',
    message: 'full signal details',
    channels: ['push', 'email', 'in_app'],
    exclude: 'usuarios sin plan activo'
  }
  
  SUBSCRIPTION_PERSONAL: {
    notify: 'suscriptores premium personales',
    message: 'full signal details + VIP badge',
    channels: ['push', 'email', 'in_app', 'sms'],
    priority: 'high'
  }
}
```

### 10.2. Contenido de Notificación

```javascript
const NOTIFICATION_CONTENT = {
  // FREE
  free: {
    title: '{tipster_name} publicó una señal',
    body: '{event} - {selection} @{odds}',
    includes_analysis: true
  },
  
  // CREDITS (teaser)
  credits: {
    title: '{tipster_name} publicó una señal premium',
    body: '{event} - {short_reason}',
    includes_analysis: false,
    cta: 'Desbloquear por {credit_cost} créditos'
  },
  
  // SUBSCRIPTION
  subscription: {
    title: '{tipster_name} señal exclusiva para suscriptores',
    body: '{event} - {selection} @{odds}',
    includes_analysis: true,
    badge: 'Suscriptor'
  },
  
  // PERSONAL
  personal: {
    title: '⭐ {tipster_name} señal VIP',
    body: '{event} - {selection} @{odds} | {confidence_level} estrellas',
    includes_analysis: true,
    badge: 'VIP',
    priority: 'high'
  }
}
```

### 10.3. Opt-out

```
❌ No se envían detalles si el usuario no tiene acceso

Ejemplo:
- Señal CREDITS publicada
- Usuario NO pagó créditos
- Notificación: teaser sin selección
- Usuario debe pagar para ver pick completo
```

---

## 11. Registro para Estadísticas

### 11.1. Datos Guardados (CRÍTICOS)

```typescript
interface SignalStatsRecord {
  // IDs
  signal_id: string
  tipster_id: string
  
  // Evento
  sport: string
  league: string
  event_name: string
  event_start_time: timestamp
  
  // Pick
  market_type: MarketType
  selection: string
  published_odds: number  // CRÍTICO para CLV
  
  // Stake
  confidence_level: number
  stake_units: number
  
  // Timestamps
  published_at: timestamp
  locked_at?: timestamp
  settled_at?: timestamp
  
  // Resultado
  result?: SettlementOutcome
  closing_odds?: number  // para CLV
  
  // Access
  access_type: AccessType
  
  // Engagement
  views: number
  unlocks: number  // si es CREDITS
  followers_at_publish: number
  subscribers_at_publish: number
  premium_subscribers_at_publish: number
}
```

### 11.2. Alimenta las Siguientes Métricas

```javascript
const STATS_CALCULATED_FROM_SIGNALS = {
  // ROI
  roi: {
    formula: '(total_won - total_lost) / total_staked',
    based_on: 'published_odds',
    filters: 'status = settled AND result IN [win, loss]'
  },
  
  // Hit Rate (Win Rate)
  hit_rate: {
    formula: 'wins / (wins + losses)',
    filters: 'status = settled AND result IN [win, loss]',
    excludes: 'voids and pending'
  },
  
  // CLV (Closing Line Value)
  clv: {
    formula: 'AVG((closing_odds - published_odds) / published_odds)',
    filters: 'status = settled AND closing_odds IS NOT NULL',
    example: 'published: 2.50, closing: 2.60 → CLV = +4%'
  },
  
  // Ranking
  ranking: {
    based_on: ['roi', 'hit_rate', 'clv', 'volume', 'consistency'],
    weights: {
      roi: 0.35,
      hit_rate: 0.25,
      clv: 0.20,
      volume: 0.10,
      consistency: 0.10
    }
  },
  
  // Public Stats
  public_stats: {
    total_signals: 'COUNT(status = settled)',
    total_wins: 'COUNT(result = win)',
    avg_odds: 'AVG(published_odds)',
    best_streak: 'max consecutive wins',
    worst_streak: 'max consecutive losses'
  }
}
```

### 11.3. Actualización de Stats

```javascript
/**
 * Las stats se recalculan al resolver la señal
 */
const STATS_UPDATE_TRIGGER = {
  event: 'signal settled',
  
  actions: [
    'recalculate_tipster_roi',
    'recalculate_hit_rate',
    'update_clv_avg',
    'update_ranking',
    'update_public_profile_stats',
    'update_leaderboard'
  ],
  
  // Background job
  async: true,
  priority: 'normal'
}
```

---

## 12. Validaciones Críticas

### 12.1. Pre-Publicación (NO Permitir Si...)

```typescript
interface PublishValidations {
  // Evento
  event: {
    teams_missing: 'faltan equipos',
    date_in_past: 'fecha pasada',
    date_too_close: 'evento inicia en <5 minutos',
    league_invalid: 'liga no reconocida'
  }
  
  // Odds
  odds: {
    too_low: 'cuota < 1.20',
    too_high: 'cuota > 50.00',
    invalid_format: 'no es número decimal válido'
  }
  
  // Análisis
  analysis: {
    short_reason_empty: 'análisis corto vacío',
    short_reason_too_short: 'min 50 caracteres',
    full_analysis_empty: 'análisis completo vacío',
    full_analysis_too_short: 'min 200 caracteres'
  }
  
  // Stake
  stake: {
    units_missing: 'stake_units vacío',
    units_invalid: 'debe ser 1-5',
    confidence_missing: 'confidence_level vacío'
  }
  
  // Access type
  access: {
     credits_without_cost: 'CREDITS sin credit_cost',
     invalid_credit_cost: 'credit_cost inválido — debe cumplir reglas de pricing configurables (mín/máx definidos por la plataforma)'
   }
}
```

### 12.2. Mensajes de Error

```javascript
const ERROR_MESSAGES = {
  odds_too_low: 'Las odds deben ser mínimo 1.20',
  date_past: 'No puedes publicar señales de eventos pasados',
  analysis_empty: 'Debes proporcionar un análisis completo',
  stake_missing: 'Debes indicar stake sugerido y nivel de confianza',
  teams_missing: 'Debes especificar ambos equipos/participantes',
  
  // Edición
  edit_window_expired: 'No puedes editar señales publicadas hace más de 3 minutos',
  event_started: 'No puedes editar señales de eventos que ya iniciaron',
  already_locked: 'Esta señal está bloqueada y no puede modificarse'
}
```

---

## 13. Flujo UX

### 13.1. Botón Principal

```typescript
interface CreateSignalButton {
  location: [
    '/tipster/dashboard (sidebar)',
    '/tipster/signals (header)',
    'floating action button (mobile)'
  ],
  
  label: 'Publicar Señal' | '➕ Crear Señal',
  variant: 'primary',
  icon: '➕',
  
  action: 'navigate_to_create_signal_form'
}
```

### 13.2. Form Steps

```javascript
// Validaciones por estructura de apuesta
const BET_STRUCTURE_VALIDATIONS = {
  single: {
    min_odds: 1.20
  },
  combo: {
    min_picks: 2,
    min_pick_odds: 1.20,
    min_total_odds: 1.60
  },
  system: {
    min_picks: 3,
    min_pick_odds: 1.20,
    min_total_odds: 1.60
  }
}

const FORM_STEPS = {
  // Step 1: Tipo de Señal
  step_1: {
    title: 'Tipo de Señal',
    fields: ['access_type', 'credit_cost'],
    validation: 'required'
  },
  
  // Step 2: Tipo de Apuesta
  step_2: {
    title: 'Tipo de Apuesta',
    fields: ['bet_structure'],
    helper_text: 'SINGLE (1 pick), COMBO (2+ picks), SYSTEM (3+ picks)',
    validation: 'required'
  },
  
  // Step 3: Evento Deportivo (solo SINGLE)
  step_3: {
    title: 'Evento Deportivo',
    fields: [
      'sport',
      'league',
      'team_a',
      'team_b',
      'event_start_time',
      'bookmaker'
    ],
    autocomplete: true,
    visible_when: 'bet_structure === "single"'
  },
  
  // Step 4: Tus Picks (dinámico)
  step_4: {
    title: 'Tus Picks',
    dynamic_table: true,
    actions: ['Añadir selección', 'Eliminar selección'],
    columns: ['sport', 'league', 'event_name', 'market_type', 'selection', 'line', 'odds', 'bookmaker'],
    binds_to: 'picks',
    computed: {
      total_odds: 'product(picks.map(p => p.odds))'
    },
    extra_fields: ['ticket_link'], // opcional
    validations: {
      when_single: [
        'picks.length === 1',
        'picks[0].odds >= BET_STRUCTURE_VALIDATIONS.single.min_odds'
      ],
      when_combo: [
        'picks.length >= BET_STRUCTURE_VALIDATIONS.combo.min_picks',
        'every(picks, p => p.odds >= BET_STRUCTURE_VALIDATIONS.combo.min_pick_odds)',
        'total_odds >= BET_STRUCTURE_VALIDATIONS.combo.min_total_odds'
      ],
      when_system: [
        'picks.length >= BET_STRUCTURE_VALIDATIONS.system.min_picks',
        'every(picks, p => p.odds >= BET_STRUCTURE_VALIDATIONS.system.min_pick_odds)',
        'total_odds >= BET_STRUCTURE_VALIDATIONS.system.min_total_odds'
      ]
    }
  },
  
  // Step 5: Stake y Confianza
  step_5: {
    title: 'Stake y Confianza',
    fields: ['confidence_level', 'stake_units', 'max_stake_suggestion', 'risk_description'],
    helper_text: 'El stake se aplica al total del ticket (SINGLE/COMBO/SYSTEM)'
  },
  
  // Step 6: Análisis
  step_6: {
    title: 'Análisis',
    fields: [
      'short_reason',
      'full_analysis',
      'tags',
      'image'
    ],
    validation: 'min_length checks'
  },
  
  // Step 7: Publicación
  step_7: {
    title: 'Publicar',
    options: ['publish_now', 'schedule'],
    preview: true,
    confirmation: true
  }
}

### 13.3. Confirmación Crítica

```typescript
interface PublishConfirmation {
  trigger: 'user clicks "Publicar"',
  
  modal: {
    title: '⚠️ Confirmar Publicación',
    
    message: `
      Una vez iniciado el evento, esta señal no podrá modificarse.
      
      - Odds registradas: {published_odds}
      - Afectará tu ROI y ranking
      - Será visible para {audience}
      
      ¿Estás seguro de publicar?
    `,
    
    buttons: {
      cancel: 'Revisar',
      confirm: 'Sí, Publicar'
    }
  },
  
  post_confirmation: {
    save_signal: true,
    send_notifications: true,
    redirect: '/tipster/signals'
  }
}
```

---

## 14. Data Model (Completo)

```typescript
// Nuevo: tipo de apuesta (estructura del ticket)
enum BetStructure {
  SINGLE = 'single',       // 1 selección
  COMBO = 'combo',         // combinada/parlay (>=2 picks)
  SYSTEM = 'system'        // opcional futuro
}

// Nuevo: definición de picks individuales dentro de una señal
interface SignalPick {
  sport: string
  league: string
  event_name: string

  market_type: MarketType
  selection: string
  odds: number
  line?: number

  bookmaker_name?: string
  pick_id: string  // para trazabilidad y picks_results
}

interface SignalLogEntry {
  signal_id: string
  changed_at: timestamp
  actor: 'tipster' | 'system' | 'admin'
  field: string
  old?: any
  new?: any
  ip?: string
  user_agent?: string
}

interface Signal {
  // IDs
  signal_id: string
  tipster_id: string
  
  // Access control
  access_type: AccessType
  credit_cost?: number
  credit_cost_locked?: number  // congelado al momento de publicación
  
  // Estructura de apuesta y picks
  bet_structure: BetStructure
  picks: SignalPick[]   // SINGLE → length = 1 | COMBO → length >= 2
  total_odds: number    // multiplicación de odds de cada pick
  ticket_link?: string  // opcional, visible solo para usuarios con acceso
  published_odds: number  // IMMUTABLE; en COMBO = total_odds al publicar
  
  // Event info (para SINGLE). En COMBO se deriva de picks[] y puede omitirse en la UI
  sport?: string
  league?: string
  event_name?: string
  team_a?: string
  team_b?: string
  event_start_time?: timestamp
  timezone?: string
  bookmaker_name?: string
  
  // Stake recommendation (aplica al ticket completo)
  confidence_level: 1 | 2 | 3 | 4 | 5
  stake_units: number
  max_stake_suggestion?: number
  risk_description?: 'low' | 'medium' | 'high'
  
  // Analysis
  short_reason: string
  full_analysis: string
  tags: string[]
  image_url?: string
  
  // Lifecycle
  status: SignalStatus
  publish_at?: timestamp  // for scheduled
  
  // Result
  result?: SettlementOutcome
  picks_results?: { pick_id: string, result: SettlementOutcome }[]
  closing_odds?: number
  clv_percent?: number
  actual_result?: string  // ej: "2-1"
  
  // Engagement
  views: number
  unlocks: number
  saves: number
  followers_at_publish: number
  subscribers_at_publish?: number
  premium_subscribers_at_publish?: number
  
  // Timestamps
  created_at: timestamp
  updated_at: timestamp
  published_at?: timestamp
  locked_at?: timestamp
  price_locked_at?: timestamp  // cuándo se congeló credit_cost
  settled_at?: timestamp
  cancelled_at?: timestamp
  
  // Audit trail (protección anti-manipulación)
  version: number
  changes_audit?: SignalLogEntry[]
  
  // Metadata
  created_by: string  // tipster_id
  updated_by: string
}
```

---

## 15. API Endpoints

```typescript
// Crear señal (draft)
POST /tipster/signals
Body: SignalCreateRequest
Response: Signal

// Obtener draft
GET /tipster/signals/:id
Response: Signal

// Editar draft
PUT /tipster/signals/:id
Condition: status === 'draft' OR (status === 'published' AND within 3 min)
Body: SignalUpdateRequest
Response: Signal

// Publicar señal
POST /tipster/signals/:id/publish
Body: {
  publish_at?: timestamp  // omitir para publicar ahora
}
Response: Signal

// Programar publicación
POST /tipster/signals/:id/schedule
Body: {
  publish_at: timestamp
}
Response: Signal

// Cancelar señal
POST /tipster/signals/:id/cancel
Condition: status IN ['draft', 'scheduled', 'published'] AND event_not_started
Response: Signal

// Eliminar draft
DELETE /tipster/signals/:id
Condition: status === 'draft'
Response: { deleted: true }

// Preview (antes de publicar)
POST /tipster/signals/preview
Body: SignalData
Response: {
  preview_html: string
  validation_errors: string[]
  estimated_reach: number
}
```

---

## 16. Notas Importantes

### 16.1. No Backend Aún

```
❌ No conectar backend real
❌ No enviar notificaciones reales
❌ No ejecutar apuestas

✅ Solo UI completa
✅ Validaciones frontend
✅ Mock confirmations
```

### 16.2. No Dinero Real

```
❌ No procesar pagos de créditos
❌ No ejecutar apuestas
❌ No transferir fondos

✅ Solo simular flujo
✅ Mostrar costos de créditos
✅ UI de confirmación
```

### 16.3. No Cálculos Complejos

```
❌ No calcular CLV en tiempo real
❌ No recalcular ranking inmediatamente
❌ No actualizar leaderboard

✅ Solo guardar published_odds
✅ Documentar que se calculará después
✅ Mostrar placeholders en UI
```

---

## 17. Roadmap

### Fase 1 (MVP) ✅
- [x] Form completo multi-step
- [x] Validaciones críticas
- [x] Preview antes de publicar
- [x] Confirmación modal
- [x] Access types (FREE, CREDITS, SUBSCRIPTION)
- [x] Scheduled publish
- [x] 3-minute edit window

### Fase 2
- [ ] Backend integration
- [ ] Real notifications
- [ ] Auto-complete desde sports API
- [ ] Image upload
- [ ] Duplicate signal (crear desde existente)
- [ ] Bulk create (múltiples señales)

### Fase 3
- [ ] CLV tracking automático (closing odds API)
- [ ] Auto-settle (resultado desde API)
- [ ] AI analysis suggestions
- [ ] Templates personalizados
- [ ] Performance insights (stats al crear)

---

## 18. Referencias

- **Tipster Dashboard**: tipster-dashboard.md (resumen)
- **Tipster Signals**: tipster-signals.md (gestión)
- **Settlements**: tipster-settlements.md (liquidación)
- **Community**: community.md (señales públicas)
- **Credits System**: credits.md (sistema de créditos)

---

**Versión:** 1.0  
**Última actualización:** 2025-02-08  
**Autor:** Sistema Trader Deportivo  
**Estado:** Documentación Oficial

## 19. Comportamiento en el Usuario (User Side Effects)

Cuando una señal es publicada, la plataforma impacta el entorno del usuario según el access_type:

- FREE
  - aparece en feed público
  - aparece en módulo Signals
  - puede añadirse a Watchlist
  - genera stake sugerido en Bankroll

- CREDITS
  - aparece teaser en Signals
  - el usuario puede desbloquear
  - al desbloquear: se registra en historial del usuario
  - se habilita seguimiento en Bankroll

- SUBSCRIPTION
  - aparece automáticamente en Signals del usuario suscrito
  - genera notificación
  - se habilita seguimiento automático

Regla crítica de trazabilidad:
- Si el usuario añade la señal a seguimiento, la señal crea un registro en el ledger operativo del usuario, conectando con Bankroll y RiskGuard.

Nota: Ver sección 20 para detalle de integración con Bankroll (TradeEntry y contabilidad).

## 20. Integración con Bankroll

Cuando el usuario marca "Seguir señal", el sistema crea un TradeEntry con los campos mínimos para contabilidad:

```typescript
interface TradeEntry {
  source: 'tipster_signal'
  stake_recommended: number
  odds_at_entry: number
  event_time: timestamp
  market_type: MarketType
  signal_id: string
  user_id: string
  followed_by_user: boolean
  executed_by_user?: boolean
}
```

Esto permite:
- control de PnL
- disciplina del usuario
- estadísticas reales
- entrenamiento IA (patrones de seguimiento y resultados)

Notas clave:
- El stake sugerido siempre se calcula sobre el Bankroll Plan del usuario, no sobre saldo real del broker.
- La operación contable es independiente de la ejecución en el broker; el sistema registra la intención y seguimiento para métricas y disciplina.
- Para señales COMBO: se registra UNA sola operación contable (TradeEntry) para el ticket completo (combinada), no múltiples por cada pick.

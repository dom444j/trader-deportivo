# Tipster Settlements Module

## Concepto Central

**Liquidaciones es el módulo donde el tipster registra resultados de señales finalizadas, generando impacto directo en ROI, unidades ganadas, winrate, CLV y ranking.**

No muestra precios en dinero — solo unidades y resultados. Es la fuente de verdad para todas las estadísticas verificables del tipster.

**Principio fundamental:** Una liquidación confirmada es inmutable (solo admin puede corregir con auditoría). Esto garantiza transparencia total y evita manipulación post-resultado.

---

## 1. Propósito del Módulo

Liquidaciones tiene **7 objetivos estratégicos:**

1. **Registro de resultados** — Win/Loss/Void/Push/Half
2. **Cálculo automático** — Profit en unidades según odds publicadas
3. **Actualización de stats** — ROI, Winrate, CLV, Ranking
4. **Trazabilidad total** — Auditoría completa de cada liquidación
5. **Anti-fraude** — Validaciones y flags de integridad
6. **Transparencia** — Resultados inmutables post-confirmación
7. **Gestión de combos** — Liquidación por legs con reglas claras

### 1.1. Lo Que el Tipster Hace Aquí

✅ **Ver señales pendientes** — Eventos finalizados sin liquidar  
✅ **Registrar resultado** — Win/Loss/Void/Push/Half  
✅ **Liquidar combos** — Por legs con cálculo automático  
✅ **Agregar evidencia** — Links, notas, fuente del resultado  
✅ **Revisar historial** — Auditoría de liquidaciones  

### 1.2. Lo Que NO Se Hace Aquí

❌ **NO mostrar dinero** — Solo unidades, no pricing  
❌ **NO editar post-confirmación** — Inmutable (solo admin)  
❌ **NO calcular ganancias monetarias** — Solo profit_units  
❌ **NO gestionar retiros** — Eso es en Wallet  
❌ **NO liquidar señales activas** — Solo eventos finalizados  

### 1.3. Impacto Directo en Estadísticas

```javascript
const STATS_IMPACT = {
  roi: {
    formula: '(total_profit_units / total_stake_units) * 100',
    updates_on: 'settlement confirmed'
  },
  
  winrate: {
    formula: 'wins / (wins + losses)',
    updates_on: 'settlement confirmed',
    excludes: ['void', 'push', 'canceled']
  },
  
  units_won: {
    formula: 'SUM(profit_units WHERE result = win)',
    updates_on: 'settlement confirmed'
  },
  
  clv: {
    formula: 'AVG((closing_odds - published_odds) / published_odds)',
    updates_on: 'settlement with closing_odds',
    optional: true
  },
  
  ranking: {
    based_on: ['roi', 'winrate', 'clv', 'volume', 'consistency'],
    updates_on: 'settlement confirmed',
    recalculation: 'async job'
  }
}
```

---

## 2. Ruta y Navegación

### 2.1. Ruta Principal

```
/tipster/settlements
```

### 2.2. Sidebar Navigation

**Usar exactamente el mismo sidebar del Tipster Dashboard.**

```typescript
interface TipsterSidebar {
  sections: [
    {
      title: "Principal",
      items: [
        { icon: "📊", label: "Dashboard", path: "/tipster/dashboard", active: false },
        { icon: "📡", label: "Mis Señales", path: "/tipster/signals", active: false },
        { icon: "➕", label: "Crear Señal", path: "/tipster/signals/new", active: false },
        { icon: "✅", label: "Liquidaciones", path: "/tipster/settlements", active: true }
      ]
    },
    {
      title: "Negocio",
      items: [
        { icon: "👥", label: "Suscriptores", path: "/tipster/subscribers", active: false },
        { icon: "💰", label: "Billetera", path: "/tipster/wallet", active: false }
      ]
    },
    {
      title: "Configuración",
      items: [
        { icon: "👤", label: "Perfil", path: "/tipster/profile", active: false },
        { icon: "💬", label: "Soporte", path: "/tipster/support", active: false }
      ]
    },
    {
      title: "Rol",
      items: [
        { icon: "↩️", label: "← Volver a Usuario", path: "/dashboard", active: false }
      ]
    }
  ]
}
```

**Item activo:** Liquidaciones

---

## 3. Estructura de la Página

### 3.1. Header

```typescript
interface PageHeader {
  title: "✅ Liquidaciones"
  subtitle: "Liquida resultados de tus señales. Esto actualiza tus estadísticas y ranking."
  
  // Right side: Period selector
  period_selector: {
    options: ['7D', '30D', '90D', 'ALL'],
    default: '30D'
  }
  
  // Badges informativos
  badges: {
    pending: {
      label: "Pendientes",
      count: number,
      color: "orange"
    },
    in_review: {
      label: "En Revisión",
      count: number,
      color: "yellow"
    }
  }
}
```

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ ✅ Liquidaciones                   [7D|30D|90D|ALL]     │
│ Liquida resultados de tus señales  🟠 Pendientes: 5     │
│                                     🟡 En Revisión: 2    │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Tabs Principales (Workflow)

### 4.1. Workflow Tabs

```typescript
enum SettlementWorkflow {
  PENDING = 'pending',           // Evento finalizado, sin liquidar
  IN_REVIEW = 'in_review',       // Sistema/Admin marcó review
  SETTLED = 'settled',           // Resultado confirmado
  DISPUTED = 'disputed',         // Usuario/Soporte disputó
  CANCELED = 'canceled'          // Canceladas post-publish
}
```

**Tabs UI:**
```
┌────────────────────────────────────────────────────────┐
│ [Pendientes (5)] [En Revisión (2)] [Liquidadas (142)] │
│ [Disputas (0)] [Canceladas (3)]                       │
└────────────────────────────────────────────────────────┘
```

### 4.2. Definiciones por Tab

#### A) Pendientes
```typescript
interface PendingSettlement {
  condition: 'event_state = finished AND settlement_status = null',
  
  description: 'Evento finalizado pero resultado no registrado',
  
  actions: ['liquidar', 'ver_detalle'],
  
  priority: 'high'  // Afecta stats
}
```

#### B) En Revisión
```typescript
interface InReviewSettlement {
  condition: 'settlement_status = in_review',
  
  triggers: [
    'liquidación tardía (>48h post-evento)',
    'cambio de outcome por admin',
    'discrepancia con data externa',
    'patrón anómalo (exceso void/cancel)',
    'flag manual de soporte'
  ],
  
  actions: ['ver_detalle', 'agregar_evidencia'],
  
  note: 'Soporte puede solicitar evidencia adicional'
}
```

#### C) Liquidadas
```typescript
interface SettledSignal {
  condition: 'settlement_status = settled',
  
  shows: 'historial completo de liquidaciones',
  
  immutable: true,
  
  actions: ['ver_detalle', 'ver_audit'],
  
  note: 'Solo admin puede corregir con trazabilidad'
}
```

#### D) Disputas
```typescript
interface DisputedSettlement {
  condition: 'settlement_status = disputed',
  
  triggers: [
    'usuario reportó resultado incorrecto',
    'soporte marcó inconsistencia',
    'tipster solicita corrección'
  ],
  
  actions: ['ver_detalle', 'agregar_evidencia', 'contactar_soporte'],
  
  resolution: 'admin review + manual override'
}
```

#### E) Canceladas
```typescript
interface CanceledSettlement {
  condition: 'signal_status = canceled',
  
  note: 'Cancelaciones válidas antes de inicio',
  
  affects_stats: false,
  
  actions: ['ver_detalle'],
  
  clarification: 'Normalmente NO deberían llegar aquí (gestión desde Mis Señales)'
}
```

---

## 5. Filtros Secundarios

### 5.1. Search Bar

```typescript
interface SearchFilter {
  placeholder: "Buscar evento, liga, equipo..."
  fields: ['event_name', 'league', 'team_a', 'team_b']
  debounce: 300  // ms
}
```

### 5.2. Filter Dropdowns

```typescript
interface SecondaryFilters {
  // Sport
  sport: {
    type: "select",
    options: [
      { value: "all", label: "Todos los deportes" },
      { value: "football", label: "⚽ Fútbol" },
      { value: "basketball", label: "🏀 Baloncesto" },
      { value: "tennis", label: "🎾 Tenis" },
      { value: "baseball", label: "⚾ Béisbol" },
      { value: "hockey", label: "🏒 Hockey" }
    ]
  }
  
  // Liga
  league: {
    type: "select",
    options: "dynamic based on sport"
  }
  
  // Tipo
  bet_type: {
    type: "select",
    options: [
      { value: "all", label: "Todos" },
      { value: "prematch", label: "Prematch" },
      { value: "live", label: "Live" }
    ]
  }
  
  // Estructura
  bet_structure: {
    type: "select",
    options: [
      { value: "all", label: "Todos" },
      { value: "single", label: "Single" },
      { value: "combo", label: "Combo" }
    ]
  }
  
  // Resultado (solo en "Liquidadas")
  outcome: {
    type: "select",
    condition: "tab = settled",
    options: [
      { value: "all", label: "Todos" },
      { value: "win", label: "🟢 Win" },
      { value: "loss", label: "🔴 Loss" },
      { value: "void", label: "⚪ Void" },
      { value: "push", label: "🟡 Push" },
      { value: "half_win", label: "🟢½ Half Win" },
      { value: "half_loss", label: "🔴½ Half Loss" }
    ]
  }
  
  // Método (si existe)
  settlement_method: {
    type: "select",
    condition: "tab = settled",
    options: [
      { value: "all", label: "Todos" },
      { value: "manual", label: "Manual" },
      { value: "auto", label: "Automático" },
      { value: "admin", label: "Admin" }
    ]
  }
}
```

---

## 6. Tabla Principal de Señales

### 6.1. Columnas

```typescript
interface SettlementsTable {
  columns: [
    {
      key: "event_date",
      label: "Fecha Evento",
      width: "120px",
      sortable: true,
      format: "YYYY-MM-DD HH:mm"
    },
    {
      key: "event",
      label: "Evento",
      width: "240px",
      format: "Team A vs Team B | League"
    },
    {
      key: "bet_type",
      label: "Tipo",
      width: "100px",
      format: "Badge (Prematch | Live)"
    },
    {
      key: "bet_structure",
      label: "Estructura",
      width: "100px",
      format: "Badge (Single | Combo)"
    },
    {
      key: "selection",
      label: "Selección",
      width: "200px",
      format: "Resumen del pick o combo"
    },
    {
      key: "odds",
      label: "Odds",
      width: "80px",
      format: "published_odds (single) / total_odds (combo)",
      color: "gold"
    },
    {
      key: "stake_units",
      label: "Unidades",
      width: "80px",
      format: "X.Xu",
      color: "cyan"
    },
    {
      key: "settlement_status",
      label: "Estado",
      width: "120px",
      format: "Badge (Pending | In Review | Settled)"
    },
    {
      key: "outcome",
      label: "Resultado",
      width: "100px",
      format: "Badge (Win | Loss | Void | Push)",
      condition: "tab = settled"
    },
    {
      key: "profit_units",
      label: "Profit (u)",
      width: "100px",
      format: "+X.Xu | -X.Xu",
      color_coded: true,
      condition: "tab = settled"
    },
    {
      key: "actions",
      label: "Acciones",
      width: "120px",
      format: "Dropdown menu"
    }
  ]
}
```

### 6.2. Acciones por Fila

```typescript
interface RowActions {
  // Siempre disponible
  view_detail: {
    label: "Ver Detalle",
    icon: "👁️",
    action: "open_detail_modal"
  }
  
  // Solo pending
  settle: {
    label: "Liquidar",
    icon: "✅",
    condition: "settlement_status IS NULL",
    action: "open_settlement_modal",
    validation: "event_state = finished"
  }
  
  // Solo settled
  view_audit: {
    label: "Ver Auditoría",
    icon: "📋",
    condition: "settlement_status = settled",
    action: "open_audit_log"
  }
  
  // Solo in_review o disputed
  add_evidence: {
    label: "Agregar Evidencia",
    icon: "📎",
    condition: "settlement_status IN ['in_review', 'disputed']",
    action: "open_evidence_modal"
  }
}
```

---

## 7. Panel/Modal de Liquidación (CORE)

**Cuando el tipster hace clic "Liquidar", abrir modal o panel lateral.**

### 7.1. Resumen de la Señal (No Editable)

```typescript
interface SignalSummary {
  // Evento
  event_name: string        // "Real Madrid vs Barcelona"
  kickoff_time: timestamp   // "2026-02-10 20:00 CET"
  league: string            // "La Liga"
  
  // Pick
  market_type: string       // "Totals"
  selection: string         // "Over 2.5"
  bet_structure: 'single' | 'combo'
  
  // Odds
  published_odds: number    // 1.95 (single)
  total_odds?: number       // 5.20 (combo)
  
  // Stake
  stake_units: number       // 2u
  
  // Access (informativo)
  access_type: 'free' | 'credits' | 'subscription'
  
  // NOTE: NO mostrar credit_cost ni pricing
}
```

**UI Layout:**
```
┌─────────────────────────────────────────────┐
│ 📊 Liquidar Señal                           │
├─────────────────────────────────────────────┤
│                                              │
│ Evento: Real Madrid vs Barcelona            │
│ Liga: La Liga                                │
│ Fecha: 2026-02-10 20:00 CET                 │
│                                              │
│ Mercado: Totals                              │
│ Selección: Over 2.5                          │
│ Estructura: Single                           │
│                                              │
│ Odds: 1.95                                   │
│ Stake: 2u                                    │
│                                              │
└─────────────────────────────────────────────┘
```

### 7.2. Resultado (Obligatorio)

```typescript
enum SettlementOutcome {
  WIN = 'win',
  LOSS = 'loss',
  VOID = 'void',
  PUSH = 'push',
  HALF_WIN = 'half_win',
  HALF_LOSS = 'half_loss'
}

interface OutcomeSelection {
  field: 'settlement_outcome',
  
  options: [
    {
      value: 'win',
      label: '🟢 Win',
      description: 'Apuesta ganada'
    },
    {
      value: 'loss',
      label: '🔴 Loss',
      description: 'Apuesta perdida'
    },
    {
      value: 'void',
      label: '⚪ Void',
      description: 'Apuesta anulada (stake devuelto)'
    },
    {
      value: 'push',
      label: '🟡 Push',
      description: 'Empate exacto en línea'
    },
    {
      value: 'half_win',
      label: '🟢½ Half Win',
      description: 'Ganancia parcial (Asian Handicap)'
    },
    {
      value: 'half_loss',
      label: '🔴½ Half Loss',
      description: 'Pérdida parcial (Asian Handicap)'
    }
  ],
  
  validation: 'required',
  
  immutability: 'una vez confirmada, no se puede cambiar (solo admin con audit)'
}
```

**UI Component:**
```
┌─────────────────────────────────────────────┐
│ 🎯 Resultado del Pick                       │
├─────────────────────────────────────────────┤
│                                              │
│ Selecciona el resultado:                     │
│                                              │
│ ○ 🟢 Win - Apuesta ganada                   │
│ ○ 🔴 Loss - Apuesta perdida                 │
│ ○ ⚪ Void - Apuesta anulada                 │
│ ○ 🟡 Push - Empate exacto                   │
│ ○ 🟢½ Half Win - Ganancia parcial           │
│ ○ 🔴½ Half Loss - Pérdida parcial           │
│                                              │
└─────────────────────────────────────────────┘
```

### 7.3. Caso COMBO (Muy Importante)

**Si `bet_structure = COMBO`, mostrar desglose por legs.**

```typescript
interface ComboSettlement {
  // Mostrar lista de legs
  legs: [
    {
      leg_number: 1,
      event: "Real Madrid vs Barcelona",
      selection: "Over 2.5",
      odds: 1.95,
      outcome: 'win' | 'loss' | 'void' | 'push'  // Seleccionable por leg
    },
    {
      leg_number: 2,
      event: "Lakers vs Celtics",
      selection: "Lakers ML",
      odds: 2.10,
      outcome: 'win' | 'loss' | 'void' | 'push'
    },
    {
      leg_number: 3,
      event: "PSG vs Bayern",
      selection: "BTTS Yes",
      odds: 1.85,
      outcome: 'win' | 'loss' | 'void' | 'push'
    }
  ],
  
  // Cálculo automático
  total_outcome: 'auto-calculated from legs',
  effective_total_odds: 'auto-calculated from legs',
  
  // Resumen
  summary: {
    original_total_odds: 7.59,  // 1.95 × 2.10 × 1.85
    effective_total_odds: number,  // Recalculado si hay void/push
    final_outcome: SettlementOutcome
  }
}
```

#### Reglas COMBO (CRÍTICAS)

```javascript
const COMBO_SETTLEMENT_RULES = {
  // Regla 1: Un solo loss = todo loss
  rule_any_loss: {
    condition: 'ANY leg = LOSS',
    result: 'total outcome = LOSS',
    payout: 'profit_units = -stake_units'
  },
  
  // Regla 2: Todos win + algunos void/push = win con odds ajustadas
  rule_partial_void: {
    condition: 'ALL legs IN [WIN, VOID, PUSH] AND at least one WIN',
    result: 'total outcome = WIN',
    calculation: {
      effective_odds: 'PRODUCT(legs WHERE outcome = WIN)',
      void_push_odds: 1.0,  // Se eliminan del cálculo
      example: 'leg1: WIN @1.95, leg2: WIN @2.10, leg3: VOID → total = 1.95 × 2.10 = 4.095'
    },
    payout: 'profit_units = stake_units * (effective_total_odds - 1)'
  },
  
  // Regla 3: Todos void/push = void total (con preferencia por VOID)
  rule_all_void_push: {
    condition: 'ALL legs IN [VOID, PUSH]',
    result: 'total outcome = VOID',  // Preferencia: VOID sobre PUSH
    payout: 'profit_units = 0',
    note: 'Si mezcla VOID+PUSH sin WIN → resultado = VOID'
  },
  
  // Regla 4: Al menos un win y resto void/push
  rule_win_with_voids: {
    condition: 'At least one WIN, rest VOID/PUSH',
    result: 'total outcome = WIN',
    calculation: 'effective_total_odds = PRODUCT(WIN legs only)'
  }
}
```

**UI Combo Settlement:**
```
┌─────────────────────────────────────────────┐
│ 🎯 Liquidación de Combo (3 Legs)            │
├─────────────────────────────────────────────┤
│                                              │
│ Leg 1: Real Madrid vs Barcelona             │
│ • Over 2.5 @1.95                             │
│ • Resultado: ○ Win ○ Loss ○ Void ○ Push    │
│                                              │
│ Leg 2: Lakers vs Celtics                    │
│ • Lakers ML @2.10                            │
│ • Resultado: ○ Win ○ Loss ○ Void ○ Push    │
│                                              │
│ Leg 3: PSG vs Bayern                        │
│ • BTTS Yes @1.85                             │
│ • Resultado: ○ Win ○ Loss ○ Void ○ Push    │
│                                              │
├─────────────────────────────────────────────┤
│ 📊 Resumen Calculado                         │
├─────────────────────────────────────────────┤
│                                              │
│ Odds originales: 7.59 (1.95×2.10×1.85)      │
│ Odds efectivas: 4.10 (leg 3 void)           │
│ Resultado total: 🟢 Win                      │
│ Profit: +6.20u (2u × 4.10 - 2u)             │
│                                              │
└─────────────────────────────────────────────┘
```

**Nota para boceto:**
En el HTML, permite que el tipster seleccione outcome total manualmente, pero documenta que en producción esto se derivará automáticamente del detalle de legs según las reglas.

### 7.4. CLV / Closing Odds (Opcional)

```typescript
interface ClosingLineValue {
  // Campo opcional
  closing_odds?: number
  
  // Checkbox
  closing_odds_unavailable: boolean
  
  // Cálculo automático
  clv_percentage?: number  // (closing_odds - published_odds) / published_odds
  
  // Reglas
  rules: {
    affects_payout: false,  // CLV NO afecta profit_units
    affects_stats: true,    // CLV SÍ afecta ranking
    optional: true,         // Si no existe, CLV queda "N/A"
    validation: {
      min_odds: 1.01,
      max_odds: 100.00,
      must_be_different_from_published: false  // Puede ser igual
    }
  }
}
```

**UI Component:**
```
┌─────────────────────────────────────────────┐
│ 📊 Closing Line Value (Opcional)            │
├─────────────────────────────────────────────┤
│                                              │
│ Odds de cierre:                              │
│ [____2.10____]  ☐ No disponible             │
│                                              │
│ CLV: +7.7% (2.10 vs 1.95)                   │
│                                              │
│ ℹ️ El CLV mide qué tan buenas odds          │
│    conseguiste vs las odds al cierre.       │
│    No afecta el payout, solo estadísticas.  │
│                                              │
└─────────────────────────────────────────────┘
```

### 7.5. Evidencia y Transparencia

```typescript
interface SettlementEvidence {
  // Fuente del resultado
  result_source: {
    type: 'select',
    options: [
      { value: 'manual', label: 'Manual (verificación propia)' },
      { value: 'scoreboard', label: 'Scoreboard oficial' },
      { value: 'bookmaker', label: 'Bookmaker settlement' },
      { value: 'admin', label: 'Admin override' }
    ],
    default: 'manual'
  }
  
  // Link de prueba (opcional)
  proof_link?: string  // URL opcional
  
  // Notas
  notes?: string  // Max 240 caracteres
  
  // Restricciones
  restrictions: {
    no_ticket_link: true,  // NO permitir ticket personal
    public_links_only: true,  // Solo links públicos (partido, scoreboard)
    optional_fields: true  // No obligatorios, pero recomendados
  }
}
```

**UI Component:**
```
┌─────────────────────────────────────────────┐
│ 📎 Evidencia (Recomendado)                  │
├─────────────────────────────────────────────┤
│                                              │
│ Fuente del resultado:                        │
│ [Manual ▼]                                   │
│                                              │
│ Link de prueba (opcional):                   │
│ [https://...]                                │
│ ℹ️ Link público del partido o scoreboard    │
│                                              │
│ Notas (máx 240 chars):                       │
│ [Resultado confirmado en SofaScore...]      │
│                                              │
└─────────────────────────────────────────────┘
```

### 7.6. Confirmación Final

```typescript
interface SettlementConfirmation {
  button: {
    label: "Confirmar Liquidación",
    variant: "primary",
    size: "large"
  },
  
  warning_message: {
    text: "⚠️ Esto actualizará tus estadísticas y ranking. No se puede deshacer.",
    style: "alert-warning",
    position: "above_button"
  },
  
  validation: {
    required_fields: ['settlement_outcome'],
    optional_fields: ['closing_odds', 'proof_link', 'notes'],
    combo_validation: 'all legs must have outcome if bet_structure = combo'
  },
  
  post_action: {
    close_modal: true,
    refresh_table: true,
    show_toast: "Liquidación confirmada. Tus estadísticas se están actualizando.",
    redirect: null  // Stay on page
  }
}
```

**UI:**
```
┌─────────────────────────────────────────────┐
│                                              │
│ ⚠️ Esto actualizará tus estadísticas y      │
│    ranking. No se puede deshacer.           │
│                                              │
│ [      Confirmar Liquidación     ]          │
│                                              │
└─────────────────────────────────────────────┘
```

---

## 8. Cálculo de Performance (Reglas Internas)

### 8.1. Fórmulas para SINGLE

```javascript
const SINGLE_PAYOUT_FORMULAS = {
  WIN: {
    formula: 'profit_units = stake_units * (published_odds - 1)',
    example: {
      stake_units: 2,
      published_odds: 1.95,
      profit_units: 2 * (1.95 - 1) = 1.90
    }
  },
  
  LOSS: {
    formula: 'profit_units = -stake_units',
    example: {
      stake_units: 2,
      profit_units: -2
    }
  },
  
  VOID: {
    formula: 'profit_units = 0',
    example: {
      stake_units: 2,
      profit_units: 0
    }
  },
  
  PUSH: {
    formula: 'profit_units = 0',
    example: {
      stake_units: 2,
      profit_units: 0
    }
  },
  
  HALF_WIN: {
    formula: 'profit_units = stake_units * 0.5 * (published_odds - 1)',
    example: {
      stake_units: 2,
      published_odds: 1.95,
      profit_units: 2 * 0.5 * (1.95 - 1) = 0.95
    },
    note: 'Asian Handicap medio ganado'
  },
  
  HALF_LOSS: {
    formula: 'profit_units = -stake_units * 0.5',
    example: {
      stake_units: 2,
      profit_units: -1
    },
    note: 'Asian Handicap medio perdido'
  }
}
```

### 8.2. Fórmulas para COMBO

```javascript
const COMBO_PAYOUT_FORMULAS = {
  WIN: {
    formula: 'profit_units = stake_units * (effective_total_odds - 1)',
    example: {
      stake_units: 2,
      effective_total_odds: 7.59,  // 1.95 × 2.10 × 1.85
      profit_units: 2 * (7.59 - 1) = 13.18
    }
  },
  
  LOSS: {
    formula: 'profit_units = -stake_units',
    example: {
      stake_units: 2,
      profit_units: -2
    },
    note: 'Cualquier leg loss → todo loss'
  },
  
  VOID: {
    formula: 'profit_units = 0',
    example: {
      stake_units: 2,
      profit_units: 0
    },
    note: 'Todos los legs void/push → todo void'
  },
  
  PARTIAL_VOID: {
    description: 'Algunos legs void/push, otros win',
    formula: 'effective_total_odds = PRODUCT(legs WHERE outcome = WIN)',
    example: {
      legs: [
        { outcome: 'win', odds: 1.95 },
        { outcome: 'win', odds: 2.10 },
        { outcome: 'void', odds: 1.85 }  // Eliminado del cálculo
      ],
      effective_total_odds: 1.95 * 2.10 = 4.095,
      stake_units: 2,
      profit_units: 2 * (4.095 - 1) = 6.19
    }
  }
}
```

### 8.3. Visualización del Cálculo

**UI Component (Auto-calculado y mostrado):**
```
┌─────────────────────────────────────────────┐
│ 💰 Resumen Financiero                        │
├─────────────────────────────────────────────┤
│                                              │
│ Stake: 2u                                    │
│ Odds: 1.95                                   │
│ Resultado: 🟢 Win                            │
│                                              │
│ Cálculo:                                     │
│ Profit = 2u × (1.95 - 1)                    │
│        = 2u × 0.95                           │
│        = +1.90u                              │
│                                              │
│ ✅ Ganancia Total: +1.90 unidades            │
│                                              │
└─────────────────────────────────────────────┘
```

---

## 9. Anti-Fraude / Reglas de Integridad

### 9.1. Validaciones Pre-Liquidación

```typescript
interface SettlementValidations {
  // Bloquear liquidación si:
  validations: {
    event_not_finished: {
      check: 'event_state != finished OR current_time < event_end_time',
      error: 'No puedes liquidar una señal de un evento que aún no ha finalizado',
      severity: 'error'
    },
    
    missing_external_id: {
      check: 'event_external_id IS NULL AND required = true',
      error: 'Este evento requiere ID externo para validación',
      severity: 'error'
    },
    
    signal_still_locked: {
      check: 'signal_status = locked BUT event_state != finished',
      error: 'El evento está bloqueado pero no finalizado. Espera a que termine.',
      severity: 'error'
    },
    
    already_settled: {
      check: 'settlement_status = settled AND admin_override = false',
      error: 'Esta señal ya fue liquidada. Solo admin puede corregir.',
      severity: 'error'
    },
    
    double_submit: {
      check: 'idempotency_key already exists',
      error: 'Esta liquidación ya fue procesada',
      severity: 'error'
    }
  }
}
```

### 9.2. Auditoría (Trazabilidad Total)

```typescript
interface SettlementAudit {
  // Campos guardados en cada liquidación
  audit_fields: {
    // Identidad
    settled_by: string,  // tipster_id
    settled_at: timestamp,
    
    // Valores
    settlement_outcome: SettlementOutcome,
    profit_units: number,
    
    // Evidencia
    result_source: string,
    proof_link?: string,
    notes?: string,
    
    // CLV
    closing_odds?: number,
    clv_percentage?: number,
    
    // Hash
    idempotency_key: string,  // Para evitar doble submit
    
    // Correcciones (si aplica)
    previous_value?: any,  // Si admin corrigió
    correction_reason?: string,
    corrected_by?: string,  // admin_id
    corrected_at?: timestamp
  },
  
  // Log de cambios
  changelog: {
    table: 'settlement_audit_log',
    fields: ['signal_id', 'action', 'old_value', 'new_value', 'user_id', 'timestamp', 'reason']
  }
}
```

### 9.3. Flags de Revisión

**Sistema automático de flags para marcar "En Revisión":**

```typescript
interface ReviewFlags {
  // Flag 1: Liquidación tardía
  late_settlement: {
    trigger: 'settled_at > event_end_time + 48 hours',
    severity: 'medium',
    action: 'move to in_review',
    notification: 'admin dashboard'
  },
  
  // Flag 2: Cambio por admin
  admin_correction: {
    trigger: 'previous_value IS NOT NULL',
    severity: 'high',
    action: 'log audit + notify tipster',
    transparency: 'visible in audit log'
  },
  
  // Flag 3: Discrepancia con data externa
  external_data_mismatch: {
    trigger: 'tipster_outcome != external_api_outcome',
    severity: 'high',
    action: 'move to in_review + request evidence',
    note: 'Futuro: integración con APIs de resultados'
  },
  
  // Flag 4: Patrón anómalo
  anomaly_pattern: {
    trigger: [
      'excessive void rate (>20% últimas 30 señales)',
      'excessive cancel rate (>10% últimas 30 señales)',
      'all wins with high odds (avg >3.0)',
      'settlement timing pattern (siempre >24h post-event)'
    ],
    severity: 'medium',
    action: 'notify fraud team',
    automated: true
  },
  
  // Flag 5: Manual de soporte
  manual_flag: {
    trigger: 'support staff marks signal for review',
    severity: 'variable',
    action: 'move to in_review',
    reason_required: true
  }
}
```

---

## 10. UX: Empty States

### 10.1. Sin Pendientes

```typescript
interface EmptyStatePending {
  condition: 'no pending settlements',
  
  ui: {
    icon: '✅',
    title: 'No tienes liquidaciones pendientes',
    description: '¡Buen trabajo! Todos tus picks están liquidados.',
    
    cta: {
      label: 'Ver Mis Señales',
      href: '/tipster/signals',
      variant: 'outline'
    }
  }
}
```

### 10.2. En Revisión

```typescript
interface EmptyStateReview {
  condition: 'signals in review',
  
  ui: {
    icon: '🔍',
    title: 'Liquidaciones en Revisión',
    description: 'Estas liquidaciones están siendo revisadas por el equipo. Te notificaremos si necesitamos evidencia adicional.',
    
    actions: [
      {
        label: 'Agregar Evidencia',
        variant: 'primary',
        action: 'open evidence modal'
      },
      {
        label: 'Contactar Soporte',
        variant: 'outline',
        href: '/tipster/support'
      }
    ]
  }
}
```

### 10.3. Filtros Sin Resultados

```typescript
interface EmptyStateFilters {
  condition: 'filters active && results = 0',
  
  ui: {
    icon: '🔍',
    title: 'No se encontraron señales',
    description: 'No hay señales que coincidan con los filtros seleccionados.',
    
    cta: {
      label: 'Limpiar Filtros',
      action: 'reset_all_filters',
      variant: 'primary'
    }
  }
}
```

---

## 11. Responsive Design

### 11.1. Desktop (>1200px)
- Tabla completa con todas las columnas
- Modal de liquidación: panel lateral (500px)
- Filtros: inline grid

### 11.2. Tablet (768px - 1200px)
- Tabla con scroll horizontal
- Modal: centrado (80% ancho)
- Filtros: grid 2 columnas

### 11.3. Mobile (<768px)
- Tabla → Cards verticales
- Cada card muestra:
  - Evento + fecha
  - Estructura + selección
  - Odds + unidades
  - Estado
  - Botón "Liquidar" visible
- Modal: full-screen
- Filtros: accordion expandible

**Card Layout Mobile:**
```
┌─────────────────────────────────────┐
│ 📅 Feb 10, 2026 - 20:00            │
│ ⚽ Real Madrid vs Barcelona         │
│ La Liga                             │
├─────────────────────────────────────┤
│ 🎯 Single                           │
│ Over 2.5 @1.95                      │
│ Stake: 2u                           │
├─────────────────────────────────────┤
│ 🟡 Pendiente                        │
│ [    Liquidar    ]                  │
└─────────────────────────────────────┘
```

---

## 12. Mock Data (Obligatorio para HTML)

### 12.1. Estructura de Mock

```typescript
const MOCK_SETTLEMENTS = {
  pending_single: [
    {
      signal_id: 'sig_001',
      event_date: '2026-02-10 20:00',
      event_name: 'Real Madrid vs Barcelona',
      league: 'La Liga',
      bet_type: 'prematch',
      bet_structure: 'single',
      market_type: 'totals',
      selection: 'Over 2.5',
      published_odds: 1.95,
      stake_units: 2,
      event_state: 'finished',
      settlement_status: 'pending',
      access_type: 'free'
    },
    {
      signal_id: 'sig_002',
      event_date: '2026-02-09 22:00',
      event_name: 'Lakers vs Celtics',
      league: 'NBA',
      bet_type: 'live',
      bet_structure: 'single',
      market_type: 'moneyline',
      selection: 'Lakers ML',
      published_odds: 2.10,
      stake_units: 3,
      event_state: 'finished',
      settlement_status: 'pending',
      access_type: 'credits'
    },
    {
      signal_id: 'sig_003',
      event_date: '2026-02-09 18:00',
      event_name: 'PSG vs Bayern',
      league: 'Champions League',
      bet_type: 'prematch',
      bet_structure: 'single',
      market_type: 'btts',
      selection: 'BTTS Yes',
      published_odds: 1.85,
      stake_units: 2,
      event_state: 'finished',
      settlement_status: 'pending',
      access_type: 'subscription'
    }
  ],
  
  pending_combo: [
    {
      signal_id: 'combo_001',
      event_date: '2026-02-10',
      combo_name: 'Weekend Combo',
      bet_structure: 'combo',
      legs: [
        {
          leg_number: 1,
          event: 'Juventus vs Milan',
          selection: 'Juventus ML',
          odds: 1.75
        },
        {
          leg_number: 2,
          event: 'Man United vs Arsenal',
          selection: 'Over 2.5',
          odds: 1.90
        },
        {
          leg_number: 3,
          event: 'Heat vs Nuggets',
          selection: 'Nuggets -5.5',
          odds: 1.95
        }
      ],
      total_odds: 6.49,  // 1.75 × 1.90 × 1.95
      stake_units: 1.5,
      event_state: 'finished',
      settlement_status: 'pending',
      access_type: 'credits'
    },
    {
      signal_id: 'combo_002',
      event_date: '2026-02-09',
      combo_name: 'Tuesday Special',
      bet_structure: 'combo',
      legs: [
        {
          leg_number: 1,
          event: 'Reds vs Blues (Rugby)',
          selection: 'Reds ML',
          odds: 2.20
        },
        {
          leg_number: 2,
          event: 'ATP Finals',
          selection: 'Over 22.5 games',
          odds: 1.88
        }
      ],
      total_odds: 4.14,  // 2.20 × 1.88
      stake_units: 2,
      event_state: 'finished',
      settlement_status: 'pending',
      access_type: 'free'
    }
  ],
  
  settled: [
    {
      signal_id: 'sig_101',
      event_date: '2026-02-08 20:00',
      event_name: 'Chelsea vs Liverpool',
      league: 'Premier League',
      bet_structure: 'single',
      selection: 'Liverpool ML',
      published_odds: 2.30,
      stake_units: 2,
      settlement_status: 'settled',
      settlement_outcome: 'win',
      profit_units: 2.60,  // 2 × (2.30 - 1)
      settled_at: '2026-02-08 22:05',
      result_source: 'manual',
      closing_odds: 2.25,
      clv_percentage: -2.17  // (2.25 - 2.30) / 2.30
    },
    {
      signal_id: 'sig_102',
      event_date: '2026-02-07 19:00',
      event_name: 'Bucks vs Warriors',
      league: 'NBA',
      bet_structure: 'single',
      selection: 'Under 225.5',
      published_odds: 1.92,
      stake_units: 2.5,
      settlement_status: 'settled',
      settlement_outcome: 'loss',
      profit_units: -2.5,
      settled_at: '2026-02-07 21:30',
      result_source: 'scoreboard'
    }
  ],
  
  in_review: [
    {
      signal_id: 'sig_201',
      event_date: '2026-02-05 15:00',
      event_name: 'Davis Cup - Spain vs USA',
      league: 'Tennis',
      bet_structure: 'single',
      selection: 'Spain to Win',
      published_odds: 1.65,
      stake_units: 3,
      settlement_status: 'in_review',
      flag_reason: 'Late settlement (>48h post-event)',
      flagged_at: '2026-02-08 10:00'
    }
  ]
}
```

---

## 13. Integración con Otros Módulos

### 13.1. Flujo desde "Mis Señales"

```
Mis Señales (event finished) → Liquidaciones (pending)
                                      ↓
                              [Liquidar] → Modal
                                      ↓
                              Confirm Settlement
                                      ↓
                              Actualizar Stats
```

### 13.2. Actualización de Stats

```javascript
const STATS_UPDATE_FLOW = {
  trigger: 'settlement confirmed',
  
  async_jobs: [
    'recalculate_tipster_roi',
    'recalculate_winrate',
    'update_units_won',
    'update_clv_avg',
    'update_ranking',
    'update_public_profile',
    'update_leaderboard'
  ],
  
  priority: 'high',
  
  notifications: {
    tipster: 'Tus estadísticas se han actualizado',
    followers: 'if signal was public',
    admin: 'if flagged for review'
  }
}
```

### 13.3. Impact en User Side (Si Siguieron la Señal)

```javascript
const USER_TRACKING_UPDATE = {
  trigger: 'tipster settles signal',
  
  if_user_followed: {
    action: 'update user bankroll tracking',
    fields: [
      'user_pick.result = settlement_outcome',
      'user_pick.profit = calculated based on user stake',
      'user_bankroll.total_profit += profit',
      'user_bankroll.roi = recalculated'
    ]
  },
  
  note: 'User can override if their bookmaker settled differently'
}
```

### 13.4. Community & Leaderboard

```javascript
const COMMUNITY_UPDATE = {
  trigger: 'settlement confirmed',
  
  updates: {
    tipster_card: {
      roi: 'recalculated',
      winrate: 'recalculated',
      total_picks: 'incremented'
    },
    
    leaderboard: {
      ranking: 'recalculated async',
      position_change: 'notified if significant'
    },
    
    followers_feed: {
      if_public_signal: 'show result in feed',
      notification: 'if followers have notifications enabled'
    }
  }
}
```

---

## 14. Pricing & Monetización (NO Mostrar Aquí)

### 14.1. Nota Explícita

```
⚠️ IMPORTANTE: NO MEZCLAR PRICING EN LIQUIDACIONES

En este módulo NO se muestran:
❌ Costos en créditos
❌ Precios de suscripción
❌ Ganancias monetarias del tipster
❌ Ingresos por señal

Solo se muestran:
✅ Unidades (stake_units)
✅ Profit en unidades (profit_units)
✅ Resultados (win/loss/void)
✅ Estadísticas de performance

La monetización es independiente del resultado.
Los ingresos se gestionan en /tipster/wallet.
```

### 14.2. Separación de Concerns

```javascript
const MODULE_SEPARATION = {
  settlements: {
    manages: ['results', 'units', 'statistics', 'performance'],
    does_not_manage: ['pricing', 'earnings', 'withdrawals', 'subscriptions']
  },
  
  wallet: {
    manages: ['earnings', 'withdrawals', 'payment_history'],
    gets_data_from: 'settlements (for volume metrics only)'
  },
  
  signals: {
    manages: ['pricing', 'access_type', 'credit_cost'],
    feeds_data_to: 'settlements (for liquidation)'
  }
}
```

---

## 15. Validaciones UI/UX

### 15.1. Validaciones de Formulario

```typescript
interface FormValidations {
  settlement_outcome: {
    required: true,
    error: 'Debes seleccionar un resultado'
  },
  
  combo_legs: {
    required: true,
    validation: 'all legs must have outcome',
    error: 'Todos los legs del combo deben tener resultado'
  },
  
  closing_odds: {
    required: false,
    min: 1.01,
    max: 100.00,
    error: 'Odds de cierre deben estar entre 1.01 y 100.00'
  },
  
  proof_link: {
    required: false,
    format: 'url',
    error: 'Debe ser una URL válida'
  },
  
  notes: {
    required: false,
    maxLength: 240,
    error: 'Máximo 240 caracteres'
  }
}
```

### 15.2. Feedback Visual

```typescript
interface VisualFeedback {
  // Loading states
  settlement_in_progress: {
    show: 'spinner + "Procesando liquidación..."',
    disable_buttons: true
  },
  
  // Success
  settlement_confirmed: {
    show: 'toast notification',
    message: '✅ Liquidación confirmada. Tus estadísticas se están actualizando.',
    duration: 5000,
    close_modal: true
  },
  
  // Error
  settlement_failed: {
    show: 'alert in modal',
    message: 'Error al liquidar. {error_message}',
    keep_modal_open: true
  },
  
  // Calculation preview
  profit_preview: {
    show: 'live calculation as user selects outcome',
    format: '+X.XXu | -X.XXu',
    color: 'green (win) | red (loss) | gray (void/push)'
  }
}
```

---

## 16. Accessibility & Internationalization

### 16.1. Accessibility

```typescript
const ACCESSIBILITY_REQUIREMENTS = {
  keyboard_navigation: {
    modal: 'can be closed with ESC',
    form: 'tab order logical',
    buttons: 'focus visible'
  },
  
  screen_readers: {
    labels: 'all form fields have labels',
    alerts: 'important messages announced',
    status: 'settlement status announced'
  },
  
  colors: {
    contrast: 'WCAG AA compliant',
    no_color_only: 'icons + text for status'
  }
}
```

### 16.2. I18n Readiness

```typescript
const I18N_KEYS = {
  'settlement.title': 'Liquidaciones',
  'settlement.subtitle': 'Liquida resultados de tus señales...',
  'settlement.outcome.win': 'Win',
  'settlement.outcome.loss': 'Loss',
  'settlement.outcome.void': 'Void',
  'settlement.confirm': 'Confirmar Liquidación',
  'settlement.warning': 'Esto actualizará tus estadísticas y ranking...',
  // ... más keys
}
```

---

## 17. Performance & Optimization

### 17.1. Paginación

```typescript
interface Pagination {
  default_page_size: 20,
  options: [10, 20, 50, 100],
  server_side: true,  // No cargar todas las señales
  infinite_scroll: false  // Usar pagination tradicional
}
```

### 17.2. Caching

```typescript
const CACHING_STRATEGY = {
  pending_list: {
    cache_duration: '5 minutes',
    invalidate_on: 'settlement confirmed'
  },
  
  settled_list: {
    cache_duration: '30 minutes',
    invalidate_on: 'admin correction'
  },
  
  stats: {
    cache_duration: '10 minutes',
    invalidate_on: 'settlement confirmed'
  }
}
```

---

## 17.5. Idempotency Key (Anti-Doble Liquidación)

**Formato estándar:** `signal_id:settlement_attempt_id`

**Ejemplos válidos:**
- `sig_123456:attempt_001`
- `sig_789012:attempt_002`
- `sig_345678:settle_20240115_1430`

**Implementación:**
```typescript
const generateIdempotencyKey = (signalId: string): string => {
  const timestamp = new Date().toISOString().slice(0, 16); // Minuto preciso
  const attemptId = `attempt_${timestamp}`;
  return `${signalId}:${attemptId}`;
};

// Alternativa con bucket por minuto
const generateIdempotencyKeyBucket = (signalId: string): string => {
  const minuteBucket = Math.floor(Date.now() / 60000); // Bucket por minuto
  return `${signalId}:${minuteBucket}`;
};
```

**Validación backend:**
- Rechazar duplicados dentro de 5 minutos
- Permitir re-intentos después de 5 minutos (mismo resultado)
- Loguear intentos duplicados para auditoría

---

## 18. Testing Checklist

### 18.1. Funcionalidad

- [ ] Liquidar single win
- [ ] Liquidar single loss
- [ ] Liquidar single void
- [ ] Liquidar single push
- [ ] Liquidar single half_win
- [ ] Liquidar single half_loss
- [ ] Liquidar combo all win
- [ ] Liquidar combo with void leg
- [ ] Liquidar combo with loss leg
- [ ] CLV calculation (opcional)
- [ ] Profit units calculation
- [ ] Validación evento no finalizado
- [ ] Validación doble liquidación
- [ ] Idempotency key formato: `signal_id:settlement_attempt_id`
- [ ] Audit log creation

### 18.2. UX

- [ ] Modal abre correctamente
- [ ] Formulario valida campos requeridos
- [ ] Cálculo de profit en tiempo real
- [ ] Confirmación muestra warning
- [ ] Toast notification post-submit
- [ ] Tabla actualiza después de liquidar
- [ ] Filtros funcionan correctamente
- [ ] Empty states muestran correctamente
- [ ] Responsive en móvil

### 18.3. Seguridad

- [ ] Solo tipster puede liquidar sus señales
- [ ] Validación de evento finalizado
- [ ] Idempotency key previene duplicados (formato: `signal_id:settlement_attempt_id`)
- [ ] Audit log registra cambios
- [ ] Admin override requiere permisos

---

## 🎯 Resultado Esperado

`tipster-settlements.md` debe quedar con:

✅ **Estructura modular** clara  
✅ **Campos definidos** con validaciones  
✅ **Reglas claras** para single y combo  
✅ **Sin inventar diseño** nuevo  
✅ **Mock data** completo (8 items)  
✅ **Separación clara** de pricing  
✅ **Listo para HTML** posterior  

---

## 19. Auto-Settlement Fallback (OBLIGATORIO)

### 19.1. Auto-Liquidación por Sistema

**Problema real:** El 40% de tipsters NO liquidan picks perdidos, creando fraude selectivo.

**Solución:** Sistema liquida automáticamente si el tipster no lo hace.

**⚠️ MVP (V1):** Implementación manual con flags y auditoría
**🚀 FUTURO (V2):** Integración con APIs externas automatizada

```typescript
interface AutoSettlementRules {
  trigger: 'event_finished + 24h AND settlement_status = null',
  
  process: {
    step1: 'Verificar data externa (API resultados)',  // FUTURO: V2
    step2: 'Si existe data → liquidar con resultado externo',  // FUTURO: V2
    step3: 'Si no existe data → marcar in_review',  // MVP: V1
    step4: 'Registrar auto_settlement = true',
    step5: 'Notificar al tipster',
    step6: 'Actualizar estadísticas'
  },
  
  immutability: 'Una auto-liquidada, solo admin puede corregir',
  
  penalties: {
    warning: '3 auto-settlements en 7 días',
    ranking_penalty: '7 auto-settlements en 30 días (-10% ranking)',
    suspension: '15 auto-settlements → suspensión temporal 7 días',
    review_required: 'Patrón detectado → revisión manual'
  }
}
```

### 19.2. Proceso de Detección

**Definición de event_end_time:**
- `event_state = finished` lo define el sistema (provider o admin)
- `event_end_time` = timestamp cuando se marca como finished
- Varía por deporte: 90+ min (fútbol), 48 min (NBA), etc.

```javascript
const AUTO_SETTLEMENT_JOB = {
  frequency: 'cada 1 hora',
  query: `
    SELECT signals.* 
    FROM signals 
    WHERE event_state = 'finished' 
    AND settlement_status IS NULL 
    AND event_end_time < NOW() - INTERVAL '24 hours'
    AND auto_settlement_attempts < 3
  `,
  
  actions: {
    check_external_data: 'Llamar API resultados',  // FUTURO: V2
    settle_automatically: 'Si data confiable disponible',  // FUTURO: V2
    mark_review: 'Si data no disponible/conflicto',  // MVP: V1 - Manual por admin
    increment_attempts: 'Para reintentos futuros'
  }
}
```

**Nota:** En V1, las auto-liquidaciones se marcan como `in_review` para revisión manual por admin. **Importante:** Cuando una señal está `in_review`, el tipster queda bloqueado y no puede realizar acciones sobre esa señal hasta que un admin resuelva la revisión.

### 19.3. Notificaciones

```typescript
interface AutoSettlementNotifications {
  tipster: {
    title: 'Auto-liquidación realizada',
    message: 'Tu señal {event_name} fue liquidada automáticamente por no registrar resultado en 24h.',
    action: 'Ver detalles',
    priority: 'high'
  },
  
  admin: {
    trigger: 'penalty_threshold_reached',
    message: 'Tipster {username} alcanzó umbral de auto-liquidaciones. Revisar patrón.'
  }
}
```

---

## 20. Impacto en Compradores

### 20.1. Actualización de User Signals

Cuando una señal se liquida, cada comprador recibe actualización automática:

```typescript
interface BuyerSettlementImpact {
  trigger: 'signal settlement confirmed',
  
  update_user_signal: {
    status: 'settlement_outcome',  // win, loss, void, push
    profit_units: 'user_stake * (odds - 1) IF win ELSE -user_stake',
    settled_at: 'timestamp',
    settlement_method: 'manual | auto | admin'
  },
  
  update_user_stats: {
    total_profit: 'SUM de todas sus señales',
    win_rate: 'wins / total settled',
    current_streak: 'calcular desde últimas',
    bankroll_change: 'actualizar según profit'
  }
}
```

### 20.2. Bankroll Tracking

```typescript
interface BankrollUpdate {
  user_id: 'buyer_id',
  signal_id: 'signal_id',
  
  transaction: {
    type: 'signal_settlement',
    amount: 'profit_units (positivo o negativo)',
    description: 'Settlement: {event_name} - {selection}',
    timestamp: 'settlement_time'
  },
  
  balance: 'previous_balance + profit_units',
  
  history: 'registro permanente para auditoría'
}
```

### 20.3. ROI del Usuario

```javascript
const USER_ROI_CALCULATION = {
  formula: '(total_profit_units / total_stake_units) * 100',
  timeframe: ['7D', '30D', '90D', 'ALL'],
  
  includes: {
    settled_signals: 'solo señales liquidadas',
    pending_signals: 'no incluir',
    canceled_signals: 'excluir completamente'
  }
}
```

---

## 21. Lock del Pick (CRÍTICO ANTI-FRAUDE)

### 21.1. Timing del Lock

**Problema:** Tipsters editan picks después de ver alineaciones.

**Solución:** Bloquear ediciones 2 minutos antes del evento.

```typescript
interface PickLockRules {
  lock_trigger: 'kickoff_time - 2 minutes',
  
  locked_fields: [
    'selection',
    'market_type', 
    'published_odds',
    'stake_units',
    'bet_structure',
    'combo_legs'
  ],
  
  allowed_post_lock: [
    'add_analysis',
    'edit_notes',
    'cancel_signal'  // Solo si no ha empezado
  ],
  
  exception: 'admin_override_with_audit'
}
```

### 21.2. Proceso de Lock

```javascript
const PICK_LOCK_PROCESS = {
  job_frequency: 'cada 30 segundos',
  
  query: `
    SELECT signals.* 
    FROM signals 
    WHERE signal_status = 'active'
    AND kickoff_time <= NOW() + INTERVAL '2 minutes'
    AND locked = false
  `,
  
  action: 'UPDATE signals SET locked = true WHERE id = {id}',
  
  notification: 'Enviar notificación al tipster: "Tu pick está bloqueado"'
}
```

### 21.3. UI Behavior

```typescript
interface UILockBehavior {
  pre_lock: {
    edit_button: 'enabled',
    tooltip: 'Editar disponible',
    warning: 'Se bloqueará en 2 min'
  },
  
  post_lock: {
    edit_button: 'disabled',
    tooltip: 'Pick bloqueado - evento próximo',
    visual_indicator: 'lock icon next to signal'
  }
}
```

---

## 22. Prioridad de Fuente (Jerarquía de Resultados)

### 22.1. Orden de Confianza

```typescript
enum SourcePriority {
  API_OFFICIAL = 1,      // API oficial de la liga
  BOOKMAKER_SETTLEMENT = 2,  // Casa de apuestas
  SCOREBOARD_OFFICIAL = 3,   // Marcador oficial
  MANUAL_TIPSTER = 4        // Entrada manual
}

interface SourceOverrideRules {
  higher_priority_wins: 'Si existe fuente superior → invalida inferior',
  
  conflict_resolution: {
    detect: 'Comparar resultados de múltiples fuentes',
    flag: 'Marcar in_review si conflicto significativo',
    notify: 'Alertar a admin sobre discrepancia',
    resolve: 'Admin decide con evidencia'
  }
}
```

### 22.2. Proceso de Validación

```javascript
const SOURCE_VALIDATION = {
  auto_check: {
    external_apis: 'Consultar fuentes confiables',
    confidence_score: 'Asignar puntuación a cada fuente',
    majority_consensus: 'Verificar acuerdo entre fuentes'
  },
  
  manual_review: {
    trigger: 'conflicto_entre_fuentes OR resultado_inusual',
    evidence_required: 'Screenshots, links oficiales',
    admin_decision: 'Final override con justificación'
  }
}
```

---

## 23. CLV Correcto (No Opcional)

### 23.1. CLV como Métrica Core

**Importancia:** CLV diferencia habilidad de suerte.

**⚠️ MVP (V1):** CLV calculable cuando exista closing_odds, N/A si no hay data
**🚀 FUTURO (V2):** Closing odds automáticos de múltiples fuentes

```typescript
interface CLVCalculation {
  required: 'calculable_when_data_available',  // No obligatorio si no hay data
  
  formula: '(closing_odds - published_odds) / published_odds * 100',
  
  impact_ranking: {
    positive_clv: 'Consistentemente > +2% → ranking boost (cuando data disponible)',
    negative_clv: 'Consistentemente < -2% → ranking decay (cuando data disponible)',
    no_data: 'CLV = N/A → no impacta ranking negativamente',
    exceptional: '> +5% consistente → featured tipster'
  },
  
  timeframe: 'Últimos 100 picks mínimo (solo picks con data CLV)',
  
  weight: '30% del algoritmo de ranking (solo cuando data suficiente)'
}
```

### 23.2. Cálculo Automático

```javascript
const CLV_AUTO_CALCULATION = {
  mvp: {
    trigger: 'manual_input_by_tipster_or_admin',
    source: 'closing_odds_opcional_en_formulario',
    calculation: 'Si closing_odds existe → calcular CLV'
  },
  
  futuro: {
    trigger: 'signal_published',  // FUTURO: V2
    data_sources: [
      'Closing odds de múltiples bookmakers',  // FUTURO: V2
      'Promedio ponderado por volumen',  // FUTURO: V2
      'Excluir outliers significativos'  // FUTURO: V2
    ],
    update_frequency: 'Cada 15 minutos hasta kickoff',  // FUTURO: V2
    final_clv: 'Registrado en kickoff_time - 1 minuto'  // FUTURO: V2
  }
}
```

### 23.3. Penalización por Mala CLV

```typescript
interface CLVPenalties {
  threshold: '-2% promedio en últimos 50 picks',
  
  actions: {
    warning: 'Notificación educativa sobre CLV',
    ranking_impact: '-15% en posición de ranking',
    visibility: 'Reducir visibilidad en marketplace',
    review: 'Revisar estrategia de publicación'
  }
}
```

---

## 24. Cancel Abuse Detection

### 24.1. Detección de Abuso

**Problema:** Tipsters cancelan picks perdidos antes del final.

**Solución:** Monitorear y penalizar cancelaciones abusivas.

```typescript
interface CancelAbuseDetection {
  metrics: {
    cancel_rate: 'canceled_signals / total_signals_last_30d',
    pre_kickoff_cancels: 'Cancelaciones antes del evento',
    post_start_cancels: 'Cancelaciones después de iniciado',
    timing_pattern: 'Análisis de momento de cancelación'
  },
  
  thresholds: {
    flag: '> 10% cancel rate en 30 días',
    penalty: '> 20% cancel rate en 30 días',
    suspension: '> 30% cancel rate en 30 días'
  }
}
```

### 24.2. Penalizaciones Progresivas

```javascript
const CANCEL_PENALTIES = {
  level_1: {
    threshold: '10-15% cancel rate',
    action: 'Warning + educación sobre políticas',
    monitoring: 'Revisión semanal del patrón'
  },
  
  level_2: {
    threshold: '15-20% cancel rate', 
    action: 'Ranking penalty -20% + restricción temporal',
    duration: '14 días de penalización'
  },
  
  level_3: {
    threshold: '20-30% cancel rate',
    action: 'Suspensión temporal 30 días + revisión manual',
    requirement: 'Aprobar curso de ética antes de reactivar'
  },
  
  level_4: {
    threshold: '> 30% cancel rate',
    action: 'Suspensión permanente investigación',
    review: 'Equipo legal + devolución a compradores afectados'
  }
}
```

### 24.3. Proceso de Revisión

```typescript
interface CancelReviewProcess {
  automatic_flag: 'Sistema detecta umbral superado',
  
  manual_review: {
    evidence: 'Análisis de razones de cancelación',
    context: 'Considerar circunstancias atenuantes',
    decision: 'Admin decide penalización final'
  },
  
  appeal: 'Tipster puede apelar con justificación dentro de 48h'
}
```

---

**Versión:** 2.0  
**Última actualización:** 2026-02-10  
**Autor:** Sistema Trader Deportivo  
**Estado:** Listo para implementación con controles anti-fraude

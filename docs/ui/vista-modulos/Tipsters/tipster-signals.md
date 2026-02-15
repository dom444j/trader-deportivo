# Tipster Signals Module

## Concepto Central

**Mis Señales es el gestor de operaciones completo donde el tipster administra TODAS sus publicaciones: borradores, activas, finalizadas y canceladas.**

No es solo una tabla histórica — es el centro de control del flujo de trabajo del tipster, desde la creación de un pick hasta su liquidación final.

**Principio fundamental:** Este módulo es la fuente de verdad de todas las métricas y estadísticas del tipster. Cada señal pasa por un lifecycle estricto que alimenta el dashboard y las estadísticas.

---

## 1. Propósito del Módulo

Mis Señales tiene **6 objetivos estratégicos:**

1. **Gestión completa** — Crear, editar, publicar, monitorear señales
2. **Control de workflow** — Draft → Published → Locked → Settled
3. **Monitoreo en tiempo real** — Señales activas, pending, live
4. **Trazabilidad total** — Historial completo de publicaciones
5. **Fuente de verdad** — Todos los stats se calculan desde aquí
6. **UX optimizada** — Filtros potentes, acciones rápidas, vista clara

### 1.1. Lo Que el Tipster Puede Hacer Aquí

✅ **Revisar señales activas** — Qué está publicado sin resolver  
✅ **Editar borradores** — Modificar antes de publicar  
✅ **Publicar picks** — De draft a published  
✅ **Monitorear resultados** — Pending, live, finalizadas  
✅ **Cancelar señales** — Antes del inicio del evento  
✅ **Ir a liquidar** — Redirigir a settlements para resolver  

### 1.2. Lo Que NO Se Hace Aquí

❌ **NO calcular estadísticas** — Eso es en Dashboard/Stats  
❌ **NO liquidar directamente** — Se redirige a /settlements  
❌ **NO usar dinero real** — Son señales, no apuestas  
❌ **NO mostrar seguidores** — Eso es en Community  
❌ **NO análisis profundo** — Solo gestión operativa  

---

## 2. Ruta y Navegación

### 2.1. Ruta Principal

```
/tipster/signals
```

### 2.2. Rutas Relacionadas

```typescript
const TIPSTER_SIGNALS_ROUTES = {
  list: '/tipster/signals',              // este módulo
  create: '/tipster/signals/new',        // crear señal
  edit: '/tipster/signals/:id/edit',     // editar draft
  detail: '/tipster/signals/:id',        // ver detalle
  settle: '/tipster/settlements'         // liquidar
}
```

### 2.3. Sidebar Navigation

**Usar exactamente el mismo sidebar del Tipster Dashboard.**

```typescript
interface TipsterSidebar {
  sections: [
    {
      title: "Principal",
      items: [
        { icon: "📊", label: "Dashboard", path: "/tipster/dashboard", active: false },
        { icon: "📡", label: "Mis Señales", path: "/tipster/signals", active: true },
        { icon: "➕", label: "Crear Señal", path: "/tipster/signals/new", active: false },
        { icon: "💰", label: "Liquidaciones", path: "/tipster/settlements", active: false }
      ]
    },
    {
      title: "Comunidad",
      items: [
        { icon: "👥", label: "Suscriptores", path: "/tipster/subscribers", active: false }
      ]
    },
    {
      title: "Cuenta",
      items: [
        { icon: "👛", label: "Billetera", path: "/tipster/wallet", active: false },
        { icon: "🧑‍💼", label: "Perfil", path: "/tipster/profile", active: false }
      ]
    },
    {
      title: "Ayuda",
      items: [
        { icon: "🛟", label: "Soporte", path: "/tipster/support", active: false }
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

Nota: Eliminar rutas no definidas en ROUTES: /tipster/stats, /tipster/followers, /tipster/settings (settings es global: /settings).

**Item activo:** Mis Señales

---

## 3. Estructura de la Página

### 3.1. Header

```typescript
interface PageHeader {
  title: "📡 Mis Señales"
  subtitle: "Administra tus picks, monitorea su estado y controla tu historial de publicaciones."
  
  action: {
    type: "button",
    variant: "primary",
    icon: "➕",
    label: "Crear Señal",
    href: "/tipster/signals/new"
  }
}
```

**Layout:**
- Left: Title + Subtitle (vertical stack)
- Right: Primary button (gradient, hover lift)

---

### 3.2. Filtros Superiores (MUY IMPORTANTE)

**No es solo un buscador — es control de flujo de trabajo.**

#### 3.2.1. Tabs Principales (Segment Control)

```typescript
interface WorkflowTabs {
  tabs: [
    {
      key: "all",
      label: "Todas",
      description: "Todas las señales sin filtro"
    },
    {
      key: "active",
      label: "Activas",
      description: "Publicadas sin resolver",
      badge_color: "cyan"
    },
    {
      key: "pending",
      label: "Pendientes",
      description: "Evento aún no empieza",
      badge_color: "orange"
    },
    {
      key: "live",
      label: "En Juego",
      description: "Evento en curso",
      badge_color: "blue"
    },
    {
      key: "finished",
      label: "Finalizadas",
      description: "Resueltas (win/loss/void)",
      badge_color: "green"
    },
    {
      key: "canceled",
      label: "Canceladas",
      description: "Canceladas antes de inicio",
      badge_color: "red"
    },
    {
      key: "drafts",
      label: "Borradores",
      description: "No publicadas",
      badge_color: "gray"
    }
  ]
}
```

**UI Behavior:**
- Segment control (botones unidos)
- Badge con contador (opcional)
- Active state: primary cyan
- Responsive: scroll horizontal en mobile

**Workflow separado claramente:**
```
Draft → Published → Locked → Settled
              ↓         ↓
          Pending   Live
```

#### 3.2.2. Filtros Secundarios

```typescript
interface SecondaryFilters {
  // Rango de fechas
  date_range: {
    type: "select",
    options: ["7d", "30d", "90d", "custom"],
    default: "30d"
  }
  
  // Deporte
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
  
  // Mercado
  market: {
    type: "select",
    options: [
      { value: "all", label: "Todos los mercados" },
      { value: "moneyline", label: "Moneyline" },
      { value: "totals", label: "Totals (O/U)" },
      { value: "handicap", label: "Handicap" },
      { value: "btts", label: "BTTS" },
      { value: "props", label: "Props" }
    ]
  }
  
  // Tipo
  type: {
    type: "select",
    options: [
      { value: "all", label: "Todos" },
      { value: "prematch", label: "Prematch" },
      { value: "live", label: "Live" }
    ]
  }
  
  // Resultado
  result: {
    type: "select",
    options: [
      { value: "all", label: "Todos los resultados" },
      { value: "pending", label: "🟡 Pending" },
      { value: "win", label: "🟢 Win" },
      { value: "loss", label: "🔴 Loss" },
      { value: "void", label: "⚪ Void" }
    ]
  }
}
```

**Layout:**
- Grid: 5 columnas en desktop
- Stack: vertical en mobile
- Sticky: se mantiene visible al scroll

---

### 3.3. Tabla Principal de Señales

**Esta es la pieza central del módulo.**

#### 3.3.1. Columnas

```typescript
interface SignalsTable {
  columns: [
    {
      key: "published_date",
      label: "Fecha Publicación",
      width: "120px",
      sortable: true,
      format: "YYYY-MM-DD HH:mm"
    },
    {
      key: "event",
      label: "Evento",
      width: "240px",
      format: "Team A vs Team B | League | Start Time"
    },
    {
      key: "bet_structure",
      label: "Tipo",
      width: "90px",
      format: "Badge (SINGLE | COMBO | SYSTEM)"
    },
    {
      key: "selection",
      label: "Selección",
      width: "180px",
      format: "Team/Player/Market Value (SINGLE) | 'N picks' (COMBO/SYSTEM)"
    },
    {
      key: "market",
      label: "Mercado",
      width: "120px",
      format: "Moneyline | Totals | Handicap (SINGLE) | Multiple (COMBO/SYSTEM)"
    },
    {
      key: "odds",
      label: "Odds",
      width: "80px",
      sortable: true,
      format: "Decimal (SINGLE) | '-' (COMBO/SYSTEM)"
    },
    {
      key: "total_odds",
      label: "Total Odds",
      width: "100px",
      sortable: true,
      format: "Decimal (COMBO/SYSTEM); SINGLE = odds"
    },
    {
      key: "suggested_stake",
      label: "Stake Sugerido (%)",
      width: "100px",
      format: "1-5% of bankroll",
      note: "⚠️ Sugerido al usuario, no stake personal del tipster"
    },
    {
      key: "value",
      label: "Valor (CLV)",
      width: "100px",
      sortable: true,
      format: "+2.5% | -1.0%",
      color_coded: true
    },
    {
      key: "status",
      label: "Estado",
      width: "100px",
      format: "Badge (Draft | Published | Locked | Settled)"
    },
    {
      key: "result",
      label: "Resultado",
      width: "100px",
      format: "Badge (Pending | Win | Loss | Void)"
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

#### 3.3.2. Estados del Lifecycle (CRÍTICO)

```typescript
enum SignalLifecycle {
  DRAFT = 'draft',           // Creada pero no publicada
  PUBLISHED = 'published',   // Publicada, evento no iniciado
  LOCKED = 'locked',         // Evento iniciado, no editable
  SETTLED = 'settled',       // Resuelta (win/loss/void)
  CANCELED = 'canceled'      // Cancelada antes de inicio
}

enum SignalResult {
  PENDING = 'pending',       // Aún no resuelta
  WIN = 'win',              // Ganada
  LOSS = 'loss',            // Perdida
  VOID = 'void'             // Anulada
}

// Nueva: estructura de apuesta
enum BetStructure {
  SINGLE = 'SINGLE',
  COMBO = 'COMBO',
  SYSTEM = 'SYSTEM'
}
```

**Transiciones de estado:**

```javascript
const LIFECYCLE_TRANSITIONS = {
  draft: {
    can_transition_to: ['published', 'canceled'],
    actions: ['edit', 'publish', 'delete']
  },
  
  published: {
    can_transition_to: ['locked', 'canceled'],
    actions: ['view', 'cancel'],
    auto_transition: {
      to: 'locked',
      when: 'event_start_time'
    }
  },
  
  locked: {
    can_transition_to: ['settled'],
    actions: ['view', 'settle'],
    note: 'No editable, evento en curso o terminado'
  },
  
  settled: {
    can_transition_to: [],
    actions: ['view'],
    note: 'Final state, no changes allowed'
  },
  
  canceled: {
    can_transition_to: [],
    actions: ['view'],
    note: 'Final state'
  }
}
```

**Esto es CRÍTICO porque:**
- El sistema calculará estadísticas automáticamente
- Win rate = wins / (wins + losses)
- Settled signals = fuente de verdad
- Pending no cuenta en stats

---

### 3.4. Acciones por Fila

```typescript
interface RowActions {
  // Siempre disponible
  view_detail: {
    label: "Ver Detalle",
    icon: "👁️",
    action: "navigate_to_detail"
  }
  
  // Solo draft
  edit: {
    label: "Editar",
    icon: "✏️",
    condition: "status === 'draft'",
    action: "navigate_to_edit"
  }
  
  publish: {
    label: "Publicar",
    icon: "📤",
    condition: "status === 'draft'",
    action: "confirm_then_publish",
    confirmation: "¿Publicar esta señal? Será visible para tus seguidores."
  }
  
  // Solo published (antes de inicio)
  cancel: {
    label: "Cancelar",
    icon: "🚫",
    condition: "status === 'published' && event_not_started",
    action: "confirm_then_cancel",
    confirmation: "¿Cancelar esta señal? Tus seguidores serán notificados."
  }
  
  // Solo locked o event finished
  settle: {
    label: "Ir a Liquidar",
    icon: "💰",
    condition: "status === 'locked' && event_finished",
    action: "navigate_to_settlements",
    note: "Redirige a /tipster/settlements con signal_id pre-cargado"
  }
}
```

Definición de event_finished: now > event.end_time o flag del proveedor. Si no hay end_time, usar modo manual.
En boceto: event_finished se simula con campo event_state en mock.

**UI:**
- Dropdown menu (3 dots icon)
- Actions disabled si no aplican
- Hover tooltip explica por qué disabled

---

### 3.5. Indicadores Visuales (Badges)

```typescript
interface StatusBadges {
  // Lifecycle badges
  draft: {
    icon: "📝",
    color: "gray",
    background: "rgba(136, 136, 168, 0.15)",
    label: "Borrador"
  },
  
  published: {
    icon: "📤",
    color: "cyan",
    background: "rgba(0, 245, 255, 0.15)",
    label: "Publicada"
  },
  
  locked: {
    icon: "🔒",
    color: "orange",
    background: "rgba(255, 140, 0, 0.15)",
    label: "Bloqueada"
  },
  
  settled: {
    icon: "✅",
    color: "green",
    background: "rgba(0, 255, 148, 0.15)",
    label: "Liquidada"
  },
  
  canceled: {
    icon: "🚫",
    color: "red",
    background: "rgba(255, 68, 68, 0.15)",
    label: "Cancelada"
  }
}

interface ResultBadges {
  pending: {
    icon: "🟡",
    color: "orange",
    background: "rgba(255, 140, 0, 0.15)",
    label: "Pendiente"
  },
  
  win: {
    icon: "🟢",
    color: "green",
    background: "rgba(0, 255, 148, 0.15)",
    label: "Ganada"
  },
  
  loss: {
    icon: "🔴",
    color: "red",
    background: "rgba(255, 68, 68, 0.15)",
    label: "Perdida"
  },
  
  void: {
    icon: "⚪",
    color: "gray",
    background: "rgba(136, 136, 168, 0.15)",
    label: "Anulada"
  }
}

interface EventStateBadges {
  upcoming: {
    icon: "🟠",
    color: "orange",
    background: "rgba(255, 140, 0, 0.15)",
    label: "Próximo"
  },
  live: {
    icon: "🔵",
    color: "blue",
    background: "rgba(0, 102, 255, 0.15)",
    label: "En juego"
  },
  finished: {
    icon: "⚫",
    color: "gray",
    background: "rgba(136, 136, 168, 0.15)",
    label: "Finalizado"
  }
}
```

**Colores consistentes con Tipster Dashboard.**

---

### 3.6. Vista Vacía (Empty State)

```typescript
interface EmptyState {
  condition: "signals.length === 0 && filters === default",
  
  ui: {
    icon: "📡",
    title: "Aún no has publicado señales",
    description: "Empieza creando tu primera señal. La consistencia es clave para construir confianza con tus seguidores.",
    
    cta: {
      label: "Crear Señal",
      icon: "➕",
      variant: "primary",
      action: "navigate_to_create"
    }
  }
}
```

**También mostrar empty state si:**
- Filtros activos sin resultados
- Tab activo sin señales (ej: "Borradores" vacío)

**Mensaje alternativo:**
```
"No hay señales que coincidan con los filtros seleccionados."
[Limpiar Filtros]
```

---

## 4. Conexión con Otros Módulos

### 4.1. Flujo de Creación

```
Mis Señales → [Crear Señal] → /tipster/signals/new
                                ↓
                        Form de creación
                                ↓
                        Guardar como draft
                                ↓
                        Regresar a /tipster/signals
```

### 4.2. Flujo de Liquidación

```
Mis Señales → [Ir a Liquidar] → /tipster/settlements?signal_id=X
                                        ↓
                                Resolver resultado
                                        ↓
                                Actualizar señal
                                        ↓
                                Stats se recalculan
```

### 4.3. Dashboard (Solo Resumen)

```typescript
interface DashboardSignalsWidget {
  title: "Señales Recientes",
  max_items: 5,
  shows: "últimas 5 señales",
  
  cta: {
    label: "Ver Todas",
    href: "/tipster/signals"
  },
  
  note: "Dashboard NO gestiona señales, solo muestra resumen"
}
```

### 4.4. Estadísticas (Se Alimenta de Señales)

```javascript
// Stats se calculan DESDE señales settled
const STATS_CALCULATION = {
  source: 'signals WHERE status = settled',
  
  metrics: {
    total_signals: 'COUNT(status = settled)',
    total_picks: 'SUM(CASE bet_structure WHEN SINGLE THEN 1 ELSE LENGTH(picks) END)',
    win_rate: 'COUNT(result = win) / COUNT(result IN [win, loss])',
    avg_odds: 'AVG(CASE bet_structure WHEN SINGLE THEN odds ELSE total_odds END)',
    roi: 'calculated_from_settled_signals (stake_units apply to entire ticket)',
    clv: 'AVG(clv WHERE status = settled)'
  },
  
  rules: {
    edit_window: '3 minutos post-publicación; en COMBO/SYSTEM no se pueden editar picks individuales',
    min_odds_validation: 'Aplicar BET_STRUCTURE_VALIDATIONS al crear/publicar señal; no afecta stats salvo señales rechazadas'
  },
  
  note: 'Pending y Draft NO cuentan en stats. COMBO/SYSTEM se contabilizan como un ticket en win_rate/ROI; picks_results sólo para detalle'
}
```

**Este módulo es la fuente de verdad:**
- Todas las métricas del tipster dependen de este módulo
- Dashboard consume datos de aquí
- Stats procesa señales settled
- Followers ven señales published

---

## 5. Responsive Design

### 5.1. Desktop (>1200px)

```
Layout:
- Sidebar: 280px fixed
- Content: flex 1
- Table: full width, scroll horizontal si overflow
- Filters: grid 5 columns
```

### 5.2. Tablet (768px - 1200px)

```
Layout:
- Sidebar: collapsible
- Table: scroll horizontal
- Filters: grid 3 columns
```

### 5.3. Mobile (<768px)

**La tabla debe convertirse en cards:**

```typescript
interface MobileSignalCard {
  layout: "vertical stack",
  
  sections: {
    header: {
      event: "Team A vs Team B",
      date: "2026-02-08 15:30",
      badges: ["Published", "Pending"]
    },
    
    body: {
      selection: "Team A ML",
      market: "Moneyline",
      odds: "2.50",
      stake: "3%"
    },
    
    footer: {
      actions: ["View", "Edit", "Cancel"],
      expandable: true
    }
  }
}
```

**Cada señal = tarjeta expandible:**
- Tap para expandir detalles
- Swipe para acciones rápidas (opcional)
- Filters: vertical stack

---

## 6. Datos Simulados (Mock Data)

### 6.1. Señales Mock (8 ejemplos)

```typescript
const MOCK_SIGNALS = [
  {
    id: "sig_001",
    published_date: "2026-02-08 10:30",
    event: {
      home: "Liverpool",
      away: "Man City",
      league: "Premier League",
      start_time: "2026-02-10 15:00"
    },
    selection: "Liverpool ML",
    market: "Moneyline",
    odds: 2.50,
    suggested_stake: 3,
    clv: "+2.5%",
    status: "draft",
    result: "pending"
  },
  
  {
    id: "sig_002",
    published_date: "2026-02-07 14:20",
    event: {
      home: "Lakers",
      away: "Warriors",
      league: "NBA",
      start_time: "2026-02-09 20:00"
    },
    selection: "Over 225.5",
    market: "Totals",
    odds: 1.91,
    suggested_stake: 2,
    clv: "+1.2%",
    status: "published",
    result: "pending"
  },
  
  {
    id: "sig_003",
    published_date: "2026-02-07 09:15",
    event: {
      home: "Real Madrid",
      away: "Barcelona",
      league: "La Liga",
      start_time: "2026-02-09 21:00"
    },
    selection: "BTTS Yes",
    market: "BTTS",
    odds: 1.75,
    suggested_stake: 4,
    clv: "+3.1%",
    status: "published",
    result: "pending"
  },
  
  {
    id: "sig_004",
    published_date: "2026-02-08 12:00",
    event: {
      home: "Federer",
      away: "Nadal",
      league: "ATP",
      start_time: "2026-02-08 14:00"
    },
    selection: "Federer ML",
    market: "Moneyline",
    odds: 2.20,
    suggested_stake: 2,
    clv: "-0.5%",
    status: "locked",
    event_state: "live",
    result: "pending"
  },
  
  {
    id: "sig_005",
    published_date: "2026-02-06 11:30",
    event: {
      home: "Arsenal",
      away: "Chelsea",
      league: "Premier League",
      start_time: "2026-02-06 17:00"
    },
    selection: "Arsenal -1.5",
    market: "Handicap",
    odds: 2.10,
    suggested_stake: 3,
    clv: "+1.8%",
    status: "settled",
    result: "win"
  },
  
  {
    id: "sig_006",
    published_date: "2026-02-05 16:45",
    event: {
      home: "Celtics",
      away: "Heat",
      league: "NBA",
      start_time: "2026-02-05 19:30"
    },
    selection: "Under 215.5",
    market: "Totals",
    odds: 1.95,
    suggested_stake: 2,
    clv: "-1.2%",
    status: "settled",
    result: "win"
  },
  
  {
    id: "sig_007",
    published_date: "2026-02-04 13:20",
    event: {
      home: "Juventus",
      away: "Inter",
      league: "Serie A",
      start_time: "2026-02-04 20:45"
    },
    selection: "Inter ML",
    market: "Moneyline",
    odds: 2.80,
    suggested_stake: 2,
    clv: "+2.0%",
    status: "settled",
    result: "loss"
  },
  
  {
    id: "sig_008",
    published_date: "2026-02-03 10:00",
    event: {
      home: "PSG",
      away: "Lyon",
      league: "Ligue 1",
      start_time: "2026-02-03 21:00"
    },
    selection: "Over 3.5",
    market: "Totals",
    odds: 2.25,
    suggested_stake: 3,
    clv: "+0.8%",
    status: "settled",
    result: "void"
  }
]
```

### 6.2. Cobertura de Casos

```javascript
const MOCK_COVERAGE = {
  lifecycle: {
    draft: 1,      // sig_001
    published: 2,   // sig_002, sig_003
    locked: 1,      // sig_004
    settled: 4      // sig_005, sig_006, sig_007, sig_008
  },
  
  result: {
    pending: 4,     // sig_001, sig_002, sig_003, sig_004
    win: 2,         // sig_005, sig_006
    loss: 1,        // sig_007
    void: 1         // sig_008
  },
  
  event_state: {
    live: 1         // sig_004
  },
  
  sport: {
    football: 5,
    basketball: 2,
    tennis: 1
  },
  
  market: {
    moneyline: 3,
    totals: 3,
    handicap: 1,
    btts: 1
  }
}
```

**Esto permite probar:**
- Todos los filtros
- Todos los badges
- Todas las acciones
- Empty states (si filtras por deporte sin señales)

---

## 7. Data Model (Referencia)

```typescript
interface Signal {
  // ID
  signal_id: string
  tipster_id: string
  
  // Event info
  event: {
    sport: string
    league: string
    home_team: string
    away_team: string
    start_time: timestamp
  }
  
  // Pick info (SINGLE)
  selection?: string
  market?: string
  odds?: number
  suggested_stake_percent: number  // 1-5%
  
  // Nueva: estructura de apuesta y picks (COMBO/SYSTEM)
  bet_structure: BetStructure
  picks?: SignalPick[]            // solo para COMBO/SYSTEM
  total_odds?: number             // total del ticket COMBO/SYSTEM
  -  ticket_link?: string            // opcional: enlace externo del ticket
  +  ticket_link?: string            // opcional: enlace externo del ticket; visible solo para usuarios con acceso; no indexable; no visible en teaser; no público
  
  // Analysis (opcional)
  reasoning?: string
  confidence_level?: 1 | 2 | 3 | 4 | 5
  
  // Lifecycle
  status: SignalLifecycle
  result: SignalResult
  
  // Value
  opening_odds?: number
  closing_odds?: number
  clv_percent?: number
  
  // Timestamps
  created_at: timestamp
  published_at?: timestamp
  locked_at?: timestamp
  settled_at?: timestamp
  
  // Metadata
  followers_count_at_publish?: number
  views?: number
  saves?: number
  
  // Resultados por pick (COMBO/SYSTEM)
  picks_results?: { pick_id: string; result: SignalResult }[]
}

// Definición mínima de un pick de señal
interface SignalPick {
  pick_id: string
  event: {
    sport: string
    league: string
    home_team: string
    away_team: string
    start_time: timestamp
  }
  selection: string
  market: string
  odds: number
}
```

---

## 8. API Endpoints (Referencia)

```typescript
// Listar señales (con filtros)
GET /tipster/signals
Query: {
  tab?: 'all' | 'active' | 'pending' | 'live' | 'finished' | 'canceled' | 'drafts'
  date_range?: '7d' | '30d' | '90d' | 'custom'
  sport?: string
  market?: string
  type?: 'prematch' | 'live'
  result?: 'pending' | 'win' | 'loss' | 'void'
  page?: number
  per_page?: number
}
Response: {
  signals: Signal[]
  pagination: Pagination
  summary: {
    total: number
    by_status: { [key: string]: number }
    by_result: { [key: string]: number }
  }
}

// Crear señal (draft)
POST /tipster/signals
Body: SignalCreateRequest
Response: Signal

// Obtener detalle
GET /tipster/signals/:id
Response: Signal

// Editar draft
PUT /tipster/signals/:id
Body: SignalUpdateRequest
Condition: status === 'draft'
Response: Signal

// Publicar
POST /tipster/signals/:id/publish
Condition: status === 'draft'
Response: Signal

// Cancelar
POST /tipster/signals/:id/cancel
Condition: status === 'published' && event_not_started
Response: Signal

// Eliminar draft
DELETE /tipster/signals/:id
Condition: status === 'draft'
Response: { deleted: true }
```

---

## 9. Notas Importantes

### 9.1. Backend

```
❌ No conectar backend aún
❌ No usar dinero real
❌ No calcular estadísticas aquí

✅ Solo UI/UX completa
✅ Mock data para testing
✅ Documentar flujos
```

### 9.2. Cálculos

```
❌ No calcular win rate aquí
❌ No calcular ROI aquí
❌ No calcular CLV en tiempo real

✅ Este módulo solo gestiona señales
✅ Stats se calculan en otro módulo
✅ CLV es dato almacenado, no calculado
```

### 9.3. Dependencias

```javascript
const MODULE_DEPENDENCIES = {
  // Este módulo es fuente de verdad
  provides_data_to: [
    'tipster/dashboard (resumen)',
    'tipster/stats (métricas)',
    'tipster/settlements (liquidación)',
    'community (señales públicas)'
  ],
  
  // Este módulo NO depende de
  does_not_depend_on: [
    'user picks (son módulos separados)',
    'broker integrations',
    'payment systems'
  ],
  
  // Regla crítica
  critical_rule: 'Todas las métricas del tipster dependen de este módulo'
}
```

### 9.4. Testing

```
Con las 8 señales mock puedes probar:

✅ Filtro por tabs (draft, published, live, settled)
✅ Filtro por deporte
✅ Filtro por mercado
✅ Filtro por resultado
✅ Acciones por estado
✅ Badges correctos
✅ Empty states (filtra por deporte sin señales)
✅ Responsive (desktop → mobile)
```

---

## 10. Roadmap

### Fase 1 (MVP) ✅
- [x] UI completa de tabla
- [x] Filtros workflow (tabs)
- [x] Filtros secundarios
- [x] Mock data (8 señales)
- [x] Badges de estado
- [x] Actions dropdown
- [x] Empty states
- [x] Responsive design
- [x] Búsqueda y ordenamiento (placeholder UI deshabilitado)

### Fase 2
- [ ] Backend integration
- [ ] Real-time updates (live signals)
- [ ] Bulk actions (publicar múltiples drafts)
- [ ] Search bar funcional
- [ ] Export CSV
- [ ] Analytics overlay (click en señal → mini stats)

### Fase 3
- [ ] Auto-settle (integración con API deportiva)
- [ ] CLV tracking automático
- [ ] Duplicate signal (crear desde existente)
- [ ] Templates (señales frecuentes)
- [ ] Schedule publish (publicar en fecha futura)

---

## 11. Referencias

- **Tipster Dashboard**: tipster-dashboard.md (resumen)
- **Settlements**: tipster-settlements.md (liquidación)
- **Stats**: tipster-stats.md (métricas calculadas)
- **Community**: community.md (señales públicas)

---

### Reglas de Acceso y Pricing (CREDITS)

- El tipster elige el precio (credit_cost), pero dentro de rangos min/máx permitidos por la plataforma.
- Los teasers para CREDITS muestran contenido limitado sin exponer selección exacta ni ticket_link.
- Validación UI: impedir publicar CREDITS sin credit_cost o fuera de rango.

### Privacidad del Ticket

- ticket_link es opcional y solo visible para usuarios con acceso.
- No indexable, no visible en teaser y no público.

---

**Versión:** 1.0  
**Última actualización:** 2026-02-09  
**Autor:** Sistema Trader Deportivo  
**Estado:** Documentación Oficial

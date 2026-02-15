# 📊 Módulo: Tipster Dashboard

## 🎯 Objetivo
Vista rápida del rendimiento del tipster, actividad reciente, métricas clave, ingresos y alertas de calidad/consistencia.

**Rol:** Tipster (publica picks, monetiza, analytics)  
**Ruta:** `/tipster/dashboard`  
**Acento visual:** Violet/Purple (diferenciar de Usuario = verde)

---

## 🎨 Estilo Visual

### Paleta de Colores Tipster
```css
--tipster-primary: #a855f7;      /* Violet/Purple */
--tipster-secondary: #7c3aed;    /* Purple oscuro */
--tipster-accent: #c084fc;       /* Purple claro */
--tipster-gradient: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
--tipster-glow: 0 0 20px rgba(168, 85, 247, 0.4);
```

### Reglas de Consistencia
- ✅ **MANTENER**: Layout, estructura, componentes base
- ✅ **CAMBIAR SOLO**: Color de botón primario, badges, sidebar active, highlights
- ❌ **NO CAMBIAR**: Grid, tipografía, espaciado, iconos

---

## 📋 Estructura del Dashboard

### 1. Header del Dashboard

**Elementos:**
```
┌─────────────────────────────────────────────────────────┐
│ 👤 Carlos Méndez (Tipster)                             │
│ ✓ Verified Tipster                                      │
│                                                          │
│ [Period Selector: 7D | 30D | YTD | All Time]           │
└─────────────────────────────────────────────────────────┘
```

**Componentes:**
- **Nombre del tipster** con badge de estado
- **Badge de verificación**:
  - ✅ **Verified** (verde): Tipster verificado oficialmente
  - 🌑 **Shadow** (gris): Probando sin verificar aún
  - ⚠️ **Provisional** (amarillo): En período de prueba
- **Period selector** (solo UI, sin backend por ahora):
  - 7D (últimos 7 días)
  - 30D (últimos 30 días)
  - YTD (año actual)
  - All Time (histórico completo)

**Mockup:**
```typescript
interface TipsterHeader {
  tipster_name: string
  tipster_id: string
  status: 'verified' | 'shadow' | 'provisional'
  current_period: '7d' | '30d' | 'ytd' | 'all'
}
```

---

### 2. KPIs (Métricas Clave)

**Grid de 6 cards:**
```
┌─────────────┬─────────────┬─────────────┐
│ ROI         │ Profit      │ Win Rate    │
│ +12.5%      │ +$830       │ 58.2%       │
└─────────────┴─────────────┴─────────────┘
┌─────────────┬─────────────┬─────────────┐
│ CLV Avg     │ Picks       │ Rating      │
│ +2.8%       │ 142         │ 4.6/5.0     │
│ ▲ +0.5%     │ ▲ +12       │ - (nuevo)   │
└─────────────┴─────────────┴─────────────┘
```

**Detalle de cada KPI:**

#### A) ROI (Return on Investment)
```typescript
{
  label: "ROI",
  value: "+8.3%",
  change: "+1.5%",
  trend: "up",
  description: "Retorno sobre la inversión (%)",
  color: "tipster-primary",
  icon: "💰"
}
```

#### B) Yield (%)
```typescript
{
  label: "Yield (%)",
  value: "+8.3%",
  change: "+1.5%",
  trend: "up",
  description: "Rendimiento neto del período (%)",
  color: "tipster-primary",
  icon: "💰"
}
```

#### C) Win Rate
```typescript
{
  label: "Win Rate",
  value: "58.2%",
  change: "-3.1%",
  trend: "down",
  description: "Porcentaje de picks ganadores",
  color: "tipster-secondary",
  icon: "🎯"
}
```

#### D) CLV Promedio (Closing Line Value)
```typescript
{
  label: "CLV Avg",
  value: "+2.8%",
  change: "+0.5%",
  trend: "up",
  description: "Valor promedio vs odds al cierre",
  color: "tipster-accent",
  icon: "📊",
  note: "Placeholder — requiere guardar odds al publicar y closing odds al inicio del evento/cierre"
}
```

#### E) Picks Publicados
```typescript
{
  label: "Picks Publicados",
  value: "142",
  change: "+12",
  trend: "up",
  description: "Señales publicadas en el período",
  color: "tipster-primary",
  icon: "📡"
}
```

#### F) Rating Promedio
```typescript
{
  label: "Rating",
  value: "4.6/5.0",
  change: null,
  trend: "neutral",
  description: "Calificación promedio de suscriptores",
  color: "tipster-accent",
  icon: "⭐",
  note: "Placeholder - sistema de rating futuro"
}
```

**Interactividad:**
- Hover: Tooltip con descripción extendida
- Click: Modal con breakdown detallado (futuro)

---

### 3. Performance Widgets

#### A) Gráfico de PnL (Profit & Loss)

**Placeholder visual:**
```
┌─────────────────────────────────────────────┐
│ 📈 Profit & Loss (30 días)                  │
├─────────────────────────────────────────────┤
│                                              │
│     ▲                                        │
│    ╱ ╲      ╱╲                              │
│   ╱   ╲    ╱  ╲    ╱╲                       │
│  ╱     ╲  ╱    ╲  ╱  ╲                      │
│ ╱       ╲╱      ╲╱    ╲___                  │
│─────────────────────────────────────────────│
│ Ene 10   Ene 20   Ene 30   Feb 09          │
│                                              │
│ Total: +$1,240 | Peak: +$1,850 | DD: -$420 │
└─────────────────────────────────────────────┘
```

**Datos del gráfico:**
```typescript
interface PnLData {
  date: string
  cumulative_profit: number
  daily_profit: number
  picks_count: number
}

const pnl_summary = {
  total_profit: 1240,
  peak_profit: 1850,
  max_drawdown: -420,
  current_streak: "W5" // 5 wins consecutivos
}
```

#### B) Breakdown por Mercado
```typescript
{
  label: "Unidades Netas",
  value: "+28.5u",
  change: "+3.2u",
  trend: "up",
  description: "Unidades netas ganadas (depende del período)",
  color: "tipster-primary",
  icon: "📡"
}
```

#### H) Stake Promedio
```typescript
{
  label: "Stake Promedio",
  value: "2.3%",
  change: "±0.0%",
  trend: "neutral",
  description: "Promedio de stake sugerido (%) en el período",
  color: "tipster-secondary",
  icon: "📐"
}
```

#### I) Consistency Score
```typescript
{
  label: "Consistency Score",
  value: "92%",
  change: "+4%",
  trend: "up",
  description: "Disciplina: días con picks, frecuencia semanal, abandonos",
  color: "tipster-accent",
  icon: "🧭"
}
```

#### J) Estabilidad del Tipster
```typescript
{
  label: "Estabilidad",
  value: "Balanceado",
  change: null,
  trend: "neutral",
  description: "Badge calculado por variación de stake + drawdown",
  color: "tipster-accent",
  icon: "🛡️"
}
```

#### K) Seguidores Activos
```typescript
{
  label: "Seguidores Activos",
  value: "128",
  change: "+12",
  trend: "up",
  description: "Suscriptores activos y crecimiento semanal",
  color: "tipster-primary",
  icon: "👥"
}
```

**Tabla de últimas 10 señales:**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ 📡 Señales Recientes                                                         │
├──────────┬──────────────┬────────┬───────┬────────┬─────────────┬───────────┤
│ Fecha    │ Evento       │ Mercado│ Odds  │ Valor  │ Stake       │ Resultado │
├──────────┼──────────────┼────────┼───────┼────────┼─────────────┼───────────┤
│ Feb 09   │ Real - Barça │ O2.5   │ 1.95  │ +3.1%  │ 2%          │ ⏳ Pending│
│ Feb 08   │ Lakers - Celt│ ML     │ 2.10  │ +1.8%  │ 3%          │ ✅ Win    │
│ Feb 08   │ PSG - Bayern │ BTTS   │ 1.85  │ -0.8%  │ 2%          │ ❌ Loss   │
│ Feb 07   │ Juve - Milan │ U2.5   │ 2.05  │ +0.9%  │ 2%          │ ✅ Win    │
│ Feb 07   │ Man U - City │ AH     │ 1.90  │  —     │ 2.5%        │ ⏳ Pending│
└──────────┴──────────────┴────────┴───────┴────────┴─────────────┴───────────┘
```

> Nota técnica (CLV): requiere capturar cuota al publicar y cuota de cierre; CLV% = ((odds_exec/odds_close) - 1) × 100.
**Estados visuales:**
- ⏳ **Pending** (amarillo/gris): Sin resolver
- ✅ **Win** (verde): Ganador
- ❌ **Loss** (rojo): Perdedor
- ⚪ **Void** (gris): Anulado
- 📝 **Draft** (azul): Borrador (no publicado)

**Estructura de datos:**
```typescript
interface RecentSignal {
  signal_id: string
  date: string
  event: string
  market: string
  odds: number
  stake_percent: number // Stake sugerido a suscriptores
  lifecycle: 'draft' | 'published' | 'settled' | 'canceled'
  result: 'pending' | 'win' | 'loss' | 'void'
  result_roi?: number  // Solo si settled
}
```

**Acciones por fila:**
- Click: Ir a detalle de señal (`/tipster/signals/{id}`)
- Hover: Ver más info (suscriptores, rating, notas)

---

### 5. Calidad / Reglas Internas (Coach)

**Sección de "Insights del Coach":**
```
┌─────────────────────────────────────────────────────────┐
│ 🎓 Insights del Coach                                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ℹ️  Tu CLV ha mejorado +1.2% este mes                   │
│     Sigues encontrando valor antes del cierre.          │
│                                                          │
│ ⚠️  Mucha dispersión en stakes (1.5%-3.5%)              │
│     Considera un staking más consistente.               │
│                                                          │
│ ✅ 7 días consecutivos con picks publicados             │
│     ¡Excelente consistencia!                            │
│                                                          │
│ 💡 Tus picks live tienen -2.1% ROI                      │
│     Considera reducir exposición en live.               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Tipos de alertas:**

#### A) Calidad Positiva (Verde/Cyan)
- ✅ CLV positivo sostenido
- ✅ Racha de consistencia
- ✅ ROI superior al promedio
- ✅ Win rate saludable (>52%)

#### B) Nudges Suaves (Amarillo)
- ⚠️ Dispersión de stakes
- ⚠️ Bajo volumen de picks
- ⚠️ Mercados poco explorados
- ⚠️ Falta actualizar perfil

#### C) Alertas de Riesgo (Naranja/Rojo)
- 🔴 ROI negativo sostenido
- 🔴 Exceso de picks live
- 🔴 Stake promedio muy alto
- 🔴 Racha de pérdidas (L5+)

**Estructura de datos:**
```typescript
interface CoachInsight {
  type: 'positive' | 'nudge' | 'warning'
  icon: string
  title: string
  description: string
  action?: {
    label: string
    link: string
  }
}

const insights: CoachInsight[] = [
  {
    type: 'positive',
    icon: 'ℹ️',
    title: 'Tu CLV ha mejorado +1.2% este mes',
    description: 'Sigues encontrando valor antes del cierre.'
  },
  {
    type: 'nudge',
    icon: '⚠️',
    title: 'Mucha dispersión en stakes (1.5%-3.5%)',
    description: 'Considera un staking más consistente.',
    action: {
      label: 'Configurar stake policy',
      link: '/settings'
    }
  }
]
```

**Nota importante:**
- ⚠️ Estos insights NO son un examen ni evaluación obligatoria
- Solo son sugerencias suaves para mejorar
- El tipster puede ignorarlos sin penalización
- No bloquean publicación de picks

---

### 6. Acciones Rápidas

**Botones principales:**
```
┌─────────────────────────────────────────────┐
│ ⚡ Acciones Rápidas                          │
├─────────────────────────────────────────────┤
│                                              │
│  [➕ Crear Nueva Señal]                     │
│                                              │
│  [📡 Ver Mis Señales]                       │
│                                              │
│  [👤 Completar Perfil]                      │
│                                              │
│  [💰 Ver Billetera]                         │
│                                              │
└─────────────────────────────────────────────┘
```

**Detalle de botones:**

#### A) Crear Nueva Señal
```typescript
{
  label: "Crear Nueva Señal",
  icon: "➕",
  link: "/tipster/signals/new",
  variant: "primary",  // Botón destacado con gradiente violet
  description: "Publica un nuevo pick"
}
```

#### B) Ver Mis Señales
```typescript
{
  label: "Ver Mis Señales",
  icon: "📡",
  link: "/tipster/signals",
  variant: "outline",
  description: "Gestiona tus señales publicadas"
}
```

#### C) Completar Perfil
```typescript
{
  label: "Completar Perfil",
  icon: "👤",
  link: "/tipster/profile",
  variant: "outline",
  description: "Mejora tu perfil profesional",
  badge?: "Incompleto"  // Solo si el perfil está incompleto
}
```

#### D) Ver Billetera
```typescript
{
  label: "Ver Billetera",
  icon: "💰",
  link: "/tipster/wallet",
  variant: "outline",
  description: "Consulta tus ingresos y retiros"
}
```

---

## 🧭 Sidebar Tipster (Estructura Completa)

**Debe existir desde el primer HTML con placeholders:**
```
┌─────────────────────────────────────┐
│ 🎯 TIPSTER DASHBOARD                │
│                                      │
│ Principal                            │
│ • 📊 Dashboard                       │
│ • 📡 Mis Señales                     │
│ • ➕ Crear Señal                     │
│ • ✅ Liquidaciones                   │
│                                      │
│ Negocio                              │
│ • 👥 Suscriptores                    │
│ • 💰 Billetera                       │
│                                      │
│ Configuración                        │
│ • 👤 Perfil                          │
│ • 💬 Soporte                         │
│                                      │
│ • ← Volver a Usuario                 │
└─────────────────────────────────────┘
```

**Rutas exactas (según ROUTES.md):**
- `/tipster/dashboard` - Dashboard principal
- `/tipster/signals` - Mis señales
- `/tipster/signals/new` - Crear señal
- `/tipster/settlements` - Liquidaciones
- `/tipster/subscribers` - Suscriptores
- `/tipster/wallet` - Billetera
- `/tipster/profile` - Perfil profesional
- `/tipster/support` - Soporte
- `/dashboard` - Volver a panel de usuario

**Elemento activo:**
```css
.nav-item.active {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(124, 58, 237, 0.15));
  color: var(--tipster-primary);
  border-left: 3px solid var(--tipster-primary);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
}
```

---

## 📊 Datos de Ejemplo (Mockup)

```typescript
const tipsterDashboardData = {
  // Header
  tipster: {
    name: "Carlos Méndez",
    id: "tipster_cm_001",
    status: "verified",
    badge_text: "✓ Verified Tipster",
    period: "30d"
  },
  
  // KPIs
  kpis: {
    roi: { value: "+12.5%", change: "+2.1%", trend: "up" },
    yield: { value: "+8.3%", change: "+1.5%", trend: "up" },
    win_rate: { value: "58.2%", change: "-3.1%", trend: "down" },
    clv_avg: { value: "+2.8%", change: "+0.5%", trend: "up" },
    picks_published: { value: 142, change: 12, trend: "up" },
    rating: { value: "4.6/5.0", change: null, trend: "neutral" }
  },
  
  // Performance
  pnl_summary: {
    total_profit: 1240,
    peak_profit: 1850,
    max_drawdown: -420,
    current_streak: "W5"
  },
  
  // Market breakdown
  markets: [
    { market: "Moneyline", picks: 45, roi: 15.2, profit: 580 },
    { market: "Totales", picks: 38, roi: 10.8, profit: 390 },
    { market: "Handicaps", picks: 32, roi: 8.5, profit: 210 },
    { market: "Props", picks: 18, roi: 5.2, profit: 120 },
    { market: "Live", picks: 9, roi: -2.1, profit: -60 }
  ],
  
  // Streaks
  streaks: {
    current: { type: "W", count: 5 },
    best_winning: { count: 12, period: "Ene 10-15" },
    worst_losing: { count: 4, period: "Dic 20-22" }
  },
  
  // Recent signals
  recent_signals: [
    {
      id: "sig_001",
      date: "2026-02-09",
      event: "Real Madrid vs Barcelona",
      market: "Over 2.5",
      odds: 1.95,
      stake_percent: 2,
      status: "pending"
    },
    {
      id: "sig_002",
      date: "2026-02-08",
      event: "Lakers vs Celtics",
      market: "Moneyline",
      odds: 2.10,
      stake_percent: 3,
      status: "win",
      result_roi: 3.3
    }
    // ... más señales
  ],
  
  // Coach insights
  insights: [
    {
      type: "positive",
      icon: "ℹ️",
      title: "Tu CLV ha mejorado +1.2% este mes",
      description: "Sigues encontrando valor antes del cierre."
    },
    {
      type: "nudge",
      icon: "⚠️",
      title: "Mucha dispersión en stakes (1.5%-3.5%)",
      description: "Considera un staking más consistente."
    },
    {
      type: "positive",
      icon: "✅",
      title: "7 días consecutivos con picks publicados",
      description: "¡Excelente consistencia!"
    },
    {
      type: "warning",
      icon: "💡",
      title: "Tus picks live tienen -2.1% ROI",
      description: "Considera reducir exposición en live."
    }
  ]
}
```

---

## 🎨 Componentes UI Específicos

### 1. Tipster Badge Component
```html
<div class="tipster-badge verified">
  <span class="badge-icon">✓</span>
  <span class="badge-text">Verified Tipster</span>
</div>
```

### 2. Period Selector
```html
<div class="period-selector">
  <button class="period-btn" data-period="7d">7D</button>
  <button class="period-btn active" data-period="30d">30D</button>
  <button class="period-btn" data-period="ytd">YTD</button>
  <button class="period-btn" data-period="all">All Time</button>
</div>
```

### 3. KPI Card
```html
<div class="kpi-card">
  <div class="kpi-icon">📈</div>
  <div class="kpi-content">
    <div class="kpi-label">ROI</div>
    <div class="kpi-value">+12.5%</div>
    <div class="kpi-change up">▲ +2.1%</div>
  </div>
</div>
```

### 4. Coach Insight Card
```html
<div class="insight-card positive">
  <div class="insight-icon">✅</div>
  <div class="insight-content">
    <div class="insight-title">7 días consecutivos con picks publicados</div>
    <div class="insight-description">¡Excelente consistencia!</div>
  </div>
</div>
```

---

## 🔄 Interacciones y Estados

### Period Selector
- Click en período → Actualiza KPIs, gráfico y tabla
- TODOS los KPIs dependen del período seleccionado (7D / 30D / YTD / ALL) y backend debe filtrar/calcular por período
- Solo UI por ahora (sin backend)
- Guardar preferencia en localStorage

### KPI Cards
- Hover → Tooltip con descripción extendida
- Click → Modal con breakdown (futuro)
- Indicador de cambio respecto al período anterior

### Tabla de Señales
- Click en fila → Ir a detalle (`/tipster/signals/{id}`)
- Hover → Highlight fila
- Scroll horizontal en móvil

### Coach Insights
- Click en insight con action → Ir a la página recomendada
- Cerrar insight (X) → Ocultar hasta siguiente aparición
- No obligatorio, solo sugerencias

---

## 📱 Responsive

### Desktop (>1200px)
- Grid de 3 columnas para KPIs
- Gráfico y tabla lado a lado
- Sidebar fijo

### Tablet (768px - 1200px)
- Grid de 2 columnas para KPIs
- Gráfico y tabla en stack
- Sidebar colapsable

### Mobile (<768px)
- Grid de 1 columna para KPIs
- Todo en stack vertical
- Tabla con scroll horizontal
- Sidebar hamburguer menu

---

## ⚠️ Placeholders y Futuro

**Elementos marcados como placeholder:**
- 📊 **CLV promedio**: Calculable cuando se capture odds al cierre
- ⭐ **Rating promedio**: Sistema de calificaciones futuro
- 📈 **Gráfico PnL**: Chart.js o similar (por ahora solo visual)
- 👥 **Suscriptores**: Link a `/tipster/subscribers` (módulo futuro)
- 💰 **Billetera**: Link a `/tipster/wallet` (módulo futuro)

**Importante:**
- Todos los placeholders deben ser visualmente idénticos
- Solo agregar badge "Próximamente" si aplica
- No ocultar elementos, solo deshabilitar

---

## 🎯 Checklist de Implementación

### HTML debe incluir:
- [x] Header con nombre, badge y period selector
- [x] Grid de 6 KPIs con valores, cambios y tendencias
- [x] Sección de performance (gráfico placeholder, tabla mercados, rachas)
- [x] Tabla de actividad reciente (últimas 10 señales)
- [x] Insights del Coach (4 ejemplos mínimo)
- [x] Acciones rápidas (4 botones)
- [x] Sidebar completo con todas las rutas
- [x] Placeholders visibles y etiquetados

### JS debe incluir:
- [x] Period selector funcional (cambio de UI)
- [x] Tooltips en KPIs
- [x] Click en señales → navegación
- [x] Click en insights con action → navegación
- [x] Cerrar insights (localStorage)

### CSS debe incluir:
- [x] Paleta violet/purple
- [x] Active state en sidebar con color tipster
- [x] Botón primary con gradiente violet
- [x] Badges con color tipster
- [x] Responsive completo

---

## 📝 Notas Finales

**Este dashboard NO debe:**
- ❌ Hacer exámenes ni evaluaciones obligatorias
- ❌ Bloquear funcionalidad por "reglas de calidad"
- ❌ Forzar configuraciones específicas
- ❌ Penalizar por ignorar insights del Coach

**Este dashboard SÍ debe:**
- ✅ Mostrar métricas transparentes
- ✅ Ofrecer sugerencias suaves (nudges)
- ✅ Facilitar acceso rápido a funciones clave
- ✅ Ser visualmente consistente con el resto de la app
- ✅ Mantener acento violet/purple para diferenciar rol

---

**Versión:** 1.0  
**Última actualización:** 2026-02-09  
**Autor:** Sistema Trader Deportivo  
**Estado:** Listo para HTML

## 🔒 Reglas de Acceso y Pricing (CREDITS)

- El tipster elige el precio (credit_cost), pero dentro de rangos min/máx definidos por la plataforma.
- Teasers de señales CREDITS muestran contenido limitado y nunca exponen selección exacta ni ticket_link.
- Validación UI: bloquear publicación si falta credit_cost o si está fuera de rango.

## 🔐 Privacidad del Ticket

- ticket_link es opcional y solo visible para usuarios con acceso.
- No indexable, no visible en teaser y no público (no debe aparecer en listados públicos ni previews).

---

**Nota técnica (CLV): requiere capturar cuota al publicar y cuota de cierre; CLV% = ((odds_exec/odds_close) - 1) × 100.
**Estados visuales:**
- ⏳ **Pending** (amarillo/gris): Sin resolver
- ✅ **Win** (verde): Ganador
- ❌ **Loss** (rojo): Perdedor
- ⚪ **Void** (gris): Anulado
- 📝 **Draft** (azul): Borrador (no publicado)

**Estructura de datos:**
```typescript
interface RecentSignal {
  signal_id: string
  date: string
  event: string
  market: string
  odds: number
  stake_percent: number // Stake sugerido a suscriptores
  lifecycle: 'draft' | 'published' | 'settled' | 'canceled'
  result: 'pending' | 'win' | 'loss' | 'void'
  result_roi?: number  // Solo si settled
}
```

**Acciones por fila:**
- Click: Ir a detalle de señal (`/tipster/signals/{id}`)
- Hover: Ver más info (suscriptores, rating, notas)

---

### 5. Calidad / Reglas Internas (Coach)

**Sección de "Insights del Coach":**
```
┌─────────────────────────────────────────────────────────┐
│ 🎓 Insights del Coach                                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ℹ️  Tu CLV ha mejorado +1.2% este mes                   │
│     Sigues encontrando valor antes del cierre.          │
│                                                          │
│ ⚠️  Mucha dispersión en stakes (1.5%-3.5%)              │
│     Considera un staking más consistente.               │
│                                                          │
│ ✅ 7 días consecutivos con picks publicados             │
│     ¡Excelente consistencia!                            │
│                                                          │
│ 💡 Tus picks live tienen -2.1% ROI                      │
│     Considera reducir exposición en live.               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Tipos de alertas:**

#### A) Calidad Positiva (Verde/Cyan)
- ✅ CLV positivo sostenido
- ✅ Racha de consistencia
- ✅ ROI superior al promedio
- ✅ Win rate saludable (>52%)

#### B) Nudges Suaves (Amarillo)
- ⚠️ Dispersión de stakes
- ⚠️ Bajo volumen de picks
- ⚠️ Mercados poco explorados
- ⚠️ Falta actualizar perfil

#### C) Alertas de Riesgo (Naranja/Rojo)
- 🔴 ROI negativo sostenido
- 🔴 Exceso de picks live
- 🔴 Stake promedio muy alto
- 🔴 Racha de pérdidas (L5+)

**Estructura de datos:**
```typescript
interface CoachInsight {
  type: 'positive' | 'nudge' | 'warning'
  icon: string
  title: string
  description: string
  action?: {
    label: string
    link: string
  }
}

const insights: CoachInsight[] = [
  {
    type: 'positive',
    icon: 'ℹ️',
    title: 'Tu CLV ha mejorado +1.2% este mes',
    description: 'Sigues encontrando valor antes del cierre.'
  },
  {
    type: 'nudge',
    icon: '⚠️',
    title: 'Mucha dispersión en stakes (1.5%-3.5%)',
    description: 'Considera un staking más consistente.',
    action: {
      label: 'Configurar stake policy',
      link: '/settings'
    }
  }
]
```

**Nota importante:**
- ⚠️ Estos insights NO son un examen ni evaluación obligatoria
- Solo son sugerencias suaves para mejorar
- El tipster puede ignorarlos sin penalización
- No bloquean publicación de picks

---

### 6. Acciones Rápidas

**Botones principales:**
```
┌─────────────────────────────────────────────┐
│ ⚡ Acciones Rápidas                          │
├─────────────────────────────────────────────┤
│                                              │
│  [➕ Crear Nueva Señal]                     │
│                                              │
│  [📡 Ver Mis Señales]                       │
│                                              │
│  [👤 Completar Perfil]                      │
│                                              │
│  [💰 Ver Billetera]                         │
│                                              │
└─────────────────────────────────────────────┘
```

**Detalle de botones:**

#### A) Crear Nueva Señal
```typescript
{
  label: "Crear Nueva Señal",
  icon: "➕",
  link: "/tipster/signals/new",
  variant: "primary",  // Botón destacado con gradiente violet
  description: "Publica un nuevo pick"
}
```

#### B) Ver Mis Señales
```typescript
{
  label: "Ver Mis Señales",
  icon: "📡",
  link: "/tipster/signals",
  variant: "outline",
  description: "Gestiona tus señales publicadas"
}
```

#### C) Completar Perfil
```typescript
{
  label: "Completar Perfil",
  icon: "👤",
  link: "/tipster/profile",
  variant: "outline",
  description: "Mejora tu perfil profesional",
  badge?: "Incompleto"  // Solo si el perfil está incompleto
}
```

#### D) Ver Billetera
```typescript
{
  label: "Ver Billetera",
  icon: "💰",
  link: "/tipster/wallet",
  variant: "outline",
  description: "Consulta tus ingresos y retiros"
}
```

---

## 🧭 Sidebar Tipster (Estructura Completa)

**Debe existir desde el primer HTML con placeholders:**
```
┌─────────────────────────────────────┐
│ 🎯 TIPSTER DASHBOARD                │
│                                      │
│ Principal                            │
│ • 📊 Dashboard                       │
│ • 📡 Mis Señales                     │
│ • ➕ Crear Señal                     │
│ • ✅ Liquidaciones                   │
│                                      │
│ Negocio                              │
│ • 👥 Suscriptores                    │
│ • 💰 Billetera                       │
│                                      │
│ Configuración                        │
│ • 👤 Perfil                          │
│ • 💬 Soporte                         │
│                                      │
│ • ← Volver a Usuario                 │
└─────────────────────────────────────┘
```

**Rutas exactas (según ROUTES.md):**
- `/tipster/dashboard` - Dashboard principal
- `/tipster/signals` - Mis señales
- `/tipster/signals/new` - Crear señal
- `/tipster/settlements` - Liquidaciones
- `/tipster/subscribers` - Suscriptores
- `/tipster/wallet` - Billetera
- `/tipster/profile` - Perfil profesional
- `/tipster/support` - Soporte
- `/dashboard` - Volver a panel de usuario

**Elemento activo:**
```css
.nav-item.active {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(124, 58, 237, 0.15));
  color: var(--tipster-primary);
  border-left: 3px solid var(--tipster-primary);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
}
```

---

## 📊 Datos de Ejemplo (Mockup)

```typescript
const tipsterDashboardData = {
  // Header
  tipster: {
    name: "Carlos Méndez",
    id: "tipster_cm_001",
    status: "verified",
    badge_text: "✓ Verified Tipster",
    period: "30d"
  },
  
  // KPIs
  kpis: {
    roi: { value: "+12.5%", change: "+2.1%", trend: "up" },
    yield: { value: "+8.3%", change: "+1.5%", trend: "up" },
    win_rate: { value: "58.2%", change: "-3.1%", trend: "down" },
    clv_avg: { value: "+2.8%", change: "+0.5%", trend: "up" },
    picks_published: { value: 142, change: 12, trend: "up" },
    rating: { value: "4.6/5.0", change: null, trend: "neutral" }
  },
  
  // Performance
  pnl_summary: {
    total_profit: 1240,
    peak_profit: 1850,
    max_drawdown: -420,
    current_streak: "W5"
  },
  
  // Market breakdown
  markets: [
    { market: "Moneyline", picks: 45, roi: 15.2, profit: 580 },
    { market: "Totales", picks: 38, roi: 10.8, profit: 390 },
    { market: "Handicaps", picks: 32, roi: 8.5, profit: 210 },
    { market: "Props", picks: 18, roi: 5.2, profit: 120 },
    { market: "Live", picks: 9, roi: -2.1, profit: -60 }
  ],
  
  // Streaks
  streaks: {
    current: { type: "W", count: 5 },
    best_winning: { count: 12, period: "Ene 10-15" },
    worst_losing: { count: 4, period: "Dic 20-22" }
  },
  
  // Recent signals
  recent_signals: [
    {
      id: "sig_001",
      date: "2026-02-09",
      event: "Real Madrid vs Barcelona",
      market: "Over 2.5",
      odds: 1.95,
      stake_percent: 2,
      status: "pending"
    },
    {
      id: "sig_002",
      date: "2026-02-08",
      event: "Lakers vs Celtics",
      market: "Moneyline",
      odds: 2.10,
      stake_percent: 3,
      status: "win",
      result_roi: 3.3
    }
    // ... más señales
  ],
  
  // Coach insights
  insights: [
    {
      type: "positive",
      icon: "ℹ️",
      title: "Tu CLV ha mejorado +1.2% este mes",
      description: "Sigues encontrando valor antes del cierre."
    },
    {
      type: "nudge",
      icon: "⚠️",
      title: "Mucha dispersión en stakes (1.5%-3.5%)",
      description: "Considera un staking más consistente."
    },
    {
      type: "positive",
      icon: "✅",
      title: "7 días consecutivos con picks publicados",
      description: "¡Excelente consistencia!"
    },
    {
      type: "warning",
      icon: "💡",
      title: "Tus picks live tienen -2.1% ROI",
      description: "Considera reducir exposición en live."
    }
  ]
}
```

---

## 🎨 Componentes UI Específicos

### 1. Tipster Badge Component
```html
<div class="tipster-badge verified">
  <span class="badge-icon">✓</span>
  <span class="badge-text">Verified Tipster</span>
</div>
```

### 2. Period Selector
```html
<div class="period-selector">
  <button class="period-btn" data-period="7d">7D</button>
  <button class="period-btn active" data-period="30d">30D</button>
  <button class="period-btn" data-period="ytd">YTD</button>
  <button class="period-btn" data-period="all">All Time</button>
</div>
```

### 3. KPI Card
```html
<div class="kpi-card">
  <div class="kpi-icon">📈</div>
  <div class="kpi-content">
    <div class="kpi-label">ROI</div>
    <div class="kpi-value">+12.5%</div>
    <div class="kpi-change up">▲ +2.1%</div>
  </div>
</div>
```

### 4. Coach Insight Card
```html
<div class="insight-card positive">
  <div class="insight-icon">✅</div>
  <div class="insight-content">
    <div class="insight-title">7 días consecutivos con picks publicados</div>
    <div class="insight-description">¡Excelente consistencia!</div>
  </div>
</div>
```

---

## 🔄 Interacciones y Estados

### Period Selector
- Click en período → Actualiza KPIs, gráfico y tabla
- TODOS los KPIs dependen del período seleccionado (7D / 30D / YTD / ALL) y backend debe filtrar/calcular por período
- Solo UI por ahora (sin backend)
- Guardar preferencia en localStorage

### KPI Cards
- Hover → Tooltip con descripción extendida
- Click → Modal con breakdown (futuro)
- Indicador de cambio respecto al período anterior

### Tabla de Señales
- Click en fila → Ir a detalle (`/tipster/signals/{id}`)
- Hover → Highlight fila
- Scroll horizontal en móvil

### Coach Insights
- Click en insight con action → Ir a la página recomendada
- Cerrar insight (X) → Ocultar hasta siguiente aparición
- No obligatorio, solo sugerencias

---

## 📱 Responsive

### Desktop (>1200px)
- Grid de 3 columnas para KPIs
- Gráfico y tabla lado a lado
- Sidebar fijo

### Tablet (768px - 1200px)
- Grid de 2 columnas para KPIs
- Gráfico y tabla en stack
- Sidebar colapsable

### Mobile (<768px)
- Grid de 1 columna para KPIs
- Todo en stack vertical
- Tabla con scroll horizontal
- Sidebar hamburguer menu

---

## ⚠️ Placeholders y Futuro

**Elementos marcados como placeholder:**
- 📊 **CLV promedio**: Calculable cuando se capture odds al cierre
- ⭐ **Rating promedio**: Sistema de calificaciones futuro
- 📈 **Gráfico PnL**: Chart.js o similar (por ahora solo visual)
- 👥 **Suscriptores**: Link a `/tipster/subscribers` (módulo futuro)
- 💰 **Billetera**: Link a `/tipster/wallet` (módulo futuro)

**Importante:**
- Todos los placeholders deben ser visualmente idénticos
- Solo agregar badge "Próximamente" si aplica
- No ocultar elementos, solo deshabilitar

---

## 🎯 Checklist de Implementación

### HTML debe incluir:
- [x] Header con nombre, badge y period selector
- [x] Grid de 6 KPIs con valores, cambios y tendencias
- [x] Sección de performance (gráfico placeholder, tabla mercados, rachas)
- [x] Tabla de actividad reciente (últimas 10 señales)
- [x] Insights del Coach (4 ejemplos mínimo)
- [x] Acciones rápidas (4 botones)
- [x] Sidebar completo con todas las rutas
- [x] Placeholders visibles y etiquetados

### JS debe incluir:
- [x] Period selector funcional (cambio de UI)
- [x] Tooltips en KPIs
- [x] Click en señales → navegación
- [x] Click en insights con action → navegación
- [x] Cerrar insights (localStorage)

### CSS debe incluir:
- [x] Paleta violet/purple
- [x] Active state en sidebar con color tipster
- [x] Botón primary con gradiente violet
- [x] Badges con color tipster
- [x] Responsive completo

---

## 📝 Notas Finales

**Este dashboard NO debe:**
- ❌ Hacer exámenes ni evaluaciones obligatorias
- ❌ Bloquear funcionalidad por "reglas de calidad"
- ❌ Forzar configuraciones específicas
- ❌ Penalizar por ignorar insights del Coach

**Este dashboard SÍ debe:**
- ✅ Mostrar métricas transparentes
- ✅ Ofrecer sugerencias suaves (nudges)
- ✅ Facilitar acceso rápido a funciones clave
- ✅ Ser visualmente consistente con el resto de la app
- ✅ Mantener acento violet/purple para diferenciar rol

---

**Versión:** 1.0  
**Última actualización:** 2026-02-09  
**Autor:** Sistema Trader Deportivo  
**Estado:** Listo para HTML

# Bankroll Module

## Análisis Crítico Post-Revisión

### ✅ Funcionalidades Implementadas
- **Dashboard de métricas principales** con saldo actual, ganancias/perdidas, ROI y stake promedio
- **Gráficos interactivos** de evolución temporal y distribución por deportes
- **Tabla de transacciones** con filtros por tipo y fecha
- **Sistema de categorización** (Depósitos, Retiros, Ganancias, Pérdidas)
- **Diseño responsive** con adaptación móvil
- **Exportación de datos** (CSV/Excel)

### ⚠️ Problemas Críticos Identificados

#### 1. **Datos Estáticos No Realistas**
- Todos los datos están hardcodeados en HTML
- Sin conexión a API de datos reales
- **Impacto**: Usuarios ven información ficticia
- **Solución**: Integrar con backend de transacciones

#### 2. **Cálculos ROI Incorrectos**
- El ROI mostrado (12.4%) no se actualiza con datos reales
- Sin validación de cálculos financieros
- **Impacto**: Métricas engañosas para usuarios
- **Solución**: Implementar fórmulas ROI dinámicas

#### 3. **Sin Sincronización con Brokers**
- No hay integración con plataformas de apuestas
- Transacciones manuales únicamente
- **Impacto**: Gestión tediosa y propensa a errores
- **Solución**: Desarrollar conectores API

#### 4. **Validación de Datos Ausente**
- Sin validación de montos negativos
- Sin límites de stake máximo/mínimo
- **Impacto**: Datos inconsistentes en el sistema
- **Solución**: Implementar validaciones robustas

### 🔧 Bugs de Alineación Visual

#### 1. **Problemas de Grid Layout**
- Las tarjetas de métricas no se alinean correctamente en tablets
- Desbordamiento de tablas en dispositivos móviles
- **Solución**: Ajustar CSS grid y breakpoints

#### 2. **Iconos y Tooltips Inconsistentes**
- Mezcla de iconos de diferentes familias
- Tooltips sin estilos unificados
- **Solución**: Implementar librería de iconos consistente

#### 3. **Problemas de Scroll Horizontal**
- Tabla de transacciones genera scroll innecesario
- **Solución**: Optimizar diseño responsive de tablas

### 🚨 Problemas de Seguridad

#### 1. **Exposición de Datos Financieros**
- Montos y saldos visibles sin encriptación
- Sin máscara para valores sensibles
- **Impacto**: Privacidad financiera comprometida

#### 2. **Sin Auditoría de Transacciones**
- No hay registro de quién modifica datos
- Sin versionado de cambios
- **Impacto**: Imposible rastrear fraudes

#### 3. **Validación de Formularios Débil**
- Sin prevención de SQL injection
- Sin sanitización de inputs
- **Impacto**: Vulnerable a ataques

### 📊 Métricas de Rendimiento
- **Tiempo de carga**: ~3.1s (lento)
- **Tamaño total**: 2.4MB (muy alto)
- **Solicitudes**: 18 (excesivo)
- **Puntuación Lighthouse**: 65/100 (necesita mejora)

### 🔍 Recomendaciones Prioritarias

1. **CRÍTICO**: Conectar con datos reales de transacciones
2. **ALTO**: Implementar validaciones financieras robustas
3. **MEDIO**: Desarrollar integraciones con brokers
4. **MEDIO**: Añadir encriptación de datos sensibles
5. **BAJO**: Optimizar rendimiento y reducir tamaño

### 📋 Estado General: 5/10
- **Diseño visual**: Bueno (7/10)
- **Funcionalidad básica**: Pobre (4/10)
- **Seguridad**: Muy deficiente (3/10)
- **Datos reales**: No existe (0/10)
- **UX/Usabilidad**: Aceptable (6/10)

El módulo Bankroll tiene una interfaz aceptable pero carece completamente de funcionalidad real. Es esencialmente un mockup visual que necesita desarrollo backend completo.

---

## Concepto Central (Documentación Oficial)

**Bankroll no es dinero.**  
**Bankroll es la disciplina financiera del usuario.**

La plataforma no promete ganancias.  
La plataforma enseña y controla cómo usar el capital.

---

## 1. Propósito del Módulo

Bankroll es un módulo de **gestión de capital y contabilidad interna** orientado al trading deportivo.

- **NO custodia fondos** ni realiza transferencias a casas de apuestas.
- Define un **capital planificado**, sugiere stakes, registra operaciones, mide desempeño y disciplina.
- Si existe **conexión API**, valida que el saldo real del broker permita ejecutar el stake sugerido.

---

## 2. Arquitectura Real dentro del Sistema

```
Signals → genera oportunidad
Trader Master → decide operar
Bankroll → calcula stake sugerido y valida límites
Risk Guard → decide si se puede seguir
Agent → ejecuta
Cloudbet → resultado
Bankroll → registra rendimiento
```

El módulo Bankroll es el **centro de disciplina financiera** que:
- Calcula stakes sugeridos
- Valida saldo disponible
- Registra cada operación
- Mide disciplina y rendimiento
- Protege contra drawdown

---

## 3. Dos Capas Obligatorias

### 3.1. Bankroll Plan (Declarado)

**Es el capital teórico de trading.**

**Ejemplo:**
```
Usuario declara: $1,000
```

**Sirve para:**
- Calcular stake sugerido
- Aplicar disciplina
- Generar métricas
- Definir objetivos
- Controlar drawdown

**NO depende de la casa de apuestas.**

### 3.2. Broker Balance (Real)

**Es el saldo de Cloudbet (si conecta API).**

**Ejemplo:**
```
Cloudbet API: $300
```

**Sirve solo para:**
- Validar ejecución
- Bloquear apuestas imposibles
- Sincronizar saldo real

---

## 4. Regla Operativa Central (Documentar Textual)

> **El stake siempre se calcula usando el Bankroll Plan,  
> pero la ejecución solo es permitida si el Broker Balance lo soporta.**

**Esto evita que:**
- El sistema sugiera mal
- El agente ejecute algo imposible

**Regla adicional (apuestas pendientes):**
- Para calcular el stake sugerido se debe usar el **balance efectivo**:  
  `effective_balance = current_balance − exposure_balance`
- Si `effective_balance < planned_stake` → bloquear o ajustar stake sugerido.

**Ejemplo:**
```javascript
// Bankroll Plan: $1,000
stake_sugerido = kelly_fraction(1000, edge, confidence) // = $50

// Broker Balance (Cloudbet): $30
if (broker_balance >= stake_sugerido) {
  ejecutar()
} else {
  bloquear_por_fondos_insuficientes()
}
```

---

## 5. Modelos de Datos

### 5.1. BankrollProfile

Define el capital planificado y políticas de gestión.

```typescript
{
  id: string
  user_id: string
  plan_bankroll_amount: number          // Capital teórico declarado
  currency: string                      // USD, EUR, etc.
  risk_profile: 'conservative' | 'moderate' | 'aggressive'
  stake_policy: 'flat' | 'percentage' | 'kelly'
  flat_stake_amount?: number            // Si policy = flat
  percentage_stake?: number             // Si policy = percentage (ej: 2)
  kelly_fraction?: number               // Si policy = kelly (ej: 0.25)
  max_drawdown_percent: number          // Límite de drawdown (ej: 20)
  monthly_target_percent?: number       // Objetivo mensual (ej: 15)
  peak_balance: number                  // Máximo histórico alcanzado
  current_balance: number               // Balance actual del plan
  exposure_balance: number              // Suma de stakes pendientes (apuestas abiertas)
  open_positions_count: number          // Número de apuestas abiertas
  max_trades_per_day?: number           // Límite de operaciones por día
  max_risk_per_day_percent?: number     // Límite de riesgo diario (% del plan)
  created_at: timestamp
  updated_at: timestamp
  status: 'ACTIVE' | 'WARNING' | 'PROTECTED' | 'PAUSED_BY_USER' | 'NO_PLAN_DEFINED' | 'BROKER_INSUFFICIENT'
}
```

### 5.2. BrokerConnection

Conexión con la casa de apuestas (API).

```typescript
{
  id: string
  user_id: string
  broker_name: 'cloudbet' | 'pinnacle' | 'betfair'
  api_key_encrypted: string
  broker_balance: number                // Saldo real en la casa
  currency: string
  last_sync_at: timestamp
  sync_frequency: number                // Minutos entre syncs
  status: 'connected' | 'disconnected' | 'error' | 'rate_limited' | 'invalid_key'
  error_message?: string
  created_at: timestamp
  updated_at: timestamp
}
```

### 5.3. BankrollLedger (MUY IMPORTANTE)

**Este es el corazón del módulo.**  
Cada señal/ticket crea un registro.

```typescript
{
  entry_id: string
  user_id: string
  ticket_id?: string
  signal_id?: string
  agent_id?: string
  
  // Planificación
  planned_stake: number                 // Stake sugerido por el sistema
  actual_stake?: number                 // Stake real ejecutado
  
  // Ejecución
  execution_status: 'planned' | 'acknowledged' | 'executed' | 'skipped' | 'blocked'
  // Flujo: planned → acknowledged → executed / skipped / blocked
  execution_reason?: string             // Motivo si blocked/skipped
  
  // Resultado
  result: 'win' | 'loss' | 'push' | 'void' | 'pending'
  odds?: number
  pnl: number                           // Profit/Loss (legacy)
  actual_pnl?: number                   // Profit/Loss real (alias de pnl)
  
  // Métricas educativas
  expected_pnl_if_followed_plan?: number
  behavioral_difference?: number        // Diferencia entre esperado y real
  
  // Balance tracking
  balance_before: number
  balance_after: number
  
  // Disciplina
  discipline_followed: boolean          // ¿Respetó el stake sugerido?
  discipline_deviation?: number         // % de desviación
  
  // Metadata
  created_at: timestamp
  settled_at?: timestamp
  notes?: string
}
```

**Esto permite el "journal" real del trader.**

### 5.4. BankrollSnapshot (Histórico)

Snapshot diario para métricas y gráficos.

```typescript
{
  id: string
  user_id: string
  snapshot_date: date
  balance: number
  peak_balance: number
  drawdown_percent: number
  total_pnl: number
  win_count: number
  loss_count: number
  win_rate: number
  roi: number
  discipline_score: number              // % de operaciones siguiendo el plan
  created_at: timestamp
}
```

---

## 6. Políticas de Stake

El usuario puede elegir cómo calcular el stake sugerido:

| Política | Descripción | Fórmula |
|----------|-------------|---------|
| **Flat** | Monto fijo por apuesta | `stake = flat_amount` (ej: $25) |
| **% Bankroll** | Porcentaje del bankroll plan | `stake = plan_bankroll * (percentage / 100)` (ej: 2% de $1000 = $20) |
| **Kelly Fraccional** | Basado en edge y confianza | `stake = plan_bankroll * kelly_fraction * edge` |

**Regla:**
```javascript
stake_sugerido = calcular_stake(stake_policy, plan_bankroll_amount, edge?, confidence?)
```

**El usuario puede cambiarlo manualmente, pero el sistema guarda si lo respetó.**

---

## 7. Métrica de Disciplina (MUY IMPORTANTE)

El sistema calcula:

```javascript
discipline_score = 
  operaciones_seguidas_correctamente / operaciones_totales
```

**Ejemplo UI:**
```
✅ Seguiste el plan: 82%
❌ Te saliste del plan: 18%
```

**Esto es lo que realmente engancha a un usuario serio.**

### 7.1. Criterios de Disciplina

Una operación se considera "disciplinada" si:
- El stake real está dentro de ±10% del stake sugerido
- No se ejecuta durante cooldown
- No excede límites diarios
- Respeta el perfil de riesgo

---

## 8. Drawdown y Protección

### 8.1. Cálculo de Drawdown

```javascript
peak_balance = max(balance_historico)
current_balance = balance_actual
drawdown_percent = ((peak_balance - current_balance) / peak_balance) * 100
```

### 8.2. Protección Automática

**Si:**
```
drawdown_percent >= max_drawdown_percent
```

**Entonces:**
```
BankrollProfile.status = 'PROTECTED'
Risk Guard → bloquea agentes automáticos
UI → muestra alert de protección
```

**Esto protege al usuario de sí mismo.**

### 8.3. Niveles de Alerta

| Drawdown | Status | Acción |
|----------|--------|--------|
| < 10% | `ACTIVE` | Normal |
| 10-15% | `WARNING` | Alert amarillo |
| 15-20% | `WARNING` | Alert naranja + reducir stakes |
| ≥ 20% | `PROTECTED` | Bloqueo automático |

---

## 9. Cuando NO hay API Conectada

**Aquí el módulo es aún más importante.**

El usuario puede marcar manualmente:
- ✅ Ejecutada
- ❌ No ejecutada
- 💰 Stake usado
- 📊 Resultado (win/loss/push)

**El sistema calcula:**
- P&L
- Yield
- ROI
- Disciplina

**Esto convierte la app en un trading journal profesional.**

### 9.1. Manual Entry Flow

```
1. Usuario ve señal en Trader Master
2. Decide ejecutar manualmente en su casa
3. Marca en la app: "Ejecutada - $25 - @1.95"
4. Cuando se resuelve, marca: "Win +$23.75"
5. Sistema actualiza:
   - Bankroll balance
   - P&L acumulado
   - Métricas de disciplina
```

---

## 10. Métricas del Módulo (Incluir Obligatoriamente)

### 10.1. Rendimiento

| Métrica | Descripción | Fórmula |
|---------|-------------|---------|
| **P&L Diario** | Ganancia/pérdida del día | `sum(pnl WHERE date = today)` |
| **P&L Semanal** | Ganancia/pérdida de la semana | `sum(pnl WHERE week = current)` |
| **P&L Mensual** | Ganancia/pérdida del mes | `sum(pnl WHERE month = current)` |
| **ROI** | Retorno sobre inversión | `(total_pnl / total_staked) * 100` |
| **Yield** | Rendimiento neto | `(total_profit / plan_bankroll) * 100` |

### 10.2. Riesgo

| Métrica | Descripción |
|---------|-------------|
| **Drawdown Máximo** | Mayor caída desde peak |
| **Racha Perdedora** | Máximo de pérdidas consecutivas |
| **Riesgo Promedio** | Average stake / bankroll |
| **Volatilidad** | Desviación estándar de P&L |

### 10.3. Conducta

| Métrica | Descripción |
|---------|-------------|
| **Disciplina** | % operaciones siguiendo el plan |
| **Ops Fuera de Plan** | Cantidad de desviaciones |
| **Stake Promedio vs Recomendado** | Diferencia % |
| **Cooldown Respetado** | % de respeto a pausas |

### 10.4. Análisis

| Métrica | Descripción |
|---------|-------------|
| **Rendimiento por Agente** | P&L segmentado por agente |
| **Rendimiento por Tipster** | P&L segmentado por fuente |
| **Rendimiento por Horario** | P&L por franja horaria |
| **Rendimiento PRE vs LIVE** | Comparación de tipos |
| **Rendimiento por Deporte** | P&L segmentado por deporte |
| **Win Rate por Odds Range** | % acierto por rango de cuota |

**Esto es extremadamente valioso para el usuario.**

---

## 11. Estados del Bankroll

| Estado | Descripción | Trigger |
|--------|-------------|---------|
| `ACTIVE` | Operando normalmente | Drawdown < 10% |
| `WARNING` | Alerta de riesgo | Drawdown 10-20% |
| `PROTECTED` | Bloqueo automático | Drawdown ≥ 20% |
| `PAUSED_BY_USER` | Usuario pausó operaciones | Manual |
| `NO_PLAN_DEFINED` | Sin bankroll configurado | Initial state |
| `BROKER_INSUFFICIENT` | Saldo broker < mínimo | Balance check |
| `OVERTRADING_PROTECTION` | Bloqueo por sobreoperación diaria | Excedió `max_trades_per_day` o `max_risk_per_day_percent` |

---

## 12. Conexión con Otros Módulos

### 12.1. Signals
- Crea operaciones planeadas en Ledger
- Consulta stake sugerido para mostrar en UI

### 12.2. Trader Master
- Solicita `stake_sugerido` antes de enviar a agente
- Valida `broker_balance` vs `planned_stake`
- Muestra métricas de bankroll en header

### 12.3. Agents Hub
- Solo ejecuta si `bankroll.status = 'ACTIVE'`
- Consume `stake_sugerido` para ejecución
- Registra resultado en Ledger

### 12.4. Risk Guard
- Supervisa `drawdown_percent`
- Bloquea agentes si `status = 'PROTECTED'`
- Valida límites diarios contra balance

### 12.5. Wallet (No se mezcla)
- Suscripciones y créditos son **aparte**
- Bankroll es solo para capital de trading
- No hay transferencias entre Wallet y Bankroll

---

## 13. Validaciones y Reglas

### 13.1. Validación de Ejecución

**Antes de ejecutar cualquier apuesta:**

```javascript
function validar_ejecucion(planned_stake, user_id) {
  const profile = getBankrollProfile(user_id)
  const broker = getBrokerConnection(user_id)
  
  // Balance efectivo (apuestas pendientes)
  const effective_balance = profile.current_balance - (profile.exposure_balance || 0)
  
  // Check 1: Bankroll status
  if (profile.status !== 'ACTIVE') {
    return { valid: false, reason: 'BANKROLL_PROTECTED' }
  }
  
  // Check 2: Plan balance (efectivo)
  if (effective_balance < planned_stake) {
    return { valid: false, reason: 'PLAN_INSUFFICIENT_EFFECTIVE_BALANCE' }
  }
  
  // Check 3: Broker balance (si existe conexión)
  if (broker && broker.status === 'connected') {
    if (broker.broker_balance < planned_stake) {
      return { valid: false, reason: 'BROKER_INSUFFICIENT' }
    }
  }
  
  // Check 4: Drawdown
  const drawdown = calcular_drawdown(profile)
  if (drawdown >= profile.max_drawdown_percent) {
    return { valid: false, reason: 'DRAWDOWN_LIMIT' }
  }

  // Check 5: Sobreoperación (protección)
  if (profile.max_trades_per_day && trades_today(user_id) >= profile.max_trades_per_day) {
    return { valid: false, reason: 'OVERTRADING_PROTECTION' }
  }
  if (profile.max_risk_per_day_percent && risk_today_percent(user_id) >= profile.max_risk_per_day_percent) {
    return { valid: false, reason: 'OVERTRADING_PROTECTION' }
  }
  
  return { valid: true }
}
```

### 13.2. Actualización Post-Ejecución

**Después de ejecutar:**

```javascript
function registrar_ejecucion(entry_id, result, pnl) {
  const entry = getLedgerEntry(entry_id)
  const profile = getBankrollProfile(entry.user_id)
  
  // Actualizar ledger
  entry.result = result
  entry.pnl = pnl
  entry.balance_after = profile.current_balance + pnl
  entry.settled_at = now()
  
  // Actualizar profile
  profile.current_balance += pnl
  
  // Actualizar peak si aplica
  if (profile.current_balance > profile.peak_balance) {
    profile.peak_balance = profile.current_balance
  }
  
  // Calcular drawdown
  const drawdown = calcular_drawdown(profile)
  
  // Cambiar status si es necesario
  if (drawdown >= profile.max_drawdown_percent) {
    profile.status = 'PROTECTED'
    notify_risk_guard(profile.user_id, 'DRAWDOWN_LIMIT_REACHED')
  } else if (drawdown >= 10) {
    profile.status = 'WARNING'
  } else {
    profile.status = 'ACTIVE'
  }
  
  save(entry)
  save(profile)
  
  // Crear snapshot si es fin de día
  if (is_end_of_day()) {
    create_snapshot(profile)
  }
}
```

---

## 14. Casos de Uso

### 14.1. Usuario Nuevo (Sin API)

1. Usuario crea cuenta
2. Se le pide definir Bankroll Plan: "$1,000"
3. Elige política: "Kelly Fraccional 25%"
4. Define límites: "Max Drawdown: 20%"
5. Sistema crea `BankrollProfile`
6. Usuario comienza a marcar operaciones manualmente
7. Sistema calcula métricas y disciplina

### 14.2. Usuario Pro (Con API Cloudbet)

1. Usuario conecta Cloudbet API
2. Sistema sincroniza balance: "$450"
3. Bankroll Plan ya definido: "$1,000"
4. Usuario envía ticket desde Trader Master
5. Sistema calcula stake: "$20" (2% de $1,000)
6. Valida broker balance: $450 ≥ $20 ✅
7. Agente ejecuta en Cloudbet
8. Cloudbet confirma ejecución
9. Sistema registra en Ledger
10. Al resolverse, actualiza P&L y balance

### 14.3. Usuario en Drawdown

1. Usuario tiene racha perdedora
2. Drawdown alcanza 21%
3. Sistema cambia status a `PROTECTED`
4. Risk Guard bloquea agentes automáticos
5. UI muestra alert: "⚠️ Bankroll protegido - Drawdown 21%"
6. Usuario solo puede operar manualmente
7. Debe reducir drawdown a <15% para reactivar

---

## 15. UI Esperada

### 15.1. Dashboard Principal

**Header:**
```
┌─────────────────────────────────────────────┐
│ Bankroll: $1,250  │  P&L: +$250  │  ROI: 25% │
│ Drawdown: 8%  │  Disciplina: 82%            │
└─────────────────────────────────────────────┘
```

**Cards:**
- Balance Plan vs Balance Broker
- P&L Chart (diario/semanal/mensual)
- Disciplina Score con gauge
- Drawdown Chart
- Top Metrics

### 15.2. Ledger / Journal

**Tabla de operaciones:**

| Fecha | Señal | Stake | Odds | Resultado | P&L | Disciplina |
|-------|-------|-------|------|-----------|-----|------------|
| 07 Feb | Real Madrid ML | $25 | 1.95 | Win | +$23.75 | ✅ |
| 06 Feb | Liverpool O2.5 | $30 | 1.88 | Loss | -$30.00 | ❌ Excedió |
| 05 Feb | Bayern AH | $20 | 2.10 | Win | +$22.00 | ✅ |

### 15.3. Configuration Panel

**Formulario:**
```
Bankroll Plan: [$1,000]
Política de Stake: [Kelly Fraccional ▼]
Kelly Fraction: [0.25]
Max Drawdown: [20%]
Target Mensual: [15%]

[Conectar Cloudbet API]
```

### 15.4. Alerts y Notificaciones

```
⚠️ ALERTA: Drawdown alcanzó 15% - Reducir exposición
✅ META: Alcanzaste +10% ROI este mes
🚨 PROTECCIÓN: Drawdown 20% - Agentes bloqueados
📊 SNAPSHOT: Balance del día guardado
```

---

## 16. Endpoints API Mínimos

### 16.1. Bankroll Management

```
GET    /bankroll/profile
POST   /bankroll/profile
PATCH  /bankroll/profile
DELETE /bankroll/profile

GET    /bankroll/ledger
POST   /bankroll/ledger/entry
PATCH  /bankroll/ledger/entry/:id
GET    /bankroll/ledger/entry/:id

GET    /bankroll/snapshots
GET    /bankroll/snapshots/:date

GET    /bankroll/metrics
GET    /bankroll/metrics/performance
GET    /bankroll/metrics/risk
GET    /bankroll/metrics/discipline
GET    /bankroll/metrics/analysis
```

### 16.2. Broker Integration

```
POST   /bankroll/broker/connect
GET    /bankroll/broker/status
POST   /bankroll/broker/sync
DELETE /bankroll/broker/disconnect

GET    /bankroll/broker/balance
```

### 16.3. Stake Calculation

```
POST   /bankroll/calculate-stake
Request:
{
  "signal_id": "...",
  "odds": 1.95,
  "confidence": 0.72,
  "edge": 0.05
}

Response:
{
  "stake_suggested": 25.00,
  "stake_policy": "kelly",
  "kelly_fraction": 0.25,
  "plan_bankroll": 1000,
  "broker_balance": 450,
  "effective_balance": 970,            // current_balance − exposure_balance
  "exposure_balance": 30,
  "open_positions_count": 2,
  "executable": true,
  "reason": null
}
```

Regla: el `stake_suggested` debe calcularse usando `effective_balance` (no usar todo `current_balance` si hay exposición pendiente).

### 16.4. Validation

```
POST   /bankroll/validate-execution
Request:
{
  "planned_stake": 25.00,
  "user_id": "..."
}

Response:
{
  "valid": true,
  "checks": {
    "bankroll_status": "ACTIVE",
    "plan_balance": "OK",
    "broker_balance": "OK",
    "drawdown": "OK"
  }
}
```

---

## 17. Reglas de Negocio Críticas

### 17.1. Stake Sugerido vs Ejecutado

- El **stake sugerido** SIEMPRE se calcula con `plan_bankroll_amount`
- El **stake ejecutado** puede ser diferente (usuario puede ajustar)
- Si difieren >10%, se marca `discipline_followed = false`

### 17.2. Balance Updates
 
 - El balance del plan se actualiza **solo cuando se resuelve** una apuesta
 - Los balances intermedios (pendientes) NO afectan el balance contable actual
 - El balance contable cambia al resolver; el balance efectivo (effective_balance) sí descuenta exposición para nuevas decisiones.
 - El broker balance se sincroniza cada X minutos (configurable)

### 17.3. Drawdown Calculation

- Se calcula SOLO desde el `peak_balance`
- El peak NUNCA baja, solo sube
- Si el balance actual supera el peak, se actualiza

### 17.4. Protection Override

- Solo el usuario puede des-proteger el bankroll
- Requiere confirmación explícita
- Se registra en auditoría

---

## 18. Integraciones Externas

### 18.1. Cloudbet API

**Endpoints usados:**
- `/user/balance` - Obtener saldo
- `/user/currency` - Obtener moneda
- `/bets` - Historial de apuestas

**Sincronización:**
- Cada 5 minutos (configurable)
- Después de cada ejecución
- On-demand por usuario

### 18.2. Otros Brokers (Futuro)

- Pinnacle
- Betfair
- Bet365 (si API disponible)

**Abstracción:**
```typescript
interface BrokerAdapter {
  connect(credentials): Promise<Connection>
  getBalance(): Promise<number>
  getBets(from, to): Promise<Bet[]>
  disconnect(): void
}
```

---

## 19. Seguridad y Privacidad

### 19.1. API Keys

- Encriptadas en reposo (AES-256)
- Nunca se exponen en logs
- Rotación recomendada cada 90 días
- Almacenadas en vault seguro

### 19.2. Datos Sensibles

- Balance del plan: privado
- Ledger completo: privado
- Métricas agregadas: pueden ser públicas (si usuario acepta)
- Snapshots: privados

### 19.3. Auditoría

- Todos los cambios de balance se registran
- Cambios de configuración se auditan
- Conexiones/desconexiones de broker se logean

---

## 20. Métricas de Producto

**KPIs a trackear:**

- % de usuarios con Bankroll Plan definido
- % de usuarios con broker conectado
- Avg discipline score
- % de usuarios en protección
- Avg ROI por perfil de riesgo
- Retención de usuarios con alta disciplina

---

## 21. Roadmap de Funcionalidades

### Fase 1 (MVP)
- [x] BankrollProfile CRUD
- [x] Ledger manual entry
- [x] Cálculo de stake (flat/percentage)
- [x] Métricas básicas (P&L, ROI)
- [x] Drawdown protection

### Fase 2
- [ ] Cloudbet API integration
- [ ] Auto-sync balance
- [ ] Kelly Criterion calculator
- [ ] Advanced metrics (discipline, analysis)
- [ ] Snapshot system

### Fase 3
- [ ] Multiple broker support
- [ ] Custom risk profiles
- [ ] Advanced analytics
- [ ] Export to CSV/PDF
- [ ] Goal tracking

### Fase 4
- [ ] Machine learning stake suggestions
- [ ] Pattern detection
- [ ] Automated journal insights
- [ ] Social features (compare with peers)

---

## 22. Consideraciones Técnicas

### 22.1. Performance

- Snapshots pre-calculados para charts
- Índices en `user_id`, `created_at`, `settled_at`
- Cache de métricas frecuentes (15 min TTL)

### 22.2. Escalabilidad

- Particionamiento de Ledger por fecha
- Archivado de entries > 1 año
- Agregaciones pre-computadas

### 22.3. Idempotencia

- Todas las operaciones de balance deben ser idempotentes
- Usar `entry_id` único para evitar duplicados
- Lock optimista en updates de balance

---

## 23. Testing

### 23.1. Unit Tests

- Cálculo de stake (todas las políticas)
- Cálculo de drawdown
- Validaciones de ejecución
- Actualización de balance

### 23.2. Integration Tests

- Flujo completo: signal → stake → execution → settlement
- Broker API sync
- Protection triggers

### 23.3. End-to-End Tests

- Usuario define plan
- Conecta broker
- Ejecuta señal
- Balance actualizado correctamente

---

## 24. Referencias

- **Signals Module**: signals.md
- **Trader Master**: trader-master.md
- **Agents Hub**: agents-hub.md
- **Risk Guard**: (por documentar)
- **API Spec**: API-SPEC.md
- **Data Model**: DATA-MODEL.md

---

## 25. Glosario

| Término | Definición |
|---------|------------|
| **Bankroll Plan** | Capital teórico declarado por el usuario para trading |
| **Broker Balance** | Saldo real en la casa de apuestas (vía API) |
| **Stake** | Monto apostado en una operación |
| **Drawdown** | Caída % desde el balance máximo |
| **Discipline Score** | % de operaciones que siguieron el plan |
| **Kelly Fraction** | Fracción del Kelly Criterion (ej: 0.25 = Kelly Quarter) |
| **Ledger** | Registro contable de todas las operaciones |
| **Peak Balance** | Máximo balance histórico alcanzado |
| **Protection** | Estado de bloqueo por exceso de drawdown |

---

**Versión:** 1.0  
**Última actualización:** 2025-02-07  
**Autor:** Sistema Trader Deportivo  
**Estado:** Documentación Oficial

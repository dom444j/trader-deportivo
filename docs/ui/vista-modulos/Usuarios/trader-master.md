# Trader Master

Resumen ejecutivo
- Módulo de acción del usuario: centraliza lo que necesita para operar hoy de forma rápida y disciplinada.
- No reemplaza Señales ni Agents Hub: orquesta el flujo y aplica disciplina (Risk Guard).
- Integra Top Picks, constructor de tickets, atajos de ejecución, historial reciente y alertas críticas.

## 1) Propósito
- Descubrir oportunidades (Top Picks IA + Tipsters + Masters)
- Construir tickets (simple o combinada)
- Decidir (manual / asistido / auto según plan)
- Controlar (riesgo, cuotas, estado de ejecución)

## 2) Qué es Trader Master
Centro de comando con foco en:
- Velocidad: operaciones en 2–3 clics.
- Disciplina: estados de riesgo y cuotas gobiernan CTAs.
- Integración: Señales y Agents Hub como fuentes/ejecutores.

## 3) Secciones del módulo (UI)
A) Header de estado (chips)
- Plan (Basic/Pro/Premium) + vence en X días
- Risk Guard: HEALTHY/CAUTION/HIGH_RISK/LOCKED
- Cuotas: PRE usadas/restantes + LIVE usadas/restantes (Premium)
- Cloudbet: connected/invalid/rate_limited (si aplica)

B) Top Picks del Día
- Lista curada (cards compactas) con: evento/mercado/cuota, confianza (0–100), fuente (IA | Tipster | Master), tipo (PRE | LIVE), estado (active/expired/blocked)
- CTAs por pick: Ver en Señales, Añadir a ticket, Ejecutar con agente (si elegible)

C) Ticket Builder (Bet Slip)
- Panel lateral o sección fija con singles seleccionadas y combinada (parlay): legs, cuota total estimada, stake, retorno estimado, flags (“estimado”, “odds cambian”)
- Acciones: Guardar ticket, Enviar a Señales, Enviar a Agente (Premium auto / Pro semi si PRE)
- Regla: crear ticket no consume cupos; sólo consume al ejecutar.

D) Recomendaciones de stake (asistido)
- Bloque con sugerencias: stake sugerido (flat o %), cooldown sugerido, toploss recomendado (Premium), “no recomendado operar” si riesgo alto

E) Ejecución reciente (historial corto)
- Últimas N ejecuciones: fecha/hora, pick, stake, resultado, P/L, ejecutado por (usuario / agente X)
- CTA: “ver detalle” (lleva a historial completo)

F) Alertas críticas
- Señales expirando, cuotas agotadas (PAUSED_BY_LIMIT), Risk Guard bloqueó ejecución (LOCKED), Cloudbet rate-limited / invalid key

## 4) Reglas por plan
Basic ($29.99)
- Ve Top Picks PRE (read-only)
- Puede armar ticket (local). No puede ejecutar vía API.
- CTAs de ejecución deshabilitadas; “Guardar ticket” permitido; CTA fuerte a Upgrade / Comprar créditos.

Pro ($129.99)
- Puede usar señales externas hasta 12; ejecutar hasta 8 apuestas/mes vía API (solo PRE)
- Comprar créditos
- Habilita: Añadir a ticket + Enviar a Señales + Ejecutar (PRE)
- Recomendación capital: $1000 sugerido

Premium ($799.99)
- 30 apuestas/mes + 8 LIVE/mes
- Auto ejecución (desde Agents Hub)
- Habilita: Ejecutar PRE/LIVE (si elegible), “Enviar a auto-agente”, control toploss/cooldown

## 5) Estados y bloqueo (disciplina)
- Risk Guard = STOP → UI muestra LOCKED_BY_RISK, deshabilita CTAs de ejecución; permite ver/armar ticket.
- Cuota agotada → PAUSED_BY_LIMIT; CTA: comprar créditos / esperar reset.
- Cloudbet: connected/invalid/rate_limited gobierna ejecución LIVE.

## 6) Integración con otros módulos
- Señales: fuente de detalle + ejecución manual asistida.
- Agents Hub: configuración de ejecución (billing_mode, toploss, cooldown, auto/semi/manual).
- Bankroll: capital disponible (fuente de verdad) y límites.
- Risk: gobierna todo (drawdown, bloqueos, cooldowns).
- Bets/History: auditoría y P/L real.

## 7) Flujo y navegación (rutas)
- Ruta del módulo: `/trader-master`.
- Enlaces a Señales: usar rutas `/signals/pre` y `/signals/live`.
  - Nota: en el boceto HTML estático se usan `/signals?tab=PRE` y `/signals?tab=LIVE` por simplicidad; producción debe usar `/signals/pre` y `/signals/live`.
- Enlace a Agents Hub: `/agents`.
- Enlace a Smart Portfolio: `/portfolio`.
- Consistencia en sidebar: Trader Master debajo de Portfolio.

## 8) Datos mínimos requeridos (UI)
- user_plan + expires_at
- quotas (pre/live/total) + reset_date
- cloudbet_status
- risk_status + drawdown
- top_picks[]: source, confidence, odds_min/current, expires_at, type (PRE/LIVE), status
- recent_executions[]: status, pnl, executed_by
- ticket_state (local UI)

## 9) Comportamiento y UX
- CTAs deshabilitadas según plan/estado (Risk/Quotas/Cloudbet). Mostrar motivos (reason_code) claros.
- Placeholders si backend no está (no inventar cálculos de P/L).
- Mantener consistencia visual con Dashboard y Smart Portfolio.
- Acciones en 2–3 clics; confirmaciones no intrusivas.

## 10) Checklist para el boceto HTML
- Reusar layout del dashboard (mismo sidebar y estilos)
- Marcar activo “Trader Master”
- Top Picks + Ticket Builder + Recientes + Alertas
- CTAs deshabilitados según plan (selector de demo opcional)

## 11) API y datos (alineación)
- Leer/mostrar Top Picks: fuente combinada IA/Tipsters/Masters. Endpoint a definir en API-SPEC.
- Gestión de Ticket (crear/guardar/enviar): endpoints a definir (crear ticket, asociar a señal, enviar a agente).
- Contadores de uso (quotas) y estados de riesgo: lectura/bloqueos desde Risk Guard.
- Cloudbet LIVE: validación de credenciales/estado.
- Auditoría: registrar ejecución y resultado.

Referencias
- API: ver API-SPEC.md (secciones de Señales, Agents, Risk, Bets).
- Datos: ver DATA-MODEL.md (tickets, ejecuciones, cuotas/contadores, auditoría).
- Arquitectura: ver ARCHITECTURE.md (flujo entre módulos y capas).
- Señales: ver signals.md (modelos y UI).
- Smart Portfolio: ver smart-portfolio.md (comportamiento y restricciones).
- Mejora Agents Hub: ver MEJORAS_AGENTS_HUB.md (auto/semi/manual y billing).
- Infraestructura: ver INFRASTRUCTURE.md (servicios asociados y límites).

## 12) Pendientes y próximos pasos
- Definir endpoints concretos en API-SPEC para Top Picks, Tickets y Ejecución.
- Completar modelos de datos mínimos en DATA-MODEL (tickets, contadores de cuotas, auditoría).
- Boceto HTML inicial del módulo siguiendo el checklist.
- Integrar gating de CTAs por plan/riesgo/cuotas.
- Pruebas de navegación con `/signals?tab=` y consistencia del sidebar.

## 13) Fuentes y selección (máx 7 tipsters/IA/mixto)
- El usuario elige fuente: IA / Tipsters / Mixto.
- Puede seleccionar hasta 7 fuentes (tipsters/IA/Masters) para poblar Top Picks.
- selected_sources[] (max 7) afecta el feed de “Top Picks del Día”.
- Reglas por plan:
  - Basic: ve Top Picks PRE limitados (read-only); no puede personalizar selected_sources.
  - Pro: puede elegir fuentes hasta el máximo permitido (7) para PRE; LIVE según plan.
  - Premium: puede elegir fuentes para PRE y LIVE; prioridad a IA/Masters.

## 14) Señales VIP desbloqueables con créditos (paywall)
- Algunas señales están incluidas por suscripción pero limitadas; otras son VIP y se desbloquean pagando créditos.
- Antes de pagar se muestra “preview” (match + cuota total + costo), sin revelar mercado completo.
- UI: sección “VIP Picks (Credit Unlock)” con cards bloqueadas que muestran “Cuesta 14 créditos”.
- vip_cost_credits es por pick (default 14) y puede variar según fuente/mercado.
- VIP Unlock siempre consume créditos; el plan de usuario solo define visibilidad base (no exime del costo).
- Si compra: se revela mercado, selección completa y detalles.
- Regla: compra = evento auditado (registrar en auditoría).

## 15) Tipos de ticket y visibilidad (VIP)
- ticket_type: same_event | multi_event.
- Regla de visibilidad por VIP: en Top Pick/Ticket, si locked_vip, mostrar partido + cuota total; el mercado solo tras unlock.
- Actualización de Ticket Builder: referenciar esta regla de visibilidad y el ticket_type en la UI.
- Privacidad de ticket_link: Enlaces externos de tickets (ticket_link) no se muestran en previews/teasers ni listados; solo en detalle y únicamente si el usuario tiene acceso; no indexables; no públicos.

## 16) Apuestas Sistema (gestión de riesgo / Trading Coach)
- “System Bets Suggestions” para distribución de riesgo.
- Si hay 7 selecciones: sugerir
  - 7 singles ×1
  - dobles ×21
  - 5-selecciones ×21
  - séptuple ×1
  - o combinada plena
- UI: checkbox “Mi casa soporta sistema”.
  - Si sí: mostrar tabla sugerida (singles/dobles/etc) y stake recomendado.
  - Si no: mostrar “singles o combinada plena” únicamente.

Salida mínima y reglas de UI:
- system_mode: `none` | `singles_only` | `full_system`
  - none: ocultar sugerencias de sistema; solo permitir single/parlay.
  - singles_only: mostrar solo distribución por singles; ocultar combinaciones múltiples.
  - full_system: mostrar tabla completa (singles/dobles/etc) y permitir stake por bloque.

## 17) Compatibilidad Cloudbet/API y casas sugeridas
- execution_capabilities:
  - supportsSingles
  - supportsParlay
  - supportsSystem (probablemente NO)
  - supportsSameGame (depende)
- Regla:
  - Si Cloudbet no soporta system o same-game, ejecución por API sólo para multi-event simple/parlay soportado.
  - Para system/same-game: mostrar recomendación + “casas compatibles” (p.ej. Bet365/BetPlay) como guía textual.
- UI: “Compatible con Cloudbet: Sí/No” y mensajes de compatibilidad.

## 18) Reglas operativas críticas

Protección de cuota (Odds Protection):
- validar odds_current >= odds_min antes de ejecutar
- si cambia → estado ODDS_CHANGED y no ejecutar

Expiración de picks:
- cada pick tiene expires_at
- PRE expira 5 min antes del evento
- LIVE expira al suspenderse mercado

Estados del ticket:
- VALID / PARTIAL_INVALID / INVALID / EXECUTED / FAILED
- si una selección se invalida el ticket debe reconfirmarse

Risk Guard obligatorio:
- stake máximo por % bankroll
- límite diario
- límite por evento
- Trader Master nunca ejecuta si Risk Guard bloquea.

Bet Lifecycle (auditoría contable):
- CREATED → SUBMITTED → ACCEPTED → SETTLED_WIN/LOSS/VOID/CANCELLED
- Cada cambio debe registrarse en auditoría y afectar bankroll.

Nuevo estado:
- EVENT_STARTED: si el partido inicia antes de ejecutar, el pick se vuelve no ejecutable.

Saldo insuficiente:
- Validar `bankroll_available >= stake_required`.
- Si no se cumple → estado INSUFFICIENT_FUNDS y bloquear ejecución.

Prioridad de bloqueos (orden obligatorio):
1. Risk Guard
2. EVENT_STARTED
3. ODDS_CHANGED
4. Límites del plan (PAUSED_BY_LIMIT)
5. Cloudbet

## 19) Impacto en Sistema de Compensación

Aportes al Bank por renovación:
- Básico $29.99 → +$20 bank
- Pro $129.99 → +$80 bank
- Premium $799.99 → +$500 bank

Activación visible (30 días):
- Mostrar “días de activación restantes” desde la compra
- Si <5 días, alerta: “Renueva antes del cutoff para mantener elegibilidad pool”

Elegibilidad Pool Semanal:
- Cutoff: miércoles 00:00 UTC semana anterior
- Mostrar próxima semana (nextPoolWeek) y semanas elegibles (week_key)

Referidos directos:
- Si la compra/upgrade se realiza desde Trader Master: comisión 10% para el referidor
- Registrar en `referral_commissions` con `subscription_id` del usuario

Transparencia en UI:
- Header puede incluir Bank Total, Activación restante y Próximo pool

## 20) Tablas Relacionadas (propuesta DATA-MODEL)

Tablas core relacionadas con Trader Master:

- users
  - plan (basic/pro/premium), bankroll, status (ACTIVE/SUSPENDED)
- subscriptions
  - status (ACTIVE/PAUSED/CANCELLED), end_at (elegibilidad/renovación)
- signals
  - status (ACTIVE/EXPIRED/SETTLED), odds_recommended vs odds_current, valid_until
- bets
  - source=trader_master, outcome, auditoría P/L
- credit_wallets + credit_transactions
  - uso de créditos para VIP, idempotencia por operation_id
- risk_profiles
  - daily_loss_limit, max_drawdown, locked (Risk Guard)
- audit_logs
  - eventos de ejecución y validación, metadata (ticket_id, picks, stake)

Nuevas tablas sugeridas (propuesta):

- tickets
  - id, user_id, ticket_type (single|parlay|system|same_game), status
  - picks[], total_odds, stake_suggested, stake_actual, created_at, executed_at

- top_picks_daily
  - id, pick_date, signal_id, source (ai|tipster|master), confidence (0–100)
  - rank_position, is_vip, vip_cost_credits, expires_at, created_at

- execution_history
  - id, user_id, ticket_id, bet_id, executed_by (user|agent_id)
  - source (trader_master|signals|agents), stake, odds, pnl, status
  - executed_at, settled_at, created_at

## 21) Endpoints API (contrato mínimo)

Top Picks y Fuentes:
- GET /trader-master/top-picks
- PATCH /trader-master/sources  // max 7 fuentes por usuario/plan

VIP Unlock:
- POST /trader-master/unlock-vip  // idempotente; ejemplo: costo 14 créditos

Tickets:
- POST /trader-master/tickets
- POST /trader-master/tickets/:id/execute

Estado:
- GET /trader-master/status  // incluye: plan, quotas, risk, cloudbet, bankTotal, nextPoolWeek

## 22) Modelo funcional (TradeTicket)

Principio de arquitectura
- Trader Master es un motor de decisión: genera órdenes (TradeTicket) listas para ejecución.
- Agents Hub es un motor de ejecución: recibe y ejecuta TradeTicket. Los agentes nunca crean tickets; solo ejecutan tickets.

Modelo principal: TradeTicket
- ticket_id (uuid/string)
- user_id (uuid/string)
- sources_selected[] (array de ids de fuente seleccionadas para poblar Top Picks)
- picks[] (array de Pick)
- total_odds (number)
- stake (number)
- strategy_type (single | parlay | system | same_game)
- execution_mode (manual | assisted | automatic)
- agent_target (agent_id opcional)
- bookmaker_target (string; p.ej. cloudbet | bet365 | betplay)
- execution_destination (cloudbet | manual_user | copy_mode)
- created_at (ISO timestamp)
- status (enum: DRAFT | READY | LOCKED | SENT_TO_AGENT | EXECUTING | EXECUTED | REJECTED | ODDS_CHANGED | EXPIRED)

Controles de cuota (obligatorio)
- odds_snapshot_hash (string)
- odds_snapshot_time (ISO timestamp)
- max_slippage_allowed (decimal; ej. 0.02 = 2%)
Regla: el agente solo puede ejecutar si la variación de cuota respecto al snapshot está dentro del slippage permitido; si no, el ticket pasa a estado ODDS_CHANGED y se bloquea la ejecución automática.

Validación de compatibilidad de mercados (market_compatibility_check)
- is_compatible (boolean)
- reason_code (p.ej. MARKET_NOT_SUPPORTED | SYSTEM_NOT_SUPPORTED | SAME_GAME_NOT_SUPPORTED)
- unsupported_legs[] (ids o índices de picks no soportados)
Regla: si is_compatible = false, no se envía ejecución automática; mostrar recomendación y, de ser necesario, dirigir a ejecución manual/compatible.

Reserva de bankroll (obligatoria antes de enviar a agente)
- reserved_stake (number)
- reserved_until (ISO timestamp)
- reservation_status (enum: PENDING | ACTIVE | EXPIRED | RELEASED)
Regla: el stake debe bloquearse (reservation_status = ACTIVE) antes de SENT_TO_AGENT; si el bankroll es insuficiente, no reservar y mantener el ticket en estado READY/DRAFT con alerta de fondos.

Control anti-spam
- execution_cooldown_seconds (number)
- max_tickets_per_hour (number)
Regla: Trader Master aplica cooldown por usuario y limita la tasa de emisión de TradeTickets; si se incumple, bloquear la emisión (LOCKED) y mostrar motivo.

Submodelo: Pick
- pick_id (uuid/string)
- event_id (string)
- sport (string)
- league (string)
- selection (string; p.ej. Home/Draw/Away o descripción del mercado)
- odds (number)
- market_type (string; p.ej. 1X2, Over/Under, Asian Handicap, same_game descriptor)
- start_time (ISO timestamp)
- source_type (IA | tipster | live)
- vip_locked (boolean)

Estados operativos del ticket (lifecycle)
- DRAFT: creado en UI/Trader Master, incompleto.
- READY: validaciones básicas OK (riesgo/cuotas), listo para reserva y envío.
- LOCKED: bloqueado por regla (Risk Guard, límites, cooldown, compatibilidad).
- SENT_TO_AGENT: enviado a Agents Hub para ejecución.
- EXECUTING: en proceso de ejecución por el agente.
- EXECUTED: ejecutado/aceptado por la casa.
- REJECTED: rechazado por el agente o la casa.
- ODDS_CHANGED: variación de cuota fuera del slippage permitido; requiere reconfirmación.
- EXPIRED: expira por inicio de evento o ventana de validez.

Relación con Agents Hub
- Trader Master debe ser la única entidad que genera órdenes (TradeTicket) para Agents Hub.
- Los agentes (en Agents Hub) solo ejecutan tickets y reportan estado (EXECUTING/EXECUTED/REJECTED) y razones de rechazo.
- Auditoría: cada transición de estado se registra (con timestamp, actor y metadata).

## 23) Estado actual de implementación vs documentación

### ✅ Elementos implementados en trader_master.html
- **Estructura base**: Sidebar, header, layout responsive
- **Status Header**: Chips para Plan (simulado Pro), Risk Guard, cuotas y Cloudbet
- **Top Picks del Día**: Cards con evento, mercado, cuota, confianza, fuente, tipo, estado y CTAs
- **Ticket Builder**: Panel lateral con picks seleccionadas, cálculos de cuota total, stake y retorno
- **Ejecución**: Botones para guardar y ejecutar ticket con validaciones básicas
- **Historial**: Sección de ejecuciones recientes con estados (win/pending/loss)
- **System Bets**: Opciones para singles/doubles/parlay con toggle de soporte
- **Alertas**: Panel de advertencias con prioridad de bloqueos
- **Enlaces rápidos**: Accesos a Signals, Agents Hub, Smart Portfolio, Bankroll, Risk Guard

### ❌ Elementos críticos faltantes

#### 1. Integración con Sistema de Compensación
- **Bank Contributions**: No se muestran aportes por renovación ($20/$80/$500)
- **Días de activación**: Falta contador de días restantes de suscripción
- **Pool Semanal**: No se muestra elegibilidad ni cutoff de miércoles 00:00 UTC
- **Referidos**: Sin tracking de comisiones 10% por upgrades desde Trader Master

#### 2. Conexión con DATA-MODEL.md
- **Tabla `tickets`**: Sin implementar gestión de estados (DRAFT/READY/LOCKED/SENT_TO_AGENT/EXECUTING/EXECUTED/REJECTED/ODDS_CHANGED/EXPIRED)
- **Tabla `top_picks_daily`**: Sin integración con señales diarias curadas
- **Tabla `execution_history`**: Historial limitado, sin detalles de auditoría completos

#### 3. API Endpoints sin definir
- `GET /trader-master/top-picks`: Para obtener picks curados
- `PATCH /trader-master/sources`: Para seleccionar hasta 7 fuentes
- `POST /trader-master/unlock-vip`: Para desbloquear señales VIP (14 créditos)
- `POST /trader-master/tickets`: Para crear tickets
- `POST /trader-master/tickets/:id/execute`: Para ejecutar tickets
- `GET /trader-master/status`: Para estado completo del módulo

#### 4. Validaciones en tiempo real faltantes
- **Odds Protection**: Sin validación de `odds_current >= odds_min`
- **Pick Expiration**: Sin control de expiración (PRE: 5min antes, LIVE: al suspender)
- **Risk Guard**: Sin integración real con límites de drawdown y daily loss
- **Quota Validation**: Sin validación real de límites por plan

#### 5. Estados de conexión reales
- **Cloudbet API**: Estado simulado, sin conexión real
- **WebSockets**: Sin actualización en tiempo real de cuotas
- **Retry System**: Sin sistema de reintentos para fallos de conexión

#### 6. Sistema VIP de créditos
- **Costo variable**: Solo muestra 14 créditos fijos, sin variación por fuente
- **Auditoría**: Sin registro de compras VIP en `credit_transactions`
- **Preview limitado**: Sin ocultación parcial de mercados antes del unlock

#### 7. Gestión completa de tickets
- **Estados del ticket**: Sin máquina de estados completa
- **Validación de compatibilidad**: Sin checks de `market_compatibility`
- **Reserva de bankroll**: Sin sistema de reserva `reserved_stake`
- **Anti-spam**: Sin control de `max_tickets_per_hour` ni cooldowns

#### 8. Mejoras de UX necesarias
- **Loading states**: Sin estados de carga durante operaciones
- **Confirmaciones**: Sin modales de confirmación para acciones críticas
- **Error handling**: Sin manejo robusto de errores con códigos específicos
- **Filtros y búsqueda**: Sin capacidad de filtrar picks por fecha/deporte/liga
- **Personalización**: Sin guardado de preferencias de usuario

### 🔧 Próximos pasos recomendados
1. **Backend prioritario**: Implementar tablas faltantes y endpoints API
2. **Frontend**: Agregar visualización del sistema de compensación
3. **Integración**: Conectar validaciones en tiempo real con Risk Guard
4. **Testing**: Verificar reglas por plan y sistemas críticos

**Nota**: El HTML actual es un mockup visual que requiere integración completa con el backend para funcionar según las especificaciones del documento.
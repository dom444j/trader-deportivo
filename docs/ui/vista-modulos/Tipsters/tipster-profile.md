# Tipster Profile — Perfil Profesional del Tipster

Objetivo: Definir el módulo Perfil del Tipster (tipster-profile.md). Este módulo NO es solo datos personales. Es la página pública interna donde los usuarios evalúan al tipster antes de suscribirse o comprar señales.

- Funciona como: ficha pública del tipster, historial profesional, vitrina de rendimiento, punto de conversión a suscriptor.
- No es una red social.
- No es editable libremente como una bio.
- Es un perfil profesional estructurado.

Ruta de referencia: `/tipster/profile/:username`

---

## 1) Estructura general del Perfil

El Perfil Profesional se compone de secciones claramente delimitadas, datos calculados por la plataforma y acciones orientadas a la conversión.

Secciones:
- Header
- Bio Profesional
- Estadísticas Principales
- Rendimiento Reciente (30 días)
- Planes del Tipster
- Señales Recientes (teaser)
- Reglas Importantes
- Roles de Edición
- Seguridad

Estados del perfil:
- `ACTIVE` (visible y completo)
- `INCOMPLETE` (visible, pero con elementos por completar)
- `UNDER_REVIEW` (visible con banner de revisión)
- `FROZEN` (visible parcialmente; acciones bloqueadas)
- `SUSPENDED` (no visible al público)

---

## 2) Secciones del Perfil

### 2.1 Header
Campos:
- `display_name` (alias visible)
- `username` (único)
- `avatar` (imagen)
- `banner` (imagen de portada)
- `badge_status` (verified / pro / rising)
- `join_date` (fecha ingreso a la plataforma)
- `followers_total` (número total de seguidores)

Acciones:
- Seguir tipster
- Suscribirse
- Comprar VIP
- Ver señales

Reglas:
- `username` es único, alfanumérico, 3–24 caracteres, sin espacios.
- `display_name` admite 3–32 caracteres; emojis permitidos, links prohibidos.
- `avatar` recomendado 256×256 px; `banner` recomendado 1200×300 px.
- `badge_status` es asignado por la plataforma (no editable por el tipster).
- `followers_total` se calcula en tiempo real.

Comportamiento:
- Botón Seguir alterna seguir/dejar de seguir.
- Botón Suscribirse abre el modal/tienda de planes.
- Botón VIP lleva a la compra del acceso VIP del tipster.
- Ver señales navega al hub de señales del tipster.

---

### 2.2 Bio Profesional
Campos:
- `short_bio` (máx 240 caracteres)
- `especialidad` (ligas o mercados; lista corta)
- `horario_operativo` (opcional; ej. "L-V 13:00–22:00 UTC")
- `estrategia` (value betting / live trader / pre-match)

Restricciones:
- No se permiten links externos ni datos de contacto (emails, teléfonos, redes sociales).
- Se aplica moderación automática: se bloquean URLs, @handles y palabras prohibidas.
- Solo texto plano; sin HTML.

Comportamiento:
- Si excede límites, se rechaza el cambio con mensaje de validación.
- Si contiene contenido no permitido, se marca y requiere revisión.

---

### 2.3 Estadísticas Principales
Métricas visibles (no editables):
- `roi_histórico` (%): retorno sobre inversión total.
- `yield` (%): beneficio medio relativo a stake.
- `winrate` (%): porcentaje de aciertos.
- `clv_promedio` (%): closing line value promedio.
- `picks_total` (número de picks históricos).
- `meses_activos` (meses con actividad registrada).

Definiciones (referencia de cálculo):
- ROI = (profit_total / stake_total) × 100.
- Yield = (profit_total / número_de_picks) / stake_promedio × 100.
- Winrate = (picks_won / picks_total) × 100.
- CLV promedio = promedio de (odds_cierre − odds_publicadas) normalizado.
- Redondeo: 1 decimal para %, 0 decimales para conteos.

Reglas:
- Estas métricas provienen del sistema y NO son editables por el tipster.
- Se recalculan automáticamente tras cada settle de señal.

---

### 2.4 Rendimiento Reciente (30 días)
Mostrar:
- `picks_30d`
- `win_30d` / `loss_30d` / `void_30d`
- `profit_30d` (en créditos/USDT según config)
- Gráfico simple de tendencia (línea o barras)

Comportamiento:
- Ventana fija de 30 días (rolling window).
- El gráfico omite días sin actividad.
- Se actualiza tras cada settle.

---

### 2.5 Planes del Tipster
Mostrar:
- Suscripción mensual
- Suscripción personal (si existe)
- VIP

Cada plan incluye:
- Precio en créditos
- Qué desbloquea (acceso a señales, historial detallado, VIP exclusivos)
- Periodo (mensual, acceso puntual, VIP por rango)

Reglas/Comportamiento:
- Las compras se gestionan vía módulo Store/Wallet.
- Si el usuario ya está suscrito, se muestra estado y fecha de renovación.
- Si el usuario no tiene créditos suficientes, se ofrece compra de créditos.

---

### 2.6 Señales Recientes (teaser)
Tarjetas (lista corta):
- Deporte
- Mercado (teaser parcial; no completo)
- Cuota (opcional)
- Resultado (si cerrado)
- Etiqueta `FREE` o `VIP`

Regla:
- Usuarios no autorizados no ven detalles completos (stake, book, timing, mercado exacto). Se muestra un mensaje tipo "Suscríbete para ver detalles".

Teaser policy (explícita):
- Para usuarios sin autorización (no has_active_subscription y no has_active_vip):
  - Ocultar línea exacta del mercado (solo mostrar market_teaser genérico)
  - Ocultar stake
  - Ocultar book/casa
  - Ocultar timing (minuto o timestamp de publicación)
  - Ocultar ticket_link

Comportamiento:
- Si el usuario tiene plan activo que otorga acceso, se muestran detalles completos.
- En señales FREE, se muestra información completa sin gating.

---

### 2.7 Reglas Importantes
- El tipster NO puede editar estadísticas.
- La plataforma calcula métricas de forma automática.
- Resultados auditables (se conserva evidencia de publicación/settle).
- Historial no borrable (no se permite eliminación de picks históricos).

---

## 3) Roles de Edición
Tipster puede editar:
- Avatar
- Banner
- Bio
- Especialidad

Tipster NO puede editar:
- Estadísticas
- Resultados
- Histórico

Rol Admin/Operaciones:
- Puede verificar (`badge_status = verified`), promover (`pro`), o marcar `rising`.
- Puede congelar el perfil si hay investigación.
- Puede revertir cambios de bio si violan políticas.

---

## 4) Seguridad
- Cambios de nombre limitados (ej. 2 cambios por año).
- Historial de cambios guardado (audit trail con timestamp, campo modificado, actor).
- Perfil congelado (`FROZEN`) si hay investigación: acciones de compra/seguimiento bloqueadas; se muestra banner informativo.

---

## 5) Interfaces de Datos (Referencia)

```ts
interface TipsterPublicProfile {
  id: string
  username: string        // único
  display_name: string    // alias visible
  avatar_url?: string
  banner_url?: string
  badge_status: 'verified' | 'pro' | 'rising' | 'none'
  join_date_iso: string
  followers_total: number

  short_bio?: string            // <= 240 chars, sin links
  specialties?: string[]        // ligas/mercados
  schedule?: string             // opcional, ej: "L-V 13:00–22:00 UTC"
  strategy?: 'value_betting' | 'live_trader' | 'pre_match'

  metrics: {
    roi_percent: number        // 1 decimal
    yield_percent: number      // 1 decimal
    winrate_percent: number    // 1 decimal
    clv_avg_percent: number    // 1 decimal
    picks_total: number
    months_active: number
  }

  recent_30d: {
    picks: number
    win: number
    loss: number
    void: number
    profit: number             // créditos/USDT
    trend_points: Array<{ date: string; value: number }>
  }

  plans: Array<{
    plan_id: string
    type: 'subscription_monthly' | 'personal_subscription' | 'vip'
    price_credits: number
    unlocks: string[]         // ej: ['signals_access', 'history_detail']
    period?: string           // ej: '30d', 'one_time'
  }>

  teaser_signals: Array<{
    id: string
    sport: string
    market_teaser: string
    odds?: number
    result?: 'win' | 'loss' | 'void'
    tag: 'FREE' | 'VIP'
  }>

  status: 'ACTIVE' | 'INCOMPLETE' | 'UNDER_REVIEW' | 'FROZEN' | 'SUSPENDED'
}
```

Reglas de CTAs según viewer_context:
- Si `status === 'FROZEN'` o `status === 'UNDER_REVIEW'`: ocultar CTAs de compra; mostrar banner informativo.
- Si `viewer_context.is_following === false`: mostrar CTA "Seguir"; si true, mostrar "Dejar de seguir".
- Si `viewer_context.can_view_full_signals === false`:
  - Mostrar CTA "Suscribirse" y, si aplica, "Comprar VIP".
  - Mostrar aviso en teaser: "Suscríbete para ver detalles completos".
- Si `viewer_context.can_view_full_signals === true`:
  - Mostrar botón "Ver señales" destacado.
  - Mostrar estado de `my_plan` (tipo y fecha de vencimiento) y acciones de gestión.

Permisos de vista/edición (referencia):
- GET `/tipster/profile/:username` — público interno (usuarios registrados)
- PATCH `/tipster/profile` — solo tipster (campos editables: avatar, banner, bio, especialidad, estrategia, horario)
- Admin puede PATCH `badge_status` y `status` bajo políticas.

Validaciones clave:
- `short_bio` <= 240 chars; sin URLs/email/@; UTF-8 básico.
- `specialties` lista de 1–5 entradas, cada una 2–24 chars alfanumérico + espacios.
- `strategy` debe ser una de las opciones permitidas.
- `display_name` 3–32 chars; filtrar lenguaje inapropiado.

Eventos/Logs (referencia):
- `tipster_profile_updated` (actor, campos, timestamp)
- `tipster_followed` (follower_id, tipster_id, timestamp)
- `tipster_subscribed` (user_id, tipster_id, plan_id, timestamp)
- `update_public_profile_stats` (trigger tras settle)

---

## 6) Comportamiento de UI (Resumen)
- Header: muestra avatar, alias, badges, seguidores y acciones (seguir, suscribirse, VIP, ver señales).
- Bio: bloque compacto con restricciones; mensaje si vacío.
- Stats: tarjetas con KPI principales; tooltip con definiciones.
- Rendimiento 30d: panel con contadores y gráfico simple.
- Planes: cards con precio en créditos y CTA; estado del usuario si ya tiene plan.
- Señales recientes: lista teaser; gating de detalles para no autorizados.
- CTAs dinámicos según viewer_context y estado del perfil.

---

## 7) Edge Cases
- Perfil incompleto: mostrar CTA "Completar Perfil" al tipster (no al público).
- Sin actividad: métricas muestran "—" y gráfico vacío.
- Investigación activa (FROZEN): ocultar CTAs de compra; mostrar aviso.
- Cambio de nombre excede límite: rechazar y registrar intento.
- Bio con contenido prohibido: bloquear, registrar y notificar para revisión.

---

## 8) Políticas y Auditoría
- Toda estadística es generada por el sistema; el tipster no puede alterarla.
- Se conserva historial de cambios (avatar, banner, bio, especialidad) con responsable y fecha.
- Resultados auditables: cada pick mantiene evidencia de publicación y settle.
- Historial no borrable: no existe acción de borrar picks.

---

## 9) Highlights / Social proof (calculado por sistema)

Esta sección es generada automáticamente por la plataforma y NO es editable por el tipster.

Campos mostrados (ejemplos):
- Top markets (top 3 mercados por ROI/yield)
- Top leagues (top 3 ligas por performance)
- Best streak (racha ganadora más larga, con fecha)
- Consistency score (puntaje de consistencia, 0–100)

Reglas:
- Se recalcula de forma periódica (ej. diaria) y tras settles significativos.
- No admite edición manual; cualquier intento de modificación se registra y rechaza.
- Puede mostrarse en el Header como badges/mini KPIs o en un bloque dedicado.
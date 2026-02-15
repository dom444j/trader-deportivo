# Tipster Support Hub

> **📋 Sub-sistema Core:** Este módulo implementa conversaciones tipo tipster usando los modelos `Message` y `Attachment` del [SUPPORT-CONTRACT.md](../SUPPORT-CONTRACT.md), agregando metadatos específicos de canales tipster.

## 1) Propósito

Soporte para Tipsters: comunicación segura y auditable con:
- Admin/Operaciones (principal)
- Usuarios (solo si el tipster tiene "VIP personal" o "suscripción personal" y la plataforma habilita chat)

No es chat público. Toda interacción se registra para auditoría y compliance.

## Mapeo con SUPPORT-CONTRACT

**TipsterSupportConversation = Conversation + Channel Metadata:**
```typescript
// Del core: Conversation (conversation_id, type, status, participants...)
// Extensiones tipster: channel ('ops' | 'vip_chat' | 'system'), tags, SLA específico
```

**Canales Tipster → Tipos Core:**
| Canal Tipster | Tipo Core | Descripción |
|---------------|-----------|-------------|
| `ops` | `tipster_chat` | Comunicación tipster ↔ admin |
| `vip_chat` | `tipster_chat` | Comunicación tipster ↔ usuario VIP |
| `system` | `system` | Notificaciones del sistema |

---

## 2) Menú / Subvistas

- Inbox (lista de conversaciones)
- Chat (vista detalle)
- Crear ticket (si aplica)
- Templates / Respuestas rápidas

---

## 3) Tipos de conversación (channels)

```typescript
export type TipsterSupportChannel = 'ops' | 'vip_chat' | 'system'

/**
 * ops: tipster ↔ admin/operaciones (siempre habilitado)
 * vip_chat: tipster ↔ usuario (condicional por configuración y plan)
 * system: notificaciones internas, solo lectura
 */
```

Estados permitidos:
```typescript
export type TipsterSupportStatus = 'open' | 'pending' | 'closed'
```

### Mapeo TipsterSupportStatus → TicketStatus (Core)

| TipsterSupportStatus | TicketStatus Core | Significado |
|---------------------|-------------------|-------------|
| `open` | `OPEN` | Conversación activa, esperando respuesta |
| `pending` | `AWAITING_USER` o `IN_PROGRESS` | Depende del contexto:<br>- Si esperando respuesta tipster → `AWAITING_USER`<br>- Si en proceso interno → `IN_PROGRESS` |
| `closed` | `RESOLVED` o `CLOSED` | Conversación finalizada |

> **Nota:** `TipsterSupportStatus` es una vista simplificada SOLO para tipster chats. No es `TicketStatus` del contrato principal. Los estados se mapean internamente para facilitar la visualización tipster.

---

## 4) Datos mínimos (modelo)

```typescript
export interface TipsterSupportConversation {
  id: string
  channel: TipsterSupportChannel
  status: TipsterSupportStatus

  participants: {
    tipster_id: string
    admin_id?: string
    user_id?: string  // presente solo en vip_chat
  }

  last_message_at: timestamp  // timestamp
  unread_by: {
    user: number
    admin: number
    tipster: number
  }

  tags: Array<'payments' | 'dispute' | 'verification' | 'abuse' | 'other'>
}

// Usa Message del SUPPORT-CONTRACT con TipsterSupportConversation
export interface TipsterSupportMessage {
  id: string  // message_id del core
  conversation_id: string
  sender_role: 'tipster' | 'admin' | 'user' | 'system'  // MessageSenderRole del contrato
  body?: string  // content del core
  attachments?: Attachment[]  // Attachment del contrato (mime_type, filename, size_bytes, url)
  created_at: timestamp  // timestamp
  read_by?: { tipster?: number; admin?: number; user?: number }
  moderation_flags?: Array<{ category: string; detail?: string }>
}
```

Tags estandarizados:
- payments (pagos, wallet)
- dispute (disputas / ajustes)
- verification (solicitudes KYC/estado tipster)
- abuse (reportes de usuario / conducta)
- other

---

## 5) Reglas de permisos

```javascript
const TIPSTER_SUPPORT_PERMISSIONS = {
  tipster: {
    view_all_own_conversations: true,     // ops + vip_chat + system
    send_message_ops: true,
    send_message_vip_chat: 'if_enabled',  // según flags/estado
    attach_file: true
  },
  user: {
    view_vip_chat_participating: true,
    send_message_vip_chat: true,
    attach_file: true
  },
  admin: {
    view_all: true,
    send_message: true,
    attach_file: true,
    close_conversation: true,
    add_internal_note: true
  }
}
```

- El canal ops nunca es visible a usuarios.
- Usuarios solo ven vip_chat donde participan.
- Admin ve todo.

---

## 6) Reglas importantes

- Rate limit por usuario (anti-spam).
- Mensajes y archivos auditables (logs completos).
- Auto-templates disponibles para tipster.
- Si el tipster está FROZEN o UNDER_REVIEW, solo puede escribir en ops y se deshabilita vip_chat.

Feature flags y estado:
```javascript
const TIPSTER_SUPPORT_FEATURE_FLAGS = {
  'tipster_support:ops': { default: true },
  'tipster_support:vip_chat': { default: false }  // habilitar por tipster con VIP personal/suscripción personal y flag de plataforma
}

const TIPSTER_STATUS = ['ACTIVE', 'FROZEN', 'UNDER_REVIEW']

function canUseVipChat(tipster, platformFlags) {
  const vipEnabled = platformFlags['tipster_support:vip_chat'] === true
  const hasPersonalVIP = tipster.has_personal_vip === true || tipster.has_personal_subscription === true
  const statusOk = tipster.status === 'ACTIVE'
  return vipEnabled && hasPersonalVIP && statusOk
}
```

Rate limiting y adjuntos (MVP):
> **📋 Basado en:** [SUPPORT-CONTRACT.md](../SUPPORT-CONTRACT.md) - AttachmentRules y AntiSpamRules

```javascript
// Usa AttachmentRules del contrato
const TIPSTER_SUPPORT_RATE_LIMITS = {
  messages_per_minute: 5,  // UserMessagesPerMinute del contrato
  cooldown_message: 'Espera un momento antes de enviar más mensajes'
}

// Misma configuración que AttachmentRules del contrato
const TIPSTER_SUPPORT_ATTACHMENTS = {
  max_files_per_message: 3,  // MaxAttachments del contrato
  max_size_mb: 10,  // MaxAttachmentSizeMB del contrato
  allowed_types: ['image/png', 'image/jpeg', 'application/pdf']  // AttachmentTypes del contrato
}
```

---

## 7) UI comportamiento

Inbox:
- Filtros: channel, status, tags
- Badge “unread”
- Quick actions: marcar leído / cerrar

Chat:
- Timeline de mensajes
- Input + adjuntos
- Quick replies (templates)
- Banner de estado (open/pending/closed)
- Nota fija: “Esto es soporte interno, no compartas datos sensibles.”

Crear ticket (si aplica):
- Asignación de categoría/tag
- Campo de asunto y descripción
- Adjuntos opcionales

---

## 8) Plantillas rápidas (Macros)

```javascript
const TIPSTER_QUICK_MACROS = {
  verification_request: {
    label: 'Solicitud de verificación',
    body: 'Por favor comparte la documentación requerida para verificación. Nuestro equipo revisará tu caso y te informará el estado.'
  },
  dispute_review: {
    label: 'Revisión de disputa',
    body: 'Hemos recibido tu disputa. La estamos revisando y te notificaremos cualquier ajuste al settlement si corresponde.'
  },
  settlement_adjustment: {
    label: 'Ajuste de settlement',
    body: 'Se aplicó un ajuste al settlement por revisión. Consulta el detalle en tu panel de señales.'
  },
  payments_wallet_issue: {
    label: 'Problema de pagos / wallet',
    body: 'Detectamos un inconveniente con tu wallet o pago. Estamos trabajando para resolverlo. Comparte cualquier detalle adicional.'
  },
  user_report: {
    label: 'Reporte de usuario',
    body: 'Tu reporte ha sido recibido. El equipo de moderación evaluará la situación y tomará acciones si corresponde.'
  }
}
```

---

## 9) Eventos / Logs

Eventos estándar:
- support_conversation_created
- support_message_sent
- support_conversation_closed
- support_flagged_message

Ejemplos de payload:
```javascript
const EVENTS = {
  support_conversation_created: (conv) => ({
    id: conv.id,
    channel: conv.channel,
    tipster_id: conv.participants.tipster_id,
    admin_id: conv.participants.admin_id,
    user_id: conv.participants.user_id,
    status: conv.status,
    tags: conv.tags,
    created_at: timestamp
  }),
  support_message_sent: (msg) => ({
    id: msg.id,
    conversation_id: msg.conversation_id,
    sender_role: msg.sender_role,
    created_at: timestamp
  }),
  support_conversation_closed: (conv) => ({
    id: conv.id,
    closed_at: timestamp,
    by_role: 'admin'
  }),
  support_flagged_message: (msg, flags) => ({
    id: msg.id,
    conversation_id: msg.conversation_id,
    flags,
    flagged_at: timestamp
  })
}
```

---

## 10) Estados y transiciones (simplificado)

```javascript
const TIPSTER_SUPPORT_TRANSITIONS = {
  open: ['pending', 'closed'],
  pending: ['open', 'closed'],
  closed: []
}

function transitionStatus(current, next) {
  const allowed = TIPSTER_SUPPORT_TRANSITIONS[current] || []
  return allowed.includes(next) ? next : current
}
```

---

## 11) Notas de compliance

- Todo mensaje y archivo queda registrado con timestamp y actor.
- Moderación activa para abuso/spam.
- El canal ops es el camino oficial para pagos, disputas, verificación y sanciones.
- vip_chat es opcional y condicionado a estado y configuración.

## 12) Sistema disciplinario (SANCTION FLOW)

El módulo de soporte es el disparador oficial de medidas disciplinarias ante abuso o violaciones de política.

```typescript
export type SanctionLevel =
  | 'warning'
  | 'temporary_restriction'
  | 'vip_chat_disabled'
  | 'profile_flagged'
  | 'tipster_suspended'
  | 'tipster_banned'

export interface SanctionEvent {
  tipster_id: string
  level: SanctionLevel
  reason: 'external_payments' | 'sensitive_data' | 'line_manipulation' | 'abuse' | 'spam' | 'other'
  evidence: Array<{ message_id?: string; note?: string }>
  applied_at: timestamp
  expires_at?: timestamp  // solo si temporal
}
```

Reglas de escalamiento (referenciales):
- warning → primer incidente o baja severidad.
- temporary_restriction → limitación temporal (rate-limit reforzado y adjuntos deshabilitados).
- vip_chat_disabled → se deshabilita canal vip_chat hasta revisión.
- profile_flagged → muestra etiqueta/flag visible en panel interno; puede impactar ranking.
- tipster_suspended → estado equivalente a FROZEN (solo ops habilitado, sin VIP ni ventas).
- tipster_banned → cierre de cuenta y bloqueo total (solo canal de apelación con admin, si se define).

Aplicación:
```javascript
function evaluateSanction(flags, priorIncidents) {
  const severityScore = flags.reduce((acc, f) => acc + (f.risk || 20), 0) + priorIncidents * 10
  if (severityScore >= 100) return 'tipster_banned'
  if (severityScore >= 75)  return 'tipster_suspended'
  if (severityScore >= 60)  return 'vip_chat_disabled'
  if (severityScore >= 45)  return 'temporary_restriction'
  return 'warning'
}

function enforceSanction(tipster, level) {
  switch (level) {
    case 'warning':
      showBanner(tipster.id, 'Advertencia: tu conducta viola políticas. Evita pagos externos y datos sensibles.')
      break
    case 'temporary_restriction':
      tipster.features.attachments_enabled = false
      tipster.rate_limits.messages_per_minute = Math.max(1, tipster.rate_limits.messages_per_minute / 2)
      showBanner(tipster.id, 'Restricción temporal aplicada por conducta. Se limitan mensajes y adjuntos.')
      break
    case 'vip_chat_disabled':
      disableChannel(tipster.id, 'vip_chat')
      showBanner(tipster.id, 'VIP Chat deshabilitado hasta revisión por el equipo.')
      break
    case 'profile_flagged':
      tipster.flags.profile_flagged = true
      notifyOps('Perfil tipster marcado por conducta. Revisión prioritaria.')
      break
    case 'tipster_suspended':
      tipster.status = 'FROZEN'
      disableChannel(tipster.id, 'vip_chat')
      showBanner(tipster.id, 'Cuenta suspendida. Solo canal OPS disponible hasta resolución.')
      break
    case 'tipster_banned':
      tipster.status = 'BANNED'
      disableAllChannels(tipster.id)
      notifyOps('Tipster banneado por violaciones críticas. Bloqueo total aplicado.')
      break
  }
  logEvent('support_sanction_applied', { tipster_id: tipster.id, level })
}
```

UI/UX:
- Mostrar banner claro en Chat (ops/vip_chat según aplique).
- En sanciones que limiten funciones, deshabilitar inputs y adjuntos con mensajes informativos.

---

## 13) SLA del Soporte Tipster

Definir tiempos objetivo y prioridades por categoría para el canal ops (y aplicable a vip_chat si estuviera habilitado bajo reglas de plataforma).

```javascript
> **📋 Basado en:** [SUPPORT-CONTRACT.md](../SUPPORT-CONTRACT.md) - SLAFramework para tipsters

const TIPSTER_SLA_TARGETS = {
  PAYMENTS: {
    priority: 'high',
    first_response_minutes: 120,
    resolution_hours: 48
  },
  DISPUTE: {
    priority: 'critical',
    first_response_minutes: 60,
    resolution_hours: 24
  },
  VERIFICATION: {
    priority: 'medium',
    first_response_minutes: 240,
    resolution_hours: 120
  },
  ABUSE: {
    priority: 'critical',
    first_response_minutes: 60,
    resolution_hours: 72
  },
  OTHER: {
    priority: 'low',
    first_response_minutes: 480,
    resolution_hours: 96
  }
}

// Mapeo explícito: Categoría Tipster → Prioridad Core
const TIPSTER_TO_CORE_PRIORITY_MAPPING = {
  DISPUTE: 'P1',      // Critical → P1
  ABUSE: 'P1',        // Critical → P1  
  PAYMENTS: 'P2',     // High → P2
  VERIFICATION: 'P3', // Medium → P3
  OTHER: 'P4'         // Low → P4
}

function getSlaIndicator(category, elapsedMinutes, elapsedHours) {
  const t = TIPSTER_SLA_TARGETS[category] || TIPSTER_SLA_TARGETS.OTHER
  const responseRisk = elapsedMinutes > t.first_response_minutes
  const resolutionRisk = elapsedHours > t.resolution_hours
  return {
    label: responseRisk || resolutionRisk ? 'SLA en riesgo' : 'SLA OK',
    color: responseRisk || resolutionRisk ? (t.priority === 'critical' ? 'red' : 'yellow') : 'green'
  }
}

function escalateOnSlaBreach(conversation) {
  const cat = conversation.tags?.[0] || 'OTHER'
  const indicator = getSlaIndicator(cat, conversation.elapsed_first_response_min, conversation.elapsed_resolution_hours)
  if (indicator.color !== 'green') {
    notifyOps('Escalación automática por SLA', { conversation_id: conversation.id, category: cat })
    assignPriorityQueue(conversation.id, cat)
    logEvent('support_sla_breached', { conversation_id: conversation.id, category: cat })
  }
}
```

UI/UX:
- Mostrar chip/badge de SLA en Inbox y en el header de Chat.
- Colores: green (OK), yellow (riesgo), red (incumplimiento crítico).

---

## 14) Disclaimer legal obligatorio

Este disclaimer es obligatorio en el marketplace de picks. Debe mostrarse:
- al abrir chat VIP
- al enviar mensaje
- al crear ticket

```javascript
const TIPSTER_SUPPORT_DISCLAIMERS = {
  tipster_chat: {
    es: 'Los tipsters no garantizan resultados. El trading deportivo implica riesgo. Toda decisión de inversión es responsabilidad del usuario.',
    en: 'Tipsters do not guarantee results. Sports trading involves risk. All investment decisions are the user\'s responsibility.'
  },
  admin_support: {
    es: 'Soporte responde por orden de llegada. No compartir claves ni datos sensibles.',
    en: 'Support responds in order of arrival. Do not share passwords or sensitive data.'
  }
}

function requireDisclaimerAck(context) {
  if (!context?.disclaimer_ack) {
    showDisclaimerBanner(TIPSTER_SUPPORT_DISCLAIMERS.tipster_chat.es)
    return false  // bloquear envío hasta aceptación
  }
  return true
}
```

UI/UX:
- Banner fijo colapsible en Chat.
- Bloqueo de envío si no se acepta el disclaimer cuando aplica.

---

## 15) Score de calidad de soporte del tipster

Métrica que impacta ranking, visibilidad y confianza del tipster.

```typescript
export interface TipsterSupportQuality {
  tipster_id: string
  support_quality_score: number  // 0-100
  avg_response_time_minutes: number
  resolution_rate: number         // 0-1
  reopened_tickets_rate: number   // 0-1
  reports_received: number
  blocked_users_count: number
  updated_at: timestamp
}

export function computeSupportQualityScore(m: TipsterSupportQuality) {
  // Ejemplo de ponderación: penaliza tiempos altos y reaperturas, recompensa resolución
  const responsePenalty = Math.min(50, m.avg_response_time_minutes / 10)    // 10 min = 1 punto hasta 500 min
  const resolutionBonus = Math.min(30, m.resolution_rate * 30)              // 100% = +30
  const reopenPenalty = Math.min(20, m.reopened_tickets_rate * 40)          // 50% = -20
  const reportsPenalty = Math.min(20, m.reports_received * 2)               // cada reporte -2, cap -20
  const blocksPenalty = Math.min(10, m.blocked_users_count)                 // cada bloqueo -1, cap -10
  const base = 100 - responsePenalty - reopenPenalty - reportsPenalty - blocksPenalty + resolutionBonus
  return Math.max(0, Math.min(100, Math.round(base)))
}
```

Integración:
- Este score se muestra en el perfil del tipster y en su ranking.
- Actualizar periódicamente (batch diario) y tras eventos clave (cierre de conversación, breach de SLA).

Eventos:
- support_quality_score_updated

---

## 16) Flujo de disputa ligado a Settlements

Conexión explícita entre soporte y el módulo de settlements del tipster.

Estados del flujo:
```
settlement_dispute → settlement_review → settlement_adjustment → audit_log → notify_subscribers
```

Reglas y ownership:
- support registra la disputa y dispara la revisión.
- settlements es el dueño de aplicar ajustes y registrar el audit_log.
- notificaciones a suscriptores se generan tras ajustes.

Pseudocódigo:
```javascript
function linkDisputeToSettlement(conversation, disputeContext) {
  logEvent('settlement_dispute_linked', { conversation_id: conversation.id, pick_id: disputeContext.pick_id })
  const review = createSettlementReview(disputeContext)
  const result = performSettlementAdjustment(review)
  if (result.adjusted) {
    recordSettlementAudit(result)
    notifySubscribers(result)
    sendMacro(conversation.id, TIPSTER_QUICK_MACROS.settlement_adjustment)
  }
}
```

Referencias:
- Ver módulo de settlements del tipster para detalles de revisión y ajuste.

Eventos adicionales:
- settlement_dispute_received
- settlement_review_completed
- settlement_adjustment_applied

---
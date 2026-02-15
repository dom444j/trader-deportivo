# Support Hub Contract

## 📋 Propósito

Este documento define el contrato unificado para todos los módulos de soporte en la plataforma. Sirve como **fuente de verdad canónica** para:

- Tipos de conversación y canales
- Estados de tickets y conversaciones
- Modelo de mensajes y adjuntos
- SLA y métricas
- Mapeos entre diferentes niveles de detalle

## 🎯 Modelo de Datos Core

### 1. Tipos de Conversación (Conversation Types)

```typescript
export type ConversationType = 'admin_support' | 'tipster_chat'

export interface Conversation {
  id: string
  type: ConversationType
  participants: {
    user_id: string
    admin_id?: string
    tipster_id?: string
  }
  created_at: timestamp
  updated_at: timestamp
  last_message_at: timestamp
  unread_by: {
    user: number
    admin: number
    tipster: number
  }
}
```

### 2. Canales (Channels) - Solo para Tipster Chat

```typescript
export type TipsterSupportChannel = 'ops' | 'vip_chat' | 'system'
```

### 3. Estados de Ticket (Core Status Enum)

```typescript
export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  AWAITING_USER = 'awaiting_user',
  AWAITING_ADMIN = 'awaiting_admin',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}
```

### 4. Categorías de Ticket

```typescript
export enum TicketCategory {
  ACCOUNT_ACCESS = 'account_access',
  PAYMENTS = 'payments',
  WITHDRAWALS = 'withdrawals',
  TECHNICAL_BUG = 'technical_bug',
  REPORT_USER = 'report_user',
  PRODUCT_QUESTION = 'product_question',
  OTHER = 'other'
}
```

### 5. Modelo de Mensaje (Universal)

```typescript
export interface Message {
  id: string
  conversation_id: string
  sender_role: 'user' | 'admin' | 'tipster' | 'system'
  
  // Content
  type: 'text' | 'attachment' | 'system'
  content?: string
  attachments?: Attachment[]
  
  // Context reference (opcional)
  context_reference?: {
    type: 'pick' | 'post' | 'purchase' | 'withdrawal'
    id: string
    preview?: string
  }
  
  // Metadata
  created_at: number
  read_at?: number
  
  // Context (opcional)
  context?: {
    pick_id?: string
    post_id?: string
    purchase_id?: string
    bet_id?: string
  }
}

export interface Attachment {
  url: string
  mime_type: 'image/png' | 'image/jpeg' | 'application/pdf'
  filename: string
  size_bytes: number
}
```

### 6. Reglas de Adjuntos (Universal)

```typescript
const ATTACHMENT_RULES = {
  max_files_per_message: 3,
  max_size_mb: 10,
  allowed_types: ['image/png', 'image/jpeg', 'application/pdf'],
  
  // Rate limiting
  rate_limit: {
    messages_per_minute: 5,
    cooldown_message: 'Espera un momento antes de enviar más mensajes'
  }
}
```

## 🔗 Mapeos entre Módulos

### 6.1 Mapeo de Estados (Admin Status Aliases)

| Status Core | Admin Alias | Descripción |
|-------------|-------------|-------------|
| IN_PROGRESS | pending_finance | Esperando revisión de finanzas |
| IN_PROGRESS | pending_dev | Esperando revisión de desarrollo |
| AWAITING_USER | pending_user | Esperando respuesta del usuario |
| AWAITING_ADMIN | - | Esperando respuesta del admin |
| OPEN | open | Ticket recién creado |
| RESOLVED | resolved | Marcado como resuelto |
| CLOSED | closed | Ticket cerrado |

```typescript
const ADMIN_STATUS_MAPPING = {
  'pending_finance': TicketStatus.IN_PROGRESS,
  'pending_dev': TicketStatus.IN_PROGRESS,
  'pending_user': TicketStatus.AWAITING_USER,
  'open': TicketStatus.OPEN,
  'resolved': TicketStatus.RESOLVED,
  'closed': TicketStatus.CLOSED
}
```

### 6.2 Mapeo de Estados Simples (User View)

```typescript
const USER_SIMPLE_STATES = {
  [TicketStatus.OPEN]: 'Abierto',
  [TicketStatus.IN_PROGRESS]: 'En progreso',
  [TicketStatus.AWAITING_USER]: 'Esperando tu respuesta',
  [TicketStatus.AWAITING_ADMIN]: 'En revisión',
  [TicketStatus.RESOLVED]: 'Resuelto',
  [TicketStatus.CLOSED]: 'Cerrado'
}
```

### 6.3 Mapeo de Canales Tipster

```typescript
const TIPSTER_CHANNEL_MAPPING = {
  'ops': {
    core_type: 'tipster_chat',
    description: 'Tipster ↔ Admin/Operaciones'
  },
  'vip_chat': {
    core_type: 'tipster_chat', 
    description: 'Tipster ↔ Usuario (condicional)'
  },
  'system': {
    core_type: 'tipster_chat',
    description: 'Notificaciones internas'
  }
}
```

## ⚡ SLA Framework

### 7.1 SLA por Categoría (User View)

```typescript
const USER_SLA_INDICATORS = {
  ACCOUNT_ACCESS: { priority: 'high', indicator: 'SLA OK' },
  PAYMENTS: { priority: 'critical', indicator: 'SLA OK' },
  WITHDRAWALS: { priority: 'high', indicator: 'SLA OK' },
  TECHNICAL_BUG: { priority: 'medium', indicator: 'SLA OK' },
  REPORT_USER: { priority: 'medium', indicator: 'SLA OK' },
  PRODUCT_QUESTION: { priority: 'low', indicator: 'SLA OK' },
  OTHER: { priority: 'low', indicator: 'SLA OK' }
}
```

### 7.2 SLA Detallado (Admin View)

```typescript
const ADMIN_SLA_TARGETS = {
  P1_CRITICAL: {
    first_response: 120, // minutos
    resolution: 2, // horas
    categories: ['PAYMENTS', 'ACCOUNT_ACCESS']
  },
  P2_IMPORTANT: {
    first_response: 480, // minutos  
    resolution: 8, // horas
    categories: ['WITHDRAWALS', 'TECHNICAL_BUG']
  },
  P3_STANDARD: {
    first_response: 1440, // minutos
    resolution: 24, // horas
    categories: ['REPORT_USER', 'PRODUCT_QUESTION', 'OTHER']
  }
}
```

### 7.3 SLA Tipster

```typescript
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
```

## 👥 Permisos y Visibilidad

### 8.1 Qué ve cada rol

**Usuario:**
- Solo sus propias conversaciones
- Estados simplificados (User Simple States)
- SLA como indicador visual (chip)
- Sin IDs técnicos

**Admin:**
- Todas las conversaciones
- Estados completos + aliases
- SLA detallado con tiempos exactos
- IDs técnicos visibles
- Acciones administrativas

**Tipster:**
- Sus conversaciones como tipster
- Canales ops, vip_chat (si habilitado), system
- SLA tipster
- Estados simplificados para usuarios

## 🔄 Flujo de Trabajo

### 9.1 Crear Conversación

```typescript
function createConversation(type: ConversationType, channel?: TipsterSupportChannel): Conversation {
  return {
    id: generateId(),
    type,
    participants: {}, // se llena según tipo
    created_at: Date.now(),
    updated_at: Date.now(),
    last_message_at: Date.now(),
    unread_by: {
      user: 0,
      admin: 0,
      tipster: 0
    }
  }
}
```

### 9.2 Enviar Mensaje

```typescript
function sendMessage(conversation: Conversation, sender_role: Message['sender_role'], content: string) {
  // Validar rate limiting
  // Validar adjuntos si aplica
  // Crear mensaje
  // Actualizar conversación
}
```

### 9.3 Cambiar Estado

```typescript
function updateTicketStatus(ticket_id: string, new_status: TicketStatus) {
  // Validar transición permitida
  // Actualizar estado
  // Registrar en auditoría
  // Notificar si aplica
}
```

## 📊 Métricas y Reportes

### 10.1 Métricas Core

```typescript
const CORE_METRICS = {
  first_contact_resolution: '85%',
  average_resolution_time: '< 4 hours',
  customer_satisfaction: '> 4.5/5',
  escalation_rate: '< 15%',
  sla_compliance: '> 95%'
}
```

### 10.2 Reportes por Módulo

**Admin Support:**
- Tickets por categoría
- Tiempo promedio de resolución
- Tasa de escalamiento
- Satisfacción del usuario

**Tipster Support:**
- Conversaciones por canal
- Tiempo de respuesta promedio
- Tasa de resolución
- Calidad del soporte del tipster

## 🛡️ Compliance y Seguridad

### 11.1 Reglas de Compliance

- Todos los mensajes se registran con timestamp y actor
- Moderación activa para abuso/spam
- Sin compartir credenciales o datos sensibles
- Sin coordinación de apuestas para manipular líneas
- Sin solicitud de pagos externos

### 11.2 Disclaimer Obligatorio

```typescript
const SUPPORT_DISCLAIMERS = {
  tipster_chat: {
    es: "Los tipsters no garantizan resultados. El trading deportivo implica riesgo. Toda decisión de inversión es responsabilidad del usuario.",
    en: "Tipsters do not guarantee results. Sports trading involves risk. All investment decisions are the user's responsibility."
  },
  admin_support: {
    es: "Soporte responde por orden de llegada. No compartir claves ni datos sensibles.",
    en: "Support responds in order of arrival. Do not share passwords or sensitive data."
  }
}
```

## 🔗 API Paths Unificados

### 12.1 Convención de Rutas

```typescript
// User-facing endpoints (vista usuario)
const USER_API_PATHS = {
  conversations: '/api/support/conversations',
  conversation: '/api/support/conversations/:id',
  messages: '/api/support/conversations/:id/messages',
  tickets: '/api/support/tickets',
  ticket: '/api/support/tickets/:id'
}

// Admin endpoints (vista administrador)
const ADMIN_API_PATHS = {
  conversations: '/api/admin/support/conversations',
  conversation: '/api/admin/support/conversations/:id',
  messages: '/api/admin/support/conversations/:id/messages',
  tickets: '/api/admin/support/tickets',
  ticket: '/api/admin/support/tickets/:id',
  internal_notes: '/api/admin/support/tickets/:id/notes',
  assignments: '/api/admin/support/tickets/:id/assign'
}

// Tipster endpoints (vista tipster)
const TIPSTER_API_PATHS = {
  conversations: '/api/tipster/support/conversations',
  conversation: '/api/tipster/support/conversations/:id',
  messages: '/api/tipster/support/conversations/:id/messages'
}
```

### 12.2 Reglas de Implementación

- **Usuario regular**: Solo accede a `/api/support/*`
- **Administrador**: Accede a `/api/admin/support/*` para funciones administrativas
- **Tipster**: Accede a `/api/tipster/support/*` para sus conversaciones
- Todos los endpoints deben validar el rol del usuario
- Los datos retornados se filtran según el rol y permisos

## 📋 Checklist de Implementación

### 12.1 Para Cada Módulo

**support.md:**
- ✅ Referenciar este contrato como "core"
- ✅ Usar enums definidos aquí
- ✅ Implementar SLA por categoría
- ✅ Mostrar indicadores visuales

**SUPPORT-ADMIN.md:**
- ✅ Extender este contrato (no reemplazar)
- ✅ Usar mapeos de estado definidos aquí
- ✅ Implementar SLA detallado
- ✅ Agregar campos administrativos

**tipster-support.md:**
- ✅ Usar Message/Attachment rules del core
- ✅ Implementar canales según mapeo
- ✅ Usar SLA tipster definido aquí
- ✅ Mantener compatibilidad con core

### 12.2 Para HTML/CSS

- Implementar componentes visuales según este contrato
- Usar mismos nombres de clases y estructuras
- Mantener consistencia visual entre módulos
- Implementar estados vacíos según especificación

---

## 🎯 Resultado Esperado

Con este contrato unificado:

1. **Trae deja de decir "incompatibles"** y pasa a decir **"compatibles con mapping"**
2. Cada módulo mantiene su propósito específico
3. Todos usan los mismos fundamentos core
4. Las diferencias son solo en nivel de detalle y perspectiva
5. La implementación es consistente y mantenible
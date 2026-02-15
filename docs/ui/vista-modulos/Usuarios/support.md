# Support Hub Module

> **📋 Fuente de Verdad:** Este módulo implementa el [SUPPORT-CONTRACT.md](../SUPPORT-CONTRACT.md) como especificación core. Todos los enums, estados y modelos deben ser consistentes con el contrato unificado.

## Concepto Central

**Support Hub es el sistema de comunicación centralizado entre usuarios, administradores y tipsters dentro de la plataforma.**

No es un sistema genérico de tickets — es un hub de soporte contextual que entiende el ecosistema de trading deportivo, permitiendo comunicación eficiente con trazabilidad completa y sin fricciones externas.

**Principio fundamental:** Todo el soporte ocurre dentro de la plataforma, generando trazabilidad, datos estructurados y mejor experiencia de usuario.

---

## 1. Propósito del Módulo

Support Hub tiene **5 objetivos estratégicos:**

1. **Centralizar comunicación** — Eliminar WhatsApp/Telegram/Email disperso
2. **Reducir fricción** — Resolver problemas donde ocurren
3. **Generar trazabilidad** — Historial completo de interacciones
4. **Habilitar SLAs** — Tiempos de respuesta medibles y mejorables
5. **Crear dataset** — Problemas frecuentes, calidad de soporte, fraude

### 1.1. Tipos de Soporte

**Admin Support:**
- Problemas de cuenta (login, 2FA, verificación)
- Compras, pagos, retiros
- Bugs técnicos
- Reportes de usuarios
- Moderación

**Tipster Support:**
- Dudas sobre picks/análisis específicos
- Seguimiento educativo
- Aclaraciones metodológicas
- **NO garantías ni promesas de resultados**

---

## 2. Filosofía y Límites

### 2.1. Principios Core

**Transparencia sin promesas:**
- ✅ Explicar razonamiento
- ✅ Compartir metodología
- ❌ Garantizar resultados
- ❌ Prometer ganancias

**Seguridad y compliance:**
- ✅ Logs completos de toda interacción
- ✅ Auditoría de cambios de estado
- ✅ Rate limiting anti-spam
- ✅ Detección de patrones sospechosos

**Límites estrictos:**
- ❌ No permitir spam, amenazas, acoso
- ❌ No permitir enlaces maliciosos
- ❌ No permitir que tipster solicite pagos externos
- ❌ No permitir compartir credenciales o datos sensibles
- ❌ No permitir coordinación de apuestas para manipular líneas

### 2.2. Disclaimer Obligatorio

```javascript
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

---

## 3. Tipos de Conversación (Channels)

### 3.1. Admin Support (Ticket-based)

**Características:**
- Sistema de tickets con estados (según [SUPPORT-CONTRACT.md](../SUPPORT-CONTRACT.md))
- Disponible para todos los planes
- Categorización obligatoria
- Priorización automática
- SLA tracking con indicadores visuales

**Ciclo de vida (Core Status):**
```
OPEN → IN_PROGRESS → AWAITING_USER ⟷ AWAITING_ADMIN → RESOLVED → CLOSED
```

**Estados para usuario (simplificados):**
- Abierto → En progreso → Esperando tu respuesta → En revisión → Resuelto → Cerrado

### 3.2. Tipster Chat (DM Contextual)

**Características:**
- Conversación directa 1:1
- Solo para tipsters seguidos (Feature flag)
- Contextual a picks/análisis
- Sin estados formales
- Opcional según plan

**Restricciones:**
```javascript
const TIPSTER_CHAT_REQUIREMENTS = {
  min_plan: 'PRO',  // Solo PRO+ según nomenclatura Store (PRO, ELITE)
  must_be_follower: true,
  tipster_must_allow_dms: true,
  max_active_chats: 3  // máximo 3 chats simultáneos con tipsters
}
```

### 3.2.1. Eligibility Policy (MVP)
```javascript
function canOpenTipsterChat(user, tipster) {
  const planOk = isPlanAtLeast(user.plan, TIPSTER_CHAT_REQUIREMENTS.min_plan)
  const isFollower = isFollowing(user.id, tipster.id)
  const boughtRecently = hasPurchasedTipsterPicks(user.id, tipster.id, { days: 30 })
  const dmsAllowed = tipster.allow_dms === true
  const activeChats = getActiveTipsterChatsCount(user.id)
  
  // Premium tipsters pueden habilitar DMs abiertas (flag)
  const tipsterIsPremium = tipster.plan === 'ELITE'
  const openDmsForPremium = tipsterIsPremium && tipster.open_dms_for_non_followers === true
  
  const withinLimit = activeChats < TIPSTER_CHAT_REQUIREMENTS.max_active_chats

  const allowed =
    planOk &&
    withinLimit &&
    dmsAllowed &&
    (isFollower || boughtRecently || openDmsForPremium)
  
  return {
    allowed,
    reason: allowed ? undefined : 'not_eligible'
  }
}
```
- Puede abrir chat si: es follower del tipster AND el tipster permite DMs AND no supera max_active_chats.
- Elegible también si ha comprado picks del tipster en los últimos 30 días.
- Tipsters premium (ELITE) pueden habilitar DMs abiertas para no-followers según flag.



---

## 4. Pantallas UI (MVP)

### 4.1. Inbox (Lista de Conversaciones)

```typescript
// Implementación del [SUPPORT-CONTRACT.md](../SUPPORT-CONTRACT.md)
interface InboxItem {
  conversation_id: string
  type: 'admin_support' | 'tipster_chat'  // Según ConversationType del contrato
  
  // Visual
  icon: '🛟' | '💬'
  title: string  // "Pago pendiente #A1B2" | "Tipster: JuanM"
  last_message: string
  last_message_at: timestamp
  
  // Status
  unread_count: number
  ticket_status?: TicketStatus  // Estados core del contrato
  
  // Participants
  tipster_info?: {
    user_id: string
    alias: string
    avatar_url?: string
  }
}
```

**Rendering según tipo:**
- **Admin Support**: status chip + category chip + SLA chip (indicador visual según SUPPORT-CONTRACT)
- **Tipster Chat**: solo icono + título + last_message + tiempo (sin estado formal)

**Formato de chips (basado en SUPPORT-CONTRACT):**
- **Status chip**: Estados core del contrato con colores definidos
- **Category chip**: Categorías del contrato con variantes outline
- **SLA chip**: Indicador visual (OK/riesgo/breach) sin números
- **User view**: Estados simplificados (Abierto/En progreso/Esperando tu respuesta/En revisión/Resuelto/Cerrado)

### 4.2. Chat View

> **📋 Implementación:** Todos los modelos siguen el [SUPPORT-CONTRACT.md](../SUPPORT-CONTRACT.md) para garantizar consistencia.

**Header:**
```typescript
// Basado en SUPPORT-CONTRACT
interface ChatHeader {
  // Identity
  participant_name: string
  participant_role: 'admin' | 'tipster'
  participant_avatar?: string
  
  // Status (solo admin_support)
  ticket_status?: TicketStatus  // Estados core del contrato
  ticket_category?: TicketCategory  // Categorías del contrato
  
  // SLA indicator (solo admin_support)
  sla_indicator?: {
    label: "OK" | "En riesgo" | "Brecha"  // Indicador visual según contrato
    color: 'green' | 'yellow' | 'red'
  }
  
  // Actions
  actions: Action[]  // [Close, Escalate, Report, etc.]
}
```

**Messages (Bubbles):**
```typescript
// Basado en SUPPORT-CONTRACT Message model
interface MessageBubble {
  message_id: string
  sender_role: 'user' | 'admin' | 'tipster' | 'system'  // MessageSenderRole del contrato
  
  // Content
  type: 'text' | 'attachment' | 'system'  // MessageType del contrato
  content?: string
  attachments?: Attachment[]  // Attachment del contrato (mime_type, filename, size_bytes, url)
  
  // Metadata
  created_at: timestamp
  read_at?: timestamp
  
  // Context (opcional)
  context?: {
    pick_id?: string
    post_id?: string
    purchase_id?: string
  }
}
```

**Composer:**
```typescript
// Basado en SUPPORT-CONTRACT AttachmentRules y rate limits
interface MessageComposer {
  input: {
    placeholder: string
    max_length: 2000  // Según MessageMaxLength del contrato
    multiline: true
  }
  
  actions: {
    attach_file: boolean  // Según AttachmentRules del contrato
    emoji_picker?: boolean  // futuro
    quick_replies?: string[]  // futuro
  }
  
  // Restrictions - Anti-spam rules del contrato
  rate_limit: {
    max_per_minute: 5  // UserMessagesPerMinute del contrato
    cooldown_message: "Espera un momento antes de enviar más mensajes"
  }
}
```

### 4.3. New Ticket Form (Admin Support)

> **📋 Basado en:** [SUPPORT-CONTRACT.md](../SUPPORT-CONTRACT.md) - TicketCategory enum y AttachmentRules

```typescript
interface NewTicketForm {
  category: TicketCategory  // Categorías del contrato - required
  priority: 'normal' | 'high'  // default: normal
  subject: string  // max 100 chars
  description: string  // max 2000 chars
  attachments?: File[]  // max 3 files (según AttachmentRules)
  
  // Auto-populated context (si aplica)
  context?: {
    purchase_id?: string
    withdrawal_id?: string
    user_id_reported?: string
    post_id_reported?: string
  }
}
```

**Form Validations:**
> **📋 Basado en:** [SUPPORT-CONTRACT.md](../SUPPORT-CONTRACT.md) - AttachmentRules y validaciones estándar

```javascript
const TICKET_VALIDATIONS = {
  subject: {
    min_length: 5,
    max_length: 100,
    required: true
  },
  
  description: {
    min_length: 20,
    max_length: 2000,  // MessageMaxLength del contrato
    required: true
  },
  
  attachments: {
    max_files: 3,  // MaxAttachments del contrato
    max_size_mb: 10,  // MaxAttachmentSizeMB del contrato
    allowed_types: ['image/png', 'image/jpeg', 'application/pdf']  // AttachmentTypes del contrato
  }
}
```

### 4.4. Detalles de UI/UX (HTML, Componentes Específicos)

#### **Estructura HTML del Support Hub**

```html
<!-- Support Hub Container Principal -->
<div id="support-hub" class="support-container">
  
  <!-- Sidebar Navigation -->
  <nav class="support-sidebar">
    <div class="sidebar-header">
      <h2>Soporte</h2>
      <button class="new-ticket-btn" onclick="createNewTicket()">
        <span class="icon">+</span> Nuevo Ticket
      </button>
    </div>
    
    <!-- Search Bar -->
    <div class="search-container">
      <input type="text" id="support-search" placeholder="Buscar conversaciones..." 
             onkeyup="filterConversations(this.value)">
      <span class="search-icon">🔍</span>
    </div>
    
    <!-- Conversations List -->
    <div class="conversations-list" id="conversations-list">
      <!-- Conversations se cargarán dinámicamente -->
    </div>
  </nav>
  
  <!-- Main Content Area -->
  <main class="support-main">
    
    <!-- Empty State - No Conversations -->
    <div id="empty-state" class="empty-state" style="display: none;">
      <div class="empty-icon">🎫</div>
      <h3>Aún no tienes conversaciones</h3>
      <p>Crea tu primer ticket para empezar.</p>
      <button class="primary-btn" onclick="createNewTicket()">Crear Ticket</button>
    </div>
    
    <!-- Empty State - No Messages -->
    <div id="empty-chat" class="empty-chat" style="display: none;">
      <div class="empty-icon">💬</div>
      <h3>Nueva conversación</h3>
      <p>Describe tu problema o comparte contexto para que podamos ayudarte.</p>
    </div>
    
    <!-- Empty State - No Search Results -->
    <div id="no-search-results" class="empty-state" style="display: none;">
      <div class="empty-icon">🔍</div>
      <h3>No encontramos coincidencias</h3>
      <p>Intenta con otros términos o crea un nuevo ticket.</p>
    </div>
    
    <!-- Chat View Container -->
    <div id="chat-container" class="chat-container" style="display: none;">
      
      <!-- Chat Header -->
      <header class="chat-header">
        <div class="participant-info">
          <img id="participant-avatar" class="avatar" src="" alt="">
          <div class="participant-details">
            <h4 id="participant-name"></h4>
            <span id="participant-role" class="role-badge"></span>
            <span id="ticket-status" class="status-chip"></span>
            <span id="category-chip" class="category-chip"></span>
          </div>
        </div>
        
        <div class="header-actions">
          <button class="icon-btn" onclick="toggleInfoPanel()" title="Información">
            <span class="icon">ℹ️</span>
          </button>
          <button class="icon-btn" onclick="closeChat()" title="Cerrar">
            <span class="icon">✕</span>
          </button>
        </div>
      </header>
      
      <!-- Policy Banner -->
      <div id="policy-banner" class="policy-banner">
        <div class="banner-content">
          <span class="banner-icon">⚠️</span>
          <span class="banner-text" id="disclaimer-text"></span>
          <button class="banner-toggle" onclick="togglePolicyBanner()">Ver políticas</button>
        </div>
        <button class="banner-close" onclick="closePolicyBanner()">✕</button>
      </div>
      
      <!-- Messages Container -->
      <div class="messages-container" id="messages-container">
        <!-- Messages se cargarán dinámicamente -->
      </div>
      
      <!-- Activity Indicator (Mock) -->
      <div id="activity-indicator" class="activity-indicator" style="display: none;">
        <span class="typing-text" id="typing-text"></span>
        <span class="typing-dots">...</span>
      </div>
      
      <!-- Message Input -->
      <div class="message-input-container">
        <div class="attachment-area" id="attachment-area">
          <input type="file" id="file-input" multiple accept="image/*,.pdf" style="display: none;">
          <button class="attach-btn" onclick="document.getElementById('file-input').click()">
            <span class="icon">📎</span>
          </button>
        </div>
        
        <div class="input-wrapper">
          <textarea id="message-input" placeholder="Escribe tu mensaje..." 
                    onkeydown="handleMessageKeydown(event)" rows="1"></textarea>
          <button class="send-btn" onclick="sendMessage()" disabled>
            <span class="icon">➤</span>
          </button>
        </div>
      </div>
      
      <!-- Attachment Preview -->
      <div id="attachment-preview" class="attachment-preview" style="display: none;">
        <div class="preview-container" id="preview-container"></div>
        <button class="remove-all-btn" onclick="clearAttachments()">Quitar todos</button>
      </div>
    </div>
    
  </main>
</div>
```

#### **Componentes de Estados Vacíos (Empty States)**

```javascript
// Funciones para mostrar estados vacíos
function showEmptyState(type) {
  const states = {
    no_conversations: {
      icon: '🎫',
      title: 'Aún no tienes conversaciones',
      subtitle: 'Crea tu primer ticket para empezar.',
      cta: 'Crear Ticket'
    },
    no_messages: {
      icon: '💬', 
      title: 'Nueva conversación',
      subtitle: 'Describe tu problema o comparte contexto para que podamos ayudarte.'
    },
    no_search_results: {
      icon: '🔍',
      title: 'No encontramos coincidencias',
      subtitle: 'Intenta con otros términos o crea un nuevo ticket.'
    }
  };
  
  // Renderizar estado vacío con animación fade-in
  const container = document.getElementById('empty-state');
  const config = states[type];
  
  container.innerHTML = `
    <div class="empty-icon">${config.icon}</div>
    <h3>${config.title}</h3>
    <p>${config.subtitle}</p>
    ${config.cta ? `<button class="primary-btn" onclick="createNewTicket()">${config.cta}</button>` : ''}
  `;
  
  container.style.display = 'flex';
  container.classList.add('fade-in');
}
```

#### **Context Chips en Mensajes**

```javascript
// Renderizar context chips sobre mensajes
function renderContextChip(context) {
  const chips = {
    purchase_id: { icon: '🔗', label: 'Purchase', link: '/purchases/' },
    pick_id: { icon: '🎯', label: 'Pick', link: '/picks/' },
    withdrawal_id: { icon: '💰', label: 'Withdrawal', link: '/withdrawals/' },
    bet_id: { icon: '🏆', label: 'Bet', link: '/bets/' }
  };
  
  const chip = chips[context.type];
  if (!chip) return '';
  
  return `
    <div class="context-chip" onclick="navigateTo('${chip.link}${context.value}')">
      <span class="chip-icon">${chip.icon}</span>
      <span class="chip-text">${chip.label} #${context.value}</span>
    </div>
  `;
}
```

#### **Banner de Políticas con Animación**

```javascript
// Control del banner de políticas
let bannerCollapsed = false;

function togglePolicyBanner() {
  const banner = document.getElementById('policy-banner');
  bannerCollapsed = !bannerCollapsed;
  
  if (bannerCollapsed) {
    banner.classList.add('collapsed');
    document.querySelector('.banner-toggle').textContent = 'Ver políticas';
  } else {
    banner.classList.remove('collapsed');
    document.querySelector('.banner-toggle').textContent = 'Ocultar políticas';
  }
}

function closePolicyBanner() {
  const banner = document.getElementById('policy-banner');
  banner.style.display = 'none';
  localStorage.setItem('policy_banner_closed', 'true');
}

// Mostrar banner solo una vez por conversación
function shouldShowPolicyBanner() {
  return localStorage.getItem('policy_banner_closed') !== 'true';
}
```

#### **Indicador de Actividad (Mock)**

```javascript
// Simular indicador de actividad
const activityMessages = [
  "Admin está revisando tu caso...",
  "Tipster está escribiendo...", 
  "Esperando respuesta del equipo...",
  "Analizando la información..."
];

function showActivityIndicator(duration = 3000) {
  const indicator = document.getElementById('activity-indicator');
  const textElement = document.getElementById('typing-text');
  
  const randomMessage = activityMessages[Math.floor(Math.random() * activityMessages.length)];
  textElement.textContent = randomMessage;
  
  indicator.style.display = 'flex';
  indicator.classList.add('fade-in');
  
  // Ocultar después de la duración especificada
  setTimeout(() => {
    indicator.style.display = 'none';
    indicator.classList.remove('fade-in');
  }, duration);
}

// Activar indicador de forma intermitente
function startActivitySimulation() {
  setInterval(() => {
    if (Math.random() > 0.7) { // 30% de probabilidad
      showActivityIndicator(2500);
    }
  }, 8000); // Cada 8 segundos
}
```

#### **Estilos CSS para Componentes**

```css
/* Variables de diseño */
:root {
  --support-primary: #2563eb;
  --support-secondary: #64748b;
  --support-success: #10b981;
  --support-warning: #f59e0b;
  --support-error: #ef4444;
  --support-bg: #f8fafc;
  --support-border: #e2e8f0;
}

/* Layout principal */
.support-container {
  display: flex;
  height: 100vh;
  background: var(--support-bg);
}

.support-sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid var(--support-border);
  display: flex;
  flex-direction: column;
}

.support-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

/* Estados vacíos */
.empty-state, .empty-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Context chips */
.context-chip {
  display: inline-flex;
  align-items: center;
  background: var(--support-primary);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition: opacity 0.2s;
}

.context-chip:hover {
  opacity: 0.8;
}

/* Banner de políticas */
.policy-banner {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.policy-banner.collapsed {
  height: 0;
  padding: 0;
  overflow: hidden;
  opacity: 0;
}

/* Indicador de actividad */
.activity-indicator {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--support-bg);
  font-style: italic;
  color: var(--support-secondary);
}

.typing-dots {
  animation: typing 1.5s infinite;
}

@keyframes typing {
  0%, 60%, 100% { opacity: 0.3; }
  30% { opacity: 1; }
}

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
```

---

## 5. Estados del Ticket (Admin Support)

### 5.1. Ticket Status Enum

```typescript
enum TicketStatus {
  OPEN = 'open',                    // Recién creado
  IN_PROGRESS = 'in_progress',      // Admin trabajando
  AWAITING_USER = 'awaiting_user',  // Esperando respuesta del usuario
  AWAITING_ADMIN = 'awaiting_admin',// Esperando respuesta del admin
  RESOLVED = 'resolved',            // Admin marcó como resuelto
  CLOSED = 'closed'                 // Cerrado (user o admin después de resolved)
}
```

### 5.2. Transiciones de Estado

```javascript
const STATE_TRANSITIONS = {
  OPEN: ['IN_PROGRESS', 'CLOSED'],
  IN_PROGRESS: ['AWAITING_USER', 'AWAITING_ADMIN', 'RESOLVED', 'CLOSED'],
  AWAITING_USER: ['IN_PROGRESS', 'AWAITING_ADMIN', 'CLOSED'],
  AWAITING_ADMIN: ['IN_PROGRESS', 'AWAITING_USER', 'RESOLVED'],
  RESOLVED: ['CLOSED', 'OPEN'],  // reabrir si usuario no está satisfecho
  CLOSED: []  // terminal
}
```

### 5.3. Reglas Automáticas de Estado

```javascript
// Al enviar mensaje
function updateTicketStatusOnMessage(ticket, sender_role) {
  if (sender_role === 'user' && ticket.status === 'AWAITING_USER') {
    return 'AWAITING_ADMIN'
  }
  
  if (sender_role === 'admin' && ticket.status === 'AWAITING_ADMIN') {
    return 'AWAITING_USER'
  }
  
  return ticket.status  // sin cambios
}

// Auto-cierre
function checkAutoClose(ticket) {
  if (ticket.status === 'RESOLVED') {
    const hoursSinceResolved = (now() - ticket.resolved_at) / (1000 * 60 * 60)
    
    if (hoursSinceResolved >= 72) {  // 72 horas sin actividad
      return 'CLOSED'
    }
  }
  
  return ticket.status
}
```

---

## 6. Categorías (Admin Support)

### 6.1. Ticket Categories

```typescript
enum TicketCategory {
  ACCOUNT_ACCESS = 'account_access',      // Login, 2FA, verificación
  PAYMENTS = 'payments',                  // Compras, órdenes, USDT
  WITHDRAWALS = 'withdrawals',            // Retiros de fondos
  TECHNICAL_BUG = 'technical_bug',        // Bugs de la plataforma
  REPORT_USER = 'report_user',            // Reportar usuario/contenido
  PRODUCT_QUESTION = 'product_question',  // Preguntas sobre features
  OTHER = 'other'                         // Otros casos
}
```

### 6.2. SLA por Categoría

```javascript
const SLA_TARGETS = {
  ACCOUNT_ACCESS: {
    first_response_minutes: 60,      // 1 hora
    resolution_hours: 24,
    priority_multiplier: 1.5         // si es HIGH priority
  },
  
  PAYMENTS: {
    first_response_minutes: 120,     // 2 horas
    resolution_hours: 48,
    priority_multiplier: 2.0
  },
  
  WITHDRAWALS: {
    first_response_minutes: 180,     // 3 horas
    resolution_hours: 72,
    priority_multiplier: 2.0
  },
  
  TECHNICAL_BUG: {
    first_response_minutes: 240,     // 4 horas
    resolution_hours: 120,           // 5 días
    priority_multiplier: 1.0
  },
  
  REPORT_USER: {
    first_response_minutes: 360,     // 6 horas
    resolution_hours: 168,           // 7 días
    priority_multiplier: 1.0
  },
  
  PRODUCT_QUESTION: {
    first_response_minutes: 480,     // 8 horas
    resolution_hours: 72,
    priority_multiplier: 1.0
  },
  
  OTHER: {
    first_response_minutes: 480,     // 8 horas
    resolution_hours: 96,
    priority_multiplier: 1.0
  }
}
```

### 6.3. Auto-Routing por Categoría

```javascript
const CATEGORY_ROUTING = {
  PAYMENTS: {
    auto_fetch_context: ['purchase_id', 'payment_address', 'tx_hash'],
    suggested_macros: ['payment_pending', 'payment_confirmed', 'overpayment'],
    required_fields: ['purchase_id']
  },
  
  WITHDRAWALS: {
    auto_fetch_context: ['withdrawal_id', 'wallet_address', 'amount'],
    suggested_macros: ['withdrawal_processing', 'withdrawal_completed'],
    required_fields: ['withdrawal_id']
  },
  
  REPORT_USER: {
    auto_fetch_context: ['reported_user_id', 'post_id', 'comment_id'],
    notify_team: ['moderation'],
    required_fields: ['reported_user_id', 'reason']
  }
}
```

---

## 7. Roles y Permisos

### 7.1. Role Definitions

```typescript
enum SupportRole {
  USER = 'user',
  ADMIN = 'admin',
  TIPSTER = 'tipster',
  MODERATOR = 'moderator'  // futuro
}
```

### 7.2. Permisos por Rol

```javascript
const ROLE_PERMISSIONS = {
  user: {
    create_ticket: true,
    send_message: true,
    attach_file: true,
    close_own_ticket: true,           // solo si status = RESOLVED
    reopen_ticket: true,              // dentro de 72h
    start_tipster_chat: 'feature_flag',  // según plan
    
    // Forbidden
    change_ticket_status: false,
    assign_ticket: false,
    view_internal_notes: false,
    view_other_users_tickets: false
  },
  
  admin: {
    view_all_tickets: true,
    send_message: true,
    attach_file: true,
    change_ticket_status: true,
    assign_ticket: true,
    add_internal_note: true,
    close_ticket: true,
    escalate_ticket: true,
    view_user_context: true,          // ver purchase_id, wallet, etc.
    use_macros: true,
    
    // Analytics
    view_sla_metrics: true,
    export_tickets: true
  },
  
  tipster: {
    receive_dm: 'if_allowed',         // puede deshabilitar DMs
    send_message: true,
    attach_file: true,
    block_user: true,                 // bloquear usuario específico
    
    // Forbidden
    view_tickets: false,
    change_status: false,
    view_user_sensitive_data: false   // no ve wallet, payment info
  },
  
  moderator: {
    view_reports: true,
    mute_user: true,
    ban_user: true,
    hide_content: true,
    view_moderation_queue: true,
    
    // Limited ticket access
    view_report_tickets: true,
    change_report_status: true
  }
}
```

### 7.3. Feature Flags

```javascript
// Nomenclatura oficial de planes (Store)
const STORE_PLANS = ['FREE', 'BASIC', 'PRO', 'ELITE']

// Tabla única: Plan → Feature Flags (usar nombres del Store)
const SUPPORT_FEATURE_FLAGS = {
  'support:admin_chat': {
    default: true,
    plans: ['FREE', 'BASIC', 'PRO', 'ELITE']
  },
  
  'support:tipster_chat': {
    default: false,
    plans: ['PRO', 'ELITE']  // Tipster Chat disponible en PRO+
  },
  
  'support:file_attachments': {
    default: true,
    plans: ['FREE', 'BASIC', 'PRO', 'ELITE'],
    limits: {
      FREE: { max_files: 1, max_size_mb: 5 },
      BASIC: { max_files: 2, max_size_mb: 5 },
      PRO: { max_files: 3, max_size_mb: 10 },
      ELITE: { max_files: 5, max_size_mb: 20 }
    }
  },
  
  'support:priority_tickets': {
    default: false,
    plans: ['ELITE']
  }
}
```

---

## 8. Mensajes y Adjuntos

### 8.1. Message Types

```typescript
enum MessageType {
  TEXT = 'text',              // Mensaje de texto normal
  SYSTEM = 'system',          // Cambios automáticos de estado
  ATTACHMENT = 'attachment'   // Archivo adjunto
}
```

### 8.2. Attachments

```typescript
interface Attachment {
  attachment_id: string
  filename: string
  mime_type: 'image/png' | 'image/jpeg' | 'application/pdf'
  size_bytes: number
  url: string
  
  // Security
  scanned: boolean
  scan_result?: 'clean' | 'suspicious' | 'malware'
  
  // Metadata
  uploaded_by: string
  uploaded_at: timestamp
}
```

**Attachment Rules:**
```javascript
const ATTACHMENT_RULES = {
  allowed_types: [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf'
  ],
  
  max_size_bytes: 10 * 1024 * 1024,  // 10MB
  
  max_files_per_message: 3,
  
  // Virus scan (MVP: deshabilitado; validamos MIME/size). Futuro: activar y seguir pipeline.
  require_scan: false,
  auto_reject_if_suspicious: true,
  
  // Storage
  expire_after_days: 90,  // archivos se eliminan después de 90 días
  
  // Restrictions
  block_executable: true,
  block_archives: true    // .zip, .rar, etc.
}
```

### 8.3. System Messages

```javascript
const SYSTEM_MESSAGE_TEMPLATES = {
  TICKET_CREATED: {
    es: "Ticket #{ticket_id} creado. Te responderemos pronto.",
    icon: '✅'
  },
  
  TICKET_ASSIGNED: {
    es: "{admin_name} está atendiendo tu ticket.",
    icon: '👤'
  },
  
  STATUS_CHANGED: {
    es: "Estado cambiado a: {new_status}",
    icon: '🔄'
  },
  
  TICKET_RESOLVED: {
    es: "Ticket marcado como resuelto. ¿Te ayudó la respuesta?",
    icon: '✅',
    actions: ['Sí, cerrar', 'No, reabrir']
  },
  
  TICKET_CLOSED: {
    es: "Ticket cerrado. Puedes crear uno nuevo si necesitas más ayuda.",
    icon: '🔒'
  },
  
  AUTO_CLOSED: {
    es: "Ticket cerrado automáticamente por inactividad.",
    icon: '⏱️'
  }
}
```

---

## 9. Anti-spam y Seguridad

### 9.1. Rate Limiting

```javascript
const RATE_LIMITS = {
  messages_per_conversation: {
    window_seconds: 60,
    max_messages: 5,
    penalty: 'cooldown_30s'
  },
  
  new_tickets: {
    window_hours: 24,
    max_tickets: 3,
    penalty: 'block_ticket_creation_24h'
  },
  
  attachments: {
    window_hours: 1,
    max_attachments: 10,
    penalty: 'disable_attachments_1h'
  }
}
```

### 9.2. Content Filtering

```javascript
// Detección de patrones sospechosos
const SUSPICIOUS_PATTERNS = {
  external_payment_requests: [
    /paypal\.com/i,
    /venmo/i,
    /cashapp/i,
    /transferencia/i,
    /cuenta.*banco/i
  ],
  
  threats: [
    /abogado/i,
    /demanda/i,
    /policia/i,
    /amenaz/i
  ],
  
  scam_keywords: [
    /100%.*garant/i,
    /ganar.*seguro/i,
    /dinero.*facil/i,
    /inverti.*ahora/i
  ],
  
  spam: [
    /compra.*curso/i,
    /telegram/i,
    /whatsapp/i,
    /link.*grupo/i
  ]
}

function analyzeMessage(content, conversationType) {
  const flags = []
  
  // Check patterns
  for (const [category, patterns] of Object.entries(SUSPICIOUS_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        flags.push({ category, pattern: pattern.source })
      }
    }
  }
  
  // Check external links
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const urls = content.match(urlRegex) || []
  
  const allowedDomains = ['tradingdeportivo.com']
  const externalUrls = urls.filter(url => {
    return !allowedDomains.some(domain => url.includes(domain))
  })
  
  // Solo marcar enlaces externos en tipster_chat
  if (externalUrls.length > 0 && conversationType === 'tipster_chat') {
    flags.push({ category: 'external_links', urls: externalUrls })
  }
  
  return {
    is_suspicious: flags.length > 0,
    flags: flags,
    risk_score: Math.min(100, flags.length * 25)
  }
}
```

### 9.3. Auto-moderation Actions

```javascript
const AUTO_MODERATION_ACTIONS = {
  // Risk score 25-50: Warning
  warn_user: {
    threshold: 25,
    action: 'show_warning_banner',
    message: "Tu mensaje contiene contenido que podría violar nuestras políticas."
  },
  
  // Risk score 50-75: Block + notify admin
  block_and_flag: {
    threshold: 50,
    action: 'block_message_and_notify_admin',
    message: "Mensaje bloqueado por política de seguridad."
  },
  
  // Risk score 75+: Block + suspend user
  suspend: {
    threshold: 75,
    action: 'suspend_user_support_access',
    duration_hours: 24,
    message: "Acceso al soporte suspendido por 24h por violación de políticas."
  }
}
```

### 9.4. Auditoría Obligatoria

```typescript
interface AuditLog {
  audit_id: string
  event_type: AuditEventType
  
  // Who
  actor_role: SupportRole
  actor_id: string
  
  // What
  target_type: 'ticket' | 'message' | 'conversation' | 'user'
  target_id: string
  
  // Details
  action: string
  old_value?: any
  new_value?: any
  
  // Context
  ip_address?: string
  user_agent?: string
  
  // When
  created_at: timestamp
}

enum AuditEventType {
  TICKET_CREATED = 'ticket_created',
  TICKET_STATUS_CHANGED = 'ticket_status_changed',
  TICKET_ASSIGNED = 'ticket_assigned',
  TICKET_CLOSED = 'ticket_closed',
  
  MESSAGE_SENT = 'message_sent',
  MESSAGE_BLOCKED = 'message_blocked',
  MESSAGE_DELETED = 'message_deleted',
  
  USER_MUTED = 'user_muted',
  USER_SUSPENDED = 'user_suspended',
  USER_BANNED = 'user_banned',
  
  ATTACHMENT_UPLOADED = 'attachment_uploaded',
  ATTACHMENT_SCANNED = 'attachment_scanned'
}
```

---

## 10. Modelos de Datos (MVP)

### 10.1. Conversation

```typescript
interface Conversation {
  conversation_id: string
  type: 'admin_support' | 'tipster_chat'
  
  // Participants
  user_id: string
  tipster_id?: string          // si type = tipster_chat
  assigned_admin_id?: string   // si type = admin_support
  
  // Ticket reference
  ticket_id?: string           // si type = admin_support
  
  // State
  last_message_at: timestamp
  last_message_preview: string
  
  // Unread counts (por participante)
  unread_by: {
    user: number
    admin: number
    tipster: number
  }
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
  
  // Archive
  archived_by_user: boolean
  archived_by_admin: boolean
}
```

### 10.2. SupportTicket

```typescript
interface SupportTicket {
  ticket_id: string
  conversation_id: string
  
  // Owner
  user_id: string
  
  // Classification
  category: TicketCategory
  priority: 'normal' | 'high'
  subject: string
  
  // Status
  status: TicketStatus
  
  // Assignment
  assigned_admin_id?: string
  assigned_at?: timestamp
  
  // SLA
  sla_target_first_response?: timestamp
  sla_target_resolution?: timestamp
  first_response_at?: timestamp
  
  // Resolution
  resolved_at?: timestamp
  resolved_by?: string
  closed_at?: timestamp
  closed_by?: string
  
  // Context (auto-populated si aplica)
  context?: {
    purchase_id?: string
    withdrawal_id?: string
    reported_user_id?: string
    reported_post_id?: string
    reported_comment_id?: string
  }
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
}
```

### 10.3. Message

```typescript
interface Message {
  message_id: string
  conversation_id: string
  
  // Sender
  sender_role: 'user' | 'admin' | 'tipster' | 'system'
  sender_id?: string  // null si system
  
  // Content
  type: MessageType
  content?: string
  
  // Attachments
  attachments?: Attachment[]
  
  // Context reference (opcional)
  context_reference?: {
    type: 'pick' | 'post' | 'purchase' | 'withdrawal'
    id: string
    preview?: string
  }
  
  // Security
  flagged: boolean
  flag_reason?: string
  blocked: boolean
  
  // Read tracking
  read_by_user?: timestamp
  read_by_admin?: timestamp
  read_by_tipster?: timestamp
  
  // Metadata
  created_at: timestamp
  edited_at?: timestamp
  deleted_at?: timestamp
}
```

### 10.4. InternalNote

```typescript
interface InternalNote {
  note_id: string
  ticket_id: string
  
  // Author
  admin_id: string
  
  // Content
  content: string
  
  // Visibility
  visible_to_roles: SupportRole[]  // default: ['admin', 'moderator']
  
  // Metadata
  created_at: timestamp
  updated_at?: timestamp
}
```

---

## 11. API Endpoints (MVP)

### 11.1. Inbox

```typescript
// List conversations
GET /support/conversations
Query: {
  type?: 'admin_support' | 'tipster_chat'
  status?: TicketStatus
  unread_only?: boolean
  limit?: number
  cursor?: string
}

Response: {
  conversations: Conversation[]
  has_more: boolean
  next_cursor?: string
}

// Get conversation details
GET /support/conversations/:conversation_id
Response: {
  conversation: Conversation
  ticket?: SupportTicket
  participant?: PublicProfile  // si tipster_chat
}
```

### 11.2. Tickets

```typescript
// Create ticket
POST /support/tickets
Body: {
  category: TicketCategory
  priority?: 'normal' | 'high'
  subject: string
  description: string
  attachments?: File[]
  context?: {
    purchase_id?: string
    withdrawal_id?: string
    reported_user_id?: string
  }
}

Response: {
  ticket_id: string
  conversation_id: string
}

// Update ticket status (admin only)
PATCH /support/tickets/:ticket_id/status
Body: {
  new_status: TicketStatus
  internal_note?: string
}

Response: {
  success: boolean
}

// Close ticket (user or admin)
POST /support/tickets/:ticket_id/close
Body: {
  reason?: string
  satisfied?: boolean  // user feedback
}

Response: {
  success: boolean
}

// Reopen ticket (user)
POST /support/tickets/:ticket_id/reopen
Body: {
  reason: string
}

Response: {
  success: boolean
}
```

### 11.3. Messages

```typescript
// Get messages
GET /support/conversations/:conversation_id/messages
Query: {
  limit?: number
  cursor?: string
  order?: 'asc' | 'desc'
}

Response: {
  messages: Message[]
  has_more: boolean
  next_cursor?: string
}

// Send message
POST /support/conversations/:conversation_id/messages
Body: {
  type: 'text' | 'attachment'
  content?: string
  attachment?: File
  context_reference?: {
    type: 'pick' | 'post'
    id: string
  }
}

Response: {
  message_id: string
  created_at: timestamp
}

// Mark as read
POST /support/conversations/:conversation_id/read
Body: {
  last_read_message_id: string
}

Response: {
  success: boolean
  unread_count: number
}
```

### 11.4. Tipster Chat

```typescript
// Start tipster chat
POST /support/tipsters/:tipster_id/chat
Body: {
  initial_message: string
  context_reference?: {
    pick_id?: string
    post_id?: string
  }
}

Response: {
  conversation_id: string
  allowed: boolean
  reason?: string  // si !allowed
}

// Block/unblock user (tipster only)
POST /support/tipsters/block/:user_id
Response: {
  success: boolean
}
```

### 11.5. Admin Actions

```typescript
// Assign ticket
POST /support/tickets/:ticket_id/assign
Body: {
  admin_id: string
}

Response: {
  success: boolean
}

// Add internal note
POST /support/tickets/:ticket_id/notes
Body: {
  content: string
  visible_to_roles?: SupportRole[]
}

Response: {
  note_id: string
}

// Get ticket stats (admin analytics)
GET /support/stats
Query: {
  period: '7d' | '30d' | '90d'
  group_by?: 'category' | 'status' | 'admin'
}

Response: {
  stats: {
    total_tickets: number
    open_tickets: number
    avg_first_response_minutes: number
    avg_resolution_hours: number
    by_category?: { [key: string]: number }
  }
}
```

### 11.6. Notifications (MVP)

```typescript
// Contrato mínimo de eventos de notificación
interface NotificationEvent {
  id: string
  type: 'MESSAGE_CREATED' | 'TICKET_ASSIGNED' | 'TICKET_STATUS_CHANGED' | 'TICKET_RESOLVED' | 'TIPSTER_REPLIED'
  actor_id: string         // quién generó el evento
  recipient_id: string     // quién debe ser notificado
  entity: {                // contexto
    type: 'ticket' | 'conversation' | 'message'
    id: string
  }
  created_at: timestamp
}

// Regla de unread_count por rol
// - admin_support: incrementa cuando hay mensaje del usuario; se resetea al abrir/leer
// - tipster_chat: incrementa cuando hay mensaje de la otra parte; mensajes en shadow_mute NO incrementan
```

### 11.7. Moderation (MVP)

```typescript
// Ocultar o borrar mensaje
POST /support/messages/:message_id/moderate
Body: {
  action: 'hide' | 'delete'
  reason?: string
}
Response: { success: boolean }
// Permisos: moderator | admin

// Shadow mute en tipster chat
POST /support/conversations/:conversation_id/mute
Body: {
  type: 'shadow' | 'hard'
  duration_minutes?: number
}
Response: { success: boolean }
// Permisos: moderator | admin

// Bloquear usuario en conversación admin_support
POST /support/admin_support/:conversation_id/block_user
Response: { success: boolean }
// Permisos: admin
```

### 11.8. Search & FAQ (MVP)

```typescript
// Búsqueda mínima antes de crear ticket
GET /support/search?q=
Query: { q: string }
Response: {
  tickets: { ticket_id: string, subject: string, description_snippet: string }[]
  knowledge_base: { id: string, title: string, slug: string, snippet: string, tags: string[] }[]
}

// Placeholder de modelo KB
interface KnowledgeBaseItem {
  id: string
  title: string
  slug: string
  tags: string[]
  content: string
  updated_at: timestamp
}
```

---

## 12. Integraciones con Otros Módulos

### 12.1. Store

**Payment Issues:**
```javascript
// Auto-populate context
if (ticket.category === 'PAYMENTS' && purchase_id) {
  const purchase = await getPurchase(purchase_id)
  
  ticket.context = {
    purchase_id: purchase.id,
    amount_usdt: purchase.amount_usdt,
    payment_address: purchase.payment_address,
    status: purchase.status,
    created_at: purchase.created_at
  }
  
  // Quick actions para admin
  ticket.suggested_actions = [
    'verify_payment',
    'refund_overpayment',
    'cancel_order'
  ]
}
```

### 12.2. Withdrawals

**Withdrawal Support:**
```javascript
// Link withdrawal
if (ticket.category === 'WITHDRAWALS' && withdrawal_id) {
  const withdrawal = await getWithdrawal(withdrawal_id)
  
  ticket.context = {
    withdrawal_id: withdrawal.id,
    amount: withdrawal.amount,
    wallet_address: withdrawal.wallet_address,
    status: withdrawal.status,
    tx_hash: withdrawal.tx_hash
  }
}
```

### 12.3. Community

**User Reports:**
```javascript
// Create report ticket
async function reportUser(reporter_id, reported_user_id, reason, post_id?) {
  const ticket = await createTicket({
    user_id: reporter_id,
    category: 'REPORT_USER',
    subject: `Reporte de usuario ${reported_user_id}`,
    description: reason,
    context: {
      reported_user_id,
      reported_post_id: post_id
    }
  })
  
  // Notify moderation team
  await notifyModerationTeam(ticket)
  
  return ticket
}
```

### 12.4. Watchlist

**Pick Context:**
```javascript
// Reference pick in tipster chat
if (message.context_reference?.type === 'pick') {
  const pick = await getPick(message.context_reference.id)
  
  message.context_preview = {
    pick_id: pick.id,
    match: `${pick.home_team} vs ${pick.away_team}`,
    market: pick.market,
    selection: pick.selection,
    odds: pick.odds,
    status: pick.status
  }
}
```

### 12.5. Risk Guard

**Support Durante Lock:**
```javascript
// User can still access support even if LOCKED
function canAccessSupport(user_id) {
  const riskState = getRiskState(user_id)
  
  // Support ALWAYS accessible
  if (riskState.status === 'LOCKED') {
    // Show banner in support UI
    return {
      allowed: true,
      banner: {
        type: 'info',
        message: 'Tu cuenta está en pausa por Risk Guard, pero el soporte sigue disponible.'
      }
    }
  }
  
  return { allowed: true }
}
```

---

## 13. Métricas Internas (Admin Dashboard)

### 13.1. Performance Metrics

```typescript
interface SupportMetrics {
  period: {
    start: timestamp
    end: timestamp
  }
  
  // Volume
  total_tickets: number
  tickets_by_category: { [key in TicketCategory]: number }
  tickets_by_status: { [key in TicketStatus]: number }
  
  // Response times
  avg_first_response_minutes: number
  median_first_response_minutes: number
  p95_first_response_minutes: number
  
  // Resolution
  avg_resolution_hours: number
  resolution_rate: number  // % resolved within SLA
  
  // By admin
  tickets_per_admin: { admin_id: string, count: number }[]
  
  // Quality
  satisfaction_rate?: number  // % de usuarios satisfechos
  reopen_rate: number  // % de tickets reabiertos
  
  // Tipster support
  tipster_chats_initiated: number
  avg_messages_per_chat: number
}
```

### 13.2. Quality Metrics

```javascript
const QUALITY_INDICATORS = {
  // Red flags
  high_reopen_rate: '>15%',
  low_satisfaction: '<80%',
  missed_sla: '>20%',
  
  // Green flags
  fast_response: '<30min avg',
  high_resolution_rate: '>95%',
  low_escalation: '<5%'
}
```

### 13.3. Tipster Rating

```javascript
// Rating de calidad de soporte de tipsters
interface TipsterSupportRating {
  tipster_id: string
  
  // Engagement
  total_chats: number
  avg_response_time_minutes: number
  
  // Quality
  helpful_reactions: number  // usuarios marcaron como útil
  avg_messages_per_chat: number
  
  // Issues
  reports_received: number
  blocked_users: number
  
  // Score (0-100)
  support_quality_score: number
}
```

---

## 14. UX Copy (Disclaimers)

### 14.1. Support Page Header

```
🛟 Centro de Soporte

Estamos aquí para ayudarte con:
• Problemas de cuenta y pagos
• Dudas técnicas
• Consultas sobre picks (Plan Pro+)

⏱️ Respondemos en orden de llegada
🔒 No compartas claves ni datos sensibles
```

### 14.2. Tipster Chat Disclaimer

```
💬 Chat con Tipster

Los tipsters comparten su análisis y metodología, pero:
⚠️ NO garantizan resultados
⚠️ El trading implica riesgo
⚠️ Toda decisión es tu responsabilidad

Este chat es educativo, no asesoría financiera.
```

### 14.3. New Ticket Form

```
Antes de crear un ticket:

✅ Revisa las FAQ
✅ Busca en tickets anteriores
✅ Describe el problema claramente

📎 Puedes adjuntar capturas de pantalla
🕐 Respuesta estimada: 2-4 horas
```

---

## 15. Roadmap

### Fase 1 (MVP) ✅
- [x] Inbox con filtros
- [x] Admin Support tickets
- [x] Tipster Chat (feature flag)
- [x] Message composer + attachments
- [x] Estados de ticket
- [x] Categorías
- [x] Rate limiting básico
- [x] System messages
- [x] Auditoría de eventos críticos

### Fase 2
- [ ] Internal notes (admin) — endpoints listos en 11.5; UI pendiente
- [ ] Ticket assignment workflow — endpoint listo en 11.5; UI + reglas avanzadas pendientes
- [ ] SLA tracking real
- [ ] Macros y quick replies
- [ ] Satisfaction surveys
- [ ] Admin analytics dashboard

### Fase 3
- [ ] WebSocket real-time
- [ ] Rich media support (videos)
- [ ] AI-assisted responses
- [ ] Sentiment analysis
- [ ] Smart routing por skill
- [ ] Knowledge base integration

---

## 16. Mejoras Adicionales (Sin Salir de Contexto)

### 16.1. Smart Ticket Routing

```javascript
// Routing inteligente basado en contexto
function smartRouteTicket(ticket) {
  const routing = {
    admin_id: null,
    priority_boost: 0,
    suggested_macros: []
  }
  
  // High-value users
  const userPlan = getUserPlan(ticket.user_id)
  if (userPlan === 'ELITE') {
    routing.priority_boost = 1
    routing.admin_id = getEliteAccountManager()
  }
  
  // Repeat issues
  const recentTickets = getRecentTickets(ticket.user_id, { days: 7 })
  if (recentTickets.length > 2) {
    routing.priority_boost = 1
    routing.escalate = true
  }
  
  // Category expertise
  if (ticket.category === 'PAYMENTS') {
    routing.admin_id = getAdminBySkill('payments')
  }
  
  return routing
}
```

### 16.2. Ticket Templates

```javascript
const TICKET_TEMPLATES = {
  payment_not_received: {
    category: 'PAYMENTS',
    subject: 'Pago no acreditado',
    prefill_fields: {
      purchase_id: true,
      tx_hash: true,
      amount: true
    },
    required_attachments: ['transaction_proof']
  },
  
  withdrawal_delayed: {
    category: 'WITHDRAWALS',
    subject: 'Retiro demorado',
    prefill_fields: {
      withdrawal_id: true,
      wallet_address: true
    }
  },
  
  account_locked: {
    category: 'ACCOUNT_ACCESS',
    subject: 'No puedo acceder a mi cuenta',
    quick_diagnostics: [
      '¿Olvidaste tu contraseña?',
      '¿Problema con 2FA?',
      '¿Cuenta suspendida?'
    ]
  }
}
```

### 16.3. Canned Responses (Macros)

```javascript
const CANNED_RESPONSES = {
  payment_pending: {
    es: `Hemos revisado tu pago. Estado actual:
    
• Transaction Hash: {tx_hash}
• Confirmaciones: {confirmations}/5
• Estado: Pendiente

El pago se acreditará automáticamente al alcanzar 5 confirmaciones (aprox. {estimated_minutes} minutos).`,
    
    requires_context: ['tx_hash', 'confirmations', 'estimated_minutes']
  },
  
  payment_confirmed: {
    es: `✅ Pago confirmado y acreditado

• Monto: {amount} USDT
• Producto: {product_name}
• Transaction: {tx_hash}

Ya puedes acceder a tu compra.`,
    
    requires_context: ['amount', 'product_name', 'tx_hash']
  },
  
  bug_investigating: {
    es: `Gracias por reportar este bug. 

Nuestro equipo técnico está investigando. Te actualizaremos en las próximas 24-48 horas.

Mientras tanto, ¿puedes confirmar:
• Navegador y versión
• Sistema operativo
• ¿El problema persiste?`
  }
}
```

### 16.4. Contextual Help

```javascript
// Mostrar ayuda contextual basada en la página
function getContextualHelpTopics(current_page) {
  const help_map = {
    '/store/purchase': [
      'Cómo pagar con USDT',
      'Problemas con transacción',
      'Cuánto tarda la confirmación'
    ],
    
    '/community/leaderboard': [
      'Cómo funciona el Community Score',
      'Requisitos para aparecer en ranking',
      'Cómo seguir a traders'
    ],
    
    '/watchlist': [
      'Cómo agregar un pick',
      'Diferencia entre pick público y privado',
      'Cómo compartir análisis'
    ]
  }
  
  return help_map[current_page] || []
}
```

### 16.5. Satisfaction Survey

```javascript
// Survey post-resolución
interface SatisfactionSurvey {
  ticket_id: string
  
  // Rating
  satisfied: boolean
  rating: 1 | 2 | 3 | 4 | 5
  
  // Feedback
  what_went_well?: string
  what_could_improve?: string
  
  // Follow-up
  willing_to_be_contacted?: boolean
  
  submitted_at: timestamp
}

// Triggered al cerrar ticket RESOLVED
async function triggerSatisfactionSurvey(ticket_id) {
  const ticket = await getTicket(ticket_id)
  
  if (ticket.status === 'CLOSED' && ticket.resolved_at) {
    await sendSurveyEmail(ticket.user_id, {
      ticket_id,
      subject: ticket.subject,
      survey_url: generateSurveyUrl(ticket_id)
    })
  }
}
```

### 16.6. Escalation Rules

```javascript
const ESCALATION_RULES = {
  // Auto-escalate
  sla_breach_critical: {
    condition: 'first_response > 2x SLA',
    action: 'assign_to_senior_admin',
    notify: ['admin_manager']
  },
  
  high_priority_unassigned: {
    condition: 'priority = HIGH && unassigned > 30min',
    action: 'notify_all_available_admins'
  },
  
  repeated_issue: {
    condition: 'user_tickets_last_7d > 3',
    action: 'escalate_to_account_manager'
  },
  
  enterprise_user: {
    condition: 'user_plan = ENTERPRISE',
    action: 'route_to_dedicated_support'
  }
}
```

---

## 17. Referencias

- **Store**: store.md (Payments, Purchases)
- **Community**: community.md (User Reports, Moderation)
- **Watchlist**: watchlist.md (Pick Context)
- **Risk Guard**: risk-guard.md (User Status)

---

**Versión:** 1.0  
**Última actualización:** 2026-02-08  
**Autor:** Sistema Trader Deportivo  
**Estado:** Documentación Oficial



# SUPPORT-ADMIN.md
> **📋 Extensión Core:** Este módulo extiende el [SUPPORT-CONTRACT.md](../SUPPORT-CONTRACT.md) agregando campos administrativos y permisos específicos para operaciones de soporte.

## Módulo de Soporte para Administración de Suscripciones

### 📋 Objetivo
Documentación técnica para el equipo de soporte sobre el manejo de tickets relacionados con suscripciones, pagos y límites.

## 📋 Interfaces TypeScript

### Interfaces Principales

```typescript
// Información general del módulo
interface AdminSupportModule {
  module: 'admin-support';
  role: 'admin' | 'support_level_1' | 'support_level_2';
  route: '/admin/support';
  visualAccent: 'blue-admin';
  keyPrinciple: 'Gestión de tickets de soporte y resolución de incidencias';
}

// Header del panel
interface AdminSupportHeader {
  title: string; // "Gestión de Soporte"
  subtitle: string; // "Tickets, incidencias y resolución de problemas"
  search: {
    placeholder: string;
    enabled: boolean;
    filters: Array<'ticket_id' | 'user_email' | 'subscription_id' | 'order_id'>;
  };
  quickActions: Array<{
    icon: string;
    label: string;
    action: 'new_ticket' | 'export_tickets' | 'refresh_list' | 'bulk_assign';
    variant?: 'primary' | 'secondary' | 'danger';
    permission: 'admin' | 'level_1' | 'level_2';
  }>;
}

// Layout principal
interface AdminSupportLayout {
  sidebar: 'admin-sidebar';
  kpis: SupportKPIs;
  mainContent: {
    tabs: SupportTabsConfig;
    activeTab: string;
    viewMode: 'list' | 'kanban' | 'calendar';
  };
  filters: SupportFilters;
  userPermissions: SupportPermissions;
}

// KPIs principales
interface SupportKPIs {
  totalTickets: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
    description: string;
  };
  openTickets: {
    value: number;
    urgent: boolean;
    description: string;
  };
  avgResolutionTime: {
    value: number;
    unit: 'hours' | 'days';
    target: number;
    description: string;
  };
  customerSatisfaction: {
    value: number;
    percentage: number;
    target: number;
    description: string;
  };
  slaCompliance: {
    value: number;
    percentage: number;
    target: number;
    description: string;
  };
  escalatedTickets: {
    value: number;
    pending: boolean;
    description: string;
  };
}

// Configuración de tabs
interface SupportTabsConfig {
  all_tickets: {
    label: 'Todos los Tickets';
    icon: '🎫';
    description: 'Vista general de todos los tickets del sistema';
    count?: number;
    columns: TicketTableColumn[];
  };
  open: {
    label: 'Abiertos';
    icon: '🔓';
    description: 'Tickets pendientes de resolución';
    count?: number;
    columns: TicketTableColumn[];
  };
  in_progress: {
    label: 'En Proceso';
    icon: '⚙️';
    description: 'Tickets siendo atendidos';
    count?: number;
    columns: TicketTableColumn[];
  };
  pending_user: {
    label: 'Pendiente Usuario';
    icon: '👤';
    description: 'Esperando respuesta del usuario';
    count?: number;
    columns: TicketTableColumn[];
  };
  resolved: {
    label: 'Resueltos';
    icon: '✅';
    description: 'Tickets resueltos recientemente';
    count?: number;
    columns: TicketTableColumn[];
  };
  escalated: {
    label: 'Escalados';
    icon: '📈';
    description: 'Tickets escalados a niveles superiores';
    count?: number;
    columns: TicketTableColumn[];
  };
}
```

### Interfaces de Filtros y Permisos

```typescript
// Filtros avanzados
interface SupportFilters {
  search: string;
  status: 'all' | 'open' | 'pending_user' | 'pending_finance' | 'pending_dev' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  priority: 'all' | 'P1_critical' | 'P2_important' | 'P3_standard';
  category: string[];
  assignedTo: string[];
  source: 'all' | 'email' | 'telegram' | 'chat' | 'web';
  dateRange: {
    createdFrom?: string;
    createdTo?: string;
    updatedFrom?: string;
    updatedTo?: string;
  };
  tags: string[];
  hasSubscription: boolean;
  hasPayment: boolean;
  slaStatus: 'all' | 'within_sla' | 'approaching_sla' | 'breached_sla';
}

// Permisos por nivel de soporte
interface SupportPermissions {
  level1: {
    viewTickets: boolean;
    updateTickets: boolean;
    assignTickets: boolean;
    viewBasicUserInfo: boolean;
    viewSubscriptionStatus: boolean;
    createNotes: boolean;
    escalateTickets: boolean;
  };
  level2: {
    viewAllTickets: boolean;
    updateAnyTicket: boolean;
    changePriority: boolean;
    viewDetailedUserInfo: boolean;
    viewPaymentHistory: boolean;
    processRefunds: boolean;
    adjustLimits: boolean;
    manageSubscriptions: boolean;
    viewAnalytics: boolean;
  };
  admin: {
    fullAccess: boolean;
    deleteTickets: boolean;
    changeOwnership: boolean;
    viewSystemLogs: boolean;
    manageSupportUsers: boolean;
    configureSLA: boolean;
    viewReports: boolean;
    bulkOperations: boolean;
  };
}

// Columnas de tabla
interface TicketTableColumn {
  key: string;
  label: string;
  sortable: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any, row: SupportTicket) => string;
  component?: React.ComponentType<{ value: any; row: SupportTicket }>;
  permission?: 'all' | 'level2' | 'admin';
}

// SLA Framework para vista admin
interface AdminSLAFramework {
  P1_critical: {
    adminSLA: string; // "2 horas máximo"
    userSLA: string; // "Estamos trabajando urgentemente"
    escalationTime: string; // "30 minutos"
    businessHours: boolean;
  };
  P2_important: {
    adminSLA: string; // "8 horas máximo"
    userSLA: string; // "Estamos revisando su caso"
    escalationTime: string; // "2 horas"
    businessHours: boolean;
  };
  P3_standard: {
    adminSLA: string; // "24 horas máximo"
    userSLA: string; // "Le responderemos pronto"
    escalationTime: string; // "8 horas"
    businessHours: boolean;
  };
}
```

### Interfaces de Componentes

```typescript
// Componente de tabla de tickets
interface TicketsTable {
  data: SupportTicket[];
  columns: TicketTableColumn[];
  loading: boolean;
  pagination: {
    current: number;
    total: number;
    pageSize: number;
    showSizeChanger: boolean;
    pageSizeOptions: number[];
  };
  sortConfig?: {
    field: string;
    order: 'ASC' | 'DESC';
  };
  selection: {
    enabled: boolean;
    selectedRowKeys: string[];
    onChange: (keys: string[]) => void;
  };
  viewMode: 'list' | 'kanban' | 'calendar';
  bulkActions: Array<{
    key: string;
    label: string;
    action: () => void;
    permission: 'level1' | 'level2' | 'admin';
    confirm?: boolean;
  }>;
}

// Componente de detalle de ticket (Drawer)
interface TicketDetailDrawer {
  ticket: SupportTicket;
  activeTab: 'overview' | 'conversation' | 'user_info' | 'subscription' | 'payments' | 'timeline' | 'actions';
  tabs: Array<{
    key: string;
    label: string;
    content: React.Component;
    badge?: number;
    permission?: 'all' | 'level2' | 'admin';
  }>;
  actions: Array<{
    key: string;
    label: string;
    variant: 'primary' | 'secondary' | 'danger';
    permission: 'level1' | 'level2' | 'admin';
    confirm?: boolean;
    requireReason?: boolean;
  }>;
  slaStatus: {
    status: 'OK' | 'risk' | 'breach';
    timeRemaining: string;
    deadline: string;
  };
}

// Componente de vista Kanban
interface SupportKanban {
  columns: Array<{
    id: string;
    title: string;
    status: string;
    tickets: SupportTicket[];
    count: number;
    color: string;
  }>;
  onCardMove: (ticketId: string, newStatus: string) => void;
  onCardAssign: (ticketId: string, assigneeId: string) => void;
  quickActions: Array<{
    icon: string;
    label: string;
    action: (ticketId: string) => void;
  }>;
}

// Componente de respuesta rápida
interface QuickResponsePanel {
  templates: Array<{
    id: string;
    name: string;
    category: string;
    content: string;
    variables: string[];
    language: 'es' | 'en';
    permission: 'level1' | 'level2' | 'admin';
  }>;
  categories: string[];
  search: boolean;
  preview: boolean;
  insertVariable: (variable: string) => void;
}
```

### Tipos Auxiliares

```typescript
// Estado de ticket
type TicketStatus = 'open' | 'pending_user' | 'pending_finance' | 'pending_dev' | 'in_progress' | 'resolved' | 'closed' | 'escalated';

// Prioridad de ticket
type TicketPriority = 'P1_critical' | 'P2_important' | 'P3_standard';

// Categoría de ticket
type TicketCategory = 'subscription' | 'payment' | 'technical' | 'account' | 'trading' | 'general';

// Fuente de ticket
type TicketSource = 'email' | 'telegram' | 'chat' | 'web' | 'phone';

// Nivel de soporte
type SupportLevel = 'level1' | 'level2' | 'admin';

// SLA status
type SLAStatus = 'OK' | 'risk' | 'breach';

// Tipo de acción
type TicketAction = 'reply' | 'assign' | 'change_status' | 'change_priority' | 'escalate' | 'close' | 'merge' | 'split';

// Tipo de notificación
type NotificationType = 'sla_warning' | 'escalation' | 'assignment' | 'resolution' | 'feedback';
```

---

## 1) Filosofía y Principios

### 1.0) Modelo de Datos del Ticket (Extensión Core)

> **📋 Extensión:** Este esquema extiende el `SupportTicket` del [SUPPORT-CONTRACT.md](../SUPPORT-CONTRACT.md) agregando campos administrativos específicos.

```javascript
const SUPPORT_TICKET_SCHEMA = {
  // Campos del core (SUPPORT-CONTRACT)
  ticketId: "string (UUID)",           // Identificador único del ticket
  conversation_id: "string (UUID)",   // Referencia al Conversation del core
  user_id: "string (obligatorio)",       // Usuario afectado
  category: "enum",                   // Mapea a TicketCategory del contrato
  status: "enum",                       // Mapea a TicketStatus del contrato (ver tabla abajo)
  priority: "enum",                     // Mapea a TicketPriority del contrato
  created_at: "timestamp",
  updated_at: "timestamp",
  resolved_at: "timestamp (opcional)",
  
  // Extensiones administrativas
  subscriptionId: "string (opcional)", // ID de suscripción relacionada
  assignedTo: "string (adminId)",       // Responsable actual
  source: "enum",                       // email/telegram/chat/web
  tags: "string[]",                     // duplicated-charge, webhook-delay, etc.
  relatedIds: {
    orderId: "string (opcional)",
    invoiceId: "string (opcional)", 
    idempotencyKey: "string (opcional)",
    creditTxId: "string (opcional)"
  }
}

// Mapeo de estados Admin → Core
const STATUS_MAPPING = {
  "open": "OPEN",                    // Ticket nuevo sin asignar
  "pending_user": "AWAITING_USER",   // Esperando respuesta del usuario
  "pending_finance": "IN_PROGRESS",  // Revisión financiera (tag=finance)
  "pending_dev": "IN_PROGRESS",        // Desarrollo técnico (tag=dev)
  "pending": "IN_PROGRESS",           // En proceso general
  "resolved": "RESOLVED",             // Resuelto, esperando cierre
  "closed": "CLOSED"                  // Ticket cerrado definitivamente
}
```

### 1.1) Principios Core

**Transparencia sin promesas:**
- ✅ Proporcionar información clara sobre estados y procesos
- ✅ Explicar razones de decisiones técnicas
- ❌ Garantizar resultados específicos
- ❌ Prometer tiempos de resolución absolutos

**Seguridad y compliance:**
- ✅ Logs completos de todas las acciones
- ✅ Auditoría de cambios en suscripciones
- ✅ Protección de datos sensibles
- ✅ Cumplimiento de normativas de pagos

**Límites estrictos:**
- ❌ No procesar pagos externos a la plataforma
- ❌ No modificar datos sin justificación técnica
- ❌ No compartir información de usuarios sin autorización
- ❌ No bypassar controles de seguridad

### 1.2) SLA Interno vs Comunicación al Usuario

> **📋 Basado en:** [SUPPORT-CONTRACT.md](../SUPPORT-CONTRACT.md) - SLA Framework para vistas admin

**SLA INTERNO (equipo de soporte):**
```javascript
// Mapea a SLAFramework del contrato - vista admin (tiempos exactos)
const INTERNAL_SLA = {
  P1_critical: "2 horas máximo",     // SLAFramework[P1].adminSLA
  P2_important: "8 horas máximo",    // SLAFramework[P2].adminSLA  
  P3_standard: "24 horas máximo"     // SLAFramework[P3].adminSLA
}

const SLA_BY_SUPPORT_LEVEL = {
  level_1: {
    standard: "24h",   // P3
    priority: "8h",    // P2
    critical: "2h"     // P1
  },
  level_2: {
    fraud_finance: "4h",  // P2 especializado
    technical: "2h",      // P1 técnico
    escalated: "1h"      // P1 escalado
  },
  admin: {
    critical_wallet_blocked: "1h",  // P1 crítico
    legal_compliance: "30min",        // P1 emergencia
    system_emergency: "15min"         // P1 sistema
  }
}

// Vista usuario (indicador visual según contrato)
const USER_SLA_INDICATOR = {
  OK: "green",      // Dentro del SLA
  risk: "yellow",   // Cerca del límite
  breach: "red"     // Fuera del SLA
}
```

### 1.3) Disclaimer Obligatorio

```javascript
const SUPPORT_ADMIN_DISCLAIMERS = {
  subscription_support: {
    es: "El soporte técnico no garantiza tiempos de resolución específicos. Los reembolsos están sujetos a políticas de la plataforma y análisis de caso por caso.",
    en: "Technical support does not guarantee specific resolution times. Refunds are subject to platform policies and case-by-case analysis."
  },
  payment_support: {
    es: "Los pagos y suscripciones están sujetos a verificación de terceros. No procesamos pagos externos ni garantizamos activación inmediata.",
    en: "Payments and subscriptions are subject to third-party verification. We do not process external payments nor guarantee immediate activation."
  }
}
```

---

## 🎯 Tipos de Tickets Comunes

### 2.1) Problemas de Activación
**Síntomas:**
- Usuario no puede acceder a funciones premium después del pago
- Suscripción muestra estado "pendiente" tras horas del pago
- Error "No tienes acceso" en módulos premium

**Diagnóstico:**
1. Verificar `PaymentStatus` en drawer → Payments
2. Confirmar `SubscriptionStatus` en información general
3. Revisar `OrderId/InvoiceId` en sistema de pagos externo
4. Validar `idempotencyKey` para evitar duplicados

**Solución:**
- Si `PaymentStatus` = "failed": Reconciliar pago o solicitar nuevo intento
- Si `PaymentStatus` = "pending": Verificar con Finance o esperar webhook
- Si `SubscriptionStatus` = "inactive": Activar manualmente desde drawer

### 2.2) Fallos de Pago
**Síntomas:**
- Cargo en tarjeta pero sin activación
- Error de pago recurrente
- Múltiples intentos fallidos

**Diagnóstico:**
1. Buscar `OrderId` en drawer → Payments
2. Verificar estado en gateway de pago externo
3. Revisar logs de `idempotencyKey` para duplicados
4. Confirmar límite de intentos en configuración

**Solución:**
- Usar botón "Reconciliar" en drawer → Payments
- Ajustar fecha de renovación si es necesario
- Escalar a Finance si el problema persiste

### 2.3) Upgrade No Aplicado
**Síntomas:**
- Usuario pagó upgrade pero mantiene plan antiguo
- Funciones nuevas no disponibles
- Límites no actualizados

**Diagnóstico:**
1. Verificar timeline de cambios en drawer → Timeline
2. Confirmar `Plan` actual vs plan esperado
3. Revisar `Adjustments` en tabla principal
4. Validar límites en drawer → Limits/Usage

**Solución:**
- Usar "Cambiar Plan" desde drawer → Acciones Rápidas
- Ajustar límites manualmente si es necesario
- Documentar en timeline el cambio

### 2.4) Límite de Tipsters Alcanzado
**Síntomas:**
- "No puedes seguir más tipsters"
- Error al intentar seguir nuevos tipsters
- Mensaje de límite excedido

**Diagnóstico:**
1. Verificar tabla "Tipsters Usage" en Overview
2. Confirmar `Follow.limit` vs `Followings Actuales`
3. Revisar plan actual y límites asociados
4. Validar fecha de último reset (00:00 UTC)

**Solución:**
- Sugerir upgrade automático con botón "Sugerir Upgrade"
- Ajustar límite temporal desde "Ajustar Límite"
- Explicar política de reset diario

### 2.5) Catálogo de Severidades y Triggers

> **📋 Basado en:** [SUPPORT-CONTRACT.md](../SUPPORT-CONTRACT.md) - TicketPriority enum (P1, P2, P3)

**P1 - CRÍTICO (Resolver en < 2h):**
```javascript
// Mapea a TicketPriority.P1 del contrato
const P1_TRIGGERS = [
  "pago confirmado y acceso bloqueado",
  "doble cobro verificado", 
  "cargos no autorizados",
  "suscripción activa sin acceso premium",
  "error de sistema masivo"
]
```

**P2 - IMPORTANTE (Resolver en < 8h):**
```javascript
// Mapea a TicketPriority.P2 del contrato
const P2_TRIGGERS = [
  "upgrade no aplicado",
  "renovación fallida",
  "límite incorrecto aplicado",
  "discrepancia en fechas de suscripción",
  "problema de pago no crítico"
]
```

**P3 - ESTÁNDAR (Resolver en < 24h):**
```javascript
// Mapea a TicketPriority.P3 del contrato
const P3_TRIGGERS = [
  "dudas sobre límites",
  "cambios menores de plan",
  "consultas sobre facturación",
  "información general de suscripción",
  "ajustes no urgentes"
]
```

### 2.7) Interacciones con Tipsters (Casos Específicos)

**CASOS COMUNES CON TIPSTERS:**

**A) "Compré tipster prediction y no aparece"**
```javascript
const TIPSTER_PREDICTION_ISSUE = {
  diagnosis: [
    "Verificar subscription.status === 'active'",
    "Confirmar plan incluye 'tipster-predictions' feature",
    "Validar tipsterId en user.followings[]",
    "Revisar créditos si aplica (plan por uso)"
  ],
  actions: [
    "Si créditos insuficientes: explicar sistema",
    "Si feature no incluida: sugerir upgrade",
    "Si bug: escalar a Dev con ids completos"
  ]
}
```

**B) "Seguí tipster pero no veo picks"**
```javascript
const TIPSTER_PICKS_ISSUE = {
  diagnosis: [
    "Verificar user.followings incluye tipsterId",
    "Validar subscription.limits.tipsterFollows > 0",
    "Confirmar tipster.status === 'active'",
    "Revisar fechas (¿picks dentro del período activo?)"
  ],
  actions: [
    "Si límite excedido: explicar política",
    "Si tipster suspendido: ofrecer unfollow + compensación",
    "Si período vencido: aclarar temporalidad"
  ]
}
```

**C) "Tipster suspendido y yo pagué"**
```javascript
const TIPSTER_SUSPENSION_ISSUE = {
  policy: "Compensación proporcional si el tipster fue suspendido por violaciones",
  calculation: "Días no utilizados / total días suscripción × valor tipster",
  actions: [
    "Verificar razón de suspensión en tipster.audit",
    "Si violación grave: ofrecer unfollow + crédito",
    "Si error: restaurar acceso temporal"
  ]
}
```

**D) "Plan scope tipster vs global"**
```javascript
const TIPSTER_SCOPE_CONFUSION = {
  common_confusion: "Usuario cree que 'Premium' incluye TODO",
  clarification: {
    global_premium: "Acceso a todos los tipsters premium",
    tipster_specific: "Acceso solo a picks de tipster específico",
    hybrid: "Créditos para usar en cualquier tipster"
  },
  resolution: [
    "Explicar diferencia con ejemplos concretos",
    "Mostrar tabla comparativa de planes",
    "Ofrecer upgrade si es caso"
  ]
}
```

### 2.8) Auto-renew Indebido
**Síntomas:**
- Solicitud de devolución por parte del usuario
- Pago duplicado o erróneo
- Cancelación dentro del período de reembolso

**Diagnóstico:**
1. Verificar fecha de suscripción
2. Confirmar `OrderId` y monto en drawer → Payments
3. Revisar política de reembolso en configuración
4. Validar uso del servicio durante el período

**Solución:**
- Usar "Cancelar" con opción "Al final del ciclo" o "Inmediata"
- Coordinar con Finance para procesamiento del reembolso
- Documentar en timeline el motivo en timeline

---

## 3) Flujo de Investigación Estándar

### 3.1) Buscar Usuario
1. Usar campo de búsqueda en header
2. Filtrar por email o ID
3. Verificar en tabla de suscripciones

### 3.2) Verificar Suscripción
1. Abrir drawer con click en fila
2. Revisar información general
3. Verificar IDs técnicos visibles:
   - `User ID: user_XXXX`
   - `ID Suscripción: sub_XXXX`
   - `Order ID: ORD-XXXX`
   - `Idempotency Key: ik_XXXX`

### 3.3) Revisar Estado de Pago
1. Navegar a drawer → Payments
2. Verificar `PaymentStatus` y `Finance Status`
3. Confirmar `OrderId/InvoiceId`
4. Validar monto y fecha

### 3.4) Verificar Finance
1. Usar botón "💰 Ver en Finance" en navegación rápida
2. Buscar transacción por `OrderId`
3. Confirmar estado en sistema externo

### 3.5) Revisar Créditos (si aplica)
1. Usar botón "⚡ Ver Créditos" en navegación rápida
2. Verificar saldo y movimientos
3. Validar transacciones relacionadas

### 3.6) Verificar Tipsters
1. Usar botón "📊 Ver Tipsters" en navegación rápida
2. Revisar followings y límites
3. Validar relación usuario-tipster

### 3.7) Revisar Auditoría
1. Navegar a drawer → Audit
2. Ver todos los cambios históricos
3. Buscar patrones de problemas

### 3.8) Tomar Acción
 1. Usar botones de acción rápida según el caso
 2. Documentar en timeline
 3. **EJECUTAR CHECKLIST POST-ACCIÓN** (ver sección 3.9)
 4. Comunicar al usuario

### 3.9) Checklist Post-Acción (OBLIGATORIO)
```javascript
const POST_ACTION_VERIFICATION = {
  activate: [
    "✅ Reabrir drawer → confirmar SubscriptionStatus = 'active'",
    "✅ Validar PaymentStatus = 'paid'",
    "✅ Probar feature gating: intentar 'seguir tipster' / 'ver señales premium'",
    "✅ Confirmar evento en Audit y nota en Timeline"
  ],
  extend: [
    "✅ Reabrir drawer → confirmar nueva End Date",
    "✅ Validar que Auto-renewal mantiene estado",
    "✅ Verificar Timeline con registro de extensión",
    "✅ Confirmar evento en Audit"
  ],
  change_plan: [
    "✅ Reabrir drawer → confirmar Current Plan actualizado", 
    "✅ Validar que los límites nuevos se aplican",
    "✅ Verificar cambio en Timeline",
    "✅ Probar funciones del nuevo plan"
  ],
  adjust_limit: [
    "✅ Reabrir drawer → confirmar nuevos límites en Limits",
    "✅ Validar Tipsters Usage refleja cambio",
    "✅ Probar acción que antes estaba bloqueada",
    "✅ Documentar razón en Timeline"
  ],
  cancel: [
    "✅ Reabrir drawer → confirmar Status = 'cancelled'",
    "✅ Validar End Date correcta según tipo de cancelación",
    "✅ Verificar Timeline con detalles de cancelación",
    "✅ Confirmar evento en Audit"
  ]
}
```

⚠️ **NOTA**: No cerrar ticket sin completar checklist correspondiente.

---

## 4) Acciones Permitidas por Rol

### 4.1) Soporte Nivel 1
- ✅ Ver toda la información de suscripciones
- ✅ Activar suscripciones pendientes (máx 24h de antigüedad)
- ✅ Extender suscripciones hasta 7 días
- ✅ Cancelar suscripciones al final del ciclo
- ✅ Ajustar límites de tipsters (+20% máximo)
- ✅ Enviar información al usuario
- ❌ No puede procesar reembolsos
- ❌ No puede cambiar planes entre tiers
- ❌ No puede bypassar controles de fraude

### 4.2) Soporte Nivel 2
- ✅ Todas las acciones de Nivel 1
- ✅ Activar suscripciones de cualquier antigüedad
- ✅ Extender suscripciones hasta 30 días
- ✅ Cambiar planes dentro del mismo tier
- ✅ Cancelar con reembolso parcial
- ✅ Ajustar límites de tipsters (+50% máximo)
- ✅ Puede marcar casos como 'fraud-suspect'
- ✅ Puede freeze subscriptions en casos de sospecha
- ❌ NO puede bypassar controles de fraude
- ✅ Debe escalar a Security para fraude confirmado
- ❌ No puede procesar reembolsos completos
- ❌ No puede modificar pagos externos

### 4.3) Admin/Supervisor
- ✅ Todas las acciones
- ✅ Procesar reembolsos completos
- ✅ Cambiar entre cualquier tier de plan
- ✅ Modificar fechas sin límite
- ✅ Bypassar cualquier control (con auditoría)
- ✅ Acceso a datos sensibles completos

---

## 5) SLA y Métricas de Soporte

### 5.1) Tiempos de Respuesta
```javascript
const SUPPORT_ADMIN_SLA = {
  subscription_activation: {
    priority_1: "2 horas",
    priority_2: "8 horas",
    priority_3: "24 horas"
  },
  payment_issues: {
    priority_1: "1 hora",
    priority_2: "4 horas",
    priority_3: "12 horas"
  },
  limit_adjustments: {
    priority_1: "30 minutos",
    priority_2: "2 horas",
    priority_3: "8 horas"
  }
}
```

### 5.2) KPIs de Soporte
- **Tasa de Resolución**: Objetivo 85% en primer contacto
- **Tiempo Medio de Resolución**: Objetivo <4 horas
- **Satisfacción del Usuario**: Objetivo >4.5/5
- **Escalamientos a Nivel 2**: Máximo 15% de tickets

### 5.3) Reportes y Export para Soporte

**ENDPOINTS DE API (PLACEHOLDERS):**
```javascript
const SUPPORT_API_ENDPOINTS = {
  // Listado y filtros
  GET_TICKETS: "GET /api/admin/support/tickets",
  GET_TICKET_DETAIL: "GET /api/admin/support/tickets/:id",
  
  // Gestión de tickets
  CREATE_TICKET: "POST /api/admin/support/tickets",
  ASSIGN_TICKET: "POST /api/admin/support/tickets/:id/assign",
  UPDATE_STATUS: "POST /api/admin/support/tickets/:id/status",
  ADD_NOTE: "POST /api/admin/support/tickets/:id/note",
  ESCALATE_TICKET: "POST /api/admin/support/tickets/:id/escalate",
  
  // Export
  EXPORT_TICKETS: "POST /api/admin/support/tickets/export"
}
```

**REPORTES SEMANALES ACCIONABLES:**
```javascript
const SUPPORT_REPORTS = {
  weekly_category_breakdown: {
    description: "Tickets por categoría con tendencia",
    fields: ["category", "count", "resolution_rate", "avg_resolution_time"],
    action_items: "Identificar categorías con mayor fricción"
  },
  top_problematic_users: {
    description: "Top 10 users con más tickets (posible fraude/bugs)",
    fields: ["userId", "ticket_count", "categories", "status"],
    action_items: "Revisar si hay bugs sistémicos o fraude"
  },
  top_complained_tipsters: {
    description: "Top 10 tipsters con más reclamos (calidad)",
    fields: ["tipsterId", "complaint_count", "complaint_types", "satisfaction_rate"],
    action_items: "Evaluar calidad del tipster con equipo de contenidos"
  },
  fraud_indicators: {
    description: "Tickets con indicadores de fraude",
    fields: ["ticketId", "userId", "fraud_tags", "amount_involved"],
    action_items: "Priorizar revisión con equipo de seguridad"
  }
}
```

**EXPORT CSV (Placeholder):**
```javascript
const EXPORT_FUNCTIONALITY = {
  endpoint: "/api/admin/support/tickets/export",
  filters: ["dateRange", "category", "priority", "status", "userId"],
  fields: "ticketSchema completo",
  format: "CSV con UTF-8",
  permissions: "Solo Admin y Nivel 2"
}
```

### 5.4) Métricas de Calidad
```javascript
const QUALITY_METRICS = {
  first_contact_resolution: "85%",
  average_resolution_time: "< 4 hours",
  customer_satisfaction: "> 4.5/5",
  escalation_rate: "< 15%",
  sla_compliance: "> 95%"
}
```

---

## 6) Integración con Otros Módulos

### 6.1) USERS-ADMIN
- Navegación directa con "👤 Ver Perfil Usuario"
- Información complementaria del perfil
- Historial de actividad general

### 6.2) FINANCE-ADMIN
- Navegación con "💰 Ver en Finance"
- Detalles de transacciones
- Reconciliación de pagos
- Gestión de reembolsos

### 6.3) CREDITS-ADMIN
- Acceso con "⚡ Ver Créditos"
- Saldo y movimientos
- Transacciones de crédito

### 6.4) TIPSTERS-ADMIN
- Visualización con "📊 Ver Tipsters"
- Relación usuario-tipster
- Gestión de followings

---

## 📊 Métricas de Soporte

### KPIs Recomendados
- Tiempo promedio de resolución por tipo de ticket
- Tasa de resolución en primer contacto
- Tickets escalados a otros equipos
- Satisfacción del usuario post-resolución

### Datos a Monitorear
- Patrones recurrentes de problemas
- Fallos frecuentes por tipo de plan
- Problemas estacionales (renovaciones mensuales)
- Quejas por límite de tipsters

---

## 7) Proceso de Escalamiento

### 7.1) Cuándo Escalar
```javascript
const ESCALATION_TRIGGERS = {
  payment_gateway_errors: "Contactar Finance inmediatamente",
  system_errors: "Escalar a Dev con logs",
  refund_requests: "Coordinar con Finance",
  fraud_indicators: "Notificar a Security",
  legal_issues: "Contactar Legal",
  multi_user_issues: "Escalar a Supervisor"
}
```

### 7.2) Flujo de Escalamiento
1. **Nivel 1** → **Nivel 2**: Problemas técnicos complejos
2. **Nivel 2** → **Admin**: Reembolsos y cambios mayores
3. **Admin** → **Finance/Legal**: Problemas de pago o legales
4. **Todos** → **Dev**: Errores de sistema

### 7.3) Relación con Apuestas Disputadas

**INTEGRACIÓN CON BET-CONTRACT-EXTENSION:**
```javascript
const BET_DISPUTE_INTEGRATION = {
  related_ticket_types: [
    "bet_not_settled",
    "wrong_settlement", 
    "missing_winnings",
    "provider_error"
  ],
  bet_info_display: {
    bet_id: "Mostrar bet_id en drawer → Related IDs",
    provider: "Provider (bet365, pinnacle, etc)",
    external_bet_id: "External Bet ID para rastreo",
    provider_settlement_status: "SETTLED/PENDING/CANCELLED",
    financial_status: "PAID/VOID/REFUNDED/DISPUTED"
  },
  quick_navigation: {
    link_template: "/admin/bets?betId={betId}",
    permissions: ["support_level_2", "admin"],
    show_financial_details: true
  }
}
```

**FLUJO DE INVESTIGACIÓN DE APUESTAS:**
1. Verificar `bet_id` en ticket relacionado
2. Click en enlace directo → módulo de apuestas
3. Validar `provider_settlement_status` vs `financial_status`
4. Coordinar con equipo de apuestas si hay discrepancia
5. Documentar resolución en timeline del ticket

**CONEXIÓN CON SETTLEMENT-DISPUTE (TIPSTERS):**
Cuando un ticket `bet_not_settled` involucra a un tipster, el flujo se conecta con el sistema de settlements:
```javascript
// Ticket.category = 'bet_not_settled' + tipster involucrado →
const SETTLEMENT_DISPUTE_FLOW = {
  trigger: "Ticket con category='bet_not_settled' y pick_id de tipster",
  action: "Disparar evento 'settlement_dispute_received' en tipster-support",
  ownership: "Support documenta → Settlements revisa y aplica ajustes",
  events: ["settlement_dispute_received", "settlement_review_completed", "settlement_adjustment_applied"]
}
```
> **Nota:** El equipo de soporte documenta la disputa, pero el módulo de settlements es el responsable de aplicar los ajustes financieros y notificar a suscriptores.

### 7.4) Fraude/Riesgo - Señales y Acciones

**SEÑALES DE FRAUDE/Riesgo:**
```javascript
const FRAUD_INDICATORS = {
  payment_patterns: [
    "múltiples reconciles seguidos",
    "múltiples cambios de plan en 24h",
    "intentos repetidos con diferentes orderId",
    "mismatch userId vs wallet"
  ],
  behavioral_patterns: [
    "IP/country anomalies",
    "chargeback/disputed payments",
    "suscripción activa después de chargeback",
    "uso de VPN/proxy detectado"
  ],
  account_patterns: [
    "cuenta nueva con suscripción inmediata",
    "múltiples cuentas desde mismo dispositivo",
    "cambios bruscos de patrón de uso"
  ]
}
```

**ACCIONES ANTE FRAUDE:**
```javascript
const FRAUD_RESPONSE_ACTIONS = {
  immediate: [
    "freeze subscription (sin reembolso)",
    "lock user temporal",
    "escalar a Security inmediatamente",
    "no hacer reembolsos manuales"
  ],
  investigation: [
    "conservar todos los logs",
    "documentar en timeline con tag 'fraud-suspect'",
    "notificar a Finance sobre posible chargeback",
    "preparar evidencia para disputa"
  ]
}
```

### 7.4) Sistema de Sanciones
```javascript
const SUPPORT_ADMIN_SANCTIONS = {
  unauthorized_access: {
    first_offense: "Advertencia escrita",
    second_offense: "Suspensión 3 días",
    third_offense: "Suspensión permanente"
  },
  data_breach: {
    any_offense: "Suspensión inmediata + investigación"
  },
  policy_violation: {
    minor: "Capacitación obligatoria",
    major: "Suspensión sin pago"
  }
}
```

### 7.5) Ownership y Flujo de Sanciones

**Sanciones a Tipsters:** Las sanciones disciplinarias a tipsters se ejecutan desde **TIPSTERS-ADMIN**, pero pueden originarse desde soporte cuando:
- Se detecta fraude o violaciones de políticas durante la interacción de soporte
- El tipster incumple repetidamente SLA o calidad de soporte
- Se identifican comportamientos abusivos en canales VIP

**Flujo:** Soporte identifica → Documenta en ticket → Escalación a TIPSTERS-ADMIN → Ejecución de sanción → Notificación al tipster

---

## 8) Mejores Prácticas

### 8.1) Comunicación con Usuarios
- ✅ Siempre explicar el por qué de los cambios
- ✅ Proporcionar información específica y verificable
- ✅ Documentar todo en el timeline
- ✅ Usar lenguaje claro y sin jerga técnica
- ❌ No hacer promesas sobre tiempos de resolución
- ❌ No compartir información de otros usuarios
- ❌ No bypassar controles de seguridad sin justificación

### 8.2) Documentación
- Registrar todos los cambios en timeline
- Incluir IDs técnicos en las notas
- Documentar razones de los cambios
- Mantener trazabilidad completa

### 8.3) Seguridad
- Verificar identidad del usuario antes de cambios
- Nunca compartir credenciales o datos sensibles
- Usar siempre la auditoría para cambios
- Reportar actividad sospechosa inmediatamente

---

## 📚 Referencias Rápidas

- **SUBSCRIPTIONS-ADMIN.md**: Especificación técnica completa
- **FINANCE-ADMIN.md**: Procesos de reconciliación
- **USERS-ADMIN.md**: Gestión de perfiles
- **TIPSTERS-ADMIN.md**: Límites y followings
- **CREDITS-ADMIN.md**: Sistema de créditos

---

## 9) Anexos

### 9.1) Códigos de Estado Comunes
```javascript
const SUBSCRIPTION_STATUS = {
  active: "✅ Activa",
  inactive: "❌ Inactiva", 
  pending: "⏳ Pendiente de activación",
  cancelled: "🚫 Cancelada",
  expired: "⚠️ Expirada"
}

const PAYMENT_STATUS = {
  paid: "✅ Pagado",
  pending: "⏳ Pendiente",
  failed: "❌ Fallido",
  refunded: "↩️ Reembolsado",
  disputed: "⚠️ En disputa"
}
```

### 9.2) Plantillas de Respuesta (Sin Promesas de Tiempo)
```javascript
const SUPPORT_TEMPLATES = {
  activation_complete: {
    es: "Su suscripción ha sido activada exitosamente. Ya puede acceder a todas las funciones premium.",
    en: "Your subscription has been successfully activated. You now have access to all premium features."
  },
  extension_applied: {
    es: "Hemos extendido su suscripción. La nueva fecha de vencimiento se refleja en su cuenta.",
    en: "We have extended your subscription. The new expiration date is reflected in your account."
  },
  limit_increased: {
    es: "Hemos ajustado su límite de tipsters. El cambio ya está disponible en su cuenta.",
    en: "We have adjusted your tipster limit. The change is now available in your account."
  },
  escalated_finance: {
    es: "Hemos escalado su caso a nuestro equipo de Finance. Te confirmaremos cuando valide el estado del pago.",
    en: "We have escalated your case to our Finance team. We will confirm once they validate the payment status."
  },
  escalated_dev: {
    es: "Hemos identificado un problema técnico. Te actualizaremos cuando haya confirmación del equipo técnico.",
    en: "We have identified a technical issue. We will update you when we receive confirmation from the technical team."
  },
  under_review: {
    es: "Tu caso está siendo revisado. Te contactaremos con novedades.",
    en: "Your case is under review. We will contact you with updates."
  }
}
```

---

## 10) Especificación UI Mínima (Para HTML)

**TABS PRINCIPALES:**
```javascript
const SUPPORT_UI_TABS = {
  tickets: "Tickets",
  macros: "Macros/Plantillas", 
  reports: "Reportes",
  config: "Configuración"
}
```

**BULK ACTIONS BAR (COHERENCIA CON TIPSTERS):**
```javascript
const SUPPORT_BULK_ACTIONS = {
  available_actions: [
    "Cerrar múltiples tickets",
    "Asignar agente en masa", 
    "Marcar como fraude (solo admin senior)",
    "Cambiar prioridad en lote",
    "Exportar seleccionados"
  ],
  permissions: {
    close_multiple: ["support_level_1", "support_level_2", "admin"],
    assign_bulk: ["support_level_2", "admin"], 
    mark_fraud: ["admin"], // Solo admin senior
    change_priority: ["support_level_2", "admin"],
    export: ["support_level_2", "admin"]
  }
}
```

**TABLA TICKETS (COLUMNAS MÍNIMAS):**
```javascript
const SUPPORT_TICKETS_TABLE = {
  columns: [
    "Selector", // Checkbox para bulk
    "TicketId",
    "Usuario", 
    "Categoría",
    "Prioridad", 
    "Estado",
    "Asignado",
    "Última actualización",
    "Tags",
    "Acciones"
  ],
  actions: ["Ver", "Asignar", "Cambiar estado", "Escalar"],
  features: {
    selectable_rows: true,
    bulk_actions_bar: true,
    min_width: "1200px", // Coherencia con tipsters
    loading_states: true,
    empty_state: true,
    error_state: true
  }
}
```

**DRAWER TABS (DETALLE TICKET):**
```javascript
const SUPPORT_DRAWER_TABS = {
  overview: "Overview",
  messages: "Messages/Notes", 
  related: "Related IDs",
  timeline: "Timeline",
  audit: "Audit"
}
```

**MODALES REQUERIDOS:**
```javascript
const SUPPORT_MODALS = {
  create_ticket: "Crear Ticket",
  change_status: "Cambiar Estado", 
  assign_ticket: "Asignar Ticket",
  escalate_ticket: "Escalar Ticket",
  add_note: "Añadir Nota"
}
```

**COMPONENTES VISUALES (COHERENCIA CON TIPSTERS):**
```javascript
const SUPPORT_UI_COMPONENTS = {
  sidebar: {
    identical_to: "admin-tipsters",
    sections: ["Tickets", "Reports", "Config"]
  },
  drawer: {
    position: "right",
    tabs: ["Overview", "Messages", "Related IDs", "Timeline", "Audit"],
    width: "600px"
  },
  table: {
    min_width: "1200px",
    loading_skeleton: true,
    empty_state: {
      icon: "🎫",
      title: "No hay tickets",
      subtitle: "Los tickets aparecerán aquí cuando se creen"
    },
    error_state: {
      icon: "⚠️",
      title: "Error al cargar tickets",
      action: "Reintentar"
    }
  },
  filters: {
    collapsible: true,
    default_open: false,
    quick_filters: ["status", "priority", "category", "dateRange"]
  }
}
```

---

## 11) Checklist de Calidad

Antes de cerrar un ticket:
- [ ] Verificar IDs técnicos (User ID, Subscription ID, Order ID)
- [ ] Documentar acciones en timeline
- [ ] Validar cambios en sistema
- [ ] Comunicar al usuario con información clara
- [ ] Verificar integración con otros módulos si aplica
- [ ] Asegurar trazabilidad completa

---

**⚠️ OBLIGATORIO**: Este módulo está diseñado para resolver el 95% de los tickets de suscripciones sin escalamiento. Usar la navegación cruzada y los IDs visibles para investigación completa.

---

## 12) Integración con Soporte Usuario

**FLUJO DE TICKETS USUARIO → ADMIN:**
```javascript
const USER_TO_ADMIN_FLOW = {
  ticket_creation: {
    source: "web", // Tickets creados por usuario desde frontend
    user_visible_fields: [
      "category", 
      "subject", 
      "description", 
      "priority", 
      "attachments"
    ],
    hidden_from_user: [
      "idempotencyKey",
      "orderId", 
      "creditTxId",
      "internal_notes"
    ]
  }
}
```

**DIFERENCIAS DE VISIBILIDAD:**
```javascript
const VISIBILITY_RULES = {
  user_frontend: {
    can_see: [
      "estado simplificado del ticket",
      "mensajes de soporte", 
      "resolución final",
      "historial de mensajes"
    ],
    cannot_see: [
      "IDs técnicos completos",
      "notas internas del admin",
      "escalamientos a otros equipos",
      "estado de investigación interna"
    ]
  },
  admin_support: {
    can_see: [
      "todos los IDs técnicos (userId, orderId, etc)",
      "timeline completo con eventos internos",
      "estados de investigación",
      "notas de otros módulos (Finance, Dev)",
      "logs técnicos y de sistema"
    ]
  }
}
```

**ESTADOS SIMPLIFICADOS PARA USUARIO:**
```javascript
const USER_SIMPLE_STATES = {
  open: "En proceso",
  investigating: "En investigación", 
  escalated: "Con especialistas",
  resolved: "Resuelto",
  closed: "Cerrado"
}
```

---

**📋 NOTA DE COMPLIANCE**: Todos los cambios quedan registrados en auditoría. El soporte técnico no garantiza tiempos de resolución específicos. Los reembolsos están sujetos a políticas de la plataforma.

*Última actualización: Febrero 2026* | *Versión: 1.0*
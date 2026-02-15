# 📋 Admin: Gestión de Usuarios (`/admin/users`)

## 🎯 Objetivo
Panel de administración para la gestión integral de usuarios: control, auditoría, seguridad y acciones críticas sobre todos los usuarios de la plataforma.

**Rol:** Administrador  
**Ruta:** `/admin/users`  
**Acento visual:** Rojo/Admin

**Principio Clave:** El panel de admin es una herramienta de **control y auditoría**. No duplica la lógica de negocio del usuario, sino que la supervisa y gestiona. Toda acción crítica (suspender, bloquear, etc.) debe generar un registro de auditoría inmutable.

---

## 🎨 Guía de Estilo Visual

### Paleta de Colores Admin
```css
--admin-primary: #DC2626;
--admin-secondary: #7F1D1D;
--admin-accent: #EF4444;
--admin-success: #10B981;
--admin-warning: #F59E0B;
--admin-danger: #DC2626;
--admin-info: #3B82F6;
```

### Reglas de Consistencia
- ✅ **MANTENER:** Layout, estructura, componentes base
- ✅ **CAMBIAR:** Colores de botones, badges, sidebar activo, highlights
- ✅ **USAR:** Esquema de color rojo para identificación admin
- ✅ **PRIORIDAD:** Seguridad y claridad sobre estética

---

---

## 1. Estructura y Layout de la Página

### Header Fijo

```typescript
interface AdminUsersHeader {
  title: string;           // "Gestión de Usuarios"
  subtitle: string;        // "Búsqueda, segmentación, seguridad y acciones masivas."
  controls: {
    search: {
      placeholder: string; // "Buscar por email, ID o nombre..."
      value: string;
      onChange: (value: string) => void;
    };
    quickFilters: {
      all: { label: string; active: boolean; count: number };
      active: { label: string; active: boolean; count: number };
      suspended: { label: string; active: boolean; count: number };
    };
    actions: {
      exportCsv: { 
        label: string; 
        disabled: boolean; 
        onClick: () => void;
        tooltip?: string;
      };
      refresh: { 
        label: string; 
        loading: boolean; 
        onClick: () => void;
      };
    };
  };
}
```

### Body

```typescript
interface AdminUsersLayout {
  mainTable: {
    component: 'UserExplorerTable';
    data: User[];
    loading: boolean;
    selectedUsers: string[];
  };
  detailDrawer: {
    component: 'UserDetailDrawer';
    userId: string | null;
    open: boolean;
    activeTab: string;
  };
}
```

### Footer

```typescript
interface AdminUsersFooter {
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  counter: {
    showing: string; // "Mostrando 1-50 de 1,247 usuarios"
  };
}
```

---

## 2. Tabla Principal (User Explorer)

Esta tabla es el componente central de la página y debe ser potente, con filtros y acciones rápidas.

### KPIs de Usuarios (Cards Superiores)

```typescript
interface UserKPIs {
  totalUsers: {
    value: number;
    change: number; // porcentaje
    trend: 'up' | 'down' | 'stable';
    icon: 'users' | 'trending-up' | 'trending-down';
    color: 'blue' | 'green' | 'red';
  };
  activeUsers: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
    icon: 'user-check' | 'user-x';
    color: 'green' | 'red';
  };
  newUsersThisMonth: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
    icon: 'user-plus';
    color: 'blue';
  };
  suspendedUsers: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
    icon: 'user-minus';
    color: 'red';
  };
  verifiedTipsters: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
    icon: 'award';
    color: 'purple';
  };
  highRiskUsers: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
    icon: 'alert-triangle';
    color: 'orange';
  };
}
```

### Columnas de la Tabla (UserExplorerTable)

```typescript
interface UserTableColumn {
  id: string;
  label: string;
  dataKey: keyof User;
  sortable: boolean;
  width?: number;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any, row: User) => string | ReactNode;
}

const USER_TABLE_COLUMNS: UserTableColumn[] = [
  {
    id: 'select',
    label: '',
    dataKey: 'id',
    sortable: false,
    width: 40,
    formatter: (value, row) => <Checkbox value={value} />
  },
  {
    id: 'id',
    label: 'ID',
    dataKey: 'id',
    sortable: true,
    width: 80,
    formatter: (value) => `#${value.slice(-6)}`
  },
  {
    id: 'user',
    label: 'Usuario',
    dataKey: 'displayName',
    sortable: true,
    width: 200,
    formatter: (value, row) => (
      <UserCell 
        name={row.displayName}
        email={row.email}
        avatar={row.avatar}
        verified={row.verified}
      />
    )
  },
  {
    id: 'role',
    label: 'Rol',
    dataKey: 'role',
    sortable: true,
    width: 100,
    formatter: (value) => <RoleBadge role={value} />
  },
  {
    id: 'status',
    label: 'Estado',
    dataKey: 'status',
    sortable: true,
    width: 100,
    formatter: (value) => <StatusBadge status={value} />
  },
  {
    id: 'risk',
    label: 'Riesgo',
    dataKey: 'riskProfile',
    sortable: true,
    width: 100,
    formatter: (value) => <RiskBadge risk={value} />
  },
  {
    id: 'bankroll',
    label: 'Bankroll',
    dataKey: 'bankroll',
    sortable: true,
    width: 120,
    align: 'right',
    formatter: (value) => formatCurrency(value)
  },
  {
    id: 'signals30d',
    label: 'Señales 30d',
    dataKey: 'signals30d',
    sortable: true,
    width: 100,
    align: 'center',
    formatter: (value) => value || 0
  },
  {
    id: 'createdAt',
    label: 'Registro',
    dataKey: 'createdAt',
    sortable: true,
    width: 120,
    formatter: (value) => formatDate(value, 'DD/MM/YYYY')
  },
  {
    id: 'lastActivity',
    label: 'Últ. Actividad',
    dataKey: 'lastActivity',
    sortable: true,
    width: 150,
    formatter: (value) => formatRelativeTime(value)
  },
  {
    id: 'actions',
    label: 'Acciones',
    dataKey: 'id',
    sortable: false,
    width: 120,
    formatter: (value, row) => <UserActions user={row} />
  }
];
```

### Filtros Avanzados (Panel Colapsable)

```typescript
interface UserFilters {
  search: string;
  role: 'ALL' | 'USER' | 'TIPSTER' | 'ADMIN';
  status: 'ALL' | 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  risk: 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'LOCKED';
  country: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  hasTipsterProfile: boolean | null;
  minBankroll: number | null;
  maxBankroll: number | null;
  verificationStatus: 'ALL' | 'VERIFIED' | 'UNVERIFIED' | 'PENDING';
}

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

const ROLE_OPTIONS: FilterOption[] = [
  { value: 'ALL', label: 'Todos los roles' },
  { value: 'USER', label: 'Usuario' },
  { value: 'TIPSTER', label: 'Tipster' },
  { value: 'ADMIN', label: 'Administrador' }
];

const STATUS_OPTIONS: FilterOption[] = [
  { value: 'ALL', label: 'Todos los estados' },
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'SUSPENDED', label: 'Suspendido' },
  { value: 'PENDING', label: 'Pendiente' }
];

const RISK_OPTIONS: FilterOption[] = [
  { value: 'ALL', label: 'Todos los niveles' },
  { value: 'LOW', label: 'Bajo' },
  { value: 'MEDIUM', label: 'Medio' },
  { value: 'HIGH', label: 'Alto' },
  { value: 'LOCKED', label: 'Bloqueado' }
];
```

### Acciones Masivas (Bulk Actions)

```typescript
interface BulkUserActions {
  selectedUsers: string[];
  availableActions: {
    suspend: {
      label: string;
      icon: string;
      description: string;
      confirmationRequired: boolean;
      reasonRequired: boolean;
    };
    reactivate: {
      label: string;
      icon: string;
      description: string;
      confirmationRequired: boolean;
      reasonRequired: boolean;
    };
    sendNotification: {
      label: string;
      icon: string;
      description: string;
      modal: 'SendNotificationModal';
    };
    exportSelected: {
      label: string;
      icon: string;
      description: string;
      format: 'CSV' | 'JSON';
    };
    changeRole: {
      label: string;
      icon: string;
      description: string;
      availableRoles: ('USER' | 'TIPSTER' | 'ADMIN')[];
      confirmationRequired: boolean;
    };
  };
  restrictions: {
    maxSelection: number;
    protectedRoles: string[];
    requiresApproval: boolean;
  };
}
```

> **Nota:** Toda acción de cambio de estado debe generar un evento de auditoría (`AdminAuditLog`).

---

## 3. User Detail Drawer (Vista Detallada)

```typescript
interface UserDetailDrawer {
  userId: string;
  open: boolean;
  activeTab: UserDetailTab;
  tabs: UserDetailTab[];
  user: User | null;
  loading: boolean;
}

type UserDetailTab = 
  | 'overview'
  | 'security'
  | 'subscriptions'
  | 'credits'
  | 'bets'
  | 'support'
  | 'audit'
  | 'referrals';

const USER_DETAIL_TABS: TabConfig[] = [
  { id: 'overview', label: 'Resumen', icon: 'user' },
  { id: 'security', label: 'Seguridad', icon: 'shield' },
  { id: 'subscriptions', label: 'Suscripciones', icon: 'credit-card' },
  { id: 'credits', label: 'Créditos', icon: 'coins' },
  { id: 'bets', label: 'Apuestas', icon: 'chart-line' },
  { id: 'support', label: 'Soporte', icon: 'headphones' },
  { id: 'audit', label: 'Auditoría', icon: 'clipboard-list' },
  { id: 'referrals', label: 'Referidos', icon: 'users' }
];
```

### A) Overview Tab

```typescript
interface UserOverviewTab {
  identity: {
    avatar: string;
    displayName: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    verified: boolean;
    userId: string;
  };
  summary: {
    bankroll: {
      current: number;
      currency: string;
      change24h: number;
      change7d: number;
    };
    activity: {
      totalSignals: number;
      totalBets: number;
      winRate: number;
      lastActivity: Date;
      memberSince: Date;
    };
    quickStats: {
      following: number;
      followers: number;
      subscriptions: number;
      credits: number;
    };
  };
  recentActivity: {
    type: 'login' | 'bet' | 'purchase' | 'signal';
    timestamp: Date;
    description: string;
    metadata?: any;
  }[];
}
```

### B) Security Tab

```typescript
interface UserSecurityTab {
  accountStatus: {
    status: 'ACTIVE' | 'SUSPENDED';
    suspendedAt?: Date;
    suspendedBy?: string;
    suspensionReason?: string;
    canBeModified: boolean;
  };
  riskLocks: {
    hasRiskLock: boolean;
    locks: {
      type: 'LOGIN' | 'BETS' | 'WITHDRAWALS';
      active: boolean;
      appliedAt: Date;
      appliedBy: string;
      reason: string;
    }[];
  };
  twoFactorAuth: {
    enabled: boolean;
    configuredAt?: Date;
    lastUsed?: Date;
    backupCodesRemaining: number;
  };
  accessHistory: {
    timestamp: Date;
    ip: string;
    device: string;
    userAgent: string;
    result: 'SUCCESS' | 'FAILED';
    location?: string;
  }[];
  loginAttempts: {
    recentFailures: number;
    lastFailure?: Date;
    accountLocked: boolean;
    canResetAttempts: boolean;
  };
  actions: {
    canSuspend: boolean;
    canReactivate: boolean;
    canLock: boolean;
    canUnlock: boolean;
    canResetAttempts: boolean;
    requiresReason: boolean;
  };
}
```

### C) Subscriptions Tab

```typescript
interface UserSubscriptionsTab {
  currentSubscription: {
    plan: SubscriptionPlan;
    status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
    startDate: Date;
    endDate?: Date;
    autoRenew: boolean;
    paymentMethod: string;
  } | null;
  usage: {
    signalsUsed: number;
    signalsLimit: number;
    storageUsed: number;
    storageLimit: number;
  };
  history: {
    plan: string;
    status: string;
    startDate: Date;
    endDate: Date;
    amount: number;
  }[];
  upcomingPayment?: {
    date: Date;
    amount: number;
    paymentMethod: string;
  };
  cta: {
    manageSubscription: string; // "/admin/subscriptions?userId={id}"
    upgradePlan: boolean;
    cancelSubscription: boolean;
  };
}
```

### D) Credits Tab

```typescript
interface UserCreditsTab {
  balance: {
    available: number;
    pending: number;
    totalSpent: number;
    currency: string;
  };
  recentTransactions: {
    type: 'PURCHASE' | 'USAGE' | 'REFUND' | 'BONUS';
    amount: number;
    description: string;
    timestamp: Date;
    balanceAfter: number;
  }[];
  packages: {
    popular: CreditPackage[];
    recommended: CreditPackage;
  };
  usageStats: {
    signalsBought: number;
    totalValue: number;
    averageCost: number;
    mostActiveMonth: string;
  };
  cta: {
    addCredits: string; // "/admin/credits?userId={id}"
    viewHistory: boolean;
  };
}
```

### E) Bets Tab

```typescript
interface UserBetsTab {
  summary: {
    totalBets: number;
    totalStaked: number;
    totalProfit: number;
    winRate: number;
    averageOdds: number;
    roi: number;
  };
  recentBets: {
    id: string;
    event: string;
    market: string;
    stake: number;
    odds: number;
    outcome: 'WIN' | 'LOSS' | 'PENDING' | 'VOID';
    profit: number;
    timestamp: Date;
  }[];
  performance: {
    bySport: { sport: string; bets: number; profit: number; roi: number }[];
    byMonth: { month: string; bets: number; profit: number }[];
  };
  activeBets: {
    id: string;
    event: string;
    market: string;
    stake: number;
    currentOdds: number;
    potentialProfit: number;
    status: 'PLACED' | 'IN_PLAY' | 'CASH_OUT_AVAILABLE';
  }[];
  cta: {
    viewAllBets: string; // "/admin/bets?userId={id}"
    exportHistory: boolean;
  };
}
```

### F) Support Tab

```typescript
interface UserSupportTab {
  recentTickets: {
    id: string;
    subject: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    createdAt: Date;
    lastUpdate: Date;
    assignedTo?: string;
  }[];
  stats: {
    totalTickets: number;
    openTickets: number;
    avgResponseTime: string;
    satisfaction: number;
  };
  quickActions: {
    createTicket: boolean;
    viewAllTickets: string; // "/admin/support?userId={id}"
  };
}
```

### G) Audit Tab

```typescript
interface UserAuditTab {
  recentEvents: {
    id: string;
    action: string;
    category: 'USER_ACTION' | 'ADMIN_ACTION' | 'SYSTEM_ACTION';
    timestamp: Date;
    actor: string;
    target: string;
    details: any;
    ip?: string;
  }[];
  filters: {
    categories: string[];
    dateRange: { from: Date; to: Date };
    actor?: string;
  };
  summary: {
    totalEvents: number;
    userInitiated: number;
    adminInitiated: number;
    systemInitiated: number;
  };
  cta: {
    viewFullAudit: string; // "/admin/audit?userId={id}"
    exportEvents: boolean;
  };
}
```

### H) Referrals Tab

```typescript
interface UserReferralsTab {
  summary: {
    totalReferrals: number;
    activeReferrals: number;
    totalEarned: number;
    conversionRate: number;
  };
  referrals: {
    id: string;
    email: string;
    status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
    joinedAt?: Date;
    earnings: number;
    tier: number;
  }[];
  program: {
    currentTier: number;
    nextTier: number;
    progress: number;
    commissionRate: number;
  };
  cta: {
    viewReferralProgram: string; // "/admin/referrals?userId={id}"
    generateReferralLink: boolean;
  };
}

---

## 4. Modales de Acciones Críticas

```typescript
interface UserActionModal {
  type: 'SUSPEND' | 'REACTIVATE' | 'LOCK' | 'UNLOCK' | 'RESET_ATTEMPTS' | 'CHANGE_ROLE';
  userId: string;
  userName: string;
  open: boolean;
  loading: boolean;
  confirmation: {
    required: boolean;
    text?: string; // Texto a escribir para confirmar
  };
}

interface SuspendUserModal extends UserActionModal {
  type: 'SUSPEND';
  form: {
    reason: string;
    duration?: 'PERMANENT' | 'TEMPORARY';
    temporaryDuration?: number; // días
    notifyUser: boolean;
    confirmationText: string;
  };
  validation: {
    reasonMinLength: number;
    requiresApproval: boolean;
  };
}

interface LockUserModal extends UserActionModal {
  type: 'LOCK' | 'UNLOCK';
  form: {
    lockType: 'LOGIN' | 'BETS' | 'WITHDRAWALS' | 'FULL';
    reason: string;
    duration?: number; // días (solo para LOCK)
    notifyUser: boolean;
  };
  availableLocks: {
    type: string;
    label: string;
    description: string;
    currentStatus: boolean;
  }[];
}

interface ChangeRoleModal extends UserActionModal {
  type: 'CHANGE_ROLE';
  form: {
    newRole: 'USER' | 'TIPSTER' | 'ADMIN';
    reason: string;
    notifyUser: boolean;
  };
  availableRoles: {
    role: string;
    label: string;
    description: string;
    implications: string[];
  }[];
}
```

### Suspender Usuario

```typescript
const SUSPEND_MODAL_CONFIG: SuspendUserModal = {
  type: 'SUSPEND',
  title: 'Suspender Usuario',
  description: 'Esta acción suspenderá al usuario y restringirá su acceso a la plataforma.',
  form: {
    reason: {
      label: 'Motivo de la suspensión',
      placeholder: 'Proporcione una razón detallada para esta suspensión...',
      required: true,
      minLength: 20,
      maxLength: 500
    },
    duration: {
      options: [
        { value: 'PERMANENT', label: 'Permanente' },
        { value: 'TEMPORARY', label: 'Temporal' }
      ]
    },
    temporaryDuration: {
      label: 'Duración (días)',
      min: 1,
      max: 365,
      default: 30
    },
    notifyUser: {
      label: 'Notificar al usuario por email',
      default: true
    },
    confirmation: {
      required: true,
      text: 'SUSPENDER'
    }
  },
  warnings: [
    'El usuario no podrá iniciar sesión',
    'Las suscripciones activas serán pausadas',
    'Se requiere aprobación de supervisor para suspensiones permanentes'
  ],
  result: {
    success: 'Usuario suspendido exitosamente',
    error: 'Error al suspender usuario',
    auditLog: true
  }
};
```

### Lock/Unlock por Riesgo

```typescript
const LOCK_MODAL_CONFIG: LockUserModal = {
  type: 'LOCK',
  title: 'Bloquear Usuario por Riesgo',
  description: 'Aplicar bloqueos específicos al usuario por razones de seguridad.',
  form: {
    lockType: {
      options: [
        {
          value: 'LOGIN',
          label: 'Bloqueo de Acceso',
          description: 'Previene el inicio de sesión',
          icon: 'lock'
        },
        {
          value: 'BETS',
          label: 'Bloqueo de Apuestas',
          description: 'Previene nuevas apuestas',
          icon: 'ban'
        },
        {
          value: 'WITHDRAWALS',
          label: 'Bloqueo de Retiros',
          description: 'Previene retiros de fondos',
          icon: 'dollar-sign'
        },
        {
          value: 'FULL',
          label: 'Bloqueo Completo',
          description: 'Bloquea todas las actividades',
          icon: 'shield-off'
        }
      ]
    },
    reason: {
      label: 'Justificación del bloqueo',
      required: true,
      minLength: 10
    },
    duration: {
      label: 'Duración (días)',
      optional: true,
      min: 1,
      max: 90
    },
    notifyUser: {
      label: 'Notificar al usuario',
      default: true
    }
  },
  riskAssessment: {
    required: true,
    factors: ['Patrón de apuestas', 'Actividad sospechosa', 'Ubicación inusual']
  }
};
```

---

## 5. Estados de la Interfaz (UI States)

```typescript
interface AdminUsersUIState {
  table: {
    loading: boolean;
    error: string | null;
    empty: boolean;
    partial: boolean;
  };
  drawer: {
    loading: boolean;
    error: string | null;
    notFound: boolean;
  };
  actions: {
    processing: boolean;
    error: string | null;
    success: string | null;
  };
}

const UI_STATE_CONFIG = {
  loading: {
    table: {
      skeleton: true,
      spinner: true,
      text: 'Cargando usuarios...'
    },
    drawer: {
      skeleton: true,
      text: 'Cargando información del usuario...'
    }
  },
  empty: {
    table: {
      icon: 'users',
      title: 'No se encontraron usuarios',
      message: 'Intenta ajustar tus filtros o búsqueda',
      cta: {
        label: 'Limpiar filtros',
        action: 'clearFilters'
      }
    }
  },
  error: {
    table: {
      icon: 'alert-circle',
      title: 'Error al cargar usuarios',
      message: 'Hubo un problema al obtener los datos',
      cta: {
        label: 'Reintentar',
        action: 'retry'
      }
    },
    drawer: {
      icon: 'alert-circle',
      title: 'Usuario no encontrado',
      message: 'El usuario seleccionado no existe o fue eliminado',
      cta: {
        label: 'Cerrar',
        action: 'closeDrawer'
      }
    }
  },
  partial: {
    table: {
      warning: true,
      title: 'Algunos datos no se pudieron cargar',
      message: 'Mostrando información parcial',
      cta: {
        label: 'Reintentar',
        action: 'retryMissing'
      }
    }
  }
};
```

---

## 6. Navegación y Rutas

```typescript
interface AdminUsersRoute {
  main: '/admin/users';
  queryParams: AdminUsersQueryParams;
  drawerParams: UserDrawerParams;
}

interface AdminUsersQueryParams {
  q?: string;              // búsqueda general
  role?: string;           // filtro por rol
  status?: string;         // filtro por estado
  risk?: string;           // filtro por riesgo
  country?: string;        // filtro por país
  from?: string;           // fecha desde
  to?: string;             // fecha hasta
  page?: number;           // página actual
  limit?: number;          // items por página
  sort?: string;           // ordenamiento (campo:direccion)
  hasTipsterProfile?: boolean;  // tiene perfil de tipster
  verificationStatus?: string;  // estado de verificación
}

interface UserDrawerParams {
  userId?: string;         // ID del usuario para abrir drawer
  tab?: UserDetailTab;     // pestaña activa
}

// URL Examples:
// /admin/users
// /admin/users?q=john&role=TIPSTER&status=ACTIVE
// /admin/users?userId=123&tab=security
// /admin/users?page=2&limit=50&sort=createdAt:desc

const EXTERNAL_LINKS = {
  subscriptions: '/admin/subscriptions?userId={id}',
  credits: '/admin/credits?userId={id}',
  bets: '/admin/bets?userId={id}',
  support: '/admin/support?userId={id}',
  audit: '/admin/audit?userId={id}',
  referrals: '/admin/referrals?userId={id}'
};
```

---

## 7. Risk Flags: tipos + UI + reglas

```typescript
interface RiskFlag {
  type: RiskFlagType;
  level: RiskLevel;
  description: string;
  createdAt: Date;
  createdBy: string;
  expiresAt?: Date;
  lockType?: LockType;
}

enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM', 
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

enum RiskFlagType {
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  MULTIPLE_ACCOUNTS = 'MULTIPLE_ACCOUNTS',
  ARBITRAGE_ATTEMPT = 'ARBITRAGE_ATTEMPT',
  UNUSUAL_BETTING = 'UNUSUAL_BETTING',
  PAYMENT_FRAUD = 'PAYMENT_FRAUD',
  VERIFICATION_FAILED = 'VERIFICATION_FAILED',
  TERMS_VIOLATION = 'TERMS_VIOLATION'
}

enum LockType {
  LOGIN = 'LOCK:LOGIN',
  BETS = 'LOCK:BETS', 
  WITHDRAWALS = 'LOCK:WITHDRAWALS',
  DEPOSITS = 'LOCK:DEPOSITS',
  ALL = 'LOCK:ALL'
}

interface RiskFlagDisplay {
  icon: string;
  color: string;
  label: string;
  description: string;
  actions: RiskFlagAction[];
}

const RISK_FLAG_CONFIG: Record<RiskLevel, RiskFlagDisplay> = {
  [RiskLevel.LOW]: {
    icon: 'alert-triangle',
    color: 'yellow',
    label: 'Bajo Riesgo',
    description: 'Comportamiento normal con observaciones menores',
    actions: ['view', 'escalate']
  },
  [RiskLevel.MEDIUM]: {
    icon: 'alert-circle',
    color: 'orange',
    label: 'Riesgo Medio',
    description: 'Comportamiento sospechoso que requiere monitoreo',
    actions: ['view', 'escalate', 'add-note']
  },
  [RiskLevel.HIGH]: {
    icon: 'warning',
    color: 'red',
    label: 'Riesgo Alto',
    description: 'Comportamiento anómalo que requiere acción inmediata',
    actions: ['view', 'lock', 'suspend', 'investigate']
  },
  [RiskLevel.CRITICAL]: {
    icon: 'shield-off',
    color: 'dark-red',
    label: 'Crítico',
    description: 'Amenaza inmediata al sistema - bloqueo automático',
    actions: ['view', 'unlock', 'investigate', 'audit']
  }
};

interface RiskFlagAction {
  type: 'view' | 'escalate' | 'add-note' | 'lock' | 'unlock' | 'suspend' | 'investigate' | 'audit';
  label: string;
  requiresConfirmation: boolean;
  requiredRole: UserRole;
  auditRequired: boolean;
}

const RISK_FLAG_ACTIONS: Record<string, RiskFlagAction> = {
  view: {
    type: 'view',
    label: 'Ver Detalles',
    requiresConfirmation: false,
    requiredRole: UserRole.ADMIN,
    auditRequired: false
  },
  lock: {
    type: 'lock',
    label: 'Bloquear Usuario',
    requiresConfirmation: true,
    requiredRole: UserRole.ADMIN,
    auditRequired: true
  },
  unlock: {
    type: 'unlock',
    label: 'Desbloquear Usuario',
    requiresConfirmation: true,
    requiredRole: UserRole.ADMIN,
    auditRequired: true
  }
};
```

---

## 8. Tabla mínima (MVP)

```typescript
interface LastActivityColumn {
  timestamp: Date;
  source: 'WEB' | 'API' | 'MOBILE';
  type: 'LOGIN' | 'PURCHASE' | 'BET' | 'TICKET';
  ip?: string;
  userAgent?: string;
}

interface AccessLogEntry {
  timestamp: Date;
  ip: string;
  device: string;
  userAgent: string;
  result: 'SUCCESS' | 'FAIL';
  failureReason?: string;
}

interface AccessLogTable {
  entries: AccessLogEntry[];
  total: number;
  page: number;
  limit: number;
  filters: {
    dateRange?: DateRange;
    result?: 'SUCCESS' | 'FAIL';
    ip?: string;
  };
}

const COLUMN_TEMPLATES = {
  lastActivity: {
    format: 'YYYY-MM-DD HH:mm',
    showSource: true,
    showType: true,
    example: '2023-10-27 14:30 (WEB) - LOGIN'
  },
  accessLog: {
    columns: ['timestamp', 'ip', 'device', 'result'],
    pageSize: 10,
    sortable: true,
    filterable: true
  }
};
```

---

## 9. Bulk Safety Rules (MVP)

```typescript
interface BulkSafetyRules {
  adminProtection: AdminProtectionRule;
  confirmationLimits: ConfirmationLimitRule;
  previewRequirements: PreviewRule;
  auditRequirements: AuditRule;
}

interface AdminProtectionRule {
  enabled: boolean;
  protectedRoles: UserRole[];
  action: 'ignore' | 'block' | 'require-super-admin';
  errorMessage: string;
}

interface ConfirmationLimitRule {
  threshold: number;
  confirmationType: 'text' | 'checkbox' | 'peer-approval';
  confirmationText?: string;
  warningMessage: string;
}

interface PreviewRule {
  enabled: boolean;
  showAffectedCount: boolean;
  showUserList: boolean;
  maxUsersToShow: number;
}

interface AuditRule {
  required: boolean;
  logLevel: 'INFO' | 'WARNING' | 'ERROR';
  includeUserIds: boolean;
  includeActionDetails: boolean;
}

const BULK_SAFETY_CONFIG: BulkSafetyRules = {
  adminProtection: {
    enabled: true,
    protectedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    action: 'block',
    errorMessage: 'No se pueden realizar acciones masivas sobre usuarios administradores'
  },
  confirmationLimits: {
    threshold: 20,
    confirmationType: 'text',
    confirmationText: 'CONFIRMAR',
    warningMessage: 'Estás a punto de afectar a más de 20 usuarios'
  },
  previewRequirements: {
    enabled: true,
    showAffectedCount: true,
    showUserList: true,
    maxUsersToShow: 10
  },
  auditRequirements: {
    required: true,
    logLevel: 'INFO',
    includeUserIds: true,
    includeActionDetails: true
  }
};
```

---

## 10. Export Contract

```typescript
interface ExportContract {
  format: ExportFormat;
  filename: string;
  columns: string[];
  filters: ExportFilters;
  limits: ExportLimits;
  metadata: ExportMetadata;
  security: ExportSecurity;
}

enum ExportFormat {
  CSV = 'csv',
  XLSX = 'xlsx',
  JSON = 'json'
}

interface ExportFilters {
  respectTableFilters: boolean;
  respectDateRange: boolean;
  respectSearch: boolean;
}

interface ExportLimits {
  maxRecords: number;
  warningThreshold: number;
  requireApproval: boolean;
}

interface ExportMetadata {
  includeTimestamp: boolean;
  includeUserInfo: boolean;
  includeAppliedFilters: boolean;
}

interface ExportSecurity {
  requirePermission: string;
  anonymizeSensitiveData: boolean;
  logExport: boolean;
}

const EXPORT_CONFIG: ExportContract = {
  format: ExportFormat.CSV,
  filename: 'users_{timestamp}.csv',
  columns: [], // Se llena con las columnas visibles
  filters: {
    respectTableFilters: true,
    respectDateRange: true,
    respectSearch: true
  },
  limits: {
    maxRecords: 1000,
    warningThreshold: 500,
    requireApproval: true
  },
  metadata: {
    includeTimestamp: true,
    includeUserInfo: true,
    includeAppliedFilters: true
  },
  security: {
    requirePermission: 'EXPORT_USER_DATA',
    anonymizeSensitiveData: true,
    logExport: true
  }
};
```

---

## 11. Estados UI y CTAs

```typescript
interface UIStateConfig {
  empty: EmptyStateConfig;
  error: ErrorStateConfig;
  partial: PartialStateConfig;
  loading: LoadingStateConfig;
}

interface EmptyStateConfig {
  icon: string;
  title: string;
  message: string;
  cta: CTAConfig;
}

interface ErrorStateConfig {
  icon: string;
  title: string;
  message: string;
  ctas: CTAConfig[];
}

interface PartialStateConfig {
  warning: boolean;
  title: string;
  message: string;
  cta: CTAConfig;
}

interface LoadingStateConfig {
  skeleton: boolean;
  spinner: boolean;
  text: string;
}

interface CTAConfig {
  label: string;
  action: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

const UI_STATE_CONFIG: UIStateConfig = {
  empty: {
    icon: 'users',
    title: 'No se encontraron usuarios',
    message: 'Intenta ajustar tus filtros o búsqueda',
    cta: {
      label: 'Limpiar filtros',
      action: 'clearFilters',
      variant: 'primary'
    }
  },
  error: {
    icon: 'alert-circle',
    title: 'Error al cargar usuarios',
    message: 'Hubo un problema al obtener los datos',
    ctas: [
      {
        label: 'Reintentar',
        action: 'retry',
        variant: 'primary'
      },
      {
        label: 'Copiar errorId',
        action: 'copyError',
        variant: 'secondary'
      }
    ]
  },
  partial: {
    warning: true,
    title: 'Algunos datos no se pudieron cargar',
    message: 'Mostrando información parcial',
    cta: {
      label: 'Reintentar faltantes',
      action: 'retryMissing',
      variant: 'secondary'
    }
  },
  loading: {
    skeleton: true,
    spinner: true,
    text: 'Cargando usuarios...'
  }
};
```

---

## 12. Query Params Estándar

```typescript
interface StandardQueryParams {
  q: string;                    // búsqueda general
  role: string;                 // filtro por rol
  status: string;               // filtro por estado
  risk: string;                 // filtro por riesgo
  country: string;              // filtro por país
  from: string;                 // fecha desde (ISO)
  to: string;                   // fecha hasta (ISO)
  page: number;                 // página actual
  limit: number;                // items por página
  sort: string;                 // ordenamiento (campo:direccion)
  tab: UserDetailTab;           // pestaña activa en drawer
  userId: string;               // ID para abrir drawer
  hasTipsterProfile: boolean;   // tiene perfil tipster
  verificationStatus: string; // estado verificación
}

const QUERY_PARAM_SCHEMA = {
  q: { type: 'string', maxLength: 100, sanitize: true },
  role: { type: 'string', enum: Object.values(UserRole) },
  status: { type: 'string', enum: Object.values(UserStatus) },
  risk: { type: 'string', enum: Object.values(RiskLevel) },
  country: { type: 'string', pattern: '^[A-Z]{2}$' },
  from: { type: 'string', format: 'date' },
  to: { type: 'string', format: 'date' },
  page: { type: 'number', min: 1, default: 1 },
  limit: { type: 'number', min: 10, max: 100, default: 50 },
  sort: { type: 'string', pattern: '^[a-zA-Z]+:(asc|desc)$' },
  tab: { type: 'string', enum: USER_DETAIL_TABS },
  userId: { type: 'string', format: 'uuid' },
  hasTipsterProfile: { type: 'boolean' },
  verificationStatus: { type: 'string' }
};

// URL Examples:
// /admin/users?q=john&role=TIPSTER&status=ACTIVE&sort=createdAt:desc
// /admin/users?userId=123&tab=security&risk=HIGH
// /admin/users?page=2&limit=25&from=2023-01-01&to=2023-12-31
const buildQueryString = (params: Partial<StandardQueryParams>): string => {
  return new URLSearchParams(Object.entries(params)).toString();
};
```
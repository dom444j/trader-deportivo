# Admin Agents Hub - Documentación

## 📋 Información General

**Archivo**: `admin-agents.html`  
**Módulo**: Gestión de Agentes IA para Administradores  
**Prioridad**: 🔴 **CRÍTICA** - Sprint 1  
**Estado**: 🚧 **PENDIENTE** - Por implementar  
**Última actualización**: 2024-01-14

## 🎯 Objetivo

Crear un módulo administrativo que permita a los administradores del sistema visualizar, gestionar y controlar todos los agentes IA de los usuarios, incluyendo su estado, consumo de créditos, rendimiento y configuraciones.

## 📋 Interfaces TypeScript

### Interfaces Principales

```typescript
// Información general del módulo
interface AdminAgentsModule {
  module: 'admin-agents';
  role: 'admin';
  route: '/admin/agents';
  visualAccent: 'amber-admin';
  keyPrinciple: 'Gestión centralizada de agentes IA';
}

// Header del panel
interface AdminAgentsHeader {
  title: string; // "Gestión de Agentes IA"
  subtitle: string; // "Control y monitoreo de agentes inteligentes del sistema"
  search: {
    placeholder: string;
    enabled: boolean;
  };
  quickActions: Array<{
    icon: string;
    label: string;
    action: 'create_agent' | 'export_data' | 'refresh_list' | 'bulk_operations';
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

// Layout principal
interface AdminAgentsLayout {
  sidebar: 'admin-sidebar';
  kpis: AgentKPIs;
  mainContent: {
    tabs: AgentTabsConfig;
    activeTab: string;
    view: 'grid' | 'list';
  };
  filters: AgentFilters;
}

// KPIs principales
interface AgentKPIs {
  totalAgents: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
    description: string;
  };
  activeAgents: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
    description: string;
  };
  creditsConsumed: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
    description: string;
  };
  averagePerformance: {
    value: number;
    percentage: number;
    trend: 'up' | 'down' | 'neutral';
    description: string;
  };
  systemLoad: {
    value: number;
    status: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  };
  anomalyCount: {
    value: number;
    critical: boolean;
    description: string;
  };
}

// Configuración de tabs
interface AgentTabsConfig {
  all_agents: {
    label: 'Todos los Agentes';
    icon: '🤖';
    description: 'Vista general de todos los agentes del sistema';
    count?: number;
  };
  active: {
    label: 'Activos';
    icon: '✅';
    description: 'Agentes actualmente en funcionamiento';
    count?: number;
  };
  inactive: {
    label: 'Inactivos';
    icon: '⏸️';
    description: 'Agentes detenidos o pausados';
    count?: number;
  };
  performance: {
    label: 'Rendimiento';
    icon: '📈';
    description: 'Análisis de efectividad y métricas';
    count?: number;
  };
  anomalies: {
    label: 'Anomalías';
    icon: '🚨';
    description: 'Agentes con comportamientos anómalos';
    count?: number;
  };
  system_health: {
    label: 'Salud del Sistema';
    icon: '🔧';
    description: 'Estado de recursos y rendimiento global';
    count?: number;
  };
}
```

### Interfaces de Filtros y Tablas

```typescript
// Filtros avanzados
interface AgentFilters {
  search: string;
  status: 'all' | 'active' | 'inactive' | 'suspended' | 'error';
  type: string[];
  user?: string;
  performance: {
    min?: number;
    max?: number;
  };
  credits: {
    min?: number;
    max?: number;
  };
  dateRange: {
    createdFrom?: string;
    createdTo?: string;
    lastActivityFrom?: string;
    lastActivityTo?: string;
  };
  anomalies: boolean;
  systemLoad: 'low' | 'medium' | 'high' | 'all';
}

// Columnas de tabla
interface AgentTableColumn {
  key: string;
  label: string;
  sortable: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any, row: Agent) => string;
  component?: React.ComponentType<{ value: any; row: Agent }>;
}

// Configuración de tabla
interface AgentsTable {
  columns: AgentTableColumn[];
  data: Agent[];
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
  expandable?: {
    expandedRowRender: (record: Agent) => React.ReactNode;
    rowExpandable: (record: Agent) => boolean;
  };
}
```

### Interfaces de Componentes

```typescript
// Componente de tarjeta de agente (vista grid)
interface AgentCard {
  agent: Agent;
  layout: 'compact' | 'detailed';
  actions: Array<{
    icon: string;
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  metrics: {
    showPerformance: boolean;
    showCredits: boolean;
    showActivity: boolean;
    showAnomalies: boolean;
  };
}

// Componente de detalle de agente (Drawer/Modal)
interface AgentDetail {
  agent: Agent;
  activeTab: 'overview' | 'performance' | 'configuration' | 'logs' | 'analytics';
  tabs: Array<{
    key: string;
    label: string;
    content: React.Component;
    badge?: number;
  }>;
  actions: Array<{
    key: string;
    label: string;
    variant: 'primary' | 'secondary' | 'danger';
    confirm?: boolean;
    requireReason?: boolean;
  }>;
}

// Componente de gráficos de rendimiento
interface AgentPerformanceChart {
  agentId: string;
  metrics: Array<{
    name: string;
    data: Array<{
      timestamp: string;
      value: number;
    }>;
    color: string;
    type: 'line' | 'bar' | 'area';
  }>;
  timeRange: '24h' | '7d' | '30d' | '90d' | 'custom';
  showAnnotations: boolean;
}

// Componente de sistema de salud
interface SystemHealthDashboard {
  overview: {
    totalAgents: number;
    activeAgents: number;
    systemLoad: number;
    errorRate: number;
    avgResponseTime: number;
  };
  alerts: Array<{
    id: string;
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    timestamp: string;
    component: string;
  }>;
  metrics: Array<{
    name: string;
    value: number;
    unit: string;
    status: 'good' | 'warning' | 'critical';
    trend: 'up' | 'down' | 'stable';
  }>;
}
```

### Tipos Auxiliares

```typescript
// Estado de agente
type AgentStatus = 'active' | 'inactive' | 'suspended' | 'error' | 'maintenance';

// Tipo de agente
type AgentType = 'trading' | 'analysis' | 'notification' | 'reporting' | 'custom';

// Nivel de rendimiento
type PerformanceLevel = 'excellent' | 'good' | 'average' | 'poor' | 'critical';

// Tipo de anomalía
type AgentAnomalyType = 'high_cpu' | 'high_memory' | 'slow_response' | 'error_spike' | 'unusual_pattern';

// Nivel de sistema
type SystemLoadLevel = 'low' | 'medium' | 'high' | 'critical';

// Tipo de acción
type AgentAction = 'activate' | 'deactivate' | 'suspend' | 'restart' | 'delete' | 'configure';

// Categoría de alerta
type AlertLevel = 'info' | 'warning' | 'error' | 'critical';
```

## 📊 Requisitos Funcionales

### Vista General de Agentes
- [ ] **Dashboard de Agentes**: Vista general con métricas clave
- [ ] **Lista de Agentes**: Tabla con todos los agentes del sistema
- [ ] **Filtros Avanzados**: Por usuario, estado, tipo, rendimiento
- [ ] **Búsqueda Rápida**: Buscar por nombre de agente o usuario

### Gestión por Usuario
- [ ] **Perfil de Usuario**: Ver todos los agentes de un usuario específico
- [ ] **Estado de Créditos**: Consumo actual y histórico de créditos
- [ ] **Actividad Reciente**: Últimas acciones de cada agente
- [ ] **Rendimiento**: Métricas de efectividad y uso

### Control Administrativo
- [ ] **Activar/Desactivar**: Control remoto de agentes
- [ ] **Modificar Configuración**: Ajustar parámetros de agentes
- [ ] **Reasignar Créditos**: Transferir créditos entre usuarios
- [ ] **Alertas y Notificaciones**: Sistema de alertas para anomalías

### Análisis y Reportes
- [ ] **Estadísticas Globales**: Uso total del sistema de agentes
- [ ] **Top Agentes**: Ranking por rendimiento y uso
- [ ] **Consumo de Recursos**: Monitorización de recursos del sistema
- [ ] **Exportar Datos**: Generar reportes en CSV/Excel

## 🎨 Diseño Visual

### Esquema de Colores (Admin)
```css
:root {
  --primary-admin: #f59e0b;        /* Amber 500 */
  --primary-admin-dark: #d97706;   /* Amber 600 */
  --secondary-admin: #f97316;      /* Orange 500 */
  --accent-admin: #fb923c;        /* Orange 400 */
  --background-admin: #111827;     /* Gray 900 */
  --surface-admin: #1f2937;        /* Gray 800 */
  --text-admin: #f9fafb;           /* Gray 50 */
  --text-secondary-admin: #d1d5db; /* Gray 300 */
}
```

### Tipografías
- **Principal**: 'Rajdhani', sans-serif (títulos y encabezados)
- **Monoespaciada**: 'JetBrains Mono', monospace (datos técnicos)

### Componentes UI
- **Tarjetas KPI**: Métricas principales en formato de dashboard
- **Tabla de Datos**: Con sorting, filtering y pagination
- **Gráficos**: Chart.js para visualización de datos
- **Modal de Detalle**: Vista detallada de cada agente

## 🏗️ Estructura HTML Propuesta

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Gestión de Agentes IA</title>
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../styles/admin.css">
</head>
<body>
    <!-- Sidebar Admin -->
    <aside class="admin-sidebar">
        <div class="sidebar-header">
            <div class="logo">
                <span class="logo-text">ADMIN</span>
            </div>
        </div>
        <nav class="sidebar-nav">
            <a href="admin-dashboard.html" class="nav-item">Dashboard</a>
            <a href="admin-users.html" class="nav-item">Usuarios</a>
            <a href="admin-agents.html" class="nav-item active">Agentes IA</a>
            <a href="admin-tipsters.html" class="nav-item">Tipsters</a>
            <!-- ... más items -->
        </nav>
    </aside>

    <!-- Contenido Principal -->
    <main class="admin-main">
        <header class="admin-header">
            <h1>Gestión de Agentes IA</h1>
            <div class="header-actions">
                <button class="btn btn-primary">Nuevo Agente</button>
                <button class="btn btn-secondary">Exportar</button>
            </div>
        </header>

        <!-- KPI Cards -->
        <section class="kpi-grid">
            <div class="kpi-card">
                <h3>Total Agentes</h3>
                <div class="kpi-value">1,247</div>
                <div class="kpi-change positive">+5.2%</div>
            </div>
            <div class="kpi-card">
                <h3>Agentes Activos</h3>
                <div class="kpi-value">892</div>
                <div class="kpi-change positive">+12.1%</div>
            </div>
            <div class="kpi-card">
                <h3>Créditos Consumidos</h3>
                <div class="kpi-value">45,230</div>
                <div class="kpi-change negative">-8.4%</div>
            </div>
            <div class="kpi-card">
                <h3>Rendimiento Promedio</h3>
                <div class="kpi-value">73.5%</div>
                <div class="kpi-change positive">+2.1%</div>
            </div>
        </section>

        <!-- Tabla de Agentes -->
        <section class="data-section">
            <div class="section-header">
                <h2>Listado de Agentes</h2>
                <div class="filters">
                    <select class="filter-select">
                        <option>Todos los usuarios</option>
                        <!-- Opciones dinámicas -->
                    </select>
                    <select class="filter-select">
                        <option>Todos los estados</option>
                        <option>Activo</option>
                        <option>Inactivo</option>
                        <option>Suspendido</option>
                    </select>
                    <input type="search" class="search-input" placeholder="Buscar agente...">
                </div>
            </div>
            
            <div class="table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Agente</th>
                            <th>Usuario</th>
                            <th>Estado</th>
                            <th>Tipo</th>
                            <th>Créditos</th>
                            <th>Rendimiento</th>
                            <th>Última Actividad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Filas dinámicas -->
                    </tbody>
                </table>
            </div>
        </section>
    </main>
</body>
</html>
```

## 🔧 Funcionalidades JavaScript

### Gestión de Datos
```javascript
// Estado de la aplicación
const agentsState = {
    agents: [],
    filteredAgents: [],
    currentFilter: 'all',
    currentSort: 'name',
    searchTerm: ''
};

// Funciones principales
const loadAgents = async () => {
    // Cargar datos de agentes desde API
};

const filterAgents = (criteria) => {
    // Filtrar agentes según criterios
};

const sortAgents = (field) => {
    // Ordenar agentes por campo
};

const toggleAgentStatus = async (agentId) => {
    // Activar/desactivar agente
};

const exportAgents = () => {
    // Exportar datos a CSV/Excel
};
```

### Interacción UI
```javascript
// Event listeners
const setupEventListeners = () => {
    // Filtros
    document.querySelectorAll('.filter-select').forEach(select => {
        select.addEventListener('change', handleFilterChange);
    });
    
    // Búsqueda
    document.querySelector('.search-input').addEventListener('input', handleSearch);
    
    // Botones de acción
    document.querySelectorAll('.btn-action').forEach(btn => {
        btn.addEventListener('click', handleActionClick);
    });
};
```

## 📊 Integración con API

### Endpoints Requeridos
```
GET    /api/admin/agents                    // Listar todos los agentes
GET    /api/admin/agents/:id               // Detalle de agente específico
PUT    /api/admin/agents/:id               // Actualizar agente
POST   /api/admin/agents/:id/toggle      // Activar/desactivar
GET    /api/admin/agents/stats            // Estadísticas globales
GET    /api/admin/agents/export           // Exportar datos
GET    /api/admin/users/:userId/agents    // Agentes por usuario
```

### Formatos de Respuesta
```json
{
  "agents": [
    {
      "id": "agent_123",
      "name": "Trading Bot Pro",
      "userId": "user_456",
      "userName": "Juan Pérez",
      "status": "active",
      "type": "trading",
      "credits": 1250,
      "performance": 78.5,
      "lastActivity": "2024-01-14T10:30:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "stats": {
    "totalAgents": 1247,
    "activeAgents": 892,
    "totalCredits": 45230,
    "averagePerformance": 73.5
  }
}
```

## 🚨 Consideraciones de Seguridad

### Autenticación y Autorización
- [ ] Verificar permisos de administrador
- [ ] Implementar rate limiting
- [ ] Validar todas las entradas
- [ ] Auditoría de acciones administrativas

### Protección de Datos
- [ ] Encriptar datos sensibles
- [ ] No exponer información de usuarios innecesaria
- [ ] Implementar logs de auditoría
- [ ] Cumplir con GDPR/privacidad

## 🔄 Estados del Agente

### Estados Posibles
- **Activo**: Funcionando normalmente
- **Inactivo**: Pausado por usuario o sistema
- **Suspendido**: Bloqueado por violación de términos
- **Error**: Fallo técnico detectado
- **Mantenimiento**: Actualización en progreso

### Transiciones de Estado
```
Activo → Inactivo (pausar)
Activo → Suspendido (sancionar)
Inactivo → Activo (reanudar)
Suspendido → Inactivo (revisar)
Error → Activo (reparar)
```

## 📈 Métricas y KPIs

### Métricas Principales
1. **Total de Agentes**: Número absoluto
2. **Tasa de Activación**: % de agentes activos
3. **Consumo de Créditos**: Promedio por agente
4. **Rendimiento**: % de efectividad
5. **Tiempo de Actividad**: Disponibilidad del sistema

### Alertas Automáticas
- [ ] Agentes con rendimiento < 50%
- [ ] Consumo excesivo de créditos
- [ ] Inactividad prolongada (> 7 días)
- [ ] Anomalías en patrones de uso

## 🧪 Testing

### Casos de Prueba
- [ ] Carga de lista con 1000+ agentes
- [ ] Filtros combinados funcionando
- [ ] Exportación de grandes volúmenes
- [ ] Respuesta en < 2 segundos
- [ ] Accesibilidad con screen readers

### Validaciones
- [ ] Permisos de administrador
- [ ] Validación de formularios
- [ ] Manejo de errores de API
- [ ] Compatibilidad cross-browser

## 📚 Recursos

### Archivos Relacionados
- `agents_hub.html` (vista de usuario)
- `admin-dashboard.html` (dashboard principal)
- `admin-users.html` (gestión de usuarios)
- `PALETA-COLORES.md` (esquema de colores)

### Tecnologías Recomendadas
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Gráficos**: Chart.js o D3.js
- **Tablas**: DataTables.js o implementación custom
- **Estilos**: CSS Grid + Flexbox

---

## 📝 Notas de Implementación

### Prioridades de Desarrollo
1. **Fase 1**: Vista general y lista de agentes
2. **Fase 2**: Filtros, búsqueda y ordenamiento
3. **Fase 3**: Gestión individual de agentes
4. **Fase 4**: Exportación y reportes
5. **Fase 5**: Alertas y notificaciones

### Decisiones de Diseño
- Mantener consistencia con otros módulos admin
- Priorizar funcionalidad sobre estética
- Optimizar para grandes volúmenes de datos
- Implementar lazy loading si es necesario

### Próximos Pasos
1. Crear archivo HTML base con estructura
2. Implementar CSS con estilos admin
3. Desarrollar funcionalidad JavaScript
4. Integrar con API del backend
5. Testing y validación
6. Documentación de usuario final

---

**✨ Estado**: Documentación completa - Listo para implementación  
**🎯 Siguiente**: Crear archivo HTML base
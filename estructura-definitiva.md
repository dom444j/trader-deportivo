# 📁 Estructura Definitiva - Trader Deportivo

## 📋 PRINCIPIO DE ARQUITECTURA

Este proyecto usa **Next.js App Router** con segmentación por zonas funcionales.

El objetivo principal de la arquitectura es:
- ✅ **Evitar duplicación de rutas**
- ✅ **Evitar contaminación de estilos (CSS bleeding)**
- ✅ **Permitir crecimiento del dashboard sin romper landing o auth**
- ✅ **Separar claramente público, autenticación y aplicación**

**⚠️ ESTE DOCUMENTO ES LA FUENTE DE VERDAD ABSOLUTA.**

Si una carpeta o ruta no está definida aquí, **NO PUEDE SER CREADA**.
Queda estrictamente prohibido que cualquier herramienta (incluyendo IA) cree estructuras alternativas.

---

## 🚫 PROHIBICIONES

### Está estrictamente prohibido crear:
- `src/app/(app)`
- `src/app/main`
- `src/app/private`
- `src/app/dashboard` fuera de `(dashboard)`
- `apps/web/app` fuera de `src/`
- **Cualquier duplicado de app router fuera de `src/app`**

### Solo se permiten los siguientes route groups:
- ✅ `(marketing)`
- ✅ `(auth)`
- ✅ `(dashboard)`

**No se permiten más route groups.**

---

## 🔐 AUTENTICACIÓN

### Las rutas quedan DEFINIDAS así:
- `/login` → Login unificado para Usuario y Tipster (incluye selector de rol)
- `/admin/login` → Login exclusivo de administradores
- `/register` → Registro de usuario
- `/forgot-password` → Recuperación de contraseña

### IMPORTANTE:
- `/admin/login` **NO pertenece al dashboard**
- `/admin/login` **pertenece al grupo `(auth)`**
- **Nunca debe existir login de admin dentro de `(dashboard)`**

---

## 🏠 LANDING

La landing principal del proyecto es:
**`/`**

Por lo tanto:
- `src/app/(marketing)/page.tsx` representa la página raíz
- **NO debe existir `/landing` como ruta pública duplicada**

---

## 📊 DASHBOARD

El dashboard pertenece **exclusivamente** al grupo:
**`src/app/(dashboard)/`**

### Las rutas quedan:
- `/user` → Panel de usuario
- `/tipster` → Panel de tipster  
- `/admin` → Panel administrativo

**Ningún componente del dashboard puede renderizarse en `(marketing)` ni en `(auth)`**

---

## 🎨 AISLAMIENTO DE ESTILOS

Los estilos se cargan **por zona**:

### Root Layout:
- `globals.css` → solo tokens, base y utilidades

### Marketing Layout:
- `marketing.css` → solo landing pública

### Auth Layout:
- `auth.css` → login, registro y recuperación

### Dashboard Layout:
- `app.css` → sidebar, topbar y layout de la app

### Está prohibido:
- ❌ usar estilos de marketing dentro del dashboard
- ❌ usar estilos de auth en landing
- ❌ usar estilos globales para inputs de dashboard

### Los formularios del dashboard deben usar:
- CSS Modules, o
- components/styles propios

---

## 🔒 PROTECCIÓN DE RUTAS

### Middleware requirements:
- `/dashboard`, `/user`, `/tipster` y `/admin` **requieren sesión válida**
- Si no existe sesión: → **redirigir a `/login`**
- Rutas `/admin` **requieren rol admin**
- Si el rol no es admin: → **redirigir a `/login`**
- `/auth` y `/` (landing) **siempre deben ser públicas**

---

## 🤖 REGLA PARA GENERACIÓN AUTOMÁTICA

### Cualquier código generado debe:
1. ✅ **respetar exactamente esta estructura**
2. ❌ **no crear nuevas carpetas en `src/app`**
3. ❌ **no crear nuevos route groups**
4. ❌ **no mover páginas fuera de su grupo**

### Si una nueva funcionalidad requiere organización adicional:
**Debe hacerse dentro de:**
- `components/`
- `lib/`
- `services/`
- `types/`
- `styles/components/`

**pero NUNCA dentro de `src/app`**

---

## 📁 Estructura de Carpetas

```
trader-deportivo/
├── README.md
├── package.json                    # Configuración monorepo
├── pnpm-workspace.yaml
├── turbo.json
├── .gitignore
├── .env.example
│
├── apps/
│   └── web/                        # Next.js App Router (TypeScript + TailwindCSS)
│       ├── .env.local
│       ├── next.config.js
│       ├── tsconfig.json
│       ├── tailwind.config.ts
│       ├── postcss.config.js
│       ├── package.json
│       │
│       ├── public/                 # Assets estáticos
│       │   ├── brand/
│       │   │   ├── logo.svg
│       │   │   ├── logo-dark.svg
│       │   │   └── favicon.ico
│       │   ├── icons/
│       │   └── images/
│       │
│       ├── prisma/                 # Schema de base de datos
│       │   ├── schema.prisma
│       │   ├── seed.ts
│       │   └── migrations/
│       │
│       └── src/
│           ├── middleware.ts       # Protección de rutas y redirecciones
│           │
│           ├── app/                # Next.js App Router
│           │   ├── layout.tsx      # Root layout (globals.css + providers)
│           │   ├── page.tsx        # Redirección a /landing o dashboard según auth
│           │   ├── not-found.tsx   # Página 404
│           │   │
│           │   ├── (marketing)/    # Área pública (Landing + páginas informativas)
│           │   │   ├── layout.tsx  # Layout marketing (header/footer público)
│           │   │   ├── landing/
│           │   │   │   └── page.tsx         # / (landing principal)
│           │   │   ├── about/
│           │   │   │   └── page.tsx         # /about
│           │   │   ├── pricing/
│           │   │   │   └── page.tsx         # /pricing
│           │   │   ├── features/
│           │   │   │   └── page.tsx         # /features
│           │   │   ├── contact/
│           │   │   │   └── page.tsx         # /contact
│           │   │   └── terms/
│           │   │       ├── page.tsx         # /terms (términos)
│           │   │       └── privacy/
│           │   │           └── page.tsx     # /terms/privacy
│           │   │
│           │   ├── (auth)/         # Área de autenticación
│           │   │   ├── layout.tsx  # Layout auth (centrado, sin navbar)
│           │   │   ├── login/
│           │   │   │   └── page.tsx         # /login (Usuario + Tipster con selector)
│           │   │   ├── register/
│           │   │   │   └── page.tsx         # /register
│           │   │   ├── forgot-password/
│           │   │   │   └── page.tsx         # /forgot-password
│           │   │   ├── reset-password/
│           │   │   │   └── page.tsx         # /reset-password
│           │   │   └── admin/
│           │   │       └── login/
│           │   │           └── page.tsx     # /admin/login (SOLO admin)
│           │   │
│           │   ├── (dashboard)/    # Área protegida (Dashboards)
│           │   │   ├── layout.tsx  # Layout dashboard (sidebar + topbar)
│           │   │   │
│           │   │   ├── user/       # Dashboard Usuario
│           │   │   │   ├── page.tsx                    # /user (overview)
│           │   │   │   ├── signals/
│           │   │   │   │   ├── page.tsx                # /user/signals
│           │   │   │   │   └── [id]/
│           │   │   │   │       └── page.tsx            # /user/signals/[id]
│           │   │   │   ├── agents/
│           │   │   │   │   ├── page.tsx                # /user/agents (seguir agentes)
│           │   │   │   │   └── [id]/
│           │   │   │   │       └── page.tsx            # /user/agents/[id]
│           │   │   │   ├── tipsters/
│           │   │   │   │   ├── page.tsx                # /user/tipsters
│           │   │   │   │   └── [id]/
│           │   │   │   │       └── page.tsx            # /user/tipsters/[id]
│           │   │   │   ├── bankroll/
│           │   │   │   │   └── page.tsx                # /user/bankroll
│           │   │   │   ├── history/
│           │   │   │   │   └── page.tsx                # /user/history
│           │   │   │   ├── referrals/
│           │   │   │   │   └── page.tsx                # /user/referrals
│           │   │   │   └── settings/
│           │   │   │       └── page.tsx                # /user/settings
│           │   │   │
│           │   │   ├── tipster/    # Dashboard Tipster
│           │   │   │   ├── page.tsx                    # /tipster (overview)
│           │   │   │   ├── picks/
│           │   │   │   │   ├── page.tsx                # /tipster/picks (mis picks)
│           │   │   │   │   └── create/
│           │   │   │   │       └── page.tsx            # /tipster/picks/create
│           │   │   │   ├── performance/
│           │   │   │   │   └── page.tsx                # /tipster/performance
│           │   │   │   ├── followers/
│           │   │   │   │   └── page.tsx                # /tipster/followers
│           │   │   │   ├── earnings/
│           │   │   │   │   └── page.tsx                # /tipster/earnings
│           │   │   │   └── settings/
│           │   │   │       └── page.tsx                # /tipster/settings
│           │   │   │
│           │   │   └── admin/      # Dashboard Admin
│           │   │       ├── page.tsx                    # /admin (overview)
│           │   │       ├── dashboard/
│           │   │       │   └── page.tsx                # /admin/dashboard (métricas)
│           │   │       ├── users/
│           │   │       │   ├── page.tsx                # /admin/users
│           │   │       │   └── [id]/
│           │   │       │       └── page.tsx            # /admin/users/[id]
│           │   │       ├── tipsters/
│           │   │       │   ├── page.tsx                # /admin/tipsters
│           │   │       │   └── [id]/
│           │   │       │       └── page.tsx            # /admin/tipsters/[id]
│           │   │       ├── agents/
│           │   │       │   ├── page.tsx                # /admin/agents
│           │   │       │   ├── create/
│           │   │       │   │   └── page.tsx            # /admin/agents/create
│           │   │       │   └── [id]/
│           │   │       │       ├── page.tsx            # /admin/agents/[id]
│           │   │       │       └── edit/
│           │   │       │           └── page.tsx        # /admin/agents/[id]/edit
│           │   │       ├── signals/
│           │   │       │   ├── page.tsx                # /admin/signals
│           │   │       │   └── [id]/
│           │   │       │       └── page.tsx            # /admin/signals/[id]
│           │   │       ├── payments/
│           │   │       │   └── page.tsx                # /admin/payments
│           │   │       ├── referrals/
│           │   │       │   └── page.tsx                # /admin/referrals
│           │   │       ├── settings/
│           │   │       │   ├── page.tsx                # /admin/settings
│           │   │       │   ├── general/
│           │   │       │   │   └── page.tsx            # /admin/settings/general
│           │   │       │   └── security/
│           │   │       │       └── page.tsx            # /admin/settings/security
│           │   │       └── reports/
│           │   │           └── page.tsx                # /admin/reports
│           │   │
│           │   └── api/            # API Routes
│           │       ├── auth/
│           │       │   ├── login/
│           │       │   │   └── route.ts
│           │       │   ├── register/
│           │       │   │   └── route.ts
│           │       │   ├── logout/
│           │       │   │   └── route.ts
│           │       │   └── refresh/
│           │       │       └── route.ts
│           │       ├── users/
│           │       │   ├── route.ts                    # GET/POST usuarios
│           │       │   └── [id]/
│           │       │       └── route.ts                # GET/PATCH/DELETE usuario
│           │       ├── signals/
│           │       │   ├── route.ts
│           │       │   └── [id]/
│           │       │       └── route.ts
│           │       ├── agents/
│           │       │   ├── route.ts
│           │       │   └── [id]/
│           │       │       └── route.ts
│           │       ├── webhooks/
│           │       │   ├── stripe/
│           │       │   │   └── route.ts
│           │       │   └── crypto/
│           │       │       └── route.ts
│           │       └── external/
│           │           ├── sportmonks/
│           │           │   └── route.ts
│           │           └── cloudbet/
│           │               └── route.ts
│           │
│           ├── components/         # Componentes React
│           │   ├── ui/             # Componentes base (shadcn/ui)
│           │   │   ├── button.tsx
│           │   │   ├── card.tsx
│           │   │   ├── input.tsx
│           │   │   ├── dialog.tsx
│           │   │   ├── dropdown-menu.tsx
│           │   │   ├── table.tsx
│           │   │   ├── tabs.tsx
│           │   │   └── ...
│           │   │
│           │   ├── shared/         # Componentes compartidos globales
│           │   │   ├── header/
│           │   │   │   ├── public-header.tsx
│           │   │   │   └── dashboard-header.tsx
│           │   │   ├── footer/
│           │   │   │   └── public-footer.tsx
│           │   │   ├── sidebar/
│           │   │   │   ├── user-sidebar.tsx
│           │   │   │   ├── tipster-sidebar.tsx
│           │   │   │   └── admin-sidebar.tsx
│           │   │   ├── loading/
│           │   │   │   ├── spinner.tsx
│           │   │   │   └── skeleton.tsx
│           │   │   └── error/
│           │   │       └── error-boundary.tsx
│           │   │
│           │   ├── marketing/      # Componentes de marketing (landing)
│           │   │   ├── hero.tsx
│           │   │   ├── features-section.tsx
│           │   │   ├── pricing-cards.tsx
│           │   │   ├── testimonials.tsx
│           │   │   ├── cta-section.tsx
│           │   │   └── stats-section.tsx
│           │   │
│           │   ├── auth/           # Componentes de autenticación
│           │   │   ├── login-form.tsx
│           │   │   ├── register-form.tsx
│           │   │   ├── forgot-password-form.tsx
│           │   │   ├── role-selector.tsx
│           │   │   └── admin-login-form.tsx
│           │   │
│           │   └── dashboard/      # Componentes de dashboard
│           │       ├── user/
│           │       │   ├── signals-list.tsx
│           │       │   ├── agents-grid.tsx
│           │       │   ├── bankroll-chart.tsx
│           │       │   └── referral-stats.tsx
│           │       ├── tipster/
│           │       │   ├── picks-table.tsx
│           │       │   ├── performance-chart.tsx
│           │       │   ├── followers-list.tsx
│           │       │   └── earnings-summary.tsx
│           │       └── admin/
│           │           ├── users-table.tsx
│           │           ├── agents-manager.tsx
│           │           ├── signals-monitor.tsx
│           │           ├── payments-table.tsx
│           │           └── analytics-dashboard.tsx
│           │
│           ├── lib/                # Utilidades y configuraciones
│           │   ├── auth/
│           │   │   ├── session.ts
│           │   │   ├── permissions.ts
│           │   │   └── middleware.ts
│           │   ├── db/
│           │   │   ├── prisma.ts
│           │   │   └── queries/
│           │   ├── utils/
│           │   │   ├── cn.ts               # clsx + tailwind-merge
│           │   │   ├── formatters.ts
│           │   │   ├── validators.ts
│           │   │   └── helpers.ts
│           │   ├── hooks/
│           │   │   ├── use-auth.ts
│           │   │   ├── use-user.ts
│           │   │   ├── use-signals.ts
│           │   │   ├── use-agents.ts
│           │   │   └── use-debounce.ts
│           │   ├── config/
│           │   │   ├── site.ts
│           │   │   ├── navigation.ts
│           │   │   └── api.ts
│           │   └── constants/
│           │       ├── roles.ts
│           │       ├── plans.ts
│           │       └── routes.ts
│           │
│           ├── services/           # Servicios y lógica de negocio
│           │   ├── api/
│           │   │   ├── client.ts           # Axios/Fetch configurado
│           │   │   ├── auth-service.ts
│           │   │   ├── user-service.ts
│           │   │   ├── signal-service.ts
│           │   │   ├── agent-service.ts
│           │   │   └── payment-service.ts
│           │   ├── external/
│           │   │   ├── sportmonks.ts
│           │   │   ├── cloudbet.ts
│           │   │   └── stripe.ts
│           │   └── validators/
│           │       └── schemas.ts          # Zod schemas
│           │
│           ├── types/              # Tipos TypeScript
│           │   ├── index.ts
│           │   ├── auth.ts
│           │   ├── user.ts
│           │   ├── signal.ts
│           │   ├── agent.ts
│           │   ├── payment.ts
│           │   └── api.ts
│           │
│           └── styles/             # Estilos globales y CSS
│               ├── globals.css     # Imports: tokens + base + utilities
│               ├── tokens.css      # Variables CSS (colores, spacing, etc)
│               ├── base.css        # Reset + estilos base
│               ├── utilities.css   # Utilities personalizadas
│               ├── marketing.css   # Estilos específicos marketing
│               ├── auth.css        # Estilos específicos auth
│               ├── dashboard.css   # Estilos específicos dashboard
│               └── components/     # CSS Modules opcionales
│                   └── [component].module.css
│
├── packages/
│   ├── shared/                     # Código compartido entre apps
│   │   ├── types/                  # Tipos compartidos
│   │   │   ├── index.ts
│   │   │   ├── user.ts
│   │   │   ├── signal.ts
│   │   │   └── agent.ts
│   │   ├── utils/                  # Utilidades compartidas
│   │   │   ├── validators.ts
│   │   │   └── formatters.ts
│   │   ├── constants/              # Constantes compartidas
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── eslint-config/              # Configuración ESLint compartida
│       ├── index.js
│       └── package.json
│
├── docs/                           # Documentación del proyecto
│   ├── ARCHITECTURE.md             # ✅ Arquitectura del sistema
│   ├── INFRASTRUCTURE.md
│   ├── agents-hub.md
│   ├── ui/
│   │   ├── navigation/
│   │   ├── sidebars/
│   │   ├── vista-modulos/
│   │   ├── REFERIDOS-EQUIPO-COMPENSACION.md
│   │   └── ...
│   └── api/
│       └── endpoints.md
│
└── scripts/                        # Scripts de utilidad
    ├── setup.sh                    # Setup inicial del proyecto
    ├── seed-db.ts                  # Seed de base de datos
    └── migrate.sh                  # Migraciones
```

---

## 🎯 Explicación de la Estructura

### **1. Separación Clara de Áreas**

#### **(marketing)** - Área Pública
- Landing page, About, Pricing, Contact, Terms
- Layout: Header/Footer público
- CSS: `marketing.css`
- Acceso: **Público (no autenticado)**

#### **(auth)** - Autenticación
- `/login` → Usuario + Tipster (selector de rol)
- `/admin/login` → SOLO Admin (separado)
- `/register`, `/forgot-password`, `/reset-password`
- Layout: Centrado, sin navbar
- CSS: `auth.css`
- Acceso: **Público (redirige si ya autenticado)**

#### **(dashboard)** - Dashboards Protegidos
- `/user/*` → Dashboard Usuario
- `/tipster/*` → Dashboard Tipster
- `/admin/*` → Dashboard Admin
- Layout: Sidebar + Topbar
- CSS: `dashboard.css`
- Acceso: **Protegido (require autenticación + rol)**

---

### **2. Rutas de Login Diferenciadas**

```
/login              → Usuarios y Tipsters (con selector de rol)
/admin/login        → SOLO Administradores (login separado)
```

**Flujo de autenticación:**
1. Usuario/Tipster → `/login` → Selector de rol → Redirige a `/user` o `/tipster`
2. Admin → `/admin/login` → Login directo → Redirige a `/admin`

---

### **3. Estructura de CSS Modular**

```css
/* globals.css - Solo imports */
@import './tokens.css';
@import './base.css';
@import './utilities.css';

/* (marketing)/layout.tsx */
import '@/styles/marketing.css'

/* (auth)/layout.tsx */
import '@/styles/auth.css'

/* (dashboard)/layout.tsx */
import '@/styles/dashboard.css'
```

**Resultado:**
- ✅ Marketing: tokens + base + utilities + marketing.css
- ✅ Auth: tokens + base + utilities + auth.css
- ✅ Dashboard: tokens + base + utilities + dashboard.css
- ✅ Sin CSS innecesario en cada página

---

### **4. Middleware de Protección**

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = getSession(request)

  // Proteger rutas de dashboard
  if (pathname.startsWith('/user') && session?.role !== 'USER') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.startsWith('/tipster') && session?.role !== 'TIPSTER') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.startStart('/admin') && pathname !== '/admin/login') {
    if (session?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Redirigir si ya está autenticado
  if ((pathname === '/login' || pathname === '/admin/login') && session) {
    const redirectTo = session.role === 'ADMIN' ? '/admin' : 
                       session.role === 'TIPSTER' ? '/tipster' : '/user'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }
}
```

---

### **5. Sin Grupos Innecesarios**

❌ **Antes (estructura antigua):**
```
src/app/(app)/dashboard/  ← Innecesario
src/app/dashboard/        ← Duplicado
```

✅ **Ahora (estructura definitiva):**
```
src/app/(dashboard)/user/
src/app/(dashboard)/tipster/
src/app/(dashboard)/admin/
```

**Solo 3 grupos:**
1. `(marketing)` → Público
2. `(auth)` → Autenticación
3. `(dashboard)` → Protegido

---

### **6. Componentes Organizados por Dominio**

```
components/
├── ui/           → Componentes base reutilizables (shadcn/ui)
├── shared/       → Compartidos globales (header, footer, sidebar)
├── marketing/    → Específicos de landing/marketing
├── auth/         → Específicos de autenticación
└── dashboard/    → Específicos de dashboards
    ├── user/
    ├── tipster/
    └── admin/
```

---

### **7. Servicios y Tipos Centralizados**

```
services/api/
├── client.ts          → Axios/Fetch configurado
├── auth-service.ts    → Login, register, logout
├── user-service.ts    → CRUD usuarios
├── signal-service.ts  → Señales
└── agent-service.ts   → Agentes IA

types/
├── auth.ts    → Session, LoginPayload, RegisterPayload
├── user.ts    → User, UserRole, UserProfile
├── signal.ts  → Signal, SignalType, SignalStatus
└── agent.ts   → Agent, AgentConfig, AgentPerformance
```

---

## 📋 Reglas de Desarrollo

### **1. No crear carpetas fuera de esta estructura**
- Si necesitas algo nuevo, consulta primero
- No añadas `(app)`, `(main)` u otros grupos innecesarios

### **2. CSS por Layout, no por página**
- Marketing → `marketing.css`
- Auth → `auth.css`
- Dashboard → `dashboard.css`
- No importes CSS en cada `page.tsx`

### **3. Componentes específicos en su carpeta**
- Marketing → `components/marketing/`
- Auth → `components/auth/`
- Dashboard Usuario → `components/dashboard/user/`
  - Nuevo: `TopStatsGrid.tsx` (grid superior de 9 KPIs)
- Dashboard Tipster → `components/dashboard/tipster/`
- Dashboard Admin → `components/dashboard/admin/`

### **4. API Routes organizadas por dominio**
```
api/auth/                    → Autenticación
api/users/                   → CRUD usuarios
api/user/dashboard/kpis      → KPIs principales del dashboard de usuario (alias de users/kpis)
api/signals/                 → Señales
api/agents/                  → Agentes
api/webhooks/                → Webhooks externos
api/external/                → APIs externas
```

### **5. Tipos compartidos en `packages/shared`**
- Si un tipo se usa en frontend Y backend → `packages/shared/types/`
- Si solo se usa en frontend → `apps/web/src/types/`

---

## ✅ Esta es la Estructura Final

**NO añadas:**
- ❌ `(app)` o grupos adicionales
- ❌ CSS en cada página
- ❌ Componentes en `src/app/`
- ❌ Rutas duplicadas

**SÍ usa:**
- ✅ Esta estructura exacta
- ✅ CSS modular por layout
- ✅ Componentes organizados por dominio
- ✅ Middleware para protección
- ✅ Servicios centralizados

---

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm dev

# Build
pnpm build

# Migrations
pnpm prisma:migrate

# Seed DB
pnpm prisma:seed

# Type checking
pnpm type-check

# Linting
pnpm lint

# Testing
pnpm test
```

---

**Última actualización:** 2024-02-14  
**Versión:** 1.0.0 (Definitiva - Sin cambios futuros)

---

## 📊 Progreso de Implementación

### ✅ Completado
- [x] **Estructura base de carpetas** - Organización por dominios (marketing, auth, dashboard)
- [x] **Login unificado** - `/login` con selector de rol (usuario/tipster)
- [x] **Login admin** - `/admin/login` con diseño específico
- [x] **Panel administrativo** - `/admin` con sidebar y KPIs principales
- [x] **Tipos de navegación** - Interfaces `NavItem` y `NavigationConfig` en `packages/shared`
- [x] **Navegación por roles** - `adminNav`, `userNav`, `tipsterNav` con estructura tipada
- [x] **Sidebar admin** - Componente funcional con navegación correcta
- [x] **Resolución de conflictos de rutas** - Eliminados duplicados en `(dashboard)/admin/`
- [x] **Corrección de errores TypeScript** - Todos los errores de tipos resueltos

### 🚧 En Progreso
- [ ] **Dashboard de usuario** - `/user` con funcionalidades específicas
- [ ] **Dashboard de tipster** - `/tipster` con herramientas de creación de señales
- [ ] **Estilos genéricos del dashboard** - CSS base para todos los dashboards
- [ ] **Sistema de autenticación** - Integración con backend y middleware de protección

### 📋 Pendiente
- [ ] **Protección de rutas** - Middleware para autenticación y autorización por roles
- [ ] **Gestión de usuarios** - CRUD completo en panel admin
- [ ] **Gestión de señales** - Sistema de aprobación y revisión
- [ ] **Sistema de pagos** - Integración con pasarela de pagos
- [ ] **Agentes IA** - Implementación del sistema de agentes de trading
- [ ] **Notificaciones** - Sistema de alertas y notificaciones en tiempo real

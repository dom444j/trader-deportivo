# Estructura de carpetas de `apps/web/src`

Generado automáticamente a partir del estado actual del proyecto.

```
├── app\
│   ├── (auth)\
│   │   ├── admin\
│   │   │   └── login\
│   │   │       └── page.tsx
│   │   ├── forgot-password\
│   │   ├── layout.tsx
│   │   ├── login\
│   │   │   └── page.tsx
│   │   └── signup\
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── (dashboard)\
│   │   ├── admin\
│   │   │   ├── page.tsx
│   │   │   └── users\
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   ├── tipster\
│   │   │   └── page.tsx
│   │   └── user\
│   │       ├── UserDashboard.module.css
│   │       ├── dashboard\
│   │       │   └── page.tsx
│   │       └── page.tsx
│   ├── (marketing)\
│   │   ├── landing\
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api\
│   │   ├── auth\
│   │   │   ├── check-session\
│   │   │   ├── login\
│   │   │   │   └── route.ts
│   │   │   └── logout\
│   │   │       └── route.ts
│   │   ├── events\
│   │   │   └── upcoming\
│   │   │       └── route.ts
│   │   ├── signals\
│   │   │   └── active\
│   │   │       └── route.ts
│   │   ├── user\
│   │   │   ├── alerts\
│   │   │   │   └── route.ts
│   │   │   ├── bankroll\
│   │   │   │   └── current\
│   │   │   ├── dashboard\
│   │   │   │   └── kpis\
│   │   │   ├── discipline\
│   │   │   │   └── score\
│   │   │   ├── drawdown\
│   │   │   │   └── current\
│   │   │   ├── pnl\
│   │   │   │   └── summary\
│   │   │   └── progress\
│   │   │       └── route.ts
│   │   └── users\
│   │       └── kpis\
│   │           └── route.ts
│   ├── dashboard\
│   │   └── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components\
│   ├── admin\
│   ├── auth\
│   ├── dashboard\
│   │   ├── admin\
│   │   │   └── Sidebar.tsx
│   │   └── user\
│   │       ├── BankPlanContributions.tsx
│   │       ├── ExecutiveHeader.tsx
│   │       ├── PerformanceOverview.tsx
│   │       ├── RecentSignals.module.css
│   │       ├── RecentSignals.tsx
│   │       ├── RecommendedSignalsNow.module.css
│   │       ├── RecommendedSignalsNow.tsx
│   │       └── TopStatsGrid.tsx
│   ├── marketing\
│   │   ├── FAQ.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Navbar.tsx
│   │   ├── Pricing.tsx
│   │   ├── Referrals.tsx
│   │   ├── RiskResponsible.tsx
│   │   ├── SectionContainer.tsx
│   │   ├── Showcase.tsx
│   │   ├── SocialProof.tsx
│   │   └── ValueProps.tsx
│   ├── shared\
│   │   ├── header\
│   │   │   ├── DashboardTopbar.module.css
│   │   │   └── DashboardTopbar.tsx
│   │   ├── layout\
│   │   │   ├── DashboardShell.module.css
│   │   │   ├── DashboardShell.tsx
│   │   │   ├── PageFrame.module.css
│   │   │   └── PageFrame.tsx
│   │   └── sidebar\
│   │       ├── AppSidebar.module.css
│   │       └── AppSidebar.tsx
│   └── ui\
│       ├── Wordmark.tsx
│       └── icons.tsx
├── lib\
│   ├── auth\
│   ├── auth.ts
│   ├── config\
│   │   └── navigation.ts
│   ├── constants\
│   ├── db\
│   ├── hooks\
│   ├── user-dashboard-data.ts
│   ├── user-kpis.ts
│   └── utils\
├── middleware.ts
├── navigation\
│   ├── adminNav.ts
│   ├── index.ts
│   ├── tipsterNav.ts
│   └── userNav.ts
├── services\
├── styles\
│   ├── app-backup.css
│   ├── app.css
│   ├── auth.css
│   ├── base.css
│   ├── components\
│   ├── globals.css
│   ├── marketing.css
│   ├── tokens.css
│   ├── utilities.css
│   └── variables.css
└── types\
    ├── user-dashboard-extra.ts
    └── user-dashboard.ts
```

— Para actualizar este documento, pídeme regenerarlo en cualquier momento.
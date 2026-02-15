trading-deportivo/
├── 📄 Documentación y Archivos de Configuración
│   ├── *.md (múltiples archivos de documentación)
│   ├── package.json (monorepo)
│   ├── package-lock.json
│   ├── globals.css
│   ├── serve.ps1
│   └── archivos HTML/SVG varios
│
├── 📁 apps/
│   └── 📁 web/ (Next.js App)
│       ├── 📁 .next/ (build output)
│       ├── 📁 public/ (assets estáticos)
│       │   ├── 📁 brand/
│       │   └── *.svg
│       ├── 📁 prisma/ (migraciones DB)
│       ├── 📁 scripts/
│       ├── 📁 src/
│       │   ├── 📁 app/ (Next.js App Router)
│       │   │   ├── 📁 (app)/ (área de aplicación)
│       │   │   │   ├── 📁 admin/
│       │   │   │   ├── 📁 app/
│       │   │   │   ├── 📁 dashboard/
│       │   │   │   ├── 📁 tipster/
│       │   │   │   └── 📁 users/
│       │   │   ├── 📁 (auth)/ (autenticación)
│       │   │   │   ├── 📁 admin/login/
│       │   │   │   ├── 📁 forgot-password/
│       │   │   │   ├── 📁 login/
│       │   │   │   └── 📁 signup/
│       │   │   ├── 📁 (marketing)/ (landing page)
│       │   │   ├── 📁 api/ (rutas API)
│       │   │   ├── 📁 admin/
│       │   │   ├── 📁 tipster/
│       │   │   └── 📁 user/
│       │   ├── 📁 components/
│       │   │   ├── 📁 admin/
│       │   │   └── 📁 landing/
│       │   ├── 📁 lib/
│       │   ├── 📁 navigation/
│       │   ├── 📁 pages/
│       │   └── 📁 styles/
│       ├── 📄 next.config.js
│       ├── 📄 tsconfig.json
│       └── 📄 package.json
│
├── 📁 packages/
│   └── 📁 shared/
│       ├── 📁 types/
│       └── 📄 package.json
│
└── 📁 docs/
    ├── 📁 ui/
    │   ├── 📁 navigation/
    │   ├── 📁 sidebars/
    │   ├── 📁 vista-modulos/
    │   └── *.md
    └── *.md
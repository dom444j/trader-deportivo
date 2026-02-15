# Trader Deportivo — Landing Page Spec (v2)

Dominio oficial: traderdeportivo.co

Basado en: <mcfile name="ARCHITECTURE.md" path="c:\Users\DOM\Desktop\trading-deportivo\ARCHITECTURE.md"></mcfile> <mcfile name="API-SPEC.md" path="c:\Users\DOM\Desktop\trading-deportivo\API-SPEC.md"></mcfile> <mcfile name="PALETA-COLORES.md" path="c:\Users\DOM\Desktop\trading-deportivo\PALETA-COLORES.md"></mcfile> <mcfile name="trading_deportivo_v2_horizontal.svg" path="c:\Users\DOM\Desktop\trading-deportivo\files\trading_deportivo_v2_horizontal.svg"></mcfile>

## Índice
- 1. Objetivo y Audiencias
- 2. Arquitectura de Página (Folds)
- 3. Componentes Clave y Contenido
- 4. Mapeo de Rutas y CTAs
- 5. SEO & Performance
- 6. Analítica & Tracking
- 7. A/B Testing
- 8. Guías de Copy & Branding
- 9. Referencias

---

## 1) Objetivo y Audiencias
- Objetivo: Presentar la propuesta de valor (IA + expertos humanos) y convertir visitantes en registros y suscriptores.
- Audiencias: Bettors (usuarios finales), Tipsters (pronosticadores), Inversores/partners.
- Nota de visibilidad UX: El enlace "Soporte" no se muestra en la landing; el acceso a soporte se habilita tras el login dentro del dashboard para mantener el foco en conversión y reducir distracciones.

---

## 2) Arquitectura de Página (Folds)
- Fold 0 (Above the Fold): Navbar sticky, Hero (headline + subheadline), CTA primario, visual/video, trust badges, live ticker.
- Fold 1 (UVPs): Problema → Solución con 3 UVPs, comparación visual.
- Fold 2 (Cómo funciona): Timeline 3 pasos + CTA "Ver en acción".
- Fold 3 (Showcase): Tabs/scroll: Agentes IA, Tipsters, Trader Master, screenshots con anotaciones.
- Fold 4 (Social Proof): Testimonios, métricas animadas, sellos de confianza.
- Fold 5 (Pricing): 3 planes, "Más popular", badge descuento anual, "Cancel anytime".
- Fold 6 (Riesgo): Compromiso de Juego Responsable, features de seguridad, calculadora bankroll, badges regulatorios.
- Fold 7 (FAQ): Acordeón 8-10 preguntas, objeciones comunes, enlace a base de conocimiento.
- Fold 8 (CTA final & Footer): Mensaje cierre, doble CTA, navegación footer, legal/compliance.

---

## 3) Componentes Clave y Contenido

### 3.1 Navbar (Sticky)
- Estructura: Logo (link `/`), enlaces: Señales, Tipsters, Precios, Referidos, Login, Sign Up.
- Interacciones: Blur en scroll, hover con subrayado gradiente, menú móvil.
- Nota: El enlace "Soporte" no se muestra en la landing; estará disponible dentro del dashboard.
- Razonamiento UX: ocultar "Soporte" en la landing reduce distracciones, evita desvíos de intención (sesiones de soporte no orientadas a conversión) y mantiene foco en CTAs principales (Empieza gratis / Ver planes); el acceso a soporte se habilita luego del login dentro del dashboard.

### 3.2 Hero
- Headline (opciones):
  - "Señales EV+ verificadas por IA + expertos humanos"
  - "Convierte datos en ganancias consistentes"
  - "Trading deportivo con control de riesgo profesional"
- Subcopy: "Gestión profesional de bankroll, señales calibradas y copy-trade con protección automática de riesgo".
- CTAs: "Empieza gratis" (primario) y "Ver planes" (secundario).
- Trust badges: "Regulado Latam", "1,200+ traders activos", "Juego Responsable", "Pagos USDT/BTC".
- Visual: Dashboard/Video demo 30s, ticker de métricas.

### 3.3 UVPs
- Señales calibradas (EV+, Brier, CLV) por IA + tipsters verificados.
- Gestión de riesgo: Kelly, límites automáticos, alertas, autoexclusión.
- Copy-trade con control de stake y correlación; latencia <50ms (Edge).

### 3.4 Cómo funciona (3 pasos)
1. Selecciona tu licencia (Básica $9.99, Pro $29.99, Premium $79.99).
2. Sigue agentes IA o tipsters con track record verificado.
3. Opera con protección (Observación / Semi-auto / Auto).

### 3.5 Showcase: Agentes IA, Tipsters, Trader Master
- Cards con métricas: Win rate, EV promedio, CLV, Calibración (Brier), última señal.
- Badges PRE/LIVE, indicador de estado, actualización en tiempo real.

### 3.6 Pricing
- Tabla comparativa de 3 planes; destaca "Pro" como más popular.
- Riesgo revertido: prueba gratis / cancelar en cualquier momento.

### 3.7 Riesgo & Juego Responsable
- Límites automáticos, autoexclusión, alertas tempranas, dashboard de hábitos.
- Badges de cumplimiento (Coljuegos y Latam).

### 3.8 Testimonios & Métricas
- Carrusel de testimonios; KPIs (retención, EV+, CLV) con contadores.

### 3.9 FAQ
- Verificación tipsters, licencias, créditos, políticas de juego responsable, pagos & KYC.

### 3.10 CTA Final & Footer
- Doble CTA: "Empieza gratis" + "Ver planes".
- Footer: Juego Responsable, Términos, Privacidad, Integraciones, Redes.
- Razonamiento UX: No mostrar "Soporte" en el footer de la landing mantiene el foco en conversión y reduce distracciones; el acceso a soporte se ofrece tras el login en el dashboard.

---

## 4) Mapeo de Rutas y CTAs
- Rutas Next.js: `/`, `/pricing`, `/credits`, `/referrals`, `/tipsters`, `/agents`, `/trader-master`, `/responsible-gaming`, `/faq`.
- CTAs principales:
  - Empieza gratis → `/signup` en traderdepotivo.co
  - Ver planes → `/pricing`
  - Comprar créditos → `/credits`
  - Ver Trader Master → `/trader-master`

---

## 5) SEO & Performance
- Meta: título descriptivo, descripción orientada a valor; Open Graph con visual del hero.
- Keywords: trading deportivo, señales EV+, IA apuestas, gestión de bankroll, tipsters verificados.
- Performance: objetivos Lighthouse (90+), optimización imágenes/video, lazy load, prefetch rutas.

---

## 6) Analítica & Tracking
- Eventos clave: view_hero, click_cta_primary, click_pricing, view_agents, start_signup, checkout_start.
- UTM en campañas; consentimiento de cookies; integración con Analytics/Tag Manager.

---

## 7) A/B Testing
- Variantes de headline (data/beneficio/riesgo).
- CTA primario: "Empieza gratis" vs "Prueba 7 días gratis".
- Destacado de plan: Pro vs Premium.

---

## 8) Guías de Copy & Branding
- Tono: profesional, claro, orientado a control de riesgo y valor.
- Evitar jerga técnica; usar métricas comprensibles (win rate, EV+, CLV).
- Coherencia visual con paleta y assets.

---

## 9) Referencias
- Arquitectura, roles, monetización y agentes: <mcfile name="ARCHITECTURE.md" path="c:\Users\DOM\Desktop\trading-deportivo\ARCHITECTURE.md"></mcfile>
- Definición funcional del módulo Agents Hub: <mcfile name="agents-hub.md" path="c:\Users\DOM\Desktop\trading-deportivo\agents-hub.md"></mcfile>
- Especificaciones de API (consistencia futura): <mcfile name="API-SPEC.md" path="c:\Users\DOM\Desktop\trading-deportivo\API-SPEC.md"></mcfile>
- Paleta de colores y branding: <mcfile name="PALETA-COLORES.md" path="c:\Users\DOM\Desktop\trading-deportivo\PALETA-COLORES.md"></mcfile>

## Estado actual de la UI (Feb 2026)
- Tipografía responsiva global para h1, h2 y h3 mediante clamp; hero-title y hero-sub ajustados para móviles
- Scrollbar temático oscuro-azul integrado globalmente (scrollbar-width/scrollbar-color y ::-webkit-scrollbar)
- Unificación de marca a "Trader Deportivo" en hero, navbar, footer y meta tags de index/login/signup
- Pre-headline del Hero: "Trader Deportivo: plataforma profesional de trading deportivo"
- CTAs primario y secundario consistentes; estilos de botones actualizados (gradiente cian→azul y outline cian)
- Paleta aplicada en UVPs, Pricing, Showcase y FAQ según tokens de globals.css
- Nota UX: ocultar "Soporte" en la landing; acceso tras login en dashboard

Referencias de implementación:
- <mcfile name="globals.css" path="c:\Users\DOM\Desktop\trading-deportivo\apps\web\src\styles\globals.css"></mcfile>
- <mcfile name="Hero.tsx" path="c:\Users\DOM\Desktop\trading-deportivo\apps\web\src\components\landing\Hero.tsx"></mcfile>
- <mcfile name="Navbar.tsx" path="c:\Users\DOM\Desktop\trading-deportivo\apps\web\src\components\landing\Navbar.tsx"></mcfile>
- <mcfile name="Footer.tsx" path="c:\Users\DOM\Desktop\trading-deportivo\apps\web\src\components\landing\Footer.tsx"></mcfile>
- <mcfile name="index.tsx" path="c:\Users\DOM\Desktop\trading-deportivo\apps\web\src\pages\index.tsx"></mcfile>
- <mcfile name="login.tsx" path="c:\Users\DOM\Desktop\trading-deportivo\apps\web\src\pages\login.tsx"></mcfile>
- <mcfile name="signup.tsx" path="c:\Users\DOM\Desktop\trading-deportivo\apps\web\src\pages\signup.tsx"></mcfile>
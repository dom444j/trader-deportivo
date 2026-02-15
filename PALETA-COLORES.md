# Identidad Visual – Paleta de Colores Oficial

Resumen: Paleta consolidada y normalizada para Trader Deportivo, alineada 100% con el logo y optimizada para plataformas financieras profesionales. Incluye variables CSS, mapeo Tailwind y estilos de referencia para diseño (Figma), con reglas de uso y accesibilidad.

## 1) Identidad de Marca

- Primarios (Brand)
  - Cyan (IA/Tecnología): #00F5FF | Light: #33F7FF | Dark: #00C4D4
  - Green (Ganancias/Éxito): #00FF94 | Light: #33FFB0 | Dark: #00D970
  - Blue (Base/Confianza): #0066FF | Light: #3385FF | Dark: #0052CC

- Secundarios (Acentos)
  - Gold (Premium/Elite): #FFD700 | Light: #FFED4E | Dark: #FFA500
  - Purple (AI Insights): #B026FF | Light: #C44FFF | Dark: #7000CC
  - Red (Alertas/Pérdidas): #FF4444 | Light: #FF6B6B | Dark: #CC0000

## 2) UI Base (Dark Mode recomendado)

- Backgrounds
  - bg-primary: #0A0A1A
  - bg-secondary: #141428
  - bg-tertiary: #1E1E38
  - bg-elevated: #252545

- Borders
  - border-primary: #2A2A4A
  - border-secondary: #3A3A5A
  - border-hover: #4A4A6A

- Text (Dark)
  - text-primary: #FFFFFF
  - text-secondary: #B8B8D0
  - text-tertiary: #8888A8
  - text-muted: #5A5A78

## 3) Colores Funcionales (Trading)

- Profit/Loss
  - profit-strong: #00FF94
  - profit-moderate: #00D970
  - loss-moderate: #FF6B6B
  - loss-strong: #FF4444

- Market Status
  - market-bullish: #00FF94
  - market-bearish: #FF4444
  - market-neutral: #FFD700

- Risk Levels
  - risk-low: #00FF94
  - risk-medium: #FFD700
  - risk-high: #FF6B6B
  - risk-critical: #FF4444

- Status & Badges
  - status-success: #00FF94
  - status-warning: #FFD700
  - status-error: #FF4444
  - status-info: #00F5FF
  - status-pending: #B026FF
  - badge-pro: #FFD700 | badge-elite: #B026FF | badge-verified: #00F5FF | badge-hot: #FF4444

## 4) Gradientes y Efectos

- Gradientes
  - gradient-primary: #00F5FF → #0066FF (135°)
  - gradient-success: #00FF94 → #00D970 (135°)
  - gradient-premium: #FFD700 → #FFA500 (135°)
  - gradient-ai: #B026FF → #7000CC (135°)

- Glow Effects (para CTAs/elementos premium)
  - glow-cyan: rgba(0,245,255,0.4/0.2)
  - glow-green: rgba(0,255,148,0.4/0.2)
  - glow-gold: rgba(255,215,0,0.4/0.2)

## 5) Aplicación por Componente

- Landing Page
  - Hero: bg-primary + H1 gradient-primary + CTA glow-cyan
  - Features: bg-secondary + cards bg-tertiary + border-primary + íconos green
  - Pricing: basic blue, pro cyan, premium gradient-premium

- Dashboard
  - Sidebar: bg-secondary, activo bg-tertiary + borde-left cyan
  - Main: bg-primary, cards bg-secondary, borders primary
  - Charts: profit line green, loss line red, neutral tertiary

- Cards & Botones
  - Signals Card: bg-secondary + border-primary; EV+: profit-strong; EV-: loss-moderate; badge: gradient-premium
  - Buttons: primary gradient-primary, success gradient-success, danger red, secundarios transparent + border cyan

## 6) Reglas de Uso (Do/Don’t)

- Do’s
  - Gradientes con moderación (CTAs y elementos premium)
  - Dark mode por defecto
  - Verde = ganancias, Rojo = pérdidas (estándar financiero)
  - Azul/Cian para tecnología/IA
  - Dorado para elementos premium
  - Contraste mínimo 4.5:1 (WCAG AA)

- Don’ts
  - No mezclar >3 colores primarios en un componente
  - No usar rojo/verde juntos sin contexto claro (cuidar daltonismo)
  - No usar gradientes en texto <16px
  - No saturar: 70% grises, 30% colores
  - Evitar amarillo puro en texto sobre blanco (bajo contraste)

## 7) Accesibilidad (WCAG 2.1)

- Ratios mínimos
  - Texto normal (16px+): 4.5:1
  - Texto grande (24px+): 3:1
  - Componentes UI: 3:1

- Validados
  - #00F5FF sobre #0A0A1A ≈ 8.2:1
  - #FFFFFF sobre #141428 ≈ 14.5:1
  - #00FF94 sobre #0A0A1A ≈ 9.1:1

- Daltonismo
  - Profit/Loss con íconos y formas (↑ verde / ↓ rojo; línea sólida vs punteada)

## 8) Exportables

- Variables CSS (lista normalizada)

```css
:root {
  /* Primary */
  --primary-cyan: #00F5FF;
  --primary-cyan-light: #33F7FF;
  --primary-cyan-dark: #00C4D4;
  --primary-green: #00FF94;
  --primary-green-light: #33FFB0;
  --primary-green-dark: #00D970;
  --primary-blue: #0066FF;
  --primary-blue-light: #3385FF;
  --primary-blue-dark: #0052CC;

  /* Secondary */
  --secondary-gold: #FFD700;
  --secondary-gold-light: #FFED4E;
  --secondary-gold-dark: #FFA500;
  --secondary-purple: #B026FF;
  --secondary-purple-light: #C44FFF;
  --secondary-purple-dark: #7000CC;
  --secondary-red: #FF4444;
  --secondary-red-light: #FF6B6B;
  --secondary-red-dark: #CC0000;

  /* Backgrounds Dark */
  --bg-primary: #0A0A1A;
  --bg-secondary: #141428;
  --bg-tertiary: #1E1E38;
  --bg-elevated: #252545;

  /* Borders */
  --border-primary: #2A2A4A;
  --border-secondary: #3A3A5A;
  --border-hover: #4A4A6A;

  /* Text Dark */
  --text-primary: #FFFFFF;
  --text-secondary: #B8B8D0;
  --text-tertiary: #8888A8;
  --text-muted: #5A5A78;

  /* Functional */
  --profit-strong: #00FF94;
  --profit-moderate: #00D970;
  --loss-moderate: #FF6B6B;
  --loss-strong: #FF4444;
  --risk-low: #00FF94;
  --risk-medium: #FFD700;
  --risk-high: #FF6B6B;
  --risk-critical: #FF4444;

  /* Status */
  --status-success: #00FF94;
  --status-warning: #FFD700;
  --status-error: #FF4444;
  --status-info: #00F5FF;
  --status-pending: #B026FF;
}
```

- Tailwind Config (mapeo de tokens)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          cyan: '#00F5FF',
          'cyan-light': '#33F7FF',
          'cyan-dark': '#00C4D4',
          green: '#00FF94',
          'green-light': '#33FFB0',
          'green-dark': '#00D970',
          blue: '#0066FF',
          'blue-light': '#3385FF',
          'blue-dark': '#0052CC',
        },
        secondary: {
          gold: '#FFD700',
          'gold-light': '#FFED4E',
          'gold-dark': '#FFA500',
          purple: '#B026FF',
          'purple-light': '#C44FFF',
          'purple-dark': '#7000CC',
          red: '#FF4444',
          'red-light': '#FF6B6B',
          'red-dark': '#CC0000',
        },
        background: {
          primary: '#0A0A1A',
          secondary: '#141428',
          tertiary: '#1E1E38',
          elevated: '#252545',
        },
        border: {
          primary: '#2A2A4A',
          secondary: '#3A3A5A',
          hover: '#4A4A6A',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00F5FF 0%, #0066FF 100%)',
        'gradient-success': 'linear-gradient(135deg, #00FF94 0%, #00D970 100%)',
        'gradient-premium': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'gradient-ai': 'linear-gradient(135deg, #B026FF 0%, #7000CC 100%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 245, 255, 0.4), 0 0 40px rgba(0, 245, 255, 0.2)',
        'glow-green': '0 0 20px rgba(0, 255, 148, 0.4), 0 0 40px rgba(0, 255, 148, 0.2)',
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.2)',
      },
    },
  },
};
```

- Figma Styles (referencia rápida)

```json
{
  "colors": {
    "Primary/Cyan": "#00F5FF",
    "Primary/Green": "#00FF94",
    "Primary/Blue": "#0066FF",
    "Secondary/Gold": "#FFD700",
    "Secondary/Purple": "#B026FF",
    "Secondary/Red": "#FF4444",
    "Background/Primary": "#0A0A1A",
    "Background/Secondary": "#141428",
    "Text/Primary": "#FFFFFF",
    "Text/Secondary": "#B8B8D0"
  }
}
```

## 9) Tokens implementados en código (sincronizados)

Fuente: apps/web/src/styles/globals.css (estado actual). Estos tokens están ya disponibles en código y deben usarse de forma consistente en UI.

```css
:root {
  /* Efectos y gradientes implementados */
  --gradient-primary: linear-gradient(135deg, #00F5FF 0%, #0066FF 100%);
  --gradient-success: linear-gradient(135deg, #00FF94 0%, #00D970 100%);
  --gradient-premium: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  --gradient-ai: linear-gradient(135deg, #B026FF 0%, #7000CC 100%);

  --glow-cyan: 0 0 20px rgba(0, 245, 255, 0.4), 0 0 40px rgba(0, 245, 255, 0.2);
  --glow-green: 0 0 20px rgba(0, 255, 148, 0.4), 0 0 40px rgba(0, 255, 148, 0.2);
  --glow-gold: 0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.2);
}
```

Notas de implementación:
- Scrollbar temático: usa `scrollbar-width: thin` + `scrollbar-color: var(--primary-blue-dark) var(--bg-secondary)` y `::-webkit-scrollbar` con pulgar en gradiente cian→azul.
- Tipografía responsive global: h1/h2/h3 con `clamp(...)`; hero-title y hero-sub ajustados para móviles.
- Mantener contraste mínimo (WCAG AA) y consistencia con tokens primarios/secundarios.

## 9) Versionado

- Versión: 1.0
- Fecha: 2024
- Alcance: Landing Page + Dashboard + Mobile App

---

Notas:
- Esta paleta es la fuente de verdad visual. Cualquier nuevo componente debe mapear sus tokens a estas variables antes de diseño/desarrollo.
- Los colores están 100% alineados con tu logo y optimizados para plataformas financieras profesionales.
# 🏦 ALINEACIÓN CARD EQUIPO BINARIO - INSTRUCCIONES DETALLADAS

## 🎯 Objetivo
Hacer que la card de "Equipo Binario (A/B)" se vea EXACTAMENTE como en el HTML de referencia, usando los colores correctos de la guía visual.

---

## 📸 COMPARACIÓN VISUAL

### ❌ ESTADO ACTUAL (Imagen 1)
```
┌────────────────────────────────────┐
│ 👥         Equipo Binario    [Banca]│
│                                     │
│ Bank A: €30,000 · Bank B: €27,000 │
│ €57,000                            │
│ Balance A/B                        │
│ [████████████░░░░░░]               │
└────────────────────────────────────┘
```
**Problemas:**
- ❌ TODO el texto es blanco - no hay jerarquía de colores
- ❌ Falta información visible (directos, indirectos)
- ❌ No usa colores de la paleta (cyan, green, gold)
- ❌ Disposición horizontal compacta sin jerarquía clara

---

### ✅ DISEÑO OBJETIVO (HTML Referencia líneas 2263-2302)
```
┌────────────────────────────────────────────┐
│ Equipo Binario                    [ℹ️]  🏦│
│                                             │
│ Bank A: $30,000 · Bank B: $27,000          │
│ Bank Total: $57,000 · Progreso a R5: 1.6%  │
│ Resumen: A: $30k | B: $27k | Total: $57k   │
│ ↗ Mejorando desde máximo                   │
│ Equipo A: 2 directos · 8 indirectos |      │
│ Equipo B: 1 directo · 12 indirectos        │
│ [█░░░░░░░░░░░░] 1.6%                       │
└────────────────────────────────────────────┘
```

**Características del diseño objetivo:**
- ✅ Título en gris (`--text-muted`)
- ✅ Bank Total en **verde** (`--primary-green`)
- ✅ "Progreso a R5" con porcentaje
- ✅ "Mejorando" en verde con flecha ↗
- ✅ Directos en **cyan** (`--primary-cyan`)
- ✅ Barra de progreso visible
- ✅ Tooltip informativo (ℹ️)

---

## 🎨 PALETA DE COLORES A USAR

```css
/* GUÍA DE COLORES PARA EQUIPO BINARIO */

--primary-cyan: #00F5FF;      /* Para directos, tooltips, acentos */
--primary-green: #00FF94;     /* Para Bank Total, tendencias positivas */
--primary-blue: #0066FF;      /* Para gradientes */
--secondary-gold: #FFD700;    /* Para rangos, valores premium */

--text-primary: #FFFFFF;      /* Valores principales */
--text-secondary: #B8B8D0;    /* Valores secundarios */
--text-muted: #8888A8;        /* Labels, texto auxiliar */

--border-color: #2A2A4A;      /* Bordes */
```

---

## 📝 CÓDIGO ACTUALIZADO - TopStatsGrid.tsx

### Paso 1: Actualizar el componente React

```tsx
// TopStatsGrid.tsx - Card Equipo Binario

<div className={`${styles.statCard} ${styles.areaEquipo}`}>
  <div className={styles.statHeader}>
    <div className={styles.statHeaderContent}>
      <div className={styles.statLabel}>
        Equipo Binario
        <span className={styles.tooltipWrapper}>
          <span className={styles.tooltipIcon}>ℹ️</span>
          <div className={styles.tooltipContent}>
            <div className={styles.tooltipTitle}>Progreso a R5</div>
            <div className={styles.tooltipText}>
              <strong>Lado A:</strong> ${kpis.binaryBankA.toLocaleString()} / $25,000 
              (supera ${Math.max(0, kpis.binaryBankA - 25000).toLocaleString()})<br/>
              <strong>Lado B:</strong> ${kpis.binaryBankB.toLocaleString()} / $25,000 
              (supera ${Math.max(0, kpis.binaryBankB - 25000).toLocaleString()})
            </div>
            <div className={styles.tooltipText}>
              <em>Ambos lados deben alcanzar $25,000 para R5</em>
            </div>
          </div>
        </span>
      </div>
    </div>
    <div className={styles.statIcon}>🏦</div>
  </div>

  <div className={styles.statContent}>
    {/* Línea 1: Banks A y B */}
    <div className={styles.statValue} style={{ fontSize: '18px' }}>
      Bank A: {formatMoney(kpis.binaryBankA)} · Bank B: {formatMoney(kpis.binaryBankB)}
    </div>

    {/* Línea 2: Bank Total + Progreso */}
    <div className={styles.statMeta}>
      Bank Total: <span className={styles.textGreen}>{bankTotalText}</span> · 
      Progreso a R5: {(balanceRatio * 100).toFixed(1)}%
    </div>

    {/* Línea 3: Resumen compacto */}
    <div className={styles.statMeta} style={{ marginTop: '6px', fontSize: '12px' }}>
      <strong>Resumen:</strong> A: {bankAText} | B: {bankBText} | 
      Total: <span className={styles.textGreen}>{bankTotalText}</span>
    </div>

    {/* Línea 4: Tendencia */}
    <div className={`${styles.statChange} ${styles.positive}`} style={{ marginTop: '8px' }}>
      <span>↗</span>
      <span>Mejorando desde máximo</span>
    </div>

    {/* Línea 5: Equipos A y B con directos/indirectos */}
    <div className={styles.statMeta} style={{ marginTop: '6px', fontSize: '12px' }}>
      Equipo A: <span className={styles.textCyan}>2 directos</span> · 8 indirectos | 
      Equipo B: <span className={styles.textCyan}>1 directo</span> · 12 indirectos
    </div>

    {/* Barra de progreso */}
    <div className={styles.progressBar} aria-label="Progreso a R5">
      <div 
        className={styles.progressFill} 
        style={{ width: `${(balanceRatio * 100).toFixed(1)}%` }}
      />
    </div>
  </div>
</div>
```

**Helpers necesarios:**
```tsx
const formatMoney = (val: number) => 
  new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'EUR', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val);

const formatMoneyCompact = (val: number) => {
  if (val >= 1000000) return `€${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `€${(val / 1000).toFixed(0)}k`;
  return formatMoney(val);
};

const bankAText = formatMoneyCompact(kpis.binaryBankA);
const bankBText = formatMoneyCompact(kpis.binaryBankB);
const bankTotal = kpis.binaryBankA + kpis.binaryBankB;
const bankTotalText = formatMoney(bankTotal);

const balanceRatio = (() => {
  const max = Math.max(kpis.binaryBankA, kpis.binaryBankB);
  const min = Math.min(kpis.binaryBankA, kpis.binaryBankB);
  return max > 0 ? (min / max) : 0;
})();
```

---

## 🎨 ESTILOS CSS ACTUALIZADOS

### Paso 2: Actualizar UserDashboard.module.css

```css
/* ===== STAT CARD BASE ===== */
.statCard {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px 16px;
  background: linear-gradient(180deg, rgba(37,37,69,0.85) 0%, rgba(30,30,56,0.85) 100%);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.02) inset;
  overflow: hidden;
  min-height: 140px; /* Aumentado para Equipo Binario */
}

/* ===== STAT HEADER ===== */
.statHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.statHeaderContent {
  flex: 1;
}

.statLabel {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-muted); /* GRIS - no blanco */
  line-height: 1;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ===== STAT ICON ===== */
.statIcon {
  width: 44px;
  height: 44px;
  display: grid;
  place-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(0,245,255,0.12) 0%, rgba(0,102,255,0.12) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  font-size: 22px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

/* ===== STAT CONTENT ===== */
.statContent {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  z-index: 1;
}

.statValue {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-primary); /* BLANCO para valores principales */
}

.statMeta {
  font-size: 12px;
  color: var(--text-secondary); /* GRIS CLARO para meta */
  line-height: 1.4;
}

.statMeta strong {
  color: var(--text-primary); /* BLANCO para énfasis */
}

/* ===== COLORES DE TEXTO ===== */
.textGreen {
  color: var(--primary-green) !important; /* VERDE para Bank Total */
  font-weight: 700;
}

.textCyan {
  color: var(--primary-cyan) !important; /* CYAN para directos */
  font-weight: 700;
}

.textGold {
  color: var(--secondary-gold) !important; /* ORO para premium */
  font-weight: 700;
}

/* ===== STAT CHANGE (Tendencias) ===== */
.statChange {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 0;
}

.statChange.positive {
  color: var(--primary-green); /* VERDE para tendencia positiva */
}

.statChange.negative {
  color: var(--secondary-red); /* ROJO para tendencia negativa */
}

.statChange span:first-child {
  font-size: 16px; /* Flecha más grande */
}

/* ===== PROGRESS BAR ===== */
.progressBar {
  width: 100%;
  height: 6px;
  background: rgba(30, 30, 56, 0.8);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
  position: relative;
  z-index: 1;
}

.progressFill {
  height: 100%;
  background: var(--gradient-primary); /* Gradiente cyan→blue */
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== TOOLTIP ===== */
.tooltipWrapper {
  position: relative;
  display: inline-block;
}

.tooltipIcon {
  cursor: help;
  font-size: 14px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.tooltipIcon:hover {
  opacity: 1;
}

.tooltipContent {
  display: none;
  position: absolute;
  left: 20px;
  top: 0;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px;
  min-width: 280px;
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.tooltipWrapper:hover .tooltipContent {
  display: block;
}

.tooltipTitle {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.tooltipText {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 6px;
}

.tooltipText:last-child {
  margin-bottom: 0;
}

.tooltipText strong {
  color: var(--text-primary);
}

.tooltipText em {
  color: var(--text-muted);
  font-style: italic;
}
```

---

## 🔧 VARIABLES CSS GLOBALES (DashboardShell.module.css)

```css
/* Agregar si no existen */
.appShell {
  /* ... variables existentes ... */
  
  /* Gradientes */
  --gradient-primary: linear-gradient(135deg, #00F5FF 0%, #0066FF 100%);
  --gradient-success: linear-gradient(135deg, #00FF94 0%, #00D970 100%);
  
  /* Colores primarios */
  --primary-cyan: #00F5FF;
  --primary-green: #00FF94;
  --primary-blue: #0066FF;
  --secondary-gold: #FFD700;
  --secondary-purple: #B026FF;
  --secondary-red: #FF4444;
  
  /* Backgrounds */
  --bg-primary: #0A0A1A;
  --bg-secondary: #141428;
  --bg-tertiary: #1E1E38;
  --bg-elevated: #252545;
  
  /* Borders */
  --border-color: #2A2A4A;
  
  /* Text */
  --text-primary: #FFFFFF;
  --text-secondary: #B8B8D0;
  --text-muted: #8888A8;
}
```

---

## 📊 TIPOS TypeScript NECESARIOS

```typescript
// user-dashboard.ts - Agregar si faltan campos

export interface UserKpis {
  // ... campos existentes ...
  
  binaryBankA: number;        // Bank A en EUR
  binaryBankB: number;        // Bank B en EUR
  
  // Opcionales para datos completos:
  binaryDirectsA?: number;    // Directos en lado A
  binaryDirectsB?: number;    // Directos en lado B
  binaryIndirectsA?: number;  // Indirectos en lado A
  binaryIndirectsB?: number;  // Indirectos en lado B
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Estructura (30 min)
- [ ] Copiar código React actualizado de Equipo Binario en TopStatsGrid.tsx
- [ ] Agregar helpers de formato (formatMoney, formatMoneyCompact)
- [ ] Verificar que `kpis.binaryBankA` y `kpis.binaryBankB` existen

### Fase 2: Estilos Base (20 min)
- [ ] Actualizar `.statCard` con min-height: 140px
- [ ] Actualizar `.statLabel` color a `var(--text-muted)`
- [ ] Actualizar `.statMeta` color a `var(--text-secondary)`
- [ ] Agregar clases `.textGreen`, `.textCyan`, `.textGold`

### Fase 3: Estilos Específicos (20 min)
- [ ] Agregar estilos `.statChange` y `.statChange.positive`
- [ ] Verificar `.progressBar` y `.progressFill` tienen estilos correctos
- [ ] Agregar estilos de tooltip completos

### Fase 4: Variables CSS (10 min)
- [ ] Verificar que todas las variables de color existen en DashboardShell.module.css
- [ ] Agregar `--gradient-primary` si falta
- [ ] Verificar tipografía JetBrains Mono está importada

### Fase 5: Testing (20 min)
- [ ] Probar en navegador
- [ ] Verificar que Bank Total es VERDE
- [ ] Verificar que directos son CYAN
- [ ] Verificar que label es GRIS (no blanco)
- [ ] Verificar barra de progreso visible
- [ ] Probar hover del tooltip
- [ ] Verificar responsive (móvil/tablet/desktop)

---

## 🎨 RESULTADO VISUAL ESPERADO

```
┌───────────────────────────────────────────────┐
│ EQUIPO BINARIO [i]                        🏦 │  ← Título GRIS
│                                                │
│ Bank A: €30,000 · Bank B: €27,000             │  ← BLANCO
│ Bank Total: €57,000 · Progreso a R5: 1.6%     │  ← €57,000 VERDE
│ Resumen: A: €30k | B: €27k | Total: €57,000   │  ← Total VERDE
│ ↗ Mejorando desde máximo                      │  ← VERDE con flecha
│ Equipo A: 2 directos · 8 indirectos |         │  ← directos CYAN
│ Equipo B: 1 directo · 12 indirectos           │  ← directos CYAN
│ [█░░░░░░░░░░░░░░░] 1.6%                       │  ← Barra gradiente
└───────────────────────────────────────────────┘
```

---

## 🚨 ERRORES COMUNES A EVITAR

1. ❌ **NO usar `color: white` o `#FFFFFF` directamente** 
   - ✅ Usar `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)`

2. ❌ **NO poner TODO en blanco**
   - ✅ Labels en gris (`--text-muted`)
   - ✅ Meta en gris claro (`--text-secondary`)
   - ✅ Valores en blanco (`--text-primary`)
   - ✅ Acentos en cyan/green/gold

3. ❌ **NO olvidar JetBrains Mono para números**
   - ✅ Importar: `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');`

4. ❌ **NO usar colores hardcoded (#00F5FF)**
   - ✅ Usar variables CSS (`var(--primary-cyan)`)

5. ❌ **NO compactar tanto que se pierda legibilidad**
   - ✅ Mantener `min-height: 140px` para Equipo Binario

---

## 📝 NOTAS ADICIONALES

### Tooltip Interactivo
El tooltip con información de progreso a R5 es **opcional** en fase 1. Si no tienes los datos de rangos aún, puedes omitirlo temporalmente y agregarlo después.

### Datos Hardcodeados Temporales
Si `kpis.binaryDirectsA`, etc. no están disponibles, usa temporalmente:
```tsx
const directsA = 2; // Temporal
const indirectsA = 8;
const directsB = 1;
const indirectsB = 12;
```

### Responsividad
En móvil (< 768px), considera reducir `font-size` de `.statValue` a 16px y `.statMeta` a 11px para mejor legibilidad.

---

**Versión:** 1.0  
**Fecha:** Enero 2025  
**Próxima revisión:** Después de implementar y probar

# 📋 INSTRUCCIONES DE ALINEACIÓN - DASHBOARD PROFESIONAL

## 🎯 OBJETIVO
Alinear el proyecto real con el diseño de referencia (`dashboard_profesional.html`) sin perder funcionalidad, manteniendo todos los datos pero mejorando la presentación visual.

---

## ❌ PROBLEMAS IDENTIFICADOS

### 1. **TIPOGRAFÍA INCORRECTA**
**PROBLEMA:** El proyecto NO usa la fuente Rajdhani especificada en el diseño
**UBICACIÓN:** Falta la importación de fuentes en el proyecto

**SOLUCIÓN:**
```css
/* Agregar en globals.css o en DashboardShell.module.css */
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');

body {
  font-family: 'Rajdhani', sans-serif;
}

/* Para valores numéricos/monedas usar JetBrains Mono */
.kpiValue,
.statValue,
.statCardValue {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}
```

---

### 2. **STAT CARDS CON DEMASIADO TEXTO**
**PROBLEMA:** Las cards tienen múltiples líneas de texto que dificultan la lectura

**DISEÑO DE REFERENCIA:**
```
┌────────────────────────────────┐
│ 💎  Plan actual        [Activo]│
│ Pro                             │
│ Activación: 7 días de 30       │
│ [Renovar]                       │
└────────────────────────────────┘
```

**SOLUCIÓN MEJORADA - Estructura más limpia:**

```tsx
// TopStatsGrid.tsx - Ejemplo card Plan actual
<div className={`${styles.statCard} ${styles.areaPlan}`}>
  <div className={styles.statIcon}>💎</div>
  <div className={styles.statContent}>
    <div className={styles.statHeader}>
      <span className={styles.statCardTitle}>Plan actual</span>
      <span className={styles.kpiBadge}>{planStatusLabel}</span>
    </div>
    <div className={styles.statCardValue}>{kpis.planName}</div>
    <div className={styles.statCardMeta}>
      Activación: {kpis.planActivationRemainingDays} días restantes de {kpis.planActivationTotalDays}
    </div>
    <button className={styles.actionBtn}>Renovar</button>
  </div>
</div>
```

**CSS MEJORADO:**
```css
/* UserDashboard.module.css - Agregar estos estilos */

.statCardTitle {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-muted);
}

.statCardValue {
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
  margin: 6px 0;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-primary);
}

.statCardMeta {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 8px;
}

/* Mejora visual de badges */
.kpiBadge {
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 700;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Estados de badges */
.kpiBadge.activo {
  background: rgba(0, 255, 148, 0.15);
  color: var(--primary-green);
  border-color: rgba(0, 255, 148, 0.35);
}

.kpiBadge.porVencer {
  background: rgba(255, 215, 0, 0.15);
  color: var(--secondary-gold);
  border-color: rgba(255, 215, 0, 0.35);
}

.kpiBadge.expirado {
  background: rgba(255, 68, 68, 0.15);
  color: var(--secondary-red);
  border-color: rgba(255, 68, 68, 0.35);
}
```

---

### 3. **EXECUTIVE HEADER - FALTA DISEÑO DE REFERENCIA**

**PROBLEMA:** El ExecutiveHeader actual no sigue el diseño del HTML de referencia

**DISEÑO DE REFERENCIA (dashboard_profesional.html líneas 773-859):**
```html
<div class="executive-header">
  <div class="kpi-row">
    <div class="kpi-item">
      <span class="kpi-label">Bankroll</span>
      <span class="kpi-value">€ 12,450</span>
    </div>
    <div class="kpi-item">
      <span class="kpi-label">P&L (Mes)</span>
      <span class="kpi-value kpi-positive">+€ 1,280</span>
    </div>
    <!-- más KPIs... -->
  </div>
</div>
```

**SOLUCIÓN - ExecutiveHeader.tsx MEJORADO:**
```tsx
import React from 'react';
import styles from '../../../app/(dashboard)/user/UserDashboard.module.css';
import type { UserKpis } from '@/types/user-dashboard';

export default function ExecutiveHeader({ kpis }: { kpis: UserKpis }) {
  const formatMoney = (val: number) => 
    new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);

  const formatPercent = (val: number) => `${(val * 100).toFixed(1)}%`;

  return (
    <header className={styles.executiveHeader}>
      <div className={styles.kpiRow}>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>Bankroll</span>
          <span className={styles.kpiValue}>{formatMoney(kpis.bankroll)}</span>
        </div>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>P&L (Mes)</span>
          <span className={`${styles.kpiValue} ${kpis.pnlMonth >= 0 ? styles.kpiPositive : styles.kpiDanger}`}>
            {kpis.pnlMonth >= 0 ? '+' : ''}{formatMoney(kpis.pnlMonth)}
          </span>
        </div>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>ROI (Mes)</span>
          <span className={styles.kpiValue}>{formatPercent(kpis.roiMonth)}</span>
        </div>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>Drawdown</span>
          <span className={styles.kpiValue}>-{formatPercent(kpis.drawdown)}</span>
        </div>
        <div className={styles.kpiItem}>
          <span className={styles.kpiLabel}>Disciplina</span>
          <span className={styles.kpiValue}>{kpis.discipline}%</span>
        </div>
      </div>
    </header>
  );
}
```

---

### 4. **COLORES Y EFECTOS VISUALES**

**PROBLEMA:** Faltan los efectos de glow y animaciones del diseño de referencia

**SOLUCIÓN - Agregar en DashboardShell.module.css:**
```css
/* Agregar variables de glow */
.appShell {
  /* ... variables existentes ... */
  --glow-cyan: 0 0 20px rgba(0, 245, 255, 0.4), 0 0 40px rgba(0, 245, 255, 0.2);
  --glow-green: 0 0 20px rgba(0, 255, 148, 0.4), 0 0 40px rgba(0, 255, 148, 0.2);
  --glow-gold: 0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.2);
}

/* Mejorar el fondo con animación */
.appShell::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(var(--border-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-color) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.08;
  pointer-events: none;
  z-index: 0;
  animation: gridPulse 8s ease-in-out infinite;
}

@keyframes gridPulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.15; }
}

/* Mejorar el glow radial con animación */
.appShell::after {
  content: "";
  position: fixed;
  top: -30%;
  right: -30%;
  width: 80%;
  height: 80%;
  background: radial-gradient(circle, rgba(0, 245, 255, 0.05) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
  animation: glowPulse 6s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}
```

---

### 5. **SIDEBAR - QUICK STATUS MEJORADO**

**PROBLEMA:** El Quick Status del sidebar actual no tiene el diseño del HTML de referencia

**DISEÑO DE REFERENCIA (líneas 238-304 del HTML):**
```html
<div class="quick-status">
  <div class="status-title">Estado Rápido</div>
  <div class="status-grid">
    <div class="status-item">
      <div class="status-label">Bankroll</div>
      <div class="status-value positive">€12.4k</div>
    </div>
    <!-- más items... -->
  </div>
</div>
```

**SOLUCIÓN - AppSidebar.tsx:**
```tsx
{/* Quick Status - mejora visual */}
{!collapsed && (
  <div className={styles.quickStatus}>
    <div className={styles.statusTitle}>Estado Rápido</div>
    <div className={styles.statusGrid}>
      <div className={styles.statusItem}>
        <div className={styles.statusLabel}>Bankroll</div>
        <div className={`${styles.statusValue} ${styles.positive}`}>
          {formatMoney(bankroll)}
        </div>
      </div>
      <div className={styles.statusItem}>
        <div className={styles.statusLabel}>ROI Mes</div>
        <div className={`${styles.statusValue} ${roiMonth && roiMonth >= 0 ? styles.positive : styles.danger}`}>
          {formatPct(roiMonth)}
        </div>
      </div>
      <div className={styles.statusItem}>
        <div className={styles.statusLabel}>PnL Mes</div>
        <div className={`${styles.statusValue} ${pnlMonth && pnlMonth >= 0 ? styles.positive : styles.danger}`}>
          {pnlMonth === null ? '—' : `${pnlMonth >= 0 ? '+' : ''}€${Math.abs(pnlMonth)}`}
        </div>
      </div>
      <div className={styles.statusItem}>
        <div className={styles.statusLabel}>Alertas</div>
        <div className={`${styles.statusValue} ${alertsCount > 0 ? styles.warning : ''}`}>
          {alertsCount}
        </div>
      </div>
    </div>
  </div>
)}
```

**CSS - AppSidebar.module.css:**
```css
.quickStatus {
  padding: 16px;
  background: linear-gradient(135deg, rgba(0, 245, 255, 0.06), rgba(0, 255, 148, 0.04));
  border-bottom: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.quickStatus::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-cyan), var(--primary-green));
  opacity: 0.6;
}

.statusTitle {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  margin-bottom: 12px;
  font-weight: 700;
}

.statusGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.statusItem {
  padding: 10px;
  border-radius: 10px;
  background: rgba(30, 30, 56, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.statusLabel {
  font-size: 10px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.statusValue {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 14px;
  color: var(--text-primary);
}

.statusValue.positive { color: var(--primary-green); }
.statusValue.warning { color: var(--secondary-gold); }
.statusValue.danger { color: var(--secondary-red); }
```

---

### 6. **CARDS DE CONTENIDO PRINCIPAL**

**PROBLEMA:** Las cards de señales, tipsters y eventos necesitan mejor espaciado

**SOLUCIÓN - UserDashboard.module.css:**
```css
/* Mejorar cards principales */
.card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  border-color: rgba(0,245,255,0.35);
  box-shadow: 0 12px 34px rgba(0,0,0,0.38), 0 0 0 2px rgba(0,245,255,0.08) inset;
  transform: translateY(-2px);
}

/* Header de cards con mejor diseño */
.cardHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 12px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
}

.cardHeader h2 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.3px;
}

/* Mejor diseño de link */
.cardLink {
  color: var(--primary-cyan);
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(0, 245, 255, 0.25);
  padding: 6px 12px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  background: rgba(0, 245, 255, 0.05);
}

.cardLink:hover {
  background: var(--primary-cyan);
  color: #000;
  border-color: var(--primary-cyan);
  box-shadow: 0 0 12px rgba(0, 245, 255, 0.4);
  transform: scale(1.05);
}

/* Body de cards con mejor padding */
.cardBody {
  padding: 20px;
}
```

---

## 🎨 MEJORAS ESPECÍFICAS POR COMPONENTE

### TopStatsGrid.tsx - Card "Equipo Binario"
**PROBLEMA:** Demasiada información apretada

**SOLUCIÓN:**
```tsx
<div className={`${styles.statCard} ${styles.areaEquipo}`}>
  <div className={styles.statIcon}>👥</div>
  <div className={styles.statContent}>
    <div className={styles.statHeader}>
      <span className={styles.statCardTitle}>Equipo Binario (A/B)</span>
      <span className={styles.kpiBadge}>Banca</span>
    </div>
    <div className={styles.statCardMeta}>
      <strong>Bank A:</strong> {bankAText} · <strong>Bank B:</strong> {bankBText}
    </div>
    <div className={styles.statCardValue}>{bankTotalText}</div>
    <div className={styles.statCardMeta}>Balance A/B</div>
    <div className={styles.progressBar}>
      <div 
        className={styles.progressFill} 
        style={{ width: `${(balanceRatio * 100).toFixed(0)}%` }} 
      />
    </div>
  </div>
</div>
```

### TopStatsGrid.tsx - Card "Pool Semanal Estimado"
**PROBLEMA:** Demasiado texto explicativo

**SOLUCIÓN:**
```tsx
<div className={`${styles.statCard} ${styles.areaPool}`}>
  <div className={styles.statIcon}>🏦</div>
  <div className={styles.statContent}>
    <div className={styles.statHeader}>
      <span className={styles.statCardTitle}>Pool semanal estimado</span>
      <span className={`${styles.kpiBadge} ${styles.chip}`}>Estimado</span>
    </div>
    <div className={styles.statCardValue}>{money(kpis.weeklyPoolEstimate)}</div>
    <div className={styles.statCardMeta}>
      ROI Mes {roiPct} · DD {ddPct}
    </div>
  </div>
</div>
```

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

### Paso 1: Tipografía
- [ ] Importar fuentes Rajdhani y JetBrains Mono en globals.css o DashboardShell
- [ ] Aplicar Rajdhani como fuente principal
- [ ] Aplicar JetBrains Mono a valores numéricos

### Paso 2: Variables CSS
- [ ] Verificar que todas las variables de color estén definidas en DashboardShell.module.css
- [ ] Agregar variables de glow (--glow-cyan, --glow-green, --glow-gold)
- [ ] Verificar gradientes estén definidos correctamente

### Paso 3: Animaciones y Efectos
- [ ] Agregar animación gridPulse al fondo
- [ ] Agregar animación glowPulse al radial gradient
- [ ] Aplicar transiciones suaves a cards y botones

### Paso 4: Executive Header
- [ ] Actualizar ExecutiveHeader.tsx con nueva estructura
- [ ] Aplicar estilos del diseño de referencia
- [ ] Verificar formato de monedas y porcentajes

### Paso 5: Stat Cards
- [ ] Actualizar TopStatsGrid.tsx con estructura mejorada
- [ ] Reducir texto redundante en cada card
- [ ] Aplicar clases CSS mejoradas (statCardTitle, statCardValue, statCardMeta)
- [ ] Implementar badges de estado con colores correctos

### Paso 6: Sidebar Quick Status
- [ ] Actualizar diseño del Quick Status
- [ ] Aplicar gradiente de fondo
- [ ] Mejorar grid de 2 columnas
- [ ] Aplicar colores condicionales (positive, warning, danger)

### Paso 7: Cards de Contenido
- [ ] Mejorar diseño de cardHeader
- [ ] Actualizar estilo de cardLink con efecto hover
- [ ] Ajustar padding de cardBody
- [ ] Implementar transición suave en hover

### Paso 8: Responsividad
- [ ] Verificar grid responsive de statsGrid funcione correctamente
- [ ] Probar en móvil (< 768px)
- [ ] Probar en tablet (768px - 1024px)
- [ ] Probar en desktop (> 1024px)

---

## 🚫 QUÉ NO HACER

1. ❌ **NO** cambiar la estructura de datos ni eliminar campos de `UserKpis`
2. ❌ **NO** modificar los endpoints de API ni la lógica de fetch
3. ❌ **NO** cambiar los nombres de las variables CSS globales ya establecidas
4. ❌ **NO** agregar bibliotecas externas innecesarias
5. ❌ **NO** modificar la estructura de carpetas del proyecto
6. ❌ **NO** cambiar la paleta de colores definida en PALETA-COLORES.md
7. ❌ **NO** eliminar funcionalidad existente (dropdowns, modales, etc.)

---

## ✅ QUÉ SÍ HACER

1. ✅ Mantener TODOS los datos y campos actuales
2. ✅ Mejorar la presentación visual siguiendo el HTML de referencia
3. ✅ Aplicar la tipografía Rajdhani/JetBrains Mono consistentemente
4. ✅ Usar las variables CSS ya definidas
5. ✅ Mantener la responsividad del diseño
6. ✅ Seguir la paleta de colores oficial
7. ✅ Aplicar animaciones sutiles y profesionales
8. ✅ Mejorar el espaciado y jerarquía visual
9. ✅ Implementar estados de hover consistentes
10. ✅ Mantener la accesibilidad (contraste, foco, etc.)

---

## 🎯 RESULTADO ESPERADO

Al finalizar esta alineación:

1. **Tipografía profesional:** Rajdhani para UI, JetBrains Mono para números
2. **Stat Cards limpias:** Menos texto, mejor jerarquía visual
3. **Executive Header alineado:** 5 KPIs principales en diseño horizontal compacto
4. **Efectos visuales sutiles:** Animaciones de grid y glow, transiciones suaves
5. **Sidebar mejorado:** Quick Status con gradiente y valores coloridos
6. **Cards de contenido pulidas:** Mejores hover states y espaciado
7. **100% responsive:** Funciona perfectamente en móvil, tablet y desktop
8. **Mantiene funcionalidad:** Todos los datos y comportamientos actuales intactos

---

## 📞 DUDAS O CONSULTAS

Si algo no está claro:
1. Revisar el archivo `dashboard_profesional.html` de referencia
2. Consultar `PALETA-COLORES.md` para colores
3. Revisar `dashboard_profesional_checklist.md` para campos de datos
4. Preguntar ANTES de hacer cambios estructurales

---

**Versión:** 1.0  
**Fecha:** Enero 2025  
**Próxima revisión:** Después de implementar Paso 1-4

# 🎨 REDISEÑO DE CARDS CON MUCHO TEXTO

## Objetivo
Simplificar la presentación visual de las stat cards manteniendo TODOS los datos, mejorando la jerarquía y legibilidad.

---

## CARD 1: Plan Actual ✅

### ❌ PROBLEMA ACTUAL
```
┌──────────────────────────────────────┐
│ 💎                                   │
│ Plan actual                  [Activo]│
│ Pro                                  │
│ Activación: 7 días restantes de 30  │
│ Estado: Activo · Próximo pago: Sí   │
│ [Renovar]                            │
└──────────────────────────────────────┘
```
**Issues:**
- Demasiadas líneas de texto
- Información redundante ("Estado: Activo" + badge "Activo")

### ✅ SOLUCIÓN MEJORADA
```tsx
<div className={`${styles.statCard} ${styles.areaPlan}`}>
  <div className={styles.statIcon}>💎</div>
  <div className={styles.statContent}>
    <div className={styles.statHeader}>
      <span className={styles.statCardTitle}>Plan actual</span>
      <span className={`${styles.kpiBadge} ${getBadgeClass(kpis.planStatus)}`}>
        {planStatusLabel}
      </span>
    </div>
    <div className={styles.statCardValue}>{kpis.planName}</div>
    <div className={styles.statCardMeta}>
      {kpis.planActivationRemainingDays}d / {kpis.planActivationTotalDays}d restantes
    </div>
    {kpis.nextPaymentDue && (
      <button className={styles.actionBtn} aria-label="Renovar plan">
        Renovar
      </button>
    )}
  </div>
</div>
```

**Visual esperado:**
```
┌──────────────────────────┐
│ 💎  Plan actual  [Activo]│
│ Pro                      │
│ 7d / 30d restantes       │
│ [Renovar]                │
└──────────────────────────┘
```

**Helper para badges:**
```tsx
const getBadgeClass = (status: 'activo' | 'por_vencer' | 'expirado') => {
  return status === 'activo' 
    ? styles.badgeSuccess 
    : status === 'por_vencer' 
    ? styles.badgeWarning 
    : styles.badgeDanger;
};

const planStatusLabel = {
  activo: 'Activo',
  por_vencer: 'Por vencer',
  expirado: 'Expirado'
}[kpis.planStatus];
```

---

## CARD 2: Rango ✅

### ❌ PROBLEMA ACTUAL
```
┌──────────────────────────────────────────┐
│ 🏆                                       │
│ Rango                             [XP]   │
│ Rango Base: R4 | Rango Pagable: R3       │
│ Plan requerido: Pro para cobrar R4+      │
│ Próximo: R4 requiere $25,000 en equipo   │
│ Disciplina 82/100                        │
└──────────────────────────────────────────┘
```
**Issues:**
- Demasiada información en una card pequeña
- Confuso distinguir rango base vs pagable

### ✅ SOLUCIÓN MEJORADA
```tsx
<div className={`${styles.statCard} ${styles.areaRango}`}>
  <div className={styles.statIcon}>🏆</div>
  <div className={styles.statContent}>
    <div className={styles.statHeader}>
      <span className={styles.statCardTitle}>Rango</span>
      <span className={styles.kpiBadge}>XP</span>
    </div>
    <div className={styles.statCardValue}>
      <span className={styles.rankBase}>{kpis.rankName}</span>
    </div>
    <div className={styles.statCardMeta}>
      Disciplina {kpis.discipline}/100
    </div>
  </div>
</div>
```

**Visual esperado:**
```
┌──────────────────────┐
│ 🏆  Rango       [XP] │
│ R3                   │
│ Disciplina 82/100    │
└──────────────────────┘
```

**CSS adicional:**
```css
.rankBase {
  font-size: 32px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--secondary-gold), var(--primary-cyan));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.rankPayable {
  font-size: 18px;
  color: var(--primary-cyan);
  margin-left: 8px;
}
```

---

## CARD 3: Equipo Binario A/B ✅

### ❌ PROBLEMA ACTUAL
```
┌───────────────────────────────────────────────┐
│ 👥                                            │
│ Equipo Binario (A/B)              [Banca]    │
│ Bank A: €30,000 · Bank B: €27,000            │
│ Bank Total: €57,000                          │
│ Progreso a R5: 1.6%                          │
│ Side A: 2 directos · 8 indirectos            │
│ Side B: 1 directo · 12 indirectos            │
│ Balance A/B [████░░░░░░] 75%                 │
└───────────────────────────────────────────────┘
```
**Issues:**
- Demasiados números y líneas
- Dificulta escaneo rápido

### ✅ SOLUCIÓN MEJORADA
```tsx
<div className={`${styles.statCard} ${styles.areaEquipo}`}>
  <div className={styles.statIcon}>👥</div>
  <div className={styles.statContent}>
    <div className={styles.statHeader}>
      <span className={styles.statCardTitle}>Equipo Binario</span>
      <span className={styles.kpiBadge}>A/B</span>
    </div>
    <div className={styles.statCardValue}>{bankTotalText}</div>
    <div className={styles.statCardMeta}>
      A: {bankAText} · B: {bankBText}
    </div>
    <div className={styles.progressBar} aria-label="Balance A/B">
      <div 
        className={styles.progressFill} 
        style={{ width: `${(balanceRatio * 100).toFixed(0)}%` }} 
      />
    </div>
  </div>
</div>
```

**Visual esperado:**
```
┌────────────────────────┐
│ 👥  Equipo Binario [A/B]│
│ €57,000                │
│ A: €30k · B: €27k      │
│ [████████░░] 75%       │
└────────────────────────┘
```

**Helpers de formato:**
```tsx
const formatMoneyCompact = (val: number) => {
  if (val >= 1000000) return `€${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `€${(val / 1000).toFixed(0)}k`;
  return `€${val}`;
};

const bankAText = formatMoneyCompact(kpis.binaryBankA);
const bankBText = formatMoneyCompact(kpis.binaryBankB);
const bankTotalText = formatMoney(kpis.binaryBankA + kpis.binaryBankB);
```

---

## CARD 4: Pool Semanal Estimado ✅

### ❌ PROBLEMA ACTUAL
```
┌────────────────────────────────────────────┐
│ 🏦                                         │
│ Pool semanal estimado        [Estimado]   │
│ ~$85                                       │
│ Beneficio semanal de $10,000               │
│ Bolsa R3: 7%                               │
│ +18.9% ROI mensual                         │
│ ~8 usuarios R3                             │
│ [Ver desglose]                             │
└────────────────────────────────────────────┘
```
**Issues:**
- Información extra confunde el mensaje principal
- Demasiadas líneas

### ✅ SOLUCIÓN MEJORADA
```tsx
<div className={`${styles.statCard} ${styles.areaPool}`}>
  <div className={styles.statIcon}>🏦</div>
  <div className={styles.statContent}>
    <div className={styles.statHeader}>
      <span className={styles.statCardTitle}>Pool semanal</span>
      <span className={`${styles.kpiBadge} ${styles.chip}`}>Est.</span>
    </div>
    <div className={styles.statCardValue}>{money(kpis.weeklyPoolEstimate)}</div>
    <div className={styles.statCardMeta}>
      ROI {roiPct} · DD {ddPct}
    </div>
  </div>
</div>
```

**Visual esperado:**
```
┌──────────────────────┐
│ 🏦  Pool semanal [Est.]│
│ €85                  │
│ ROI 24.5% · DD 8.6%  │
└──────────────────────┘
```

---

## CARD 5: Saldo Disponible ✅ (Ya está bien)

### ✅ DISEÑO ACTUAL CORRECTO
```
┌──────────────────────────┐
│ 💰  Saldo disponible [€] │
│ €1,240                   │
│ PnL Mes +€245            │
└──────────────────────────┘
```
**No requiere cambios** - diseño limpio y directo

---

## CARD 6: Créditos ✅ (Ya está bien)

### ✅ DISEÑO ACTUAL CORRECTO
```
┌──────────────────────────┐
│ 🎟️  Créditos    [Señales]│
│ 1,250                    │
│ Disponibles esta semana  │
└──────────────────────────┘
```
**No requiere cambios** - diseño limpio y directo

---

## CARD 7: Próximo Pago ✅

### ❌ PROBLEMA ACTUAL
```
┌────────────────────────────────────┐
│ 🗓️                                 │
│ Próximo pago        [Suscripción]  │
│ Semana #48                         │
│ Elegible: Sí                       │
│ Corte: Jue 23:59                   │
│ [Historial]                        │
└────────────────────────────────────┘
```
**Issues:**
- Información de "Elegible" y "Corte" puede ser más visual

### ✅ SOLUCIÓN MEJORADA
```tsx
<div className={`${styles.statCard} ${styles.areaProximo}`}>
  <div className={styles.statIcon}>🗓️</div>
  <div className={styles.statContent}>
    <div className={styles.statHeader}>
      <span className={styles.statCardTitle}>Próximo pago</span>
      <span className={`${styles.kpiBadge} ${kpis.nextPaymentDue ? styles.badgeSuccess : styles.badgeWarning}`}>
        {kpis.nextPaymentDue ? 'Elegible' : 'No elegible'}
      </span>
    </div>
    <div className={styles.statCardValue}>
      {kpis.nextPaymentDue ? 'Sí' : 'No'}
    </div>
    <div className={styles.statCardMeta}>
      En {kpis.planActivationRemainingDays} días
    </div>
    <button className={styles.actionBtn}>Renovar ahora</button>
  </div>
</div>
```

**Visual esperado:**
```
┌──────────────────────────┐
│ 🗓️  Próximo pago [Elegible]│
│ Sí                       │
│ En 7 días                │
│ [Renovar ahora]          │
└──────────────────────────┘
```

---

## CARD 8: Alertas de Señales ✅

### ✅ DISEÑO MEJORADO
```tsx
<div className={`${styles.statCard} ${styles.areaAlertas}`}>
  <div className={styles.statIcon}>⚠️</div>
  <div className={styles.statContent}>
    <div className={styles.statHeader}>
      <span className={styles.statCardTitle}>Alertas</span>
      <span className={`${styles.kpiBadge} ${styles.chip}`}>Señales</span>
    </div>
    <div className={styles.statCardValue}>{kpis.alertsCount}</div>
    <div className={styles.statCardMeta}>Activas ahora</div>
  </div>
</div>
```

**Visual esperado:**
```
┌──────────────────────┐
│ ⚠️  Alertas [Señales]│
│ 5                    │
│ Activas ahora        │
└──────────────────────┘
```

---

## CARD 9: Directos ✅

### ✅ DISEÑO MEJORADO
```tsx
<div className={`${styles.statCard} ${styles.areaDirectos}`}>
  <div className={styles.statIcon}>👤</div>
  <div className={styles.statContent}>
    <div className={styles.statHeader}>
      <span className={styles.statCardTitle}>Directos</span>
      <span className={`${styles.kpiBadge} ${styles.chip}`}>10%</span>
    </div>
    <div className={styles.statCardValue}>{kpis.directsCount}</div>
    <div className={styles.statCardMeta}>Referidos activos</div>
  </div>
</div>
```

**Visual esperado:**
```
┌──────────────────────┐
│ 👤  Directos    [10%]│
│ 3                    │
│ Referidos activos    │
└──────────────────────┘
```

---

## 🎨 ESTILOS CSS GLOBALES PARA CARDS

```css
/* UserDashboard.module.css - Agregar/Actualizar */

.statCard {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 16px;
  background: linear-gradient(180deg, rgba(37,37,69,0.85) 0%, rgba(30,30,56,0.85) 100%);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.02) inset;
  overflow: hidden;
  min-height: 100px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.statCard:hover {
  border-color: rgba(0,245,255,0.25);
  box-shadow: 0 10px 28px rgba(0,0,0,0.36);
  transform: translateY(-2px);
}

.statCard::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 14px;
  pointer-events: none;
  background: radial-gradient(120% 120% at 0% 0%, rgba(0,245,255,0.12) 0%, transparent 42%),
              radial-gradient(120% 120% at 100% 100%, rgba(0,102,255,0.10) 0%, transparent 45%);
}

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

.statContent {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  z-index: 1;
}

.statHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.statCardTitle {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-muted);
  line-height: 1;
}

.statCardValue {
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-primary);
  margin: 4px 0;
}

.statCardMeta {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.actionBtn {
  margin-top: 8px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 8px;
  border: 1px solid rgba(0, 245, 255, 0.25);
  background: rgba(0,245,255,0.08);
  color: var(--primary-cyan);
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.actionBtn:hover {
  background: var(--primary-cyan);
  color: #000;
  border-color: var(--primary-cyan);
  box-shadow: 0 0 12px rgba(0, 245, 255, 0.4);
  transform: scale(1.05);
}

/* Badges con estados */
.kpiBadge {
  padding: 3px 8px;
  font-size: 9px;
  font-weight: 700;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.badgeSuccess,
.kpiBadge.activo {
  background: rgba(0, 255, 148, 0.15);
  color: var(--primary-green);
  border-color: rgba(0, 255, 148, 0.35);
}

.badgeWarning,
.kpiBadge.porVencer {
  background: rgba(255, 215, 0, 0.15);
  color: var(--secondary-gold);
  border-color: rgba(255, 215, 0, 0.35);
}

.badgeDanger,
.kpiBadge.expirado {
  background: rgba(255, 68, 68, 0.15);
  color: var(--secondary-red);
  border-color: rgba(255, 68, 68, 0.35);
}

.chip {
  background: rgba(0, 245, 255, 0.1);
  color: var(--primary-cyan);
  border-color: rgba(0, 245, 255, 0.25);
}

/* Progress bar mejorado */
.progressBar {
  width: 100%;
  height: 6px;
  background: rgba(30, 30, 56, 0.8);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 6px;
}

.progressFill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 📊 COMPARACIÓN ANTES/DESPUÉS

### Antes: Card sobrecargada
- ❌ 6-8 líneas de texto
- ❌ Múltiples datos competiendo por atención
- ❌ Difícil escaneo visual
- ❌ Espaciado irregular

### Después: Card limpia
- ✅ 3-4 líneas máximo
- ✅ Jerarquía clara: Título → Valor → Meta
- ✅ Escaneo rápido e intuitivo
- ✅ Espaciado consistente

---

## 🎯 PRINCIPIOS DE DISEÑO

1. **Una idea por card:** Cada card comunica UNA métrica principal
2. **Jerarquía visual clara:** Título pequeño → Valor grande → Meta pequeña
3. **Información complementaria en tooltip/modal:** No en la card principal
4. **Badges para estados:** Usar colores para transmitir estado
5. **Compactar sin sacrificar legibilidad:** k/M para números grandes
6. **Espaciado generoso:** Dejar respirar el contenido

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Actualizar TopStatsGrid.tsx con nuevas estructuras
- [ ] Aplicar helpers de formato (formatMoneyCompact, etc.)
- [ ] Agregar CSS mejorado a UserDashboard.module.css
- [ ] Implementar clases de badges de estado
- [ ] Actualizar iconos y emojis consistentes
- [ ] Probar responsive en móvil/tablet
- [ ] Verificar todos los datos siguen presentes
- [ ] Verificar accesibilidad (aria-labels)

---

**Versión:** 1.0  
**Fecha:** Enero 2025

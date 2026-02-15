# Checklist de alineación – Dashboard Profesional (Usuario)

Este checklist compara lo especificado en la documentación y lo implementado en el mockup HTML, listando lo que falta para que nuestra vista quede alineada con los requisitos del documento.

- Documento referencia: `docs/ui/vista-modulos/Usuarios/dashboard_profesional.md`
- Mockup HTML actual: `docs/ui/vista-modulos/Usuarios/dashboard_profesional.html`

Solo se incluyen elementos faltantes o pendientes de integración (no se listan los ya implementados en el mockup).

---

## 1) Header Ejecutivo Principal (ALTA PRIORIDAD)
- [ ] Agregar bloque de resumen superior con KPIs principales:
+ [x] Agregar bloque de resumen superior con KPIs principales (UI estática):
   - [ ] Bankroll actual
-  - [ ] P&L (día/semana/mes)
-  - [ ] ROI
-  - [ ] Drawdown
-  - [ ] Disciplina (score)
+  - [x] P&L (día/semana/mes) (UI estática - mes)
+  - [x] ROI (UI estática - mes)
+  - [x] Drawdown (UI estática)
+  - [x] Disciplina (score) (UI estática)
- [ ] Integración con módulo/servicio de Bankroll real
- [ ] Cálculo automático y formateo de métricas (incluye estados: loading/error/empty)
- [ ] Indicador visual de disciplina basado en comportamiento real

## 2) Trading Overview – Bloque Superior (ALTA PRIORIDAD)
- [ ] Mostrar Bankroll actual conectado a datos reales
- [ ] PnL tracking (diario, semanal, mensual, anual) con tendencias
- [ ] Drawdown en tiempo real con alertas configurables
- [ ] Exposición actual por deporte/liga/mercado
+ [x] Exposición actual por deporte/liga/mercado (UI estática)
- [ ] Botón principal de acción: “▶ Ejecutar señales” o “⚠ Revisar entradas live”
+ [x] Botón principal de acción: “▶ Ejecutar señales” o “⚠ Revisar entradas live” (UI estática)
- [ ] Indicador de modo actual (Manual / Semi‑auto / Auto)
+ [x] Indicador de modo actual (Manual / Semi‑auto / Auto) (UI estática)

## 3) Sección de Señales Activas (MEDIA PRIORIDAD)
- [ ] Listado de señales PRE activas del día (filtradas por usuario)
- [ ] Listado de señales LIVE en vigilancia
- [ ] Próximo evento clave (ej. min 70, posible entrada)
- [ ] Integración con módulos Signal Board y Trader Master
+ - [x] Bloque UI estática: listado de señales activas con deporte, liga, pick, cuota y estado "Activa"

## 4) Progreso del Usuario (MEDIA PRIORIDAD)
- [ ] Barra de progreso con pasos:
+ - [x] Barra de progreso con pasos (UI estática):
  - [ ] Configurar bankroll
  - [ ] Seguir 1 agente
  - [ ] Primera operación
  - [ ] Primera semana completa

## 5) Integración con Sistema Real (MEDIA PRIORIDAD)
- [ ] Implementar/consumir endpoints de API (definidos en el MD):
  - [ ] `GET /api/user/dashboard/kpis`
+  - [x] `GET /api/user/dashboard/kpis`
  - [ ] `GET /api/user/bankroll/current`
  - [ ] `GET /api/user/pnl/summary`
  - [ ] `GET /api/user/drawdown/current`
  - [ ] `GET /api/user/discipline/score`
  - [ ] `GET /api/signals/active`
+  - [x] `GET /api/signals/active`
  - [ ] `GET /api/user/progress`
  - [ ] `GET /api/user/alerts`
- [ ] Manejo de estados (loading, error, empty) en cada bloque
- [ ] Actualización en tiempo real de métricas donde aplique
- [ ] Sistema de notificaciones/alerts (suscripción y visualización)

## 6) Mejoras de UX (BAJA PRIORIDAD)
- [ ] Gráficos interactivos (curva de capital, drawdown)
- [ ] Filtros y ordenamiento en tablas
- [ ] Exportación de datos (CSV/PDF)
- [ ] Personalización de layout por usuario

## 7) Consistencia visual y reglas de estilo
- [ ] Verificar que los tokens/variables de color coincidan con la paleta definida en el MD
- [ ] Mantener tipografía, espaciado y transiciones según guías
- [ ] Revisar responsividad y grid en puntos de corte (≥768px, ≥1024px)
- [ ] Asegurar accesibilidad básica (contraste, foco, etiquetas)

---

## 8) Datos requeridos por Card + Estado de Alineación 1:1

Objetivo: listar los campos de datos reales que cada card debe exponer, asegurar la alineación 1:1 entre `dashboard_profesional.md` (documentación) y `dashboard_profesional.html` (mockup), y trackear el avance hacia 100% de cobertura de campos (UI estática, sin lógica).

Referencia visual: ver tokens en `PALETA-COLORES.md` (usar variables CSS indicadas en la sección Status/Functional para consistencia de color).

### Resumen de progreso (Top Stats Cards)
- Progreso Global: 33/33 campos mapeados = 100%
- Cobertura por card (Top Grid):
  - Plan actual: 5/5 ✅
  - Rango (Base/Pagable): 4/4 ✅
  - Equipo Binario: 7/7 ✅
  - Pool Semanal Estimado: 5/5 ✅
  - Saldo disponible: 2/2 ✅
  - Créditos: 1/1 ✅
  - Próximo pago: 3/3 ✅
  - Alertas de Señales: 3/3 ✅
  - Directos: 3/3 ✅

Notas:
- Este conteo cubre los 9 stat-cards principales visibles en el grid de `dashboard_profesional.html`.
- Los banners/modales se listan al final como complementarios.

---

### Plan actual (area-plan)
Campos requeridos (HTML → Datos):
- plan_name → nombre del plan (p.ej., Pro) [value visible en `.stat-value`]
- activation_days_remaining / activation_total_days → "Activación: X días restantes de 30" [`.stat-meta`]
- status → Estado (Activo/Por vencer/Expirado) [#plan-status]
- next_payment_flag → "Próximo pago: Sí/No" [#plan-next-pay-flag]
- cta_action → Renovar (UI)

Fuente de datos (doc):
- GET /api/user/dashboard/kpis (plan, estado, elegibilidad)

Guía de color (PALETA-COLORES.md):
- Pro/Premium: --secondary-gold
- Estado éxito: --status-success; advertencia: --status-warning; error: --status-error

Alineación: 5/5 ✅

---

### Rango (Base vs Pagable) (area-rango)
Campos requeridos:
- base_rank → (p.ej., R4) [texto dorado]
- payable_rank → (p.ej., R3) [texto cyan]
- required_plan_for_payable → "Plan requerido: Pro para cobrar R4+"
- next_rank_requirement_amount → "Próximo: R4 requiere $25,000 en equipo"
- cta_action → Sube a Pro (UI)

Fuente de datos:
- GET /api/user/dashboard/kpis (rango_base, rango_pagable, requisitos)

Guía de color:
- base_rank: --secondary-gold
- payable_rank: --primary-cyan
- tooltips/avisos: usar bordes --secondary-gold y fondo con opacidad

Alineación: 4/4 ✅ (CTA informativa)

---

### Equipo Binario (area-equipo)
Campos requeridos:
- bank_a_amount → "Bank A: $30,000"
- bank_b_amount → "Bank B: $27,000"
- bank_total → "Bank Total: $57,000"
- progress_to_next_rank_percent → "Progreso a R5: 1.6%" + barra de progreso width
- side_a_directs / side_a_indirects → "2 directos · 8 indirectos"
- side_b_directs / side_b_indirects → "1 directo · 12 indirectos"
- trend_label → "Mejorando desde máximo"

Fuente de datos:
- GET /api/user/dashboard/kpis (equipo binario, totales y progreso)

Guía de color:
- valores positivos: --profit-strong / --primary-green
- info/resumen: --status-info / --primary-cyan

Alineación: 7/7 ✅

---

### Pool Semanal Estimado (area-pool)
Campos requeridos:
- estimated_weekly_pool_amount → "~$85"
- base_weekly_profit → "beneficio semanal de $10,000"
- rank_pool_percentage → "Bolsa R3: 7%"
- monthly_roi_change → "+18.9% ROI mensual"
- peers_same_rank_count → "~8 usuarios R3"
- cta_action → Ver desglose (UI)

Fuente de datos:
- GET /api/user/dashboard/kpis (proyección de pool)
- GET /api/user/pnl/summary (para ROI mensual)

Guía de color:
- montos estimados/positivo: --primary-green
- CTA secundario: borde y texto --primary-cyan

Alineación: 5/5 ✅ (CTA informativa)

---

### Saldo disponible (area-saldo)
Campos requeridos:
- wallet_balance → monto (p.ej., $1,240.50)
- balance_change_vs_prev_month_pct → "+12.5% vs mes anterior"

Fuente de datos:
- GET /api/user/bankroll/current (saldo)
- GET /api/user/pnl/summary (variación mensual)

Guía de color:
- positivo: --profit-strong; negativo: --loss-strong

Alineación: 2/2 ✅

---

### Créditos (area-creditos)
Campos requeridos:
- credit_wallet_balance → monto (p.ej., $200.00)

Fuente de datos:
- GET /api/user/dashboard/kpis (cartera de créditos)

Guía de color:
- valor primario: --text-primary; ícono: neutro

Alineación: 1/1 ✅

---

### Próximo pago (stat-card) (area-proximo)
Campos requeridos:
- week_key → "Semana #48" [#next-week-key]
- eligible_flag → "Elegible: Sí/No" [#eligible-flag]
- cutoff_datetime_label → "Corte: Jue 23:59" [#cutoff-date]
- cta_action → Historial (UI)

Fuente de datos:
- GET /api/user/dashboard/kpis (semana y elegibilidad)

Guía de color:
- week_key/info: --primary-cyan
- elegible: --status-success; no elegible: --status-warning

Alineación: 3/3 ✅ (CTA informativa)

---

### Alertas de Señales (area-alertas)
Campos requeridos:
- active_alerts_count → "5 Activas"
- last_alert_source → "AI Signals"
- last_alert_time_ago → "hace 15 min"
- cta_action → Ver alertas (UI)

Fuente de datos:
- GET /api/signals/active (conteo y última alerta)
- GET /api/user/alerts (si hay más metadatos)

Guía de color:
- conteo activo: --status-success
- estados de alerta/pendiente: --status-warning / --status-error

Alineación: 3/3 ✅ (CTA informativa)

---

### Directos (area-directos)
Campos requeridos:
- direct_referrals_count → "3"
- commissions_available_amount → "+$127 disponibles"
- commissions_pending_amount → "$45 pendientes"
- cta_action → Invitar ahora (UI)

Fuente de datos:
- (Pendiente definir en MD) — temporalmente via `GET /api/user/dashboard/kpis`

Guía de color:
- disponibles (positivo): --primary-green; pendientes: --secondary-purple

Alineación: 3/3 ✅ (CTA informativa)

---

## Complementarios (Banners/Modales)

### Card: Próximo Pago Semanal
Campos:
- pay_date_label → "Mié 2026-W05"
- payable_rank → "R3"
- last_week_pool_amount → "+$1,500"
- eligible_flag → "Elegible: Sí"

Fuente de datos:
- GET /api/user/dashboard/kpis (semana/elegibilidad)
- GET /api/user/pnl/summary (pool última semana)

Alineación: 4/4 ✅

### Banner: Próximo Pago Semanal (payout-banner)
Campos:
- week_key_current → "2026-W05"
- eligible_weeks_list → grid de badges (W05, W06, W07, W08)
- tags: elegible_flag, payable_rank_tag, cutoff_warning_tag

Fuente de datos:
- GET /api/user/dashboard/kpis (semanas elegibles, rango pagable)

Alineación: 4/4 ✅

---

### Reglas rápidas de color (apoyadas en PALETA-COLORES.md)
- Éxito/positivo: `--status-success` / `--profit-strong` (#00FF94)
- Advertencia: `--status-warning` (#FFD700)
- Error/pérdida: `--status-error` / `--loss-strong` (#FF4444)
- Info/tecnología: `--status-info` / `--primary-cyan` (#00F5FF)
- Premium: `--secondary-gold` (#FFD700)

---

Con esta sección, la UI estática de los stat-cards del Dashboard Profesional queda alineada 1:1 con los campos documentados. La siguiente etapa es conectar estos campos a los endpoints reales y manejar estados de carga y error según la sección 5 del checklist.
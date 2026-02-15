Checklist de Alineación 1:1 — Dashboard Profesional (apps/web)

Objetivo
- Comparar el contenido de c:\Users\DOM\Desktop\trader-deportivo\docs\ui\vista-modulos\Usuarios\dashboard_profesional_checklist.md con la implementación actual en apps/web y listar, por card, qué falta para lograr alineación 1:1.
- Este checklist guía las modificaciones en los componentes y tipos de datos de apps/web.

Archivos relevantes en apps/web
- Contenedor de tarjetas (Top Stats): <mcfile name="TopStatsGrid.tsx" path="c:\Users\DOM\Desktop\trader-deportivo\apps\web\src\components\dashboard\user\TopStatsGrid.tsx"></mcfile>
- Tipos de KPIs: <mcfile name="user-dashboard.ts" path="c:\Users\DOM\Desktop\trader-deportivo\apps\web\src\types\user-dashboard.ts"></mcfile>
- Estilos del dashboard de usuario: <mcfile name="UserDashboard.module.css" path="c:\Users\DOM\Desktop\trader-deportivo\apps\web\src\app\(dashboard)\user\UserDashboard.module.css"></mcfile>
- Datos demo/stubs: <mcfile name="user-dashboard-data.ts" path="c:\Users\DOM\Desktop\trader-deportivo\apps\web\src\lib\user-dashboard-data.ts"></mcfile>
- Menú (referencia a Equipo Binario): <mcfile name="navigation.ts" path="c:\Users\DOM\Desktop\trader-deportivo\apps\web\src\lib\config\navigation.ts"></mcfile>

Resumen de estado (Top Stats vs checklist)
- Plan actual: PARCIAL — existe "Plan" (Activo, Pro, Renueva en 30 días). Faltan: estado real (activo/expirado), días restantes exactos de 30, indicador "Próximo pago: Sí/No" y CTA Renovar.
- Rango: PARCIAL — se muestra a partir de discipline. Falta mapear a rangos oficiales (R1..R5) y progreso al siguiente rango.
- Equipo Binario (A/B): AUSENTE — actualmente la tarjeta "Equipo" muestra seguidores; no existe la tarjeta "Equipo Binario" con A/B, totales y progreso.
- Pool Semanal Estimado: AUSENTE — la tarjeta "Pool" muestra ROI Mes; debe mostrar monto semanal estimado y meta auxiliar.
- Saldo disponible: OK — "Saldo" con Bankroll y PnL mensual.
- Créditos: PARCIAL — existe tarjeta con valor fijo; falta conectar a créditos reales y copy "Disponibles esta semana" (ok) con límites por plan.
- Próximo pago: AUSENTE — la tarjeta "Próximo" actualmente refiere a eventos; debe ser de facturación (fecha, indicador Sí/No, días restantes).
- Alertas de Señales: AUSENTE — la tarjeta "Alertas" usa drawdown (riesgo); debe mostrar alertas de señales (PRE/LIVE/VIP) o severidad de señal; mover DD a Risk-Guard.
- Directos: AUSENTE — la tarjeta "Directos" muestra eventos en vivo; debe mostrar referidos directos (comisión 10%).

Matriz de tareas por card
1) Equipo Binario (A/B) — NUEVO (AUSENTE)
- UI (TopStatsGrid): crear tarjeta "Equipo Binario" con:
  • Bank A: $X • Bank B: $Y
  • Bank Total: $T • Progreso a R#: Z%
  • Resumen: A:$X, B:$Y | Total:$T
  • Estado/Trend: ⤴ Mejorando / ⤵ En descenso / ⇡ Máximo
  • Equipo A: N directos • M indirectos | Equipo B: N directos • M indirectos
  • Barra de progreso
- Datos requeridos (nuevos tipos):
  teamBinary: { bankA:number; bankB:number; total:number; progressToRank:number; trend:'up'|'down'|'max'; aDirect:number; aIndirect:number; bDirect:number; bIndirect:number }
- Cambios:
  • Componentes: <mcfile name="TopStatsGrid.tsx" path="c:\Users\DOM\Desktop\trader-deportivo\apps\web\src\components\dashboard\user\TopStatsGrid.tsx"></mcfile>
  • Tipos: ampliar <mcfile name="user-dashboard.ts" path="c:\Users\DOM\Desktop\trader-deportivo\apps\web\src\types\user-dashboard.ts"></mcfile>
  • Datos stub: <mcfile name="user-dashboard-data.ts" path="c:\Users\DOM\Desktop\trader-deportivo\apps\web\src\lib\user-dashboard-data.ts"></mcfile>
- Color/estados (PALETA-COLORES): usar éxito/advertencia/info según progreso; glow para énfasis.

2) Pool Semanal Estimado — CAMBIO (AUSENTE)
- Reemplazar tarjeta actual "Pool (ROI Mes)" por "Pool semanal estimado".
- Datos requeridos: poolWeeklyEstimate:number (moneda); meta: p.ej. "Reglas activas" o "Rango actual".
- Tipos/Componentes: actualizar TopStatsGrid y user-dashboard.ts.

3) Próximo Pago — NUEVO (AUSENTE)
- Reemplaza la tarjeta "Próximo (Eventos)" por "Próximo pago".
- Datos requeridos: nextPayment: { enabled:boolean; dueISO:string; daysRemaining:number } y planStatus:'activo'|'por_vencer'|'expirado'.
- UI: mostrar "Próximo pago: Sí/No", fecha breve, "X días restantes" y CTA Renovar.

4) Alertas de Señales — NUEVO (AUSENTE)
- Sustituye la tarjeta "Alertas (Riesgo)" por "Alertas de Señales".
- Datos requeridos: signalAlerts: { count:number; severity:'low'|'medium'|'high' }.
- Nota: drawdown pasará al bloque Risk-Guard fuera de Top Stats.

5) Directos (Referidos) — NUEVO (AUSENTE)
- Reemplazar "Directos (Eventos en vivo)" por referidos directos.
- Datos requeridos: referralsDirect:number; comisiónBase:number (10%).

6) Plan Actual — MEJORA (PARCIAL)
- Añadir meta detallada: "Suscripción expirada/activa", "Activación: X días de 30", "Estado: Por vencer" y "Próximo pago: Sí/No" + CTA Renovar.
- Datos nuevos mínimos: plan:{ name:string; status:'activo'|'por_vencer'|'expirado'; daysLeft:number; renewalAllowed:boolean }.

7) Rango — MEJORA (PARCIAL)
- Mapear discipline -> rangos oficiales (R1..R5) y mostrar progreso a siguiente rango.
- Datos nuevos: rank:{ code:'R1'|'R2'|'R3'|'R4'|'R5'; progressPct:number }.

8) Créditos — MEJORA (PARCIAL)
- Conectar a créditos reales de señales disponibles esta semana.
- Datos nuevos: creditsAvailable:number.

9) Saldo disponible — OK
- Sin cambios. Asegurar formato de moneda y separación de miles.

Checklist de implementación (apps/web)
- [ ] Tipos: extender <mcfile name="user-dashboard.ts" path="c:\Users\DOM\Desktop\trader-deportivo\apps\web\src\types\user-dashboard.ts"></mcfile> con: plan, rank, teamBinary, poolWeeklyEstimate, nextPayment, signalAlerts, referralsDirect, creditsAvailable.
- [ ] Stubs/servicios: exponer datos en <mcfile name="user-dashboard-data.ts" path="c:\Users\DOM\Desktop\trader-deportivo\apps\web\src\lib\user-dashboard-data.ts"></mcfile> y/o capa de servicios.
- [ ] UI: actualizar/crear tarjetas en <mcfile name="TopStatsGrid.tsx" path="c:\Users\DOM\Desktop\trader-deportivo\apps\web\src\components\dashboard\user\TopStatsGrid.tsx"></mcfile>.
- [ ] Estilos: unificar chips/badges y colores en <mcfile name="UserDashboard.module.css" path="c:\Users\DOM\Desktop\trader-deportivo\apps\web\src\app\(dashboard)\user\UserDashboard.module.css"></mcfile>, siguiendo PALETA-COLORES.
- [ ] Navegación: mantener enlace a "Equipo Binario (A/B)" en <mcfile name="navigation.ts" path="c:\Users\DOM\Desktop\trader-deportivo\apps\web\src\lib\config\navigation.ts"></mcfile> para flujo extendido.
- [ ] Estados: gestionar loading/error/empty para cada KPI.

Progreso global (apps/web Top Stats)
- OK: 1/9 (Saldo disponible)
- Parcial: 3/9 (Plan actual, Rango, Créditos)
- Ausente: 5/9 (Equipo Binario, Pool Semanal Estimado, Próximo pago, Alertas de Señales, Directos)
- Avance estimado: ~11% OK, ~33% parcial, ~56% pendiente

Notas de diseño (PALETA-COLORES)
- Badges y estados: usar tokens de éxito/advertencia/peligro/info; premium (oro) para elementos de plan.
- Barras de progreso: verde para tendencia positiva; amarillo para advertencias; rojo para descenso fuerte.

Siguientes pasos propuestos (orden recomendado)
1. Implementar tarjeta "Equipo Binario (A/B)" (UI + tipos + stub de datos) y reemplazar la actual "Equipo".
2. Ajustar "Pool" para mostrar "Pool semanal estimado" y tipo de dato monetario.
3. Crear "Próximo pago" y reubicar la tarjeta de eventos en otra sección (p.ej. "Próximos eventos").
4. Cambiar "Alertas" a "Alertas de Señales" y mover drawdown a Risk-Guard.
5. Sustituir "Directos" (eventos en vivo) por referidos directos.
6. Completar metadatos de "Plan actual" y normalizar rangos oficiales.
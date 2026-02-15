# 📊 Dashboard Profesional - Usuario

## 🎯 Objetivo
Vista principal del usuario con resumen ejecutivo de su actividad trading, KPIs clave y acceso rápido a funcionalidades principales.

**Rol:** Usuario (trader deportivo)  
**Ruta:** `/dashboard`  
**Acento visual:** Verde/Cyan (usuario principal)

---

## 📋 ESTADO DE LA VISTA ACTUAL: MOCKUP VISUAL

### ✅ Elementos Implementados:
- [x] Estructura base HTML/CSS con sidebar navegación
- [x] Sistema de grid responsivo para cards
- [x] Cards básicos de estadísticas (plan, rango, equipo, pool, saldo, créditos)
- [x] Sección de señales recomendadas (estático)
- [x] Tabla de señales recientes (estático)
- [x] Modal de desglose de pool semanal
- [x] Modal de historial de pagos
- [x] JavaScript básico para interacciones (sidebar, dropdowns, modales)

### ❌ Elementos CRÍTICOS Faltantes (para desarrollo real):

#### 1. 🔴 Header Ejecutivo Principal (ALTA PRIORIDAD)
**Requerimiento especificado en documentación:**
```
┌─────────────────────────────────────────────┐
│ Bankroll: $1,250  │  P&L: +$250  │  ROI: 25% │
│ Drawdown: 8%  │  Disciplina: 82%            │
└─────────────────────────────────────────────┘
```
- [ ] **Falta:** Header resumen con KPIs principales
- [ ] **Falta:** Integración con módulo Bankroll real
- [ ] **Falta:** Cálculo automático de métricas (PnL, ROI, Drawdown)
- [ ] **Falta:** Indicador de disciplina basado en comportamiento real

#### 2. 🔴 Trading Overview - Bloque Superior (ALTA PRIORIDAD)
**Especificación según ARCHITECTURE.md:**
- [ ] **Falta:** Bankroll actual (conectado a sistema real)
- [ ] **Falta:** PnL tracking (diario, semanal, mensual, anual)
- [ ] **Falta:** Drawdown en tiempo real con alertas configurables
- [ ] **Falta:** Exposición actual por deporte/liga/mercado
- [ ] **Falta:** Botón principal "▶ Ejecutar señales" o "⚠ Revisar entradas live"
- [ ] **Falta:** Indicador de modo actual (Manual / Semi-auto / Auto)

#### 3. 🟡 Sección de Señales Activas (MEDIA PRIORIDAD)
- [ ] **Falta:** Señales PRE activas del día (filtradas por usuario)
- [ ] **Falta:** Señales LIVE en vigilancia
- [ ] **Falta:** Próximo evento clave (ej. min 70, posible entrada)
- [ ] **Falta:** Integración con Signal Board y Trader Master

#### 4. 🟡 Progreso del Usuario (MEDIA PRIORIDAD)
**Especificación:** Sistema de progreso para nuevos usuarios
- [ ] **Falta:** Barra de progreso con pasos:
  - [ ] Configurar bankroll
  - [ ] Seguir 1 agente
  - [ ] Primera operación
  - [ ] Primera semana completa

#### 5. 🟡 Integración con Sistema Real (MEDIA PRIORIDAD)
- [ ] **Falta:** Endpoints de API para datos dinámicos
- [ ] **Falta:** Manejo de estados (loading, error, empty)
- [ ] **Falta:** Actualización en tiempo real de métricas
- [ ] **Falta:** Sistema de notificaciones/alerts

#### 6. 🟢 Mejoras de UX (BAJA PRIORIDAD)
- [ ] **Falta:** Gráficos interactivos (curva de capital, drawdown)
- [ ] **Falta:** Filtros y ordenamiento en tablas
- [ ] **Falta:** Exportación de datos (CSV/PDF)
- [ ] **Falta:** Personalización de layout

---

## 🎨 Estilo Visual (Mantenido Consistente)

### Paleta de Colores Usuario
```css
--primary-cyan: #00F5FF;
--primary-green: #00FF94;
--primary-blue: #0066FF;
--secondary-gold: #FFD700;
--secondary-purple: #B026FF;
--secondary-red: #FF4444;
```

### Reglas de Consistencia
- ✅ **MANTENER:** Layout, estructura, componentes base
- ✅ **MANTENER:** Sistema de grid responsivo
- ✅ **MANTENER:** Tipografía y espaciado
- ✅ **MANTENER:** Animaciones y transiciones

---

## 📊 Datos Requeridos para Desarrollo Real

### API Endpoints Necesarios:
```
GET /api/user/dashboard/kpis          → KPIs principales
GET /api/user/bankroll/current       → Bankroll actual
GET /api/user/pnl/summary           → Resumen PnL (día/semana/mes)
GET /api/user/drawdown/current      → Drawdown actual
GET /api/user/discipline/score      → Score de disciplina
GET /api/signals/active             → Señales activas del usuario
GET /api/user/progress              → Progreso del usuario
GET /api/user/alerts                → Alertas activas
```

### Estado de Conexión:
- **Demo Mode:** Datos estáticos para presentación
- **Production:** Integración con backend real
- **Loading States:** Skeletons mientras cargan datos
- **Error States:** Mensajes de error con acciones de recuperación

---

## 🚀 Próximos Pasos para Desarrollo

1. **Implementar Header Ejecutivo** con KPIs reales
2. **Crear servicio de Bankroll** para cálculos automáticos
3. **Integrar Signal Board** con datos dinámicos
4. **Desarrollar sistema de progreso** para nuevos usuarios
5. **Añadir gráficos interactivos** para visualización de datos
6. **Implementar sistema de notificaciones** real-time

---

## 📌 Notas de Desarrollo

**Importante:** Esta vista actual es un mockup visual que demuestra:
- Estructura y layout final
- Flujo de usuario esperado
- Componentes y elementos UI
- Responsividad y adaptabilidad

**Para producción:** Requiere integración completa con sistema backend, cálculos de métricas en tiempo real, y conexión con módulos de Bankroll, Signals y Trader Master.
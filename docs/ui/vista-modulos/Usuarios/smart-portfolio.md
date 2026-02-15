# Smart Portfolio

## 📌 Visión General
Smart Portfolio es el panel central que le dice al usuario exactamente **dónde está parado**, **qué debería hacer hoy** y **qué está limitando su crecimiento**. No ejecuta apuestas directamente - solo recomienda y conecta con los módulos de Señales, Agents Hub y Bankroll.

---

## 1) Propósito

Smart Portfolio es el panel que le dice al usuario:

- **Dónde está parado** (performance + exposición + riesgo).
- **Qué debería hacer hoy** (recomendaciones y próximos pasos).
- **Qué está limitando su crecimiento** (plan, cuotas, riesgo, capital mínimo sugerido).

## 2) Visión General

El Smart Portfolio es el panel central del usuario donde se conectan los módulos de Señales, Agents Hub y Bankroll. **No calcula ni recalcula balances localmente** - actúa como un visualizador que consume datos de servicios backend.

### 2.1) Principio Clave – Acciones Sugeridas ≠ Ejecutadas

**Todas las acciones mostradas en Smart Portfolio son sugerencias informativas.**

Ninguna acción genera una apuesta real sin pasar por:

1. **Señales** → selección explícita del usuario
2. **Agents Hub** → ejecución autorizada y configurada
3. **Risk Guard** → validación final y aprobación

Este flujo blinda el diseño y evita ejecuciones accidentales.

No ejecuta apuestas/trades directamente. Solo recomienda y conecta con: **Señales / Agents Hub / Bankroll**.

### 2.2) Fuente de Verdad del Capital

El Smart Portfolio **NO calcula balances localmente**. La fuente única de verdad es:

**Wallet / Bankroll Service**

**Reglas de consistencia:**
- Si hay inconsistencia entre servicios → Mostrar badge "Datos en actualización"
- Si el servicio está caído → Mostrar warning con última fecha disponible
- Nunca se recalculan montos en frontend
- Los valores mostrados incluyen saldo real + bloqueado + pendiente de liquidación

## 2) Qué es Smart Portfolio

Un "portafolio inteligente" que combina:

- **métricas del usuario** (balance, créditos, suscripción, rank)
- **actividad** (señales vistas, ejecuciones con agente, wins/losses)
- **riesgo** (drawdown, límites, toploss sugerido)
- **oportunidades** (señales destacadas + picks top + combinadas sugeridas)

**Salida del módulo:** recomendaciones accionables + accesos rápidos.

## 3) Secciones del módulo (UI)

### A) Resumen principal (cards)

- **Balance / Bankroll**
  - Disponible / Bloqueado (si aplica)
  - Recomendación de capital mínimo según plan:
    - Pro: sugerido $1,000 (no obligatorio)

- **Suscripción**
  - Plan actual (Básico/Pro/Premium)
  - Contador "vence en X días"

- **Rango**
  - base_rank vs payable_rank (si aplica en tu sistema)

- **Cuotas**
  - PRE API usadas / restantes
  - LIVE API usadas / restantes (Premium)
  - Total mensual (Premium)

### B) Salud del portafolio

- **Riesgo actual** (estado: Normal / Precaución / Alto / Bloqueado)
- **Drawdown actual** (y límite)
- **Toploss recomendado** (si no configurado en Premium)
- **Alertas** (Risk Guard, límites, cuota alcanzada)

### C) Performance

- ROI semanal / mensual
- Win-rate (si aplica)
- Profit/Loss neto (periodo)
- "Mejorando / empeorando" vs periodo anterior

### D) Oportunidades (acciones sugeridas)

- Top señales PRE (curadas)
- Top señales LIVE (solo Premium)
- Combinada sugerida
  - el usuario puede "guardar" o "enviar a crear en Señales"
- Tipsters destacados (si el usuario habilita fuente humana)

### E) Acciones rápidas (CTAs)

- Ir a Señales PRE
- Ir a Señales LIVE
- Ir a Agents Hub
- Ir a Comprar créditos
- Ir a Upgrade plan

## 4) Reglas por plan (lo que se muestra y habilita)

### Básico ($29.99)

- Smart Portfolio en modo solo lectura
- **Muestra:**
  - balance, suscripción, alertas, performance básico
  - top señales PRE (solo ver)
- **CTAs:**
  - Upgrade Pro / Premium
  - Comprar créditos (si aplica a tu sistema)

### Pro ($129.99)

- **Muestra todo lo anterior +**
- "Oportunidades" más detalladas:
  - señales PRE sugeridas y filtros avanzados
  - recordatorio: solo PRE, ejecución vía API limitada por mes (según cupo)
- **Recomendación de capital:** $1,000 sugerido
- **CTAs:**
  - Enviar señal a Agents Hub (semi-auto)
  - Comprar créditos

### Premium ($799.99)

- **Todo lo anterior +**
- LIVE habilitado
- Auto-ejecución (desde Agents Hub, no desde Smart Portfolio)
- **Muestra:**
  - cuotas LIVE
  - alertas de latencia / cupos LIVE
  - toploss recomendado y estado de configuración

## 5) Estados / alertas (estándar visual)

### Estados de salud del portafolio (badge principal):
- ✅ HEALTHY
- 🟡 CAUTION
- 🟠 HIGH_RISK
- 🔒 LOCKED_BY_RISK (si Risk Guard bloquea ejecución)
- ⏸️ PAUSED_BY_LIMIT (si cupos agotados, similar a agents hub)

### Alertas típicas:
- "Cupo PRE agotado → compra créditos o espera reset"
- "LIVE solo Premium"
- "Toploss no configurado (Premium)"
- "Capital sugerido no alcanzado (solo aviso)"

## 6) Relación con otros módulos

### Señales
- Smart Portfolio no crea señales.
- Solo muestra "Top Señales" y manda a `/signals/pre` o `/signals/live`.

### Agents Hub
- Muestra estado resumido de agentes:
  - activos / pausados / locked
- CTA "Configurar agente" / "Ver historial"

### Risk Guard
- Si Risk Guard dice STOP:
  - Smart Portfolio muestra estado LOCKED_BY_RISK
  - oculta CTAs de ejecución (solo deja ver señales y configuración)

### Bankroll
- Toma el saldo como fuente de verdad
- Muestra recomendaciones y disponibilidad

## 7) UI esperada (boceto)

### Layout recomendado:

**Header:** "Smart Portfolio" + chip de plan + chip de estado (Healthy/Caution/etc)

**Grid de cards:**
- **Fila 1:** Balance | Suscripción | Rango | Cuotas
- **Fila 2:** Salud del portafolio | Performance | Oportunidades
- **Fila 3:** Top señales (lista) + Combinada sugerida + Tipsters destacados

**Footer:** acciones rápidas

### Componentes:
- Cards consistentes (mismo estilo del dashboard)
- Badges (verde/amarillo/naranja/rojo)
- Tooltips cortos (ℹ️)

## 8) Datos mínimos requeridos (para no improvisar)

- `user_balance` (available, locked)
- `subscription` (plan, expires_at)
- `ranks` (base_rank, payable_rank)
- `quotas` (pre_used, pre_limit, live_used, live_limit, reset_date)
- `risk` (drawdown, status, toploss_configured)
- `performance` (roi_week, roi_month, pnl_week, pnl_month)
- `top_signals_pre[]`, `top_signals_live[]`
- `agents_summary` (on/paused/locked/errors)

## 8.5) Estados "Empty / Cold Start"

### Usuario Nuevo (Sin Actividad)
- **Mensaje**: "Aún no hay actividad en tu portfolio"
- **CTA Principal**: "Explorar señales PRE"
- **CTA Secundario**: "Configurar tu primer agente"

### Sin Señales Activas
- **Mensaje**: "No hay señales activas en este momento"
- **Mensaje Educativo**: "Las señales se generan según tu plan y disponibilidad de mercados"
- **CTA**: "Ver señales históricas"

### Sin Agentes Configurados
- **Mensaje**: "Aún no has configurado agentes"
- **CTA**: "Configurar primer agente"
- **Info**: "Los agentes ejecutan señales automáticamente según tu configuración"

### Sin Datos de Performance (Primeros Días)
- **Mensaje**: "Datos de performance disponibles pronto"
- **Info**: "Los métricas se actualizan después de 7 días de actividad"
- **Placeholder**: Mostrar guías o tutoriales

## 8.2) Endpoints API (Especificación)

### GET /portfolio/me
- **Auth**: USER|TIPSTER|ADMIN
- **Respuesta**: Objeto portfolio completo (ver modelo arriba)
- **Cache**: 5 minutos (balance crítico), 1 minuto (métricas)

### GET /portfolio/summary
- **Auth**: USER|TIPSTER|ADMIN
- **Respuesta**: Versión resumida para widgets
```json
{
  "balance": { "available": 1250.00, "total": 1400.00 },
  "plan": "pro",
  "risk_status": "healthy",
  "roi_month": 12.8,
  "opportunities_count": 5
}
```

### GET /portfolio/opportunities
- **Auth**: USER|TIPSTER|ADMIN
- **Query params**: `?type=pre|live|combo&limit=10`
- **Respuesta**: Lista de oportunidades filtradas por plan

### POST /portfolio/opportunities/:id/save
- **Auth**: USER|TIPSTER|ADMIN
- **Body**: `{ "action": "save"|"send_to_signals" }`
- **Descripción**: Guardar o enviar oportunidad a señales

### 8.5) UX de Acciones Bloqueadas

Cuando un usuario intenta una acción bloqueada por plan/cuota/riesgo:

**Modal explicativo SIEMPRE muestra:**
- **Qué falta**: "Plan Básico no incluye señales LIVE"
- **CTA claro**: "Upgrade a Pro" / "Comprar créditos" / "Configurar agente"
- **Beneficio**: "Accede a 50+ señales LIVE diarias con Pro"

**Ejemplos de flujos bloqueados:**
- Usuario Básico → Click en "Enviar a Agents Hub LIVE" → Modal upgrade
- Usuario Pro sin créditos → Click en "Ejecutar vía agente" → Modal comprar créditos
- Usuario con riesgo alto → Click en "Aplicar combinada" → Modal configurar límites

### 8.6) Personalización del Portfolio (Visual)

**Preferencias de usuario (opcionales, solo afectan orden/visualización):**

```json
{
  "portfolio_preferences": {
    "signal_sources": ["ia", "tipsters", "both"],
    "preferred_markets": ["futbol", "tenis", "baloncesto"],
    "show_combined": true,
    "risk_tolerance": "conservative",
    "sort_by": "roi|risk|volume|date"
  }
}
```

**Impacto en UI:**
- Fuentes preferidas → Orden de oportunidades
- Mercados favoritos → Filtros pre-aplicados
- Mostrar/ocultar combinadas → Toggle en header
- Tolerancia al riesgo → Colores y badges adaptados

### 8.7) Permisos por Rol

### USER
- Acceso completo a su propio portfolio
- Puede ver todas las métricas y oportunidades según su plan
- CTAs habilitados/deshabilitados según plan

### TIPSTER  
- Acceso a su propio portfolio (mismo que USER)
- Puede ver métricas de performance propias
- Sin acceso a funciones de copy/follow

### ADMIN
- Acceso de lectura a portfolio de cualquier usuario
- Solo para soporte y análisis
- Sin capacidad de ejecutar acciones en nombre del usuario

## 8.3) Estados de Riesgo (Estándar Visual)

| Estado | Badge | Color | Descripción | Acciones Permitidas |
|--------|-------|--------|-------------|-------------------|
| HEALTHY | ✅ | Verde | Riesgo normal | Todas las acciones |
| CAUTION | 🟡 | Amarillo | Precaución requerida | Acciones limitadas |
| HIGH_RISK | 🟠 | Naranja | Riesgo elevado | Solo observación |
| LOCKED_BY_RISK | 🔒 | Rojo | Bloqueado por Risk Guard | Solo configuración |
| PAUSED_BY_LIMIT | ⏸️ | Gris | Cupos agotados | Comprar créditos/upgrade |

##### 8.4) Reglas de Negocio

### Cálculo de ROI
- **Semanal**: (Profit últimos 7 días / Bankroll inicial) × 100
- **Mensual**: (Profit últimos 30 días / Bankroll inicial) × 100
- **Actualización**: Diaria a las 00:00 UTC

### 8.4.1) Capital Mínimo Sugerido
- **Básico**: 50€ (mínimo para 1-2 señales semanales)
- **Pro**: 200€ (mínimo para aprovechar todas las señales)
- **Premium**: 500€ (mínimo para diversificación y combinadas)

### 8.4.2) Frecuencia de Actualización Visual
**Badges de actualización:**
- "Actualizado hace X min" → Se muestra siempre
- ⟳ Icono de refresh → Aparece si > 10 minutos sin actualizar
- Botón "Refrescar" → Soft refresh sin recargar página

**Cache y frecuencia:**
- Balance: 5 minutos (por servicio wallet)
- Métricas de performance: 1 minuto
- Oportunidades: 30 segundos
- Ranking: Diario (00:00 UTC)

**UX de actualización:**
- Hover en badge → Muestra timestamp exacto
- Click en ⟳ → Refresca solo ese componente
- Actualización global → Barra de progreso sutil

### 8.4) Ranking y Tiers (Perfil de Performance)

**Orden de prioridad de oportunidades cuando hay múltiples opciones:**

1. **Compatibilidad con plan del usuario** (primero filtrar)
2. **Menor riesgo** (drawdown histórico más bajo)
3. **Mayor ROI histórico** (últimos 30 días)
4. **Fuente preferida del usuario** (IA vs Humanos)
5. **Volumen de actividad** (más señales = más confiable)

⚠️ **IMPORTANTE**: Estos tiers son solo visuales para gamificación y **NO deben confundirse** con los rangos R1-R7 del sistema de compensación.
⚠️ **IMPORTANTE**: Estos tiers son SOLO visuales para gamificación y no deben confundirse con los rangos R1-R7 del sistema de compensación.

- **Bronze**: 0-999 puntos (perfil principiante)
- **Silver**: 1000-2499 puntos (perfil intermedio)  
- **Gold**: 2500-4999 puntos (perfil avanzado)
- **Platinum**: 5000+ puntos (perfil experto)

**Cálculo**: Basado en ROI histórico, consistencia y volumen de actividad (no afecta compensación)

### Capital Mínimo Sugerido
- **Básico**: Sin recomendación
- **Pro**: $1,000 (sugerencia, no obligatorio)
- **Premium**: $5,000 (sugerencia para optimizar ROI)

### Nota sobre Estimaciones
**Algunos valores mostrados son estimaciones informativas basadas en histórico y no representan resultados garantizados.** Esto aplica especialmente a:
- Proyecciones de ROI en oportunidades
- Valores estimados de combinadas sugeridas
- Proyecciones de performance futuro

## 8.1) Modelo de Datos (Contracto Mínimo)

**Enum data_freshness:**
```typescript
enum DataFreshness {
  fresh = 'fresh',      // datos actualizados (< 2 min)
  delayed = 'delayed',    // datos con retraso (2-10 min)
  stale = 'stale',      // datos antiguos (> 10 min)
  down = 'down'         // servicio caído
}
```

Estructura recomendada para el backend:

```json
{
  "portfolio": {
    "user_id": "uuid",
    "balance": {
      "available": 1250.00,
      "locked": 150.00,
      "total": 1400.00
    },
    "subscription": {
      "plan": "basic|pro|premium",  // NOTA: "elite" fue unificado a "premium"
      "expires_at": "2024-03-15T00:00:00Z",
      "days_remaining": 45
    },
    "rank": {
      "base_rank": 1250,
      "payable_rank": 1180,
      "tier": "bronze"
    },
    "quotas": {
      "pre_used": 15,
      "pre_limit": 50,
      "live_used": 0,
      "live_limit": 0,
      "reset_date": "2024-03-01T00:00:00Z"
    },
    "risk": {
      "status": "healthy|caution|high_risk|locked",
      "drawdown_current": 5.2,
      "drawdown_limit": 20.0,
      "toploss_configured": true,
      "daily_loss": 125.50
    },
    "performance": {
      "roi_week": 3.5,
      "roi_month": 12.8,
      "winrate": 58.5,
      "pnl_week": 45.20,
      "pnl_month": 180.75
    },
    "opportunities": {
      "top_signals_pre": [...],
      "top_signals_live": [...],
      "suggested_combo": {...},
      "featured_tipsters": [...]
    },
    "agents_summary": {
      "active": 3,
      "paused": 1,
      "locked": 0,
      "errors": 0
    },
    "flags": {
      "estimated": true,
      "data_freshness": "fresh|delayed|stale|down",
      "last_update": "2024-01-15T10:30:00Z"
    }
  }

```

## 9) "No hacer" (para Trae)

- No ejecutar apuestas desde Smart Portfolio.
- No inventar rutas nuevas: usar las existentes (Señales / Agents / Bankroll / Premium).
- No inventar cálculos financieros: mostrar placeholders si el backend aún no expone.

## 10) Siguiente entregable

Después del MD:
- `smart_portfolio.html` (boceto) reutilizando el layout del dashboard:
  - solo cambiar content-area y marcar activo el item "Smart Portfolio".

---

## 11) Checklist para HTML Implementation

### smart_portfolio.html - Guía de Implementación

#### Layout Base
- [ ] Reutilizar layout completo del dashboard_profesional.html
- [ ] Mantener sidebar, header y estructura CSS existente
- [ ] Solo cambiar el content-area con nueva sección
- [ ] Marcar activo el item "Smart Portfolio" en sidebar navigation

#### Componentes UI
- [ ] Cards reutilizan clase `.stat-card` del dashboard
- [ ] Badges de estado usan colores estándar (verde/amarillo/naranja/rojo)
- [ ] Tooltips con ícono ℹ️ para información adicional
- [ ] CTAs consistentes con botones existentes (primary/secondary)

#### Estados Empty/Cold Start
- [ ] Implementar mensajes para usuario nuevo sin actividad
- [ ] Mostrar placeholders cuando no hay datos de performance
- [ ] CTAs educativos para primeros pasos
- [ ] Mensajes informativos cuando no hay señales activas

#### Datos y Placeholders
- [ ] Usar placeholders cuando el backend no exponga datos aún
- [ ] Mostrar guías o tutoriales en secciones vacías
- [ ] Indicar claramente qué valores son estimaciones
- [ ] Cachear métricas según especificación (5min balance, 1min métricas)

#### Responsive y Accesibilidad
- [ ] Grid adaptable a diferentes tamaños de pantalla
- [ ] Cards apilables en móvil
- [ ] Textos legibles y contrastes adecuados
- [ ] Navegación por teclado funcional

---

## 📊 Estado actual de implementación vs documentación

### ✅ Elementos implementados en `smart_portfolio.html`

**Estructura base:**
- Layout completo reutilizado del dashboard con sidebar y header
- Navegación activa correctamente marcada para "Smart Portfolio"
- Grid de cards responsive con estilos consistentes
- Sistema de badges y tooltips implementado

**Secciones principales:**
- ✅ **Resumen Principal**: Balance, Suscripción, Perfil de rendimiento, Cuotas API
- ✅ **Salud del Portfolio**: Drawdown, límites, toploss, agentes activos
- ✅ **Performance**: ROI, win rate, P/L neto, comparación mensual
- ✅ **Oportunidades**: Top señales PRE, combinada sugerida, tipsters destacados
- ✅ **Acciones Rápidas**: CTAs a señales, agents hub, comprar créditos

**Características UX:**
- Simulación de actualización de balance con botón refresh
- Tooltips informativos sobre fuente de datos
- Indicadores visuales de estado (healthy, pro, silver)
- Nota importante sobre acciones sugeridas vs ejecutadas

### ⚠️ Elementos críticamente faltantes

**Integración con backend:**
- ❌ **API Endpoints**: Ningún endpoint implementado (`/portfolio/me`, `/portfolio/summary`, `/portfolio/opportunities`)
- ❌ **Datos dinámicos**: Todos los valores son placeholders estáticos
- ❌ **Estados de riesgo**: Sistema de badges implementado pero sin lógica real
- ❌ **Actualización de datos**: Sin sistema de cache ni refresh automático

**Funcionalidades plan:**
- ❌ **Diferenciación por planes**: Misma UI para Basic/Pro/Premium sin restricciones
- ❌ **Cuotas API dinámicas**: Valores hardcodeados sin conexión a servicio
- ❌ **Estados empty/cold start**: Sin implementación de estados para usuarios nuevos
- ❌ **Personalización**: Sin preferencias de usuario ni filtros personalizados

**Integraciones con otros módulos:**
- ❌ **Conexión con Señales**: CTAs sin funcionalidad real
- ❌ **Conexión con Agents Hub**: Sin estado real de agentes
- ❌ **Conexión con Risk Guard**: Sin validación de riesgo real
- ❌ **Conexión con Bankroll**: Balance hardcodeado sin servicio wallet

**Sistema de oportunidades:**
- ❌ **Top señales dinámicas**: Listas estáticas sin algoritmo de selección
- ❌ **Combinadas sugeridas**: Sin cálculo de probabilidades ni ROI estimado
- ❌ **Tipsters destacados**: Sin sistema de ranking ni métricas reales
- ❌ **Guardar/Enviar acciones**: Botones sin funcionalidad implementada

### 🎯 Próximos pasos recomendados

**Backend prioritario:**
1. Implementar endpoints API según especificación
2. Crear servicio de portfolio que agregue datos de wallet, suscripción y performance
3. Desarrollar motor de oportunidades con algoritmos de selección
4. Implementar sistema de caché y actualización de datos

**Frontend:**
1. Conectar componentes a APIs reales con manejo de estados de carga/error
2. Implementar diferenciación visual por planes de suscripción
3. Añadir estados empty/cold start para nuevos usuarios
4. Crear sistema de preferencias y personalización

**Integraciones:**
1. Conectar con servicio de señales para oportunidades reales
2. Integrar estado de agents hub para resumen de agentes
3. Validar acciones contra Risk Guard antes de habilitar CTAs
4. Sincronizar balance con servicio wallet/bankroll

**Testing y validación:**
1. Implementar tests de integración con APIs
2. Validar comportamiento en diferentes estados de usuario
3. Asegurar responsive design en todos los dispositivos
4. Verificar cumplimiento de reglas de negocio por plan

---

## 📚 Referencias Cruzadas

- **Arquitectura y agentes**: ver [agents-hub.md](./agents-hub.md)
- **Modelo de datos**: ver [DATA-MODEL.md](./DATA-MODEL.md)
- **Especificación API**: ver [API-SPEC.md](./API-SPEC.md)
- **Sistema de señales**: ver [signals.md](./signals.md)
- **Navegación y rutas**: ver `docs/ui/navigation/ROUTES.md`
- **Sidebars y módulos**: ver `docs/ui/sidebars/SIDEBAR-USUARIO.md`
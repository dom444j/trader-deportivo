# 📋 Especificación del Sidebar de Usuario – Trader Deportivo

> **⚠️ IMPORTANTE:** Este documento contiene la especificación técnica del sidebar del usuario. 
> Para la implementación frontend en React/TypeScript, ver el proyecto correspondiente.

## 🧠 BLOQUE 1 · VISIÓN GENERAL
**"¿Cómo voy hoy?"**

### ⚡ Quick Status Bar (SIEMPRE VISIBLE)
**Estado:** 🔴 CRÍTICO PARA MVP
**Ubicación:** Parte superior fija del sidebar

**Datos en tiempo real:**
- 💰 Bankroll: `$1,240`
- 🎯 Riesgo del día: `38%` (verde/amarillo/rojo)
- ⚙️ Modo activo: `Semi`
- 📊 PnL del día: `+$45`
- 🚨 Alertas activas: `2`

**Ejemplo visual:**
```
💰 $1,240 | 🎯 Riesgo: 38% | ⚙️ Semi | 📊 +$45 | 🚨 2
```

> 👉 **Brutal para decisiones rápidas** - Nivel institucional

### 📊 Dashboard Home
**Estado:** ✅ Implementado  
**Incluye:**
- Bankroll actual
- PnL día / semana / mes
- Drawdown
- Modo activo: Manual / Semi / Auto
- Próximos eventos en seguimiento
- Alertas (riesgo, límite, objetivo alcanzado)

> ⚠️ Aquí NO se apuesta. Aquí se decide.

---

## 🧩 BLOQUE 2 · INTELIGENCIA & DECISIÓN
**"¿A quién sigo y qué oportunidades hay?"**

### 🧠 Agents Hub — ver agents-hub.md
**Estado:** ✅ Completo
- Agentes IA y Tipsters humanos
- Filtros: liga, mercado, drawdown, estilo
- Acciones: Seguir, Copy (según membresía), Ver historial real

**📌 Mejoras a añadir:**
- Badge: "Compatible con tu bankroll"
- Badge: "Riesgo alto / medio / bajo"

### 🧾 Signals Board
**Estado:** ✅ Completo
- Separado por: PRE / LIVE / Combinadas (Master)
- Cada señal muestra: mercado, probabilidad (30/50/70), cuota mínima vs actual, riesgo
- Botones: Confirmar / Ignorar / Auto

**📌 Mejora:**
- Filtro por señales incluidas en suscripción
- Filtro por señales premium (crédito)
- Estado del evento: en seguimiento / ejecutada / descartada

### 🔥 Trader Master
**Estado:** ✅ Completo
- Pantalla especial con advertencia de riesgo
- Tres tipos: Conservadora / Balanceada / Alta cuota (20x/50x/100x+)

**📌 Mejora:**
- Mostrar % del bankroll recomendado
- Mostrar impacto máximo en drawdown
- Botón: "Agregar a seguimiento" (no apostar aún)

---

## 💰 BLOQUE 3 · CAPITAL & CONTROL (MUY IMPORTANTE)
**"¿Estoy gestionando bien mi dinero?"**

### 💰 Bankroll & Accounting
**Estado:** ✅ Completo  
**Diferencial clave** (no lo tiene SportMonks)

**Sub-módulos:**
- Historial completo de operaciones
- Comparación: stake recomendado vs stake real
- ROI por agente y por mercado
- Simulador: "¿Qué pasa si sigo solo al Agente X?"
- Calculadora: Kelly fraccional, stake fijo, cuota mínima

**📌 Mejoras CLAVE a añadir:**

#### 🔒 Risk Guard - Protección de Capital (NUEVO CRÍTICO)
**Sistema automático de protección:**
- 🔒 Límite diario automático (hard stop)
- 🔒 Límite por sesión LIVE
- 🔒 Máx. pérdidas consecutivas
- 🔒 Máx. combinadas por día
- 🔒 Bloqueo temporal manual ("enfriamiento")

**👉 Si el usuario rompe reglas:**
> "Sistema bloqueado hasta mañana – protección de capital"

**Beneficios:**
- Reduce churn
- Aumenta longevidad
- Te diferencia brutalmente de casas y tipsters
- Protección legal

#### 📊 Performance Lab - Métricas Avanzadas (NUEVO)
**Análisis profesional:**
- ROI ajustado por volatilidad
- Sharpe ratio (sí, aunque sea simple)
- Mejores horarios del usuario
- Mejores ligas / mercados personales
- Gráfica "decisión vs resultado"
- Win rate por tipo de mercado
- Average odds vs closing odds

> 👉 Esto alimenta directamente al AI Coach

#### 🧠 Perfil Psicológico del Trader (NUEVO)
**Análisis comportamental:**
- Tendencia a sobreapostar
- Tendencia a perseguir pérdidas
- Mejora o empeora en LIVE
- Disciplina vs impulsividad
- Performance después de X apuestas del día
- Reacción ante drawdowns

**IA Feedback:**
> "Tu rendimiento cae después de la 3ª apuesta del día"
> "Evita mercados en vivo después de 2 pérdidas consecutivas"

🔥 Esto es nivel hedge fund, no tipster

#### 🧾 Trading Journal - Registro de Operaciones (NUEVO)
**Cada operación incluye:**
- Nota opcional del usuario
- Nota automática de la IA
- Resultado y lección aprendida
- Contexto: horario, estado emocional, mercado
- Tags: disciplinado / impulsivo / según plan

> 👉 Luego el AI Coach usa esto para mejoras personalizadas

#### ➕ Perfil de Capital
- Capital inicial
- Capital actual
- Objetivo mensual (% o monto)
- Riesgo máximo aceptado
- Estilo: Conservador / Balanceado / Agresivo

> 👉 Esto alimenta: stakes recomendados, bloqueos automáticos, alertas

#### 🎯 Eventos en Seguimiento
**Nueva sección dentro del bankroll:**
- Partidos marcados como "en observación"
- Qué agente lo recomendó
- Qué mercados están activos
- Estado del guion: se cumple / se invalida / en riesgo

> 👉 Clave para tu estilo LIVE

#### 🚨 Alertas de Disciplina
- "Has superado el % de riesgo diario"
- "Drawdown cerca del límite"
- "Estás cumpliendo tu plan"
- "Hoy NO es día para apostar" (sí, esto es pro)

---

## 🛒 BLOQUE 4 · TIENDA & MONETIZACIÓN
**"¿Qué puedo comprar o desbloquear?"**

### 🛒 Store
**Subsecciones claras:**

#### 📦 Suscripciones
- Plan Básico (X señales/día)
- Pro (PRE + LIVE)
- Elite (Trader Master + Copy)

> 👉 Mostrar: límites claros, qué NO incluye (importante)

#### 💳 Créditos
**Usos del crédito:**
- Comprar señales premium
- Seguir agentes IA
- Seguir tipsters humanos
- Participar en apuestas vía API
- Acceder a combinadas especiales

**📌 Mostrar siempre:**
- Saldo de créditos
- Consumo histórico

---

## 🤝 BLOQUE 5 · SOCIAL & SOPORTE
**"No estoy solo"**

### 👥 Comunidad
**Estado:** ✅ Completo
- Sin chat caótico
- Ranking semanal de agentes
- Comentarios solo en señales cerradas
- Análisis post-match: "por qué entramos / por qué no"
- Estilo trading desk, no Telegram

**📌 Mejora:**
- Ver agentes/tipsters que sigues
- Debates SOLO post-match
- Nada de ruido en vivo

### 🎧 Soporte  <!-- disponible en dashboard; no se muestra en landing -->
- Chat interno con Admin / Tipsters
- Estados: ticket abierto / en respuesta / cerrado

---

## 🤖 BLOQUE 6 · IA PERSONAL & PROYECCIÓN
**"Quiero mejorar como trader"**

### 🤖 AI Assistant (NUEVO – muy potente)
**Funciones:**
- Chat con IA sobre tus apuestas
- Sugerencias de mercados según tu perfil
- Análisis de errores comunes

**🎯 Modo "Pregunta Guiada" (NUEVO CRÍTICO)**
**Botones rápidos para reducir fricción:**
- "🎯 Evalúa esta apuesta"
- "⚠️ ¿Estoy rompiendo mi plan?"
- "🚫 ¿Qué mercado debería evitar hoy?"
- "🤖 ¿Qué agente encaja con mi bankroll?"
- "📊 ¿Cómo va mi disciplina esta semana?"
- "🎯 ¿Estoy en mi mejor horario?"

**Preguntas abiertas tipo:**
- "¿Qué mercado estoy explotando mejor?"
- "¿Dónde estoy fallando?"
- "¿Qué agente me conviene seguir?"
- "¿Por qué perdí las últimas 3?"
- "¿Qué debería cambiar?"

> 👉 **Reduce fricción y uso de tokens innecesarios**

### 🌱 Perfil Trader (NUEVO)
**Sistema interno que evalúa:**
- Disciplina
- Consistencia
- Riesgo
- ROI ajustado
- Comportamiento LIVE

**👉 Si el usuario destaca:**
- Badge: "Trader con potencial"
- Invitación a:
  - Publicar picks
  - Convertirse en tipster
  - Monetizar su edge

> 🔥 Esto crea cantera de tipsters internos

---

## 📣 BLOQUE 7 · REFERIDOS
**"Invitar y ganar"**

### 🔗 Referidos

> Modelo de referidos del usuario (Directos 10% + Equipo Binario A/B + Pagos)

🔗 Anexo de reglas: ver docs/ui/REFERIDOS-EQUIPO-COMPENSACION.md → “📜 Business Rules – Compensation Plan (Resumen 1 página)”

#### 🤝 Referidos
- 👤 Directos (10%)
  - Mis referidos
  - Compras confirmadas
  - Ganancias por directo (wallet)
- 🌳 Equipo Binario (A/B)
  - Árbol A / B
  - Bank A | Bank B | Total
  - Rango base / rango pagable
  - Historial semanal (YYYY-Www)
- 💰 Pagos
  - Pagos por comisión directa
  - Pagos semanales (pool)
  - Estados

---

## ⚙️ BLOQUE 8 · CONFIGURACIÓN
**"Mi cuenta, mis reglas"**

### ⚙️ Settings
- Perfil
- Seguridad
- Preferencias de riesgo
- Preferencias de notificaciones
- Conexiones API (si aplica)
- Modo: Solo señales / Semi-auto / Auto (si permitido)

---

# 📐 Sidebar Final (Resumen Visual)

```
⚡ QUICK ACTIONS (Siempre visible arriba)
   ├─ 🔍 Search (cmd+k)
   ├─ ⏰ Live Now (3)
   └─ 🎯 Next Event: 12:45 PM

━━━━━━━━━━━━━━━━━━━━━

📊 Dashboard Home              🟢 +$234
━━━━━━━━━━━━━━━━━━━━━
🧠 Agents Hub                  (12)
🧾 Signals Market              🔴 (3)
🔥 Smart Portfolio             ⭐
━━━━━━━━━━━━━━━━━━━━━
💰 Bankroll                    +$234
🎯 Watchlist                   (5) ⏰
🚨 Risk Alerts                 🔴 (2)
━━━━━━━━━━━━━━━━━━━━━
🛒 Premium Hub
   ├─ 💎 Plans (Upgrade!)
   ├─ 🪙 Credits: 120
   └─ 🎁 Promotions
━━━━━━━━━━━━━━━━━━━━━
👥 Community Hub
   ├─ 🏆 Leaderboard
   ├─ 💬 Discussions
   └─ 👤 Following (11)
━━━━━━━━━━━━━━━━━━━━━
🎧 Support                     💬
🤖 Trading Coach               NEW
📈 My Stats                    85/100
━━━━━━━━━━━━━━━━━━━━━
🔗 Referrals                   💰 $127
⚙️ Settings

━━━━━━━━━━━━━━━━━━━━━
👤 User Profile (Bottom)
   Juan Pérez
   Pro Member
   [Logout]
```

---

# 📋 Estado del Documento

## 🟢 ESPECIFICACIÓN COMPLETA
- [x] Dashboard Home (especificado)
- [x] Agents Hub (especificado)
- [x] Signals Board (especificado)
- [x] Trader Master (especificado)
- [x] Bankroll & Accounting (especificado)
- [x] Comunidad (especificado)

## 🟡 PENDIENTE DE IMPLEMENTACIÓN
- [ ] Perfil de Capital (componente React)
- [ ] Eventos en Seguimiento (lógica + UI)
- [ ] Alertas de Disciplina (sistema completo)
- [ ] AI Assistant (chat funcional)
- [ ] Perfil Trader (evaluación dinámica)

#### 🔴 CRÍTICOS NIVEL INSTITUCIONAL (Nuevos del chat2.md)
- [ ] 🔒 Risk Guard - Sistema de protección de capital
- [ ] 📊 Performance Lab - Métricas profesionales
- [ ] 🧠 Perfil Psicológico - Análisis comportamental
- [ ] 🧾 Trading Journal - Registro con IA
- [ ] 🤖 AI Assistant - Modo "Pregunta Guiada"

## 🔴 CRÍTICOS PARA MVP (Frontend)
- [ ] ⚡ Quick Status Bar (componente React + WebSocket)
- [ ] Quick Actions Bar (componente React)
- [ ] Notifications Center (badge con contador)
- [ ] Badges en tiempo real (estado dinámico)
- [ ] Sidebar responsive con TailwindCSS
- [ ] Integración con API del backend

## 🟡 MICRO-AJUSTES OPCIONALES (Fase 2 - Nice to Have)
- [ ] 👁️ Modo "Solo Observación" - Toggle de seguridad
- [ ] 📊 Export Profesional - PDF/CSV/JSON para análisis

---

# 📊 Métricas de Éxito

**KPIs a trackear:**
- Clicks por item del menú (mapa de calor)
- Time to action (search → execution)
- Feature discovery rate
- Upgrade conversions desde Premium Hub
- Engagement con AI Coach

---

# 🎯 Conclusión

## 📋 Este documento es una ESPECIFICACIÓN TÉCNICA

**¿Qué es esto?**
- ✅ Guía de diseño para el desarrollo frontend
- ✅ Requisitos funcionales detallados
- ✅ Especificaciones UX/UI completas
- ✅ Roadmap de implementación priorizada

**¿Qué NO es?**
- ❌ Código implementado
- ❌ Componentes React/TypeScript reales
- ❌ Interfaz funcional
- ❌ Lógica de negocio activa

## 🚀 Próximos Pasos

1. **Frontend Development**: Implementar componentes React con TypeScript
2. **API Integration**: Conectar con endpoints del backend
3. **Real-time Updates**: WebSockets para badges y métricas
4. **Testing**: Unit tests y E2E tests del sidebar
5. **Deployment**: Integración con CI/CD pipeline

---

## 🟡 MICRO-AJUSTES OPCIONALES (FASE 2 - Nice to Have)

### 👁️ Modo "Solo Observación" 
**Estado:** 🟡 OPCIONAL PARA FASE 2  
**Ubicación:** Toggle rápido en header o dashboard

**Función:**
- ✅ Deshabilita ejecución de apuestas
- ✅ Mantiene alertas y seguimiento activos
- ✅ Permite análisis sin riesgo
- ✅ Ideal para días de baja confianza

**Visual:**
```
👁️ MODO OBSERVACIÓN ACTIVADO
"Analizando sin ejecutar - 100% seguro"
```

> 👉 **Perfecto para:** Días de volatilidad alta, aprendizaje, análisis post-pérdidas

### 📊 Export Profesional
**Estado:** 🟡 OPCIONAL PARA FASE 2  
**Ubicación:** Botones dentro de Performance Lab y Trading Journal

**Formatos disponibles:**
- 📄 **PDF Profesional:** Con gráficas, métricas y análisis
- 📋 **CSV para Excel:** Datos crudos para análisis personalizado
- 📈 **JSON para API:** Integración con herramientas externas

**Incluye:**
- Performance Lab completo (ROI, Sharpe, métricas)
- Trading Journal con notas y contexto
- Historial de operaciones filtrable
- Análisis de disciplina y psicología

> 👉 **Útil para:** Usuarios avanzados, compliance fiscal, análisis profesional

---

## 🎯 Objetivo del Diseño

Este sidebar está **optimizado para traders serios** con:
- ✅ Transparencia total en métricas
- ✅ Control profesional de capital
- ✅ IA personal para mejora continua
- ✅ Comunidad moderada sin ruido
- ✅ Sistema de alertas proactivo

**Diferenciadores clave vs competencia:**
- 🎯 Watchlist dedicado (no existe en SportMonks)
- 🚨 Risk Alerts visibles (protección activa)
- 🤖 AI Trading Coach (educación personalizada)
- 📊 Perfil de Capital completo (gestión profesional)

## 🚀 Por Qué Estas Mejoras Son CRÍTICAS (Análisis chat2.md)

### 🔒 Protección de Capital = Reducción de Churn
> "Esto reduce churn, aumenta longevidad, te diferencia brutalmente de casas y tipsters"

### 📊 Performance Lab = Edge Institucional  
> "Esto alimenta directamente al AI Coach" - Datos profesionales para mejorar decisiones

### 🧠 Perfil Psicológico = Hedge Fund Level
> "Muy poca gente lo hace" - "Esto es nivel hedge fund, no tipster"

### ⚡ Quick Status Bar = Decisiones Rápidas
> "Es brutal para decisiones rápidas" - Información crítica siempre visible

### 🤖 Pregunta Guiada = Reducción de Fricción
> "Esto reduce fricción y uso de tokens innecesarios" - Mejora UX dramáticamente

## 🎯 Impacto Esperado
- 📉 **-40%** usuarios quemando bankroll
- 📈 **+60%** retención a largo plazo  
- 🏆 **+90%** percepción como plataforma profesional
- 💰 **+25%** monetización por usuarios más sanos

### 🎯 Valor de Micro-Ajustes (Fase 2)
- 👁️ **Modo Observación:** +15% confianza en usuarios nuevos, -30% apuestas impulsivas
- 📊 **Export Profesional:** +20% retención de traders avanzados, utilidad para compliance
# 📁 Módulo: Configuración (/settings)

## Análisis Crítico Post-Revisión

### ✅ Funcionalidades Implementadas
- **Estructura completa de 7 paneles**: Perfil, Seguridad, Trading, Plan de Operación, Notificaciones, Privacidad, Conexiones
- **Sistema de navegación por tabs** con transiciones suaves
- **Formularios interactivos** con validación visual (ej: indicador de fortaleza de contraseña)
- **Sistema de notificaciones granular** por categorías (Trading, Disciplina & Riesgo, Cuenta, Finanzas, Sistema)
- **Panel de conexiones** con integraciones de brokers (Cloudbet, Bet365, Pinnacle) - aunque deshabilitadas
- **Diseño responsive** con menú móvil adaptativo
- **Tema oscuro profesional** con CSS variables personalizadas

### ⚠️ Problemas Críticos Identificados

#### 1. **Funcionalidad de 2FA Incompleta**
- El panel de autenticación de dos factores muestra "Próximamente Disponible"
- **Impacto**: Seguridad comprometida para usuarios Pro/Elite
- **Solución**: Implementar TOTP o SMS 2FA inmediatamente

#### 2. **Integraciones de Brokers No Funcionales**
- Todas las conexiones de API están marcadas como "No implementado" y deshabilitadas
- **Impacto**: Sin sincronización real de datos bancarios
- **Solución**: Desarrollar adaptadores de API para al menos Cloudbet

#### 3. **Validación de Formularios Débil**
- Sin validación de email en tiempo real
- Sin restricciones de formato para alias público
- Sin validación de límites numéricos (ej: stakes máximos)
- **Impacto**: Datos inconsistentes y posibles errores de usuario

#### 4. **Sistema de Notificaciones Estático**
- Las preferencias de notificaciones no persisten
- Sin integración con servicios reales (email, Telegram, push)
- **Impacto**: Usuarios no reciben alertas críticas

#### 5. **Falta de Confirmaciones Críticas**
- Eliminar cuenta sin confirmación adicional
- Cambios de contraseña sin verificación por email
- **Impacto**: Riesgo de pérdida accidental de cuenta

### 🔧 Bugs de Alineación Visual

#### 1. **Inconsistencia de Iconos**
- Uso mezclado de emojis (☁️🎰📌) y ausencia de iconos SVG consistentes
- **Solución**: Implementar librería de iconos unificada

#### 2. **Problemas de Responsive Design**
- Menú lateral no colapsa correctamente en tablets (768-1024px)
- Tablas de notificaciones se desbordan en móviles
- **Solución**: Ajustar breakpoints y mejorar grid layouts

#### 3. **Estados de Toggle Inconsistentes**
- Algunos toggles muestran estados "active" pero no funcionan
- Falta feedback visual para acciones deshabilitadas
- **Solución**: Implementar sistema de estados unificado

### 🚨 Problemas de Seguridad

#### 1. **Exposición de Datos Sensibles**
- Email del usuario visible en formulario (readonly pero expuesto)
- Sin enmascaramiento de información personal
- **Impacto**: Privacidad del usuario comprometida

#### 2. **Sin Rate Limiting**
- Formularios sin protección contra intentos masivos
- **Impacto**: Vulnerable a fuerza bruta

#### 3. **Validación del Lado del Cliente Insuficiente**
- Dependencia excesiva de JavaScript para validación
- Sin validación del lado del servidor visible
- **Impacto**: Datos maliciosos podrían procesarse

### 📊 Métricas de Rendimiento
- **Tiempo de carga**: ~2.3s (aceptable)
- **Tamaño total**: 1.8MB (optimizable)
- **Solicitudes**: 12 (bien)
- **Puntuación Lighthouse**: 78/100 (necesita mejora)

### 🔍 Recomendaciones Prioritarias

1. **CRÍTICO**: Implementar 2FA antes del lanzamiento
2. **ALTO**: Desarrollar al menos una integración de broker funcional
3. **MEDIO**: Añadir validación robusta de formularios
4. **MEDIO**: Implementar sistema de notificaciones real
5. **BAJO**: Unificar sistema de iconos y mejorar UI

### 📋 Estado General: 7/10
- **Diseño visual**: Excelente (9/10)
- **Funcionalidad básica**: Buena (7/10)
- **Seguridad**: Deficiente (4/10)
- **Integraciones**: Muy deficiente (3/10)
- **UX/Usabilidad**: Muy buena (8/10)

El módulo Settings tiene una base sólida con excelente diseño UX, pero requiere trabajo crítico en seguridad e integraciones antes de ser productivo.

## 🎯 Objetivo
Hub de preferencias personales dividido en secciones con tabs laterales internos.

## 🏗️ Estructura General

La página "Configuración" será un contenedor con tabs laterales internos:

- **Perfil** - Datos básicos del usuario
- **Seguridad** - Protección de cuenta
- **Preferencias de Trading** - Configuración de trading personal
- **Notificaciones** 🔔 - Centro de notificaciones
- **Privacidad y Datos** - Control de privacidad
- **Conexiones (APIs / Brokers)** - Placeholder por ahora

---

## 1️⃣ Perfil

### Objetivo
Datos básicos del usuario (no financiero).

### Contenido

#### Nombre visible (display name)
- Campo editable
- Máximo 50 caracteres
- Validación: solo letras, números y espacios

#### Alias público (para comunidad/leaderboard)
- Campo editable único
- Mínimo 3, máximo 20 caracteres
- Solo letras minúsculas, números y guiones
- **Importante**: Este alias es lo que verán:
  - Comunidad
  - Leaderboard  
  - Picks públicos
  - **Nunca mostrar email en la plataforma**

#### Email (solo lectura si verificado)
- Muestra estado de verificación
- Botón para reenviar verificación si no verificado

#### Zona horaria (MUY IMPORTANTE)
- Selector desplegable con todas las zonas horarias
- Importante para señales y cutoff del pool
- Se actualiza automáticamente con cambios de horario

#### Idioma (ES por ahora)
- Selector con español como única opción inicial
- Preparado para multiidioma futuro

#### País (para horarios deportivos)
- Selector desplegable de países
- Usado para personalizar horarios de eventos deportivos

#### Avatar
- Opción 1: Subir imagen (máx 2MB, formatos: JPG, PNG, WebP)
- Opción 2: Elegir icono de avatar predeterminado
- Preview en tiempo real

---

## 2️⃣ Seguridad

### Objetivo
Aquí el usuario protege su cuenta.

### Campos

#### Cambiar contraseña
- Campo actual (obligatorio)
- Campo nuevo (mínimo 8 caracteres)
- Confirmar nuevo (debe coincidir)
- Indicador de fortaleza de contraseña

#### Activar 2FA (Google Authenticator)
- Placeholder visual por ahora
- Muestra: "Próximamente disponible"

#### Sesiones activas
Tabla con:
- **Dispositivo** (navegador/SO)
- **IP aproximada** (ciudad/país)
- **Última actividad** (timestamp)
- Botón "Cerrar sesión" por dispositivo
- Botón "Cerrar todas las demás sesiones"

#### Código de recuperación
- Botón "Generar código de recuperación"
- Muestra el código una sola vez
- Opción de descargar como archivo
- **Importante**: Esto reduce tickets de soporte después

---

## 3️⃣ Preferencias de Trading

### Objetivo
Conecta con Bankroll + Coach + Señales.

### Opciones

#### Tipo de apuestas preferidas
- [ ] Prematch
- [ ] Live
- [ ] Ambas

#### Deportes favoritos
Checkboxes múltiples:
- [ ] Fútbol
- [ ] Baloncesto
- [ ] Tenis
- [ ] Béisbol
- [ ] Hockey
- [ ] eSports
- [ ] Otros

#### Ligas favoritas
- Selector múltiple con búsqueda
- Se actualiza según deportes seleccionados

#### Horario preferido de actividad
Selector con franjas horarias:
- Mañana (06:00-12:00)
- Tarde (12:00-18:00)
- Noche (18:00-24:00)
- Madrugada (00:00-06:00)

#### Stake preferido
- [ ] Flat (cantidad fija)
- [ ] % Bankroll (porcentaje)

#### Nivel de riesgo
Radio buttons:
- ⚪ **Conservador** (stakes bajos, picks seguros)
- 🔵 **Balanceado** (mix de seguridad y valor)
- 🔴 **Agresivo** (stakes altos, valor máximo)

### Uso de estas preferencias
Esto lo usará:
- El Coach
- Recomendaciones personalizadas
- Watchlist
- Futuros agentes

---

## 📊 Plan de Operación (Bankroll Settings)

### Objetivo
Configuración base del plan operativo del usuario. Conecta con Risk Guard, Coach y Notificaciones de Disciplina.

### Stake Policy
**Método de cálculo de stakes:**
- **[ ] Flat** (cantidad fija, ej: $10 por pick)
- **[ ] % Bankroll** (porcentaje dinámico, ej: 1% del bankroll)
- **[ ] Kelly Criterion** (fórmula Kelly con ajustes)

### Límites de Riesgo

#### Máx stake por apuesta
- **Input numérico**: Máximo permitido por pick
- **Validación**: No puede exceder 5% del bankroll total
- **Ejemplo**: "Máximo $50 por apuesta"

#### Máx pérdidas diarias
- **Input numérico**: Límite diario de pérdidas
- **Opción**: % del bankroll o monto fijo
- **Acción al alcanzar**: Bloquear picks por 24h

#### Máx drawdown
- **Input numérico**: % máximo de drawdown permitido
- **Recomendado**: 20-30% del bankroll
- **Acción al alcanzar**: Pausar actividad, requerir revisión

### Mercados Permitidos
**Control de exposición por tipo de mercado:**

- **[ ] Prematch** (apuestas antes del evento)
- **[ ] Live** (apuestas en tiempo real)
- **[ ] Handicaps** (Asian Handicap, Spread)
- **[ ] Totales** (Over/Under)
- **[ ] Moneyline** (1X2, Winner)
- **[ ] Props** (jugador, estadísticas)

### Horarios Permitidos (Opcional)
**Restricciones temporales para picks:**

- **Hora inicio**: [__:__] (24h)
- **Hora fin**: [__:__] (24h)
- **Días de la semana**: [L] [M] [X] [J] [V] [S] [D]
- **Zona horaria**: [Selector de zona horaria]

### Activar Advertencias del Coach
**Sistema de alertas disciplinarias:**

- **[ ] Alertas de stake excesivo** *(modo recomendado: advertir primero)*
- **[ ] Alertas de mercado no permitido** *(puede desactivarse)*
- **[ ] Alertas de horario no permitido** *(puede desactivarse)*
- **[ ] Alertas de frecuencia excesiva** *(modo recomendado: solo advertir)*
- **[ ] Recomendaciones diarias del Coach**

### Integración con Sistema
**Este módulo alimenta:**
- **Risk Guard**: Control de límites en tiempo real
- **Trading Coach**: Recomendaciones personalizadas
- **Notificaciones**: Alertas de disciplina y riesgo
- **Watchlist**: Validación de picks antes de registro

### Mensajes de Advertencia
**Cuando se alcanzan límites:**

1. **Stake excesivo**: "Este stake supera tu máximo configurado" *(modo advertencia primero)*
2. **Mercado no permitido**: "Live no está activado en tu configuración"
3. **Horario no permitido**: "Fuera de tu horario operativo configurado"
4. **Drawdown alcanzado**: "Has alcanzado tu drawdown máximo. Actividad pausada" *(puede desactivarse)*

---

## 4️⃣ 🔔 Notificaciones

### Objetivo
Centro de control de notificaciones con categorías y canales configurables.

### Tipos de notificaciones

#### A) Trading
- Nuevas señales disponibles
- Cambios importantes en odds
- Oportunidades live
- Picks del tipster seguido
- Alertas del Coach

#### B) Cuenta
- Inicio de sesión nuevo
- Cambio de contraseña
- Expiración de plan
- Verificación requerida

#### C) Finanzas
- Comisión directa generada
- Pool semanal ejecutado
- Pago disponible
- Retiro aprobado

#### D) Sistema
- Mantenimiento programado
- Nuevas funciones
- Anuncios importantes

### Canales de notificación

Para cada evento, el usuario puede elegir:

- **[✔] In-App** (campana 🔔) - Siempre activo
- **[ ] Email** - Opcional por evento *(los toggles no aplican a obligatorias de seguridad/finanzas)*
- **[ ] Telegram** - Futuro (placeholder)
- **[ ] Push** - Futuro (placeholder)

### Interfaz de configuración
Tabla con toggles por cada combinación evento/canal:

| Evento | In-App | Email | Telegram |
|--------|---------|--------|----------|
| Nueva señal | ✅ | [✔] | [ ] |
| Pool ejecutado | ✅ | [✔] | [ ] |
| Login nuevo | ✅ | [✔] | [ ] |

---

## 5️⃣ Privacidad y Datos

### Objetivo
Control total sobre la privacidad del usuario.

### Contenido

#### Exportar mis datos
**Descarga de información personal**

- **Datos del perfil** (JSON)
- **Historial de actividad** (CSV) - *registros y movimientos, sin balances financieros*
- **Preferencias y configuraciones** (JSON)
- **Registros de actividad** (CSV) - *resumen de operaciones, sin datos sensibles*

#### Visibilidad en leaderboard
- Toggle: [ ] Mostrar mi posición en leaderboard
- Cuando está OFF: "Usuario anónimo" en lugar del alias

#### Mostrar mis picks públicamente
- Toggle: [ ] Mostrar mis picks en perfil público
- Afecta a la visibilidad de picks históricos

#### Eliminar cuenta
- Botón rojo "Eliminar cuenta"
- Proceso guiado de 3 pasos:
  1. Confirmar contraseña
  2. Seleccionar motivo de baja
  3. Confirmar eliminación (72h de espera)

---

## 6️⃣ Conexiones (Placeholder)

### Objetivo
Interfaz preparada para futuras integraciones.

### Contenido actual (solo UI)

#### Cloudbet API
- Estado: "No implementado aún"
- Botones placeholder: Conectar / Desconectar
- Campos de muestra:
  - Estado conexión: Desconectado
  - Última sincronización: Nunca

#### Otras integraciones futuras
- Bet365 API (placeholder)
- Pinnacle API (placeholder)
- Interfaz personalizada (placeholder)

---

## 📝 Notas importantes para implementación

### No mezclar con pagos
- Configuración NO incluye datos financieros
- No mostrar wallets, balances, ni historial de pagos
- Mantener separación clara entre preferencias y finanzas

### Email verificado
- No permitir edición directa de email verificado
- Proceso de cambio debe incluir verificación

### Eliminación de cuenta
- NO eliminar inmediatamente
- Implementar proceso con confirmaciones múltiples
- Período de espera de 72 horas
- Notificación por email del proceso

### Responsividad
- Tabs laterales en desktop
- Acordeón móvil en dispositivos pequeños
- Mantener jerarquía visual clara

### Accesibilidad
- Labels claros para lectores de pantalla
- Navegación por teclado
- Estados de foco visibles
- Contraste adecuado para todos los elementos
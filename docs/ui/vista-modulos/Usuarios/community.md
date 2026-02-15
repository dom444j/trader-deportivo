# Community Hub Module

## Concepto Central

**Community Hub no es una red social genérica — es una comunidad contextual al trading deportivo.**

El módulo permite interacción social entre usuarios alrededor de la actividad operativa (picks, análisis, disciplina), sin convertir la plataforma en un foro caótico. El objetivo es **crear una comunidad de aprendizaje y descubrimiento de talento**, no un chat público sin filtros.

**Principio fundamental:** La comunidad existe para fomentar mejor trading, no para socializar sin contexto.

---

## 1. Propósito del Módulo

Community Hub tiene **6 objetivos estratégicos**:

1. **Fomentar aprendizaje** entre usuarios (mentorías informales)
2. **Detectar tipsters** de forma orgánica (sin auto-proclamación)
3. **Crear engagement** genuino (no vanity metrics)
4. **Aumentar retención** (pertenencia > uso)
5. **Permitir seguir traders** consistentes (no copiar ciegamente)
6. **Generar dataset cualitativo** para IA (razonamiento humano real)

### 1.1. Lo Que NO Es

- ❌ NO es un chat público libre
- ❌ NO es un foro de apuestas tradicional
- ❌ NO es un marketplace de picks
- ❌ NO es una red social de "likes" sin contexto
- ❌ NO permite venta directa de picks
- ❌ NO permite promoción de servicios externos

### 1.2. Lo Que SÍ Es

- ✅ Comunidad contextual al trading
- ✅ Espacio de aprendizaje colaborativo
- ✅ Sistema de reputación basado en métricas
- ✅ Descubrimiento orgánico de talento
- ✅ Discusiones alrededor de eventos específicos
- ✅ Red de seguimiento de traders consistentes

---

## 2. Componentes del Módulo

Community Hub se estructura en **5 pilares**:

1. **Leaderboard** (ranking basado en consistencia)
2. **Following** (seguir traders)
3. **Discussions** (discusiones contextuales)
4. **Profiles** (perfiles públicos)
5. **Badges** (logros automáticos)

---

## 3. Leaderboard (Ranking)

### 3.1. Filosofía del Ranking

**El ranking NO premia al que más gana dinero, sino al más consistente y disciplinado.**

Esto evita:
- ✅ Suerte puntual
- ✅ Apuestas grandes aisladas
- ✅ Manipulaciones
- ✅ Sesgo de supervivencia
- ✅ Cherry-picking de resultados

**Objetivo:** Identificar traders con proceso sólido, no con rachas de suerte.

### 3.2. Community Score (Métrica Compuesta)

El ranking usa un **Community Score** compuesto por 5 dimensiones:

```javascript
community_score = 
  consistency_score * 0.30 +
  clv_score * 0.20 +
  discipline_score * 0.20 +
  sample_size_score * 0.15 +
  risk_management_score * 0.15
```

#### 3.2.1. Consistency Score (30%)

**Mide:** Estabilidad de resultados a lo largo del tiempo.

**Cálculo:**
- Win rate promedio
- Desviación estándar de win rate en ventanas móviles de 10 picks
- Penaliza rachas extremas y volatilidad
- Premia win rate sostenido entre 55-65%

#### 3.2.2. CLV Score (20%)

**Mide:** Closing Line Value (cuando existe).

- CLV promedio de todos los picks
- Solo aplica si >50% de picks tienen CLV disponible
- CLV positivo indica ventaja informativa

#### 3.2.3. Discipline Score (20%)

**Mide:** Adherencia al stake plan y ausencia de tilt.

Componentes:
- Variación de stake (consistencia)
- Execution ratio (picks ejecutados vs registrados)
- Detección de tilt (picks impulsivos post-pérdidas)

#### 3.2.4. Sample Size Score (15%)

**Mide:** Cantidad y distribución temporal de picks.

- Total de picks resueltos
- Distribución temporal (evita ráfagas)
- Penaliza <30 picks o concentración en pocos días

#### 3.2.5. Risk Management Score (15%)

**Mide:** Gestión de exposure y drawdown.

- Max drawdown histórico
- Exposure promedio
- Overtrading (>8 picks/día)

---

### 3.3. Requisitos para Aparecer en Leaderboard

**Filtros de elegibilidad:**

```javascript
min_resolved_picks = 30
account_age >= 14 días
no active lock (risk guard)
no banned
min_public_picks = 10
```

**Motivo:** Evitar "Top 1 con 3 picks ganadores".

---

### 3.4. Tipos de Leaderboard

#### Por Alcance

| Tipo | Descripción |
|------|-------------|
| **Global** | Todos los usuarios |
| **Por Liga** | Especialistas en una liga |
| **Por Mercado** | Expertos en O/U, ML, Handicap |
| **Por Deporte** | Por deporte específico |

#### Por Período

- **7 días** — últimos 7 días
- **30 días** — últimos 30 días
- **All-time** — histórico completo

---

### 3.5. Lo Que NO Se Muestra

**Información privada oculta:**

- ❌ Balance real
- ❌ Dinero ganado absoluto
- ❌ Stakes absolutos
- ❌ Bankroll
- ❌ Detalles de cuenta
- ❌ Enlaces externos de tickets (ticket_link) — **NO visibles en teasers/feeds; solo accesibles para usuarios autorizados; no indexables; no públicos**

**Reglas de privacidad para ticket_link:**
- Los enlaces de tickets nunca se muestran en teasers o feeds públicos
- Solo usuarios autorizados (seguidores, usuarios con permisos específicos) pueden acceder
- Los enlaces no son indexables por motores de búsqueda
- No se exponen en APIs públicas
- Se requiere autenticación para acceder al ticket completo

**Solo métricas relativas:**

- ✅ Win Rate (%)
- ✅ ROI (%)
- ✅ Community Score
- ✅ Picks resueltos
- ✅ Días activo
- ✅ Especialización

---

## 4. Following (Seguir Usuarios)

### 4.1. Funcionalidad

Permite seguir a traders para:
- ✅ Ver picks públicos
- ✅ Recibir notificaciones de análisis
- ✅ Ver estadísticas resumidas
- ✅ Acceder a discusiones

**NO implica:**
- ❌ Copy trading automático
- ❌ Ejecución automática
- ❌ Ver picks privados
- ❌ Ver balance o stakes

### 4.2. Modelo de Datos

```typescript
interface Follow {
  id: string
  follower_user_id: string
  followed_user_id: string
  
  muted: boolean
  notification_settings: {
    new_pick: boolean
    new_analysis: boolean
    milestone: boolean
  }
  
  created_at: timestamp
  updated_at: timestamp
}
```

### 4.3. Reglas de Negocio

**Restricciones:**

```javascript
// No seguirse a sí mismo
// Límite según plan:
FREE: 20 seguidos
PRO: 50 seguidos
ENTERPRISE: ilimitado

// Usuario debe tener ≥5 picks públicos
```

### 4.4. Notificaciones de Following

**Eventos:**
- Nuevo pick público (si habilitado)
- Nuevo análisis (si habilitado)
- Milestone (top 10)

**Límite:** Max 5 notificaciones/día por usuario seguido.

---

## 5. Profiles (Perfiles Públicos)

### 5.1. Información Visible

```typescript
interface PublicProfile {
  // Identidad
  user_id: string
  alias: string
  avatar_url?: string
  joined_at: timestamp
  
  // Estadísticas
  stats: {
    total_picks: number
    win_rate: number
    roi_30d: number
    community_score: number
    leaderboard_rank?: number
  }
  
  // Especialización
  specialization: {
    top_leagues: []
    top_markets: []
    best_sport: string
  }
  
  // Social
  followers_count: number
  following_count: number
  
  // Badges
  badges: Badge[]
  
  // Picks recientes (si público)
  recent_picks?: Pick[]
}
```

### 5.2. Información Oculta

**NO se muestra:**
- ❌ Email, wallet, payment info
- ❌ Bankroll, balance real
- ❌ Stakes absolutos
- ❌ Picks privados
- ❌ IP/Location
- ❌ Enlaces de tickets (ticket_link) — **nunca visibles en perfiles públicos**

### 5.3. Privacy Settings

```typescript
interface PrivacySettings {
  profile_visibility: 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE'
  show_picks: 'ALL' | 'FOLLOWERS_ONLY' | 'NONE'
  show_stats: boolean
  show_badges: boolean
  allow_follow: boolean
}
```

---

## 6. Discussions (Discusiones Contextuales)

### 6.1. Filosofía

**NO es un foro libre tipo Reddit.**

Discusiones **contextuales** alrededor de:
- Un partido específico
- Una liga
- Un pick publicado
- Contenido educativo

**No hay "off-topic" general.**

### 6.2. Tipos de Post

```typescript
enum PostType {
  MATCH_DISCUSSION = 'match_discussion'
  PICK_ANALYSIS = 'pick_analysis'
  EDUCATIONAL = 'educational'
  LEAGUE_DISCUSSION = 'league_discussion'
}
```

### 6.3. Modelo de Datos

```typescript
interface Post {
  id: string
  user_id: string
  type: PostType
  
  reference_type?: 'MATCH' | 'PICK' | 'LEAGUE'
  reference_id?: string
  
  title?: string
  content: string
  tags?: string[]
  
  likes_count: number
  comments_count: number
  
  is_hidden: boolean
  flagged: boolean
  
  created_at: timestamp
  edited_at?: timestamp
}

interface Comment {
  id: string
  post_id: string
  user_id: string
  parent_comment_id?: string
  
  content: string
  likes_count: number
  
  is_hidden: boolean
  
  created_at: timestamp
}

interface Reaction {
  user_id: string
  target_type: 'POST' | 'COMMENT'
  target_id: string
  type: 'LIKE' | 'HELPFUL'
  
  created_at: timestamp
}
```

### 6.4. Reglas Importantes

**Prohibido:**

```javascript
const FORBIDDEN = [
  'spam',
  'external_links_promo',
  'selling_picks',
  'external_tipsters',
  'scams',
  'harassment'
]
```

**Privacidad de enlaces de tickets:**
- Los posts de análisis de picks **NO deben incluir ticket_link**
- Los enlaces de tickets nunca se muestran en teasers o previews
- Solo usuarios con permisos específicos pueden ver enlaces completos
- Los enlaces no son indexables ni públicos
- Se aplica rate limiting para acceso a tickets

**Validación automática:**
- Detectar spam
- Bloquear enlaces externos
- Detectar venta de picks
- Rate limiting
- Filtrar ticket_link de posts públicos

### 6.5. Publicar Pick como Análisis

**Integración con Watchlist:**

```javascript
async function publishPickAnalysis(user_id, pick_id, analysis) {
  // Validar ownership
  // Validar pick es público
  // Crear post
  // Notificar followers
}
```

---

## 7. Badges (Logros Automáticos)

### 7.1. Filosofía

**Badges NO son cosméticos** — sirven para:
- Identificar tipsters potenciales
- Reconocer especialización
- Gamificación saludable

**Otorgados automáticamente** por el sistema.

### 7.2. Badge Catalog

**1. Consistent Trader**
- Win rate estable >55% en 50+ picks
- Tier: GOLD

**2. Discipline Keeper**
- Disciplina perfecta: 0 señales de tilt
- Tier: GOLD

**3. Over/Under Specialist**
- ROI >15% en O/U (min 40 picks)
- Tier: SILVER

**4. Early Value Finder**
- CLV promedio >+3% en 30+ picks
- Tier: PLATINUM

**5. Community Helper**
- 50+ comentarios útiles
- Tier: BRONZE

**6. Top 10 Trader**
- Alcanzar top 10 del leaderboard
- Tier: PLATINUM

**7. Streak Master**
- Racha de 10+ picks ganadores
- Tier: SILVER

**8. League Expert**
- ROI >12% en liga específica (min 30 picks)
- Tier: GOLD

### 7.3. Award System

```javascript
async function checkAndAwardBadges(user_id) {
  // Obtener stats del usuario
  // Evaluar cada badge
  // Otorgar si cumple criterios
  // Notificar usuario
}
```

---

## 8. Moderación (Sistema Automático)

### 8.1. Reglas Automáticas

**Sin admin UI en MVP** — moderación automática:

```javascript
const MODERATION_RULES = {
  TOO_MANY_LINKS: {
    threshold: 3,
    action: 'HIDE_POST'
  },
  
  MULTIPLE_REPORTS: {
    threshold: 5,
    action: 'HIDE_POST'
  },
  
  SPAM_PATTERN: {
    threshold: 3,
    action: 'SHADOW_MUTE',
    duration_hours: 24
  },
  
  NEW_ACCOUNT_SPAM: {
    account_age_days: 7,
    posts_per_hour: 5,
    action: 'RATE_LIMIT'
  },
  
  TICKET_LINK_EXPOSURE: {
    // Previene exposición de ticket_link en posts públicos
    pattern: /ticket_link|ticket_url|bet_slip/i,
    action: 'FILTER_CONTENT',
    replace_with: '[ENLACE PRIVADO]'
  }
}
```

### 8.2. Shadow Mute

Usuario puede postear, pero nadie más ve su contenido.

**NO se notifica al usuario** (de ahí "shadow").

### 8.3. Report System

```typescript
interface Report {
  id: string
  reporter_user_id: string
  
  target_type: 'POST' | 'COMMENT' | 'USER'
  target_id: string
  
  reason: 'SPAM' | 'HARASSMENT' | 'SCAM' | 'OTHER'
  description?: string
  
  status: 'PENDING' | 'REVIEWED' | 'ACTIONED'
  
  created_at: timestamp
}
```

**Límites anti-abuso:**
- Max 5 reportes/día por usuario
- No reportar mismo contenido múltiples veces

---

## 9. Privacy & Consent

### 9.1. Principio de Privacidad

**Por defecto: TODO es privado.**

Usuario debe **explícitamente** hacer picks públicos.

### 9.2. Consentimiento Explícito

**Modal de confirmación al hacer pick público:**

```
Al hacer este pick público:
• Aparecerá en tu perfil
• Podrá ser visto por seguidores
• Se usará para Community Score
• NO se compartirá stake ni balance

¿Confirmas?
```

### 9.3. Bulk Privacy Control

Usuario puede cambiar visibilidad en masa:

```javascript
// Hacer públicos todos los O/U
updatePicksVisibility(user_id, {
  market: 'OVER_UNDER',
  new_visibility: 'PUBLIC'
})
```

---

## 10. Notificaciones

### 10.1. Eventos de Notificación

| Evento | Frecuencia |
|--------|------------|
| Nuevo seguidor | Inmediata |
| Comentario en análisis | Inmediata |
| Respuesta a comentario | Inmediata |
| Seguido publica análisis | Según settings |
| Alcanzas leaderboard | Una vez |
| Badge ganado | Inmediata |
| Post trending | Una vez |

### 10.2. Notification Settings

```typescript
interface NotificationSettings {
  new_follower: boolean
  comment_on_post: boolean
  reply_to_comment: boolean
  
  followed_new_pick: boolean
  followed_new_analysis: boolean
  
  badge_earned: boolean
  leaderboard_milestone: boolean
  
  weekly_digest: boolean
}
```

### 10.3. Rate Limiting

**Evitar spam:**
- Max 10 notifs/hora
- Max 50 notifs/día
- Max 5 notifs/día por usuario seguido
- Digest mode si >20 pendientes

---

## 11. Integración con Otros Módulos

### 11.1. Watchlist

**Permite publicar pick como análisis.**

Flujo:
1. Usuario crea pick en Watchlist
2. Marca como público
3. Añade razonamiento
4. Publica en Community
5. Followers reciben notificación

### 11.2. Risk Guard

**Si usuario está LOCKED:**
- ❌ No puede publicar picks recomendados
- ❌ No puede publicar análisis futuros
- ✅ Puede comentar
- ✅ Puede ver contenido

### 11.3. Store

**Límites por plan:**

| Plan | Max Following | Ver Picks Followers | Stats Avanzadas |
|------|---------------|---------------------|-----------------|
| Free | 20 | ❌ | ❌ |
| Starter | 30 | ✅ | ❌ |
| Pro | 50 | ✅ | ✅ |
| Enterprise | ∞ | ✅ | ✅ |

### 11.4. Agents Hub

**Copy Trading (futuro):**

Usuario puede activar "Copy Mode" para replicar picks públicos de usuarios seguidos.

**Copy ≠ Following** — son funcionalidades separadas.

---

## 12. API Endpoints

### Leaderboard
```
GET /community/leaderboard
Query: { period, type, league_id, market, limit }
```

### Following
```
POST /community/follow/:user_id
DELETE /community/unfollow/:user_id
GET /community/following
GET /community/followers
```

### Profiles
```
GET /community/profile/:user_id
PATCH /community/profile/privacy
```

### Posts
```
GET /community/posts
POST /community/posts
POST /community/posts/:id/comment
```

**Nota sobre privacidad:** Los endpoints de posts **NUNCA incluyen ticket_link** en la respuesta. Los enlaces de tickets requieren autenticación adicional y no son accesibles públicamente.

### Reactions
```
POST /community/react
```

### Reports
```
POST /community/report
```

### Badges
```
GET /community/badges/:user_id
```

---

## 13. Mejoras Adicionales

### 13.1. Trending Algorithm

Detectar posts "trending" basado en:
- Engagement reciente
- Recency weight
- Quality score

### 13.2. Verified Tipster Badge

Otorgado manualmente a usuarios con:
- Track record probado >3 meses
- Community score >0.80
- Sin infracciones

### 13.3. Weekly Digest Email

Resumen semanal con:
- Tus stats
- Tu rank
- Top picks de followers
- Trending posts
- Nuevos badges

### 13.4. Specialization Tags

Auto-detectar y mostrar:
```
🎯 Especialista en Premier League (68% de picks)
```

### 13.5. Mentorship Program

Conectar usuarios nuevos con veterans:
- Mentor: >100 picks, score >0.70
- Mentee: <30 picks
- Match por deporte/mercado

### 13.6. Community Challenges

Desafíos temporales:
```
"Over/Under Master"
Meta: 20 picks O/U con WR >60%
Período: 30 días
Recompensa: Badge + créditos
```

---

## 14. Métricas de Producto

**KPIs:**

| Métrica | Target |
|---------|--------|
| DAU con actividad social | >30% |
| Posts per user | >2/mes |
| Follow ratio | >40% |
| Engagement rate | >15% |
| Retention lift | +25% |
| Leaderboard participation | >20% |
| Badge unlock rate | >50% |

---

## 15. Roadmap

### Fase 1 (MVP) ✅
- Leaderboard + Community Score
- Following system
- Public profiles
- Basic posts
- Reactions
- Auto badges (top 5)
- Auto moderation
- Privacy controls

### Fase 2
- Comment threads
- Trending algorithm
- Weekly digest
- More badges
- Verified tipster badge
- Specialization detection

### Fase 3
- Mentorship program
- Community challenges
- Copy trading integration
- Advanced stats
- Private messaging

---

## 16. Objetivo Real del Módulo

**Community Hub transforma la plataforma de herramienta → ecosistema.**

### Sin Comunidad:
- Usuarios usan la herramienta
- Churn alto (~30 días)
- No hay diferenciación
- Operación en silo

### Con Comunidad:
- Usuarios **pertenecen** a la plataforma
- Retención 2-3x mayor
- Descubrimiento orgánico de talento
- Network effects
- Más difícil de replicar

**Community Hub NO es un extra — es estratégico.**

---

## 17. Referencias

- **Watchlist**: watchlist.md
- **Risk Guard**: risk-guard.md
- **Store**: store.md
- **Agents Hub**: agents-hub.md

---

**Versión:** 1.0  
**Última actualización:** 2026-02-08  
**Autor:** Sistema Trader Deportivo  
**Estado:** Documentación Oficial

---

## Estado de Implementación (Revisión 2026-02-08)

### ✅ Elementos Implementados

1. **Estructura base completa**
   - HTML con estilos CSS coherentes con el diseño del sistema
   - Sistema de tabs funcionales (Leaderboard, Following, Discussions)
   - Sidebar con navegación integrada

2. **Leaderboard funcional**
   - Tabla con ranking de traders
   - Filtros por período y liga (UI implementada)
   - Visualización de Community Score
   - Sistema de badges en las filas
   - Botones de follow/unfollow

3. **Sistema de Following**
   - Tarjetas de perfil con estadísticas
   - Indicador de límite de seguidos (3/20 en Plan Free)
   - Botones para ver perfiles
   - Feed de actividad (estructura preparada)

4. **Discussions con posts contextuales**
   - Filtros por deporte, liga, partido, mercado, PRE/LIVE
   - Tipos de posts: Match Discussion, Pick Analysis, Educational
   - Sistema de reacciones (like, útil)
   - Contexto de partido/mecado en cada post

5. **Sistema de publicación**
   - Modal para publicar análisis
   - Campos: tipo, título, contenido, liga, mercado
   - Integración con botones en topbar y discussions

6. **Pantallas internas (MVP)**
   - Vista de detalle de post con comentarios
   - Vista de perfil público con estadísticas
   - Navegación entre vistas

7. **JavaScript funcional**
   - Cambio de tabs
   - Toggle de follow/unfollow
   - Sistema de likes con contador
   - Apertura/cierre de modales
   - Navegación entre vistas internas

### ❌ Elementos Críticamente Faltantes

1. **Integración con backend**
   - Todos los datos son mock/static
   - Sin API endpoints reales
   - Sin persistencia de datos

2. **Sistema de autenticación y permisos**
   - Sin validación de plan de usuario
   - Sin límites reales de following
   - Sin control de visibilidad de perfiles

3. **Community Score real**
   - Sin cálculo de métricas (Consistency, CLV, Discipline, etc.)
   - Sin integración con picks históricos
   - Sin actualización automática

4. **Integración con otros módulos**
   - Sin conexión con Watchlist para publicar picks
   - Sin integración con Risk Guard para usuarios locked
   - Sin conexión con Store para límites por plan

5. **Sistema de notificaciones**
   - Sin notificaciones de nuevos seguidores
   - Sin notificaciones de comentarios
   - Sin weekly digest

6. **Moderación automática**
   - Sin detección de spam
   - Sin bloqueo de enlaces externos
   - Sin sistema de reportes

7. **Badges automáticos**
   - Sin sistema de otorgamiento automático
   - Sin cálculo de especialización
   - Sin detección de milestones

8. **Auditoría y disciplina**
   - Sin tracking de infracciones
   - Sin sistema de suspensión
   - Sin moderación manual

### 📋 Recomendaciones de Próximos Pasos

1. **Backend Development (Prioridad Alta)**
   - Implementar API endpoints según documentación
   - Desarrollar sistema de Community Score
   - Crear sistema de badges automáticos
   - Implementar moderación y reportes

2. **Frontend Integration (Prioridad Alta)**
   - Conectar con sistema de autenticación real
   - Implementar llamadas a API
   - Añadir loading states y error handling
   - Implementar paginación real

3. **Integración con módulos existentes (Prioridad Media)**
   - Conectar con Watchlist para publicar análisis
   - Integrar con Risk Guard
   - Sincronizar con Store para límites por plan
   - Conectar con sistema de notificaciones

4. **Features avanzadas (Prioridad Baja)**
   - Sistema de trending algorithm
   - Weekly digest email
   - Mentorship program
   - Community challenges

### 📊 Calidad de Implementación

- **Diseño visual:** ⭐⭐⭐⭐⭐ Excelente coherencia con el sistema
- **UX/UI:** ⭐⭐⭐⭐ Muy buena experiencia de usuario
- **Funcionalidad básica:** ⭐⭐⭐ MVP completo pero sin datos reales
- **Integración:** ⭐ Sin conexión con backend
- **Rendimiento:** ⭐⭐⭐⭐ Rápido (datos estáticos)

**Conclusión:** La implementación de Community Hub tiene una base sólida y bien diseñada, pero requiere desarrollo backend significativo para ser funcional. El frontend está muy bien estructurado y listo para integración.

---

## Lo que falta añadir (muy importante)

1) Perfil Público (NO es un cuarto menú, pero sí una página obligatoria)

Ahora mismo existe "Siguiendo", pero no hay destino al hacer click en un usuario.

El sistema define perfiles públicos con:
- alias
- estadísticas
- especialización
- badges
- picks recientes
- community

👉 Sin perfil público:
- Following no sirve
- Leaderboard no sirve
- Badges no sirven

No agregues un menú nuevo. Debe abrirse al hacer click en cualquier usuario.

2) Vista “Detalle de Pick” (clave para el aprendizaje)

El documento permite publicar picks como análisis desde Watchlist / Community.

Pero falta la página intermedia:

Pick Público / Análisis

Ahí ocurre la comunidad:
- comentario
- debate
- reacciones

Sin eso, “Discusiones” se vuelve un mini-foro vacío.

3) Filtro contextual en Discusiones

Si solo pones “Discusiones”, el usuario ve un feed genérico → lo ignorará.

Debe poder filtrar por:
- Liga
- Partido
- Mercado (O/U, ML, Handicap)

La comunidad está diseñada para ser contextual al evento, no general.

4) Badges visibles (importantísimo)

Hay Leaderboard, pero sin badges no hay reputación visible.

El sistema define badges como:
- Consistent Trader
- Discipline Keeper
- League Expert
- Early Value Finder

Los badges deben verse:
- en leaderboard
- en perfil
- en comentarios

Esto es lo que motiva la participación.

5) Botón “Publicar análisis”

Watchlist puede publicar picks públicos, pero el usuario no debe depender solo de Watchlist.

Debe existir en Discusiones: 👉 Publicar análisis (no publicar picks, publicar razonamiento).

Esto genera dataset cualitativo para la IA.

Lo que NO debes agregar

No pongas:
- chat global
- mensajes privados aún
- grupos
- “feed social tipo Instagram”

Rompería la filosofía del módulo.

---

## Listo para HTML — definiciones finales

### 1. Pantallas internas obligatorias (sin agregar menú)

#### Screen/Profile — Public Profile Page
- Trigger: click en usuario (card) desde Leaderboard o Siguiendo.
- Ruta (referencia): /community/profile/:alias
- Contenido mínimo:
  - Alias + avatar
  - Stats (WR, ROI 30d, Community Score, rank)
  - Especialización (top leagues, markets)
  - Badges visibles
  - Picks recientes (si públicos)
  - Follow/Unfollow + settings
- UI: modal o página dedicada (en MVP se permite modal).

#### Screen/Post — Pick/Analysis Detail Page
- Trigger: click en post tipo pick_analysis o pick público.
- Ruta (referencia): /community/posts/:id
- Contenido mínimo:
  - Meta contextual (liga/partido/mercado, PRE/LIVE)
  - Título (opcional) + razonamiento
  - Comentarios (threads simples en MVP)
  - Reacciones (LIKE/HELPFUL)
  - Badges del autor visibles junto al alias

### 2. Filtros de Discusiones (UI)
- Deporte
- Liga
- Partido
- Mercado (O/U, ML, Handicap)
- PRE/LIVE
- Orden: Trending / Recientes

### 3. Badges visibles en UI
- Leaderboard: chip/badge junto al alias (múltiples posibles)
- Perfil: header del perfil (sección dedicada)
- Posts/Comentarios: junto al nombre del autor

### 4. CTA “Publicar análisis”
- Ubicación: sección Discussions, acción primaria
- Comportamiento: abre modal “Publicar análisis”
- Tipo de contenido: razonamiento (no stake ni balance)
- Post type: PICK_ANALYSIS

### 5. Detalles técnicos mínimos (backend/HTML)
- Planes (nombres): unificar con Store — usar: Básica, Pro, Premium
- Paginación:
  - GET /community/posts?cursor=<id>&limit=<n>
  - Respuesta: { items, next_cursor }
  - GET /community/leaderboard?cursor=<id>&limit=<n>
- Privacidad / picks:
  - PATCH /watchlist/picks/:id/visibility { visibility: 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE' }
- Moderación links:
  - Política: permitir enlaces whitelisted (ej: sitios oficiales de ligas y bookmakers) y bloquear el resto automáticamente.
- Fecha/versión:
  - Mantener sincronizada con cambios de UI/HTML.

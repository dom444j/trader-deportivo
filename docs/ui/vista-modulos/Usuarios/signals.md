# Signals Module (PRE & LIVE)

## 1. Propósito del módulo
Unificar la visualización y consumo de señales de apuestas en un único dominio que incluye PRE (pre-partido) y LIVE (en vivo), alineado con Agents Hub, Risk Guard, planes y el sidebar. El módulo expone eventos (señales) que los usuarios pueden filtrar, evaluar y, según plan y reglas, ejecutar vía agentes.

## 2. Qué es una señal
Una señal es un evento informativo con contexto de mercado que sugiere una posible oportunidad de apuesta. No es una apuesta en sí misma. Contiene metadatos (deporte, liga, partido, mercado, odds, timestamp, confianza, fuente) y puede derivar en: notificación, sugerencia o ejecución (a través de un agente).

## 3. Tipos de señales
- PRE: emitidas antes del inicio del evento. Mayor ventana de decisión; odds más estables.
- LIVE: emitidas durante el evento. Tiempo crítico; odds volátiles; requieren guardas de riesgo más estrictas.

## 4. Estados de una señal
- new: recién publicada, visible y elegible según plan y reglas.
- active: vigente y en ventana de decisión.
- expired: fuera de ventana o odds inválidas; no elegible.
- suggested: marcada por el usuario o agente como sugerida (pendiente de decisión).
- executed: derivó en una o más apuestas vía agente.
- blocked: Risk Guard bloqueó su ejecución (visibilidad se mantiene).
- not_eligible: marcada por Risk Guard como no elegible (p. ej., fuera de perfil de riesgo, límites superados).
- revoked: fuente retiró la señal (p. ej., corrección o error detectado).

## 5. Fuente de señales
- Tipster humano: creador verificado, con historial y disciplina.
- IA: modelos internos que publican señales basadas en datos.
- Master / Curated: señales curadas por el sistema o por un equipo editorial con estándares más altos.

## 6. Reglas por plan
- Básico:
  - PRE: lectura y notificaciones permitidas.
  - LIVE: no disponible.
  - Ejecución automática: no.
- Pro:
  - PRE: lectura y notificaciones; sugerencias manuales.
  - LIVE: opcionalmente solo lectura (si se habilita), sin ejecución.
  - Ejecución automática: no.
- Premium:
  - PRE: lectura, sugerencias y ejecución automática vía agente (según cupos/guardas).
  - LIVE: lectura y ejecución automática con cupo mensual y bajo Risk Guard.
  - Sujeto a límites (toploss, diarios, cooldown) y a auditoría.

## 7. Relación con Agents Hub
Agents Hub consume señales; no las crea. Cada agente decide su política: observe, suggest, execute. El estado del agente y Risk Guard condicionan la ejecución (pero no la visibilidad de la señal). Configuraciones de plan/créditos impactan la elegibilidad.

## 8. Relación con Bets
Una señal puede derivar en cero o más apuestas. Una apuesta puede provenir de una señal ejecutada por un agente. Las señales son la entrada (eventos); las Bets son salidas (decisiones ejecutadas). Debe existir trazabilidad: signal_id → bet_id(s).

## 9. Relación con Risk Guard
Risk Guard nunca oculta las señales, pero sí puede:
- bloquear ejecución (estado blocked)
- marcar como not_eligible
- pausar agentes o limitar por cupos/límites (toploss, diarios, cooldown, drawdown)
Estas decisiones se auditan y se muestran en el historial.

## 10. Filtros y ranking
- Filtros: tipo (PRE/LIVE), deporte, liga, mercado, odds, rango de tiempo, fuente (Tipster/IA/Master), confianza, elegibilidad (por plan), estado (new/active/expired/etc.).
- Ranking: por ROI histórico de la fuente, CLV estimado, consistencia, reciente desempeño, señal “curated”.
- Segmentos: “Todas”, “PRE”, “LIVE”, “Favoritas”, “Curadas”.

## 11. UI esperada (cards + list)
- Vista principal: listado de señales con tarjetas compactas y filas de detalle.
- Campos mínimos en card: deporte/partido, mercado, odds, timestamp, fuente, confianza, estado.
- Acciones por card: marcar favorita, ver detalle, sugerir (Pro/Premium), ejecutar vía agente (solo Premium y elegibles), compartir (según políticas).
- Diferenciación visual PRE vs LIVE (badges/semáforo) y estados.
- Panel lateral de filtros; encabezado con ranking y métricas.

## 12. Alertas
- Notificaciones push/email/in-app según preferencias y plan.
- Controles anti-blast: agregación en LIVE para evitar spam; ventanas silenciosas.
- Alertas de elegibilidad y de bloqueo por Risk Guard (señal visible, ejecución bloqueada).

## 13. Auditoría y disciplina
- Registro completo: publicación, cambios, revocaciones, consumos, ejecuciones, bloqueos.
- Disciplina de tipsters: límites de publicación, calidad mínima, sanciones por señales revocadas o de baja calidad.
- Transparencia: trazabilidad entre señal → agente → bet, con motivos de bloqueo y estados.
- Métricas públicas/privadas según plan y políticas (ej. ROI/consistencia del tipster).

## 14. Modelo mínimo de una señal (data contract)
Campos requeridos (fuente de verdad para evitar improvisación):
- signal_id
- type: PRE | LIVE
- sport
- league
- event
- market
- odds_min
- odds_current
- confidence (0–100)
- source_type: tipster | ia | master
- source_id
- published_at (UTC)
- expires_at (UTC)
- state
- risk_tags (opcional)

## 15. Ventana de validez
- PRE: válida hasta start_time o hasta expires_at.
- LIVE: válida por segundos/minutos; si las odds cambian fuera del rango permitido → expired.
- Una señal expirada nunca puede ejecutarse, aunque el agente esté ON.

## 16. Consumo de cupos
- El cupo se consume SOLO al ejecutar una apuesta.
- Ver una señal, marcarla o sugerirla NO consume cupo.
- Una señal ejecutada varias veces consume cupo por ejecución.
- Señales bloqueadas o not_eligible NO consumen cupo.

## 17. Visibilidad por plan
- Básico: ve PRE, estados, fuentes, confianza; CTAs deshabilitados.
- Pro: ve PRE completas; LIVE opcional read-only; botón “Sugerir”.
- Premium: ve PRE + LIVE; botón “Ejecutar” si elegible.

## 18. Reglas especiales LIVE
- LIVE siempre pasa por Risk Guard estricto.
- Cooldown obligatorio entre ejecuciones.
- Si latencia > umbral → ejecución bloqueada.
- LIVE nunca puede ejecutarse manualmente sin agente.

## 19. Integración UI con Agents Hub
- Desde una señal se puede:
  - Ver agentes compatibles
  - Ejecutar con agente activo
- Desde Agents Hub:
  - Ver señales recientes consumidas
- Mostrar claramente: “Ejecutado por Agente X”.

## 20. Aclaraciones de contrato y ejecución (complemento)
- Regla odds_min/odds_current: una señal es ejecutable solo si odds_current >= odds_min; alternativamente si está dentro de un rango permitido por Risk Guard. Ver secciones 15 y 18.
- reason_code obligatorio cuando state ∈ {blocked, not_eligible, revoked}. Ejemplos: risk_drawdown, daily_limit, cooldown, odds_out_of_range, source_revoked.
- Unificación event vs match_id/event_id: mantener "event" (texto) y agregar "event_id" interno para trazabilidad y dedupe.

## 21. Privacidad del Ticket (ticket_link)
- Enlaces externos de tickets (ticket_link) — no visibles en teasers/cards/listados; solo accesibles para usuarios autorizados; no indexables; no públicos.
- Nunca se muestran en teasers ni en listados de señales generales. En el detalle de la señal, se exponen únicamente si el usuario tiene acceso explícito.
- Aplicar las mismas reglas en cualquier superficie de UI que consuma señales: Community, Watchlist, Traders/Agents. La ausencia de ticket_link no impide trazabilidad; se usa signal_id y auditoría.

---

## Estado actual de implementación vs documentación

### ✅ Elementos implementados
- **Base estructura**: HTML completo con sidebar, topbar y sistema de navegación
- **Sistema de tabs**: PRE/LIVE con cambio dinámico y actualización de URL
- **Filtros completos**: Deporte, mercado, fuente, estado, confianza, cuotas y ordenamiento
- **Cards de señales**: Diseño compacto con badges, metadatos y acciones
- **Sistema de combinadas**: Agregar/quitar señales, visualización y resumen
- **Ranking de fuentes**: Por ROI y consistencia semanal
- **Modales funcionales**: 
  - Detalle de señal con información completa
  - Ejecutar vía agente con configuración de stake, toploss, cooldown
  - Combinada con preview y cálculo de cuotas
- **Gestión de estado**: Favoritos, combinadas, permisos por plan
- **UX responsive**: Grid adaptable y controles móviles

### ❌ Elementos críticamente faltantes
- **Backend integration**: Sin conexión a APIs reales (/signals, /portfolio, /agents)
- **Datos dinámicos**: Todo es mock data estática en JavaScript
- **Sistema de cupos**: Visualización estática sin lógica de consumo real
- **Gestión de estados**: Sin transiciones reales (new → active → executed)
- **Risk Guard integration**: Sin validaciones dinámicas de riesgo
- **Sistema de notificaciones**: Sin alertas push/email/in-app
- **Auditoría y trazabilidad**: Sin registro de cambios de estado
- **Disciplina de tipsters**: Sin límites ni sanciones por calidad
- **Expiración automática**: Sin lógica de expiración por tiempo o odds
- **Consumo de cupos**: Sin verificación ni consumo real al ejecutar
- **Latency checks**: Sin validación de latencia para LIVE
- **Integración con Agents Hub**: Sin comunicación bidireccional real
- **Gestión de favoritos**: Sin persistencia de favoritos del usuario

### 📋 Próximos pasos recomendados

1. **Backend Development**:
   - Implementar APIs REST para /signals con filtros y paginación
   - Crear servicio de gestión de cupos y consumo
   - Desarrollar sistema de auditoría y trazabilidad
   - Implementar lógica de expiración y transiciones de estado

2. **Frontend Integration**:
   - Reemplazar mock data por llamadas a API reales
   - Implementar WebSocket para actualizaciones en tiempo real
   - Añadir loading states y error handling
   - Integrar con sistema de notificaciones existente

3. **Risk & Compliance**:
   - Integrar con Risk Guard para validaciones dinámicas
   - Implementar sistema de disciplina para tipsters
   - Añadir latency checks para señales LIVE
   - Desarrollar sistema de auditoría completo

4. **Advanced Features**:
   - Sistema de notificaciones inteligentes con anti-blast
   - Analytics en tiempo real de performance
   - Integración completa con Agents Hub
   - Exportación de datos para análisis externo
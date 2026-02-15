# Tipster Settings — Configuración del Tipster

Objetivo: centralizar preferencias operativas del tipster que impactan Soporte, Perfil, Señales y Notificaciones, sin rediseño de UI. Ruta sugerida: `/tipster/settings`.

---

## 1) Alcance y propósito

Define ajustes personales del tipster que afectan:
- Disponibilidad y ventanas de atención (horario operativo)
- Idioma y zona horaria
- Notificaciones (canales, severidad, frecuencia, “No molestar”)
- Visibilidad de estado VIP, score de soporte y banners de sanción
- Flags de canales (habilitar `vip_chat` cuando plataforma lo permite)
- Aceptación persistente de disclaimers (ej. VIP)
- Políticas de SLA por tipster (si la plataforma lo soporta)
- Límites de adjuntos y comportamiento bajo sanción

No reemplaza políticas globales (Admin); complementa la configuración del tipster.

---

## 2) Relación con módulos

- Tipster Support Hub: aplica reglas de envío, adjuntos, visibilidad de chips SLA y bloqueo por sanción.
- Tipster Profile: muestra u oculta score de soporte y banners de sanción.
- Tipster Signals: horario operativo puede informar ventanas preferidas para interacción.
- Tipster Wallet / Subscribers: notificaciones relevantes (pagos, disputas).
- Admin: puede ver/forzar políticas globales; settings del tipster no las sobreescriben.

---

## 3) Preferencias generales

- Idioma (`es`, `en`)
- Zona horaria (IANA, p.ej. `UTC`, `Europe/Madrid`)
- Formato de fecha/hora (p.ej. `DD/MM/YYYY`, `HH:mm`)
- Horario operativo (ventanas: L–V 13:00–22:00 UTC; fines de semana opcional)

---

## 4) Notificaciones

- Canales: `ops`, `vip_chat`, `audit`, `sla_critical`
- Severidad: `critical`, `warning`, `info`
- Entrega: `banner` (en páginas), `badge` (contador)
- “No molestar” (DND): habilitar y configurar ventanas (no enviar avisos fuera de horario)
- Frecuencia: máximo por hora, resumen diario opcional

Comportamiento:
- Las alertas `critical` pueden ignorar DND si están marcadas como operativas.
- Las notificaciones de auditoría nunca incluyen datos sensibles.
- Alcance DND (explicación): DND silencia `vip_chat` y notificaciones `info`/`warning`; NO silencia `ops` marcadas como `critical` ni avisos de sanciones (siempre visibles).

---

## 5) Visibilidad

- Mostrar estado VIP del tipster (si aplica)
- Mostrar score de soporte (Support Quality Score) en Perfil
- Mostrar banners de sanción visibles (solo categorías permitidas: suspensión/baneo)
- Ocultar datos de contacto externos (cumple reglas del perfil)

---

## 6) Canales y flags

- Habilitar `vip_chat` si la plataforma lo permite y el tipster tiene VIP/suscripción personal.
- Requerir disclaimer para `vip_chat` y tickets sensibles (`payments`, `dispute`).
- Persistir aceptación (checkbox + timestamp), bloqueando envío hasta aceptar.
- Habilitar “Templates/Macros” en soporte.

---

## 7) Políticas de SLA por tipster (opcional)

- Permitir targets personalizados SOLO si Admin habilita esta función.
- Targets sugeridos: `ops_response_ms`, `vip_response_ms`, `escalation_ms`.
- Prioridades por tags: `payments` y `dispute` pueden ser `high`/`critical`.

Nota: Si Admin define políticas globales, los targets del tipster son solo lectura.
Regla UI: cuando Admin controla SLA, los campos de SLA se muestran en solo lectura con un tooltip “Controlado por Admin”.

---

## 8) Adjuntos y límites

- Máx. archivos por mensaje (p.ej. 3)
- Tamaño máx. por archivo (p.ej. 10 MB)
- Tipos permitidos: `image/png`, `image/jpeg`, `application/pdf`
- Comportamiento bajo sanción: bloquear `attach` en `temporary_restriction`, `tipster_suspended`, `tipster_banned`, `vip_chat_disabled`.

---

## 9) Integración con sanciones

- Respeta sanciones globales: un bloqueo por sanción tiene prioridad sobre cualquier preferencia.
- Definir comportamiento: `send`, `attach`, `vip_chat` deshabilitados según nivel.
- Duración y apelación se gestionan en Admin; el tipster solo ve estado y mensajes.
- Log de eventos de sanción (visible en soporte y perfil).

---

## 10) Persistencia y auditoría

- Cada cambio queda en audit trail (timestamp, campo, actor).
- Aceptaciones de disclaimer guardan `accepted_at` y contexto (p.ej. `vip_chat`).

---

## 11) Seguridad y compliance

- No compartir datos sensibles en soporte (banner fijo).
- Para `vip_chat`, mostrar y exigir el disclaimer legal antes de enviar.
- Moderación automática: bloquear URLs/datos de contacto en campos libres.

---

## 12) UI (wireframe sugerido)

- Reutilizar sidebar y estilo de Dashboard (como `tipster-support.html`).
- Grupos: Generales, Notificaciones, Visibilidad, Canales, SLA (solo lectura si Admin), Adjuntos.
- Controles: selects, toggles, inputs de horario con validación simple.

Sin rediseño: mantener paleta/estilos existentes.

---

## 13) Datos mínimos (modelo sugerido)

```typescript
export interface TipsterSettings {
  general: {
    language: 'es' | 'en'
    timezone: string
    date_format: 'DD/MM/YYYY' | 'MM/DD/YYYY'
    time_format: 'HH:mm' | 'hh:mm a'
    operating_hours?: Array<{ day: 'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'|'Sun'; start: string; end: string }>
  }

  notifications: {
    channels: { ops: boolean; vip_chat: boolean; audit: boolean; sla_critical: boolean }
    severity_levels: Array<'critical'|'warning'|'info'>
    delivery: { banner: boolean; badge: boolean }
    dnd: { enabled: boolean; windows?: Array<{ start: string; end: string }>; scope?: { silence_vip_chat: boolean; silence_info_warning: boolean; allow_ops_critical: boolean; allow_sanctions: boolean } }
    frequency: { max_per_hour?: number; summary_daily?: boolean }
  }

  visibility: {
    show_vip_status: boolean
    show_support_score: boolean
    show_sanctions_banner: boolean
  }

  channels_flags: {
    vip_chat_enabled: boolean
    templates_enabled: boolean
    macros_enabled: boolean
    disclaimer_required_for_vip_chat: boolean
  }

  compliance: {
    disclaimers: {
      vip_chat_accepted: boolean
      vip_chat_accepted_at?: number
    }
  }

  sla_policy?: {
    allow_custom_targets: boolean
    targets?: { ops_response_ms?: number; vip_response_ms?: number; escalation_ms?: number }
    priority_map?: Array<{ tag: 'payments'|'dispute'|'verification'|'abuse'|'other'; priority: 'low'|'medium'|'high'|'critical' }>
    ui?: { read_only: boolean; tooltip?: string }
  }

  attachments_policy: {
    max_files_per_message: number
    max_size_mb: number
    allowed_types: string[]
  }

  sanctions_behavior: {
    respect_global_sanctions: true
    disabled_actions?: Array<'send'|'attach'|'vip_chat'|'all'>
  }

  audit: { changes_tracked: true }
}
```

Notas de integración:
- `vip_chat_enabled` debe respetar `TIPSTER_SUPPORT_FEATURE_FLAGS` y `TIPSTER_STATUS` (solo activo si `ACTIVE`).
- `disclaimer_required_for_vip_chat` se verifica en envío y creación de tickets.
- `show_support_score` expone el score en Perfil.

---

## 14) Reglas importantes

- Precedencia: sanción > configuración personal.
- `system` es siempre solo lectura.
- `vip_chat` requiere aceptación de disclaimer si está activo.
- `vip_chat` requiere aceptación de disclaimer si está activo.
- Precedencia/Feature Flags: GlobalFeatureFlags → TipsterStatus → GlobalPolicies → TipsterSettings → UI defaults.

---

## 15) Ruta y permisos

- Ruta: `/tipster/settings` (Config Tipster)
- Permisos:
  - Tipster: puede editar sus propios ajustes.
  - Admin: puede ver/forzar políticas globales; los targets SLA pueden ser solo lectura.
- Auditoría: todo cambio se registra.
- Nota de integración con Wallet: existe cooldown de cambio de payout wallet (config en Admin, solo lectura aquí) y debe mostrarse un aviso en UI cuando aplique.

---

## 16) Próximos pasos (MVP)

- Crear wireframe HTML reutilizando estilos del dashboard.
- Conectar chips SLA de soporte a preferencias (solo lectura, simulado).
- Persistir el checkbox de disclaimer en `vip_chat` y en tickets sensibles.
- Exponer score de soporte y estado de sanción en Perfil según `visibility`.
# 📄 Tipster Subscribers

## Objetivo del módulo

Módulo de **Control de permisos de contenido** para que los tipsters gestionen quién puede ver sus señales. No es un CRM completo, solo control de acceso en tiempo real basado en reglas de negocio.

Este módulo **NO procesa pagos ni liquidaciones**. Solo administra acceso a contenido.

## Diferencia clave:

- **Store** → vende créditos
- **Signals** → publica picks  
- **Settlements** → liquida resultados
- **Subscribers** → controla quién puede ver cada pick

## Concepto central (MUY IMPORTANTE)

Un usuario puede tener acceso a las señales del tipster por 4 vías distintas:

### FREE FOLLOWER
Sigue al tipster pero solo ve señales gratuitas.

### CREDIT BUYER
Compró una señal individual con créditos.

### GENERAL SUBSCRIPTION
Paga suscripción mensual al tipster.

### PERSONAL SUBSCRIPTION (VIP)
Acceso privado/individual otorgado manualmente.

El módulo no decide precios. Solo decide acceso.

## Secciones del módulo

### 1. Subscribers Overview (panel superior)

**Métricas:**
- Total followers
- Subscribers activos
- VIP activos
- Créditos compradores (últimos 30 días)
- Tasa de conversión follower → subscriber

### 2. Tabs principales

#### TAB: Followers
Usuarios que siguen al tipster.

**Campos:**
- username
- fecha follow
- país (opcional)
- actividad (último login)
- estado: free / convertido

**Acciones:**
- Ver perfil
- Invitar a suscripción

#### TAB: Subscribers (suscripción general)
Usuarios con acceso por plan mensual.

**Campos:**
- username
- plan
- fecha inicio
- fecha expiración
- auto-renew (on/off)
- estado: active / expired / canceled

**Acciones:**
- Extender acceso
- Cancelar acceso
- Ver historial

#### TAB: VIP / Personal
Accesos manuales.

**Campos:**
- username
- otorgado por (tipster/admin)
- motivo (opcional)
- fecha inicio
- fecha fin
- estado

**Acciones:**
- Revocar acceso
- Extender

#### TAB: Credit Buyers
Usuarios que compraron picks individuales.

**Campos:**
- username
- señal comprada
- créditos pagados
- fecha compra
- estado acceso

**Importante:** La `purchase` se marca como `consumed` al liquidar la señal, pero el acceso al detalle permanece gracias al snapshot.

## Reglas de acceso (core del sistema)

### Orden de prioridad de acceso:
1. **VIP**
2. **Subscription**
3. **Credit Purchase**
4. **Free**

Si un usuario cumple varios, se aplica el mayor nivel.

**Ejemplo:** Usuario con suscripción y compra individual → sigue siendo subscriber (no se descuenta acceso).

## 🔹 Access Resolution Engine

### Función principal: `resolveUserAccess(user_id, signal_id)`

Al abrir una señal, el sistema ejecuta esta función para determinar el acceso en tiempo real.

```typescript
function resolveUserAccess(user_id: string, signal_id: string): AccessResult {
  const tipster_id = getTipsterBySignal(signal_id);

  // 1. Verificar VIP activo para este tipster
  if (hasActiveVIP(user_id, tipster_id)) {
    return { granted: true, access_type: 'vip', reason: 'VIP active for this tipster' };
  }
  
  // 2. Verificar suscripción activa (distinguir scope)
  if (hasActiveSubscription(user_id, tipster_id)) {
    const signalScope = getSignalScope(signal_id); // 'general' | 'personal'
    
    if (signalScope === 'general') {
      return { granted: true, access_type: 'subscription', reason: 'Active subscription (general)' };
    }
    
    // Para señales personales se requiere VIP por tipster
    if (signalScope === 'personal') {
      return { granted: false, access_type: null, reason: 'Personal signal requires VIP for this tipster' };
    }
  }
  
  // 3. Verificar compra con créditos
  if (hasPurchasedSignal(user_id, signal_id)) {
    return { granted: true, access_type: 'credit', reason: 'Signal purchased' };
  }
  
  // 4. Verificar señal gratuita
  if (isFreeSignal(signal_id)) {
    return { granted: true, access_type: 'free', reason: 'Free signal' };
  }
  
  // 5. Acceso denegado
  return { granted: false, access_type: null, reason: 'No valid access' };
}
```

### Importante:
- La verificación ocurre **SIEMPRE al abrir la señal**, no al listarla
- Esto evita leaks de información privilegiada en previews
- El frontend solo muestra teasers hasta que el usuario intenta abrir la señal completa

## 🔹 Snapshot Creation Triggers

### Cuándo se crea un snapshot:

| Método de acceso | Trigger | Tipo de snapshot |
|------------------|---------|------------------|
| **Compra individual** | `signal.purchased` | Snapshot por señal |
| **Suscripción** | `subscription.created` | Entitlement por tipster (no por señal) |
| **VIP** | `vip.granted` | Entitlement por tipster (tipster_id) |
| **Señal gratuita** | `signal.viewed` | Snapshot por señal (solo tracking) |

### Diferencia clave:
- **Compra individual**: Snapshot por cada señal
- **Suscripción**: Entitlement por tipster (acceso a todas las señales del tipster mientras esté activa)
- **VIP**: Entitlement por tipster (acceso a todas las señales de un tipster específico)
- **Free Snapshots**: Se usan para tracking de visualizaciones, no para gestionar permisos, ya que las señales gratuitas siempre son accesibles.

### Implementación:
```typescript
function createAccessSnapshot(user_id: string, signal_id: string, access_type: string): void {
  if (access_type === 'subscription') {
    // Para suscripciones, crear entitlement por tipster
    const tipster_id = getTipsterBySignal(signal_id);
    createSubscriptionEntitlement(user_id, tipster_id);
  } else {
    // Para compras individuales, crear snapshot por señal
    createSignalSnapshot(user_id, signal_id, access_type);
  }
}
```

## 🔹 Access Snapshot Rule

### Concepto crítico: Snapshot de acceso

Cuando un usuario obtiene acceso a una señal (por compra o suscripción), se guarda un snapshot inmutable:

```typescript
interface SignalAccessSnapshot {
  user_id: string;
  signal_id: string;
  access_type_at_purchase: 'free' | 'subscription' | 'credit' | 'vip';
  granted_at: Date;
  expires_at?: Date; // Solo para suscripciones
}
```

### Regla fundamental:
**El acceso nunca depende del estado actual de la señal, sino del snapshot en el momento de adquisición.**

### Ejemplos de problemas que evita:
- Tipster cambia señal de FREE → CREDIT después de publicada
- Usuario compró cuando era FREE, no debe perder acceso
- Suscripción expira pero usuario tenía acceso por compra previa
- Señal cambia de tipo después de compra individual

### Implementación:
```typescript
function checkAccessWithSnapshot(user_id: string, signal_id: string): boolean {
  // 1. Buscar snapshot existente
  const snapshot = getAccessSnapshot(user_id, signal_id);
  
  if (snapshot) {
    // El acceso se basa en el snapshot, no en el estado actual
    return !isSnapshotExpired(snapshot);
  }
  
  // 2. Si no hay snapshot, evaluar acceso actual
  return resolveUserAccess(user_id, signal_id).granted;
}
```

## Lógica de visibilidad de señales

### Diferencia clave: Follower vs Audience
- **Follower**: Usuario que sigue al tipster pero no ha pagado
  - Solo ve teaser de señales FREE (no mercado ni cuota completa)
  - No ve previews de señales premium
  - Es el embudo de conversión
- **Audience**: Usuario que ha pagado por algún tipo de acceso

### Visibilidad por tipo de usuario:
- **Follower**: Solo ve teaser de señales FREE
- **Subscriber**: Ve señales FREE + SUBSCRIPTION (acceso completo)
- **VIP**: Ve todas las señales (acceso completo)
- **Credit Buyers**: Ve señales FREE + las que compró individualmente (purchase queda consumed al liquidar, pero el acceso al detalle permanece)

## 🔹 Subscription Expiration Behavior

### Evaluación de expiración
La expiración se evalúa **al momento de abrir la señal**, no en listados.

### Reglas de expiración:
```typescript
function evaluateSubscriptionAccess(user_id: string, signal_id: string): boolean {
  const subscription = getUserSubscription(user_id);
  
  // 1. Verificar grace_period
  if (subscription.status === 'grace_period') {
    // Acceso permitido durante período de gracia
    return true;
  }
  
  // 2. Verificar expired
  if (subscription.status === 'expired') {
    // No se debe retirar acceso a señales previamente desbloqueadas
    if (hasPreviousAccessSnapshot(user_id, signal_id)) {
      return true; // Mantener acceso por snapshot
    }
    return false; // Bloquear nuevo acceso
  }
  
  // 3. Active o cualquier otro estado
  return subscription.status === 'active';
}
```

### Estados del subscriber

| Estado | Significado | Acceso a nuevas señales | Acceso a señales previas |
|--------|-------------|------------------------|---------------------------|
| `active` | Suscripción vigente | ✅ Sí | ✅ Sí |
| `expired` | Suscripción vencida | ❌ No | ✅ Sí* |
| `revoked` | Suscripción cancelada por admin | ❌ No | ❌ No** |
| `pending_activation` | Pendiente de activación | ❌ No | ❌ No |
| `grace_period` | Venció hace < 24h (tolerancia) | ✅ Sí | ✅ Sí |

\* Solo si tiene snapshot de acceso previo  
\** Admin puede configurar comportamiento

### Regla de revocación (corte total)
El estado `revoked` (iniciado por un admin) **ignora cualquier snapshot o entitlement existente**. Es un corte de acceso total e inmediato, tanto para señales nuevas como para las ya accedidas.

## 🔹 Settlement Impact on Access

### Caso crítico: Señales VOID
Cuando una señal es marcada como VOID (settlement = void):

```typescript
function handleVoidSignal(signal_id: string): void {
  // 1. Buscar todas las compras de esta señal
  const purchases = getSignalPurchases(signal_id);
  
  purchases.forEach(purchase => {
    // 2. Marcar compra como "consumida"
    updatePurchaseStatus(purchase.id, 'consumed');
    
    // 3. NO devolver créditos automáticamente
    // (Esto lo maneja admin manualmente)
    
    // 4. El acceso del usuario permanece
    // (No se revoca el acceso por ser VOID)
    
    // 5. Notificar al usuario
    notifyUser(purchase.user_id, 'signal_void', {
      signal_id: signal_id,
      message: 'Señal anulada. Contacta a soporte para reembolso.'
    });
  });
}
```

### Reglas de settlement:
- **VOID**: Acceso permanece, créditos no se devuelven automáticamente
- **CANCELLED**: Mismo comportamiento que VOID
- **WIN/LOSS**: Comportamiento normal, acceso ya fue consumido
- **REFUND**: Admin puede decidir devolver créditos y revocar acceso

## Eventos del sistema

| Evento | Qué ocurre | Impacto en acceso |
|--------|------------|-------------------|
| `subscription.created` | Se activa cuando un usuario se suscribe | Nuevo acceso disponible |
| `subscription.cancelled` | El usuario cancela la suscripción | No afecta acceso actual (hasta expiración) |
| `subscription.expired` | Se vence el período pagado | Acceso bloqueado para nuevas señales |
| `subscription.grace_period` | Entra en período de gracia | Acceso temporal mantenido |
| `credit.purchased` | El usuario compra créditos | No impacta acceso directo |
| `signal.purchased` | Compra una señal puntual | Acceso snapshot creado |
| `access.granted` | Se le da acceso a un contenido | Snapshot registrado |
| `access.revoked` | Se le quita acceso | Solo por admin o refund |
| `signal.settled` | Señal liquidada | No impacta acceso existente |
| `signal.voided` | Señal anulada | Acceso permanece, compra marcada |

(No es auditoría administrativa, es tracking de relación comercial)

## Notas importantes

- No mostrar pagos en dinero aquí
- No mostrar estadísticas deportivas aquí
- No permitir cambiar precios desde aquí
- No modificar señales desde aquí

**Este módulo es exclusivamente Control de permisos de contenido.**

- Los pagos se validan contra el módulo de `payments`.
- Si un usuario tiene **múltiples accesos**, se prioriza el **más alto** (VIP > Subscription > Credit > Free).
- Los **Credit Buyers** mantienen acceso incluso si la señal luego cambia de tipo.
- Las **suscripciones vencidas** pasan a `grace_period` antes de `expired` (opcional).
- **Access Snapshot Rule**: El acceso nunca depende del estado actual de la señal.
- **Settlement Impact**: Las señales VOID no revocan acceso ni devuelven créditos automáticamente.

## Interfaces

### SubscriberOverview
```typescript
interface SubscriberOverview {
  total_followers: number;
  active_subscribers: number;
  active_vip: number;
  credit_buyers_30d: number;
  conversion_rate: number; // percentage
}
```

### Follower
```typescript
interface Follower {
  id: string;
  username: string;
  country?: string;
  follow_date: Date;
  last_activity: Date;
  status: 'free' | 'converted';
}
```

### Subscriber
```typescript
interface Subscriber {
  id: string;
  username: string;
  plan: string;
  start_date: Date;
  expiration_date: Date;
  auto_renew: boolean;
  status: 'active' | 'expired' | 'canceled';
}
```

### VIPSubscriber
```typescript
interface VIPSubscriber {
  id: string;
  username: string;
  granted_by: 'tipster' | 'admin';
  reason?: string;
  start_date: Date;
  end_date: Date;
  status: 'active' | 'expired' | 'revoked';
}
```

### CreditBuyer
```typescript
interface CreditBuyer {
  id: string;
  username: string;
  signal_id: string;
  signal_title: string;
  credits_paid: number;
  purchase_date: Date;
  access_status: 'active' | 'expired';
}
```

## Acciones disponibles

### Followers Actions
- `viewProfile(followerId: string)`
- `inviteToSubscription(followerId: string)`

### Subscribers Actions
- `extendAccess(subscriberId: string, days: number)`
- `cancelSubscription(subscriberId: string)`
- `viewSubscriptionHistory(subscriberId: string)`

### VIP Actions
- `revokeAccess(vipId: string)`
- `extendAccess(vipId: string, endDate: Date)`

## Filtros y búsqueda

### Filtros por tab:
- **Followers**: por país, fecha de follow, estado
- **Subscribers**: por plan, estado, fecha de expiración
- **VIP**: por otorgado por, estado, fecha
- **Credit Buyers**: por rango de créditos, fecha de compra

### Búsqueda global:
- Buscar por username en cualquier tab
- Búsqueda instantánea mientras se escribe

## Notificaciones y alertas

### Alertas para el tipster:
- Nuevo follower
- Suscripción próxima a vencer (7 días)
- VIP otorgado/revocado
- Compra de créditos por usuario

### Notificaciones a usuarios:
- Invitación a suscripción (desde followers)
- Recordatorio de expiración de suscripción
- Acceso VIP otorgado/revocado

## Exportación de datos

Opciones de exportación:
- **CSV**: Lista completa de subscribers con datos básicos
- **Excel**: Incluye historial de accesos y métricas
- **PDF**: Reporte mensual de gestión de accesos

### Reglas de privacidad en exportación:
- ❌ No exportar links sensibles (URLs de señales, tokens de acceso)
- ❌ No exportar notas internas del admin
- ❌ No exportar información indexable por buscadores
- ✅ Solo exportar datos necesarios para análisis/integración
- ✅ Hashear IDs sensibles si es requerido

## Integraciones

### Con Store Module
- Ver créditos comprados por usuario
- Link directo a compra de créditos

### Con Signals Module
- Ver señales accedidas por cada usuario
- Link a señales compradas con créditos

### Con Settlements Module
- Ver resultados de señales accedidas
- Tracking de ROI por tipo de acceso
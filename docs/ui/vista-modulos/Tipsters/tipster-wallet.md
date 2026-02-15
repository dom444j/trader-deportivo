# Módulo: Tipster Wallet

## Objetivo del módulo

El módulo Tipster Wallet permite al tipster visualizar sus ingresos generados dentro de la plataforma, entender de dónde provienen y solicitar retiros.

Este módulo:
- **NO** recibe depósitos
- **NO** compra créditos
- **NO** gestiona pagos de usuarios

Este módulo solo administra ganancias del tipster.
Es un **ledger de ingresos + sistema de retiros**.

## Concepto clave

El tipster no gana dinero directamente cuando vende una señal.
El flujo real es:
Usuario paga → plataforma valida → señal se liquida → comisión se libera → pasa a saldo disponible → tipster puede retirar.

Por lo tanto el wallet tiene 3 estados de dinero:

1.  **Pending Earnings**
    Ingresos generados pero aún no liberados (la señal no ha sido liquidada o está en revisión).
2.  **Available Balance**
    Ingresos ya confirmados y disponibles para retiro.
3.  **Locked / Processing**
    Dinero solicitado para retiro pero aún no enviado.

## Panel superior (Wallet Overview)

Mostrar:
-   Available Balance
-   Pending Earnings
-   Locked in Withdrawals
-   Total Lifetime Earnings
-   Último pago recibido (fecha)

No mostrar monedas fiat ni conversión.
La unidad base será la moneda interna de la plataforma (ej: USDT).

## Fuentes de ingresos (muy importante)

El wallet debe separar claramente el origen del dinero:

**Earnings Sources**
-   Signal Sales (compras por créditos)
-   Subscriptions (suscripción mensual)
-   Personal/VIP Access
-   Bonuses (opcional futuro: promociones o admin)

Cada ingreso en el ledger debe indicar su fuente.

## Ledger de transacciones

Tabla principal:

**Campos:**
-   Date
-   Type (sale / subscription / vip / bonus / adjustment / withdrawal)
-   Reference (signal_id / subscription_id / admin_note)
-   Amount
-   Status (contextual según Type; ver abajo)
-   Balance after transaction

**Status por tipo (no mezclar):**
-   Earnings (sale/subscription/vip/bonus/adjustment): pending → hold → available; reversed/adjusted (si aplica)
-   Withdrawals: requested → approved → processing → paid → rejected
-   Nota: "locked" aplica únicamente al flujo de withdrawals (bloqueo de saldo al solicitar retiro).

**Importante:**
El ledger es inmutable.
Nunca se borra ni se edita; solo se agregan nuevas entradas.

## Liberación de ingresos (regla crítica)

Los ingresos NO pasan a disponible al momento de la compra.

**Regla:**
-   **Signals** → se liberan cuando la señal es liquidada
-   **Subscription** → se liberan diariamente proporcional o al finalizar periodo (definir plataforma)
-   **VIP** → se liberan inmediatamente o diario (configurable)

Esto evita fraude de tipster abandonando después de vender.

## 🔹 Earnings Hold Period

Después de la liquidación, los ingresos no pasan inmediatamente a Available.

**settlement → HOLD → available**

**Regla recomendada:**
-   **señales:** 24–72h hold
-   **suscripciones:** hold 24h
-   **VIP:** configurable

**Motivo:**
-   permitir disputas
-   detectar fraude
-   permitir revisión manual

Sin esto, tu sistema de retiros es explotable.

## 🔹 Ledger Accounting Model

El wallet funciona por double-entry accounting simplificado:

Cada evento crea una transacción:

| Evento          | Entrada          |
| --------------- | ---------------- |
| Compra señal    | pending credit   |
| Liquidación     | release earning  |
| Solicitud retiro | lock             |
| Pago            | debit            |

**Regla:**
El balance visible siempre se calcula a partir del ledger, nunca se guarda manually.
Esto evita bugs financieros (muy comunes en plataformas).

## 🔹 Dispute Handling

Si una señal entra en **disputed**:
-   ganancias asociadas → vuelven a **pending**
-   no pueden retirarse
-   si se corrige a **loss/void** → ajustar ledger con **adjustment entry**

Esto conecta con tu módulo settlements.

## 🔹 Adjustment Entries

Solo admin puede crear ajustes por:
-   corrección de settlement
-   fraude detectado
-   error del sistema
-   chargeback del usuario

**Regla importante:**
El tipster nunca puede editar el ledger.

## Retiro de fondos (Withdrawals)

### Solicitar retiro

El tipster puede:
-   elegir monto
-   seleccionar método de retiro
-   confirmar

**Reglas:**
-   Monto mínimo (ej: 50 USDT)
-   Solo desde Available Balance
-   No puede retirar Pending

### Estados de retiro

-   requested
-   approved
-   processing
-   paid
-   rejected

Al solicitar retiro:
Available Balance ↓
Locked Balance ↑

### Métodos de retiro

Definir como configurables:
-   USDT (TRC20 / BEP20)
-   Otros (futuro)

Campos necesarios:
-   wallet_address
-   network
-   alias

El tipster debe guardar su wallet antes de retirar.

### 🔹 Wallet Address Protection

-   cambio de wallet requiere confirmación por email/2FA
-   nuevo retiro bloqueado 24h tras cambio
-   registrar historial de wallets

Esto te salva de hackeo de cuentas.

### Historial de retiros

Tabla:
-   request_date
-   amount
-   method
-   wallet
-   status
-   tx_hash (cuando pagado)

No editable por tipster.

## Reglas anti-abuso

El sistema debe:
-   bloquear retiro si hay señales en disputa
-   bloquear si hay fraude marcado
-   bloquear si cuenta suspendida

Mostrar mensaje claro al tipster.

### 🔹 Withdrawal Risk Checks

Antes de aprobar un retiro:
El sistema verifica:
-   no señales pendientes de liquidar
-   no disputas abiertas
-   ratio cancel alto
-   cuenta no recién creada
-   no cambios recientes de wallet address (ej: <24h)

Si falla → withdrawal queda en **review**.
Esto evita lavado interno.


## Notificaciones

Eventos:
-   earnings_released
-   withdrawal_requested
-   withdrawal_paid
-   withdrawal_rejected

(No es soporte, solo informativo)

## Notas importantes

-   El wallet NO modifica signals ni subscribers
-   El wallet NO permite ajustes manuales al tipster
-   Ajustes solo pueden venir de admin como “adjustment entry”

## Financial Rules (Reglas Financieras)

### Revenue Share Model (OBLIGATORIO)

La plataforma retiene una comisión sobre:
- venta de señales
- suscripciones
- acceso VIP

Estructura (sin números concretos, configurable por ADMIN):

- signal_sale:
  - user pays: 100 créditos
  - platform fee: X%
  - tipster earning: Y%
- subscription:
  - user pays: 30 USDT
  - platform fee: X%
  - tipster earning: Y%
- vip_access:
  - user pays: monto configurado
  - platform fee: X%
  - tipster earning: Y%

Reglas:
- El revenue share se define en configuración de plataforma (ADMIN) y puede variar por tipo de producto.
- El cálculo de earning del tipster se registra en el ledger en el momento de creación del pending earning.

### Credit Conversion Rule

Las señales se pagan en créditos, el wallet opera en moneda interna (ej: USDT).

Definir:
- Tasa interna (ejemplo: 1 crédito = 0.20 USDT)
- Quién la define: ADMIN
- Si puede cambiar: Sí, pero NO afecta compras pasadas
- Conversión en el ledger: se fija al momento de la compra y queda inmutable

Reglas:
- Cada compra de señal registra en el ledger: credit_cost y su valor monetario convertido.
- Cambios futuros de la tasa no alteran transacciones históricas.

### Earnings Creation Moment

El ingreso NO nace en la liquidación, nace en la compra como pendiente:

Flujo:
- usuario compra señal → se crea pending earning (con revenue share y conversión aplicados)
- settlement valida si se mantiene o ajusta (win/loss/void/disputa)
- entra en hold period
- pasa a available (si procede)

Esto aclara el momento contable correcto y evita errores de sincronización.

### Refund & Reversal Rules

Casos:
- evento void/cancelado → earnings cancelled (entrada negativa en ledger)
- admin refund → negative adjustment
- error del tipster → earning reversed

Reglas contables:
- Toda reversión/refund se registra como transacción negativa en el ledger (inmutable).
- Si un earning pendiente se cancela, se revierte la entrada correspondiente.
- Si ya estaba disponible, se descuenta del balance mediante ajuste negativo y el balance se recalcula desde el ledger.

### Modelo definitivo de suscripción (prorrateo diario)

Decisión: prorrateo diario.

Motivos:
- evita que el tipster cobre y desaparezca
- reduce chargebacks
- mejora el flujo de caja y control anti-fraude

Reglas:
- Las suscripciones generan earnings diarios proporcionales (pending).
- Se aplica hold de 24h por día antes de liberar a available.
- Cada día se registra una entrada en el ledger (inmutable) con el earning correspondiente.

### Withdrawal Fee Rule

Definir el costo de red (gas fee) para retiros en cripto.

Opciones:
- Lo paga el tipster (recomendado): se descuenta del monto a recibir.
- Lo cubre la plataforma (casos especiales): se registra como costo interno.

Parámetros:
- Fee fijo o variable según red (TRC20/BEP20, etc.).
- Red seleccionada por el tipster.

Ejemplo:
- Withdrawal: 100 USDT
- Network fee: 1 USDT
- Tipster recibe: 99 USDT

Reglas contables:
- El retiro genera una transacción de débito por el monto retirado.
- El fee de red se registra como transacción separada (débito) asociada al retiro.
- El balance siempre se recalcula desde el ledger, nunca se actualiza manualmente.
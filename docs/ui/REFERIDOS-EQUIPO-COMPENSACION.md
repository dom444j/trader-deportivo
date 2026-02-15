# 📦 Módulo: Referidos, Equipo y Compensación — Trader Deportivo

## 🎯 Propósito
Unificar reglas, flujos y cálculos de:
- Referidos Directos (comisión 10% sobre pagos reales)
- Equipo Binario A/B (solo rangos, sin comisión por compra)
- Rangos por acumulado y participación en pool semanal
- Operación admin (definir beneficio, dispersar, auditar)

---

## 📜 Business Rules – Compensation Plan (Resumen 1 página)
- Eventos que generan dinero:
  - Comisión por referidos directos (10% sobre pago real)
  - Pool semanal (bolsas por rango)
  - Bonos admin (manuales, auditables)
- Comisión directos:
  - 10% del pago real de la suscripción: $29.99 / $129.99 / $799.99
  - No aplica sobre bonos, créditos regalados o pruebas
- Binario:
  - No paga comisión por compra; solo genera volumen histórico (Bank) para rangos
- Aportes al Bank por plan (históricos, acumulativos):
  - Básica: +20
  - Pro: +80
  - Premium: +500
- Activación:
  - 30 días desde la compra
  - Entra al próximo miércoles según cutoff
  - Cutoff único de elegibilidad: miércoles 00:00 UTC de la semana anterior al pay_date
- Rango base vs rango pagable:
  - Básica: tope pagable R3
  - Pro/Premium: puedes cobrar hasta tu rango base
  - Sin compra activa: no participa
- Pool semanal:
  - Admin define beneficio semanal
  - Se reparte el 60% en bolsas por rango (ver “Pool semanal y cálculo” para tabla de porcentajes y reglas de reparto)
  - Elegibilidad por bolsa: R4+ acumulable entre R4–R7; nunca incluye R1–R3
- Reversas:
  - No tocan Bank ni rango base
  - Solo revierten movimientos contables del week_key correspondiente
- Bonos admin:
  - Manuales según criterios operativos
  - Límites opcionales (por usuario y totales)
  - Totalmente auditables

---

## 🔹 Modelo A — Referidos Directos (Nivel 1)
**Tipo:** Un solo nivel (directos). No hay derrame automático en este bloque.

**Comisión:** 10% del valor efectivamente pagado. No aplica sobre bonos, créditos regalados o pruebas.

**Evento de generación:** Pago confirmado del referido.

**Acción:** Crear registro de comisión (pending → available → paid).

**Dónde se refleja:** Wallet de referidos (separada del balance operativo). Puede retirarse, convertirse en créditos o pagar planes.

**Datos mínimos:** user_id (quién gana), referred_user_id, subscription_id (compra), plan_id, amount_paid, commission_amount (10%), status, created_at.

**Idempotencia (wallet de referidos):** 1 compra = 1 comisión directa; clave idempotente: subscription_id. Reintentos no generan duplicados; se validan contra ledger/tx_id.

---

## 🔹 Modelo B — Equipo Binario A/B (solo rangos)
**Registro y colocación:**
- Al registrarse, el usuario elige equipo A o B.
- Se coloca en la posición extrema disponible (spillover dentro de ese lado).
- Regla clave: tus directos NO llenan la red interna de tu directo (cada directo construye sus 2 líneas propias).

**Estructura:**
- Máximo 2 directos por usuario (binario).
- El resto son indirectos.
- En UI del árbol, por lado: Equipo A → Directos # / Indirectos #; Equipo B → Directos # / Indirectos #.

**Acumulados (Bank):**
- Bank A = acumulado del lado A
- Bank B = acumulado del lado B
- Bank Total = A + B
- Es histórico (nunca se borra), sirve exclusivamente para rangos.

**Aporte por plan (al Bank):**
- Básica $29.99 → aporta $20
- Pro $129.99 → aporta $80
- Premium $799.99 → aporta $500

---

## 🏆 Rangos por acumulado (7 rangos)
**Condición (A y B deben cumplir mínimos):**
- R1: 400 | 400 → Total 800
- R2: 1200 | 1200 → Total 2400
- R3: 5000 | 5000
- R4: 12000 | 12000
- R5: 25000 | 25000
- R6: 50000 | 50000
- R7: 100000 | 100000

**Regla de participación (acumulable desde R4):**
- R1 → cobra solo R1
- R2 → cobra solo R2
- R3 → cobra solo R3
- R4 → cobra solo R4
- R5 → cobra R4 + R5
- R6 → cobra R4 + R5 + R6
- R7 → cobra R4 + R5 + R6 + R7
- R4–R7 nunca cobran R1–R3.

**Plan limita el “rango pagable” (tope por plan):**
- Básica $29.99 ⇒ máximo pagable R3 (aunque tu rango base sea R4–R7)
- Pro/Premium $129.99+ ⇒ pagas hasta tu rango base (hasta R7)
- Sin compra activa ⇒ no participa (pagable = inactivo)

---

## ⏱️ Activación y ciclo de pago
- Activación dura 30 días desde la compra.
- Pagos son los miércoles.
- Si compra lunes, NO entra el miércoles de esa semana; entra el próximo miércoles.
- Cada compra activa permite participar en 4 miércoles (4 semanas).
- Numeración de semana: ISO con año → `YYYY-Www` (ej: 2026-W05).

---

## 💰 Pool semanal y cálculo
**Beneficio semanal** lo define Admin (ej: $10,000).

**Total a repartir** = BeneficioSemanal × 0.60.

**Porcentajes por rango** (calculados sobre el beneficio total):
- R1: 12% → ej: 10,000 × 0.12 = $1,200
- R2: 10% → $1,000
- R3: 7% → $700
- R4: 7% → $700
- R5: 7% → $700
- R6: 7% → $700
- R7: 10% → $1,000
- La suma de bolsas = 60% del beneficio (cuadra con el tope).

**Reparto de cada bolsa:** En partes iguales entre el conjunto elegible:
- Bolsa R1 → solo R1
- Bolsa R2 → solo R2
- Bolsa R3 → solo R3
- Bolsa R4 → R4, R5, R6, R7
- Bolsa R5 → R5, R6, R7
- Bolsa R6 → R6, R7
- Bolsa R7 → solo R7

**Elegibilidad por miércoles:**
- Tener rango base alcanzado (por Bank histórico).
- Tener rango pagable por plan activo (Básica hasta R3; Pro/Premium hasta tu base).
- Estar dentro de activación 30 días.
- Haber pasado el corte único de elegibilidad: cutoff_datetime = miércoles 00:00 (UTC) de la semana anterior al pay_date. Si compras después de ese cutoff, entras en el próximo miércoles. Ejemplo: compra el lunes ⇒ no entra ese miércoles, entra el siguiente.

---

## 🛠️ Operación Admin (módulo dedicado)
- Bank General (informativo / dashboard).
- Crear semana (`YYYY-Www`) con `pay_date` (miércoles).
- Definir Beneficio Semanal ($) y guardar.
- Simular reparto por rangos.
- Ejecutar dispersión automática.
- Reversar (admin) si aplica.

**Orden de ejecución semanal (miércoles):**
1) Pool semanal → 2) Bonos admin → 3) Comisiones directas disponibles (según estado).

**Reglas de reversa (alcance):**
- NO revierte Bank histórico.
- NO revierte rangos base.
- Revierte solo movimientos contables de esa week_key.
- Deja trazabilidad (who/when/why).

**Bonos Admin (opcional):**
- max_amount_per_user
- max_total_budget
- requires_rank_min (ej. solo R4+)

**Historial & Auditoría:**
- Historial semanal (cabecera): week_key, pay_date, benefit_usd, total_repartido, bolsa por rango (R1..R7), conteo elegibles por bolsa, estado (draft/executed/reverted).
- Historial por usuario (detalle): week_id, user_id, rango_base, rango_pagable, bolsas cobradas (ej: R4+R5), monto_total, desglose por bolsa (opcional), ledger/tx_id, timestamp.
- Idempotencia (payout semanal): 1 semana = 1 payout por usuario; clave idempotente: week_key + user_id. Reintentos no duplican; se validan contra ledger.
- Buckets por rango materializados: ver DATA-MODEL → weekly_pool_rank_buckets (pool_run_id, rank, bucket_amount, eligible_count, per_user_amount; índice UNIQUE pool_run_id+rank). Estos registros se usan para auditoría, soporte y explicación al usuario (“por qué me pagó X”).

---

## 🔒 Trazabilidad y reglas clave
- El binario no paga comisión directa por compras; solo sirve para rangos.
- Los aportes al Bank son históricos (no se consumen).
- El plan mensual define el rango pagable (degradación/activación según compra).
- La suma de bolsas debe cuadrar con el 60% del beneficio semanal.
- Todas las ejecuciones y reversas quedan auditable con referencia contable.

---

## 🧭 Estados visibles en UI (Usuario)

> Mini-sección opcional para estandarizar labels de interfaz. Ayuda a que el frontend no invente nombres.

- Comisión directa:
  - Pending → Available → Paid / Reversed
- Pool semanal:
  - Pendiente de miércoles
  - Pagado semana YYYY-Www
- Rango:
  - Base: R5
  - Pagable: R3 (por plan)
  - Motivo downgrade: “Plan Básico activo”

---

## 🚀 Próximos pasos
- Vincular este módulo en Sidebar Admin (“Sistema Binario & Rangos”).
- Opcional: volcar esquemas mínimos de tablas a `DATA-MODEL.md` y endpoints a `API-SPEC.md`.
- Implementar UI de semana (`YYYY-Www`) con simulación, ejecución y reversa.
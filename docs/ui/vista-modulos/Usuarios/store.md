# Módulo: Tienda (Store)

**Versión:** 1.0
**Responsable:** Core Team
**Estado:** Diseño

## 1. Resumen Ejecutivo

La **Tienda** es el centro de monetización de la plataforma, diseñada para ser flexible, segura y ofrecer una experiencia de usuario clara y directa. Permite a los usuarios adquirir acceso a funcionalidades premium, comprar créditos para servicios a la carta y aprovechar promociones. El objetivo es crear un sistema de valor transparente donde el usuario entiende perfectamente qué está comprando y qué beneficios obtiene.

El tono es profesional, tecnológico y se enfoca en la autonomía del usuario. No se gestiona desde un panel de "admin" tradicional, sino que las promociones y planes son configurados a nivel de sistema (ej. `config.json`).

## 2. Componentes Principales

La tienda se divide en las siguientes secciones clave:

### 2.1. Planes y Suscripciones

Los planes son la forma principal de acceder a las herramientas avanzadas de la plataforma. Ofrecen un paquete de funcionalidades por una tarifa recurrente (ej. mensual).

-   **Plan Básico (Free Tier):** Acceso limitado a Watchlist, un número reducido de picks y Risk Guard con reglas básicas.
-   **Plan Pro (Suscripción Mensual):**
    -   Acceso completo a **Trader Master**.
    -   Acceso a **Signals Hub** (con un límite de señales activas).
    -   Acceso a **Agents Hub** (con un número limitado de agentes y backtests).
    -   **Risk Guard** con todas las funcionalidades avanzadas (IA, monitores de racha, etc.).
    -   Un paquete mensual de **Créditos** para operaciones adicionales.
-   **Plan Elite (Suscripción Anual):**
    -   Todos los beneficios del Plan Pro.
    -   Límites más altos para señales y agentes.
    -   Acceso prioritario a nuevas funcionalidades beta.
    -   Mayor paquete de Créditos y descuentos exclusivos.

### 2.2. Créditos (Moneda Virtual)

Los créditos son una moneda interna que proporciona flexibilidad y permite a los usuarios pagar por servicios específicos sin necesidad de una suscripción completa.

-   **Uso de Créditos:**
    -   Comprar acceso a una señal específica de un analista top.
    -   Ejecutar un backtest adicional en **Agents Hub**.
    -   Desbloquear un análisis premium en **Watchlist**.
    -   Comprar "boosts" temporales (ej. aumentar el límite de picks diarios).
-   **Adquisición:**
    -   Se pueden comprar en paquetes (ej. 100, 500, 1000 créditos).
    -   Se incluyen como beneficio en los planes de suscripción.
    -   Se pueden obtener a través de promociones o programas de referidos.

#### 2.2.a Reglas de Pricing y Validación (CREDITS)
-   El tipster elige el `credit_cost` de sus señales dentro de rangos mínimos/máximos administrables por la plataforma (p. ej., 2–50 créditos, configurable por mercado/fuente).
-   La UI valida y bloquea valores fuera de rango, mostrando hint del rango activo y sugerencias dinámicas según ROI/CLV histórico.
-   Teasers de señales con CREDITS muestran el costo en créditos sin revelar el mercado completo; `ticket_link` nunca se expone en teasers ni listados; no indexable; no público.
-   En el detalle (post-desbloqueo y con acceso), `ticket_link` puede mostrarse solo a usuarios autorizados.

### 2.3. Promociones y Descuentos

El sistema permitirá la creación de ofertas especiales para incentivar la compra o recompensar la lealtad.

-   **Tipos de Promociones:**
    -   **Descuento por primera compra:** Un % de descuento para nuevos usuarios.
    -   **Código de cupón:** Aplicable a planes o paquetes de créditos.
    -   **Oferta por tiempo limitado:** Descuentos en suscripciones anuales o paquetes grandes de créditos.
    -   **Bundle Deals:** Comprar un plan y obtener un paquete de créditos extra.

## 3. Flujo de Usuario y Gestión

### 3.1. Historial de Compras

Cada usuario tendrá una sección en su perfil para ver un registro detallado de todas sus transacciones.

-   **Contenido del Historial:**
    -   **ID de Transacción:** Identificador único.
    -   **Fecha y Hora:** Momento de la compra.
    -   **Producto:** Nombre del plan o paquete de créditos.
    -   **Monto y Método de Pago:** Ej. `50 USDT`.
    -   **Estado:** `COMPLETADO`, `PENDIENTE`, `FALLIDO`.
    -   **Factura (Opcional):** Enlace para descargar un recibo simple.

### 3.2. Método de Pago

Para mantener la coherencia con el ecosistema cripto y la simplicidad, el método de pago principal será **USDT** (en la red TRC20 o BEP20 por sus bajas comisiones).

-   **Flujo de Pago:**
    1.  El usuario selecciona un producto (plan o créditos).
    2.  El sistema genera una dirección de pago única y un monto exacto en USDT.
    3.  Se muestra un código QR y la dirección para que el usuario realice la transferencia desde su wallet.
    4.  Un listener de blockchain detecta la transacción entrante.
    5.  Una vez confirmada la transacción (ej. 3 confirmaciones de red), el estado de la compra cambia a `COMPLETADO`.
    6.  El sistema desbloquea la feature o acredita los créditos en la cuenta del usuario.

### 3.3. Desbloqueo de Features

El acceso a los módulos se gestiona a través de `roles` o `flags` en el perfil del usuario.

-   **Lógica de Acceso:**
    -   Al comprar el **Plan Pro**, el perfil del usuario recibe el flag `access:trader_master` y `access:signals_hub`.
    -   El frontend lee estos flags y muestra/oculta las secciones correspondientes en la UI.
    -   El backend valida estos flags en cada llamada a la API para asegurar que solo los usuarios autorizados puedan usar las funcionalidades.
    -   Cuando la suscripción expira, los flags se revocan automáticamente.

## 4. Data Models (Interfaces)

```typescript
// Interfaz para un Plan de Suscripción
interface SubscriptionPlan {
  plan_id: string; // e.g., 'pro_monthly', 'elite_yearly'
  name: string; // "Plan Pro Mensual"
  description: string;
  price: number; // en USD (para referencia)
  price_usdt: number; // Monto exacto en USDT a cobrar
  duration_days: 30 | 365;
  features: string[]; // ['trader_master', 'signals_hub_limited']
  monthly_credits: number; // Créditos que otorga al mes
}

// Interfaz para un Paquete de Créditos
interface CreditPackage {
  package_id: string; // e.g., 'credits_500'
  name: string; // "Paquete de 500 Créditos"
  description: string;
  credits_amount: number;
  price_usdt: number;
}

// Interfaz para una Compra
interface Purchase {
  purchase_id: string;
  user_id: string;
  product_type: 'plan' | 'credits';
  product_id: string; // plan_id o package_id
  amount_usdt: number;
  payment_address: string; // Dirección a la que se debe enviar el pago
  tx_hash?: string; // Hash de la transacción de blockchain
  status: 'pending' | 'completed' | 'failed' | 'expired';
  created_at: number; // Timestamp
  completed_at?: number; // Timestamp
}

// Estado del usuario relacionado con la tienda
interface UserStoreProfile {
  user_id: string;
  active_plan_id?: string;
  subscription_expires_at?: number; // Timestamp
  credit_balance: number;
  access_features: string[]; // ['watchlist', 'risk_guard_basic', 'trader_master']
}
```

---

## Análisis Crítico Post-Revisión del HTML

### ✅ Elementos Implementados en la UI
- **Estructura de planes** con cards de comparación (Free, Pro, Elite)
- **Sistema de créditos** con paquetes de compra
- **Diseño responsive** con adaptación móvil
- **Botones de acción** para seleccionar planes y comprar créditos
- **Comparativa de características** entre planes
- **Sección de método de pago** con información de USDT

### ⚠️ Problemas Críticos Identificados en la Implementación

#### 1. **Implementación Estática vs Documentación Dinámica**
- La documentación describe un sistema complejo con validaciones dinámicas
- El HTML solo muestra cards estáticas sin funcionalidad real
- **Impacto**: Sistema de monetización completamente inoperativo
- **Solución**: Desarrollar backend completo con lógica de negocio

#### 2. **Sin Sistema de Procesamiento de Pagos**
- No hay integración con blockchain o procesamiento USDT
- Sin generación de direcciones únicas de pago
- **Impacto**: Imposible realizar compras reales
- **Solución**: Implementar listeners de blockchain y wallets

#### 3. **Falta de Sistema de Créditos Funcional**
- Los créditos son solo elementos visuales sin backend
- Sin validación de rangos de precios para tipsters
- **Impacto**: Sistema de créditos inexistente para usuarios
- **Solución**: Desarrollar sistema completo de gestión de créditos

#### 4. **Sin Gestión de Suscripciones**
- No hay control de expiración de planes
- Sin renovación automática o notificaciones
- **Impacto**: Usuarios no pueden mantener suscripciones activas
- **Solución**: Implementar sistema de billing y renovaciones

### 🔧 Bugs de Alineación Visual en el HTML

#### 1. **Cards de Planes Desalineadas**
- Las cards no mantienen altura consistente
- Características no están alineadas verticalmente
- **Solución**: Implementar CSS grid con alturas uniformes

#### 2. **Tabla de Comparativa Problemática**
- La tabla de comparación se desborda en móviles
- Sin versión colapsada para pantallas pequeñas
- **Solución**: Implementar comparadora responsive

#### 3. **Problemas de Jerarquía Visual**
- Los precios no destacan adecuadamente
- CTAs no tienen suficiente prominencia visual
- **Solución**: Rediseñar jerarquía visual de precios y botones

### 🚨 Problemas de Seguridad en la Implementación

#### 1. **Sin Protección de Precios**
- Los precios están expuestos en HTML sin validación
- Sin protección contra manipulación de precios
- **Impacto**: Vulnerable a cambios de precios por usuarios

#### 2. **Falta de Validación de Compras**
- Sin verificación de pagos completados
- Sin protección contra doble gasto
- **Impacto**: Posible fraude en compras

#### 3. **Exposición de Métodos de Pago**
- Información de wallets sin encriptación
- Sin ofuscación de direcciones de pago
- **Impacto**: Seguridad financiera comprometida

### 📊 Brecha Documentación vs Implementación

| Característica | Documentación | HTML Implementado | Estado |
|----------------|---------------|-------------------|---------|
| Procesamiento USDT | ✅ Blockchain | ❌ Solo texto | CRÍTICO |
| Sistema de Créditos | ✅ Complejo | ❌ Estático | CRÍTICO |
| Gestión de Suscripciones | ✅ Automática | ❌ No existe | CRÍTICO |
| Validación de Precios | ✅ Dinámica | ❌ Estática | ALTO |
| Historial de Compras | ✅ Completo | ❌ No existe | ALTO |
| Promociones/Cupones | ✅ Flexibles | ❌ No existe | MEDIO |

### 🔍 Recomendaciones Prioritarias

1. **CRÍTICO**: Implementar procesamiento de pagos blockchain
2. **CRÍTICO**: Desarrollar sistema completo de créditos
3. **CRÍTICO**: Crear gestión de suscripciones con expiración
4. **ALTO**: Implementar validación de precios dinámica
5. **ALTO**: Desarrollar historial de transacciones

### 📋 Estado General de Implementación: 2/10
- **Diseño visual**: Aceptable (6/10)
- **Funcionalidad documentada**: Excelente (9/10)
- **Funcionalidad implementada**: Muy pobre (1/10)
- **Seguridad financiera**: Muy deficiente (2/10)
- **Sistema de pagos**: No existe (0/10)

**Conclusión**: El módulo Store tiene una excelente documentación técnica que describe un sistema de monetización sofisticado, pero la implementación HTML es solo un mockup visual sin funcionalidad real. Es esencialmente un catálogo estático que necesita desarrollo completo de backend, integración blockchain, y sistemas de billing para ser funcional.
```
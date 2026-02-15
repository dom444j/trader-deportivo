# 🔐 Documentación de Autenticación - Trader Deportivo

## 📋 Resumen de Sistema de Autenticación

Este documento describe el sistema de autenticación implementado en Trader Deportivo, siguiendo la estructura definida en `estructura-definitiva.md`.

## 🎯 Principios de Diseño

### 1. Separación por Roles
- **ADMIN**: Acceso completo al panel administrativo
- **TIPSTER**: Acceso al panel de tipsters
- **USER**: Acceso al panel de usuarios

### 2. Rutas de Autenticación
- `/login` → Login unificado para usuarios y tipsters
- `/admin/login` → Login exclusivo para administradores
- `/register` → Registro de nuevos usuarios
- `/forgot-password` → Recuperación de contraseña

### 3. Protección de Rutas
El middleware (`src/middleware.ts`) protege las siguientes rutas:
- `/admin/*` → Requiere rol ADMIN
- `/tipster/*` → Requiere rol TIPSTER
- `/user/*` → Requiere rol USER
- `/dashboard` → Redirige según el rol del usuario

## 🔧 Implementación Técnica

### Archivos Clave

#### 1. Middleware de Autenticación
**Archivo:** `src/middleware.ts`
- Verifica sesión válida
- Valida roles de usuario
- Redirige según permisos
- Maneja rutas protegidas

#### 2. Servicio de Autenticación
**Archivo:** `src/lib/auth/auth.ts`
- Funciones de login/logout
- Gestión de sesiones
- Validación de credenciales
- DEMO_USERS para desarrollo

#### 3. Layout de Dashboard
**Archivo:** `src/app/(dashboard)/layout.tsx`
- Protege todas las rutas del dashboard
- Verifica sesión en el servidor
- Redirige a login si no hay sesión

### Credenciales de Demo

#### Admin
- Email: `admin@traderdeportivo.co`
- Contraseña: `Admin123!`
- Rol: `ADMIN`

#### Tipster
- Email: `tipster.pro@traderdeportivo.co`
- Contraseña: `Tipster123!`
- Rol: `TIPSTER`

#### Usuario
- Email: `usuario.demo@traderdeportivo.co`
- Contraseña: `User123!`
- Rol: `USER`

## 🔄 Flujo de Autenticación

### 1. Login de Usuario/Tipster
1. Usuario accede a `/login`
2. Ingresa credenciales y selecciona rol
3. Sistema valida en `/api/auth/login`
4. Se crea sesión y cookie
5. Redirige según rol:
   - USER → `/user`
   - TIPSTER → `/tipster`
   - ADMIN → `/admin`

### 2. Login de Admin
1. Admin accede a `/admin/login`
2. Ingresa credenciales de administrador
3. Sistema valida en `/api/auth/login`
4. Se crea sesión y cookie
5. Redirige a `/admin`

### 3. Protección de Rutas
1. Usuario intenta acceder a ruta protegida
2. Middleware verifica sesión
3. Si no hay sesión → redirige a `/login`
4. Si hay sesión pero rol incorrecto → redirige a `/login`
5. Si hay sesión y rol correcto → permite acceso

## 🛡️ Seguridad

### Medidas Implementadas
- Validación de sesión en servidor
- Cookies seguras con httpOnly
- Redirecciones seguras
- Validación de roles en múltiples capas
- Protección de rutas por middleware

### Mejores Prácticas
- Nunca exponer credenciales en cliente
- Siempre validar en servidor
- Usar HTTPS en producción
- Implementar rate limiting
- Validar entrada de usuario

## 🚨 Solución de Problemas Comunes

### Error: "Route not found" en /admin
**Causa:** Conflicto entre rutas duplicadas
**Solución:** Verificar que solo exista una carpeta `/admin` en `(dashboard)`

### Error: "Middleware error"
**Causa:** Función middleware no exportada correctamente
**Solución:** Asegurar que `middleware.ts` exporte la función `middleware`

### Error: "Session not found"
**Causa:** Cookie de sesión no establecida
**Solución:** Verificar que el login esté creando correctamente la cookie

### Error: Redirección infinita
**Causa:** Loop en middleware o layout
**Solución:** Verificar lógica de redirección en `middleware.ts` y layouts

## 📁 Estructura de Archivos de Autenticación

```
src/
├── middleware.ts                 # Protección de rutas
├── lib/
│   └── auth/
│       └── auth.ts              # Lógica de autenticación
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx         # Login usuario/tipster
│   │   ├── admin/
│   │   │   └── login/
│   │   │       └── page.tsx     # Login admin
│   │   └── layout.tsx           # Layout auth
│   ├── (dashboard)/
│   │   ├── layout.tsx           # Protección dashboard
│   │   ├── admin/
│   │   │   └── page.tsx         # Dashboard admin
│   │   ├── tipster/
│   │   │   └── page.tsx         # Dashboard tipster
│   │   └── user/
│   │       └── page.tsx         # Dashboard user
│   └── api/
│       └── auth/
│           └── login/
│               └── route.ts     # API login
```

## 🔍 Verificación de Funcionamiento

### Para verificar el sistema:
1. **Test de Login**: Intentar login con cada rol
2. **Test de Protección**: Acceder a rutas protegidas sin sesión
3. **Test de Redirección**: Verificar redirecciones correctas
4. **Test de Sesión**: Comprobar persistencia de sesión
5. **Test de Logout**: Verificar cierre correcto de sesión

## 📝 Notas de Desarrollo

- El sistema usa DEMO_USERS para desarrollo
- En producción, conectar con base de datos real
- Implementar refresh tokens para mejor seguridad
- Considerar implementación de 2FA para admins
- Monitorear intentos de login fallidos

---

**Última actualización:** Según estructura-definitiva.md
**Versión:** 1.0.0
**Estado:** ✅ Funcional en desarrollo
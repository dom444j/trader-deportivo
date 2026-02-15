# Contrato de Navegación (Opcional) – traderdeportivo.co

Objetivo: Definir el contrato de menú (NavItem) y badges/visibilidad por permisos para los tres roles.

## Tipo compartido
```ts
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  permission?: PermissionScope | PermissionScope[];
}
```

## Reglas
- Los menús se construyen desde archivos por rol (apps/web/src/navigation/*Nav.ts)
- Los ítems pueden requerir uno o varios PermissionScope; si no cumple, se ocultan
- Badges de estado (p.ej., créditos disponibles, alertas activas) se renderizan por componente, no forman parte del contrato
- Pages Router: cada ruta debe existir como page o placeholder

## Implementación
- Tipos compartidos en packages/shared/types/{roles.ts, permissions.ts, navigation.ts}
- Menús por rol: userNav, tipsterNav, adminNav
- Middleware de permisos (frontend) valida scopes y role; server-side se revalida con RBAC del backend
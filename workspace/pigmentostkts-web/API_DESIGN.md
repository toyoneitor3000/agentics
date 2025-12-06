# Diseño de API & Backend Strategy

## Arquitectura: Server Actions (Next.js 14)
Utilizaremos **Server Actions** como capa de API principal. Esto elimina la necesidad de crear endpoints REST tradicionales para la mayoría de las interacciones internas de la app, ofreciendo type-safety directo entre frontend y backend.

## Estructura de Acciones
Las acciones se agruparán por dominio en `src/actions/`:

- `src/actions/auth.ts`: Login, Registro, Logout (Integration w/ Supabase Auth).
- `src/actions/events.ts`: Listar eventos, Detalles, Crear evento (Admin).
- `src/actions/orders.ts`: Crear intención de compra, Confirmar pago.
- `src/actions/tickets.ts`: Obtener mis tickets, Validar QR (Scanner).

## Contratos de API (Examples)

### 1. Fetch Events (Public)
```typescript
// src/actions/events.ts
export async function getEvents(page: number = 1, limit: number = 10): Promise<ApiResponse<Event[]>>
```

### 2. Purchase Ticket (Protected)
```typescript
// src/actions/orders.ts
export async function createOrder(eventId: string, quantity: number): Promise<ApiResponse<{ orderId: string, checkoutUrl: string }>>
```

## Manejo de Errores
Todas las acciones retornarán un objeto estandarizado:
```typescript
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

## Seguridad
- **Autenticación**: Middleware de Next.js validando sesión de Supabase.
- **Autorización**: Validación de Roles (RBAC) dentro de cada Server Action sensible.
- **Validación de Datos**: Zod para validar inputs antes de procesar.

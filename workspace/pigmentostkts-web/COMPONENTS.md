# Librería de Componentes PigmentosTkts

## Estándares de Desarrollo

### 1. Atomic Design Simplificado
Organizamos los componentes en:
- **UI (Atoms)**: Componentes base agnósticos (`/src/components/ui`). Ej: `Button`, `Input`, `Card`.
- **Components (Molecules/Organisms)**: Componentes de negocio (`/src/components`). Ej: `EventCard`, `TicketSelector`.

### 2. Naming Convention
- **Archivos**: `kebab-case.tsx` (ej: `event-card.tsx`, `button.tsx`).
- **Componentes**: `PascalCase` (ej: `EventCard`, `Button`).
- **Props**: Interfaces exportadas como `{NombreComponente}Props`.

## Catálogo de Componentes Base (UI)

### Button
Botón versátil con soporte para variantes y tamaños.
```tsx
<Button variant="default" size="lg">Comprar Ticket</Button>
<Button variant="outline">Ver Detalles</Button>
```

### Input
Campo de texto estilizado.
```tsx
<Input placeholder="Ingresa tu email" type="email" />
```

### Card
Contenedor flexible para agrupar contenido.
```tsx
<Card>
  <CardHeader>
    <CardTitle>Nombre del Evento</CardTitle>
    <CardDescription>Fecha y Lugar</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Detalles del evento...</p>
  </CardContent>
  <CardFooter>
    <Button>Comprar</Button>
  </CardFooter>
</Card>
```

# Estrategia de Calidad (QA): PigmentosTkts

## 1. Visión de Calidad
Para una plataforma de ticketing, la **integridad transaccional** es innegociable. Un error en la venta (cobrar sin ticket o dar ticket sin cobro) es catastrófico. La estrategia se centra en prevenir estos escenarios críticos.

## 2. Niveles de Pruebas (Testing Pyramid)

### 2.1. Unit Testing (Jest + React Testing Library)
- **Objetivo**: Validar lógica aislada y renderizado de componentes.
- **Cobertura**: >80% en componentes de UI (`/src/components`) y utilidades (`/src/lib`).
- **Prioridad**: Componentes atómicos (`Button`, `Input`) y componentes de negocio (`EventCard`).

### 2.2. Integration Testing (Jest / Vitest)
- **Objetivo**: Validar flujos de datos entre Server Actions y Componentes.
- **Foco**: 
  - Flujo de autenticación.
  - Carga de listas de eventos.
  - Validación de formularios de compra.

### 2.3. End-to-End (E2E) (Playwright - Fase 2)
- **Objetivo**: Simular el usuario real en un navegador.
- **Escenarios Críticos**:
  1. Usuario visita Home -> Selecciona Evento -> Login -> Compra Exitosa.
  2. Usuario intenta comprar evento agotado -> Mensaje de error.

## 3. Matriz de Riesgos

| Funcionalidad | Riesgo | Estrategia de Prueba |
|---|---|---|
| **Procesamiento de Pagos** | Crítico 🔴 | Integration Tests con Mocks de Stripe + E2E en Staging |
| **Asignación de Asientos** | Crítico 🔴 | Unit Tests exhaustivos en lógica de backend (concurrencia) |
| **Visualización de Eventos** | Medio 🟡 | Snapshot Testing (Visual Regression) |
| **Login/Registro** | Alto 🟠 | E2E Tests (Happy path & Error handling) |

## 4. Herramientas
- **Runner**: Jest
- **Environment**: JSDOM
- **Assertions**: Testing Library
- **CI/CD**: Github Actions (Test on PR)

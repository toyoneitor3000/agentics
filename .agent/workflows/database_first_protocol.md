---
description: Protocolo estricto de desarrollo para evitar errores de base de datos.
---

# PROTOCOLO: BASE DE DATOS PRIMERO (DATABASE FIRST)

Para evitar errores de ejecución en la interfaz de usuario, se debe seguir ESTRICTAMENTE este orden en cualquier implementación de nueva funcionalidad:

1.  **VERIFICACIÓN DE DATOS (Check Data):**
    -   Antes de escribir código UI (React/Next.js) o Acciones de Servidor, revisar si la tabla y columnas necesarias existen en la base de datos Supabase.
    -   No asumir que existen. Verificar.

2.  **MIGRACIÓN PRIMERO (Migration First):**
    -   Si falta algo, crear un archivo de migración SQL en `supabase/migrations`.
    -   Nombre descriptivo: `YYYYMMDD_feature_name.sql`.
    -   Incluir la configuración de RLS (Row Level Security) explícita.
    -   Ejecutar la migración y VALIDAR que fue exitosa.

3.  **LÓGICA DE SERVIDOR (Server Actions):**
    -   Implementar las funciones en `app/actions` solo después de que la BD esté lista.
    -   Manejar errores de tipo `try/catch` para capturar fallos de SQL sin "romper" la UI.

4.  **INTERFAZ DE USUARIO (UI/UX):**
    -   Solo al final, conectar los botones y formularios a las server actions.
    -   Si la funcionalidad depende de un dato que podría no estar, validar antes de renderizar.

**REGLA DE ORO:** Nunca conectar una UI a una tabla que no has confirmado que existe y es accesible (RLS).

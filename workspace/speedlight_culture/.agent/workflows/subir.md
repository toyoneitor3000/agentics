---
description: Realiza un commit detallado, hace push a GitHub y despliega a producción.
---

// turbo-all


1. Analiza los cambios pendientes utilizando `git status` y `git diff`.
2. Añade todos los cambios al stage:
   ```bash
   git add .
   ```
3. Genera un mensaje de commit en **español** que sea **exhaustivo y detallado**.
   - El título debe ser claro y conciso.
   - El cuerpo del mensaje debe listar los cambios técnicos específicos.
   - Explica el propósito de los cambios (el "por qué").
   - Utiliza formato de lista `*` para múltiples cambios.
   
   Ejemplo del comando final que deberías generar (pero con el mensaje real):
   ```bash
   git commit -m "Título del cambio: Refactorización de X" -m "* Se actualizó el archivo Y para mejorar el rendimiento.
   * Se corrigió el bug en Z que causaba un crash."
   ```
4. Sube los cambios a GitHub (asegúrate de estar en la rama correcta, por defecto `main`):
   ```bash
   git push origin main
   ```
5. Ejecuta el comando de despliegue para procesar todo localmente y subirlo a producción:
   ```bash
   npm run deploy
   ```

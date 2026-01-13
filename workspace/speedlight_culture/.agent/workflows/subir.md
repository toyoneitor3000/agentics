---
description: Realiza un commit detallado, hace push a GitHub y despliega a producción.
---

1. Analiza los cambios pendientes utilizando `git status` y `git diff`.
2. Añade todos los cambios al stage:
   ```bash
   git add .
   ```
3. Genera un mensaje de commit **detallado** y **descriptivo** que explique los cambios realizados y ejecuta el commit.
   ```bash
   git commit -m "Mensaje detallado generado..."
   ```
4. Sube los cambios a GitHub (asegúrate de estar en la rama correcta, por defecto `main`):
   ```bash
   git push origin main
   ```
5. Ejecuta el comando de despliegue para procesar todo localmente y subirlo a producción:
   ```bash
   npm run deploy
   ```

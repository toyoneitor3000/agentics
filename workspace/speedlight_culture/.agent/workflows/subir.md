---
description: Realiza un commit detallado, hace push a GitHub y despliega a producción.
---

// turbo-all


1. Analiza los cambios pendientes utilizando `git status` y `git diff`.
2. Añade todos los cambios al stage:
   ```bash
   git add .
   ```
3. Genera un mensaje de commit en **ESPAÑOL** que sea **extremadamente detallado y explicativo para el usuario**.
   - **IMPORTANTE**: Todo el texto debe estar en español.
   - El título debe ser descriptivo pero conciso.
   - El cuerpo del mensaje debe explicar **exactamente qué se hizo** y **por qué**, pensando en comunicar el valor al usuario final o al desarrollador.
   - No seas genérico. En lugar de "ajustes de UI", di "se cambió el color de fondo a negro (#000) para mejorar el contraste".
   - Lista los cambios técnicos específicos usando viñetas `*`.
   
   Ejemplo del comando final que deberías generar (pero con el contenido real de TUS cambios):
   ```bash
   git commit -m "Implementación de la nueva vista de galería en el dashboard" -m "* Se creó el componente GalleryView para visualizar imágenes en cuadrícula.
   * Se añadió lógica de paginación para manejar grandes volúmenes de datos.
   * Se corrigió un error de estilo en el botón de 'Cargar más' que impedía hacer clic en dispositivos móviles."
   ```
4. Sube los cambios a GitHub (asegúrate de estar en la rama correcta, por defecto `main`):
   ```bash
   git push origin main
   ```
5. Ejecuta el comando de despliegue para procesar todo localmente y subirlo a producción:
   ```bash
   npm run deploy
   ```

# 🌐 Integración Navegador + GitHub + Vercel

Guía operativa para usar `@purrpurragent` desde el navegador y conectarlo con los repositorios de GitHub y los despliegues de Vercel.

---

## 1. Prerrequisitos

- Python 3.10+, Google ADK y las dependencias del proyecto instaladas.
- Git configurado localmente.
- Node.js + Vercel CLI (`npm install -g vercel`).
- Acceso al dashboard de GitHub y Vercel para generar tokens.

---

## 2. Servir el agente en el navegador

1. Activa tu entorno virtual y levanta ADK:
   ```bash
   cd "/Users/camilotoloza/Library/CloudStorage/GoogleDrive-camilotoloza1136@gmail.com/My Drive/PURPUR/purpur-landing-page"
   source .venv/bin/activate
   ./start_adk.sh
   ```
2. Abre `http://127.0.0.1:8000` en tu navegador.
3. ¿Quieres compartirlo en tu red local? Ejecuta manualmente:
   ```bash
   ADK_HOST=0.0.0.0 ADK_PORT=8000 adk web purrpurragent/
   ```
   > Expone el servidor a tu LAN (protégete detrás de VPN/Tunnel si necesitas acceso público).

---

## 3. Variables de entorno comunes

1. Crea un archivo `.env` en la raíz del repositorio (usa `.gitignore` para no subirlo).
2. Copia y completa esta plantilla:
   ```bash
   ADK_HOST=127.0.0.1
   ADK_PORT=8000

   GIT_USER_NAME="Camilo Toloza"
   GIT_USER_EMAIL=cto@purrpur.com
   GITHUB_REPO=https://github.com/<usuario>/purpur-landing-page.git
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

   VERCEL_TOKEN=
   VERCEL_ORG_ID=
   VERCEL_PROJECT_ID=
   VERCEL_SCOPE=personal   # o slug del equipo
   VERCEL_DEPLOY_PATH=.    # usa p.ej. purrpurr_web si quieres desplegar esa app
   ```
3. Exporta las variables antes de arrancar ADK:
   ```bash
   set -a; source .env; set +a
   ```

---

## 4. Integración con GitHub

1. **Token**  
   - Genera un PAT classic con scopes `repo`, `workflow`, `read:org`.
   - Guarda el valor en `GITHUB_TOKEN`.
2. **Configuración de git**  
   ```bash
   git config user.name  "$GIT_USER_NAME"
   git config user.email "$GIT_USER_EMAIL"
   git remote add origin "$GITHUB_REPO"   # si aún no existe
   ```
3. **Autenticación**  
   - HTTPS: usa el token como contraseña la primera vez (se cachea en el llavero).
   - SSH: agrega tu clave a `ssh-agent` y usa la URL `git@github.com:...`.
4. **Uso desde el agente**  
   - `command_runner` ahora admite `git push`, `git pull`, `git remote`, `git clone`, etc.
   - Ejemplo (desde la UI de ADK):
     ```
     Ejecuta `git push origin main` dentro de /Users/.../purpur-landing-page
     ```

---

## 5. Integración con Vercel

1. **Instala y loguéate**  
   ```bash
   npm install -g vercel
   vercel login
   ```
2. **Obtén IDs**  
   - Dashboard → Settings → General → copia `ORG_ID` y `PROJECT_ID`.
   - Genera `VERCEL_TOKEN` en `https://vercel.com/account/tokens`.
3. **Define la ruta a desplegar**  
   - Usa `VERCEL_DEPLOY_PATH=.` para la landing principal.
   - Usa `VERCEL_DEPLOY_PATH=purrpurr_web` si la interfaz está ahí.
4. **Prueba manual**  
   ```bash
   VERCEL_TOKEN=xxx \
   VERCEL_ORG_ID=org_abc \
   VERCEL_PROJECT_ID=prj_123 \
   VERCEL_SCOPE=personal \
   vercel deploy --yes --prod ./purrpurr_web
   ```
5. **Uso desde el agente**  
   - `vercel_deploy_trigger` detecta automáticamente la CLI + variables.
   - Con credenciales configuradas ejecuta el deploy real y devuelve la URL de `*.vercel.app`.
   - Si falta algo, responde en modo simulación indicando qué variable instalar.

---

## 6. Flujo recomendado end-to-end

1. Levanta ADK (`./start_adk.sh`) y abre la UI web.
2. Desde la UI solicita:
   - Lectura/edición de archivos (`read_files`, `write_files`).
   - `command_runner("git status")`, `command_runner("git push origin main")`.
   - `vercel_deploy_trigger(project_path="purrpurr_web", production=false)`.
3. Valida en GitHub el commit generado y en Vercel la build asociada.

---

## 7. Troubleshooting rápido

| Problema | Causa común | Solución |
|----------|-------------|----------|
| `vercel_deploy_trigger` responde en simulación | Falta CLI o variables | Sigue la sección 5 para completar `VERCEL_*`. |
| `git push` fallando en command_runner | Token/SSH no autorizado | Repite la autenticación desde terminal y vuelve a intentar. |
| No puedo acceder al agente fuera de mi máquina | ADK solo escucha en `127.0.0.1` | Inicia con `ADK_HOST=0.0.0.0` y usa un túnel/VPN seguro. |
| Despliegue toma otro directorio | `VERCEL_DEPLOY_PATH` apunta a ruta inválida | Ajusta el valor o elimina la variable para usar `project_path`. |

--- 

Con estos pasos el agente queda listo para operar 100% desde el navegador, versionar en GitHub y ejecutar despliegues reales en Vercel sin intervención manual. 🚀


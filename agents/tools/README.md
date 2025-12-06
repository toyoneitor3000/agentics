# Purrpur Agent Tools

Este directorio contiene todas las herramientas ejecutables que los agentes pueden invocar para realizar acciones reales en el mundo físico (comandos, deploys, scaffolding, etc.).

## 📦 Módulos Disponibles

### 1. `command_tools.py`
**Motor de ejecución de comandos con seguridad.**

- `command_runner(command, working_dir)`: Ejecuta comandos de terminal con whitelist de seguridad.
  - ✅ Permitidos: npm, npx, git (`status`, `log`, `diff`, `add`, `commit`, `push`, `pull`, `remote`, `clone`, `checkout`, `branch`, `switch`), ls, mkdir, vercel
  - ⛔ Bloqueados: rm, sudo, curl arbitrarios, etc.
  - ⏱️ Timeout: 120 segundos

**Ejemplo de uso:**
```python
result = command_runner("npm install", working_dir="./mi-proyecto")
# Returns: {"status": "success", "output": "...", "error": ""}
```

### 2. `deploy_tools.py`
**Herramientas de despliegue con Human-in-the-Loop (HITL).**

- `request_deploy_approval(environment, summary, changes)`: Solicita aprobación antes de deploy crítico.
- `vercel_deploy_trigger(project_path, approval_token, production)`: Despliega a Vercel (CLI real si está configurada, modo simulación si no).
- `infra_preview(terraform_plan)`: Muestra preview de cambios IaC sin aplicarlos.

**Flujo HITL:**
```python
# 1. Agente solicita aprobación
approval = request_deploy_approval("production", "Deploy v2.1.0")

# 2. Sistema espera confirmación humana (simulado en dev)

# 3. Con token, se ejecuta el deploy
result = vercel_deploy_trigger("./proyecto", approval["token"], production=True)
```

**Credenciales Vercel**

- Instala la CLI (`npm install -g vercel`) y ejecuta `vercel login`.
- Define en tu `.env`: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_SCOPE` (o `VERCEL_TEAM`).
- Si quieres desplegar otra carpeta (ej. `purrpurr_web`), agrega `VERCEL_DEPLOY_PATH`.
- Sin estas variables, `vercel_deploy_trigger` entra en modo simulación y te indica qué falta.

### 3. `repo_tools.py`
**Operaciones seguras de lectura/escritura en archivos.**

- `read_files(file_paths, base_dir)`: Lee múltiples archivos con validación de path traversal.
- `write_files(file_operations, base_dir)`: Escribe/actualiza archivos con seguridad.
- `search_files(pattern, base_dir, max_results)`: Busca archivos por patrón glob.

**Seguridad:** Todas las operaciones validan que las rutas estén dentro del `base_dir` para prevenir path traversal attacks.

### 4. `scaffold_tools.py`
**Generadores de boilerplate para frameworks comunes.**

- `next_scaffolder(project_name, typescript, tailwind, app_router)`: Prepara comando para crear proyecto Next.js.
- `auth_module_generator(project_path, auth_provider, providers)`: Genera módulo de autenticación (NextAuth, Clerk, Firebase).

**Ejemplo:**
```python
# 1. Preparar scaffold
scaffold = next_scaffolder("financars", typescript=True, tailwind=True)

# 2. Ejecutar con command_runner
result = command_runner(scaffold["command"], base_dir="./")

# 3. Agregar autenticación
auth = auth_module_generator("./financars", auth_provider="nextauth", providers=["google", "github"])
```

### 5. `design_tools.py`
**Sincronización de design tokens y assets de marca.**

- `design_tokens_sync(design_system_path, output_path, format)`: Convierte design system a código (TS/CSS/Tailwind).
- `brand_library_lookup(asset_type, base_dir)`: Busca logos, colores, tipografías en docs.

**Formatos soportados:**
- `typescript`: Genera `tokens.ts` con tipos.
- `css`: Genera CSS custom properties (`:root { --color-primary: ... }`).
- `tailwind`: Genera `tailwind.config.ts` extendido.

## 🔒 Principios de Seguridad

1. **Whitelist estricta**: Solo comandos pre-aprobados pueden ejecutarse.
2. **Path validation**: Previene path traversal (ej: `../../etc/passwd`).
3. **Timeouts**: Comandos se matan después de 120s para evitar bloqueos.
4. **HITL para producción**: Deploys críticos requieren aprobación humana explícita.
5. **Logging**: Todas las operaciones se registran para auditoría.

## 🔧 Cómo Agregar un Nuevo Tool

1. Crea la función en el archivo correspondiente (o crea uno nuevo).
2. Decora con `@tool` si usas el decorador de ADK, o simplemente define la función.
3. Agrega la función a `__init__.py` en la lista `__all__`.
4. Referencia el tool en el YAML del agente:

```yaml
tools:
  - name: command_runner
    python_function: purrpurragent.tools.command_tools.command_runner
```

## 📊 Testing

Para probar un tool de forma aislada:

```python
from purrpurragent.tools.command_tools import command_runner

result = command_runner("npm --version", working_dir="./")
print(result)
```

## 🚀 Roadmap

- [ ] Agregar `docker_tools.py` para builds containerizados
- [ ] Implementar `analytics_tools.py` para leer métricas de GA4/Looker
- [ ] Crear `content_tools.py` para generación de templates de copy
- [ ] Integrar `browser_preview_tool` para testing visual automatizado


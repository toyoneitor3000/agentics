"""
Project scaffolding tools.

Generates boilerplate code and project structures for common
frameworks and authentication patterns.
"""

from typing import Dict, Any
import os
from pathlib import Path


def get_project_root() -> Path:
    """Returns the workspace/projects/ directory for organized project creation."""
    # tools/scaffold_tools.py -> purrpurragent/ -> workspace/projects/
    purrpur_root = Path(__file__).parent.parent.resolve()
    workspace_projects = purrpur_root / "workspace" / "projects"
    workspace_projects.mkdir(parents=True, exist_ok=True)
    return workspace_projects


def next_scaffolder(
    project_name: str,
    base_dir: str = None,
    typescript: bool = True,
    tailwind: bool = True,
    app_router: bool = True
) -> Dict[str, Any]:
    """
    Genera la estructura base de un proyecto Next.js.
    
    Args:
        project_name: Nombre del proyecto.
        base_dir: Directorio donde crear el proyecto.
        typescript: Si True, usa TypeScript.
        tailwind: Si True, incluye Tailwind CSS.
        app_router: Si True, usa App Router (Next.js 13+).
        
    Returns:
        Dict con el resultado de la operación.
    """
    try:
        if base_dir is None:
            project_path = get_project_root() / project_name
        else:
            project_path = Path(base_dir) / project_name
        
        if project_path.exists():
            return {
                "status": "error",
                "path": None,
                "error": f"❌ El proyecto '{project_name}' ya existe en {base_dir}."
            }
        
        # Build command
        cmd_parts = ["npx", "create-next-app@latest", project_name]
        
        if typescript:
            cmd_parts.append("--typescript")
        if tailwind:
            cmd_parts.append("--tailwind")
        if app_router:
            cmd_parts.append("--app")
        
        cmd_parts.append("--yes")  # Non-interactive
        
        command = " ".join(cmd_parts)
        
        return {
            "status": "ready",
            "path": str(project_path),
            "command": command,
            "message": f"✅ Comando preparado. Usa 'command_runner' para ejecutar:\n{command}"
        }
    
    except Exception as e:
        return {
            "status": "error",
            "path": None,
            "error": f"Error preparando scaffold: {str(e)}"
        }



def auth_module_generator(
    project_path: str,
    auth_provider: str = "nextauth",
    providers: list = None
) -> Dict[str, Any]:
    """
    Genera el módulo de autenticación para un proyecto.
    
    Args:
        project_path: Ruta al proyecto donde agregar auth.
        auth_provider: 'nextauth', 'clerk', 'firebase', 'supabase'.
        providers: Lista de providers OAuth (ej: ['google', 'github']).
        
    Returns:
        Dict con archivos generados y pasos siguientes.
    """
    if providers is None:
        providers = ['google', 'github']
    
    try:
        project = Path(project_path)
        
        if not project.exists():
            return {
                "status": "error",
                "files": [],
                "error": f"❌ El proyecto '{project_path}' no existe."
            }
        
        files_to_create = []
        
        if auth_provider == "nextauth":
            # NextAuth.js structure
            auth_route = project / "app" / "api" / "auth" / "[...nextauth]" / "route.ts"
            files_to_create.append({
                "path": str(auth_route),
                "content": _generate_nextauth_route(providers)
            })
            
            middleware = project / "middleware.ts"
            files_to_create.append({
                "path": str(middleware),
                "content": _generate_nextauth_middleware()
            })
            
            install_cmd = "npm install next-auth"
            
        elif auth_provider == "clerk":
            install_cmd = "npm install @clerk/nextjs"
            files_to_create.append({
                "path": str(project / "middleware.ts"),
                "content": _generate_clerk_middleware()
            })
        
        else:
            return {
                "status": "error",
                "files": [],
                "error": f"❌ Provider '{auth_provider}' no soportado. Usa: nextauth, clerk, firebase, supabase."
            }
        
        return {
            "status": "success",
            "files": files_to_create,
            "install_command": install_cmd,
            "message": f"✅ Módulo de auth preparado. Ejecuta:\n1. {install_cmd}\n2. Usa 'write_files' para crear los archivos."
        }
    
    except Exception as e:
        return {
            "status": "error",
            "files": [],
            "error": f"Error generando auth module: {str(e)}"
        }


def _generate_nextauth_route(providers: list) -> str:
    """Genera el contenido del route handler de NextAuth."""
    providers_config = ",\n    ".join([
        f"{p.capitalize()}Provider({{ clientId: process.env.{p.upper()}_ID, clientSecret: process.env.{p.upper()}_SECRET }})"
        for p in providers
    ])
    
    return f"""import NextAuth from 'next-auth';
import {{ AuthOptions }} from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: AuthOptions = {{
  providers: [
    {providers_config}
  ],
  pages: {{
    signIn: '/auth/signin',
  }},
}};

const handler = NextAuth(authOptions);
export {{ handler as GET, handler as POST }};
"""


def _generate_nextauth_middleware() -> str:
    """Genera el middleware de NextAuth."""
    return """export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
};
"""


def _generate_clerk_middleware() -> str:
    """Genera el middleware de Clerk."""
    return """import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/', '/api/public'],
});

export const config = {
  matcher: ['/((?!.+\\\\.[\\\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
"""

from google.adk.tools import FunctionTool

next_scaffolder_tool = FunctionTool(next_scaffolder, require_confirmation=False)
auth_module_generator_tool = FunctionTool(auth_module_generator, require_confirmation=False)

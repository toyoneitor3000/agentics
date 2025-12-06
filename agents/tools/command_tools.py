"""
Command execution tools with security controls.

Provides controlled terminal command execution with whitelist validation
to prevent dangerous operations while enabling CI/CD workflows.
"""

import subprocess
import os
from typing import Dict, Any


# Security whitelist: Only these command prefixes are allowed
ALLOWED_PREFIXES = [
    "npm", "npx",  # Allow all npm/npx commands
    # Git operations (status + commit + remote)
    "git status", "git log", "git diff", "git add", "git commit",
    "git push", "git pull", "git fetch", "git remote", "git clone",
    "git checkout", "git switch", "git branch",
    "ls", "pwd", "echo", "mkdir", "cat", "head", "tail",
    "python -m venv", "pip install", "pip list",
    "vercel", "netlify",
    "sleep",  # Allow sleep for pauses
]


def get_project_root() -> str:
    """Returns the project root directory (2 levels up from this file)."""
    # tools/command_tools.py -> purrpurragent/ -> project_root/
    return str(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))


def command_runner(command: str, working_dir: str = None) -> Dict[str, Any]:
    """
    Ejecuta comandos de terminal permitidos en el directorio especificado.
    
    Security: Only commands starting with whitelisted prefixes are allowed.
    Timeout: Commands are killed after 300 seconds to prevent hanging.
    
    Args:
        command: El comando completo a ejecutar (ej: 'npm run dev').
        working_dir: Ruta relativa o absoluta donde ejecutar el comando (default: project root).
        
    Returns:
        Dict with 'status', 'output', and 'error' keys.
    """
    # 0. Resolve working directory
    if working_dir is None:
        working_dir = get_project_root()
    # 1. Security validation
    is_allowed = any(command.strip().startswith(prefix) for prefix in ALLOWED_PREFIXES)
    if not is_allowed:
        return {
            "status": "blocked",
            "output": "",
            "error": f"⛔ SECURITY BLOCK: El comando '{command}' no está en la lista blanca permitida."
        }

    # 2. Directory validation
    if not os.path.exists(working_dir):
        return {
            "status": "error",
            "output": "",
            "error": f"❌ Error: El directorio '{working_dir}' no existe."
        }

    try:
        # 3. Execution
        print(f"⚡ [CommandRunner] Ejecutando: {command} en {working_dir}")
        result = subprocess.run(
            command,
            shell=True,
            cwd=working_dir,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        if result.returncode == 0:
            return {
                "status": "success",
                "output": result.stdout,
                "error": ""
            }
        else:
            return {
                "status": "error",
                "output": result.stdout,
                "error": f"⚠️ Error (Code {result.returncode}):\n{result.stderr}"
            }

    except subprocess.TimeoutExpired:
        return {
            "status": "timeout",
            "output": "",
            "error": "❌ Error: El comando excedió el tiempo límite de 300 segundos."
        }
    except Exception as e:
        return {
            "status": "error",
            "output": "",
            "error": f"❌ System Error: {str(e)}"
        }

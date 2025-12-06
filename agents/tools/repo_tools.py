"""
Repository file manipulation tools.

Provides safe read/write/search operations on project files
with validation and error handling.
"""

import os
import fnmatch
from pathlib import Path
from typing import Dict, Any, List, Union
from google.adk.tools import FunctionTool

# Define a character limit for file reads to prevent token overflow
MAX_FILE_CHARS = 200000
TRUNCATE_CHARS = 10000

def get_project_root() -> Path:
    """Returns the project root directory (2 levels up from this file)."""
    # tools/repo_tools.py -> purrpurragent/ -> project_root/
    return Path(__file__).parent.parent.parent.resolve()


def read_files(file_paths: List[str], base_dir: str = None) -> Dict[str, Any]:
    """
    Lee uno o múltiples archivos del repositorio, con protección contra archivos grandes.
    
    Args:
        file_paths: Lista de rutas de archivos a leer.
        base_dir: Directorio base del proyecto (default: project root).
        
    Returns:
        Dict con el contenido de cada archivo o errores.
    """
    results = {}
    if base_dir is None:
        base_path = get_project_root()
    else:
        base_path = Path(base_dir).resolve()
    
    for file_path in file_paths:
        full_path = (base_path / file_path).resolve()
        
        # Security: prevent path traversal
        try:
            full_path.relative_to(base_path)
        except ValueError:
            results[file_path] = {
                "status": "error",
                "content": None,
                "error": "⛔ Security: Path traversal no permitido."
            }
            continue
        
        # Read file
        try:
            if not full_path.exists():
                results[file_path] = {
                    "status": "not_found",
                    "content": None,
                    "error": f"Archivo no encontrado: {file_path}"
                }
            elif full_path.is_dir():
                results[file_path] = {
                    "status": "error",
                    "content": None,
                    "error": f"Es un directorio, no un archivo: {file_path}"
                }
            else:
                # Check file size before reading
                file_size = full_path.stat().st_size
                if file_size > MAX_FILE_CHARS:
                    with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                        start = f.read(TRUNCATE_CHARS)
                        f.seek(file_size - TRUNCATE_CHARS)
                        end = f.read(TRUNCATE_CHARS)
                    content = (
                        f"ADVERTENCIA: Archivo truncado por exceder el límite de {MAX_FILE_CHARS} caracteres.\\n"
                        f"Mostrando los primeros y últimos {TRUNCATE_CHARS} caracteres.\\n\\n"
                        f"--- INICIO DEL ARCHIVO ---\\n{start}\\n\\n"
                        f"[... CONTENIDO OMITIDO ...]\\n\\n"
                        f"--- FIN DEL ARCHIVO ---\\n{end}"
                    )
                    results[file_path] = {
                        "status": "success_truncated",
                        "content": content,
                        "error": None
                    }
                else:
                    with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    results[file_path] = {
                        "status": "success",
                        "content": content,
                        "error": None
                    }
        except Exception as e:
            results[file_path] = {
                "status": "error",
                "content": None,
                "error": f"Error leyendo {file_path}: {str(e)}"
            }
    
    return results



def write_files(file_operations: str, base_dir: str = None) -> Dict[str, Any]:
    """
    Escribe o actualiza archivos en el repositorio.
    
    Args:
        file_operations: JSON string que representa una lista de operaciones.
                        Cada operación es un dict con 'path' y 'content'.
                        Ejemplo: '[{"path": "file.txt", "content": "..."}]'
        base_dir: Directorio base del proyecto (default: project root).
        
    Returns:
        Dict con el resultado de cada operación.
    """
    import json
    
    operations_list = []
    
    # Force string input to avoid complex Union schema issues
    if isinstance(file_operations, str):
        try:
            operations_list = json.loads(file_operations)
        except json.JSONDecodeError as e:
            return {
                "status": "error",
                "error": f"Error parseando JSON: {str(e)}"
            }
    elif isinstance(file_operations, list):
        # Fallback if somehow passed as list (e.g. internal call)
        operations_list = file_operations
    else:
        return {
            "status": "error",
            "error": "file_operations debe ser un JSON string."
        }

    if not isinstance(operations_list, list):
        return {
            "status": "error",
            "error": "file_operations debe ser una lista."
        }
    
    results = {}
    if base_dir is None:
        base_path = get_project_root()
    else:
        base_path = Path(base_dir).resolve()
    
    for operation in operations_list:
        file_path = operation.get('path')
        content = operation.get('content', '')
        
        if not file_path:
            results['invalid'] = {
                "status": "error",
                "error": "Operación sin 'path' especificado."
            }
            continue
        
        full_path = (base_path / file_path).resolve()
        
        # Security: prevent path traversal
        try:
            full_path.relative_to(base_path)
        except ValueError:
            results[file_path] = {
                "status": "error",
                "error": "⛔ Security: Path traversal no permitido."
            }
            continue
        
        # Write file
        try:
            # Create parent directories if needed
            full_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            results[file_path] = {
                "status": "success",
                "message": f"✅ Archivo escrito: {file_path}"
            }
        except Exception as e:
            results[file_path] = {
                "status": "error",
                "error": f"Error escribiendo {file_path}: {str(e)}"
            }
    
    return results

write_files_tool = FunctionTool(write_files, require_confirmation=False)

def search_files(pattern: str, base_dir: str = None, max_results: int = 50) -> List[str]:
    """
    Busca archivos que coincidan con un patrón glob.
    
    Args:
        pattern: Patrón glob (ej: '*.tsx', 'src/**/*.ts').
        base_dir: Directorio base para la búsqueda (default: project root).
        max_results: Máximo número de resultados a retornar.
        
    Returns:
        List con la lista de archivos encontrados.
    """
    try:
        if base_dir is None:
            base_path = get_project_root()
        else:
            base_path = Path(base_dir).resolve()
        results = [] # Renamed matches to results to align with the requested return
        
        # Walk directory tree
        for root, dirs, files in os.walk(base_path):
            # Skip common ignore patterns
            dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '.next', 'dist', 'build', '__pycache__']]
            
            for filename in files:
                if fnmatch.fnmatch(filename, pattern) or fnmatch.fnmatch(os.path.join(root, filename), pattern):
                    rel_path = os.path.relpath(os.path.join(root, filename), base_path)
                    results.append(rel_path) # Appended to results
                    
                    if len(results) >= max_results:
                        break
            
            if len(results) >= max_results:
                break
        
        return results # Directly return the list of matches
    
    except Exception as e:
        # In case of an error, return an empty list as per the new return type
        # Or, if error details are needed, the signature would need to be Dict[str, Any]
        # For now, assuming a simple list return on success/failure.
        return []

import sys
import os
from pathlib import Path

# Agregar el directorio actual al path
sys.path.insert(0, os.getcwd())

try:
    from purrpurragent.tools.repo_tools import list_directory, get_project_root
    
    print(f"Project Root: {get_project_root()}")
    
    # Ruta absoluta hardcodeada
    abs_path = "/Users/camilotoloza/Library/CloudStorage/GoogleDrive-camilotoloza1136@gmail.com/My Drive/PURPUR/purpur-landing-page/PURRPURR-2/PURRPURRAGENT/workspace"
    
    print(f"Testing absolute path: {abs_path}")
    result = list_directory(abs_path)
    print(result)
    
except Exception as e:
    print(f"Error: {e}")

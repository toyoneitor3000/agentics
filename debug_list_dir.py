import sys
import os
from pathlib import Path

# Agregar el directorio actual al path para poder importar purrpurragent
sys.path.insert(0, os.getcwd())

try:
    from purrpurragent.tools.repo_tools import list_directory, get_project_root
    
    print(f"Current Working Directory: {os.getcwd()}")
    print(f"Project Root calculated: {get_project_root()}")
    
    print("\n--- Listing 'workspace' ---")
    result_workspace = list_directory("workspace")
    print(result_workspace)
    
    print("\n--- Listing '.' ---")
    result_dot = list_directory(".")
    print(result_dot)
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

import os
from googleapiclient.discovery import build
from dotenv import load_dotenv

# --- INICIO DE LA CORRECCIÓN ---
# Construye una ruta absoluta al archivo .env en la raíz del proyecto.
# Esto asegura que el .env se encuentre sin importar desde dónde se ejecute el script.
try:
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    dotenv_path = os.path.join(project_root, '.env')
    if os.path.exists(dotenv_path):
        load_dotenv(dotenv_path=dotenv_path)
        print("Archivo .env cargado correctamente.")
    else:
        print(f"ADVERTENCIA: No se encontró el archivo .env en la ruta: {dotenv_path}")
except Exception as e:
    print(f"Error al intentar cargar el archivo .env: {e}")
# --- FIN DE LA CORRECCIÓN ---

try:
    from duckduckgo_search import DDGS
except ImportError:
    DDGS = None

def google_search(query: str) -> str:
    """
    Realiza una búsqueda en la web (Google o DuckDuckGo) y devuelve resultados.
    Prioriza Google si hay credenciales, sino usa DuckDuckGo como fallback.
    """
    results = []
    
    api_key = os.environ.get("GOOGLE_API_KEY")
    cx = os.environ.get("GOOGLE_CSE_ID")

    if api_key and cx:
        print("Credenciales de Google encontradas. Usando Google Custom Search...")
        try:
            service = build("customsearch", "v1", developerKey=api_key)
            res = service.cse().list(q=query, cx=cx, num=5).execute()

            if "items" in res and res["items"]:
                for item in res["items"]:
                    results.append(f"Title: {item.get('title')}\nSnippet: {item.get('snippet')}\nLink: {item.get('link')}\n")
                return "\n".join(results)
            else:
                 print("Google Search no devolvió resultados.")
        except Exception as e:
            print(f"Google Search falló: {e}. Intentando fallback...")
    else:
        print("ADVERTENCIA: No se encontraron las credenciales de Google (GOOGLE_API_KEY o GOOGLE_CSE_ID).")

    if DDGS:
        try:
            print(f"Usando DuckDuckGo para: {query}")
            with DDGS() as ddgs:
                ddg_results = ddgs.text(query, max_results=5)
                if ddg_results:
                    for r in ddg_results:
                        results.append(f"Title: {r.get('title')}\nSnippet: {r.get('body')}\nLink: {r.get('href')}\n")
                    return "\n".join(results)
                else:
                    return "No se encontraron resultados en DuckDuckGo."
        except Exception as e:
            return f"Error en DuckDuckGo: {str(e)}"
    
    return "Error: No hay credenciales de Google y DuckDuckGo falló o no está instalado."

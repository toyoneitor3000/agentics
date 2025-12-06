import time
from typing import Dict, Any

def sleep_tool(seconds: int = 5) -> Dict[str, Any]:
    """
    Pausa la ejecución por una cantidad específica de segundos.
    Útil para esperar que procesos asíncronos terminen, dar tiempo a propagación de DNS
    o simular tiempos de espera en planes de ejecución.

    Args:
        seconds: Número de segundos a esperar (default: 5).

    Returns:
        Dict con el resultado de la operación.
    """
    try:
        print(f"⏳ [SleepTool] Durmiendo por {seconds} segundos...")
        time.sleep(seconds)
        return {
            "status": "success",
            "message": f"✅ Espera de {seconds} segundos completada."
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }


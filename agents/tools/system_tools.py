
"""
System monitoring and information tools.
"""
import psutil
import platform
import os
from typing import Dict, Any
from google.adk.tools import FunctionTool

def get_system_stats() -> Dict[str, Any]:
    """
    Obtiene estadísticas del sistema donde se ejecuta el agente.
    
    Returns:
        Dict con uso de CPU, RAM, Disco e Info del SO.
    """
    try:
        # CPU
        cpu_percent = psutil.cpu_percent(interval=1)
        
        # Memory
        memory = psutil.virtual_memory()
        ram_total_gb = round(memory.total / (1024**3), 2)
        ram_used_gb = round(memory.used / (1024**3), 2)
        ram_percent = memory.percent
        
        # Disk
        disk = psutil.disk_usage('/')
        disk_total_gb = round(disk.total / (1024**3), 2)
        disk_free_gb = round(disk.free / (1024**3), 2)
        
        # OS Info
        os_info = f"{platform.system()} {platform.release()}"
        
        return {
            "status": "success",
            "os": os_info,
            "cpu_usage_percent": cpu_percent,
            "ram_usage": f"{ram_used_gb}GB / {ram_total_gb}GB ({ram_percent}%)",
            "disk_free": f"{disk_free_gb}GB / {disk_total_gb}GB",
            "cwd": os.getcwd()
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error": f"Error getting system stats: {str(e)}"
        }

system_stats_tool = FunctionTool(get_system_stats, require_confirmation=False)


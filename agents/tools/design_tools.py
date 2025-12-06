"""
Design and brand asset management tools.

Handles design tokens, brand guidelines, and asset synchronization
between design systems and code.
"""

from typing import Dict, Any
from pathlib import Path
import json
import os
from pathlib import Path


def get_project_root() -> Path:
    """Returns the project root directory (2 levels up from this file)."""
    # tools/design_tools.py -> purrpurragent/ -> project_root/
    return Path(__file__).parent.parent.parent.resolve()


def design_tokens_sync(
    design_system_path: str,
    output_path: str = "./tokens.ts",
    format: str = "typescript"
) -> Dict[str, Any]:
    """
    Lee un archivo de design system y genera tokens de código.
    
    Convierte especificaciones de diseño (colores, tipografía, spacing)
    en archivos de código utilizables por developers.
    
    Args:
        design_system_path: Ruta al archivo de design system (MD, JSON, etc.).
        output_path: Dónde guardar los tokens generados.
        format: 'typescript', 'css', 'tailwind'.
        
    Returns:
        Dict con el contenido generado.
    """
    try:
        design_file = Path(design_system_path)
        
        if not design_file.exists():
            return {
                "status": "error",
                "content": None,
                "error": f"❌ Archivo de design system no encontrado: {design_system_path}"
            }
        
        # Read design system
        with open(design_file, 'r', encoding='utf-8') as f:
            design_content = f.read()
        
        # Parse and extract tokens (simplified example)
        tokens = _parse_design_tokens(design_content)
        
        # Generate code based on format
        if format == "typescript":
            code = _generate_typescript_tokens(tokens)
        elif format == "css":
            code = _generate_css_tokens(tokens)
        elif format == "tailwind":
            code = _generate_tailwind_config(tokens)
        else:
            return {
                "status": "error",
                "content": None,
                "error": f"Formato '{format}' no soportado."
            }
        
        return {
            "status": "success",
            "content": code,
            "output_path": output_path,
            "message": f"✅ Tokens generados. Usa 'write_files' para guardar en {output_path}."
        }
    
    except Exception as e:
        return {
            "status": "error",
            "content": None,
            "error": f"Error sincronizando tokens: {str(e)}"
        }



def brand_library_lookup(
    asset_type: str,
    base_dir: str = None,
    source_url: str = None
) -> Dict[str, Any]:
    """
    Busca assets de marca en la biblioteca del proyecto o en una URL remota.

    Args:
        asset_type: 'logo', 'colors', 'typography', 'templates', 'icons'.
        base_dir: Directorio donde buscar assets (default: project root/docs).
        source_url: URL opcional que devuelve un JSON con assets. Si se provee,
                    se descargará el recurso y se retornará su contenido.
    Returns:
        Dict con las rutas y metadatos de los assets encontrados o el JSON remoto.
    """
    # Si se provee una URL, intentar descargar el recurso
    if source_url:
        try:
            from purrpurragent.tools.web_tools import download_file, fetch_url
            # Descargamos el archivo a docs/assets/remote_asset.json
            dest_path = Path(get_project_root()) / "docs" / "assets" / "remote_asset.json"
            download_res = download_file(source_url, str(dest_path))
            if not download_res.get("status"):
                return {"status": "error", "error": download_res.get("error", "Error al descargar")}
            # Leemos el contenido descargado
            fetch_res = fetch_url(source_url)
            if fetch_res.get("status") == 200:
                try:
                    data = json.loads(fetch_res.get("content", "{}"))
                    return {"status": "ok", "source": "remote", "data": data}
                except json.JSONDecodeError:
                    return {"status": "error", "error": "Respuesta remota no es JSON válido"}
            else:
                return {"status": "error", "error": fetch_res.get("error", "Error HTTP")}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    # Búsqueda local
    try:
        if base_dir is None:
            docs_path = get_project_root() / "docs"
        else:
            docs_path = Path(base_dir)

        if not docs_path.exists():
            return {
                "status": "error",
                "assets": [],
                "error": f"❌ Directorio de docs no encontrado: {base_dir}"
            }

        # Patrones de búsqueda por tipo de asset
        patterns = {
            "logo": ["*logo*", "*.svg", "*.png"],
            "colors": ["*color*", "*palette*", "DESIGN-SYSTEM.md"],
            "typography": ["*font*", "*typography*", "*.ttf", "*.otf", "*.woff*"],
            "templates": ["*template*", "*plantilla*", "*.html", "*.jsx"],
            "icons": ["*icon*", "*.svg", "*.png"]
        }

        search_patterns = patterns.get(asset_type, ["*"])
        found_assets = []
        for pattern in search_patterns:
            for file_path in docs_path.rglob(pattern):
                if file_path.is_file():
                    found_assets.append({
                        "path": str(file_path.relative_to(docs_path.parent)),
                        "name": file_path.name,
                        "size": file_path.stat().st_size
                    })

        return {
            "status": "success",
            "assets": found_assets,
            "count": len(found_assets),
            "message": f"✅ Encontrados {len(found_assets)} assets de tipo '{asset_type}'."
        }
    except Exception as e:
        return {"status": "error", "assets": [], "error": f"Error buscando assets: {str(e)}"}



def _parse_design_tokens(content: str) -> Dict[str, Any]:
    """
    Extrae tokens de diseño. Intenta parsear JSON, si falla usa un tema Premium por defecto.
    """
    try:
        # Try to parse as JSON first
        if content and content.strip().startswith("{"):
            return json.loads(content)
    except json.JSONDecodeError:
        pass

    # Premium Dark Mode Default Theme (Slate/Zinc + Vibrant Accent)
    return {
        "colors": {
            "primary": "#6366f1", # Indigo 500
            "primary_hover": "#4f46e5", # Indigo 600
            "secondary": "#a1a1aa", # Zinc 400
            "accent": "#f472b6", # Pink 400
            "background": "#09090b", # Zinc 950
            "surface": "#18181b", # Zinc 900
            "surface_highlight": "#27272a", # Zinc 800
            "text_main": "#f4f4f5", # Zinc 100
            "text_muted": "#a1a1aa", # Zinc 400
            "border": "#27272a", # Zinc 800
            "success": "#22c55e",
            "error": "#ef4444",
            "warning": "#eab308"
        },
        "spacing": {
            "xs": "0.25rem",
            "sm": "0.5rem",
            "md": "1rem",
            "lg": "1.5rem",
            "xl": "2rem",
            "2xl": "3rem",
            "3xl": "4rem"
        },
        "typography": {
            "fontFamily": {
                "sans": "Inter, Outfit, system-ui, sans-serif",
                "mono": "Fira Code, monospace",
                "display": "Plus Jakarta Sans, sans-serif"
            },
            "fontSize": {
                "xs": "0.75rem",
                "sm": "0.875rem",
                "base": "1rem",
                "lg": "1.125rem",
                "xl": "1.25rem",
                "2xl": "1.5rem",
                "3xl": "1.875rem",
                "4xl": "2.25rem"
            },
            "fontWeight": {
                "normal": "400",
                "medium": "500",
                "semibold": "600",
                "bold": "700"
            }
        },
        "borderRadius": {
            "sm": "0.375rem",
            "md": "0.5rem",
            "lg": "0.75rem",
            "xl": "1rem",
            "full": "9999px"
        },
        "shadows": {
            "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            "md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            "glow": "0 0 20px rgba(99, 102, 241, 0.5)" # Primary glow
        }
    }


def _generate_typescript_tokens(tokens: Dict[str, Any]) -> str:
    """Genera archivo TypeScript con los tokens."""
    return f"""// Auto-generated design tokens
export const tokens = {json.dumps(tokens, indent=2)} as const;

export type ColorToken = keyof typeof tokens.colors;
export type SpacingToken = keyof typeof tokens.spacing;
"""


def _generate_css_tokens(tokens: Dict[str, Any]) -> str:
    """Genera CSS custom properties."""
    css_vars = []
    for category, values in tokens.items():
        for key, value in values.items():
            if isinstance(value, dict):
                for subkey, subvalue in value.items():
                    css_vars.append(f"  --{category}-{key}-{subkey}: {subvalue};")
            else:
                css_vars.append(f"  --{category}-{key}: {value};")
    
    return f""":root {{
{chr(10).join(css_vars)}
}}
"""


def _generate_tailwind_config(tokens: Dict[str, Any]) -> str:
    """Genera configuración de Tailwind CSS."""
    return f"""// tailwind.config.ts
import type {{ Config }} from 'tailwindcss';

const config: Config = {{
  theme: {{
    extend: {{
      colors: {json.dumps(tokens.get('colors', {}), indent=6)},
      spacing: {json.dumps(tokens.get('spacing', {}), indent=6)},
    }},
  }},
}};

export default config;
"""


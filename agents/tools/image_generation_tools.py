"""
Image generation tools using Google Vertex AI Imagen 3.

Provides AI-powered image creation using OAuth authentication.
"""

import os
import base64
from pathlib import Path
from typing import Dict, Any

def _prepare_output_dir(output_path: str) -> Path:
    """
    Prepara el directorio de salida, creándolo si no existe.
    
    Args:
        output_path: La ruta del archivo de salida.
        
    Returns:
        Un objeto Path resuelto para el archivo de salida.
    """
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    return output_file

def generate_image(
    prompt: str,
    output_path: str = "./workspace/assets/images/generated_image.png",
    aspect_ratio: str = "1:1",
    negative_prompt: str = ""
) -> Dict[str, Any]:
    """
    Genera una imagen usando Google Vertex AI Imagen 3.
    Requiere autenticación OAuth (gcloud auth application-default login).
    
    Args:
        prompt: Descripción detallada de la imagen a generar.
        output_path: Ruta donde guardar la imagen generada.
        aspect_ratio: Ratio de aspecto ('1:1', '16:9', '9:16', '4:3', '3:4').
        negative_prompt: Qué NO incluir en la imagen.
        
    Returns:
        Dict con status, ruta del archivo, base64 y metadata.
    """
    try:
        # Prepara el directorio de salida
        output_file = _prepare_output_dir(output_path)
        
        # Get project configuration
        project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
        location = os.environ.get("GOOGLE_CLOUD_LOCATION", "us-central1")
        
        if not project_id:
            return {
                "status": "error",
                "path": None,
                "error": "❌ Falta GOOGLE_CLOUD_PROJECT en .env"
            }
        
        # Import Vertex AI
        try:
            from vertexai.preview.vision_models import ImageGenerationModel
            import vertexai
        except ImportError:
            return {
                "status": "error",
                "path": None,
                "error": "❌ Instala: pip install google-cloud-aiplatform"
            }
        
        # Initialize Vertex AI
        print(f"🔐 Inicializando Vertex AI: project={project_id}, location={location}")
        vertexai.init(project=project_id, location=location)
        
        # Load Imagen 3 model
        print("🎨 Cargando modelo Imagen 3...")
        model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-001")
        
        # Generate image
        print(f"🖼️ Generando imagen: '{prompt[:60]}...' (Esto puede tardar ~30 segundos)")
        
        response = model.generate_images(
            prompt=prompt,
            negative_prompt=negative_prompt if negative_prompt else None,
            number_of_images=1,
            aspect_ratio=aspect_ratio,
            safety_filter_level="block_few", 
            person_generation="allow_adult"
        )
        
        # Save image
        image = response.images[0]
        image.save(location=str(output_file))
        
        print(f"✅ Imagen guardada: {output_file}")
        
        return {
            "status": "success",
            "path": str(output_file.absolute()),
            "prompt": prompt,
            "aspect_ratio": aspect_ratio,
            "message": f"✅ Imagen generada exitosamente con Imagen 3\\n\\n📁 Archivo guardado en: {output_file}\\n\\n💡 Abre el archivo para ver la imagen generada."
        }

        
    except Exception as e:
        error_msg = str(e)
        
        # Provide helpful error messages
        if "403" in error_msg or "permission" in error_msg.lower():
            return {
                "status": "error",
                "path": None,
                "error": f"❌ Error de permisos. Ejecuta: gcloud auth application-default login\\nDetalles: {error_msg}"
            }
        elif "quota" in error_msg.lower():
            return {
                "status": "error",
                "path": None,
                "error": f"❌ Error de cuota. Ejecuta: gcloud auth application-default set-quota-project {os.environ.get('GOOGLE_CLOUD_PROJECT')}\\nDetalles: {error_msg}"
            }
        else:
            return {
                "status": "error",
                "path": None,
                "error": f"❌ Error generando imagen: {error_msg}"
            }



def edit_image(
    base_image_path: str,
    prompt: str,
    mask_path: str = None,
    output_path: str = "./workspace/assets/images/edited_image.png"
) -> Dict[str, Any]:
    """
    Edita una imagen existente usando Imagen (inpainting/outpainting).
    
    Args:
        base_image_path: Ruta a la imagen base.
        prompt: Descripción de los cambios a realizar.
        mask_path: Ruta a máscara (opcional, para inpainting específico).
        output_path: Dónde guardar el resultado.
        
    Returns:
        Dict con status y ruta del archivo editado.
    """
    try:
        # Prepara el directorio de salida
        output_file = _prepare_output_dir(output_path)

        # Validate inputs
        base_image = Path(base_image_path)
        if not base_image.exists():
            return {
                "status": "error",
                "path": None,
                "error": f"❌ Imagen base no encontrada: {base_image_path}"
            }
        
        project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
        location = os.environ.get("GOOGLE_CLOUD_LOCATION", "us-central1")
        
        if not project_id:
            return {
                "status": "error",
                "path": None,
                "error": "❌ Falta GOOGLE_CLOUD_PROJECT en .env"
            }
        
        # Import libraries
        try:
            from vertexai.preview.vision_models import ImageGenerationModel, Image
            import vertexai
        except ImportError:
            return {
                "status": "error",
                "path": None,
                "error": "❌ Instala: pip install google-cloud-aiplatform"
            }
        
        # Initialize
        vertexai.init(project=project_id, location=location)
        model = ImageGenerationModel.from_pretrained("imagegeneration@006")
        
        # Load base image
        base_img = Image.load_from_file(str(base_image))
        
        # Edit image
        print(f"✏️ Editando imagen con: '{prompt[:50]}...'")
        
        if mask_path and Path(mask_path).exists():
            mask_img = Image.load_from_file(mask_path)
            response = model.edit_image(
                base_image=base_img,
                mask=mask_img,
                prompt=prompt
            )
        else:
            # Simple edit without mask
            response = model.edit_image(
                base_image=base_img,
                prompt=prompt
            )
        
        # Save result
        response.images[0].save(location=str(output_file))
        
        return {
            "status": "success",
            "path": str(output_file.absolute()),
            "prompt": prompt,
            "message": f"✅ Imagen editada: {output_file}"
        }
        
    except Exception as e:
        error_msg = str(e)
        if "403" in error_msg or "permission" in error_msg.lower():
            return {
                "status": "error",
                "path": None,
                "error": f"❌ Error de permisos. Ejecuta: gcloud auth application-default login\\nDetalles: {error_msg}"
            }
        elif "quota" in error_msg.lower():
            return {
                "status": "error",
                "path": None,
                "error": f"❌ Error de cuota. Ejecuta: gcloud auth application-default set-quota-project {os.environ.get('GOOGLE_CLOUD_PROJECT')}\\nDetalles: {error_msg}"
            }
        else:
            return {
                "status": "error",
                "path": None,
                "error": f"❌ Error editando imagen: {error_msg}"
            }

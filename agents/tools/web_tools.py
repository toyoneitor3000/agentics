
"""
Web scraping and content extraction tools.
"""
import requests
from bs4 import BeautifulSoup
from typing import Dict, Any, Optional
from google.adk.tools import FunctionTool

def scrape_url(url: str, max_length: int = 5000) -> Dict[str, Any]:
    """
    Extrae el contenido de texto de una página web.

    Args:
        url: La URL de la página a leer.
        max_length: Máxima longitud del texto a retornar (default: 5000 caracteres).

    Returns:
        Dict con el título, texto y metadata.
    """
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()

        text = soup.get_text(separator='\n')
        
        # Clean up text
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = '\n'.join(chunk for chunk in chunks if chunk)
        
        truncated = False
        if len(text) > max_length:
            text = text[:max_length] + "... [Truncated]"
            truncated = True

        return {
            "status": "success",
            "title": soup.title.string if soup.title else "No title",
            "content": text,
            "truncated": truncated,
            "url": url
        }

    except Exception as e:
        return {
            "status": "error",
            "error": f"Error scraping {url}: {str(e)}"
        }

scrape_url_tool = FunctionTool(scrape_url, require_confirmation=False)

def get_youtube_transcript(video_url: str, language: str = 'es') -> Dict[str, Any]:
    """
    Obtiene la transcripción de un video de YouTube.

    Args:
        video_url: URL completa o ID del video de YouTube.
        language: Código de idioma preferido (default: 'es').

    Returns:
        Dict con el texto de la transcripción.
    """
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        
        # Extract video ID
        if "v=" in video_url:
            video_id = video_url.split("v=")[1].split("&")[0]
        elif "youtu.be/" in video_url:
            video_id = video_url.split("youtu.be/")[1].split("?")[0]
        else:
            video_id = video_url

        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=[language, 'en'])
            
            full_text = " ".join([item['text'] for item in transcript_list])
            
            return {
                "status": "success",
                "video_id": video_id,
                "content": full_text,
                "char_count": len(full_text)
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": f"No se pudo obtener transcripción para {video_id}: {str(e)}"
            }

    except ImportError:
        return {
            "status": "error",
            "error": "Module 'youtube_transcript_api' not installed."
        }
    except Exception as e:
        return {
            "status": "error",
            "error": f"Error processing YouTube URL: {str(e)}"
        }

youtube_transcript_tool = FunctionTool(get_youtube_transcript, require_confirmation=False)

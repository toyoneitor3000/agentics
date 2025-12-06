import os, base64, httpx
from typing import Literal
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GROQ_KEY = os.getenv("GROQ_API_KEY", "").strip()
ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY", "").strip()

Model = Literal["llama-groq", "claude-sonnet"]

def select_model(prompt_b64: str, img_b64: str, img_tokens: int) -> Model:
    # If there's an image, use Claude (vision capable)
    if img_tokens > 0:
        return "claude-sonnet"
    # For long prompts, use Claude
    if len(prompt_b64) > 6_000:
        return "claude-sonnet"
    # Default to Groq Llama (faster and cheaper)
    return "llama-groq"

async def call_llama(prompt: str) -> str:
    """Call Groq API with Llama 3.3 70B"""
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0,
        "max_tokens": 1500
    }
    async with httpx.AsyncClient() as client:
        r = await client.post(url, headers=headers, json=payload)
        r.raise_for_status()
        data = r.json()
        return data["choices"][0]["message"]["content"]

async def call_claude(prompt: str, img_b64: str) -> str:
    headers = {"x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01"}
    payload = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 1500,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": img_b64}}
            ]
        }]
    }
    async with httpx.AsyncClient() as client:
        r = await client.post("https://api.anthropic.com/v1/messages", headers=headers, json=payload)
        return r.json()["content"][0]["text"]

# gemini-pro idem (omito para brevedad)

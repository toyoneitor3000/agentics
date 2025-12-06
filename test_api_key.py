import os
from dotenv import load_dotenv

load_dotenv()

groq_key = os.getenv("GROQ_API_KEY", "").strip()
anthropic_key = os.getenv("ANTHROPIC_API_KEY", "").strip()

print(f"GROQ_API_KEY length: {len(groq_key)}")
print(f"GROQ_API_KEY starts with: {groq_key[:10] if groq_key else 'EMPTY'}")
print(f"ANTHROPIC_API_KEY length: {len(anthropic_key)}")
print(f"ANTHROPIC_API_KEY starts with: {anthropic_key[:10] if anthropic_key else 'EMPTY'}")

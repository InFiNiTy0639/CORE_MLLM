import os
from dotenv import load_dotenv

load_dotenv()

# API Keys
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
HF_TOKEN = os.getenv("HF_TOKEN")

if not GOOGLE_API_KEY:
    print("Warning: GOOGLE_API_KEY not found in .env file.")

MODEL_PATHS = {
    "llava-1.5-13b": "llava-hf/llava-1.5-13b-hf",
    "blip2-flan-t5-xxl": "Salesforce/blip2-flan-t5-xxl",
}

GENERATION_CONFIG = {
    "temperature": 0.0, 
    "max_new_tokens": 512,
    "top_p": 1.0
}
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("ERROR: GOOGLE_API_KEY not found in .env")
else:
    print(f"API Key found: {api_key[:5]}...{api_key[-5:]}")
    genai.configure(api_key=api_key)
    
    print("\nListing available models for your key:")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f" - {m.name}")
    except Exception as e:
        print(f"Error listing models: {e}")

    print("\n--- Testing Generation ---")
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Hello, do you work?")
        print(f"Success! Response: {response.text}")
    except Exception as e:
        print(f"Standard 'gemini-1.5-flash' failed: {e}")
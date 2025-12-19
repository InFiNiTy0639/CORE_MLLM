import torch
from transformers import (
    Blip2Processor, Blip2ForConditionalGeneration,
    AutoProcessor, LlavaForConditionalGeneration
)
from PIL import Image
import google.generativeai as genai
import time
from .config import MODEL_PATHS, GENERATION_CONFIG, GOOGLE_API_KEY

class BaseModel:
    def generate(self, image, prompt):
        raise NotImplementedError

class LLaVA_Model(BaseModel):
    def __init__(self):
        print(f"Loading LLaVA-1.5...")
        self.processor = AutoProcessor.from_pretrained(MODEL_PATHS["llava-1.5-13b"])
        self.model = LlavaForConditionalGeneration.from_pretrained(
            MODEL_PATHS["llava-1.5-13b"], 
            torch_dtype=torch.float16, 
            device_map="auto"
        )

    def generate(self, image, prompt):
        formatted_prompt = f"USER: <image>\n{prompt}\nASSISTANT:"
        inputs = self.processor(text=formatted_prompt, images=image, return_tensors="pt").to(self.model.device)
        with torch.no_grad():
            generate_ids = self.model.generate(**inputs, **GENERATION_CONFIG)
        return self.processor.batch_decode(generate_ids, skip_special_tokens=True)[0].split("ASSISTANT:")[-1].strip()

class BLIP2_Model(BaseModel):
    def __init__(self):
        print(f"Loading BLIP-2 (Flan T5 XXL)...")
        self.processor = Blip2Processor.from_pretrained(MODEL_PATHS["blip2-flan-t5-xxl"])
        self.model = Blip2ForConditionalGeneration.from_pretrained(
            MODEL_PATHS["blip2-flan-t5-xxl"], 
            torch_dtype=torch.float16, 
            device_map="auto"
        )

    def generate(self, image, prompt):
        inputs = self.processor(images=image, text=prompt, return_tensors="pt").to(self.model.device)
        with torch.no_grad():
            generated_ids = self.model.generate(**inputs, **GENERATION_CONFIG)
        return self.processor.batch_decode(generated_ids, skip_special_tokens=True)[0].strip()

class Gemini_Model(BaseModel):
    def __init__(self):
        if not GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY is missing in .env")
            
        genai.configure(api_key=GOOGLE_API_KEY)
        
        possible_models = [
            'models/gemini-2.5-flash',          
            'models/gemini-2.0-flash-001',      
            'models/gemini-flash-latest',       
            'models/gemini-exp-1206',           
            'models/gemini-2.0-flash-lite-preview-02-05'
        ]
        
        self.model = None
        for model_name in possible_models:
            try:
                print(f"Attempting to load Gemini model: {model_name}...")
                test_model = genai.GenerativeModel(model_name)
                test_model.generate_content("test")
                self.model = test_model
                print(f" -> Success! Connected to: {model_name}")
                break
            except Exception as e:
                error_msg = str(e)
                if "429" in error_msg:
                    print(f" -> Quota exceeded on {model_name}. Switching to next...")
                else:
                    print(f" -> Failed ({model_name}): {error_msg[:50]}...")
        
        if self.model is None:
            raise ValueError("All Gemini models failed. Please WAIT 2-5 MINUTES and try again.")

    def generate(self, image, prompt):
        try:
            # Safety settings set to NONE
            safety = [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
            ]
            
            for attempt in range(5):
                try:
                    response = self.model.generate_content(
                        [prompt, image], 
                        generation_config=genai.types.GenerationConfig(temperature=0.0),
                        safety_settings=safety
                    )
                    return response.text
                except Exception as e:
                    if "429" in str(e):
                        print(f"Rate limited (429). Waiting 10 seconds (Attempt {attempt+1}/5)...")
                        time.sleep(10) # Backoff delay
                    else:
                        print(f"Generation Error: {e}")
                        return ""
            return "Error: Rate limit exceeded after retries."
            
        except Exception as e:
            return f"Error: {str(e)}"

def load_model(model_name):
    if "llava" in model_name: return LLaVA_Model()
    if "blip" in model_name: return BLIP2_Model()
    if "gemini" in model_name: return Gemini_Model()
    raise ValueError(f"Unknown model: {model_name}")
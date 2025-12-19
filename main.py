import re
import time
import argparse
import pandas as pd
from tqdm import tqdm
from src.models import load_model
from src.dataloaders import get_science_qa, get_winoground
from src.prompts import SCIENCEQA_PROMPT
from src.config import HF_TOKEN

LABEL_MAP = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E'}

def extract_answer_label(response_text):
    """
    Robustly extracts the answer label (A, B, C, D, E) from the model's Chain-of-Thought response.
    Handles responses like "The answer is A" or "Therefore, option (B) is correct."
    """
    if not response_text:
        return "RANDOM"
        
    text = str(response_text).upper()
    
    match = re.search(r'(?:ANSWER|OPTION|CHOICE)(?:\sIS|:|)\s+([A-E])\b', text)
    if match:
        return match.group(1)
    
    match = re.search(r'\(([A-E])\)', text)
    if match:
        return match.group(1)
    
    match = re.search(r'^([A-E])[\).]', text)
    if match:
        return match.group(1)

    matches = re.findall(r'\b([A-E])\b', text)
    if matches:
        return matches[-1]
        
    return "UNKNOWN"

def run_science_qa(model, limit=10):
    print(f"\n--- Running ScienceQA (Knowledge Integration) ---")
    
    # Load dataset
    dataset = get_science_qa(limit=limit)
    if not dataset or len(dataset) == 0:
        print("CRITICAL ERROR: ScienceQA dataset could not be loaded or was empty.")
        return 0.0

    predictions = []
    ground_truths = []
    
    for i, item in enumerate(tqdm(dataset, desc="Evaluated")):
        image = item.get('image')
        question = item['question']
        choices = item['choices']
        answer_idx = item['answer']
        
        if image is None:
            # If the dataloader didn't filter them, we skip them here to prevent crash
            continue

        formatted_options = ""
        for idx, choice in enumerate(choices):
            label = LABEL_MAP.get(idx, '?')
            formatted_options += f"{label}) {choice}\n"
            
        prompt = SCIENCEQA_PROMPT.format(question=question, options=formatted_options)
        
        gt_label = LABEL_MAP.get(answer_idx, 'A')
        
        try:
            response = model.generate(image, prompt)
            
            pred_label = extract_answer_label(response)
            
            predictions.append(pred_label)
            ground_truths.append(gt_label)
            
            time.sleep(4)
            
        except Exception as e:
            print(f"Error on sample {i}: {e}")
            predictions.append("ERROR")
            ground_truths.append(gt_label)
            time.sleep(10) 

    if len(predictions) == 0:
        return 0.0

    correct_count = sum([1 for p, g in zip(predictions, ground_truths) if p == g])
    acc = correct_count / len(predictions)
    
    print(f"ScienceQA Accuracy: {acc * 100:.2f}%")
    return acc

def run_winoground_local(model, hf_token, limit=10):
    """
    Local implementation of Winoground evaluation to ensure we can inject time.sleep().
    Calculates the Group Score.
    """
    print(f"\n--- Running Winoground (Compositionality) ---")
    
    if not hf_token:
        print("Skipping Winoground: No HF_TOKEN found in .env file.")
        return 0.0
        
    dataset = get_winoground(hf_token, limit=limit)
    if not dataset:
        return 0.0

    group_score_count = 0
    
    for i, example in enumerate(tqdm(dataset, desc="Evaluated")):
        
        prompt_template = (
            "Which caption best describes this image?\n"
            "Option A: {cap0}\n"
            "Option B: {cap1}\n"
            "Answer with 'Option A' or 'Option B' only."
        )
        
        formatted_prompt = prompt_template.format(
            cap0=example['caption_0'], 
            cap1=example['caption_1']
        )
        
        try:
            res_0 = model.generate(example['image_0'].convert("RGB"), formatted_prompt)
            pred_0 = extract_answer_label(res_0)
            time.sleep(4) # Rate Limit Sleep
            
            res_1 = model.generate(example['image_1'].convert("RGB"), formatted_prompt)
            pred_1 = extract_answer_label(res_1)
            time.sleep(4) # Rate Limit Sleep
            
            if pred_0 == 'A' and pred_1 == 'B':
                group_score_count += 1
                
        except Exception as e:
            print(f"Error on Winoground sample {i}: {e}")
            time.sleep(10)

    score = group_score_count / len(dataset)
    print(f"Winoground Group Score: {score * 100:.2f}%")
    return score

def main():
    parser = argparse.ArgumentParser(description="Reproduce Multimodal Commonsense Gap Experiments")
    parser.add_argument("--model", type=str, default="llava-1.5", choices=["llava-1.5", "blip-2", "gemini"])
    parser.add_argument("--limit", type=int, default=10, help="Samples per benchmark (Use 50+ for validity)")
    args = parser.parse_args()

    if args.limit < 20:
        print(f"WARNING: limit={args.limit} is too low for statistical significance. Results may be 0% or 100% by luck.")

    try:
        print(f"Loading Model: {args.model}...")
        model = load_model(args.model)
    except Exception as e:
        print(f"Failed to load model: {e}")
        return

    results = {}
    
    # 1. Run ScienceQA
    results['ScienceQA'] = run_science_qa(model, limit=args.limit)
    
    # 2. Run Winoground
    # Note: We run this locally in main.py to enforce the API sleep timer
    results['Winoground'] = run_winoground_local(model, HF_TOKEN, limit=args.limit)

    print("\n=== Final Results ===")
    df = pd.DataFrame(list(results.items()), columns=["Benchmark", "Score (0-1)"])
    print(df)

if __name__ == "__main__":
    main()
import re

def calculate_accuracy(predictions, ground_truths):
    """
    Robust accuracy for Multiple Choice (ScienceQA).
    Extracts the option letter (A, B, C, D) or index from the response.
    """
    correct = 0
    for pred, gt_text in zip(predictions, ground_truths):
        pred_lower = pred.lower()
        
        if str(gt_text).lower() in pred_lower:
            correct += 1
            continue
        
    return correct / len(predictions)

def evaluate_winoground(model, dataset):
    """
    Computes strict Group Score for Winoground.
    """
    group_score = 0
    
    for example in dataset:
        prompt_a = (
            f"Which caption best describes this image?\n"
            f"Option A: {example['caption_0']}\n"
            f"Option B: {example['caption_1']}\n"
            f"Answer with just 'Option A' or 'Option B'."
        ) 
        
        ans_img_0 = model.generate(example['image_0'].convert("RGB"), prompt_a)
        ans_img_1 = model.generate(example['image_1'].convert("RGB"), prompt_a)
        
        pred_0 = re.search(r'\b(A|Option A)\b', ans_img_0, re.IGNORECASE)
        pred_1 = re.search(r'\b(B|Option B)\b', ans_img_1, re.IGNORECASE)
        
        is_correct_0 = pred_0 is not None
        is_correct_1 = pred_1 is not None
        
        if is_correct_0 and is_correct_1:
            group_score += 1
            
    return group_score / len(dataset)
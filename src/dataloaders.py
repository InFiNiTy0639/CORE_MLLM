import os
from datasets import load_dataset
from PIL import Image

def ensure_dir(path):
    if not os.path.exists(path):
        try:
            os.makedirs(path, exist_ok=True)
        except Exception as e:
            print(f"Warning: Could not create {path}: {e}")

def get_science_qa(split="validation", limit=None):
    """
    Loads ScienceQA dataset and filters for samples containing images.
    """
    base_path = os.getcwd()
    cache_path = os.path.join(base_path, "data", "scienceqa")
    ensure_dir(cache_path)
    
    print(f"Loading ScienceQA... (Files stored in {cache_path})")
    try:
        ds = load_dataset("derek-thomas/ScienceQA", split=split, cache_dir=cache_path)
    except Exception as e:
        print(f"Error loading ScienceQA: {e}")
        return []

    print("Filtering for examples with images...")
    ds = ds.filter(lambda x: x['image'] is not None)

    if limit: 
        count = min(limit, len(ds))
        ds = ds.select(range(count))
        
    return ds

def get_winoground(auth_token, limit=None):
    """
    Loads Winoground dataset.
    """
    base_path = os.getcwd()
    cache_path = os.path.join(base_path, "data", "winoground")
    ensure_dir(cache_path)
    
    print(f"Loading Winoground... (Files stored in {cache_path})")
    try:
        ds = load_dataset("facebook/winoground", token=auth_token, split="test", cache_dir=cache_path)
    except Exception as e:
        print(f"Error loading Winoground: {e}")
        print("NOTE: You must visit https://huggingface.co/datasets/facebook/winoground and click 'Agree'!")
        return []

    if limit: 
        count = min(limit, len(ds))
        ds = ds.select(range(count))
    return ds

def get_vcr_sample():
    return [
        {
            "image": None, 
            "question": "Why is [person1] pointing at [person2]?", 
            "answers": ["He is angry.", "He is giving directions.", "He is asking a question.", "He is stretching."],
            "answer_idx": 1
        }
    ]
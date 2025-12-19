# The Multimodal Commonsense Gap: Experimental Reproduction

This repository contains the official code for reproducing the experiments presented in the research paper:

**“The Multimodal Commonsense Gap: A Comprehensive Analysis of Benchmarks, Methodologies, and Failure Modes in Multimodal Large Language Models.”**

The project evaluates Multimodal Large Language Models (MLLMs) such as **Gemini Pro**, **GPT-4V**,**BLIP-2** and **LLaVA-1.5** on their ability to perform *true commonsense reasoning* as opposed to superficial pattern recognition.

## 🛠️ Installation & Setup

### 1. Prerequisites
- Python 3.8 or higher
- Google Cloud API key (for Gemini)
- Hugging Face token (for Winoground access)

### 2. Install Dependencies

It is recommended to use a virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```
### 3. API Configuration
create a ```.env``` file in the project root to store sensitive keys:
```bash
GOOGLE_API_KEY=your_google_gemini_key_here
HF_TOKEN=your_huggingface_write_token_here
```
### 4.  Usage
The ``main.py`` script is the central entry point for running evaluations.It handles model loading, inference, rate limiting depend, and scoring.

## Basic Command
To evaluate Gemini Pro on both ScienceQA and Winoground:
```
python main.py --model gemini --limit 50
```
similary for BLIP-2 and LLaVA 
```
python main.py --model llava-1.5 --limit 100

python main.py --model BLIP --limit 100
```
### 5. Benchmarks & Methodologies
This codebase reproduces results for the following benchmarks as detailed in the paper:
1. ScienceQA (Knowledge Integration) 
- Goal: Tests the model's ability to use external knowledge and chain-of-thought reasoning.
- Metric: Accuracy (Exact Match of Options A/B/C/D).
- Implementation: The code uses Chain-of-Thought (CoT) prompting. It parses the model's verbose explanation to find the final selected option (e.g., extracting "A" from "The answer is A")

2. Winoground (Compositionality)
- Goal: Tests if the model can distinguish between "a truck fire" and "a fire truck" (spatial/compositional binding).

- Metric: Group Score. A point is awarded only if the model correctly matches both images in a pair to their respective captions.

- Implementation: We implement the strict Group Score metric. The code incorporates rate-limiting (time.sleep) to prevent API blocks during this intensive pair-matching task.

### 📜 Citation
If you use this code or the analysis in your work, please cite the original paper:
```
@article{rizwan2025multimodal,
  title={The Multimodal Commonsense Gap: A Comprehensive Analysis of Benchmarks, Methodologies, and Failure Modes},
  author={MD Aadil Rizwan},
  year={2025}
}
```



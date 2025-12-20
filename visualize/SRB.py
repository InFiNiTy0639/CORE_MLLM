# Performance Comparison on Static Reasoning Benchmarks

import matplotlib.pyplot as plt
import numpy as np

models = ['Human Baseline', 'GPT-4V', 'Gemini Pro', 'LLaVA-1.5', 'BLIP-2']
vcr_scores = [92.0, 52.0, 62.7, 0, 0]
okvqa_scores = [90.0, 61.0, 56.0, 50.0, 45.9]
winoground_scores = [90.0, 41.0, 43.0, 20.0, 19.0]

x = np.arange(len(models))
width = 0.25

fig, ax = plt.subplots(figsize=(10, 6))

rects1 = ax.bar(x - width, vcr_scores, width, label='VCR (Static Inference)', color='#1f77b4')
rects2 = ax.bar(x, okvqa_scores, width, label='OK-VQA (Knowledge)', color='#ff7f0e')
rects3 = ax.bar(x + width, winoground_scores, width, label='Winoground (Compositional)', color='#2ca02c')

ax.set_ylabel('Accuracy / Group Score (%)')
ax.set_title('Figure 1: Comparative Performance on Static Reasoning Benchmarks')
ax.set_xticks(x)
ax.set_xticklabels(models)
ax.legend()
ax.set_ylim(0, 100)
ax.grid(axis='y', linestyle='--', alpha=0.7)

plt.tight_layout()
plt.show()
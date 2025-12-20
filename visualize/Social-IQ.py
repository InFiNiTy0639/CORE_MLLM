import matplotlib.pyplot as plt
import numpy as np

labels = ['Human Baseline', 'GPT-4V (Zero-shot)', 'Gemini Pro', 'Video-LLaVA', 'Random Chance']
scores = [86.0, 78.4, 78.3, 61.0, 25.0]
colors = ['#2ca02c', '#1f77b4', '#1f77b4', '#1f77b4', '#1f77b4', 'gray']

fig, ax = plt.subplots(figsize=(10, 5))

y_pos = np.arange(len(labels))
ax.barh(y_pos, scores, align='center', color=colors)
ax.set_yticks(y_pos)
ax.set_yticklabels(labels)
ax.invert_yaxis() 
ax.set_xlabel('Accuracy (%)')
ax.set_title('Figure 2: Social-IQ 2.0 Performance Gap')
ax.axvline(x=25, color='r', linestyle='--', label='Random Chance')

for i, v in enumerate(scores):
    ax.text(v + 1, i + .15, str(v)+'%', color='black', fontweight='bold')

plt.tight_layout()
plt.show()
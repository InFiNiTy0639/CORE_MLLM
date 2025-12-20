import matplotlib.pyplot as plt

models = ['Human\nAverage', 'Gemini Pro\n(Zero-shot)', 'GPT-4V\n(Zero-shot)', 'LLaVA-1.5\n(Fine-tuned)', 'BLIP-2\n(Zero-shot)']
scores = [88.4, 83.5, 81.0, 71.6, 67.5]
labels = ['~88.4%', '~82-85%', '~82.0%', '~71.6%', '64-71%']
colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', 'gray']
fig, ax = plt.subplots(figsize=(10, 6))
bars = ax.bar(models, scores, color=colors, width=0.6)

ax.set_ylabel('Accuracy (%)', fontsize=12)
ax.set_title('Figure: Scientific Reasoning Performance (ScienceQA)', fontsize=14, fontweight='bold')
ax.set_ylim(0, 105)

for bar, label in zip(bars, labels):
    height = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2., height + 1,
            label,
            ha='center', va='bottom', fontsize=11, fontweight='bold')
ax.grid(axis='y', linestyle='--', alpha=0.5)

plt.tight_layout()
plt.show()
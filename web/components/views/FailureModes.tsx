'use client';

import { useState } from 'react';

const failures = [
    {
        title: "Object Hallucination",
        icon: "1",
        desc: "The model claims an object exists in the image when it does not.",
        cause: "Statistical co-occurrence in training data (e.g., seeing 'fork' usually implies 'knife').",
        example: "Image: A cat on a mat.\nModel: 'I see a cat, a mat, and a dog bowl.'"
    },
    {
        title: "Logical Inconsistency",
        icon: "2",
        desc: "The model makes two statements that contradict each other.",
        cause: "Lack of global coherence checking or weak reasoning chains.",
        example: "Model: 'The man is wearing a red shirt... The shirt is blue.'"
    },
    {
        title: "Multimodal Conflict",
        icon: "3",
        desc: "The model prioritizes text priors over visual evidence.",
        cause: "Language model dominance; the LLM ignores the vision encoder output.",
        example: "Image: It is raining.\nUser: 'Is it sunny?'\nModel: 'Yes, it is a lovely sunny day' (ignoring image)."
    },
    {
        title: "Instruction Drifting",
        icon: "4",
        desc: "The model forgets the specific constraints of the prompt over time.",
        cause: "Context window limitations or attention mechanism failure.",
        example: "User: 'Answer only 'yes' or 'no'.'\nModel: 'Well, looking at the image I can see...'"
    }
];

export default function FailureModes() {
    const [expanded, setExpanded] = useState<number[]>([]);

    const toggleExample = (index: number) => {
        setExpanded(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">The Failure Mode Lab</h2>
                <p className="text-slate-600 max-w-3xl">
                    Even powerful models fail in predictable ways. This taxonomy categorizes the specific breakdowns in the commonsense reasoning pipeline.
                    Understanding these failures is key to developing better mitigation techniques (like Visual Chain-of-Thought).
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {failures.map((f, index) => (
                    <div key={index} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center text-2xl border border-rose-100">
                                    {f.icon}
                                </div>
                                <span className="text-xs font-mono text-slate-400">Type 0{index + 1}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                            <p className="text-slate-600 text-sm mb-4 min-h-10">{f.desc}</p>

                            <div className="bg-slate-50 p-3 rounded border border-slate-100 mb-4">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Root Cause</p>
                                <p className="text-sm text-slate-700">{f.cause}</p>
                            </div>

                            <div>
                                <button
                                    onClick={() => toggleExample(index)}
                                    className="text-blue-600 text-sm font-bold hover:text-blue-800 flex items-center focus:outline-none"
                                >
                                    <span>{expanded.includes(index) ? 'Hide Example' : 'Show Example'}</span>
                                    <span className="ml-1 text-xs">{expanded.includes(index) ? '▲' : '▼'}</span>
                                </button>
                                {expanded.includes(index) && (
                                    <div className="mt-3 p-3 bg-rose-50 text-rose-900 text-sm font-mono rounded border-l-4 border-rose-400 whitespace-pre-wrap animate-fade-in">
                                        {f.example}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mitigation Strategy Section */}
            <div className="mt-12 bg-indigo-900 text-indigo-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4">Mitigation Strategies</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="font-bold text-indigo-300 mb-2">Visual Chain-of-Thought</h4>
                        <p className="text-sm opacity-80">Prompting the model to describe the image features step-by-step before answering the question prevents &quot;jumping to conclusions.&quot;</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-indigo-300 mb-2">Self-Correction</h4>
                        <p className="text-sm opacity-80">Asking the model to &quot;critique its own answer&quot; and check for logical inconsistencies against the image.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-indigo-300 mb-2">Neuro-Symbolic Integration</h4>
                        <p className="text-sm opacity-80">Combining neural networks (perception) with symbolic logic engines (reasoning) to enforce hard rules of physics/logic.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

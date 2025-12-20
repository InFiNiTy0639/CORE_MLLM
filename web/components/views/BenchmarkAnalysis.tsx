"use client";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BubbleController,
} from "chart.js";
import { Bubble } from "react-chartjs-2";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, BubbleController);

const benchmarks = [
  {
    id: "vqa",
    name: "VQA v2",
    type: "General",
    bias: 85,
    reasoning: 30,
    desc: 'Visual Question Answering. Heavily biased; models can often guess the answer without looking at the image (e.g., "What sport?" -> "Tennis").',
    metrics: "Accuracy",
  },
  {
    id: "vcr",
    name: "VCR",
    type: "Reasoning",
    bias: 65,
    reasoning: 70,
    desc: "Visual Commonsense Reasoning. Good structure (Q -> A -> R), but text-only models perform suspiciously well, indicating information leakage.",
    metrics: "Q->A->R Acc",
  },
  {
    id: "gqa",
    name: "GQA",
    type: "Compositional",
    bias: 40,
    reasoning: 75,
    desc: "Focuses on compositional reasoning and spatial relations. Reduces bias through balanced sampling but lacks complex social nuance.",
    metrics: "Consistency",
  },
  {
    id: "socialiq",
    name: "Social-IQ",
    type: "Social",
    bias: 20,
    reasoning: 90,
    desc: "Video-based social interaction understanding. Highly challenging for current models which struggle with subtle cues and temporal dynamics.",
    metrics: "Social Acc",
  },
  {
    id: "scienceqa",
    name: "ScienceQA",
    type: "Knowledge",
    bias: 50,
    reasoning: 60,
    desc: "Multimodal science questions. Requires external knowledge + image understanding. Models perform well due to CoT training.",
    metrics: "Acc w/ CoT",
  },
  {
    id: "mme",
    name: "MME",
    type: "Comprehensive",
    bias: 30,
    reasoning: 80,
    desc: "Comprehensive evaluation benchmark. Separates Perception from Cognition. The current gold standard for holistic evaluation.",
    metrics: "Score",
  },
];

export default function BenchmarkAnalysis() {
  const data = {
    datasets: [
      {
        label: "Datasets",
        data: benchmarks.map((b) => ({
          x: b.bias,
          y: b.reasoning,
          r: 12,
          label: b.name, // Custom property, might need type augmentation or callback access
          _raw: b, // Store raw data for tooltip
        })),
        backgroundColor: (context: any) => {
          const v = context.raw?.y;
          return v > 60 ? "rgba(79, 70, 229, 0.6)" : "rgba(148, 163, 184, 0.6)";
        },
        borderColor: (context: any) => {
          const v = context.raw?.y;
          return v > 60 ? "rgba(79, 70, 229, 1)" : "rgba(148, 163, 184, 1)";
        },
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const raw = context.raw;
            return `${raw.label}: Bias ${raw.x}, Reasoning ${raw.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Language Bias (Susceptibility to Guessing)",
        },
        min: 0,
        max: 100,
        grid: { color: "#e2e8f0" },
      },
      y: {
        title: { display: true, text: "Reasoning Depth (Complexity)" },
        min: 0,
        max: 100,
        grid: { color: "#e2e8f0" },
      },
    },
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Benchmark Landscape
        </h2>
        <p className="text-slate-600 max-w-3xl">
          Current benchmarks are flawed. Many suffer from &quot;Language
          Bias,&quot; allowing models to guess answers based on text statistics
          without looking at the image. This chart plots datasets by their
          **Bias** (how easy they are to game) vs. their **Reasoning Depth**
          (how much cognitive effort is actually required).
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Based on analysis of VQA v2, VCR, GQA, and recent MME findings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-112.5">
          <h3 className="font-bold text-slate-800 mb-4">
            Bias vs. Reasoning Capability
          </h3>
          <div className="relative w-full h-87.5">
            <Bubble data={data} options={options} />
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">
            Benchmark Details
          </h3>
          <div className="space-y-4 h-87.5 overflow-y-auto no-scrollbar pr-2">
            {benchmarks.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-white rounded-lg border border-slate-200 hover:border-indigo-400 cursor-pointer transition hover:shadow-sm"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-indigo-900">{b.name}</span>
                  <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                    {b.type}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-2">{b.desc}</p>
                <div className="flex gap-2 text-[10px] font-bold">
                  <span className="text-rose-600">Bias: {b.bias}%</span>
                  <span className="text-emerald-600">
                    Reasoning: {b.reasoning}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

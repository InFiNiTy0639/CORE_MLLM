"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const models = {
  gpt4v: {
    name: "GPT-4 Turbo (V)",
    color: "rgba(79, 70, 229, 0.7)",
    border: "#4f46e5",
    data: [95, 88, 85, 92, 90],
  },
  gemini: {
    name: "Gemini 1.5 Pro",
    color: "rgba(37, 99, 235, 0.7)",
    border: "#2563eb",
    data: [96, 85, 89, 94, 88],
  },
  llava: {
    name: "LLaVA-1.6",
    color: "rgba(220, 38, 38, 0.7)",
    border: "#dc2626",
    data: [85, 60, 70, 55, 65],
  },
  claude: {
    name: "Claude 3 Opus",
    color: "rgba(217, 119, 6, 0.7)",
    border: "#d97706",
    data: [94, 86, 87, 88, 91],
  },
};

type ModelKey = keyof typeof models;

export default function ModelArena() {
  const [activeModels, setActiveModels] = useState<Record<string, boolean>>({
    gpt4v: true,
    gemini: true,
    llava: true,
    claude: true,
  });

  const toggleModel = (key: string) => {
    setActiveModels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const data = {
    labels: [
      "Visual Perception",
      "Social IQ",
      "Physical Commonsense",
      "Temporal Logic",
      "Complex Reasoning",
    ],
    datasets: Object.keys(models)
      .filter((k) => activeModels[k])
      .map((key) => {
        const m = models[key as ModelKey];
        return {
          label: m.name,
          data: m.data,
          backgroundColor: m.color,
          borderColor: m.border,
          borderWidth: 2,
          pointBackgroundColor: "#fff",
          pointBorderColor: m.border,
        };
      }),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: "#e2e8f0" },
        grid: { color: "#e2e8f0" },
        pointLabels: {
          font: { size: 12, family: "'Inter', sans-serif", weight: "600" }, // using string '600' but ChartJS types are finicky
          color: "#475569",
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: { position: "bottom" as const },
    },
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Model Performance Arena
        </h2>
        <p className="text-slate-600 max-w-3xl">
          A comparative analysis of State-of-the-Art MLLMs (GPT-4V, Gemini 1.5
          Pro, LLaVA-1.6) across the dimensions of commonsense. Note the
          &quot;Spiky&quot; profiles: models may excel at Visual Perception but
          fail at Social Reasoning.
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Data simulated based on relative performance trends discussed in the
          paper.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 h-fit">
          <h3 className="font-bold text-slate-800 mb-4">Select Models</h3>
          <div className="space-y-3">
            {Object.keys(models).map((key) => {
              const m = models[key as ModelKey];
              return (
                <div
                  key={key}
                  className="flex items-center space-x-3 cursor-pointer select-none"
                  onClick={() => toggleModel(key)}
                >
                  <input
                    type="checkbox"
                    checked={!!activeModels[key]}
                    readOnly
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 pointer-events-none"
                  />
                  <span className="grow text-slate-700 font-medium">
                    {m.name}
                  </span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: m.border }}
                  ></div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-indigo-50 rounded-lg text-sm text-blue-800">
            <h4 className="font-bold mb-2">Key Insight</h4>
            <p>
              Gemini 1.5 Pro shows strength in <strong>Temporal</strong> tasks
              due to its massive context window, while GPT-4V typically leads in{" "}
              <strong>Zero-shot Social</strong> reasoning.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center h-125">
          <div className="relative w-full h-full">
            {/* @ts-ignore */}
            <Radar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}

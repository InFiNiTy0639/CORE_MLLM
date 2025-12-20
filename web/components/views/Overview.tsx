"use client";

type ViewId = "overview" | "benchmarks" | "models" | "failures";

interface OverviewProps {
  onSwitchView: (view: ViewId) => void;
}

export default function Overview({ onSwitchView }: OverviewProps) {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
        <div>
          <div className="inline-block px-3 py-1 bg-indigo-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
            Core Problem
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            The Multimodal Commonsense Gap
          </h2>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">
            Artificial Intelligence is shifting from unimodal specialization to{" "}
            <strong>multimodal generalization</strong>. Models like GPT-4V and
            Gemini can &quot;see&quot; and &quot;speak&quot;. However, a
            critical gap remains.
          </p>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">
            While these models excel at <em>Perception</em> (identifying
            objects), they struggle with <em>Commonsense Reasoning</em>
            (understanding physics, social cues, and causality). They often
            guess based on language patterns rather than true visual
            understanding.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => onSwitchView("benchmarks")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-lg shadow-indigo-200"
            >
              Analyze Benchmarks
            </button>
            <button
              onClick={() => onSwitchView("failures")}
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-6 rounded-lg transition"
            >
              Explore Failures
            </button>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 to-rose-500"></div>
          <h3 className="font-bold text-slate-800 mb-6 flex items-center">
            The Gap Visualization
          </h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-semibold text-slate-600 mb-2">
                <span>Visual Perception</span>
                <span className="text-emerald-600">High Proficiency</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4">
                <div
                  className="bg-emerald-500 h-4 rounded-full"
                  style={{ width: "95%" }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Object Detection, OCR, Scene Classification
              </p>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full border border-rose-200 shadow-sm z-10">
                  ⚠️ The Commonsense Gap
                </div>
              </div>
              <div className="border-t-2 border-dashed border-slate-300 w-full"></div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold text-slate-600 mb-2">
                <span>Commonsense Reasoning</span>
                <span className="text-rose-600">Inconsistent</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4">
                <div
                  className="bg-rose-500 h-4 rounded-full"
                  style={{ width: "55%" }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Physics, Social Dynamics, Temporal Causality, Spatial Logic
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">
          Four Dimensions of Reasoning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <h4 className="font-bold text-slate-800 mb-2">Physical</h4>
            <p className="text-sm text-slate-600">
              Gravity, material properties, object permanence. (e.g., &quot;Will
              the glass break if dropped?&quot;)
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <h4 className="font-bold text-slate-800 mb-2">Social</h4>
            <p className="text-sm text-slate-600">
              Intentions, emotions, relationships. (e.g., &quot;Why are these
              people shaking hands?&quot;)
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <h4 className="font-bold text-slate-800 mb-2">Temporal</h4>
            <p className="text-sm text-slate-600">
              Cause and effect, sequence of events. (e.g., &quot;What happened
              before this scene?&quot;)
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <h4 className="font-bold text-slate-800 mb-2">Spatial</h4>
            <p className="text-sm text-slate-600">
              Relative positioning, navigation, geometry. (e.g., &quot;Can the
              sofa fit through the door?&quot;)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

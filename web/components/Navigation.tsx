import clsx from "clsx";

type ViewId = "overview" | "benchmarks" | "models" | "failures";

interface NavigationProps {
  currentView: ViewId;
  onSwitchView: (view: ViewId) => void;
}

export default function Navigation({
  currentView,
  onSwitchView,
}: NavigationProps) {
  const navItems: { id: ViewId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "benchmarks", label: "Benchmark Analysis" },
    { id: "models", label: "Model Arena" },
    { id: "failures", label: "Failure Modes" },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div>
              <h1 className="font-bold text-slate-900 tracking-tight">
                Commonsense Gap Explorer
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Analysis of MLLM Benchmarks & Methodologies
              </p>
            </div>
          </div>
          <div className="flex space-x-1 sm:space-x-8 overflow-x-auto no-scrollbar items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSwitchView(item.id)}
                className={clsx(
                  "px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  currentView === item.id
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

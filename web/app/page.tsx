"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Overview from "@/components/views/Overview";
import BenchmarkAnalysis from "@/components/views/BenchmarkAnalysis";
import ModelArena from "@/components/views/ModelArena";
import FailureModes from "@/components/views/FailureModes";
import { FaGithub } from "react-icons/fa";

type ViewId = "overview" | "benchmarks" | "models" | "failures";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewId>("overview");

  const renderView = () => {
    switch (currentView) {
      case "overview":
        return <Overview onSwitchView={setCurrentView} />;
      case "benchmarks":
        return <BenchmarkAnalysis />;
      case "models":
        return <ModelArena />;
      case "failures":
        return <FailureModes />;
      default:
        return <Overview onSwitchView={setCurrentView} />;
    }
  };

  return (
    <>
      <Navigation currentView={currentView} onSwitchView={setCurrentView} />
      <main className="grow bg-slate-50 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">{renderView()}</div>
      </main>
      <footer className="bg-slate-900 text-slate-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="font-bold text-slate-200">
                Based on the Research Paper:
              </p>
              <p>
                &quot;The Multimodal Commonsense Gap: A Comprehensive
                Analysis...&quot;
              </p>
              <p className="mt-1 text-xs">MD Aadil Rizwan | MNNIT Allahabad</p>
            </div>
            <div className="text-right">
              <a
                href="https://github.com/InFiNiTy0639/CORE_MLLM"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-end gap-1 text-xs text-white hover:text-black transition"
              >
                <FaGithub className="text-xl" />
                <span className="text-xl">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

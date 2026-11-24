import React from 'react';
import { Moon, Sun, Github, Zap, Layers } from 'lucide-react';
import { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  simulationMode: boolean;
  onToggleSimulationMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  simulationMode,
  onToggleSimulationMode
}) => {
  return (
    <header className="h-16 border-b border-cyan-100/80 dark:border-cyan-900/40 bg-white/75 dark:bg-[#111529]/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-[0_2px_15px_rgba(6,182,212,0.04)] dark:shadow-none transition-colors">
      {/* Title & Info */}
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-sans">
            Perplexity Explorer <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-sm shadow-cyan-500/20">2.0</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Inspect causal next-token probabilities, surprisal distributions, and perplexity metrics.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {/* Simulation / Real Model Switcher */}
        <button
          onClick={onToggleSimulationMode}
          title={simulationMode ? 'Switch to Real DistilGPT-2 ONNX' : 'Switch to Fast Simulation'}
          className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-xl border transition-all ${
            simulationMode
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-950/60'
              : 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60 hover:bg-cyan-100 dark:hover:bg-cyan-950/60'
          }`}
        >
          {simulationMode ? <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />}
          <span className="font-semibold hidden md:inline">
            {simulationMode ? 'Fast Simulation' : 'Transformers.js ONNX'}
          </span>
        </button>

        {/* Theme Switcher Button */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to Whitish Cyan Theme' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl bg-cyan-50 dark:bg-slate-800/80 hover:bg-cyan-100 dark:hover:bg-slate-700 text-cyan-800 dark:text-amber-300 border border-cyan-200/70 dark:border-cyan-800/40 transition-all shadow-sm"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-cyan-700" />
          )}
        </button>

        {/* GitHub link */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-cyan-50 dark:bg-slate-800/80 hover:bg-cyan-100 dark:hover:bg-slate-700 text-cyan-800 dark:text-slate-300 border border-cyan-200/70 dark:border-cyan-800/40 transition-all shadow-sm"
          title="GitHub Repository"
        >
          <Github className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
};

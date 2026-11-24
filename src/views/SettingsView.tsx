import React from 'react';
import { 
  Settings, 
  Moon, 
  Sun, 
  Cpu, 
  Zap, 
  Trash2, 
  ShieldCheck, 
  Layers, 
  Check
} from 'lucide-react';
import { Theme } from '../types';
import { clearStoredHistory } from '../utils/storage';

interface SettingsViewProps {
  theme: Theme;
  onToggleTheme: () => void;
  simulationMode: boolean;
  onToggleSimulationMode: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  theme,
  onToggleTheme,
  simulationMode,
  onToggleSimulationMode
}) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
          Settings & Execution Parameters
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Configure model inference engines, color theme, and client-side data management.
        </p>
      </div>

      <div className="space-y-6">
        {/* Inference Engine Selection */}
        <div className="glass-card p-6 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 space-y-4 shadow-md">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Language Model Execution Mode
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Select between authentic in-browser DistilGPT-2 execution via ONNX Runtime Web, or the ultra-fast instant simulation engine.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => { if (simulationMode) onToggleSimulationMode(); }}
              className={`p-5 rounded-2xl text-left border transition-all ${
                !simulationMode
                  ? 'bg-cyan-50/80 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-600 shadow-sm'
                  : 'bg-white dark:bg-[#111529] border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  Hugging Face Transformers.js
                </span>
                {!simulationMode && <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Executes DistilGPT-2 weights locally via WebAssembly / ONNX Runtime. Exact next-token logits and softmax.
              </p>
            </button>

            <button
              onClick={() => { if (!simulationMode) onToggleSimulationMode(); }}
              className={`p-5 rounded-2xl text-left border transition-all ${
                simulationMode
                  ? 'bg-amber-50/80 dark:bg-amber-950/60 border-amber-300 dark:border-amber-600 shadow-sm'
                  : 'bg-white dark:bg-[#111529] border-slate-100 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Fast Simulation Engine
                </span>
                {simulationMode && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Zero network download required. Realistic statistical n-gram probabilities with instant response times.
              </p>
            </button>
          </div>
        </div>

        {/* Theme Preference */}
        <div className="glass-card p-6 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 space-y-4 shadow-md">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-cyan-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            Interface Theme
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Switch smoothly between the cozy whitish-cyan theme and the deep dark mode.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onToggleTheme}
              className="px-4 py-2.5 rounded-2xl bg-cyan-50 dark:bg-slate-800 hover:bg-cyan-100 dark:hover:bg-slate-700 text-cyan-900 dark:text-slate-100 text-xs font-bold flex items-center gap-2 border border-cyan-200 dark:border-slate-700 transition-all shadow-sm"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-700" />}
              <span>Switch to {theme === 'dark' ? 'Whitish Cyan Theme' : 'Dark Mode'}</span>
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Current: <strong className="text-slate-900 dark:text-white capitalize">{theme === 'light' ? 'Whitish Cyan' : 'Dark Mode'}</strong>
            </span>
          </div>
        </div>

        {/* Local Storage & Cache */}
        <div className="glass-card p-6 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 space-y-4 shadow-md">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Storage & Cache Management
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Manage browser-cached model weights and evaluation history.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={() => {
                clearStoredHistory();
                alert('Local calculation history cleared.');
              }}
              className="px-4 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Calculation History</span>
            </button>
          </div>
        </div>

        {/* System & Architecture Info */}
        <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1 font-mono">
          <div className="text-slate-900 dark:text-white font-bold mb-1 font-sans">Architecture Diagnostics:</div>
          <div>• Framework: React 18 + TypeScript + Vite</div>
          <div>• Runtime: Transformers.js (ONNX Runtime Web)</div>
          <div>• Default Model: Xenova/distilgpt2 (Causal LM, 82M parameters, 50,257 vocab)</div>
          <div>• Themes Supported: Whitish Cyan & Cyberpunk Dark</div>
        </div>
      </div>
    </div>
  );
};

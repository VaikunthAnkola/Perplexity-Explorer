import React from 'react';
import { 
  Home, 
  Cpu, 
  FlaskConical, 
  GitCompare, 
  BookOpen, 
  History, 
  Settings,
  Sparkles,
  Zap
} from 'lucide-react';
import { NavigationTab, ModelLoadingProgress } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  modelProgress: ModelLoadingProgress;
  simulationMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  modelProgress,
  simulationMode
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'explorer', label: 'Token Explorer', icon: <Cpu className="w-5 h-5" />, badge: 'LM' },
    { id: 'lab', label: 'Probability Lab', icon: <FlaskConical className="w-5 h-5" />, badge: 'Live' },
    { id: 'comparison', label: 'Sentence Comparison', icon: <GitCompare className="w-5 h-5" /> },
    { id: 'learning', label: 'Learning Center', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'history', label: 'Calculation History', icon: <History className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <aside className="w-64 bg-white/85 dark:bg-[#111529]/95 backdrop-blur-xl border-r border-cyan-100 dark:border-cyan-900/40 flex flex-col h-screen shrink-0 transition-colors select-none shadow-[2px_0_24px_rgba(6,182,212,0.06)] dark:shadow-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-cyan-100/80 dark:border-cyan-900/40 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-sky-400 p-0.5 shadow-md shadow-cyan-500/25">
            <div className="w-full h-full bg-white dark:bg-[#090B16] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 font-sans">
              Perplexity <span className="text-xs px-1.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-mono font-bold border border-cyan-200/50 dark:border-cyan-800/40">2.0</span>
            </h1>
            <p className="text-[10px] text-cyan-700/80 dark:text-cyan-400/80 font-mono tracking-wider font-semibold">LM MECHANICS</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-900/60 dark:text-cyan-400/60 px-3 py-1 font-mono">
          Menu
        </div>

        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/25 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-cyan-900 dark:hover:text-cyan-200 hover:bg-cyan-50/80 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`transition-transform duration-200 ${isActive ? 'scale-110 text-white' : 'text-cyan-600 dark:text-cyan-400 group-hover:scale-105'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider font-bold ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/50'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Model Status Card */}
      <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-b from-cyan-50/90 to-sky-50/60 dark:from-[#171D35] dark:to-[#111529] border border-cyan-200/60 dark:border-cyan-800/40 space-y-2 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-950 dark:text-cyan-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Model Status
          </span>
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              simulationMode ? 'bg-amber-400' : modelProgress.status === 'ready' ? 'bg-emerald-400' : 'bg-cyan-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              simulationMode ? 'bg-amber-500' : modelProgress.status === 'ready' ? 'bg-emerald-500' : 'bg-cyan-500'
            }`}></span>
          </span>
        </div>

        <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
          {simulationMode ? (
            <span className="text-amber-700 dark:text-amber-400 font-semibold">Simulation Mode</span>
          ) : modelProgress.status === 'ready' ? (
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">DistilGPT-2 (Ready)</span>
          ) : modelProgress.status === 'loading' ? (
            <span className="text-cyan-700 dark:text-cyan-400 font-semibold">Loading ({modelProgress.progress}%)</span>
          ) : (
            <span className="text-slate-500">On-Demand ONNX</span>
          )}
        </div>

        {modelProgress.status === 'loading' && (
          <div className="w-full bg-cyan-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-teal-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${modelProgress.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-cyan-100/80 dark:border-cyan-900/40 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span className="font-medium text-cyan-900/70 dark:text-cyan-400/70">Perplexity Lab</span>
        <span className="font-mono text-[10px] text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800/40">
          v2.0
        </span>
      </div>
    </aside>
  );
};

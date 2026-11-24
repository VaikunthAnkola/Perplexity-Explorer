import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomeView } from './views/HomeView';
import { TokenExplorerView } from './views/TokenExplorerView';
import { ProbabilityLabView } from './views/ProbabilityLabView';
import { SentenceComparisonView } from './views/SentenceComparisonView';
import { LearningCenterView } from './views/LearningCenterView';
import { CalculationHistoryView } from './views/CalculationHistoryView';
import { SettingsView } from './views/SettingsView';
import { NavigationTab, Theme, ModelLoadingProgress } from './types';
import { getInitialTheme, applyTheme } from './utils/theme';
import { subscribeModelProgress } from './services/modelService';
import { Menu } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [simulationMode, setSimulationMode] = useState<boolean>(false);
  const [modelProgress, setModelProgress] = useState<ModelLoadingProgress>({ status: 'idle', progress: 0 });
  const [activeSentence, setActiveSentence] = useState<string>('I love Python');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const unsub = subscribeModelProgress((p) => {
      setModelProgress(p);
    });
    return unsub;
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  const handleToggleSimulationMode = () => {
    setSimulationMode(prev => !prev);
  };

  const handleRunSentenceInExplorer = (sentence: string) => {
    setActiveSentence(sentence);
    setCurrentTab('explorer');
    setMobileMenuOpen(false);
  };

  return (
    <div className={`flex h-screen overflow-hidden relative selection:bg-cyan-200 selection:text-cyan-900 transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#090B16] via-[#0E1326] to-[#12182D] text-[#F8FAFC]'
        : 'bg-gradient-to-br from-[#F0FDFD] via-[#F8FCFC] to-[#E6F7F9] text-slate-800'
    }`}>
      {/* Decorative cozy atmospheric ambient orbs */}
      <div className={`absolute top-0 right-1/4 -mt-24 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-0 transition-opacity duration-500 ${
        theme === 'dark' ? 'bg-purple-900/20' : 'bg-cyan-200/40'
      }`} />
      <div className={`absolute bottom-0 left-1/3 -mb-32 w-80 h-80 rounded-full blur-3xl pointer-events-none -z-0 transition-opacity duration-500 ${
        theme === 'dark' ? 'bg-cyan-900/20' : 'bg-teal-100/60'
      }`} />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block z-10">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
          }}
          modelProgress={modelProgress}
          simulationMode={simulationMode}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                setMobileMenuOpen(false);
              }}
              modelProgress={modelProgress}
              simulationMode={simulationMode}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-3 text-cyan-800 dark:text-cyan-400 hover:text-cyan-950 dark:hover:text-cyan-200"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <Header
              theme={theme}
              onToggleTheme={handleToggleTheme}
              simulationMode={simulationMode}
              onToggleSimulationMode={handleToggleSimulationMode}
            />
          </div>
        </div>

        {/* View Container with Scroll */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {currentTab === 'home' && (
            <HomeView
              onNavigate={(tab) => setCurrentTab(tab)}
              onRunQuickExample={handleRunSentenceInExplorer}
            />
          )}

          {currentTab === 'explorer' && (
            <TokenExplorerView
              initialSentence={activeSentence}
              simulationMode={simulationMode}
              onToggleSimulationMode={handleToggleSimulationMode}
            />
          )}

          {currentTab === 'lab' && (
            <ProbabilityLabView />
          )}

          {currentTab === 'comparison' && (
            <SentenceComparisonView
              simulationMode={simulationMode}
            />
          )}

          {currentTab === 'learning' && (
            <LearningCenterView />
          )}

          {currentTab === 'history' && (
            <CalculationHistoryView
              onLoadSentence={handleRunSentenceInExplorer}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              theme={theme}
              onToggleTheme={handleToggleTheme}
              simulationMode={simulationMode}
              onToggleSimulationMode={handleToggleSimulationMode}
            />
          )}
        </main>
      </div>
    </div>
  );
};
export default App;

import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  FlaskConical, 
  GitCompare, 
  Zap, 
  Layers
} from 'lucide-react';
import { NavigationTab } from '../types';

interface HomeViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onRunQuickExample: (sentence: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onRunQuickExample
}) => {
  const quickExamples = [
    'I love Python',
    'The capital of France is Paris',
    'Artificial intelligence is changing the world',
    'Machine learning is fascinating'
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#F5FCFC] to-[#E6F8F9] dark:from-[#171D35] dark:via-[#111529] dark:to-[#090B16] border border-cyan-200/70 dark:border-cyan-500/20 p-8 sm:p-12 shadow-[0_12px_40px_rgba(6,182,212,0.08)] dark:shadow-none transition-colors">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-200/30 dark:bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-72 h-72 rounded-full bg-teal-100/50 dark:bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200/80 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Interactive Language Model & Perplexity Explorer</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Demystify Language Models & <span className="text-gradient-cyan">Perplexity</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Understand how autoregressive models predict the next token, calculate conditional probability distributions via softmax, and derive sequence perplexity scores.
          </p>

          <div className="flex flex-wrap gap-4 pt-3">
            <button
              onClick={() => onNavigate('explorer')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-600/25 transition-all hover:scale-[1.02]"
            >
              <Cpu className="w-5 h-5 text-cyan-100" />
              <span>Launch Token Explorer</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('lab')}
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-cyan-50/80 dark:hover:bg-slate-800 text-cyan-900 dark:text-cyan-200 border border-cyan-200/80 dark:border-cyan-700/50 font-bold text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <FlaskConical className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>Probability Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch Pre-loaded Examples */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-cyan-900/70 dark:text-cyan-400/80 flex items-center gap-2 uppercase tracking-wider font-mono">
            <Zap className="w-4 h-4 text-amber-500" /> Quick Example Explorations
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Click any sentence to test in Token Explorer</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickExamples.map((ex, i) => (
            <button
              key={i}
              onClick={() => onRunQuickExample(ex)}
              className="glass-card text-left p-4 rounded-2xl group hover:border-cyan-400 transition-all flex flex-col justify-between h-28"
            >
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors line-clamp-2">
                "{ex}"
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span className="font-mono text-cyan-700 dark:text-cyan-400 font-semibold">Example #{i + 1}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-cyan-600 dark:text-cyan-400 font-bold">
                  Analyze <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Educational Architecture Diagram */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Causal Language Model Prediction Pipeline
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            How a causal Transformer processes tokens autoregressively from input prompt to perplexity calculation.
          </p>
        </div>

        {/* Pipeline steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 relative">
          <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-100 dark:border-slate-800 flex flex-col justify-between">
            <div className="text-xs font-mono text-cyan-700 dark:text-cyan-400 font-bold mb-1">Step 1</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mb-2">Tokenization</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Splits text into subwords (BPE), mapping each chunk to a numeric vocabulary ID.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-100 dark:border-slate-800 flex flex-col justify-between">
            <div className="text-xs font-mono text-cyan-700 dark:text-cyan-400 font-bold mb-1">Step 2</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mb-2">Causal Context</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Masked self-attention ensures token <code className="text-cyan-800 dark:text-cyan-300 font-bold">i</code> only attends to past tokens <code className="text-cyan-800 dark:text-cyan-300 font-bold">0...i-1</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-100 dark:border-slate-800 flex flex-col justify-between">
            <div className="text-xs font-mono text-cyan-700 dark:text-cyan-400 font-bold mb-1">Step 3</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mb-2">Logits & Softmax</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Output projection generates unnormalized logits across 50k tokens; softmax converts them to probabilities.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-100 dark:border-slate-800 flex flex-col justify-between">
            <div className="text-xs font-mono text-cyan-700 dark:text-cyan-400 font-bold mb-1">Step 4</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mb-2">Cross-Entropy Loss</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Computes negative log-likelihood <code className="text-cyan-800 dark:text-cyan-300 font-bold">-ln(P(t))</code> for the actual token observed.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-100/70 to-teal-50 dark:from-cyan-950/40 dark:to-teal-950/30 border border-cyan-300/80 dark:border-cyan-700 flex flex-col justify-between shadow-sm">
            <div className="text-xs font-mono text-teal-800 dark:text-teal-300 font-bold mb-1">Step 5</div>
            <div className="text-sm font-bold text-teal-950 dark:text-white mb-2">Perplexity Score</div>
            <p className="text-xs text-teal-900 dark:text-teal-200 leading-relaxed font-medium">
              Exponentiates average loss: <code className="text-teal-950 dark:text-cyan-300 font-bold">exp(Loss)</code> representing effective branching factor.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => onNavigate('explorer')}
          className="glass-card p-6 rounded-3xl cursor-pointer group hover:border-cyan-300 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-100/80 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-700 dark:text-cyan-400 mb-4 group-hover:scale-110 transition-transform shadow-sm">
            <Cpu className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
            Token Explorer
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Run DistilGPT-2 inside your browser. Inspect token-by-token probabilities, top vocabulary candidates, and surprisal.
          </p>
          <div className="flex items-center text-xs font-bold text-cyan-700 dark:text-cyan-400 mt-4 group-hover:translate-x-1 transition-transform">
            Explore Tokens <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('lab')}
          className="glass-card p-6 rounded-3xl cursor-pointer group hover:border-teal-300 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-100/80 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400 mb-4 group-hover:scale-110 transition-transform shadow-sm">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
            Probability Laboratory
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Experiment without downloading any model weights. Add tokens, adjust sliders, test presets, and see step-by-step math.
          </p>
          <div className="flex items-center text-xs font-bold text-teal-700 dark:text-teal-400 mt-4 group-hover:translate-x-1 transition-transform">
            Open Laboratory <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('comparison')}
          className="glass-card p-6 rounded-3xl cursor-pointer group hover:border-sky-300 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-100/80 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-700 dark:text-sky-400 mb-4 group-hover:scale-110 transition-transform shadow-sm">
            <GitCompare className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
            Sentence Comparison
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Compare two sentences side-by-side to understand why natural sequences have lower perplexity than anomalous text.
          </p>
          <div className="flex items-center text-xs font-bold text-sky-700 dark:text-sky-400 mt-4 group-hover:translate-x-1 transition-transform">
            Compare Sentences <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Info, 
  BarChart3, 
  Layers, 
  CheckCircle, 
  Cpu, 
  Zap, 
  ChevronRight,
  Calculator
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import confetti from 'canvas-confetti';
import { TokenPrediction, PerplexityResult, ModelLoadingProgress } from '../types';
import { calculateModelPerplexity, subscribeModelProgress } from '../services/modelService';
import { CircularGauge } from '../components/CircularGauge';
import { TokenInspectorModal } from '../components/TokenInspectorModal';
import { getProbabilityTier } from '../utils/perplexity';
import { saveHistoryItem } from '../utils/storage';

interface TokenExplorerViewProps {
  initialSentence?: string;
  simulationMode: boolean;
  onToggleSimulationMode: () => void;
}

export const TokenExplorerView: React.FC<TokenExplorerViewProps> = ({
  initialSentence = 'I love Python',
  simulationMode,
  onToggleSimulationMode
}) => {
  const [inputText, setInputText] = useState(initialSentence);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<PerplexityResult | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenPrediction | null>(null);
  const [modelProgress, setModelProgress] = useState<ModelLoadingProgress>({ status: 'idle', progress: 0 });
  const [showFormulaSteps, setShowFormulaSteps] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const exampleSentences = [
    'I love Python',
    'The capital of France is Paris',
    'Artificial intelligence is changing the world',
    'Machine learning is fascinating'
  ];

  useEffect(() => {
    const unsubscribe = subscribeModelProgress((p) => {
      setModelProgress(p);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (initialSentence && initialSentence !== inputText) {
      setInputText(initialSentence);
    }
  }, [initialSentence]);

  useEffect(() => {
    handleCalculate(inputText);
  }, []);

  const handleCalculate = async (textToRun?: string) => {
    const text = (textToRun !== undefined ? textToRun : inputText).trim();
    if (!text) {
      setErrorMessage('Please enter at least one word to calculate perplexity.');
      return;
    }

    setErrorMessage(null);
    setIsCalculating(true);

    try {
      const res = await calculateModelPerplexity(text, simulationMode);
      setResult(res);

      saveHistoryItem({
        sentence: res.sentence,
        perplexity: res.perplexity,
        tokenCount: res.totalTokens,
        evaluatedTokens: res.evaluatedTokens,
        averageNll: res.averageNll,
        modelName: res.modelName
      });

      if (res.perplexity < 15) {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred during perplexity calculation.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Cpu className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
            Explore Language Model Predictions
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Tokenize sequences, inspect conditional softmax probabilities, and observe sequence perplexity.
          </p>
        </div>

        {/* Engine mode indicator pill */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onToggleSimulationMode}
            className={`text-xs px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 transition-all shadow-sm ${
              simulationMode
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
            }`}
          >
            {simulationMode ? <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <CheckCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
            <span className="font-bold">{simulationMode ? 'Fast Simulation' : 'Transformers.js DistilGPT-2'}</span>
          </button>
        </div>
      </div>

      {/* Input Box Card */}
      <div className="glass-card p-6 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 space-y-4 shadow-md">
        <label className="block text-xs uppercase tracking-wider font-mono text-cyan-900/70 dark:text-cyan-400 font-bold">
          Enter Sentence to Evaluate
        </label>

        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCalculate();
              }
            }}
            placeholder="Type any sentence here... (e.g. The capital of France is Paris)"
            rows={3}
            className="w-full bg-[#F6FCFC] dark:bg-[#111529] border border-cyan-200/80 dark:border-cyan-500/30 rounded-2xl p-4 text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/20 transition-all font-sans resize-none shadow-inner"
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-mono">
            {inputText.length} chars
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Example Buttons & Calculate Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Examples:</span>
            {exampleSentences.map((example, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(example);
                  handleCalculate(example);
                }}
                className="text-xs px-3 py-1.5 rounded-xl bg-cyan-50/80 dark:bg-slate-800/80 hover:bg-cyan-100 dark:hover:bg-slate-700 text-cyan-900 dark:text-slate-200 border border-cyan-200/70 dark:border-cyan-800/50 transition-all font-medium"
              >
                {example}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleCalculate()}
            disabled={isCalculating}
            className={`px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              isCalculating
                ? 'bg-cyan-800 text-slate-200 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-500 hover:from-cyan-500 hover:to-teal-500 text-white shadow-cyan-600/25 hover:scale-[1.02]'
            }`}
          >
            {isCalculating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-100" />
                <span>Computing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-100" />
                <span>Calculate Perplexity</span>
              </>
            )}
          </button>
        </div>

        {/* Model Loading Progress State */}
        {modelProgress.status === 'loading' && !simulationMode && (
          <div className="mt-4 p-4 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-900 dark:text-cyan-300 font-bold flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-600 dark:text-cyan-400" />
                {modelProgress.message || 'Loading DistilGPT-2 ONNX weights...'}
              </span>
              <span className="font-mono text-cyan-800 dark:text-cyan-300 font-extrabold">
                {modelProgress.progress}%
              </span>
            </div>
            <div className="w-full bg-cyan-200/50 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${modelProgress.progress}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between font-mono">
              <span>Browser-based ONNX Runtime Web</span>
              {modelProgress.file && <span>{modelProgress.file}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Metric Cards & Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Prominent Circular Gauge */}
            <div className="glass-card p-6 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 flex flex-col items-center justify-center shadow-md">
              <CircularGauge value={result.perplexity} />
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-cyan-100 dark:border-cyan-900/40">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    Evaluation Summary
                  </h3>
                  <span className="text-xs font-mono text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-200/60 dark:border-cyan-800/60 font-semibold">
                    {result.inferenceTimeMs}ms execution
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-5">
                  <div className="p-3.5 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-100 dark:border-slate-800">
                    <span className="text-[10px] text-cyan-800/80 dark:text-cyan-400 font-mono uppercase font-bold block">Total Tokens</span>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">{result.totalTokens}</span>
                    <span className="text-[10px] text-slate-500">Including prompt seed</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-100 dark:border-slate-800">
                    <span className="text-[10px] text-cyan-800/80 dark:text-cyan-400 font-mono uppercase font-bold block">Evaluated (N)</span>
                    <span className="text-2xl font-extrabold text-teal-700 dark:text-teal-300 mt-1 block">{result.evaluatedTokens}</span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400">Conditional next tokens</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-100 dark:border-slate-800">
                    <span className="text-[10px] text-cyan-800/80 dark:text-cyan-400 font-mono uppercase font-bold block">Average NLL</span>
                    <span className="text-2xl font-extrabold text-sky-700 dark:text-sky-300 mt-1 block">{result.averageNll.toFixed(3)}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Cross-entropy loss</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-100/70 to-teal-50 dark:from-cyan-950/60 dark:to-teal-950/50 border border-cyan-300 dark:border-cyan-700">
                    <span className="text-[10px] text-cyan-900 dark:text-cyan-300 font-mono uppercase font-bold block">Perplexity</span>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">{result.perplexity.toFixed(2)}</span>
                    <span className="text-[10px] text-teal-800 dark:text-teal-300 font-semibold">exp(Average NLL)</span>
                  </div>
                </div>
              </div>

              {/* Strict Pedagogical Explanation Banner */}
              <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-[#111529] border border-cyan-200/60 dark:border-cyan-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
                <Info className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">
                    "Perplexity measures how surprised a language model is by a sequence of tokens. Lower perplexity means the model assigned higher probabilities to the observed tokens."
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Note: Perplexity is not a direct measure of factual accuracy or text quality. It strictly quantifies statistical predictability according to this model's learned distribution.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Token Visualization Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  Interactive Token-by-Token Visualizer
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any token card to inspect logits, preceding context, and top rival predictions.
                </p>
              </div>

              {/* Color legend */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> High (&ge; 35%)
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium (8-34%)
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Low (&lt; 8%)
                </span>
              </div>
            </div>

            {/* Grid of interactive token cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {result.tokens.map((token) => {
                const isContextStart = token.isContextToken || token.id === 0;
                const tier = getProbabilityTier(token.probability);

                return (
                  <button
                    key={token.id}
                    onClick={() => setSelectedToken(token)}
                    className={`text-left p-3.5 rounded-2xl border transition-all duration-200 group hover:scale-[1.03] hover:shadow-md relative overflow-hidden bg-white dark:bg-[#171D35] ${
                      isContextStart
                        ? 'border-sky-200 dark:border-sky-800 hover:border-sky-400'
                        : `${tier.borderClass} hover:border-cyan-400`
                    }`}
                  >
                    {/* Top index & badge */}
                    <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                      <span className="text-slate-400 dark:text-slate-500 font-semibold">#{token.id}</span>
                      {isContextStart ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800">
                          Seed
                        </span>
                      ) : (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${tier.bgClass}`}>
                          {(token.probability * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>

                    {/* Token String Display */}
                    <div className="font-mono text-base font-bold text-slate-900 dark:text-white mb-2 truncate group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                      "{token.text}"
                    </div>

                    {/* Metrics in card */}
                    <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>-ln(P):</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {isContextStart ? '—' : token.negLogProb.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rank:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {isContextStart ? '—' : `#${token.rank || 1}`}
                        </span>
                      </div>
                    </div>

                    {/* Animated Probability Bar at bottom */}
                    {!isContextStart && (
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                        <div
                          className="h-1.5 rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.max(5, token.probability * 100)}%`,
                            backgroundColor: tier.color
                          }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recharts Probability & Loss Chart */}
          <div className="glass-card p-6 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  Token Probability Distribution
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Visualizing conditional probability assigned to each token in sequence.
                </p>
              </div>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={result.tokens.filter(t => !t.isContextToken).map(t => ({
                    token: t.text.trim() || '[space]',
                    probability: Number((t.probability * 100).toFixed(1)),
                    negLogProb: Number(t.negLogProb.toFixed(2)),
                    color: getProbabilityTier(t.probability).color
                  }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <XAxis 
                    dataKey="token" 
                    stroke="#94A3B8" 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                  />
                  <YAxis 
                    stroke="#94A3B8" 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                    unit="%" 
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(23, 29, 53, 0.95)',
                      borderColor: 'rgba(6, 182, 212, 0.4)',
                      borderRadius: '16px',
                      color: '#F8FAFC',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
                    }}
                    formatter={(val: any) => [`${val}%`, 'Conditional Probability']}
                  />
                  <Bar dataKey="probability" radius={[6, 6, 0, 0]}>
                    {result.tokens.filter(t => !t.isContextToken).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getProbabilityTier(entry.probability).color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Step-by-Step Mathematical Calculation Breakdown */}
          <div className="glass-card p-6 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 space-y-4 shadow-md">
            <button
              onClick={() => setShowFormulaSteps(!showFormulaSteps)}
              className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900 dark:text-white hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <span>Mathematical Calculation Breakdown (Step-by-Step)</span>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${showFormulaSteps ? 'rotate-90 text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
            </button>

            {showFormulaSteps && (
              <div className="pt-2 space-y-3 text-xs font-mono text-slate-700 dark:text-slate-300 border-t border-cyan-100 dark:border-cyan-900/40">
                <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-[#111529] border border-cyan-200/70 dark:border-slate-800 space-y-2">
                  <div className="text-cyan-900 dark:text-cyan-300 font-bold font-sans text-sm">
                    Perplexity Formula: Perplexity = exp(-1/N × ∑ ln(P(token_i)))
                  </div>
                  {result.calculationBreakdown.formulaSteps.map((step, idx) => (
                    <div key={idx} className="text-slate-800 dark:text-slate-200">
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal for token inspection */}
      <TokenInspectorModal
        token={selectedToken}
        allTokens={result ? result.tokens : []}
        onClose={() => setSelectedToken(null)}
      />
    </div>
  );
};

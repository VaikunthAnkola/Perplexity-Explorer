import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Calculator, 
  Layers
} from 'lucide-react';
import { LabToken } from '../types';
import { calculatePerplexityFromProbabilities, getProbabilityTier } from '../utils/perplexity';
import { CircularGauge } from '../components/CircularGauge';

export const ProbabilityLabView: React.FC = () => {
  const presets = {
    A: {
      name: 'Preset A (Uniform 0.125)',
      description: 'All probabilities = 0.125. Expected perplexity = 8.00',
      tokens: [
        { id: '1', name: 'apple', probability: 0.125 },
        { id: '2', name: 'banana', probability: 0.125 },
        { id: '3', name: 'cherry', probability: 0.125 },
        { id: '4', name: 'date', probability: 0.125 }
      ]
    },
    B: {
      name: 'Preset B (High Confidence)',
      description: 'High probabilities: 0.90, 0.95, 0.85. Low perplexity (~1.12)',
      tokens: [
        { id: '1', name: 'I', probability: 0.90 },
        { id: '2', name: 'love', probability: 0.95 },
        { id: '3', name: 'coding', probability: 0.85 }
      ]
    },
    C: {
      name: 'Preset C (Low Confidence)',
      description: 'Low probabilities: 0.10, 0.15, 0.08. High perplexity (~9.4)',
      tokens: [
        { id: '1', name: 'The', probability: 0.10 },
        { id: '2', name: 'purple', probability: 0.15 },
        { id: '3', name: 'submarine', probability: 0.08 }
      ]
    },
    D: {
      name: 'Preset D (Mixed Probabilities)',
      description: 'Mixed probabilities: 0.50, 0.80, 0.20. Intermediate perplexity (~4.3)',
      tokens: [
        { id: '1', name: 'Machine', probability: 0.50 },
        { id: '2', name: 'learning', probability: 0.80 },
        { id: '3', name: 'fascinating', probability: 0.20 }
      ]
    }
  };

  const [tokens, setTokens] = useState<LabToken[]>(presets.A.tokens);
  const [activePresetKey, setActivePresetKey] = useState<string>('A');

  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (tokens.length === 0) {
      errors.push('Please add at least one token to evaluate perplexity.');
    }
    tokens.forEach((t, i) => {
      if (t.probability <= 0 || t.probability > 1 || isNaN(t.probability)) {
        errors.push(`Token "${t.name}" (Row #${i + 1}): Probability must be strictly greater than 0 and at most 1 (found ${t.probability}).`);
      }
    });
    return errors;
  }, [tokens]);

  const isValid = validationErrors.length === 0;

  const calculation = useMemo(() => {
    if (!isValid) return null;
    const probs = tokens.map(t => t.probability);
    return calculatePerplexityFromProbabilities(probs);
  }, [tokens, isValid]);

  const handleUpdateProbability = (id: string, newProb: number) => {
    setTokens(prev => prev.map(t => (t.id === id ? { ...t, probability: newProb } : t)));
    setActivePresetKey('');
  };

  const handleUpdateName = (id: string, newName: string) => {
    setTokens(prev => prev.map(t => (t.id === id ? { ...t, name: newName } : t)));
  };

  const handleAddToken = () => {
    const nextIdx = tokens.length + 1;
    const newToken: LabToken = {
      id: Date.now().toString(),
      name: `token_${nextIdx}`,
      probability: 0.25
    };
    setTokens(prev => [...prev, newToken]);
    setActivePresetKey('');
  };

  const handleRemoveToken = (id: string) => {
    if (tokens.length <= 1) return;
    setTokens(prev => prev.filter(t => t.id !== id));
    setActivePresetKey('');
  };

  const handleApplyPreset = (key: 'A' | 'B' | 'C' | 'D') => {
    setTokens(presets[key].tokens);
    setActivePresetKey(key);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <FlaskConical className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
            Probability Laboratory
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Interactive mathematical sandbox. Modify token probabilities and observe instant perplexity recalculation without model inference.
          </p>
        </div>

        <button
          onClick={handleAddToken}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-cyan-600/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Token</span>
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="glass-card p-5 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 space-y-3 shadow-md">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-900/70 dark:text-cyan-400 font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          Mathematical Presets (Instant Demonstration)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.keys(presets) as Array<'A' | 'B' | 'C' | 'D'>).map((key) => {
            const p = presets[key];
            const isSelected = activePresetKey === key;
            return (
              <button
                key={key}
                onClick={() => handleApplyPreset(key)}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/60 dark:to-teal-950/50 border-cyan-400 dark:border-cyan-500 shadow-sm'
                    : 'bg-white dark:bg-[#111529] border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Validation Alert */}
      {!isValid && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs space-y-1 font-medium">
          <div className="font-bold flex items-center gap-2 text-rose-900 dark:text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" /> Validation Error
          </div>
          {validationErrors.map((err, i) => (
            <div key={i}>• {err}</div>
          ))}
        </div>
      )}

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Token Table & Sliders */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 space-y-5 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Token Probability Parameters
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">
              {tokens.length} Tokens in Sequence
            </span>
          </div>

          <div className="space-y-3">
            {tokens.map((token, index) => {
              const p = token.probability;
              const invP = p > 0 ? (1 / p).toFixed(2) : '∞';
              const negLogP = p > 0 ? (-Math.log(p)).toFixed(3) : '∞';

              return (
                <div
                  key={token.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#111529] border border-cyan-100 dark:border-slate-800 space-y-3 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Token Name Input */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-cyan-800/80 dark:text-cyan-400 font-bold w-5">#{index + 1}</span>
                      <input
                        type="text"
                        value={token.name}
                        onChange={(e) => handleUpdateName(token.id, e.target.value)}
                        className="bg-cyan-50/50 dark:bg-[#090B16] border border-cyan-200 dark:border-slate-700 rounded-xl px-3 py-1 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 w-32 font-semibold"
                        placeholder="Token name"
                      />
                    </div>

                    {/* Quick values display */}
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-semibold">P(token)</span>
                        <span className="text-slate-900 dark:text-white font-bold">{p.toFixed(3)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-semibold">1 / P</span>
                        <span className="text-cyan-700 dark:text-cyan-400 font-bold">{invP}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-semibold">-ln(P)</span>
                        <span className="text-teal-700 dark:text-teal-400 font-bold">{negLogP}</span>
                      </div>

                      {/* Remove token */}
                      <button
                        onClick={() => handleRemoveToken(token.id)}
                        disabled={tokens.length <= 1}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete token"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Slider & Number Input */}
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0.001"
                      max="1.0"
                      step="0.005"
                      value={token.probability}
                      onChange={(e) => handleUpdateProbability(token.id, parseFloat(e.target.value))}
                      className="flex-1 accent-cyan-600 cursor-pointer h-2 bg-cyan-100 dark:bg-slate-800 rounded-lg appearance-none"
                    />

                    <input
                      type="number"
                      min="0.001"
                      max="1.0"
                      step="0.01"
                      value={token.probability}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        handleUpdateProbability(token.id, isNaN(val) ? 0 : val);
                      }}
                      className="w-20 bg-cyan-50/50 dark:bg-[#090B16] border border-cyan-200 dark:border-slate-700 rounded-xl px-2 py-1 text-xs font-mono text-slate-900 dark:text-white text-right focus:outline-none focus:border-cyan-500 font-bold"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Perplexity Output & Gauge */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 flex flex-col items-center justify-center shadow-md">
            {calculation ? (
              <CircularGauge value={calculation.perplexity} />
            ) : (
              <div className="p-8 text-center text-slate-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
                Fix probability validation errors to compute perplexity.
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          {calculation && (
            <div className="glass-card p-5 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 space-y-3 shadow-md">
              <h4 className="text-xs uppercase font-mono tracking-wider text-cyan-900/70 dark:text-cyan-400 font-bold">
                Summary Metrics
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-cyan-50/50 dark:bg-[#111529]">
                  <span className="text-slate-600 dark:text-slate-400">Tokens Evaluated (N):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{tokens.length}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-cyan-50/50 dark:bg-[#111529]">
                  <span className="text-slate-600 dark:text-slate-400">Sum of -ln(P):</span>
                  <span className="font-mono font-bold text-cyan-800 dark:text-cyan-300">{calculation.sumNegLogProb.toFixed(4)}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-cyan-50/50 dark:bg-[#111529]">
                  <span className="text-slate-600 dark:text-slate-400">Average NLL (Loss):</span>
                  <span className="font-mono font-bold text-teal-800 dark:text-teal-300">{calculation.averageNll.toFixed(4)}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-gradient-to-r from-cyan-100 to-teal-50 dark:from-cyan-950/60 dark:to-teal-950/50 border border-cyan-300 dark:border-cyan-700">
                  <span className="text-teal-900 dark:text-teal-200 font-bold">Final Perplexity:</span>
                  <span className="font-mono font-extrabold text-slate-900 dark:text-white text-sm">{calculation.perplexity.toFixed(3)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step-by-Step Calculation Walkthrough */}
      {calculation && (
        <div className="glass-card p-6 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 space-y-4 shadow-md">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Step-by-Step Mathematical Derivation
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-800 dark:text-slate-200">
            {/* Left side: Logarithmic Formulation */}
            <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-100 dark:border-slate-800 space-y-2.5">
              <div className="font-sans font-bold text-sm text-cyan-900 dark:text-cyan-300">
                Method A: Exponentiated Cross-Entropy Loss
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-sans">
                Standard formulation used in deep learning for numerical stability:
              </p>
              <div className="text-cyan-900 dark:text-cyan-300 bg-white dark:bg-[#090B16] p-2.5 rounded-xl border border-cyan-200 dark:border-slate-700 font-bold">
                Perplexity = exp( -1/N × ∑ ln(P_i) )
              </div>
              <div className="space-y-1 text-slate-700 dark:text-slate-300 pt-1">
                <div>1. ∑ -ln(P_i) = {calculation.sumNegLogProb.toFixed(4)}</div>
                <div>2. Cross-Entropy Loss L = {calculation.sumNegLogProb.toFixed(4)} / {tokens.length} = {calculation.averageNll.toFixed(4)}</div>
                <div>3. Perplexity = exp({calculation.averageNll.toFixed(4)}) = <strong className="text-cyan-950 dark:text-white font-bold">{calculation.perplexity.toFixed(4)}</strong></div>
              </div>
            </div>

            {/* Right side: Geometric Mean of Inverse Probabilities */}
            <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-[#111529] border border-teal-100 dark:border-slate-800 space-y-2.5">
              <div className="font-sans font-bold text-sm text-teal-900 dark:text-teal-300">
                Method B: Geometric Mean of Inverse Probabilities
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-sans">
                Intuitive interpretation as the average branching factor:
              </p>
              <div className="text-teal-900 dark:text-teal-300 bg-white dark:bg-[#090B16] p-2.5 rounded-xl border border-teal-200 dark:border-slate-700 font-bold">
                Perplexity = ( ∏ 1/P_i ) ^ (1/N)
              </div>
              <div className="space-y-1 text-slate-700 dark:text-slate-300 pt-1">
                <div>1. Inverse probabilities: {tokens.map(t => (1 / t.probability).toFixed(1)).join(' × ')}</div>
                <div>2. Product (∏ 1/P_i) = {calculation.productInverseProb !== Infinity ? calculation.productInverseProb.toFixed(2) : 'overflow (huge)'}</div>
                <div>3. N-th root = <strong className="text-teal-950 dark:text-white font-bold">{calculation.perplexity.toFixed(4)}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

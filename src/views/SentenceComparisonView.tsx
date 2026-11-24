import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  Scale
} from 'lucide-react';
import { PerplexityResult } from '../types';
import { calculateModelPerplexity } from '../services/modelService';

interface SentenceComparisonViewProps {
  simulationMode: boolean;
}

export const SentenceComparisonView: React.FC<SentenceComparisonViewProps> = ({
  simulationMode
}) => {
  const comparisonPresets = [
    {
      title: 'Grammatical vs Jumbled Syntax',
      sentenceA: 'The quick brown fox jumps over the lazy dog',
      sentenceB: 'The quick brown fox jumps lazy dog over the',
      context: 'Both contain identical vocabulary, but Sentence B breaks English syntax, causing much higher surprise.'
    },
    {
      title: 'Expected Knowledge vs Unlikely Token',
      sentenceA: 'The capital of France is Paris',
      sentenceB: 'The capital of France is Xylophone',
      context: 'LM assigns very high probability to "Paris" following "capital of France is", while "Xylophone" receives near-zero probability.'
    },
    {
      title: 'Fluent AI Context vs Rare Phrasing',
      sentenceA: 'Artificial intelligence is changing the world',
      sentenceB: 'Artificial intelligence is transmuting the cosmos',
      context: 'Common collocations have higher n-gram probability in web corpora than elevated, archaic synonyms.'
    }
  ];

  const [sentenceA, setSentenceA] = useState(comparisonPresets[0].sentenceA);
  const [sentenceB, setSentenceB] = useState(comparisonPresets[0].sentenceB);
  const [isComparing, setIsComparing] = useState(false);
  const [resultA, setResultA] = useState<PerplexityResult | null>(null);
  const [resultB, setResultB] = useState<PerplexityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    runComparison(sentenceA, sentenceB);
  }, []);

  const runComparison = async (textA?: string, textB?: string) => {
    const a = (textA !== undefined ? textA : sentenceA).trim();
    const b = (textB !== undefined ? textB : sentenceB).trim();

    if (!a || !b) {
      setError('Please provide text for both Sentence A and Sentence B.');
      return;
    }

    setError(null);
    setIsComparing(true);

    try {
      const [resA, resB] = await Promise.all([
        calculateModelPerplexity(a, simulationMode),
        calculateModelPerplexity(b, simulationMode)
      ]);
      setResultA(resA);
      setResultB(resB);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error running comparison');
    } finally {
      setIsComparing(false);
    }
  };

  const handleApplyPreset = (preset: typeof comparisonPresets[0]) => {
    setSentenceA(preset.sentenceA);
    setSentenceB(preset.sentenceB);
    runComparison(preset.sentenceA, preset.sentenceB);
  };

  const ratio = resultA && resultB && resultA.perplexity > 0 ? (resultB.perplexity / resultA.perplexity).toFixed(1) : '1.0';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <GitCompare className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
            Compare Two Sentences
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Evaluate two distinct sequences using the exact same causal language model and tokenization parameters.
          </p>
        </div>

        <button
          onClick={() => runComparison()}
          disabled={isComparing}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-cyan-600/20 transition-all self-start md:self-auto disabled:opacity-50"
        >
          {isComparing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
          <span>{isComparing ? 'Comparing...' : 'Compare Sentences'}</span>
        </button>
      </div>

      {/* Critical Educational Methodology Callout */}
      <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-950 dark:text-amber-200 font-bold block text-sm mb-0.5">
            Crucial Scientific Evaluation Constraint:
          </strong>
          Perplexity comparisons are only mathematically meaningful when evaluated using the exact same language model, vocabulary, and tokenizer settings. Never compare raw perplexity across different model architectures or tokenizers.
        </div>
      </div>

      {/* Presets */}
      <div className="glass-card p-5 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 space-y-3 shadow-md">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-900/70 dark:text-cyan-400 font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Curated Pedagogical Presets
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {comparisonPresets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="p-4 rounded-2xl text-left bg-white dark:bg-[#111529] border border-slate-100 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all group shadow-sm"
            >
              <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                {p.title}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {p.context}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sentence A Box */}
        <div className="glass-card p-5 rounded-3xl border border-cyan-200/80 dark:border-cyan-800/60 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 inline-block" /> Sentence A
            </span>
            {resultA && (
              <span className="text-xs font-mono text-cyan-800 dark:text-cyan-300 font-bold bg-cyan-50 dark:bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800">
                PPL: {resultA.perplexity.toFixed(2)}
              </span>
            )}
          </div>
          <textarea
            value={sentenceA}
            onChange={(e) => setSentenceA(e.target.value)}
            rows={3}
            placeholder="Type Sentence A..."
            className="w-full bg-[#F6FCFC] dark:bg-[#111529] border border-cyan-200/80 dark:border-cyan-500/30 rounded-2xl p-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-all resize-none shadow-inner"
          />
        </div>

        {/* Sentence B Box */}
        <div className="glass-card p-5 rounded-3xl border border-teal-200/80 dark:border-teal-800/60 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" /> Sentence B
            </span>
            {resultB && (
              <span className="text-xs font-mono text-teal-800 dark:text-teal-300 font-bold bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                PPL: {resultB.perplexity.toFixed(2)}
              </span>
            )}
          </div>
          <textarea
            value={sentenceB}
            onChange={(e) => setSentenceB(e.target.value)}
            rows={3}
            placeholder="Type Sentence B..."
            className="w-full bg-[#F6FCFC] dark:bg-[#111529] border border-teal-200/80 dark:border-teal-500/30 rounded-2xl p-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-all resize-none shadow-inner"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Comparison Results */}
      {resultA && resultB && (
        <div className="space-y-6">
          {/* Comparison Summary Banner */}
          <div className="glass-card p-6 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 shadow-md space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Comparative Analysis & Explanation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-200 dark:border-cyan-800">
                <span className="text-xs text-cyan-800 dark:text-cyan-300 font-mono uppercase font-bold block">Sentence A Perplexity</span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 block">{resultA.perplexity.toFixed(2)}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{resultA.evaluatedTokens} tokens (Loss: {resultA.averageNll.toFixed(3)})</span>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-[#111529] border border-teal-200 dark:border-teal-800">
                <span className="text-xs text-teal-800 dark:text-teal-300 font-mono uppercase font-bold block">Sentence B Perplexity</span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 block">{resultB.perplexity.toFixed(2)}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{resultB.evaluatedTokens} tokens (Loss: {resultB.averageNll.toFixed(3)})</span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-100 to-teal-50 dark:from-cyan-950/60 dark:to-teal-950/50 border border-cyan-300 dark:border-cyan-700 flex flex-col justify-between">
                <span className="text-xs text-cyan-900 dark:text-cyan-300 font-mono uppercase font-bold block">Surprise Ratio</span>
                <div className="text-2xl font-extrabold text-cyan-950 dark:text-white my-1">
                  {resultB.perplexity > resultA.perplexity
                    ? `B is ${ratio}× more surprising`
                    : `A is ${(resultA.perplexity / resultB.perplexity).toFixed(1)}× more surprising`}
                </div>
                <span className="text-[11px] text-cyan-800 dark:text-cyan-300 font-medium">
                  {resultA.perplexity < resultB.perplexity
                    ? 'Sentence A has substantially higher probability under the model.'
                    : 'Sentence B has higher probability under the model.'}
                </span>
              </div>
            </div>

            {/* Qualitative Explanation */}
            <div className="p-4 rounded-2xl bg-[#F6FCFC] dark:bg-[#111529] border border-cyan-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Why do these scores differ?</span>
              Language models are trained to maximize the likelihood of fluent, typical human text. When a sequence follows natural syntax, common collocations, and expected semantics, the model assigns high conditional probabilities to each subsequent token, leading to low negative log-likelihood and a lower perplexity score. Conversely, unusual syntax or out-of-context words force probability toward zero, causing surprisal to spike exponentially.
            </div>
          </div>

          {/* Side by Side Token Visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sentence A Tokens */}
            <div className="glass-card p-5 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 space-y-3 shadow-md">
              <div className="text-xs font-mono font-bold text-cyan-800 dark:text-cyan-300 uppercase flex items-center justify-between">
                <span>Sentence A Tokens ({resultA.tokens.length})</span>
                <span>Avg Loss: {resultA.averageNll.toFixed(2)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {resultA.tokens.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-cyan-50/70 dark:bg-[#111529] border border-cyan-200 dark:border-slate-800 text-xs font-mono"
                  >
                    <span className="text-slate-900 dark:text-white font-bold">"{t.text}"</span>
                    <span className="text-cyan-800 dark:text-cyan-300 text-[10px] block mt-0.5 font-semibold">
                      {t.isContextToken ? 'seed' : `${(t.probability * 100).toFixed(1)}%`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sentence B Tokens */}
            <div className="glass-card p-5 rounded-3xl border border-teal-100 dark:border-teal-900/40 space-y-3 shadow-md">
              <div className="text-xs font-mono font-bold text-teal-800 dark:text-teal-300 uppercase flex items-center justify-between">
                <span>Sentence B Tokens ({resultB.tokens.length})</span>
                <span>Avg Loss: {resultB.averageNll.toFixed(2)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {resultB.tokens.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-teal-50/70 dark:bg-[#111529] border border-teal-200 dark:border-slate-800 text-xs font-mono"
                  >
                    <span className="text-slate-900 dark:text-white font-bold">"{t.text}"</span>
                    <span className="text-teal-800 dark:text-teal-300 text-[10px] block mt-0.5 font-semibold">
                      {t.isContextToken ? 'seed' : `${(t.probability * 100).toFixed(1)}%`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

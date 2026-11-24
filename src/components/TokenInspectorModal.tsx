import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Hash, BarChart2, CheckCircle2 } from 'lucide-react';
import { TokenPrediction } from '../types';
import { getProbabilityTier } from '../utils/perplexity';

interface TokenInspectorModalProps {
  token: TokenPrediction | null;
  allTokens: TokenPrediction[];
  onClose: () => void;
}

export const TokenInspectorModal: React.FC<TokenInspectorModalProps> = ({
  token,
  allTokens,
  onClose
}) => {
  if (!token) return null;

  const tier = getProbabilityTier(token.probability);
  const contextTokens = allTokens.slice(0, token.id);
  const isContextSeed = token.id === 0 || token.isContextToken;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white/95 dark:bg-[#171D35]/95 border border-cyan-200/80 dark:border-cyan-500/30 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-800 dark:text-slate-100 relative backdrop-blur-xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-cyan-50 dark:bg-slate-800 hover:bg-cyan-100 dark:hover:bg-slate-700 text-cyan-800 dark:text-cyan-300 transition-all border border-cyan-200/60 dark:border-cyan-700/40"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-3 mb-5">
            <div className={`p-3 rounded-2xl ${tier.bgClass} border`}>
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono text-cyan-700 dark:text-cyan-400 font-bold tracking-wider">
                  Token Inspector
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100/70 dark:bg-slate-800 text-cyan-800 dark:text-cyan-300 font-mono font-semibold">
                  Index #{token.id}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2 mt-0.5">
                "{token.text}"
                {isContextSeed && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-sans font-semibold border border-sky-200 dark:border-sky-800">
                    Prompt Seed (Context Start)
                  </span>
                )}
              </h3>
            </div>
          </div>

          {/* Context Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-cyan-50/80 to-sky-50/50 dark:from-[#111529] dark:to-[#0D1224] border border-cyan-200/60 dark:border-cyan-800/40">
            <div className="text-xs text-cyan-900 dark:text-cyan-300 font-semibold mb-1.5 flex items-center gap-1.5 font-mono">
              <Hash className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              Preceding Context (Tokens 0 to {Math.max(0, token.id - 1)}):
            </div>
            <div className="text-sm font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-[#090B16] p-3 rounded-xl border border-cyan-100 dark:border-slate-800 shadow-sm">
              {contextTokens.length > 0 ? (
                contextTokens.map((t, idx) => (
                  <span key={idx} className="text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 px-1.5 py-0.5 rounded-md mr-1 border border-cyan-100 dark:border-cyan-800 font-semibold">
                    {t.text}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">None (First token in sequence has no prior context)</span>
              )}
              <span className="text-teal-700 dark:text-teal-300 font-bold bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800 ml-1">
                ➔ {token.text}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
              In causal language models like DistilGPT-2, each token probability is conditioned strictly on all preceding tokens: <code className="text-cyan-800 dark:text-cyan-300 font-bold">P(token_{token.id} | token_0 ... token_{token.id - 1})</code>.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-100 dark:border-slate-800">
              <span className="text-[10px] text-cyan-800/80 dark:text-cyan-400 uppercase font-mono font-bold block">Probability P</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white mt-1 block">
                {isContextSeed ? '1.0 (Seed)' : (token.probability * 100).toFixed(2) + '%'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-100 dark:border-slate-800">
              <span className="text-[10px] text-cyan-800/80 dark:text-cyan-400 uppercase font-mono font-bold block">Neg Log Likelihood</span>
              <span className="text-lg font-extrabold text-teal-700 dark:text-teal-300 mt-1 block">
                {isContextSeed ? '0.000' : token.negLogProb.toFixed(3)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-100 dark:border-slate-800">
              <span className="text-[10px] text-cyan-800/80 dark:text-cyan-400 uppercase font-mono font-bold block">Surprisal (Bits)</span>
              <span className="text-lg font-extrabold text-sky-700 dark:text-sky-300 mt-1 block">
                {isContextSeed ? '0 bits' : `${token.surprisalBits?.toFixed(2) || '0'} bits`}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-100 dark:border-slate-800">
              <span className="text-[10px] text-cyan-800/80 dark:text-cyan-400 uppercase font-mono font-bold block">Vocab Rank</span>
              <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 block">
                #{token.rank || 1} <span className="text-[10px] text-slate-500 font-normal">/ 50k</span>
              </span>
            </div>
          </div>

          {/* Top Candidates Comparison */}
          {token.topCandidates && token.topCandidates.length > 0 && !isContextSeed && (
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                <span>Top Model Predictions at this Position</span>
                <span className="text-xs text-cyan-800 dark:text-cyan-400 font-mono font-semibold">Softmax Distribution</span>
              </h4>

              <div className="space-y-2">
                {token.topCandidates.map((cand, idx) => {
                  const isChosen = cand.isActual;
                  const pct = (cand.probability * 100).toFixed(1);
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border transition-all ${
                        isChosen
                          ? 'bg-cyan-50/80 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-600 shadow-sm'
                          : 'bg-white dark:bg-[#111529] border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-mono flex items-center gap-2 font-medium">
                          {isChosen ? (
                            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          ) : (
                            <span className="text-slate-400 w-4 text-center">#{idx + 1}</span>
                          )}
                          <span className={isChosen ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-300'}>
                            "{cand.token}"
                          </span>
                          {isChosen && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 font-semibold border border-cyan-200 dark:border-cyan-700">
                              Actual Token
                            </span>
                          )}
                        </span>
                        <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            isChosen
                              ? 'bg-gradient-to-r from-cyan-500 to-teal-500'
                              : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          style={{ width: `${Math.max(3, cand.probability * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mathematical Explanation */}
          <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-200/60 dark:border-cyan-800/40 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
            <div className="font-bold text-cyan-900 dark:text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              How the model calculated this token probability:
            </div>
            <p>
              The transformer processed the preceding context through attention heads and feed-forward layers to produce a raw logit vector for the 50,257 vocabulary tokens.
            </p>
            <p className="font-mono text-cyan-900 dark:text-cyan-300 bg-white dark:bg-[#090B16] p-2.5 rounded-xl border border-cyan-100 dark:border-slate-800 mt-1 font-semibold">
              P("{token.text}") = exp(logit) / ∑ exp(logit_j) = {(token.probability).toFixed(5)}
            </p>
            <p className="font-mono text-teal-900 dark:text-teal-300 bg-white dark:bg-[#090B16] p-2.5 rounded-xl border border-cyan-100 dark:border-slate-800 font-semibold">
              -ln(P) = -ln({(token.probability).toFixed(5)}) = {token.negLogProb.toFixed(4)}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

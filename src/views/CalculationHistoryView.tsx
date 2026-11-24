import React, { useState, useEffect } from 'react';
import { 
  History, 
  Trash2, 
  ArrowUpRight, 
  Clock, 
  Hash, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import { HistoryItem } from '../types';
import { getStoredHistory, clearStoredHistory } from '../utils/storage';

interface CalculationHistoryViewProps {
  onLoadSentence: (sentence: string) => void;
}

export const CalculationHistoryView: React.FC<CalculationHistoryViewProps> = ({
  onLoadSentence
}) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [clearedNotice, setClearedNotice] = useState(false);

  useEffect(() => {
    setHistory(getStoredHistory());
  }, []);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your local calculation history?')) {
      clearStoredHistory();
      setHistory([]);
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <History className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
            Calculation History
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Review past perplexity evaluations stored exclusively in your browser's local storage.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-[#111529] border border-cyan-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
        <div>
          <strong className="text-slate-900 dark:text-white font-bold">Strict Client-Side Privacy:</strong> Your text inputs and evaluations are kept entirely on your device in browser <code className="text-cyan-800 dark:text-cyan-300 font-mono font-bold">localStorage</code>. No sentences are sent to any external server or telemetry database.
        </div>
      </div>

      {clearedNotice && (
        <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" /> History successfully cleared.
        </div>
      )}

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 text-center space-y-3 shadow-md">
          <History className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No Calculations Recorded Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Calculate perplexity in the Token Explorer to automatically preserve your sequence evaluations here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="glass-card p-5 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 hover:border-cyan-300 dark:hover:border-cyan-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-sm"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="text-base font-semibold text-slate-900 dark:text-white truncate font-sans group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                  "{item.sentence}"
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span className="flex items-center gap-1 font-sans">
                    <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    {item.timestamp}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    {item.tokenCount} tokens ({item.evaluatedTokens} eval)
                  </span>
                  <span>•</span>
                  <span className="text-cyan-700 dark:text-cyan-300 font-semibold">{item.modelName}</span>
                </div>
              </div>

              {/* Perplexity badge & Action */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono font-bold block">Perplexity</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                    {item.perplexity.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => onLoadSentence(item.sentence)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-50 dark:bg-slate-800 hover:bg-cyan-100 dark:hover:bg-slate-700 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-slate-700 transition-all flex items-center gap-1.5 text-xs font-bold"
                  title="Reload into Token Explorer"
                >
                  <span>Load</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

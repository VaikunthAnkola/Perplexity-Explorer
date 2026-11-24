import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Brain, 
  Layers, 
  Hash, 
  Percent, 
  Calculator, 
  HelpCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { approximateTokenize } from '../services/simulation';

export const LearningCenterView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>('tokens');
  const [interactiveText, setInteractiveText] = useState<string>('Artificial intelligence is fascinating!');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const lessons = [
    {
      id: 'lm',
      title: '1. What is a Language Model?',
      icon: <Brain className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      summary: 'A statistical engine that assigns probabilities to sequences of words or tokens.',
      content: (
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            At its core, an autoregressive language model is a probabilistic machine. Given a history of preceding words or symbols, it models the conditional probability distribution over the entire vocabulary to predict what token is most likely to come next.
          </p>
          <div className="p-3.5 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-100 dark:border-slate-800 font-mono text-xs text-cyan-900 dark:text-cyan-300 font-semibold">
            P(W) = P(w_1) × P(w_2 | w_1) × P(w_3 | w_1, w_2) × ... × P(w_N | w_1, ..., w_N-1)
          </div>
          <p>
            Modern models like GPT-2, GPT-4, and Llama are built with Transformer architectures that use self-attention to process these dependencies efficiently.
          </p>
        </div>
      )
    },
    {
      id: 'tokens',
      title: '2. What is a Token & Tokenization?',
      icon: <Hash className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      summary: 'Computers cannot directly read words; they process numerical chunk IDs called tokens.',
      content: (
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Language models do not process whole sentences or single characters. Instead, they slice text into subword chunks called <strong>tokens</strong> using algorithms like Byte-Pair Encoding (BPE).
          </p>
          <p>
            For example, common words like "apple" or "love" might be a single token, while rare or compound words are broken into subwords: "unbreakable" &rarr; ["un", "break", "able"].
          </p>
          
          {/* Interactive Tokenizer Mini-Demo */}
          <div className="mt-4 p-4 rounded-2xl bg-cyan-50/40 dark:bg-[#111529] border border-cyan-200/60 dark:border-slate-800 space-y-3">
            <span className="text-xs font-mono uppercase text-cyan-900 dark:text-cyan-300 font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Try Live Interactive Tokenizer
            </span>
            <input
              type="text"
              value={interactiveText}
              onChange={(e) => setInteractiveText(e.target.value)}
              className="w-full bg-white dark:bg-[#090B16] border border-cyan-200 dark:border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 shadow-sm font-semibold"
              placeholder="Type anything to see token boundaries..."
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {approximateTokenize(interactiveText).map((t, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-white dark:bg-[#171D35] border border-cyan-200 dark:border-slate-700 text-cyan-900 dark:text-cyan-300 font-mono text-xs flex items-center gap-1.5 shadow-sm font-semibold"
                >
                  <span className="text-[10px] text-cyan-700 dark:text-slate-500 font-normal">#{idx}</span>
                  <span>"{t}"</span>
                </span>
              ))}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Notice how spaces and punctuation form distinct token boundaries!
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'probability',
      title: '3. What is Probability & Conditional Probability?',
      icon: <Percent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      summary: 'Probability measures likelihood from 0 to 1. Conditional probability depends on prior context.',
      content: (
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            A <strong>probability</strong> is a number between 0 (impossible) and 1 (certain). In language modeling, the sum of probabilities across all tokens in the vocabulary must equal exactly 1.0:
          </p>
          <div className="p-3.5 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-100 dark:border-slate-800 font-mono text-xs text-teal-900 dark:text-teal-300 font-semibold">
            ∑ P(token_v) = 1.0, where v ∈ [1, 2, ..., Vocabulary Size]
          </div>
          <p>
            <strong>Conditional Probability</strong> <code className="text-cyan-800 dark:text-cyan-300 font-bold">P(B | A)</code> is the probability of event B happening <em>given that event A has already occurred</em>.
          </p>
          <p className="bg-cyan-50/30 dark:bg-[#111529] p-3 rounded-xl border border-cyan-100 dark:border-slate-800">
            Example: <br />
            • P("Paris") standalone might be very small (~0.0001).<br />
            • But P("Paris" | "The capital of France is") is extremely large (~0.85)! Context completely transforms the distribution.
          </p>
        </div>
      )
    },
    {
      id: 'gpt_prediction',
      title: '4. How Does GPT Predict the Next Token?',
      icon: <Layers className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      summary: 'From embeddings through Transformer attention layers to raw logits and softmax.',
      content: (
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            When you enter a sequence into a model like DistilGPT-2:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-700 dark:text-slate-300 pl-1">
            <li><strong>Token Embedding:</strong> Tokens are converted into dense vector representations.</li>
            <li><strong>Positional Encoding:</strong> Injects the position/order of each word.</li>
            <li><strong>Transformer Blocks:</strong> Multi-head masked self-attention allows each position to gather context from all preceding positions.</li>
            <li><strong>Logits:</strong> The final linear projection outputs 50,257 unnormalized real scores (logits).</li>
            <li><strong>Softmax:</strong> Applies <code className="text-cyan-800 dark:text-cyan-300 font-bold">exp(logit) / ∑ exp(logits)</code> to turn scores into a valid probability distribution.</li>
          </ol>
        </div>
      )
    },
    {
      id: 'perplexity',
      title: '5. What is Perplexity? (Intuition & Math)',
      icon: <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      summary: 'Perplexity measures how surprised a language model is by a sequence of tokens.',
      content: (
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p className="font-bold text-slate-900 dark:text-white">
            "Perplexity measures how surprised a language model is by a sequence of tokens. Lower perplexity means the model assigned higher probabilities to the observed tokens."
          </p>
          <p>
            <strong>The Branching Factor Intuition:</strong><br />
            If a model has a perplexity of <strong>10</strong> on a sequence, it means on average at each step, the model was as uncertain as choosing uniformly at random among <strong>10 equally likely words</strong>.
          </p>
          <p>
            If a model has a perplexity of <strong>1.0</strong>, it predicted every single token with 100% certainty (zero surprise).
          </p>
          <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-[#111529] border border-cyan-200/60 dark:border-slate-800 space-y-2">
            <span className="font-bold text-xs uppercase font-mono text-cyan-900 dark:text-cyan-300 block">The Exact Formula</span>
            <div className="font-mono text-xs text-slate-900 dark:text-white bg-white dark:bg-[#090B16] p-3 rounded-xl border border-cyan-100 dark:border-slate-800 font-bold">
              Perplexity = exp( -1/N × ∑ ln(P(token_i)) ) = ( ∏ 1 / P(token_i) ) ^ (1/N)
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Where N is the number of evaluated tokens, and ln is the natural logarithm.
            </p>
          </div>
          <p className="text-xs text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800">
            ⚠️ <strong>Important distinction:</strong> Perplexity is an evaluation of statistical probability, not truthfulness or quality. A factually wrong sentence that uses very common clichés can have lower perplexity than a factually correct, highly technical or creative sentence!
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <BookOpen className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
          Language Model Learning Center
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          A friendly guide to language modeling, tokens, conditional probabilities, and perplexity metrics.
        </p>
      </div>

      {/* Expandable Lesson Cards */}
      <div className="space-y-4">
        {lessons.map((lesson) => {
          const isExpanded = expandedId === lesson.id;
          return (
            <div
              key={lesson.id}
              className="glass-card rounded-3xl border border-cyan-100 dark:border-cyan-900/40 overflow-hidden shadow-md transition-all"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? '' : lesson.id)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-cyan-50/40 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-slate-800 border border-cyan-100 dark:border-slate-700">
                    {lesson.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{lesson.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{lesson.summary}</p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-cyan-50 dark:bg-slate-800 text-cyan-800 dark:text-cyan-300 border border-cyan-100 dark:border-slate-700">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-5 pt-0 border-t border-cyan-100/80 dark:border-cyan-900/40">
                  {lesson.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Interactive Knowledge Check */}
      <div className="glass-card p-6 rounded-3xl border border-cyan-100 dark:border-cyan-900/40 space-y-4 shadow-md">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
          <HelpCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          Quick Knowledge Check: What does lower perplexity signify?
        </div>

        <div className="space-y-2">
          {[
            { id: 0, text: 'The text is guaranteed to be factually accurate and high quality.', correct: false },
            { id: 1, text: 'The language model assigned higher probability to the observed sequence of tokens.', correct: true },
            { id: 2, text: 'The model has a larger vocabulary size than other models.', correct: false },
            { id: 3, text: 'The sentence has fewer characters than average.', correct: false }
          ].map((opt) => {
            const isSelected = quizAnswer === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setQuizAnswer(opt.id)}
                className={`w-full p-3.5 rounded-2xl text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                  isSelected
                    ? opt.correct
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-900 dark:text-rose-200'
                    : 'bg-white dark:bg-[#111529] border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-200 dark:hover:border-cyan-800'
                }`}
              >
                <span>{opt.text}</span>
                {isSelected && (
                  opt.correct ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  )
                )}
              </button>
            );
          })}
        </div>

        {quizAnswer !== null && (
          <div className="text-xs p-3.5 rounded-xl bg-cyan-50 dark:bg-[#111529] text-slate-700 dark:text-slate-300 border border-cyan-100 dark:border-slate-800">
            {quizAnswer === 1 ? (
              <span className="text-teal-800 dark:text-teal-300 font-bold">
                Correct! Perplexity strictly measures how surprised the model was; lower score means higher probability under its learned distribution.
              </span>
            ) : (
              <span className="text-rose-700 dark:text-rose-300 font-semibold">
                Not quite. Remember: perplexity is not a direct measure of factual correctness or text quality, but of probability assigned by the model!
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

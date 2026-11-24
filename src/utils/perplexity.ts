import { TokenPrediction, PerplexityResult } from '../types';

/**
 * Numerically stable log-softmax implementation.
 * log_softmax(x)_i = x_i - max(x) - ln(sum(exp(x_j - max(x))))
 */
export function logSoftmax(logits: Float32Array | number[]): Float64Array {
  const n = logits.length;
  const out = new Float64Array(n);
  
  let maxVal = -Infinity;
  for (let i = 0; i < n; i++) {
    if (logits[i] > maxVal) maxVal = logits[i];
  }

  let sumExp = 0.0;
  for (let i = 0; i < n; i++) {
    sumExp += Math.exp(logits[i] - maxVal);
  }
  const logSumExp = Math.log(sumExp);

  for (let i = 0; i < n; i++) {
    out[i] = (logits[i] - maxVal) - logSumExp;
  }
  return out;
}

/**
 * Numerically stable softmax implementation.
 */
export function softmax(logits: Float32Array | number[]): Float64Array {
  const n = logits.length;
  const out = new Float64Array(n);
  
  let maxVal = -Infinity;
  for (let i = 0; i < n; i++) {
    if (logits[i] > maxVal) maxVal = logits[i];
  }

  let sumExp = 0.0;
  for (let i = 0; i < n; i++) {
    const val = Math.exp(logits[i] - maxVal);
    out[i] = val;
    sumExp += val;
  }

  for (let i = 0; i < n; i++) {
    out[i] /= sumExp;
  }
  return out;
}

/**
 * Calculates Perplexity from an array of probabilities.
 * Perplexity = exp(-1/N * sum(ln(P_i)))
 * Equivalent to: (product(1 / P_i))^(1/N)
 */
export function calculatePerplexityFromProbabilities(probabilities: number[]): {
  perplexity: number;
  averageNll: number;
  sumNegLogProb: number;
  productInverseProb: number;
  formulaSteps: string[];
} {
  const N = probabilities.length;
  if (N === 0) {
    return {
      perplexity: 1.0,
      averageNll: 0,
      sumNegLogProb: 0,
      productInverseProb: 1.0,
      formulaSteps: ['No evaluated tokens. Perplexity defaults to 1.0']
    };
  }

  let sumNegLogProb = 0;
  let logProductInverse = 0;

  for (let i = 0; i < N; i++) {
    const p = Math.max(1e-12, Math.min(1.0, probabilities[i]));
    const negLogP = -Math.log(p);
    sumNegLogProb += negLogP;
    logProductInverse += Math.log(1 / p);
  }

  const averageNll = sumNegLogProb / N;
  const perplexity = Math.exp(averageNll);
  
  // Guard against overflow for product of inverse probabilities
  const productInverseProb = logProductInverse < 700 ? Math.exp(logProductInverse) : Infinity;

  const steps = [
    `1. Evaluated token count N = ${N}`,
    `2. Sum of negative log-likelihoods: ∑ -ln(P(t_i)) = ${sumNegLogProb.toFixed(4)}`,
    `3. Average Negative Log-Likelihood (Cross-Entropy Loss): L = ${sumNegLogProb.toFixed(4)} / ${N} = ${averageNll.toFixed(4)}`,
    `4. Perplexity = exp(L) = exp(${averageNll.toFixed(4)}) = ${perplexity.toFixed(4)}`,
    `5. Equivalent Geometric Mean: (∏ 1/P(t_i))^(1/${N}) = ${perplexity.toFixed(4)}`
  ];

  return {
    perplexity,
    averageNll,
    sumNegLogProb,
    productInverseProb,
    formulaSteps: steps
  };
}

/**
 * Helper to get cozy descriptive color tier based on token probability
 */
export function getProbabilityTier(probability: number): {
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  label: string;
} {
  if (probability >= 0.35) {
    return {
      color: '#0D9488', // cozy teal
      bgClass: 'bg-teal-50 text-teal-800 border-teal-200',
      borderClass: 'border-teal-300',
      textClass: 'text-teal-700',
      label: 'High Probability'
    };
  } else if (probability >= 0.08) {
    return {
      color: '#D97706', // warm cozy amber
      bgClass: 'bg-amber-50 text-amber-800 border-amber-200',
      borderClass: 'border-amber-300',
      textClass: 'text-amber-700',
      label: 'Medium Probability'
    };
  } else {
    return {
      color: '#E11D48', // soft rose
      bgClass: 'bg-rose-50 text-rose-800 border-rose-200',
      borderClass: 'border-rose-300',
      textClass: 'text-rose-700',
      label: 'Low Probability'
    };
  }
}

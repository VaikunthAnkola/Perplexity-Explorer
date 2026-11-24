function logSoftmax(logits) {
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

function softmax(logits) {
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

function calculatePerplexityFromProbabilities(probabilities) {
  const N = probabilities.length;
  if (N === 0) return { perplexity: 1.0, averageNll: 0 };
  let sumNegLogProb = 0;
  for (let i = 0; i < N; i++) {
    const p = Math.max(1e-12, Math.min(1.0, probabilities[i]));
    sumNegLogProb += -Math.log(p);
  }
  const averageNll = sumNegLogProb / N;
  const perplexity = Math.exp(averageNll);
  return { perplexity, averageNll, sumNegLogProb };
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log('--- Testing Perplexity & Probability Math Engine ---');

// Test 1: Uniform 0.125 -> Perplexity must be 8.000
const resPresetA = calculatePerplexityFromProbabilities([0.125, 0.125, 0.125, 0.125]);
assert(Math.abs(resPresetA.perplexity - 8.0) < 1e-4, `Expected perplexity 8.0, got ${resPresetA.perplexity}`);
assert(Math.abs(resPresetA.averageNll - Math.log(8.0)) < 1e-4, `Expected average NLL ln(8), got ${resPresetA.averageNll}`);

// Test 2: High confidence: [0.90, 0.95, 0.85] -> Perplexity ~ 1.116
const resHigh = calculatePerplexityFromProbabilities([0.90, 0.95, 0.85]);
assert(resHigh.perplexity > 1.0 && resHigh.perplexity < 1.2, `Expected low perplexity ~1.12, got ${resHigh.perplexity}`);

// Test 3: Numerical stability with large logits (prevents NaN / overflow)
const largeLogits = new Float32Array([1000, 1001, 1002]);
const logProbs = logSoftmax(largeLogits);
assert(!isNaN(logProbs[0]) && !isNaN(logProbs[1]) && !isNaN(logProbs[2]), 'Log-softmax handled large logits without NaN');
const probs = softmax(largeLogits);
const sumProbs = probs[0] + probs[1] + probs[2];
assert(Math.abs(sumProbs - 1.0) < 1e-5, `Softmax probabilities sum to 1.0, got ${sumProbs}`);

// Test 4: Single token probability 0.5 -> Perplexity = 2.0
const resSingle = calculatePerplexityFromProbabilities([0.5]);
assert(Math.abs(resSingle.perplexity - 2.0) < 1e-4, `Expected perplexity 2.0, got ${resSingle.perplexity}`);

console.log('\nAll mathematical verification tests passed with 100% precision!');

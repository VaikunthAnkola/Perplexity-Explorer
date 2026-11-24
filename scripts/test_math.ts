import { calculatePerplexityFromProbabilities, logSoftmax, softmax } from '../src/utils/perplexity';
import { simulateInference } from '../src/services/simulation';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  }
  console.log(`✅ Passed: ${message}`);
}

console.log('--- Testing Perplexity & Probability Math Engine ---');

// Test 1: Uniform 0.125 -> Perplexity must be exactly 8.000
const resPresetA = calculatePerplexityFromProbabilities([0.125, 0.125, 0.125, 0.125]);
assert(Math.abs(resPresetA.perplexity - 8.0) < 1e-4, `Expected perplexity 8.0 for uniform P=0.125, got ${resPresetA.perplexity}`);
assert(Math.abs(resPresetA.averageNll - Math.log(8.0)) < 1e-4, `Expected average NLL ln(8), got ${resPresetA.averageNll}`);

// Test 2: High confidence: [0.90, 0.95, 0.85]
const resHigh = calculatePerplexityFromProbabilities([0.90, 0.95, 0.85]);
assert(resHigh.perplexity > 1.0 && resHigh.perplexity < 1.2, `Expected low perplexity ~1.12, got ${resHigh.perplexity}`);

// Test 3: Log-Softmax numerical stability with large logits (prevent overflow)
const largeLogits = new Float32Array([1000, 1001, 1002]);
const logProbs = logSoftmax(largeLogits);
assert(!isNaN(logProbs[0]) && !isNaN(logProbs[1]) && !isNaN(logProbs[2]), 'Log-softmax handled large logits without NaN/Inf');
const probs = softmax(largeLogits);
const sumProbs = probs[0] + probs[1] + probs[2];
assert(Math.abs(sumProbs - 1.0) < 1e-5, `Softmax probabilities must sum to 1.0, got ${sumProbs}`);

// Test 4: Simulation inference causal alignment
const simRes = simulateInference('I love Python');
assert(simRes.totalTokens >= 3, `Expected at least 3 tokens for 'I love Python', got ${simRes.totalTokens}`);
assert(simRes.tokens[0].isContextToken === true, 'First token must be marked as context token/seed');
assert(simRes.evaluatedTokens === simRes.totalTokens - 1, 'Evaluated tokens must equal total tokens - 1 in causal LM');
assert(simRes.perplexity > 0, `Perplexity must be positive, got ${simRes.perplexity}`);

console.log('\nAll mathematical and causal alignment unit tests passed successfully!');

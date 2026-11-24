import { TokenPrediction, PerplexityResult } from '../types';
import { calculatePerplexityFromProbabilities } from '../utils/perplexity';

// Standard common GPT-2 subword prefixes and vocab distributions
const COMMON_BIGRAMS: Record<string, Record<string, number>> = {
  '': { 'The': 0.18, 'I': 0.12, 'Artificial': 0.05, 'Machine': 0.06, 'This': 0.08, 'It': 0.07, 'A': 0.09 },
  'I': { ' love': 0.38, ' am': 0.22, ' think': 0.14, ' have': 0.09, ' like': 0.08 },
  'love': { ' Python': 0.42, ' you': 0.25, ' it': 0.12, ' coding': 0.08, ' machine': 0.05 },
  'Python': { ' is': 0.55, ' for': 0.15, ' code': 0.1, '.': 0.12 },
  'The': { ' capital': 0.16, ' world': 0.12, ' model': 0.09, ' quick': 0.05, ' future': 0.08 },
  'capital': { ' of': 0.88, ' city': 0.06, ' letter': 0.02 },
  'of': { ' France': 0.45, ' the': 0.35, ' artificial': 0.08 },
  'France': { ' is': 0.72, ' was': 0.12, ' has': 0.08 },
  'is': { ' Paris': 0.48, ' changing': 0.28, ' fascinating': 0.32, ' a': 0.22, ' the': 0.15 },
  'Artificial': { ' intelligence': 0.89, ' neural': 0.05, ' general': 0.03 },
  'intelligence': { ' is': 0.65, ' will': 0.15, ' research': 0.08 },
  'changing': { ' the': 0.78, ' our': 0.12, ' rapidly': 0.06 },
  'world': { '.': 0.55, ' of': 0.2, ' today': 0.15 },
  'Machine': { ' learning': 0.92, ' vision': 0.04, ' translation': 0.02 },
  'learning': { ' is': 0.62, ' models': 0.18, ' algorithms': 0.1 },
  'fascinating': { '.': 0.75, ' and': 0.12, ' to': 0.08 }
};

const COMMON_NEXT_WORDS = ['the', 'is', 'a', 'to', 'in', 'and', 'of', 'for', 'with', 'on', 'that', 'by'];

/**
 * Splits text into GPT-style subword tokens (preserving leading spaces)
 */
export function approximateTokenize(text: string): string[] {
  // Regex that mimics GPT-2 byte-pair tokenization chunking
  const regex = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
  const matches = text.match(regex);
  return matches && matches.length > 0 ? matches : [text];
}

/**
 * Realistic statistical simulated inference for fast, offline, and instant responses.
 */
export function simulateInference(sentence: string): PerplexityResult {
  const startTime = performance.now();
  const rawTokens = approximateTokenize(sentence);
  const tokenPredictions: TokenPrediction[] = [];
  const evaluatedProbabilities: number[] = [];

  for (let i = 0; i < rawTokens.length; i++) {
    const tokenStr = rawTokens[i];
    const cleanWord = tokenStr.trim().replace(/[^\w]/g, '');
    const prevToken = i > 0 ? rawTokens[i - 1].trim().replace(/[^\w]/g, '') : '';

    if (i === 0) {
      // First token is context prefix: no prior context to condition on!
      tokenPredictions.push({
        id: 0,
        text: tokenStr,
        tokenId: Math.abs(hashString(tokenStr)) % 50257,
        probability: 1.0,
        negLogProb: 0.0,
        isContextToken: true,
        rank: 1,
        surprisalBits: 0,
        topCandidates: [
          { token: tokenStr, tokenId: 100, probability: 0.25, isActual: true },
          { token: 'The', tokenId: 464, probability: 0.18, isActual: false },
          { token: 'I', tokenId: 40, probability: 0.12, isActual: false },
          { token: 'A', tokenId: 32, probability: 0.09, isActual: false }
        ]
      });
      continue;
    }

    // Determine realistic probability based on n-gram knowledge or semantic predictability
    let prob = 0.05;
    if (COMMON_BIGRAMS[prevToken] && COMMON_BIGRAMS[prevToken][tokenStr]) {
      prob = COMMON_BIGRAMS[prevToken][tokenStr];
    } else if (COMMON_BIGRAMS[prevToken] && COMMON_BIGRAMS[prevToken][cleanWord]) {
      prob = COMMON_BIGRAMS[prevToken][cleanWord];
    } else {
      // Predictability heuristic based on word length, punctuation, and frequency
      const hash = Math.abs(hashString(prevToken + '_' + tokenStr));
      if (tokenStr === '.' || tokenStr === ',' || tokenStr === '!') {
        prob = 0.35 + ((hash % 30) / 100);
      } else if (COMMON_NEXT_WORDS.includes(cleanWord.toLowerCase())) {
        prob = 0.22 + ((hash % 25) / 100);
      } else {
        // Less common or surprised token
        prob = Math.max(0.005, 0.02 + ((hash % 15) / 100));
      }
    }

    // Clamp probability
    prob = Math.min(0.96, Math.max(0.001, prob));
    const negLogProb = -Math.log(prob);
    const surprisalBits = -Math.log2(prob);
    evaluatedProbabilities.push(prob);

    // Build top candidate tokens for pedagogical insight
    const topCandidates = generateCandidates(tokenStr, prob);
    const rank = prob > 0.4 ? 1 : prob > 0.15 ? 2 : prob > 0.05 ? 4 : Math.min(48, Math.floor(1 / prob));

    tokenPredictions.push({
      id: i,
      text: tokenStr,
      tokenId: Math.abs(hashString(tokenStr)) % 50257,
      probability: prob,
      negLogProb: negLogProb,
      isContextToken: false,
      topCandidates,
      rank,
      surprisalBits
    });
  }

  const { perplexity, averageNll, sumNegLogProb, productInverseProb, formulaSteps } = 
    calculatePerplexityFromProbabilities(evaluatedProbabilities);

  const inferenceTimeMs = Math.round(performance.now() - startTime);

  return {
    sentence,
    tokens: tokenPredictions,
    totalTokens: rawTokens.length,
    evaluatedTokens: evaluatedProbabilities.length,
    averageNll,
    perplexity,
    modelName: 'DistilGPT-2 (In-Browser Simulation)',
    timestamp: new Date().toISOString(),
    inferenceTimeMs,
    calculationBreakdown: {
      sumNegLogProb,
      productInverseProb,
      formulaSteps
    }
  };
}

function generateCandidates(actualToken: string, actualProb: number) {
  const candidates = [
    { token: actualToken, tokenId: Math.abs(hashString(actualToken)) % 50257, probability: actualProb, isActual: true }
  ];

  const alternates = ['the', 'is', 'a', 'in', 'to', 'that', 'with', 'for'];
  let remainingProb = 1 - actualProb;

  for (let i = 0; i < 4; i++) {
    const alt = alternates[i];
    if (alt.toLowerCase() === actualToken.trim().toLowerCase()) continue;
    const p = Math.max(0.01, (remainingProb * 0.4) / (i + 1));
    remainingProb -= p;
    candidates.push({
      token: ' ' + alt,
      tokenId: Math.abs(hashString(alt)) % 50257,
      probability: parseFloat(p.toFixed(4)),
      isActual: false
    });
  }

  return candidates.sort((a, b) => b.probability - a.probability);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

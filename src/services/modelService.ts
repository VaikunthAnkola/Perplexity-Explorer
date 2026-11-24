import { TokenPrediction, PerplexityResult, ModelLoadingProgress } from '../types';
import { logSoftmax, softmax, calculatePerplexityFromProbabilities } from '../utils/perplexity';
import { simulateInference } from './simulation';

let tokenizerInstance: any = null;
let modelInstance: any = null;
let isLoading = false;
let currentProgress: ModelLoadingProgress = { status: 'idle', progress: 0 };
let progressListeners: Array<(p: ModelLoadingProgress) => void> = [];

export function subscribeModelProgress(listener: (p: ModelLoadingProgress) => void) {
  progressListeners.push(listener);
  listener(currentProgress);
  return () => {
    progressListeners = progressListeners.filter(l => l !== listener);
  };
}

function notifyProgress(progress: ModelLoadingProgress) {
  currentProgress = progress;
  for (const listener of progressListeners) {
    listener(progress);
  }
}

export function isModelReady(): boolean {
  return modelInstance !== null && tokenizerInstance !== null;
}

export async function initTransformersModel(): Promise<boolean> {
  if (isModelReady()) return true;
  if (isLoading) return false;

  isLoading = true;
  notifyProgress({
    status: 'loading',
    progress: 5,
    message: 'Initializing Hugging Face Transformers.js runtime...'
  });

  try {
    const { AutoTokenizer, AutoModelForCausalLM, env } = await import('@xenova/transformers');

    // Browser environment settings
    env.allowLocalModels = false;
    env.useBrowserCache = true;

    notifyProgress({
      status: 'loading',
      progress: 15,
      message: 'Fetching DistilGPT-2 Tokenizer vocabulary...'
    });

    tokenizerInstance = await AutoTokenizer.from_pretrained('Xenova/distilgpt2', {
      progress_callback: (item: any) => {
        if (item.status === 'progress' && item.progress !== undefined) {
          notifyProgress({
            status: 'loading',
            progress: Math.min(40, 15 + Math.round(item.progress * 0.25)),
            file: item.file,
            message: `Loading tokenizer: ${item.file || ''}`
          });
        }
      }
    });

    notifyProgress({
      status: 'loading',
      progress: 40,
      message: 'Downloading DistilGPT-2 ONNX Model weights (~120MB)...'
    });

    modelInstance = await AutoModelForCausalLM.from_pretrained('Xenova/distilgpt2', {
      progress_callback: (item: any) => {
        if (item.status === 'progress' && item.progress !== undefined) {
          const loadedPct = Math.round(item.progress);
          notifyProgress({
            status: 'loading',
            progress: Math.min(99, 40 + Math.round(item.progress * 0.58)),
            file: item.file,
            loadedBytes: item.loaded,
            totalBytes: item.total,
            message: `Downloading model weights: ${loadedPct}% (${item.file || 'model.onnx'})`
          });
        }
      }
    });

    notifyProgress({
      status: 'ready',
      progress: 100,
      message: 'DistilGPT-2 model loaded successfully and ready for inference!'
    });

    isLoading = false;
    return true;
  } catch (error: any) {
    console.error('Failed to load Transformers.js DistilGPT-2 model:', error);
    isLoading = false;
    notifyProgress({
      status: 'error',
      progress: 0,
      message: `Failed to load model: ${error?.message || 'Network or memory limit'}. You can still use the instant simulation mode!`
    });
    return false;
  }
}

/**
 * Finds top K items and actual token rank efficiently from a vocab slice
 */
function extractTopCandidatesAndRank(
  logitsSlice: Float32Array,
  actualTokenId: number,
  tokenizer: any,
  k: number = 5
): { topCandidates: any[]; rank: number } {
  const vocabSize = logitsSlice.length;
  const actualLogit = logitsSlice[actualTokenId];
  let rank = 1;

  // Use a min-heap or fixed-size array to find top K values
  const topIndices: number[] = [];

  for (let i = 0; i < vocabSize; i++) {
    const val = logitsSlice[i];
    if (val > actualLogit) {
      rank++;
    }

    if (topIndices.length < k) {
      topIndices.push(i);
      topIndices.sort((a, b) => logitsSlice[b] - logitsSlice[a]);
    } else if (val > logitsSlice[topIndices[topIndices.length - 1]]) {
      topIndices[topIndices.length - 1] = i;
      topIndices.sort((a, b) => logitsSlice[b] - logitsSlice[a]);
    }
  }

  // Compute softmax probabilities for top items
  const topLogits = topIndices.map(idx => logitsSlice[idx]);
  const topProbs = softmax(topLogits);

  const topCandidates = topIndices.map((idx, index) => {
    let tokenStr = '';
    try {
      tokenStr = tokenizer.decode([idx]);
    } catch {
      tokenStr = `[Token ${idx}]`;
    }

    return {
      token: tokenStr,
      tokenId: idx,
      probability: Number(topProbs[index].toFixed(4)),
      isActual: idx === actualTokenId
    };
  });

  return { topCandidates, rank };
}

/**
 * Calculates Perplexity using DistilGPT-2 causal language model.
 * Correctly aligns preceding context to predict the actual next token.
 */
export async function calculateModelPerplexity(
  sentence: string,
  forceSimulation: boolean = false
): Promise<PerplexityResult> {
  const cleanText = sentence.trim();
  if (!cleanText) {
    throw new Error('Sentence cannot be empty');
  }

  if (forceSimulation) {
    return simulateInference(cleanText);
  }

  // Check if real model is ready, if not try loading
  if (!isModelReady()) {
    const success = await initTransformersModel();
    if (!success) {
      console.warn('Real model initialization failed or cancelled, falling back to simulated engine.');
      return simulateInference(cleanText);
    }
  }

  const startTime = performance.now();

  try {
    const encoded = await tokenizerInstance(cleanText);
    const tokenIds = Array.from(encoded.input_ids.data).map(Number);
    const seqLen = tokenIds.length;

    if (seqLen === 0) {
      throw new Error('No tokens produced for sentence');
    }

    // Forward pass through causal LM
    const output = await modelInstance(encoded);
    const logits = output.logits; // Shape [1, seqLen, vocabSize]
    const vocabSize = logits.dims[2];
    const logitsData: Float32Array = logits.data;

    const tokenPredictions: TokenPrediction[] = [];
    const evaluatedProbabilities: number[] = [];

    // First token (index 0) is prompt start / seed context
    const firstTokenText = tokenizerInstance.decode([tokenIds[0]]);
    tokenPredictions.push({
      id: 0,
      text: firstTokenText,
      tokenId: tokenIds[0],
      probability: 1.0,
      negLogProb: 0.0,
      isContextToken: true,
      rank: 1,
      surprisalBits: 0,
      topCandidates: [
        { token: firstTokenText, tokenId: tokenIds[0], probability: 1.0, isActual: true }
      ]
    });

    // Causal LM alignment:
    // Logits at position i - 1 predict the token at position i!
    for (let i = 1; i < seqLen; i++) {
      const prevPos = i - 1;
      const targetTokenId = tokenIds[i];
      const tokenText = tokenizerInstance.decode([targetTokenId]);

      const startIdx = prevPos * vocabSize;
      const slice = logitsData.subarray(startIdx, startIdx + vocabSize);

      // Compute stable log softmax over vocabulary
      const logProbs = logSoftmax(slice);
      const targetLogProb = logProbs[targetTokenId];
      const targetProb = Math.max(1e-12, Math.exp(targetLogProb));
      const negLogProb = -targetLogProb;
      const surprisalBits = -targetLogProb / Math.LN2;

      evaluatedProbabilities.push(targetProb);

      // Extract top candidates and token rank
      const { topCandidates, rank } = extractTopCandidatesAndRank(slice, targetTokenId, tokenizerInstance, 5);

      tokenPredictions.push({
        id: i,
        text: tokenText,
        tokenId: targetTokenId,
        probability: targetProb,
        negLogProb,
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
      sentence: cleanText,
      tokens: tokenPredictions,
      totalTokens: seqLen,
      evaluatedTokens: evaluatedProbabilities.length,
      averageNll,
      perplexity,
      modelName: 'DistilGPT-2 (Transformers.js ONNX)',
      timestamp: new Date().toISOString(),
      inferenceTimeMs,
      calculationBreakdown: {
        sumNegLogProb,
        productInverseProb,
        formulaSteps
      }
    };
  } catch (err: any) {
    console.error('Transformers.js inference error, switching to simulation:', err);
    return simulateInference(cleanText);
  }
}

export interface TokenPrediction {
  id: number;
  text: string;
  tokenId: number;
  probability: number;
  negLogProb: number; // -ln(P)
  isContextToken?: boolean; // For token 0 where no prior context exists
  topCandidates?: CandidateToken[];
  rank?: number;
  surprisalBits?: number; // -log2(P)
}

export interface CandidateToken {
  token: string;
  tokenId: number;
  probability: number;
  isActual: boolean;
}

export interface PerplexityResult {
  sentence: string;
  tokens: TokenPrediction[];
  totalTokens: number;
  evaluatedTokens: number;
  averageNll: number; // Cross entropy loss = -1/N * sum(ln(P))
  perplexity: number; // exp(averageNll)
  modelName: string;
  timestamp: string;
  inferenceTimeMs: number;
  calculationBreakdown: {
    sumNegLogProb: number;
    productInverseProb: number;
    formulaSteps: string[];
  };
}

export interface LabToken {
  id: string;
  name: string;
  probability: number;
}

export interface HistoryItem {
  id: string;
  sentence: string;
  perplexity: number;
  tokenCount: number;
  evaluatedTokens: number;
  averageNll: number;
  modelName: string;
  timestamp: string;
}

export type Theme = 'dark' | 'light';

export type NavigationTab = 
  | 'home'
  | 'explorer'
  | 'lab'
  | 'comparison'
  | 'learning'
  | 'history'
  | 'settings';

export interface ModelLoadingProgress {
  status: 'idle' | 'loading' | 'ready' | 'error';
  progress: number;
  file?: string;
  loadedBytes?: number;
  totalBytes?: number;
  message?: string;
}

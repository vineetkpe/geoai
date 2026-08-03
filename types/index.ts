export type ModelName = 'gemini' | 'gpt' | 'claude' | 'perplexity';

export interface Scan {
  id: string;
  user_id?: string | null;
  isPremiumViewer?: boolean;
  domain: string;
  brand_description: string;
  custom_queries: string[];
  visibility_score: number;
  is_unlocked: boolean;
  unlocked_by_email?: string | null;
  created_at: string;
  queries?: ScanQuery[];
}

export interface ScanQuery {
  id: string;
  scan_id: string;
  query_text: string;
  created_at: string;
  results?: ScanResult[];
}

export interface ScanResult {
  id: string;
  scan_query_id: string;
  model_name: ModelName;
  raw_response: string;
  mentioned: boolean;
  competitors_mentioned: string[];
  status: 'success' | 'unavailable' | 'skipped';
  created_at: string;
}

export interface ModelResult {
  model_name: ModelName;
  raw_response: string;
  mentioned: boolean;
  competitors_mentioned: string[];
  status: 'success' | 'unavailable' | 'skipped';
}

export interface QueryModelExecution {
  query_text: string;
  model_results: ModelResult[];
}

export interface ScanCreateInput {
  domain: string;
  brand_description: string;
  custom_queries?: string[];
}

export interface UnlockInput {
  scanId: string;
  email: string;
}

export interface ModelBreakdownItem {
  model_name: ModelName;
  displayName: string;
  totalQueries: number;
  mentionedQueries: number;
  status: 'success' | 'unavailable' | 'skipped' | 'mixed';
}

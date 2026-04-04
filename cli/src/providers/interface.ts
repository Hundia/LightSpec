/**
 * AutoSpec LLM Provider Interface
 * Strategy pattern — all providers implement this single interface.
 */

export interface LLMProvider {
  readonly name: string;           // 'claude-code' | 'gemini-cli' | 'anthropic-api'
  readonly requiresApiKey: boolean;
  readonly timeoutMs: number;

  /** Check if this provider is available on the current system */
  isAvailable(): Promise<boolean>;

  /** Generate text from a prompt, streaming chunks via async iterator */
  generate(prompt: string, options: GenerateOptions): AsyncIterable<string>;

  /** Parse provider-specific errors into user-friendly messages */
  parseError(error: unknown): ProviderError;
}

export interface GenerateOptions {
  systemPrompt?: string;
  model?: string;
  maxBudgetUsd?: number;
  temperature?: number;
  maxTokens?: number;
}

export interface ProviderError {
  type: 'auth' | 'rate_limit' | 'network' | 'model_not_found' | 'budget_exceeded' | 'timeout' | 'unknown';
  message: string;        // User-facing message with actionable fix
  retryable: boolean;
  rawError?: string;
}

/** Result of collecting all chunks from generate() */
export interface GenerateResult {
  content: string;
  provider: string;
  model: string;
  durationMs: number;
}

/**
 * LightSpec Provider Layer
 * LLM provider infrastructure — owned locally.
 */

export { resolveProvider, getAllProviders } from './resolver.js';
export type {
  LLMProvider,
  GenerateOptions,
  ProviderError,
  GenerateResult,
} from './interface.js';

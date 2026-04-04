// lsp/src/pipeline/depth-router.ts — Map depth level to templates and output files

import type { ComplexityLevel } from '../scanner/types.js';

export interface DepthPlan {
  depth: ComplexityLevel;
  templates: string[];        // template file names
  outputFiles: string[];      // output file names in .lsp/
  maxTokensPerCall: number;
  estimatedSeconds: number;
  description: string;        // human-readable description shown to the user
}

export function planDepth(depth: ComplexityLevel): DepthPlan {
  switch (depth) {
    case 'micro':
      return {
        depth: 'micro',
        templates: ['micro.hbs'],
        outputFiles: ['spec.md'],
        maxTokensPerCall: 4096,
        estimatedSeconds: 15,
        description: 'Micro spec — concise, focused, ~200 lines',
      };
    case 'standard':
      return {
        depth: 'standard',
        templates: ['standard.hbs'],
        outputFiles: ['spec.md'],
        maxTokensPerCall: 8192,
        estimatedSeconds: 45,
        description: 'Standard unified spec — architecture, API, data model, task list, ~500-1000 lines',
      };
    case 'full':
      return {
        depth: 'full',
        templates: ['full-product.hbs', 'full-technical.hbs', 'full-quality.hbs'],
        outputFiles: ['product.md', 'technical.md', 'quality.md'],
        maxTokensPerCall: 6144,
        estimatedSeconds: 90,
        description: 'Full 3-spec decomposition — product, technical, and quality specs',
      };
  }
}

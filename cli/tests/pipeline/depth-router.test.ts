// tests/pipeline/depth-router.test.ts

import { describe, it, expect } from 'vitest';
import { planDepth } from '../../src/pipeline/depth-router.js';

describe('planDepth', () => {
  it('micro returns 1 template, 1 output file, 4096 tokens', () => {
    const plan = planDepth('micro');
    expect(plan.depth).toBe('micro');
    expect(plan.templates).toHaveLength(1);
    expect(plan.templates[0]).toBe('micro.hbs');
    expect(plan.outputFiles).toHaveLength(1);
    expect(plan.outputFiles[0]).toBe('spec.md');
    expect(plan.maxTokensPerCall).toBe(4096);
  });

  it('standard returns 1 template, 1 output file, 8192 tokens', () => {
    const plan = planDepth('standard');
    expect(plan.depth).toBe('standard');
    expect(plan.templates).toHaveLength(1);
    expect(plan.templates[0]).toBe('standard.hbs');
    expect(plan.outputFiles).toHaveLength(1);
    expect(plan.outputFiles[0]).toBe('spec.md');
    expect(plan.maxTokensPerCall).toBe(8192);
  });

  it('full returns 3 templates, 3 output files, 6144 tokens', () => {
    const plan = planDepth('full');
    expect(plan.depth).toBe('full');
    expect(plan.templates).toHaveLength(3);
    expect(plan.templates).toEqual(['full-product.hbs', 'full-technical.hbs', 'full-quality.hbs']);
    expect(plan.outputFiles).toHaveLength(3);
    expect(plan.outputFiles).toEqual(['product.md', 'technical.md', 'quality.md']);
    expect(plan.maxTokensPerCall).toBe(6144);
  });

  it('all depths have correct estimated seconds', () => {
    expect(planDepth('micro').estimatedSeconds).toBe(15);
    expect(planDepth('standard').estimatedSeconds).toBe(45);
    expect(planDepth('full').estimatedSeconds).toBe(90);
  });
});

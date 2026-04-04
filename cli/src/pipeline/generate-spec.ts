// lsp/src/pipeline/generate-spec.ts — Unified LLM spec generation

import path from 'path';
import { readFile, mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import Handlebars from 'handlebars';
import type { ScanResult } from '../scanner/types.js';
import type { LLMProvider, GenerateOptions } from '../providers/index.js';
import { planDepth } from './depth-router.js';
import type { ComplexityLevel } from '../scanner/types.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GenerateSpecOptions {
  projectPath: string;
  depth: ComplexityLevel;
  outputDir: string;       // e.g. '.lsp' resolved to absolute
  provider: LLMProvider;
  model?: string;
  srsContent?: string;     // contents of --srs file if provided
  scanResult: ScanResult;
  dryRun?: boolean;
}

export interface GenerateSpecResult {
  files: string[];         // absolute paths of written files
  durationMs: number;
  provider: string;
  model: string;
  depth: ComplexityLevel;
}

// ---------------------------------------------------------------------------
// Template loading
// ---------------------------------------------------------------------------

async function loadTemplate(templateName: string): Promise<string> {
  // Resolve __dirname equivalent for ESM
  const moduleDir = path.dirname(new URL(import.meta.url).pathname);

  // Look for template relative to the compiled module location:
  //   dist/pipeline/  → dist/prompts/system/  (production build)
  //   src/pipeline/   → src/prompts/system/   (dev / ts-node)
  const candidates = [
    path.join(moduleDir, '..', 'prompts', 'system', templateName),
    path.join(moduleDir, '..', '..', 'src', 'prompts', 'system', templateName),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return readFile(candidate, 'utf-8');
    }
  }

  // Return a sensible inline fallback if templates aren't available
  return buildInlinePrompt(templateName);
}

function buildInlinePrompt(templateName: string): string {
  const base = `You are a senior software architect writing a technical specification.\n`;
  if (templateName.includes('micro')) {
    return base + `Write a concise micro spec (< 200 lines) covering: Problem, Approach, Acceptance Criteria, Notes.`;
  }
  if (templateName.includes('full-product')) {
    return base + `Write a product spec covering: Overview, User Personas, User Stories, Success Metrics.`;
  }
  if (templateName.includes('full-technical')) {
    return base + `Write a technical spec covering: Architecture, API/Endpoints, Data Model, Dependencies, Deployment.`;
  }
  if (templateName.includes('full-quality')) {
    return base + `Write a quality spec covering: Test Plan, Acceptance Criteria, Performance Benchmarks, Edge Cases.`;
  }
  // standard
  return base + `Write a standard spec covering: Overview, Technical Design, Implementation Plan, Testing Strategy, Task List.`;
}

// ---------------------------------------------------------------------------
// Template context builder
// ---------------------------------------------------------------------------

interface TemplateContext {
  projectName: string;
  date: string;
  complexityScore: number;
  suggestedDepth: string;
  brownfieldContext: string;
  srsContent: string;
  priorSpecs: string;
}

function buildTemplateContext(
  projectPath: string,
  scanResult: ScanResult,
  srsContent: string | undefined,
  priorSpecs: string,
): TemplateContext {
  return {
    projectName: path.basename(projectPath),
    date: new Date().toISOString().split('T')[0],
    complexityScore: scanResult.complexityScore,
    suggestedDepth: scanResult.suggestedDepth,
    brownfieldContext: JSON.stringify(scanResult.context, null, 2),
    srsContent: srsContent ?? 'No SRS provided — generate based on brownfield analysis.',
    priorSpecs,
  };
}

// ---------------------------------------------------------------------------
// Collect streaming chunks
// ---------------------------------------------------------------------------

async function collectGeneration(
  provider: LLMProvider,
  prompt: string,
  opts: GenerateOptions,
): Promise<{ content: string; durationMs: number }> {
  const start = Date.now();
  let content = '';

  for await (const chunk of provider.generate(prompt, opts)) {
    content += chunk;
  }

  return { content, durationMs: Date.now() - start };
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function generateSpecs(opts: GenerateSpecOptions): Promise<GenerateSpecResult> {
  const {
    projectPath,
    depth,
    outputDir,
    provider,
    model,
    srsContent,
    scanResult,
    dryRun = false,
  } = opts;

  // Dry run — return empty result without writing anything
  if (dryRun) {
    return {
      files: [],
      durationMs: 0,
      provider: provider.name,
      model: model ?? 'default',
      depth,
    };
  }

  const plan = planDepth(depth);

  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  const writtenFiles: string[] = [];
  let totalDuration = 0;
  let priorSpecs = '';

  for (let i = 0; i < plan.templates.length; i++) {
    const templateName = plan.templates[i];
    const outputFile = plan.outputFiles[i];

    // Build template context (priorSpecs grows with each iteration for full depth)
    const templateCtx = buildTemplateContext(projectPath, scanResult, srsContent, priorSpecs);

    // Load and compile Handlebars template
    const templateSource = await loadTemplate(templateName);
    const compiledTemplate = Handlebars.compile(templateSource);
    const prompt = compiledTemplate(templateCtx);

    const genOpts: GenerateOptions = {
      maxTokens: plan.maxTokensPerCall,
      ...(model ? { model } : {}),
    };

    const { content, durationMs } = await collectGeneration(provider, prompt, genOpts);
    totalDuration += durationMs;

    // Strip markdown code fences if the LLM wraps the output
    const cleaned = cleanLLMOutput(content);

    const outputPath = path.join(outputDir, outputFile);
    await writeFile(outputPath, cleaned, 'utf-8');
    writtenFiles.push(outputPath);

    // Accumulate prior specs for subsequent templates (used by full-technical and full-quality)
    priorSpecs += (priorSpecs ? '\n\n' : '') + `--- ${outputFile} ---\n${cleaned}`;
  }

  // Write .meta.json
  const meta = {
    version: '0.1.0',
    generated: new Date().toISOString(),
    depth,
    complexityScore: scanResult.complexityScore,
    provider: provider.name,
    model: model ?? 'default',
    durationMs: totalDuration,
    projectPath,
    scope: null as string | null,
    files: plan.outputFiles,
  };

  await writeFile(
    path.join(outputDir, '.meta.json'),
    JSON.stringify(meta, null, 2),
    'utf-8',
  );

  return {
    files: writtenFiles,
    durationMs: totalDuration,
    provider: provider.name,
    model: model ?? 'default',
    depth,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strip markdown code fences that some LLMs wrap their output in.
 * Handles: ```markdown\n...\n``` and ```\n...\n```
 */
function cleanLLMOutput(content: string): string {
  return content
    .replace(/^```(?:markdown)?\r?\n/m, '')
    .replace(/\r?\n```\s*$/m, '')
    .trim();
}

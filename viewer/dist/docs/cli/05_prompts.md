---
title: LightSpec Prompt Engineering
sprint: 37
created: 2026-03-27
---

# LightSpec Prompt Engineering

## Overview

LightSpec uses Handlebars-compiled prompt templates to guide LLM generation. Each template is a `.hbs` file stored in `src/prompts/system/` (copied to `dist/prompts/system/` at build time). Templates are compiled with a `TemplateContext` object that injects brownfield scan results, project metadata, and any user-supplied SRS content.

---

## The Six Prompt Templates

| Template | Depth | Purpose | Target Output |
|----------|-------|---------|---------------|
| `micro.hbs` | micro | Concise spec for small tasks/features | ~200 lines covering Problem, Approach, Criteria, Notes |
| `standard.hbs` | standard | Balanced unified spec | ~500-1000 lines covering Overview, Technical Design, Task List |
| `full-product.hbs` | full | Product spec — the "what" | User personas, stories, success metrics, roadmap |
| `full-technical.hbs` | full | Technical spec — the "how" | Architecture, API, data model, deployment plan |
| `full-quality.hbs` | full | Quality spec — the "verify" | Test plan, acceptance criteria, performance benchmarks |
| `analyze-complexity.hbs` | internal | (Future) LLM-assisted complexity analysis | JSON complexity assessment |

---

## XML Tag Structure

Each template uses XML semantic tags to partition the prompt into distinct sections that the LLM processes in order:

```handlebars
<role>
You are a senior software architect specializing in {{suggestedDepth}} specifications.
Your goal is to generate a clear, actionable spec based on the brownfield context provided.
</role>

<context>
Project: {{projectName}}
Date: {{date}}
Complexity Score: {{complexityScore}}/100
Suggested Depth: {{suggestedDepth}}

Brownfield Analysis:
{{{brownfieldContext}}}
</context>

<input>
{{#if srsContent}}
SRS / Requirements Document:
{{{srsContent}}}
{{else}}
No SRS provided — generate spec from brownfield analysis only.
{{/if}}
</input>

<constraints>
- Stay within the {{suggestedDepth}} depth level
- Do not invent external dependencies not present in the brownfield context
- Use the exact output format specified below
- Be concise: micro=200 lines, standard=800 lines, full-* each ~600 lines
</constraints>

<output_format>
[Depth-specific markdown structure defined here]
</output_format>
```

The `<role>` tag establishes the LLM's persona and task framing. The `<context>` tag provides structured brownfield data. The `<input>` tag contains user-supplied requirements (or a fallback). The `<constraints>` tag enforces depth discipline. The `<output_format>` tag specifies the exact markdown structure expected, preventing free-form deviation.

---

## How Brownfield Context Is Injected

The `buildTemplateContext()` function in `generate-spec.ts` constructs the `TemplateContext` object passed to `Handlebars.compile()`:

```typescript
interface TemplateContext {
  projectName: string;        // basename of project path
  date: string;               // ISO date: 2026-03-27
  complexityScore: number;    // 0-100 from scanner
  suggestedDepth: string;     // 'micro' | 'standard' | 'full'
  brownfieldContext: string;  // JSON.stringify(scanResult.context, null, 2)
  srsContent: string;         // user-provided SRS or fallback message
  priorSpecs: string;         // accumulated output from prior templates (full depth chaining)
}
```

The `brownfieldContext` field is a JSON serialization of the full `BrownfieldContext` object, which includes tech stack, architecture pattern, detected routes, documentation, and metrics. This gives the LLM a structured data source rather than requiring it to infer project shape from free-form text.

---

## Token Budgets Per Depth Level

| Depth | maxTokensPerCall | estimatedSeconds | Rationale |
|-------|-----------------|------------------|-----------|
| micro | 4,096 | 15s | Small task — concise output, minimal LLM processing |
| standard | 8,192 | 45s | Balanced — room for Technical Design + Task List |
| full | 6,144 per call | 90s total | Three focused calls, each tightly scoped |

The `full` depth uses 6,144 tokens per call (not the 8,192 of standard) because each of the three templates is narrowly scoped. Over three sequential calls the total effective budget is ~18,432 tokens, enabling a comprehensive decomposition while keeping each individual LLM call fast and focused.

---

## Full-Depth Template Chaining

The `full` depth generates three files in sequence: `product.md` → `technical.md` → `quality.md`. Each subsequent template receives the output of all prior templates as `{{{priorSpecs}}}` in its context. This chaining pattern ensures coherence:

1. `full-product.hbs` generates user personas and stories with no prior context
2. `full-technical.hbs` receives product.md content — architecture decisions derive from product requirements
3. `full-quality.hbs` receives both product.md and technical.md — test plan covers both product acceptance and technical implementation

In code (`generate-spec.ts`):
```typescript
let priorSpecs = '';
for (let i = 0; i < plan.templates.length; i++) {
  const templateCtx = buildTemplateContext(projectPath, scanResult, srsContent, priorSpecs);
  const prompt = Handlebars.compile(templateSource)(templateCtx);
  const { content } = await collectGeneration(provider, prompt, genOpts);
  priorSpecs += `\n\n--- ${outputFile} ---\n${content}`;
}
```

---

## Template Variable Reference

| Variable | Type | Source | Available In |
|----------|------|--------|-------------|
| `projectName` | string | `path.basename(projectPath)` | All templates |
| `date` | string | `new Date().toISOString()` | All templates |
| `complexityScore` | number | `scanResult.complexityScore` | All templates |
| `suggestedDepth` | string | `scanResult.suggestedDepth` | All templates |
| `brownfieldContext` | string | `JSON.stringify(scanResult.context)` | All templates |
| `srsContent` | string | `--srs` file contents or fallback | All templates |
| `priorSpecs` | string | Accumulated prior outputs | `full-technical.hbs`, `full-quality.hbs` |

Triple-stash `{{{variable}}}` is used for multi-line content (brownfieldContext, srsContent, priorSpecs) to prevent Handlebars HTML-escaping the markdown content. Double-stash `{{variable}}` is used for scalar values (projectName, date, complexityScore).

---

## Inline Fallback Templates

When `.hbs` template files are not available (e.g., running directly from source without a build), `buildInlinePrompt()` in `generate-spec.ts` provides minimal inline prompts. These are intentionally sparse — they produce functional output but lack the depth and structure of the full Handlebars templates. The build script (`npm run build`) always copies templates to `dist/prompts/system/`, so fallbacks only apply in unusual environments.

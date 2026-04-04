import {
  scanProject
} from "./chunk-KSG3WSUX.js";

// src/commands/init.ts
import path3 from "path";
import readline from "readline";
import { readFile as readFile2, writeFile as writeFile3, mkdir as mkdir2 } from "fs/promises";
import { existsSync as existsSync2 } from "fs";
import chalk from "chalk";
import ora from "ora";

// src/pipeline/depth-router.ts
function planDepth(depth) {
  switch (depth) {
    case "micro":
      return {
        depth: "micro",
        templates: ["micro.hbs"],
        outputFiles: ["spec.md"],
        maxTokensPerCall: 4096,
        estimatedSeconds: 15,
        description: "Micro spec \u2014 concise, focused, ~200 lines"
      };
    case "standard":
      return {
        depth: "standard",
        templates: ["standard.hbs"],
        outputFiles: ["spec.md"],
        maxTokensPerCall: 8192,
        estimatedSeconds: 45,
        description: "Standard unified spec \u2014 architecture, API, data model, task list, ~500-1000 lines"
      };
    case "full":
      return {
        depth: "full",
        templates: ["full-product.hbs", "full-technical.hbs", "full-quality.hbs"],
        outputFiles: ["product.md", "technical.md", "quality.md"],
        maxTokensPerCall: 6144,
        estimatedSeconds: 90,
        description: "Full 3-spec decomposition \u2014 product, technical, and quality specs"
      };
  }
}

// src/pipeline/generate-spec.ts
import path from "path";
import { readFile, mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import Handlebars from "handlebars";
async function loadTemplate(templateName) {
  const moduleDir = path.dirname(new URL(import.meta.url).pathname);
  const candidates = [
    path.join(moduleDir, "..", "prompts", "system", templateName),
    path.join(moduleDir, "..", "..", "src", "prompts", "system", templateName)
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return readFile(candidate, "utf-8");
    }
  }
  return buildInlinePrompt(templateName);
}
function buildInlinePrompt(templateName) {
  const base = `You are a senior software architect writing a technical specification.
`;
  if (templateName.includes("micro")) {
    return base + `Write a concise micro spec (< 200 lines) covering: Problem, Approach, Acceptance Criteria, Notes.`;
  }
  if (templateName.includes("full-product")) {
    return base + `Write a product spec covering: Overview, User Personas, User Stories, Success Metrics.`;
  }
  if (templateName.includes("full-technical")) {
    return base + `Write a technical spec covering: Architecture, API/Endpoints, Data Model, Dependencies, Deployment.`;
  }
  if (templateName.includes("full-quality")) {
    return base + `Write a quality spec covering: Test Plan, Acceptance Criteria, Performance Benchmarks, Edge Cases.`;
  }
  return base + `Write a standard spec covering: Overview, Technical Design, Implementation Plan, Testing Strategy, Task List.`;
}
function buildTemplateContext(projectPath, scanResult, srsContent, priorSpecs) {
  return {
    projectName: path.basename(projectPath),
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    complexityScore: scanResult.complexityScore,
    suggestedDepth: scanResult.suggestedDepth,
    brownfieldContext: JSON.stringify(scanResult.context, null, 2),
    srsContent: srsContent ?? "No SRS provided \u2014 generate based on brownfield analysis.",
    priorSpecs
  };
}
async function collectGeneration(provider, prompt, opts) {
  const start = Date.now();
  let content = "";
  for await (const chunk of provider.generate(prompt, opts)) {
    content += chunk;
  }
  return { content, durationMs: Date.now() - start };
}
async function generateSpecs(opts) {
  const {
    projectPath,
    depth,
    outputDir,
    provider,
    model,
    srsContent,
    scanResult,
    dryRun = false
  } = opts;
  if (dryRun) {
    return {
      files: [],
      durationMs: 0,
      provider: provider.name,
      model: model ?? "default",
      depth
    };
  }
  const plan = planDepth(depth);
  await mkdir(outputDir, { recursive: true });
  const writtenFiles = [];
  let totalDuration = 0;
  let priorSpecs = "";
  for (let i = 0; i < plan.templates.length; i++) {
    const templateName = plan.templates[i];
    const outputFile = plan.outputFiles[i];
    const templateCtx = buildTemplateContext(projectPath, scanResult, srsContent, priorSpecs);
    const templateSource = await loadTemplate(templateName);
    const compiledTemplate = Handlebars.compile(templateSource);
    const prompt = compiledTemplate(templateCtx);
    const genOpts = {
      maxTokens: plan.maxTokensPerCall,
      ...model ? { model } : {}
    };
    const { content, durationMs } = await collectGeneration(provider, prompt, genOpts);
    totalDuration += durationMs;
    const cleaned = cleanLLMOutput(content);
    const outputPath = path.join(outputDir, outputFile);
    await writeFile(outputPath, cleaned, "utf-8");
    writtenFiles.push(outputPath);
    priorSpecs += (priorSpecs ? "\n\n" : "") + `--- ${outputFile} ---
${cleaned}`;
  }
  const meta = {
    version: "0.1.0",
    generated: (/* @__PURE__ */ new Date()).toISOString(),
    depth,
    complexityScore: scanResult.complexityScore,
    provider: provider.name,
    model: model ?? "default",
    durationMs: totalDuration,
    projectPath,
    scope: null,
    files: plan.outputFiles
  };
  await writeFile(
    path.join(outputDir, ".meta.json"),
    JSON.stringify(meta, null, 2),
    "utf-8"
  );
  return {
    files: writtenFiles,
    durationMs: totalDuration,
    provider: provider.name,
    model: model ?? "default",
    depth
  };
}
function cleanLLMOutput(content) {
  return content.replace(/^```(?:markdown)?\r?\n/m, "").replace(/\r?\n```\s*$/m, "").trim();
}

// src/pipeline/task-extractor.ts
function extractTasks(specContent) {
  const tableRows = extractFromTable(specContent);
  if (tableRows.length > 0) return tableRows;
  const checklistRows = extractFromChecklist(specContent);
  if (checklistRows.length > 0) return checklistRows;
  return extractFromNumberedList(specContent);
}
function normalizePriority(raw) {
  const lower = raw.toLowerCase().trim();
  if (lower === "high") return "high";
  if (lower === "low") return "low";
  return "medium";
}
function extractFromTable(content) {
  const tasks = [];
  const lines = content.split("\n");
  const tableRowRegex = /^\s*\|\s*(\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/;
  for (const line of lines) {
    const match = tableRowRegex.exec(line);
    if (!match) continue;
    const id = parseInt(match[1], 10);
    const title = match[2].trim();
    const priority = match[3].trim();
    const estimate = match[4].trim();
    if (isNaN(id) || title.toLowerCase() === "task" || title.includes("---")) continue;
    tasks.push({ id, title, priority: normalizePriority(priority), estimate, done: false });
  }
  return tasks;
}
function extractFromChecklist(content) {
  const tasks = [];
  const checklistRegex = /^\s*-\s*\[([ xX])\]\s*(.+)$/;
  const lines = content.split("\n");
  let id = 1;
  for (const line of lines) {
    const match = checklistRegex.exec(line);
    if (!match) continue;
    const done = match[1].toLowerCase() === "x";
    const title = match[2].trim();
    tasks.push({ id: id++, title, priority: "medium", estimate: "TBD", done });
  }
  return tasks;
}
function extractFromNumberedList(content) {
  const tasks = [];
  const lines = content.split("\n");
  let inTaskSection = false;
  let id = 1;
  const taskHeadingRegex = /^#{1,3}\s+(Tasks?|Implementation Plan|Action Items?)/i;
  const numberedItemRegex = /^\s*\d+\.\s+(.+)$/;
  for (const line of lines) {
    if (taskHeadingRegex.test(line)) {
      inTaskSection = true;
      continue;
    }
    if (inTaskSection && /^#{1,3}\s+/.test(line)) {
      inTaskSection = false;
    }
    if (!inTaskSection) continue;
    const match = numberedItemRegex.exec(line);
    if (match) {
      tasks.push({ id: id++, title: match[1].trim(), priority: "medium", estimate: "TBD", done: false });
    }
  }
  return tasks;
}
function formatTasksMarkdown(tasks) {
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const frontmatter = [
    "---",
    "generated_by: lightspec",
    "version: 0.1.0",
    `date: ${today}`,
    "---",
    ""
  ].join("\n");
  if (tasks.length === 0) {
    return frontmatter + "# Task List\n\nNo tasks found.\n";
  }
  const header = "# Task List\n\n| # | Task | Priority | Estimate | Status |\n|---|------|----------|----------|--------|\n";
  const rows = tasks.map((t) => {
    const priorityLabel = t.priority.charAt(0).toUpperCase() + t.priority.slice(1);
    return `| ${t.id} | ${t.title} | ${priorityLabel} | ${t.estimate} | ${t.done ? "[x]" : "[ ]"} |`;
  }).join("\n");
  return frontmatter + header + rows + "\n";
}

// src/providers/claude-code.provider.ts
import { execa } from "execa";
import { mkdtemp, writeFile as writeFile2, rm } from "fs/promises";
import path2 from "path";
import os from "os";

// src/utils/signals.ts
var cleanupCallbacks = [];
function registerCleanup(callback) {
  cleanupCallbacks.push(callback);
}

// src/providers/claude-code.provider.ts
var ClaudeCodeProvider = class {
  name = "claude-code";
  requiresApiKey = false;
  timeoutMs = 9e5;
  // 15 minutes — complex SRS specs with accumulated context can take 5-10 minutes
  async isAvailable() {
    try {
      const { exitCode: whichExit } = await execa("which", ["claude"], { reject: false });
      if (whichExit !== 0) return false;
      const { exitCode: authExit } = await execa("claude", ["auth", "status"], {
        reject: false,
        timeout: 1e4
      });
      return authExit === 0;
    } catch {
      return false;
    }
  }
  async *generate(prompt, options) {
    const args = ["--print", "--output-format", "stream-json", "--verbose"];
    if (options.model) {
      args.push("--model", options.model);
    }
    let tmpDir;
    if (options.systemPrompt) {
      tmpDir = await mkdtemp(path2.join(os.tmpdir(), "autospec-"));
      const sysPromptFile = path2.join(tmpDir, "system.md");
      await writeFile2(sysPromptFile, options.systemPrompt, "utf8");
      args.push("--system-prompt-file", sysPromptFile);
      registerCleanup(async () => {
        if (tmpDir) {
          await rm(tmpDir, { recursive: true, force: true });
        }
      });
    }
    try {
      const proc = execa("claude", args, {
        input: prompt,
        timeout: this.timeoutMs,
        all: true
      });
      if (!proc.stdout) {
        throw { type: "unknown", message: "Claude Code returned no stdout stream.", retryable: false };
      }
      let buffer = "";
      for await (const chunk of proc.stdout) {
        buffer += typeof chunk === "string" ? chunk : chunk.toString("utf8");
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const event = JSON.parse(trimmed);
            const content = event.type === "assistant" ? event.message?.content ?? event.content : null;
            if (content) {
              if (typeof content === "string") {
                yield content;
              } else if (Array.isArray(content)) {
                for (const block of content) {
                  if (block.type === "text" && typeof block.text === "string") {
                    yield block.text;
                  }
                }
              }
            }
            if (event.type === "result" && typeof event.result === "string" && !event.is_error) {
            }
          } catch {
          }
        }
      }
      if (buffer.trim()) {
        try {
          const event = JSON.parse(buffer.trim());
          const content = event.type === "assistant" ? event.message?.content ?? event.content : null;
          if (content) {
            if (typeof content === "string") {
              yield content;
            } else if (Array.isArray(content)) {
              for (const block of content) {
                if (block.type === "text" && typeof block.text === "string") {
                  yield block.text;
                }
              }
            }
          }
        } catch {
        }
      }
      await proc;
    } catch (error) {
      const providerError = this.parseError(error);
      throw providerError;
    } finally {
      if (tmpDir) {
        await rm(tmpDir, { recursive: true, force: true }).catch(() => {
        });
      }
    }
  }
  parseError(error) {
    const err = error;
    const stderr = err.stderr || err.message || "";
    if (err.timedOut) {
      return {
        type: "timeout",
        message: `Claude Code timed out after ${this.timeoutMs / 1e3}s. Try a shorter prompt or increase timeout.`,
        retryable: true
      };
    }
    if (stderr.includes("rate limit") || stderr.includes("429")) {
      return {
        type: "rate_limit",
        message: "Rate limit reached. Wait 60s or use --provider anthropic-api.",
        retryable: true
      };
    }
    if (stderr.includes("auth") || stderr.includes("login") || stderr.includes("401")) {
      return {
        type: "auth",
        message: "Auth expired. Run: claude auth login",
        retryable: false
      };
    }
    if (stderr.includes("not found") || stderr.includes("ENOENT")) {
      return {
        type: "unknown",
        message: "Claude Code CLI not found. Install: npm i -g @anthropic-ai/claude-code",
        retryable: false
      };
    }
    return {
      type: "unknown",
      message: `Claude Code error: ${stderr.slice(0, 200)}`,
      retryable: false,
      rawError: stderr
    };
  }
};

// src/providers/gemini-cli.provider.ts
import { execa as execa2 } from "execa";
var GeminiCliProvider = class {
  name = "gemini-cli";
  requiresApiKey = false;
  timeoutMs = 12e4;
  async isAvailable() {
    try {
      const { exitCode } = await execa2("which", ["gemini"], { reject: false });
      return exitCode === 0;
    } catch {
      return false;
    }
  }
  async *generate(prompt, options) {
    const args = ["--print"];
    if (options.model) {
      args.push("--model", options.model);
    }
    if (options.systemPrompt) {
      args.push("--system", options.systemPrompt);
    }
    try {
      const result = await execa2("gemini", args, {
        input: prompt,
        timeout: this.timeoutMs
      });
      yield result.stdout;
    } catch (error) {
      throw this.parseError(error);
    }
  }
  parseError(error) {
    const err = error;
    const stderr = err.stderr || err.message || "";
    if (err.timedOut) {
      return {
        type: "timeout",
        message: `Gemini CLI timed out after ${this.timeoutMs / 1e3}s.`,
        retryable: true
      };
    }
    if (stderr.includes("rate limit") || stderr.includes("429") || stderr.includes("RESOURCE_EXHAUSTED")) {
      return {
        type: "rate_limit",
        message: "Gemini rate limit reached. Wait 60s and retry.",
        retryable: true
      };
    }
    if (stderr.includes("auth") || stderr.includes("login") || stderr.includes("UNAUTHENTICATED")) {
      return {
        type: "auth",
        message: "Gemini auth expired. Run: gemini auth login",
        retryable: false
      };
    }
    if (stderr.includes("not found") || stderr.includes("ENOENT")) {
      return {
        type: "unknown",
        message: "Gemini CLI not found. Install: npm i -g @google/gemini-cli",
        retryable: false
      };
    }
    return {
      type: "unknown",
      message: `Gemini CLI error: ${stderr.slice(0, 200)}`,
      retryable: false,
      rawError: stderr
    };
  }
};

// src/providers/anthropic-api.provider.ts
var AnthropicApiProvider = class {
  name = "anthropic-api";
  requiresApiKey = true;
  timeoutMs = 6e4;
  getApiKey() {
    return process.env.ANTHROPIC_API_KEY;
  }
  async isAvailable() {
    return !!this.getApiKey();
  }
  async *generate(prompt, options) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw {
        type: "auth",
        message: "ANTHROPIC_API_KEY not set. Run: export ANTHROPIC_API_KEY=sk-ant-...",
        retryable: false
      };
    }
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });
    const model = options.model || "claude-sonnet-4-20250514";
    try {
      const stream = client.messages.stream({
        model,
        max_tokens: options.maxTokens || 8192,
        ...options.systemPrompt ? { system: options.systemPrompt } : {},
        messages: [{ role: "user", content: prompt }]
      });
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          yield event.delta.text;
        }
      }
    } catch (error) {
      throw this.parseError(error);
    }
  }
  parseError(error) {
    const err = error;
    const status = err.status;
    const message = err.message || "";
    const errorType = err.error?.type || "";
    if (status === 401 || status === 403) {
      return {
        type: "auth",
        message: "Invalid ANTHROPIC_API_KEY. Check your key at console.anthropic.com",
        retryable: false
      };
    }
    if (status === 429) {
      return {
        type: "rate_limit",
        message: "Anthropic API rate limit. Wait 60s and retry.",
        retryable: true
      };
    }
    if (status === 500 || status === 503 || status === 529) {
      return {
        type: "network",
        message: "Anthropic API server error. Retrying...",
        retryable: true
      };
    }
    if (errorType === "not_found_error" || message.includes("model")) {
      return {
        type: "model_not_found",
        message: "Model not found. Try: claude-sonnet-4-20250514",
        retryable: false
      };
    }
    return {
      type: "unknown",
      message: `Anthropic API error: ${message.slice(0, 200)}`,
      retryable: false,
      rawError: message
    };
  }
};

// src/providers/resolver.ts
var PROVIDERS = [
  new ClaudeCodeProvider(),
  new GeminiCliProvider(),
  // Priority 2
  new AnthropicApiProvider()
  // Priority 3
];
async function resolveProvider(override) {
  if (override) {
    const provider = PROVIDERS.find((p) => p.name === override);
    if (!provider) {
      throw new Error(
        `Unknown provider: ${override}. Available: ${PROVIDERS.map((p) => p.name).join(", ")}`
      );
    }
    if (!await provider.isAvailable()) {
      throw new Error(`Provider ${override} is not available. Run: autospec doctor`);
    }
    return provider;
  }
  for (const provider of PROVIDERS) {
    if (await provider.isAvailable()) return provider;
  }
  throw new Error(
    "No LLM provider found.\n\nInstall one of:\n  Claude Code:    npm i -g @anthropic-ai/claude-code && claude auth login\n  Gemini CLI:     npm i -g @google/gemini-cli && gemini auth login\n  Anthropic API:  export ANTHROPIC_API_KEY=sk-ant-...\n\nCheck status: autospec doctor\n"
  );
}

// src/commands/init.ts
function confirm(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() !== "n" && answer.trim().toLowerCase() !== "no");
    });
  });
}
function isValidDepth(d) {
  return d === "micro" || d === "standard" || d === "full";
}
function formatEstimate(seconds) {
  if (seconds < 60) return `~${seconds}s`;
  return `~${Math.round(seconds / 60)}m`;
}
async function initCommand(projectPath, opts) {
  const start = Date.now();
  const targetPath = projectPath ? path3.resolve(projectPath) : process.cwd();
  const scope = typeof opts["scope"] === "string" ? opts["scope"] : void 0;
  const outputDir = path3.resolve(
    targetPath,
    typeof opts["output"] === "string" ? opts["output"] : ".lsp"
  );
  const skipConfirm = opts["yes"] === true;
  const dryRun = opts["dryRun"] === true || opts["dry-run"] === true;
  const depthOverride = typeof opts["depth"] === "string" && isValidDepth(opts["depth"]) ? opts["depth"] : void 0;
  const providerOverride = typeof opts["provider"] === "string" ? opts["provider"] : void 0;
  const modelOverride = typeof opts["model"] === "string" ? opts["model"] : void 0;
  const srsFile = typeof opts["srs"] === "string" ? opts["srs"] : void 0;
  console.log("");
  console.log(chalk.bold.cyan("  LightSpec \u2014 lsp init"));
  console.log(chalk.gray(`  Project: ${targetPath}`));
  if (scope) console.log(chalk.gray(`  Scope:   ${scope}`));
  console.log("");
  const scanSpinner = ora("Scanning project...").start();
  let scanResult;
  try {
    scanResult = await scanProject(targetPath, scope);
    scanSpinner.succeed("Scan complete");
  } catch (err) {
    scanSpinner.fail("Scan failed");
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`  Error: ${message}`));
    process.exit(1);
  }
  console.log("");
  const scoreColor = scanResult.complexityScore <= 25 ? chalk.green : scanResult.complexityScore <= 65 ? chalk.yellow : chalk.red;
  console.log(chalk.bold("  Scan Results"));
  console.log(`  ${scanResult.summary}`);
  console.log("");
  console.log(`  Complexity score:  ${scoreColor(scanResult.complexityScore + "/100")}`);
  console.log(`  Suggested depth:   ${chalk.bold(scanResult.suggestedDepth)}`);
  console.log(`  Reasoning:         ${chalk.gray(scanResult.reasoning)}`);
  if (scanResult.context.techStack.languages.length > 0) {
    console.log(
      `  Stack:             ${chalk.cyan(
        [
          ...scanResult.context.techStack.languages,
          ...scanResult.context.techStack.frameworks
        ].slice(0, 5).join(", ")
      )}`
    );
  }
  const depth = depthOverride ?? scanResult.suggestedDepth;
  if (depthOverride) {
    console.log("");
    console.log(chalk.yellow(`  Depth override: ${depthOverride} (was: ${scanResult.suggestedDepth})`));
  }
  const plan = planDepth(depth);
  console.log("");
  console.log(chalk.bold("  Generation Plan"));
  console.log(`  Depth:       ${chalk.bold(depth)}`);
  console.log(`  Output:      ${chalk.cyan(outputDir)}`);
  console.log(`  Files:       ${chalk.cyan(plan.outputFiles.join(", ") + ", tasks.md")}`);
  console.log(`  Tokens/call: ${chalk.cyan(plan.maxTokensPerCall.toLocaleString())}`);
  console.log(`  Estimated:   ${chalk.cyan(formatEstimate(plan.estimatedSeconds))}`);
  if (srsFile) console.log(`  SRS:         ${chalk.cyan(srsFile)}`);
  if (dryRun) {
    console.log("");
    console.log(chalk.yellow("  Dry run \u2014 no files written."));
    console.log("");
    return;
  }
  if (!skipConfirm) {
    console.log("");
    const ok = await confirm(chalk.bold("  Proceed with generation? [Y/n] "));
    if (!ok) {
      console.log(chalk.yellow("  Aborted."));
      console.log("");
      return;
    }
  }
  let srsContent;
  if (srsFile) {
    const srsPath = path3.resolve(srsFile);
    if (!existsSync2(srsPath)) {
      console.error(chalk.red(`  SRS file not found: ${srsPath}`));
      process.exit(1);
    }
    srsContent = await readFile2(srsPath, "utf-8");
  }
  const providerSpinner = ora("Resolving LLM provider...").start();
  let provider;
  try {
    provider = await resolveProvider(providerOverride);
    providerSpinner.succeed(`Using provider: ${chalk.bold(provider.name)}`);
  } catch (err) {
    providerSpinner.fail("No LLM provider available");
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`
${message}`));
    process.exit(1);
  }
  await mkdir2(outputDir, { recursive: true });
  console.log("");
  const genSpinner = ora(`Generating ${depth} spec...`).start();
  let genResult;
  try {
    genResult = await generateSpecs({
      projectPath: targetPath,
      depth,
      outputDir,
      provider,
      model: modelOverride,
      srsContent,
      scanResult
    });
    genSpinner.succeed(`Spec generated (${genResult.durationMs}ms)`);
  } catch (err) {
    genSpinner.fail("Generation failed");
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`  Error: ${message}`));
    process.exit(1);
  }
  const taskSpinner = ora("Extracting tasks...").start();
  try {
    const { readFile: readSpecFile } = await import("fs/promises");
    const specFiles = genResult.files;
    let allSpecContent = "";
    for (const f of specFiles) {
      allSpecContent += await readSpecFile(f, "utf-8");
    }
    const tasks = extractTasks(allSpecContent);
    const tasksMarkdown = formatTasksMarkdown(tasks);
    await writeFile3(path3.join(outputDir, "tasks.md"), tasksMarkdown, "utf-8");
    taskSpinner.succeed(`Tasks extracted: ${tasks.length} task(s) written to tasks.md`);
  } catch (err) {
    taskSpinner.fail("Task extraction failed (non-fatal)");
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.yellow(`  Warning: ${message}`));
  }
  const elapsed = ((Date.now() - start) / 1e3).toFixed(1);
  console.log("");
  console.log(chalk.bold.green("  Done!"));
  console.log(chalk.gray("  " + "\u2500".repeat(50)));
  console.log(`  Time:     ${chalk.cyan(elapsed + "s")}`);
  console.log(`  Depth:    ${chalk.cyan(depth)}`);
  console.log(`  Provider: ${chalk.cyan(genResult.provider)}`);
  console.log(`  Output:   ${chalk.cyan(outputDir)}`);
  console.log("");
  console.log(chalk.bold("  Next steps:"));
  console.log(`  ${chalk.cyan("1.")} Review your spec: ${chalk.gray(path3.join(outputDir, plan.outputFiles[0]))}`);
  console.log(`  ${chalk.cyan("2.")} Check tasks:      ${chalk.gray("lsp status")}`);
  console.log(
    `  ${chalk.cyan("3.")} Grow into AutoSpec: ${chalk.gray("lsp graduate")} (when ready)`
  );
  console.log("");
}
export {
  initCommand
};

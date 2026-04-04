#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";
var program = new Command().name("lsp").description("LightSpec \u2014 Just enough spec, just fast enough").version("0.1.0");
program.command("init [path]").description("Scan project, detect complexity, generate specs").option("--depth <level>", "Override depth: micro | standard | full").option("--scope <dir>", "Scope analysis to a subdirectory").option("--srs <file>", "Provide an SRS/PRD document as input").option("--provider <name>", "Force LLM provider").option("--model <name>", "Override model").option("-o, --output <dir>", "Output directory", ".lsp").option("-y, --yes", "Skip confirmation prompt").option("--dry-run", "Show plan without generating").action(async (_path, _opts) => {
  const { initCommand } = await import("./init-QQSITZO5.js");
  await initCommand(_path, _opts);
});
program.command("scan [path]").description("Run brownfield scanner only (no LLM calls)").option("--json", "Output as JSON").option("--scope <dir>", "Scope to subdirectory").action(async (_path, _opts) => {
  const { scanCommand } = await import("./scan-ETKYMLXZ.js");
  await scanCommand(_path, _opts);
});
program.command("status").description("Show task list progress from .lsp/tasks.md").action(async () => {
  const { statusCommand } = await import("./status-OCL3PP3R.js");
  await statusCommand();
});
program.command("graduate").description("Convert LSP output to full AutoSpec project").option("--srs <file>", "Use existing SRS for AutoSpec generation").action(async (_opts) => {
  const { graduateCommand } = await import("./graduate-GNUJ6DHK.js");
  await graduateCommand(_opts);
});
program.parse(process.argv);

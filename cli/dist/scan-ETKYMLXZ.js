import {
  scanProject
} from "./chunk-KSG3WSUX.js";

// src/commands/scan.ts
import path from "path";
import chalk from "chalk";
import ora from "ora";
async function scanCommand(projectPath, opts) {
  const targetPath = projectPath ? path.resolve(projectPath) : process.cwd();
  const scope = typeof opts["scope"] === "string" ? opts["scope"] : void 0;
  const asJson = opts["json"] === true;
  const spinner = asJson ? null : ora("Scanning project...").start();
  let result;
  try {
    result = await scanProject(targetPath, scope);
    spinner?.succeed("Scan complete");
  } catch (err) {
    spinner?.fail("Scan failed");
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`Error: ${message}`));
    process.exit(1);
  }
  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.log("");
  console.log(chalk.bold.cyan("  LightSpec Brownfield Scan Results"));
  console.log(chalk.gray("  " + "\u2500".repeat(50)));
  console.log("");
  console.log(chalk.bold("  Summary"));
  console.log(`  ${result.summary}`);
  console.log("");
  const scoreColor = result.complexityScore <= 25 ? chalk.green : result.complexityScore <= 65 ? chalk.yellow : chalk.red;
  console.log(chalk.bold("  Complexity"));
  console.log(`  Score:      ${scoreColor(result.complexityScore + "/100")}`);
  console.log(`  Depth:      ${chalk.bold(result.suggestedDepth)}`);
  console.log(`  Reasoning:  ${chalk.gray(result.reasoning)}`);
  console.log("");
  const { techStack } = result.context;
  console.log(chalk.bold("  Tech Stack"));
  if (techStack.languages.length > 0) {
    console.log(`  Languages:  ${chalk.cyan(techStack.languages.join(", "))}`);
  }
  if (techStack.frameworks.length > 0) {
    console.log(`  Frameworks: ${chalk.cyan(techStack.frameworks.join(", "))}`);
  }
  if (techStack.testFrameworks.length > 0) {
    console.log(`  Tests:      ${chalk.cyan(techStack.testFrameworks.join(", "))}`);
  }
  if (techStack.buildTools.length > 0) {
    console.log(`  Build:      ${chalk.cyan(techStack.buildTools.join(", "))}`);
  }
  if (techStack.packageManager) {
    console.log(`  Package:    ${chalk.cyan(techStack.packageManager)}`);
  }
  console.log("");
  const { architecture } = result.context;
  console.log(chalk.bold("  Architecture"));
  console.log(`  Pattern:    ${chalk.cyan(architecture.pattern)}`);
  const flags = [
    architecture.hasApi && "API",
    architecture.hasFrontend && "Frontend",
    architecture.hasDatabase && "Database"
  ].filter(Boolean);
  if (flags.length > 0) {
    console.log(`  Features:   ${chalk.cyan(flags.join(", "))}`);
  }
  if (architecture.entryPoints.length > 0) {
    console.log(`  Entry:      ${chalk.gray(architecture.entryPoints.slice(0, 3).join(", "))}`);
  }
  console.log("");
  const { metrics } = result.context;
  console.log(chalk.bold("  Metrics"));
  console.log(`  Files:      ${chalk.cyan(metrics.totalFiles)}`);
  console.log(`  Lines:      ${chalk.cyan(metrics.totalLines.toLocaleString())}`);
  console.log(`  Source:     ${chalk.cyan(metrics.sourceFiles)}`);
  console.log(`  Tests:      ${chalk.cyan(metrics.testFiles)}`);
  console.log("");
}
export {
  scanCommand
};

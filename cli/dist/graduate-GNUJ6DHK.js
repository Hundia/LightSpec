// src/commands/graduate.ts
import path from "path";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import chalk from "chalk";
import ora from "ora";
function extractSection(content, heading) {
  const lines = content.split("\n");
  let capturing = false;
  let headingLevel = 2;
  const result = [];
  for (const line of lines) {
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      if (capturing) {
        if (level <= headingLevel) {
          break;
        }
      }
      if (title.toLowerCase().includes(heading.toLowerCase())) {
        capturing = true;
        headingLevel = level;
        result.push(line);
        continue;
      }
    }
    if (capturing) {
      result.push(line);
    }
  }
  return result.join("\n").trim();
}
async function readSpecFiles(lspDir) {
  const candidates = ["spec.md", "product.md", "technical.md", "quality.md"];
  const parts = [];
  for (const file of candidates) {
    const filePath = path.join(lspDir, file);
    if (existsSync(filePath)) {
      const content = await readFile(filePath, "utf-8");
      parts.push(`<!-- Source: ${file} -->
${content}`);
    }
  }
  return parts.join("\n\n");
}
var TODAY = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
function makeRoleFrontmatter(role, sourceFile) {
  return [
    "---",
    `role: ${role}`,
    "generated_by: lightspec-graduate",
    `source: ${sourceFile}`,
    `date: ${TODAY}`,
    "status: draft",
    "---",
    ""
  ].join("\n");
}
function stubRole(roleNumber, roleName, description) {
  const frontmatter = makeRoleFrontmatter(roleName, ".lsp/spec.md");
  return frontmatter + `# ${roleName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Spec

> TODO: This spec was auto-generated as a stub by \`lsp graduate\`.
> Role ${roleNumber.toString().padStart(2, "0")}: ${description}
> Run \`autospec generate <srs>\` to expand this spec with full role context.

## Responsibilities

- [ ] Define ${description.toLowerCase()} requirements

## Notes

_Generated stub \u2014 expand with your team's ${description.toLowerCase()} decisions._
`;
}
async function graduateCommand(opts) {
  const lspDir = path.join(process.cwd(), ".lsp");
  if (!existsSync(lspDir)) {
    console.log("");
    console.log(chalk.red("  .lsp/ directory not found."));
    console.log("");
    console.log(`  Run ${chalk.cyan("lsp init")} first to generate specs, then graduate.`);
    console.log("");
    process.exit(1);
  }
  const specsDir = path.join(process.cwd(), "specs");
  const sourceLabel = opts["srs"] ? String(opts["srs"]) : ".lsp/spec.md";
  console.log("");
  console.log(chalk.bold.cyan("  LightSpec \u2014 lsp graduate"));
  console.log(chalk.gray(`  Source: ${lspDir}`));
  console.log(chalk.gray(`  Target: ${specsDir}`));
  console.log("");
  const readSpinner = ora("Reading LSP spec files...").start();
  let specContent;
  try {
    specContent = await readSpecFiles(lspDir);
    readSpinner.succeed("Spec files loaded");
  } catch (err) {
    readSpinner.fail("Failed to read spec files");
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`  Error: ${message}`));
    process.exit(1);
  }
  if (!specContent.trim()) {
    console.error(chalk.red("  No spec content found in .lsp/. Run lsp init first."));
    process.exit(1);
  }
  await mkdir(specsDir, { recursive: true });
  const mapSpinner = ora("Mapping content to AutoSpec roles...").start();
  try {
    const overviewSection = extractSection(specContent, "Overview") || extractSection(specContent, "Vision") || extractSection(specContent, "Problem") || "## Overview\n\n_See .lsp/spec.md for project overview._";
    const technicalSection = extractSection(specContent, "Technical Design") || extractSection(specContent, "Architecture") || extractSection(specContent, "Technical") || "## Technical Design\n\n_See .lsp/spec.md for technical details._";
    const frontendSection = extractSection(specContent, "Frontend") || extractSection(specContent, "UI") || extractSection(specContent, "User Interface") || "## Frontend\n\n_See .lsp/spec.md for frontend details._";
    const dataModelSection = extractSection(specContent, "Data Model") || extractSection(specContent, "Schema") || extractSection(specContent, "Database") || "## Data Model\n\n_See .lsp/spec.md for data model details._";
    const testingSection = extractSection(specContent, "Testing") || extractSection(specContent, "Test Strategy") || extractSection(specContent, "Quality") || "## Testing\n\n_See .lsp/spec.md for testing strategy._";
    const pm = makeRoleFrontmatter("product_manager", sourceLabel) + `# Product Manager Spec

${overviewSection}

## Success Criteria

- [ ] Project goals met as defined in spec

## Stakeholders

_Define stakeholders and sign-off requirements here._
`;
    const be = makeRoleFrontmatter("backend_lead", sourceLabel) + `# Backend Lead Spec

${technicalSection}

## Implementation Notes

_Add backend implementation decisions here._
`;
    const fe = makeRoleFrontmatter("frontend_lead", sourceLabel) + `# Frontend Lead Spec

${frontendSection}

## Implementation Notes

_Add frontend implementation decisions here._
`;
    const db = makeRoleFrontmatter("db_architect", sourceLabel) + `# DB Architect Spec

${dataModelSection}

## Migration Strategy

_Define migration approach and rollback plan here._
`;
    const qa = makeRoleFrontmatter("qa_lead", sourceLabel) + `# QA Lead Spec

${testingSection}

## Test Coverage Targets

- Unit: 80%+
- Integration: Key flows covered
- E2E: Critical user journeys
`;
    const devOps = stubRole(6, "devops_lead", "DevOps and deployment infrastructure");
    const security = stubRole(7, "security_lead", "Security, authentication and authorization");
    const dataEng = stubRole(8, "data_engineer", "Data pipelines, analytics and reporting");
    const techWriter = stubRole(9, "tech_writer", "Documentation and developer experience");
    const projectMgr = stubRole(10, "project_manager", "Project timeline, risks and delivery");
    const specFiles = [
      ["01_product_manager.md", pm],
      ["02_backend_lead.md", be],
      ["03_frontend_lead.md", fe],
      ["04_db_architect.md", db],
      ["05_qa_lead.md", qa],
      ["06_devops_lead.md", devOps],
      ["07_security_lead.md", security],
      ["08_data_engineer.md", dataEng],
      ["09_tech_writer.md", techWriter],
      ["10_project_manager.md", projectMgr]
    ];
    for (const [filename, content] of specFiles) {
      await writeFile(path.join(specsDir, filename), content, "utf-8");
    }
    mapSpinner.succeed("10 role spec files created");
  } catch (err) {
    mapSpinner.fail("Role mapping failed");
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`  Error: ${message}`));
    process.exit(1);
  }
  const backlogSpinner = ora("Creating backlog.md from tasks...").start();
  try {
    const tasksPath = path.join(lspDir, "tasks.md");
    let backlogContent;
    if (existsSync(tasksPath)) {
      const tasksContent = await readFile(tasksPath, "utf-8");
      backlogContent = `# Project Backlog

> Graduated from LightSpec on ${TODAY}.
> Review and expand tickets with your team.

## Sprint 1 \u2014 Initial Implementation

_Converted from LSP task list:_

` + tasksContent;
    } else {
      backlogContent = `# Project Backlog

> Graduated from LightSpec on ${TODAY}.

## Sprint 1 \u2014 Initial Implementation

| # | Ticket | Status |
|---|--------|--------|
| 1.1 | Define requirements | \u{1F532} Todo |
`;
    }
    await writeFile(path.join(specsDir, "backlog.md"), backlogContent, "utf-8");
    backlogSpinner.succeed("backlog.md created");
  } catch (err) {
    backlogSpinner.warn("Could not create backlog.md (non-fatal)");
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.yellow(`  Warning: ${message}`));
  }
  const claudeSpinner = ora("Creating CLAUDE.md...").start();
  try {
    const claudeMd = `# Claude Code Memory \u2014 [Project Name]

> Generated by \`lsp graduate\` on ${TODAY}.
> Edit this file to add project-specific rules for Claude Code.

## Development Workflow

### Rule 1: Backlog-First

All changes tracked in \`specs/backlog.md\` before implementation.

### Rule 2: Living Documentation

Update \`docs/\` after every feature implementation.

### Rule 3: QA Before Done

No ticket is done without verification.

## Project Structure

\`\`\`
specs/                  # AutoSpec role specs (graduated from .lsp/)
  01_product_manager.md
  02_backend_lead.md
  ...
  backlog.md
docs/                   # Living documentation
.lsp/                   # Original LSP output (keep for reference)
\`\`\`

## Next Steps

1. Review all spec files in \`specs/\` and fill in missing details
2. Run \`autospec generate <srs>\` to expand stubs (roles 06-10)
3. Create your first sprint in \`specs/backlog.md\`
4. Set up \`docs/\` directories for your subsystems
`;
    await writeFile(path.join(process.cwd(), "CLAUDE.md"), claudeMd, "utf-8");
    claudeSpinner.succeed("CLAUDE.md created");
  } catch (err) {
    claudeSpinner.warn("Could not create CLAUDE.md (non-fatal)");
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.yellow(`  Warning: ${message}`));
  }
  console.log("");
  console.log(chalk.bold.green("  Graduation complete!"));
  console.log(chalk.gray("  " + "\u2500".repeat(50)));
  console.log("");
  console.log(chalk.bold("  Created:"));
  console.log(`  ${chalk.cyan("specs/")}                   10 AutoSpec role files`);
  console.log(`  ${chalk.cyan("specs/backlog.md")}         Project backlog`);
  console.log(`  ${chalk.cyan("CLAUDE.md")}                Claude Code memory`);
  console.log("");
  console.log(chalk.bold("  Next steps:"));
  console.log(`  ${chalk.cyan("1.")} Review specs in ${chalk.gray("specs/")} \u2014 roles 01-05 have content, 06-10 are stubs`);
  console.log(`  ${chalk.cyan("2.")} Fill stubs: ${chalk.gray("autospec generate <srs>")}`);
  console.log(`  ${chalk.cyan("3.")} Start your first sprint in ${chalk.gray("specs/backlog.md")}`);
  console.log(`  ${chalk.cyan("4.")} Keep ${chalk.gray(".lsp/")} for reference`);
  console.log("");
}
export {
  graduateCommand
};

/**
 * lsp graduate — convert LSP output to full AutoSpec project
 */

import path from 'path';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';

// ---------------------------------------------------------------------------
// Section extraction helpers
// ---------------------------------------------------------------------------

/**
 * Extract a section from spec markdown by heading name (case-insensitive).
 * Returns the content under that heading up to the next same-level or higher heading.
 */
function extractSection(content: string, heading: string): string {
  const lines = content.split('\n');
  let capturing = false;
  let headingLevel = 2;
  const result: string[] = [];

  for (const line of lines) {
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);

    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();

      if (capturing) {
        // Stop if we hit another heading at the same or higher level
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

  return result.join('\n').trim();
}

/**
 * Read all spec files from .lsp/ directory.
 */
async function readSpecFiles(lspDir: string): Promise<string> {
  const candidates = ['spec.md', 'product.md', 'technical.md', 'quality.md'];
  const parts: string[] = [];

  for (const file of candidates) {
    const filePath = path.join(lspDir, file);
    if (existsSync(filePath)) {
      const content = await readFile(filePath, 'utf-8');
      parts.push(`<!-- Source: ${file} -->\n${content}`);
    }
  }

  return parts.join('\n\n');
}

// ---------------------------------------------------------------------------
// Role spec generators
// ---------------------------------------------------------------------------

const TODAY = new Date().toISOString().split('T')[0];

function makeRoleFrontmatter(role: string, sourceFile: string): string {
  return [
    '---',
    `role: ${role}`,
    'generated_by: lightspec-graduate',
    `source: ${sourceFile}`,
    `date: ${TODAY}`,
    'status: draft',
    '---',
    '',
  ].join('\n');
}

function stubRole(roleNumber: number, roleName: string, description: string): string {
  const frontmatter = makeRoleFrontmatter(roleName, '.lsp/spec.md');
  return (
    frontmatter +
    `# ${roleName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Spec\n\n` +
    `> TODO: This spec was auto-generated as a stub by \`lsp graduate\`.\n` +
    `> Role ${roleNumber.toString().padStart(2, '0')}: ${description}\n` +
    `> Run \`autospec generate <srs>\` to expand this spec with full role context.\n\n` +
    `## Responsibilities\n\n- [ ] Define ${description.toLowerCase()} requirements\n\n` +
    `## Notes\n\n_Generated stub — expand with your team's ${description.toLowerCase()} decisions._\n`
  );
}

// ---------------------------------------------------------------------------
// Main command
// ---------------------------------------------------------------------------

export async function graduateCommand(opts: Record<string, unknown>): Promise<void> {
  const lspDir = path.join(process.cwd(), '.lsp');

  // 1. Check for .lsp/ directory
  if (!existsSync(lspDir)) {
    console.log('');
    console.log(chalk.red('  .lsp/ directory not found.'));
    console.log('');
    console.log(`  Run ${chalk.cyan('lsp init')} first to generate specs, then graduate.`);
    console.log('');
    process.exit(1);
  }

  const specsDir = path.join(process.cwd(), 'specs');
  const sourceLabel = opts['srs'] ? String(opts['srs']) : '.lsp/spec.md';

  console.log('');
  console.log(chalk.bold.cyan('  LightSpec — lsp graduate'));
  console.log(chalk.gray(`  Source: ${lspDir}`));
  console.log(chalk.gray(`  Target: ${specsDir}`));
  console.log('');

  // 2. Read spec content
  const readSpinner = ora('Reading LSP spec files...').start();
  let specContent: string;
  try {
    specContent = await readSpecFiles(lspDir);
    readSpinner.succeed('Spec files loaded');
  } catch (err) {
    readSpinner.fail('Failed to read spec files');
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`  Error: ${message}`));
    process.exit(1);
  }

  if (!specContent.trim()) {
    console.error(chalk.red('  No spec content found in .lsp/. Run lsp init first.'));
    process.exit(1);
  }

  // 3. Create specs/ directory
  await mkdir(specsDir, { recursive: true });

  const mapSpinner = ora('Mapping content to AutoSpec roles...').start();

  try {
    // Extract sections for role mapping
    const overviewSection = extractSection(specContent, 'Overview') ||
      extractSection(specContent, 'Vision') ||
      extractSection(specContent, 'Problem') ||
      '## Overview\n\n_See .lsp/spec.md for project overview._';

    const technicalSection = extractSection(specContent, 'Technical Design') ||
      extractSection(specContent, 'Architecture') ||
      extractSection(specContent, 'Technical') ||
      '## Technical Design\n\n_See .lsp/spec.md for technical details._';

    const frontendSection = extractSection(specContent, 'Frontend') ||
      extractSection(specContent, 'UI') ||
      extractSection(specContent, 'User Interface') ||
      '## Frontend\n\n_See .lsp/spec.md for frontend details._';

    const dataModelSection = extractSection(specContent, 'Data Model') ||
      extractSection(specContent, 'Schema') ||
      extractSection(specContent, 'Database') ||
      '## Data Model\n\n_See .lsp/spec.md for data model details._';

    const testingSection = extractSection(specContent, 'Testing') ||
      extractSection(specContent, 'Test Strategy') ||
      extractSection(specContent, 'Quality') ||
      '## Testing\n\n_See .lsp/spec.md for testing strategy._';

    // 01_product_manager.md — Overview / Vision
    const pm =
      makeRoleFrontmatter('product_manager', sourceLabel) +
      `# Product Manager Spec\n\n` +
      `${overviewSection}\n\n` +
      `## Success Criteria\n\n- [ ] Project goals met as defined in spec\n\n` +
      `## Stakeholders\n\n_Define stakeholders and sign-off requirements here._\n`;

    // 02_backend_lead.md — Technical Design / Architecture
    const be =
      makeRoleFrontmatter('backend_lead', sourceLabel) +
      `# Backend Lead Spec\n\n` +
      `${technicalSection}\n\n` +
      `## Implementation Notes\n\n_Add backend implementation decisions here._\n`;

    // 03_frontend_lead.md — Frontend / UI sections
    const fe =
      makeRoleFrontmatter('frontend_lead', sourceLabel) +
      `# Frontend Lead Spec\n\n` +
      `${frontendSection}\n\n` +
      `## Implementation Notes\n\n_Add frontend implementation decisions here._\n`;

    // 04_db_architect.md — Data Model / Schema
    const db =
      makeRoleFrontmatter('db_architect', sourceLabel) +
      `# DB Architect Spec\n\n` +
      `${dataModelSection}\n\n` +
      `## Migration Strategy\n\n_Define migration approach and rollback plan here._\n`;

    // 05_qa_lead.md — Testing
    const qa =
      makeRoleFrontmatter('qa_lead', sourceLabel) +
      `# QA Lead Spec\n\n` +
      `${testingSection}\n\n` +
      `## Test Coverage Targets\n\n- Unit: 80%+\n- Integration: Key flows covered\n- E2E: Critical user journeys\n`;

    // Stubs for roles 06-10
    const devOps = stubRole(6, 'devops_lead', 'DevOps and deployment infrastructure');
    const security = stubRole(7, 'security_lead', 'Security, authentication and authorization');
    const dataEng = stubRole(8, 'data_engineer', 'Data pipelines, analytics and reporting');
    const techWriter = stubRole(9, 'tech_writer', 'Documentation and developer experience');
    const projectMgr = stubRole(10, 'project_manager', 'Project timeline, risks and delivery');

    // Write all spec files
    const specFiles: Array<[string, string]> = [
      ['01_product_manager.md', pm],
      ['02_backend_lead.md', be],
      ['03_frontend_lead.md', fe],
      ['04_db_architect.md', db],
      ['05_qa_lead.md', qa],
      ['06_devops_lead.md', devOps],
      ['07_security_lead.md', security],
      ['08_data_engineer.md', dataEng],
      ['09_tech_writer.md', techWriter],
      ['10_project_manager.md', projectMgr],
    ];

    for (const [filename, content] of specFiles) {
      await writeFile(path.join(specsDir, filename), content, 'utf-8');
    }

    mapSpinner.succeed('10 role spec files created');
  } catch (err) {
    mapSpinner.fail('Role mapping failed');
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`  Error: ${message}`));
    process.exit(1);
  }

  // 4. Create backlog.md from tasks.md
  const backlogSpinner = ora('Creating backlog.md from tasks...').start();
  try {
    const tasksPath = path.join(lspDir, 'tasks.md');
    let backlogContent: string;

    if (existsSync(tasksPath)) {
      const tasksContent = await readFile(tasksPath, 'utf-8');
      backlogContent =
        `# Project Backlog\n\n` +
        `> Graduated from LightSpec on ${TODAY}.\n` +
        `> Review and expand tickets with your team.\n\n` +
        `## Sprint 1 — Initial Implementation\n\n` +
        `_Converted from LSP task list:_\n\n` +
        tasksContent;
    } else {
      backlogContent =
        `# Project Backlog\n\n` +
        `> Graduated from LightSpec on ${TODAY}.\n\n` +
        `## Sprint 1 — Initial Implementation\n\n` +
        `| # | Ticket | Status |\n` +
        `|---|--------|--------|\n` +
        `| 1.1 | Define requirements | 🔲 Todo |\n`;
    }

    await writeFile(path.join(specsDir, 'backlog.md'), backlogContent, 'utf-8');
    backlogSpinner.succeed('backlog.md created');
  } catch (err) {
    backlogSpinner.warn('Could not create backlog.md (non-fatal)');
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.yellow(`  Warning: ${message}`));
  }

  // 5. Create CLAUDE.md
  const claudeSpinner = ora('Creating CLAUDE.md...').start();
  try {
    const claudeMd =
      `# Claude Code Memory — [Project Name]\n\n` +
      `> Generated by \`lsp graduate\` on ${TODAY}.\n` +
      `> Edit this file to add project-specific rules for Claude Code.\n\n` +
      `## Development Workflow\n\n` +
      `### Rule 1: Backlog-First\n\nAll changes tracked in \`specs/backlog.md\` before implementation.\n\n` +
      `### Rule 2: Living Documentation\n\nUpdate \`docs/\` after every feature implementation.\n\n` +
      `### Rule 3: QA Before Done\n\nNo ticket is done without verification.\n\n` +
      `## Project Structure\n\n` +
      `\`\`\`\n` +
      `specs/                  # AutoSpec role specs (graduated from .lsp/)\n` +
      `  01_product_manager.md\n` +
      `  02_backend_lead.md\n` +
      `  ...\n` +
      `  backlog.md\n` +
      `docs/                   # Living documentation\n` +
      `.lsp/                   # Original LSP output (keep for reference)\n` +
      `\`\`\`\n\n` +
      `## Next Steps\n\n` +
      `1. Review all spec files in \`specs/\` and fill in missing details\n` +
      `2. Run \`autospec generate <srs>\` to expand stubs (roles 06-10)\n` +
      `3. Create your first sprint in \`specs/backlog.md\`\n` +
      `4. Set up \`docs/\` directories for your subsystems\n`;

    await writeFile(path.join(process.cwd(), 'CLAUDE.md'), claudeMd, 'utf-8');
    claudeSpinner.succeed('CLAUDE.md created');
  } catch (err) {
    claudeSpinner.warn('Could not create CLAUDE.md (non-fatal)');
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.yellow(`  Warning: ${message}`));
  }

  // 6. Print next steps
  console.log('');
  console.log(chalk.bold.green('  Graduation complete!'));
  console.log(chalk.gray('  ' + '─'.repeat(50)));
  console.log('');
  console.log(chalk.bold('  Created:'));
  console.log(`  ${chalk.cyan('specs/')}                   10 AutoSpec role files`);
  console.log(`  ${chalk.cyan('specs/backlog.md')}         Project backlog`);
  console.log(`  ${chalk.cyan('CLAUDE.md')}                Claude Code memory`);
  console.log('');
  console.log(chalk.bold('  Next steps:'));
  console.log(`  ${chalk.cyan('1.')} Review specs in ${chalk.gray('specs/')} — roles 01-05 have content, 06-10 are stubs`);
  console.log(`  ${chalk.cyan('2.')} Fill stubs: ${chalk.gray('autospec generate <srs>')}`);
  console.log(`  ${chalk.cyan('3.')} Start your first sprint in ${chalk.gray('specs/backlog.md')}`);
  console.log(`  ${chalk.cyan('4.')} Keep ${chalk.gray('.lsp/')} for reference`);
  console.log('');
}

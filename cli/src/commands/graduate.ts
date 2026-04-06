/**
 * lsp graduate — convert LSP output to full AutoSpec project
 */

import path from 'path';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import type { ScanResult } from '../scanner/types.js';
import { findLspDir } from './done.js';

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

/**
 * Attempt to load scan result from .lsp/scan-result.json.
 * Returns null if not available (graceful fallback).
 */
async function loadScanResult(lspDir: string): Promise<ScanResult | null> {
  const scanResultPath = path.join(lspDir, 'scan-result.json');
  if (!existsSync(scanResultPath)) return null;
  try {
    const raw = await readFile(scanResultPath, 'utf-8');
    return JSON.parse(raw) as ScanResult;
  } catch {
    return null;
  }
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

/**
 * Determine which role file IDs to skip based on scan metadata and --roles flag.
 */
function computeSkipRoles(
  scanResult: ScanResult | null,
  rolesFlag: string | undefined,
): string[] {
  // If --roles flag is provided, only include those roles — skip everything else
  if (rolesFlag) {
    const requestedRoles = rolesFlag.split(',').map(r => r.trim().toLowerCase());
    // Map friendly names to file prefixes
    const roleAliasMap: Record<string, string> = {
      pm: '01_product_manager',
      backend: '02_backend_lead',
      frontend: '03_frontend_lead',
      db: '04_db_architect',
      qa: '05_qa_lead',
      devops: '06_devops_lead',
      security: '07_security_lead',
      data: '08_data_engineer',
      docs: '09_tech_writer',
      writer: '09_tech_writer',
      pm2: '10_project_manager',
    };
    const allRoleIds = [
      '01_product_manager',
      '02_backend_lead',
      '03_frontend_lead',
      '04_db_architect',
      '05_qa_lead',
      '06_devops_lead',
      '07_security_lead',
      '08_data_engineer',
      '09_tech_writer',
      '10_project_manager',
    ];
    const includedIds = requestedRoles.map(r => roleAliasMap[r] ?? r);
    return allRoleIds.filter(id => !includedIds.some(inc => id.includes(inc)));
  }

  // Use scan metadata to filter architecture-specific roles
  const skipRoles: string[] = [];
  if (scanResult && !scanResult.context?.architecture?.hasFrontend) {
    skipRoles.push('03_frontend_lead');
  }
  if (scanResult && !scanResult.context?.architecture?.hasDatabase) {
    skipRoles.push('04_db_architect');
  }
  return skipRoles;
}

// ---------------------------------------------------------------------------
// Main command
// ---------------------------------------------------------------------------

export async function graduateCommand(opts: Record<string, unknown>): Promise<void> {
  const targetDir = process.cwd();
  const dryRun = opts['dryRun'] === true || opts['dry-run'] === true;
  const skipConfirm = opts['yes'] === true;
  const rolesFlag = typeof opts['roles'] === 'string' ? opts['roles'] : undefined;

  // 1. Check for .lsp/ directory (search upward from cwd)
  const lspDir = findLspDir(targetDir);
  if (!lspDir) {
    console.log('');
    console.log(chalk.red("  No .lsp/ directory found. Run 'lsp init' first, or use --dir to specify your project path."));
    console.log('');
    process.exit(1);
  }

  const specsDir = path.join(targetDir, 'specs');
  const sourceLabel = opts['srs'] ? String(opts['srs']) : '.lsp/spec.md';
  const projectName = path.basename(targetDir);

  console.log('');
  console.log(chalk.bold.cyan('  LightSpec — lsp graduate'));
  console.log(chalk.gray(`  Source: ${lspDir}`));
  console.log(chalk.gray(`  Target: ${specsDir}`));
  if (dryRun) console.log(chalk.yellow('  Mode:   --dry-run (no files will be written)'));
  console.log('');

  // 2. Load scan result for architecture-based role filtering
  const scanResult = await loadScanResult(lspDir);
  const skipRoles = computeSkipRoles(scanResult, rolesFlag);

  if (scanResult && skipRoles.length > 0) {
    console.log(chalk.dim(`  Scan metadata found: using architecture flags for role filtering`));
  }

  // 3. Read spec content
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

  // 4. Create specs/ directory (unless dry-run)
  if (!dryRun) {
    await mkdir(specsDir, { recursive: true });
  }

  const mapSpinner = ora('Mapping content to AutoSpec roles...').start();

  // dry-run preview header
  if (dryRun) {
    mapSpinner.stop();
    console.log('');
    console.log(chalk.bold('  Graduate preview (--dry-run):'));
    console.log('');
  }

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

    // All spec files with their content
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

    // Section name mapping for dry-run reporting
    const sectionMap: Record<string, string> = {
      '01_product_manager.md': 'Overview',
      '02_backend_lead.md': 'Technical Design',
      '03_frontend_lead.md': 'Frontend',
      '04_db_architect.md': 'Data Model',
      '05_qa_lead.md': 'Testing',
    };

    let writtenCount = 0;
    let skippedCount = 0;

    for (const [filename, content] of specFiles) {
      // Determine the role ID (filename without .md)
      const roleId = filename.replace('.md', '');
      const isSkipped = skipRoles.some(skip => roleId.includes(skip) || roleId === skip);

      if (dryRun) {
        if (isSkipped) {
          const reason = rolesFlag ? 'not in --roles list' :
            (roleId.includes('03_frontend') ? 'hasFrontend: false' : 'hasDatabase: false');
          console.log(`  ${chalk.cyan(filename.padEnd(35))} → ${chalk.yellow(`SKIPPED (${reason})`)}`);
          skippedCount++;
        } else {
          const sectionName = sectionMap[filename];
          if (sectionName) {
            const extracted = extractSection(specContent, sectionName);
            const lineCount = extracted ? extracted.split('\n').length : 0;
            const status = lineCount > 0
              ? `EXTRACTED (${lineCount} lines from "${sectionName}" section)`
              : `FALLBACK (no matching section, using template stub)`;
            console.log(`  ${chalk.cyan(filename.padEnd(35))} → ${chalk.green(status)}`);
          } else {
            console.log(`  ${chalk.cyan(filename.padEnd(35))} → ${chalk.dim('STUB (template placeholder)')}`);
          }
        }
        continue;
      }

      if (isSkipped) {
        console.log(chalk.dim(`  Skipping ${filename} (not applicable to this project)`));
        skippedCount++;
        continue;
      }

      await writeFile(path.join(specsDir, filename), content, 'utf-8');
      writtenCount++;
    }

    if (!dryRun) {
      mapSpinner.succeed(`${writtenCount} role spec files created${skippedCount > 0 ? ` (${skippedCount} skipped)` : ''}`);
    }
  } catch (err) {
    if (!dryRun) mapSpinner.fail('Role mapping failed');
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`  Error: ${message}`));
    process.exit(1);
  }

  // 5. Create backlog.md from tasks.md
  const backlogSpinner = dryRun ? null : ora('Creating backlog.md from tasks...').start();
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

    if (dryRun) {
      console.log(`  ${chalk.cyan('specs/backlog.md'.padEnd(35))} → ${chalk.green('WRITE (from .lsp/tasks.md)')}`);
    } else {
      await writeFile(path.join(specsDir, 'backlog.md'), backlogContent, 'utf-8');
      backlogSpinner?.succeed('backlog.md created');
    }
  } catch (err) {
    backlogSpinner?.warn('Could not create backlog.md (non-fatal)');
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.yellow(`  Warning: ${message}`));
  }

  // 6. Create CLAUDE.md (with overwrite guard and project name substitution)
  const claudeMdPath = path.join(targetDir, 'CLAUDE.md');

  const claudeMdContent =
    `# Claude Code Memory — ${projectName}\n\n` +
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

  if (dryRun) {
    const claudeExists = existsSync(claudeMdPath);
    const writeStatus = claudeExists
      ? `OVERWRITE (project name: "${projectName}", existing file will be replaced)`
      : `WRITE (project name: "${projectName}")`;
    console.log(`  ${chalk.cyan('CLAUDE.md'.padEnd(35))} → ${chalk.green(writeStatus)}`);
    console.log('');
    console.log(chalk.dim('  (dry-run: no files written)'));
    console.log('');
    return;
  }

  const claudeSpinner = ora('Creating CLAUDE.md...').start();
  try {
    let skipClaudeMd = false;

    // Overwrite guard: check if CLAUDE.md already exists
    if (existsSync(claudeMdPath) && !skipConfirm) {
      claudeSpinner.stop();
      process.stdout.write(chalk.yellow('  CLAUDE.md already exists. Overwrite? [y/N] '));
      const answer = await new Promise<string>(resolve => {
        if (!process.stdin.isTTY) {
          resolve('n');
          return;
        }
        process.stdin.setEncoding('utf8');
        process.stdin.once('data', (d: Buffer | string) => resolve(d.toString().trim().toLowerCase()));
      });
      if (answer !== 'y' && answer !== 'yes') {
        console.log(chalk.dim('  Skipped CLAUDE.md (use --yes to overwrite)'));
        skipClaudeMd = true;
      }
    }

    if (!skipClaudeMd) {
      await writeFile(claudeMdPath, claudeMdContent, 'utf-8');
      claudeSpinner.succeed('CLAUDE.md created');
    }
  } catch (err) {
    claudeSpinner.warn('Could not create CLAUDE.md (non-fatal)');
    const message = err instanceof Error ? err.message : String(err);
    console.error(chalk.yellow(`  Warning: ${message}`));
  }

  // 7. Print next steps
  console.log('');
  console.log(chalk.bold.green('  Graduation complete!'));
  console.log(chalk.gray('  ' + '─'.repeat(50)));
  console.log('');
  console.log(chalk.bold('  Created:'));
  console.log(`  ${chalk.cyan('specs/')}                   Role spec files`);
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

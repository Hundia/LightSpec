// tests/helpers/graduate-logic.ts
// Extracted graduate logic that can be called with a custom base directory for testing.
// This mirrors the logic in src/commands/graduate.ts but accepts an explicit baseDir.

import path from 'path';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import type { ScanResult } from '../../src/scanner/types.js';

const TODAY = new Date().toISOString().split('T')[0];

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
        if (level <= headingLevel) break;
      }

      if (title.toLowerCase().includes(heading.toLowerCase())) {
        capturing = true;
        headingLevel = level;
        result.push(line);
        continue;
      }
    }

    if (capturing) result.push(line);
  }

  return result.join('\n').trim();
}

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
    `# ${roleName.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())} Spec\n\n` +
    `> TODO: Role ${roleNumber.toString().padStart(2, '0')}: ${description}\n\n` +
    `## Responsibilities\n\n- [ ] Define ${description.toLowerCase()} requirements\n`
  );
}

function computeSkipRoles(
  scanResult: ScanResult | null | undefined,
  rolesFlag: string | undefined,
): string[] {
  if (rolesFlag) {
    const requestedRoles = rolesFlag.split(',').map(r => r.trim().toLowerCase());
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

  const skipRoles: string[] = [];
  if (scanResult && !scanResult.context?.architecture?.hasFrontend) {
    skipRoles.push('03_frontend_lead');
  }
  if (scanResult && !scanResult.context?.architecture?.hasDatabase) {
    skipRoles.push('04_db_architect');
  }
  return skipRoles;
}

export interface GraduateOpts {
  /** A mock/partial ScanResult to drive role filtering */
  scanResult?: ScanResult | null;
  /** Comma-separated roles to include */
  roles?: string;
  /** If true, don't write any files — return a preview array instead */
  dryRun?: boolean;
  /** Project name to embed in CLAUDE.md (defaults to basename of baseDir) */
  projectName?: string;
}

export interface DryRunPreview {
  file: string;
  action: 'WRITE' | 'EXTRACTED' | 'STUB' | 'SKIPPED';
  detail?: string;
}

export async function graduateLogic(
  baseDir: string,
  specContent: string,
  opts: GraduateOpts = {},
): Promise<DryRunPreview[] | void> {
  const specsDir = path.join(baseDir, 'specs');
  const lspDir = path.join(baseDir, '.lsp');
  const sourceLabel = '.lsp/spec.md';
  const projectName = opts.projectName ?? path.basename(baseDir);
  const dryRun = opts.dryRun ?? false;
  const skipRoles = computeSkipRoles(opts.scanResult ?? null, opts.roles);

  const preview: DryRunPreview[] = [];

  if (!dryRun) {
    await mkdir(specsDir, { recursive: true });
  }

  const overviewSection =
    extractSection(specContent, 'Overview') ||
    extractSection(specContent, 'Vision') ||
    '## Overview\n\n_See .lsp/spec.md_';

  const technicalSection =
    extractSection(specContent, 'Technical Design') ||
    extractSection(specContent, 'Architecture') ||
    '## Technical Design\n\n_See .lsp/spec.md_';

  const frontendSection =
    extractSection(specContent, 'Frontend') ||
    extractSection(specContent, 'UI') ||
    '## Frontend\n\n_See .lsp/spec.md_';

  const dataModelSection =
    extractSection(specContent, 'Data Model') ||
    extractSection(specContent, 'Schema') ||
    '## Data Model\n\n_See .lsp/spec.md_';

  const testingSection =
    extractSection(specContent, 'Testing') ||
    extractSection(specContent, 'Quality') ||
    '## Testing\n\n_See .lsp/spec.md_';

  const pm =
    makeRoleFrontmatter('product_manager', sourceLabel) +
    `# Product Manager Spec\n\n${overviewSection}\n`;

  const be =
    makeRoleFrontmatter('backend_lead', sourceLabel) +
    `# Backend Lead Spec\n\n${technicalSection}\n`;

  const fe =
    makeRoleFrontmatter('frontend_lead', sourceLabel) +
    `# Frontend Lead Spec\n\n${frontendSection}\n`;

  const db =
    makeRoleFrontmatter('db_architect', sourceLabel) +
    `# DB Architect Spec\n\n${dataModelSection}\n`;

  const qa =
    makeRoleFrontmatter('qa_lead', sourceLabel) +
    `# QA Lead Spec\n\n${testingSection}\n`;

  const specFiles: Array<[string, string]> = [
    ['01_product_manager.md', pm],
    ['02_backend_lead.md', be],
    ['03_frontend_lead.md', fe],
    ['04_db_architect.md', db],
    ['05_qa_lead.md', qa],
    ['06_devops_lead.md', stubRole(6, 'devops_lead', 'DevOps and deployment infrastructure')],
    ['07_security_lead.md', stubRole(7, 'security_lead', 'Security, authentication and authorization')],
    ['08_data_engineer.md', stubRole(8, 'data_engineer', 'Data pipelines, analytics and reporting')],
    ['09_tech_writer.md', stubRole(9, 'tech_writer', 'Documentation and developer experience')],
    ['10_project_manager.md', stubRole(10, 'project_manager', 'Project timeline, risks and delivery')],
  ];

  const sectionMap: Record<string, string> = {
    '01_product_manager.md': 'Overview',
    '02_backend_lead.md': 'Technical Design',
    '03_frontend_lead.md': 'Frontend',
    '04_db_architect.md': 'Data Model',
    '05_qa_lead.md': 'Testing',
  };

  for (const [filename, content] of specFiles) {
    const roleId = filename.replace('.md', '');
    const isSkipped = skipRoles.some(skip => roleId.includes(skip) || roleId === skip);

    if (isSkipped) {
      preview.push({ file: filename, action: 'SKIPPED', detail: 'role filtered out' });
      continue; // skip write whether dry-run or not
    }

    const sectionName = sectionMap[filename];
    if (sectionName) {
      const extracted = extractSection(specContent, sectionName);
      const lineCount = extracted ? extracted.split('\n').length : 0;
      if (lineCount > 0) {
        preview.push({ file: filename, action: 'EXTRACTED', detail: `${lineCount} lines from "${sectionName}"` });
      } else {
        preview.push({ file: filename, action: 'STUB', detail: 'no matching section found' });
      }
    } else {
      preview.push({ file: filename, action: 'STUB', detail: 'template placeholder' });
    }

    if (!dryRun) {
      await writeFile(path.join(specsDir, filename), content, 'utf-8');
    }
  }

  // backlog.md
  if (!dryRun) {
    const tasksPath = path.join(lspDir, 'tasks.md');
    let backlogContent =
      `# Project Backlog\n\n` +
      `> Graduated from LightSpec on ${TODAY}.\n\n` +
      `## Sprint 1\n\n`;

    if (existsSync(tasksPath)) {
      const tasksContent = await readFile(tasksPath, 'utf-8');
      backlogContent += tasksContent;
    }

    await writeFile(path.join(specsDir, 'backlog.md'), backlogContent, 'utf-8');
  } else {
    preview.push({ file: 'specs/backlog.md', action: 'WRITE', detail: 'from .lsp/tasks.md' });
  }

  // CLAUDE.md — with project name substitution (no [Project Name] placeholder)
  const claudeMdContent =
    `# Claude Code Memory — ${projectName}\n\n` +
    `> Generated by \`lsp graduate\` on ${TODAY}.\n\n` +
    `## Development Workflow\n\n` +
    `All changes tracked in \`specs/\`.\n\n` +
    `## Project Structure\n\n` +
    `\`\`\`\nspecs/\n.lsp/\n\`\`\`\n`;

  if (!dryRun) {
    await writeFile(path.join(baseDir, 'CLAUDE.md'), claudeMdContent, 'utf-8');
  } else {
    preview.push({ file: 'CLAUDE.md', action: 'WRITE', detail: `project name: "${projectName}"` });
  }

  if (dryRun) return preview;
}

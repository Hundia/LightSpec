// lsp/src/pipeline/task-extractor.ts — Parse tasks from generated spec markdown

export interface ExtractedTask {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  estimate: string;
  done: boolean;
}

/** @deprecated Use ExtractedTask */
export type Task = ExtractedTask;

/**
 * Extract tasks from a spec markdown string.
 * Strategies (applied in order):
 *  1. Markdown table with | # | Task | Priority | Estimate | columns
 *  2. Checklist items: - [ ] Task title  or  - [x] Task title
 *  3. Numbered list items under a "Tasks" or "Implementation Plan" heading
 */
export function extractTasks(specContent: string): ExtractedTask[] {
  // Strategy 1: table format
  const tableRows = extractFromTable(specContent);
  if (tableRows.length > 0) return tableRows;

  // Strategy 2: checklist format
  const checklistRows = extractFromChecklist(specContent);
  if (checklistRows.length > 0) return checklistRows;

  // Strategy 3: numbered list under Tasks / Implementation Plan heading
  return extractFromNumberedList(specContent);
}

function normalizePriority(raw: string): 'high' | 'medium' | 'low' {
  const lower = raw.toLowerCase().trim();
  if (lower === 'high') return 'high';
  if (lower === 'low') return 'low';
  return 'medium';
}

function extractFromTable(content: string): ExtractedTask[] {
  const tasks: ExtractedTask[] = [];
  const lines = content.split('\n');

  // Match table data rows: | N | text | text | text | (optionally more columns)
  const tableRowRegex = /^\s*\|\s*(\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/;

  for (const line of lines) {
    const match = tableRowRegex.exec(line);
    if (!match) continue;

    const id = parseInt(match[1], 10);
    const title = match[2].trim();
    const priority = match[3].trim();
    const estimate = match[4].trim();

    // Skip separator rows (---) and header rows
    if (isNaN(id) || title.toLowerCase() === 'task' || title.includes('---')) continue;

    tasks.push({ id, title, priority: normalizePriority(priority), estimate, done: false });
  }

  return tasks;
}

function extractFromChecklist(content: string): ExtractedTask[] {
  const tasks: ExtractedTask[] = [];
  const checklistRegex = /^\s*-\s*\[([ xX])\]\s*(.+)$/;
  const lines = content.split('\n');
  let id = 1;

  for (const line of lines) {
    const match = checklistRegex.exec(line);
    if (!match) continue;

    const done = match[1].toLowerCase() === 'x';
    const title = match[2].trim();

    tasks.push({ id: id++, title, priority: 'medium', estimate: 'TBD', done });
  }

  return tasks;
}

function extractFromNumberedList(content: string): ExtractedTask[] {
  const tasks: ExtractedTask[] = [];
  const lines = content.split('\n');
  let inTaskSection = false;
  let id = 1;

  // Headings that signal a task list section
  const taskHeadingRegex = /^#{1,3}\s+(Tasks?|Implementation Plan|Action Items?)/i;
  const numberedItemRegex = /^\s*\d+\.\s+(.+)$/;

  for (const line of lines) {
    if (taskHeadingRegex.test(line)) {
      inTaskSection = true;
      continue;
    }
    // Stop when we hit another heading
    if (inTaskSection && /^#{1,3}\s+/.test(line)) {
      inTaskSection = false;
    }
    if (!inTaskSection) continue;

    const match = numberedItemRegex.exec(line);
    if (match) {
      tasks.push({ id: id++, title: match[1].trim(), priority: 'medium', estimate: 'TBD', done: false });
    }
  }

  return tasks;
}

/**
 * Format a list of extracted tasks as a markdown file with YAML frontmatter.
 */
export function formatTasksMarkdown(tasks: ExtractedTask[]): string {
  const today = new Date().toISOString().split('T')[0];

  const frontmatter = [
    '---',
    'generated_by: lightspec',
    'version: 0.1.0',
    `date: ${today}`,
    '---',
    '',
  ].join('\n');

  if (tasks.length === 0) {
    return frontmatter + '# Task List\n\nNo tasks found.\n';
  }

  const header = '# Task List\n\n| # | Task | Priority | Estimate | Status |\n|---|------|----------|----------|--------|\n';
  const rows = tasks
    .map(t => {
      const priorityLabel = t.priority.charAt(0).toUpperCase() + t.priority.slice(1);
      return `| ${t.id} | ${t.title} | ${priorityLabel} | ${t.estimate} | ${t.done ? '[x]' : '[ ]'} |`;
    })
    .join('\n');

  return frontmatter + header + rows + '\n';
}

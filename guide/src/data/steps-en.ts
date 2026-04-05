// Guide step data types
export interface TerminalLine {
  type: 'command' | 'output' | 'success' | 'error' | 'blank' | 'highlight';
  text: string;
}

export interface FileEntry {
  name: string;
  type: 'file' | 'dir';
  children?: FileEntry[];
  highlight?: boolean;
}

export interface TaskEntry {
  id: number;
  title: string;
  status: 'done' | 'in-progress' | 'todo';
  priority: 'high' | 'medium' | 'low';
}

export interface StatEntry {
  value: string;
  label: string;
  color?: 'amber' | 'green' | 'blue';
}

export type ExplanationBlock =
  | { type: 'heading'; text: string }
  | { type: 'text'; content: string }
  | { type: 'callout'; emoji: string; title: string; content: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'warning'; content: string }
  | { type: 'codeHint'; label: string; code: string };

export type ResultBlock =
  | { type: 'terminal'; title?: string; lines: TerminalLine[] }
  | { type: 'fileTree'; root: string; entries: FileEntry[] }
  | { type: 'fileViewer'; filename: string; language: string; content: string }
  | { type: 'taskList'; tasks: TaskEntry[] }
  | { type: 'statsRow'; items: StatEntry[] }
  | { type: 'dirTree'; title: string; files: string[] };

export interface GuideStep {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  skill?: string;
  chapterLabel: string;
  bgId: string;
  left: ExplanationBlock[];
  right: ResultBlock[];
}

export const steps: GuideStep[] = [
  {
    id: 1,
    slug: 'welcome',
    title: 'Welcome to LightSpec',
    subtitle: 'Just enough spec. Just fast enough.',
    chapterLabel: '1. Introduction',
    bgId: 'particles',
    left: [
      { type: 'heading', text: 'What is LightSpec?' },
      { type: 'text', content: 'LightSpec generates just-enough software specs in under 60 seconds. No process overhead, no 10-role ceremonies — just the right level of documentation for the task at hand.' },
      { type: 'callout', emoji: '⚡', title: 'The Core Idea', content: 'Scan your project → auto-detect complexity → generate spec at the right depth. Micro (15s), Standard (45s), or Full (90s).' },
      { type: 'heading', text: 'Our Example Project' },
      { type: 'text', content: 'Throughout this guide, we\'ll build Task Flow API — a TypeScript + Express + SQLite task management backend. You\'ll see exactly what LightSpec generates, step by step.' },
      { type: 'bullets', items: ['TypeScript + Express REST API', 'SQLite database (better-sqlite3)', 'JWT authentication', '~45 source files, ~5,800 lines', 'Complexity score: 38/100 → Standard depth'] },
    ],
    right: [
      { type: 'statsRow', items: [
        { value: '60s', label: 'Time to spec', color: 'amber' },
        { value: '3', label: 'Depth levels', color: 'green' },
        { value: '81', label: 'Tests', color: 'blue' },
      ]},
      { type: 'terminal', title: 'Quick Start', lines: [
        { type: 'command', text: 'npm install -g lightspec' },
        { type: 'output', text: 'added 1 package in 2.1s' },
        { type: 'blank', text: '' },
        { type: 'command', text: 'cd my-project && lsp init' },
        { type: 'output', text: 'Scanning project...' },
        { type: 'success', text: '✓ Spec generated: .lsp/spec.md' },
      ]},
    ],
  },
  {
    id: 2,
    slug: 'project-tour',
    title: 'The Example Project',
    subtitle: 'Meet Task Flow API — our guide project',
    chapterLabel: '2. The Project',
    bgId: 'grid',
    left: [
      { type: 'heading', text: 'Task Flow API' },
      { type: 'text', content: 'A clean TypeScript + Express REST API for managing tasks. Perfect complexity for LightSpec standard depth — not too simple, not too complex.' },
      { type: 'heading', text: 'What the Scanner Will Find' },
      { type: 'bullets', items: ['Language: TypeScript (primary)', 'Framework: Express.js', 'Database: SQLite via better-sqlite3', 'Auth: JWT (jsonwebtoken)', 'Tests: Vitest + supertest', 'Architecture: Modular monolith', 'Routes: 3 groups (auth, lists, tasks)'] },
      { type: 'callout', emoji: '📊', title: 'Complexity Estimate', content: 'File count (~45), LOC (~5,800), monolith architecture, 2 languages, API+DB components, 4 test files → score ~38/100 → Standard depth.' },
    ],
    right: [
      { type: 'fileTree', root: 'task-flow-api/', entries: [
        { name: 'src/', type: 'dir', children: [
          { name: 'index.ts', type: 'file' },
          { name: 'app.ts', type: 'file' },
          { name: 'config/', type: 'dir', children: [{ name: 'env.ts', type: 'file' }] },
          { name: 'db/', type: 'dir', children: [{ name: 'connection.ts', type: 'file' }, { name: 'schema.ts', type: 'file' }] },
          { name: 'middleware/', type: 'dir', children: [{ name: 'auth.ts', type: 'file' }, { name: 'errors.ts', type: 'file' }] },
          { name: 'routes/', type: 'dir', children: [{ name: 'auth.ts', type: 'file', highlight: true }, { name: 'lists.ts', type: 'file', highlight: true }, { name: 'tasks.ts', type: 'file', highlight: true }] },
          { name: 'services/', type: 'dir', children: [{ name: 'auth.service.ts', type: 'file' }, { name: 'list.service.ts', type: 'file' }, { name: 'task.service.ts', type: 'file' }] },
          { name: 'models/', type: 'dir', children: [{ name: 'user.model.ts', type: 'file' }, { name: 'list.model.ts', type: 'file' }, { name: 'task.model.ts', type: 'file' }] },
          { name: 'utils/', type: 'dir', children: [{ name: 'validators.ts', type: 'file' }, { name: 'helpers.ts', type: 'file' }] },
        ]},
        { name: 'tests/', type: 'dir', children: [{ name: 'auth.test.ts', type: 'file' }, { name: 'lists.test.ts', type: 'file' }, { name: 'tasks.test.ts', type: 'file' }] },
        { name: 'package.json', type: 'file' },
        { name: 'tsconfig.json', type: 'file' },
      ]},
    ],
  },
  {
    id: 3,
    slug: 'lsp-scan',
    title: '`lsp scan` — Understand Your Project',
    subtitle: 'The brownfield scanner analyzes 5 signals in seconds',
    chapterLabel: '3. Scan',
    bgId: 'circuits',
    skill: 'lsp scan',
    left: [
      { type: 'heading', text: 'What the Scanner Detects' },
      { type: 'bullets', items: [
        'Stack detection — languages, frameworks, package manager from package.json + file extensions',
        'Architecture — monolith vs modular vs monorepo, detected features (API, Database, Auth)',
        'Test coverage — test framework (vitest/jest/mocha), number of test files vs source files',
        'Routes — API surface area from route files and controllers',
        'Docs — existing README, docs/ directory, inline JSDoc',
      ]},
      { type: 'heading', text: 'Complexity Score' },
      { type: 'text', content: 'The complexity score (0–100) weighs file count, lines of code, number of languages, architectural complexity, and test coverage ratio. It maps directly to a depth recommendation.' },
      { type: 'bullets', items: [
        '0–30 → micro (concise, ~200 lines, 15s)',
        '31–65 → standard (unified spec, ~500-1000 lines, 45s)',
        '66–100 → full (3-spec decomposition, 90s)',
      ]},
      { type: 'callout', emoji: '🔍', title: 'Brownfield First', content: 'LightSpec scans before it generates. The scan result is injected into the generation prompt — so the spec is grounded in your actual code, not a template guess.' },
    ],
    right: [
      { type: 'terminal', title: 'lsp scan . (actual output)', lines: [
        { type: 'command', text: 'lsp scan .' },
        { type: 'output', text: '- Scanning project...' },
        { type: 'success', text: '\u2714 Scan complete' },
        { type: 'blank', text: '' },
        { type: 'highlight', text: '  LightSpec Brownfield Scan Results' },
        { type: 'output', text: '  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500' },
        { type: 'blank', text: '' },
        { type: 'highlight', text: '  Summary' },
        { type: 'output', text: '  This is a monolith project written in JAVASCRIPT/TYPESCRIPT' },
        { type: 'output', text: '  using express with API, database. It has 29 files and' },
        { type: 'output', text: '  approximately 6,805 lines of code, making it a small codebase' },
        { type: 'output', text: '  (complexity score: 38/100). A standard spec provides a' },
        { type: 'output', text: '  balanced level of documentation for this scope.' },
        { type: 'blank', text: '' },
        { type: 'highlight', text: '  Complexity' },
        { type: 'output', text: '  Score:      38/100' },
        { type: 'output', text: '  Depth:      standard' },
        { type: 'output', text: '  Reasoning:  Medium complexity project \u2014 standard unified spec recommended' },
        { type: 'blank', text: '' },
        { type: 'highlight', text: '  Tech Stack' },
        { type: 'output', text: '  Languages:  javascript, typescript' },
        { type: 'output', text: '  Frameworks: express' },
        { type: 'output', text: '  Tests:      vitest' },
        { type: 'output', text: '  Package:    npm' },
        { type: 'blank', text: '' },
        { type: 'highlight', text: '  Architecture' },
        { type: 'output', text: '  Pattern:    monolith' },
        { type: 'output', text: '  Features:   API, Database' },
        { type: 'output', text: '  Entry:      src/index.ts, src/app.ts' },
        { type: 'blank', text: '' },
        { type: 'highlight', text: '  Metrics' },
        { type: 'output', text: '  Files:      29' },
        { type: 'output', text: '  Lines:      6,805' },
        { type: 'output', text: '  Source:     25' },
        { type: 'output', text: '  Tests:      5' },
      ]},
    ],
  },
  {
    id: 4,
    slug: 'lsp-init',
    title: '`lsp init` — Generate Your Spec',
    subtitle: '45 seconds from zero to a 500-line spec grounded in your codebase',
    chapterLabel: '4. Generate',
    bgId: 'particles',
    skill: 'lsp init',
    left: [
      { type: 'heading', text: 'The Generation Pipeline' },
      { type: 'text', content: 'lsp init runs in three stages: scan (re-uses the brownfield detector), provider resolution (finds claude-code, Anthropic API, or Gemini CLI), then LLM generation using the standard template with your scan data injected.' },
      { type: 'heading', text: 'Why Standard Depth?' },
      { type: 'text', content: 'Task Flow API scored 38/100 — medium complexity. Standard depth targets 500-1,000 lines and covers all five sections: Overview, Technical Design, Implementation Plan, Testing Strategy, and Task List.' },
      { type: 'bullets', items: [
        'Overview — purpose, goals, success criteria',
        'Technical Design — architecture, API endpoints, data model, dependencies',
        'Implementation Plan — phased build sequence (each phase independently testable)',
        'Testing Strategy — framework-specific test plan with coverage target',
        'Task List — numbered table with priority and time estimates',
      ]},
      { type: 'callout', emoji: '⚡', title: 'Zero Config', content: 'LightSpec resolves the LLM provider automatically. If claude is in your PATH and authenticated, it uses claude-code (no API key needed). Otherwise it falls back to ANTHROPIC_API_KEY or GEMINI_API_KEY.' },
      { type: 'codeHint', label: 'Override depth manually', code: 'lsp init . --depth=full' },
    ],
    right: [
      { type: 'terminal', title: 'lsp init . (actual output)', lines: [
        { type: 'command', text: 'lsp init .' },
        { type: 'blank', text: '' },
        { type: 'highlight', text: '  LightSpec \u2014 lsp init' },
        { type: 'output', text: '  Project: ./task-flow-api' },
        { type: 'blank', text: '' },
        { type: 'output', text: '  Complexity score:  38/100' },
        { type: 'output', text: '  Suggested depth:   standard' },
        { type: 'output', text: '  Stack:             javascript, typescript, express' },
        { type: 'blank', text: '' },
        { type: 'highlight', text: '  Generation Plan' },
        { type: 'output', text: '  Depth:       standard' },
        { type: 'output', text: '  Output:      .lsp/' },
        { type: 'output', text: '  Files:       spec.md, tasks.md' },
        { type: 'output', text: '  Tokens/call: 8,192' },
        { type: 'output', text: '  Estimated:   ~45s' },
        { type: 'blank', text: '' },
        { type: 'output', text: '  Proceed with generation? [Y/n]' },
        { type: 'output', text: '- Resolving LLM provider...' },
        { type: 'success', text: '\u2714 Using provider: claude-code' },
        { type: 'blank', text: '' },
        { type: 'output', text: '- Generating standard spec...' },
        { type: 'success', text: '\u2714 Spec generated' },
        { type: 'output', text: '- Extracting tasks...' },
        { type: 'success', text: '\u2714 Tasks extracted: 17 task(s) written to tasks.md' },
        { type: 'blank', text: '' },
        { type: 'highlight', text: '  Done!' },
        { type: 'output', text: '  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500' },
        { type: 'output', text: '  Depth:    standard' },
        { type: 'output', text: '  Provider: claude-code' },
        { type: 'output', text: '  Output:   .lsp/' },
        { type: 'blank', text: '' },
        { type: 'output', text: '  Next steps:' },
        { type: 'output', text: '  1. Review your spec: .lsp/spec.md' },
        { type: 'output', text: '  2. Check tasks:      lsp status' },
        { type: 'output', text: '  3. Grow into AutoSpec: lsp graduate (when ready)' },
      ]},
    ],
  },
  {
    id: 5,
    slug: 'reading-spec',
    title: 'Reading Your Spec',
    subtitle: 'A standard spec has 5 sections — here\'s what each means',
    chapterLabel: '5. The Spec',
    bgId: 'hex',
    left: [
      { type: 'heading', text: 'The 5 Sections' },
      { type: 'bullets', items: [
        'Overview — 3-5 sentences on what the project solves, who uses it, and success criteria',
        'Technical Design — architecture diagram, full API endpoint table, data model with field types, dependencies',
        'Implementation Plan — phased build sequence; each phase is independently testable',
        'Testing Strategy — test framework, unit/integration/E2E breakdown, coverage target',
        'Task List — numbered table with Priority (High/Medium/Low) and time estimates',
      ]},
      { type: 'callout', emoji: '📋', title: 'Grounded in Your Stack', content: 'Notice the spec references vitest (detected in scan), express (detected framework), and better-sqlite3 (detected from package.json). It\'s not a generic template — it\'s your project.' },
      { type: 'heading', text: 'YAML Frontmatter' },
      { type: 'text', content: 'Every generated spec starts with YAML frontmatter recording the depth, date, complexity score, and provider. This is how lsp init knows not to regenerate if a spec exists, and how lsp graduate reads the context.' },
      { type: 'codeHint', label: 'Regenerate at a different depth', code: 'lsp init . --depth=full --force' },
    ],
    right: [
      { type: 'fileViewer', filename: '.lsp/spec.md', language: 'markdown', content: `---
generated_by: lightspec
version: 0.1.0
depth: standard
date: 2026-04-05
project: task-flow-api
---

# task-flow-api — Specification

## Overview

Task Flow API is a task management REST API that enables users to organize
work into named lists, each containing prioritized tasks with lifecycle
status tracking. The system provides JWT-based authentication, full CRUD
for lists and tasks, and strict user-scoped access control so each user
only sees their own data. Built on TypeScript + Express + SQLite, it
targets individual users and small teams needing a lightweight,
self-hosted task tracker.

## Technical Design

### Architecture

The project follows a layered monolith pattern with clear separation
between transport (routes), business logic (services), and persistence (db).
The Express app is created by a factory function (createApp) so tests can
import it without starting a real server.

\`\`\`
HTTP Request
  └─► Express Router (routes/)
        └─► Service Layer (services/)
              └─► SQLite via better-sqlite3 (db/connection.ts)
\`\`\`

### API / Endpoints

#### Authentication
| Method | Path            | Request Body          | Response              |
|--------|-----------------|-----------------------|-----------------------|
| POST   | /auth/register  | { email, password }   | 201 { token, userId } |
| POST   | /auth/login     | { email, password }   | 200 { token, userId } |

#### Lists (requires Authorization: Bearer <token>)
| Method | Path       | Request          | Response                              |
|--------|------------|------------------|---------------------------------------|
| GET    | /lists     | —                | 200 [{ id, title, taskCount, ... }]   |
| POST   | /lists     | { title }        | 201 { id, title, createdAt }          |
| PUT    | /lists/:id | { title }        | 200 { id, title, updatedAt }          |
| DELETE | /lists/:id | —                | 204                                   |

#### Tasks (requires auth; scoped to caller's lists)
| Method | Path                | Request                          | Response   |
|--------|---------------------|----------------------------------|------------|
| GET    | /tasks?listId=X     | ?listId=<uuid>                   | 200 task[] |
| POST   | /tasks              | { listId, title, priority? }     | 201 task   |
| PUT    | /tasks/:id          | { title?, description? }         | 200 task   |
| PATCH  | /tasks/:id/status   | { status }                       | 200 task   |
| DELETE | /tasks/:id          | —                                | 204        |

### Data Model

#### users
| Field         | Type         | Notes          |
|---------------|--------------|----------------|
| id            | TEXT (UUID)  | Primary key    |
| email         | TEXT         | UNIQUE NOT NULL|
| password_hash | TEXT         | bcrypt hashed  |
| created_at    | INTEGER      | Unix ms        |

#### tasks
| Field       | Type        | Notes                           |
|-------------|-------------|---------------------------------|
| id          | TEXT (UUID) | Primary key                     |
| list_id     | TEXT        | FK → lists.id                   |
| title       | TEXT        | NOT NULL                        |
| status      | TEXT        | todo / in-progress / done       |
| priority    | TEXT        | low / medium / high             |

## Implementation Plan

### Phase 1: Foundation — DB + Config
Set up SQLite connection, schema, and environment config.
- src/config/env.ts — parse PORT, JWT_SECRET, DB_PATH
- src/db/connection.ts — createDb() and createTables()
- src/db/schema.ts — SQL DDL for users, lists, tasks

### Phase 2: Auth Layer
Implement user registration, login, and JWT middleware.
- src/services/auth.service.ts — register + login
- src/routes/auth.ts — POST /auth/register, /auth/login
- src/middleware/auth.ts — JWT verifyToken middleware

## Testing Strategy

Uses **Vitest** + **Supertest** for HTTP integration tests.
Each test file creates a fresh in-memory SQLite DB via createApp factory.

- 20 integration tests across 4 files
- Coverage target: 100% of public API endpoints
- Test command: \`npm test\`

## Task List

| # | Task                                          | Priority | Estimate |
|---|-----------------------------------------------|----------|----------|
| 1 | Set up TypeScript project, tsconfig, scripts  | High     | 1h       |
| 2 | Implement env config (src/config/env.ts)      | High     | 30m      |
| 3 | Create SQLite connection factory + DDL        | High     | 1h       |
| 4 | Auth service: register + login with bcrypt    | High     | 2h       |
| 5 | JWT middleware (src/middleware/auth.ts)        | High     | 1h       |` },
    ],
  },
  {
    id: 6,
    slug: 'lsp-status',
    title: '`lsp status` — Track Your Progress',
    subtitle: 'Every task extracted, progress bar updated in real time',
    chapterLabel: '6. Status',
    bgId: 'constellation',
    skill: 'lsp status',
    left: [
      { type: 'heading', text: 'How tasks.md Works' },
      { type: 'text', content: 'When lsp init runs, it generates tasks.md alongside spec.md. Each task from the spec\'s Task List section is extracted into a markdown table row with a checkbox column.' },
      { type: 'heading', text: 'Marking Tasks Done' },
      { type: 'text', content: 'Edit .lsp/tasks.md directly — change [ ] to [x] in the Status column. Run lsp status again to see the updated progress bar.' },
      { type: 'codeHint', label: 'Mark task #13 done in tasks.md', code: '| 13 | Write auth tests | Medium | 1h | [x] done |' },
      { type: 'heading', text: 'The SDD Rhythm' },
      { type: 'bullets', items: [
        'Read spec — understand what to build',
        'Implement ticket — write the code',
        'Mark done — edit tasks.md, [x]',
        'Read spec again — pick the next task',
        'Run lsp status — see the progress bar move',
      ]},
      { type: 'callout', emoji: '🎯', title: 'Spec-Driven Development', content: 'The spec is your single source of truth. Every implementation decision references it. When scope creeps, you update the spec first — then the code.' },
    ],
    right: [
      { type: 'terminal', title: 'lsp status (actual output)', lines: [
        { type: 'command', text: 'lsp status' },
        { type: 'blank', text: '' },
        { type: 'highlight', text: '  LightSpec Task Status' },
        { type: 'output', text: '  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500' },
        { type: 'blank', text: '' },
        { type: 'output', text: '  Progress: \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591 71% (12/17 done)' },
        { type: 'blank', text: '' },
        { type: 'output', text: '  Tasks:' },
        { type: 'blank', text: '' },
        { type: 'success', text: '  \u2713 #1   Set up TypeScript project, tsconfig, scripts [High] 1h' },
        { type: 'success', text: '  \u2713 #2   Implement env config (src/config/env.ts) [High] 30m' },
        { type: 'success', text: '  \u2713 #3   Create SQLite connection factory + DDL [High] 1h' },
        { type: 'success', text: '  \u2713 #4   Auth service: register + login with bcrypt [High] 2h' },
        { type: 'success', text: '  \u2713 #5   JWT middleware (src/middleware/auth.ts) [High] 1h' },
        { type: 'success', text: '  \u2713 #6   Add auth routes with Zod validation [High] 1h' },
        { type: 'success', text: '  \u2713 #7   Define List + Task TypeScript interfaces [Medium] 1h' },
        { type: 'success', text: '  \u2713 #8   Implement list service (CRUD + ownership) [High] 2h' },
        { type: 'success', text: '  \u2713 #9   Add list routes with auth middleware [High] 1h' },
        { type: 'success', text: '  \u2713 #10  Implement task service (CRUD + status) [High] 2h' },
        { type: 'success', text: '  \u2713 #11  Add task routes (GET, PATCH status) [High] 1h' },
        { type: 'success', text: '  \u2713 #12  Build createApp factory + error handler [High] 1h' },
        { type: 'output', text: '  \u25cb #13  Write auth integration tests (5 cases) [Medium] 1h' },
        { type: 'output', text: '  \u25cb #14  Write lists integration tests (6 cases) [Medium] 1h' },
        { type: 'output', text: '  \u25cb #15  Write tasks integration tests (6 cases) [Medium] 1h' },
        { type: 'output', text: '  \u25cb #16  Write error handling tests (3 cases) [Medium] 30m' },
        { type: 'output', text: '  \u25cb #17  Verify all 20 tests pass with npm test [High] 30m' },
        { type: 'blank', text: '' },
        { type: 'output', text: '  5 task(s) remaining.' },
        { type: 'output', text: '  Mark tasks done by editing .lsp/tasks.md (change [ ] to [x])' },
      ]},
      { type: 'taskList', tasks: [
        { id: 1, title: 'Set up TypeScript project, tsconfig, scripts', status: 'done', priority: 'high' },
        { id: 2, title: 'Implement env config (src/config/env.ts)', status: 'done', priority: 'high' },
        { id: 3, title: 'Create SQLite connection factory + DDL', status: 'done', priority: 'high' },
        { id: 4, title: 'Auth service: register + login with bcrypt', status: 'done', priority: 'high' },
        { id: 5, title: 'JWT middleware (src/middleware/auth.ts)', status: 'done', priority: 'high' },
        { id: 6, title: 'Add auth routes with Zod validation', status: 'done', priority: 'high' },
        { id: 7, title: 'Define List + Task TypeScript interfaces', status: 'done', priority: 'medium' },
        { id: 8, title: 'Implement list service (CRUD + ownership)', status: 'done', priority: 'high' },
        { id: 9, title: 'Add list routes with auth middleware', status: 'done', priority: 'high' },
        { id: 10, title: 'Implement task service (CRUD + status patch)', status: 'done', priority: 'high' },
        { id: 11, title: 'Add task routes (GET, PATCH status)', status: 'done', priority: 'high' },
        { id: 12, title: 'Build createApp factory + error handler', status: 'done', priority: 'high' },
        { id: 13, title: 'Write auth integration tests (5 cases)', status: 'todo', priority: 'medium' },
        { id: 14, title: 'Write lists integration tests (6 cases)', status: 'todo', priority: 'medium' },
        { id: 15, title: 'Write tasks integration tests (6 cases)', status: 'todo', priority: 'medium' },
        { id: 16, title: 'Write error handling tests (3 cases)', status: 'todo', priority: 'medium' },
        { id: 17, title: 'Verify all 20 tests pass with npm test', status: 'todo', priority: 'high' },
      ]},
    ],
  },
  { id: 7, slug: 'execute-ticket', title: '/execute-ticket — Code with Context', subtitle: 'The skill that makes LLMs actually useful', chapterLabel: '7. Executing', bgId: 'circuits', skill: '/execute-ticket', left: [{ type: 'heading', text: 'The Execute Ticket Skill' }, { type: 'text', content: 'The /execute-ticket skill orchestrates a 6-step workflow: read backlog → check deps → read docs → implement → QA → update docs.' }, { type: 'callout', emoji: '📚', title: 'Docs First', content: 'Every ticket starts by reading relevant docs/ files. This gives the LLM the right context before writing a single line of code.' }, { type: 'bullets', items: ['Read the backlog ticket', 'Check dependencies are done', 'Read relevant docs/', 'Implement the change', 'Run QA (build + test)', 'Update docs/'] }], right: [{ type: 'terminal', title: 'Skill: /execute-ticket', lines: [{ type: 'command', text: '> /execute-ticket 1' }, { type: 'output', text: 'Reading backlog ticket 1...' }, { type: 'output', text: 'Checking dependencies... none' }, { type: 'output', text: 'Reading docs/cli/02_architecture.md' }, { type: 'output', text: 'Implementing: Setup auth middleware' }, { type: 'blank', text: '' }, { type: 'success', text: '✓ src/middleware/auth.ts created' }, { type: 'success', text: '✓ tests/auth.test.ts: 5/5 pass' }, { type: 'success', text: '✓ docs/cli/02_architecture.md updated' }, { type: 'output', text: 'Ticket 1 → ✅ Done' }] }] },
  { id: 8, slug: 'sprint-progress', title: 'Sprint Progress', subtitle: 'The rhythm of spec-driven development', chapterLabel: '8. Progress', bgId: 'hex', left: [{ type: 'heading', text: 'Mid-Sprint Check-in' }, { type: 'text', content: 'After implementing 7 of 12 tasks, the spec has guided every decision. No context drift, no scope creep.' }, { type: 'callout', emoji: '🎯', title: 'The SDD Rhythm', content: 'Read spec → implement ticket → mark done → read spec again. The spec keeps you honest.' }, { type: 'codeHint', label: 'Mark a task done in tasks.md', code: '- [x] #1 Setup auth middleware    ← done\n- [ ] #8 Add task status endpoint  ← next' }], right: [{ type: 'terminal', title: 'lsp status (mid-sprint)', lines: [{ type: 'command', text: 'lsp status' }, { type: 'blank', text: '' }, { type: 'output', text: 'Progress: ████████████░░░░ 7/12 (58%)' }, { type: 'blank', text: '' }, { type: 'success', text: '✓ #1  Setup project scaffold' }, { type: 'success', text: '✓ #2  Database schema + migrations' }, { type: 'success', text: '✓ #3  Auth middleware (JWT verify)' }, { type: 'success', text: '✓ #4  POST /auth/register + /login' }, { type: 'success', text: '✓ #5  GET/POST /lists endpoints' }, { type: 'success', text: '✓ #6  PUT/DELETE /lists endpoints' }, { type: 'success', text: '✓ #7  GET/POST /tasks endpoints' }, { type: 'output', text: '○ #8  PATCH /tasks/:id/status' }, { type: 'output', text: '○ #9  Task priority + filtering' }, { type: 'output', text: '○ #10 Error handling + validation' }, { type: 'output', text: '○ #11 Integration test suite' }, { type: 'output', text: '○ #12 README + API documentation' }] }] },
  { id: 9, slug: 'plan-sprint', title: '/plan-sprint — Plan Sprint 2', subtitle: 'AI-assisted sprint planning with expert agents', chapterLabel: '9. Planning', bgId: 'constellation', skill: '/plan-sprint', left: [{ type: 'heading', text: 'The Plan Sprint Skill' }, { type: 'text', content: 'Before building sprint 2 features (search, pagination, webhooks), run /plan-sprint to get expert analysis from 4 AI personas working in parallel.' }, { type: 'bullets', items: ['Architect: System design + API design', 'UX/UI Lead: Developer experience', 'Storage: Database schema changes', 'Human Experience: Error messages, docs'] }, { type: 'callout', emoji: '🤖', title: '3 PMs synthesize', content: 'Draft PM writes the plan → Reviewer PM critiques → Finalizer PM writes the backlog tickets. Three passes = high-quality sprint.' }], right: [{ type: 'terminal', title: 'Skill: /plan-sprint', lines: [{ type: 'command', text: '> /plan-sprint "Add search, pagination, and webhook notifications"' }, { type: 'output', text: 'Spawning 4 expert agents in parallel...' }, { type: 'blank', text: '' }, { type: 'output', text: '  Agent 1: Architect (API design)' }, { type: 'output', text: '  Agent 2: Storage (schema changes)' }, { type: 'output', text: '  Agent 3: UX/UI (DX review)' }, { type: 'output', text: '  Agent 4: HX (error messages)' }, { type: 'blank', text: '' }, { type: 'output', text: 'Synthesizing with 3 PM agents...' }, { type: 'success', text: '✓ Sprint 2 plan ready' }, { type: 'success', text: '✓ 8 tickets added to backlog.md' }, { type: 'output', text: '' }, { type: 'output', text: 'Sprint 2 tickets:' }, { type: 'output', text: '  2.1  GET /tasks?q=search (3 pts)' }, { type: 'output', text: '  2.2  Pagination: limit+cursor (3 pts)' }, { type: 'output', text: '  2.3  POST /webhooks register (5 pts)' }, { type: 'output', text: '  2.4  Webhook delivery + retry (5 pts)' }] }] },
  { id: 10, slug: 'sprint2-init', title: 'Sprint 2: New Init', subtitle: 'LightSpec adapts as your project grows', chapterLabel: '10. Sprint 2', bgId: 'grid', skill: 'lsp init', left: [{ type: 'heading', text: 'Running lsp init Again' }, { type: 'text', content: 'Sprint 1 is complete. The codebase grew from 45 files to 62 files, from 5,800 to 8,400 LOC. Run lsp init again for sprint 2.' }, { type: 'callout', emoji: '📈', title: 'Complexity Grows', content: 'Score jumped from 38 to 52 — still standard depth but approaching full. The spec now includes the existing architecture context.' }, { type: 'bullets', items: ['Brownfield scanner finds .lsp/spec.md', 'Previous spec informs context', 'Score 52/100 → still standard', 'Spec includes: existing endpoints, new webhook module, updated data model'] }], right: [{ type: 'terminal', lines: [{ type: 'command', text: 'lsp init . --scope="search, pagination, webhooks"' }, { type: 'output', text: 'Scanning project...' }, { type: 'output', text: '  Files:      62 source files' }, { type: 'output', text: '  Lines:      8,412 LOC' }, { type: 'output', text: '  Previous:   .lsp/spec.md found' }, { type: 'blank', text: '' }, { type: 'output', text: 'Complexity: 52/100 → standard' }, { type: 'blank', text: '' }, { type: 'output', text: 'Generating sprint 2 spec...' }, { type: 'success', text: '✓ .lsp/spec-sprint2.md (734 lines)' }, { type: 'success', text: '✓ .lsp/tasks.md updated (8 tasks)' }] }] },
  { id: 11, slug: 'graduate', title: '`lsp graduate` — Join AutoSpec', subtitle: 'When your project deserves the full ceremony', chapterLabel: '11. Graduate', bgId: 'circuits', skill: 'lsp graduate', left: [{ type: 'heading', text: 'The Graduation Command' }, { type: 'text', content: 'After sprint 2, Task Flow API has grown into a production system with 8 modules, 30+ endpoints, and a team of 3. Time to graduate.' }, { type: 'bullets', items: ['Converts .lsp/ → 10 role specs in specs/', 'Creates CLAUDE.md memory file', 'Generates backlog.md from tasks', 'Creates docs/ directory structure', 'Sets up skills/.claude/commands/'] }, { type: 'callout', emoji: '🎓', title: 'Real Continuity', content: 'Every AutoSpec role spec is seeded from your existing lsp spec. No starting from scratch — all context carries forward.' }], right: [{ type: 'dirTree', title: 'After lsp graduate:', files: ['specs/01_product_manager.md', 'specs/02_backend_lead.md', 'specs/03_frontend_lead.md', 'specs/04_db_architect.md', 'specs/05_qa_lead.md', 'specs/06_devops_lead.md', 'specs/07_security_lead.md', 'specs/08_data_engineer.md', 'specs/09_tech_writer.md', 'specs/10_project_manager.md', 'specs/backlog.md', 'CLAUDE.md', 'docs/'] }] },
  { id: 12, slug: 'continuity', title: 'The Continuity Chain', subtitle: 'How docs, backlog, and CLAUDE.md keep your team in sync', chapterLabel: '12. Continuity', bgId: 'constellation', left: [{ type: 'heading', text: 'Nothing Gets Lost' }, { type: 'text', content: 'The real power of LightSpec isn\'t the spec — it\'s the chain: spec → implementation → docs → next spec. Every sprint builds on the last.' }, { type: 'bullets', items: ['CLAUDE.md: memory file Claude reads at session start', 'docs/: living documentation updated with each ticket', 'backlog.md: single source of truth for all work', 'sprints/: retrospectives + QA results archived', 'Each lsp init reads previous context'] }, { type: 'callout', emoji: '🔗', title: 'Try it yourself', content: 'Clone Task Flow API, run `npm install -g lightspec`, then `lsp scan .` — you\'ll see the full project context in seconds.' }], right: [{ type: 'terminal', title: 'The Sprint Lifecycle', lines: [{ type: 'output', text: 'Sprint 1: Foundation' }, { type: 'success', text: '  ✓ lsp init → .lsp/spec.md' }, { type: 'success', text: '  ✓ 12 tickets → all done' }, { type: 'success', text: '  ✓ docs/ updated per ticket' }, { type: 'blank', text: '' }, { type: 'output', text: 'Sprint 2: Enhancement' }, { type: 'success', text: '  ✓ lsp init → reads sprint 1 context' }, { type: 'success', text: '  ✓ 8 new tickets → all done' }, { type: 'success', text: '  ✓ docs/ extended' }, { type: 'blank', text: '' }, { type: 'output', text: 'Graduate → AutoSpec' }, { type: 'success', text: '  ✓ 10 role specs generated' }, { type: 'success', text: '  ✓ CLAUDE.md seeded from .lsp/' }, { type: 'success', text: '  ✓ Team scales with ceremony' }] }] },
];

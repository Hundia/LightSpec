# Database / Storage Architect Spec — LightSpec

## Storage Philosophy

LightSpec is **file-based only**. There is no database, no server, no cloud storage. All state lives in the `.lsp/` directory inside the user's project.

This is a deliberate design decision:
- Works offline, no credentials needed
- Can be committed to version control (optional)
- Zero setup friction — no `docker-compose up` or `psql` required
- The spec lives next to the code it describes

---

## `.lsp/` Output Directory Structure

```
your-project/
└── .lsp/
    ├── spec.md        # Generated specification (Markdown + YAML frontmatter)
    ├── tasks.md       # Extracted task checklist (Markdown checkboxes)
    └── .meta.json     # Scan metadata (machine-readable, not for humans)
```

### `spec.md` — Generated Specification

```markdown
---
generated_by: lsp
version: "0.1.0"
depth: micro            # micro | standard | full
complexity_score: 23    # 0-100 heuristic score
provider: claude-code   # claude-code | anthropic | gemini
generated_at: "2026-04-04T12:00:00Z"
project_path: /Users/alice/my-project
---

# Project Spec: my-project

## Overview
[AI-generated overview...]

## Architecture
[AI-generated architecture description...]

## Key Components
[AI-generated component list...]

## Suggested Tasks
- [ ] Task 1
- [ ] Task 2
```

### `tasks.md` — Task Checklist

Extracted automatically from the `## Suggested Tasks` section of `spec.md`. Used by `lsp status` to show progress.

```markdown
# Tasks — my-project

Generated: 2026-04-04
Source: .lsp/spec.md

- [ ] Set up test framework
- [ ] Add input validation to createUser handler
- [x] Configure TypeScript strict mode
- [ ] Add README section on local setup
```

### `.meta.json` — Scan Metadata

Machine-readable. Written by the scanner before LLM call. Not intended for human editing.

```json
{
  "version": "0.1.0",
  "scanned_at": "2026-04-04T12:00:00Z",
  "project_path": "/Users/alice/my-project",
  "scanner_results": {
    "stack": ["typescript", "node", "express"],
    "architecture": "flat",
    "has_tests": true,
    "test_frameworks": ["jest"],
    "route_count": 8,
    "has_docs": true,
    "doc_files": ["README.md"],
    "dependency_count": 14,
    "loc_estimate": 342
  },
  "complexity_score": 45,
  "depth": "standard",
  "provider_used": "anthropic"
}
```

---

## `.lsp/` Lifecycle

| Command | Reads | Writes |
|---------|-------|--------|
| `lsp init` | Nothing (fresh) or existing `.meta.json` | `spec.md`, `tasks.md`, `.meta.json` |
| `lsp scan` | Nothing | `.meta.json` only (no LLM) |
| `lsp status` | `tasks.md` | Nothing (read-only) |
| `lsp graduate` | `spec.md`, `.meta.json` | Full AutoSpec scaffold at project root |

---

## Graduation Output

`lsp graduate` reads `.lsp/spec.md` + `.meta.json` and writes the full AutoSpec hierarchy:

```
your-project/
├── specs/
│   ├── 01_product_manager.md   # Generated from spec.md content
│   ├── 02_backend_lead.md
│   ├── 03_frontend_lead.md
│   ├── 04_db_architect.md
│   ├── 05_qa_lead.md
│   ├── 06_devops_lead.md
│   ├── 07_marketing_lead.md
│   ├── 08_finance_lead.md
│   ├── 09_business_lead.md
│   ├── 10_ui_designer.md
│   └── backlog.md              # Sprint 1 with tickets from tasks.md
├── .claude/
│   └── commands/               # 10 SDD skill files
├── docs/
│   └── README.md               # Documentation index stub
└── CLAUDE.md                   # AutoSpec CLAUDE.md
```

---

## gitignore Recommendation

LightSpec adds `.lsp/` to `.gitignore` by default during `lsp init`. Users can override:

```bash
lsp init --commit-spec    # Does NOT add .lsp/ to .gitignore
```

This lets OSS maintainers commit their spec for onboarding purposes.

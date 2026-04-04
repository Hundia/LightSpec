---
title: Adaptive Depth System
sprint: 37
created: 2026-03-27
---

# Adaptive Depth System

## Three Depth Levels

LightSpec maps every project to one of three depth levels. The level determines which templates are used, how many output files are generated, the token budget per LLM call, and the expected generation time.

| Level | Score Range | Output | Tokens | Est. Time | Use Case |
|-------|------------|--------|--------|-----------|----------|
| `micro` | 0–25 | `spec.md` (1 file, ~200 lines) | 4096 | ~15s | Small scripts, utilities, single-concern tasks |
| `standard` | 26–65 | `spec.md` (1 file, 500-1000 lines) | 8192 | ~45s | Medium apps, features, API services |
| `full` | 66–100 | 3 files (product + technical + quality) | 6144/file | ~90s | Complex apps, monorepos, multi-concern systems |

---

## Scoring Algorithm Breakdown

The complexity scorer computes a 0–100 score from six independent categories. Scores from all categories are summed and capped at 100.

### Category 1: File Count (0–25 points)

The number of files in the project (excluding `node_modules`, `dist`, `build`, `.git`).

| Files | Points |
|-------|--------|
| > 200 | 25 |
| 51–200 | 15 |
| 11–50 | 8 |
| 0–10 | 2 |

### Category 2: Line Count (0–20 points)

Approximate total lines of code (estimated via file size sampling).

| Lines | Points |
|-------|--------|
| > 50,000 | 20 |
| 10,001–50,000 | 12 |
| 2,001–10,000 | 6 |
| 0–2,000 | 1 |

### Category 3: Architecture Complexity (0–20 points)

Based on the architectural pattern detected by `detect-architecture`.

| Pattern | Points |
|---------|--------|
| monorepo | 20 |
| microservices | 18 |
| modular | 10 |
| monolith | 5 |
| unknown | 0 |

### Category 4: Tech Stack Breadth (0–15 points)

Counts the total number of detected languages plus frameworks, multiplied by 3, capped at 15.

```
score += Math.min((languages.length + frameworks.length) * 3, 15)
```

A project with 2 languages and 3 frameworks contributes `(2+3)*3 = 15` points (capped). A single-language, no-framework project contributes `1*3 = 3` points.

### Category 5: API + Frontend + DB Presence (0–10 points)

Rewards projects that span multiple architectural concerns.

| Signal | Points |
|--------|--------|
| `hasApi` | +4 |
| `hasFrontend` | +3 |
| `hasDatabase` | +3 |

Maximum: 10 points (full-stack project with all three).

### Category 6: Test Maturity (0–10 points)

Based on the number of test files found.

| Test Files | Points |
|-----------|--------|
| > 20 | 10 |
| 6–20 | 6 |
| 1–5 | 3 |
| 0 | 0 |

---

## Override Mechanism

The auto-detected depth can be overridden with the `--depth` flag:

```bash
lsp init --depth micro    # Force micro regardless of score
lsp init --depth standard
lsp init --depth full
```

Use cases for overrides:
- **Force micro** when you know the task is small despite a complex codebase (e.g., fixing a bug in a monorepo)
- **Force full** when you want comprehensive specs for a new project that starts simple
- **Force standard** as a team default for consistent spec sizes

The `--scope <dir>` flag narrows the scan to a subdirectory before scoring, which effectively produces a lower score for subsystems of large projects:

```bash
lsp init --scope apps/web   # Score only the frontend package
```

---

## Examples: Projects and Their Depths

**Micro (0–25):**
- 5-file Node.js CLI utility — score ~10
- Single Python script with a few helpers — score ~8
- Go HTTP server with 2 handlers, no tests — score ~14

**Standard (26–65):**
- Express REST API with 10 routes, TypeScript, 4 test files — score ~38
- Flask app with SQLAlchemy models, pytest suite — score ~42
- NestJS module with database and 8 test files — score ~55

**Full (66–100):**
- NestJS + React monorepo with full test suite (50+ test files) — score ~88
- Django + React app with migrations, pytest, 25 test files — score ~72
- Large Go microservices project with multiple services — score ~78

---

## The Graduation Path to AutoSpec

When a project grows beyond what LightSpec can effectively spec — or when a team decides they want the full 10-role spec system — `lsp graduate` provides a structured migration:

```bash
lsp graduate
```

This command:
1. Reads `.lsp/` output files
2. Creates `specs/` directory with 10 role spec files
3. Maps LightSpec content to appropriate AutoSpec roles:
   - `spec.md` Overview → `01_product_manager.md`
   - Technical Design sections → `02_backend_lead.md` + `03_frontend_lead.md`
   - Data Model sections → `04_db_architect.md`
   - Testing sections → `05_qa_lead.md`
   - Roles 06–10 get stubs for manual completion
4. Creates `specs/backlog.md` from `tasks.md`
5. Creates `CLAUDE.md` from AutoSpec template
6. Prints next steps

The graduation path is intentionally one-way: LightSpec → AutoSpec. AutoSpec does not generate LightSpec output, and LightSpec does not replicate AutoSpec's 10-role depth. They serve different points on the spec complexity curve.

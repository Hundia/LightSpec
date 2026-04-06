# LightSpec Quick-Start Guide

Get from zero to a generated spec in under five minutes — no prior experience required.

---

## 1. Install

```bash
npm install -g lightspec
```

That installs the `lsp` CLI. Verify it works:

```bash
lsp --version
```

---

## 2. LightSpec or AutoSpec?

| Situation | Recommended tool |
|-----------|-----------------|
| Solo project or small team | **LightSpec** |
| Brownfield codebase you need to understand quickly | **LightSpec** |
| Prototype or MVP with no existing spec docs | **LightSpec** |
| Team project with formal SRS/PRD documents | AutoSpec |
| Full SDD ceremony — 10 role specs, sprint cadence, audit trail | AutoSpec |
| You already have role specs and a structured backlog | AutoSpec |

If you chose LightSpec, keep reading. If you need AutoSpec, see the [AutoSpec QUICKSTART](https://github.com/your-org/autospec/blob/main/QUICKSTART.md).

> New to LightSpec? You are in the right place. This document is the complete standalone guide — no other files needed.

---

## 3. Set Up an LLM Provider

LightSpec calls an LLM to generate specs. Pick one provider and set it up before running `lsp init`.

| Provider | Setup | Cost |
|----------|-------|------|
| **Claude Code** (recommended) | `npm install -g @anthropic-ai/claude-code` — no API key needed | Free (included with Claude Code subscription) |
| **Anthropic API** | `export ANTHROPIC_API_KEY=sk-ant-...` | Pay-per-token; free credits at [console.anthropic.com](https://console.anthropic.com) |
| **Gemini API** | `export GEMINI_API_KEY=...` | Free tier available at [aistudio.google.com](https://aistudio.google.com) |

Claude Code is the easiest option — install it once, no API key management required.

### Claude Code setup (one-time)

```bash
npm install -g @anthropic-ai/claude-code
claude login
```

### Anthropic API setup

```bash
export ANTHROPIC_API_KEY=sk-ant-...
# Add to ~/.bashrc or ~/.zshrc to persist across sessions
```

### Gemini API setup

```bash
export GEMINI_API_KEY=AIza...
# Add to ~/.bashrc or ~/.zshrc to persist across sessions
```

---

## 4. Three-Command Walkthrough

Run these commands from your project root. Each command is safe to run on an existing codebase — nothing is modified until you confirm.

### Step 1 — Scan your project

```bash
lsp scan .
```

What it does: inspects your project structure, detects languages and frameworks, scores complexity (0–100), and recommends a spec depth (`micro`, `standard`, or `full`). No LLM calls, no files written.

Example output:

```
  LightSpec Brownfield Scan Results
  ──────────────────────────────────────────────────

  Summary
  TypeScript monorepo with React frontend and Express API.

  Complexity
  Score:      42/100
  Depth:      standard
  Reasoning:  Mid-size codebase with API + frontend. Standard depth recommended.

  Tech Stack
  Languages:  typescript, javascript
  Frameworks: react, express
  Tests:      vitest, jest
```

### Step 2 — Generate your spec

```bash
lsp init .
```

What it does: runs the scanner, shows you the generation plan, asks for confirmation, then calls your LLM provider to produce spec files in `.lsp/`. Also extracts a task list into `.lsp/tasks.md`.

You will see a prompt like:

```
  Proceed with generation? [Y/n]
```

Press Enter (or Y) to continue. The LLM generates your spec in 30–90 seconds depending on project size and depth.

Output files created in `.lsp/`:

| Depth | Files created |
|-------|--------------|
| `micro` | `spec.md`, `tasks.md` |
| `standard` | `spec.md`, `tasks.md` |
| `full` | `product.md`, `technical.md`, `quality.md`, `tasks.md` |

### Step 3 — Check your task list

```bash
lsp status
```

What it does: reads `.lsp/tasks.md` and prints a progress bar with all tasks. Tasks start as `[ ]` (not done). Edit `tasks.md` and change `[ ]` to `[x]` as you complete work.

Example output:

```
  LightSpec Task Status
  ──────────────────────────────────────────────────

  Progress: ████████░░░░░░░░░░░░░░░░░░░░░░ 27% (3/11 done)

  Tasks:

  ✓ #1      Set up project structure                    [High] 30m
  ✓ #2      Define database schema                      [High] 2h
  ✓ #3      Implement authentication                    [High] 4h
  ○ #4      Build REST API endpoints                    [High] 4h
  ○ #5      Add input validation                        [Medium] 1h
  ...
```

---

## 5. Optional: Bridge to AutoSpec Skills (step 4)

If you use Claude Code and want to use SDD skills like `/execute-ticket`, run:

```bash
lsp init-backlog
```

This reads `.lsp/tasks.md` and creates `specs/backlog.md` in AutoSpec Sprint 1 format. Each task becomes a numbered backlog ticket with estimated story points. Once created, you can open Claude Code and run `/execute-ticket` to have an AI agent implement individual tasks.

This step is optional — skip it if you just want the spec without the SDD workflow.

---

## 6. Full CLI Reference

### `lsp scan [path]`

Run the brownfield scanner without calling an LLM. Safe to run on any project.

| Flag | Description | Default |
|------|-------------|---------|
| `--json` | Output results as JSON instead of pretty-print | off |
| `--scope <dir>` | Scope analysis to a subdirectory (e.g. `src/`) | project root |

Examples:

```bash
lsp scan .                  # Scan current directory
lsp scan ./packages/api     # Scan a subdirectory
lsp scan . --json           # Machine-readable output
lsp scan . --scope src/     # Only analyze src/
```

---

### `lsp init [path]`

Scan project, detect complexity, and generate specs using an LLM.

| Flag | Description | Default |
|------|-------------|---------|
| `--depth <level>` | Override suggested depth: `micro`, `standard`, or `full` | auto-detected |
| `--scope <dir>` | Scope analysis to a subdirectory | project root |
| `--srs <file>` | Provide an SRS or PRD document as additional context | none |
| `--provider <name>` | Force a specific LLM provider | auto-detected |
| `--model <name>` | Override the model used for generation | provider default |
| `-o, --output <dir>` | Output directory for generated files | `.lsp` |
| `-y, --yes` | Skip the confirmation prompt (useful in scripts) | off |
| `--dry-run` | Show the generation plan without writing any files | off |

Examples:

```bash
lsp init .                          # Standard init with auto-detected depth
lsp init . --depth micro            # Force minimal spec (good for quick prototypes)
lsp init . --depth full             # Force full spec (3 files: product, technical, quality)
lsp init . --srs ./docs/PRD.md      # Include your PRD as context
lsp init . --yes                    # Skip confirmation (CI/CD usage)
lsp init . --dry-run                # Preview what would be generated
lsp init . --provider anthropic-api # Force Anthropic API even if Claude Code is installed
```

---

### `lsp status`

Show task list progress from `.lsp/tasks.md`.

No flags. Reads from the nearest `.lsp/tasks.md` found by searching upward from the current directory. Works from any subdirectory in your project.

```bash
lsp status        # Show progress from anywhere in the project
```

---

### `lsp graduate`

Convert `.lsp/` output into a full AutoSpec project structure. Creates `specs/` with 10 role spec files, `specs/backlog.md`, and `CLAUDE.md`.

| Flag | Description | Default |
|------|-------------|---------|
| `--srs <file>` | Use an existing SRS for AutoSpec role generation | none |

```bash
lsp graduate              # Upgrade current project to AutoSpec structure
lsp graduate --srs ./docs/PRD.md   # Use PRD for richer role specs
```

Use `lsp graduate` when your project has grown beyond what LightSpec manages and you want full team-based SDD with role specs and sprint ceremonies.

---

### `lsp init-backlog`

Convert `.lsp/tasks.md` into `specs/backlog.md` in AutoSpec Sprint 1 format. Requires `.lsp/tasks.md` to exist (run `lsp init` first).

No flags. Creates `specs/` directory if it does not exist.

```bash
lsp init-backlog       # Creates specs/backlog.md from .lsp/tasks.md
```

---

## 7. Provider Error Recovery

If you see this error when running `lsp init`:

```
No LLM provider found. Set up one of these:

  Option 1 — Claude Code (recommended, no API key needed)
    npm install -g @anthropic-ai/claude-code

  Option 2 — Anthropic API
    export ANTHROPIC_API_KEY=sk-ant-...
    (Get free credits: https://console.anthropic.com)

  Option 3 — Gemini API
    export GEMINI_API_KEY=...
    (Free tier: https://aistudio.google.com)

Then re-run: lsp init .
```

Follow one of the options above and re-run. The most common causes:

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Error immediately on `lsp init` | No provider installed or configured | Install Claude Code or export an API key |
| `ANTHROPIC_API_KEY` set but still fails | Key not exported in current shell session | Run `export ANTHROPIC_API_KEY=sk-ant-...` or add to shell profile |
| Claude Code installed but not found | `claude` command not on PATH | Run `claude login` and restart your terminal |
| Hanging indefinitely on confirmation prompt | Running in a non-interactive pipe or script | Add `--yes` flag: `lsp init . --yes` |

### Verify your provider is detected

Run `lsp init . --dry-run` before committing to generation. The dry-run shows which provider will be used:

```
  Using provider: claude-code
```

If no provider is shown, set one up using the table in section 3 and retry.

---

## 8. Typical First Session

Here is a complete example for a new TypeScript project:

```bash
# 1. Install LightSpec (one-time)
npm install -g lightspec

# 2. Set up provider (one-time) — choose one:
npm install -g @anthropic-ai/claude-code && claude login
# OR: export ANTHROPIC_API_KEY=sk-ant-...
# OR: export GEMINI_API_KEY=...

# 3. Go to your project
cd my-project

# 4. Preview what the scanner sees
lsp scan .

# 5. Generate your spec (takes 30–90 seconds)
lsp init .

# 6. Check your task list
lsp status

# 7. (Optional) Bridge to AutoSpec skills
lsp init-backlog
```

After step 5, your `.lsp/` directory contains your generated spec. Open `.lsp/spec.md` (or `product.md` / `technical.md` for full depth) and review it. Edit freely — the spec belongs to you.

---

## 9. What's Next

- **Review your spec** — `.lsp/spec.md` is yours to edit. Treat it as a living document.
- **Track tasks** — Update `.lsp/tasks.md` as you complete work. Mark tasks done by changing `[ ]` to `[x]`.
- **Re-generate** — Run `lsp init . --depth full` any time you want a deeper spec on an evolved codebase.
- **Graduate when ready** — Run `lsp graduate` if your project grows and you need full team SDD with role specs and sprint ceremonies.

---

*LightSpec — Just enough spec, just fast enough.*

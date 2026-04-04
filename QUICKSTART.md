# LightSpec Quick Start

LightSpec generates just-enough spec for any project in under 60 seconds.

## Install

```bash
npm install -g lightspec
# or use without installing:
npx lightspec init
```

## 3 Steps

### 1. Run `lsp init` in your project

```bash
cd your-project
lsp init
```

LightSpec scans your project (stack, architecture, complexity) and generates a spec matched to your complexity level:

| Depth | Score | LOC | Time | Output |
|-------|-------|-----|------|--------|
| **Micro** | 0–30 | < 200 | ~15s | 1 spec file |
| **Standard** | 31–70 | 200–1K | ~45s | 1 spec file |
| **Full** | 71–100 | > 1K | ~90s | 3 spec files |

### 2. Review `.lsp/spec.md`

Your spec is in `.lsp/`. The generated files:

```
.lsp/
├── spec.md        # Generated specification
├── tasks.md       # Extracted task checklist
└── .meta.json     # Scan metadata (complexity score, depth, provider)
```

### 3. Track progress with `lsp status`

```bash
lsp status       # Shows task completion progress from .lsp/tasks.md
lsp graduate     # When ready: convert to full AutoSpec structure
```

---

## All Commands

| Command | Description |
|---------|-------------|
| `lsp init [path]` | Scan + generate spec (interactive) |
| `lsp scan [path]` | Scanner only — no LLM, instant output |
| `lsp status` | Show task progress from `.lsp/tasks.md` |
| `lsp graduate` | Convert `.lsp/` to full AutoSpec scaffold |

### Flags

| Flag | Command | Description |
|------|---------|-------------|
| `--depth micro\|standard\|full` | `lsp init` | Override depth (ignore complexity score) |
| `--commit-spec` | `lsp init` | Don't add `.lsp/` to `.gitignore` |
| `--no-llm` | `lsp init` | Scanner only (same as `lsp scan`) |
| `--json` | `lsp scan` | Output scan results as JSON |

---

## LLM Providers

LightSpec auto-detects your available LLM provider in this order:

1. **Claude Code** (if running inside Claude Code CLI) — preferred, uses your subscription
2. **Anthropic API** (if `ANTHROPIC_API_KEY` is set) — < $0.05 per `lsp init`
3. **Gemini CLI** (if `gemini` binary is available in `$PATH`) — free tier available

No LLM available? `lsp init` falls back to `lsp scan` output — still useful for brownfield context.

---

## Example: Brownfield Node.js Project

```bash
$ cd my-express-api
$ lsp init

  Scanning project...
  ✓ Stack: typescript, node, express, prisma
  ✓ Architecture: mvc (routes/, controllers/, services/)
  ✓ Tests: jest — 23 test files
  ✓ Routes: 14 API routes detected
  ✓ Docs: README.md, docs/api.md
  ✓ Complexity score: 67 → standard depth

  Generating spec...
  ✓ Provider: claude-code
  ✓ Spec written to .lsp/spec.md
  ✓ Tasks written to .lsp/tasks.md (8 tasks)

  Done in 41s

Run `lsp status` to track task progress.
Run `lsp graduate` when you're ready for full AutoSpec.
```

---

## SDD Development Workflow (for LightSpec contributors)

LightSpec develops itself using AutoSpec's SDD methodology. If you're contributing:

```bash
# View active sprint
/sprint-status

# Execute a ticket
/execute-ticket 38.5

# Run full sprint
/sprint-run 39

# See all commands
/help
```

See `specs/backlog.md` for the active sprint and `specs/01_product_manager.md` for product vision.

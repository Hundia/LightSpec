# LightSpec

**Just enough spec, just fast enough.**

[![npm](https://img.shields.io/npm/v/lightspec)](https://www.npmjs.com/package/lightspec)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-81%20passing-brightgreen)](cli/tests/)

---

## What is LightSpec?

LightSpec is a CLI tool that scans any project and generates a just-enough specification in under 60 seconds. It's the lightweight sibling of [AutoSpec](https://github.com/your-org/autospec) — designed for developers who need AI context fast, without the 30-minute ceremony.

**The problem:** AI coding tools like Claude Code, Cursor, and Copilot are powerful but stateless. Every session starts fresh. Without a spec, you lose 10–20% of each AI session re-explaining your architecture.

**The solution:** Run `lsp init`. Get a spec in 60 seconds. Give your AI the context it needs.

---

## Install

```bash
npm install -g lightspec
```

Or use without installing:

```bash
npx lightspec init
```

---

## Quick Start

```bash
cd your-project
lsp init
```

**Example output:**

```
  Scanning project...
  ✓ Stack: typescript, node, express
  ✓ Architecture: mvc
  ✓ Tests: jest — 12 test files
  ✓ Routes: 8 API routes
  ✓ Complexity score: 45 → standard depth

  Generating spec (claude-code)...
  ✓ .lsp/spec.md written
  ✓ .lsp/tasks.md written (6 tasks)

  Done in 38s
```

Your spec is in `.lsp/spec.md`. Your task list is in `.lsp/tasks.md`.

---

## Adaptive Depth

LightSpec auto-detects the right level of spec for your project:

| Depth | Complexity Score | Typical Project | Time | Output |
|-------|-----------------|-----------------|------|--------|
| **Micro** | 0–30 | < 200 LOC, single file or flat structure | ~15s | 1 spec file |
| **Standard** | 31–70 | 200–1K LOC, MVC or modular structure | ~45s | 1 spec file |
| **Full** | 71–100 | > 1K LOC, multiple modules, API routes, tests | ~90s | 3 spec files |

Override depth with `--depth`:
```bash
lsp init --depth micro    # Force micro regardless of complexity
lsp init --depth full     # Force full spec
```

---

## Commands

| Command | Description |
|---------|-------------|
| `lsp init [path]` | Scan project + generate spec (uses LLM) |
| `lsp scan [path]` | Scanner only — no LLM, instant JSON output |
| `lsp status` | Show task completion from `.lsp/tasks.md` |
| `lsp graduate` | Convert `.lsp/` to full AutoSpec scaffold |

---

## LLM Providers

LightSpec auto-detects the best available provider:

1. **Claude Code** — if running inside Claude Code session (no API key needed)
2. **Anthropic API** — if `ANTHROPIC_API_KEY` is set (< $0.05 per run)
3. **Gemini CLI** — if `gemini` is installed (free tier)

No LLM available? `lsp init --no-llm` runs the scanner only and produces `.lsp/.meta.json`.

---

## Part of the AutoSpec Family

```
lsp init          →   Just enough spec for your project
lsp graduate      →   Full AutoSpec scaffold when you're ready
```

LightSpec is the on-ramp. When your project complexity demands it, `lsp graduate` converts your `.lsp/` output into the full AutoSpec hierarchy: 10 role specs, sprint backlog, CLAUDE.md, and all 10 SDD skills.

| | LightSpec | AutoSpec |
|-|-----------|----------|
| Time to first spec | ~60 seconds | ~30 minutes |
| Files generated | 1–3 | 10+ |
| Brownfield scanner | Built-in | Manual |
| Graduation path | `lsp graduate` → AutoSpec | Already there |
| Best for | Quick start, brownfield onboarding | Full SDD ceremony |

---

## Contributing

LightSpec develops itself using AutoSpec's SDD methodology. See [QUICKSTART.md](QUICKSTART.md) for the development workflow and [specs/backlog.md](specs/backlog.md) for active tickets.

```bash
git clone https://github.com/your-org/lightspec
cd lightspec/cli && npm install && npm test
```

---

## License

MIT — see [LICENSE](LICENSE)

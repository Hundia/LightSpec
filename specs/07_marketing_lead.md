# Marketing Lead Spec — LightSpec

## Positioning Statement

**LightSpec is the CLI that generates just-enough spec for any project, in any language, in under 60 seconds.**

It lives between "no spec at all" and full AutoSpec ceremony — making spec-driven development accessible to every developer, not just the ones willing to invest 30 minutes upfront.

---

## Tagline

> "Just enough spec, just fast enough"

Secondary:
> "Run `lsp init`. Get a spec. Ship better code."

---

## Key Differentiators

| Differentiator | LightSpec | AutoSpec | No Spec |
|----------------|-----------|----------|---------|
| Time to first spec | 60 seconds | 30 minutes | 0 (no spec) |
| Output size | 1–3 files | 10+ files | — |
| Complexity adaptation | Adaptive depth | Full ceremony | — |
| Brownfield support | Built-in scanner | Manual setup | — |
| Graduation path | `lsp graduate` → AutoSpec | Already there | — |
| Learning curve | Zero (just run `lsp init`) | Medium (10 roles, sprint workflow) | — |

---

## Target Audience Messaging

### Solo Devs (primary)
"Stop context drift. Run `lsp init` before your next Claude Code session and get an AI that actually understands your project."

### Brownfield Teams
"Your codebase has no spec. Your AI has no context. LightSpec's scanner reads your directory structure, stack, and routes — and generates the context your AI needs in under a minute."

### OSS Maintainers
"Commit `.lsp/spec.md` alongside your README. New contributors (human or AI) understand your project instantly."

---

## Launch Channels

### npm Page
- Package name: `lightspec`
- README badge: `![npm](https://img.shields.io/npm/v/lightspec)`
- Keywords: `spec`, `ai`, `cli`, `sdd`, `claude`, `copilot`, `cursor`

### GitHub README
- Hero: animated terminal GIF showing `lsp init` run
- Quick install section (3 lines)
- 3 depth levels table
- "Part of the AutoSpec family" badge

### Product Hunt
- Category: Developer Tools
- Tagline: "Just enough spec, just fast enough"
- Gallery: terminal screenshots, depth level comparison, graduation path

### Show HN (Hacker News)
- Title: "LightSpec — generate a project spec in 60 seconds with `lsp init`"
- Focus: brownfield scanner story (most HN readers have legacy codebases)

### AutoSpec Family Cross-Promotion
- Add LightSpec to AutoSpec's README as "the lighter sibling"
- AutoSpec CLAUDE.md can reference `lsp` as onboarding path
- Shared design language (warm palette in viewer, same role spec format)

---

## Success Metrics

| Metric | 30-day Target | 90-day Target |
|--------|--------------|--------------|
| npm downloads/month | 500 | 1,000 |
| GitHub stars | 50 | 200 |
| Product Hunt upvotes | 100 | — |
| `lsp graduate` uses tracked | N/A (local) | — |

---

## Messaging Hierarchy

1. **Primary:** Speed — 60 seconds vs 30 minutes
2. **Secondary:** Adaptiveness — auto-detects the right level of spec
3. **Tertiary:** Graduation path — grows with your project
4. **Supporting:** Part of the AutoSpec family (trust + ecosystem)

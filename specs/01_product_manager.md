# Product Manager Spec — LightSpec

## Vision

LightSpec is the CLI that generates just-enough spec, just fast enough. Any developer should be able to run `lsp init` on any project and get a useful spec in under 60 seconds. LightSpec exists between "no spec at all" and the full AutoSpec ceremony — meeting developers where they are.

## The 4 Personas

### 1. Solo Dev (primary)
- Builds side projects or SaaS solo with Claude Code or Cursor
- Needs: fast bootstrap, AI-friendly output, zero ceremony
- Pain: either no spec (context drift, AI hallucinating architecture) or too much spec (30-minute setup they'll never maintain)

### 2. Brownfield Team
- Existing codebase, maybe 6–24 months old, no formal specs
- Needs: AI context fast, brownfield scanner to describe what already exists, starting point for conversations
- Pain: every AI session starts from scratch, no shared mental model of the architecture

### 3. OSS Maintainer
- Maintains an open-source project, wants new contributors oriented quickly
- Needs: one-command onboarding spec, generated `.lsp/spec.md` they can commit alongside code
- Pain: contributors read README, still have no idea how the internals work

### 4. AutoSpec Evaluator
- Wants a lighter entry point before committing to full AutoSpec ceremony
- Needs: `lsp init` → see value → `lsp graduate` → full AutoSpec when complexity demands it
- Pain: AutoSpec felt too heavy for this project right now

## MoSCoW Prioritization

### Must Have (MVP)
- `lsp init` — scan project, generate spec, write `.lsp/spec.md` and `.lsp/tasks.md`
- `lsp scan` — scanner only, no LLM, instant output
- `lsp status` — show task completion progress from `.lsp/tasks.md`
- `lsp graduate` — convert `.lsp/` output to full AutoSpec scaffold
- 3 depth levels: micro (score 0–30), standard (score 31–70), full (score 71–100)
- Brownfield scanner: detect stack, architecture, test coverage, routes, docs

### Should Have
- npm publish as `lightspec` → `lsp` binary (`npm i -g lightspec` or `npx lightspec init`)
- GitHub Pages deployment (presentation at domain root, viewer at `/viewer/`)
- i18n for presentation: English + Hebrew

### Could Have
- VS Code extension (`lsp init` from command palette)
- Web playground (paste a repo URL, get a spec in browser)
- Team mode (shared `.lsp/` committed to repo with history)

### Won't Have (v1)
- Cloud-hosted spec storage
- Billing / paid tier
- Mobile app
- Real-time collaboration

## User Stories

- As a solo dev, I want `lsp init` to give me a useful spec in < 60 seconds
- As a brownfield team, I want `lsp scan` to describe my existing codebase for AI context
- As an OSS maintainer, I want to commit `.lsp/spec.md` alongside my README
- As an AutoSpec evaluator, I want `lsp graduate` to grow me into full SDD when I'm ready
- As a presenter, I want the presentation to run at a GitHub Pages URL and look professional

## Success Metrics

- `lsp init` completes on any TypeScript project in < 60 seconds
- 82+ tests passing across scanner + pipeline + CLI modules
- Brownfield detection accuracy > 80% on known project fixtures
- Presentation builds clean, 16 slides render, keyboard nav and HE i18n work
- `lsp graduate` produces a valid AutoSpec scaffold (all 10 role specs + backlog.md)

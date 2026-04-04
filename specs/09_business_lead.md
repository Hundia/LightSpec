# Business Lead Spec — LightSpec

## Market Context

LightSpec targets the intersection of two fast-growing trends:
1. **AI-assisted development** (Claude Code, Cursor, GitHub Copilot) — developers increasingly pair-program with AI
2. **Spec debt** — as AI tools accelerate development velocity, context drift and architecture decay accelerate too

The problem: AI coding tools are powerful but stateless. Every session starts fresh. Developers who lack a spec lose 10–20% of each session re-explaining context that could have been captured.

---

## Market Sizing

**Primary TAM:** Developers using AI coding tools
- Estimated 10M+ developers use Copilot, Cursor, or Claude Code (2026)
- ~40% work on brownfield (existing) codebases
- ~60% solo devs have no formal specs

**SAM (Serviceable):** TypeScript/Node/Python developers comfortable with CLI tools
- ~2M developers in this segment

**SOM (Initial target):** Early adopters who follow HN / dev Twitter / npm trends
- 10,000 npm downloads in 6 months is achievable for a useful CLI tool

---

## Competitive Landscape

| Tool | Approach | Weakness |
|------|----------|----------|
| AutoSpec | Full SDD framework, 10 roles, sprint workflow | Too heavy for solo/small projects |
| GitHub Copilot | Code completion, no spec generation | No structured output, no brownfield analysis |
| Cursor Rules | `.cursorrules` file, manually maintained | Manual, no scanning, no depth adaptation |
| README.md (DIY) | Developer-written, unstructured | No consistency, no AI prompt optimization |
| **LightSpec** | Auto-generated, adaptive, brownfield-aware | New, needs adoption |

---

## Differentiation vs AutoSpec

| Aspect | LightSpec | AutoSpec |
|--------|-----------|----------|
| Time to first spec | 60 seconds | 30 minutes |
| Files generated | 1–3 (`.lsp/`) | 10+ (role specs + backlog + CLAUDE.md) |
| Complexity adaptation | Auto (3 levels) | Manual (you choose) |
| Brownfield scanner | Built-in | Not included |
| Graduation path | `lsp graduate` → AutoSpec | N/A (you're already there) |
| Best for | Existing project, fast start | New project, full ceremony |

---

## Go-to-Market Strategy

### Phase 1: npm Launch (Sprint 37–38)
- Publish `lightspec` to npm
- GitHub Pages live with presentation
- Post to Show HN + npm trending

### Phase 2: Community (Sprint 39–40)
- AutoSpec README cross-promotion
- Product Hunt launch
- Dev Twitter / BlueSky posts

### Phase 3: Integration (Sprint 41+)
- VS Code extension (runs `lsp init` from command palette)
- `lsp graduate` stability → full AutoSpec upsell path

---

## Success Criteria (6 months)

| KPI | Target |
|-----|--------|
| npm installs | 1,000/month |
| GitHub stars | 200+ |
| `lsp graduate` usage | Tracked via anonymous telemetry (opt-in) |
| Brownfield detection accuracy | > 80% on community-reported fixtures |
| Community contributions | 5+ PRs merged |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| LLM API costs deter adoption | Medium | High | Recommend Claude Code (subscription) as default; API cost < $0.05/run |
| AutoSpec cannibalizes (too similar) | Low | Medium | Positioning: LightSpec is the on-ramp, AutoSpec is the destination |
| Brownfield scanner false positives | Medium | Medium | Fixture-based QA, community issue reporting |
| npm namespace squatting | Low | High | Register `lightspec` package immediately |

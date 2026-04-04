# QA Lead Spec — LightSpec

## Baseline

**81 tests passing** across 13 test files as of Sprint 37.

Test runner: **vitest** (`cd cli && npx vitest run`)

---

## Test Structure

```
cli/tests/
├── scanner/
│   ├── detect-stack.test.ts        # 12 tests
│   ├── detect-architecture.test.ts # 8 tests
│   ├── detect-tests.test.ts        # 7 tests
│   ├── detect-routes.test.ts       # 6 tests
│   ├── detect-docs.test.ts         # 5 tests
│   └── complexity-scorer.test.ts   # 9 tests
├── pipeline/
│   ├── depth-router.test.ts        # 8 tests
│   ├── generate-spec.test.ts       # 10 tests (mocked LLM)
│   └── task-extractor.test.ts      # 7 tests
├── commands/
│   ├── init.test.ts                # 5 tests
│   ├── scan.test.ts                # 4 tests
│   └── status.test.ts              # 4 tests
├── integration/
│   └── lsp-init.integration.test.ts # 6 tests on real fixtures
├── e2e/
│   └── self-referential.e2e.test.ts # 3 tests on /opt/LightSpec/ itself
└── fixtures/
    ├── minimal-node/               # < 200 LOC, score 0–30 → micro depth
    ├── standard-express/           # ~500 LOC, score 31–70 → standard depth
    └── complex-nestjs/             # > 1K LOC, score 71–100 → full depth
```

---

## Coverage Targets

| Module | Target | Rationale |
|--------|--------|-----------|
| `scanner/` | 80% | Core detection logic, high value to test |
| `pipeline/` | 80% | Depth routing + task extraction are deterministic |
| `commands/` | 60% | Commander.js wiring, harder to unit-test |
| `providers/` | 50% | Integration-heavy, mock-friendly at boundary |

---

## Definition of Done

A ticket is ✅ Done when:
1. All new code has passing tests
2. `npm run build` exits 0 (no TypeScript errors)
3. `npx vitest run` exits 0 (no test regressions)
4. Relevant `docs/` section updated
5. Backlog entry has docs column populated

---

## Test Patterns

### Scanner Unit Tests

```typescript
// Use real fixture directories — no mocks for file I/O
import { detectStack } from '../../src/scanner/detect-stack.js'

it('detects TypeScript from package.json', async () => {
  const result = await detectStack('tests/fixtures/standard-express')
  expect(result.stack).toContain('typescript')
})
```

### Pipeline Unit Tests

```typescript
// Mock the LLM provider — pipeline tests should be deterministic
import { generateSpec } from '../../src/pipeline/generate-spec.js'

vi.mock('../../src/providers/index.js', () => ({
  getProvider: () => ({ generate: async () => mockSpecMarkdown })
}))
```

### Integration Tests

Integration tests run `lsp init` as a subprocess against fixture projects and assert:
- `.lsp/spec.md` is created
- `.lsp/tasks.md` has at least 3 checkbox items
- `.lsp/.meta.json` has valid JSON with `depth`, `complexity_score`, `provider_used`
- Depth matches expected fixture (minimal → micro, standard-express → standard, complex-nestjs → full)

### E2E Self-Referential Test

Runs `lsp init` on `/opt/LightSpec/` itself. Assertions:
- Completes in < 60 seconds
- Depth is `full` (LightSpec is complex enough)
- Output spec mentions "LightSpec" or "lsp"
- Graduate produces valid AutoSpec scaffold (has `specs/` dir with 10 files)

---

## Sprint 38 QA Checklist

For the presentation polish sprint:

- [ ] `cd presentation && npm run build` exits 0
- [ ] `cd viewer && npm run build` exits 0
- [ ] 16 slides render (visual spot-check)
- [ ] Keyboard nav: ArrowLeft/Right works in PresentationPage
- [ ] Mobile: hamburger menu opens/closes
- [ ] HE language toggle switches all text
- [ ] No console errors on initial page load
- [ ] `prefers-reduced-motion` CSS rule present in output bundle

---

## Running Tests

```bash
# All CLI tests
cd cli && npx vitest run

# Watch mode (development)
cd cli && npx vitest

# Coverage report
cd cli && npx vitest run --coverage

# Single file
cd cli && npx vitest run tests/scanner/detect-stack.test.ts
```

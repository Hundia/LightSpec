# QA Review

Review completed tickets following the QA Lead guidelines with change-appropriate verification.

## Usage

```
/qa-review [ticket_number or "sprint X"]
```

**Examples:**
- `/qa-review 38.5` - Review single ticket
- `/qa-review sprint 38` - Review all 🧪 QA Review tickets in Sprint 38

## Instructions

When this command is invoked:

1. **Read QA standards**:
   - Read `specs/05_qa_lead.md` for quality guidelines
   - Understand Definition of Done checklist

2. **Identify tickets to review**:
   - Read `specs/backlog.md`
   - Find tickets with 🧪 QA Review status
   - If specific ticket provided, review only that one

3. **Scale QA to change type**:

   | Change Type | QA Required |
   |-------------|-------------|
   | **Bug fix** | Reproduce the bug first, apply fix, verify the exact user flow passes |
   | **CLI change** | `cd cli && npm run build && npx vitest run` — all tests must pass |
   | **Presentation change** | `cd presentation && npm run build` — exits 0, visual spot check |
   | **Viewer change** | `cd viewer && npm run build` — exits 0, visual spot check |
   | **Docs/config only** | No QA needed — mark ✅ directly |
   | **Full feature** | Full test suite + new test cases if coverage gaps exist |

4. **For each ticket, verify**:

   ### Code Quality
   - [ ] Follows project coding standards (TypeScript strict, named exports, ESM)
   - [ ] No `console.log` statements left
   - [ ] Error handling implemented
   - [ ] No hardcoded paths or secrets
   - [ ] TypeScript types correct (no `any`)

   ### Testing (CLI tickets)
   - [ ] Unit tests written and pass
   - [ ] Integration tests if applicable
   - [ ] Edge cases covered

   ### Visual QA (Presentation/Viewer tickets)
   - [ ] Component renders without errors
   - [ ] No layout overflow on mobile
   - [ ] Animations work (or gracefully disabled with prefers-reduced-motion)
   - [ ] i18n: both EN and HE text render correctly

   ### Documentation
   - [ ] Relevant `docs/` section updated
   - [ ] CLI changes documented in `docs/cli/`
   - [ ] Presentation changes documented in `docs/presentation/`

5. **Run tests**:
   ```bash
   # CLI — full suite
   cd cli && npm run build && npx vitest run

   # Presentation — build check
   cd presentation && npm run build

   # Viewer — build check
   cd viewer && npm run build
   ```

6. **Update backlog**:
   - **If PASS**: Change status 🧪 QA Review → ✅ Done
   - **If FAIL**: Keep at 🧪, create bug ticket (`B.XX`), document issues

## Output Format

```
## QA Review: Ticket [X.X] — [Title]

### Change Type: [CLI change / Presentation change / Full feature]

### Checklist Results

#### Code Quality
- [x] TypeScript strict — no `any`
- [x] No debug statements
- [x] Error handling present

#### Testing / Build
- [x] `cd cli && npm run build` → exit 0
- [x] `npx vitest run` → X/X tests pass

#### Documentation
- [x] docs/cli/03_scanner.md updated

### Test Results
| Suite | Pass | Fail | Notes |
|-------|------|------|-------|
| Unit | X | 0 | |
| Integration | X | 0 | |

### Verdict: ✅ PASS

### Issues Found
None

### Status Updated
🧪 QA Review → ✅ Done
```

## Important Rules

- Be thorough — this is the last gate before "done"
- Run ACTUAL builds/tests, don't just check if files exist
- Scale QA effort to change type (don't run full CLI tests for a CSS fix)
- Create bug tickets (B.XX) for any issues found
- Verify documentation was updated alongside code
- For bug fixes: MUST reproduce the original bug before verifying the fix

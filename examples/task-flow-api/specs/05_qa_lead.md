---
role: qa_lead
generated_by: lightspec-graduate
source: .lsp/spec.md
date: 2026-04-05
status: draft
---
# QA Lead Spec

## Testing Strategy

The project uses **Vitest** as the test runner with **Supertest** for HTTP integration tests. Each test file creates a fresh in-memory SQLite database via the `createApp` factory, ensuring full isolation with no shared state between tests.

- **Unit tests:** None required — business logic is thin and fully exercised by integration tests
- **Integration tests:** 20 tests across 4 files covering all 10 endpoints
- **Coverage target:** 100% of public API endpoints
- **Test command:** `npm test`

Known gaps: no performance/load tests; no test for concurrent request race conditions on the SQLite write lock.

## Test Coverage Targets

- Unit: 80%+
- Integration: Key flows covered
- E2E: Critical user journeys

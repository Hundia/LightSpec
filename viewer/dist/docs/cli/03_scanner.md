---
title: Brownfield Scanner
sprint: 37
created: 2026-03-27
---

# Brownfield Scanner

## What Is Brownfield Intelligence?

Most spec tools assume you are starting fresh. They ask you to describe your project, define your tech stack, and outline your architecture. For greenfield work, this is reasonable. For existing projects — the vast majority of real development work — it is friction.

Brownfield intelligence means the tool reads the project first and asks questions later. Before LightSpec generates a single spec token, it scans your codebase and builds a structured model of what already exists: what languages you use, how your code is organized, what your API looks like, how thoroughly it is tested, and what documentation already exists.

This scan happens entirely on the filesystem — no LLM calls, no network requests, no API keys required. It is fast (typically under 500ms for projects up to 500 files), deterministic, and fully testable.

---

## The Five Detection Modules

### 1. `detect-stack.ts` — Tech Stack Detection

Reads manifest files to identify languages, frameworks, package managers, test frameworks, and build tools.

**Supported languages:** TypeScript, JavaScript, Python, Go, Rust, Ruby, Java, Kotlin, C/C++, C#, PHP (via file extensions from `gatherMetrics`)

**Detection strategy per ecosystem:**

| Ecosystem | Primary Signal | Secondary Signal |
|-----------|---------------|-----------------|
| Node.js | `package.json` dependencies | Lock files (npm/yarn/pnpm/bun) |
| Python | `requirements.txt` | `pyproject.toml` |
| Go | `go.mod` | Module path + `require` blocks |
| Rust | `Cargo.toml` | — |
| Ruby | `Gemfile` | — |

**Detected frameworks:** express, fastify, nestjs, koa, hono, react, vue, angular, next, nuxt, svelte, flask, django, fastapi, starlette, tornado, aiohttp, gin, fiber, echo, chi, rails, sinatra

**Detected test frameworks:** vitest, jest, mocha, jasmine, playwright, cypress, pytest, nose, testing (Go built-in), testify, rspec, minitest, rust-test

**Detected build tools:** vite, tsup, webpack, rollup, esbuild, parcel, turbopack, setuptools, poetry, hatch, cargo

---

### 2. `detect-architecture.ts` — Architecture Pattern Detection

Analyzes directory structure to identify the overall architectural pattern and detect API, frontend, and database presence.

**Supported patterns:**

| Pattern | Detection Signals |
|---------|-----------------|
| `monorepo` | `apps/` + `packages/` dirs; `pnpm-workspace.yaml`; `lerna.json`; `nx.json`; `turbo.json` |
| `modular` | `src/modules/` or `src/features/` or `app/modules/` |
| `microservices` | `services/` or `microservices/` at root |
| `monolith` | Any `src/`, `lib/`, or `app/` directory with entry points |
| `unknown` | None of the above match |

**Presence detection:**
- `hasApi` — routes/, controllers/, handlers/, endpoints/, api/ dirs; router.ts, routes.py, main.go files
- `hasFrontend` — pages/, views/, components/, public/ dirs; index.html, vite.config.ts
- `hasDatabase` — migrations/, prisma/, db/, alembic/ dirs; schema.prisma, models.py

---

### 3. `detect-tests.ts` — Test Maturity Detection

Counts test files across all supported test patterns and detects configured coverage thresholds.

**Test file patterns detected:**
- `**/*.test.ts`, `**/*.test.js`, `**/*.test.tsx`, `**/*.test.jsx`
- `**/*.spec.ts`, `**/*.spec.js`, `**/*.spec.tsx`, `**/*.spec.jsx`
- `**/*.test.py`, `**/test_*.py`, `**/*_test.go`, `**/*.test.rb`

**Coverage threshold detection:** reads `vitest.config.ts`, `vitest.config.js`, `jest.config.ts`, `jest.config.js` and extracts coverage threshold if configured.

---

### 4. `detect-routes.ts` — API Route Extraction

Statically parses source files to extract API route definitions without executing any code.

**Supported frameworks:**

| Framework | Detection Method |
|-----------|----------------|
| Express | `router.METHOD('/path', ...)` + `app.METHOD('/path', ...)` regex |
| Fastify | Same regex (uses same router pattern) |
| NestJS | `@Get()`, `@Post()`, `@Put()`, etc. decorator regex on `*.controller.ts` |
| Flask | `@app.route('/path', methods=[...])` decorator regex |
| FastAPI | Same as Flask |
| Gin/Echo/Fiber/Chi | `.GET("/path", ...)`, `.POST("/path", ...)` regex |
| Go std | `http.HandleFunc("/path", ...)` regex |

Route extraction is best-effort — it captures obvious patterns but will miss routes defined with complex programmatic logic. The output informs the spec generation prompt but is not required to be complete.

---

### 5. `detect-docs.ts` — Documentation Discovery

Locates existing documentation to avoid regenerating what already exists and to incorporate existing context.

**README detection:** checks `README.md`, `readme.md`, `Readme.md`, `README.rst`, `README.txt` — reads first 500 lines.

**Spec file detection:** looks for `specs/**/*.md`, `SRS*.md`, `PRD*.md`, `SPEC*.md`, `**/backlog.md`, `**/requirements.md`

**Other docs:** `docs/**/*.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `ARCHITECTURE.md`, `API.md`

---

## How It Works Without LLM Calls

The scanner is pure filesystem analysis:
1. **Read manifest files** — JSON, TOML, text files that describe dependencies
2. **Glob directory patterns** — identify structural signals from directory names
3. **Regex parse source files** — extract route definitions from limited file sets (max 50 files)
4. **Count files** — glob all files matching source/test patterns
5. **Estimate line counts** — stat() a sample of files, calculate average bytes/line ratio, extrapolate

No code is executed, no modules are imported dynamically, and no external services are called.

---

## Metrics Gathering

`gatherMetrics()` counts files using `glob` with ignore patterns for `node_modules/`, `dist/`, `build/`, `.git/`, `coverage/`, etc.

Line count estimation uses a sampling strategy:
- Sample up to 200 files using `fs.stat()` to get file sizes
- Assume ~50 bytes per line as a heuristic average
- Scale sampled bytes to full file count

This approach keeps scanning fast even for large repositories while providing a reasonable approximation of codebase size.

---

## Limitations and Edge Cases

**Known limitations:**

1. **Polyglot projects** — Projects mixing many languages may have imprecise framework detection if manifest files conflict or are absent.

2. **Generated code** — `dist/`, `build/`, and `coverage/` directories are excluded, but custom build output directories may inflate file counts if not named conventionally.

3. **Dynamic routes** — Routes defined programmatically (e.g., `ROUTES.forEach(r => app.get(r.path, ...))`) are not detected by static regex parsing.

4. **Monorepo depth** — For large monorepos, `detect-architecture` identifies the pattern from root-level signals. Use `--scope <subdir>` to scope the analysis to a specific package.

5. **Go test files** — Go test files (`*_test.go`) may be double-counted if they also match source file patterns. The metrics are approximations, not precise audits.

6. **Test coverage thresholds** — Only detected from vitest and jest config files with standard `thresholds.lines` or `coverageThreshold.global.lines` patterns. Custom reporters or external coverage tools are not parsed.

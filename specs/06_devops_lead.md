# DevOps Lead Spec — LightSpec

## npm Package

### Package Identity
```json
{
  "name": "lightspec",
  "version": "0.1.0",
  "bin": { "lsp": "./dist/index.js" },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "type": "module"
}
```

### Publishing
```bash
# From cli/
npm run build          # tsup → dist/
npm publish --access public
```

Users install as:
```bash
npm install -g lightspec   # Global: lsp binary available
npx lightspec init          # One-shot, no install
```

---

## GitHub Actions

### `ci.yml` — Continuous Integration

Triggers on: `push` to `main`, all PRs.

3 parallel jobs:

| Job | Steps |
|-----|-------|
| `test-cli` | `cd cli && npm ci && npm run build && npm test` |
| `build-presentation` | `cd presentation && npm ci && npm run build` |
| `build-viewer` | `cd viewer && npm ci && npm run build` |

All 3 must pass for PR to merge.

### `pages.yml` — GitHub Pages Deployment

Triggers on: push to `main` after `ci.yml` passes.

Steps:
1. Build presentation → `presentation/dist/`
2. Build viewer → `viewer/dist/`
3. Stage pages artifact:
   - Copy `presentation/dist/` → pages root
   - Copy `viewer/dist/` → pages `/viewer/`
4. Deploy to GitHub Pages

### GitHub Pages URL Structure

```
https://[org].github.io/lightspec/          ← Presentation (landing + slides)
https://[org].github.io/lightspec/viewer/   ← Viewer app
```

Vite configs:
- `presentation/vite.config.ts`: `base: '/'` (root of Pages domain)
- `viewer/vite.config.ts`: `base: '/viewer/'`

---

## Release Process

1. Update version in `cli/package.json`
2. `git tag v0.x.x && git push origin v0.x.x`
3. GitHub Actions CI runs → publishes to npm on tag push

### Versioning
- `0.x.x` while in active development
- `1.0.0` when `lsp graduate` is stable and brownfield accuracy > 80%

---

## Local Development

```bash
# CLI development
cd cli
npm install
npm run dev          # tsup --watch
npm test             # vitest run

# Link locally for testing
cd cli && npm run build
npm link             # Makes `lsp` available globally from local build

# Presentation
cd presentation
npm install
npm run dev          # Vite dev server on :5173

# Viewer
cd viewer
npm install
npm run dev          # Vite dev server on :5174
```

---

## Infrastructure Costs

| Service | Tier | Cost |
|---------|------|------|
| GitHub repo | Free | $0 |
| GitHub Actions | Free tier (2000 min/month) | $0 |
| GitHub Pages | Free | $0 |
| npm registry | Free (public package) | $0 |

**Total: $0/month** — LightSpec has zero infrastructure costs.

import { describe, it, expect } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractGoRoutes } from '../../src/scanner/detect-routes.js';
import { detectArchitecture } from '../../src/scanner/detect-architecture.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, '../fixtures');

describe('extractGoRoutes', () => {
  it('extracts 3 routes from Gin project', async () => {
    const routes = await extractGoRoutes(path.join(FIXTURES, 'go-gin-project'));
    expect(routes).toHaveLength(3);

    const methods = routes.map(r => r.method);
    expect(methods).toContain('GET');
    expect(methods).toContain('POST');
    expect(methods).toContain('DELETE');

    const paths = routes.map(r => r.path);
    expect(paths).toContain('/users');
    expect(paths).toContain('/users/:id');
  });

  it('extracts correct methods and paths from Gin project', async () => {
    const routes = await extractGoRoutes(path.join(FIXTURES, 'go-gin-project'));
    const getRoute = routes.find(r => r.method === 'GET');
    expect(getRoute?.path).toBe('/users');
    const deleteRoute = routes.find(r => r.method === 'DELETE');
    expect(deleteRoute?.path).toBe('/users/:id');
  });

  it('extracts 2 routes from Echo project', async () => {
    const routes = await extractGoRoutes(path.join(FIXTURES, 'go-echo-project'));
    expect(routes).toHaveLength(2);

    const methods = routes.map(r => r.method);
    expect(methods).toContain('GET');
    expect(methods).toContain('POST');

    const paths = routes.map(r => r.path);
    expect(paths).toContain('/items');
  });

  it('returns 0 routes for Go project with no HTTP framework', async () => {
    const routes = await extractGoRoutes(path.join(FIXTURES, 'go-no-framework'));
    expect(routes).toHaveLength(0);
  });

  it('returns empty array gracefully for non-existent path', async () => {
    const routes = await extractGoRoutes(path.join(FIXTURES, 'does-not-exist'));
    expect(routes).toHaveLength(0);
  });
});

describe('detectArchitecture with Go projects', () => {
  it('sets hasApi: true for Go Gin project with main.go', async () => {
    const arch = await detectArchitecture(path.join(FIXTURES, 'go-gin-project'));
    expect(arch.hasApi).toBe(true);
  });

  it('sets hasApi: true for Go Echo project with main.go', async () => {
    const arch = await detectArchitecture(path.join(FIXTURES, 'go-echo-project'));
    expect(arch.hasApi).toBe(true);
  });

  it('sets hasApi: true for Go no-framework project with main.go', async () => {
    // main.go signals a Go server even without a framework in scope
    const arch = await detectArchitecture(path.join(FIXTURES, 'go-no-framework'));
    expect(arch.hasApi).toBe(true);
  });
});

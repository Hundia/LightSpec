// lsp/src/scanner/detect-stack.ts — Detect tech stack from manifest files

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import type { TechStack } from './types.js';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

function allDeps(pkg: PackageJson): string[] {
  return [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ];
}

function detectPackageManager(projectPath: string): string | null {
  if (existsSync(path.join(projectPath, 'bun.lockb'))) return 'bun';
  if (existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(path.join(projectPath, 'yarn.lock'))) return 'yarn';
  if (existsSync(path.join(projectPath, 'package-lock.json'))) return 'npm';
  if (existsSync(path.join(projectPath, 'package.json'))) return 'npm'; // default for Node
  return null;
}

async function detectNodeStack(projectPath: string): Promise<Partial<TechStack>> {
  const pkgPath = path.join(projectPath, 'package.json');
  if (!existsSync(pkgPath)) return {};

  let pkg: PackageJson = {};
  try {
    const raw = await readFile(pkgPath, 'utf-8');
    pkg = JSON.parse(raw) as PackageJson;
  } catch {
    return {};
  }

  const deps = allDeps(pkg);
  const languages: string[] = ['javascript'];
  const frameworks: string[] = [];
  const testFrameworks: string[] = [];
  const buildTools: string[] = [];

  // TypeScript
  if (deps.includes('typescript') || deps.includes('ts-node') || deps.includes('tsup')) {
    languages.push('typescript');
  }

  // Frameworks
  if (deps.includes('express')) frameworks.push('express');
  if (deps.includes('fastify')) frameworks.push('fastify');
  if (deps.includes('@nestjs/core')) frameworks.push('nestjs');
  if (deps.includes('koa')) frameworks.push('koa');
  if (deps.includes('hono')) frameworks.push('hono');
  if (deps.includes('react')) frameworks.push('react');
  if (deps.includes('vue')) frameworks.push('vue');
  if (deps.some(d => d.startsWith('@angular/core'))) frameworks.push('angular');
  if (deps.includes('next')) frameworks.push('next');
  if (deps.includes('nuxt') || deps.includes('nuxt3')) frameworks.push('nuxt');
  if (deps.includes('svelte')) frameworks.push('svelte');

  // Test frameworks
  if (deps.includes('vitest')) testFrameworks.push('vitest');
  if (deps.includes('jest') || deps.includes('@jest/core')) testFrameworks.push('jest');
  if (deps.includes('mocha')) testFrameworks.push('mocha');
  if (deps.includes('jasmine')) testFrameworks.push('jasmine');
  if (deps.includes('@playwright/test')) testFrameworks.push('playwright');
  if (deps.includes('cypress')) testFrameworks.push('cypress');

  // Build tools
  if (deps.includes('vite')) buildTools.push('vite');
  if (deps.includes('tsup')) buildTools.push('tsup');
  if (deps.includes('webpack') || deps.includes('webpack-cli')) buildTools.push('webpack');
  if (deps.includes('rollup')) buildTools.push('rollup');
  if (deps.includes('esbuild')) buildTools.push('esbuild');
  if (deps.includes('parcel')) buildTools.push('parcel');
  if (deps.includes('turbopack')) buildTools.push('turbopack');

  return { languages, frameworks, testFrameworks, buildTools };
}

async function detectPythonStack(projectPath: string): Promise<Partial<TechStack>> {
  const reqPath = path.join(projectPath, 'requirements.txt');
  const pyprojectPath = path.join(projectPath, 'pyproject.toml');

  let deps: string[] = [];

  if (existsSync(reqPath)) {
    const raw = await readFile(reqPath, 'utf-8');
    deps = raw
      .split('\n')
      .map(l => l.trim().toLowerCase().split(/[=><!]/)[0].trim())
      .filter(Boolean);
  } else if (existsSync(pyprojectPath)) {
    const raw = await readFile(pyprojectPath, 'utf-8');
    // Simple extraction of package names from pyproject.toml
    const matches = raw.matchAll(/["']([a-zA-Z0-9_-]+)[>=<!]/g);
    for (const m of matches) {
      deps.push(m[1].toLowerCase());
    }
  } else {
    return {};
  }

  const frameworks: string[] = [];
  const testFrameworks: string[] = [];
  const buildTools: string[] = [];

  if (deps.includes('flask')) frameworks.push('flask');
  if (deps.includes('django')) frameworks.push('django');
  if (deps.includes('fastapi')) frameworks.push('fastapi');
  if (deps.includes('starlette')) frameworks.push('starlette');
  if (deps.includes('tornado')) frameworks.push('tornado');
  if (deps.includes('aiohttp')) frameworks.push('aiohttp');

  if (deps.includes('pytest')) testFrameworks.push('pytest');
  if (deps.includes('unittest')) testFrameworks.push('unittest');
  if (deps.includes('nose') || deps.includes('nose2')) testFrameworks.push('nose');

  if (deps.includes('setuptools') || deps.includes('build')) buildTools.push('setuptools');
  if (deps.includes('poetry')) buildTools.push('poetry');
  if (deps.includes('hatch')) buildTools.push('hatch');

  return {
    languages: ['python'],
    frameworks,
    testFrameworks,
    buildTools,
    packageManager: existsSync(path.join(projectPath, 'Pipfile')) ? 'pipenv' : null,
  };
}

async function detectGoStack(projectPath: string): Promise<Partial<TechStack>> {
  const goModPath = path.join(projectPath, 'go.mod');
  if (!existsSync(goModPath)) return {};

  let content = '';
  try {
    content = await readFile(goModPath, 'utf-8');
  } catch {
    return {};
  }

  const frameworks: string[] = [];
  const testFrameworks: string[] = ['testing']; // built-in

  if (content.includes('github.com/gin-gonic/gin')) frameworks.push('gin');
  if (content.includes('github.com/gofiber/fiber')) frameworks.push('fiber');
  if (content.includes('github.com/labstack/echo')) frameworks.push('echo');
  if (content.includes('github.com/go-chi/chi')) frameworks.push('chi');

  if (content.includes('github.com/stretchr/testify')) testFrameworks.push('testify');

  return {
    languages: ['go'],
    frameworks,
    testFrameworks,
    buildTools: [],
    packageManager: null,
  };
}

async function detectRustStack(projectPath: string): Promise<Partial<TechStack>> {
  if (!existsSync(path.join(projectPath, 'Cargo.toml'))) return {};
  return {
    languages: ['rust'],
    frameworks: [],
    testFrameworks: ['rust-test'],
    buildTools: ['cargo'],
    packageManager: 'cargo',
  };
}

async function detectRubyStack(projectPath: string): Promise<Partial<TechStack>> {
  const gemfilePath = path.join(projectPath, 'Gemfile');
  if (!existsSync(gemfilePath)) return {};

  const raw = await readFile(gemfilePath, 'utf-8');
  const frameworks: string[] = [];
  const testFrameworks: string[] = [];

  if (raw.includes("gem 'rails'") || raw.includes('gem "rails"')) frameworks.push('rails');
  if (raw.includes("gem 'sinatra'") || raw.includes('gem "sinatra"')) frameworks.push('sinatra');
  if (raw.includes("gem 'rspec'") || raw.includes('gem "rspec"')) testFrameworks.push('rspec');
  if (raw.includes("gem 'minitest'") || raw.includes('gem "minitest"')) testFrameworks.push('minitest');

  return {
    languages: ['ruby'],
    frameworks,
    testFrameworks,
    buildTools: [],
    packageManager: 'bundler',
  };
}

export async function detectStack(projectPath: string): Promise<TechStack> {
  const [nodeStack, pythonStack, goStack, rustStack, rubyStack] = await Promise.all([
    detectNodeStack(projectPath),
    detectPythonStack(projectPath),
    detectGoStack(projectPath),
    detectRustStack(projectPath),
    detectRubyStack(projectPath),
  ]);

  // Merge all detected stacks
  const languages = new Set<string>();
  const frameworks = new Set<string>();
  const testFrameworks = new Set<string>();
  const buildTools = new Set<string>();

  for (const stack of [nodeStack, pythonStack, goStack, rustStack, rubyStack]) {
    for (const l of stack.languages ?? []) languages.add(l);
    for (const f of stack.frameworks ?? []) frameworks.add(f);
    for (const t of stack.testFrameworks ?? []) testFrameworks.add(t);
    for (const b of stack.buildTools ?? []) buildTools.add(b);
  }

  const packageManager =
    nodeStack.packageManager ??
    pythonStack.packageManager ??
    goStack.packageManager ??
    rustStack.packageManager ??
    rubyStack.packageManager ??
    detectPackageManager(projectPath);

  return {
    languages: Array.from(languages),
    frameworks: Array.from(frameworks),
    packageManager,
    testFrameworks: Array.from(testFrameworks),
    buildTools: Array.from(buildTools),
  };
}

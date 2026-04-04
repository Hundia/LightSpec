// src/scanner/complexity-scorer.ts
import { stat } from "fs/promises";
import { glob as glob4 } from "glob";
import path5 from "path";

// src/scanner/detect-stack.ts
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
function allDeps(pkg) {
  return [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {})
  ];
}
function detectPackageManager(projectPath) {
  if (existsSync(path.join(projectPath, "bun.lockb"))) return "bun";
  if (existsSync(path.join(projectPath, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(path.join(projectPath, "yarn.lock"))) return "yarn";
  if (existsSync(path.join(projectPath, "package-lock.json"))) return "npm";
  if (existsSync(path.join(projectPath, "package.json"))) return "npm";
  return null;
}
async function detectNodeStack(projectPath) {
  const pkgPath = path.join(projectPath, "package.json");
  if (!existsSync(pkgPath)) return {};
  let pkg = {};
  try {
    const raw = await readFile(pkgPath, "utf-8");
    pkg = JSON.parse(raw);
  } catch {
    return {};
  }
  const deps = allDeps(pkg);
  const languages = ["javascript"];
  const frameworks = [];
  const testFrameworks = [];
  const buildTools = [];
  if (deps.includes("typescript") || deps.includes("ts-node") || deps.includes("tsup")) {
    languages.push("typescript");
  }
  if (deps.includes("express")) frameworks.push("express");
  if (deps.includes("fastify")) frameworks.push("fastify");
  if (deps.includes("@nestjs/core")) frameworks.push("nestjs");
  if (deps.includes("koa")) frameworks.push("koa");
  if (deps.includes("hono")) frameworks.push("hono");
  if (deps.includes("react")) frameworks.push("react");
  if (deps.includes("vue")) frameworks.push("vue");
  if (deps.some((d) => d.startsWith("@angular/core"))) frameworks.push("angular");
  if (deps.includes("next")) frameworks.push("next");
  if (deps.includes("nuxt") || deps.includes("nuxt3")) frameworks.push("nuxt");
  if (deps.includes("svelte")) frameworks.push("svelte");
  if (deps.includes("vitest")) testFrameworks.push("vitest");
  if (deps.includes("jest") || deps.includes("@jest/core")) testFrameworks.push("jest");
  if (deps.includes("mocha")) testFrameworks.push("mocha");
  if (deps.includes("jasmine")) testFrameworks.push("jasmine");
  if (deps.includes("@playwright/test")) testFrameworks.push("playwright");
  if (deps.includes("cypress")) testFrameworks.push("cypress");
  if (deps.includes("vite")) buildTools.push("vite");
  if (deps.includes("tsup")) buildTools.push("tsup");
  if (deps.includes("webpack") || deps.includes("webpack-cli")) buildTools.push("webpack");
  if (deps.includes("rollup")) buildTools.push("rollup");
  if (deps.includes("esbuild")) buildTools.push("esbuild");
  if (deps.includes("parcel")) buildTools.push("parcel");
  if (deps.includes("turbopack")) buildTools.push("turbopack");
  return { languages, frameworks, testFrameworks, buildTools };
}
async function detectPythonStack(projectPath) {
  const reqPath = path.join(projectPath, "requirements.txt");
  const pyprojectPath = path.join(projectPath, "pyproject.toml");
  let deps = [];
  if (existsSync(reqPath)) {
    const raw = await readFile(reqPath, "utf-8");
    deps = raw.split("\n").map((l) => l.trim().toLowerCase().split(/[=><!]/)[0].trim()).filter(Boolean);
  } else if (existsSync(pyprojectPath)) {
    const raw = await readFile(pyprojectPath, "utf-8");
    const matches = raw.matchAll(/["']([a-zA-Z0-9_-]+)[>=<!]/g);
    for (const m of matches) {
      deps.push(m[1].toLowerCase());
    }
  } else {
    return {};
  }
  const frameworks = [];
  const testFrameworks = [];
  const buildTools = [];
  if (deps.includes("flask")) frameworks.push("flask");
  if (deps.includes("django")) frameworks.push("django");
  if (deps.includes("fastapi")) frameworks.push("fastapi");
  if (deps.includes("starlette")) frameworks.push("starlette");
  if (deps.includes("tornado")) frameworks.push("tornado");
  if (deps.includes("aiohttp")) frameworks.push("aiohttp");
  if (deps.includes("pytest")) testFrameworks.push("pytest");
  if (deps.includes("unittest")) testFrameworks.push("unittest");
  if (deps.includes("nose") || deps.includes("nose2")) testFrameworks.push("nose");
  if (deps.includes("setuptools") || deps.includes("build")) buildTools.push("setuptools");
  if (deps.includes("poetry")) buildTools.push("poetry");
  if (deps.includes("hatch")) buildTools.push("hatch");
  return {
    languages: ["python"],
    frameworks,
    testFrameworks,
    buildTools,
    packageManager: existsSync(path.join(projectPath, "Pipfile")) ? "pipenv" : null
  };
}
async function detectGoStack(projectPath) {
  const goModPath = path.join(projectPath, "go.mod");
  if (!existsSync(goModPath)) return {};
  let content = "";
  try {
    content = await readFile(goModPath, "utf-8");
  } catch {
    return {};
  }
  const frameworks = [];
  const testFrameworks = ["testing"];
  if (content.includes("github.com/gin-gonic/gin")) frameworks.push("gin");
  if (content.includes("github.com/gofiber/fiber")) frameworks.push("fiber");
  if (content.includes("github.com/labstack/echo")) frameworks.push("echo");
  if (content.includes("github.com/go-chi/chi")) frameworks.push("chi");
  if (content.includes("github.com/stretchr/testify")) testFrameworks.push("testify");
  return {
    languages: ["go"],
    frameworks,
    testFrameworks,
    buildTools: [],
    packageManager: null
  };
}
async function detectRustStack(projectPath) {
  if (!existsSync(path.join(projectPath, "Cargo.toml"))) return {};
  return {
    languages: ["rust"],
    frameworks: [],
    testFrameworks: ["rust-test"],
    buildTools: ["cargo"],
    packageManager: "cargo"
  };
}
async function detectRubyStack(projectPath) {
  const gemfilePath = path.join(projectPath, "Gemfile");
  if (!existsSync(gemfilePath)) return {};
  const raw = await readFile(gemfilePath, "utf-8");
  const frameworks = [];
  const testFrameworks = [];
  if (raw.includes("gem 'rails'") || raw.includes('gem "rails"')) frameworks.push("rails");
  if (raw.includes("gem 'sinatra'") || raw.includes('gem "sinatra"')) frameworks.push("sinatra");
  if (raw.includes("gem 'rspec'") || raw.includes('gem "rspec"')) testFrameworks.push("rspec");
  if (raw.includes("gem 'minitest'") || raw.includes('gem "minitest"')) testFrameworks.push("minitest");
  return {
    languages: ["ruby"],
    frameworks,
    testFrameworks,
    buildTools: [],
    packageManager: "bundler"
  };
}
async function detectStack(projectPath) {
  const [nodeStack, pythonStack, goStack, rustStack, rubyStack] = await Promise.all([
    detectNodeStack(projectPath),
    detectPythonStack(projectPath),
    detectGoStack(projectPath),
    detectRustStack(projectPath),
    detectRubyStack(projectPath)
  ]);
  const languages = /* @__PURE__ */ new Set();
  const frameworks = /* @__PURE__ */ new Set();
  const testFrameworks = /* @__PURE__ */ new Set();
  const buildTools = /* @__PURE__ */ new Set();
  for (const stack of [nodeStack, pythonStack, goStack, rustStack, rubyStack]) {
    for (const l of stack.languages ?? []) languages.add(l);
    for (const f of stack.frameworks ?? []) frameworks.add(f);
    for (const t of stack.testFrameworks ?? []) testFrameworks.add(t);
    for (const b of stack.buildTools ?? []) buildTools.add(b);
  }
  const packageManager = nodeStack.packageManager ?? pythonStack.packageManager ?? goStack.packageManager ?? rustStack.packageManager ?? rubyStack.packageManager ?? detectPackageManager(projectPath);
  return {
    languages: Array.from(languages),
    frameworks: Array.from(frameworks),
    packageManager,
    testFrameworks: Array.from(testFrameworks),
    buildTools: Array.from(buildTools)
  };
}

// src/scanner/detect-architecture.ts
import { existsSync as existsSync2 } from "fs";
import { readdir } from "fs/promises";
import path2 from "path";
async function listDirs(dirPath) {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}
async function listFiles(dirPath) {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    return entries.filter((e) => e.isFile()).map((e) => e.name);
  } catch {
    return [];
  }
}
function detectApiPresence(dirs, files) {
  const apiDirSignals = ["routes", "controllers", "handlers", "endpoints", "api"];
  const apiFileSignals = ["router.ts", "router.js", "routes.ts", "routes.js", "app.py", "main.go"];
  return apiDirSignals.some((d) => dirs.includes(d)) || apiFileSignals.some((f) => files.includes(f));
}
function detectFrontendPresence(dirs, files) {
  const frontendDirSignals = ["pages", "views", "components", "public", "assets", "templates"];
  const frontendFileSignals = ["index.html", "vite.config.ts", "vite.config.js", "next.config.js", "nuxt.config.ts"];
  return frontendDirSignals.some((d) => dirs.includes(d)) || frontendFileSignals.some((f) => files.includes(f));
}
function detectDatabasePresence(dirs, files) {
  const dbDirSignals = ["migrations", "prisma", "db", "database", "alembic", "schema"];
  const dbFileSignals = [
    "schema.prisma",
    "schema.sql",
    "models.py",
    "database.py",
    "db.ts",
    "db.js"
  ];
  return dbDirSignals.some((d) => dirs.includes(d)) || dbFileSignals.some((f) => files.includes(f));
}
async function detectArchitecture(projectPath) {
  const rootDirs = await listDirs(projectPath);
  const rootFiles = await listFiles(projectPath);
  const sourceDirectories = [];
  const candidateSrcDirs = ["src", "lib", "app", "pkg", "cmd", "internal"];
  for (const d of candidateSrcDirs) {
    if (rootDirs.includes(d)) sourceDirectories.push(`${d}/`);
  }
  const entryPoints = [];
  const candidateEntries = [
    "src/index.ts",
    "src/index.js",
    "src/main.ts",
    "src/main.js",
    "src/app.ts",
    "src/app.js",
    "main.go",
    "main.py",
    "app.py",
    "index.ts",
    "index.js"
  ];
  for (const entry of candidateEntries) {
    if (existsSync2(path2.join(projectPath, entry))) {
      entryPoints.push(entry);
    }
  }
  const srcPath = path2.join(projectPath, "src");
  const srcDirs = existsSync2(srcPath) ? await listDirs(srcPath) : [];
  const srcFiles = existsSync2(srcPath) ? await listFiles(srcPath) : [];
  const appPath = path2.join(projectPath, "app");
  const appDirs = existsSync2(appPath) ? await listDirs(appPath) : [];
  const appFiles = existsSync2(appPath) ? await listFiles(appPath) : [];
  let pattern = "unknown";
  const hasAppsDir = rootDirs.includes("apps");
  const hasPackagesDir = rootDirs.includes("packages");
  const hasWorkspacesDir = rootDirs.includes("packages") || rootDirs.includes("libs");
  const hasPnpmWorkspace = existsSync2(path2.join(projectPath, "pnpm-workspace.yaml"));
  const hasLernaJson = existsSync2(path2.join(projectPath, "lerna.json"));
  const hasNxJson = existsSync2(path2.join(projectPath, "nx.json"));
  const hasTurborepo = existsSync2(path2.join(projectPath, "turbo.json"));
  if (hasAppsDir && hasPackagesDir || hasAppsDir && hasWorkspacesDir || hasPnpmWorkspace || hasLernaJson || hasNxJson || hasTurborepo) {
    pattern = "monorepo";
  } else if (srcDirs.includes("modules") || srcDirs.includes("features") || appDirs.includes("modules") || appDirs.includes("features") || rootDirs.includes("modules")) {
    pattern = "modular";
  } else if (rootDirs.includes("services") || rootDirs.includes("microservices")) {
    pattern = "microservices";
  } else if (sourceDirectories.length > 0 || entryPoints.length > 0) {
    pattern = "monolith";
  }
  const allDirs = [...rootDirs, ...srcDirs, ...srcFiles, ...appDirs, ...appFiles];
  const allFiles = [...rootFiles, ...srcFiles, ...appFiles];
  const hasApi = detectApiPresence(allDirs, allFiles);
  const hasFrontend = detectFrontendPresence(rootDirs, rootFiles);
  const hasDatabase = detectDatabasePresence(allDirs, allFiles);
  return {
    pattern,
    entryPoints,
    sourceDirectories,
    hasApi,
    hasFrontend,
    hasDatabase
  };
}

// src/scanner/detect-routes.ts
import { readFile as readFile2 } from "fs/promises";
import { glob } from "glob";
var IGNORE_DIRS = ["node_modules/**", ".git/**", "dist/**", "build/**", "coverage/**"];
function extractExpressRoutes(content, filePath) {
  const routes = [];
  const re = /(?:router|app|fastify|server)\s*\.\s*(get|post|put|patch|delete|options|head)\s*\(\s*['"`]([^'"`]+)['"`]/gi;
  let m;
  while ((m = re.exec(content)) !== null) {
    routes.push({ method: m[1].toUpperCase(), path: m[2], file: filePath });
  }
  return routes;
}
function extractNestRoutes(content, filePath) {
  const routes = [];
  const re = /@(Get|Post|Put|Patch|Delete|Options|Head)\s*\(\s*(?:['"`]([^'"`]*)['"`])?\s*\)/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    routes.push({ method: m[1].toUpperCase(), path: m[2] ?? "/", file: filePath });
  }
  return routes;
}
function extractFlaskRoutes(content, filePath) {
  const routes = [];
  const re = /@(?:app|bp|blueprint)\s*\.route\s*\(\s*['"`]([^'"`]+)['"`](?:[^)]*methods\s*=\s*\[([^\]]+)\])?/gi;
  let m;
  while ((m = re.exec(content)) !== null) {
    const routePath = m[1];
    const methods = m[2] ? m[2].split(",").map((s) => s.trim().replace(/['"` ]/g, "").toUpperCase()).filter(Boolean) : ["GET"];
    for (const method of methods) {
      routes.push({ method, path: routePath, file: filePath });
    }
  }
  return routes;
}
async function detectRoutes(projectPath, techStack) {
  const routes = [];
  let framework = null;
  const hasNest = techStack.frameworks.includes("nestjs");
  const hasExpress = techStack.frameworks.includes("express");
  const hasFastify = techStack.frameworks.includes("fastify");
  const hasFlask = techStack.frameworks.includes("flask");
  if (hasNest) {
    framework = "nestjs";
  } else if (hasExpress) {
    framework = "express";
  } else if (hasFastify) {
    framework = "fastify";
  } else if (hasFlask) {
    framework = "flask";
  }
  if (hasNest || hasExpress || hasFastify || !hasFlask && techStack.languages.includes("typescript")) {
    let files = [];
    try {
      files = await glob(["**/*.ts", "**/*.js", "!**/*.d.ts"], {
        cwd: projectPath,
        ignore: IGNORE_DIRS,
        nodir: true
      });
    } catch {
      files = [];
    }
    for (const file of files) {
      let content = "";
      try {
        content = await readFile2(`${projectPath}/${file}`, "utf-8");
      } catch {
        continue;
      }
      if (hasNest) {
        routes.push(...extractNestRoutes(content, file));
      } else {
        routes.push(...extractExpressRoutes(content, file));
      }
      if (!framework) {
        if (extractNestRoutes(content, file).length > 0) framework = "nestjs";
        else if (extractExpressRoutes(content, file).length > 0) framework = "express";
      }
    }
  }
  if (hasFlask || techStack.languages.includes("python")) {
    let files = [];
    try {
      files = await glob("**/*.py", {
        cwd: projectPath,
        ignore: IGNORE_DIRS,
        nodir: true
      });
    } catch {
      files = [];
    }
    for (const file of files) {
      let content = "";
      try {
        content = await readFile2(`${projectPath}/${file}`, "utf-8");
      } catch {
        continue;
      }
      const flaskRoutes = extractFlaskRoutes(content, file);
      if (flaskRoutes.length > 0) {
        routes.push(...flaskRoutes);
        if (!framework) framework = "flask";
      }
    }
  }
  const seen = /* @__PURE__ */ new Set();
  const uniqueRoutes = routes.filter((r) => {
    const key = `${r.method}:${r.path}:${r.file}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return { routes: uniqueRoutes, framework };
}

// src/scanner/detect-docs.ts
import { readFile as readFile3 } from "fs/promises";
import { existsSync as existsSync3 } from "fs";
import { glob as glob2 } from "glob";
import path3 from "path";
var README_MAX_LINES = 500;
var IGNORE_DIRS2 = ["node_modules/**", ".git/**", "dist/**", "build/**", "coverage/**"];
var SPEC_DIR_NAMES = ["specs", "spec", "docs/spec", "docs/specs", ".lsp", ".autospec"];
var SPEC_FILE_PATTERNS = [
  "**/*spec*.md",
  "**/*srs*.md",
  "**/*requirements*.md",
  "**/*prd*.md",
  "**/SPEC.md",
  "**/SPECS.md",
  "**/SRS.md",
  "**/REQUIREMENTS.md",
  "**/backlog.md"
];
async function readReadme(projectPath) {
  const candidates = ["README.md", "readme.md", "Readme.md", "README.MD"];
  for (const name of candidates) {
    const fullPath = path3.join(projectPath, name);
    if (!existsSync3(fullPath)) continue;
    try {
      const content = await readFile3(fullPath, "utf-8");
      const lines = content.split("\n");
      return lines.slice(0, README_MAX_LINES).join("\n");
    } catch {
      return null;
    }
  }
  return null;
}
async function findExistingSpecs(projectPath) {
  const results = /* @__PURE__ */ new Set();
  for (const dir of SPEC_DIR_NAMES) {
    const dirPath = path3.join(projectPath, dir);
    if (!existsSync3(dirPath)) continue;
    try {
      const files = await glob2("**/*.md", {
        cwd: dirPath,
        nodir: true,
        ignore: IGNORE_DIRS2
      });
      for (const f of files) {
        results.add(path3.join(dir, f));
      }
    } catch {
    }
  }
  try {
    const files = await glob2(SPEC_FILE_PATTERNS, {
      cwd: projectPath,
      nodir: true,
      ignore: [...IGNORE_DIRS2, "README.md", "readme.md"]
    });
    for (const f of files) {
      results.add(f);
    }
  } catch {
  }
  return Array.from(results).sort();
}
async function findOtherDocs(projectPath, existingSpecs) {
  const specSet = new Set(existingSpecs);
  const results = [];
  try {
    const rootMd = await glob2("*.md", {
      cwd: projectPath,
      nodir: true
    });
    for (const f of rootMd) {
      if (f.toLowerCase() === "readme.md") continue;
      if (!specSet.has(f)) results.push(f);
    }
  } catch {
  }
  const docsPath = path3.join(projectPath, "docs");
  if (existsSync3(docsPath)) {
    try {
      const docsMd = await glob2("**/*.md", {
        cwd: docsPath,
        nodir: true,
        ignore: IGNORE_DIRS2
      });
      for (const f of docsMd) {
        const fullRel = path3.join("docs", f);
        if (!specSet.has(fullRel)) results.push(fullRel);
      }
    } catch {
    }
  }
  return [...new Set(results)].sort();
}
async function detectDocs(projectPath) {
  const [readme, existingSpecs] = await Promise.all([
    readReadme(projectPath),
    findExistingSpecs(projectPath)
  ]);
  const otherDocs = await findOtherDocs(projectPath, existingSpecs);
  return { readme, existingSpecs, otherDocs };
}

// src/scanner/detect-tests.ts
import { glob as glob3 } from "glob";
import path4 from "path";
var TEST_PATTERNS = [
  // TypeScript / JavaScript
  "**/*.test.ts",
  "**/*.spec.ts",
  "**/*.test.js",
  "**/*.spec.js",
  "**/*.test.mjs",
  "**/*.spec.mjs",
  // Python
  "test_*.py",
  "**/test_*.py",
  "**/*_test.py",
  // Go
  "**/*_test.go",
  // Rust
  // Rust tests are inline; detect test files via test directories
  "**/tests/**/*.rs",
  // Generic
  "**/test/**/*.ts",
  "**/tests/**/*.ts",
  "**/test/**/*.js",
  "**/tests/**/*.js"
];
var IGNORE_DIRS3 = [
  "node_modules/**",
  ".git/**",
  "dist/**",
  "build/**",
  ".next/**",
  ".nuxt/**",
  "coverage/**"
];
async function detectTests(projectPath, techStack) {
  let testFiles = 0;
  try {
    const matches = await glob3(TEST_PATTERNS, {
      cwd: projectPath,
      ignore: IGNORE_DIRS3,
      nodir: true
    });
    testFiles = matches.length;
  } catch {
  }
  const frameworks = new Set(techStack.testFrameworks);
  const configSignals = [
    ["pytest.ini", "pytest"],
    ["setup.cfg", "pytest"],
    // may contain [tool:pytest]
    ["jest.config.js", "jest"],
    ["jest.config.ts", "jest"],
    ["jest.config.mjs", "jest"],
    ["vitest.config.ts", "vitest"],
    ["vitest.config.js", "vitest"]
  ];
  for (const [file, fw] of configSignals) {
    try {
      await import("fs").then(async (fs) => {
        const { existsSync: existsSync4 } = fs;
        if (existsSync4(path4.join(projectPath, file))) {
          frameworks.add(fw);
        }
      });
    } catch {
    }
  }
  return {
    testFiles,
    testFrameworks: Array.from(frameworks)
  };
}

// src/scanner/complexity-scorer.ts
function scoreComplexity(context) {
  let score = 0;
  const { totalFiles, testFiles } = context.metrics;
  if (totalFiles > 200) score += 25;
  else if (totalFiles > 50) score += 15;
  else if (totalFiles > 10) score += 8;
  else score += 2;
  const { totalLines } = context.metrics;
  if (totalLines > 5e4) score += 20;
  else if (totalLines > 1e4) score += 12;
  else if (totalLines > 2e3) score += 6;
  else score += 1;
  if (context.architecture.pattern === "monorepo") score += 20;
  else if (context.architecture.pattern === "microservices") score += 18;
  else if (context.architecture.pattern === "modular") score += 10;
  else if (context.architecture.pattern === "monolith") score += 5;
  const stackCount = context.techStack.languages.length + context.techStack.frameworks.length;
  score += Math.min(stackCount * 3, 15);
  if (context.architecture.hasApi) score += 4;
  if (context.architecture.hasFrontend) score += 3;
  if (context.architecture.hasDatabase) score += 3;
  if (testFiles > 20) score += 10;
  else if (testFiles > 5) score += 6;
  else if (testFiles > 0) score += 3;
  score = Math.min(score, 100);
  let suggestedDepth;
  let reasoning;
  if (score <= 25) {
    suggestedDepth = "micro";
    reasoning = "Small project with minimal complexity \u2014 micro spec is sufficient";
  } else if (score <= 65) {
    suggestedDepth = "standard";
    reasoning = "Medium complexity project \u2014 standard unified spec recommended";
  } else {
    suggestedDepth = "full";
    reasoning = "Complex project with multiple concerns \u2014 full 3-spec decomposition recommended";
  }
  const summary = buildSummary(context, score, suggestedDepth);
  return { context, suggestedDepth, complexityScore: score, summary, reasoning };
}
function buildSummary(context, score, depth) {
  const { techStack, architecture, metrics } = context;
  const langList = techStack.languages.length ? techStack.languages.join("/").toUpperCase() : "unknown-language";
  const fwList = techStack.frameworks.length > 0 ? ` using ${techStack.frameworks.slice(0, 3).join(", ")}` : "";
  const archDesc = architecture.pattern === "unknown" ? "a project" : `a ${architecture.pattern} project`;
  const presences = [];
  if (architecture.hasApi) presences.push("API");
  if (architecture.hasFrontend) presences.push("frontend");
  if (architecture.hasDatabase) presences.push("database");
  const presenceDesc = presences.length > 0 ? ` with ${presences.join(", ")}` : "";
  const sizeDesc = metrics.totalFiles > 200 ? "large" : metrics.totalFiles > 50 ? "medium" : metrics.totalFiles > 10 ? "small" : "minimal";
  const sentence1 = `This is ${archDesc} written in ${langList}${fwList}${presenceDesc}.`;
  const sentence2 = `It has ${metrics.totalFiles} files and approximately ${metrics.totalLines.toLocaleString()} lines of code, making it a ${sizeDesc} codebase (complexity score: ${score}/100).`;
  const sentence3 = depth === "micro" ? "A focused micro spec will cover the essentials without overhead." : depth === "standard" ? "A standard spec provides a balanced level of documentation for this scope." : "A full 3-spec decomposition (product + technical + quality) is recommended given the complexity.";
  return `${sentence1} ${sentence2} ${sentence3}`;
}
async function gatherMetrics(targetPath) {
  const SOURCE_EXTENSIONS = [
    "ts",
    "tsx",
    "js",
    "jsx",
    "mjs",
    "cjs",
    "py",
    "go",
    "rs",
    "rb",
    "java",
    "kt",
    "swift",
    "c",
    "cpp",
    "h",
    "hpp",
    "cs",
    "php"
  ];
  const TEST_PATTERNS2 = [
    "**/*.test.ts",
    "**/*.test.js",
    "**/*.test.tsx",
    "**/*.test.jsx",
    "**/*.spec.ts",
    "**/*.spec.js",
    "**/*.spec.tsx",
    "**/*.spec.jsx",
    "**/*.test.py",
    "**/test_*.py",
    "**/*_test.go",
    "**/*.test.rb"
  ];
  const IGNORE_PATTERNS = [
    "node_modules/**",
    "dist/**",
    "build/**",
    ".git/**",
    "coverage/**",
    ".next/**",
    ".nuxt/**",
    "__pycache__/**",
    "vendor/**",
    "target/**"
  ];
  const allFiles = await glob4("**/*", {
    cwd: targetPath,
    ignore: IGNORE_PATTERNS,
    nodir: true
  });
  const sourceGlobs = SOURCE_EXTENSIONS.map((ext) => `**/*.${ext}`);
  let sourceFiles = 0;
  for (const pattern of sourceGlobs) {
    const matches = await glob4(pattern, {
      cwd: targetPath,
      ignore: IGNORE_PATTERNS
    });
    sourceFiles += matches.length;
  }
  let testFiles = 0;
  for (const pattern of TEST_PATTERNS2) {
    const matches = await glob4(pattern, {
      cwd: targetPath,
      ignore: IGNORE_PATTERNS
    });
    testFiles += matches.length;
  }
  let totalBytes = 0;
  const sampleSize = Math.min(allFiles.length, 200);
  const sampleFiles = allFiles.slice(0, sampleSize);
  for (const file of sampleFiles) {
    try {
      const fileStat = await stat(path5.join(targetPath, file));
      totalBytes += fileStat.size;
    } catch {
    }
  }
  const scaleFactor = allFiles.length > sampleSize ? allFiles.length / sampleSize : 1;
  const estimatedTotalBytes = totalBytes * scaleFactor;
  const totalLines = Math.round(estimatedTotalBytes / 50);
  return {
    totalFiles: allFiles.length,
    totalLines,
    sourceFiles,
    testFiles,
    testCoverage: null
  };
}
async function scanProject(projectPath, scope) {
  const targetPath = scope ? path5.join(projectPath, scope) : projectPath;
  const techStack = await detectStack(targetPath);
  const architecture = await detectArchitecture(targetPath);
  const routes = await detectRoutes(targetPath, techStack);
  const docs = await detectDocs(targetPath);
  const testInfo = await detectTests(targetPath, techStack);
  const metrics = await gatherMetrics(targetPath);
  const mergedMetrics = {
    ...metrics,
    testFiles: testInfo.testFiles,
    testCoverage: null
  };
  const context = {
    techStack,
    architecture,
    routes,
    docs,
    metrics: mergedMetrics
  };
  return scoreComplexity(context);
}

export {
  scanProject
};

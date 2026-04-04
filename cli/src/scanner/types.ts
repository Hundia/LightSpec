// lsp/src/scanner/types.ts — Core types for brownfield scanner

export type ComplexityLevel = 'micro' | 'standard' | 'full';

export interface TechStack {
  languages: string[];          // ['typescript', 'javascript']
  frameworks: string[];         // ['react', 'express', 'nestjs']
  packageManager: string | null; // 'npm' | 'yarn' | 'pnpm' | 'bun' | null
  testFrameworks: string[];     // ['vitest', 'jest', 'pytest']
  buildTools: string[];         // ['vite', 'tsup', 'webpack']
}

export interface Architecture {
  pattern: 'monolith' | 'modular' | 'monorepo' | 'microservices' | 'unknown';
  entryPoints: string[];        // ['src/index.ts', 'src/main.ts']
  sourceDirectories: string[];  // ['src/', 'lib/', 'app/']
  hasApi: boolean;
  hasFrontend: boolean;
  hasDatabase: boolean;
}

export interface ProjectRoutes {
  routes: Array<{ method: string; path: string; file: string }>;
  framework: string | null;     // 'express' | 'fastify' | 'nestjs' | 'flask' | null
}

export interface ProjectDocs {
  readme: string | null;        // content of README.md (first 500 lines)
  existingSpecs: string[];      // paths to any spec-like files found
  otherDocs: string[];          // paths to other doc files
}

export interface ProjectMetrics {
  totalFiles: number;
  totalLines: number;           // approximate, from wc-like count
  sourceFiles: number;
  testFiles: number;
  testCoverage: number | null;  // if detectable from config
}

export interface BrownfieldContext {
  techStack: TechStack;
  architecture: Architecture;
  routes: ProjectRoutes;
  docs: ProjectDocs;
  metrics: ProjectMetrics;
}

export interface ScanResult {
  context: BrownfieldContext;
  suggestedDepth: ComplexityLevel;
  complexityScore: number;      // 0-100
  summary: string;              // human-readable 2-3 sentence summary
  reasoning: string;            // why this depth was chosen
}

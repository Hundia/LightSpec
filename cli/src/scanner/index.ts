/**
 * LightSpec Scanner — barrel export
 * All brownfield detection modules.
 */

export { detectStack } from './detect-stack.js';
export { detectArchitecture } from './detect-architecture.js';
export { detectTests } from './detect-tests.js';
export { detectRoutes } from './detect-routes.js';
export { detectDocs } from './detect-docs.js';
export type {
  ComplexityLevel,
  TechStack,
  Architecture,
  ProjectRoutes,
  ProjectDocs,
  ProjectMetrics,
  BrownfieldContext,
  ScanResult,
} from './types.js';

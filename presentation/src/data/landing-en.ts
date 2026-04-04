export const NAV_LINKS = [
  { label: 'Problem', href: '#problem' },
  { label: 'Features', href: '#features' },
  { label: 'Quick Start', href: '#quickstart' },
];

export const QUICKSTART_TERMINAL_LINES = [
  { text: '$ npx lightspec init', type: 'command' },
  { text: '', type: 'blank' },
  { text: 'Scanning project... done (0.8s)', type: 'info' },
  { text: 'Detected: TypeScript + React + Express', type: 'result' },
  { text: 'Complexity: 42/100 → Standard depth', type: 'result' },
  { text: '', type: 'blank' },
  { text: 'Generating spec... done (38s)', type: 'info' },
  { text: '', type: 'blank' },
  { text: 'Created:', type: 'success' },
  { text: '  .lsp/spec.md     (847 lines)', type: 'success' },
  { text: '  .lsp/tasks.md    (12 tasks)', type: 'success' },
  { text: '  .lsp/.meta.json', type: 'success' },
  { text: '', type: 'blank' },
  { text: 'Next: lsp status | lsp graduate', type: 'highlight' },
];

export const QUICKSTART_STEPS = [
  { n: '1', icon: 'Search', label: 'Scan', desc: 'lsp detects your tech stack, architecture, and complexity automatically' },
  { n: '2', icon: 'Zap', label: 'Generate', desc: 'LLM generates exactly the right amount of spec for your project' },
  { n: '3', icon: 'Rocket', label: 'Ship', desc: 'Use lsp status to track tasks, lsp graduate when ready to scale up' },
];

export const COMPARISON_FEATURES = [
  { feature: 'Generation time', lsp: '< 60 seconds', autospec: '30+ minutes' },
  { feature: 'Spec files', lsp: '1–3', autospec: '10' },
  { feature: 'Adaptive depth', lsp: true, autospec: false },
  { feature: 'Brownfield scanner', lsp: true, autospec: false },
  { feature: 'Graduation path', lsp: true, autospec: '(destination)' },
  { feature: 'Role-based specs', lsp: false, autospec: true },
  { feature: 'Full ceremony', lsp: false, autospec: true },
  { feature: 'Best for', lsp: 'Most projects', autospec: 'Complex systems' },
];

export const LINE_COLORS: Record<string, string> = {
  command: 'text-white font-bold',
  blank: '',
  info: 'text-white/60',
  result: 'text-cyan-300/80',
  highlight: 'text-amber-300 font-semibold',
  success: 'text-green-400',
};

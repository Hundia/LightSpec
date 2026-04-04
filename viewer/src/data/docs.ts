// Static doc manifests — maps sections to files
// Pages will import markdown using fetch from public/docs/

export interface DocEntry {
  slug: string
  title: string
  section: string
}

export const docsManifest: DocEntry[] = [
  // CLI
  { slug: '01_philosophy', title: 'Philosophy', section: 'cli' },
  { slug: '02_architecture', title: 'Architecture', section: 'cli' },
  { slug: '03_scanner', title: 'Scanner', section: 'cli' },
  { slug: '04_adaptive_depth', title: 'Adaptive Depth', section: 'cli' },
  { slug: '05_prompts', title: 'Prompt Templates', section: 'cli' },
  { slug: '06_graduation_path', title: 'Graduation Path', section: 'cli' },
  // Presentation
  { slug: '01_overview', title: 'Overview', section: 'presentation' },
  // Viewer
  { slug: '01_overview', title: 'Overview', section: 'viewer' },
  // Deployment
  { slug: '01_github_pages', title: 'GitHub Pages', section: 'deployment' },
]

export const sections = ['cli', 'presentation', 'viewer', 'deployment'] as const
export type DocSection = typeof sections[number]

export const sectionLabels: Record<DocSection, string> = {
  cli: 'CLI',
  presentation: 'Presentation',
  viewer: 'Viewer',
  deployment: 'Deployment',
}

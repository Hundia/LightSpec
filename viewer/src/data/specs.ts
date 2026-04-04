export interface SpecEntry {
  slug: string
  number: string
  title: string
  owner: string
  description: string
}

export const specsManifest: SpecEntry[] = [
  { slug: '01_product_manager', number: '01', title: 'Product Manager', owner: 'PM', description: 'Vision: just enough spec just fast enough — 4 personas, MoSCoW, adaptive depth goals' },
  { slug: '02_backend_lead', number: '02', title: 'Backend Lead', owner: 'Backend', description: 'CLI architecture: scanner/, pipeline/, commands/, providers/ (local), tsup, vitest' },
  { slug: '03_frontend_lead', number: '03', title: 'Frontend Lead', owner: 'Frontend', description: 'Two front-ends: presentation/ (dark slate+amber) + viewer/ (warm palette), 16 slides, 10 pages' },
  { slug: '04_db_architect', number: '04', title: 'DB Architect', owner: 'DB', description: 'File-based: .lsp/ output — spec.md, tasks.md, .meta.json schema' },
  { slug: '05_qa_lead', number: '05', title: 'QA Lead', owner: 'QA', description: '81+ tests, vitest, fixture integration tests, E2E on /opt/LightSpec/' },
  { slug: '06_devops_lead', number: '06', title: 'DevOps Lead', owner: 'DevOps', description: 'npm publish lightspec, GitHub Actions CI + Pages, presentation at root + viewer at /viewer/' },
  { slug: '07_marketing_lead', number: '07', title: 'Marketing Lead', owner: 'Marketing', description: 'lsp init in any repo — positioning, Product Hunt, AutoSpec family entry point' },
  { slug: '08_finance_lead', number: '08', title: 'Finance Lead', owner: 'Finance', description: 'MIT license, GitHub free tier, npm free tier, sponsorship path' },
  { slug: '09_business_lead', number: '09', title: 'Business Lead', owner: 'Business', description: 'Differentiation from AutoSpec (60s vs 30min), graduation path as upsell, 200+ stars goal' },
  { slug: '10_ui_designer', number: '10', title: 'UI Designer', owner: 'Design', description: 'Dark system (slate-950/amber) for presentation, warm palette (#f5f3ed/sage) for viewer' },
]

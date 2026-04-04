import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { DocsPage } from './pages/DocsPage'
import { SpecsPage } from './pages/SpecsPage'
import { BacklogPage } from './pages/BacklogPage'
import { SkillsPage } from './pages/SkillsPage'
import { DesignSystemPage } from './pages/DesignSystemPage'
import { SprintPage } from './pages/SprintPage'
import { SprintsListPage } from './pages/SprintsListPage'
import { QuickStartPage } from './pages/QuickStartPage'
import { LspPage } from './pages/LspPage'
import PresentationPage from './pages/PresentationPage'

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/docs/:section/:slug" element={<DocsPage />} />
          <Route path="/specs/:slug" element={<SpecsPage />} />
          <Route path="/backlog" element={<BacklogPage />} />
          <Route path="/sprints" element={<SprintsListPage />} />
          <Route path="/sprint/:id" element={<SprintPage />} />
          <Route path="/skills/:slug" element={<SkillsPage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
          <Route path="/quickstart" element={<QuickStartPage />} />
          <Route path="/lsp" element={<LspPage />} />
          <Route path="/presentation" element={<PresentationPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}

import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, List, BookOpen, Zap, Palette, ChevronDown, ChevronRight, Layers, Rocket, Monitor } from 'lucide-react'
import { backlogData } from '../../data/backlog'

const statusEmoji: Record<string, string> = {
  done: '✅',
  'in-progress': '🔄',
  todo: '🔲',
  blocked: '⏸️',
  qa: '🧪',
}

const mainNavItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/docs/cli/01_philosophy', label: 'Docs', icon: BookOpen },
  { to: '/specs/01_product_manager', label: 'Specs', icon: FileText },
  { to: '/backlog', label: 'Backlog', icon: List },
]

const bottomNavItems = [
  { to: '/quickstart', label: 'Quick Start', icon: Rocket },
  { to: '/skills/sprint-run', label: 'Skills', icon: Zap },
  { to: '/lsp', label: 'LightSpec', icon: Zap },
  { to: '/presentation', label: 'Presentation', icon: Monitor },
  { to: '/design-system', label: 'Design System', icon: Palette },
]

const externalNavItems = [
  { href: 'https://hundia.github.io/LightSpec/guide/', label: 'Guide', icon: BookOpen },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
    isActive
      ? 'bg-sage text-cream font-medium'
      : 'text-charcoal hover:bg-sand-200 hover:text-sage-700',
  ].join(' ')

export const Sidebar: React.FC = () => {
  const [sprintsOpen, setSprintsOpen] = useState(true)
  const location = useLocation()
  const isSprintRoute = location.pathname.startsWith('/sprint')

  return (
    <aside className="w-60 bg-cream border-r border-sand flex-shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-sand">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sage rounded-lg flex items-center justify-center">
            <span className="text-cream text-sm font-bold">L</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-charcoal">LightSpec</div>
            <div className="text-xs text-sand-600">SDD Framework</div>
          </div>
        </div>
      </div>
      <nav className="p-4 space-y-1">
        {mainNavItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={navLinkClass}>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        {/* Collapsible Sprints Section */}
        <div>
          <button
            onClick={() => setSprintsOpen(!sprintsOpen)}
            className={[
              'flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
              isSprintRoute
                ? 'text-sage-700 font-medium bg-sand-200/50'
                : 'text-charcoal hover:bg-sand-200 hover:text-sage-700',
            ].join(' ')}
          >
            <div className="flex items-center gap-3">
              <Layers size={16} />
              <span>Sprints</span>
            </div>
            {sprintsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {sprintsOpen && (
            <div className="ml-4 mt-1 space-y-0.5 border-l border-sand pl-2">
              {backlogData.map(sprint => (
                <NavLink
                  key={sprint.number}
                  to={`/sprint/${sprint.number}`}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all duration-200',
                      isActive
                        ? 'bg-sage text-cream font-medium'
                        : 'text-sand-700 hover:bg-sand-200 hover:text-charcoal',
                    ].join(' ')
                  }
                >
                  <span className="text-[10px]">{statusEmoji[sprint.status] || '🔲'}</span>
                  <span className="truncate">S{sprint.number} · {sprint.theme}</span>
                </NavLink>
              ))}
              <NavLink
                to="/sprints"
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all duration-200 font-medium',
                    isActive
                      ? 'bg-sage text-cream'
                      : 'text-sage-700 hover:bg-sand-200',
                  ].join(' ')
                }
              >
                All Sprints →
              </NavLink>
            </div>
          )}
        </div>

        {bottomNavItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={navLinkClass}>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        {externalNavItems.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-charcoal hover:bg-sand-200 hover:text-sage-700"
          >
            <Icon size={16} />
            {label}
          </a>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sand">
        <div className="text-xs text-sand-600 text-center">v0.1.0 · MIT License</div>
      </div>
    </aside>
  )
}

import React from 'react'
import { useLocation } from 'react-router-dom'

const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/backlog': 'Backlog',
  '/design-system': 'Design System',
  '/lsp': 'LightSpec',
  '/presentation': 'Presentation',
}

function getTitle(pathname: string): string {
  if (routeLabels[pathname]) return routeLabels[pathname]
  if (pathname.startsWith('/docs/')) return 'Documentation'
  if (pathname.startsWith('/specs/')) return 'Specifications'
  if (pathname.startsWith('/skills/')) return 'Skills'
  if (pathname.startsWith('/sprint/')) return 'Sprint Detail'
  return 'LightSpec'
}

export const Header: React.FC = () => {
  const location = useLocation()
  const title = getTitle(location.pathname)

  return (
    <header className="h-14 bg-parchment border-b border-sand px-6 flex items-center justify-between flex-shrink-0">
      <h1 className="text-base font-semibold text-charcoal">{title}</h1>
      <div className="flex items-center gap-2">
        <span className="text-xs text-sand-600 font-mono">LightSpec v0.1.0</span>
      </div>
    </header>
  )
}

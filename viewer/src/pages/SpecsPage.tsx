import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../components/primitives/Card'
import { specsManifest } from '../data/specs'

const ownerColors: Record<string, string> = {
  PM: 'bg-sage-100 text-sage-700',
  Backend: 'bg-blue-100 text-blue-700',
  Frontend: 'bg-purple-100 text-purple-700',
  UI: 'bg-pink-100 text-pink-700',
  DB: 'bg-amber-100 text-amber-700',
  QA: 'bg-red-100 text-red-700',
  DevOps: 'bg-green-100 text-green-700',
  Marketing: 'bg-orange-100 text-orange-700',
  Finance: 'bg-teal-100 text-teal-700',
  Business: 'bg-indigo-100 text-indigo-700',
  Design: 'bg-rose-100 text-rose-700',
}

export const SpecsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [view, setView] = useState<'grid' | 'detail'>(slug ? 'detail' : 'grid')

  const selectedSpec = slug ? specsManifest.find(s => s.slug === slug) : null

  if (selectedSpec && view === 'detail') {
    return (
      <div className="max-w-4xl">
        <button
          onClick={() => { navigate('/specs/01_product_manager'); setView('grid') }}
          className="text-sm text-sage hover:text-sage-600 mb-4 flex items-center gap-1"
        >
          ← All Specs
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-sage rounded-lg flex items-center justify-center text-cream font-bold">
            {selectedSpec.number}
          </div>
          <div>
            <h2 className="text-xl font-medium text-charcoal">{selectedSpec.title}</h2>
            <p className="text-sm text-sand-600">{selectedSpec.description}</p>
          </div>
          <div className="ml-auto">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${ownerColors[selectedSpec.owner] || 'bg-sand-200 text-charcoal'}`}>
              {selectedSpec.owner}
            </span>
          </div>
        </div>
        <Card>
          <CardContent>
            <p className="text-sm text-sand-600">
              Full spec content is stored at{' '}
              <code className="bg-sand-200 px-1.5 py-0.5 rounded font-mono text-xs">
                specs/{selectedSpec.slug}.md
              </code>
            </p>
            <p className="text-sm text-sand-600 mt-2">
              Read it in your editor or via the CLI: <code className="bg-sand-200 px-1.5 py-0.5 rounded font-mono text-xs">cat specs/{selectedSpec.slug}.md</code>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-charcoal">Role Specifications</h2>
        <p className="text-sm text-sand-600 mt-1">10 expert roles defining the LightSpec development team</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {specsManifest.map(spec => (
          <Card
            key={spec.slug}
            variant="outlined"
            hoverable
            clickable
            onClick={() => { navigate(`/specs/${spec.slug}`); setView('detail') }}
          >
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-sage rounded-lg flex items-center justify-center text-cream font-bold flex-shrink-0">
                  {spec.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-charcoal">{spec.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ownerColors[spec.owner] || 'bg-sand-200 text-charcoal'}`}>
                      {spec.owner}
                    </span>
                  </div>
                  <p className="text-xs text-sand-600 mt-1 line-clamp-2">{spec.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

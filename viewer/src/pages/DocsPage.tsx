import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../components/primitives/Card'
import { Input } from '../components/primitives/Input'
import { Search, ChevronRight } from 'lucide-react'
import { docsManifest, sectionLabels, type DocSection } from '../data/docs'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

async function loadDocContent(section: string, slug: string): Promise<string> {
  try {
    const res = await fetch(`./docs/${section}/${slug}.md`)
    if (res.ok) return res.text()
  } catch {
    // fallthrough to default message
  }
  return `# ${slug}\n\n*Content not available in this build.*\n\nThis doc is stored at \`docs/${section}/${slug}.md\` in the LightSpec repository.`
}

export const DocsPage: React.FC = () => {
  const { section = 'cli', slug = '01_philosophy' } = useParams<{ section: string; slug: string }>()
  const navigate = useNavigate()
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    loadDocContent(section, slug).then(c => {
      setContent(c)
      setLoading(false)
    })
  }, [section, slug])

  const filteredDocs = docsManifest.filter(d =>
    search === '' ||
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.slug.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = (Object.keys(sectionLabels) as DocSection[]).reduce(
    (acc, sec) => ({
      ...acc,
      [sec]: filteredDocs.filter(d => d.section === sec),
    }),
    {} as Record<DocSection, typeof filteredDocs>
  )

  const currentDoc = docsManifest.find(d => d.section === section && d.slug === slug)

  return (
    <div className="flex gap-6 h-full max-w-6xl">
      {/* Sidebar nav */}
      <aside className="w-56 flex-shrink-0">
        <div className="mb-4">
          <Input
            placeholder="Search docs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="sm"
            startAdornment={<Search size={14} />}
          />
        </div>
        <nav className="space-y-4">
          {(Object.keys(sectionLabels) as DocSection[]).map(sec => (
            <div key={sec}>
              <div className="text-xs font-semibold text-sand-600 uppercase tracking-wider mb-2">
                {sectionLabels[sec]}
              </div>
              <div className="space-y-1">
                {grouped[sec].map(doc => (
                  <button
                    key={doc.slug}
                    onClick={() => navigate(`/docs/${doc.section}/${doc.slug}`)}
                    className={[
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200',
                      section === doc.section && slug === doc.slug
                        ? 'bg-sage text-cream font-medium'
                        : 'text-charcoal hover:bg-sand-200',
                    ].join(' ')}
                  >
                    {doc.title}
                  </button>
                ))}
                {grouped[sec].length === 0 && (
                  <div className="text-xs text-sand-500 px-3 py-2">No results</div>
                )}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-sand-600 mb-4">
          <span>Docs</span>
          <ChevronRight size={12} />
          <span className="capitalize">{section}</span>
          <ChevronRight size={12} />
          <span>{currentDoc?.title || slug}</span>
        </div>

        <Card>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-3 py-4">
                <div className="h-8 bg-sand-200 rounded w-1/2" />
                <div className="h-4 bg-sand-200 rounded w-full" />
                <div className="h-4 bg-sand-200 rounded w-3/4" />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-light text-charcoal mb-4 pb-2 border-b border-sand">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-medium text-terracotta mt-6 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-semibold text-charcoal mt-4 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-sm text-charcoal leading-relaxed mb-3">{children}</p>,
                    code: ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
                      const { inline, ...rest } = props
                      return inline ? (
                        <code className="bg-sand-200 text-terracotta px-1.5 py-0.5 rounded font-mono text-xs" {...rest}>{children}</code>
                      ) : (
                        <code className="block bg-sand-200 p-4 rounded-lg font-mono text-xs overflow-x-auto mb-3" {...rest}>{children}</code>
                      )
                    },
                    pre: ({ children }) => <pre className="bg-sand-200 rounded-lg overflow-hidden mb-3">{children}</pre>,
                    ul: ({ children }) => <ul className="list-disc list-inside text-sm text-charcoal space-y-1 mb-3">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside text-sm text-charcoal space-y-1 mb-3">{children}</ol>,
                    li: ({ children }) => <li className="text-sm">{children}</li>,
                    table: ({ children }) => <div className="overflow-x-auto mb-3"><table className="w-full text-xs border-collapse">{children}</table></div>,
                    th: ({ children }) => <th className="text-left px-3 py-2 bg-sand-200 font-medium text-charcoal border border-sand">{children}</th>,
                    td: ({ children }) => <td className="px-3 py-2 border border-sand text-charcoal">{children}</td>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-sage pl-4 text-sand-700 italic mb-3">{children}</blockquote>,
                    a: ({ href, children }) => <a href={href} className="text-sage hover:text-sage-600 underline">{children}</a>,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

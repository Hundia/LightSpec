import React, { useState } from 'react'
import { Terminal, Github, MousePointer, Package, ChevronDown, ChevronRight, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'

interface Provider {
  id: string
  label: string
  icon: LucideIcon
  badge?: string
  bestFor: string
  borderColor: string
  steps: { title: string; code?: string; description?: string }[]
  note?: string
}

const providers: Provider[] = [
  {
    id: 'claude',
    label: 'Claude Code',
    icon: Terminal,
    badge: 'Recommended',
    bestFor: 'developers who use Claude Code CLI',
    borderColor: 'border-sage',
    steps: [
      {
        title: 'Install LightSpec',
        code: 'npm install -g lightspec',
      },
      {
        title: 'Run in your project',
        code: 'cd my-project && lsp init',
      },
      {
        title: 'View generated spec',
        code: 'cat .lsp/spec.md',
      },
    ],
    note: 'What happens: LightSpec scans your project, detects complexity, selects micro/standard/full depth, and generates a spec in ~60 seconds.',
  },
  {
    id: 'copilot',
    label: 'GitHub Copilot',
    icon: Github,
    bestFor: 'VS Code users with GitHub Copilot',
    borderColor: 'border-blue-400',
    steps: [
      {
        title: 'Install LightSpec',
        code: 'npm install -g lightspec',
      },
      {
        title: 'Scan your project',
        code: 'lsp scan --json > .lsp/context.json',
      },
      {
        title: 'Reference in Copilot Chat',
        description: 'Open VS Code and reference: #file:.lsp/spec.md in your Copilot Chat prompt',
      },
    ],
    note: 'LightSpec generates structured specs that Copilot can use as context for implementation.',
  },
  {
    id: 'cursor',
    label: 'Cursor / Windsurf',
    icon: MousePointer,
    bestFor: 'Cursor or Windsurf users',
    borderColor: 'border-amber-400',
    steps: [
      {
        title: 'Install and run',
        code: 'npm install -g lightspec && lsp init',
      },
      {
        title: 'Open spec in AI chat',
        description: 'Reference .lsp/spec.md in your Cursor/Windsurf AI chat: @.lsp/spec.md',
      },
      {
        title: 'Graduate when ready',
        code: 'lsp graduate',
      },
    ],
  },
  {
    id: 'cli',
    label: 'LightSpec CLI',
    icon: Package,
    bestFor: 'command-line users who want one-command generation',
    borderColor: 'border-purple-400',
    steps: [
      {
        title: 'Install',
        code: 'npm install -g lightspec',
      },
      {
        title: 'Scan (no LLM)',
        code: 'lsp scan',
      },
      {
        title: 'Generate spec',
        code: 'lsp init',
      },
      {
        title: 'Check status',
        code: 'lsp status',
      },
    ],
    note: 'Cost: ~$0.05–$0.20 per generation with Claude Sonnet (micro/standard depth)',
  },
]

const faqs = [
  {
    question: 'Do I need an API key?',
    answer:
      'LightSpec works with your existing Claude Code authentication. If you don\'t have Claude Code, set ANTHROPIC_API_KEY as an environment variable. Gemini CLI support is also available via GEMINI_API_KEY.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Micro depth: ~$0.05. Standard depth: ~$0.10–$0.20. Full depth (3 specs): ~$0.30–$0.60 with Claude Sonnet. The lsp scan command is completely free (no LLM calls).',
  },
  {
    question: 'What is the difference from AutoSpec?',
    answer:
      'LightSpec is the lightweight entry point — 60 seconds to a spec, zero config. AutoSpec is the full framework with 10 role specs, sprint backlog, and living documentation. Use lsp graduate to upgrade from LightSpec to AutoSpec.',
  },
  {
    question: 'What if generation gets interrupted?',
    answer:
      'The CLI is idempotent — re-running lsp init will regenerate the spec. The brownfield scanner is always re-run to ensure accuracy.',
  },
]

const whatYouGet = [
  {
    title: 'Adaptive Depth',
    description:
      'Micro (60s), Standard (2min), or Full (5min) spec depth — automatically selected based on your project complexity score.',
  },
  {
    title: 'Brownfield Intelligence',
    description:
      'Detects your existing stack, architecture, routes, tests, and docs BEFORE generating. No more generic specs.',
  },
  {
    title: 'Task Checklist',
    description:
      'Every spec includes a .lsp/tasks.md with actionable checklist items. Track progress with lsp status.',
  },
  {
    title: 'AutoSpec Graduation',
    description:
      'When your project grows, run lsp graduate to convert to a full 10-role AutoSpec structure.',
  },
]

export const QuickStartPage: React.FC = () => {
  const [expandedProvider, setExpandedProvider] = useState<string | null>('claude')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="max-w-4xl space-y-10">
      {/* Hero Section */}
      <div>
        <h2 className="text-3xl font-light text-terracotta">Get Started With LightSpec</h2>
        <p className="text-base text-charcoal mt-2">
          Turn your project into a structured spec in 60 seconds. No config, no boilerplate.
        </p>
        <div className="mt-4 p-4 bg-sand-200 rounded-lg border border-sand">
          <h3 className="text-sm font-semibold text-charcoal mb-1">How it works</h3>
          <p className="text-sm text-sand-600 leading-relaxed">
            LightSpec scans your project (stack, architecture, routes, tests), scores its complexity,
            and auto-selects micro/standard/full depth. Then it generates a structured spec using
            your actual codebase as context — not generic templates.
          </p>
        </div>
      </div>

      {/* What You Get */}
      <div>
        <h3 className="text-lg font-semibold text-charcoal mb-4">What You Get</h3>
        <div className="grid grid-cols-2 gap-4">
          {whatYouGet.map(item => (
            <Card key={item.title} variant="outlined">
              <CardContent className="py-4">
                <h4 className="text-sm font-semibold text-terracotta mb-1">{item.title}</h4>
                <p className="text-xs text-sand-600 leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Choose Your Path */}
      <div>
        <h3 className="text-lg font-semibold text-charcoal mb-4">Choose Your Path</h3>
        <div className="space-y-3">
          {providers.map(provider => {
            const Icon = provider.icon
            const isOpen = expandedProvider === provider.id
            return (
              <Card
                key={provider.id}
                className={`border-l-4 ${provider.borderColor} cursor-pointer transition-all duration-200`}
                onClick={() => setExpandedProvider(isOpen ? null : provider.id)}
              >
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-charcoal" />
                      <span className="text-sm font-semibold text-charcoal">{provider.label}</span>
                      {provider.badge && (
                        <Badge variant="done">{provider.badge}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-sand-600 hidden sm:block">
                        Best for: {provider.bestFor}
                      </span>
                      {isOpen ? (
                        <ChevronDown size={16} className="text-sand-600 flex-shrink-0" />
                      ) : (
                        <ChevronRight size={16} className="text-sand-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 space-y-3" onClick={e => e.stopPropagation()}>
                      <p className="text-xs text-sand-600">Best for: {provider.bestFor}</p>
                      {provider.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-sage text-cream text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-charcoal mb-1">{step.title}</div>
                            {step.code && (
                              <code className="block bg-charcoal text-cream text-xs px-3 py-2 rounded font-mono">
                                {step.code}
                              </code>
                            )}
                            {step.description && (
                              <p className="text-xs text-sand-600">{step.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      {provider.note && (
                        <div className="mt-3 p-3 bg-sand-200 rounded text-xs text-sand-600 border border-sand">
                          {provider.note}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h3 className="text-lg font-semibold text-charcoal mb-4">FAQ</h3>
        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <Card
                key={idx}
                variant="outlined"
                className="cursor-pointer"
                onClick={() => setOpenFaq(isOpen ? null : idx)}
              >
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-charcoal">{faq.question}</span>
                    {isOpen ? (
                      <ChevronDown size={16} className="text-sand-600 flex-shrink-0" />
                    ) : (
                      <ChevronRight size={16} className="text-sand-600 flex-shrink-0" />
                    )}
                  </div>
                  {isOpen && (
                    <p className="mt-2 text-xs text-sand-600 leading-relaxed">{faq.answer}</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

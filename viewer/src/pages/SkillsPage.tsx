import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { Zap, ArrowLeft } from 'lucide-react'

interface SkillInfo {
  id: string
  name: string
  description: string
  usage: string
  phases: string[]
  model: 'haiku' | 'sonnet' | 'opus'
}

const skillsData: SkillInfo[] = [
  {
    id: 'sprint-run',
    name: 'sprint-run',
    description: 'Execute an entire sprint end-to-end: plan → implement → QA → docs → close.',
    usage: '/sprint-run [sprint_number]',
    phases: ['Sprint Briefing', 'Ticket Execution', 'QA Verification', 'Documentation Update', 'Sprint Close', 'Final Report'],
    model: 'opus',
  },
  {
    id: 'execute-ticket',
    name: 'execute-ticket',
    description: 'Execute a single ticket from the backlog following SDD methodology.',
    usage: '/execute-ticket [ticket_number]',
    phases: ['Read backlog', 'Check dependencies', 'Read docs', 'Update status', 'Implement', 'QA', 'Docs'],
    model: 'sonnet',
  },
  {
    id: 'plan-sprint',
    name: 'plan-sprint',
    description: 'Plan a sprint from backlog tickets using multi-expert AI analysis.',
    usage: '/plan-sprint [sprint_number]',
    phases: ['Analyze tickets', 'Expert consultation', 'Risk assessment', 'Generate plan'],
    model: 'opus',
  },
  {
    id: 'sprint-status',
    name: 'sprint-status',
    description: 'Show current sprint progress with ticket statuses and burndown.',
    usage: '/sprint-status [sprint_number]',
    phases: ['Read backlog', 'Compute metrics', 'Format report'],
    model: 'haiku',
  },
  {
    id: 'sprint-close',
    name: 'sprint-close',
    description: 'Close a sprint: verify all tickets done, generate summary, tag release.',
    usage: '/sprint-close [sprint_number]',
    phases: ['Verify completeness', 'Generate summary', 'Create git tag', 'Update backlog'],
    model: 'sonnet',
  },
  {
    id: 'update-backlog',
    name: 'update-backlog',
    description: 'Update ticket statuses in the backlog.',
    usage: '/update-backlog [ticket_id] [status]',
    phases: ['Find ticket', 'Validate status', 'Update file'],
    model: 'haiku',
  },
  {
    id: 'create-spec',
    name: 'create-spec',
    description: 'Generate a spec file from an SRS or requirements document.',
    usage: '/create-spec [role]',
    phases: ['Parse requirements', 'Select role template', 'Generate spec', 'Write file'],
    model: 'sonnet',
  },
  {
    id: 'create-sprint-docs',
    name: 'create-sprint-docs',
    description: 'Create sprint documentation from backlog tickets.',
    usage: '/create-sprint-docs [sprint_number]',
    phases: ['Read sprint tickets', 'Generate brief', 'Write summary template'],
    model: 'haiku',
  },
  {
    id: 'qa-review',
    name: 'qa-review',
    description: 'Run QA verification protocol for a ticket or sprint.',
    usage: '/qa-review [ticket_id]',
    phases: ['Identify change type', 'Run tests', 'Verify user flow', 'Report results'],
    model: 'sonnet',
  },
  {
    id: 'help',
    name: 'help',
    description: 'List all available LightSpec commands with descriptions.',
    usage: '/help',
    phases: ['Read commands', 'Format list'],
    model: 'haiku',
  },
]

export const SkillsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const selectedSkill = slug ? skillsData.find(s => s.id === slug) : null

  if (selectedSkill) {
    return (
      <div className="max-w-3xl">
        <button
          onClick={() => navigate('/skills/sprint-run')}
          className="flex items-center gap-2 text-sm text-sage hover:text-sage-600 mb-4"
        >
          <ArrowLeft size={14} />
          All Skills
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-sage rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-cream" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-charcoal font-mono">/{selectedSkill.name}</h2>
            <p className="text-sm text-sand-600">{selectedSkill.description}</p>
          </div>
          <Badge variant={selectedSkill.model} className="ml-auto">{selectedSkill.model}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card variant="outlined">
            <CardHeader><CardTitle>Usage</CardTitle></CardHeader>
            <CardContent>
              <code className="font-mono text-sm text-sage-700 bg-sand-200 px-3 py-2 rounded block">
                {selectedSkill.usage}
              </code>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardHeader><CardTitle>Model</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={selectedSkill.model} size="lg">{selectedSkill.model}</Badge>
                <span className="text-sm text-sand-600">
                  {selectedSkill.model === 'opus' ? 'High complexity orchestration'
                    : selectedSkill.model === 'sonnet' ? 'Balanced speed + quality'
                    : 'Fast, low-cost operations'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader><CardTitle>Execution Phases</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {selectedSkill.phases.map((phase, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-sage text-cream text-xs flex items-center justify-center font-medium flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="text-sm text-charcoal">{phase}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Grid view
  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-charcoal">Skills</h2>
        <p className="text-sm text-sand-600 mt-1">10 Claude Code commands for Spec-Driven Development</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {skillsData.map(skill => (
          <Card
            key={skill.id}
            variant="outlined"
            hoverable
            clickable
            onClick={() => navigate(`/skills/${skill.id}`)}
          >
            <CardContent>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={14} className="text-sage flex-shrink-0" />
                    <code className="text-sm font-mono font-semibold text-charcoal">/{skill.name}</code>
                  </div>
                  <p className="text-xs text-sand-600 line-clamp-2">{skill.description}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {skill.phases.slice(0, 3).map((phase, i) => (
                      <span key={i} className="text-xs bg-sand-200 text-sand-700 px-2 py-0.5 rounded">
                        {phase}
                      </span>
                    ))}
                    {skill.phases.length > 3 && (
                      <span className="text-xs text-sand-500">+{skill.phases.length - 3}</span>
                    )}
                  </div>
                </div>
                <Badge variant={skill.model} size="sm">{skill.model}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

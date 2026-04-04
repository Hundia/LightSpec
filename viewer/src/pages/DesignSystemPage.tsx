import React, { useState } from 'react'
import { Button } from '../components/primitives/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { Input } from '../components/primitives/Input'
import { Search } from 'lucide-react'

const colors = [
  { name: 'parchment', hex: '#f5f3ed', cls: 'bg-parchment' },
  { name: 'cream', hex: '#faf9f5', cls: 'bg-cream' },
  { name: 'sage', hex: '#698472', cls: 'bg-sage' },
  { name: 'sage-600', hex: '#536a5b', cls: 'bg-sage-600' },
  { name: 'terracotta', hex: '#8e6a59', cls: 'bg-terracotta' },
  { name: 'sand', hex: '#d8d0ba', cls: 'bg-sand' },
  { name: 'sand-200', hex: '#e8e4d8', cls: 'bg-sand-200' },
  { name: 'charcoal', hex: '#1a1a1a', cls: 'bg-charcoal' },
]

export const DesignSystemPage: React.FC = () => {
  const [inputVal, setInputVal] = useState('')

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-light text-charcoal">Design System</h2>
        <p className="text-sm text-sand-600 mt-1">Warm palette — adapted from FitnessAiManager/Sivania</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Colors</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {colors.map(({ name, hex, cls }) => (
              <div key={name}>
                <div className={`h-16 rounded-lg ${cls} border border-sand mb-2`} />
                <div className="text-xs font-medium text-charcoal">{name}</div>
                <div className="text-xs text-sand-600 font-mono">{hex}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Buttons</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" loading>Loading</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Badges</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Badge variant="done">Done</Badge>
          <Badge variant="in-progress">In Progress</Badge>
          <Badge variant="todo">Todo</Badge>
          <Badge variant="blocked">Blocked</Badge>
          <Badge variant="qa">QA</Badge>
          <Badge variant="haiku">Haiku</Badge>
          <Badge variant="sonnet">Sonnet</Badge>
          <Badge variant="opus">Opus</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Cards</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <Card variant="default"><CardContent><p className="text-sm">Default</p></CardContent></Card>
          <Card variant="elevated"><CardContent><p className="text-sm">Elevated</p></CardContent></Card>
          <Card variant="outlined"><CardContent><p className="text-sm">Outlined</p></CardContent></Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <Input label="Default Input" placeholder="Enter text..." value={inputVal} onChange={e => setInputVal(e.target.value)} />
          <Input label="With Icon" placeholder="Search..." startAdornment={<Search size={16} />} />
          <Input label="Error State" error="This field is required" placeholder="Error..." />
          <Input label="Helper Text" helperText="Some helpful context" placeholder="With helper..." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Typography</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="text-3xl font-light text-charcoal">Display / Light</div>
          <div className="text-2xl font-normal text-charcoal">Heading / Normal</div>
          <div className="text-xl font-medium text-charcoal">Subheading / Medium</div>
          <div className="text-base text-charcoal">Body text — Inter, 16px regular</div>
          <div className="text-sm text-sand-600">Small text — muted, 14px</div>
          <div className="font-mono text-sm text-sage-700 bg-sand-200 px-3 py-2 rounded">code block — JetBrains Mono</div>
        </CardContent>
      </Card>
    </div>
  )
}

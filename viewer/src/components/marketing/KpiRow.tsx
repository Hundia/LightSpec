import React from 'react'
import { Card, CardContent } from '../primitives/Card'
import type { MarketingData } from '../../data/marketing'

// ─── Types ────────────────────────────────────────────────────────────────────

interface KpiRowProps {
  data: MarketingData
  launchLive: boolean
}

interface KpiStat {
  label: string
  value: number
  sub: string
  accent: string
}

// ─── KpiRow ───────────────────────────────────────────────────────────────────

export const KpiRow: React.FC<KpiRowProps> = ({ data, launchLive }) => {
  const postsReady = data.posts.filter(p => p.status === 'ready').length
  const postsDrafted = data.posts.filter(p => p.status === 'draft').length
  const milestonesDone = data.milestones.filter(m => m.done).length
  const articlesInProgress = data.articles.filter(a => a.status === 'ready').length

  // When launchLive is true, show a bonus count for ms-2 resolved
  const launchBonus = launchLive ? 1 : 0

  const stats: KpiStat[] = [
    {
      label: 'Posts Ready',
      value: postsReady,
      sub: 'of 5 posts',
      accent: '#698472',
    },
    {
      label: 'Posts Drafted',
      value: postsDrafted,
      sub: 'of 5 posts',
      accent: '#8e6a59',
    },
    {
      label: 'Milestones Done',
      value: milestonesDone + launchBonus,
      sub: `of ${data.milestones.length} milestones`,
      accent: '#698472',
    },
    {
      label: 'Articles In Progress',
      value: articlesInProgress,
      sub: 'of 5 articles',
      accent: '#8e6a59',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(stat => (
        <Card key={stat.label} variant="outlined">
          <CardContent className="py-4 flex flex-col items-center text-center">
            <div className="text-2xl font-light text-charcoal mb-0.5" style={{ color: stat.accent }}>
              {stat.value}
            </div>
            <div className="text-xs font-medium text-charcoal">{stat.label}</div>
            <div className="text-xs text-sand-600">{stat.sub}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default KpiRow

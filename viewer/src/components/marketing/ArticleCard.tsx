import React from 'react'
import { Card, CardContent } from '../primitives/Card'
import { Badge, BadgeVariant } from '../primitives/Badge'
import type { Article, PublishStatus } from '../../data/marketing'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArticleCardProps {
  article: Article
  isBlocked: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusBadgeVariant: Record<PublishStatus, BadgeVariant> = {
  ready: 'in-progress',
  draft: 'todo',
  published: 'done',
}

const statusLabel: Record<PublishStatus, string> = {
  ready: 'Ready',
  draft: 'Draft',
  published: 'Published',
}

const platformBadgeClass: Record<Article['platform'], string> = {
  'Dev.to': 'bg-blue-100 text-blue-700',
  'Hacker News': 'bg-orange-100 text-orange-700',
  'LinkedIn': 'bg-blue-900 text-blue-100',
  'Medium': 'bg-green-100 text-green-700',
}

// ─── ArticleCard ──────────────────────────────────────────────────────────────

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, isBlocked }) => {
  const effectiveVariant: BadgeVariant = isBlocked ? 'blocked' : statusBadgeVariant[article.status]
  const effectiveLabel = isBlocked ? 'Blocked' : statusLabel[article.status]

  return (
    <article>
      <Card variant="outlined" className={isBlocked ? 'opacity-70' : ''}>
        <CardContent className="p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${platformBadgeClass[article.platform]}`}>
                {article.platform}
              </span>
              <span className="text-xs text-sand-600">Week {article.week}</span>
              <span className="text-xs text-sand-600">{article.wordCount.toLocaleString()} words</span>
            </div>
            <Badge variant={effectiveVariant} size="sm">{effectiveLabel}</Badge>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-charcoal mb-3 leading-snug">
            {article.title}
          </h3>

          {/* Outline */}
          <ol className="space-y-1 mb-3">
            {article.outline.map((section, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-sand-600">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-sand-200 text-charcoal flex items-center justify-center text-[10px] font-medium mt-0.5">
                  {idx + 1}
                </span>
                <span>{section}</span>
              </li>
            ))}
          </ol>

          {/* blockedBy chips */}
          {article.blockedBy.length > 0 && (
            <div className="pt-3 border-t border-sand flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-sand-600">Blocked by:</span>
              {article.blockedBy.map(id => (
                <span key={id} className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                  {id}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </article>
  )
}

export default ArticleCard

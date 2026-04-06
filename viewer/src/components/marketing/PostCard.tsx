import React, { useState } from 'react'
import { Card, CardContent } from '../primitives/Card'
import { Badge, BadgeVariant } from '../primitives/Badge'
import type { LinkedInPost, PublishStatus } from '../../data/marketing'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PostCardProps {
  post: LinkedInPost
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

// ─── PostCard ────────────────────────────────────────────────────────────────

export const PostCard: React.FC<PostCardProps> = ({ post, isBlocked }) => {
  const [expanded, setExpanded] = useState(false)

  const effectiveVariant: BadgeVariant = isBlocked ? 'blocked' : statusBadgeVariant[post.status]
  const effectiveLabel = isBlocked ? 'Blocked' : statusLabel[post.status]

  return (
    <article>
      <Card variant="outlined" className={isBlocked ? 'opacity-70' : ''}>
        <CardContent className="p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-sand-200 text-terracotta">
                {post.arc}
              </span>
              <span className="text-xs text-sand-600">Week {post.week}</span>
            </div>
            <Badge variant={effectiveVariant} size="sm">{effectiveLabel}</Badge>
          </div>

          {/* Hook text */}
          <p className="text-base font-medium text-charcoal leading-snug mb-3">
            {post.hook}
          </p>

          {/* Body (collapsible) */}
          <div className={`text-sm text-sand-600 leading-relaxed overflow-hidden transition-all ${expanded ? '' : 'line-clamp-3'}`}>
            {post.body}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-xs text-sage hover:text-terracotta transition-colors font-medium"
          >
            {expanded ? 'Show less ↑' : 'Read more ↓'}
          </button>

          {/* Footer: tags + blockedBy */}
          <div className="mt-3 pt-3 border-t border-sand flex flex-wrap gap-1.5 items-center">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-sand-200 text-sand-700">
                {tag}
              </span>
            ))}
          </div>

          {post.blockedBy.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-sand-600">Blocked by:</span>
              {post.blockedBy.map(id => (
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

export default PostCard

import React from 'react'
import { Badge, BadgeVariant } from '../primitives/Badge'
import type { Channel } from '../../data/marketing'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChannelRowProps {
  channel: Channel
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const priorityVariant: Record<Channel['priority'], BadgeVariant> = {
  high: 'done',
  medium: 'in-progress',
  low: 'todo',
}

const priorityLabel: Record<Channel['priority'], string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

const typeLabel: Record<Channel['type'], string> = {
  social: 'Social',
  community: 'Community',
  directory: 'Directory',
  blog: 'Blog',
}

const typeClass: Record<Channel['type'], string> = {
  social: 'bg-blue-100 text-blue-700',
  community: 'bg-purple-100 text-purple-700',
  directory: 'bg-orange-100 text-orange-700',
  blog: 'bg-green-100 text-green-700',
}

const MAX_NOTES = 80

// ─── ChannelRow ───────────────────────────────────────────────────────────────

export const ChannelRow: React.FC<ChannelRowProps> = ({ channel }) => {
  const truncatedNotes =
    channel.notes.length > MAX_NOTES
      ? channel.notes.slice(0, MAX_NOTES) + '…'
      : channel.notes

  return (
    <tr className="border-b border-sand/50 hover:bg-sand-200/30 transition-colors">
      <td className="py-3 px-4 text-sm font-medium text-charcoal">{channel.name}</td>
      <td className="py-3 px-4">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeClass[channel.type]}`}>
          {typeLabel[channel.type]}
        </span>
      </td>
      <td className="py-3 px-4">
        <Badge variant={priorityVariant[channel.priority]} size="sm">
          {priorityLabel[channel.priority]}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sm text-charcoal text-center">{channel.plannedPosts}</td>
      <td className="py-3 px-4 text-xs text-sand-600 max-w-xs" title={channel.notes}>
        {truncatedNotes}
      </td>
    </tr>
  )
}

export default ChannelRow

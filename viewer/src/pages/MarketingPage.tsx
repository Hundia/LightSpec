import React, { useState, useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import { Badge } from '../components/primitives/Badge'
import { Card, CardContent } from '../components/primitives/Card'
import { PostCard } from '../components/marketing/PostCard'
import { ArticleCard } from '../components/marketing/ArticleCard'
import { MilestoneCard } from '../components/marketing/MilestoneCard'
import { ChannelRow } from '../components/marketing/ChannelRow'
import { KpiRow } from '../components/marketing/KpiRow'
import { NextActionCard } from '../components/marketing/NextActionCard'
import { marketingData, resolveBlockers } from '../data/marketing'
import type { MarketingData } from '../data/marketing'

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'posts' | 'articles' | 'milestones' | 'channels'
type PostFilter = 'all' | 'ready' | 'draft' | 'blocked'
type ArticleFilter = 'all' | 'ready' | 'draft' | 'blocked'

const tabs: { id: TabId; label: string }[] = [
  { id: 'posts', label: 'Posts' },
  { id: 'articles', label: 'Articles' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'channels', label: 'Channels' },
]

// ─── MarketingPage ────────────────────────────────────────────────────────────

export const MarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('posts')
  const [launchLive, setLaunchLive] = useState(false)
  const [postFilter, setPostFilter] = useState<PostFilter>('all')
  const [articleFilter, setArticleFilter] = useState<ArticleFilter>('all')

  // Local milestone done state (allows toggle in-session without mutating seed)
  const [milestoneOverrides, setMilestoneOverrides] = useState<Record<string, boolean>>({})

  // Effective data merging overrides
  const effectiveData: MarketingData = useMemo(() => {
    const milestones = marketingData.milestones.map(m => ({
      ...m,
      done: milestoneOverrides[m.id] !== undefined ? milestoneOverrides[m.id] : m.done,
      // When launchLive, treat ms-2 as resolved for dependency purposes
    }))
    // When launchLive, treat ms-2 as done so downstream items unblock
    if (launchLive) {
      const idx = milestones.findIndex(m => m.id === 'ms-2')
      if (idx !== -1 && !milestones[idx].done) {
        milestones[idx] = { ...milestones[idx], done: true }
      }
    }
    return { ...marketingData, milestones }
  }, [milestoneOverrides, launchLive])

  const handleMilestoneToggle = (id: string) => {
    setMilestoneOverrides(prev => {
      const current = prev[id] !== undefined ? prev[id] : marketingData.milestones.find(m => m.id === id)?.done ?? false
      return { ...prev, [id]: !current }
    })
  }

  // ── Posts tab: filter + blocked resolution ───────────────────────────────
  const filteredPosts = useMemo(() => {
    return effectiveData.posts.filter(post => {
      const isBlocked = !resolveBlockers(effectiveData, post.id)
      if (postFilter === 'all') return true
      if (postFilter === 'ready') return post.status === 'ready' && !isBlocked
      if (postFilter === 'draft') return post.status === 'draft' && !isBlocked
      if (postFilter === 'blocked') return isBlocked
      return true
    })
  }, [effectiveData, postFilter])

  // ── Articles tab: filter + blocked resolution ────────────────────────────
  const filteredArticles = useMemo(() => {
    return effectiveData.articles.filter(article => {
      const isBlocked = !resolveBlockers(effectiveData, article.id)
      if (articleFilter === 'all') return true
      if (articleFilter === 'ready') return article.status === 'ready' && !isBlocked
      if (articleFilter === 'draft') return article.status === 'draft' && !isBlocked
      if (articleFilter === 'blocked') return isBlocked
      return true
    })
  }, [effectiveData, articleFilter])

  // ── Milestones: group by phase ───────────────────────────────────────────
  const milestonesByPhase = useMemo(() => {
    const phases: Array<'Pre-launch' | 'Launch' | 'Post-launch'> = ['Pre-launch', 'Launch', 'Post-launch']
    return phases.map(phase => ({
      phase,
      milestones: effectiveData.milestones.filter(m => m.phase === phase),
    }))
  }, [effectiveData])

  // ── Channels: priority sort ──────────────────────────────────────────────
  const sortedChannels = useMemo(() => {
    const order: Record<string, number> = { high: 0, medium: 1, low: 2 }
    return [...effectiveData.channels].sort((a, b) => order[a.priority] - order[b.priority])
  }, [effectiveData])

  // ── KPI data memo ────────────────────────────────────────────────────────
  const kpiData = useMemo(() => effectiveData, [effectiveData])

  // ── Phase label styles ────────────────────────────────────────────────────
  const phaseHeadingStyle: Record<string, string> = {
    'Pre-launch': 'text-slate-700',
    'Launch': 'text-sage',
    'Post-launch': 'text-terracotta',
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={22} style={{ color: '#698472' }} />
            <h2 className="text-2xl font-light text-charcoal">Launch Dashboard</h2>
            <Badge variant="in-progress" size="sm">Sprint 42</Badge>
          </div>
          <p className="text-sm text-sand-600">
            Marketing content pipeline — posts, articles, milestones, channels
          </p>
        </div>

        {/* Set Live toggle */}
        <div className="flex flex-col items-end flex-shrink-0">
          <button
            onClick={() => setLaunchLive(true)}
            disabled={launchLive}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
              launchLive
                ? 'bg-sage text-cream cursor-default'
                : 'bg-sand-200 text-charcoal hover:bg-sand-300'
            }`}
            style={launchLive ? { backgroundColor: '#698472' } : undefined}
          >
            {launchLive ? 'Live Mode Active (session only)' : 'Set Live (this session)'}
          </button>
          <span className="text-xs text-sand-500 mt-0.5">Resets on page refresh. No data is saved.</span>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <KpiRow data={kpiData} launchLive={launchLive} />

      {/* ── Next Action Card ── */}
      <NextActionCard
        data={effectiveData}
        launchLive={launchLive}
        overrideMilestones={milestoneOverrides}
      />

      {/* ── Tab navigation ── */}
      <div className="flex gap-1 bg-sand-200 rounded-xl p-1" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => {
              const idx = tabs.findIndex(t => t.id === activeTab)
              if (e.key === 'ArrowRight') setActiveTab(tabs[(idx + 1) % tabs.length].id)
              if (e.key === 'ArrowLeft') setActiveTab(tabs[(idx - 1 + tabs.length) % tabs.length].id)
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-cream shadow-subtle text-charcoal font-medium'
                : 'text-sand-600 hover:text-charcoal hover:bg-cream/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Posts ── */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'ready', 'draft', 'blocked'] as PostFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setPostFilter(f)}
                className={`px-3 py-1 text-xs rounded-full capitalize transition-all border ${
                  postFilter === f
                    ? 'bg-sage text-cream border-sage'
                    : 'bg-cream text-sand-600 border-sand hover:border-sage'
                }`}
                style={postFilter === f ? { backgroundColor: '#698472', borderColor: '#698472' } : undefined}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredPosts.length === 0 ? (
            <Card variant="outlined">
              <CardContent className="py-8 text-center text-sand-600 text-sm">
                No posts match this filter.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  isBlocked={!resolveBlockers(effectiveData, post.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Articles ── */}
      {activeTab === 'articles' && (
        <div className="space-y-4">
          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'ready', 'draft', 'blocked'] as ArticleFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setArticleFilter(f)}
                className={`px-3 py-1 text-xs rounded-full capitalize transition-all border ${
                  articleFilter === f
                    ? 'bg-sage text-cream border-sage'
                    : 'bg-cream text-sand-600 border-sand hover:border-sage'
                }`}
                style={articleFilter === f ? { backgroundColor: '#698472', borderColor: '#698472' } : undefined}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredArticles.length === 0 ? (
            <Card variant="outlined">
              <CardContent className="py-8 text-center text-sand-600 text-sm">
                No articles match this filter.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  isBlocked={!resolveBlockers(effectiveData, article.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Milestones ── */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          {milestonesByPhase.map(({ phase, milestones }) => (
            <div key={phase}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${phaseHeadingStyle[phase]}`}>
                {phase}
              </h3>
              <div className="space-y-2">
                {milestones.map(milestone => (
                  <MilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                    isBlocked={!resolveBlockers(effectiveData, milestone.id)}
                    onToggle={handleMilestoneToggle}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tab: Channels ── */}
      {activeTab === 'channels' && (
        <div>
          <Card variant="outlined" padding="none">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-sand-600 uppercase tracking-wider">Channel</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-sand-600 uppercase tracking-wider">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-sand-600 uppercase tracking-wider">Priority</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-sand-600 uppercase tracking-wider">Posts</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-sand-600 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody>
                {sortedChannels.map(channel => (
                  <ChannelRow key={channel.id} channel={channel} />
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  )
}

export default MarketingPage

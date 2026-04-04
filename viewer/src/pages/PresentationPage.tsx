import { ExternalLink, Play, Layers } from 'lucide-react';

export default function PresentationPage() {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-charcoal mb-2">Presentation</h1>
      <p className="text-stone-500 mb-8">The LightSpec interactive slide deck — 16 slides covering the spec paradox, adaptive depth, brownfield intelligence, and live demos.</p>

      <div className="bg-white border border-sand rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-sage/10 flex items-center justify-center flex-shrink-0">
            <Play className="w-6 h-6 text-sage" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-charcoal mb-1">LightSpec Presentation</h2>
            <p className="text-sm text-stone-500 mb-4">16 slides · EN/HE · Keyboard navigation · Framer Motion</p>
            <a
              href="/presentation/#/presentation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-lg text-sm font-medium hover:bg-sage-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Presentation
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white border border-sand rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-terracotta/10 flex items-center justify-center flex-shrink-0">
            <Layers className="w-6 h-6 text-terracotta" />
          </div>
          <div>
            <h2 className="font-semibold text-charcoal mb-1">Landing Page</h2>
            <p className="text-sm text-stone-500 mb-4">Marketing landing — hero, adaptive depth, brownfield, comparison, quickstart</p>
            <a
              href="/presentation/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/10 text-terracotta rounded-lg text-sm font-medium hover:bg-terracotta/20 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Landing Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

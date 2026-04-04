import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackgroundEffect from '../components/backgrounds/BackgroundEffects';
import { slidesEN } from '../data/slides-en';
import { slidesHE } from '../data/slides-he';

// Slide components
import TitleSlide from '../components/slides/TitleSlide';
import SpecOverkillSlide from '../components/slides/SpecOverkillSlide';
import ContextRotSlide from '../components/slides/ContextRotSlide';
import AdaptiveRigorSlide from '../components/slides/AdaptiveRigorSlide';
import ThreeDepthsSlide from '../components/slides/ThreeDepthsSlide';
import BrownfieldSlide from '../components/slides/BrownfieldSlide';
import ScannerDemoSlide from '../components/slides/ScannerDemoSlide';
import PipelineSlide from '../components/slides/PipelineSlide';
import SpeedComparisonSlide from '../components/slides/SpeedComparisonSlide';
import GraduationSlide from '../components/slides/GraduationSlide';
import FamilySlide from '../components/slides/FamilySlide';
import ClosingSlide from '../components/slides/ClosingSlide';
import LiveDemoSlide from '../components/slides/LiveDemoSlide';
import UseCasesSlide from '../components/slides/UseCasesSlide';
import ArchitectureSlide from '../components/slides/ArchitectureSlide';
import StatsSlide from '../components/slides/StatsSlide';

const slideComponents: Record<string, React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>> = {
  title: TitleSlide as React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>,
  specOverkill: SpecOverkillSlide as React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>,
  contextRot: ContextRotSlide as React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>,
  adaptiveRigor: AdaptiveRigorSlide as React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>,
  threeDepths: ThreeDepthsSlide as React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>,
  brownfield: BrownfieldSlide as React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>,
  scannerDemo: ScannerDemoSlide as React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>,
  pipeline: PipelineSlide as React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>,
  speedComparison: SpeedComparisonSlide as React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>,
  graduation: GraduationSlide as React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>,
  family: FamilySlide as React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>,
  closing: ClosingSlide as React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>,
  liveDemo: LiveDemoSlide as React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>,
  useCases: UseCasesSlide as React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>,
  architecture: ArchitectureSlide as React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>,
  stats: StatsSlide as React.ComponentType<{ data: unknown; lang: 'en' | 'he' }>,
};

export default function PresentationPage() {
  const [lang, setLang] = useState<'en' | 'he'>('en');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const slides = lang === 'en' ? slidesEN : slidesHE;
  const isRTL = lang === 'he';

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (isRTL) prevSlide(); else nextSlide();
      } else if (e.key === 'ArrowLeft') {
        if (isRTL) nextSlide(); else prevSlide();
      } else if (e.key === ' ') {
        e.preventDefault();
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isRTL]);

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -80 }),
  };

  const currentSlideData = slides[currentSlide];
  const SlideComponent = slideComponents[currentSlideData.type];

  // Background rotation based on slide index
  const bgIds = ['lightning', 'particles', 'circuits', 'hex', 'gradient', 'lightning', 'particles', 'circuits', 'hex', 'gradient', 'lightning', 'particles', 'circuits', 'hex', 'gradient', 'lightning'];
  const bgId = bgIds[currentSlide % bgIds.length];

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen overflow-hidden"
    >
      <style>{`@keyframes floatingGrid { 0% { background-position: 0 0; } 100% { background-position: 40px 40px; } }`}</style>

      <BackgroundEffect activeId={bgId} />

      {/* Back to Home */}
      <Link
        to="/"
        className={`fixed top-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm ${isRTL ? 'right-4' : 'left-4'}`}
      >
        <Home size={16} />
        <span>Home</span>
      </Link>

      {/* Language toggle */}
      <div className={`fixed top-4 z-50 ${isRTL ? 'left-4' : 'right-4'}`}>
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm"
          >
            <Globe size={14} />
            <span>{lang === 'en' ? 'EN' : 'עב'}</span>
          </button>
          {showLangMenu && (
            <div className="absolute top-full mt-2 right-0 bg-slate-800 border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
              {['en', 'he'].map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l as 'en' | 'he'); setShowLangMenu(false); }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${lang === l ? 'text-amber-400' : 'text-white/70'}`}
                >
                  {l === 'en' ? 'English' : 'עברית'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Slide counter */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 text-sm text-white/50 font-mono">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Main content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${lang}-${currentSlide}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="min-h-screen flex items-center justify-center p-8 relative z-10"
        >
          {SlideComponent ? (
            <SlideComponent data={currentSlideData} lang={lang} />
          ) : (
            <div className="text-white/50 text-xl">Slide not found: {currentSlideData.type}</div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors"
        >
          {isRTL ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
        </button>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setDirection(idx > currentSlide ? 1 : -1); setCurrentSlide(idx); }}
              className={`rounded-full transition-all ${
                idx === currentSlide
                  ? 'bg-amber-500 w-6 sm:w-8 h-2'
                  : 'bg-white/25 hover:bg-white/40 w-2 h-2'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors"
        >
          {isRTL ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>
      </div>

      {/* Trademark */}
      <div className={`fixed bottom-4 text-xs text-white/50 z-50 ${isRTL ? 'right-4' : 'left-4'}`}>
        LightSpec™ — AutoSpec Family
      </div>

      {/* Keyboard hint */}
      <div className={`fixed bottom-4 text-xs text-white/50 z-50 ${isRTL ? 'left-4' : 'right-4'}`}>
        ← → to navigate
      </div>
    </div>
  );
}

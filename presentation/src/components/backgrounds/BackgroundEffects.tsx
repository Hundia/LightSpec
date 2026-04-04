import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// ─── 1. Particle Field ──────────────────────────────────────────────
const ParticleField: React.FC = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        duration: 15 + Math.random() * 25,
        delay: Math.random() * -20,
        dx: (Math.random() - 0.5) * 200,
        dy: (Math.random() - 0.5) * 200,
      })),
    [],
  );
  return (
    <svg className="absolute inset-0 w-full h-full">
      {particles.map((p) => (
        <motion.circle
          key={p.id}
          cx={`${p.x}%`}
          cy={`${p.y}%`}
          r={p.size}
          fill="white"
          opacity={0.15 + Math.random() * 0.25}
          animate={{ cx: [`${p.x}%`, `${p.x + p.dx / 5}%`, `${p.x}%`], cy: [`${p.y}%`, `${p.y + p.dy / 5}%`, `${p.y}%`] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          style={{ willChange: 'transform' }}
        />
      ))}
    </svg>
  );
};

// ─── 2. Circuit Lines ───────────────────────────────────────────────
const CircuitLines: React.FC = () => {
  const lines = useMemo(
    () => [
      { x1: 0, y1: '15%', x2: '100%', y2: '15%', d: 8 },
      { x1: 0, y1: '35%', x2: '100%', y2: '35%', d: 12 },
      { x1: 0, y1: '55%', x2: '100%', y2: '55%', d: 10 },
      { x1: 0, y1: '75%', x2: '100%', y2: '75%', d: 14 },
      { x1: '10%', y1: 0, x2: '10%', y2: '100%', d: 11 },
      { x1: '30%', y1: 0, x2: '30%', y2: '100%', d: 13 },
      { x1: '50%', y1: 0, x2: '50%', y2: '100%', d: 7 },
      { x1: '70%', y1: 0, x2: '70%', y2: '100%', d: 15 },
      { x1: '90%', y1: 0, x2: '90%', y2: '100%', d: 10 },
    ],
    [],
  );
  return (
    <>
      <style>{`
        @keyframes circuitPulse {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
      <svg className="absolute inset-0 w-full h-full">
        {lines.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="rgba(245,158,11,0.08)"
            strokeWidth={0.5}
          />
        ))}
        {lines.map((l, i) => (
          <line
            key={`pulse-${i}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="rgba(245,158,11,0.4)"
            strokeWidth={1}
            strokeDasharray="20 980"
            style={{
              animation: `circuitPulse ${l.d}s linear infinite`,
              animationDelay: `${-i * 1.3}s`,
            }}
          />
        ))}
        {[
          ['10%', '15%'], ['30%', '35%'], ['50%', '55%'], ['70%', '75%'],
          ['30%', '15%'], ['50%', '35%'], ['70%', '55%'], ['90%', '75%'],
        ].map(([cx, cy], i) => (
          <circle key={`dot-${i}`} cx={cx} cy={cy} r={2.5} fill="rgba(245,158,11,0.2)" />
        ))}
      </svg>
    </>
  );
};

// ─── 3. Gradient Pulse ──────────────────────────────────────────────
const GradientPulse: React.FC = () => (
  <>
    <style>{`
      @keyframes gradientPulse {
        0% { background-position: 0% 0%; }
        25% { background-position: 100% 0%; }
        50% { background-position: 100% 100%; }
        75% { background-position: 0% 100%; }
        100% { background-position: 0% 0%; }
      }
    `}</style>
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(45deg, rgba(245,158,11,0.12), rgba(251,191,36,0.1), rgba(105,132,114,0.1), rgba(245,158,11,0.08), rgba(245,158,11,0.12))',
        backgroundSize: '400% 400%',
        animation: 'gradientPulse 15s ease infinite',
      }}
    />
  </>
);

// ─── 4. Lightning Streaks ────────────────────────────────────────────
const LightningStreaks: React.FC = () => {
  const streaks = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        top: `${10 + i * 10}%`,
        width: 100 + Math.random() * 200,
        duration: 3 + Math.random() * 5,
        delay: Math.random() * -10,
        opacity: 0.15 + Math.random() * 0.25,
        angle: -5 + Math.random() * 10,
      })),
    [],
  );

  return (
    <>
      <style>{`
        @keyframes streakMove {
          0% { transform: translateX(-100%) rotate(var(--angle)); opacity: 0; }
          10% { opacity: var(--max-opacity); }
          90% { opacity: var(--max-opacity); }
          100% { transform: translateX(110vw) rotate(var(--angle)); opacity: 0; }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden">
        {streaks.map((s) => (
          <div
            key={s.id}
            className="absolute"
            style={{
              top: s.top,
              left: 0,
              height: '1px',
              width: `${s.width}px`,
              background: `linear-gradient(90deg, transparent, rgba(245,158,11,${s.opacity}), transparent)`,
              animation: `streakMove ${s.duration}s linear infinite`,
              animationDelay: `${s.delay}s`,
              '--angle': `${s.angle}deg`,
              '--max-opacity': s.opacity,
              willChange: 'transform',
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
};

// ─── 5. Hex Grid ────────────────────────────────────────────────────
const HexGrid: React.FC = () => {
  const hexagons = useMemo(() => {
    const result: { cx: number; cy: number; pulseDelay: number }[] = [];
    const size = 40;
    const h = size * Math.sqrt(3);
    for (let row = -1; row < 15; row++) {
      for (let col = -1; col < 25; col++) {
        const cx = col * size * 1.5;
        const cy = row * h + (col % 2 === 0 ? 0 : h / 2);
        result.push({ cx, cy, pulseDelay: Math.random() * 8 });
      }
    }
    return result;
  }, []);

  const hexPath = (cx: number, cy: number, r: number) => {
    const points = [];
    for (let a = 0; a < 6; a++) {
      const angle = (Math.PI / 3) * a - Math.PI / 6;
      points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return points.join(' ');
  };

  return (
    <>
      <style>{`
        @keyframes hexPulse {
          0%, 100% { opacity: 0.04; }
          50% { opacity: 0.15; }
        }
      `}</style>
      <svg className="absolute inset-0 w-full h-full">
        {hexagons.map((hex, i) => (
          <polygon
            key={i}
            points={hexPath(hex.cx, hex.cy, 18)}
            fill="none"
            stroke="rgba(245,158,11,0.15)"
            strokeWidth={0.5}
            style={{
              animation: `hexPulse ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${hex.pulseDelay}s`,
              willChange: 'opacity',
            }}
          />
        ))}
      </svg>
    </>
  );
};

// ─── Registry ───────────────────────────────────────────────────────
export const backgrounds = [
  { id: 'none', name: 'None', component: null },
  { id: 'particles', name: 'Particle Field', component: ParticleField },
  { id: 'circuits', name: 'Circuit Lines', component: CircuitLines },
  { id: 'gradient', name: 'Gradient Pulse', component: GradientPulse },
  { id: 'lightning', name: 'Lightning Streaks', component: LightningStreaks },
  { id: 'hex', name: 'Hex Grid', component: HexGrid },
] as const;

export type BackgroundId = (typeof backgrounds)[number]['id'];

export default function BackgroundEffect({ activeId }: { activeId: string }) {
  const bg = backgrounds.find((b) => b.id === activeId);
  if (!bg?.component) return null;
  const Comp = bg.component;
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ contain: 'strict' }}>
      <Comp />
    </div>
  );
}

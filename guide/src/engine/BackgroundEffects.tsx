import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const FloatingGrid: React.FC = () => (
  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px', animation: 'floatingGrid 20s linear infinite' }} />
);

const ParticleField: React.FC = () => {
  const particles = useMemo(() => Array.from({ length: 40 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: 1 + Math.random() * 2.5, duration: 15 + Math.random() * 25, delay: Math.random() * -20, dx: (Math.random() - 0.5) * 200, dy: (Math.random() - 0.5) * 200 })), []);
  return (
    <svg className="absolute inset-0 w-full h-full">
      {particles.map((p) => (
        <motion.circle key={p.id} cx={`${p.x}%`} cy={`${p.y}%`} r={p.size} fill="white" opacity={0.15 + Math.random() * 0.25}
          animate={{ cx: [`${p.x}%`, `${p.x + p.dx / 5}%`, `${p.x}%`], cy: [`${p.y}%`, `${p.y + p.dy / 5}%`, `${p.y}%`] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }} />
      ))}
    </svg>
  );
};

const CircuitLines: React.FC = () => {
  const lines = useMemo(() => [
    { x1: 0, y1: '15%', x2: '100%', y2: '15%', d: 8 }, { x1: 0, y1: '35%', x2: '100%', y2: '35%', d: 12 },
    { x1: 0, y1: '55%', x2: '100%', y2: '55%', d: 10 }, { x1: 0, y1: '75%', x2: '100%', y2: '75%', d: 14 },
    { x1: '10%', y1: 0, x2: '10%', y2: '100%', d: 11 }, { x1: '30%', y1: 0, x2: '30%', y2: '100%', d: 13 },
    { x1: '50%', y1: 0, x2: '50%', y2: '100%', d: 7 }, { x1: '70%', y1: 0, x2: '70%', y2: '100%', d: 15 },
  ], []);
  return (
    <>
      <style>{`@keyframes circuitPulse { 0% { stroke-dashoffset: 1000; } 100% { stroke-dashoffset: 0; } }`}</style>
      <svg className="absolute inset-0 w-full h-full">
        {lines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} strokeWidth={0.5} style={{ stroke: 'var(--theme-bg-effect-color-1)', strokeOpacity: 0.4 }} />)}
        {lines.map((l, i) => <line key={`p-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} strokeWidth={1} strokeDasharray="20 980" style={{ stroke: 'var(--theme-bg-effect-color-1)', animation: `circuitPulse ${l.d}s linear infinite`, animationDelay: `${-i * 1.3}s` }} />)}
      </svg>
    </>
  );
};

const Constellation: React.FC = () => {
  const nodes = useMemo(() => Array.from({ length: 30 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, r: 1 + Math.random() * 1.5 })), []);
  const edges = useMemo(() => { const r: { x1:number;y1:number;x2:number;y2:number }[] = []; for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++) { const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y; if (Math.sqrt(dx*dx+dy*dy)<22) r.push({x1:nodes[i].x,y1:nodes[i].y,x2:nodes[j].x,y2:nodes[j].y}); } return r; }, [nodes]);
  return (
    <svg className="absolute inset-0 w-full h-full">
      {edges.map((e,i) => <line key={`e-${i}`} x1={`${e.x1}%`} y1={`${e.y1}%`} x2={`${e.x2}%`} y2={`${e.y2}%`} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />)}
      {nodes.map(n => <motion.circle key={n.id} cx={`${n.x}%`} cy={`${n.y}%`} r={n.r} fill="white" animate={{ opacity: [0.2,0.5,0.2] }} transition={{ duration: 3+Math.random()*4, repeat: Infinity, ease:'easeInOut', delay: Math.random()*3 }} />)}
    </svg>
  );
};

const HexGrid: React.FC = () => {
  const hexagons = useMemo(() => { const r:[{cx:number,cy:number,pulseDelay:number}]=[] as any; const size=40,h=size*Math.sqrt(3); for(let row=-1;row<15;row++) for(let col=-1;col<25;col++) r.push({cx:col*size*1.5,cy:row*h+(col%2===0?0:h/2),pulseDelay:Math.random()*8}); return r; }, []);
  const hexPath=(cx:number,cy:number,r:number)=>Array.from({length:6},(_,a)=>{const angle=(Math.PI/3)*a-Math.PI/6;return `${cx+r*Math.cos(angle)},${cy+r*Math.sin(angle)}`;}).join(' ');
  return (
    <>
      <style>{`@keyframes hexPulse { 0%,100%{opacity:0.04} 50%{opacity:0.18} }`}</style>
      <svg className="absolute inset-0 w-full h-full">
        {hexagons.map((hex,i) => <polygon key={i} points={hexPath(hex.cx,hex.cy,18)} fill="none" strokeWidth={0.5} style={{ stroke:'var(--theme-bg-effect-color-1)', strokeOpacity:0.4, animation:`hexPulse ${4+Math.random()*4}s ease-in-out infinite`, animationDelay:`${hex.pulseDelay}s` }} />)}
      </svg>
    </>
  );
};

export const backgrounds = [
  { id: 'none', component: null },
  { id: 'particles', component: ParticleField },
  { id: 'circuits', component: CircuitLines },
  { id: 'constellation', component: Constellation },
  { id: 'hex', component: HexGrid },
  { id: 'grid', component: FloatingGrid },
] as const;

export default function BackgroundEffect({ activeId }: { activeId: string }) {
  const bg = backgrounds.find(b => b.id === activeId);
  if (!bg?.component) return null;
  const Comp = bg.component;
  return <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden"><Comp /></div>;
}

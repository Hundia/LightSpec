import type { TerminalLine } from '../../data/steps-en';

interface Props { title?: string; lines: TerminalLine[] }

export default function TerminalBlock({ title, lines }: Props) {
  const colorMap: Record<string, string> = {
    command: 'text-amber-300',
    output: 'text-white/70',
    success: 'text-green-400',
    error: 'text-red-400',
    highlight: 'text-amber-400 font-semibold',
    blank: 'text-transparent',
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 font-mono text-xs">
      {/* Chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-white/30 text-xs ml-2">{title || 'terminal'}</span>
      </div>
      {/* Content */}
      <div className="bg-slate-950/90 px-4 py-3 space-y-1">
        {lines.map((line, i) => (
          <div key={i} className={colorMap[line.type] || 'text-white/70'}>
            {line.type === 'command' ? <><span className="text-amber-500/60">$ </span>{line.text}</> : line.text || '\u00A0'}
          </div>
        ))}
      </div>
    </div>
  );
}

import type { StatEntry } from '../../data/steps-en';

const colorMap = { amber: 'text-amber-400', green: 'text-green-400', blue: 'text-blue-400' };

export default function StatsRow({ items }: { items: StatEntry[] }) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
      {items.map((item, i) => (
        <div key={i} className="bg-slate-900/60 border border-white/10 rounded-xl px-4 py-4 text-center">
          <div className={`text-2xl font-bold ${colorMap[item.color || 'amber']}`}>{item.value}</div>
          <div className="text-xs text-white/40 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

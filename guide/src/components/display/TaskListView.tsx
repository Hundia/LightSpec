import { CheckCircle, Circle, Clock } from 'lucide-react';
import type { TaskEntry } from '../../data/steps-en';

const statusIcon = { done: <CheckCircle className="w-4 h-4 text-green-400" />, 'in-progress': <Clock className="w-4 h-4 text-amber-400" />, todo: <Circle className="w-4 h-4 text-white/30" /> };
const priorityColor = { high: 'text-red-400', medium: 'text-amber-400', low: 'text-white/40' };

export default function TaskListView({ tasks }: { tasks: TaskEntry[] }) {
  const done = tasks.filter(t => t.status === 'done').length;
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-800/50 border-b border-white/10 flex items-center justify-between">
        <span className="text-xs text-white/40 font-mono">.lsp/tasks.md</span>
        <span className="text-xs text-amber-400">{done}/{tasks.length} done</span>
      </div>
      <div className="divide-y divide-white/5">
        {tasks.map(t => (
          <div key={t.id} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${t.status === 'done' ? 'opacity-50' : ''}`}>
            {statusIcon[t.status]}
            <span className={`flex-1 ${t.status === 'done' ? 'line-through text-white/40' : 'text-white/80'}`}>{t.title}</span>
            <span className={`text-xs font-mono ${priorityColor[t.priority]}`}>{t.priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

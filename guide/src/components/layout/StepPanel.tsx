import type { ExplanationBlock, ResultBlock } from '../../data/steps-en';
import TerminalBlock from '../display/TerminalBlock';
import FileTree from '../display/FileTree';
import FileViewer from '../display/FileViewer';
import TaskListView from '../display/TaskListView';
import StatsRow from '../display/StatsRow';
import DirTree from '../display/DirTree';

interface Props { left: ExplanationBlock[]; right: ResultBlock[] }

function LeftPanel({ blocks }: { blocks: ExplanationBlock[] }) {
  return (
    <div className="h-full overflow-y-auto px-6 py-5 space-y-4 border-r border-white/10 border-l-2 border-l-amber-500/30">
      {blocks.map((b, i) => {
        if (b.type === 'heading') return <h2 key={i} className="text-base font-semibold text-amber-400">{b.text}</h2>;
        if (b.type === 'text') return <p key={i} className="text-sm text-white/70 leading-relaxed">{b.content}</p>;
        if (b.type === 'callout') return (
          <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-amber-400"><span>{b.emoji}</span>{b.title}</div>
            <p className="text-sm text-white/60 leading-relaxed">{b.content}</p>
          </div>
        );
        if (b.type === 'bullets') return (
          <ul key={i} className="space-y-1.5">
            {b.items.map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-white/70">
                <span className="text-amber-400 mt-0.5">●</span>{item}
              </li>
            ))}
          </ul>
        );
        if (b.type === 'warning') return (
          <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">{b.content}</div>
        );
        if (b.type === 'codeHint') return (
          <div key={i} className="space-y-1">
            <div className="text-xs text-white/40">{b.label}</div>
            <pre className="bg-slate-900/80 rounded-lg px-4 py-3 text-xs font-mono text-amber-300 overflow-x-auto">{b.code}</pre>
          </div>
        );
        return null;
      })}
    </div>
  );
}

function RightPanel({ blocks }: { blocks: ResultBlock[] }) {
  return (
    <div className="h-full overflow-y-auto px-5 py-5 space-y-4">
      {blocks.map((b, i) => {
        if (b.type === 'terminal') return <TerminalBlock key={i} title={b.title} lines={b.lines} />;
        if (b.type === 'fileTree') return <FileTree key={i} root={b.root} entries={b.entries} />;
        if (b.type === 'fileViewer') return <FileViewer key={i} filename={b.filename} language={b.language} content={b.content} />;
        if (b.type === 'taskList') return <TaskListView key={i} tasks={b.tasks} />;
        if (b.type === 'statsRow') return <StatsRow key={i} items={b.items} />;
        if (b.type === 'dirTree') return <DirTree key={i} title={b.title} files={b.files} />;
        return null;
      })}
    </div>
  );
}

export default function StepPanel({ left, right }: Props) {
  return (
    <div className="grid grid-cols-[2fr_3fr] h-full" style={{ height: 'calc(100vh - 160px)' }}>
      <LeftPanel blocks={left} />
      <RightPanel blocks={right} />
    </div>
  );
}

import { Star, BookOpen, ExternalLink, Code2 } from 'lucide-react';
import type { GitHubStats } from '../types';

interface GitHubCardProps {
  stats: GitHubStats;
  compact?: boolean;
}

const LANG_COLORS: Record<string, string> = {
  JavaScript: 'bg-amber-400',
  TypeScript: 'bg-blue-500',
  Python: 'bg-emerald-500',
  Java: 'bg-orange-500',
  'C++': 'bg-pink-500',
  CSS: 'bg-indigo-500',
  HTML: 'bg-rose-500',
  YAML: 'bg-red-400',
  Shell: 'bg-teal-500',
  R: 'bg-sky-400',
  MATLAB: 'bg-amber-600',
  'Jupyter Notebook': 'bg-orange-400',
};

export default function GitHubCard({ stats, compact = false }: GitHubCardProps) {
  return (
    <div className={`bg-slate-50/70 border border-slate-200/80 rounded-xl transition-all ${compact ? 'p-2.5' : 'p-3'}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <a
          href={`https://github.com/${stats.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 group transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="font-mono text-slate-800 group-hover:text-indigo-600">@{stats.username}</span>
          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </a>

        <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
          <span className="inline-flex items-center gap-1" title="Public Repositories">
            <BookOpen className="w-3 h-3 text-slate-400" />
            <span>{stats.publicRepos}</span>
            <span className="text-slate-400 font-normal">repos</span>
          </span>
          <span className="inline-flex items-center gap-1" title="Total Stars">
            <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
            <span>{stats.totalStars}</span>
            <span className="text-slate-400 font-normal">stars</span>
          </span>
        </div>
      </div>

      {/* Top Languages */}
      {stats.topLanguages.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-200/50">
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-slate-400 font-medium mr-1">
            <Code2 className="w-2.5 h-2.5" /> Stack:
          </span>
          {stats.topLanguages.map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center gap-1 text-[11px] bg-white border border-slate-200/80 px-2 py-0.5 rounded-md text-slate-700 shadow-2xs font-normal"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${LANG_COLORS[lang] ?? 'bg-slate-400'}`} />
              {lang}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

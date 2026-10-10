import { Globe, Star, BookOpen } from 'lucide-react';
import type { GitHubStats } from '../types';

interface GitHubCardProps {
  stats: GitHubStats;
}

const LANG_COLORS: Record<string, string> = {
  JavaScript: 'bg-amber-400',
  TypeScript: 'bg-blue-500',
  Python: 'bg-emerald-500',
  Java: 'bg-orange-500',
  'C++': 'bg-pink-500',
  CSS: 'bg-purple-500',
  HTML: 'bg-orange-400',
  YAML: 'bg-rose-400',
  Shell: 'bg-emerald-600',
  R: 'bg-sky-400',
  MATLAB: 'bg-amber-600',
  'Jupyter Notebook': 'bg-orange-400',
};

export default function GitHubCard({ stats }: GitHubCardProps) {
  return (
    <div className="bg-slate-50/80 border-t border-slate-100 -mx-6 -mb-6 px-6 py-3.5 flex flex-col gap-2 rounded-b-2xl mt-4">
      {/* Top Line: Username & GitHub Quick Stats */}
      <div className="flex items-center justify-between">
        <a
          href={`https://github.com/${stats.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-slate-800 hover:text-indigo-600 flex items-center gap-1.5 transition text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>@{stats.username}</span>
        </a>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <strong className="text-slate-800 font-bold">{stats.publicRepos}</strong> repos
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <strong className="text-slate-800 font-bold">{stats.totalStars}</strong> stars
          </span>
        </div>
      </div>

      {/* Languages List */}
      {stats.topLanguages.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          {stats.topLanguages.map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center gap-1 text-[10px] font-semibold bg-white border border-slate-200/90 text-slate-600 px-2 py-0.5 rounded-full shadow-2xs"
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

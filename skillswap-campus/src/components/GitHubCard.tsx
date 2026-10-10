import { Globe, Star, BookOpen, Code2 } from 'lucide-react';
import type { GitHubStats } from '../types';

interface GitHubCardProps {
  stats: GitHubStats;
}

const LANG_COLORS: Record<string, string> = {
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-500',
  Python: 'bg-blue-400',
  Java: 'bg-orange-500',
  'C++': 'bg-pink-500',
  CSS: 'bg-purple-500',
  HTML: 'bg-orange-400',
  YAML: 'bg-rose-400',
  Shell: 'bg-green-500',
  R: 'bg-sky-400',
  MATLAB: 'bg-amber-600',
  'Jupyter Notebook': 'bg-orange-300',
};

export default function GitHubCard({ stats }: GitHubCardProps) {
  return (
    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex items-center gap-2 mb-2.5">
        <Globe className="w-4 h-4 text-slate-600" />
        <a
          href={`https://github.com/${stats.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-slate-700 hover:text-indigo-600 transition"
          onClick={(e) => e.stopPropagation()}
        >
          @{stats.username}
        </a>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-800">{stats.publicRepos}</span>
          <span className="text-slate-500">repos</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium text-slate-800">{stats.totalStars}</span>
          <span className="text-slate-500">stars</span>
        </div>
      </div>

      {/* Language pills */}
      {stats.topLanguages.length > 0 && (
        <div className="mt-2.5">
          <div className="flex items-center gap-1 mb-1.5">
            <Code2 className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-400">Top Languages</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {stats.topLanguages.map((lang) => (
              <span
                key={lang}
                className="flex items-center gap-1 text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full"
              >
                <span className={`w-2 h-2 rounded-full ${LANG_COLORS[lang] ?? 'bg-slate-400'}`} />
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

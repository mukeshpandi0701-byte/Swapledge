import { Filter, X, SlidersHorizontal } from 'lucide-react';
import type { PeerFilters } from '../types';

interface PeerFilterProps {
  filters: PeerFilters;
  onChange: (filters: PeerFilters) => void;
  departments: string[];
  allSkills: string[];
}

export default function PeerFilter({ filters, onChange, departments, allSkills }: PeerFilterProps) {
  const update = (key: keyof PeerFilters, value: string | boolean) =>
    onChange({ ...filters, [key]: value });

  const hasActiveFilters =
    filters.department || filters.skillOffered || filters.skillWanted || filters.verifiedOnly;

  const resetFilters = () =>
    onChange({ keyword: filters.keyword, department: '', skillOffered: '', skillWanted: '', verifiedOnly: false });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
          Filters
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 font-medium transition"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Department */}
        <div>
          <label className="block text-xs text-slate-500 font-medium mb-1">Department</label>
          <select
            value={filters.department}
            onChange={(e) => update('department', e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Skill Offered */}
        <div>
          <label className="block text-xs text-slate-500 font-medium mb-1">Skill Offered</label>
          <select
            value={filters.skillOffered}
            onChange={(e) => update('skillOffered', e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
          >
            <option value="">Any Skill</option>
            {allSkills.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Skill Wanted */}
        <div>
          <label className="block text-xs text-slate-500 font-medium mb-1">Wants to Learn</label>
          <select
            value={filters.skillWanted}
            onChange={(e) => update('skillWanted', e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
          >
            <option value="">Any Skill</option>
            {allSkills.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Verified Badge Toggle */}
        <div className="flex items-end">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div
              onClick={() => update('verifiedOnly', !filters.verifiedOnly)}
              className={`relative w-10 h-5 rounded-full transition-colors ${filters.verifiedOnly ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${filters.verifiedOnly ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-600 font-medium">
              <Filter className="w-4 h-4 text-indigo-400" />
              Verified Only
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

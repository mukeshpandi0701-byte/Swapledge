import { ShieldCheck, X, SlidersHorizontal } from 'lucide-react';
import type { PeerFilters } from '../types';

interface PeerFilterProps {
  filters: PeerFilters;
  onChange: (filters: PeerFilters) => void;
  departments: string[];
  allSkills: string[];
}

const inputControlClass =
  'w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl py-2.5 px-3.5 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition outline-none shadow-xs appearance-none cursor-pointer';

export default function PeerFilter({ filters, onChange, departments, allSkills }: PeerFilterProps) {
  const update = (key: keyof PeerFilters, value: string | boolean) =>
    onChange({ ...filters, [key]: value });

  const hasActiveFilters =
    filters.department || filters.skillOffered || filters.skillWanted || filters.verifiedOnly;

  const resetFilters = () =>
    onChange({ keyword: filters.keyword, department: '', skillOffered: '', skillWanted: '', verifiedOnly: false });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm mb-8">
      {/* Header Bar with Filter Counter */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Filter Peers & Skills
            </h3>
            <p className="text-[11px] text-slate-400">Find the perfect exchange partner</p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 px-2.5 py-1 rounded-lg font-semibold transition"
          >
            <X className="w-3 h-3" />
            Reset all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Department Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Department
          </label>
          <div className="relative">
            <select
              value={filters.department}
              onChange={(e) => update('department', e.target.value)}
              className={inputControlClass}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronIcon />
          </div>
        </div>

        {/* Skill Offered */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Skill Offered (Peer Teaches)
          </label>
          <div className="relative">
            <select
              value={filters.skillOffered}
              onChange={(e) => update('skillOffered', e.target.value)}
              className={inputControlClass}
            >
              <option value="">Any Skill</option>
              {allSkills.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronIcon />
          </div>
        </div>

        {/* Skill Wanted */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Wants to Learn
          </label>
          <div className="relative">
            <select
              value={filters.skillWanted}
              onChange={(e) => update('skillWanted', e.target.value)}
              className={inputControlClass}
            >
              <option value="">Any Skill</option>
              {allSkills.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronIcon />
          </div>
        </div>

        {/* Verified Badge Switch */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Verification Status
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={filters.verifiedOnly}
            onClick={() => update('verifiedOnly', !filters.verifiedOnly)}
            className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 shadow-xs cursor-pointer ${
              filters.verifiedOnly
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70 hover:border-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShieldCheck
                className={`w-4 h-4 transition-colors ${filters.verifiedOnly ? 'text-emerald-600' : 'text-slate-400'}`}
              />
              Verified Badges Only
            </span>

            {/* High-contrast smooth emerald switch toggle */}
            <div
              className={`relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ${
                filters.verifiedOnly ? 'bg-emerald-500 shadow-inner' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${
                  filters.verifiedOnly ? 'left-[18px]' : 'left-0.5'
                }`}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

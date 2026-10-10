import { SlidersHorizontal, X, ShieldCheck, ArrowUpDown, Clock } from 'lucide-react';
import type { PeerFilters } from '../types';

interface PeerFilterProps {
  filters: PeerFilters;
  onChange: (filters: PeerFilters) => void;
  departments: string[];
  allSkills: string[];
  totalPeers: number;
  filteredCount: number;
}

export default function PeerFilter({
  filters,
  onChange,
  departments,
  allSkills,
  totalPeers,
  filteredCount,
}: PeerFilterProps) {
  const update = <K extends keyof PeerFilters>(key: K, value: PeerFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const removeFilter = (key: keyof PeerFilters) => {
    if (key === 'verifiedOnly') {
      onChange({ ...filters, verifiedOnly: false });
    } else if (
      key === 'availabilityFilter' ||
      key === 'department' ||
      key === 'skillOffered' ||
      key === 'skillWanted' ||
      key === 'keyword'
    ) {
      onChange({ ...filters, [key]: '' });
    }
  };

  const hasActiveFilters = Boolean(
    filters.department ||
    filters.skillOffered ||
    filters.skillWanted ||
    filters.verifiedOnly ||
    filters.availabilityFilter ||
    filters.keyword
  );

  const resetAllFilters = () => {
    onChange({
      keyword: '',
      department: '',
      skillOffered: '',
      skillWanted: '',
      verifiedOnly: false,
      availabilityFilter: '',
      sortOption: 'compatibility',
    });
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 mb-6 shadow-xs">
      {/* Top Filter Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Filter & Sort Trainers</h2>
            <p className="text-[11px] text-slate-500">
              Showing <span className="font-semibold text-slate-800">{filteredCount}</span> of {totalPeers} campus trainers
            </p>
          </div>
        </div>

        {/* Sort & Clear Utilities */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium hidden sm:inline text-slate-500">Sort by:</span>
            <select
              value={filters.sortOption}
              onChange={(e) => update('sortOption', e.target.value as PeerFilters['sortOption'])}
              className="text-xs font-semibold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50/80 hover:bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              <option value="compatibility">Compatibility (Best Match)</option>
              <option value="rating">Rating (Highest First)</option>
              <option value="reviews">Most Reviews</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reset all
            </button>
          )}
        </div>
      </div>

      {/* Filter Select Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Department */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => update('department', e.target.value)}
            className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/70 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Skill Offered */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Trainer Teaches (Offered)
          </label>
          <select
            value={filters.skillOffered}
            onChange={(e) => update('skillOffered', e.target.value)}
            className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/70 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium"
          >
            <option value="">Any Subject / Skill</option>
            {allSkills.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Skill Wanted */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Trainer Wants to Learn
          </label>
          <select
            value={filters.skillWanted}
            onChange={(e) => update('skillWanted', e.target.value)}
            className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/70 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium"
          >
            <option value="">Any Subject / Skill</option>
            {allSkills.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Availability Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Availability
          </label>
          <select
            value={filters.availabilityFilter}
            onChange={(e) => update('availabilityFilter', e.target.value)}
            className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/70 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 font-medium"
          >
            <option value="">Any Schedule</option>
            <option value="weekday">Weekdays</option>
            <option value="weekend">Weekends</option>
            <option value="afternoon">Afternoons / Evenings</option>
          </select>
        </div>

        {/* Verified Trainers Only Toggle */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => update('verifiedOnly', !filters.verifiedOnly)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
              filters.verifiedOnly
                ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-2xs'
                : 'bg-slate-50/70 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className={`w-4 h-4 ${filters.verifiedOnly ? 'text-indigo-600' : 'text-slate-400'}`} />
              Verified Trainers Only
            </span>
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                filters.verifiedOnly ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
              }`}
            >
              {filters.verifiedOnly ? '✓' : ''}
            </span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400">Active filters:</span>

          {filters.keyword && (
            <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
              Keyword: "{filters.keyword}"
              <button
                onClick={() => removeFilter('keyword')}
                className="hover:text-slate-900 ml-0.5"
                aria-label="Remove keyword filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.department && (
            <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2.5 py-1 rounded-lg">
              Dept: {filters.department}
              <button
                onClick={() => removeFilter('department')}
                className="hover:text-indigo-900 ml-0.5"
                aria-label="Remove department filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.skillOffered && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
              Teaches: {filters.skillOffered}
              <button
                onClick={() => removeFilter('skillOffered')}
                className="hover:text-emerald-900 ml-0.5"
                aria-label="Remove skill offered filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.skillWanted && (
            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-1 rounded-lg">
              Wants: {filters.skillWanted}
              <button
                onClick={() => removeFilter('skillWanted')}
                className="hover:text-blue-900 ml-0.5"
                aria-label="Remove skill wanted filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.availabilityFilter && (
            <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-800 border border-amber-200/60 px-2.5 py-1 rounded-lg">
              <Clock className="w-3 h-3" />
              Schedule: {filters.availabilityFilter}
              <button
                onClick={() => removeFilter('availabilityFilter')}
                className="hover:text-amber-900 ml-0.5"
                aria-label="Remove availability filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.verifiedOnly && (
            <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3 h-3" /> Verified trainers only
              <button
                onClick={() => removeFilter('verifiedOnly')}
                className="hover:text-indigo-900 ml-0.5"
                aria-label="Remove verified filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

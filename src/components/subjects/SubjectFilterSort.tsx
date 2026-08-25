import React from 'react';
import { SubjectImportance, IMPORTANCE_ORDER } from '../../types/subject';
import { Search, SlidersHorizontal, ArrowUpDown, Flame, Zap, Star, X } from 'lucide-react';
import { clsx } from 'clsx';

export type SubjectSortOption = 'marks' | 'pyqs' | 'importance' | 'name' | 'progress' | 'hours' | 'recent';

export interface SubjectFilterSortProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedImportance: SubjectImportance | 'all';
  onImportanceChange: (importance: SubjectImportance | 'all') => void;
  sortBy: SubjectSortOption;
  onSortChange: (sort: SubjectSortOption) => void;
}

export const SubjectFilterSort: React.FC<SubjectFilterSortProps> = ({
  searchQuery,
  onSearchChange,
  selectedImportance,
  onImportanceChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl mb-6">
      {/* Left side: Compact Search Bar + Quick Filter Buttons */}
      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Compact Search bar */}
        <div className="relative w-full sm:w-64 lg:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search subjects..."
            className="w-full pl-10 pr-8 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/60 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter / Rank Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Most Marks Button */}
          <button
            onClick={() => onSortChange(sortBy === 'marks' ? 'importance' : 'marks')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all active:scale-95',
              sortBy === 'marks'
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/30'
                : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            )}
            title="Sort subjects with the highest marks weight first"
          >
            <Flame className={clsx('w-3.5 h-3.5', sortBy === 'marks' ? 'text-emerald-400' : 'text-slate-400')} />
            <span>Most Marks</span>
          </button>

          {/* Most PYQs Button */}
          <button
            onClick={() => onSortChange(sortBy === 'pyqs' ? 'importance' : 'pyqs')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all active:scale-95',
              sortBy === 'pyqs'
                ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)] ring-1 ring-amber-500/30'
                : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            )}
            title="Sort subjects with the highest number of PYQs first"
          >
            <Zap className={clsx('w-3.5 h-3.5', sortBy === 'pyqs' ? 'text-amber-400' : 'text-slate-400')} />
            <span>Most PYQs</span>
          </button>

          {/* High Scoring Priority Filter */}
          <button
            onClick={() => onImportanceChange(selectedImportance === 'High Scoring' ? 'all' : 'High Scoring')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all active:scale-95',
              selectedImportance === 'High Scoring'
                ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)] ring-1 ring-rose-500/30'
                : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            )}
            title="Filter to 'High Scoring' subjects"
          >
            <Star className={clsx('w-3.5 h-3.5', selectedImportance === 'High Scoring' ? 'text-rose-400 fill-current' : 'text-slate-400')} />
            <span>High Scoring</span>
          </button>
        </div>
      </div>

      {/* Right side: Dropdown Selectors */}
      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        {/* Importance Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedImportance}
            onChange={(e) => onImportanceChange(e.target.value as any)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500/50 cursor-pointer"
          >
            <option value="all">All Importance Levels</option>
            {IMPORTANCE_ORDER.map((imp) => (
              <option key={imp} value={imp}>
                {imp}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-1.5 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SubjectSortOption)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500/50 cursor-pointer font-bold"
          >
            <option value="marks">Sort: Most Marks (High → Low)</option>
            <option value="pyqs">Sort: Most PYQs (High → Low)</option>
            <option value="importance">Sort: Priority / Importance</option>
            <option value="progress">Sort: Completion Rate</option>
            <option value="hours">Sort: Total Study Hours</option>
            <option value="name">Sort: Subject Name (A-Z)</option>
            <option value="recent">Sort: Recently Added</option>
          </select>
        </div>
      </div>
    </div>
  );
};

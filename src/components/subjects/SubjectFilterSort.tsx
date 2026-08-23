import React from 'react';
import { SubjectImportance, IMPORTANCE_ORDER } from '../../types/subject';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export type SubjectSortOption = 'importance' | 'name' | 'progress' | 'hours' | 'recent';

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
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl mb-6">
      {/* Search bar */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/60 transition-colors"
        />
      </div>

      {/* Filter and Sort options */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Importance Filter */}
        <div className="flex items-center gap-2 text-xs">
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
        <div className="flex items-center gap-2 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SubjectSortOption)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500/50 cursor-pointer"
          >
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

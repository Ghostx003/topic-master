import React from 'react';
import { SubjectImportance, IMPORTANCE_ORDER } from '../../types/subject';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export type SubjectSortOption = 'importance' | 'progress' | 'hours' | 'name' | 'recent';

export interface SubjectFilterSortProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedImportance: SubjectImportance | 'all';
  onImportanceChange: (imp: SubjectImportance | 'all') => void;
  sortBy: SubjectSortOption;
  onSortChange: (s: SubjectSortOption) => void;
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
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter subjects by name or description..."
          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/60 transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Importance Filter */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedImportance}
            onChange={(e) => onImportanceChange(e.target.value as SubjectImportance | 'all')}
            className="px-3 py-2 text-xs rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500/60 transition-colors cursor-pointer"
          >
            <option value="all">All Importances</option>
            {IMPORTANCE_ORDER.map((imp) => (
              <option key={imp} value={imp}>
                {imp}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SubjectSortOption)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500/60 transition-colors cursor-pointer"
          >
            <option value="importance">Sort: Importance</option>
            <option value="progress">Sort: Highest Progress</option>
            <option value="hours">Sort: Most Study Hours</option>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="recent">Sort: Recently Added</option>
          </select>
        </div>
      </div>
    </div>
  );
};

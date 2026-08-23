import React from 'react';
import { SubjectImportance, IMPORTANCE_CONFIG } from '../../types/subject';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Sparkles } from 'lucide-react';

export interface SubjectImportancePillProps {
  importance: SubjectImportance;
  onClick?: (e: React.MouseEvent) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SubjectImportancePill: React.FC<SubjectImportancePillProps> = ({
  importance,
  onClick,
  interactive = true,
  size = 'md',
  className,
}) => {
  const config = IMPORTANCE_CONFIG[importance] || IMPORTANCE_CONFIG.Normal;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs font-semibold px-3 py-1 gap-2',
    lg: 'text-sm font-semibold px-4 py-1.5 gap-2.5',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      title={interactive ? `Click to cycle importance (Currently: ${importance})` : importance}
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full border transition-all duration-300 select-none shadow-sm',
          config.bg,
          config.text,
          config.border,
          config.glow,
          sizeClasses[size],
          interactive
            ? 'cursor-pointer hover:scale-105 active:scale-95 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand-500/40'
            : 'cursor-default',
          className
        )
      )}
    >
      <span className={clsx('w-2 h-2 rounded-full animate-pulse-subtle shrink-0', config.dot)} />
      <span className="tracking-wide uppercase font-medium text-[11px]">{config.label}</span>
      {interactive && (
        <Sparkles className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity ml-0.5" />
      )}
    </button>
  );
};

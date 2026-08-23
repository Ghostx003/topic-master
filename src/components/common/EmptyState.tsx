import React, { ReactNode } from 'react';
import { Button } from './Button';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  actionIcon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 backdrop-blur-sm my-4">
      <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 mb-4 shadow-glow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction} icon={actionIcon}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'left',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
    icon: 'p-2 aspect-square',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-glow-sm hover:shadow-glow border border-brand-400/30',
    secondary:
      'bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-700/80 hover:border-slate-600',
    outline:
      'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-500',
    danger:
      'bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-600/40 hover:border-rose-500 shadow-sm',
    ghost:
      'bg-transparent hover:bg-white/5 text-slate-400 hover:text-white border border-transparent',
    glass:
      'bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 border border-white/10 backdrop-blur-md hover:border-white/20 shadow-glass',
  };

  return (
    <button
      className={twMerge(
        clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      {children}
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
};

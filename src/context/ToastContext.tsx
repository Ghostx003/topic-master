import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (type: ToastType, title: string, description?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  toast: {
    success: (title: string, description?: string) => void;
    error: (title: string, description?: string) => void;
    info: (title: string, description?: string) => void;
    warning: (title: string, description?: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, title: string, description?: string, duration: number = 4000) => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, description, duration };

      setToasts((prev) => [...prev.slice(-4), newToast]); // Keep up to 5 toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = {
    success: (title: string, description?: string) => addToast('success', title, description),
    error: (title: string, description?: string) => addToast('error', title, description),
    info: (title: string, description?: string) => addToast('info', title, description),
    warning: (title: string, description?: string) => addToast('warning', title, description),
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, toast }}>
      {children}
      {/* Toast Render Overlay */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none max-w-md w-full px-4 sm:px-0">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-glass backdrop-blur-xl animate-slide-up transition-all duration-300 ${
              item.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/30 text-emerald-300'
                : item.type === 'error'
                ? 'bg-slate-900/95 border-rose-500/30 text-rose-300'
                : item.type === 'warning'
                ? 'bg-slate-900/95 border-amber-500/30 text-amber-300'
                : 'bg-slate-900/95 border-brand-500/30 text-brand-300'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {item.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {item.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {item.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {item.type === 'info' && <Info className="w-5 h-5 text-brand-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white leading-tight">{item.title}</h4>
              {item.description && (
                <p className="text-xs text-slate-300 mt-1 leading-normal break-words">
                  {item.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(item.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

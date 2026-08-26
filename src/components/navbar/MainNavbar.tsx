import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FolderTree,
  CalendarDays,
  ShieldAlert,
  Settings,
  Search,
  Menu,
  X,
  BarChart3,
  Layers,
  Sparkles,
  Award,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { ALL_PYQ_QUESTIONS } from '../../services/pyqService';
import { loadTestHistory } from '../../services/pyqTestService';

export interface MainNavbarProps {
  onOpenSettings: () => void;
  onOpenGlobalSearch: () => void;
}

export const MainNavbar: React.FC<MainNavbarProps> = ({ onOpenSettings, onOpenGlobalSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { subjects, topics } = useTopicMaster();
  const navigate = useNavigate();

  const totalPYQs = ALL_PYQ_QUESTIONS.length;
  const completedTestsCount = loadTestHistory().filter((t) => t.status === 'completed').length;

  const navItems = [
    {
      to: '/subjects',
      label: 'My Subjects',
      icon: BookOpen,
      count: subjects.length,
    },
    {
      to: '/topics',
      label: 'Topics & Hierarchy',
      icon: FolderTree,
      count: topics.length,
    },
    {
      to: '/pyqs',
      label: 'PYQ Practice',
      icon: BarChart3,
      count: `${(totalPYQs / 1000).toFixed(1)}k`,
    },
    {
      to: '/pyq-tests',
      label: 'PYQ Tests',
      icon: Award,
      count: completedTestsCount > 0 ? completedTestsCount : 'New',
    },
    {
      to: '/analytics',
      label: 'Analytics Hub',
      icon: Sparkles,
      count: 'Pro',
    },
    {
      to: '/scheduler',
      label: 'Study Scheduler',
      icon: CalendarDays,
    },
    {
      to: '/admin',
      label: 'Admin Workspace',
      icon: ShieldAlert,
      isSpecial: true,
    },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-2xl transition-all">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="flex items-center justify-between h-20 gap-6">
          {/* Brand Logo */}
          <div
            onClick={() => navigate('/subjects')}
            className="flex items-center gap-4 cursor-pointer group select-none shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow-sm group-hover:shadow-glow transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  TOPIC MASTER
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-brand-500/20 to-indigo-500/20 text-brand-300 rounded-lg border border-brand-500/30">
                  2026
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Advanced Curriculum System
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-2 bg-slate-900/70 p-1.5 rounded-2xl border border-slate-800/90 backdrop-blur-xl shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 select-none relative',
                      isActive
                        ? item.isSpecial
                          ? 'bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white shadow-glow-sm scale-[1.02]'
                          : 'bg-brand-500/20 text-brand-300 border border-brand-500/35 shadow-sm scale-[1.02]'
                        : item.isSpecial
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    )
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span className="ml-1 px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/60">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Quick Search Button */}
            <button
              onClick={onOpenGlobalSearch}
              className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-400 hover:text-slate-100 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all shadow-sm group"
              title="Search topics and subjects (Ctrl+Space or ⌘K)"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-400 transition-colors" />
              <span className="hidden sm:inline font-medium">Search...</span>
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold bg-slate-850 text-slate-400 rounded-lg border border-slate-700">
                Ctrl+Space
              </kbd>
            </button>

            {/* Settings Trigger */}
            <button
              onClick={onOpenSettings}
              className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all active:scale-95"
              title="Settings & Backup"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-6 py-6 space-y-3 animate-slide-up">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-bold transition-all',
                    isActive
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-900'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-lg bg-slate-800 text-slate-300">
                    {item.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
};

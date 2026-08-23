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
  Layers,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useTopicMaster } from '../../context/TopicMasterContext';

export interface MainNavbarProps {
  onOpenSettings: () => void;
  onOpenGlobalSearch: () => void;
}

export const MainNavbar: React.FC<MainNavbarProps> = ({ onOpenSettings, onOpenGlobalSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { subjects, topics } = useTopicMaster();
  const navigate = useNavigate();

  const navItems = [
    {
      to: '/subjects',
      label: 'My Subjects',
      icon: BookOpen,
      count: subjects.length,
    },
    {
      to: '/topics',
      label: 'Add Topics',
      icon: FolderTree,
      count: topics.length,
    },
    {
      to: '/scheduler',
      label: 'Scheduler',
      icon: CalendarDays,
    },
    {
      to: '/admin',
      label: 'Admin Panel',
      icon: ShieldAlert,
      isSpecial: true,
    },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => navigate('/subjects')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-glow-sm group-hover:shadow-glow transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  TOPIC MASTER
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 rounded-md border border-brand-500/30">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Advanced Study Management
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 select-none relative',
                      isActive
                        ? item.isSpecial
                          ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-glow-sm'
                          : 'bg-brand-500/20 text-brand-300 border border-brand-500/30 shadow-sm'
                        : item.isSpecial
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    )
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 text-[11px] font-semibold rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Quick Search Button */}
            <button
              onClick={onOpenGlobalSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors shadow-sm"
              title="Search topics and subjects"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Settings Trigger */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
              title="Settings & Data Backup"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-slide-up">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                    isActive
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-800 text-slate-300">
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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Flame,
  Activity,
  ListTodo,
  Layers,
  Menu,
} from 'lucide-react';
import { useTopicMaster } from '../../context/TopicMasterContext';

export interface AdminNavbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenHardModal: () => void;
  onOpenDoingModal: () => void;
  onOpenTodoModal: () => void;
  onOpenAllTopicsModal: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  sidebarOpen,
  onToggleSidebar,
  onOpenHardModal,
  onOpenDoingModal,
  onOpenTodoModal,
  onOpenAllTopicsModal,
}) => {
  const navigate = useNavigate();
  const { topics } = useTopicMaster();

  const hardCount = topics.filter(
    (t) =>
      t.Topic_Difficulty === 'Hard' ||
      t.Topic_Difficulty === 'Needs Attention' ||
      t.Topic_Difficulty === 'Weak' ||
      t.Topic_Difficulty === 'High Priority' ||
      t.Topic_Difficulty === 'Revision Required'
  ).length;

  const doingCount = topics.filter((t) => t.Topic_Status === 'Doing').length;
  const todoCount = topics.filter((t) => t.Topic_Status === 'To Do' || !t.Topic_Tags?.Done).length;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Sidebar Hamburger + Home Button + Admin Logo */}
          <div className="flex items-center gap-3">
            {/* Collapsible Sidebar Hamburger Button */}
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
              title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* REQUIRED BY SPEC (Section 19): Clear Home button taking user back to main app */}
            <button
              onClick={() => navigate('/subjects')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-brand-500/40 text-slate-200 hover:text-white text-xs font-bold transition-all shadow-sm group"
            >
              <Home className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
              <span>Back to Home</span>
            </button>

            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-800">
              <span className="text-sm font-black tracking-wider uppercase bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">
                Admin Management Workspace
              </span>
            </div>
          </div>

          {/* Center/Right: Admin Modal Triggers (Hard, Doing, To Do, All Topics) */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            {/* 1. Hard Topics Trigger */}
            <button
              onClick={onOpenHardModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all shadow-sm hover:scale-105"
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Hard</span>
              <span className="px-1.5 py-0.2 rounded-md bg-rose-900/80 text-[10px] font-mono">
                {hardCount}
              </span>
            </button>

            {/* 2. Doing Topics Trigger */}
            <button
              onClick={onOpenDoingModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-sm hover:scale-105"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Doing</span>
              <span className="px-1.5 py-0.2 rounded-md bg-cyan-900/80 text-[10px] font-mono">
                {doingCount}
              </span>
            </button>

            {/* 3. To Do Topics Trigger */}
            <button
              onClick={onOpenTodoModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all shadow-sm hover:scale-105"
            >
              <ListTodo className="w-3.5 h-3.5 text-indigo-400" />
              <span>To Do</span>
              <span className="px-1.5 py-0.2 rounded-md bg-indigo-900/80 text-[10px] font-mono">
                {todoCount}
              </span>
            </button>

            {/* 4. All Topics Trigger */}
            <button
              onClick={onOpenAllTopicsModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-glow-sm hover:scale-105"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Topics</span>
              <span className="px-1.5 py-0.2 rounded-md bg-brand-800 text-[10px] font-mono">
                {topics.length}
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

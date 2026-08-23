import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { MainNavbar } from '../components/navbar/MainNavbar';
import { ActiveTimerWidget } from '../components/common/ActiveTimerWidget';
import { TopicDetailModal } from '../components/topicDetail/TopicDetailModal';
import { SettingsModal } from '../modals/SettingsModal';
import { GlobalSearchModal } from '../modals/GlobalSearchModal';

export const MainLayout: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#060911] text-slate-100 selection:bg-brand-500/30 selection:text-brand-200">
      {/* Primary 4-Tab Main Navbar */}
      <MainNavbar
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenGlobalSearch={() => setSearchOpen(true)}
      />

      {/* Main Content Area - Full Screen Edge-to-Edge */}
      <main className="flex-1 w-full px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Persistent Floating Active Study Timer */}
      <ActiveTimerWidget />

      {/* Universal Topic Detail Workspace Modal */}
      <TopicDetailModal />

      {/* Global Modals */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

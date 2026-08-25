import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { MainNavbar } from '../components/navbar/MainNavbar';
import { ActiveTimerWidget } from '../components/common/ActiveTimerWidget';
import { TopicDetailModal } from '../components/topicDetail/TopicDetailModal';
import { PYQModal } from '../components/pyq/PYQModal';
import { useTopicMaster } from '../context/TopicMasterContext';
import { SettingsModal } from '../modals/SettingsModal';
import { GlobalSearchModal } from '../modals/GlobalSearchModal';

export const MainLayout: React.FC = () => {
  const { activePYQTopic, closePYQModal } = useTopicMaster();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Global ⌘K / Ctrl+K and Ctrl+Space keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrMeta = e.metaKey || e.ctrlKey;
      const isSearchShortcut =
        (isCtrlOrMeta && (e.key === 'k' || e.key === 'K')) ||
        (isCtrlOrMeta && (e.code === 'Space' || e.key === ' '));

      if (isSearchShortcut) {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-100 selection:bg-brand-500/30 selection:text-brand-200">
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

      {/* Universal PYQ Practice Modal */}
      {activePYQTopic && (
        <PYQModal
          isOpen={Boolean(activePYQTopic)}
          onClose={closePYQModal}
          topicId={activePYQTopic.topicId}
          topicName={activePYQTopic.topicName}
          subjectName={activePYQTopic.subjectName}
          subtopicNames={activePYQTopic.subtopicNames}
          initialSearch={activePYQTopic.initialSearch}
          customYearRange={activePYQTopic.customYearRange}
        />
      )}

      {/* Global Modals */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

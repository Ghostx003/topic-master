import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminNavbar } from '../components/admin/AdminNavbar';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { ActiveTimerWidget } from '../components/common/ActiveTimerWidget';
import { TopicDetailModal } from '../components/topicDetail/TopicDetailModal';
import { PYQModal } from '../components/pyq/PYQModal';
import { HardTopicsModal } from '../modals/HardTopicsModal';
import { DoingTopicsModal } from '../modals/DoingTopicsModal';
import { TodoTopicsModal } from '../modals/TodoTopicsModal';
import { AllTopicsModal } from '../modals/AllTopicsModal';
import { AddSubjectModal } from '../modals/AddSubjectModal';
import { useTopicMaster } from '../context/TopicMasterContext';

export const AdminLayout: React.FC = () => {
  const { subjects, activePYQTopic, closePYQModal } = useTopicMaster();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // Admin Modal States
  const [hardModalOpen, setHardModalOpen] = useState(false);
  const [doingModalOpen, setDoingModalOpen] = useState(false);
  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [allTopicsModalOpen, setAllTopicsModalOpen] = useState(false);
  const [addSubjectOpen, setAddSubjectOpen] = useState(false);

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || null;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-100 selection:bg-brand-500/30 selection:text-brand-200">
      {/* REQUIRED BY SPEC (Section 19): Dedicated Admin Navbar (Main Navbar is hidden) */}
      <AdminNavbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onOpenHardModal={() => setHardModalOpen(true)}
        onOpenDoingModal={() => setDoingModalOpen(true)}
        onOpenTodoModal={() => setTodoModalOpen(true)}
        onOpenAllTopicsModal={() => setAllTopicsModalOpen(true)}
      />

      {/* Main Workspace Body with Collapsible Sidebar */}
      <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
        {/* Collapsible Subject Sidebar */}
        <AdminSidebar
          isOpen={sidebarOpen}
          selectedSubjectId={selectedSubjectId}
          onSelectSubject={(id) => setSelectedSubjectId(id)}
          onAddSubject={() => setAddSubjectOpen(true)}
        />

        {/* Dynamic Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-300">
          <Outlet context={{ selectedSubjectId, setSelectedSubjectId, selectedSubject, onOpenAddTopic: () => setTodoModalOpen(true) }} />
        </main>
      </div>

      {/* Dedicated Admin Modals */}
      <HardTopicsModal
        isOpen={hardModalOpen}
        onClose={() => setHardModalOpen(false)}
        selectedSubject={selectedSubject}
      />
      <DoingTopicsModal
        isOpen={doingModalOpen}
        onClose={() => setDoingModalOpen(false)}
        selectedSubject={selectedSubject}
      />
      <TodoTopicsModal
        isOpen={todoModalOpen}
        onClose={() => setTodoModalOpen(false)}
        selectedSubject={selectedSubject}
      />
      <AllTopicsModal
        isOpen={allTopicsModalOpen}
        onClose={() => setAllTopicsModalOpen(false)}
      />
      <AddSubjectModal
        isOpen={addSubjectOpen}
        onClose={() => setAddSubjectOpen(false)}
      />

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

      {/* Active Study Timer Pill */}
      <ActiveTimerWidget />
    </div>
  );
};

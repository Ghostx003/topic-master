import React, { useState, useMemo } from 'react';
import { Subject, SubjectImportance, IMPORTANCE_ORDER } from '../types/subject';
import { useTopicMaster } from '../context/TopicMasterContext';
import { SubjectCard } from '../components/subjects/SubjectCard';
import { SubjectStatsBar } from '../components/subjects/SubjectStatsBar';
import { SubjectFilterSort, SubjectSortOption } from '../components/subjects/SubjectFilterSort';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { AddSubjectModal } from '../modals/AddSubjectModal';
import { calculateTopicProgress } from '../utils/hierarchyUtils';
import { getQuestionsForSubject } from '../services/pyqService';
import { BookOpen, Plus } from 'lucide-react';

export const MySubjectsPage: React.FC = () => {
  const { subjects, topics, deleteSubject } = useTopicMaster();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImportance, setSelectedImportance] = useState<SubjectImportance | 'all'>('all');
  const [sortBy, setSortBy] = useState<SubjectSortOption>('importance');

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  // Subject metrics map for PYQ count, Total Marks, and Marks Density (High Scoring = Max Marks / Least Topics)
  const subjectMetrics = useMemo(() => {
    const map = new Map<string, { pyqs: number; marks: number; topicCount: number; density: number }>();
    subjects.forEach((s) => {
      const qs = getQuestionsForSubject(s.Subject_Name);
      const pyqs = qs.length;
      const marks = qs.reduce((acc, q) => acc + (q.marks || 1), 0);
      const sTopics = topics.filter((t) => t.Subject_Id === s.id);
      const topicCount = Math.max(1, sTopics.length);
      const density = marks / topicCount;
      map.set(s.id, { pyqs, marks, topicCount, density });
    });
    return map;
  }, [subjects, topics]);

  // Filter & Sort Subjects
  const filteredAndSortedSubjects = useMemo(() => {
    let result = [...subjects];

    // Filter search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.Subject_Name.toLowerCase().includes(q) ||
          (s.Subject_Description || '').toLowerCase().includes(q)
      );
    }

    // Filter importance
    if (selectedImportance !== 'all') {
      result = result.filter((s) => s.Subject_Importance === selectedImportance);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'high_scoring') {
        const dA = subjectMetrics.get(a.id)?.density || 0;
        const dB = subjectMetrics.get(b.id)?.density || 0;
        if (dB !== dA) return dB - dA;
        return a.Subject_Name.localeCompare(b.Subject_Name);
      }
      if (sortBy === 'marks') {
        const mA = subjectMetrics.get(a.id)?.marks || 0;
        const mB = subjectMetrics.get(b.id)?.marks || 0;
        if (mB !== mA) return mB - mA;
        return a.Subject_Name.localeCompare(b.Subject_Name);
      }
      if (sortBy === 'pyqs') {
        const pA = subjectMetrics.get(a.id)?.pyqs || 0;
        const pB = subjectMetrics.get(b.id)?.pyqs || 0;
        if (pB !== pA) return pB - pA;
        return a.Subject_Name.localeCompare(b.Subject_Name);
      }
      if (sortBy === 'importance') {
        return (
          IMPORTANCE_ORDER.indexOf(a.Subject_Importance) -
          IMPORTANCE_ORDER.indexOf(b.Subject_Importance)
        );
      }
      if (sortBy === 'name') {
        return a.Subject_Name.localeCompare(b.Subject_Name);
      }
      if (sortBy === 'progress') {
        const statsA = calculateTopicProgress(topics, a.id);
        const statsB = calculateTopicProgress(topics, b.id);
        return statsB.percentage - statsA.percentage;
      }
      if (sortBy === 'hours') {
        const statsA = calculateTopicProgress(topics, a.id);
        const statsB = calculateTopicProgress(topics, b.id);
        return statsB.totalHours - statsA.totalHours;
      }
      if (sortBy === 'recent') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

    return result;
  }, [subjects, topics, searchQuery, selectedImportance, sortBy, subjectMetrics]);

  return (
    <div className="space-y-8 pb-28">
      {/* Top Header & Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              My Subjects
            </h1>
            <span className="px-3 py-1 text-xs font-bold font-mono bg-brand-500/20 text-brand-300 rounded-full border border-brand-500/30">
              {subjects.length} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Organize curriculum, track hierarchical completion rates, and allocate focus time.
          </p>
        </div>

        {/* Primary Desktop Action */}
        <button
          onClick={() => {
            setSubjectToEdit(null);
            setAddModalOpen(true);
          }}
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-white font-bold text-sm shadow-glow-sm hover:shadow-glow transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Subject</span>
        </button>
      </div>

      {/* Top Stats Overview Bar */}
      <SubjectStatsBar />

      {/* Filter and Sort Toolbar */}
      <SubjectFilterSort
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedImportance={selectedImportance}
        onImportanceChange={setSelectedImportance}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Subjects Cards Grid */}
      {subjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Subjects Yet"
          description="Create your first subject to start organizing your study plan, hierarchy, and schedules."
          actionText="Add Subject"
          onAction={() => setAddModalOpen(true)}
          actionIcon={<Plus className="w-4 h-4" />}
        />
      ) : filteredAndSortedSubjects.length === 0 ? (
        <div className="py-20 text-center text-slate-400 rounded-3xl border border-dashed border-slate-800">
          No subjects matched your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEdit={(s) => {
                setSubjectToEdit(s);
                setAddModalOpen(true);
              }}
              onDelete={(s) => setSubjectToDelete(s)}
            />
          ))}
        </div>
      )}

      {/* REQUIRED BY SPEC (Section 7): Floating + button in the bottom-right */}
      <button
        onClick={() => {
          setSubjectToEdit(null);
          setAddModalOpen(true);
        }}
        aria-label="Add Subject"
        title="Add Subject (+)"
        className="fixed bottom-10 right-10 z-40 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 hover:from-brand-500 hover:to-indigo-400 text-white shadow-glow-lg hover:scale-110 active:scale-95 transition-all duration-300 border border-white/20"
      >
        <Plus className="w-8 h-8 stroke-[2.5]" />
      </button>

      {/* Add / Edit Subject Modal */}
      <AddSubjectModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setSubjectToEdit(null);
        }}
        subjectToEdit={subjectToEdit}
      />

      {/* Confirmation Modal for Delete Subject */}
      {subjectToDelete && (
        <ConfirmationModal
          isOpen={Boolean(subjectToDelete)}
          onClose={() => setSubjectToDelete(null)}
          onConfirm={() => {
            deleteSubject(subjectToDelete.id);
            setSubjectToDelete(null);
          }}
          title="Delete Subject"
          message={`Are you sure you want to permanently delete "${subjectToDelete.Subject_Name}"? All its topics, subtopics, and study sessions will also be deleted.`}
          confirmText="Delete Subject"
        />
      )}
    </div>
  );
};

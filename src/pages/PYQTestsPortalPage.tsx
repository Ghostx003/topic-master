import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  PYQTest,
  PYQTestConfig,
} from '../types/pyqTest';
import {
  loadTestHistory,
  deleteTest,
  generatePYQTest,
  evaluatePYQTest,
  getTestById,
  loadActiveTestSession,
} from '../services/pyqTestService';
import { CreateTestModal } from '../components/pyqTest/CreateTestModal';
import { TestDescriptionModal } from '../components/pyqTest/TestDescriptionModal';
import { PYQTestExamWorkspace } from '../components/pyqTest/PYQTestExamWorkspace';
import { PYQTestReportView } from '../components/pyqTest/PYQTestReportView';
import { formatDurationHuman } from '../utils/pyqIntelligence';
import {
  Award,
  Trophy,
  Plus,
  RotateCcw,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  Play,
  Search,
  Trash2,
  ExternalLink,
  Flame,
  FileQuestion,
} from 'lucide-react';
import { clsx } from 'clsx';

export const PYQTestsPortalPage: React.FC = () => {
  const { testId: urlTestId } = useParams<{ testId?: string }>();

  const [testHistory, setTestHistory] = useState<PYQTest[]>(() => loadTestHistory());
  const [activeExamTest, setActiveExamTest] = useState<PYQTest | null>(() => loadActiveTestSession());
  const [activeReportTest, setActiveReportTest] = useState<PYQTest | null>(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState<boolean>(false);
  const [pendingConfig, setPendingConfig] = useState<PYQTestConfig | null>(null);
  const [pendingAvailableCount, setPendingAvailableCount] = useState<number>(0);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState<string>('');

  // Handle URL navigation for testId
  useEffect(() => {
    if (urlTestId) {
      const found = getTestById(urlTestId);
      if (found) {
        if (found.status === 'completed') {
          setActiveReportTest(found);
          setActiveExamTest(null);
        } else {
          setActiveExamTest(found);
          setActiveReportTest(null);
        }
      }
    }
  }, [urlTestId]);

  // Refresh test history from localStorage
  const refreshHistory = () => {
    setTestHistory(loadTestHistory());
  };

  // Aggregated Overall History Metrics
  const historyStats = useMemo(() => {
    const completed = testHistory.filter((t) => t.status === 'completed');
    const totalTests = completed.length;
    const totalQuestions = completed.reduce((acc, t) => acc + (t.questions?.length || 0), 0);
    const avgAccuracy =
      totalTests > 0
        ? Math.round(completed.reduce((acc, t) => acc + (t.accuracy || 0), 0) / totalTests)
        : 0;
    const bestScore = completed.reduce((max, t) => Math.max(max, t.score || 0), 0);

    return {
      totalTests,
      totalQuestions,
      avgAccuracy,
      bestScore,
    };
  }, [testHistory]);

  // Filtered History
  const filteredHistory = useMemo(() => {
    const q = searchHistoryQuery.trim().toLowerCase();
    if (!q) return testHistory;
    return testHistory.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.config.subjectNames.some((s) => s.toLowerCase().includes(q)) ||
        (t.config.topicNames || []).some((top) => top.toLowerCase().includes(q))
    );
  }, [testHistory, searchHistoryQuery]);

  // Step 1 -> Step 2: From Create Modal to Description Modal
  const handleProceedToDescription = (config: PYQTestConfig, availableCount: number) => {
    setPendingConfig(config);
    setPendingAvailableCount(availableCount);
    setIsCreateModalOpen(false);
    setIsDescriptionModalOpen(true);
  };

  // Step 2 -> Step 3: From Description Modal to Active Exam Interface
  const handleBeginExam = () => {
    if (!pendingConfig) return;
    const newTest = generatePYQTest(pendingConfig);
    setIsDescriptionModalOpen(false);
    setActiveExamTest(newTest);
    setActiveReportTest(null);
  };

  // Complete Exam -> Evaluation -> Open Report
  const handleSubmitExam = (ongoingTest: PYQTest) => {
    const evaluated = evaluatePYQTest(ongoingTest);
    setActiveExamTest(null);
    setActiveReportTest(evaluated);
    refreshHistory();
  };

  // Retake Test (Re-creates same test configuration, randomized)
  const handleRetakeTest = (oldTest: PYQTest) => {
    const retakeConfig: PYQTestConfig = {
      ...oldTest.config,
      name: `${oldTest.config.name || 'GATE PYQ Mock'} (Retake)`,
      randomizeOrder: true,
    };
    const newTest = generatePYQTest(retakeConfig);
    setActiveReportTest(null);
    setActiveExamTest(newTest);
  };

  // Delete Test
  const handleDeleteTest = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTest(id);
    refreshHistory();
  };

  // Quick Preset Launch Handlers
  const handleLaunchPreset = (type: 'gate_mock' | 'high_yield' | 'quick_practice') => {
    let config: PYQTestConfig;

    if (type === 'gate_mock') {
      config = {
        name: `GATE CSE Full Mock Examination (65 Qs)`,
        years: [],
        yearRangeMode: 'all',
        subjectIds: ['all'],
        subjectNames: ['all'],
        topicIds: [],
        topicNames: [],
        topicFilterMode: 'all',
        questionTypes: ['all'],
        questionCount: 65,
        timePerQuestionSeconds: 166, // ~180 mins for 65 Qs
        totalDurationMinutes: 180,
        randomizeOrder: true,
      };
    } else if (type === 'high_yield') {
      config = {
        name: `High-Yield Important Topics Sprint`,
        years: [],
        yearRangeMode: 'all',
        subjectIds: ['all'],
        subjectNames: ['all'],
        topicIds: [],
        topicNames: [],
        topicFilterMode: 'important',
        questionTypes: ['all'],
        questionCount: 30,
        timePerQuestionSeconds: 90,
        totalDurationMinutes: 45,
        randomizeOrder: true,
      };
    } else {
      config = {
        name: `Quick 15-Question Practice Test`,
        years: [],
        yearRangeMode: 'all',
        subjectIds: ['all'],
        subjectNames: ['all'],
        topicIds: [],
        topicNames: [],
        topicFilterMode: 'recent',
        questionTypes: ['all'],
        questionCount: 15,
        timePerQuestionSeconds: 90,
        totalDurationMinutes: 22,
        randomizeOrder: true,
      };
    }

    const test = generatePYQTest(config);
    setActiveReportTest(null);
    setActiveExamTest(test);
  };

  // Render Fullscreen Exam Workspace if active
  if (activeExamTest) {
    return (
      <PYQTestExamWorkspace
        test={activeExamTest}
        onSubmitTest={handleSubmitExam}
        onExitTest={() => {
          setActiveExamTest(null);
          refreshHistory();
        }}
      />
    );
  }

  // Render Full Report if active
  if (activeReportTest) {
    return (
      <PYQTestReportView
        test={activeReportTest}
        onRetakeTest={handleRetakeTest}
        onBackToPortal={() => setActiveReportTest(null)}
      />
    );
  }

  return (
    <div className="space-y-8 pb-28 text-slate-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-400 text-white shadow-glow">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <span>PYQ Examination Portal</span>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Custom Test Platform
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Generate full mock examinations, subject sectional tests, and high-yield topic drills from 3,600+ PYQs.
              </p>
            </div>
          </div>
        </div>

        {/* Create New Test Trigger Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-black text-sm shadow-glow hover:shadow-glow-lg transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>+ Create New Test</span>
          </button>
        </div>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tests */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl flex items-center gap-4 shadow-sm">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">{historyStats.totalTests}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              Tests Completed
            </div>
          </div>
        </div>

        {/* Avg Accuracy */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl flex items-center gap-4 shadow-sm">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {historyStats.avgAccuracy}%
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              Avg Exam Accuracy
            </div>
          </div>
        </div>

        {/* Total Qs Practiced */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl flex items-center gap-4 shadow-sm">
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-cyan-400 font-mono">
              {historyStats.totalQuestions}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              Test Qs Attempted
            </div>
          </div>
        </div>

        {/* Best Score */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl flex items-center gap-4 shadow-sm">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {historyStats.bestScore}M
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              Highest Marks Scored
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Pre-configured Test Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>Quick Launch Exam Presets</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Preset 1: Full Mock */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-900/80 border border-indigo-500/30 flex flex-col justify-between space-y-4 hover:border-indigo-500/60 transition-all shadow-sm group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400">
                  <Award className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                  180 Min • 65 Qs
                </span>
              </div>
              <h4 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors">
                Full GATE CSE Mock Test
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard 65-question full examination covering all 13 subjects with authentic GATE time allocation.
              </p>
            </div>

            <button
              onClick={() => handleLaunchPreset('gate_mock')}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow-indigo active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Mock Test</span>
            </button>
          </div>

          {/* Preset 2: High Yield Sprint */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900/80 to-slate-900/80 border border-rose-500/30 flex flex-col justify-between space-y-4 hover:border-rose-500/60 transition-all shadow-sm group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400">
                  <Flame className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-500/40">
                  45 Min • 30 Qs
                </span>
              </div>
              <h4 className="text-base font-black text-white group-hover:text-rose-300 transition-colors">
                High-Yield Important Topics Sprint
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Focused sprint on the highest weightage topics determined algorithmically from historical GATE papers.
              </p>
            </div>

            <button
              onClick={() => handleLaunchPreset('high_yield')}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(244,63,94,0.3)] active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch High-Yield Test</span>
            </button>
          </div>

          {/* Preset 3: Quick Practice */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-900/80 border border-cyan-500/30 flex flex-col justify-between space-y-4 hover:border-cyan-500/60 transition-all shadow-sm group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400">
                  <Clock className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  22 Min • 15 Qs
                </span>
              </div>
              <h4 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
                Quick 15-Question Speed Drill
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quick examination focused on modern GATE questions (2018–2026) for fast daily warmup.
              </p>
            </div>

            <button
              onClick={() => handleLaunchPreset('quick_practice')}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-glow-cyan active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Speed Drill</span>
            </button>
          </div>
        </div>
      </div>

      {/* Test History Section */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-brand-400" />
              <span>Test History ({testHistory.length})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Review completed test analytics, reopen evaluation reports, or retake tests.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search previous tests..."
              value={searchHistoryQuery}
              onChange={(e) => setSearchHistoryQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-inner"
            />
          </div>
        </div>

        {/* History Cards Grid */}
        {filteredHistory.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
            <Award className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-300">No Tests Recorded Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click <strong>+ Create New Test</strong> above to generate your first customized mock examination.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHistory.map((t) => {
              const summary = t.resultSummary;
              const dateStr = new Date(t.completedAt || t.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const isStrong = (t.accuracy || 0) >= 70;
              const isNeedsWork = (t.accuracy || 0) < 50;

              return (
                <div
                  key={t.id}
                  onClick={() => setActiveReportTest(t)}
                  className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md cursor-pointer group select-none"
                >
                  <div className="space-y-2.5">
                    {/* Card Top: Title + Date */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="text-base font-black text-white group-hover:text-brand-300 transition-colors truncate">
                          {t.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span>{dateStr}</span>
                          <span>•</span>
                          <span className="font-mono">{t.questions.length} Questions</span>
                          <span>•</span>
                          <span className="font-mono">{formatDurationHuman(t.durationMinutes)}</span>
                        </div>
                      </div>

                      {/* Performance Badge */}
                      <span
                        className={clsx(
                          'px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0',
                          isStrong
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : isNeedsWork
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        )}
                      >
                        {isStrong ? 'Strong Performance' : isNeedsWork ? 'Needs Revision' : 'Moderate'}
                      </span>
                    </div>

                    {/* Score & Accuracy Metrics Row */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase block font-sans">
                          Marks Scored:
                        </span>
                        <span className="text-base font-black text-white">
                          {t.score} / {t.maxMarks}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px] uppercase block font-sans">
                          Accuracy:
                        </span>
                        <span className="text-base font-black text-cyan-400">{t.accuracy}%</span>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px] uppercase block font-sans">
                          Correct/Wrong:
                        </span>
                        <span className="text-xs font-bold text-slate-300">
                          {summary?.correctQuestions || 0}C • {summary?.incorrectQuestions || 0}W
                        </span>
                      </div>
                    </div>

                    {/* Subjects / Topics Tags */}
                    <div className="text-[11px] text-slate-400 truncate">
                      <span className="font-semibold text-slate-300">Subjects: </span>
                      {t.config.subjectNames.includes('all')
                        ? 'All 13 GATE CSE Subjects'
                        : t.config.subjectNames.join(', ')}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={(e) => handleDeleteTest(t.id, e)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all"
                      title="Delete test history entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetakeTest(t);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveReportTest(t);
                        }}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/40 text-xs font-bold hover:bg-brand-500/30 transition-all"
                      >
                        <span>View Report</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Test Modal Wizard */}
      <CreateTestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProceedToDescription={handleProceedToDescription}
      />

      {/* Pre-Test Description Modal */}
      {pendingConfig && (
        <TestDescriptionModal
          isOpen={isDescriptionModalOpen}
          onClose={() => {
            setIsDescriptionModalOpen(false);
            setIsCreateModalOpen(true);
          }}
          config={pendingConfig}
          availableQuestionsCount={pendingAvailableCount}
          onBeginTest={handleBeginExam}
        />
      )}
    </div>
  );
};

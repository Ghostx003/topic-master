import React, { useState, useMemo } from 'react';
import { PYQTest } from '../../types/pyqTest';
import { ALL_PYQ_ANSWERS } from '../../services/pyqTestService';
import { formatDurationHuman } from '../../utils/pyqIntelligence';
import {
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  ArrowLeft,
  Layers,
  Flame,
  Star,
  FolderTree,
  Calendar,
  ExternalLink,
  Printer,
  TrendingUp,
  HelpCircle,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface PYQTestReportViewProps {
  test: PYQTest;
  onRetakeTest: (test: PYQTest) => void;
  onBackToPortal: () => void;
}

export const PYQTestReportView: React.FC<PYQTestReportViewProps> = ({
  test,
  onRetakeTest,
  onBackToPortal,
}) => {
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'incorrect' | 'skipped' | 'unattempted'>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'subjects' | 'years' | 'questions'>('overview');

  const summary = test.resultSummary;

  // Filter questions for review
  const filteredReviewQuestions = useMemo(() => {
    return test.questions.filter((q) => {
      if (reviewFilter === 'all') return true;
      if (reviewFilter === 'correct') return Boolean(q.isCorrect);
      if (reviewFilter === 'incorrect') {
        const hasAns =
          q.userAnswer !== null &&
          q.userAnswer !== undefined &&
          q.userAnswer !== '' &&
          (!Array.isArray(q.userAnswer) || q.userAnswer.length > 0);
        return hasAns && !q.isCorrect;
      }
      if (reviewFilter === 'skipped') return q.status === 'skipped';
      if (reviewFilter === 'unattempted') {
        const hasAns =
          q.userAnswer !== null &&
          q.userAnswer !== undefined &&
          q.userAnswer !== '' &&
          (!Array.isArray(q.userAnswer) || q.userAnswer.length > 0);
        return !hasAns && q.status !== 'skipped';
      }
      return true;
    });
  }, [test.questions, reviewFilter]);

  const scorePercentage = summary?.percentageScore || 0;
  const accuracy = summary?.accuracyPercentage || 0;

  return (
    <div className="space-y-8 pb-28 animate-fade-in text-slate-200">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToPortal}
            className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all"
            title="Back to PYQ Tests Portal"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <span>{test.name}</span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Evaluation Report
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Completed on {new Date(test.completedAt || test.createdAt).toLocaleString()} • Total Duration:{' '}
              {formatDurationHuman(test.durationMinutes)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={() => onRetakeTest(test)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white text-xs font-black shadow-glow hover:shadow-glow-lg transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Test</span>
          </button>
        </div>
      </div>

      {/* Hero Score Banner Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Main Score Display */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-400 p-0.5 shadow-glow">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Overall Examination Score
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                  {summary?.totalMarksScored}
                </span>
                <span className="text-xl font-bold font-mono text-slate-400">
                  / {summary?.maxMarksPossible} Marks
                </span>
              </div>
              <div className="text-xs font-mono font-bold text-emerald-400 mt-1">
                {scorePercentage}% Aggregate Score • {accuracy}% Accuracy on Attempted Questions
              </div>
            </div>
          </div>

          {/* Time Breakdown */}
          <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <Clock className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Time Spent / Allocated
              </div>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                {Math.round((summary?.timeTakenSeconds || 0) / 60)} min / {test.durationMinutes} min
              </div>
            </div>
          </div>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Correct */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black font-mono text-emerald-400">
                {summary?.correctQuestions}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                Correct Qs
              </div>
            </div>
          </div>

          {/* Incorrect */}
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black font-mono text-rose-400">
                {summary?.incorrectQuestions}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-300/80">
                Incorrect Qs
              </div>
            </div>
          </div>

          {/* Skipped */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black font-mono text-purple-400">
                {summary?.skippedQuestions}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-300/80">
                Skipped Qs
              </div>
            </div>
          </div>

          {/* Unattempted */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black font-mono text-slate-300">
                {summary?.unattemptedQuestions}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Unattempted
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Detailed Sections */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto custom-scrollbar">
        {[
          { id: 'overview', label: 'Analysis Overview', icon: TrendingUp },
          { id: 'topics', label: 'Topic Performance & Weaknesses', icon: FolderTree, count: summary?.topicBreakdown.length },
          { id: 'subjects', label: 'Subject Breakdown', icon: Layers, count: summary?.subjectBreakdown.length },
          { id: 'years', label: 'Year Analysis', icon: Calendar, count: summary?.yearBreakdown.length },
          { id: 'questions', label: 'Question-by-Question Solutions', icon: CheckCircle2, count: test.questions.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all select-none border',
                isSelected
                  ? 'bg-brand-500/20 text-brand-200 border-brand-500/40 shadow-glow-sm ring-1 ring-brand-400/40'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-850'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.2 rounded-md bg-black/40 text-[10px] font-mono font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW (Dynamic Weak vs Strong Topics Highlights) */}
      {(activeTab === 'overview' || activeTab === 'topics') && (
        <div className="space-y-6">
          {/* Dynamic AI Insights / Work On vs Strongest Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weak Topics to Work On */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-rose-500/30 shadow-lg space-y-3">
              <div className="flex items-center gap-2.5 text-rose-400">
                <Flame className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Topics You Need To Work On
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prioritize revision for these topics having the highest error rates in your attempt:
              </p>

              {summary?.weakTopics && summary.weakTopics.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {summary.weakTopics.slice(0, 8).map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold shadow-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-400 italic">
                  ✓ Excellent performance! No severe topic deficiencies detected.
                </p>
              )}
            </div>

            {/* Strong Topics */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/30 shadow-lg space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <Star className="w-5 h-5 fill-current" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Your Strongest Topics
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                High accuracy and consistent correct answers demonstrated in these core areas:
              </p>

              {summary?.strongTopics && summary.strongTopics.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {summary.strongTopics.slice(0, 8).map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Keep practicing to establish high-accuracy strong topic mastery.
                </p>
              )}
            </div>
          </div>

          {/* Topic Performance Analysis Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-cyan-400" />
              <span>Topic Performance Breakdown</span>
            </h3>

            <div className="overflow-x-auto custom-scrollbar border border-slate-800 rounded-2xl bg-slate-900/40">
              <table className="w-full text-left text-xs text-slate-200 min-w-[700px]">
                <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Topic</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-3 py-3 text-center">Correct</th>
                    <th className="px-3 py-3 text-center">Wrong</th>
                    <th className="px-3 py-3 text-center">Skipped</th>
                    <th className="px-3 py-3 text-center">Accuracy</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {summary?.topicBreakdown.map((t) => (
                    <tr key={t.topic} className="hover:bg-slate-850/40 transition-colors">
                      <td className="px-4 py-3 font-bold text-white">{t.topic}</td>
                      <td className="px-4 py-3 text-slate-400">{t.subject}</td>
                      <td className="px-3 py-3 text-center font-mono font-bold text-emerald-400">
                        {t.correct}
                      </td>
                      <td className="px-3 py-3 text-center font-mono font-bold text-rose-400">
                        {t.incorrect}
                      </td>
                      <td className="px-3 py-3 text-center font-mono text-purple-400">
                        {t.skipped}
                      </td>
                      <td className="px-3 py-3 text-center font-mono font-bold text-cyan-300">
                        {t.accuracy}%
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={clsx(
                            'px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider',
                            t.status === 'Strong'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : t.status === 'Needs Work'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          )}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBJECTS */}
      {activeTab === 'subjects' && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Subject-Level Accuracy & Score Analysis</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {summary?.subjectBreakdown.map((s) => (
              <div
                key={s.subject}
                className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">{s.subject}</h4>
                  <span className="text-sm font-mono font-black text-cyan-400">
                    {s.accuracy}% Accuracy
                  </span>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full"
                    style={{ width: `${s.accuracy}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
                  <span>
                    Score: <strong>{s.marksScored}</strong> / {s.maxMarks} Marks
                  </span>
                  <span>
                    {s.correct} Correct • {s.incorrect} Wrong
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: YEARS */}
      {activeTab === 'years' && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-400" />
            <span>Year-Wise Performance Distribution</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {summary?.yearBreakdown.map((y) => (
              <div
                key={y.year}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1"
              >
                <div className="text-xs font-bold font-mono text-slate-300">{y.year}</div>
                <div className="text-xl font-black font-mono text-white">{y.accuracy}%</div>
                <div className="text-[10px] font-mono text-slate-500">
                  {y.correct}/{y.total} Qs
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: QUESTION-BY-QUESTION REVIEW */}
      {(activeTab === 'overview' || activeTab === 'questions') && (
        <div className="space-y-6 pt-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Question-by-Question Detailed Review</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect your responses compared against official verified GATE solutions and explanations.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-slate-400 text-xs font-semibold mr-1">Filter:</span>
              {[
                { id: 'all', label: `All (${test.questions.length})` },
                { id: 'correct', label: `Correct (${summary?.correctQuestions || 0})` },
                { id: 'incorrect', label: `Incorrect (${summary?.incorrectQuestions || 0})` },
                { id: 'skipped', label: `Skipped (${summary?.skippedQuestions || 0})` },
                { id: 'unattempted', label: `Unattempted (${summary?.unattemptedQuestions || 0})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setReviewFilter(f.id as any)}
                  className={clsx(
                    'px-3 py-1.5 rounded-xl font-bold border transition-all text-xs',
                    reviewFilter === f.id
                      ? 'bg-brand-500/20 border-brand-400 text-brand-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Questions Cards List */}
          <div className="space-y-4">
            {filteredReviewQuestions.map((item) => {
              const qId = item.questionId;
              const ansMeta = ALL_PYQ_ANSWERS[qId];
              const isCorrect = Boolean(item.isCorrect);
              const hasAnswer =
                item.userAnswer !== null &&
                item.userAnswer !== undefined &&
                item.userAnswer !== '' &&
                (!Array.isArray(item.userAnswer) || item.userAnswer.length > 0);

              const formattedUserAnswer = Array.isArray(item.userAnswer)
                ? item.userAnswer.join(', ')
                : item.userAnswer !== null && item.userAnswer !== undefined
                ? String(item.userAnswer)
                : 'Not Answered';

              const formattedCorrectAnswer =
                typeof ansMeta?.correct_answer === 'object' &&
                ansMeta.correct_answer !== null &&
                'min' in ansMeta.correct_answer
                  ? `${ansMeta.correct_answer.min} to ${ansMeta.correct_answer.max}`
                  : Array.isArray(ansMeta?.correct_answer)
                  ? ansMeta.correct_answer.join(', ')
                  : String(ansMeta?.correct_answer || 'Verified Key');

              return (
                <div
                  key={item.questionId}
                  className={clsx(
                    'p-5 rounded-3xl border transition-all space-y-4',
                    isCorrect
                      ? 'bg-slate-900/60 border-emerald-500/30'
                      : hasAnswer
                      ? 'bg-slate-900/60 border-rose-500/30'
                      : 'bg-slate-900/40 border-slate-800'
                  )}
                >
                  {/* Question Header Badge */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800/60">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-200">
                        Q{item.orderIndex + 1}
                      </span>
                      <span className="font-bold text-xs text-white">
                        {item.sectionName} • {item.question.chapter || item.question.topic}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ({item.question.year} Q{item.question.questionNumber})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        {item.question.marks || 1}M
                      </span>

                      {isCorrect ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>+{item.marksAwarded} Marks</span>
                        </span>
                      ) : hasAnswer ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-rose-950 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{item.marksAwarded} Marks</span>
                        </span>
                      ) : item.status === 'skipped' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-purple-950 text-purple-300 border border-purple-500/40">
                          Skipped
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-800 text-slate-400">
                          Unattempted
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Comparison Box: Your Answer vs Correct Answer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      className={clsx(
                        'p-3.5 rounded-2xl border text-xs font-mono',
                        isCorrect
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                          : hasAnswer
                          ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      )}
                    >
                      <div className="text-[10px] font-sans font-bold uppercase tracking-wider opacity-75 mb-1">
                        Your Submitted Response:
                      </div>
                      <div className="text-sm font-bold">{formattedUserAnswer}</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
                      <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Official Verified Answer:
                      </div>
                      <div className="text-sm font-bold">{formattedCorrectAnswer}</div>
                    </div>
                  </div>

                  {/* Verified Solution & GateOverflow Reference */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Source & Solution Explanation:</span>
                      </span>

                      <a
                        href={item.question.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300 hover:underline cursor-pointer"
                      >
                        <span>Discussion Forum Solution</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {ansMeta?.explanation ||
                        `Official answer key solution verified for ${item.question.chapter}. Check step-by-step mathematical breakdown on GateOverflow.`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

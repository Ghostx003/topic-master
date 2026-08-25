import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PYQQuestion, PYQProgressMap, PYQDifficultyStatus, PYQItemProgress } from '../../types/pyq';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  ExternalLink,
  PanelLeftClose,
  PanelLeft,
  Search,
  Edit3,
  Timer,
  Maximize2,
  Minimize2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface PYQPracticeWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  topicName: string;
  subjectName: string;
  questions: PYQQuestion[];
  initialQuestionIndex?: number;
  progress: PYQProgressMap;
  onUpdateProgress: (questionId: string, updates: Partial<PYQItemProgress>) => void;
}

export const PYQPracticeWorkspace: React.FC<PYQPracticeWorkspaceProps> = ({
  isOpen,
  onClose,
  topicName,
  subjectName,
  questions,
  initialQuestionIndex = 0,
  progress,
  onUpdateProgress,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialQuestionIndex);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState<boolean>(true);
  const [playlistSearch, setPlaylistSearch] = useState<string>('');
  const [playlistTab, setPlaylistTab] = useState<'all' | 'pending' | 'completed' | 'doubts'>('all');
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'embedded' | 'scratchpad'>('embedded');
  const [notes, setNotes] = useState<string>('');
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const playlistItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<any>(null);

  // Synchronize initial question index on open
  useEffect(() => {
    if (isOpen) {
      const idx = Math.min(Math.max(0, initialQuestionIndex), Math.max(0, questions.length - 1));
      setCurrentIndex(idx);
      setIframeLoading(true);
      setTimerSeconds(0);
      setIsTimerRunning(true);
    }
  }, [isOpen, initialQuestionIndex, questions.length]);

  const activeQuestion = questions[currentIndex] || questions[0];

  // Sync notes with active question
  useEffect(() => {
    if (activeQuestion) {
      setNotes(progress[activeQuestion.id]?.notes || '');
      setIframeLoading(true);
      setTimerSeconds(0);
    }
  }, [activeQuestion?.id]);

  // Question Timer
  useEffect(() => {
    if (isOpen && isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isOpen, isTimerRunning]);

  // Scroll active item into view in playlist
  useEffect(() => {
    if (isPlaylistOpen && playlistItemRefs.current[currentIndex]) {
      playlistItemRefs.current[currentIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentIndex, isPlaylistOpen]);

  // Filtered playlist questions
  const filteredPlaylistQuestions = useMemo(() => {
    return questions.filter((q) => {
      const itemProgress = progress[q.id];
      const isDone = Boolean(itemProgress?.completed);
      const isDoubt = Boolean(itemProgress?.isDoubt);

      if (playlistTab === 'pending' && isDone) return false;
      if (playlistTab === 'completed' && !isDone) return false;
      if (playlistTab === 'doubts' && !isDoubt) return false;

      if (playlistSearch.trim()) {
        const query = playlistSearch.toLowerCase().trim();
        const matchYear = q.year.toLowerCase().includes(query);
        const matchNum = `q${q.questionNumber}`.toLowerCase().includes(query) || `${q.questionNumber}`.toLowerCase() === query;
        const matchType = (q.type_of_question || 'MCQ').toLowerCase().includes(query);
        const matchTopic = (q.topic || q.chapter || '').toLowerCase().includes(query);
        if (!matchYear && !matchNum && !matchType && !matchTopic) return false;
      }

      return true;
    });
  }, [questions, progress, playlistTab, playlistSearch]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing inside textarea or input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case '[':
        case 'k':
          e.preventDefault();
          handlePrevQuestion();
          break;
        case 'ArrowRight':
        case ']':
        case 'j':
          e.preventDefault();
          handleNextQuestion();
          break;
        case 'm':
        case 'c':
          e.preventDefault();
          if (activeQuestion) handleToggleCompleted();
          break;
        case 'd':
          e.preventDefault();
          if (activeQuestion) handleToggleDoubt();
          break;
        case '1':
          if (activeQuestion) handleSetDifficulty('easy');
          break;
        case '2':
          if (activeQuestion) handleSetDifficulty('medium');
          break;
        case '3':
          if (activeQuestion) handleSetDifficulty('hard');
          break;
        case '4':
          if (activeQuestion) handleSetDifficulty('skip');
          break;
        case 'o':
          if (activeQuestion) window.open(activeQuestion.link, '_blank');
          break;
        case '\\':
          e.preventDefault();
          setIsPlaylistOpen((prev) => !prev);
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, activeQuestion, questions.length]);

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleToggleCompleted = () => {
    if (!activeQuestion) return;
    const currentCompleted = Boolean(progress[activeQuestion.id]?.completed);
    onUpdateProgress(activeQuestion.id, { completed: !currentCompleted });
  };

  const handleToggleDoubt = () => {
    if (!activeQuestion) return;
    const currentDoubt = Boolean(progress[activeQuestion.id]?.isDoubt);
    onUpdateProgress(activeQuestion.id, { isDoubt: !currentDoubt });
  };

  const handleSetDifficulty = (diff: PYQDifficultyStatus) => {
    if (!activeQuestion) return;
    const currentDiff = progress[activeQuestion.id]?.difficulty;
    onUpdateProgress(activeQuestion.id, {
      difficulty: currentDiff === diff ? 'none' : diff,
    });
  };

  const handleSaveNotes = (val: string) => {
    setNotes(val);
    if (!activeQuestion) return;
    onUpdateProgress(activeQuestion.id, { notes: val });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen || !activeQuestion) return null;

  const currentProgress = progress[activeQuestion.id] || { completed: false };
  const isCompleted = Boolean(currentProgress.completed);
  const isDoubt = Boolean(currentProgress.isDoubt);
  const difficulty = currentProgress.difficulty || 'none';

  // Format timer seconds to MM:SS
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[120] flex flex-col bg-[#030712] text-slate-100 overflow-hidden select-none animate-fade-in font-sans"
    >
      {/* ================= WORKSPACE TOP CONTROL BAR ================= */}
      <header className="h-14 px-4 sm:px-6 bg-[#090e1a]/95 border-b border-slate-800/90 backdrop-blur-2xl shrink-0 flex items-center justify-between gap-3 z-30 shadow-md">
        {/* Left Side: Playlist Toggle + Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={() => setIsPlaylistOpen((prev) => !prev)}
            className={clsx(
              'p-2 rounded-xl border transition-all active:scale-95 shrink-0',
              isPlaylistOpen
                ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
            )}
            title={isPlaylistOpen ? 'Collapse Playlist (\\)' : 'Expand Playlist (\\)'}
          >
            {isPlaylistOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2 truncate">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 shrink-0 hidden md:inline">
              {subjectName}
            </span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="text-sm font-bold text-white truncate group-hover:text-brand-300">
              {topicName}
            </span>
            <span className="text-xs font-mono font-bold text-brand-300 bg-brand-500/15 border border-brand-500/30 px-2 py-0.5 rounded-lg shrink-0">
              Q {currentIndex + 1} of {questions.length}
            </span>
          </div>
        </div>

        {/* Center: Prev / Next Navigation */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
            className={clsx(
              'flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95',
              currentIndex === 0
                ? 'opacity-40 bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border-slate-800 hover:border-slate-700'
            )}
            title="Previous Question (← or [)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={currentIndex === questions.length - 1}
            className={clsx(
              'flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95',
              currentIndex === questions.length - 1
                ? 'opacity-40 bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border-slate-800 hover:border-slate-700'
            )}
            title="Next Question (→ or ])"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: Active Question Status Actions & View Options */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Question Practice Timer */}
          <div
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={clsx(
              'hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer select-none',
              isTimerRunning
                ? 'bg-slate-900 text-brand-300 border-brand-500/30'
                : 'bg-slate-950 text-slate-500 border-slate-900'
            )}
            title="Click to Pause/Resume Question Timer"
          >
            <Timer className={clsx('w-3.5 h-3.5', isTimerRunning ? 'text-brand-400 animate-pulse' : 'text-slate-500')} />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          {/* Mark as Done Toggle */}
          <button
            onClick={handleToggleCompleted}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95',
              isCompleted
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/30'
                : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
            )}
            title="Toggle Completed (M or C)"
          >
            <CheckCircle2 className={clsx('w-3.5 h-3.5', isCompleted ? 'text-emerald-400' : 'text-slate-500')} />
            <span className="hidden sm:inline">{isCompleted ? 'Done' : 'Mark Done'}</span>
          </button>

          {/* Doubt Star Toggle */}
          <button
            onClick={handleToggleDoubt}
            className={clsx(
              'p-2 rounded-xl border transition-all active:scale-95',
              isDoubt
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.3)] ring-1 ring-amber-500/30'
                : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
            )}
            title="Toggle Doubt / Review Needed (D)"
          >
            <Star className={clsx('w-4 h-4', isDoubt ? 'text-amber-400 fill-current' : 'text-slate-400')} />
          </button>

          {/* Open in GateOverflow button */}
          <a
            href={activeQuestion.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-all active:scale-95"
            title="Open on official GateOverflow page (O)"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden md:flex p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-all active:scale-95"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Exit Practice Workspace */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-700/60 transition-all active:scale-95 ml-1"
            title="Close Practice Workspace (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ================= WORKSPACE BODY (SPLIT PANE) ================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ================= LEFT PANEL: QUESTION PLAYLIST ================= */}
        <aside
          className={clsx(
            'flex flex-col bg-[#060a14] border-r border-slate-800/80 shrink-0 transition-all duration-300 ease-in-out z-20',
            isPlaylistOpen
              ? 'w-full sm:w-80 md:w-88 lg:w-96 opacity-100'
              : 'w-0 opacity-0 overflow-hidden border-none pointer-events-none'
          )}
        >
          {/* Playlist Filter Tabs & Search */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-950/60 space-y-2 shrink-0">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 text-[11px] font-bold">
              <button
                onClick={() => setPlaylistTab('all')}
                className={clsx(
                  'flex-1 py-1 rounded-lg text-center transition-all',
                  playlistTab === 'all'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                All ({questions.length})
              </button>
              <button
                onClick={() => setPlaylistTab('pending')}
                className={clsx(
                  'flex-1 py-1 rounded-lg text-center transition-all',
                  playlistTab === 'pending'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                Pending
              </button>
              <button
                onClick={() => setPlaylistTab('completed')}
                className={clsx(
                  'flex-1 py-1 rounded-lg text-center transition-all',
                  playlistTab === 'completed'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                Done
              </button>
              <button
                onClick={() => setPlaylistTab('doubts')}
                className={clsx(
                  'flex-1 py-1 rounded-lg text-center transition-all',
                  playlistTab === 'doubts'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                Doubts ⭐
              </button>
            </div>

            {/* Playlist Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={playlistSearch}
                onChange={(e) => setPlaylistSearch(e.target.value)}
                placeholder="Search by year, Q#, type..."
                className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50"
              />
              {playlistSearch && (
                <button
                  onClick={() => setPlaylistSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Question Items Scrollable List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
            {filteredPlaylistQuestions.map((q) => {
              const originalIndex = questions.findIndex((orig) => orig.id === q.id);
              const isSelected = originalIndex === currentIndex;
              const qProg = progress[q.id] || { completed: false };
              const isQDone = Boolean(qProg.completed);
              const isQDoubt = Boolean(qProg.isDoubt);
              const qDiff = qProg.difficulty || 'none';
              const rawType = q.type_of_question || 'MCQ';

              return (
                <button
                  key={q.id}
                  ref={(el) => {
                    playlistItemRefs.current[originalIndex] = el;
                  }}
                  onClick={() => {
                    setCurrentIndex(originalIndex);
                    // On small screen, automatically collapse playlist on selection
                    if (window.innerWidth < 768) {
                      setIsPlaylistOpen(false);
                    }
                  }}
                  className={clsx(
                    'w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 group relative select-none',
                    isSelected
                      ? 'bg-brand-500/15 border-brand-500/60 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-brand-500/40 text-white'
                      : isQDone
                      ? 'bg-slate-950/40 border-slate-850/60 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                      : 'bg-slate-950/80 border-slate-800/80 text-slate-300 hover:bg-slate-900/90 hover:border-slate-700'
                  )}
                >
                  {/* Left Active Indicator Bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-brand-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  )}

                  {/* Index / Done State Icon */}
                  <div className="shrink-0 mt-0.5">
                    {isQDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span
                        className={clsx(
                          'w-5 h-5 rounded-lg text-[10px] font-mono font-black flex items-center justify-center border',
                          isSelected
                            ? 'bg-brand-500 text-white border-brand-400'
                            : 'bg-slate-900 text-slate-400 border-slate-800 group-hover:border-slate-700'
                        )}
                      >
                        {originalIndex + 1}
                      </span>
                    )}
                  </div>

                  {/* Metadata Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <span
                        className={clsx(
                          'font-bold text-xs truncate',
                          isSelected ? 'text-brand-300' : 'text-slate-200 group-hover:text-white'
                        )}
                      >
                        Question {q.questionNumber}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {isQDoubt && <Star className="w-3 h-3 text-amber-400 fill-current" />}
                        {qDiff !== 'none' && (
                          <span
                            className={clsx(
                              'w-2 h-2 rounded-full',
                              qDiff === 'easy'
                                ? 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]'
                                : qDiff === 'medium'
                                ? 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                                : qDiff === 'hard'
                                ? 'bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.6)]'
                                : 'bg-slate-500'
                            )}
                            title={`Difficulty: ${qDiff}`}
                          />
                        )}
                      </div>
                    </div>

                    {/* Subtitle: Year & Chapter */}
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      <span>{q.year}</span>
                      {q.topic && q.topic !== topicName && (
                        <span className="text-slate-500 ml-1">• {q.topic}</span>
                      )}
                    </div>

                    {/* Bottom Badges: Marks & Type */}
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span
                        className={clsx(
                          'text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border',
                          rawType === 'MSQ'
                            ? 'bg-purple-950/70 text-purple-300 border-purple-500/30'
                            : rawType === 'NAT'
                            ? 'bg-amber-950/70 text-amber-300 border-amber-500/30'
                            : rawType === 'Descriptive'
                            ? 'bg-indigo-950/70 text-indigo-300 border-indigo-500/30'
                            : 'bg-blue-950/70 text-blue-300 border-blue-500/30'
                        )}
                      >
                        {rawType}
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                        {q.marks || 1}M
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredPlaylistQuestions.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-xs">
                No questions found matching your filter.
              </div>
            )}
          </div>
        </aside>

        {/* ================= RIGHT PANEL: QUESTION PRACTICE VIEWPORT ================= */}
        <main className="flex-1 h-full flex flex-col bg-[#02040a] relative overflow-hidden">
          {/* Sub-Header Toolbar for Active Question */}
          <div className="h-10 px-4 bg-[#070c18] border-b border-slate-800/70 flex items-center justify-between gap-3 text-xs shrink-0 z-10">
            {/* Question Info Bar */}
            <div className="flex items-center gap-2 truncate">
              <span className="font-mono font-black text-slate-200">
                {activeQuestion.year} • Question {activeQuestion.questionNumber}
              </span>
              <span className="text-slate-600">•</span>
              <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 rounded">
                {activeQuestion.marks || 1} {activeQuestion.marks === 1 ? 'Mark' : 'Marks'}
              </span>
              <span
                className={clsx(
                  'font-mono font-bold px-1.5 rounded border text-[10px]',
                  activeQuestion.type_of_question === 'MSQ'
                    ? 'bg-purple-950/70 text-purple-300 border-purple-500/30'
                    : activeQuestion.type_of_question === 'NAT'
                    ? 'bg-amber-950/70 text-amber-300 border-amber-500/30'
                    : activeQuestion.type_of_question === 'Descriptive'
                    ? 'bg-indigo-950/70 text-indigo-300 border-indigo-500/30'
                    : 'bg-blue-950/70 text-blue-300 border-blue-500/30'
                )}
              >
                {activeQuestion.type_of_question || 'MCQ'}
              </span>
            </div>

            {/* View Mode & Difficulty Quick Radios */}
            <div className="flex items-center gap-2">
              {/* Difficulty Status Radios */}
              <div className="hidden sm:flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800/80 text-[10px] font-bold">
                {(['easy', 'medium', 'hard', 'skip'] as PYQDifficultyStatus[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleSetDifficulty(lvl)}
                    className={clsx(
                      'px-2 py-0.5 rounded capitalize transition-all',
                      difficulty === lvl
                        ? lvl === 'easy'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                          : lvl === 'medium'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                          : lvl === 'hard'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
                          : 'bg-slate-800 text-slate-200'
                        : 'text-slate-400 hover:text-slate-200'
                    )}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* View Switcher Button */}
              <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setViewMode('embedded')}
                  className={clsx(
                    'px-2.5 py-0.5 rounded text-[11px] font-bold transition-all',
                    viewMode === 'embedded'
                      ? 'bg-brand-500 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                  title="View Embedded Question Page"
                >
                  Browser
                </button>
                <button
                  onClick={() => setViewMode('scratchpad')}
                  className={clsx(
                    'px-2.5 py-0.5 rounded text-[11px] font-bold transition-all',
                    viewMode === 'scratchpad'
                      ? 'bg-brand-500 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                  title="View Scratchpad & Focus Mode"
                >
                  Scratchpad
                </button>
              </div>
            </div>
          </div>

          {/* Main Viewport Content */}
          <div className="flex-1 w-full h-full relative overflow-hidden">
            {viewMode === 'embedded' ? (
              <div className="w-full h-full relative flex flex-col">
                {/* Fallback Banner on Top */}
                <div className="px-4 py-1.5 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between gap-3 text-[11px] text-slate-400 shrink-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <Sparkles className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span className="truncate">
                      Practicing on GateOverflow. If embed is restricted by security policy, use official link.
                    </span>
                  </div>
                  <a
                    href={activeQuestion.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-brand-400 hover:text-brand-300 font-bold shrink-0 underline"
                  >
                    <span>Open Official Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Iframe Viewport Container */}
                <div className="flex-1 w-full h-full relative bg-[#090e1a]">
                  {iframeLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#030712]/90 backdrop-blur-sm">
                      <div className="w-8 h-8 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        Loading Question Page...
                      </span>
                    </div>
                  )}

                  <iframe
                    key={activeQuestion.id}
                    src={activeQuestion.link}
                    onLoad={() => setIframeLoading(false)}
                    className="w-full h-full border-0 bg-white"
                    title={`Question ${activeQuestion.questionNumber}`}
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  />
                </div>
              </div>
            ) : (
              /* Scratchpad / Focus Card View */
              <div className="w-full h-full p-6 sm:p-10 overflow-y-auto custom-scrollbar flex flex-col max-w-4xl mx-auto space-y-6">
                {/* Main Focus Card */}
                <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {activeQuestion.year}
                        </span>
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                          {activeQuestion.marks || 1} {activeQuestion.marks === 1 ? 'Mark' : 'Marks'}
                        </span>
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300">
                          {activeQuestion.type_of_question || 'MCQ'}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
                        Question {activeQuestion.questionNumber}
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">
                        {topicName} • {subjectName}
                      </p>
                    </div>

                    <a
                      href={activeQuestion.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all active:scale-95"
                    >
                      <span>Open Question Page</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Question Notes & Scratchpad */}
                  <div className="space-y-2 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Edit3 className="w-4 h-4 text-brand-400" />
                        <span>Working Notes / Solution Scratchpad</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Auto-saved locally
                      </span>
                    </div>
                    <textarea
                      value={notes}
                      onChange={(e) => handleSaveNotes(e.target.value)}
                      placeholder="Write your rough calculations, final numerical answer, or revision notes here..."
                      rows={8}
                      className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/60 transition-colors custom-scrollbar"
                    />
                  </div>
                </div>

                {/* Keyboard Shortcuts Guide */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 font-bold text-slate-300">
                    <HelpCircle className="w-4 h-4 text-brand-400" />
                    <span>Keyboard Shortcuts:</span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap font-mono text-[11px]">
                    <span><kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded">←</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded">[</kbd> Prev</span>
                    <span><kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded">→</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded">]</kbd> Next</span>
                    <span><kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded">M</kbd> Done</span>
                    <span><kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded">D</kbd> Doubt</span>
                    <span><kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded">\</kbd> Toggle Playlist</span>
                    <span><kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded">Esc</kbd> Exit</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

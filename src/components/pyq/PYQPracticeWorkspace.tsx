import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PYQQuestion, PYQProgressMap, PYQDifficultyStatus, PYQItemProgress } from '../../types/pyq';
import {
  getQuestionScreenshot,
  requestCaptureSpecificPage,
} from '../../services/screenshotService';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  XCircle,
  ExternalLink,
  PanelLeftClose,
  PanelLeft,
  Search,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Camera,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  getQuestionAnswerMetadata,
  evaluateSingleAnswer,
} from '../../services/pyqTestService';
import { EditAnswerKeyModal } from './EditAnswerKeyModal';

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

  // Screenshot State
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [isScreenshotLoading, setIsScreenshotLoading] = useState<boolean>(true);
  const [isCapturingSpecific, setIsCapturingSpecific] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Per-question Timer State (resets on each question navigation)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Scratchpad State
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Interactive Answer Check & Issue States
  const [userAnswer, setUserAnswer] = useState<string | string[] | number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<ReturnType<typeof evaluateSingleAnswer> | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const playlistItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<any>(null);
  const activeQuestionRef = useRef<PYQQuestion | null>(null);

  // Synchronize on open or change in question index
  useEffect(() => {
    if (isOpen) {
      const idx = Math.min(Math.max(0, initialQuestionIndex), Math.max(0, questions.length - 1));
      setCurrentIndex(idx);
    }
  }, [isOpen, initialQuestionIndex, questions.length]);

  const activeQuestion = questions[currentIndex] || questions[0];
  activeQuestionRef.current = activeQuestion;

  // Load screenshot for current active question
  useEffect(() => {
    if (!activeQuestion) return;

    let isMounted = true;
    setIsScreenshotLoading(true);
    setScreenshotData(null);
    setZoomLevel(100);

    getQuestionScreenshot(activeQuestion.id).then((imgData) => {
      if (isMounted) {
        setScreenshotData(imgData);
        setIsScreenshotLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [activeQuestion?.id]);

  // Listen for real-time screenshot updates from Chrome extension
  useEffect(() => {
    const handleScreenshotUpdated = (e: any) => {
      if (e.detail && activeQuestion && e.detail.questionId === activeQuestion.id) {
        setScreenshotData(e.detail.dataUrl);
        setIsScreenshotLoading(false);
        setIsCapturingSpecific(false);
      }
    };

    window.addEventListener('pyq_screenshot_updated', handleScreenshotUpdated);
    return () => window.removeEventListener('pyq_screenshot_updated', handleScreenshotUpdated);
  }, [activeQuestion?.id]);

  // Active Question Answer Metadata (reactive to updates)
  const [activeMeta, setActiveMeta] = useState(() =>
    getQuestionAnswerMetadata(activeQuestion?.id || '')
  );

  // Reset timer and answer inputs whenever moving to a new question
  useEffect(() => {
    if (activeQuestion) {
      setElapsedSeconds(0);
      setNotes(progress[activeQuestion.id]?.notes || '');
      setIsTimerRunning(true);
      setActiveMeta(getQuestionAnswerMetadata(activeQuestion.id));
      setUserAnswer(null);
      setIsAnswerChecked(false);
      setCheckResult(null);
      setShowExplanation(false);
    }
  }, [activeQuestion?.id]);

  // Listen for global answer key updates
  useEffect(() => {
    const handleAnswerUpdated = (e: any) => {
      if (activeQuestion && e.detail && e.detail.questionId === activeQuestion.id) {
        const freshMeta = getQuestionAnswerMetadata(activeQuestion.id);
        setActiveMeta(freshMeta);
        if (isAnswerChecked) {
          const reEval = evaluateSingleAnswer(activeQuestion.id, userAnswer, freshMeta.question_type);
          setCheckResult(reEval);
        }
      }
    };
    window.addEventListener('pyq_answer_key_updated', handleAnswerUpdated);
    return () => window.removeEventListener('pyq_answer_key_updated', handleAnswerUpdated);
  }, [activeQuestion?.id, isAnswerChecked, userAnswer]);

  // Handle Check Answer Click
  const handleCheckAnswer = () => {
    if (!activeQuestion) return;
    const res = evaluateSingleAnswer(
      activeQuestion.id,
      userAnswer,
      activeMeta.question_type || (activeQuestion.type_of_question as any) || 'MCQ'
    );
    setCheckResult(res);
    setIsAnswerChecked(true);
    setShowExplanation(true);
  };

  // Timer Tick
  useEffect(() => {
    if (isOpen && isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
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

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') target.blur();
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
          if (activeQuestion) window.open(activeQuestion.link, '_blank', 'noopener,noreferrer');
          break;
        case 't':
        case ' ':
          e.preventDefault();
          setIsTimerRunning((prev) => !prev);
          break;
        case 'r':
          handleResetTimer();
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

  const handleResetTimer = () => {
    setElapsedSeconds(0);
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

  // Trigger Capture Specific Page via Chrome Extension
  const handleCaptureSpecificPage = async () => {
    if (!activeQuestion || isCapturingSpecific) return;
    setIsCapturingSpecific(true);

    try {
      const result = await requestCaptureSpecificPage(
        activeQuestion.id,
        activeQuestion.link,
        activeQuestion.subject
      );

      if (result) {
        setScreenshotData(result);
      }
    } finally {
      setIsCapturingSpecific(false);
    }
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!isOpen || !activeQuestion) return null;

  const currentProgress = progress[activeQuestion.id] || { completed: false };
  const isCompleted = Boolean(currentProgress.completed);
  const isDoubt = Boolean(currentProgress.isDoubt);
  const difficulty = currentProgress.difficulty || 'none';

  // Format timer MM:SS
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
      {/* ================= WORKSPACE COMPACT TOP CONTROL BAR ================= */}
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
            <span className="text-sm font-bold text-white truncate">
              {topicName}
            </span>
            <span className="text-xs font-mono font-bold text-brand-300 bg-brand-500/15 border border-brand-500/30 px-2 py-0.5 rounded-lg shrink-0">
              Q {currentIndex + 1} of {questions.length}
            </span>
          </div>
        </div>

        {/* Center: [ < Prev ] ........ [ TIMER WIDGET (CENTERED) ] ........ [ Next > ] */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
            className={clsx(
              'flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95',
              currentIndex === 0
                ? 'opacity-40 bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border-slate-800 hover:border-slate-700'
            )}
            title="Previous Question (← or [)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* ================= CENTERED TIMER WIDGET ================= */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-750 px-3 py-1 rounded-xl shadow-inner ring-1 ring-white/5">
            <Timer className={clsx('w-3.5 h-3.5', isTimerRunning ? 'text-brand-400 animate-pulse' : 'text-slate-500')} />
            <span className="text-xs font-mono font-black text-slate-100 w-12 text-center select-none">
              {formatTimer(elapsedSeconds)}
            </span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-brand-300 transition-all active:scale-90"
              title={isTimerRunning ? 'Pause Timer (Space / T)' : 'Start Timer (Space / T)'}
            >
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
            </button>
            <button
              onClick={handleResetTimer}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-all active:scale-90"
              title="Reset Timer (R)"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={currentIndex === questions.length - 1}
            className={clsx(
              'flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95',
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

        {/* Right Side: [Go to Discussion ↗] ........ [Status Actions] ........ [Close] */}
        <div className="flex items-center justify-end gap-2.5 min-w-0 flex-1">
          {/* Go to Discussion Button */}
          <a
            href={activeQuestion.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(activeQuestion.link, '_blank', 'noopener,noreferrer');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white border border-brand-400/40 text-xs font-bold shadow-md shadow-brand-500/20 transition-all active:scale-95 shrink-0"
            title="Open official question discussion on GateOverflow in a new tab (O)"
          >
            <span>Go to Discussion</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

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

        {/* ================= RIGHT PANEL: SCREENSHOT PRACTICE VIEWPORT ================= */}
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

            {/* Right Controls: [Re-capture Button AT TOP] + Zoom + Difficulty + Scratchpad */}
            <div className="flex items-center gap-2">
              {/* TOP RE-CAPTURE BUTTON */}
              <button
                onClick={handleCaptureSpecificPage}
                disabled={isCapturingSpecific}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-bold transition-all active:scale-95 disabled:opacity-50"
                title="Re-capture screenshot from official page"
              >
                {isCapturingSpecific ? (
                  <Loader2 className="w-3.5 h-3.5 text-brand-400 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className="hidden sm:inline">
                  {isCapturingSpecific ? 'Capturing...' : 'Re-capture'}
                </span>
              </button>

              {/* Difficulty Status Selector */}
              <div className="hidden md:flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800/80 text-[10px] font-bold">
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

              {/* Zoom Controls (when screenshot is available) */}
              {screenshotData && (
                <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-slate-300 px-1 font-bold">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(200, z + 15))}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Scratchpad Toggle */}
              <button
                onClick={() => setIsScratchpadOpen(!isScratchpadOpen)}
                className={clsx(
                  'flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all',
                  isScratchpadOpen
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/50'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                )}
                title="Toggle Notes / Scratchpad Drawer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Notes</span>
              </button>
            </div>
          </div>

          {/* Screenshot Display Area — Centered Vertically and Horizontally in Fullscreen */}
          <div className="flex-1 w-full h-full relative overflow-y-auto overflow-x-auto p-4 sm:p-8 flex items-center justify-center custom-scrollbar bg-[#02040a]">
            {isScreenshotLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 my-auto">
                <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
                <span className="text-xs font-mono font-bold text-slate-400">
                  Loading Question Screenshot...
                </span>
              </div>
            ) : screenshotData ? (
              /* High-Resolution Captured Screenshot — Centered */
              <div
                className="transition-transform duration-200 flex flex-col items-center justify-center max-w-full my-auto"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800/90 bg-[#0d121f]">
                  <img
                    src={screenshotData}
                    alt={`GATE Question ${activeQuestion.questionNumber}`}
                    className="max-w-full max-h-[82vh] object-contain select-text"
                  />
                </div>
              </div>
            ) : (
              /* Empty State: Question Not Captured Yet */
              <div className="my-auto max-w-lg w-full p-8 rounded-3xl bg-slate-900/70 border border-slate-800/90 shadow-2xl backdrop-blur-xl text-center space-y-5 animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto shadow-inner">
                  <Camera className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Question not captured yet
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    The screenshot for this GATE question has not been captured yet. Click Capture Specific Page to import it now with the extension.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleCaptureSpecificPage}
                    disabled={isCapturingSpecific}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isCapturingSpecific ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Capturing Page...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        <span>Capture Specific Page</span>
                      </>
                    )}
                  </button>

                  <a
                    href={activeQuestion.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(activeQuestion.link, '_blank', 'noopener,noreferrer');
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all active:scale-95"
                  >
                    <span>Go to Discussion</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
                  <span>Use the Chrome Extension to batch capture all questions by subject.</span>
                </div>
              </div>
            )}
          </div>

          {/* ================= BOTTOM PRACTICE ANSWER & VERIFICATION DOCK ================= */}
          <div className="border-t border-slate-800 bg-[#070c18]/95 backdrop-blur-xl p-3 sm:p-4 shrink-0 shadow-2xl z-20 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Your Answer ({activeMeta.question_type || activeQuestion.type_of_question || 'MCQ'}):
                </span>
                {isAnswerChecked && checkResult && (
                  <span
                    className={clsx(
                      'flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold border animate-fade-in',
                      checkResult.isCorrect
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-glow-emerald'
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                    )}
                  >
                    {checkResult.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Correct Answer! (+{activeQuestion.marks || 1}M)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Incorrect! Official: {checkResult.correctAnswerFormatted}</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Right Controls: Having Issue Button & View Explanation Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all active:scale-95 shadow-sm"
                  title="Having Issue? Report wrong answer key or wrong question type"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Having Issue?</span>
                </button>

                {isAnswerChecked && (
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-750 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{showExplanation ? 'Hide Solution' : 'View Solution'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Answer Inputs & Check Answer Button */}
            <div className="flex items-center flex-wrap gap-2.5">
              {/* MCQ Options (A, B, C, D) */}
              {(activeMeta.question_type || activeQuestion.type_of_question || 'MCQ') === 'MCQ' && (
                <div className="flex items-center gap-2 flex-wrap flex-1">
                  {['A', 'B', 'C', 'D'].map((opt) => {
                    const isSelected = userAnswer === opt;
                    const isOfficialKey = isAnswerChecked && checkResult?.meta.correct_answer === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setUserAnswer(opt);
                          setIsAnswerChecked(false);
                        }}
                        className={clsx(
                          'px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 active:scale-95',
                          isSelected
                            ? 'bg-brand-500 text-white border-brand-400 shadow-glow ring-1 ring-brand-300'
                            : 'bg-slate-900 text-slate-300 border-slate-750 hover:bg-slate-800 hover:text-white',
                          isOfficialKey && 'ring-2 ring-emerald-400 border-emerald-400'
                        )}
                      >
                        <span className="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center text-[10px]">
                          {opt}
                        </span>
                        <span>Option {opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* MSQ Multi-Select Options (A, B, C, D) */}
              {(activeMeta.question_type || activeQuestion.type_of_question) === 'MSQ' && (
                <div className="flex items-center gap-2 flex-wrap flex-1">
                  {['A', 'B', 'C', 'D'].map((opt) => {
                    const currentArr = Array.isArray(userAnswer) ? userAnswer : [];
                    const isSelected = currentArr.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setIsAnswerChecked(false);
                          if (isSelected) {
                            setUserAnswer(currentArr.filter((x) => x !== opt));
                          } else {
                            setUserAnswer([...currentArr, opt].sort());
                          }
                        }}
                        className={clsx(
                          'px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 active:scale-95',
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                            : 'bg-slate-900 text-slate-300 border-slate-750 hover:bg-slate-850'
                        )}
                      >
                        <span className="w-4 h-4 rounded bg-black/30 flex items-center justify-center text-[10px]">
                          {opt}
                        </span>
                        <span>Option {opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* NAT Numerical Answer Input */}
              {(activeMeta.question_type || activeQuestion.type_of_question) === 'NAT' && (
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <input
                    type="text"
                    value={typeof userAnswer === 'number' || typeof userAnswer === 'string' ? String(userAnswer) : ''}
                    onChange={(e) => {
                      setUserAnswer(e.target.value);
                      setIsAnswerChecked(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCheckAnswer();
                    }}
                    placeholder="Enter numerical answer..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-750 text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
              )}

              {/* Descriptive Answer Input */}
              {(activeMeta.question_type || activeQuestion.type_of_question) === 'Descriptive' && (
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <input
                    type="text"
                    value={typeof userAnswer === 'string' ? userAnswer : ''}
                    onChange={(e) => {
                      setUserAnswer(e.target.value);
                      setIsAnswerChecked(false);
                    }}
                    placeholder="Type your answer / summary..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
              )}

              {/* Check Answer Button */}
              <button
                type="button"
                onClick={handleCheckAnswer}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-glow-emerald active:scale-95 transition-all shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Check Answer</span>
              </button>
            </div>

            {/* Solution & Explanation Box */}
            {isAnswerChecked && showExplanation && checkResult && (
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 animate-scale-in text-xs">
                <div className="flex items-center justify-between flex-wrap gap-2 text-slate-300">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Official Verified Answer:</span>
                    <strong className="font-mono text-white text-sm bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {checkResult.correctAnswerFormatted}
                    </strong>
                  </span>
                  <a
                    href={activeQuestion.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(activeQuestion.link, '_blank', 'noopener,noreferrer');
                    }}
                    className="text-[11px] text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <span>View GateOverflow Discussion</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px] font-sans">
                  {checkResult.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Expandable Scratchpad / Notes Drawer */}
          {isScratchpadOpen && (
            <div className="h-48 border-t border-slate-800/90 bg-[#090e1a]/95 backdrop-blur-2xl p-3 flex flex-col shrink-0 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-400" />
                  <span>Working Scratchpad & Notes</span>
                </div>
                <button
                  onClick={() => setIsScratchpadOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => handleSaveNotes(e.target.value)}
                placeholder="Write rough calculations, steps, or revision notes here (saved automatically)..."
                className="flex-1 w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 resize-none custom-scrollbar"
              />
            </div>
          )}
        </main>
      </div>

      {/* Edit Answer Key / Having Issue Modal */}
      {isEditModalOpen && activeQuestion && (
        <EditAnswerKeyModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          question={activeQuestion}
          onSaved={(updatedMeta) => {
            setActiveMeta(updatedMeta);
            if (isAnswerChecked) {
              const reEval = evaluateSingleAnswer(activeQuestion.id, userAnswer, updatedMeta.question_type);
              setCheckResult(reEval);
            }
          }}
        />
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { PYQQuestion, PYQItemProgress, PYQDifficultyStatus } from '../../types/pyq';
import {
  getQuestionScreenshot,
  requestCaptureSpecificPage,
} from '../../services/screenshotService';
import {
  X,
  Star,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Camera,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Loader2,
  RefreshCw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  getQuestionAnswerMetadata,
  evaluateSingleAnswer,
} from '../../services/pyqTestService';
import { EditAnswerKeyModal } from './EditAnswerKeyModal';

export interface QuestionScreenshotModalProps {
  question: PYQQuestion | null;
  isOpen: boolean;
  onClose: () => void;
  progress?: PYQItemProgress;
  onToggleCompleted?: (questionId: string) => void;
  onToggleDoubt?: (questionId: string) => void;
  onSetDifficulty?: (questionId: string, status: PYQDifficultyStatus) => void;
  onNavigatePrevious?: () => void;
  onNavigateNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalCount?: number;
}

export const QuestionScreenshotModal: React.FC<QuestionScreenshotModalProps> = ({
  question,
  isOpen,
  onClose,
  progress,
  onToggleCompleted,
  onToggleDoubt,
  onSetDifficulty,
  onNavigatePrevious,
  onNavigateNext,
  hasPrevious = false,
  hasNext = false,
  currentIndex,
  totalCount,
}) => {
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Interactive Answer Check & Issue States
  const [userAnswer, setUserAnswer] = useState<string | string[] | number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<ReturnType<typeof evaluateSingleAnswer> | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [activeMeta, setActiveMeta] = useState(() =>
    getQuestionAnswerMetadata(question?.id ? String(question.id) : '')
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Load screenshot whenever modal opens or question changes
  useEffect(() => {
    if (!isOpen || !question) return;

    let isMounted = true;
    setIsLoading(true);
    setScreenshotData(null);
    setZoomLevel(100);

    getQuestionScreenshot(question.id).then((data) => {
      if (isMounted) {
        setScreenshotData(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, question?.id]);

  // Listen for real-time capture updates from Chrome Extension
  useEffect(() => {
    const handleUpdated = (e: any) => {
      if (e.detail && question && String(e.detail.questionId) === String(question.id)) {
        setScreenshotData(e.detail.dataUrl);
        setIsLoading(false);
        setIsCapturing(false);
      }
    };
    window.addEventListener('pyq_screenshot_updated', handleUpdated);
    window.addEventListener('pyq-screenshot-updated', handleUpdated);
    return () => {
      window.removeEventListener('pyq_screenshot_updated', handleUpdated);
      window.removeEventListener('pyq-screenshot-updated', handleUpdated);
    };
  }, [question?.id]);

  // Reset inputs when active question changes
  useEffect(() => {
    if (question) {
      setActiveMeta(getQuestionAnswerMetadata(String(question.id)));
      setUserAnswer(null);
      setIsAnswerChecked(false);
      setCheckResult(null);
      setShowExplanation(false);
    }
  }, [question?.id]);

  // Listen for global answer key updates
  useEffect(() => {
    const handleAnswerUpdated = (e: any) => {
      if (question && e.detail && e.detail.questionId === String(question.id)) {
        const freshMeta = getQuestionAnswerMetadata(String(question.id));
        setActiveMeta(freshMeta);
        if (isAnswerChecked) {
          const reEval = evaluateSingleAnswer(String(question.id), userAnswer, freshMeta.question_type);
          setCheckResult(reEval);
        }
      }
    };
    window.addEventListener('pyq_answer_key_updated', handleAnswerUpdated);
    return () => window.removeEventListener('pyq_answer_key_updated', handleAnswerUpdated);
  }, [question?.id, isAnswerChecked, userAnswer]);

  const handleCheckAnswer = () => {
    if (!question) return;
    const res = evaluateSingleAnswer(
      String(question.id),
      userAnswer,
      activeMeta.question_type || (question.type_of_question as any) || 'MCQ'
    );
    setCheckResult(res);
    setIsAnswerChecked(true);
    setShowExplanation(true);
  };

  // Keyboard shortcuts: ArrowLeft (Prev), ArrowRight (Next), Esc (Close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        e.preventDefault();
        if (hasPrevious && onNavigatePrevious) {
          onNavigatePrevious();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        e.preventDefault();
        if (hasNext && onNavigateNext) {
          onNavigateNext();
        }
      } else if (e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        if (question) {
          window.open(question.link, '_blank', 'noopener,noreferrer');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, hasPrevious, hasNext, onNavigatePrevious, onNavigateNext, question]);

  const handleCapture = async () => {
    if (!question || isCapturing) return;
    setIsCapturing(true);
    try {
      const result = await requestCaptureSpecificPage(
        question.id,
        question.link,
        question.subject
      );
      if (result) {
        setScreenshotData(result);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  const openInNewTab = (url: string, e?: React.MouseEvent | React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // Sync fullscreen state with native browser events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!isOpen || !question) return null;

  const isDone = Boolean(progress?.completed);
  const isDoubt = Boolean(progress?.isDoubt);
  const difficulty = progress?.difficulty || 'none';
  const rawType = question.type_of_question || 'MCQ';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[130] w-screen h-screen flex flex-col bg-[#030712] text-slate-100 overflow-hidden select-none animate-fade-in font-sans"
    >
      {/* Header Bar */}
      <header className="h-14 px-4 sm:px-6 bg-[#0a1020] border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        {/* Question Metadata Info & Left/Right Quick Switcher */}
        <div className="flex items-center gap-2.5 truncate min-w-0">
          {/* Prev / Next Header Navigator */}
          {(hasPrevious || hasNext) && (
            <div className="flex items-center gap-0.5 bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 shrink-0 shadow-inner">
              <button
                onClick={onNavigatePrevious}
                disabled={!hasPrevious}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                title="Previous Question (← Arrow Left)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {typeof currentIndex === 'number' && typeof totalCount === 'number' && (
                <span className="text-[11px] font-mono font-black text-brand-300 px-1.5 select-none">
                  {currentIndex + 1} / {totalCount}
                </span>
              )}
              <button
                onClick={onNavigateNext}
                disabled={!hasNext}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                title="Next Question (→ Arrow Right)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hidden sm:inline shrink-0">
            {question.subject}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-sm font-black text-white truncate">
            {question.year} • Question {question.questionNumber}
          </span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 shrink-0">
            {question.marks || 1} {question.marks === 1 ? 'Mark' : 'Marks'}
          </span>
          <span
            className={clsx(
              'text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0',
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
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Top Re-capture Button */}
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
            title="Re-capture screenshot"
          >
            {isCapturing ? (
              <Loader2 className="w-3.5 h-3.5 text-brand-400 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="hidden sm:inline">
              {isCapturing ? 'Capturing...' : 'Re-capture'}
            </span>
          </button>

          {/* Go to Discussion Link */}
          <button
            type="button"
            onClick={(e) => openInNewTab(question.link, e)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all active:scale-95 cursor-pointer"
            title="Open official question discussion on GateOverflow in a new tab (O)"
          >
            <span>Discussion</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

            {/* Mark Done */}
            {onToggleCompleted && (
              <button
                onClick={() => onToggleCompleted(question.id)}
                className={clsx(
                  'flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95',
                  isDone
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                )}
                title="Toggle Completed"
              >
                <CheckCircle2 className={clsx('w-3.5 h-3.5', isDone ? 'text-emerald-400' : 'text-slate-500')} />
                <span className="hidden md:inline">{isDone ? 'Done' : 'Mark Done'}</span>
              </button>
            )}

            {/* Doubt Toggle */}
            {onToggleDoubt && (
              <button
                onClick={() => onToggleDoubt(question.id)}
                className={clsx(
                  'p-2 rounded-xl border transition-all active:scale-95',
                  isDoubt
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                )}
                title="Toggle Doubt"
              >
                <Star className={clsx('w-4 h-4', isDoubt ? 'text-amber-400 fill-current' : 'text-slate-400')} />
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all active:scale-95"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 transition-all active:scale-95"
              title="Close modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Sub-Header: Zoom & Difficulty Status */}
        <div className="h-9 px-4 sm:px-6 bg-[#070c18] border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs shrink-0">
          <span className="text-[11px] text-slate-400 truncate">
            {question.topic || question.chapter}
          </span>

          <div className="flex items-center gap-3">
            {/* Difficulty Selector */}
            {onSetDifficulty && (
              <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
                {(['easy', 'medium', 'hard', 'skip'] as PYQDifficultyStatus[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => onSetDifficulty(question.id, lvl)}
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
            )}

            {/* Zoom Controls */}
            {screenshotData && (
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                  className="p-1 rounded text-slate-400 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="text-[10px] font-mono text-slate-300 px-1 font-bold">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(200, z + 15))}
                  className="p-1 rounded text-slate-400 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Screenshot Viewport — Centered with Generously Spaced Side Navigation Buttons */}
        <div
          className={clsx(
            'flex-1 w-full h-full relative overflow-y-auto overflow-x-auto flex items-center justify-center custom-scrollbar bg-[#02040a]',
            isFullscreen ? 'p-4 sm:p-8 px-16 sm:px-28 lg:px-36' : 'p-3 sm:p-6 px-14 sm:px-24'
          )}
        >
          {/* Floating Left Prev Button (Spaced far from central question) */}
          {hasPrevious && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onNavigatePrevious) onNavigatePrevious();
              }}
              className="absolute left-3 sm:left-6 lg:left-10 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-2xl bg-slate-950/90 hover:bg-brand-600 border border-slate-700/80 hover:border-brand-400 text-slate-300 hover:text-white shadow-2xl backdrop-blur-xl transition-all active:scale-90 group cursor-pointer"
              title="Previous Question (← Arrow Left)"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Floating Right Next Button (Spaced far from central question) */}
          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onNavigateNext) onNavigateNext();
              }}
              className="absolute right-3 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-2xl bg-slate-950/90 hover:bg-brand-600 border border-slate-700/80 hover:border-brand-400 text-slate-300 hover:text-white shadow-2xl backdrop-blur-xl transition-all active:scale-90 group cursor-pointer"
              title="Next Question (→ Arrow Right)"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 my-auto">
              <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
              <span className="text-xs font-mono font-bold text-slate-400">
                Loading Screenshot...
              </span>
            </div>
          ) : screenshotData ? (
            /* Screenshot Image */
            <div
              className="transition-transform duration-200 flex flex-col items-center justify-center max-w-full my-auto"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              <div
                className={clsx(
                  'relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800/90 bg-[#0d121f]',
                  isFullscreen ? 'max-w-5xl lg:max-w-6xl w-full' : 'max-w-4xl'
                )}
              >
                <img
                  src={screenshotData}
                  alt={`Question ${question.questionNumber}`}
                  className={clsx(
                    'w-auto object-contain select-text mx-auto',
                    isFullscreen ? 'max-h-[calc(100vh-210px)] max-w-full' : 'max-h-[72vh] max-w-full'
                  )}
                />
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="my-auto max-w-md w-full p-8 rounded-3xl bg-slate-900/70 border border-slate-800/90 shadow-2xl backdrop-blur-xl text-center space-y-5 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto shadow-inner">
                <Camera className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-black text-white">
                  Question not captured yet
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Capture this specific GATE question now using the Chrome Extension.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleCapture}
                  disabled={isCapturing}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isCapturing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Capturing...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      <span>Capture Specific Page</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => openInNewTab(question.link, e)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Discussion</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
                <span>Use the Chrome Extension to batch import all questions by subject.</span>
              </div>
            </div>
          )}
        </div>

        {/* ================= BOTTOM PRACTICE ANSWER & VERIFICATION DOCK ================= */}
        <div className="border-t border-slate-800 bg-[#070c18]/95 backdrop-blur-xl p-3 sm:p-4 shrink-0 shadow-2xl z-20 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Your Answer ({activeMeta.question_type || question.type_of_question || 'MCQ'}):
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
                      <span>Correct Answer! (+{question.marks || 1}M)</span>
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
            {(activeMeta.question_type || question.type_of_question || 'MCQ') === 'MCQ' && (
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
            {(activeMeta.question_type || question.type_of_question) === 'MSQ' && (
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
            {(activeMeta.question_type || question.type_of_question) === 'NAT' && (
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
            {(activeMeta.question_type || question.type_of_question) === 'Descriptive' && (
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
                <button
                  type="button"
                  onClick={(e) => openInNewTab(question.link, e)}
                  className="text-[11px] text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View GateOverflow Discussion</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px] font-sans">
                {checkResult.explanation}
              </p>
            </div>
          )}
        </div>

      {/* Edit Answer Key / Having Issue Modal */}
      {isEditModalOpen && question && (
        <EditAnswerKeyModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          question={question}
          onSaved={(updatedMeta) => {
            setActiveMeta(updatedMeta);
            if (isAnswerChecked) {
              const reEval = evaluateSingleAnswer(String(question.id), userAnswer, updatedMeta.question_type);
              setCheckResult(reEval);
            }
          }}
        />
      )}
    </div>
  );
};

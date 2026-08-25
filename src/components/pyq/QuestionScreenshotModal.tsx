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
} from 'lucide-react';
import { clsx } from 'clsx';

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
      if (e.detail && question && e.detail.questionId === question.id) {
        setScreenshotData(e.detail.dataUrl);
        setIsLoading(false);
        setIsCapturing(false);
      }
    };
    window.addEventListener('pyq_screenshot_updated', handleUpdated);
    return () => window.removeEventListener('pyq_screenshot_updated', handleUpdated);
  }, [question?.id]);

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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, hasPrevious, hasNext, onNavigatePrevious, onNavigateNext]);

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

  if (!isOpen || !question) return null;

  const isDone = Boolean(progress?.completed);
  const isDoubt = Boolean(progress?.isDoubt);
  const difficulty = progress?.difficulty || 'none';
  const rawType = question.type_of_question || 'MCQ';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[130] flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in font-sans"
    >
      {/* Modal Card */}
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[95vh] flex flex-col rounded-3xl bg-[#080d1a] border border-slate-800 shadow-2xl overflow-hidden select-none">
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
            <a
              href={question.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all active:scale-95"
              title="Open official discussion on GateOverflow (O)"
            >
              <span>Discussion</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

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

        {/* Screenshot Viewport — Centered with Floating Side Navigation Buttons */}
        <div className="flex-1 w-full h-full relative overflow-y-auto overflow-x-auto p-4 sm:p-6 flex items-center justify-center custom-scrollbar bg-[#02040a]">
          {/* Floating Left Prev Button */}
          {hasPrevious && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onNavigatePrevious) onNavigatePrevious();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-2xl bg-slate-950/85 hover:bg-brand-600 border border-slate-700/70 hover:border-brand-400 text-slate-300 hover:text-white shadow-2xl backdrop-blur-xl transition-all active:scale-90 group"
              title="Previous Question (← Arrow Left)"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Floating Right Next Button */}
          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onNavigateNext) onNavigateNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-2xl bg-slate-950/85 hover:bg-brand-600 border border-slate-700/70 hover:border-brand-400 text-slate-300 hover:text-white shadow-2xl backdrop-blur-xl transition-all active:scale-90 group"
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800/90 bg-[#0d121f]">
                <img
                  src={screenshotData}
                  alt={`Question ${question.questionNumber}`}
                  className="max-w-full max-h-[75vh] object-contain select-text"
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

                <a
                  href={question.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all active:scale-95"
                >
                  <span>Discussion</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
                <span>Use the Chrome Extension to batch import all questions by subject.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

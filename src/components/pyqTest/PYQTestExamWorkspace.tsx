import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  PYQTest,
  QuestionType,
  QuestionStatus,
} from '../../types/pyqTest';
import {
  getQuestionScreenshot,
  requestCaptureSpecificPage,
} from '../../services/screenshotService';
import {
  saveActiveTestSession,
} from '../../services/pyqTestService';
import { SubmitConfirmationModal } from './SubmitConfirmationModal';
import { QuestionIssueModal } from './QuestionIssueModal';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Camera,
  Loader2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface PYQTestExamWorkspaceProps {
  test: PYQTest;
  onSubmitTest: (completedTest: PYQTest) => void;
  onExitTest?: () => void;
}

export const PYQTestExamWorkspace: React.FC<PYQTestExamWorkspaceProps> = ({
  test: initialTest,
  onSubmitTest,
}) => {
  const [test, setTest] = useState<PYQTest>(initialTest);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('ALL'); // 'ALL' or SubjectName

  // Timer State (in seconds)
  const totalDurationSeconds = test.durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    return Math.max(0, totalDurationSeconds - (test.timeSpentSeconds || 0));
  });

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState<boolean>(false);

  // Screenshot State
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [isScreenshotLoading, setIsScreenshotLoading] = useState<boolean>(true);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const timerIntervalRef = useRef<any>(null);
  const testRef = useRef<PYQTest>(test);
  testRef.current = test;

  // Active Sections extracted from questions
  const availableSections = useMemo(() => {
    const set = new Set<string>();
    test.questions.forEach((q) => set.add(q.sectionName));
    return ['ALL', ...Array.from(set)];
  }, [test.questions]);

  const currentQuestionItem = test.questions[currentIndex] || test.questions[0];

  // Helper to format timer as HH:MM:SS
  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Real-time Countdown Timer
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          // Auto submit when time expires
          handleFinalSubmit();
          return 0;
        }

        // Increment timeSpent
        setTest((currTest) => {
          const updated = {
            ...currTest,
            timeSpentSeconds: (currTest.timeSpentSeconds || 0) + 1,
          };
          saveActiveTestSession(updated);
          return updated;
        });

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Load Question Screenshot
  useEffect(() => {
    if (!currentQuestionItem) return;

    let isMounted = true;
    setIsScreenshotLoading(true);
    setScreenshotData(null);
    setZoomLevel(100);

    getQuestionScreenshot(currentQuestionItem.questionId).then((data) => {
      if (isMounted) {
        setScreenshotData(data);
        setIsScreenshotLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [currentQuestionItem?.questionId]);

  // Mark question visited whenever navigating to it
  const navigateToQuestion = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= test.questions.length) return;

    setTest((prev) => {
      const updatedQs = [...prev.questions];
      const targetItem = updatedQs[targetIndex];

      // If status is unvisited, mark it visited (Red)
      if (targetItem.status === 'unvisited') {
        updatedQs[targetIndex] = {
          ...targetItem,
          status: 'visited',
        };
      }

      const updatedTest = { ...prev, questions: updatedQs };
      saveActiveTestSession(updatedTest);
      return updatedTest;
    });

    setCurrentIndex(targetIndex);
  };

  // Update Answer for Current Question
  const handleUpdateAnswer = (answer: string | string[] | number | null) => {
    setTest((prev) => {
      const updatedQs = [...prev.questions];
      const curr = updatedQs[currentIndex];

      const hasValue =
        answer !== null &&
        answer !== undefined &&
        answer !== '' &&
        (!Array.isArray(answer) || answer.length > 0);

      // Status Rule: If answer present -> GREEN (answered), else RED (visited)
      const newStatus: QuestionStatus = hasValue ? 'answered' : 'visited';

      updatedQs[currentIndex] = {
        ...curr,
        userAnswer: answer,
        status: newStatus,
      };

      const updatedTest = { ...prev, questions: updatedQs };
      saveActiveTestSession(updatedTest);
      return updatedTest;
    });
  };

  // Clear Response for Current Question
  const handleClearResponse = () => {
    handleUpdateAnswer(null);
  };

  // Skip Question (Marks PURPLE and advances to next)
  const handleSkipQuestion = () => {
    setTest((prev) => {
      const updatedQs = [...prev.questions];
      const curr = updatedQs[currentIndex];

      // Mark current question as skipped (PURPLE)
      updatedQs[currentIndex] = {
        ...curr,
        status: 'skipped',
      };

      const updatedTest = { ...prev, questions: updatedQs };
      saveActiveTestSession(updatedTest);
      return updatedTest;
    });

    // Advance to next question if available
    if (currentIndex < test.questions.length - 1) {
      navigateToQuestion(currentIndex + 1);
    }
  };

  // Save & Next Action
  const handleSaveAndNext = () => {
    if (currentIndex < test.questions.length - 1) {
      navigateToQuestion(currentIndex + 1);
    }
  };

  // Previous Action
  const handlePrevious = () => {
    if (currentIndex > 0) {
      navigateToQuestion(currentIndex - 1);
    }
  };

  // Capture Screenshot Trigger
  const handleCaptureScreenshot = async () => {
    if (isCapturing || !currentQuestionItem) return;
    setIsCapturing(true);

    try {
      const result = await requestCaptureSpecificPage(
        currentQuestionItem.questionId,
        currentQuestionItem.question.link,
        currentQuestionItem.question.subject
      );
      if (result) {
        setScreenshotData(result);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  // Apply Type Correction from Issue Modal
  const handleApplyTypeCorrection = (questionId: string, newType: QuestionType) => {
    setTest((prev) => {
      const updatedQs = prev.questions.map((q) => {
        if (q.questionId === questionId) {
          return {
            ...q,
            reportedType: newType,
            userAnswer: null, // Reset answer format to prevent type collision
          };
        }
        return q;
      });
      const updatedTest = { ...prev, questions: updatedQs };
      saveActiveTestSession(updatedTest);
      return updatedTest;
    });
  };

  // Final Test Submission
  const handleFinalSubmit = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsSubmitModalOpen(false);
    onSubmitTest(testRef.current);
  };

  // Active question type (respects reportedType override)
  const currentQuestionType = (currentQuestionItem?.reportedType ||
    currentQuestionItem?.question.type_of_question ||
    'MCQ') as QuestionType;

  const isLowTime = secondsRemaining <= 300; // < 5 minutes remaining

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 flex flex-col text-slate-200 select-none overflow-hidden">
      {/* Top Examination Header */}
      <header className="h-16 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 shadow-md">
        {/* Brand & Test Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-glow-sm shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-black text-white truncate">{test.name}</h1>
            <p className="text-[11px] text-slate-400 font-mono">
              GATE CSE Practice System • {test.questions.length} Questions
            </p>
          </div>
        </div>

        {/* Real-time Timer */}
        <div
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-2xl font-mono text-sm font-black border transition-all shadow-inner',
            isLowTime
              ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.3)]'
              : 'bg-slate-950/90 border-slate-700 text-amber-300'
          )}
        >
          <Clock className={clsx('w-4 h-4', isLowTime ? 'text-rose-400' : 'text-amber-400')} />
          <span>{formatTimer(secondsRemaining)}</span>
        </div>

        {/* Submit Test Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-glow-emerald active:scale-95 transition-all"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Section Navigation Bar */}
      <div className="h-12 px-4 sm:px-6 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-brand-400" />
            <span>Sections:</span>
          </span>

          {availableSections.map((sec) => {
            const isSelected = activeSection === sec;
            const secQuestions =
              sec === 'ALL'
                ? test.questions
                : test.questions.filter((q) => q.sectionName === sec);
            const answeredInSec = secQuestions.filter((q) => q.status === 'answered').length;

            return (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={clsx(
                  'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all select-none border',
                  isSelected
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-glow-sm'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                )}
              >
                <span>{sec}</span>
                <span className="text-[10px] font-mono opacity-80">
                  ({answeredInSec}/{secQuestions.length})
                </span>
              </button>
            );
          })}
        </div>

        {/* Issue Reporter Trigger */}
        <button
          onClick={() => setIsIssueModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold text-amber-400/90 hover:text-amber-300 bg-amber-950/30 hover:bg-amber-950/60 border border-amber-500/30 transition-all shrink-0"
          title="Report question classification issue or incorrect question type"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>There is an issue</span>
        </button>
      </div>

      {/* Main Examination Workspace Grid (Question Area + Question Navigator) */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Left: Main Question Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-hidden">
          {/* Question Meta Header */}
          <div className="px-6 py-3 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-2 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Question {currentIndex + 1} of {test.questions.length}
              </span>

              <span className="text-xs font-bold text-slate-300">
                {currentQuestionItem?.sectionName} • {currentQuestionItem?.question.chapter || currentQuestionItem?.question.topic}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-mono font-bold">
                {currentQuestionItem?.question.year}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                {currentQuestionItem?.question.marks || 1} Mark{(currentQuestionItem?.question.marks || 1) > 1 ? 's' : ''}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-mono font-bold">
                {currentQuestionType}
              </span>
            </div>
          </div>

          {/* Question Content View (Scrollable) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            {/* Question Screenshot / Title Card */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 shadow-sm space-y-4">
              {/* Question Header Link & Zoom Toolbar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    Problem Statement
                  </span>
                  <a
                    href={currentQuestionItem?.question.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300 hover:underline"
                  >
                    <span>GateOverflow #{currentQuestionItem?.questionId}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-slate-400">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(160, z + 15))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Question Visual Image / Text */}
              {isScreenshotLoading ? (
                <div className="py-16 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 font-medium">Loading Question Details...</p>
                </div>
              ) : screenshotData ? (
                <div className="overflow-x-auto custom-scrollbar flex justify-center bg-slate-950/60 p-4 rounded-xl">
                  <img
                    src={screenshotData}
                    alt={`Question ${currentQuestionItem?.questionId}`}
                    style={{ width: `${zoomLevel}%`, maxWidth: 'none' }}
                    className="rounded-lg shadow-md transition-all select-none pointer-events-none"
                  />
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">
                      {currentQuestionItem?.question.text || `${currentQuestionItem?.question.chapter} - ${currentQuestionItem?.question.year}`}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Subject: {currentQuestionItem?.question.subject} • Question #{currentQuestionItem?.question.questionNumber}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={handleCaptureScreenshot}
                      disabled={isCapturing}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
                    >
                      {isCapturing ? (
                        <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                      ) : (
                        <Camera className="w-4 h-4 text-brand-400" />
                      )}
                      <span>{isCapturing ? 'Capturing High-Res Question...' : 'Capture Question Screenshot'}</span>
                    </button>

                    <a
                      href={currentQuestionItem?.question.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (currentQuestionItem?.question.link) {
                          window.open(currentQuestionItem.question.link, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold hover:bg-brand-500/30 transition-all"
                    >
                      <span>Open Question in GateOverflow</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Answer Input Section according to Question Type */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  <span>Select / Enter Your Answer:</span>
                </span>

                {currentQuestionItem?.userAnswer && (
                  <button
                    onClick={handleClearResponse}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear Selection</span>
                  </button>
                )}
              </div>

              {/* 1. MCQ (Single Choice) */}
              {currentQuestionType === 'MCQ' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {['A', 'B', 'C', 'D'].map((opt) => {
                    const isSelected = String(currentQuestionItem?.userAnswer || '').toUpperCase() === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleUpdateAnswer(opt)}
                        className={clsx(
                          'flex items-center justify-between p-4 rounded-2xl border transition-all duration-150 select-none active:scale-95',
                          isSelected
                            ? 'bg-emerald-500/25 border-emerald-400 text-white shadow-glow-emerald ring-2 ring-emerald-400/50 font-black'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={clsx(
                              'w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-all',
                              isSelected
                                ? 'bg-emerald-500 text-slate-950 font-black'
                                : 'bg-slate-850 text-slate-400 border border-slate-700'
                            )}
                          >
                            {opt}
                          </span>
                          <span className="text-xs font-bold">Option ({opt})</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2. MSQ (Multiple Select) */}
              {currentQuestionType === 'MSQ' && (
                <div className="space-y-3">
                  <p className="text-[11px] text-purple-400 font-medium">
                    * Multiple Select Question: Select all correct options (No negative marking).
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {['A', 'B', 'C', 'D'].map((opt) => {
                      const currentList = Array.isArray(currentQuestionItem?.userAnswer)
                        ? (currentQuestionItem.userAnswer as string[])
                        : [];
                      const isSelected = currentList.includes(opt);

                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            let updatedList: string[];
                            if (isSelected) {
                              updatedList = currentList.filter((x) => x !== opt);
                            } else {
                              updatedList = [...currentList, opt].sort();
                            }
                            handleUpdateAnswer(updatedList.length > 0 ? updatedList : null);
                          }}
                          className={clsx(
                            'flex items-center justify-between p-4 rounded-2xl border transition-all select-none active:scale-95',
                            isSelected
                              ? 'bg-purple-500/25 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-2 ring-purple-400/50 font-black'
                              : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={clsx(
                                'w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-sm',
                                isSelected
                                  ? 'bg-purple-500 text-white font-black'
                                  : 'bg-slate-850 text-slate-400 border border-slate-700'
                              )}
                            >
                              {opt}
                            </span>
                            <span className="text-xs font-bold">Option ({opt})</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. NAT (Numerical Answer) */}
              {currentQuestionType === 'NAT' && (
                <div className="space-y-2">
                  <p className="text-[11px] text-amber-400 font-medium">
                    * Numerical Answer Type: Enter the numerical value (e.g. 14, 2.5).
                  </p>
                  <div className="flex items-center gap-3 max-w-sm">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={currentQuestionItem?.userAnswer !== null && currentQuestionItem?.userAnswer !== undefined ? String(currentQuestionItem.userAnswer) : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleUpdateAnswer(val.trim() === '' ? null : val);
                      }}
                      placeholder="Type numerical answer..."
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-sm font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* 4. Descriptive / Subjective */}
              {currentQuestionType === 'Descriptive' && (
                <div className="space-y-2">
                  <p className="text-[11px] text-indigo-400 font-medium">
                    * Descriptive Answer: Enter brief solution or mathematical derivation summary.
                  </p>
                  <textarea
                    rows={3}
                    value={currentQuestionItem?.userAnswer !== null && currentQuestionItem?.userAnswer !== undefined ? String(currentQuestionItem.userAnswer) : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleUpdateAnswer(val.trim() === '' ? null : val);
                    }}
                    placeholder="Type your answer / reasoning here..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Question Navigation Toolbar */}
          <div className="h-16 px-6 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-4 shrink-0">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border',
                currentIndex > 0
                  ? 'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-700'
                  : 'bg-slate-950 text-slate-600 border-slate-850 cursor-not-allowed'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-3">
              {/* Skip Button */}
              <button
                type="button"
                onClick={handleSkipQuestion}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all shadow-sm active:scale-95"
                title="Skip this question and mark as Skipped (Purple)"
              >
                <SkipForward className="w-4 h-4" />
                <span>Skip Question</span>
              </button>

              {/* Save & Next Button */}
              <button
                type="button"
                onClick={handleSaveAndNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-sm active:scale-95 transition-all"
              >
                <span>Save & Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Navigator Palette */}
        <div className="w-full lg:w-80 bg-slate-900/95 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0">
          {/* Navigator Header */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Question Navigator
            </h3>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-400">Answered ({test.questions.filter((q) => q.status === 'answered').length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0 ring-2 ring-rose-400/40" />
                <span className="text-slate-400">Visited ({test.questions.filter((q) => q.status === 'visited').length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-400">Not Visited ({test.questions.filter((q) => q.status === 'unvisited').length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />
                <span className="text-slate-400">Skipped ({test.questions.filter((q) => q.status === 'skipped').length})</span>
              </div>
            </div>
          </div>

          {/* Question Grid Buttons */}
          <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
            <div className="grid grid-cols-5 gap-2">
              {test.questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const status = q.status;

                // Color mappings
                let statusClasses = 'bg-amber-500 text-slate-950 font-bold'; // Unvisited (Orange)
                if (status === 'answered') {
                  statusClasses = 'bg-emerald-500 text-slate-950 font-black shadow-glow-emerald'; // Answered (Green)
                } else if (status === 'visited') {
                  statusClasses = 'bg-rose-500 text-white font-bold ring-2 ring-rose-400/50'; // Visited / Unanswered (Red)
                } else if (status === 'skipped') {
                  statusClasses = 'bg-purple-500 text-white font-bold'; // Skipped (Purple)
                }

                return (
                  <button
                    key={q.questionId}
                    type="button"
                    onClick={() => navigateToQuestion(idx)}
                    className={clsx(
                      'h-10 rounded-xl font-mono text-xs transition-all flex items-center justify-center relative select-none',
                      statusClasses,
                      isCurrent && 'ring-4 ring-cyan-400 scale-105 z-10'
                    )}
                    title={`Question ${idx + 1} (${q.sectionName}) - Status: ${status}`}
                  >
                    <span>{idx + 1}</span>
                    {status === 'visited' && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Stats Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-xs flex items-center justify-between">
            <span className="text-slate-400">
              Attempted: <strong>{test.questions.filter((q) => q.status === 'answered').length}</strong>/{test.questions.length}
            </span>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
            >
              Submit Now
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation & Issue Modals */}
      <SubmitConfirmationModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleFinalSubmit}
        test={test}
        timeRemainingSeconds={secondsRemaining}
      />

      {isIssueModalOpen && (
        <QuestionIssueModal
          isOpen={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
          questionItem={currentQuestionItem}
          onApplyTypeCorrection={handleApplyTypeCorrection}
        />
      )}
    </div>
  );
};

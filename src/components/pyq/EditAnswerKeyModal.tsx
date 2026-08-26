import React, { useState } from 'react';
import { PYQQuestion } from '../../types/pyq';
import { QuestionType, PYQAnswerMetadata } from '../../types/pyqTest';
import {
  getQuestionAnswerMetadata,
  saveAnswerOverride,
} from '../../services/pyqTestService';
import {
  X,
  AlertCircle,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface EditAnswerKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: PYQQuestion;
  onSaved?: (updatedMeta: PYQAnswerMetadata) => void;
}

export const EditAnswerKeyModal: React.FC<EditAnswerKeyModalProps> = ({
  isOpen,
  onClose,
  question,
  onSaved,
}) => {
  const qId = String(question.id);
  const currentMeta = getQuestionAnswerMetadata(qId);

  const [selectedType, setSelectedType] = useState<QuestionType>(
    (currentMeta.question_type || question.type_of_question || 'MCQ') as QuestionType
  );

  // Correct answer edit state
  const [mcqOption, setMcqOption] = useState<string>(() => {
    return typeof currentMeta.correct_answer === 'string' &&
      ['A', 'B', 'C', 'D'].includes(currentMeta.correct_answer.toUpperCase())
      ? currentMeta.correct_answer.toUpperCase()
      : 'A';
  });

  const [msqOptions, setMsqOptions] = useState<string[]>(() => {
    if (Array.isArray(currentMeta.correct_answer)) {
      return currentMeta.correct_answer.map((s) => String(s).toUpperCase());
    }
    if (typeof currentMeta.correct_answer === 'string' && currentMeta.correct_answer.length <= 4) {
      return currentMeta.correct_answer.split('').filter((x) => ['A', 'B', 'C', 'D'].includes(x));
    }
    return ['A', 'C'];
  });

  const [natValue, setNatValue] = useState<string>(() => {
    if (
      typeof currentMeta.correct_answer === 'object' &&
      currentMeta.correct_answer !== null &&
      'min' in currentMeta.correct_answer
    ) {
      return `${(currentMeta.correct_answer as any).min}`;
    }
    return typeof currentMeta.correct_answer === 'number' || typeof currentMeta.correct_answer === 'string'
      ? String(currentMeta.correct_answer)
      : '14';
  });

  const [natRangeMax, setNatRangeMax] = useState<string>(() => {
    if (
      typeof currentMeta.correct_answer === 'object' &&
      currentMeta.correct_answer !== null &&
      'max' in currentMeta.correct_answer
    ) {
      return `${(currentMeta.correct_answer as any).max}`;
    }
    return '';
  });

  const [descriptiveText, setDescriptiveText] = useState<string>(() => {
    return typeof currentMeta.correct_answer === 'string'
      ? currentMeta.correct_answer
      : 'Model solution verified.';
  });

  const [explanation, setExplanation] = useState<string>(
    currentMeta.explanation ||
      `Official verified answer key solution for ${question.chapter || question.topic} (${question.year} Q${question.questionNumber}).`
  );

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    let finalCorrectAnswer: string | string[] | number | { min: number; max: number };

    if (selectedType === 'MCQ') {
      finalCorrectAnswer = mcqOption;
    } else if (selectedType === 'MSQ') {
      finalCorrectAnswer = msqOptions.length > 0 ? msqOptions.sort() : ['A'];
    } else if (selectedType === 'NAT') {
      const minNum = parseFloat(natValue.trim());
      const maxNum = parseFloat(natRangeMax.trim());
      if (!isNaN(minNum) && !isNaN(maxNum) && natRangeMax.trim() !== '') {
        finalCorrectAnswer = {
          min: Math.min(minNum, maxNum),
          max: Math.max(minNum, maxNum),
        };
      } else if (!isNaN(minNum)) {
        finalCorrectAnswer = minNum;
      } else {
        finalCorrectAnswer = natValue.trim() || 0;
      }
    } else {
      finalCorrectAnswer = descriptiveText.trim() || 'Model solution';
    }

    const updated = saveAnswerOverride(qId, {
      question_type: selectedType,
      correct_answer: finalCorrectAnswer,
      explanation: explanation.trim(),
      further_explanations: currentMeta.further_explanations,
      answer_source: 'User Corrected & Verified Answer Key',
    });

    if (onSaved) onSaved(updated);

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const typesList: { type: QuestionType; label: string; desc: string }[] = [
    { type: 'MCQ', label: 'MCQ (Single Choice)', desc: '1 correct option out of A, B, C, D' },
    { type: 'MSQ', label: 'MSQ (Multiple Select)', desc: 'Multiple correct options out of A, B, C, D' },
    { type: 'NAT', label: 'NAT (Numerical Answer)', desc: 'Exact number or numerical range' },
    { type: 'Descriptive', label: 'Descriptive / Subjective', desc: 'Subjective model solution' },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Having Issue? Update Answer Key & Type
              </h3>
              <p className="text-xs text-slate-400">
                {question.year} • Question #{question.questionNumber} ({question.chapter || question.topic})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {isSuccess ? (
            <div className="py-12 text-center space-y-3 animate-scale-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-black text-white">Answer Key & Type Updated!</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                The corrected answer key and question type are saved and will also take effect inside the PYQ Test examination engine.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* 1. Correct Question Type Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Select Question Type:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {typesList.map((t) => {
                    const isSelected = selectedType === t.type;
                    return (
                      <button
                        key={t.type}
                        type="button"
                        onClick={() => setSelectedType(t.type)}
                        className={clsx(
                          'p-3 rounded-2xl border text-left transition-all',
                          isSelected
                            ? 'bg-brand-500/20 border-brand-400 text-white shadow-glow-sm ring-1 ring-brand-400/40'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                        )}
                      >
                        <div className="text-xs font-bold">{t.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Official Correct Answer Input based on Type */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-300 block">
                  Set Official Correct Answer:
                </label>

                {/* MCQ: Single Option Pick */}
                {selectedType === 'MCQ' && (
                  <div className="grid grid-cols-4 gap-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setMcqOption(opt)}
                        className={clsx(
                          'p-3 rounded-xl border text-center text-xs font-mono font-bold transition-all',
                          mcqOption === opt
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-glow-emerald border-emerald-400'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                        )}
                      >
                        Option ({opt})
                      </button>
                    ))}
                  </div>
                )}

                {/* MSQ: Multi-Option Pick */}
                {selectedType === 'MSQ' && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-400">
                      Select all options that form the correct answer set:
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {['A', 'B', 'C', 'D'].map((opt) => {
                        const isSelected = msqOptions.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setMsqOptions(msqOptions.filter((x) => x !== opt));
                              } else {
                                setMsqOptions([...msqOptions, opt].sort());
                              }
                            }}
                            className={clsx(
                              'p-3 rounded-xl border text-center text-xs font-mono font-bold transition-all',
                              isSelected
                                ? 'bg-purple-500 text-white font-black shadow-[0_0_12px_rgba(168,85,247,0.4)] border-purple-400'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                            )}
                          >
                            Option ({opt})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* NAT: Numerical Input */}
                {selectedType === 'NAT' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">
                          Correct Value / Min Range:
                        </label>
                        <input
                          type="text"
                          value={natValue}
                          onChange={(e) => setNatValue(e.target.value)}
                          placeholder="E.g. 14 or 13.95"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">
                          Max Range (Optional for range keys):
                        </label>
                        <input
                          type="text"
                          value={natRangeMax}
                          onChange={(e) => setNatRangeMax(e.target.value)}
                          placeholder="E.g. 14.05 (Leave blank if single)"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Descriptive: Text Solution */}
                {selectedType === 'Descriptive' && (
                  <textarea
                    rows={2}
                    value={descriptiveText}
                    onChange={(e) => setDescriptiveText(e.target.value)}
                    placeholder="Enter official model proof or solution key..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                )}
              </div>

              {/* 3. Official Explanation / Notes */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                  Official Explanation & Derivation:
                </label>
                <textarea
                  rows={3}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain why this option/value is correct..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-inner"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-xs shadow-glow active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Official Answer Key</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

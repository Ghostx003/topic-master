import React, { useState } from 'react';
import { QuestionType, PYQTestQuestionItem } from '../../types/pyqTest';
import {
  getQuestionAnswerMetadata,
  saveAnswerOverride,
} from '../../services/pyqTestService';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { clsx } from 'clsx';

export interface QuestionIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionItem: PYQTestQuestionItem;
  onApplyTypeCorrection: (questionId: string, newType: QuestionType) => void;
}

export const QuestionIssueModal: React.FC<QuestionIssueModalProps> = ({
  isOpen,
  onClose,
  questionItem,
  onApplyTypeCorrection,
}) => {
  const currentMeta = getQuestionAnswerMetadata(questionItem.questionId);
  const currentType = (questionItem.reportedType || currentMeta.question_type || questionItem.question.type_of_question || 'MCQ') as QuestionType;
  const [selectedType, setSelectedType] = useState<QuestionType>(currentType);
  const [mcqOption, setMcqOption] = useState<string>(() => {
    return typeof currentMeta.correct_answer === 'string' &&
      ['A', 'B', 'C', 'D'].includes(currentMeta.correct_answer.toUpperCase())
      ? currentMeta.correct_answer.toUpperCase()
      : 'A';
  });
  const [natValue, setNatValue] = useState<string>(() => {
    return typeof currentMeta.correct_answer === 'object' && currentMeta.correct_answer !== null && 'min' in currentMeta.correct_answer
      ? `${(currentMeta.correct_answer as any).min}`
      : String(currentMeta.correct_answer || '10');
  });
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalAnswer = currentMeta.correct_answer;
    if (selectedType === 'MCQ') {
      finalAnswer = mcqOption;
    } else if (selectedType === 'NAT') {
      const num = parseFloat(natValue.trim());
      finalAnswer = !isNaN(num) ? num : natValue.trim();
    }

    saveAnswerOverride(questionItem.questionId, {
      question_type: selectedType,
      correct_answer: finalAnswer,
      explanation: notes.trim() || currentMeta.explanation,
    });

    onApplyTypeCorrection(questionItem.questionId, selectedType);

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1000);
  };

  const typesList: { type: QuestionType; label: string; desc: string }[] = [
    { type: 'MCQ', label: 'MCQ (Single Choice)', desc: 'Single correct answer out of 4 options (A, B, C, D)' },
    { type: 'MSQ', label: 'MSQ (Multiple Select)', desc: 'One or more correct choices out of A, B, C, D' },
    { type: 'NAT', label: 'NAT (Numerical Answer)', desc: 'Numerical input answer field' },
    { type: 'Descriptive', label: 'Descriptive / Subjective', desc: 'Textual proof or subjective response' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Report Question Issue</h3>
              <p className="text-xs text-slate-400">
                Question #{questionItem.orderIndex + 1} ({questionItem.question.year} Q{questionItem.question.questionNumber})
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

        {isSubmitted ? (
          <div className="py-12 text-center space-y-3 animate-scale-in">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Issue Reported & Answer Key Updated!</h4>
            <p className="text-xs text-slate-400">
              Interface updated to {selectedType}. The corrected answer key is now active.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 overflow-y-auto custom-scrollbar flex-1">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Current Question Type:
              </label>
              <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                Current classification: <span className="font-bold text-amber-300">{currentType}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Correct Question Type:
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
                        'p-2.5 rounded-2xl border text-left transition-all',
                        isSelected
                          ? 'bg-brand-500/15 border-brand-400 text-white shadow-glow-sm ring-1 ring-brand-400/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-850'
                      )}
                    >
                      <div className="text-xs font-bold">{t.type}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">{t.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer Key Override */}
            {selectedType === 'MCQ' && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Official Correct Option:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setMcqOption(opt)}
                      className={clsx(
                        'py-2 rounded-xl border text-center text-xs font-mono font-bold transition-all',
                        mcqOption === opt
                          ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                      )}
                    >
                      Option ({opt})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedType === 'NAT' && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Correct Numerical Value:
                </label>
                <input
                  type="text"
                  value={natValue}
                  onChange={(e) => setNatValue(e.target.value)}
                  placeholder="E.g. 14.5"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-xs font-mono font-bold text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Additional Comments / Correction Notes:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g. Verified answer is option C or numerical range..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-sm active:scale-95 transition-all"
              >
                Submit & Update UI
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

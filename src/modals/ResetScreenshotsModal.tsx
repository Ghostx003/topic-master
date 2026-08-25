import React, { useState, useEffect } from 'react';
import { Modal } from '../components/common/Modal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { useTopicMaster } from '../context/TopicMasterContext';
import { useToast } from '../context/ToastContext';
import {
  getScreenshotCaptureStats,
  deleteScreenshotsBySubjects,
} from '../services/screenshotService';
import { Camera, Trash2, CheckSquare, Square, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

interface ResetScreenshotsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetScreenshotsModal: React.FC<ResetScreenshotsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { subjects } = useTopicMaster();
  const { toast } = useToast();

  const [captureStats, setCaptureStats] = useState<{
    totalCaptured: number;
    bySubject: Record<string, number>;
  }>({ totalCaptured: 0, bySubject: {} });
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Load screenshot stats whenever modal opens
  useEffect(() => {
    if (isOpen) {
      loadStats();
      setSelectedSubjects(new Set());
    }
  }, [isOpen]);

  const loadStats = async () => {
    const stats = await getScreenshotCaptureStats();
    setCaptureStats(stats);
  };

  const handleToggleSubject = (subjectName: string) => {
    setSelectedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subjectName)) {
        next.delete(subjectName);
      } else {
        next.add(subjectName);
      }
      return next;
    });
  };

  const handleToggleAll = () => {
    if (selectedSubjects.size === subjects.length) {
      setSelectedSubjects(new Set());
    } else {
      setSelectedSubjects(new Set(subjects.map((s) => s.Subject_Name)));
    }
  };

  const handleExecuteReset = async () => {
    if (selectedSubjects.size === 0) return;
    setIsResetting(true);

    try {
      const subjectsList = Array.from(selectedSubjects);
      const deletedCount = await deleteScreenshotsBySubjects(subjectsList);

      toast.success(
        'Screenshots Reset',
        `Successfully deleted ${deletedCount} question screenshot${deletedCount === 1 ? '' : 's'} for ${subjectsList.length} subject${subjectsList.length === 1 ? '' : 's'}.`
      );

      setIsConfirmOpen(false);
      onClose();
    } catch (err: any) {
      toast.error('Reset Failed', err.message || 'Failed to delete screenshots.');
    } finally {
      setIsResetting(false);
    }
  };

  if (!isOpen) return null;

  const allSelected = subjects.length > 0 && selectedSubjects.size === subjects.length;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        title={
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Reset PYQ Screenshots</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Select subjects to remove cached question screenshots
              </p>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Summary Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Camera className="w-4 h-4 text-brand-400" />
              <span>
                Total Screenshots in Storage:{' '}
                <strong className="text-white font-mono">{captureStats.totalCaptured}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleAll}
              className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 transition-colors"
            >
              {allSelected ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Select All</span>
                </>
              )}
            </button>
          </div>

          {/* Subjects Checkbox Grid */}
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {subjects.map((s) => {
              const count = captureStats.bySubject[s.Subject_Name] || 0;
              const isSelected = selectedSubjects.has(s.Subject_Name);

              return (
                <div
                  key={s.id}
                  onClick={() => handleToggleSubject(s.Subject_Name)}
                  className={clsx(
                    'p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all',
                    isSelected
                      ? 'bg-rose-950/30 border-rose-500/50 shadow-sm'
                      : 'bg-slate-900/40 hover:bg-slate-900 border-slate-800/80'
                  )}
                >
                  <div className="flex items-center gap-3 truncate">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by parent div
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-rose-600 focus:ring-rose-500/20 cursor-pointer"
                    />
                    <span
                      className={clsx(
                        'text-xs font-semibold truncate',
                        isSelected ? 'text-rose-200 font-bold' : 'text-slate-300'
                      )}
                    >
                      {s.Subject_Name}
                    </span>
                  </div>

                  <span
                    className={clsx(
                      'text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border shrink-0',
                      count > 0
                        ? 'bg-slate-950 text-slate-300 border-slate-800'
                        : 'bg-slate-950/40 text-slate-600 border-slate-900'
                    )}
                  >
                    {count} {count === 1 ? 'screenshot' : 'screenshots'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Warning Notice */}
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300/90 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Resetting will remove the local screenshot images for the selected subjects. You can re-capture them anytime using the Chrome Extension.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmOpen(true)}
              disabled={selectedSubjects.size === 0 || isResetting}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Selected ({selectedSubjects.size})</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleExecuteReset}
        variant="danger"
        title="Confirm Screenshot Reset"
        message={`Are you sure you want to delete all cached screenshots for ${selectedSubjects.size} selected subject${selectedSubjects.size === 1 ? '' : 's'}?`}
        confirmText="Yes, Delete Screenshots"
      />
    </>
  );
};

import React, { useState } from 'react';
import { useTopicMaster } from '../context/TopicMasterContext';
import { useToast } from '../context/ToastContext';
import { BackupService } from '../services/backupService';
import { Modal } from '../components/common/Modal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { ThemePalette } from '../types/store';
import { ResetScreenshotsModal } from './ResetScreenshotsModal';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  CheckCircle2,
  FileJson,
  Database,
  Palette,
  Sparkles,
  Camera,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_PALETTES: { id: ThemePalette; name: string; color: string; glow: string }[] = [
  { id: 'emerald', name: 'Emerald', color: '#10b981', glow: 'rgba(16, 185, 129, 0.6)' },
  { id: 'violet', name: 'Violet', color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.6)' },
  { id: 'blue', name: 'Blue', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.6)' },
  { id: 'ruby', name: 'Ruby Red', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.6)' },
  { id: 'amber', name: 'Amber', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)' },
  { id: 'rose', name: 'Rose', color: '#ec4899', glow: 'rgba(236, 72, 153, 0.6)' },
  { id: 'cyan', name: 'Cyan', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.6)' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    subjects,
    topics,
    schedules,
    settings,
    updateSettings,
    importData,
    removeDuplicates,
    resetToDemoData,
    clearAllData,
  } = useTopicMaster();
  const { toast } = useToast();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [isResetScreenshotsOpen, setIsResetScreenshotsOpen] = useState(false);
  const [importFileContent, setImportFileContent] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<{
    subjectsCount: number;
    topicsCount: number;
    schedulesCount: number;
  } | null>(null);
  const [confirmImportMode, setConfirmImportMode] = useState<'overwrite' | 'merge' | null>(null);

  const handleExport = async () => {
    try {
      const stateToExport = {
        subjects,
        topics,
        schedules,
        activeScheduleId: null,
        settings: { theme: 'dark' as const, themePalette: settings.themePalette || 'blue', enableSound: true, autoSaveIntervalMs: 5000 },
        activeTimer: { topicId: null, subjectId: null, startTime: null, elapsedSeconds: 0, isRunning: false },
      };
      await BackupService.downloadBackupFile(stateToExport);
      toast.success('Backup Exported', 'Downloaded complete Topic Master JSON backup including all question screenshots.');
    } catch (err: any) {
      toast.error('Export Failed', err.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const validation = BackupService.validateBackup(text);
      if (!validation.valid || !validation.data) {
        toast.error('Invalid Backup File', validation.error || 'The file is corrupt.');
        setImportFileContent(null);
        setImportPreview(null);
      } else {
        setImportFileContent(text);
        setImportPreview({
          subjectsCount: validation.data.data.subjects.length,
          topicsCount: validation.data.data.topics.length,
          schedulesCount: validation.data.data.schedules.length,
        });
      }
    };
    reader.readAsText(file);
  };

  const handleRemoveDuplicates = () => {
    const { removedSubjects, removedTopics } = removeDuplicates();
    if (removedSubjects === 0 && removedTopics === 0) {
      toast.info('Database Clean', 'No duplicate subjects or topics found in your database.');
    } else {
      toast.success(
        'Duplicates Removed',
        `Successfully removed ${removedTopics} duplicate topics and ${removedSubjects} duplicate subjects.`
      );
    }
  };

  const executeImport = (mode: 'overwrite' | 'merge') => {
    if (!importFileContent) return;
    const result = importData(importFileContent, mode);
    if (result.success) {
      toast.success('Import Successful', result.message);
      setImportFileContent(null);
      setImportPreview(null);
      setConfirmImportMode(null);
      onClose();
    } else {
      toast.error('Import Failed', result.message);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        title={
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Application Settings & Data</h3>
              <p className="text-xs text-slate-400">
                Custom color palettes, local persistence, JSON backup exports & maintenance
              </p>
            </div>
          </div>
        }
        footer={
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold rounded-2xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close Settings
          </button>
        }
      >
        <div className="space-y-6">
          {/* Color Palette & Theme Selection */}
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/90 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-400" />
                <span>Color Palette & Theme</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Select a palette to update buttons, glows, badges & background ambient mesh across the app.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {COLOR_PALETTES.map((pal) => {
                const isSelected = (settings.themePalette || 'blue') === pal.id;
                return (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => updateSettings({ themePalette: pal.id })}
                    className={clsx(
                      'flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-200 gap-2.5 select-none',
                      isSelected
                        ? 'bg-slate-800/90 border-brand-500 shadow-glow-sm scale-[1.03]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    )}
                  >
                    <span
                      className="w-5 h-5 rounded-full shadow-lg transition-transform"
                      style={{
                        backgroundColor: pal.color,
                        boxShadow: `0 0 12px ${pal.glow}`,
                      }}
                    />
                    <span className={clsx('text-xs font-bold', isSelected ? 'text-white' : 'text-slate-300')}>
                      {pal.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Storage Overview Stats */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-brand-400" />
              <div>
                <h5 className="text-xs font-bold text-white">Local-First Storage Engine</h5>
                <p className="text-[11px] text-slate-400">
                  {subjects.length} Subjects • {topics.length} Topics • {schedules.length} Schedules
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              Active Synced
            </span>
          </div>

          {/* Backup Export */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Export Database Backup</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Export subjects, hierarchical topics, tags, content blocks, and study sessions as a portable JSON file.
                </p>
              </div>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-all shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Backup Import */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Import Backup</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Restore a previously exported Topic Master JSON backup with schema validation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer border border-slate-700 transition-colors">
                <FileJson className="w-4 h-4 text-brand-400" />
                <span>Select JSON File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {importPreview && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                  <span>
                    Valid: {importPreview.subjectsCount} subjects, {importPreview.topicsCount} topics
                  </span>
                </div>
              )}
            </div>

            {importPreview && (
              <div className="pt-2 flex items-center gap-3 border-t border-slate-800">
                <button
                  onClick={() => setConfirmImportMode('merge')}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  Merge with Existing
                </button>
                <button
                  onClick={() => setConfirmImportMode('overwrite')}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                >
                  Overwrite Entire Database
                </button>
              </div>
            )}
          </div>

          {/* Deduplication & Cleanup Engine */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Clean & Deduplicate Topics</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-md">
                Scan and remove duplicate topics with identical names under the same subject, preserving all notes, tags, and stars.
              </p>
            </div>
            <button
              onClick={handleRemoveDuplicates}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 transition-all flex items-center gap-2 shrink-0 active:scale-95 shadow-glow-sm"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Remove Duplicates</span>
            </button>
          </div>

          {/* PYQ Screenshots Management (Subject-Wise) */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-rose-400" />
                <span>PYQ Screenshots Management</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-md">
                Reset or delete local question screenshots on a subject-wise basis from IndexedDB storage without affecting your study notes or tracking data.
              </p>
            </div>
            <button
              onClick={() => setIsResetScreenshotsOpen(true)}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 transition-all flex items-center gap-2 shrink-0 active:scale-95 shadow-glow-sm cursor-pointer"
            >
              <Camera className="w-4 h-4 text-rose-400" />
              <span>Reset Screenshots (Subject-Wise)</span>
            </button>
          </div>

          {/* Reset & Maintenance */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <h4 className="text-sm font-bold text-white">Database Reset & Maintenance</h4>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setConfirmResetOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset to Sample CS Data</span>
              </button>

              <button
                onClick={() => setConfirmClearOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 border border-rose-600/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Clear All Data</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirmation for Reset to Demo */}
      <ConfirmationModal
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={() => {
          resetToDemoData();
          toast.success('Reset to Sample Data', 'Loaded standard CS subjects and topics.');
          onClose();
        }}
        variant="warning"
        title="Reset to Sample Data"
        message="This will reload the initial Computer Science sample subjects and topic hierarchy. Any unsaved custom data will be replaced."
        confirmText="Reset to Sample Data"
      />

      {/* Confirmation for Clear All */}
      <ConfirmationModal
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        onConfirm={() => {
          clearAllData();
          toast.info('Database Cleared', 'All subjects and topics have been removed.');
          onClose();
        }}
        variant="danger"
        title="Clear All Study Data"
        message="Are you sure you want to permanently clear all subjects, topics, notes, and study sessions? This cannot be undone."
        confirmText="Clear Everything"
      />

      {/* Confirmation for Import Overwrite */}
      <ConfirmationModal
        isOpen={confirmImportMode !== null}
        onClose={() => setConfirmImportMode(null)}
        onConfirm={() => {
          if (confirmImportMode) executeImport(confirmImportMode);
        }}
        variant={confirmImportMode === 'overwrite' ? 'danger' : 'primary'}
        title={`Confirm Backup Import (${confirmImportMode === 'overwrite' ? 'Overwrite' : 'Merge'})`}
        message={
          confirmImportMode === 'overwrite'
            ? 'Warning: Overwrite mode will completely replace your current database with the backup data. Existing subjects and topics will be deleted.'
            : 'Merge mode will add missing subjects and topics while updating existing matches.'
        }
        confirmText={`Proceed to ${confirmImportMode === 'overwrite' ? 'Overwrite' : 'Merge'}`}
      />

      {/* Reset PYQ Screenshots by Subject Modal */}
      <ResetScreenshotsModal
        isOpen={isResetScreenshotsOpen}
        onClose={() => setIsResetScreenshotsOpen(false)}
      />
    </>
  );
};

import React, { useState } from 'react';
import { useTopicMaster } from '../context/TopicMasterContext';
import { useToast } from '../context/ToastContext';
import { BackupService, BackupPayload } from '../services/backupService';
import { Modal } from '../components/common/Modal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { ThemePalette } from '../types/store';
import { ResetScreenshotsModal } from './ResetScreenshotsModal';
import {
  Settings,
  Upload,
  RotateCcw,
  Trash2,
  CheckCircle2,
  FileJson,
  Database,
  Palette,
  Sparkles,
  Camera,
  Archive,
  Loader2,
  FileArchive,
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

  // ZIP / JSON Export Progress
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [zipExportProgress, setZipExportProgress] = useState<{ percent: number; msg: string } | null>(null);

  // Import State
  const [importPayload, setImportPayload] = useState<BackupPayload | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [importPreview, setImportPreview] = useState<{
    subjectsCount: number;
    topicsCount: number;
    schedulesCount: number;
    screenshotsCount: number;
  } | null>(null);
  const [confirmImportMode, setConfirmImportMode] = useState<'overwrite' | 'merge' | null>(null);

  const getExportState = () => ({
    subjects,
    topics,
    schedules,
    activeScheduleId: null,
    settings: {
      theme: 'dark' as const,
      themePalette: settings.themePalette || 'blue',
      enableSound: true,
      autoSaveIntervalMs: 5000,
    },
    activeTimer: {
      topicId: null,
      subjectId: null,
      startTime: null,
      elapsedSeconds: 0,
      isRunning: false,
    },
  });

  const handleExportZip = async () => {
    if (isExportingZip) return;
    setIsExportingZip(true);
    setZipExportProgress({ percent: 5, msg: 'Preparing backup archive...' });

    try {
      await BackupService.downloadBackupZip(getExportState(), (percent, msg) => {
        setZipExportProgress({ percent, msg });
      });
      toast.success(
        'ZIP Archive Exported',
        'Downloaded complete Topic Master backup (.ZIP) containing all data and question screenshots!'
      );
    } catch (err: any) {
      toast.error('ZIP Export Failed', err.message || 'Failed to generate ZIP archive.');
    } finally {
      setIsExportingZip(false);
      setZipExportProgress(null);
    }
  };

  const handleExportJson = async () => {
    try {
      await BackupService.downloadBackupFile(getExportState());
      toast.success('JSON Backup Exported', 'Downloaded Topic Master JSON backup.');
    } catch (err: any) {
      toast.error('JSON Export Failed', err.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoadingFile(true);
    setImportPayload(null);
    setImportPreview(null);

    try {
      if (file.name.toLowerCase().endsWith('.zip')) {
        const payload = await BackupService.parseBackupZip(file);
        setImportPayload(payload);
        setImportPreview({
          subjectsCount: payload.data.subjects.length,
          topicsCount: payload.data.topics.length,
          schedulesCount: payload.data.schedules.length,
          screenshotsCount: Object.keys(payload.data.screenshots || {}).length,
        });
        toast.success(
          'ZIP Backup Loaded',
          `Archive contains ${payload.data.subjects.length} subjects, ${payload.data.topics.length} topics, and ${Object.keys(payload.data.screenshots || {}).length} question screenshots.`
        );
      } else {
        const text = await file.text();
        const validation = BackupService.validateBackup(text);
        if (!validation.valid || !validation.data) {
          toast.error('Invalid Backup File', validation.error || 'The file is corrupt.');
          setImportPayload(null);
          setImportPreview(null);
        } else {
          setImportPayload(validation.data);
          setImportPreview({
            subjectsCount: validation.data.data.subjects.length,
            topicsCount: validation.data.data.topics.length,
            schedulesCount: validation.data.data.schedules.length,
            screenshotsCount: Object.keys(validation.data.data.screenshots || {}).length,
          });
          toast.success(
            'JSON Backup Loaded',
            `Backup contains ${validation.data.data.subjects.length} subjects and ${validation.data.data.topics.length} topics.`
          );
        }
      }
    } catch (err: any) {
      toast.error('File Read Failed', err.message || 'Could not parse backup file.');
      setImportPayload(null);
      setImportPreview(null);
    } finally {
      setIsLoadingFile(false);
      // Reset input value so same file can be selected again if needed
      e.target.value = '';
    }
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
    if (!importPayload) return;
    const result = importData(importPayload, mode);
    if (result.success) {
      toast.success('Import Successful', result.message);
      setImportPayload(null);
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
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Customize appearance, manage local storage, and export full ZIP backups
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

          {/* Full ZIP / JSON Export Card */}
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Archive className="w-4 h-4 text-emerald-400" />
                  <span>Export Everything (.ZIP Archive)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-md">
                  Export all subjects, hierarchical topics, notes, study sessions, PYQ progress, and all high-resolution question screenshot images packed into a compressed ZIP file.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {/* Main ZIP Export Button */}
                <button
                  type="button"
                  onClick={handleExportZip}
                  disabled={isExportingZip}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isExportingZip ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Archive className="w-4 h-4 text-white" />
                  )}
                  <span>{isExportingZip ? 'Exporting ZIP...' : 'Export Everything (.ZIP)'}</span>
                </button>

                {/* Secondary JSON Export Button */}
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors active:scale-95 cursor-pointer"
                  title="Export database structure as JSON only"
                >
                  <FileJson className="w-3.5 h-3.5 text-cyan-400" />
                  <span>JSON Only</span>
                </button>
              </div>
            </div>

            {/* ZIP Export Progress Indicator */}
            {isExportingZip && zipExportProgress && (
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {zipExportProgress.msg}
                  </span>
                  <span className="font-mono font-bold text-emerald-300">
                    {zipExportProgress.percent}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    style={{ width: `${zipExportProgress.percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Backup Import Card (.ZIP or .JSON) */}
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/90 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Import Backup (.ZIP or .JSON)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Restore a previously exported Topic Master `.zip` archive (with screenshots) or `.json` file with full schema validation and deduplication.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 cursor-pointer border border-slate-700 transition-all hover:border-purple-500/50 shadow-sm active:scale-95">
                {isLoadingFile ? (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                ) : (
                  <FileArchive className="w-4 h-4 text-purple-400" />
                )}
                <span>{isLoadingFile ? 'Reading file...' : 'Choose .ZIP or .JSON File'}</span>
                <input
                  type="file"
                  accept=".zip,.json,application/zip,application/x-zip-compressed,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {importPreview && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Valid Backup: {importPreview.subjectsCount} subjects, {importPreview.topicsCount} topics
                    {importPreview.screenshotsCount > 0 && `, ${importPreview.screenshotsCount} screenshots`}
                  </span>
                </div>
              )}
            </div>

            {importPreview && (
              <div className="pt-3 flex flex-wrap items-center gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setConfirmImportMode('merge')}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer"
                >
                  Merge with Existing
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmImportMode('overwrite')}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md shadow-rose-600/20 active:scale-95 cursor-pointer"
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
              type="button"
              onClick={handleRemoveDuplicates}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 transition-all flex items-center gap-2 shrink-0 active:scale-95 shadow-glow-sm cursor-pointer"
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
              type="button"
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
                type="button"
                onClick={() => setConfirmResetOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset to Sample CS Data</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmClearOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 border border-rose-600/40 transition-colors cursor-pointer active:scale-95"
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
          setConfirmResetOpen(false);
          onClose();
          toast.success('Database Reset', 'Reset all subjects and topics to official sample syllabus.');
        }}
        variant="warning"
        title="Reset to Sample Data"
        message="This will replace all your current subjects, topics, and study schedules with the default GATE CSE syllabus. Are you sure?"
        confirmText="Yes, Reset Data"
      />

      {/* Confirmation for Clear All */}
      <ConfirmationModal
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        onConfirm={() => {
          clearAllData();
          setConfirmClearOpen(false);
          onClose();
          toast.success('Database Cleared', 'All subjects and topics have been removed.');
        }}
        variant="danger"
        title="Clear All Data"
        message="This will permanently delete all your custom subjects, topics, and schedules. This cannot be undone."
        confirmText="Yes, Clear Everything"
      />

      {/* Confirmation for Import Overwrite / Merge */}
      <ConfirmationModal
        isOpen={confirmImportMode !== null}
        onClose={() => setConfirmImportMode(null)}
        onConfirm={() => {
          if (confirmImportMode) {
            executeImport(confirmImportMode);
          }
        }}
        variant={confirmImportMode === 'overwrite' ? 'danger' : 'primary'}
        title={confirmImportMode === 'overwrite' ? 'Overwrite Entire Database?' : 'Merge Backup Data?'}
        message={
          confirmImportMode === 'overwrite'
            ? 'This will completely replace all existing subjects, topics, and question screenshots with the incoming backup archive.'
            : 'This will add incoming subjects and topics to your existing database, deduplicating matching names automatically.'
        }
        confirmText={confirmImportMode === 'overwrite' ? 'Yes, Overwrite Database' : 'Yes, Merge Backup'}
      />

      {/* Reset PYQ Screenshots Subject-Wise Modal */}
      <ResetScreenshotsModal
        isOpen={isResetScreenshotsOpen}
        onClose={() => setIsResetScreenshotsOpen(false)}
      />
    </>
  );
};

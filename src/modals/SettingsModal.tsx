import React, { useState } from 'react';
import { useTopicMaster } from '../context/TopicMasterContext';
import { useToast } from '../context/ToastContext';
import { BackupService } from '../services/backupService';
import { Modal } from '../components/common/Modal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  CheckCircle2,
  FileJson,
  Database,
} from 'lucide-react';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    subjects,
    topics,
    schedules,
    importData,
    resetToDemoData,
    clearAllData,
  } = useTopicMaster();
  const { toast } = useToast();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [importFileContent, setImportFileContent] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<{
    subjectsCount: number;
    topicsCount: number;
    schedulesCount: number;
  } | null>(null);
  const [confirmImportMode, setConfirmImportMode] = useState<'overwrite' | 'merge' | null>(null);

  const handleExport = () => {
    try {
      const stateToExport = {
        subjects,
        topics,
        schedules,
        activeScheduleId: null,
        settings: { theme: 'dark' as const, enableSound: true, autoSaveIntervalMs: 5000 },
        activeTimer: { topicId: null, subjectId: null, startTime: null, elapsedSeconds: 0, isRunning: false },
      };
      BackupService.downloadBackupFile(stateToExport);
      toast.success('Backup Exported', 'Downloaded complete Topic Master JSON backup.');
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
                Data persistence, JSON backup exports, imports, and maintenance
              </p>
            </div>
          </div>
        }
        footer={
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close Settings
          </button>
        }
      >
        <div className="space-y-6">
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
    </>
  );
};

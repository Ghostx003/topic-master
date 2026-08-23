import React, { useState, useEffect } from 'react';
import { Subject, SubjectImportance, IMPORTANCE_ORDER } from '../types/subject';
import { useTopicMaster } from '../context/TopicMasterContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { SubjectImportancePill } from '../components/common/SubjectImportancePill';
import { BookOpen, Plus } from 'lucide-react';

export interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectToEdit?: Subject | null;
}

const PRESET_COLORS = [
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#6366f1', // Indigo
  '#f43f5e', // Rose
  '#14b8a6', // Teal
];

export const AddSubjectModal: React.FC<AddSubjectModalProps> = ({
  isOpen,
  onClose,
  subjectToEdit,
}) => {
  const { addSubject, updateSubject } = useTopicMaster();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [importance, setImportance] = useState<SubjectImportance>('Normal');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#8b5cf6');

  useEffect(() => {
    if (subjectToEdit) {
      setName(subjectToEdit.Subject_Name);
      setImportance(subjectToEdit.Subject_Importance);
      setDescription(subjectToEdit.Subject_Description || '');
      setColor(subjectToEdit.Subject_Color || '#8b5cf6');
    } else {
      setName('');
      setImportance('Normal');
      setDescription('');
      setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    }
  }, [subjectToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (subjectToEdit) {
      updateSubject(subjectToEdit.id, {
        Subject_Name: name.trim(),
        Subject_Importance: importance,
        Subject_Description: description.trim(),
        Subject_Color: color,
      });
      toast.success('Subject Updated', `Saved changes for "${name.trim()}".`);
    } else {
      const created = addSubject({
        Subject_Name: name.trim(),
        Subject_Importance: importance,
        Subject_Description: description.trim(),
        Subject_Color: color,
      });
      toast.success('Subject Created', `"${created.Subject_Name}" is now available everywhere.`);
    }

    onClose();
  };

  const cycleImportance = () => {
    const idx = IMPORTANCE_ORDER.indexOf(importance);
    const next = IMPORTANCE_ORDER[(idx + 1) % IMPORTANCE_ORDER.length];
    setImportance(next);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">
              {subjectToEdit ? 'Edit Subject' : 'Add New Subject'}
            </h3>
            <p className="text-xs text-slate-400">
              Central subject entity available across Topics, Scheduler, and Admin
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Subject Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Operating Systems, Computer Networks..."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            required
            autoFocus
          />
        </div>

        {/* Importance Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Subject Importance (Click to cycle)
          </label>
          <div className="flex items-center gap-3">
            <SubjectImportancePill
              importance={importance}
              onClick={cycleImportance}
              size="lg"
            />
            <span className="text-xs text-slate-500 italic">
              Click pill to switch between Normal, Urgent, Important, High Scoring...
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Description / Syllabus Overview
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Brief overview of the subject curriculum, target weightage, or topics..."
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Accent Color Palette */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Theme Accent Color
          </label>
          <div className="flex items-center gap-2.5 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-xl transition-all ${
                  color === c ? 'scale-110 ring-2 ring-white shadow-glow-sm' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Select accent color ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-brand-600 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-white shadow-glow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{subjectToEdit ? 'Save Changes' : 'Create Subject'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

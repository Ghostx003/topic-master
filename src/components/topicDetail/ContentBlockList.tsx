import React, { useState } from 'react';
import { Topic } from '../../types/topic';
import { ContentBlockType } from '../../types/contentBlock';
import { useTopicMaster } from '../../context/TopicMasterContext';
import { ContentBlockEditor } from './ContentBlockEditor';
import {
  Plus,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  StickyNote,
  BookMarked,
  Sparkles,
} from 'lucide-react';

export interface ContentBlockListProps {
  topic: Topic;
}

export const ContentBlockList: React.FC<ContentBlockListProps> = ({ topic }) => {
  const { addContentBlock, updateContentBlock, deleteContentBlock, reorderContentBlocks } =
    useTopicMaster();
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const blocks = topic.Topic_Blocks || [];

  const handleAddBlock = (type: ContentBlockType) => {
    setAddMenuOpen(false);
    let initialData = {};

    if (type === 'text') {
      initialData = { text: '' };
    } else if (type === 'link') {
      initialData = { title: '', url: '' };
    } else if (type === 'image') {
      initialData = { imageUrl: '', caption: '' };
    } else if (type === 'note') {
      initialData = { title: '', text: '', noteColor: 'purple' };
    } else if (type === 'resource') {
      initialData = { title: '', text: '' };
    }

    addContentBlock(topic.id, {
      type,
      order: blocks.length,
      data: initialData,
    });
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    reorderContentBlocks(
      topic.id,
      newBlocks.map((b) => b.id)
    );
  };

  return (
    <div className="space-y-4">
      {/* Header and Add Block Menu */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Topic Workspace & Content Blocks ({blocks.length})
          </h4>
        </div>

        {/* Add Block Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setAddMenuOpen(!addMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600/90 hover:bg-brand-500 text-white text-xs font-bold shadow-glow-sm transition-all select-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Block</span>
          </button>

          {addMenuOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setAddMenuOpen(false)} />
              <div className="absolute right-0 top-9 z-30 w-48 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 text-xs text-slate-200 animate-slide-up space-y-0.5">
                <button
                  onClick={() => handleAddBlock('text')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Text / Markdown</span>
                </button>
                <button
                  onClick={() => handleAddBlock('note')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                  <span>Key Note Card</span>
                </button>
                <button
                  onClick={() => handleAddBlock('link')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>URL / Resource Link</span>
                </button>
                <button
                  onClick={() => handleAddBlock('image')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>Image / Diagram</span>
                </button>
                <button
                  onClick={() => handleAddBlock('resource')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <BookMarked className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Book / Article Ref</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Render Blocks */}
      {blocks.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-slate-400 text-xs">
          <p className="mb-3">No content blocks added yet.</p>
          <button
            onClick={() => handleAddBlock('text')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Block</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, idx) => (
            <ContentBlockEditor
              key={block.id}
              block={block}
              onUpdate={(id, updates) => updateContentBlock(topic.id, id, updates)}
              onDelete={(id) => deleteContentBlock(topic.id, id)}
              onMoveUp={idx > 0 ? () => handleMoveBlock(idx, 'up') : undefined}
              onMoveDown={idx < blocks.length - 1 ? () => handleMoveBlock(idx, 'down') : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

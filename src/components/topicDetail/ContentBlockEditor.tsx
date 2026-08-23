import React, { useState } from 'react';
import { ContentBlock } from '../../types/contentBlock';
import { parseTextWithUrls, extractDomain } from '../../utils/urlDetector';
import {
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  StickyNote,
  BookMarked,
  Trash2,
  Edit2,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Upload,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface ContentBlockEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, updates: Partial<ContentBlock>) => void;
  onDelete: (blockId: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftData, setDraftData] = useState(block.data);

  const handleSave = () => {
    onUpdate(block.id, { data: draftData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftData(block.data);
    setIsEditing(false);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setDraftData((prev) => ({
          ...prev,
          imageUrl: result,
          caption: prev.caption || file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Render text with clickable URL detection
  const renderTextContent = (text: string = '') => {
    const tokens = parseTextWithUrls(text);
    return (
      <div className="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed font-normal">
        {tokens.map((tok, idx) => {
          if (tok.type === 'url') {
            return (
              <a
                key={idx}
                href={tok.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-brand-300 hover:text-brand-200 underline underline-offset-2 break-all font-medium transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{tok.value}</span>
                <ExternalLink className="w-3 h-3 inline shrink-0" />
              </a>
            );
          }
          return <span key={idx}>{tok.value}</span>;
        })}
      </div>
    );
  };

  const noteColorStyles = {
    purple: 'bg-purple-950/30 border-purple-500/30 text-purple-200',
    amber: 'bg-amber-950/30 border-amber-500/30 text-amber-200',
    emerald: 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200',
    blue: 'bg-blue-950/30 border-blue-500/30 text-blue-200',
    rose: 'bg-rose-950/30 border-rose-500/30 text-rose-200',
    slate: 'bg-slate-900/60 border-slate-700/60 text-slate-200',
  };

  return (
    <div className="group relative rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 transition-all duration-200 hover:border-slate-700 backdrop-blur-md">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          {block.type === 'text' && (
            <>
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Text Block</span>
            </>
          )}
          {block.type === 'link' && (
            <>
              <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Link & Resource</span>
            </>
          )}
          {block.type === 'image' && (
            <>
              <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
              <span>Image Attachment</span>
            </>
          )}
          {block.type === 'note' && (
            <>
              <StickyNote className="w-3.5 h-3.5 text-amber-400" />
              <span>Key Note</span>
            </>
          )}
          {block.type === 'resource' && (
            <>
              <BookMarked className="w-3.5 h-3.5 text-indigo-400" />
              <span>Study Reference</span>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Move Up"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Move Down"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          )}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-brand-300"
              title="Edit Block"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => onDelete(block.id)}
            className="p-1 rounded-lg hover:bg-rose-950/50 text-slate-400 hover:text-rose-400"
            title="Delete Block"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor State */}
      {isEditing ? (
        <div className="space-y-3 pt-1">
          {/* Text Block Form */}
          {block.type === 'text' && (
            <div>
              <textarea
                value={draftData.text || ''}
                onChange={(e) => setDraftData({ ...draftData, text: e.target.value })}
                rows={4}
                className="w-full p-3 text-sm rounded-xl bg-slate-900 border border-brand-500/50 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          )}

          {/* Link Block Form */}
          {block.type === 'link' && (
            <div className="space-y-2">
              <input
                type="text"
                value={draftData.title || ''}
                onChange={(e) => setDraftData({ ...draftData, title: e.target.value })}
                className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
              <input
                type="url"
                value={draftData.url || ''}
                onChange={(e) => setDraftData({ ...draftData, url: e.target.value })}
                className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>
          )}

          {/* Image Block Form */}
          {block.type === 'image' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={draftData.imageUrl || ''}
                  onChange={(e) => setDraftData({ ...draftData, imageUrl: e.target.value })}
                  className="flex-1 p-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
                <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <input
                type="text"
                value={draftData.caption || ''}
                onChange={(e) => setDraftData({ ...draftData, caption: e.target.value })}
                className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>
          )}

          {/* Note Block Form */}
          {block.type === 'note' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={draftData.title || ''}
                  onChange={(e) => setDraftData({ ...draftData, title: e.target.value })}
                  className="flex-1 p-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
                <select
                  value={draftData.noteColor || 'purple'}
                  onChange={(e) =>
                    setDraftData({
                      ...draftData,
                      noteColor: e.target.value as any,
                    })
                  }
                  className="p-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white cursor-pointer"
                >
                  <option value="purple">Purple Accent</option>
                  <option value="amber">Amber Accent</option>
                  <option value="emerald">Emerald Accent</option>
                  <option value="blue">Blue Accent</option>
                  <option value="rose">Rose Accent</option>
                  <option value="slate">Slate Accent</option>
                </select>
              </div>
              <textarea
                value={draftData.text || ''}
                onChange={(e) => setDraftData({ ...draftData, text: e.target.value })}
                rows={3}
                className="w-full p-2.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>
          )}

          {/* Resource Block Form */}
          {block.type === 'resource' && (
            <div className="space-y-2">
              <input
                type="text"
                value={draftData.title || ''}
                onChange={(e) => setDraftData({ ...draftData, title: e.target.value })}
                className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
              <textarea
                value={draftData.text || ''}
                onChange={(e) => setDraftData({ ...draftData, text: e.target.value })}
                rows={2}
                className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>
          )}

          {/* Save/Cancel Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        /* Display View State */
        <div className="pt-1">
          {/* Text Block View */}
          {block.type === 'text' && renderTextContent(block.data.text)}

          {/* Link Block View */}
          {block.type === 'link' && (
            <a
              href={block.data.url || '#'}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all group/link"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h5 className="text-sm font-semibold text-white truncate group-hover/link:text-cyan-300">
                    {block.data.title || block.data.url}
                  </h5>
                  {block.data.url && (
                    <span className="text-xs text-slate-400 font-mono">
                      {extractDomain(block.data.url)}
                    </span>
                  )}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover/link:text-cyan-300 transition-colors shrink-0 ml-2" />
            </a>
          )}

          {/* Image Block View */}
          {block.type === 'image' && (
            <div className="space-y-2">
              {block.data.imageUrl ? (
                <div className="rounded-xl overflow-hidden border border-slate-800 max-h-96 flex items-center justify-center bg-slate-950">
                  <img
                    src={block.data.imageUrl}
                    alt={block.data.caption || 'Topic attachment'}
                    className="max-h-96 w-auto object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                  No image attached. Click edit to upload or link an image.
                </div>
              )}
              {block.data.caption && (
                <p className="text-xs text-slate-400 text-center italic">{block.data.caption}</p>
              )}
            </div>
          )}

          {/* Note Block View */}
          {block.type === 'note' && (
            <div
              className={clsx(
                'p-4 rounded-xl border',
                noteColorStyles[block.data.noteColor || 'purple']
              )}
            >
              {block.data.title && (
                <h5 className="text-xs font-bold uppercase tracking-wider mb-1.5">
                  {block.data.title}
                </h5>
              )}
              {renderTextContent(block.data.text)}
            </div>
          )}

          {/* Resource Block View */}
          {block.type === 'resource' && (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <h5 className="text-sm font-bold text-indigo-300 mb-1">{block.data.title}</h5>
              {renderTextContent(block.data.text)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

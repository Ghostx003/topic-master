export type ContentBlockType =
  | 'text'
  | 'image'
  | 'link'
  | 'note'
  | 'description'
  | 'resource'
  | 'study_session';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  order: number;
  data: {
    text?: string;
    title?: string;
    url?: string;
    imageUrl?: string;
    caption?: string;
    noteColor?: 'purple' | 'amber' | 'emerald' | 'blue' | 'rose' | 'slate';
    resourceType?: 'pdf' | 'video' | 'article' | 'book' | 'code' | 'other';
    sessionDurationSeconds?: number;
    sessionDate?: string;
  };
  created_at: string;
  updated_at: string;
}

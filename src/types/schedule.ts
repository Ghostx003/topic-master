export interface ScheduleTopicAllocation {
  topic_id: string;
  subject_id: string;
  topic_name: string;
  subject_name: string;
  allocated_minutes: number;
  completed: boolean;
}

export interface Schedule {
  id: string;
  Schedule_Date: string; // YYYY-MM-DD
  Schedule_Hours: number; // Total hours targeted (e.g. 4)
  Schedule_Subjects: string[]; // Subject IDs selected
  Schedule_Tag_Filters: string[]; // List of tags used as filters (e.g. 'Require_Practice', 'Star', 'Deadline')
  Subject_Allocations: Record<string, number>; // subject_id -> allocated minutes
  Allocated_Topics: ScheduleTopicAllocation[];
  created_at: string;
  updated_at: string;
}

export interface SchedulerWizardState {
  study_hours: number;
  selected_subject_ids: string[];
  selected_tag_filters: {
    Require_Practice: boolean;
    Redo: boolean;
    Lecture_Needed: boolean;
    Deadline: boolean;
    Star: boolean;
    Recall_Activity: boolean;
    Practice_DPP: boolean;
    Include_Doing: boolean;
    Exclude_Done: boolean;
    Low_Confidence: boolean;
  };
  manual_allocations?: Record<string, number>; // Subject allocations in minutes
}

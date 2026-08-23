import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Subject } from '../types/subject';
import { useTopicMaster } from '../context/TopicMasterContext';
import { AdminTopicMatrix } from '../components/admin/AdminTopicMatrix';

interface AdminContextType {
  selectedSubjectId: string | null;
  selectedSubject: Subject | null;
  onOpenAddTopic: () => void;
}

export const AdminPanelPage: React.FC = () => {
  const { topics } = useTopicMaster();
  const { selectedSubjectId, selectedSubject, onOpenAddTopic } =
    useOutletContext<AdminContextType>();

  // Filter topics for the active sidebar subject or all subjects
  const currentTopics = selectedSubjectId
    ? topics.filter((t) => t.Subject_Id === selectedSubjectId)
    : topics;

  return (
    <div className="flex-1 flex flex-col space-y-6">
      {/* Full Admin Tag Matrix Table (Section 26) */}
      <AdminTopicMatrix
        topicsList={currentTopics}
        activeSubject={selectedSubject}
        onAddTopic={onOpenAddTopic}
      />
    </div>
  );
};

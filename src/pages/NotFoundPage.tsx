import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home, AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="p-4 rounded-3xl bg-brand-500/10 border border-brand-500/20 text-brand-400 mb-6 shadow-glow-sm">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-black text-white mb-2">Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md mb-8">
        The study view or route you requested does not exist or has been moved.
      </p>
      <Button variant="primary" onClick={() => navigate('/subjects')} icon={<Home className="w-4 h-4" />}>
        Back to My Subjects
      </Button>
    </div>
  );
};

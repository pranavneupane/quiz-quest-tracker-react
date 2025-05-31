
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HostDashboardHeaderProps {
  onCreateQuiz: () => void;
}

const HostDashboardHeader = ({ onCreateQuiz }: HostDashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/')}
          className="text-black hover:bg-black/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-black">Host Dashboard</h1>
          <p className="text-black/70">Manage your quizzes and sessions</p>
        </div>
      </div>
      <Button 
        onClick={onCreateQuiz}
        className="bg-white text-purple-600 hover:bg-white/90"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Quiz
      </Button>
    </div>
  );
};

export default HostDashboardHeader;

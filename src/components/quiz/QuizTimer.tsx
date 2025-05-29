
import React from 'react';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  timeLeft: number;
}

const QuizTimer: React.FC<QuizTimerProps> = ({ timeLeft }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold ${
        timeLeft <= 10 ? 'bg-red-500' : 'bg-blue-500'
      }`}>
        <Clock className="w-5 h-5" />
        {timeLeft}s
      </div>
    </div>
  );
};

export default QuizTimer;

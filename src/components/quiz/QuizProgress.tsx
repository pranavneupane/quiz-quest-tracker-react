
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  category?: string;
}

const QuizProgress: React.FC<QuizProgressProps> = ({
  currentQuestion,
  totalQuestions,
  category
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">
          {category || 'Quiz Challenge'}
        </h1>
        <div className="text-black/70">
          {currentQuestion + 1} / {totalQuestions}
        </div>
      </div>

      <div className="mb-6">
        <Progress 
          value={((currentQuestion + 1) / totalQuestions) * 100} 
          className="h-2"
        />
      </div>
    </>
  );
};

export default QuizProgress;

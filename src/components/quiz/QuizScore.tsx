
import React from 'react';
import { Trophy } from 'lucide-react';

interface QuizScoreProps {
  score: number;
  totalQuestions: number;
}

const QuizScore: React.FC<QuizScoreProps> = ({ score, totalQuestions }) => {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full backdrop-blur-sm">
        <Trophy className="w-5 h-5" />
        <span className="font-bold">Score: {score}/{totalQuestions}</span>
      </div>
    </div>
  );
};

export default QuizScore;

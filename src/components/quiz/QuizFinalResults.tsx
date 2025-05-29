
import React from 'react';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface QuizFinalResultsProps {
  score: number;
  totalQuestions: number;
  onTakeAnother: () => void;
  onBackToHome: () => void;
}

const QuizFinalResults: React.FC<QuizFinalResultsProps> = ({
  score,
  totalQuestions,
  onTakeAnother,
  onBackToHome
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
          <div className="text-6xl font-bold text-blue-600 mb-2">{percentage}%</div>
          <p className="text-gray-600 text-lg mb-6">
            {score} out of {totalQuestions} correct
          </p>
          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={onTakeAnother}
            >
              Take Another Quiz
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={onBackToHome}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizFinalResults;

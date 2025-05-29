
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Question } from '../../services/questionApi';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  showResult: boolean;
  onAnswerSelect: (answerIndex: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  showResult,
  onAnswerSelect
}) => {
  const getOptionClass = (optionIndex: number) => {
    const baseClass = "w-full p-4 text-left rounded-xl transition-all duration-300 cursor-pointer";
    
    if (!showResult) {
      return `${baseClass} bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300`;
    }
    
    if (optionIndex === question.correctAnswer) {
      return `${baseClass} bg-green-100 border-2 border-green-500 text-green-800`;
    }
    
    if (selectedAnswer === optionIndex && optionIndex !== question.correctAnswer) {
      return `${baseClass} bg-red-100 border-2 border-red-500 text-red-800`;
    }
    
    return `${baseClass} bg-gray-100 border-2 border-gray-300 text-gray-500`;
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm mb-6">
      <CardContent className="p-8">
        <div className="mb-4 text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {question.difficulty || 'Unknown'} difficulty
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          {question.text}
        </h2>
        
        <div className="grid gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              className={getOptionClass(index)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className="mt-8 text-center animate-fade-in">
            {selectedAnswer === question.correctAnswer ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-8 h-8" />
                <span className="text-2xl font-bold">Correct!</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <XCircle className="w-8 h-8" />
                  <span className="text-2xl font-bold">Incorrect!</span>
                </div>
                <p className="text-gray-600">
                  Correct answer: {question.options[question.correctAnswer]}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;

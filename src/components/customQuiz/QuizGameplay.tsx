
import React from 'react';
import { ArrowLeft, Clock, Trophy, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomQuiz, CustomQuestion, Player } from './types';
import { useNavigate } from 'react-router-dom';

interface QuizGameplayProps {
  quiz: CustomQuiz;
  currentQuestion: number;
  currentQ: CustomQuestion;
  timeLeft: number;
  selectedAnswer: number | null;
  players: Player[];
  canSkip: boolean;
  onAnswerSelect: (answerIndex: number) => void;
  onSkipQuestion: () => void;
}

const QuizGameplay: React.FC<QuizGameplayProps> = ({
  quiz,
  currentQuestion,
  currentQ,
  timeLeft,
  selectedAnswer,
  players,
  canSkip,
  onAnswerSelect,
  onSkipQuestion
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/host')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-black">{quiz.title}</h1>
          <div className="flex items-center gap-2">
            {canSkip && (
              <Button 
                variant="outline" 
                onClick={onSkipQuestion}
                disabled={selectedAnswer !== null}
                className="text-sm"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip
              </Button>
            )}
            <div className="text-black">
              Question {currentQuestion + 1} / {quiz.questions.length}
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex justify-center mb-6">
          <div className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-xl ${
            timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-orange-500' : 'bg-blue-500'
          }`}>
            <Clock className="w-6 h-6" />
            {timeLeft}s
          </div>
        </div>

        {/* Question */}
        <Card className="bg-white/95 backdrop-blur-sm mb-6">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {currentQ.text}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`p-6 text-left rounded-xl border-2 transition-all duration-300 ${
                    selectedAnswer === index 
                      ? 'bg-purple-100 border-purple-500 text-purple-800'
                      : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                  } ${selectedAnswer !== null ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-105'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center font-bold text-lg">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium text-lg">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Scores */}
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Live Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {players
                .sort((a, b) => b.score - a.score)
                .map((player) => (
                <div key={player.id} className={`p-3 rounded-lg text-center ${
                  player.id === '1' ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'
                }`}>
                  <div className="font-medium text-sm">{player.name}</div>
                  <div className="font-bold text-lg">{player.score}</div>
                  {player.hasSkipped && <Badge variant="outline" className="text-xs">Skipped</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizGameplay;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import GameWaitingRoom from './customQuiz/GameWaitingRoom';
import GameResultsScreen from './customQuiz/GameResultsScreen';
import QuizGameplay from './customQuiz/QuizGameplay';
import { CustomQuiz, Player, GameState } from './customQuiz/types';

const CustomQuizMultiplayer = () => {
  const { gameCode } = useParams();
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [quiz, setQuiz] = useState<CustomQuiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'You', score: 0, isHost: true, hasSkipped: false }
  ]);
  const [isHost, setIsHost] = useState(true);

  // Mock loading quiz data
  useEffect(() => {
    const mockQuiz: CustomQuiz = {
      id: gameCode || 'custom-quiz-1',
      title: 'Custom Geography Quiz',
      description: 'Test your knowledge of world geography',
      questions: [
        {
          id: '1',
          text: 'What is the capital of France?',
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correctAnswer: 2
        },
        {
          id: '2',
          text: 'Which continent is Australia in?',
          options: ['Asia', 'Oceania', 'Africa', 'Europe'],
          correctAnswer: 1
        }
      ],
      settings: {
        maxPlayers: 4,
        timerPerQuestion: 20,
        multiplierEnabled: true,
        skipAllowed: true
      }
    };
    setQuiz(mockQuiz);
    setTimeLeft(mockQuiz.settings.timerPerQuestion);
  }, [gameCode]);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeUp();
    }
  }, [timeLeft, gameState]);

  const handleTimeUp = () => {
    setTimeout(() => {
      if (currentQuestion + 1 < (quiz?.questions.length || 0)) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setTimeLeft(quiz?.settings.timerPerQuestion || 20);
      } else {
        setGameState('results');
      }
    }, 2000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    
    if (quiz && answerIndex === quiz.questions[currentQuestion].correctAnswer) {
      const multiplier = quiz.settings.multiplierEnabled ? Math.max(1, Math.floor(timeLeft / 5)) : 1;
      setPlayers(prev => prev.map(p => 
        p.id === '1' ? { ...p, score: p.score + (10 * multiplier) } : p
      ));
    }
  };

  const handleSkipQuestion = () => {
    if (!quiz?.settings.skipAllowed) return;
    
    setPlayers(prev => prev.map(p => 
      p.id === '1' ? { ...p, hasSkipped: true } : p
    ));
    setSelectedAnswer(-1);
    
    setTimeout(() => {
      if (currentQuestion + 1 < (quiz?.questions.length || 0)) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setTimeLeft(quiz?.settings.timerPerQuestion || 20);
      } else {
        setGameState('results');
      }
    }, 1000);
  };

  const startGame = () => {
    setGameState('playing');
  };

  const addMockPlayer = () => {
    const mockNames = ['Alice', 'Bob', 'Charlie', 'Diana'];
    const availableName = mockNames.find(name => 
      !players.some(p => p.name === name)
    );
    
    if (availableName && players.length < (quiz?.settings.maxPlayers || 4)) {
      setPlayers(prev => [...prev, {
        id: Date.now().toString(),
        name: availableName,
        score: 0,
        isHost: false,
        hasSkipped: false
      }]);
    }
  };

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Loading Custom Quiz</h3>
            <p className="text-gray-600 text-center">Setting up your quiz...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'waiting') {
    return (
      <GameWaitingRoom 
        quiz={quiz}
        gameCode={gameCode || ''}
        players={players}
        isHost={isHost}
        onStartGame={startGame}
        onAddMockPlayer={addMockPlayer}
      />
    );
  }

  if (gameState === 'results') {
    return <GameResultsScreen quiz={quiz} players={players} />;
  }

  const currentQ = quiz.questions[currentQuestion];
  const canSkip = quiz.settings.skipAllowed && !players.find(p => p.id === '1')?.hasSkipped;

  return (
    <QuizGameplay 
      quiz={quiz}
      currentQuestion={currentQuestion}
      currentQ={currentQ}
      timeLeft={timeLeft}
      selectedAnswer={selectedAnswer}
      players={players}
      canSkip={canSkip}
      onAnswerSelect={handleAnswerSelect}
      onSkipQuestion={handleSkipQuestion}
    />
  );
};

export default CustomQuizMultiplayer;

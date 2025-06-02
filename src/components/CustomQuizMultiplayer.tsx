
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Crown, Clock, Trophy, Loader2, SkipForward, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CustomQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface CustomQuiz {
  id: string;
  title: string;
  description: string;
  questions: CustomQuestion[];
  settings: {
    maxPlayers: number;
    timerPerQuestion: number;
    multiplierEnabled: boolean;
    skipAllowed: boolean;
  };
}

interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
  hasSkipped: boolean;
}

const CustomQuizMultiplayer = () => {
  const navigate = useNavigate();
  const { gameCode } = useParams();
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'results'>('waiting');
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
    // In real implementation, this would fetch the quiz from backend/storage
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            <p className="text-gray-600">{quiz.description}</p>
            <p className="text-gray-600">Game Code: <span className="font-mono font-bold text-purple-600">{gameCode}</span></p>
            <div className="flex justify-center gap-4 mt-2">
              <Badge variant="outline">{quiz.questions.length} Questions</Badge>
              <Badge variant="outline">{quiz.settings.timerPerQuestion}s Timer</Badge>
              <Badge variant="outline">Max {quiz.settings.maxPlayers} Players</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Players ({players.length}/{quiz.settings.maxPlayers})</h3>
                {players.length < quiz.settings.maxPlayers && (
                  <Button variant="outline" size="sm" onClick={addMockPlayer}>
                    Add Test Player
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    {player.isHost && <Crown className="w-4 h-4 text-yellow-500" />}
                    <span className="font-medium">{player.name}</span>
                    {player.isHost && <Badge variant="secondary">Host</Badge>}
                  </div>
                ))}
              </div>
              
              {isHost && players.length >= 2 && (
                <div className="text-center mt-6">
                  <Button onClick={startGame} size="lg" className="w-full">
                    <Play className="w-5 h-5 mr-2" />
                    Start Game
                  </Button>
                </div>
              )}
              
              {(!isHost || players.length < 2) && (
                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    {players.length < 2 ? 'Waiting for more players to join...' : 'Waiting for host to start the game...'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'results') {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl">Final Results</CardTitle>
              <p className="text-gray-600">{quiz.title}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedPlayers.map((player, index) => (
                  <div key={player.id} className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0 ? 'bg-yellow-100 border-2 border-yellow-300' : 
                    index === 1 ? 'bg-gray-100 border-2 border-gray-300' :
                    index === 2 ? 'bg-orange-100 border-2 border-orange-300' :
                    'bg-white border border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-500 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-gray-300 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium">{player.name}</span>
                      {index === 0 && <Crown className="w-5 h-5 text-yellow-500" />}
                    </div>
                    <div className="text-lg font-bold">{player.score} pts</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/host')}
                >
                  Create Another Quiz
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const canSkip = quiz.settings.skipAllowed && !players.find(p => p.id === '1')?.hasSkipped;

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
                onClick={handleSkipQuestion}
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
                  onClick={() => handleAnswerSelect(index)}
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
                .map((player, index) => (
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

export default CustomQuizMultiplayer;

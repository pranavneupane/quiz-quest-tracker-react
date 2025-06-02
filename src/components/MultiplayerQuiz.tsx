
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Crown, Clock, Trophy, Loader2, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchQuestions, Question } from '../services/questionApi';

interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
}

const MultiplayerQuiz = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [gameState, setGameState] = useState<'loading' | 'waiting' | 'playing' | 'results'>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(20); // Changed to 20 seconds
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'You', score: 0, isHost: false },
    { id: '2', name: 'Alice', score: 0, isHost: true },
    { id: '3', name: 'Bob', score: 0, isHost: false },
    { id: '4', name: 'Charlie', score: 0, isHost: false }
  ]);

  // Load questions from API on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      console.log('Loading questions from API...');
      try {
        const apiQuestions = await fetchQuestions(5); // Get 5 questions for demo
        setQuestions(apiQuestions);
        setGameState('waiting');
        console.log('Questions loaded:', apiQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
        setGameState('waiting'); // Continue with fallback questions
      }
    };

    loadQuestions();
  }, []);

  // Mock game start after 3 seconds in waiting
  useEffect(() => {
    if (gameState === 'waiting') {
      const timer = setTimeout(() => {
        setGameState('playing');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  // Timer for questions
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      // Auto submit and show results
      setTimeout(() => {
        if (currentQuestion + 1 < questions.length) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setTimeLeft(20); // Reset to 20 seconds
        } else {
          setGameState('results');
        }
      }, 2000);
    }
  }, [timeLeft, gameState, currentQuestion, questions.length]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    
    // Update scores (mock)
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setPlayers(prev => prev.map(p => 
        p.id === '1' ? { ...p, score: p.score + 1 } : p
      ));
    }
    
    // Simulate other players answering
    setTimeout(() => {
      setPlayers(prev => prev.map(p => 
        p.id !== '1' ? { ...p, score: p.score + Math.floor(Math.random() * 2) } : p
      ));
    }, 1000);
  };

  const handleSkipQuestion = () => {
    setSelectedAnswer(-1); // Use -1 to indicate skipped
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setTimeLeft(20);
      } else {
        setGameState('results');
      }
    }, 1000);
  };

  if (gameState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Loading Quiz Questions</h3>
            <p className="text-gray-600 text-center">Fetching questions from our database...</p>
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
            <CardTitle className="text-2xl">Waiting for Game to Start</CardTitle>
            <p className="text-gray-600">Session Code: <span className="font-mono font-bold">{sessionId?.slice(-6).toUpperCase()}</span></p>
            <p className="text-sm text-green-600 mt-2">✓ {questions.length} questions loaded</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Players ({players.length})</h3>
              <div className="grid grid-cols-2 gap-3">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    {player.isHost && <Crown className="w-4 h-4 text-yellow-500" />}
                    <span className="font-medium">{player.name}</span>
                    {player.isHost && <Badge variant="secondary">Host</Badge>}
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <div className="animate-pulse text-purple-600 font-medium">
                  Game starting soon...
                </div>
              </div>
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
                  onClick={() => navigate('/join')}
                >
                  Play Again
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

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <h3 className="text-lg font-semibold mb-2 text-red-600">No Questions Available</h3>
            <p className="text-gray-600 text-center mb-4">Unable to load quiz questions.</p>
            <Button onClick={() => navigate('/join')}>
              Back to Lobby
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/join')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-black">Multiplayer Quiz</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleSkipQuestion}
              disabled={selectedAnswer !== null}
              className="text-sm"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip
            </Button>
            <div className="text-white/80">
              Question {currentQuestion + 1} / {questions.length}
            </div>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
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
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-4">
                  {currentQ.category && (
                    <Badge variant="secondary" className="mb-2">
                      {currentQ.category}
                    </Badge>
                  )}
                  {currentQ.difficulty && (
                    <Badge variant="outline" className="ml-2">
                      {currentQ.difficulty}
                    </Badge>
                  )}
                </div>
                
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
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <Card className="bg-white/95 backdrop-blur-sm sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Live Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {players
                    .sort((a, b) => b.score - a.score)
                    .map((player, index) => (
                    <div key={player.id} className={`flex items-center justify-between p-3 rounded-lg ${
                      player.id === '1' ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-400 text-white' :
                          'bg-gray-300 text-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium text-sm">{player.name}</span>
                      </div>
                      <span className="font-bold">{player.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerQuiz;

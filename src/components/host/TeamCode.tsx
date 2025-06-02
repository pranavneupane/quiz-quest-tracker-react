
import React, { useState } from 'react';
import { Users, Copy, Play, Clock, Trophy, SkipForward, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Player {
  id: string;
  name: string;
  score: number;
  connected: boolean;
  hasSkipped: boolean;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

const HARDCODED_QUESTIONS: Question[] = [
  {
    id: '1',
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2
  },
  {
    id: '2',
    text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1
  },
  {
    id: '3',
    text: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
    correctAnswer: 1
  }
];

const TeamCode = () => {
  const { toast } = useToast();
  const [roomCode, setRoomCode] = useState<string>('');
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'playing' | 'finished'>('idle');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20); // Changed to 20 seconds
  const [playerAnswers, setPlayerAnswers] = useState<Record<string, number>>({});
  const [multiplierEnabled, setMultiplierEnabled] = useState(true);
  const [skipUsed, setSkipUsed] = useState<Record<string, boolean>>({});

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setGameState('waiting');
    setPlayers([]);
    setSkipUsed({});
    toast({ title: "Room Created!", description: `Room code: ${code} - Only humans can join` });
    
    // Simulate first human player joining
    setTimeout(() => {
      const player1: Player = {
        id: 'player1',
        name: 'Player 1',
        score: 0,
        connected: true,
        hasSkipped: false
      };
      setPlayers([player1]);
      toast({ title: "Human Player Joined!", description: "Player 1 has joined the room" });
    }, 1000);

    // Simulate second human player joining
    setTimeout(() => {
      const player2: Player = {
        id: 'player2', 
        name: 'Player 2',
        score: 0,
        connected: true,
        hasSkipped: false
      };
      setPlayers(prev => [...prev, player2]);
      toast({ title: "Game Starting!", description: "Player 2 joined. Game will start in 3 seconds!" });
      
      setTimeout(() => {
        setGameState('playing');
        setCurrentQuestion(0);
        setTimeLeft(20); // 20 seconds per question
        startQuestionTimer();
      }, 3000);
    }, 3000);
  };

  const startQuestionTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQuestionEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSkipQuestion = (playerId: string) => {
    if (skipUsed[playerId]) return;
    
    setSkipUsed(prev => ({ ...prev, [playerId]: true }));
    setPlayers(prev => prev.map(player => 
      player.id === playerId ? { ...player, hasSkipped: true } : player
    ));
    
    toast({ title: "Question Skipped!", description: `${playerId === 'player1' ? 'Player 1' : 'Player 2'} used their skip` });
    
    // If both players have answered or skipped, move to next question
    const allPlayersReady = players.every(player => 
      playerAnswers[player.id] !== undefined || skipUsed[player.id]
    );
    
    if (allPlayersReady) {
      setTimeout(() => handleQuestionEnd(), 1000);
    }
  };

  const handleQuestionEnd = () => {
    // Simulate random player answers for those who didn't skip
    const answers: Record<string, number> = {};
    players.forEach(player => {
      if (!skipUsed[player.id]) {
        answers[player.id] = Math.floor(Math.random() * 4);
      }
    });
    setPlayerAnswers(answers);

    // Update scores with multiplier
    const correctAnswer = HARDCODED_QUESTIONS[currentQuestion].correctAnswer;
    setPlayers(prev => prev.map(player => {
      if (skipUsed[player.id]) return player; // No points for skipped questions
      
      const isCorrect = answers[player.id] === correctAnswer;
      let points = isCorrect ? 1 : 0;
      
      // Apply multiplier if enabled and answered quickly (simulate quick answer)
      if (multiplierEnabled && isCorrect && timeLeft > 15) {
        points = 2; // Double points for quick correct answers
        toast({ title: "Speed Bonus!", description: `${player.name} gets double points!` });
      }
      
      return { ...player, score: player.score + points };
    }));

    setTimeout(() => {
      if (currentQuestion + 1 < HARDCODED_QUESTIONS.length) {
        setCurrentQuestion(prev => prev + 1);
        setTimeLeft(20);
        setPlayerAnswers({});
        // Reset skip status for next question
        setPlayers(prev => prev.map(player => ({ ...player, hasSkipped: false })));
        startQuestionTimer();
      } else {
        setGameState('finished');
        showFinalResults();
      }
    }, 3000);
  };

  const showFinalResults = () => {
    const winner = players.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    );
    toast({ 
      title: "Game Over!", 
      description: `${winner.name} wins with ${winner.score} points!` 
    });
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast({ title: "Copied!", description: "Room code copied to clipboard" });
  };

  const resetGame = () => {
    setGameState('idle');
    setRoomCode('');
    setPlayers([]);
    setCurrentQuestion(0);
    setTimeLeft(20);
    setPlayerAnswers({});
    setSkipUsed({});
  };

  if (gameState === 'idle') {
    return (
      <Card className="bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Team Code Multiplayer</CardTitle>
          <p className="text-gray-600">Create a room for human players only</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">Question Timer</span>
              <Badge variant="secondary">20 seconds</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium">Speed Multiplier</span>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <Badge variant="secondary">Enabled</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium">Skip Option</span>
              <div className="flex items-center gap-2">
                <SkipForward className="w-4 h-4 text-orange-600" />
                <Badge variant="secondary">Available</Badge>
              </div>
            </div>
          </div>
          <Button 
            onClick={generateRoomCode}
            className="w-full"
            size="lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Create Human-Only Room
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'waiting') {
    return (
      <Card className="bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Waiting for Human Players</CardTitle>
          <div className="space-y-2">
            <p className="text-gray-600">Share this room code with human players only:</p>
            <div className="flex items-center gap-2 justify-center">
              <Input 
                value={roomCode} 
                readOnly 
                className="text-center font-mono text-lg font-bold w-32"
              />
              <Button onClick={copyRoomCode} size="icon" variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-red-600">⚠️ Bots are disabled from joining</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="font-semibold">Human Players ({players.length}/2)</h3>
            {players.map((player) => (
              <div key={player.id} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-medium">{player.name}</span>
                <Badge variant="secondary">Human Player</Badge>
              </div>
            ))}
            {players.length < 2 && (
              <div className="text-center text-gray-500 py-4">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Waiting for {2 - players.length} more human player(s)</p>
              </div>
            )}
          </div>
          <Button onClick={resetGame} variant="outline" className="w-full">
            Cancel Room
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'playing') {
    const question = HARDCODED_QUESTIONS[currentQuestion];
    
    return (
      <Card className="bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">Question {currentQuestion + 1}/3</Badge>
            <div className="flex items-center gap-2">
              {multiplierEnabled && timeLeft > 15 && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs">
                  <Zap className="w-3 h-3" />
                  2x
                </div>
              )}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-white font-bold ${
                timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-orange-500' : 'bg-blue-500'
              }`}>
                <Clock className="w-4 h-4" />
                {timeLeft}s
              </div>
            </div>
          </div>
          <CardTitle className="text-xl">{question.text}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((option, index) => (
              <div
                key={index}
                className="p-3 border-2 border-gray-200 rounded-lg text-center"
              >
                <div className="font-medium text-sm text-gray-600 mb-1">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="text-sm">{option}</div>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Live Player Status:</h4>
            {players.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">{player.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Score: {player.score}</span>
                  {!skipUsed[player.id] && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSkipQuestion(player.id)}
                      className="text-xs h-6"
                    >
                      <SkipForward className="w-3 h-3 mr-1" />
                      Skip
                    </Button>
                  )}
                  {player.hasSkipped ? (
                    <Badge variant="secondary" className="text-xs">Skipped</Badge>
                  ) : playerAnswers[player.id] !== undefined ? (
                    <Badge variant="secondary" className="text-xs">Answered</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Thinking...</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'finished') {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    
    return (
      <Card className="bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Game Over!</CardTitle>
          {multiplierEnabled && (
            <p className="text-sm text-purple-600">Speed bonuses were applied for quick correct answers</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div 
                key={player.id} 
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0 ? 'bg-yellow-100 border-2 border-yellow-300' : 'bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium">{player.name}</span>
                  {index === 0 && <Badge className="bg-yellow-500">Winner!</Badge>}
                </div>
                <span className="font-bold text-lg">{player.score} pts</span>
              </div>
            ))}
          </div>
          <Button onClick={resetGame} className="w-full">
            Create New Human Room
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default TeamCode;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Search, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PlayerLobby = () => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  const availableQuizzes = [
    {
      id: '1',
      title: 'General Knowledge Challenge',
      description: 'Test your knowledge across various topics',
      questions: 10,
      difficulty: 'Medium',
      category: 'General',
      estimatedTime: '15 min'
    },
    {
      id: '2',
      title: 'Science Trivia',
      description: 'Explore the wonders of science',
      questions: 15,
      difficulty: 'Hard',
      category: 'Science',
      estimatedTime: '20 min'
    },
    {
      id: '3',
      title: 'History Quiz',
      description: 'Journey through historical events',
      questions: 12,
      difficulty: 'Easy',
      category: 'History',
      estimatedTime: '18 min'
    }
  ];

  const joinMultiplayer = () => {
    if (joinCode && playerName) {
      navigate(`/multiplayer/session_${joinCode}`);
    }
  };

  const startSolo = (quizId: string) => {
    navigate(`/solo/${quizId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            className="text-black hover:bg-black/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-black">Player Lobby</h1>
            <p className="text-black/70">Choose your quiz adventure</p>
          </div>
        </div>

        <Tabs defaultValue="solo" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-sm">
            <TabsTrigger value="solo" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
              Solo Play
            </TabsTrigger>
            <TabsTrigger value="multiplayer" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
              Multiplayer
            </TabsTrigger>
          </TabsList>

          {/* Solo Tab */}
          <TabsContent value="solo" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableQuizzes.map((quiz) => (
                <Card key={quiz.id} className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all hover:scale-105">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Questions:</span>
                        <div>{quiz.questions}</div>
                      </div>
                      <div>
                        <span className="font-medium">Time:</span>
                        <div>{quiz.estimatedTime}</div>
                      </div>
                      <div>
                        <span className="font-medium">Category:</span>
                        <div>{quiz.category}</div>
                      </div>
                      <div>
                        <span className="font-medium">Difficulty:</span>
                        <div>{quiz.difficulty}</div>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => startSolo(quiz.id)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Multiplayer Tab */}
          <TabsContent value="multiplayer" className="mt-6">
            <div className="max-w-md mx-auto">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>Join Multiplayer Session</CardTitle>
                  <CardDescription>Enter the session code provided by your host</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Your Name
                    </label>
                    <Input
                      placeholder="Enter your name"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Session Code
                    </label>
                    <Input
                      placeholder="Enter 6-digit code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      maxLength={6}
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={joinMultiplayer}
                    disabled={!joinCode || !playerName}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Join Session
                  </Button>
                </CardContent>
              </Card>

              {/* Live Sessions (Mock) */}
              <Card className="bg-white/95 backdrop-blur-sm mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Live Sessions</CardTitle>
                  <CardDescription>Join ongoing multiplayer games</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-gray-500 py-8">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No live sessions available</p>
                    <p className="text-sm">Ask your host to start a session</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlayerLobby;

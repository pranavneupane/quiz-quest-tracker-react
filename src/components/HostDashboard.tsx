
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Users, BarChart3, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import QuizCreator from './QuizCreator';
import { useToast } from '@/hooks/use-toast';

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  created: string;
  plays: number;
}

const HostDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showCreator, setShowCreator] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: '1',
      title: 'General Knowledge Challenge',
      description: 'Test your knowledge across various topics',
      questions: 10,
      category: 'General',
      difficulty: 'Medium',
      created: '2024-01-15',
      plays: 156
    },
    {
      id: '2',
      title: 'Science Trivia',
      description: 'Explore the wonders of science',
      questions: 15,
      category: 'Science',
      difficulty: 'Hard',
      created: '2024-01-10',
      plays: 89
    }
  ]);

  const startMultiplayerSession = (quizId: string) => {
    const sessionId = `session_${Date.now()}`;
    toast({
      title: "Session Started!",
      description: `Multiplayer session created. Share code: ${sessionId.slice(-6).toUpperCase()}`,
    });
    navigate(`/multiplayer/${sessionId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showCreator) {
    return <QuizCreator onBack={() => setShowCreator(false)} onSave={(quiz) => {
      setQuizzes(prev => [...prev, { ...quiz, id: Date.now().toString(), created: new Date().toISOString().split('T')[0], plays: 0 }]);
      setShowCreator(false);
      toast({ title: "Quiz Created!", description: "Your quiz has been saved successfully." });
    }} />;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Host Dashboard</h1>
              <p className="text-white/80">Manage your quizzes and sessions</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowCreator(true)}
            className="bg-white text-purple-600 hover:bg-white/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Quiz
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Quizzes</p>
                  <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Plays</p>
                  <p className="text-2xl font-bold text-gray-900">{quizzes.reduce((sum, quiz) => sum + quiz.plays, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Play className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{new Set(quizzes.map(q => q.category)).size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-shadow">
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
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{quiz.questions} questions</span>
                  <span>{quiz.category}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Created: {quiz.created}</span>
                  <span>{quiz.plays} plays</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => startMultiplayerSession(quiz.id)}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Start Session
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => navigate(`/solo/${quiz.id}`)}
                  >
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;

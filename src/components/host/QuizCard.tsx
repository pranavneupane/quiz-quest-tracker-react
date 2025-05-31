
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard = ({ quiz }: QuizCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startMultiplayerSession = () => {
    const sessionId = `session_${Date.now()}`;
    toast({
      title: "Session Started!",
      description: `Multiplayer session created. Share code: ${sessionId.slice(-6).toUpperCase()}`,
    });
    navigate(`/multiplayer/${sessionId}`);
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-shadow">
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
            onClick={startMultiplayerSession}
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
  );
};

export default QuizCard;


import React, { useState } from 'react';
import QuizCreator from './QuizCreator';
import HostDashboardHeader from './host/HostDashboardHeader';
import HostDashboardStats from './host/HostDashboardStats';
import QuizList from './host/QuizList';
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

  const handleCreateQuiz = () => {
    setShowCreator(true);
  };

  const handleQuizSave = (quiz: Omit<Quiz, 'id' | 'created' | 'plays'>) => {
    setQuizzes(prev => [...prev, { 
      ...quiz, 
      id: Date.now().toString(), 
      created: new Date().toISOString().split('T')[0], 
      plays: 0 
    }]);
    setShowCreator(false);
    toast({ 
      title: "Quiz Created!", 
      description: "Your quiz has been saved successfully." 
    });
  };

  if (showCreator) {
    return (
      <QuizCreator 
        onBack={() => setShowCreator(false)} 
        onSave={handleQuizSave} 
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <HostDashboardHeader onCreateQuiz={handleCreateQuiz} />
        <HostDashboardStats quizzes={quizzes} />
        <QuizList quizzes={quizzes} />
      </div>
    </div>
  );
};

export default HostDashboard;

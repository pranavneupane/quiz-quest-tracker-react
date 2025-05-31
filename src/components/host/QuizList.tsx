
import React from 'react';
import QuizCard from './QuizCard';

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

interface QuizListProps {
  quizzes: Quiz[];
}

const QuizList = ({ quizzes }: QuizListProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
};

export default QuizList;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuizLogic } from '../hooks/useQuizLogic';
import QuizLoadingError from './quiz/QuizLoadingError';
import QuizFinalResults from './quiz/QuizFinalResults';
import QuizProgress from './quiz/QuizProgress';
import QuizTimer from './quiz/QuizTimer';
import QuestionCard from './quiz/QuestionCard';
import QuizScore from './quiz/QuizScore';

const SoloQuiz = () => {
  const navigate = useNavigate();
  const {
    questions,
    currentQuestion,
    score,
    selectedAnswer,
    showResult,
    timeLeft,
    quizCompleted,
    loading,
    error,
    handleAnswerSelect
  } = useQuizLogic();

  // Loading or error states
  if (loading || error) {
    return (
      <QuizLoadingError
        loading={loading}
        error={error}
        onBackToSelection={() => navigate('/join')}
      />
    );
  }

  // Quiz completed state
  if (quizCompleted) {
    return (
      <QuizFinalResults
        score={score}
        totalQuestions={questions.length}
        onTakeAnother={() => navigate('/join')}
        onBackToHome={() => navigate('/')}
      />
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/join')}
            className="text-black hover:bg-black/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <QuizProgress
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            category={currentQ?.category}
          />
        </div>

        {/* Timer */}
        <QuizTimer timeLeft={timeLeft} />

        {/* Question Card */}
        <QuestionCard
          question={currentQ}
          selectedAnswer={selectedAnswer}
          showResult={showResult}
          onAnswerSelect={handleAnswerSelect}
        />

        {/* Score */}
        <QuizScore score={score} totalQuestions={questions.length} />
      </div>
    </div>
  );
};

export default SoloQuiz;

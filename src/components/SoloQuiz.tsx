
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Trophy, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { fetchQuestions, Question } from '../services/questionApi';

const SoloQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        console.log('Fetching unique questions for solo quiz...');
        const fetchedQuestions = await fetchQuestions(5); // 5 questions per quiz
        setQuestions(fetchedQuestions);
        console.log('Questions loaded:', fetchedQuestions);
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResult && !quizCompleted && !loading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && !loading) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, quizCompleted, loading]);

  const handleTimeUp = () => {
    setShowResult(true);
    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
    }
  };

  const getOptionClass = (optionIndex: number) => {
    const baseClass = "w-full p-4 text-left rounded-xl transition-all duration-300 cursor-pointer";
    
    if (!showResult) {
      return `${baseClass} bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300`;
    }
    
    if (optionIndex === questions[currentQuestion].correctAnswer) {
      return `${baseClass} bg-green-100 border-2 border-green-500 text-green-800`;
    }
    
    if (selectedAnswer === optionIndex && optionIndex !== questions[currentQuestion].correctAnswer) {
      return `${baseClass} bg-red-100 border-2 border-red-500 text-red-800`;
    }
    
    return `${baseClass} bg-gray-100 border-2 border-gray-300 text-gray-500`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Quiz...</h2>
            <p className="text-gray-600">Fetching unique questions for you</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/join')}>
              Back to Quiz Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
            <div className="text-6xl font-bold text-blue-600 mb-2">{percentage}%</div>
            <p className="text-gray-600 text-lg mb-6">
              {score} out of {questions.length} correct
            </p>
            <div className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => navigate('/join')}
              >
                Take Another Quiz
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
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">
            {currentQ?.category || 'Quiz Challenge'}
          </h1>
          <div className="text-white/80">
            {currentQuestion + 1} / {questions.length}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress 
            value={((currentQuestion + 1) / questions.length) * 100} 
            className="h-2"
          />
        </div>

        {/* Timer */}
        <div className="flex justify-center mb-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold ${
            timeLeft <= 10 ? 'bg-red-500' : 'bg-blue-500'
          }`}>
            <Clock className="w-5 h-5" />
            {timeLeft}s
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-white/95 backdrop-blur-sm mb-6">
          <CardContent className="p-8">
            <div className="mb-4 text-center">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                currentQ?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                currentQ?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentQ?.difficulty || 'Unknown'} difficulty
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              {currentQ?.text}
            </h2>
            
            <div className="grid gap-4">
              {currentQ?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={getOptionClass(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Result Feedback */}
            {showResult && (
              <div className="mt-8 text-center animate-fade-in">
                {selectedAnswer === currentQ.correctAnswer ? (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="w-8 h-8" />
                    <span className="text-2xl font-bold">Correct!</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-red-600">
                      <XCircle className="w-8 h-8" />
                      <span className="text-2xl font-bold">Incorrect!</span>
                    </div>
                    <p className="text-gray-600">
                      Correct answer: {currentQ.options[currentQ.correctAnswer]}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Score */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full backdrop-blur-sm">
            <Trophy className="w-5 h-5" />
            <span className="font-bold">Score: {score}/{questions.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoloQuiz;

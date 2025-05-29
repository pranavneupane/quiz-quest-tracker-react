
import { useState, useEffect } from 'react';
import { Question, fetchQuestions } from '../services/questionApi';

export const useQuizLogic = () => {
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

  return {
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
  };
};

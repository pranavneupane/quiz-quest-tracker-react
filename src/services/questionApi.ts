
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  category?: string;
  difficulty?: string;
}

export interface QuizSession {
  id: string;
  questions: Question[];
  createdAt: string;
}

// Using Open Trivia Database API as it's free and doesn't require API key
const TRIVIA_API_BASE = 'https://opentdb.com/api.php';

export const fetchQuestions = async (amount: number = 10, category?: string, difficulty?: string): Promise<Question[]> => {
  try {
    let url = `${TRIVIA_API_BASE}?amount=${amount}&type=multiple`;
    
    if (category) {
      url += `&category=${category}`;
    }
    
    if (difficulty) {
      url += `&difficulty=${difficulty}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    
    if (data.response_code !== 0) {
      throw new Error('Failed to fetch questions from API');
    }

    // Transform API response to our Question format
    return data.results.map((item: any, index: number) => {
      const incorrectAnswers = item.incorrect_answers;
      const correctAnswer = item.correct_answer;
      
      // Randomly place correct answer among options
      const correctIndex = Math.floor(Math.random() * 4);
      const options = [...incorrectAnswers];
      options.splice(correctIndex, 0, correctAnswer);
      
      return {
        id: `q_${Date.now()}_${index}`,
        text: decodeHtmlEntities(item.question),
        options: options.map((option: string) => decodeHtmlEntities(option)),
        correctAnswer: correctIndex,
        category: item.category,
        difficulty: item.difficulty
      };
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    // Fallback to mock questions if API fails
    return getFallbackQuestions();
  }
};

// Helper function to decode HTML entities
const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

// Fallback questions if API fails
const getFallbackQuestions = (): Question[] => [
  {
    id: 'fallback_1',
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    category: 'Geography',
    difficulty: 'easy'
  },
  {
    id: 'fallback_2',
    text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: 'fallback_3',
    text: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 1,
    category: 'Mathematics',
    difficulty: 'easy'
  }
];

export const createQuizSession = async (questionCount: number = 10): Promise<QuizSession> => {
  const questions = await fetchQuestions(questionCount);
  
  return {
    id: `session_${Date.now()}`,
    questions,
    createdAt: new Date().toISOString()
  };
};

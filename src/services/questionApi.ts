
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

// Store used question IDs to avoid repeats
const usedQuestionIds = new Set<string>();

// Available categories for variety
const CATEGORIES = [
  9,   // General Knowledge
  10,  // Entertainment: Books
  11,  // Entertainment: Film
  12,  // Entertainment: Music
  17,  // Science & Nature
  18,  // Science: Computers
  19,  // Science: Mathematics
  20,  // Mythology
  21,  // Sports
  22,  // Geography
  23,  // History
  27   // Animals
];

// Difficulty levels
const DIFFICULTIES = ['easy', 'medium', 'hard'];

export const fetchQuestions = async (amount: number = 10, category?: string, difficulty?: string): Promise<Question[]> => {
  const questions: Question[] = [];
  let attempts = 0;
  const maxAttempts = 5;

  while (questions.length < amount && attempts < maxAttempts) {
    try {
      // Randomize category and difficulty for variety
      const randomCategory = category || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const randomDifficulty = difficulty || DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];
      
      let url = `${TRIVIA_API_BASE}?amount=${Math.min(amount - questions.length, 10)}&type=multiple`;
      url += `&category=${randomCategory}`;
      url += `&difficulty=${randomDifficulty}`;

      console.log(`Fetching questions: category=${randomCategory}, difficulty=${randomDifficulty}`);

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.response_code !== 0) {
        console.warn(`API response code: ${data.response_code}, trying fallback...`);
        attempts++;
        continue;
      }

      // Transform API response to our Question format
      const newQuestions = data.results
        .map((item: any, index: number) => {
          const questionId = `${item.question}_${randomCategory}_${randomDifficulty}`;
          
          // Skip if we've used this question before
          if (usedQuestionIds.has(questionId)) {
            return null;
          }

          usedQuestionIds.add(questionId);

          const incorrectAnswers = item.incorrect_answers;
          const correctAnswer = item.correct_answer;
          
          // Randomly place correct answer among options
          const correctIndex = Math.floor(Math.random() * 4);
          const options = [...incorrectAnswers];
          options.splice(correctIndex, 0, correctAnswer);
          
          return {
            id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            text: decodeHtmlEntities(item.question),
            options: options.map((option: string) => decodeHtmlEntities(option)),
            correctAnswer: correctIndex,
            category: item.category,
            difficulty: item.difficulty
          };
        })
        .filter(Boolean);

      questions.push(...newQuestions);
      attempts++;
    } catch (error) {
      console.error('Error fetching questions:', error);
      attempts++;
    }
  }

  // If we still don't have enough questions, add fallback questions
  if (questions.length < amount) {
    const fallbackNeeded = amount - questions.length;
    const fallbackQuestions = getFallbackQuestions().slice(0, fallbackNeeded);
    questions.push(...fallbackQuestions);
  }

  return questions;
};

// Helper function to decode HTML entities
const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

// Enhanced fallback questions with varied difficulty
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
    text: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
    correctAnswer: 1,
    category: 'Animals',
    difficulty: 'medium'
  },
  {
    id: 'fallback_4',
    text: 'In which year did World War II end?',
    options: ['1944', '1945', '1946', '1947'],
    correctAnswer: 1,
    category: 'History',
    difficulty: 'medium'
  },
  {
    id: 'fallback_5',
    text: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'hard'
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

// Function to clear used questions (useful for testing)
export const clearUsedQuestions = () => {
  usedQuestionIds.clear();
};

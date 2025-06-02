
export interface CustomQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface CustomQuiz {
  id: string;
  title: string;
  description: string;
  questions: CustomQuestion[];
  settings: {
    maxPlayers: number;
    timerPerQuestion: number;
    multiplierEnabled: boolean;
    skipAllowed: boolean;
  };
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
  hasSkipped: boolean;
}

export type GameState = 'waiting' | 'playing' | 'results';

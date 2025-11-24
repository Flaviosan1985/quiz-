export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export enum GameState {
  MENU = 'MENU',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR'
}

export interface QuizTopic {
  id: string;
  label: string;
  icon: string;
  promptContext: string;
  color: string;
}

export interface QuizResult {
  total: number;
  correct: number;
  history: {
    question: string;
    isCorrect: boolean;
  }[];
}
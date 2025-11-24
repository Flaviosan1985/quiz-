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

export interface HistoryItem {
  questionItem: Question;
  isCorrect: boolean;
  selectedOption: number | null;
}

export interface QuizResult {
  total: number;
  correct: number;
  history: HistoryItem[];
}

export interface UserHistoryItem {
  id: string;
  date: string;
  topicId: string;
  topicLabel: string;
  score: number;
  total: number;
}

export interface StudyTip {
  id: string;
  title: string;
  category: string;
  icon: string;
  content: string;
  color: string;
}
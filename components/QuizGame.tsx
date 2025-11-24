import React, { useState } from 'react';
import { Question, HistoryItem } from '../types';
import { Button } from './Button';

interface QuizGameProps {
  questions: Question[];
  onFinish: (score: number, history: HistoryItem[]) => void;
  isReviewMode?: boolean;
}

export const QuizGame: React.FC<QuizGameProps> = ({ questions, onFinish, isReviewMode = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setHistory(prev => [...prev, {
      questionItem: currentQuestion,
      isCorrect,
      selectedOption: index
    }]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onFinish(score, history);
    }
  };

  const getOptionStyles = (index: number) => {
    const base = "w-full p-5 rounded-xl text-left border-2 transition-all duration-200 mb-3 relative overflow-hidden group flex items-start ";
    
    if (!isAnswered) {
      return base + "border-slate-100 bg-white hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-md cursor-pointer active:scale-[0.99]";
    }

    if (index === currentQuestion.correctAnswerIndex) {
      // Correta (Verde)
      return base + "border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500 shadow-sm";
    }

    if (index === selectedOption && index !== currentQuestion.correctAnswerIndex) {
      // Errada selecionada (Vermelho)
      return base + "border-red-400 bg-red-50 text-red-900 opacity-90";
    }

    // Neutras desabilitadas
    return base + "border-slate-100 opacity-40 grayscale bg-slate-50";
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 animate-enter">
      {/* Header com Progresso */}
      <div className={`bg-white p-4 rounded-2xl shadow-sm border mb-6 ${isReviewMode ? 'border-amber-200 bg-amber-50' : 'border-slate-100'}`}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            {isReviewMode && (
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wide">
                Modo Revisão
              </span>
            )}
            <span className={`text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full border ${isReviewMode ? 'bg-white text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
              Questão {currentIndex + 1} <span className="text-slate-400">/ {questions.length}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-slate-400">Acertos</span>
            <span className="text-sm font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{score}</span>
          </div>
        </div>
        
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full transition-all duration-700 ease-out rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] ${isReviewMode ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card da Questão */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-white p-6 md:p-10 mb-6 relative overflow-hidden">
        {/* Background Decorativo sutil */}
        <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full blur-3xl opacity-50 pointer-events-none ${isReviewMode ? 'bg-amber-100' : 'bg-blue-50'}`}></div>

        <h2 className="relative z-10 text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-snug tracking-tight">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3 relative z-10">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleOptionClick(idx)}
              className={getOptionStyles(idx)}
            >
              <span className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center mr-4 text-sm font-bold transition-colors shadow-sm mt-0.5 ${
                 isAnswered && idx === currentQuestion.correctAnswerIndex ? 'bg-emerald-500 text-white border-emerald-500' :
                 isAnswered && idx === selectedOption ? 'bg-red-500 text-white border-red-500' :
                 'bg-white border-slate-200 text-slate-500 group-hover:border-blue-400 group-hover:text-blue-600'
              }`}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-grow text-base md:text-lg font-medium">{option}</span>
              
              {isAnswered && idx === currentQuestion.correctAnswerIndex && (
                <span className="flex-shrink-0 ml-3 text-emerald-600 bg-emerald-100 rounded-full p-1 animate-enter">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && (
                <span className="flex-shrink-0 ml-3 text-red-500 bg-red-100 rounded-full p-1 animate-enter">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback & Next Button */}
      {isAnswered && (
        <div className="animate-enter space-y-6 pb-10">
          <div className={`p-6 rounded-2xl border shadow-sm backdrop-blur-sm ${
             selectedOption === currentQuestion.correctAnswerIndex 
              ? 'bg-emerald-50/80 border-emerald-200' 
              : 'bg-blue-50/80 border-blue-200'
          }`}>
            <h4 className={`font-bold mb-3 flex items-center gap-2 ${
               selectedOption === currentQuestion.correctAnswerIndex 
               ? 'text-emerald-900' 
               : 'text-blue-900'
            }`}>
              <span className="text-2xl">
                {selectedOption === currentQuestion.correctAnswerIndex ? '🎉' : '🧐'}
              </span>
              <span className="text-lg">
                {selectedOption === currentQuestion.correctAnswerIndex ? 'Excelente! Resposta Correta' : 'Entenda a Resposta'}
              </span> 
            </h4>
            <div className={`prose prose-sm max-w-none leading-relaxed text-base ${
               selectedOption === currentQuestion.correctAnswerIndex 
               ? 'text-emerald-800' 
               : 'text-blue-800'
            }`}>
              {currentQuestion.explanation}
            </div>
          </div>
          
          <Button fullWidth onClick={handleNext} variant="primary" className="py-4 text-lg font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all transform">
            {currentIndex === questions.length - 1 ? 'Ver Resultado Final 🏁' : 'Próxima Questão ➔'}
          </Button>
        </div>
      )}
    </div>
  );
};
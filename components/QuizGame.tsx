import React, { useState } from 'react';
import { Question } from '../types';
import { Button } from './Button';

interface QuizGameProps {
  questions: Question[];
  onFinish: (score: number, history: { question: string; isCorrect: boolean }[]) => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<{ question: string; isCorrect: boolean }[]>([]);

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
      question: currentQuestion.question,
      isCorrect
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
    const base = "w-full p-4 md:p-5 rounded-xl text-left border-2 transition-all duration-200 mb-3 relative overflow-hidden group flex items-center ";
    
    if (!isAnswered) {
      return base + "border-slate-100 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md cursor-pointer";
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
    return base + "border-slate-100 opacity-50 grayscale bg-slate-50";
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-2">
      {/* Progress Header */}
      <div className="flex flex-col mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-2 py-1 rounded">
            Questão {currentIndex + 1} de {questions.length}
          </span>
          <span className="text-xs font-bold text-slate-400">
            Score: {score}
          </span>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-10 mb-6 animate-fade-in-up">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-snug tracking-tight">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleOptionClick(idx)}
              className={getOptionStyles(idx)}
            >
              <span className={`w-8 h-8 flex-shrink-0 rounded-lg border flex items-center justify-center mr-4 text-sm font-bold transition-colors ${
                 isAnswered && idx === currentQuestion.correctAnswerIndex ? 'bg-emerald-500 text-white border-emerald-500' :
                 isAnswered && idx === selectedOption ? 'bg-red-500 text-white border-red-500' :
                 'bg-white border-slate-200 text-slate-500 group-hover:border-blue-400 group-hover:text-blue-600'
              }`}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-grow pt-0.5 text-base">{option}</span>
              
              {isAnswered && idx === currentQuestion.correctAnswerIndex && (
                <span className="flex-shrink-0 ml-3 text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && (
                <span className="flex-shrink-0 ml-3 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
        <div className="animate-fade-in-up space-y-6">
          <div className={`p-6 rounded-xl border-l-4 shadow-sm ${
             selectedOption === currentQuestion.correctAnswerIndex 
              ? 'bg-emerald-50 border-emerald-500' 
              : 'bg-blue-50 border-blue-500'
          }`}>
            <h4 className={`font-bold mb-2 flex items-center gap-2 ${
               selectedOption === currentQuestion.correctAnswerIndex 
               ? 'text-emerald-900' 
               : 'text-blue-900'
            }`}>
              <span className="text-xl">
                {selectedOption === currentQuestion.correctAnswerIndex ? '🎯 Resposta Correta!' : '💡 Explicação'}
              </span> 
            </h4>
            <p className={`leading-relaxed text-sm md:text-base ${
               selectedOption === currentQuestion.correctAnswerIndex 
               ? 'text-emerald-800' 
               : 'text-blue-800'
            }`}>
              {currentQuestion.explanation}
            </p>
          </div>
          
          <Button fullWidth onClick={handleNext} variant="primary" className="py-4 text-lg shadow-xl shadow-blue-200 hover:-translate-y-1 transition-transform">
            {currentIndex === questions.length - 1 ? 'Finalizar Simulado' : 'Próxima Questão →'}
          </Button>
        </div>
      )}
    </div>
  );
};
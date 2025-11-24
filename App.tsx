import React, { useState } from 'react';
import { GameState, Question, QuizTopic, QuizResult } from './types';
import { TOPICS } from './constants';
import { generateQuizQuestions } from './services/geminiService';
import { TopicCard } from './components/TopicCard';
import { QuizGame } from './components/QuizGame';
import { Button } from './components/Button';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentTopic, setCurrentTopic] = useState<QuizTopic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleTopicSelect = async (topic: QuizTopic) => {
    setCurrentTopic(topic);
    setGameState(GameState.LOADING);
    setErrorMsg('');

    try {
      const generatedQuestions = await generateQuizQuestions(topic.promptContext, 5);
      setQuestions(generatedQuestions);
      setGameState(GameState.PLAYING);
    } catch (error) {
      console.error(error);
      setErrorMsg("Ocorreu um erro ao conectar com a IA. Por favor, verifique sua chave de API ou tente novamente em instantes.");
      setGameState(GameState.ERROR);
    }
  };

  const handleFinish = (score: number, history: { question: string; isCorrect: boolean }[]) => {
    setResult({
      total: questions.length,
      correct: score,
      history
    });
    setGameState(GameState.FINISHED);
  };

  const resetGame = () => {
    setGameState(GameState.MENU);
    setCurrentTopic(null);
    setQuestions([]);
    setResult(null);
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.MENU:
        return (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100 shadow-sm">
                <span>🚀</span> Preparatório Intensivo IBGE
              </div>
              <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 tracking-tight">
                Simulado <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">IBGE Master</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                A ferramenta definitiva para sua aprovação. Escolha uma disciplina e receba questões inéditas geradas por IA no estilo da banca.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {TOPICS.map(topic => (
                <TopicCard 
                  key={topic.id} 
                  topic={topic} 
                  onSelect={handleTopicSelect} 
                />
              ))}
            </div>
          </div>
        );

      case GameState.LOADING:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="relative mb-10">
              <div className="w-24 h-24 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
                {currentTopic?.icon}
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center">Gerando Simulado...</h2>
            <div className="max-w-md text-center space-y-2">
              <p className="text-slate-500">
                A IA está analisando editais anteriores e criando questões sobre <span className="font-bold text-blue-600">{currentTopic?.label}</span>.
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-4">
                Powered by Gemini 2.5
              </p>
            </div>
          </div>
        );

      case GameState.PLAYING:
        return (
          <QuizGame questions={questions} onFinish={handleFinish} />
        );

      case GameState.FINISHED:
        if (!result) return null;
        const percentage = Math.round((result.correct / result.total) * 100);
        
        return (
          <div className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 animate-fade-in-up">
            <div className="text-center mb-10">
              <div className="w-28 h-28 mx-auto mb-6 rounded-full flex items-center justify-center text-5xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-200 shadow-xl ring-4 ring-white">
                {percentage >= 80 ? '🏆' : percentage >= 50 ? '📚' : '⚠️'}
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {percentage >= 80 ? 'Aprovado!' : percentage >= 50 ? 'Na Média' : 'Precisa Melhorar'}
              </h2>
              
              <div className="flex justify-center items-center gap-2 text-slate-500 mt-2">
                <span>Acertos:</span>
                <span className="text-2xl font-bold text-blue-600">{result.correct}</span>
                <span className="text-slate-300">/</span>
                <span>{result.total}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 mb-8 max-h-80 overflow-y-auto custom-scrollbar border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Resumo da Partida</h3>
              <div className="space-y-3">
                {result.history.map((item, idx) => (
                  <div key={idx} className={`flex items-start gap-4 p-4 rounded-xl text-sm border bg-white transition-colors ${item.isCorrect ? 'border-green-100' : 'border-red-100'}`}>
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${item.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {item.isCorrect ? '✓' : '✕'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 mb-1 block">Questão {idx + 1}</span>
                      <p className="text-slate-700 font-medium leading-relaxed">{item.question}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <Button onClick={resetGame} fullWidth variant="primary" className="py-4 text-lg shadow-lg shadow-blue-100">
                Novo Simulado
              </Button>
            </div>
          </div>
        );

      case GameState.ERROR:
        return (
          <div className="max-w-md mx-auto text-center bg-white p-10 rounded-3xl border border-red-100 shadow-xl">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              🚫
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Falha na Conexão</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">{errorMsg}</p>
            <Button onClick={resetGame} variant="outline" fullWidth>Tentar Novamente</Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      {gameState !== GameState.MENU && (
        <div className="fixed top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-50 shadow-sm" />
      )}
      
      <main className="container mx-auto py-8 md:py-12 px-4 sm:px-6 md:px-8">
        {renderContent()}
      </main>
    </div>
  );
}
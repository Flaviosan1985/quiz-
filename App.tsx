import React, { useState, useEffect } from 'react';
import { GameState, Question, QuizTopic, QuizResult, UserHistoryItem, HistoryItem } from './types';
import { TOPICS, STUDY_TIPS } from './constants';
import { generateQuizQuestions } from './services/geminiService';
import { TopicCard } from './components/TopicCard';
import { QuizGame } from './components/QuizGame';
import { Button } from './components/Button';
import { StudyTipCard } from './components/StudyTipCard';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentTopic, setCurrentTopic] = useState<QuizTopic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isReviewMode, setIsReviewMode] = useState(false);
  
  // Estado para o histórico global do usuário
  const [userHistory, setUserHistory] = useState<UserHistoryItem[]>([]);

  // Carregar histórico do localStorage ao iniciar
  useEffect(() => {
    const savedHistory = localStorage.getItem('ibge_quiz_history');
    if (savedHistory) {
      try {
        setUserHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Erro ao ler histórico", e);
      }
    }
  }, []);

  const handleTopicSelect = async (topic: QuizTopic) => {
    setCurrentTopic(topic);
    setGameState(GameState.LOADING);
    setErrorMsg('');
    setIsReviewMode(false);

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

  const handleFinish = (score: number, history: HistoryItem[]) => {
    const currentResult = {
      total: questions.length,
      correct: score,
      history
    };
    setResult(currentResult);

    // Salvar no histórico global apenas se NÃO estiver em modo de revisão
    if (currentTopic && !isReviewMode) {
      const newHistoryItem: UserHistoryItem = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        topicId: currentTopic.id,
        topicLabel: currentTopic.label,
        score: score,
        total: questions.length
      };

      const updatedHistory = [newHistoryItem, ...userHistory];
      setUserHistory(updatedHistory);
      localStorage.setItem('ibge_quiz_history', JSON.stringify(updatedHistory));
    }

    setGameState(GameState.FINISHED);
  };

  const handleReviewErrors = () => {
    if (!result) return;
    
    // Filtra apenas as questões erradas
    const wrongQuestions = result.history
      .filter(item => !item.isCorrect)
      .map(item => item.questionItem);
    
    if (wrongQuestions.length > 0) {
      setQuestions(wrongQuestions);
      setIsReviewMode(true);
      setGameState(GameState.PLAYING);
    }
  };

  const resetGame = () => {
    setGameState(GameState.MENU);
    setCurrentTopic(null);
    setQuestions([]);
    setResult(null);
    setIsReviewMode(false);
  };

  const clearHistory = () => {
    if (confirm('Tem certeza que deseja apagar todo o seu histórico de progresso?')) {
      setUserHistory([]);
      localStorage.removeItem('ibge_quiz_history');
    }
  };

  // Componente de Estatísticas para o Menu
  const renderStatsDashboard = () => {
    if (userHistory.length === 0) return null;

    const totalQuestionsAnswered = userHistory.reduce((acc, item) => acc + item.total, 0);
    const totalCorrect = userHistory.reduce((acc, item) => acc + item.score, 0);
    const accuracy = totalQuestionsAnswered > 0 
      ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) 
      : 0;

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-10 animate-enter">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            📊 Meu Progresso
          </h3>
          <button 
            onClick={clearHistory}
            className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
          >
            Limpar Histórico
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="text-2xl font-black text-blue-600">{userHistory.length}</div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Simulados</div>
          </div>
          <div className="text-center p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="text-2xl font-black text-indigo-600">{totalQuestionsAnswered}</div>
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">Questões</div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="text-2xl font-black text-emerald-600">{accuracy}%</div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Precisão</div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Últimas Atividades</p>
          {userHistory.slice(0, 3).map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
              <div className="flex flex-col">
                <span className="font-semibold text-slate-700">{item.topicLabel}</span>
                <span className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString('pt-BR')} às {new Date(item.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden`}>
                  <div 
                    className={`h-full rounded-full ${item.score / item.total >= 0.7 ? 'bg-emerald-500' : 'bg-orange-400'}`} 
                    style={{ width: `${(item.score / item.total) * 100}%` }} 
                  />
                </div>
                <span className="font-bold text-slate-600 w-8 text-right">{item.score}/{item.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.MENU:
        return (
          <div className="max-w-6xl mx-auto animate-enter">
            <div className="text-center mb-12 lg:mb-16 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100 shadow-sm animate-fade-in">
                <span>🚀</span> Preparatório Intensivo IBGE
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Simulado <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">IBGE Master</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                A ferramenta definitiva para sua aprovação. Escolha uma disciplina e receba questões inéditas geradas por IA no estilo da banca.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-2 lg:px-0 items-start">
              {/* Painel lateral (Desktop) ou Topo (Mobile) para estatísticas se houver histórico */}
              {userHistory.length > 0 && (
                <div className="lg:col-span-1 order-2 lg:order-1 lg:sticky lg:top-8">
                  {renderStatsDashboard()}
                </div>
              )}

              {/* Grid de Tópicos e Dicas */}
              <div className={`${userHistory.length > 0 ? 'lg:col-span-3 order-1 lg:order-2' : 'lg:col-span-4'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                  {TOPICS.map((topic, index) => (
                    <div key={topic.id} className={`delay-${index * 100} animate-enter`}>
                      <TopicCard 
                        topic={topic} 
                        onSelect={handleTopicSelect} 
                      />
                    </div>
                  ))}
                </div>

                {/* Seção Dicas de Estudo */}
                <div className="border-t border-slate-200 pt-12 animate-enter">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-2xl">💡</span>
                    <h3 className="text-2xl font-bold text-slate-800">Dicas de Ouro para o Concurso</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {STUDY_TIPS.map((tip) => (
                      <StudyTipCard key={tip.id} tip={tip} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case GameState.LOADING:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="relative mb-10 group">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity animate-pulse"></div>
              <div className="relative w-24 h-24 bg-white border-4 border-slate-50 rounded-full shadow-xl flex items-center justify-center">
                 <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl animate-bounce">
                {currentTopic?.icon}
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 text-center">Gerando Simulado...</h2>
            <div className="max-w-md text-center space-y-2 px-4">
              <p className="text-slate-500">
                A IA está analisando editais anteriores e criando questões inéditas sobre <span className="font-bold text-blue-600">{currentTopic?.label}</span>.
              </p>
              <div className="mt-8 flex justify-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        );

      case GameState.PLAYING:
        return (
          <QuizGame 
            questions={questions} 
            onFinish={handleFinish} 
            isReviewMode={isReviewMode}
          />
        );

      case GameState.FINISHED:
        if (!result) return null;
        const percentage = Math.round((result.correct / result.total) * 100);
        const isExcellent = percentage >= 80;
        const isGood = percentage >= 50;
        const hasErrors = result.correct < result.total;
        
        return (
          <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[2rem] shadow-2xl border border-white animate-enter my-4">
             {isReviewMode && (
              <div className="mb-8 text-center bg-amber-50 border border-amber-200 rounded-xl p-3">
                <h3 className="text-amber-800 font-bold text-sm uppercase tracking-wide">🏁 Revisão Concluída</h3>
              </div>
            )}
            
            <div className="text-center mb-10">
              <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center text-6xl shadow-2xl ring-8 ring-white transform hover:scale-105 transition-transform duration-500 ${isExcellent ? 'bg-gradient-to-br from-emerald-400 to-green-600 shadow-green-200' : isGood ? 'bg-gradient-to-br from-blue-400 to-indigo-600 shadow-blue-200' : 'bg-gradient-to-br from-orange-400 to-red-500 shadow-red-200'}`}>
                {isExcellent ? '🏆' : isGood ? '📚' : '⚠️'}
              </div>
              
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
                {isExcellent ? 'Aprovado!' : isGood ? 'Na Média' : 'Precisa Melhorar'}
              </h2>
              <p className="text-slate-500 font-medium">Você acertou {percentage}% do simulado</p>
              
              <div className="flex justify-center items-center gap-3 mt-6">
                <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Acertos</span>
                  <span className="text-3xl font-black text-blue-600">{result.correct}</span>
                  <span className="text-slate-300 text-lg">/{result.total}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-1 mb-8 border border-slate-100 shadow-inner">
               <div className="max-h-80 overflow-y-auto custom-scrollbar p-3 space-y-3">
                {result.history.map((item, idx) => (
                  <div key={idx} className={`flex items-start gap-4 p-4 rounded-xl text-sm border bg-white shadow-sm transition-transform hover:scale-[1.01] ${item.isCorrect ? 'border-l-4 border-l-green-500 border-t-transparent border-r-transparent border-b-transparent' : 'border-l-4 border-l-red-500 border-t-transparent border-r-transparent border-b-transparent'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${item.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {item.isCorrect ? '✓' : '✕'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 mb-1 block uppercase">Questão {idx + 1}</span>
                      <p className="text-slate-700 font-medium leading-relaxed">{item.questionItem.question}</p>
                      {/* Mostrar resposta selecionada se estiver errada */}
                      {!item.isCorrect && item.selectedOption !== null && (
                         <div className="mt-2 text-xs text-red-500">
                           Sua resposta: {item.questionItem.options[item.selectedOption]}
                         </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {hasErrors && !isReviewMode && (
                <Button 
                  onClick={handleReviewErrors} 
                  fullWidth 
                  variant="secondary" 
                  className="bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200 py-4"
                >
                  ↺ Revisar Erros (Tentar Novamente)
                </Button>
              )}
              
              <Button onClick={resetGame} fullWidth variant="primary" className="py-4 text-lg font-bold shadow-lg shadow-blue-200 hover:-translate-y-1 transition-transform">
                {isReviewMode ? 'Voltar ao Menu' : 'Novo Simulado'}
              </Button>
            </div>
          </div>
        );

      case GameState.ERROR:
        return (
          <div className="max-w-md mx-auto text-center bg-white p-10 rounded-3xl border border-red-100 shadow-xl animate-enter">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">
              🚫
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Falha na Conexão</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">{errorMsg}</p>
            <div className="space-y-3">
              <Button onClick={resetGame} variant="primary" fullWidth>Tentar Novamente</Button>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="block text-sm text-blue-600 hover:underline mt-4"
              >
                Gerar nova chave de API (Google AI Studio)
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-blue-100 selection:text-blue-900 pb-20 overflow-x-hidden">
      {gameState !== GameState.MENU && (
        <div className={`fixed top-0 inset-x-0 h-1.5 z-50 shadow-sm animate-fade-in ${isReviewMode ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'}`} />
      )}
      
      <main className="container mx-auto py-8 md:py-12 px-4 sm:px-6 md:px-8">
        {renderContent()}
      </main>
    </div>
  );
}
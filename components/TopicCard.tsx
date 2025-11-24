import React from 'react';
import { QuizTopic } from '../types';

interface TopicCardProps {
  topic: QuizTopic;
  onSelect: (topic: QuizTopic) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onSelect }) => {
  return (
    <button 
      onClick={() => onSelect(topic)}
      className="group relative w-full text-left bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 ease-out active:scale-95 overflow-hidden"
    >
      {/* Background Decorativo */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${topic.color} opacity-[0.03] rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500`} />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className={`w-16 h-16 mb-5 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-300 ${topic.color.replace('bg-', 'bg-opacity-10 text-')}`}>
          <div className={`${topic.color} opacity-10 absolute inset-0 rounded-2xl`}></div>
          {topic.icon}
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
          {topic.label}
        </h3>
        
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">
          {topic.promptContext}
        </p>

        <span className="mt-auto inline-flex items-center text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-500 transition-colors">
          Começar Simulado
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
      
      <div className={`absolute inset-x-0 bottom-0 h-1 ${topic.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
    </button>
  );
};
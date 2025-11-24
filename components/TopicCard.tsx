import React from 'react';
import { QuizTopic } from '../types';

interface TopicCardProps {
  topic: QuizTopic;
  onSelect: (topic: QuizTopic) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(topic)}
      className="group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 cursor-pointer p-6 flex flex-col items-center text-center hover:-translate-y-1"
    >
      <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center text-3xl ${topic.color} bg-opacity-10 text-${topic.color.replace('bg-', '')}`}>
        {topic.icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
        {topic.label}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed">
        {topic.promptContext}
      </p>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
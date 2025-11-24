import React, { useState } from 'react';
import { StudyTip } from '../types';

interface StudyTipCardProps {
  tip: StudyTip;
}

export const StudyTipCard: React.FC<StudyTipCardProps> = ({ tip }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${tip.color.replace('bg-', 'bg-opacity-10 text-')}`}>
             {tip.icon}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm md:text-base leading-tight">
              {tip.title}
            </h4>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {tip.category}
            </span>
          </div>
        </div>
        
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-50 mt-2 bg-slate-50/50">
          {tip.content}
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 animate-bounce duration-500">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-[#16141a]/95 border border-[#d4af37] text-[#f5f0e6] text-xs sm:text-sm font-medium rounded-lg shadow-2xl backdrop-blur-md">
        <Sparkles className="w-4 h-4 text-[#d4af37] animate-spin" style={{ animationDuration: '4s' }} />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

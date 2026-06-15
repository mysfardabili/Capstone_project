import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const borderClass = type === 'success' ? 'border-l-emerald-500' : 'border-l-red-500';
  const iconColor = type === 'success' ? 'text-emerald-500' : 'text-red-500';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`fixed bottom-5 right-5 bg-surface border-l-4 ${borderClass} shadow-custom-md p-[15px_20px] rounded-lg flex items-center gap-3 z-[9999] animate-[slideIn_0.3s_ease-out_forwards]`}>
      <Icon size={24} className={iconColor} />
      <span className="font-medium text-slate-800 dark:text-slate-200">{message}</span>
      <button onClick={onClose} className="bg-transparent border-none cursor-pointer ml-2.5 flex items-center justify-center">
        <X size={16} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
      </button>
      
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Toast;

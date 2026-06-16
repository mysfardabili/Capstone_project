import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between p-4 border-t border-border">
      <div className="text-text-muted text-sm">
        Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} data
      </div>
      <div className="flex gap-1">
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="p-[6px_12px] rounded-md border border-border flex items-center disabled:cursor-not-allowed transition-colors disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 bg-white dark:bg-slate-800 text-text-main hover:bg-gray-50 dark:hover:bg-slate-700"
        >
          <ChevronLeft size={16} />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button 
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-[14px] py-[6px] rounded-md font-semibold cursor-pointer transition-colors ${
              page === currentPage 
                ? 'bg-orange-500 text-white border-none' 
                : 'border border-border bg-white dark:bg-slate-800 text-text-main hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            {page}
          </button>
        ))}

        <button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="p-[6px_12px] rounded-md border border-border flex items-center disabled:cursor-not-allowed transition-colors disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 bg-white dark:bg-slate-800 text-text-main hover:bg-gray-50 dark:hover:bg-slate-700"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

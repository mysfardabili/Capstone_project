import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './SharedUI.css';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderTop: '1px solid var(--border)' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} data
      </div>
      <div style={{ display: 'flex', gap: '5px' }}>
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          style={{ 
            padding: '6px 12px', 
            borderRadius: '6px', 
            border: '1px solid var(--border)', 
            background: currentPage === 1 ? '#f1f5f9' : 'white',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: currentPage === 1 ? '#94a3b8' : 'var(--text-main)'
          }}
        >
          <ChevronLeft size={16} />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button 
            key={page}
            onClick={() => onPageChange(page)}
            style={{ 
              padding: '6px 14px', 
              borderRadius: '6px', 
              border: page === currentPage ? 'none' : '1px solid var(--border)', 
              background: page === currentPage ? 'var(--primary)' : 'white',
              color: page === currentPage ? 'white' : 'var(--text-main)',
              cursor: 'pointer',
              fontWeight: page === currentPage ? '600' : '400'
            }}
          >
            {page}
          </button>
        ))}

        <button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          style={{ 
            padding: '6px 12px', 
            borderRadius: '6px', 
            border: '1px solid var(--border)', 
            background: currentPage === totalPages ? '#f1f5f9' : 'white',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: currentPage === totalPages ? '#94a3b8' : 'var(--text-main)'
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

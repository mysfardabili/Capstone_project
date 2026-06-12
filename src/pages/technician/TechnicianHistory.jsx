import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const TechnicianHistory = () => {
  const [activeFilter, setActiveFilter] = useState('Minggu Ini');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.get('/repairs');
        // Filter only completed repairs
        const completed = data.filter(r => r.status === 'Completed');
        setHistory(completed);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => {
    const term = (searchTerm || '').toLowerCase();
    if (!term) return true;

    return (
      (item.asset?.name || '').toLowerCase().includes(term) ||
      (item.assetId || '').toLowerCase().includes(term) ||
      (item.id || '').toLowerCase().includes(term)
    );
  });

  const getGroup = (dateStr) => {
    if (!dateStr) return 'SEBELUMNYA';
    const today = new Date().toISOString().split('T')[0];
    
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    if (dateStr === today) return 'HARI INI';
    if (dateStr === yesterday) return 'KEMARIN';
    return 'SEBELUMNYA';
  };

  const groupedTasks = filteredHistory.reduce((acc, item) => {
    const groupKey = getGroup(item.completionDate || item.date);
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, { 'HARI INI': [], 'KEMARIN': [], 'SEBELUMNYA': [] });

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Riwayat Pekerjaan</h2>
      <p style={{ margin: '0 0 1.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>Rekam jejak tugas yang telah Anda selesaikan.</p>

      {/* Quick Filter Pills */}
      <div className="filter-pills">
        {['Hari Ini', 'Minggu Ini', 'Bulan Ini'].map(filter => (
          <button 
            key={filter} 
            className={`pill-btn ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="search-bar-container">
        <div className="search-bar">
          <Search size={18} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Cari aset atau ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem', color: '#94a3b8' }}>
          <Loader2 size={32} className="spin" style={{ color: 'var(--primary)' }} />
          <span>Memuat riwayat pekerjaan...</span>
          <style>{`
            .spin { animation: spin 1s linear infinite; }
            @keyframes spin { 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          {['HARI INI', 'KEMARIN', 'SEBELUMNYA'].map(groupName => {
            const tasks = groupedTasks[groupName] || [];
            if (tasks.length === 0) return null;

            return (
              <div key={groupName} style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '700', margin: '0 0 1rem 0' }}>{groupName}</h3>
                <div className="timeline-list">
                  {tasks.map((item, idx) => (
                    <div key={idx} className="timeline-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{item.asset?.name || 'Aset'}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', backgroundColor: '#f0fdf4', padding: '4px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700' }}>
                          <CheckCircle size={12} /> Selesai
                        </div>
                      </div>
                      <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>ID: {item.assetId} (Tiket: {item.id})</p>
                      <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#0f172a' }}><strong>Tindakan:</strong> {item.notes}</p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.8rem', color: '#94a3b8' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} /> {item.completionDate || item.date}
                        </span>
                        <span>Pelapor: <strong>{item.reporterName}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredHistory.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <Search size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
              <p style={{ margin: 0, fontWeight: 600 }}>Tidak ada riwayat pekerjaan ditemukan</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TechnicianHistory;

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
        const completed = data.filter(r => r.status === 'Selesai' || r.status === 'Completed');
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
    const dateStr = item.completionDate || item.date || '';
    const itemDate = new Date(dateStr);
    const now = new Date();

    if (activeFilter === 'Hari Ini') {
      const today = now.toISOString().split('T')[0];
      if (dateStr.split('T')[0] !== today) return false;
    } else if (activeFilter === 'Minggu Ini') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      if (itemDate < weekAgo) return false;
    } else if (activeFilter === 'Bulan Ini') {
      const monthAgo = new Date(now);
      monthAgo.setDate(now.getDate() - 30);
      if (itemDate < monthAgo) return false;
    }

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
      <h2 className="m-0 mb-1 text-2xl font-extrabold text-slate-900 dark:text-white tracking-[-0.5px]">Riwayat Pekerjaan</h2>
      <p className="m-0 mb-6 text-slate-500 dark:text-slate-400 text-sm">Rekam jejak tugas yang telah Anda selesaikan.</p>

      <div className="flex gap-[10px] overflow-x-auto pb-2 mb-4 scrollbar-hide md:flex-wrap md:overflow-visible">
        {['Hari Ini', 'Minggu Ini', 'Bulan Ini'].map(filter => (
          <button 
            key={filter} 
            className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-4 py-2 rounded-[20px] text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 ${activeFilter === filter ? 'bg-orange-500 text-white border-orange-500 shadow-[0_4px_10px_rgba(249,115,22,0.2)] hover:bg-orange-500' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-colors duration-300 focus-within:border-orange-500 focus-within:shadow-[0_4px_15px_rgba(249,115,22,0.1)]">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Cari aset atau ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none outline-none p-3 w-full text-sm bg-transparent font-inherit text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-slate-400">
          <Loader2 size={32} className="spin text-orange-500" />
          <span>Memuat riwayat pekerjaan...</span>
          <style>{`
            .spin { animation: spin 1s linear infinite; }
            @keyframes spin { 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      ) : (
        <div className="mt-8">
          {['HARI INI', 'KEMARIN', 'SEBELUMNYA'].map(groupName => {
            const tasks = groupedTasks[groupName] || [];
            if (tasks.length === 0) return null;

            return (
              <div key={groupName} className="mb-8">
                <h3 className="text-sm text-slate-500 dark:text-slate-400 font-bold m-0 mb-4">{groupName}</h3>
                <div className="flex flex-col gap-[1.2rem] relative pl-5 before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-[6px] before:w-[2px] before:bg-slate-200 dark:before:bg-slate-700 before:rounded-[2px]">
                  {tasks.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-50 dark:border-slate-700 relative before:content-[''] before:absolute before:top-5 before:left-[-20px] before:w-[14px] before:h-[14px] before:bg-emerald-500 before:border-3 before:border-white dark:before:border-slate-800 before:rounded-full before:shadow-[0_0_0_2px_#e2e8f0] dark:before:shadow-[0_0_0_2px_#334155] before:z-[2]">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="m-0 text-lg font-extrabold text-slate-900 dark:text-white">{item.asset?.name || 'Aset'}</h4>
                        <div className="flex items-center gap-1 text-emerald-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-xl text-[0.7rem] font-bold">
                          <CheckCircle size={12} /> Selesai
                        </div>
                      </div>
                      <p className="m-0 mb-2 text-sm text-slate-500 dark:text-slate-400 font-medium">ID: {item.assetId} (Tiket: {item.id})</p>
                      <p className="m-0 mb-3 text-sm text-slate-900 dark:text-slate-200"><strong>Tindakan:</strong> {item.notes}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {item.completionDate || item.date}
                        </span>
                        <span>Pelapor: <strong className="text-slate-600 dark:text-slate-300">{item.reporterName}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredHistory.length === 0 && (
            <div className="text-center p-12 text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <Search size={32} className="mb-[10px] opacity-50 mx-auto" />
              <p className="m-0 font-semibold">Tidak ada riwayat pekerjaan ditemukan</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TechnicianHistory;

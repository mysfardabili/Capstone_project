import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardList, CheckCircle, AlertTriangle, CalendarDays, Zap, Loader2, X, MapPin } from 'lucide-react';
import { api } from '../../services/api';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Teknisi');
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    calibrations: 0,
    urgentItem: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const [calibrationItems, setCalibrationItems] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.name) setUserName(u.name);
      } catch (err) {
        console.error(err);
      }
    }

    const fetchData = async () => {
      try {
        const [repairsData, calibrationsData] = await Promise.all([
          api.get('/repairs'),
          api.get('/calibrations'),
        ]);

        const completedList = repairsData.filter(r => r.status === 'Selesai' || r.status === 'Completed');
        const pendingList = repairsData.filter(r => r.status !== 'Selesai' && r.status !== 'Completed');
        const waitingCalibrations = calibrationsData.filter(c => c.status === 'Menunggu');

        setCalibrationItems(waitingCalibrations);

        const urgent = pendingList.find(r => r.status === 'Pending') || pendingList[0] || null;

        setStats({
          pending: pendingList.length,
          completed: completedList.length,
          calibrations: waitingCalibrations.length,
          urgentItem: urgent ? `${urgent.assetId} - ${urgent.description}` : null,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-slate-400 dark:text-slate-500">
        <Loader2 size={40} className="spin text-orange-500" />
        <span>Memuat dashboard teknisi...</span>
        <style>{`
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const totalRepairs = stats.completed + stats.pending;
  const ratioPct = totalRepairs > 0 ? Math.round((stats.completed / totalRepairs) * 100) : 100;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      
      {stats.urgentItem && (
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white px-6 py-4 flex items-center gap-3 -mx-6 -mt-6 mb-6 shadow-[0_4px_15px_rgba(239,68,68,0.3)] animate-pulse-red">
          <AlertTriangle size={24} color="white" />
          <div>
            <h4 className="m-0 text-xs uppercase tracking-[1px] font-extrabold">Prioritas Darurat</h4>
            <p className="mt-[2px] m-0 text-[0.95rem] font-semibold">{stats.urgentItem}</p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className="text-orange-500 font-extrabold text-xs mb-1 tracking-[0.5px]">
          STATUS SHIFT: AKTIF
        </p>
        <h1 className="m-0 text-[1.8rem] font-extrabold uppercase text-slate-900 dark:text-white tracking-[-0.5px]">
          Hello, {userName}
        </h1>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-end mb-1">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Performa Harian</span>
          <span className="text-[0.9rem] font-extrabold text-blue-500">{stats.completed} / {totalRepairs} Selesai</span>
        </div>
        <div className="bg-black/5 dark:bg-white/10 rounded-[20px] h-2 w-full overflow-hidden mt-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-[20px] transition-all duration-1000" style={{ width: `${ratioPct}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        
        <div className="bg-white dark:bg-slate-800 rounded-[20px] p-6 shadow-card mb-[1.2rem] relative overflow-hidden border border-white/80 dark:border-slate-700 transition-all duration-300 active:scale-[0.98] bg-[linear-gradient(145deg,#ffffff_0%,#f0f7ff_100%)] dark:bg-[linear-gradient(145deg,#1e293b_0%,#0f172a_100%)] border-l-[6px] border-l-blue-600 sm:col-span-2">
          <div className="flex justify-between items-start relative z-[2]">
            <div>
              <h3 className="text-base text-slate-500 dark:text-slate-400 font-bold m-0 mb-1">Perbaikan Tertunda</h3>
              <p className="text-[3rem] font-extrabold m-0 text-slate-900 dark:text-white leading-none tracking-tight">{stats.pending}</p>
            </div>
            <Link to="/technician/repairs" className="text-xs text-blue-600 font-bold no-underline bg-blue-100/50 dark:bg-blue-900/50 px-3 py-[6px] rounded-[20px] hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors flex items-center gap-1">
              <Zap size={14} /> Proses
            </Link>
          </div>
          <ClipboardList size={80} color="#2563eb" className="absolute right-[10px] bottom-[-20px] opacity-15 -rotate-15 w-[120px] h-[120px] z-0" />
        </div>

        <div 
          className="bg-white dark:bg-slate-800 rounded-[20px] shadow-card mb-[1.2rem] relative overflow-hidden border border-white/80 dark:border-slate-700 transition-all duration-300 active:scale-[0.98] bg-[linear-gradient(145deg,#ffffff_0%,#fff7ed_100%)] dark:bg-[linear-gradient(145deg,#1e293b_0%,#422006_100%)] border-l-[6px] border-l-orange-500 p-4 cursor-pointer transition-[transform,box-shadow] duration-200"
          onClick={() => navigate('/technician/history')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(249,115,22,0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = ''; }}
        >
          <div className="flex flex-col gap-[10px] items-start relative z-[2]">
            <h3 className="text-sm text-slate-500 dark:text-slate-400 font-bold m-0 mb-1">Selesai</h3>
            <p className="text-[2rem] font-extrabold m-0 text-slate-900 dark:text-white leading-none tracking-tight">{stats.completed}</p>
          </div>
          <CheckCircle size={60} color="#f97316" className="absolute right-[-15px] bottom-[-15px] opacity-15 -rotate-15 w-[120px] h-[120px] z-0" />
        </div>

        <div 
          className="bg-white dark:bg-slate-800 rounded-[20px] shadow-card mb-[1.2rem] relative overflow-hidden border border-white/80 dark:border-slate-700 transition-all duration-300 active:scale-[0.98] bg-[linear-gradient(145deg,#ffffff_0%,#fef2f2_100%)] dark:bg-[linear-gradient(145deg,#1e293b_0%,#450a0a_100%)] border-l-[6px] border-l-red-500 p-4 cursor-pointer transition-[transform,box-shadow] duration-200"
          onClick={() => setShowCalibrationModal(true)}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(239,68,68,0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = ''; }}
        >
          <div className="flex flex-col gap-[10px] items-start relative z-[2]">
            <h3 className="text-sm text-slate-500 dark:text-slate-400 font-bold m-0 mb-1">Kalibrasi</h3>
            <p className="text-[2rem] font-extrabold m-0 text-slate-900 dark:text-white leading-none tracking-tight">{stats.calibrations}</p>
          </div>
          <CalendarDays size={60} color="#ef4444" className="absolute right-[-15px] bottom-[-15px] opacity-15 -rotate-15 w-[120px] h-[120px] z-0" />
        </div>

      </div>

      {showCalibrationModal && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center backdrop-blur-sm"
          onClick={() => setShowCalibrationModal(false)}
        >
          <div 
            className="bg-white dark:bg-slate-800 rounded-[24px] p-6 max-w-[400px] w-[90%] max-h-[80vh] overflow-auto shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            style={{ animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="m-0 text-xl font-extrabold text-slate-900 dark:text-white">Kalibrasi Menunggu</h3>
              <button onClick={() => setShowCalibrationModal(false)} className="bg-slate-100 dark:bg-slate-700 border-none rounded-xl p-2 cursor-pointer flex">
                <X size={18} className="text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            {calibrationItems.length === 0 ? (
              <div className="text-center p-8 text-slate-400">
                <CalendarDays size={40} className="opacity-30 mb-3 mx-auto" />
                <p className="m-0 font-semibold">Tidak ada kalibrasi menunggu</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {calibrationItems.map(cal => (
                  <div key={cal.id} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="m-0 text-[0.95rem] font-extrabold text-slate-900 dark:text-white">{cal.asset?.name || 'Aset'}</h4>
                      <span className="text-[0.7rem] font-bold px-2 py-[3px] rounded-lg bg-red-500 text-white">Menunggu</span>
                    </div>
                    <p className="m-0 mb-1 text-sm text-slate-500 dark:text-slate-400">ID: {cal.assetId} (Tiket: {cal.id})</p>
                    <div className="flex items-center gap-1.5 text-sm text-red-500 font-bold">
                      <CalendarDays size={14} />
                      <span>Jadwal: {cal.nextCalibrationDate ? new Date(cal.nextCalibrationDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
                    </div>
                    {cal.asset?.room && (
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mt-1">
                        <MapPin size={14} />
                        <span>{cal.asset.room}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default TechnicianDashboard;

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
    // Load username from localStorage
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

        // Save calibration items for the modal
        setCalibrationItems(waitingCalibrations);

        // Find most urgent repair (the latest Pending repair)
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem', color: 'var(--text-muted)' }}>
        <Loader2 size={40} className="spin" style={{ color: 'var(--primary)' }} />
        <span>Memuat dashboard teknisi...</span>
        <style>{`
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Calculate performa ratio
  const totalRepairs = stats.completed + stats.pending;
  const ratioPct = totalRepairs > 0 ? Math.round((stats.completed / totalRepairs) * 100) : 100;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      
      {/* 1. Urgent Banner */}
      {stats.urgentItem && (
        <div className="urgent-banner">
          <AlertTriangle size={24} color="white" />
          <div>
            <h4 style={{ margin: 0, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>Prioritas Darurat</h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.95rem', fontWeight: '600' }}>{stats.urgentItem}</p>
          </div>
        </div>
      )}

      {/* Greeting */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: '#f97316', fontWeight: '800', fontSize: '0.75rem', marginBottom: '0.25rem', letterSpacing: '0.5px' }}>
          STATUS SHIFT: AKTIF
        </p>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '-0.5px' }}>
          Hello, {userName}
        </h1>
      </div>

      {/* Progress Bar (Gamification) */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Performa Harian</span>
          <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#3b82f6' }}>{stats.completed} / {totalRepairs} Selesai</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar-fill" style={{ width: `${ratioPct}%` }}></div>
        </div>
      </div>

      {/* Bento Grid System */}
      <div className="bento-grid">
        
        {/* Main Card (Span 2) */}
        <div className="tech-card tech-card-blue bento-main">
          <div className="tech-card-header">
            <div>
              <h3 className="tech-card-title">Perbaikan Tertunda</h3>
              <p className="tech-card-number">{stats.pending}</p>
            </div>
            <Link to="/technician/repairs" className="tech-card-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={14} /> Proses
            </Link>
          </div>
          <ClipboardList size={80} color="#2563eb" className="tech-icon-large" style={{ right: '10px', bottom: '-20px' }} />
        </div>

        {/* Small Card Left - CLICKABLE: navigates to history */}
        <div 
          className="tech-card tech-card-orange" 
          style={{ padding: '1rem', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
          onClick={() => navigate('/technician/history')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(249,115,22,0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = ''; }}
        >
          <div className="tech-card-header" style={{ flexDirection: 'column', gap: '10px' }}>
            <h3 className="tech-card-title" style={{ fontSize: '0.85rem' }}>Selesai</h3>
            <p className="tech-card-number" style={{ fontSize: '2rem' }}>{stats.completed}</p>
          </div>
          <CheckCircle size={60} color="#f97316" className="tech-icon-large" style={{ right: '-15px', bottom: '-15px' }} />
        </div>

        {/* Small Card Right - CLICKABLE: opens calibration modal */}
        <div 
          className="tech-card tech-card-red" 
          style={{ padding: '1rem', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
          onClick={() => setShowCalibrationModal(true)}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(239,68,68,0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = ''; }}
        >
          <div className="tech-card-header" style={{ flexDirection: 'column', gap: '10px' }}>
            <h3 className="tech-card-title" style={{ fontSize: '0.85rem' }}>Kalibrasi</h3>
            <p className="tech-card-number" style={{ fontSize: '2rem' }}>{stats.calibrations}</p>
          </div>
          <CalendarDays size={60} color="#ef4444" className="tech-icon-large" style={{ right: '-15px', bottom: '-15px' }} />
        </div>

      </div>

      {/* Calibration Modal */}
      {showCalibrationModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease-in-out' }}
          onClick={() => setShowCalibrationModal(false)}
        >
          <div 
            style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', maxWidth: '400px', width: '90%', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>Kalibrasi Menunggu</h3>
              <button onClick={() => setShowCalibrationModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '12px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                <X size={18} color="#64748b" />
              </button>
            </div>

            {calibrationItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
                <CalendarDays size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                <p style={{ margin: 0, fontWeight: '600' }}>Tidak ada kalibrasi menunggu</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {calibrationItems.map(cal => (
                  <div key={cal.id} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>{cal.asset?.name || 'Aset'}</h4>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '3px 8px', borderRadius: '8px', background: '#ef4444', color: 'white' }}>Menunggu</span>
                    </div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#64748b' }}>ID: {cal.assetId} (Tiket: {cal.id})</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#ef4444', fontWeight: '700' }}>
                      <CalendarDays size={14} />
                      <span>Jadwal: {cal.nextCalibrationDate ? new Date(cal.nextCalibrationDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
                    </div>
                    {cal.asset?.room && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
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

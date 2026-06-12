import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, CheckCircle, AlertTriangle, CalendarDays, Zap } from 'lucide-react';

const TechnicianDashboard = () => {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      
      {/* 1. Urgent Banner (Dipindah ke paling atas) */}
      <div className="urgent-banner">
        <AlertTriangle size={24} color="white" />
        <div>
          <h4 style={{ margin: 0, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>Prioritas Darurat</h4>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.95rem', fontWeight: '600' }}>Defibrilator ICU Utara Rusak</p>
        </div>
      </div>

      {/* Greeting */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: '#f97316', fontWeight: '800', fontSize: '0.75rem', marginBottom: '0.25rem', letterSpacing: '0.5px' }}>
          STATUS SHIFT: AKTIF
        </p>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '-0.5px' }}>
          Hello, Nanami
        </h1>
      </div>

      {/* Progress Bar (Gamification) */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Performa Harian</span>
          <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#3b82f6' }}>4 / 12 Selesai</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar-fill" style={{ width: '33%' }}></div>
        </div>
      </div>

      {/* Bento Grid System */}
      <div className="bento-grid">
        
        {/* Main Card (Span 2) */}
        <div className="tech-card tech-card-blue bento-main">
          <div className="tech-card-header">
            <div>
              <h3 className="tech-card-title">Perbaikan Tertunda</h3>
              <p className="tech-card-number">8</p>
            </div>
            <Link to="/technician/repairs" className="tech-card-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={14} /> Proses
            </Link>
          </div>
          <ClipboardList size={80} color="#2563eb" className="tech-icon-large" style={{ right: '10px', bottom: '-20px' }} />
        </div>

        {/* Small Card Left */}
        <div className="tech-card tech-card-orange" style={{ padding: '1rem' }}>
          <div className="tech-card-header" style={{ flexDirection: 'column', gap: '10px' }}>
            <h3 className="tech-card-title" style={{ fontSize: '0.85rem' }}>Selesai</h3>
            <p className="tech-card-number" style={{ fontSize: '2rem' }}>4</p>
          </div>
          <CheckCircle size={60} color="#f97316" className="tech-icon-large" style={{ right: '-15px', bottom: '-15px' }} />
        </div>

        {/* Small Card Right */}
        <div className="tech-card tech-card-red" style={{ padding: '1rem' }}>
          <div className="tech-card-header" style={{ flexDirection: 'column', gap: '10px' }}>
            <h3 className="tech-card-title" style={{ fontSize: '0.85rem' }}>Kalibrasi</h3>
            <p className="tech-card-number" style={{ fontSize: '2rem' }}>1</p>
          </div>
          <CalendarDays size={60} color="#ef4444" className="tech-icon-large" style={{ right: '-15px', bottom: '-15px' }} />
        </div>

      </div>

    </div>
  );
};

export default TechnicianDashboard;

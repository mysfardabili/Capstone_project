import React, { useState } from 'react';
import { Search, CheckCircle, Clock } from 'lucide-react';

const historyData = [
  { id: 'SN-6821-X1', name: 'Mesin USG Voluson', time: '14:30', date: 'Hari ini', reporter: 'Adel', problem: 'Roda hilang satu, layar goyang' },
  { id: 'AS-9921-B2', name: 'Patient Monitor', time: '09:15', date: 'Hari ini', reporter: 'Suster Nina', problem: 'Kabel sensor putus' },
  { id: 'RM-2211-C3', name: 'Bed Elektrik ICU', time: '16:45', date: 'Kemarin', reporter: 'Dr. Andi', problem: 'Motor hidrolik macet total' },
  { id: 'RM-2211-C4', name: 'Defibrillator', time: '10:00', date: 'Kemarin', reporter: 'Suster Rini', problem: 'Baterai drop cepat' },
];

const TechnicianHistory = () => {
  const [activeFilter, setActiveFilter] = useState('Minggu Ini');

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
          <input type="text" placeholder="Cari aset atau ID..." />
        </div>
      </div>

      {/* Mobile Timeline View (Replacing the old 6-column Table) */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '700', margin: '0 0 1rem 0' }}>HARI INI</h3>
        <div className="timeline-list">
          {historyData.filter(item => item.date === 'Hari ini').map((item, idx) => (
            <div key={idx} className="timeline-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{item.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', backgroundColor: '#f0fdf4', padding: '4px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700' }}>
                  <CheckCircle size={12} /> Selesai
                </div>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>ID: {item.id}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> {item.time}
                </span>
                <span>Pelapor: <strong>{item.reporter}</strong></span>
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '700', margin: '2rem 0 1rem 0' }}>KEMARIN</h3>
        <div className="timeline-list">
          {historyData.filter(item => item.date === 'Kemarin').map((item, idx) => (
            <div key={idx} className="timeline-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{item.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', backgroundColor: '#f0fdf4', padding: '4px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700' }}>
                  <CheckCircle size={12} /> Selesai
                </div>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>ID: {item.id}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> {item.time}
                </span>
                <span>Pelapor: <strong>{item.reporter}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnicianHistory;

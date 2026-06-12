import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Calendar, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const dummyCalibrations = [
  { id: 'CAL-001', asset: 'USG Machine Voluson E8', lastDate: '10 Mei 2025', nextDate: '10 Mei 2026', status: 'Jatuh Tempo', cert: null },
  { id: 'CAL-002', asset: 'Defibrillator Zoll', lastDate: '15 Jan 2026', nextDate: '15 Jan 2027', status: 'Aman', cert: 'cert-002.pdf' },
  { id: 'CAL-003', asset: 'Patient Monitor B40', lastDate: '01 Mar 2026', nextDate: '01 Mar 2027', status: 'Aman', cert: 'cert-003.pdf' },
];

const Calibration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const filteredCalibrations = dummyCalibrations.filter(cal => {
    const term = (searchTerm || '').toLowerCase();
    return cal.id.toLowerCase().includes(term) || cal.asset.toLowerCase().includes(term);
  });

  return (
    <div className="page-container">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
      <div className="page-header">
        <h1 className="page-title">Kalibrasi & Maintenance Rutin</h1>
        <Link to="/dashboard/calibration/add" className="btn-primary">
          <Plus size={18} /> Catat Kalibrasi Baru
        </Link>
      </div>

      <div className="card">
        <div className="table-controls">
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Cari nama aset..." 
              style={{ paddingLeft: '2rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Kalibrasi</th>
                <th>Nama Aset Terkait</th>
                <th>Tgl Kalibrasi Terakhir</th>
                <th>Jadwal Berikutnya (1 Tahun)</th>
                <th>Status Notifikasi</th>
                <th>Sertifikat</th>
              </tr>
            </thead>
            <tbody>
              {filteredCalibrations.length > 0 ? filteredCalibrations.map(cal => (
                <tr key={cal.id}>
                  <td style={{ fontWeight: 500 }}>{cal.id}</td>
                  <td>{cal.asset}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} color="var(--text-muted)" />
                      {cal.lastDate}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} color="var(--primary)" />
                      {cal.nextDate}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      cal.status === 'Aman' ? 'badge-success' : 'badge-danger'
                    }`}>
                      {cal.status === 'Aman' ? <CheckCircle size={12} style={{marginRight: '4px'}}/> : <AlertTriangle size={12} style={{marginRight: '4px'}}/>}
                      {cal.status}
                    </span>
                  </td>
                  <td>
                    {cal.cert ? (
                      <button className="btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} onClick={() => { setToastMsg(`Mengunduh sertifikat ${cal.cert}...`); setShowToast(true); }}>
                        <Download size={14} /> Unduh
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Belum ada</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Tidak ada jadwal kalibrasi yang sesuai dengan pencarian "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Calibration;

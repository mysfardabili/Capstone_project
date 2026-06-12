import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Calendar, CheckCircle, AlertTriangle, Download, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const Calibration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [calibrations, setCalibrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchCalibrations = async () => {
    try {
      const data = await api.get('/calibrations');
      setCalibrations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalibrations();
  }, []);

  const filteredCalibrations = calibrations.filter(cal => {
    const term = (searchTerm || '').toLowerCase();
    const idMatch = (cal.id || '').toLowerCase().includes(term);
    const assetMatch = (cal.assetId || '').toLowerCase().includes(term) || (cal.asset?.name || '').toLowerCase().includes(term);
    return idMatch || assetMatch;
  });

  const getStatus = (cal) => {
    if (cal.status === 'Lulus') return 'Aman';
    if (cal.status === 'Gagal') return 'Gagal Uji';
    
    // Check if next calibration date is near or past
    const now = new Date();
    const nextDate = new Date(cal.nextCalibrationDate);
    if (nextDate < now) return 'Kadaluarsa';
    
    return 'Jatuh Tempo';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Belum diuji';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

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
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem', color: 'var(--text-muted)' }}>
              <Loader2 size={36} className="spin" style={{ color: 'var(--primary)' }} />
              <span>Memuat data kalibrasi...</span>
              <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
              `}</style>
            </div>
          ) : (
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
                {filteredCalibrations.length > 0 ? filteredCalibrations.map(cal => {
                  const statusLabel = getStatus(cal);
                  return (
                    <tr key={cal.id}>
                      <td style={{ fontWeight: 500 }}>{cal.id}</td>
                      <td>{cal.asset?.name || `Aset (${cal.assetId})`}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={14} color="var(--text-muted)" />
                          {formatDate(cal.calibrationDate)}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={14} color="var(--primary)" />
                          {formatDate(cal.nextCalibrationDate)}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          statusLabel === 'Aman' ? 'badge-success' : 'badge-danger'
                        }`}>
                          {statusLabel === 'Aman' ? <CheckCircle size={12} style={{marginRight: '4px'}}/> : <AlertTriangle size={12} style={{marginRight: '4px'}}/>}
                          {statusLabel}
                        </span>
                      </td>
                      <td>
                        {cal.certificateNumber ? (
                          <button className="btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} onClick={() => { setToastMsg(`Mengunduh sertifikat ${cal.certificateNumber}...`); setShowToast(true); }}>
                            <Download size={14} /> {cal.certificateNumber}
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Belum ada</span>
                        )}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Tidak ada jadwal kalibrasi yang sesuai dengan pencarian "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calibration;

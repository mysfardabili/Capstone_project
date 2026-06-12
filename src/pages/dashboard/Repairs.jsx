import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Search, Eye, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const Repairs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [repairs, setRepairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchRepairs = async () => {
    try {
      const data = await api.get('/repairs');
      setRepairs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const handleCompleteRepair = async (id) => {
    try {
      await api.put(`/repairs/${id}`, { status: 'Selesai', notes: 'Perbaikan diselesaikan oleh Admin.' });
      setToastMsg(`Tiket ${id} ditandai selesai!`);
      setShowToast(true);
      fetchRepairs();
    } catch (err) {
      alert(`Gagal menyelesaikan perbaikan: ${err.message}`);
    }
  };

  const filteredRepairs = repairs.filter(rep => {
    const term = (searchTerm || '').toLowerCase();
    const idMatch = (rep.id || '').toLowerCase().includes(term);
    const assetMatch = (rep.assetId || '').toLowerCase().includes(term) || (rep.asset?.name || '').toLowerCase().includes(term);
    const reporterMatch = (rep.reporterName || '').toLowerCase().includes(term);
    return idMatch || assetMatch || reporterMatch;
  });

  const translateStatus = (status) => {
    if (status === 'Selesai' || status === 'Completed') return 'Selesai';
    if (status === 'Proses' || status === 'In Progress') return 'Dalam Pengerjaan';
    return 'Menunggu Teknisi';
  };

  return (
    <div className="page-container">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
      <div className="page-header">
        <h1 className="page-title">Laporan Kerusakan & Perbaikan</h1>
        <Link to="/dashboard/repairs/add" className="btn-primary" style={{ backgroundColor: 'var(--danger)' }}>
          <AlertTriangle size={18} /> Lapor Kerusakan Baru
        </Link>
      </div>

      <div className="card">
        <div className="table-controls">
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Cari tiket perbaikan atau ID aset..." 
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
              <span>Memuat data perbaikan...</span>
              <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
              `}</style>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Tiket</th>
                  <th>Aset Terkait</th>
                  <th>Tanggal Lapor</th>
                  <th>Pelapor</th>
                  <th>Masalah</th>
                  <th>Prioritas</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRepairs.length > 0 ? filteredRepairs.map(rep => (
                  <tr key={rep.id}>
                    <td style={{ fontWeight: 500 }}>{rep.id}</td>
                    <td>{rep.assetId} ({rep.asset?.name || 'Aset'})</td>
                    <td>{new Date(rep.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>{rep.reporterName}</td>
                    <td>{rep.description}</td>
                    <td>
                      <span className={`badge ${
                        rep.status === 'Pending' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {rep.status === 'Pending' ? 'Tinggi' : 'Sedang'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        (rep.status === 'Selesai' || rep.status === 'Completed') ? 'badge-success' : 
                        (rep.status === 'Proses' || rep.status === 'In Progress') ? 'badge-primary' : 'badge-neutral'
                      }`}>
                        {translateStatus(rep.status)}
                      </span>
                    </td>
                    <td>
                      <Link to={`/dashboard/assets/detail/${rep.assetId}`} className="action-btn" title="Detail Aset"><Eye size={16} /></Link>
                      {(rep.status !== 'Selesai' && rep.status !== 'Completed') && (
                        <button className="action-btn" title="Tandai Selesai" onClick={() => handleCompleteRepair(rep.id)}><CheckCircle size={16} color="var(--success)" /></button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Tidak ada tiket perbaikan yang sesuai dengan pencarian "{searchTerm}".
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

export default Repairs;

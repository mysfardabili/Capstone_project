import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Search, Eye, Check, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const Mutation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mutations, setMutations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchMutations = async () => {
    try {
      const data = await api.get('/mutations');
      setMutations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMutations();
  }, []);

  const handleApproveMutation = async (id) => {
    try {
      await api.put(`/mutations/${id}`, { status: 'Approved' });
      setToastMsg(`Mutasi ${id} berhasil disetujui!`);
      setShowToast(true);
      fetchMutations();
    } catch (err) {
      alert(`Gagal menyetujui mutasi: ${err.message}`);
    }
  };

  const filteredMutations = mutations.filter(mut => {
    const term = (searchTerm || '').toLowerCase();
    const idMatch = (mut.id || '').toLowerCase().includes(term);
    const assetMatch = (mut.assetId || '').toLowerCase().includes(term) || (mut.asset?.name || '').toLowerCase().includes(term);
    return idMatch || assetMatch;
  });

  const getStatusLabel = (status) => {
    if (status === 'Approved') return 'Selesai';
    if (status === 'Rejected') return 'Ditolak';
    if (status === 'Disetujui') return 'Selesai';
    if (status === 'Ditolak') return 'Ditolak';
    return 'Menunggu Persetujuan';
  };

  const getMutationType = (target) => {
    const term = (target || '').toLowerCase();
    if (term.includes('rsud') || term.includes('seberang') || term.includes('eksternal')) {
      return 'Eksternal';
    }
    return 'Internal';
  };

  return (
    <div className="page-container">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
      <div className="page-header">
        <h1 className="page-title">Mutasi & Peminjaman Aset</h1>
        <Link to="/dashboard/mutation/add" className="btn-primary">
          <RefreshCw size={18} /> Ajukan Mutasi Baru
        </Link>
      </div>

      <div className="card">
        <div className="table-controls">
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Cari ID mutasi atau aset..." 
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
              <span>Memuat data mutasi...</span>
              <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
              `}</style>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Mutasi</th>
                  <th>Tipe</th>
                  <th>Aset Terkait</th>
                  <th>Lokasi Asal</th>
                  <th>Lokasi Tujuan</th>
                  <th>Tanggal Pengajuan</th>
                  <th>Penanggung Jawab</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredMutations.length > 0 ? filteredMutations.map(mut => {
                  const mType = getMutationType(mut.targetLocation);
                  const statusLabel = getStatusLabel(mut.status);
                  return (
                    <tr key={mut.id}>
                      <td style={{ fontWeight: 500 }}>{mut.id}</td>
                      <td>
                        <span className={`badge ${mType === 'Internal' ? 'badge-primary' : 'badge-warning'}`}>
                          {mType}
                        </span>
                      </td>
                      <td>{mut.assetId} ({mut.asset?.name || 'Aset'})</td>
                      <td>{mut.sourceLocation}</td>
                      <td>{mut.targetLocation}</td>
                      <td>{new Date(mut.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>{mut.requesterName}</td>
                      <td>
                        <span className={`badge ${
                          (mut.status === 'Approved' || mut.status === 'Disetujui') ? 'badge-success' : 
                          (mut.status === 'Rejected' || mut.status === 'Ditolak') ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td>
                        <Link to={`/dashboard/assets/detail/${mut.assetId}`} className="action-btn" title="Detail Aset"><Eye size={16} /></Link>
                        {mut.status === 'Pending' && (
                          <button className="action-btn" title="Setujui Mutasi" onClick={() => handleApproveMutation(mut.id)}><Check size={16} color="var(--success)" /></button>
                        )}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Tidak ada data mutasi yang sesuai dengan pencarian "{searchTerm}".
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

export default Mutation;

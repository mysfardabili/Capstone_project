import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Check, X, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';
import Pagination from '../../components/Pagination';

const Requests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchRequests = async () => {
    try {
      const data = await api.get('/requests');
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const endpoint = status === 'Approved' ? `/requests/${id}/approve` : `/requests/${id}/reject`;
      await api.put(endpoint);
      setToastMsg(`Pengajuan ${id} berhasil ${status === 'Approved' ? 'disetujui' : 'ditolak'}.`);
      setShowToast(true);
      fetchRequests();
    } catch (err) {
      alert(`Gagal merubah status: ${err.message}`);
    }
  };

  const filteredRequests = requests.filter(req => {
    const term = (searchTerm || '').toLowerCase();
    const idMatch = (req.id || '').toLowerCase().includes(term);
    const unitMatch = (req.department || '').toLowerCase().includes(term);
    const itemMatch = (req.assetName || '').toLowerCase().includes(term);
    return idMatch || unitMatch || itemMatch;
  });

  const totalItems = filteredRequests.length;
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const translateStatus = (status) => {
    if (status === 'Disetujui' || status === 'Approved') return 'Disetujui';
    if (status === 'Ditolak' || status === 'Rejected') return 'Ditolak';
    return 'Pending';
  };

  return (
    <div className="page-container">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
      <div className="page-header">
        <h1 className="page-title">Permintaan Aset Baru</h1>
        <Link to="/dashboard/requests/add" className="btn-primary">
          <Plus size={18} /> Buat Pengajuan Baru
        </Link>
      </div>

      <div className="card">
        <div className="table-controls">
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Cari ID pengajuan atau unit..." 
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
              <span>Memuat data permintaan...</span>
              <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
              `}</style>
            </div>
          ) : filteredRequests.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Pengajuan</th>
                  <th>Unit Kerja</th>
                  <th>Nama Barang</th>
                  <th>Jumlah</th>
                  <th>Alasan / Catatan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map(req => (
                  <tr key={req.id}>
                    <td style={{ fontWeight: 500 }}>{req.id}</td>
                    <td>{req.department}</td>
                    <td>{req.assetName}</td>
                    <td>{req.qty}</td>
                    <td>{req.notes || '-'}</td>
                    <td>
                      <span className={`badge ${
                        (req.status === 'Disetujui' || req.status === 'Approved') ? 'badge-success' : 
                        (req.status === 'Ditolak' || req.status === 'Rejected') ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {translateStatus(req.status)}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {req.status === 'Pending' ? (
                        <>
                          <button 
                            className="action-btn" 
                            title="Setujui Pengajuan" 
                            style={{ color: 'var(--success)' }} 
                            onClick={() => handleUpdateStatus(req.id, 'Approved')}
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            className="action-btn" 
                            title="Tolak Pengajuan" 
                            style={{ color: 'var(--danger)' }} 
                            onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tindakan Selesai</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ marginBottom: '1rem' }}>
                <Search size={48} color="var(--border)" style={{ margin: '0 auto' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Data tidak ditemukan</h3>
              <p>Maaf, kami tidak dapat menemukan pengajuan dengan kata kunci "{searchTerm}".</p>
            </div>
          )}
        </div>
        {!isLoading && filteredRequests.length > 0 && (
          <Pagination 
            totalItems={totalItems} 
            itemsPerPage={itemsPerPage} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
          />
        )}
      </div>
    </div>
  );
};

export default Requests;

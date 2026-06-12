import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Check, X } from 'lucide-react';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';
import Pagination from '../../components/Pagination';

const dummyRequests = [
  { id: 'REQ-001', unit: 'IGD', item: 'Kursi Roda Bariatrik', qty: 2, reason: 'Penambahan kapasitas', status: 'Pending' },
  { id: 'REQ-002', unit: 'Radiologi', item: 'Lead Apron', qty: 5, reason: 'Penggantian rusak', status: 'Disetujui' },
  { id: 'REQ-003', unit: 'Farmasi', item: 'Kulkas Vaksin', qty: 1, reason: 'Kulkas lama rusak', status: 'Ditolak' },
];

const Requests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Menampilkan sedikit data agar pagination terlihat

  const filteredRequests = dummyRequests.filter(req => {
    const term = (searchTerm || '').toLowerCase();
    return req.id.toLowerCase().includes(term) || req.unit.toLowerCase().includes(term) || req.item.toLowerCase().includes(term);
  });

  const totalItems = filteredRequests.length;
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Pengajuan</th>
                <th>Unit Kerja</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Alasan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map(req => (
                <tr key={req.id}>
                  <td style={{ fontWeight: 500 }}>{req.id}</td>
                  <td>{req.unit}</td>
                  <td>{req.item}</td>
                  <td>{req.qty}</td>
                  <td>{req.reason}</td>
                  <td>
                    <span className={`badge ${
                      req.status === 'Disetujui' ? 'badge-success' : 
                      req.status === 'Ditolak' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {req.status === 'Pending' ? (
                      <>
                        <button 
                          className="action-btn" 
                          title="Setujui Pengajuan" 
                          style={{ color: 'var(--success)' }} 
                          onClick={() => { setToastMsg(`Pengajuan ${req.id} telah disetujui.`); setShowToast(true); }}
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          className="action-btn" 
                          title="Tolak Pengajuan" 
                          style={{ color: 'var(--danger)' }} 
                          onClick={() => { setToastMsg(`Pengajuan ${req.id} ditolak.`); setShowToast(true); }}
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="action-btn" 
                          title="Lihat Detail" 
                          onClick={() => { setToastMsg(`Membuka detail pengajuan ${req.id}...`); setShowToast(true); }}
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          className="action-btn" 
                          title="Edit Pengajuan" 
                          style={{ color: 'var(--primary)' }} 
                          onClick={() => { setToastMsg(`Membuka editor pengajuan ${req.id}...`); setShowToast(true); }}
                        >
                          <Edit size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRequests.length > 0 && (
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

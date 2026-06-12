import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Search, Eye, Check } from 'lucide-react';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const dummyMutations = [
  { id: 'MUT-001', type: 'Internal', asset: 'AST-005 (Bed Pasien)', from: 'Kamar Mawar 101', to: 'Kamar Melati 202', date: '11 Mei 2026', pic: 'Ns. Ratna', status: 'Selesai' },
  { id: 'MUT-002', type: 'Internal', asset: 'AST-001 (USG Machine)', from: 'Radiologi 1', to: 'Radiologi 2', date: '12 Mei 2026', pic: 'Dr. Hendra', status: 'Menunggu Persetujuan' },
  { id: 'MUT-003', type: 'Eksternal (Dipinjam)', asset: 'AST-004 (Defibrillator)', from: 'Ruang Operasi 2', to: 'RSUD Kota Seberang', date: '12 Mei 2026', pic: 'Manajemen RS', status: 'Sedang Dipinjam' },
];

const Mutation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const filteredMutations = dummyMutations.filter(mut => {
    const term = (searchTerm || '').toLowerCase();
    return mut.id.toLowerCase().includes(term) || mut.asset.toLowerCase().includes(term);
  });

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
              {filteredMutations.length > 0 ? filteredMutations.map(mut => (
                <tr key={mut.id}>
                  <td style={{ fontWeight: 500 }}>{mut.id}</td>
                  <td>
                    <span className={`badge ${mut.type === 'Internal' ? 'badge-primary' : 'badge-warning'}`}>
                      {mut.type}
                    </span>
                  </td>
                  <td>{mut.asset}</td>
                  <td>{mut.from}</td>
                  <td>{mut.to}</td>
                  <td>{mut.date}</td>
                  <td>{mut.pic}</td>
                  <td>
                    <span className={`badge ${
                      mut.status === 'Selesai' ? 'badge-success' : 
                      mut.status === 'Sedang Dipinjam' ? 'badge-warning' :
                      mut.status === 'Proses Pindah' ? 'badge-primary' : 'badge-warning'
                    }`}>
                      {mut.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" title="Detail Mutasi" onClick={() => { setToastMsg(`Membuka rincian mutasi ${mut.id}...`); setShowToast(true); }}><Eye size={16} /></button>
                    {mut.status === 'Menunggu Persetujuan' && (
                      <button className="action-btn" title="Setujui Mutasi" onClick={() => { setToastMsg(`Mutasi ${mut.id} disetujui!`); setShowToast(true); }}><Check size={16} color="var(--success)" /></button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Tidak ada data mutasi yang sesuai dengan pencarian "{searchTerm}".
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

export default Mutation;

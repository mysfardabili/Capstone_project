import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Search, Eye, CheckCircle } from 'lucide-react';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const dummyRepairs = [
  { id: 'REP-101', asset: 'AST-002 (Patient Monitor B40)', date: '10 Mei 2026', reporter: 'Ns. Siti', issue: 'Layar bergaris', priority: 'Tinggi', status: 'Dalam Pengerjaan' },
  { id: 'REP-102', asset: 'AST-015 (Bed Pasien)', date: '08 Mei 2026', reporter: 'Ns. Budi', issue: 'Rem roda blong', priority: 'Sedang', status: 'Selesai' },
  { id: 'REP-103', asset: 'AST-004 (Defibrillator)', date: '09 Mei 2026', reporter: 'Dr. Andi', issue: 'Baterai tidak mengisi', priority: 'Tinggi', status: 'Menunggu Teknisi' },
];

const Repairs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const filteredRepairs = dummyRepairs.filter(rep => {
    const term = (searchTerm || '').toLowerCase();
    return rep.id.toLowerCase().includes(term) || rep.asset.toLowerCase().includes(term) || rep.reporter.toLowerCase().includes(term);
  });

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
                  <td>{rep.asset}</td>
                  <td>{rep.date}</td>
                  <td>{rep.reporter}</td>
                  <td>{rep.issue}</td>
                  <td>
                    <span className={`badge ${
                      rep.priority === 'Tinggi' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {rep.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      rep.status === 'Selesai' ? 'badge-success' : 
                      rep.status === 'Dalam Pengerjaan' ? 'badge-primary' : 'badge-neutral'
                    }`}>
                      {rep.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" title="Detail Perbaikan" onClick={() => { setToastMsg(`Membuka detail tiket ${rep.id}...`); setShowToast(true); }}><Eye size={16} /></button>
                    {rep.status !== 'Selesai' && (
                      <button className="action-btn" title="Tandai Selesai" onClick={() => { setToastMsg(`Tiket ${rep.id} ditandai selesai!`); setShowToast(true); }}><CheckCircle size={16} color="var(--success)" /></button>
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
        </div>
      </div>
    </div>
  );
};

export default Repairs;

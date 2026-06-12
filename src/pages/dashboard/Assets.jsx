import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, QrCode, Eye } from 'lucide-react';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';
import Pagination from '../../components/Pagination';

const initialAssets = [
  { id: 'AST-001', name: 'USG Machine Voluson E8', category: 'Alat Medis', room: 'Ruang Radiologi 1', serialNumber: 'SN-V8-001', price: 150000000, condition: 'Baik', status: 'Tersedia' },
  { id: 'AST-002', name: 'Patient Monitor B40', category: 'Alat Medis', room: 'IGD Bed 3', serialNumber: 'SN-PM-042', price: 25000000, condition: 'Rusak', status: 'Tersedia' },
  { id: 'AST-003', name: 'Kursi Roda Standar', category: 'Non-Medis', room: 'Lobi Utama', serialNumber: 'SN-KR-112', price: 1500000, condition: 'Baik', status: 'Tersedia' },
  { id: 'AST-004', name: 'Defibrillator Zoll', category: 'Alat Medis', room: 'RSUD Kota Seberang', serialNumber: 'SN-DF-099', price: 85000000, condition: 'Baik', status: 'Dipinjam' },
  { id: 'AST-005', name: 'Bed Pasien Elektrik', category: 'Fasilitas', room: 'Kamar Mawar 101', serialNumber: 'SN-BP-201', price: 12000000, condition: 'Baik', status: 'Tersedia' },
];

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [assets, setAssets] = useState(initialAssets);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Menampilkan sedikit data agar pagination terlihat efeknya

  const filteredAssets = assets.filter(asset => {
    const term = (searchTerm || '').toLowerCase();
    const assetName = (asset?.name || '').toLowerCase();
    const assetId = (asset?.id || '').toLowerCase();
    return assetName.includes(term) || assetId.includes(term);
  });

  // Pagination Logic
  const totalItems = filteredAssets.length;
  const paginatedAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = (asset) => {
    setDeleteTarget(asset);
  };

  const confirmDelete = () => {
    setAssets(prev => prev.filter(a => a.id !== deleteTarget.id));
    setDeleteTarget(null);
    setToastMsg(`Aset "${deleteTarget.name}" berhasil dihapus.`);
    setShowToast(true);
  };

  const handlePrintQR = (asset) => {
    setToastMsg(`QR Code untuk ${asset.name} (${asset.id}) sedang disiapkan untuk dicetak...`);
    setShowToast(true);
  };

  return (
    <div className="page-container">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', maxWidth: '420px', width: '90%', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Trash2 size={28} color="#ef4444" />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', color: '#0f172a' }}>Hapus Aset?</h3>
            <p style={{ color: '#64748b', margin: '0 0 2rem 0', lineHeight: 1.6 }}>
              Anda yakin ingin menghapus <strong>"{deleteTarget.name}"</strong> ({deleteTarget.id})? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteTarget(null)} className="btn-outline" style={{ flex: 1 }}>Batal</button>
              <button onClick={confirmDelete} className="btn-primary" style={{ flex: 1, background: '#ef4444' }}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">Data Aset Medis</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/dashboard/assets/add?type=baru" className="btn-primary">
            <Plus size={18} /> Tambah Barang Baru
          </Link>
          <Link to="/dashboard/assets/add?type=lama" className="btn-outline" style={{ backgroundColor: 'white' }}>
            <Plus size={18} /> Tambah Barang Lama
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="table-controls">
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Cari nama aset atau ID..." 
              style={{ paddingLeft: '2rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          {filteredAssets.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Aset</th>
                  <th>Nama Aset</th>
                  <th>Lokasi</th>
                  <th>No. Seri</th>
                  <th>Harga</th>
                  <th>Status</th>
                  <th>Kondisi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAssets.map(asset => (
                  <tr key={asset.id}>
                    <td style={{ fontWeight: 500 }}>
                      <Link to={`/dashboard/assets/detail/${asset.id}`} style={{ color: '#f97316', textDecoration: 'none' }}>{asset.id}</Link>
                    </td>
                    <td>
                      <Link to={`/dashboard/assets/detail/${asset.id}`} style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>{asset.name}</Link>
                    </td>
                    <td>{asset.room}</td>
                    <td>{asset.serialNumber}</td>
                    <td>{formatRupiah(asset.price)}</td>
                    <td>
                      <span className={`badge ${asset.status === 'Tersedia' ? 'badge-success' : 'badge-warning'}`}>
                        {asset.status === 'Dipinjam' ? 'Dipinjam RS Lain' : asset.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        asset.condition === 'Baik' ? 'badge-success' : 
                        asset.condition === 'Rusak' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {asset.condition}
                      </span>
                    </td>
                    <td>
                      <Link to={`/dashboard/assets/detail/${asset.id}`} className="action-btn" title="Detail" aria-label={`Lihat detail aset ${asset.name}`}><Eye size={16} /></Link>
                      <Link to={`/dashboard/assets/edit/${asset.id}`} className="action-btn" title="Edit" aria-label={`Edit aset ${asset.name}`}><Edit2 size={16} /></Link>
                      <button className="action-btn" title="Cetak QR" aria-label={`Cetak QR code aset ${asset.name}`} onClick={() => handlePrintQR(asset)}><QrCode size={16} /></button>
                      <button className="action-btn" title="Hapus" aria-label={`Hapus aset ${asset.name}`} onClick={() => handleDelete(asset)}><Trash2 size={16} color="var(--danger)" /></button>
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
              <p>Maaf, kami tidak dapat menemukan aset dengan kata kunci "{searchTerm}".</p>
            </div>
          )}
          {filteredAssets.length > 0 && (
            <Pagination 
              totalItems={totalItems} 
              itemsPerPage={itemsPerPage} 
              currentPage={currentPage} 
              onPageChange={setCurrentPage} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Assets;

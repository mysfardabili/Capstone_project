import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const AddAsset = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API Call delay
    setTimeout(() => {
      setIsLoading(false);
      setShowToast(true);
      
      // Redirect after showing toast for a moment
      setTimeout(() => {
        navigate('/dashboard/assets');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="page-container">
      {showToast && <Toast message="Aset berhasil ditambahkan!" onClose={() => setShowToast(false)} />}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-back" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="page-title" style={{ margin: 0 }}>Tambah Aset Baru</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nama Aset</label>
              <input type="text" className="form-control" placeholder="Masukkan nama aset" required />
            </div>
            <div className="form-group">
              <label>Nomor Seri / SN</label>
              <input type="text" className="form-control" placeholder="Masukkan nomor seri" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Kondisi Fisik</label>
              <select className="form-control" required defaultValue="">
                <option value="" disabled>Pilih Kondisi</option>
                <option value="Baik">Baik</option>
                <option value="Rusak">Rusak</option>
                <option value="Perbaikan">Sedang Perbaikan</option>
              </select>
            </div>
            <div className="form-group">
              <label>Kategori Aset</label>
              <select className="form-control" required>
                <option value="">Pilih Kategori</option>
                <option value="medis">Alat Medis</option>
                <option value="non-medis">Non-Medis</option>
                <option value="fasilitas">Fasilitas / Furnitur</option>
                <option value="it">Perangkat IT</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Ruangan / Lokasi Awal</label>
              <select className="form-control" required>
                <option value="">Pilih Ruangan</option>
                <option value="igd">IGD</option>
                <option value="radiologi">Ruang Radiologi</option>
                <option value="operasi">Ruang Operasi</option>
                <option value="rawat-inap">Kamar Rawat Inap</option>
              </select>
            </div>
            <div className="form-group">
              <label>Harga (Rp)</label>
              <input type="number" className="form-control" placeholder="Masukkan harga aset" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Status Ketersediaan</label>
              <select className="form-control" required defaultValue="Tersedia">
                <option value="Tersedia">Tersedia</option>
                <option value="Dipinjam">Dipinjam RS Lain</option>
              </select>
            </div>
            <div className="form-group">
              <label>Vendor / Supplier</label>
              <input type="text" className="form-control" placeholder="Nama perusahaan penyedia" />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Tanggal Pembelian</label>
              <input type="date" className="form-control" required />
            </div>
            <div className="form-group">
              <label>Masa Garansi Habis</label>
              <input type="date" className="form-control" required />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Foto Aset</label>
            <input type="file" accept="image/*" className="form-control" style={{ padding: '0.5rem', background: '#f8fafc' }} />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Deskripsi Tambahan</label>
            <textarea className="form-control" placeholder="Tuliskan spesifikasi atau catatan tambahan"></textarea>
          </div>

          <div className="form-actions">
            <Link to="/dashboard/assets" className="btn-outline">Batal</Link>
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? (
                <><Loader2 size={18} className="spin" /> Menyimpan...</>
              ) : (
                <><Save size={18} /> Simpan Aset</>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AddAsset;

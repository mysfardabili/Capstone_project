import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Save, Paperclip, ArrowLeft } from 'lucide-react';
import '../../components/SharedUI.css';

const AddRequest = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard/requests');
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-back" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="page-title" style={{ margin: 0 }}>Buat Pengajuan Permintaan Aset</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nama Barang yang Diminta</label>
              <input type="text" className="form-control" placeholder="Contoh: Kursi Roda Bariatrik" required />
            </div>
            <div className="form-group">
              <label>Jumlah</label>
              <input type="number" className="form-control" placeholder="1" min="1" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Unit Kerja Pemohon</label>
              <select className="form-control" required>
                <option value="">Pilih Unit</option>
                <option value="igd">IGD</option>
                <option value="radiologi">Radiologi</option>
                <option value="farmasi">Farmasi</option>
                <option value="gizi">Gizi</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tingkat Urgensi</label>
              <select className="form-control" required>
                <option value="rendah">Rendah (Bulan Depan)</option>
                <option value="sedang">Sedang (Minggu Depan)</option>
                <option value="tinggi">Tinggi (Segera / Cito)</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Alasan Permintaan</label>
            <textarea className="form-control" placeholder="Jelaskan alasan secara mendetail (misal: penggantian alat rusak, penambahan kapasitas, dll)" required></textarea>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Lampiran / Dokumen Pendukung (Opsional)</label>
            <div style={{ border: '2px dashed var(--border)', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
              <Paperclip size={24} style={{ marginBottom: '0.5rem' }} />
              <p>Klik atau seret file PDF/Gambar ke area ini</p>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/dashboard/requests" className="btn-outline">Batal</Link>
            <button type="submit" className="btn-primary">
              <Save size={18} /> Ajukan Permintaan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRequest;

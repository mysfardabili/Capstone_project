import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Save, Paperclip, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const AddRequest = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const data = {
        assetName: formData.get('assetName'),
        qty: parseInt(formData.get('qty')) || 1,
        department: formData.get('department'),
        notes: formData.get('notes'),
        category: formData.get('department') === 'farmasi' || formData.get('department') === 'gizi' ? 'Non-Medis' : 'Alat Medis',
      };

      await api.post('/requests', data);
      
      setIsLoading(false);
      setShowToast(true);
      
      setTimeout(() => {
        navigate('/dashboard/requests');
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal menyimpan pengajuan baru');
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      {showToast && <Toast message="Pengajuan berhasil diajukan!" onClose={() => setShowToast(false)} />}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-back" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="page-title" style={{ margin: 0 }}>Buat Pengajuan Permintaan Aset</h1>
      </div>

      <div className="form-container">
        {errorMsg && (
          <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nama Barang yang Diminta</label>
              <input type="text" name="assetName" className="form-control" placeholder="Contoh: Kursi Roda Bariatrik" required />
            </div>
            <div className="form-group">
              <label>Jumlah</label>
              <input type="number" name="qty" className="form-control" placeholder="1" min="1" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Unit Kerja Pemohon</label>
              <select name="department" className="form-control" required defaultValue="">
                <option value="" disabled>Pilih Unit</option>
                <option value="IGD">IGD</option>
                <option value="Radiologi">Radiologi</option>
                <option value="Farmasi">Farmasi</option>
                <option value="Gizi">Gizi</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tingkat Urgensi</label>
              <select name="urgency" className="form-control" required defaultValue="sedang">
                <option value="rendah">Rendah (Bulan Depan)</option>
                <option value="sedang">Sedang (Minggu Depan)</option>
                <option value="tinggi">Tinggi (Segera / Cito)</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Alasan Permintaan / Catatan</label>
            <textarea name="notes" className="form-control" placeholder="Jelaskan alasan secara mendetail (misal: penggantian alat rusak, penambahan kapasitas, dll)" required></textarea>
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
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 size={18} className="spin" /> Mengajukan...</>
              ) : (
                <><Save size={18} /> Ajukan Permintaan</>
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

export default AddRequest;

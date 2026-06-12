import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Save, AlertTriangle, Image as ImageIcon, QrCode, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const AddRepair = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillAssetId = searchParams.get('assetId') || '';
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Get current user name for reporterName field
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const reporterName = currentUser.name || 'Admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      await api.post('/repairs', formData, true);

      setIsLoading(false);
      setShowToast(true);

      setTimeout(() => {
        navigate('/dashboard/repairs');
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal melaporkan kerusakan. Pastikan ID Aset benar.');
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      {showToast && <Toast message="Laporan kerusakan berhasil dikirim!" onClose={() => setShowToast(false)} />}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-back" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="page-title" style={{ margin: 0 }}>Form Pelaporan Kerusakan</h1>
      </div>

      <div className="form-container" style={{ borderTop: '4px solid var(--danger)' }}>
        {errorMsg && (
          <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>ID Aset / Scan QR</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" name="assetId" className="form-control" placeholder="Contoh: AST-002" required style={{ flex: 1 }} defaultValue={prefillAssetId} />
                <button type="button" className="btn-primary" style={{ padding: '0 1rem', backgroundColor: 'var(--secondary)' }} title="Scan QR Code">
                  <QrCode size={20} />
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Tingkat Prioritas</label>
              <select name="priority" className="form-control" required defaultValue="sedang">
                <option value="rendah">Rendah (Dapat ditunda)</option>
                <option value="sedang">Sedang (Perlu penanganan)</option>
                <option value="tinggi">Tinggi (Berpengaruh pada pasien / Cito)</option>
              </select>
            </div>
          </div>

          {/* Hidden field: reporterName auto-filled from logged in user */}
          <input type="hidden" name="reporterName" value={reporterName} />

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Deskripsi Kerusakan</label>
            <textarea name="description" className="form-control" placeholder="Jelaskan secara rinci kerusakan yang terjadi..." required></textarea>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Unggah Foto Bukti Kerusakan (Opsional)</label>
            <input 
              type="file" 
              name="image" 
              accept="image/*" 
              className="form-control" 
              style={{ padding: '0.5rem', background: '#f8fafc' }} 
            />
          </div>

          <div className="form-actions">
            <Link to="/dashboard/repairs" className="btn-outline">Batal</Link>
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ backgroundColor: 'var(--danger)', opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? (
                <><Loader2 size={18} className="spin" /> Melaporkan...</>
              ) : (
                <><AlertTriangle size={18} /> Lapor Kerusakan</>
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

export default AddRepair;

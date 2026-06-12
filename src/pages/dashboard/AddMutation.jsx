import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const AddMutation = () => {
  const navigate = useNavigate();
  const [assetId, setAssetId] = useState('');
  const [sourceLocation, setSourceLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchAssetLocation = async () => {
      if (!assetId.trim()) {
        setSourceLocation('');
        return;
      }
      try {
        const data = await api.get(`/assets/${assetId.trim()}`);
        setSourceLocation(data.room || 'Gudang Alat');
      } catch (err) {
        setSourceLocation('Aset tidak ditemukan');
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchAssetLocation();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [assetId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sourceLocation === 'Aset tidak ditemukan' || !sourceLocation) {
      setErrorMsg('ID Aset tidak valid. Silakan periksa kembali.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const data = {
        assetId: assetId.trim(),
        targetLocation: formData.get('targetLocation'),
        notes: formData.get('notes'),
        requesterName: formData.get('requesterName'),
      };

      await api.post('/mutations', data);

      setIsLoading(false);
      setShowToast(true);

      setTimeout(() => {
        navigate('/dashboard/mutation');
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal mengajukan mutasi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      {showToast && <Toast message="Pengajuan mutasi berhasil dikirim!" onClose={() => setShowToast(false)} />}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-back" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="page-title" style={{ margin: 0 }}>Form Pengajuan Mutasi Aset</h1>
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
              <label>ID Aset / Scan QR</label>
              <input 
                type="text" 
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="form-control" 
                placeholder="Contoh: AST-001" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Penanggung Jawab Pemindahan</label>
              <input type="text" name="requesterName" className="form-control" placeholder="Nama petugas/perawat" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Lokasi Asal (Otomatis)</label>
              <input 
                type="text" 
                className="form-control" 
                value={sourceLocation} 
                disabled 
                style={{
                  color: sourceLocation === 'Aset tidak ditemukan' ? '#ef4444' : 'inherit',
                  fontWeight: sourceLocation === 'Aset tidak ditemukan' ? 'bold' : 'normal'
                }}
              />
            </div>
            <div className="form-group">
              <label>Lokasi Tujuan</label>
              <select name="targetLocation" className="form-control" required defaultValue="">
                <option value="" disabled>Pilih Ruangan Tujuan</option>
                <option value="IGD">IGD</option>
                <option value="Ruang Radiologi 1">Radiologi 1</option>
                <option value="Ruang Radiologi 2">Radiologi 2</option>
                <option value="Ruang Operasi 1">Ruang Operasi</option>
                <option value="Kamar Mawar 101">Kamar Rawat Inap (Mawar)</option>
                <option value="Kamar Melati 202">Kamar Rawat Inap (Melati)</option>
                <option value="RSUD Kota Seberang">RSUD Kota Seberang (Pinjam)</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Alasan Mutasi</label>
            <textarea name="notes" className="form-control" placeholder="Jelaskan alasan pemindahan (misal: permintaan dokter bedah, perbaikan ruangan, dll)" required></textarea>
          </div>

          <div className="form-actions">
            <Link to="/dashboard/mutation" className="btn-outline">Batal</Link>
            <button type="submit" className="btn-primary" disabled={isLoading || sourceLocation === 'Aset tidak ditemukan' || !sourceLocation}>
              {isLoading ? (
                <><Loader2 size={18} className="spin" /> Mengajukan...</>
              ) : (
                <><RefreshCw size={18} /> Ajukan Mutasi</>
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

export default AddMutation;

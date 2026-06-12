import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Save, UploadCloud, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const AddCalibration = () => {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await api.get('/assets');
        setAssets(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      const calibrationDate = formData.get('calibrationDate');
      // Calculate next calibration date (1 year later)
      const executionDate = new Date(calibrationDate);
      const nextDate = new Date(executionDate.setFullYear(executionDate.getFullYear() + 1))
        .toISOString()
        .split('T')[0];

      const data = {
        assetId: formData.get('assetId'),
        calibrationDate: calibrationDate,
        nextCalibrationDate: nextDate,
        vendor: formData.get('vendor'),
        certificateNumber: formData.get('certificateNumber') || `CERT-CAL-${Date.now().toString().slice(-6)}`,
        notes: formData.get('notes'),
        status: 'Lulus', // Defaults to Lulus when recorded manually
      };

      await api.post('/calibrations', data);

      setIsLoading(false);
      setShowToast(true);

      setTimeout(() => {
        navigate('/dashboard/calibration');
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal merekam data kalibrasi');
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="page-container">
      {showToast && <Toast message="Data kalibrasi berhasil disimpan!" onClose={() => setShowToast(false)} />}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-back" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="page-title" style={{ margin: 0 }}>Catat Kalibrasi Baru</h1>
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
              <label>Pilih Aset</label>
              <select name="assetId" className="form-control" required defaultValue="">
                <option value="" disabled>-- Pilih Aset --</option>
                {assets.map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.id} - {asset.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tanggal Pelaksanaan Kalibrasi</label>
              <input type="date" name="calibrationDate" className="form-control" required />
              <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                *Jadwal kalibrasi berikutnya akan otomatis diset 1 tahun dari tanggal ini.
              </small>
            </div>
            <div className="form-group">
              <label>Teknisi / Lembaga Pelaksana</label>
              <input type="text" name="vendor" className="form-control" placeholder="Nama instansi kalibrasi" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nomor Sertifikat Kalibrasi</label>
              <input type="text" name="certificateNumber" className="form-control" placeholder="Contoh: CERT-USG-2026-001" />
            </div>
          </div>

          <div className="form-group">
            <label>Upload Sertifikat (PDF) - Opsional</label>
            <div 
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-light)',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <input 
                type="file" 
                accept=".pdf"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  top: 0, left: 0, width: '100%', height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }} 
              />
              <UploadCloud size={32} color="var(--primary)" style={{ marginBottom: '10px' }} />
              <p style={{ margin: 0, fontWeight: 500 }}>
                {fileName ? fileName : 'Klik atau drag file sertifikat ke sini'}
              </p>
              {!fileName && <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Maksimal ukuran file: 5MB</p>}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Catatan Hasil Kalibrasi</label>
            <textarea name="notes" className="form-control" placeholder="Tuliskan catatan atau rekomendasi dari teknisi"></textarea>
          </div>

          <div className="form-actions">
            <Link to="/dashboard/calibration" className="btn-outline">Batal</Link>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 size={18} className="spin" /> Menyimpan...</>
              ) : (
                <><Save size={18} /> Simpan Data Kalibrasi</>
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

export default AddCalibration;

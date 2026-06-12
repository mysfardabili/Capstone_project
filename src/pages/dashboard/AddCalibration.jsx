import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Save, UploadCloud, ArrowLeft } from 'lucide-react';
import '../../components/SharedUI.css';

const AddCalibration = () => {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard/calibration');
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-back" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="page-title" style={{ margin: 0 }}>Catat Kalibrasi Baru</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Pilih Aset</label>
              <select className="form-control" required defaultValue="">
                <option value="" disabled>-- Pilih Aset --</option>
                <option value="AST-001">AST-001 - USG Machine Voluson E8</option>
                <option value="AST-002">AST-002 - Patient Monitor B40</option>
                <option value="AST-004">AST-004 - Defibrillator Zoll</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tanggal Pelaksanaan Kalibrasi</label>
              <input type="date" className="form-control" required />
              <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                *Jadwal kalibrasi berikutnya akan otomatis diset 1 tahun dari tanggal ini.
              </small>
            </div>
            <div className="form-group">
              <label>Teknisi / Lembaga Pelaksana</label>
              <input type="text" className="form-control" placeholder="Nama instansi kalibrasi" required />
            </div>
          </div>

          <div className="form-group">
            <label>Upload Sertifikat (PDF)</label>
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
            <textarea className="form-control" placeholder="Tuliskan catatan atau rekomendasi dari teknisi"></textarea>
          </div>

          <div className="form-actions">
            <Link to="/dashboard/calibration" className="btn-outline">Batal</Link>
            <button type="submit" className="btn-primary">
              <Save size={18} /> Simpan Data Kalibrasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCalibration;

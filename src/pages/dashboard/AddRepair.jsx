import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Save, AlertTriangle, Image as ImageIcon, QrCode, ArrowLeft } from 'lucide-react';
import '../../components/SharedUI.css';

const AddRepair = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard/repairs');
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-back" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="page-title" style={{ margin: 0 }}>Form Pelaporan Kerusakan</h1>
      </div>

      <div className="form-container" style={{ borderTop: '4px solid var(--danger)' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>ID Aset / Scan QR</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" className="form-control" placeholder="Contoh: AST-002" required style={{ flex: 1 }} />
                <button type="button" className="btn-primary" style={{ padding: '0 1rem', backgroundColor: 'var(--secondary)' }} title="Scan QR Code">
                  <QrCode size={20} />
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Tingkat Prioritas</label>
              <select className="form-control" required>
                <option value="rendah">Rendah (Dapat ditunda)</option>
                <option value="sedang">Sedang (Perlu penanganan)</option>
                <option value="tinggi">Tinggi (Berpengaruh pada pasien / Cito)</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Deskripsi Kerusakan</label>
            <textarea className="form-control" placeholder="Jelaskan secara rinci kerusakan yang terjadi..." required></textarea>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Unggah Foto Bukti Kerusakan</label>
            <div style={{ border: '2px dashed var(--border)', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
              <ImageIcon size={24} style={{ marginBottom: '0.5rem' }} />
              <p>Klik atau seret foto kerusakan ke area ini</p>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/dashboard/repairs" className="btn-outline">Batal</Link>
            <button type="submit" className="btn-primary" style={{ backgroundColor: 'var(--danger)' }}>
              <AlertTriangle size={18} /> Lapor Kerusakan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRepair;

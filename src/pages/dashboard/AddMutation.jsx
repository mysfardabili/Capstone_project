import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import '../../components/SharedUI.css';

const AddMutation = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard/mutation');
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-back" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="page-title" style={{ margin: 0 }}>Form Pengajuan Mutasi Aset</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>ID Aset / Nama Aset</label>
              <input type="text" className="form-control" placeholder="Contoh: AST-001" required />
            </div>
            <div className="form-group">
              <label>Penanggung Jawab Pemindahan</label>
              <input type="text" className="form-control" placeholder="Nama petugas/perawat" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Lokasi Asal (Otomatis)</label>
              <input type="text" className="form-control" value="Radiologi 1" disabled />
            </div>
            <div className="form-group">
              <label>Lokasi Tujuan</label>
              <select className="form-control" required>
                <option value="">Pilih Ruangan Tujuan</option>
                <option value="igd">IGD</option>
                <option value="radiologi2">Radiologi 2</option>
                <option value="operasi">Ruang Operasi</option>
                <option value="rawat-inap">Kamar Rawat Inap</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Alasan Mutasi</label>
            <textarea className="form-control" placeholder="Jelaskan alasan pemindahan (misal: permintaan dokter bedah, perbaikan ruangan, dll)" required></textarea>
          </div>

          <div className="form-actions">
            <Link to="/dashboard/mutation" className="btn-outline">Batal</Link>
            <button type="submit" className="btn-primary">
              <RefreshCw size={18} /> Ajukan Mutasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMutation;

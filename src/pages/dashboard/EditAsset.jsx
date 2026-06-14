import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const EditAsset = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFetch, setIsLoadingFetch] = useState(true);
  const [errorFetch, setErrorFetch] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [assetData, setAssetData] = useState({
    name: '',
    serialNumber: '',
    condition: 'Baik',
    category: '',
    room: '',
    price: 0,
    status: 'Tersedia',
    vendor: '',
    purchaseDate: '',
    warrantyEnd: '',
    description: ''
  });

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const data = await api.get(`/assets/${id}`);

        // Map database readable categories and rooms to form select option values
        const catMap = {
          'Alat Medis': 'medis',
          'Non-Medis': 'non-medis',
          'Fasilitas': 'fasilitas',
          'Perangkat IT': 'it'
        };
        const roomMap = {
          'Ruang Radiologi 1': 'radiologi',
          'Ruang Radiologi 2': 'radiologi',
          'IGD Bed 3': 'igd',
          'Ruang Operasi 1': 'operasi',
          'Kamar Mawar 101': 'rawat-inap',
          'Kamar Melati 202': 'rawat-inap'
        };

        setAssetData({
          name: data.name || '',
          serialNumber: data.serialNumber || '',
          condition: data.condition || 'Baik',
          category: catMap[data.category] || 'medis',
          room: roomMap[data.room] || 'radiologi',
          price: data.price || 0,
          status: data.status || 'Tersedia',
          vendor: data.vendor || '',
          purchaseDate: data.purchaseDate || '',
          warrantyEnd: data.warrantyEnd || '',
          description: data.description || ''
        });
      } catch (err) {
        console.error(err);
        setErrorFetch(err.message || 'Gagal memuat data aset');
      } finally {
        setIsLoadingFetch(false);
      }
    };
    fetchAsset();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      await api.put(`/assets/${id}`, formData, true);

      setIsLoading(false);
      setShowToast(true);

      setTimeout(() => {
        navigate('/dashboard/assets');
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal menyimpan perubahan');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoadingFetch) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem', color: 'var(--text-muted)' }}>
        <Loader2 size={40} className="spin" style={{ color: 'var(--primary)' }} />
        <span>Memuat data aset untuk diedit...</span>
        <style>{`
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (errorFetch) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        <h3>Gagal Memuat Data Aset</h3>
        <p>{errorFetch}</p>
        <button onClick={() => navigate(-1)} className="btn-primary" style={{ margin: '1rem auto' }}>Kembali</button>
      </div>
    );
  }

  return (
    <div className="page-container">
      {showToast && <Toast message="Perubahan berhasil disimpan!" onClose={() => setShowToast(false)} />}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-back" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
        <h1 className="page-title" style={{ margin: 0 }}>Edit Data Aset {id ? `(${id})` : ''}</h1>
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
              <label>Nama Aset</label>
              <input type="text" name="name" value={assetData.name} onChange={handleChange} className="form-control" placeholder="Masukkan nama aset" required />
            </div>
            <div className="form-group">
              <label>Nomor Seri / SN</label>
              <input type="text" name="serialNumber" value={assetData.serialNumber} onChange={handleChange} className="form-control" placeholder="Masukkan nomor seri" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Kondisi Fisik</label>
              <select name="condition" value={assetData.condition} onChange={handleChange} className="form-control" required>
                <option value="" disabled>Pilih Kondisi</option>
                <option value="Baik">Baik</option>
                <option value="Rusak">Rusak</option>
                <option value="Perbaikan">Sedang Perbaikan</option>
              </select>
            </div>
            <div className="form-group">
              <label>Kategori Aset</label>
              <select name="category" value={assetData.category} onChange={handleChange} className="form-control" required>
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
              <select name="room" value={assetData.room} onChange={handleChange} className="form-control" required>
                <option value="">Pilih Ruangan</option>
                <option value="igd">IGD</option>
                <option value="radiologi">Ruang Radiologi</option>
                <option value="operasi">Ruang Operasi</option>
                <option value="rawat-inap">Kamar Rawat Inap</option>
              </select>
            </div>
            <div className="form-group">
              <label>Harga (Rp)</label>
              <input type="number" name="price" value={assetData.price} onChange={handleChange} className="form-control" placeholder="Masukkan harga aset" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status Ketersediaan</label>
              <select name="status" value={assetData.status} onChange={handleChange} className="form-control" required>
                <option value="Tersedia">Tersedia</option>
                <option value="Dipinjam">Dipinjam RS Lain</option>
              </select>
            </div>
            <div className="form-group">
              <label>Vendor / Supplier</label>
              <input type="text" name="vendor" value={assetData.vendor} onChange={handleChange} className="form-control" placeholder="Nama perusahaan penyedia" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tanggal Pembelian</label>
              <input type="date" name="purchaseDate" value={assetData.purchaseDate} onChange={handleChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Masa Garansi Habis</label>
              <input type="date" name="warrantyEnd" value={assetData.warrantyEnd} onChange={handleChange} className="form-control" required />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Foto Aset</label>
            <input type="file" name="image" accept="image/*" className="form-control" style={{ padding: '0.5rem' }}/>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Deskripsi Tambahan</label>
            <textarea name="description" value={assetData.description} onChange={handleChange} className="form-control" placeholder="Tuliskan spesifikasi atau catatan tambahan"></textarea>
          </div>

          <div className="form-actions">
            <Link to="/dashboard/assets" className="btn-outline">Batal</Link>
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? (
                <><Loader2 size={18} className="spin" /> Menyimpan...</>
              ) : (
                <><Save size={18} /> Simpan Perubahan</>
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

export default EditAsset;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
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
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-text-muted">
        <Loader2 size={40} className="animate-spin" color="#f97316" />
        <span>Memuat data aset untuk diedit...</span>
      </div>
    );
  }

  if (errorFetch) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        <h3>Gagal Memuat Data Aset</h3>
        <p>{errorFetch}</p>
        <button onClick={() => navigate(-1)} className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70" style={{ margin: '1rem auto' }}>Kembali</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {showToast && <Toast message="Perubahan berhasil disimpan!" onClose={() => setShowToast(false)} />}
      <div className="flex justify-between items-center" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="bg-transparent border-none cursor-pointer p-2" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="text-2xl font-bold text-text-main" style={{ margin: 0 }}>Edit Data Aset {id ? `(${id})` : ''}</h1>
      </div>

      <div className="bg-surface p-8 rounded-xl shadow-custom-sm border border-border max-w-[800px]">
        {errorMsg && (
          <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">Nama Aset</label>
              <input type="text" name="name" value={assetData.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" placeholder="Masukkan nama aset" required />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">Nomor Seri / SN</label>
              <input type="text" name="serialNumber" value={assetData.serialNumber} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" placeholder="Masukkan nomor seri" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">Kondisi Fisik</label>
              <select name="condition" value={assetData.condition} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" required>
                <option value="" disabled>Pilih Kondisi</option>
                <option value="Baik">Baik</option>
                <option value="Rusak">Rusak</option>
                <option value="Perbaikan">Sedang Perbaikan</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">Kategori Aset</label>
              <select name="category" value={assetData.category} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" required>
                <option value="">Pilih Kategori</option>
                <option value="medis">Alat Medis</option>
                <option value="non-medis">Non-Medis</option>
                <option value="fasilitas">Fasilitas / Furnitur</option>
                <option value="it">Perangkat IT</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">Ruangan / Lokasi Awal</label>
              <select name="room" value={assetData.room} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" required>
                <option value="">Pilih Ruangan</option>
                <option value="igd">IGD</option>
                <option value="radiologi">Ruang Radiologi</option>
                <option value="operasi">Ruang Operasi</option>
                <option value="rawat-inap">Kamar Rawat Inap</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">Harga (Rp)</label>
              <input type="number" name="price" value={assetData.price} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" placeholder="Masukkan harga aset" required />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">Status Ketersediaan</label>
              <select name="status" value={assetData.status} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" required>
                <option value="Tersedia">Tersedia</option>
                <option value="Dipinjam">Dipinjam RS Lain</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">Vendor / Supplier</label>
              <input type="text" name="vendor" value={assetData.vendor} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" placeholder="Nama perusahaan penyedia" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">Tanggal Pembelian</label>
              <input type="date" name="purchaseDate" value={assetData.purchaseDate} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" required />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">Masa Garansi Habis</label>
              <input type="date" name="warrantyEnd" value={assetData.warrantyEnd} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" required />
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1 mb-6">
            <label className="text-sm font-semibold text-text-main">Foto Aset</label>
            <input type="file" name="image" accept="image/*" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" style={{ padding: '0.5rem' }}/>
          </div>

          <div className="flex flex-col gap-2 flex-1 mb-6">
            <label className="text-sm font-semibold text-text-main">Deskripsi Tambahan</label>
            <textarea name="description" value={assetData.description} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)] resize-y min-h-[100px]" placeholder="Tuliskan spesifikasi atau catatan tambahan"></textarea>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
            <Link to="/dashboard/assets" className="bg-transparent text-text-main border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Batal</Link>
            <button type="submit" className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" /> Menyimpan...</>
              ) : (
                <><Save size={18} /> Simpan Perubahan</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAsset;

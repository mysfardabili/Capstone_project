import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
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
    <div className="flex flex-col gap-6 h-full">
      {showToast && <Toast message="Pengajuan mutasi berhasil dikirim!" onClose={() => setShowToast(false)} />}
      <div className="flex justify-between items-center gap-4">
        <button className="bg-transparent text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 m-0">Form Pengajuan Mutasi Aset</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-custom-sm border border-gray-200 dark:border-gray-700 max-w-[800px]">
        {errorMsg && (
          <div className="text-red-500 bg-red-100 p-3 rounded-[10px] mb-6 text-[0.9rem] font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">ID Aset / Scan QR</label>
              <input 
                type="text" 
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" 
                placeholder="Contoh: AST-001" 
                required 
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Penanggung Jawab Pemindahan</label>
              <input type="text" name="requesterName" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" placeholder="Nama petugas/perawat" required />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Lokasi Asal (Otomatis)</label>
              <input 
                type="text" 
                className={`w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-white dark:bg-gray-800 transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)] ${
                  sourceLocation === 'Aset tidak ditemukan' ? 'text-red-500 font-bold' : 'text-gray-800 dark:text-gray-100'
                }`} 
                value={sourceLocation} 
                disabled 
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Lokasi Tujuan</label>
              <select name="targetLocation" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" required defaultValue="">
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

          <div className="flex flex-col gap-2 flex-1 mb-6">
            <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Alasan Mutasi</label>
            <textarea name="notes" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" placeholder="Jelaskan alasan pemindahan (misal: permintaan dokter bedah, perbaikan ruangan, dll)" required></textarea>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link to="/dashboard/mutation" className="bg-transparent text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Batal</Link>
            <button type="submit" className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70" disabled={isLoading || sourceLocation === 'Aset tidak ditemukan' || !sourceLocation}>
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

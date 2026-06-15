import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Save, Paperclip, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
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
    <div className="flex flex-col gap-6 h-full">
      {showToast && <Toast message="Pengajuan berhasil diajukan!" onClose={() => setShowToast(false)} />}
      <div className="flex justify-between items-center" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="bg-transparent text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100" style={{ margin: 0 }}>Buat Pengajuan Permintaan Aset</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-custom-sm border border-gray-200 dark:border-gray-700 max-w-[800px]">
        {errorMsg && (
          <div className="text-red-500 bg-red-100 p-3 rounded-[10px] mb-6 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Nama Barang yang Diminta</label>
              <input type="text" name="assetName" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" placeholder="Contoh: Kursi Roda Bariatrik" required />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Jumlah</label>
              <input type="number" name="qty" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" placeholder="1" min="1" required />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Unit Kerja Pemohon</label>
              <select name="department" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" required defaultValue="">
                <option value="" disabled>Pilih Unit</option>
                <option value="IGD">IGD</option>
                <option value="Radiologi">Radiologi</option>
                <option value="Farmasi">Farmasi</option>
                <option value="Gizi">Gizi</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Tingkat Urgensi</label>
              <select name="urgency" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" required defaultValue="sedang">
                <option value="rendah">Rendah (Bulan Depan)</option>
                <option value="sedang">Sedang (Minggu Depan)</option>
                <option value="tinggi">Tinggi (Segera / Cito)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1 mb-6">
            <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Alasan Permintaan / Catatan</label>
            <textarea name="notes" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" placeholder="Jelaskan alasan secara mendetail (misal: penggantian alat rusak, penambahan kapasitas, dll)" required></textarea>
          </div>

          <div className="flex flex-col gap-2 flex-1 mb-6">
            <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Lampiran / Dokumen Pendukung (Opsional)</label>
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 text-center rounded-custom-md text-gray-500 dark:text-gray-400">
              <Paperclip size={24} className="mb-2 mx-auto" />
              <p>Klik atau seret file PDF/Gambar ke area ini</p>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link to="/dashboard/requests" className="bg-transparent text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Batal</Link>
            <button type="submit" className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70" disabled={isLoading}>
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

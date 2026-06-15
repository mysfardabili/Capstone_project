import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Save, UploadCloud, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
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
        status: 'Lulus',
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
    <div className="flex flex-col gap-6 h-full">
      {showToast && <Toast message="Data kalibrasi berhasil disimpan!" onClose={() => setShowToast(false)} />}
      <div className="flex justify-between items-center gap-4">
        <button className="bg-transparent text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 m-0">Catat Kalibrasi Baru</h1>
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
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Pilih Aset</label>
              <select name="assetId" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" required defaultValue="">
                <option value="" disabled>-- Pilih Aset --</option>
                {assets.map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.id} - {asset.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Tanggal Pelaksanaan Kalibrasi</label>
              <input type="date" name="calibrationDate" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" required />
              <small className="text-gray-500 dark:text-gray-400 mt-1 block">
                *Jadwal kalibrasi berikutnya akan otomatis diset 1 tahun dari tanggal ini.
              </small>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Teknisi / Lembaga Pelaksana</label>
              <input type="text" name="vendor" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" placeholder="Nama instansi kalibrasi" required />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Nomor Sertifikat Kalibrasi</label>
              <input type="text" name="certificateNumber" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" placeholder="Contoh: CERT-USG-2026-001" />
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Upload Sertifikat (PDF) - Opsional</label>
            <div
              className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-800/50 cursor-pointer relative"
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud size={32} className="text-orange-500 mb-[10px]" />
              <p className="m-0 font-medium">
                {fileName ? fileName : 'Klik atau drag file sertifikat ke sini'}
              </p>
              {!fileName && <p className="mt-[5px] text-[0.8rem] text-gray-500 dark:text-gray-400">Maksimal ukuran file: 5MB</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1 mb-6">
            <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">Catatan Hasil Kalibrasi</label>
            <textarea name="notes" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" placeholder="Tuliskan catatan atau rekomendasi dari teknisi"></textarea>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link to="/dashboard/calibration" className="bg-transparent text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Batal</Link>
            <button type="submit" className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70" disabled={isLoading}>
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

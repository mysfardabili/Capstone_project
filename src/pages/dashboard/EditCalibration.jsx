import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Save, UploadCloud, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import Toast from '../../components/Toast';

const EditCalibration = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [fileName, setFileName] = useState('');
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFetch, setIsLoadingFetch] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [calData, setCalData] = useState({
    assetId: '',
    calibrationDate: '',
    nextCalibrationDate: '',
    vendor: '',
    status: 'Menunggu',
    certificateNumber: '',
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cal, assetsData] = await Promise.all([
          api.get(`/calibrations/${id}`),
          api.get('/assets'),
        ]);
        setCalData({
          assetId: cal.assetId || '',
          calibrationDate: cal.calibrationDate || '',
          nextCalibrationDate: cal.nextCalibrationDate || '',
          vendor: cal.vendor || '',
          status: cal.status || 'Menunggu',
          certificateNumber: cal.certificateNumber || '',
          notes: cal.notes || '',
        });
        setAssets(assetsData);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message || 'Gagal memuat data kalibrasi');
      } finally {
        setIsLoadingFetch(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCalData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      await api.put(`/calibrations/${id}`, formData, true);

      setIsLoading(false);
      setShowToast(true);

      setTimeout(() => {
        navigate('/dashboard/calibration');
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal menyimpan perubahan');
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  if (isLoadingFetch) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-text-muted">
        <Loader2 size={40} className="animate-spin" color="#f97316" />
        <span>Memuat data kalibrasi...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {showToast && <Toast message="Data kalibrasi berhasil diperbarui!" onClose={() => setShowToast(false)} />}
      <div className="flex justify-between items-center gap-4">
        <button className="bg-transparent text-text-main border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="text-2xl font-bold text-text-main m-0">Edit Kalibrasi ({id})</h1>
      </div>

      <div className="bg-surface p-8 rounded-xl shadow-custom-sm border border-border max-w-[800px]">
        {errorMsg && (
          <div className="text-red-500 bg-red-100 p-3 rounded-[10px] mb-6 text-[0.9rem] font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">Pilih Aset</label>
              <select name="assetId" value={calData.assetId} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" required>
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
              <label className="text-sm font-semibold text-text-main">Status Kalibrasi</label>
              <select name="status" value={calData.status} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" required>
                <option value="Menunggu">Menunggu</option>
                <option value="Lulus">Lulus</option>
                <option value="Gagal">Gagal</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">Teknisi / Lembaga Pelaksana</label>
              <input type="text" name="vendor" value={calData.vendor} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" placeholder="Nama instansi kalibrasi" required />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">Tanggal Pelaksanaan Kalibrasi</label>
              <input type="date" name="calibrationDate" value={calData.calibrationDate} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">Jadwal Berikutnya</label>
              <input type="date" name="nextCalibrationDate" value={calData.nextCalibrationDate} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" required />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">Nomor Sertifikat Kalibrasi</label>
              <input type="text" name="certificateNumber" value={calData.certificateNumber} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" placeholder="Contoh: CERT-USG-2026-001" />
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-semibold text-text-main">Upload Sertifikat (PDF) - Opsional</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-800/50 cursor-pointer relative">
              <input
                type="file"
                name="certificate"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud size={32} className="text-orange-500 mb-[10px]" />
              <p className="m-0 font-medium">
                {fileName ? fileName : 'Klik atau drag file sertifikat ke sini'}
              </p>
              {!fileName && <p className="mt-[5px] text-[0.8rem] text-text-muted">Maksimal ukuran file: 10MB</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1 mb-6">
            <label className="text-sm font-semibold text-text-main">Catatan Hasil Kalibrasi</label>
            <textarea name="notes" value={calData.notes} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" placeholder="Tuliskan catatan atau rekomendasi dari teknisi"></textarea>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
            <Link to="/dashboard/calibration" className="bg-transparent text-text-main border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Batal</Link>
            <button type="submit" className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70" disabled={isLoading}>
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

export default EditCalibration;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Calendar, CheckCircle, AlertTriangle, Download, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import Toast from '../../components/Toast';

const Calibration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [calibrations, setCalibrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchCalibrations = async () => {
    try {
      const data = await api.get('/calibrations');
      setCalibrations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalibrations();
  }, []);

  const filteredCalibrations = calibrations.filter(cal => {
    const term = (searchTerm || '').toLowerCase();
    const idMatch = (cal.id || '').toLowerCase().includes(term);
    const assetMatch = (cal.assetId || '').toLowerCase().includes(term) || (cal.asset?.name || '').toLowerCase().includes(term);
    return idMatch || assetMatch;
  });

  const getStatus = (cal) => {
    if (cal.status === 'Lulus') return 'Aman';
    if (cal.status === 'Gagal') return 'Gagal Uji';
    
    const now = new Date();
    const nextDate = new Date(cal.nextCalibrationDate);
    if (nextDate < now) return 'Kadaluarsa';
    
    return 'Jatuh Tempo';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Belum diuji';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">Kalibrasi & Maintenance Rutin</h1>
        <Link to="/dashboard/calibration/add" className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70 justify-center w-full md:w-auto">
          <Plus size={18} /> Catat Kalibrasi Baru
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-custom-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between gap-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="relative w-full md:w-auto">
            <Search size={16} className="text-gray-500 dark:text-gray-400 absolute left-[10px] top-[10px]" />
            <input 
              type="text" 
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-custom-md w-full md:w-[250px] text-sm outline-none focus:border-orange-500 focus:shadow-[0_0_0_2px_rgba(249,115,22,0.2)] pl-8" 
              placeholder="Cari nama aset..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-500 dark:text-gray-400">
              <Loader2 size={36} className="spin text-orange-500" />
              <span>Memuat data kalibrasi...</span>
              <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
              `}</style>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">ID Kalibrasi</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Nama Aset Terkait</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Tgl Kalibrasi Terakhir</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Jadwal Berikutnya (1 Tahun)</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Status Notifikasi</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Sertifikat</th>
                </tr>
              </thead>
              <tbody>
                {filteredCalibrations.length > 0 ? filteredCalibrations.map(cal => {
                  const statusLabel = getStatus(cal);
                  return (
                    <tr key={cal.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle font-medium">{cal.id}</td>
                      <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">{cal.asset?.name || `Aset (${cal.assetId})`}</td>
                      <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">
                        <div className="flex items-center gap-[5px]">
                          <Calendar size={14} className="text-gray-500 dark:text-gray-400" />
                          {formatDate(cal.calibrationDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">
                        <div className="flex items-center gap-[5px]">
                          <Calendar size={14} className="text-orange-500" />
                          {formatDate(cal.nextCalibrationDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">
                        <span className={`px-3 py-1 rounded-[2rem] text-xs font-semibold inline-block ${
                          statusLabel === 'Aman' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {statusLabel === 'Aman' ? <CheckCircle size={12} className="mr-1"/> : <AlertTriangle size={12} className="mr-1"/>}
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">
                        {cal.certificateUrl ? (
                          <a 
                            href={`http://localhost:5000${cal.certificateUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-transparent text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-custom-md font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all no-underline inline-flex items-center gap-1 p-[0.2rem_0.5rem] text-[0.8rem]"
                          >
                            <Download size={14} /> {cal.certificateNumber || 'Unduh'}
                          </a>
                        ) : cal.certificateNumber ? (
                          <span className="text-[0.85rem] text-gray-500 dark:text-gray-400 font-medium">{cal.certificateNumber}</span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 text-[0.9rem]">Belum ada</span>
                        )}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td colSpan="6" className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 align-middle text-center p-8">
                      Tidak ada jadwal kalibrasi yang sesuai dengan pencarian "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calibration;

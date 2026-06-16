import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Calendar, CheckCircle, AlertTriangle, Download, Loader2, Edit2 } from 'lucide-react';
import { api } from '../../services/api';
import Toast from '../../components/Toast';

const STATUS_FILTERS = ['Semua', 'Aman', 'Jatuh Tempo', 'Kadaluarsa', 'Gagal Uji'];

const Calibration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
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

  const getStatus = (cal) => {
    if (cal.status === 'Lulus') return 'Aman';
    if (cal.status === 'Gagal') return 'Gagal Uji';
    const now = new Date();
    const nextDate = new Date(cal.nextCalibrationDate);
    if (nextDate < now) return 'Kadaluarsa';
    return 'Jatuh Tempo';
  };

  const filteredCalibrations = calibrations.filter(cal => {
    const term = (searchTerm || '').toLowerCase();
    const idMatch = (cal.id || '').toLowerCase().includes(term);
    const assetMatch = (cal.assetId || '').toLowerCase().includes(term) || (cal.asset?.name || '').toLowerCase().includes(term);
    if (!idMatch && !assetMatch) return false;
    if (statusFilter === 'Semua') return true;
    return getStatus(cal) === statusFilter;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Belum diuji';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
        <h1 className="text-xl md:text-2xl font-bold text-text-main">Kalibrasi & Maintenance Rutin</h1>
        <Link to="/dashboard/calibration/add" className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70 justify-center w-full md:w-auto">
          <Plus size={18} /> Catat Kalibrasi Baru
        </Link>
      </div>

      <div className="bg-surface rounded-xl shadow-custom-sm border border-border overflow-hidden flex flex-col">
        <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between gap-3 border-b border-border bg-gray-50 dark:bg-gray-800/50">
          <div className="relative w-full md:w-1/2">
            <Search size={16} className="text-text-muted absolute left-[10px] top-[10px]" />
            <input 
              type="text" 
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-custom-md w-full text-sm outline-none focus:border-orange-500 focus:shadow-[0_0_0_2px_rgba(249,115,22,0.2)] pl-8 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400" 
              placeholder="Cari nama aset..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-[2rem] text-xs font-semibold border transition-all ${
                  statusFilter === s
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-transparent text-text-muted border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-text-muted">
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
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">ID Kalibrasi</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Nama Aset Terkait</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Tgl Kalibrasi Terakhir</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Jadwal Berikutnya (1 Tahun)</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Status Notifikasi</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Sertifikat</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCalibrations.length > 0 ? filteredCalibrations.map(cal => {
                  const statusLabel = getStatus(cal);
                  return (
                    <tr key={cal.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle font-medium">{cal.id}</td>
                      <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">{cal.asset?.name || `Aset (${cal.assetId})`}</td>
                      <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">
                        <div className="flex items-center gap-[5px]">
                          <Calendar size={14} className="text-text-muted" />
                          {formatDate(cal.calibrationDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">
                        <div className="flex items-center gap-[5px]">
                          <Calendar size={14} className="text-orange-500" />
                          {formatDate(cal.nextCalibrationDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">
                        <span className={`px-3 py-1 rounded-[2rem] text-xs font-semibold inline-flex items-center gap-1 ${
                          statusLabel === 'Aman' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                          statusLabel === 'Jatuh Tempo' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          statusLabel === 'Kadaluarsa' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {statusLabel === 'Aman' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">
                        {cal.certificateUrl ? (
                          <a 
                            href={cal.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-transparent text-text-main border border-gray-200 dark:border-gray-600 rounded-custom-md font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all no-underline inline-flex items-center gap-1 p-[0.2rem_0.5rem] text-[0.8rem]"
                          >
                            <Download size={14} /> {cal.certificateNumber || 'Unduh'}
                          </a>
                        ) : cal.certificateNumber ? (
                          <span className="text-[0.85rem] text-text-muted font-medium">{cal.certificateNumber}</span>
                        ) : (
                          <span className="text-text-muted text-[0.9rem]">Belum ada</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">
                        <Link
                          to={`/dashboard/calibration/edit/${cal.id}`}
                          className="p-[0.4rem] rounded-custom-md text-text-muted transition-all inline-flex hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </Link>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td colSpan="7" className="px-6 py-4 text-sm border-b border-border text-text-muted align-middle text-center p-8">
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Search, Eye, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import Toast from '../../components/Toast';

const Repairs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [repairs, setRepairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchRepairs = async () => {
    try {
      const data = await api.get('/repairs');
      setRepairs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const handleCompleteRepair = async (id) => {
    try {
      await api.put(`/repairs/${id}`, { status: 'Selesai', notes: 'Perbaikan diselesaikan oleh Admin.' });
      setToastMsg(`Tiket ${id} ditandai selesai!`);
      setShowToast(true);
      fetchRepairs();
    } catch (err) {
      alert(`Gagal menyelesaikan perbaikan: ${err.message}`);
    }
  };

  const filteredRepairs = repairs.filter(rep => {
    const term = (searchTerm || '').toLowerCase();
    const idMatch = (rep.id || '').toLowerCase().includes(term);
    const assetMatch = (rep.assetId || '').toLowerCase().includes(term) || (rep.asset?.name || '').toLowerCase().includes(term);
    const reporterMatch = (rep.reporterName || '').toLowerCase().includes(term);
    return idMatch || assetMatch || reporterMatch;
  });

  const translateStatus = (status) => {
    if (status === 'Selesai' || status === 'Completed') return 'Selesai';
    if (status === 'Proses' || status === 'In Progress') return 'Dalam Pengerjaan';
    return 'Menunggu Teknisi';
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
        <h1 className="text-xl md:text-2xl font-bold text-text-main">Laporan Kerusakan & Perbaikan</h1>
        <Link to="/dashboard/repairs/add" className="bg-red-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-red-600 transition-colors disabled:opacity-70 justify-center w-full md:w-auto">
          <AlertTriangle size={18} /> Lapor Kerusakan Baru
        </Link>
      </div>

      <div className="bg-surface rounded-xl shadow-custom-sm border border-border overflow-hidden flex flex-col">
        <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between gap-3 border-b border-border bg-gray-50 dark:bg-gray-800/50">
          <div className="relative w-full md:w-auto">
            <Search size={16} className="text-text-muted absolute left-[10px] top-[10px]" />
            <input 
              type="text" 
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-custom-md w-full md:w-[250px] text-sm outline-none focus:border-orange-500 focus:shadow-[0_0_0_2px_rgba(249,115,22,0.2)]" 
              placeholder="Cari tiket perbaikan atau ID aset..." 
              style={{ paddingLeft: '2rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-text-muted">
              <Loader2 size={36} className="spin text-orange-500" />
              <span>Memuat data perbaikan...</span>
              <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
              `}</style>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">ID Tiket</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Aset Terkait</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Tanggal Lapor</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Pelapor</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Masalah</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Prioritas</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Status</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRepairs.length > 0 ? filteredRepairs.map(rep => (
                  <tr key={rep.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle" style={{ fontWeight: 500 }}>{rep.id}</td>
                    <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">{rep.assetId} ({rep.asset?.name || 'Aset'})</td>
                    <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">{new Date(rep.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">{rep.reporterName}</td>
                    <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">{rep.description}</td>
                    <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">
                      <span className={`px-3 py-1 rounded-[2rem] text-xs font-semibold inline-block ${
                        rep.status === 'Pending' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rep.status === 'Pending' ? 'Tinggi' : 'Sedang'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">
                      <span className={`px-3 py-1 rounded-[2rem] text-xs font-semibold inline-block ${
                        (rep.status === 'Selesai' || rep.status === 'Completed') ? 'bg-green-100 text-green-800' : 
                        (rep.status === 'Proses' || rep.status === 'In Progress') ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {translateStatus(rep.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">
                      <Link to={`/dashboard/assets/detail/${rep.assetId}`} className="p-[0.4rem] rounded-custom-md text-text-muted transition-all inline-flex mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary" title="Detail Aset"><Eye size={16} /></Link>
                      {(rep.status !== 'Selesai' && rep.status !== 'Completed') && (
                        <button className="p-[0.4rem] rounded-custom-md transition-all inline-flex mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-emerald-500 hover:text-emerald-600" title="Tandai Selesai" onClick={() => handleCompleteRepair(rep.id)}><CheckCircle size={16} /></button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="text-center text-text-muted" style={{ padding: '2rem' }}>
                      Tidak ada tiket perbaikan yang sesuai dengan pencarian "{searchTerm}".
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

export default Repairs;

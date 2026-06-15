import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Search, Eye, Check, X, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import Toast from '../../components/Toast';

const Mutation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mutations, setMutations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchMutations = async () => {
    try {
      const data = await api.get('/mutations');
      setMutations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMutations();
  }, []);

  const handleApproveMutation = async (id) => {
    try {
      await api.put(`/mutations/${id}`, { status: 'Approved' });
      setToastMsg(`Mutasi ${id} berhasil disetujui!`);
      setShowToast(true);
      fetchMutations();
    } catch (err) {
      alert(`Gagal menyetujui mutasi: ${err.message}`);
    }
  };

  const handleRejectMutation = async (id) => {
    try {
      await api.put(`/mutations/${id}`, { status: 'Rejected' });
      setToastMsg(`Mutasi ${id} berhasil ditolak.`);
      setShowToast(true);
      fetchMutations();
    } catch (err) {
      alert(`Gagal menolak mutasi: ${err.message}`);
    }
  };

  const filteredMutations = mutations.filter(mut => {
    const term = (searchTerm || '').toLowerCase();
    const idMatch = (mut.id || '').toLowerCase().includes(term);
    const assetMatch = (mut.assetId || '').toLowerCase().includes(term) || (mut.asset?.name || '').toLowerCase().includes(term);
    return idMatch || assetMatch;
  });

  const getStatusLabel = (status) => {
    if (status === 'Approved') return 'Selesai';
    if (status === 'Rejected') return 'Ditolak';
    if (status === 'Disetujui') return 'Selesai';
    if (status === 'Ditolak') return 'Ditolak';
    return 'Menunggu Persetujuan';
  };

  const getMutationType = (target) => {
    const term = (target || '').toLowerCase();
    if (term.includes('rsud') || term.includes('seberang') || term.includes('eksternal')) {
      return 'Eksternal';
    }
    return 'Internal';
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
        <h1 className="text-xl md:text-2xl font-bold text-text-main">Mutasi & Peminjaman Aset</h1>
        <Link to="/dashboard/mutation/add" className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70 justify-center w-full md:w-auto">
          <RefreshCw size={18} /> Ajukan Mutasi Baru
        </Link>
      </div>

      <div className="bg-surface rounded-xl shadow-custom-sm border border-border overflow-hidden flex flex-col">
        <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between gap-3 border-b border-border bg-gray-50 dark:bg-gray-800/50">
          <div className="relative w-full md:w-auto">
            <Search size={16} className="text-text-muted absolute left-[10px] top-[10px]" />
            <input 
              type="text" 
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-custom-md w-full md:w-[250px] text-sm outline-none focus:border-orange-500 focus:shadow-[0_0_0_2px_rgba(249,115,22,0.2)] pl-8" 
              placeholder="Cari ID mutasi atau aset..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-text-muted">
              <Loader2 size={36} className="spin text-orange-500" />
              <span>Memuat data mutasi...</span>
              <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
              `}</style>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">ID Mutasi</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Tipe</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Aset Terkait</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Lokasi Asal</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Lokasi Tujuan</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Tanggal Pengajuan</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Penanggung Jawab</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Status</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredMutations.length > 0 ? filteredMutations.map(mut => {
                  const mType = getMutationType(mut.targetLocation);
                  const statusLabel = getStatusLabel(mut.status);
                  return (
                    <tr key={mut.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle font-medium">{mut.id}</td>
                      <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">
                        <span className={`px-3 py-1 rounded-[2rem] text-xs font-semibold inline-block ${mType === 'Internal' ? 'bg-orange-50 text-orange-600' : 'bg-amber-100 text-amber-800'}`}>
                          {mType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">{mut.assetId} ({mut.asset?.name || 'Aset'})</td>
                      <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">{mut.sourceLocation}</td>
                      <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">{mut.targetLocation}</td>
                      <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">{new Date(mut.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">{mut.requesterName}</td>
                      <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">
                        <span className={`px-3 py-1 rounded-[2rem] text-xs font-semibold inline-block ${
                          (mut.status === 'Approved' || mut.status === 'Disetujui') ? 'bg-green-100 text-green-800' : 
                          (mut.status === 'Rejected' || mut.status === 'Ditolak') ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">
                        <Link to={`/dashboard/assets/detail/${mut.assetId}`} className="p-[0.4rem] rounded-custom-md text-text-muted transition-all inline-flex mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary" title="Detail Aset"><Eye size={16} /></Link>
                        {mut.status === 'Pending' && (
                          <>
                            <button className="p-[0.4rem] rounded-custom-md text-text-muted transition-all inline-flex mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary" title="Setujui Mutasi" onClick={() => handleApproveMutation(mut.id)}><Check size={16} className="text-emerald-500" /></button>
                            <button className="p-[0.4rem] rounded-custom-md text-text-muted transition-all inline-flex mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary" title="Tolak Mutasi" onClick={() => handleRejectMutation(mut.id)}><X size={16} className="text-red-500" /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td colSpan="9" className="px-6 py-4 text-sm border-b border-border text-text-muted align-middle text-center p-8">
                      Tidak ada data mutasi yang sesuai dengan pencarian "{searchTerm}".
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

export default Mutation;

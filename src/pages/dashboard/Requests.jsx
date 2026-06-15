import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Check, X, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import Toast from '../../components/Toast';
import Pagination from '../../components/Pagination';

const Requests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchRequests = async () => {
    try {
      const data = await api.get('/requests');
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const endpoint = status === 'Approved' ? `/requests/${id}/approve` : `/requests/${id}/reject`;
      await api.put(endpoint);
      setToastMsg(`Pengajuan ${id} berhasil ${status === 'Approved' ? 'disetujui' : 'ditolak'}.`);
      setShowToast(true);
      fetchRequests();
    } catch (err) {
      alert(`Gagal merubah status: ${err.message}`);
    }
  };

  const filteredRequests = requests.filter(req => {
    const term = (searchTerm || '').toLowerCase();
    const idMatch = (req.id || '').toLowerCase().includes(term);
    const unitMatch = (req.department || '').toLowerCase().includes(term);
    const itemMatch = (req.assetName || '').toLowerCase().includes(term);
    return idMatch || unitMatch || itemMatch;
  });

  const totalItems = filteredRequests.length;
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const translateStatus = (status) => {
    if (status === 'Disetujui' || status === 'Approved') return 'Disetujui';
    if (status === 'Ditolak' || status === 'Rejected') return 'Ditolak';
    return 'Pending';
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
        <h1 className="text-xl md:text-2xl font-bold text-text-main">Permintaan Aset Baru</h1>
        <Link to="/dashboard/requests/add" className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70 justify-center w-full md:w-auto">
          <Plus size={18} /> Buat Pengajuan Baru
        </Link>
      </div>

      <div className="bg-surface rounded-xl shadow-custom-sm border border-border overflow-hidden flex flex-col">
        <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between gap-3 border-b border-border bg-gray-50 dark:bg-gray-800/50">
          <div className="relative w-full md:w-auto">
            <Search size={16} className="text-text-muted absolute left-[10px] top-[10px]" />
            <input 
              type="text" 
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-custom-md w-full md:w-[250px] text-sm outline-none focus:border-orange-500 focus:shadow-[0_0_0_2px_rgba(249,115,22,0.2)]" 
              placeholder="Cari ID pengajuan atau unit..." 
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
              <span>Memuat data permintaan...</span>
              <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
              `}</style>
            </div>
          ) : filteredRequests.length > 0 ? (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">ID Pengajuan</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Unit Kerja</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Nama Barang</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Jumlah</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Alasan / Catatan</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Status</th>
                  <th className="bg-surface px-6 py-4 font-semibold text-sm text-text-muted border-b border-border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle" style={{ fontWeight: 500 }}>{req.id}</td>
                    <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">{req.department}</td>
                    <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">{req.assetName}</td>
                    <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">{req.qty}</td>
                    <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">{req.notes || '-'}</td>
                    <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">
                      <span className={`px-3 py-1 rounded-[2rem] text-xs font-semibold inline-block ${
                        (req.status === 'Disetujui' || req.status === 'Approved') ? 'bg-green-100 text-green-800' : 
                        (req.status === 'Ditolak' || req.status === 'Rejected') ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {translateStatus(req.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm border-b border-border text-text-main align-middle">
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {req.status === 'Pending' ? (
                          <>
                            <button 
                              className="p-[0.4rem] rounded-custom-md transition-all inline-flex mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-emerald-500 hover:text-emerald-600" 
                              title="Setujui Pengajuan" 
                              onClick={() => handleUpdateStatus(req.id, 'Approved')}
                            >
                              <Check size={18} />
                            </button>
                            <button 
                              className="p-[0.4rem] rounded-custom-md transition-all inline-flex mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 hover:text-red-600" 
                              title="Tolak Pengajuan" 
                              onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-text-muted">Tindakan Selesai</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-text-muted">
              <div className="mb-4">
                <Search size={48} className="mx-auto text-gray-200 dark:text-gray-700" />
              </div>
              <h3 className="text-lg mb-2 text-text-main">Data tidak ditemukan</h3>
              <p>Maaf, kami tidak dapat menemukan pengajuan dengan kata kunci "{searchTerm}".</p>
            </div>
          )}
        </div>
        {!isLoading && filteredRequests.length > 0 && (
          <Pagination 
            totalItems={totalItems} 
            itemsPerPage={itemsPerPage} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
          />
        )}
      </div>
    </div>
  );
};

export default Requests;

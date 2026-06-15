import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, QrCode, Eye, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import Toast from '../../components/Toast';
import Pagination from '../../components/Pagination';

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

const Assets = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const querySearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [prevQuerySearch, setPrevQuerySearch] = useState(querySearch);
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (querySearch !== prevQuerySearch) {
    setSearchTerm(querySearch);
    setPrevQuerySearch(querySearch);
  }

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const data = await api.get(`/assets?search=${searchTerm}`);
        setAssets(data);
        setCurrentPage(1);
      } catch (err) {
        console.error('Failed to fetch assets:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchAssets();
      if (searchTerm) {
        setSearchParams({ search: searchTerm }, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setSearchParams]);

  const totalItems = assets.length;
  const paginatedAssets = assets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = (asset) => {
    setDeleteTarget(asset);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/assets/${deleteTarget.id}`);
      setAssets(prev => prev.filter(a => a.id !== deleteTarget.id));
      const deletedName = deleteTarget.name;
      setDeleteTarget(null);
      setToastMsg(`Aset "${deletedName}" berhasil dihapus.`);
      setShowToast(true);
    } catch (err) {
      alert(`Gagal menghapus aset: ${err.message}`);
    }
  };

  const handlePrintQR = (asset) => {
    setToastMsg(`QR Code untuk ${asset.name} (${asset.id}) sedang disiapkan untuk dicetak...`);
    setShowToast(true);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 z-[1000] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-[20px] p-8 max-w-[420px] w-[90%] shadow-[0_25px_50px_rgba(0,0,0,0.15)] text-center border border-gray-100 dark:border-gray-700">
            <div className="w-[60px] h-[60px] rounded-full bg-red-100 dark:bg-red-950/20 flex items-center justify-center mx-auto mb-6">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="m-0 mb-2 text-[1.3rem] text-gray-800 dark:text-gray-100 font-bold">Hapus Aset?</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Anda yakin ingin menghapus <strong>"{deleteTarget.name}"</strong> ({deleteTarget.id})? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-2.5 justify-center">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 bg-transparent text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Batal</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-red-600 transition-colors">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">Data Aset Medis</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Link to="/dashboard/assets/add?type=baru" className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70 justify-center sm:justify-start">
            <Plus size={18} /> Tambah Barang Baru
          </Link>
          <Link to="/dashboard/assets/add?type=lama" className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70 justify-center sm:justify-start">
            <Plus size={18} /> Tambah Barang Lama
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-custom-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between gap-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="relative">
            <Search size={16} className="absolute left-[10px] top-[10px] text-slate-400" />
            <input
              type="text"
              className="pl-8 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-custom-md w-full md:w-[250px] text-sm outline-none focus:border-orange-500 focus:shadow-[0_0_0_2px_rgba(249,115,22,0.2)]"
              placeholder="Cari nama aset atau ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-500 dark:text-gray-400">
              <Loader2 size={36} className="animate-spin text-orange-500" />
              <span>Memuat data aset...</span>
            </div>
          ) : assets.length > 0 ? (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">ID Aset</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Nama Aset</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Lokasi</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">No. Seri</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Harga</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Status</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Kondisi</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle font-medium">
                      <Link to={`/dashboard/assets/detail/${asset.id}`} className="text-orange-500 hover:underline">{asset.id}</Link>
                    </td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">
                      <Link to={`/dashboard/assets/detail/${asset.id}`} className="text-inherit hover:underline font-semibold">{asset.name}</Link>
                    </td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">{asset.room}</td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">{asset.serialNumber}</td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">{formatRupiah(asset.price)}</td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">
                      <span className={`px-3 py-1 rounded-[2rem] text-xs font-semibold inline-block ${asset.status === 'Tersedia' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {asset.status === 'Dipinjam' ? 'Dipinjam RS Lain' : asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">
                      <span className={`px-3 py-1 rounded-[2rem] text-xs font-semibold inline-block ${asset.condition === 'Baik' ? 'bg-green-100 text-green-800' :
                          asset.condition === 'Rusak' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                        {asset.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">
                      <Link to={`/dashboard/assets/detail/${asset.id}`} className="p-[0.4rem] rounded-custom-md text-gray-500 dark:text-gray-400 transition-all inline-flex mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-500 dark:hover:text-orange-400" title="Detail" aria-label={`Lihat detail aset ${asset.name}`}><Eye size={16} /></Link>
                      <Link to={`/dashboard/assets/edit/${asset.id}`} className="p-[0.4rem] rounded-custom-md text-gray-500 dark:text-gray-400 transition-all inline-flex mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-500 dark:hover:text-orange-400" title="Edit" aria-label={`Edit aset ${asset.name}`}><Edit2 size={16} /></Link>
                      <button className="p-[0.4rem] rounded-custom-md text-gray-500 dark:text-gray-400 transition-all inline-flex mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-500 dark:hover:text-orange-400" title="Cetak QR" aria-label={`Cetak QR code aset ${asset.name}`} onClick={() => handlePrintQR(asset)}><QrCode size={16} /></button>
                      <button className="p-[0.4rem] rounded-custom-md text-gray-500 dark:text-gray-400 transition-all inline-flex mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-500 dark:hover:text-orange-400" title="Hapus" aria-label={`Hapus aset ${asset.name}`} onClick={() => handleDelete(asset)}><Trash2 size={16} className="text-red-500" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              <div className="mb-4 flex justify-center">
                <Search size={48} className="text-gray-200 dark:text-gray-700" />
              </div>
              <h3 className="text-[1.2rem] mb-2 text-slate-800 dark:text-slate-100 font-bold">Data tidak ditemukan</h3>
              <p>Maaf, kami tidak dapat menemukan aset dengan kata kunci "{searchTerm}".</p>
            </div>
          )}
          {!isLoading && assets.length > 0 && (
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Assets;

import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, CheckCircle, Image as ImageIcon, AlertTriangle, MapPin, Wrench, FileText, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import Toast from '../../components/Toast';

const TechnicianRepairs = () => {
  const [view, setView] = useState('list');
  const [repairs, setRepairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState('');
  const [jobStatus, setJobStatus] = useState('Completed');
  const [photoFile, setPhotoFile] = useState(null);

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

  const openDetail = async (item) => {
    setSelectedItem(item);
    setView('detail');

    if (item.status === 'Pending') {
      try {
        const updated = await api.put(`/repairs/${item.id}`, { status: 'In Progress' });
        setRepairs(prev => prev.map(r => r.id === item.id ? { ...r, status: 'Proses' } : r));
        setSelectedItem(prev => ({ ...prev, status: 'Proses' }));
      } catch (err) {
        console.error('Failed to mark task as in progress:', err);
      }
    }
  };

  const handleCompleteTask = async () => {
    if (!selectedItem) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('status', 'Selesai');
      formData.append('notes', notes || (jobStatus === 'Completed' ? 'Perbaikan selesai dilakukan oleh teknisi.' : 'Perbaikan gagal, aset tidak dapat diperbaiki.'));
      formData.append('assetCondition', jobStatus === 'Completed' ? 'Baik' : 'Rusak');
      if (photoFile) {
        formData.append('image', photoFile);
      }

      await api.put(`/repairs/${selectedItem.id}`, formData, true);

      setToastMsg(jobStatus === 'Completed'
        ? `Tugas perbaikan ${selectedItem.id} berhasil diselesaikan!`
        : `Tugas perbaikan ${selectedItem.id} selesai dengan kondisi gagal.`
      );
      setShowToast(true);

      setView('list');
      setNotes('');
      setPhotoFile(null);
      setSelectedItem(null);
      fetchRepairs();
    } catch (err) {
      alert(`Gagal menyelesaikan tugas: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    if (status === 'Pending') return 'Tertunda';
    if (status === 'Proses' || status === 'In Progress') return 'Maintenance';
    return 'Selesai';
  };

  const activeTasks = repairs.filter(r => r.status !== 'Selesai' && r.status !== 'Completed');

  const filteredTasks = activeTasks.filter(item => {
    const statusLabel = getStatusLabel(item.status);

    if (activeFilter !== 'Semua') {
      if (activeFilter === 'Mendesak' && item.status !== 'Pending') return false;
      if (activeFilter === 'Tertunda' && item.status !== 'Pending') return false;
      if (activeFilter === 'Maintenance' && item.status !== 'Proses' && item.status !== 'In Progress') return false;
    }

    const term = (searchTerm || '').toLowerCase();
    if (!term) return true;

    return (
      (item.asset?.name || '').toLowerCase().includes(term) ||
      (item.assetId || '').toLowerCase().includes(term) ||
      (item.id || '').toLowerCase().includes(term)
    );
  });

  const renderList = () => (
    <div className="animate-[fadeIn_0.3s_ease-in-out]">
      <h2 className="m-0 mb-1 text-[1.5rem] font-extrabold text-slate-900 dark:text-white tracking-tight">Daftar Tugas</h2>
      <p className="m-0 mb-6 text-slate-500 dark:text-slate-400 text-sm">{filteredTasks.length} perbaikan membutuhkan atensi.</p>

      <div className="flex gap-[10px] overflow-x-auto pb-2 mb-4 scrollbar-hide md:flex-wrap md:overflow-visible">
        {['Semua', 'Mendesak', 'Tertunda', 'Maintenance'].map(filter => (
          <button
            key={filter}
            className={`border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-4 py-2 rounded-[20px] text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${activeFilter === filter ? 'bg-orange-500 dark:bg-orange-500 text-white border-orange-500 shadow-[0_4px_10px_rgba(249,115,22,0.2)] hover:bg-orange-600 dark:hover:bg-orange-600' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-colors duration-300 focus-within:border-orange-500 focus-within:shadow-[0_4px_15px_rgba(249,115,22,0.1)]">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari ID tiket atau aset..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none outline-none p-3 w-full text-sm bg-transparent font-inherit text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      <div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4 text-slate-400 dark:text-slate-500">
            <Loader2 size={32} className="animate-spin text-orange-500" />
            <span>Memuat tugas...</span>
          </div>
        ) : filteredTasks.length > 0 ? filteredTasks.map((item, idx) => (
          <div key={idx} className={`bg-white dark:bg-slate-800 rounded-[20px] p-6 mb-[1.2rem] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.2)] relative overflow-hidden transition-transform duration-200 before:content-[''] before:absolute before:top-0 before:left-0 before:bottom-0 before:w-[6px] before:bg-orange-500 ${item.status === 'In Progress' ? 'before:bg-slate-400 dark:before:bg-slate-500' : ''}`}>

            <div className="flex gap-3 mb-3">
              {item.asset?.img && (
                <img
                  src={item.asset.img}
                  alt={item.asset.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
              )}
              <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-[10px] py-[4px] rounded-xl text-xs font-bold self-start">
                <MapPin size={12} color="#f97316" /> {item.asset?.room || 'Gudang Alat'}
              </div>
            </div>

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-extrabold m-0 mb-[6px] text-slate-900 dark:text-white">{item.asset?.name || 'Aset'}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 m-0 font-medium">ID: {item.assetId} (Tiket: {item.id})</p>
              </div>
              <span className={`text-[0.7rem] px-3 py-[6px] rounded-[20px] font-extrabold uppercase tracking-[0.5px] ${(item.status === 'Proses' || item.status === 'In Progress') ? 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600' : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800'}`}>
                {getStatusLabel(item.status)}
              </span>
            </div>

            <div className="flex gap-2 text-slate-500 dark:text-slate-400 text-sm mb-6 items-center">
              <Wrench size={14} /> <span>{item.description}</span>
            </div>

            {item.status === 'In Progress' ? (
              <button className="w-full p-4 rounded-2xl font-bold text-base border-none cursor-pointer text-center transition-all duration-200 active:scale-[0.98] font-inherit bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" onClick={() => openDetail(item)}>Detail Maintenance</button>
            ) : (
              <button className="w-full p-4 rounded-2xl font-bold text-base border-none cursor-pointer text-center transition-all duration-200 active:scale-[0.98] font-inherit bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)]" onClick={() => openDetail(item)}>Mulai Perbaikan</button>
            )}
          </div>
        )) : (
          <div className="text-center py-12 px-4 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600">
            <Search size={32} className="mb-2 opacity-50 mx-auto" />
            <p className="m-0 font-semibold">Tidak ada tugas ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderDetail = () => (
    <div className="animate-[slideInRight_0.3s_ease-in-out]">
      <button
        onClick={() => setView('list')}
        className="flex items-center gap-[5px] bg-none border-none text-orange-500 font-bold p-0 mb-6 cursor-pointer text-base"
      >
        <ChevronLeft size={20} /> Kembali
      </button>

      <div className="text-center mb-6">
        <img
          src={selectedItem.asset?.img || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400'}
          alt={selectedItem.asset?.name}
          className="w-full h-[220px] object-cover rounded-3xl mb-4 shadow-[0_10px_25px_rgba(0,0,0,0.05)]"
        />
        {selectedItem.photo && (
          <div className="mt-2">
            <p className="text-xs font-bold mb-2 text-slate-500 dark:text-slate-400">FOTO KERUSAKAN</p>
            <img
              src={selectedItem.photo}
              alt="Foto kerusakan"
              className="w-full h-[220px] object-cover rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.05)]"
            />
          </div>
        )}
      </div>

      <div className="inline-flex items-center gap-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-[14px] py-[6px] rounded-xl text-xs font-bold mb-2">
        <MapPin size={14} /> {selectedItem.asset?.room || 'Gudang Alat'}
      </div>

      <h2 className="mt-2 mb-6 text-[1.8rem] font-extrabold text-slate-900 dark:text-white tracking-tight">{selectedItem.asset?.name || 'Aset'}</h2>

      <div className="bg-white dark:bg-slate-800 rounded-[20px] shadow-card mb-[1.2rem] relative overflow-hidden border border-white/80 dark:border-slate-700 transition-all duration-300 active:scale-[0.98] p-5">
        <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-3">
          <div>
            <p className="text-xs font-bold m-0 mb-1 text-slate-500 dark:text-slate-400">ID TIKET</p>
            <p className="text-sm text-slate-900 dark:text-white m-0 font-bold">{selectedItem.id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold m-0 mb-1 text-slate-500 dark:text-slate-400">PELAPOR</p>
            <p className="text-sm text-slate-900 dark:text-white m-0 font-bold">{selectedItem.reporterName}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold m-0 mb-1 text-slate-500 dark:text-slate-400">KELUHAN / MASALAH</p>
          <p className="text-sm text-slate-900 dark:text-slate-200 m-0 font-medium">"{selectedItem.description}"</p>
        </div>
      </div>

      <button className="w-full p-4 rounded-2xl font-bold text-base border-none cursor-pointer text-center transition-all duration-200 active:scale-[0.98] font-inherit flex justify-center items-center gap-2 mb-4 border-2 border-dashed border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" onClick={() => setView('note')}>
        <FileText size={20} /> Isi Laporan & Selesaikan
      </button>
    </div>
  );

  const renderNote = () => (
    <div className="animate-[slideInRight_0.3s_ease-in-out] pb-20">
      <button
        onClick={() => setView('detail')}
        className="flex items-center gap-[5px] bg-none border-none text-slate-500 dark:text-slate-400 font-bold p-0 mb-6 cursor-pointer text-base"
      >
        <ChevronLeft size={20} /> Batal
      </button>

      <h2 className="m-0 mb-2 text-[1.5rem] font-extrabold text-slate-900 dark:text-white">Laporan Perbaikan</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm m-0 mb-8">{selectedItem.asset?.name} - {selectedItem.assetId}</p>

      <div className="flex flex-col gap-6">

        <div>
          <label className="text-xs font-extrabold block mb-4 text-slate-900 dark:text-white">STATUS PEKERJAAN</label>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="status"
                className="hidden"
                value="Completed"
                checked={jobStatus === 'Completed'}
                onChange={() => setJobStatus('Completed')}
              />
              <div className={`border-2 rounded-2xl p-4 text-center transition-all duration-200 h-full flex flex-col items-center justify-center gap-2 ${jobStatus === 'Completed' ? 'bg-green-50 dark:bg-green-900/30 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'}`}>
                <CheckCircle size={28} />
                <span className="font-bold text-sm">Berhasil</span>
              </div>
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="status"
                className="hidden"
                value="Rejected"
                checked={jobStatus === 'Rejected'}
                onChange={() => setJobStatus('Rejected')}
              />
              <div className={`border-2 rounded-2xl p-4 text-center transition-all duration-200 h-full flex flex-col items-center justify-center gap-2 ${jobStatus === 'Rejected' ? 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400' : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'}`}>
                <AlertTriangle size={28} />
                <span className="font-bold text-sm">Gagal</span>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="text-xs font-extrabold block mb-2 text-slate-900 dark:text-white">CATATAN TINDAKAN / PERBAIKAN</label>
          <textarea
            className="w-full p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-inherit text-sm text-slate-900 dark:text-white transition-colors duration-300 focus:border-orange-500 focus:outline-none focus:bg-white dark:focus:bg-slate-700 focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)] h-[100px] resize-none placeholder:text-slate-400"
            placeholder="Contoh: Mengganti kapasitor inverter layar..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="text-xs font-extrabold block mb-2 text-slate-900 dark:text-white">FOTO BUKTI SELESAI (OPSIONAL)</label>
          <label className="w-full h-[120px] bg-white dark:bg-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-300 border-2 border-dashed border-slate-300 dark:border-slate-500 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setPhotoFile(file);
              }}
            />
            {photoFile ? (
              <>
                <CheckCircle size={24} className="mb-1 text-green-500" />
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">{photoFile.name}</span>
              </>
            ) : (
              <>
                <ImageIcon size={36} className="mb-2" />
                <span className="text-sm font-semibold">Tap untuk ambil foto</span>
              </>
            )}
          </label>
          {photoFile && (
            <button
              type="button"
              className="text-xs text-red-500 mt-1 bg-transparent border-none cursor-pointer"
              onClick={() => setPhotoFile(null)}
            >
              Hapus foto
            </button>
          )}
        </div>
      </div>

      <button
        onClick={handleCompleteTask}
        disabled={isLoading}
        className="w-full p-4 rounded-2xl font-bold text-base border-none cursor-pointer text-center transition-all duration-200 active:scale-[0.98] font-inherit bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
      >
        {isLoading ? (
          <><Loader2 size={20} className="animate-spin" /> Mengirim...</>
        ) : (
          <><CheckCircle size={20} /> Kirim Laporan</>
        )}
      </button>
    </div>
  );

  return (
    <>
      {showToast && <Toast message={toastMsg || "Foto terlampir."} onClose={() => setShowToast(false)} />}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
      {view === 'list' && renderList()}
      {view === 'detail' && renderDetail()}
      {view === 'note' && renderNote()}
    </>
  );
};

export default TechnicianRepairs;

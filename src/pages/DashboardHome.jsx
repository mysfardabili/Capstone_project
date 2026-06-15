import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, AlertTriangle, ClipboardList, RefreshCw, Clock, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import Toast from '../components/Toast';

const DashboardHome = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get('/dashboard/summary');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard summary:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleActionClick = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
  };

  const handleApprove = async (item) => {
    try {
      if (item.type === 'request') {
        await api.put(`/requests/${item.id}/approve`);
        setToastMsg(`Pengajuan "${item.title}" berhasil disetujui.`);
      } else {
        await api.put(`/mutations/${item.id}`, { status: 'Approved' });
        setToastMsg(`Mutasi "${item.title}" berhasil disetujui.`);
      }
      setShowToast(true);
      const data = await api.get('/dashboard/summary');
      setStats(data);
    } catch (err) {
      alert(`Gagal menyetujui: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 size={40} className="animate-spin text-orange-500" />
        <span className="text-gray-500 dark:text-gray-400">Memuat ringkasan dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        <h3>Gagal Memuat Dashboard</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="bg-primary text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-primary-dark transition-colors duration-200 my-4 mx-auto block">Segarkan Halaman</button>
      </div>
    );
  }

  const summary = stats?.summary || { totalAssets: 0, activeRepairs: 0, pendingRequests: 0, mutationsThisMonth: 0 };
  const cond = stats?.conditionDistribution || { baik: 0, perbaikan: 0, rusak: 0 };
  const roomStats = stats?.roomDistribution || [];
  const upcomingCalibrations = stats?.upcomingCalibrations || [];
  const approvalsList = [
    ...(stats?.pendingApprovals?.requests || []),
    ...(stats?.pendingApprovals?.mutations || []),
  ];
  const recentActivities = stats?.recentActivities || [];

  const condTotal = cond.baik + cond.perbaikan + cond.rusak;
  const baikPct = condTotal > 0 ? Math.round((cond.baik / condTotal) * 100) : 0;
  const perbaikanPct = condTotal > 0 ? Math.round((cond.perbaikan / condTotal) * 100) : 0;
  const rusakPct = condTotal > 0 ? Math.round((cond.rusak / condTotal) * 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
      
      <section className="bg-gradient-to-r from-orange-600 to-orange-900 rounded-custom-lg p-10 text-white flex justify-between items-center relative overflow-hidden shadow-custom-md max-md:p-6">
        <div className="max-w-[60%] z-10 max-md:max-w-full">
          <h2 className="text-4xl font-bold mb-2 max-md:text-2xl">Selamat Datang, Admin</h2>
          <p className="text-base text-slate-100 mb-6">Kelola dan pantau seluruh aset rumah sakit secara efektif, cepat, dan terintegrasi.</p>
          <button className="bg-white text-orange-600 px-6 py-[0.6rem] rounded-[2rem] font-semibold text-sm hover:bg-orange-50 hover:-translate-y-[2px] transition-all duration-200 inline-block" onClick={() => handleActionClick("Menyiapkan unduhan Laporan Bulanan...")}>Lihat Laporan Bulanan</button>
        </div>
        <img src="/doctor-hero.png" alt="Doctor" className="absolute right-8 bottom-0 h-[120%] z-0 pointer-events-none max-md:opacity-15 max-md:-right-8" />
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/dashboard/assets/add" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-custom-md p-4 flex items-center justify-center gap-3 font-semibold text-gray-800 dark:text-gray-100 transition-all shadow-custom-sm no-underline hover:-translate-y-[2px] hover:shadow-custom-md hover:border-orange-500 hover:text-orange-600">
          <div className="bg-orange-50 text-orange-500 p-2 rounded-custom-md flex"><Package size={20} /></div>
          Tambah Aset
        </Link>
        <Link to="/dashboard/repairs/add" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-custom-md p-4 flex items-center justify-center gap-3 font-semibold text-gray-800 dark:text-gray-100 transition-all shadow-custom-sm no-underline hover:-translate-y-[2px] hover:shadow-custom-md hover:border-orange-500 hover:text-orange-600">
          <div className="bg-orange-50 text-orange-500 p-2 rounded-custom-md flex"><AlertTriangle size={20} /></div>
          Lapor Kerusakan
        </Link>
        <Link to="/dashboard/mutation/add" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-custom-md p-4 flex items-center justify-center gap-3 font-semibold text-gray-800 dark:text-gray-100 transition-all shadow-custom-sm no-underline hover:-translate-y-[2px] hover:shadow-custom-md hover:border-orange-500 hover:text-orange-600">
          <div className="bg-orange-50 text-orange-500 p-2 rounded-custom-md flex"><RefreshCw size={20} /></div>
          Ajukan Mutasi
        </Link>
        <Link to="/dashboard/calibration/add" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-custom-md p-4 flex items-center justify-center gap-3 font-semibold text-gray-800 dark:text-gray-100 transition-all shadow-custom-sm no-underline hover:-translate-y-[2px] hover:shadow-custom-md hover:border-orange-500 hover:text-orange-600">
          <div className="bg-green-100 text-green-500 dark:bg-green-900/20 dark:text-green-400 p-2 rounded-custom-md flex"><Clock size={20} /></div>
          Jadwal Kalibrasi
        </Link>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-custom-lg p-6 flex items-center gap-4 border border-gray-200 dark:border-gray-700 shadow-custom-sm hover:-translate-y-[3px] hover:shadow-custom-md transition-all duration-200">
          <div className="bg-blue-100 text-indigo-600 dark:bg-blue-900/20 dark:text-indigo-400 w-12 h-12 rounded-custom-md flex items-center justify-center shrink-0">
            <Package size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Aset</span>
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{summary.totalAssets}</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-custom-lg p-6 flex items-center gap-4 border border-gray-200 dark:border-gray-700 shadow-custom-sm hover:-translate-y-[3px] hover:shadow-custom-md transition-all duration-200">
          <div className="bg-red-100 text-red-500 dark:bg-red-900/20 dark:text-red-400 w-12 h-12 rounded-custom-md flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Perbaikan Aktif</span>
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{summary.activeRepairs}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-custom-lg p-6 flex items-center gap-4 border border-gray-200 dark:border-gray-700 shadow-custom-sm hover:-translate-y-[3px] hover:shadow-custom-md transition-all duration-200">
          <div className="bg-amber-100 text-amber-500 dark:bg-amber-900/20 dark:text-amber-400 w-12 h-12 rounded-custom-md flex items-center justify-center shrink-0">
            <ClipboardList size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Permintaan Tertunda</span>
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{summary.pendingRequests}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-custom-lg p-6 flex items-center gap-4 border border-gray-200 dark:border-gray-700 shadow-custom-sm hover:-translate-y-[3px] hover:shadow-custom-md transition-all duration-200">
          <div className="bg-green-100 text-green-500 dark:bg-green-900/20 dark:text-green-400 w-12 h-12 rounded-custom-md flex items-center justify-center shrink-0">
            <RefreshCw size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Mutasi Bulan Ini</span>
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{summary.mutationsThisMonth}</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white dark:bg-gray-800 rounded-custom-lg p-6 border border-gray-200 dark:border-gray-700 shadow-custom-sm">
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6 flex justify-between items-center">
            <span>Kondisi Aset Saat Ini</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1rem 0' }}>
            <div style={{ width: '130px', height: '130px', position: 'relative' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#fee2e2" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray={`${perbaikanPct}, 100`} />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${baikPct}, 100`} strokeDashoffset={`${-perbaikanPct}`} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{condTotal}</span>
                <span className="text-[0.7rem] text-gray-500 dark:text-gray-400 block">Total</span>
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className="text-[0.85rem] text-gray-500 dark:text-gray-400 font-medium"><span style={{ color: '#10b981' }}>●</span> Baik ({baikPct}%)</span>
                  <span className="text-[0.85rem] text-gray-800 dark:text-gray-100 font-semibold">{cond.baik}</span>
                </div>
                <div className="w-full h-[6px] bg-gray-200 dark:bg-gray-700 rounded-[4px]">
                  <div style={{ width: `${baikPct}%`, height: '100%', background: '#10b981', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className="text-[0.85rem] text-gray-500 dark:text-gray-400 font-medium"><span style={{ color: '#f59e0b' }}>●</span> Perbaikan ({perbaikanPct}%)</span>
                  <span className="text-[0.85rem] text-gray-800 dark:text-gray-100 font-semibold">{cond.perbaikan}</span>
                </div>
                <div className="w-full h-[6px] bg-gray-200 dark:bg-gray-700 rounded-[4px]">
                  <div style={{ width: `${perbaikanPct}%`, height: '100%', background: '#f59e0b', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className="text-[0.85rem] text-gray-500 dark:text-gray-400 font-medium"><span style={{ color: '#ef4444' }}>●</span> Rusak ({rusakPct}%)</span>
                  <span className="text-[0.85rem] text-gray-800 dark:text-gray-100 font-semibold">{cond.rusak}</span>
                </div>
                <div className="w-full h-[6px] bg-gray-200 dark:bg-gray-700 rounded-[4px]">
                  <div style={{ width: `${rusakPct}%`, height: '100%', background: '#ef4444', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-custom-lg p-6 border border-gray-200 dark:border-gray-700 shadow-custom-sm">
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6 flex justify-between items-center">
            <span>Aktivitas Terbaru</span>
            <Link to="/dashboard/mutation" className="text-sm text-orange-500 font-medium no-underline">Lihat Semua</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((act, index) => (
                <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0" key={index}>
                  {act.type === 'repair' ? (
                    <AlertTriangle className="mt-1 text-orange-500" size={18} style={{ color: '#ef4444' }} />
                  ) : (
                    <RefreshCw className="mt-1 text-orange-500" size={18} />
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">{act.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{act.description}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> 
                      {new Date(act.date).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center p-8">Tidak ada aktivitas terbaru.</div>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        
        <div className="bg-white dark:bg-gray-800 rounded-custom-lg p-6 border border-gray-200 dark:border-gray-700 shadow-custom-sm">
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6 flex justify-between items-center">
            <span>Kalibrasi Mendekat</span>
            <Link to="/dashboard/calibration" className="text-sm text-orange-500 font-medium no-underline">Kelola</Link>
          </div>
          <div className="flex flex-col gap-4">
            {upcomingCalibrations.length > 0 ? (
              upcomingCalibrations.map((cal, index) => {
                const isUrgent = cal.daysLeft <= 3;
                const urgentBg = isUrgent ? 'bg-red-100 dark:bg-red-900/20' : 'bg-amber-100 dark:bg-amber-900/20';
                const urgentColor = isUrgent ? 'text-red-500 dark:text-red-400' : 'text-amber-500 dark:text-amber-400';
                return (
                  <div 
                    className={`flex items-start gap-2 p-3 rounded-[0.5rem] items-center ${urgentBg} border border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0`}
                    key={index}
                    style={{ gap: '0.5rem' }}
                  >
                    {isUrgent ? (
                      <AlertTriangle size={20} className="text-red-500 dark:text-red-400 shrink-0" />
                    ) : (
                      <Clock size={20} className="text-amber-500 dark:text-amber-400 shrink-0" />
                    )}
                    <div>
                      <h4 className={`text-sm font-semibold mb-1 ${urgentColor}`} style={{ margin: 0 }}>{cal.assetName}</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {cal.daysLeft < 0 
                          ? `Terlewat ${Math.abs(cal.daysLeft)} hari yang lalu`
                          : cal.daysLeft === 0 
                            ? 'Jatuh tempo Hari ini!' 
                            : `Jatuh tempo: ${cal.daysLeft} hari lagi`
                        }
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center p-6">Aman. Semua kalibrasi terpenuhi.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-custom-lg p-6 border border-gray-200 dark:border-gray-700 shadow-custom-sm">
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6 flex justify-between items-center">
            <span>Menunggu Persetujuan</span>
            <Link to="/dashboard/requests" className="text-sm text-orange-500 font-medium no-underline">Lihat</Link>
          </div>
          <div>
            {approvalsList.length > 0 ? (
              approvalsList.map((item, index) => (
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-custom-md mb-2" key={index}>
                  <div>
                    <h4 className="text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</p>
                  </div>
                  <div className="bg-emerald-500 text-white rounded-custom-md p-[0.4rem] flex cursor-pointer hover:bg-emerald-600 transition-colors" title="Setujui Pengajuan" onClick={() => handleApprove(item)}>
                    {item.type === 'request' ? <Package size={16} /> : <RefreshCw size={16} />}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center p-6">Tidak ada pengajuan tertunda.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-custom-lg p-6 border border-gray-200 dark:border-gray-700 shadow-custom-sm">
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6 flex justify-between items-center">
            <span>Aset per Ruangan</span>
          </div>
          <div>
            {roomStats.length > 0 ? (
              roomStats.map((item, index) => {
                const maxCount = Math.max(...roomStats.map(r => r.count), 1);
                const widthPct = Math.round((item.count / maxCount) * 100);
                const colors = ['#f97316', '#10b981', '#f59e0b', '#3b82f6'];
                const color = colors[index % colors.length];
                
                return (
                  <div className="mb-4" key={index}>
                    <div className="flex justify-between text-sm mb-1 font-medium">
                      <span>{item.room}</span>
                      <span>{item.count} Aset</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-[4px]">
                      <div className="h-full rounded-[4px]" style={{ width: `${widthPct}%`, background: color }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center p-6">Belum ada data ruangan.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;

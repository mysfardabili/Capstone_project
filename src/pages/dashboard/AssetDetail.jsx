import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, FileText, Wrench, RefreshCw, Activity,
  MapPin, Box, Hash, Calendar, QrCode, Image as ImageIcon, Download, Loader2
} from 'lucide-react';
import Toast from '../../components/Toast';

import { api } from '../../services/api';

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [asset, setAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const showNotification = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
  };

  useEffect(() => {
    const fetchAssetDetail = async () => {
      try {
        const data = await api.get(`/assets/${id}`);
        setAsset(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssetDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-gray-500 dark:text-gray-400">
        <Loader2 size={40} className="animate-spin" color="#f97316" />
        <span>Memuat detail aset...</span>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        <h3>Gagal Memuat Detail Aset</h3>
        <p>{error || 'Aset tidak ditemukan'}</p>
        <button onClick={() => navigate(-1)} className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70" style={{ margin: '1rem auto' }}>Kembali</button>
      </div>
    );
  }

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  const mutationHistory = (asset.mutations || []).map(m => ({
    id: m.id,
    date: new Date(m.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    from: m.sourceLocation,
    to: m.targetLocation,
    by: m.requesterName,
  }));

  const repairHistory = (asset.repairs || []).map(r => ({
    id: r.id,
    date: new Date(r.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    issue: r.description,
    technician: r.technicianName || 'Belum ditunjuk',
    status: r.status === 'Completed' ? 'Selesai' : r.status === 'In Progress' ? 'Diproses' : 'Menunggu',
  }));

  const calibrationHistory = (asset.calibrations || []).map(c => ({
    id: c.id,
    date: c.calibrationDate ? new Date(c.calibrationDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Menunggu',
    result: c.status,
    nextDue: new Date(c.nextCalibrationDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    agency: c.vendor,
  }));

  return (
    <div className="flex flex-col gap-6" style={{ paddingBottom: '3rem', minHeight: '100%' }}>
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
      <style>{`
        .detail-header-card { display: flex; gap: 2.5rem; margin-bottom: 2rem; align-items: center; }
        .detail-image-container {
          width: 320px;
          height: 320px;
          border-radius: 24px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 10px 40px rgba(0,0,0,0.06);
          border: 8px solid #ffffff;
          background: #f8fafc;
          position: relative;
        }
        .detail-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .tabs-container { display: flex; gap: 1rem; border-bottom: 1px solid #e2e8f0; margin-bottom: 2rem; overflow-x: auto; white-space: nowrap; padding-bottom: 5px; }
        .tabs-container::-webkit-scrollbar { height: 4px; }
        .tabs-container::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
        .badge-container { display: flex; gap: 10px; margin-bottom: 1.5rem; }
        .meta-info { color: #64748b; margin: 0 0 2rem 0; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 1.1rem; }
        
        .loc-serial-wrapper { display: flex; gap: 1rem; }
        .info-card-small {
          background: #ffffff;
          padding: 1.2rem 1.5rem;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
          border: 1px solid #f1f5f9;
          flex: 1;
        }

        .btn-action-group { display: flex; gap: 10px; }
        
        .data-table th, .data-table td { white-space: nowrap; }
        
        @media (max-width: 768px) {
          .detail-header-card { flex-direction: column; align-items: center; text-align: center; }
          .detail-image-container { width: 100%; max-width: 320px; height: auto; aspect-ratio: 1/1; }
          .badge-container, .meta-info { justify-content: center; }
          .loc-serial-wrapper { flex-direction: column; width: 100%; }
          .detail-info-grid { grid-template-columns: 1fr; }
          .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .btn-action-group { width: 100%; justify-content: space-between; }
        }
      `}</style>

      {/* Header with Back Button */}
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/dashboard/assets" className="bg-transparent text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all" style={{ padding: '8px', border: 'none', borderRadius: '10px' }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100" style={{ margin: 0 }}>Detail Aset</h1>
        </div>
        <div className="btn-action-group">
          <button className="bg-transparent text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all" onClick={() => showNotification(`QR Code untuk ${asset.name} (${asset.id}) sedang disiapkan...`)}><QrCode size={18} /> Cetak QR</button>
          <button className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70" onClick={() => navigate(`/dashboard/repairs/add?assetId=${asset.id}`)}><Wrench size={18} /> Lapor Kerusakan</button>
        </div>
      </div>

      {/* Asset Profile Header */}
      <div className="detail-header-card">
        <div className="detail-image-container">
          {asset.img ? (
            <img src={asset.img} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
              <ImageIcon size={64} />
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
          <div className="badge-container">
            <span className={`px-3 py-1 rounded-[2rem] text-xs font-semibold inline-block ${asset.status === 'Tersedia' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>{asset.status}</span>
            <span className={`px-3 py-1 rounded-[2rem] text-xs font-semibold inline-block ${asset.condition === 'Baik' ? 'bg-green-100 text-green-800' : asset.condition === 'Rusak' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>{asset.condition}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100" style={{ fontSize: '2.4rem', margin: '0 0 0.8rem 0', lineHeight: 1.2 }}>{asset.name}</h2>
          <p className="meta-info">
            <Hash size={20} color="#cbd5e1" /> <strong style={{ color: '#475569' }}>{asset.id}</strong> &nbsp;|&nbsp;
            <Box size={20} color="#cbd5e1" /> <strong style={{ color: '#475569' }}>{asset.category}</strong>
          </p>

          <div className="loc-serial-wrapper">
            <div className="info-card-small">
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Lokasi Saat Ini</p>
              <p style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontSize: '1.1rem' }}>
                <MapPin size={20} color="#f97316" /> {asset.room}
              </p>
            </div>
            <div className="info-card-small">
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Nomor Seri</p>
              <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>{asset.serialNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-container">
        {[
          { id: 'info', icon: <FileText size={18} />, label: 'Info Lengkap' },
          { id: 'mutasi', icon: <RefreshCw size={18} />, label: 'Riwayat Mutasi' },
          { id: 'perbaikan', icon: <Wrench size={18} />, label: 'Riwayat Perbaikan' },
          { id: 'kalibrasi', icon: <Activity size={18} />, label: 'Histori Kalibrasi' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '1rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? '#f97316' : '#64748b',
              borderBottom: activeTab === tab.id ? '3px solid #f97316' : '3px solid transparent',
              display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-custom-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col" style={{ padding: '2rem', overflow: 'visible' }}>
        {activeTab === 'info' && (
          <div className="detail-info-grid">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Detail Pembelian</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1.2rem', marginBottom: '1rem' }}>
                <span style={{ color: '#64748b' }}>Harga Beli</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{formatRupiah(asset.price)}</span>

                <span style={{ color: '#64748b' }}>Tanggal Beli</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{asset.purchaseDate}</span>

                <span style={{ color: '#64748b' }}>Vendor / Supplier</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{asset.vendor}</span>

                <span style={{ color: '#64748b' }}>Garansi Habis</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{asset.warrantyEnd}</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Dokumen Tambahan</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500 }}><FileText size={20} color="#f97316" /> Manual Book.pdf</div>
                  <button className="bg-transparent text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={() => showNotification('Mengunduh Manual Book.pdf...')}><Download size={14} /> Unduh</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500 }}><FileText size={20} color="#f97316" /> Invoice Pembelian.pdf</div>
                  <button className="bg-transparent text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={() => showNotification('Mengunduh Invoice Pembelian.pdf...')}><Download size={14} /> Unduh</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mutasi' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">ID Mutasi</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Tanggal</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Dari Ruangan</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Ke Ruangan</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Penanggung Jawab</th>
                </tr>
              </thead>
              <tbody>
                {mutationHistory.map(mut => (
                  <tr key={mut.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle" style={{ fontWeight: 600, color: '#0f172a' }}>{mut.id}</td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">{mut.date}</td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">{mut.from}</td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle" style={{ fontWeight: 600 }}><MapPin size={14} color="#f97316" style={{ display: 'inline', marginRight: '4px' }} /> {mut.to}</td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">{mut.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'perbaikan' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">ID Tiket</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Tanggal Lapor</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Kendala / Kerusakan</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Teknisi</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {repairHistory.map(rep => (
                  <tr key={rep.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle" style={{ fontWeight: 600, color: '#0f172a' }}>{rep.id}</td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">{rep.date}</td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">{rep.issue}</td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">{rep.technician}</td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle"><span className="px-3 py-1 rounded-[2rem] text-xs font-semibold inline-block bg-green-100 text-green-800">{rep.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'kalibrasi' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">ID Kalibrasi</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Tanggal Uji</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Lembaga Penguji</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Hasil</th>
                  <th className="bg-white dark:bg-gray-800 px-6 py-4 font-semibold text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">Jadwal Berikutnya</th>
                </tr>
              </thead>
              <tbody>
                {calibrationHistory.map(cal => (
                  <tr key={cal.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle" style={{ fontWeight: 600, color: '#0f172a' }}>{cal.id}</td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">{cal.date}</td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle">{cal.agency}</td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle"><span className="px-3 py-1 rounded-[2rem] text-xs font-semibold inline-block bg-green-100 text-green-800">{cal.result}</span></td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 align-middle" style={{ fontWeight: 700, color: '#f97316' }}><Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> {cal.nextDue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AssetDetail;

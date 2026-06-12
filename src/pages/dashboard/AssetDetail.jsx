import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, Wrench, RefreshCw, Activity, 
  MapPin, Box, Hash, Calendar, QrCode, Image as ImageIcon, Download
} from 'lucide-react';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showNotification = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
  };

  const asset = {
    id: id || 'AST-001',
    name: 'USG Machine Voluson E8',
    category: 'Alat Medis',
    room: 'Ruang Radiologi 1',
    serialNumber: 'SN-V8-001',
    price: 150000000,
    condition: 'Baik',
    status: 'Tersedia',
    purchaseDate: '2023-01-15',
    vendor: 'PT Medika Prima',
    warrantyEnd: '2025-01-15',
    img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400'
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  const mutationHistory = [
    { id: 'M-05', date: '01 Feb 2024', from: 'Ruang Radiologi 1', to: 'Ruang Radiologi 2', by: 'Siti (Kepala Ruangan)' },
    { id: 'M-04', date: '10 Jan 2024', from: 'Gudang Alat', to: 'Ruang Radiologi 1', by: 'Budi (Admin)' },
    { id: 'M-03', date: '20 Nov 2023', from: 'Lab Sementara', to: 'Gudang Alat', by: 'Budi (Admin)' },
    { id: 'M-02', date: '15 Nov 2023', from: 'Ruang Radiologi 1', to: 'Lab Sementara', by: 'Siti (Kepala Ruangan)' },
    { id: 'M-01', date: '10 Okt 2023', from: 'Gudang Pusat', to: 'Ruang Radiologi 1', by: 'Budi (Admin)' }
  ];

  const repairHistory = [
    { id: 'R-05', date: '20 Mei 2024', issue: 'Pembersihan filter rutin', technician: 'Andi', status: 'Selesai' },
    { id: 'R-04', date: '15 Apr 2024', issue: 'Kalibrasi ulang sensor', technician: 'Tono', status: 'Selesai' },
    { id: 'R-03', date: '02 Apr 2024', issue: 'Update firmware sistem', technician: 'Rudi', status: 'Selesai' },
    { id: 'R-02', date: '12 Mar 2024', issue: 'Kabel power longgar', technician: 'Andi', status: 'Selesai' },
    { id: 'R-01', date: '05 Jan 2024', issue: 'Layar berkedip saat dinyalakan', technician: 'Tono', status: 'Selesai' }
  ];

  const calibrationHistory = [
    { id: 'C-04', date: '22 Jan 2025', result: 'Menunggu', nextDue: '22 Jan 2026', agency: 'PT Kalibrasi Medika' },
    { id: 'C-03', date: '22 Jan 2024', result: 'Lulus', nextDue: '22 Jan 2025', agency: 'PT Kalibrasi Medika' },
    { id: 'C-02', date: '20 Jan 2023', result: 'Lulus', nextDue: '20 Jan 2024', agency: 'BMKG / internal' },
    { id: 'C-01', date: '15 Jan 2022', result: 'Lulus', nextDue: '15 Jan 2023', agency: 'BMKG / internal' }
  ];

  return (
    <div className="page-container" style={{ paddingBottom: '3rem', height: 'auto', minHeight: '100%' }}>
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
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/dashboard/assets" className="btn-outline" style={{ padding: '8px', border: 'none', background: '#f1f5f9', borderRadius: '10px' }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className="page-title" style={{ margin: 0 }}>Detail Aset</h1>
        </div>
        <div className="btn-action-group">
          <button className="btn-outline" onClick={() => showNotification(`QR Code untuk ${asset.name} (${asset.id}) sedang disiapkan...`)}><QrCode size={18} /> Cetak QR</button>
          <button className="btn-primary" onClick={() => navigate(`/dashboard/repairs/add`)}><Wrench size={18} /> Lapor Kerusakan</button>
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
            <span className={`badge ${asset.status === 'Tersedia' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>{asset.status}</span>
            <span className={`badge ${asset.condition === 'Baik' ? 'badge-success' : asset.condition === 'Rusak' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>{asset.condition}</span>
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 0.8rem 0', color: '#0f172a', lineHeight: 1.2 }}>{asset.name}</h2>
          <p className="meta-info">
            <Hash size={20} color="#cbd5e1"/> <strong style={{ color: '#475569' }}>{asset.id}</strong> &nbsp;|&nbsp; 
            <Box size={20} color="#cbd5e1"/> <strong style={{ color: '#475569' }}>{asset.category}</strong>
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
      <div className="card" style={{ padding: '2rem', overflow: 'visible' }}>
        {activeTab === 'info' && (
          <div className="detail-info-grid">
            <div>
              <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#0f172a' }}>Detail Pembelian</h3>
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
              <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#0f172a' }}>Dokumen Tambahan</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500 }}><FileText size={20} color="#f97316"/> Manual Book.pdf</div>
                  <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem', background: '#fff' }} onClick={() => showNotification('Mengunduh Manual Book.pdf...')}><Download size={14}/> Unduh</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500 }}><FileText size={20} color="#f97316"/> Invoice Pembelian.pdf</div>
                  <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem', background: '#fff' }} onClick={() => showNotification('Mengunduh Invoice Pembelian.pdf...')}><Download size={14}/> Unduh</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mutasi' && (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Mutasi</th>
                  <th>Tanggal</th>
                  <th>Dari Ruangan</th>
                  <th>Ke Ruangan</th>
                  <th>Penanggung Jawab</th>
                </tr>
              </thead>
              <tbody>
                {mutationHistory.map(mut => (
                  <tr key={mut.id}>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{mut.id}</td>
                    <td>{mut.date}</td>
                    <td>{mut.from}</td>
                    <td style={{ fontWeight: 600 }}><MapPin size={14} color="#f97316" style={{ display: 'inline', marginRight: '4px' }}/> {mut.to}</td>
                    <td>{mut.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'perbaikan' && (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Tiket</th>
                  <th>Tanggal Lapor</th>
                  <th>Kendala / Kerusakan</th>
                  <th>Teknisi</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {repairHistory.map(rep => (
                  <tr key={rep.id}>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{rep.id}</td>
                    <td>{rep.date}</td>
                    <td>{rep.issue}</td>
                    <td>{rep.technician}</td>
                    <td><span className="badge badge-success">{rep.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'kalibrasi' && (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Kalibrasi</th>
                  <th>Tanggal Uji</th>
                  <th>Lembaga Penguji</th>
                  <th>Hasil</th>
                  <th>Jadwal Berikutnya</th>
                </tr>
              </thead>
              <tbody>
                {calibrationHistory.map(cal => (
                  <tr key={cal.id}>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{cal.id}</td>
                    <td>{cal.date}</td>
                    <td>{cal.agency}</td>
                    <td><span className="badge badge-success">{cal.result}</span></td>
                    <td style={{ fontWeight: 700, color: '#f97316' }}><Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }}/> {cal.nextDue}</td>
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

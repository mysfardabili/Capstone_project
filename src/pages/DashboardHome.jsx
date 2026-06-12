import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, AlertTriangle, ClipboardList, RefreshCw, Clock, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import './DashboardHome.css';
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
      // Refresh statistics
      const data = await api.get('/dashboard/summary');
      setStats(data);
    } catch (err) {
      alert(`Gagal menyetujui: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem', color: 'var(--text-muted)' }}>
        <Loader2 size={40} className="spin" style={{ color: 'var(--primary)' }} />
        <span>Memuat ringkasan dashboard...</span>
        <style>{`
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        <h3>Gagal Memuat Dashboard</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary" style={{ margin: '1rem auto' }}>Segarkan Halaman</button>
      </div>
    );
  }

  // Fallback defaults if stats are empty
  const summary = stats?.summary || { totalAssets: 0, activeRepairs: 0, pendingRequests: 0, mutationsThisMonth: 0 };
  const cond = stats?.conditionDistribution || { baik: 0, perbaikan: 0, rusak: 0 };
  const roomStats = stats?.roomDistribution || [];
  const upcomingCalibrations = stats?.upcomingCalibrations || [];
  const approvalsList = [
    ...(stats?.pendingApprovals?.requests || []),
    ...(stats?.pendingApprovals?.mutations || []),
  ];
  const recentActivities = stats?.recentActivities || [];

  // Calculate condition percentages
  const condTotal = cond.baik + cond.perbaikan + cond.rusak;
  const baikPct = condTotal > 0 ? Math.round((cond.baik / condTotal) * 100) : 0;
  const perbaikanPct = condTotal > 0 ? Math.round((cond.perbaikan / condTotal) * 100) : 0;
  const rusakPct = condTotal > 0 ? Math.round((cond.rusak / condTotal) * 100) : 0;

  return (
    <div className="dashboard-home">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
      
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h2>Selamat Datang, Admin</h2>
          <p>Kelola dan pantau seluruh aset rumah sakit secara efektif, cepat, dan terintegrasi.</p>
          <button className="btn-secondary" onClick={() => handleActionClick("Menyiapkan unduhan Laporan Bulanan...")}>Lihat Laporan Bulanan</button>
        </div>
        <img src="/doctor-hero.png" alt="Doctor" className="hero-image" />
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <Link to="/dashboard/assets/add" className="quick-action-btn">
          <div className="quick-icon"><Package size={20} /></div>
          Tambah Aset
        </Link>
        <Link to="/dashboard/repairs/add" className="quick-action-btn">
          <div className="quick-icon"><AlertTriangle size={20} /></div>
          Lapor Kerusakan
        </Link>
        <Link to="/dashboard/mutation/add" className="quick-action-btn">
          <div className="quick-icon"><RefreshCw size={20} /></div>
          Ajukan Mutasi
        </Link>
        <Link to="/dashboard/calibration/add" className="quick-action-btn">
          <div className="quick-icon" style={{ background: 'var(--icon-bg-green)', color: 'var(--icon-color-green)' }}><Clock size={20} /></div>
          Jadwal Kalibrasi
        </Link>
      </section>

      {/* Summary Cards */}
      <section className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon" style={{ background: 'var(--icon-bg-blue)', color: 'var(--icon-color-blue)' }}>
            <Package size={24} />
          </div>
          <div className="summary-info">
            <span className="summary-label">Total Aset</span>
            <span className="summary-value">{summary.totalAssets}</span>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon" style={{ background: 'var(--icon-bg-red)', color: 'var(--icon-color-red)' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="summary-info">
            <span className="summary-label">Perbaikan Aktif</span>
            <span className="summary-value">{summary.activeRepairs}</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ background: 'var(--icon-bg-yellow)', color: 'var(--icon-color-yellow)' }}>
            <ClipboardList size={24} />
          </div>
          <div className="summary-info">
            <span className="summary-label">Permintaan Tertunda</span>
            <span className="summary-value">{summary.pendingRequests}</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ background: 'var(--icon-bg-green)', color: 'var(--icon-color-green)' }}>
            <RefreshCw size={24} />
          </div>
          <div className="summary-info">
            <span className="summary-label">Mutasi Bulan Ini</span>
            <span className="summary-value">{summary.mutationsThisMonth}</span>
          </div>
        </div>
      </section>

      {/* Stats Charts & Main Content Area */}
      <section className="dashboard-main-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Grafik Kondisi Aset */}
        <div className="content-card">
          <div className="card-title">
            <span>Kondisi Aset Saat Ini</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1rem 0' }}>
            <div style={{ width: '130px', height: '130px', position: 'relative' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                {/* Background Circle (Red representing Rusak) */}
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#fee2e2" strokeWidth="3" />
                {/* Sedang Perbaikan (Warning Yellow) */}
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray={`${perbaikanPct}, 100`} />
                {/* Baik (Success Green) */}
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${baikPct}, 100`} strokeDashoffset={`${-perbaikanPct}`} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{condTotal}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Total</span>
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}><span style={{ color: '#10b981' }}>●</span> Baik ({baikPct}%)</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{cond.baik}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '4px' }}>
                  <div style={{ width: `${baikPct}%`, height: '100%', background: '#10b981', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}><span style={{ color: '#f59e0b' }}>●</span> Perbaikan ({perbaikanPct}%)</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{cond.perbaikan}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '4px' }}>
                  <div style={{ width: `${perbaikanPct}%`, height: '100%', background: '#f59e0b', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}><span style={{ color: '#ef4444' }}>●</span> Rusak ({rusakPct}%)</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{cond.rusak}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '4px' }}>
                  <div style={{ width: `${rusakPct}%`, height: '100%', background: '#ef4444', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="content-card">
          <div className="card-title">
            <span>Aktivitas Terbaru</span>
            <Link to="/dashboard/mutation" className="view-all">Lihat Semua</Link>
          </div>
          
          <div className="activity-list">
            {recentActivities.length > 0 ? (
              recentActivities.map((act, index) => (
                <div className="activity-item" key={index}>
                  {act.type === 'repair' ? (
                    <AlertTriangle className="activity-icon" size={18} style={{ color: '#ef4444' }} />
                  ) : (
                    <RefreshCw className="activity-icon" size={18} style={{ color: 'var(--primary)' }} />
                  )}
                  <div className="activity-details">
                    <h4>{act.title}</h4>
                    <p>{act.description}</p>
                    <span className="activity-time">
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> 
                      {new Date(act.date).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Tidak ada aktivitas terbaru.</div>
            )}
          </div>
        </div>
      </section>

      {/* Secondary Information Grid */}
      <section className="dashboard-secondary-grid">
        
        {/* Kalibrasi Mendekat */}
        <div className="content-card">
          <div className="card-title">
            <span>Kalibrasi Mendekat</span>
            <Link to="/dashboard/calibration" className="view-all">Kelola</Link>
          </div>
          <div className="activity-list">
            {upcomingCalibrations.length > 0 ? (
              upcomingCalibrations.map((cal, index) => {
                const isUrgent = cal.daysLeft <= 3;
                return (
                  <div 
                    className="activity-item" 
                    key={index}
                    style={{ 
                      background: isUrgent ? 'var(--icon-bg-red)' : 'var(--icon-bg-yellow)', 
                      padding: '0.75rem', 
                      borderRadius: '0.5rem', 
                      border: '1px solid var(--border)', 
                      gap: '0.5rem', 
                      alignItems: 'center' 
                    }}
                  >
                    {isUrgent ? (
                      <AlertTriangle size={20} color="var(--icon-color-red)" />
                    ) : (
                      <Clock size={20} color="var(--icon-color-yellow)" />
                    )}
                    <div className="activity-details">
                      <h4 style={{ color: isUrgent ? 'var(--icon-color-red)' : 'var(--icon-color-yellow)', margin: 0 }}>{cal.assetName}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
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
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>Aman. Semua kalibrasi terpenuhi.</div>
            )}
          </div>
        </div>

        {/* Menunggu Persetujuan */}
        <div className="content-card">
          <div className="card-title">
            <span>Menunggu Persetujuan</span>
            <Link to="/dashboard/requests" className="view-all">Lihat</Link>
          </div>
          <div className="approval-list">
            {approvalsList.length > 0 ? (
              approvalsList.map((item, index) => (
                <div className="approval-item" key={index}>
                  <div className="approval-info">
                    <h4>{item.title}</h4>
                    <p>{item.subtitle}</p>
                  </div>
                  <div className="btn-approve" title="Setujui Pengajuan" onClick={() => handleApprove(item)}>
                    {item.type === 'request' ? <Package size={16} /> : <RefreshCw size={16} />}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>Tidak ada pengajuan tertunda.</div>
            )}
          </div>
        </div>

        {/* Distribusi Ruangan */}
        <div className="content-card">
          <div className="card-title">
            <span>Aset per Ruangan</span>
          </div>
          <div className="room-stats">
            {roomStats.length > 0 ? (
              roomStats.map((item, index) => {
                const maxCount = Math.max(...roomStats.map(r => r.count), 1);
                const widthPct = Math.round((item.count / maxCount) * 100);
                const colors = ['#f97316', '#10b981', '#f59e0b', '#3b82f6'];
                const color = colors[index % colors.length];
                
                return (
                  <div className="room-stat-item" key={index}>
                    <div className="room-stat-label">
                      <span>{item.room}</span>
                      <span>{item.count} Aset</span>
                    </div>
                    <div className="room-stat-bar-bg">
                      <div className="room-stat-bar-fill" style={{ width: `${widthPct}%`, background: color }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>Belum ada data ruangan.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;

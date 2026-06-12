import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, AlertTriangle, ClipboardList, RefreshCw, Clock } from 'lucide-react';
import './DashboardHome.css';
import Toast from '../components/Toast';

const DashboardHome = () => {
  const [showToast, setShowToast] = useState(false);
  
  return (
    <div className="dashboard-home">
      {showToast && <Toast message="Menyiapkan unduhan Laporan Bulanan..." onClose={() => setShowToast(false)} />}
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h2>Selamat Datang, Admin</h2>
          <p>Kelola dan pantau seluruh aset rumah sakit secara efektif, cepat, dan terintegrasi.</p>
          <button className="btn-secondary" onClick={() => setShowToast(true)}>Lihat Laporan Bulanan</button>
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
            <span className="summary-value">1,248</span>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon" style={{ background: 'var(--icon-bg-red)', color: 'var(--icon-color-red)' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="summary-info">
            <span className="summary-label">Perbaikan Aktif</span>
            <span className="summary-value">12</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ background: 'var(--icon-bg-yellow)', color: 'var(--icon-color-yellow)' }}>
            <ClipboardList size={24} />
          </div>
          <div className="summary-info">
            <span className="summary-label">Permintaan Tertunda</span>
            <span className="summary-value">5</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ background: 'var(--icon-bg-green)', color: 'var(--icon-color-green)' }}>
            <RefreshCw size={24} />
          </div>
          <div className="summary-info">
            <span className="summary-label">Mutasi Bulan Ini</span>
            <span className="summary-value">34</span>
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
                {/* Background Circle */}
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#fee2e2" strokeWidth="3" />
                {/* Sedang Perbaikan (Warning) */}
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="30, 100" />
                {/* Baik (Success) */}
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="65, 100" strokeDashoffset="-30" />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>1,248</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Total</span>
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}><span style={{ color: '#10b981' }}>●</span> Baik (65%)</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>811</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '4px' }}>
                  <div style={{ width: '65%', height: '100%', background: '#10b981', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}><span style={{ color: '#f59e0b' }}>●</span> Perbaikan (30%)</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>374</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '4px' }}>
                  <div style={{ width: '30%', height: '100%', background: '#f59e0b', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}><span style={{ color: '#ef4444' }}>●</span> Rusak (5%)</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>63</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '4px' }}>
                  <div style={{ width: '5%', height: '100%', background: '#ef4444', borderRadius: '4px' }}></div>
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
            <div className="activity-item">
              <RefreshCw className="activity-icon" size={18} />
              <div className="activity-details">
                <h4>Mutasi Aset: Bed Pasien</h4>
                <p>Dipindahkan ke Kamar Melati 202 oleh Ns. Ratna.</p>
                <span className="activity-time"><Clock size={12} style={{display:'inline', marginRight:'4px'}}/> Hari ini, 09:30 WIB</span>
              </div>
            </div>

            <div className="activity-item">
              <AlertTriangle className="activity-icon" size={18} style={{ color: '#ef4444' }} />
              <div className="activity-details">
                <h4>Laporan Kerusakan: Patient Monitor</h4>
                <p>Dilaporkan oleh Ns. Siti. Masalah: Layar bergaris.</p>
                <span className="activity-time"><Clock size={12} style={{display:'inline', marginRight:'4px'}}/> Kemarin, 14:15 WIB</span>
              </div>
            </div>
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
            <div className="activity-item" style={{ background: 'var(--icon-bg-red)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', gap: '0.5rem', alignItems: 'center' }}>
              <AlertTriangle size={20} color="var(--icon-color-red)" />
              <div className="activity-details">
                <h4 style={{ color: 'var(--icon-color-red)', margin: 0 }}>Defibrillator Zoll</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Jatuh tempo: 2 hari lagi</span>
              </div>
            </div>
            <div className="activity-item" style={{ background: 'var(--icon-bg-yellow)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', gap: '0.5rem', alignItems: 'center' }}>
              <Clock size={20} color="var(--icon-color-yellow)" />
              <div className="activity-details">
                <h4 style={{ color: 'var(--icon-color-yellow)', margin: 0 }}>Ventilator Hamilton</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Jatuh tempo: 5 hari lagi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menunggu Persetujuan */}
        <div className="content-card">
          <div className="card-title">
            <span>Menunggu Persetujuan</span>
            <Link to="/dashboard/requests" className="view-all">Lihat</Link>
          </div>
          <div className="approval-list">
            <div className="approval-item">
              <div className="approval-info">
                <h4>Pengajuan Kursi Roda</h4>
                <p>IGD • 2 Unit • Oleh dr. Budi</p>
              </div>
              <div className="btn-approve" onClick={() => setShowToast(true)}>
                <Package size={16} />
              </div>
            </div>
            <div className="approval-item">
              <div className="approval-info">
                <h4>Mutasi Bed Pasien</h4>
                <p>Mawar ke Melati • Ns. Ratna</p>
              </div>
              <div className="btn-approve" onClick={() => setShowToast(true)}>
                <RefreshCw size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Distribusi Ruangan */}
        <div className="content-card">
          <div className="card-title">
            <span>Aset per Ruangan</span>
          </div>
          <div className="room-stats">
            <div className="room-stat-item">
              <div className="room-stat-label">
                <span>Radiologi</span>
                <span>342 Aset</span>
              </div>
              <div className="room-stat-bar-bg">
                <div className="room-stat-bar-fill" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="room-stat-item">
              <div className="room-stat-label">
                <span>IGD</span>
                <span>215 Aset</span>
              </div>
              <div className="room-stat-bar-bg">
                <div className="room-stat-bar-fill" style={{ width: '60%', background: '#10b981' }}></div>
              </div>
            </div>
            <div className="room-stat-item">
              <div className="room-stat-label">
                <span>ICU</span>
                <span>180 Aset</span>
              </div>
              <div className="room-stat-bar-bg">
                <div className="room-stat-bar-fill" style={{ width: '45%', background: '#f59e0b' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;

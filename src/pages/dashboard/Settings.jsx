import React, { useState } from 'react';
import { Save, User, Shield, Mail, BellRing } from 'lucide-react';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const Settings = () => {
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = (e) => {
    e.preventDefault();
    setShowToast(true);
  };

  return (
    <div className="page-container">
      {showToast && <Toast message="Pengaturan berhasil disimpan!" onClose={() => setShowToast(false)} />}
      
      <div className="page-header">
        <h2 className="page-title">Pengaturan</h2>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Sidebar Settings */}
        <div style={{ width: '100%', maxWidth: '250px', flexShrink: 0 }}>
          <div className="card" style={{ padding: '1rem' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <button 
                  onClick={() => setActiveTab('profile')}
                  style={{ 
                    width: '100%', textAlign: 'left', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                    background: activeTab === 'profile' ? 'var(--primary-bg)' : 'transparent',
                    color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: activeTab === 'profile' ? 600 : 400,
                    display: 'flex', alignItems: 'center', gap: '10px'
                  }}
                >
                  <User size={18} /> Profil Pengguna
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('security')}
                  style={{ 
                    width: '100%', textAlign: 'left', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                    background: activeTab === 'security' ? 'var(--primary-bg)' : 'transparent',
                    color: activeTab === 'security' ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: activeTab === 'security' ? 600 : 400,
                    display: 'flex', alignItems: 'center', gap: '10px'
                  }}
                >
                  <Shield size={18} /> Keamanan
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('preferences')}
                  style={{ 
                    width: '100%', textAlign: 'left', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                    background: activeTab === 'preferences' ? 'var(--primary-bg)' : 'transparent',
                    color: activeTab === 'preferences' ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: activeTab === 'preferences' ? 600 : 400,
                    display: 'flex', alignItems: 'center', gap: '10px'
                  }}
                >
                  <BellRing size={18} /> Preferensi Sistem
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Content Settings */}
        <div style={{ flex: 1 }}>
          <div className="form-container" style={{ maxWidth: '100%' }}>
            
            {activeTab === 'profile' && (
              <form onSubmit={handleSave}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Profil Pengguna</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                    AD
                  </div>
                  <div>
                    <button type="button" className="btn-outline">Ubah Foto</button>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" className="form-control" defaultValue="Admin ASETRA" />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input type="text" className="form-control" defaultValue="Administrator" disabled style={{ background: 'var(--bg-color)' }} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" defaultValue="admin@asetra.id" />
                  </div>
                  <div className="form-group">
                    <label>Nomor Telepon</label>
                    <input type="text" className="form-control" defaultValue="081234567890" />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    <Save size={18} /> Simpan Perubahan
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handleSave}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Ubah Password</h3>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Password Saat Ini</label>
                  <input type="password" className="form-control" placeholder="Masukkan password saat ini" />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Password Baru</label>
                  <input type="password" className="form-control" placeholder="Masukkan password baru" />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Konfirmasi Password Baru</label>
                  <input type="password" className="form-control" placeholder="Ketik ulang password baru" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    <Save size={18} /> Update Password
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'preferences' && (
              <form onSubmit={handleSave}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Preferensi Notifikasi</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                    <span style={{ color: 'var(--text-main)' }}>Notifikasi Email untuk Permintaan Baru</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                    <span style={{ color: 'var(--text-main)' }}>Notifikasi Email untuk Jadwal Kalibrasi (H-7)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                    <span style={{ color: 'var(--text-main)' }}>Laporan Rekapitulasi Mingguan via Email</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    <Save size={18} /> Simpan Preferensi
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

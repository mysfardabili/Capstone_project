import React, { useState, useEffect } from 'react';
import { Save, User, Shield, BellRing, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const Settings = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('Pengaturan berhasil disimpan!');
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [adminUser, setAdminUser] = useState({
    name: 'Admin ASETRA',
    email: 'admin@asetra.com',
    role: 'admin',
    phone: '',
    profilePicture: '',
    emailNewRequest: true,
    emailCalibrationDue: true,
    weeklyReport: false,
  });

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const fetchProfile = async () => {
    try {
      const data = await api.get('/auth/me');
      setAdminUser({
        name: data.name || 'Admin ASETRA',
        email: data.email || 'admin@asetra.com',
        role: data.role || 'admin',
        phone: data.phone || '',
        profilePicture: data.profilePicture || '',
        emailNewRequest: data.emailNewRequest !== undefined ? data.emailNewRequest : true,
        emailCalibrationDue: data.emailCalibrationDue !== undefined ? data.emailCalibrationDue : true,
        weeklyReport: data.weeklyReport !== undefined ? data.weeklyReport : false,
      });
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const updatedUser = await api.put('/users/profile', formData, true);
      
      setAdminUser(prev => ({
        ...prev,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profilePicture: updatedUser.profilePicture
      }));

      // Update local storage including profilePicture so topbar avatar re-renders
      localStorage.setItem('user', JSON.stringify({
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture || ''
      }));
      // Notify DashboardLayout to reload user data
      window.dispatchEvent(new Event('userProfileUpdated'));
      setToastMsg('Profil berhasil diperbarui!');
      setShowToast(true);
    } catch (err) {
      alert(`Gagal memperbarui profil: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('Konfirmasi password baru tidak cocok!');
      return;
    }
    setIsLoading(true);
    try {
      await api.put('/users/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setToastMsg('Password berhasil diperbarui!');
      setShowToast(true);
    } catch (err) {
      alert(`Gagal memperbarui password: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.put('/users/preferences', {
        emailNewRequest: adminUser.emailNewRequest,
        emailCalibrationDue: adminUser.emailCalibrationDue,
        weeklyReport: adminUser.weeklyReport,
      });
      setToastMsg('Preferensi berhasil disimpan!');
      setShowToast(true);
    } catch (err) {
      alert(`Gagal menyimpan preferensi: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (isFetching) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem', color: 'var(--text-muted)' }}>
        <Loader2 size={40} className="spin" style={{ color: 'var(--primary)' }} />
        <span>Memuat data profil...</span>
        <style>{`
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-container">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
      
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
                    display: 'flex', alignItems: 'center', gap: '10px',
                    border: 'none', cursor: 'pointer'
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
                    display: 'flex', alignItems: 'center', gap: '10px',
                    border: 'none', cursor: 'pointer'
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
                    display: 'flex', alignItems: 'center', gap: '10px',
                    border: 'none', cursor: 'pointer'
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
              <form onSubmit={handleProfileSubmit}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Profil Pengguna</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', fontWeight: 'bold', overflow: 'hidden' }}>
                    {adminUser.profilePicture ? (
                      <img src={`http://localhost:5000${adminUser.profilePicture}`} alt="Foto Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : getInitials(adminUser.name)}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <button type="button" className="btn-outline">Ubah Foto</button>
                    <input 
                      type="file" 
                      name="profilePicture" 
                      accept="image/*" 
                      style={{ position: 'absolute', left: 0, top: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setToastMsg('Foto dipilih. Klik Simpan Perubahan untuk mengunggah.');
                          setShowToast(true);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nama Lengkap</label>
                    <input 
                      type="text" 
                      name="name" 
                      className="form-control" 
                      value={adminUser.name} 
                      onChange={(e) => setAdminUser(prev => ({ ...prev, name: e.target.value }))} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input type="text" className="form-control" defaultValue={adminUser.role.toUpperCase()} disabled style={{ background: 'var(--bg-color)' }} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      className="form-control" 
                      value={adminUser.email} 
                      onChange={(e) => setAdminUser(prev => ({ ...prev, email: e.target.value }))} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Nomor Telepon</label>
                    <input 
                      type="text" 
                      name="phone" 
                      className="form-control" 
                      placeholder="Masukkan nomor telepon" 
                      value={adminUser.phone} 
                      onChange={(e) => setAdminUser(prev => ({ ...prev, phone: e.target.value }))} 
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? (
                      <><Loader2 size={18} className="spin" /> Menyimpan...</>
                    ) : (
                      <><Save size={18} /> Simpan Perubahan</>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSubmit}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Ubah Password</h3>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Password Saat Ini</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Masukkan password saat ini" 
                    value={passwords.currentPassword} 
                    onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))} 
                    required 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Password Baru</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Masukkan password baru" 
                    value={passwords.newPassword} 
                    onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))} 
                    required 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Konfirmasi Password Baru</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Ketik ulang password baru" 
                    value={passwords.confirmPassword} 
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))} 
                    required 
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? (
                      <><Loader2 size={18} className="spin" /> Memperbarui...</>
                    ) : (
                      <><Save size={18} /> Update Password</>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'preferences' && (
              <form onSubmit={handlePreferencesSubmit}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Preferensi Notifikasi</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={adminUser.emailNewRequest} 
                      onChange={(e) => setAdminUser(prev => ({ ...prev, emailNewRequest: e.target.checked }))} 
                      style={{ width: '18px', height: '18px' }} 
                    />
                    <span style={{ color: 'var(--text-main)' }}>Notifikasi Email untuk Permintaan Baru</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={adminUser.emailCalibrationDue} 
                      onChange={(e) => setAdminUser(prev => ({ ...prev, emailCalibrationDue: e.target.checked }))} 
                      style={{ width: '18px', height: '18px' }} 
                    />
                    <span style={{ color: 'var(--text-main)' }}>Notifikasi Email untuk Jadwal Kalibrasi (H-7)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={adminUser.weeklyReport} 
                      onChange={(e) => setAdminUser(prev => ({ ...prev, weeklyReport: e.target.checked }))} 
                      style={{ width: '18px', height: '18px' }} 
                    />
                    <span style={{ color: 'var(--text-main)' }}>Laporan Rekapitulasi Mingguan via Email</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? (
                      <><Loader2 size={18} className="spin" /> Menyimpan...</>
                    ) : (
                      <><Save size={18} /> Simpan Preferensi</>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Settings;

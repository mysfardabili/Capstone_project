import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Save, User, Shield, BellRing, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import Toast from '../../components/Toast';

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(tabParam);
  const [prevTabParam, setPrevTabParam] = useState(tabParam);

  if (tabParam !== prevTabParam) {
    setActiveTab(tabParam);
    setPrevTabParam(tabParam);
  }

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('Pengaturan berhasil disimpan!');
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

      localStorage.setItem('user', JSON.stringify({
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture || ''
      }));
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
      await api.put('/users/preferences', {
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
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-text-muted">
        <Loader2 size={40} className="animate-spin text-orange-500" />
        <span>Memuat data profil...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-main">Pengaturan</h2>
      </div>

      <div className="flex gap-8 flex-wrap">
        <div className="w-full max-w-[250px] shrink-0">
          <div className="bg-surface rounded-xl shadow-custom-sm border border-border overflow-hidden flex flex-col p-4">
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
              <li>
                <button
                  onClick={() => setSearchParams({ tab: 'profile' }, { replace: true })}
                  className={`w-full text-left px-4 py-3 rounded-custom-md flex items-center gap-2.5 border-0 cursor-pointer ${activeTab === 'profile' ? 'bg-orange-50 text-orange-500 font-semibold' : 'text-text-main font-normal'}`}
                >
                  <User size={18} /> Profil Pengguna
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSearchParams({ tab: 'security' }, { replace: true })}
                  className={`w-full text-left px-4 py-3 rounded-custom-md flex items-center gap-2.5 border-0 cursor-pointer ${activeTab === 'security' ? 'bg-orange-50 text-orange-500 font-semibold' : 'text-text-main font-normal'}`}
                >
                  <Shield size={18} /> Keamanan
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSearchParams({ tab: 'preferences' }, { replace: true })}
                  className={`w-full text-left px-4 py-3 rounded-custom-md flex items-center gap-2.5 border-0 cursor-pointer ${activeTab === 'preferences' ? 'bg-orange-50 text-orange-500 font-semibold' : 'text-text-main font-normal'}`}
                >
                  <BellRing size={18} /> Preferensi Sistem
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-surface p-8 rounded-xl shadow-custom-sm border border-border max-w-full">

            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit}>
                <h3 className="mb-6 text-text-main">Profil Pengguna</h3>
                <div className="flex items-center gap-8 mb-8">
                  <div className="w-20 h-20 rounded-full bg-orange-500 text-white flex items-center justify-center text-[2.2rem] font-bold overflow-hidden shrink-0">
                    {adminUser.profilePicture ? (
                      <img src={`http://localhost:5000${adminUser.profilePicture}`} alt="Foto Profil" className="w-full h-full object-cover" />
                    ) : getInitials(adminUser.name)}
                  </div>
                  <div className="relative">
                    <button type="button" className="bg-transparent text-text-main border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Ubah Foto</button>
                    <input
                      type="file"
                      name="profilePicture"
                      accept="image/*"
                      className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setToastMsg('Foto dipilih. Klik Simpan Perubahan untuk mengunggah.');
                          setShowToast(true);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm font-semibold text-text-main">Nama Lengkap</label>
                    <input
                      type="text"
                      name="name"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]"
                      value={adminUser.name}
                      onChange={(e) => setAdminUser(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm font-semibold text-text-main">Role</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)] bg-gray-100 dark:bg-gray-900" defaultValue={adminUser.role.toUpperCase()} disabled />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm font-semibold text-text-main">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]"
                      value={adminUser.email}
                      onChange={(e) => setAdminUser(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm font-semibold text-text-main">Nomor Telepon</label>
                    <input
                      type="text"
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]"
                      placeholder="Masukkan nomor telepon"
                      value={adminUser.phone}
                      onChange={(e) => setAdminUser(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
                  <button type="submit" className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70" disabled={isLoading}>
                    {isLoading ? (
                      <><Loader2 size={18} className="animate-spin" /> Menyimpan...</>
                    ) : (
                      <><Save size={18} /> Simpan Perubahan</>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSubmit}>
                <h3 className="mb-6 text-text-main">Ubah Password</h3>
                <div className="flex flex-col gap-2 flex-1 mb-6">
                  <label className="text-sm font-semibold text-text-main">Password Saat Ini</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]"
                    placeholder="Masukkan password saat ini"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1 mb-6">
                  <label className="text-sm font-semibold text-text-main">Password Baru</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]"
                    placeholder="Masukkan password baru"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1 mb-6">
                  <label className="text-sm font-semibold text-text-main">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]"
                    placeholder="Ketik ulang password baru"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
                  <button type="submit" className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70" disabled={isLoading}>
                    {isLoading ? (
                      <><Loader2 size={18} className="animate-spin" /> Memperbarui...</>
                    ) : (
                      <><Save size={18} /> Update Password</>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'preferences' && (
              <form onSubmit={handlePreferencesSubmit}>
                <h3 className="mb-6 text-text-main">Preferensi Notifikasi</h3>

                <div className="flex flex-col gap-4 mb-8">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adminUser.emailNewRequest}
                      onChange={(e) => setAdminUser(prev => ({ ...prev, emailNewRequest: e.target.checked }))}
                      className="w-[18px] h-[18px]"
                    />
                    <span className="text-text-main">Notifikasi Email untuk Permintaan Baru</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adminUser.emailCalibrationDue}
                      onChange={(e) => setAdminUser(prev => ({ ...prev, emailCalibrationDue: e.target.checked }))}
                      className="w-[18px] h-[18px]"
                    />
                    <span className="text-text-main">Notifikasi Email untuk Jadwal Kalibrasi (H-7)</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adminUser.weeklyReport}
                      onChange={(e) => setAdminUser(prev => ({ ...prev, weeklyReport: e.target.checked }))}
                      className="w-[18px] h-[18px]"
                    />
                    <span className="text-text-main">Laporan Rekapitulasi Mingguan via Email</span>
                  </label>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
                  <button type="submit" className="bg-orange-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-orange-600 transition-colors disabled:opacity-70" disabled={isLoading}>
                    {isLoading ? (
                      <><Loader2 size={18} className="animate-spin" /> Menyimpan...</>
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
    </div>
  );
};

export default Settings;

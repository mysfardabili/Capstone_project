import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Edit2, Save, Camera, Phone, Mail, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import Toast from '../../components/Toast';

const TechnicianProfile = () => {
  const navigate = useNavigate();
  const [techUser, setTechUser] = useState({
    name: 'Teknisi',
    email: 'teknisi@amk.com',
    role: 'technician',
    phone: '',
    profilePicture: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Local state for avatar file preview
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchProfile = async () => {
    try {
      const data = await api.get('/auth/me');
      setTechUser({
        name: data.name || 'Teknisi',
        email: data.email || 'teknisi@amk.com',
        role: data.role || 'technician',
        phone: data.phone || '',
        profilePicture: data.profilePicture || ''
      });
    } catch (err) {
      console.error('Failed to fetch technician profile:', err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const updatedUser = await api.put('/users/profile', formData, true);

      setTechUser(prev => ({
        ...prev,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profilePicture: updatedUser.profilePicture
      }));

      // Update local storage so topbar layouts react
      localStorage.setItem('user', JSON.stringify({
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture || ''
      }));

      // Dispatch event to update other components
      window.dispatchEvent(new Event('userProfileUpdated'));
      
      setToastMsg('Profil berhasil diperbarui!');
      setShowToast(true);
      setIsEditing(false);
      setPreviewUrl('');
    } catch (err) {
      alert(`Gagal memperbarui profil: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const translateRole = (role) => {
    if (role === 'technician') return 'Teknisi Lapangan - BioMed';
    if (role === 'admin') return 'Administrator Sistem';
    return role;
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-slate-400 dark:text-slate-500">
        <Loader2 size={40} className="animate-spin text-orange-500" />
        <span>Memuat profil teknisi...</span>
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_0.3s_ease-in-out] pb-8">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        {isEditing && (
          <button 
            onClick={() => {
              setIsEditing(false);
              setPreviewUrl('');
            }}
            className="bg-slate-100 dark:bg-slate-700 border-none rounded-xl p-2 cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-slate-900 dark:text-slate-100" />
          </button>
        )}
        <h2 className="m-0 text-[1.6rem] font-extrabold text-slate-900 dark:text-white">
          {isEditing ? 'Edit Profil' : 'Profil Saya'}
        </h2>
      </div>

      {!isEditing ? (
        /* READ ONLY PROFILE VIEW */
        <div className="flex flex-col items-center">
          {/* Avatar Container */}
          <div className="relative mb-6">
            <div className="w-[100px] h-[100px] bg-orange-50/50 rounded-full flex items-center justify-center border-4 border-white shadow-[0_8px_30px_rgba(249,115,22,0.12)] overflow-hidden">
              {techUser.profilePicture ? (
                <img 
                  src={`http://localhost:5000${techUser.profilePicture}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User size={48} className="text-orange-500" />
              )}
            </div>
          </div>
          
          <h2 className="text-[1.4rem] font-extrabold m-0 mb-1 text-slate-900 dark:text-white">{techUser.name}</h2>
          <p className="text-orange-500 font-bold text-[0.85rem] m-0 mb-4 uppercase tracking-[0.5px]">
            {translateRole(techUser.role)}
          </p>

          {/* Details Card */}
          <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-[20px] p-5 shadow-card mb-[1.2rem] border border-white/80 dark:border-slate-700 bg-[linear-gradient(145deg,#ffffff_0%,#f0f7ff_100%)] dark:bg-[linear-gradient(145deg,#1e293b_0%,#0f172a_100%)] border-l-[6px] border-l-blue-600">
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-blue-600 dark:text-blue-400 opacity-80" />
                <div>
                  <span className="text-xs text-slate-400 block">ID PEGAWAI</span>
                  <strong className="text-[0.95rem] text-slate-900 dark:text-slate-100">
                    TK-{techUser.email.split('@')[0].toUpperCase()}
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-blue-600 dark:text-blue-400 opacity-80" />
                <div>
                  <span className="text-xs text-slate-400 block">ALAMAT EMAIL</span>
                  <strong className="text-[0.95rem] text-slate-900 dark:text-slate-100">{techUser.email}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-blue-600 dark:text-blue-400 opacity-80" />
                <div>
                  <span className="text-xs text-slate-400 block">NOMOR TELEPON</span>
                  <strong className="text-[0.95rem] text-slate-900 dark:text-slate-100">
                    {techUser.phone || 'Belum diisi'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full max-w-lg flex flex-col gap-3">
            <button 
              onClick={() => setIsEditing(true)}
              className="w-full p-4 rounded-2xl font-bold text-base border-none cursor-pointer text-center transition-all duration-200 active:scale-[0.98] bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)] flex justify-center items-center gap-2"
            >
              <Edit2 size={18} /> Edit Profil
            </button>
            
            <button 
              onClick={handleLogout}
              className="w-full p-4 rounded-2xl font-bold text-base border-none cursor-pointer text-center transition-all duration-200 active:scale-[0.98] bg-red-100 dark:bg-red-950/30 text-red-500 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 flex justify-center items-center gap-2"
            >
              <LogOut size={18} /> Logout Akun
            </button>
          </div>
        </div>
      ) : (
        /* INTERACTIVE PROFILE EDIT FORM */
        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6 max-w-lg mx-auto">
          
          {/* Avatar Upload Container */}
          <div className="self-center relative mb-4">
            <div className="w-[100px] h-[100px] bg-orange-50/50 rounded-full flex items-center justify-center border-4 border-white shadow-[0_8px_30px_rgba(249, 115, 22, 0.12)] overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : techUser.profilePicture ? (
                <img src={`http://localhost:5000${techUser.profilePicture}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-orange-500" />
              )}
            </div>

            {/* Upload Button Overlay */}
            <div className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-1.5 shadow-[0_4px_10px_rgba(255,107,0,0.3)] cursor-pointer flex items-center justify-center">
              <Camera size={16} />
              <input 
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-[1.2rem]">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.85rem] font-extrabold text-slate-600 dark:text-slate-400">Nama Lengkap</label>
              <input 
                type="text" 
                name="name"
                defaultValue={techUser.name}
                required
                placeholder="Masukkan nama lengkap"
                className="form-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.85rem] font-extrabold text-slate-600 dark:text-slate-400">Alamat Email</label>
              <input 
                type="email" 
                name="email"
                defaultValue={techUser.email}
                required
                placeholder="Masukkan alamat email"
                className="form-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.85rem] font-extrabold text-slate-600 dark:text-slate-400">Nomor Telepon</label>
              <input 
                type="text" 
                name="phone"
                defaultValue={techUser.phone}
                placeholder="Contoh: 081234567890"
                className="form-input"
              />
            </div>
          </div>

          {/* Save Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full p-4 rounded-2xl font-bold text-base border-none cursor-pointer text-center transition-all duration-200 active:scale-[0.98] bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)] flex justify-center items-center gap-2 mt-4"
          >
            {isLoading ? (
              <><Loader2 size={18} className="animate-spin" /> Menyimpan...</>
            ) : (
              <><Save size={18} /> Simpan Perubahan</>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default TechnicianProfile;

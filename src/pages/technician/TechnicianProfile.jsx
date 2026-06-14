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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem', color: '#64748b' }}>
        <Loader2 size={40} className="spin" style={{ color: '#ff6b00' }} />
        <span>Memuat profil teknisi...</span>
        <style>{`
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out', paddingBottom: '2rem' }}>
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
        {isEditing && (
          <button 
            onClick={() => {
              setIsEditing(false);
              setPreviewUrl('');
            }}
            style={{ background: '#f1f5f9', border: 'none', borderRadius: '12px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ArrowLeft size={20} color="#0f172a" />
          </button>
        )}
        <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
          {isEditing ? 'Edit Profil' : 'Profil Saya'}
        </h2>
      </div>

      {!isEditing ? (
        /* READ ONLY PROFILE VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Avatar Container */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <div style={{ 
              width: '100px', height: '100px', 
              backgroundColor: '#fff7ed', 
              borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              border: '4px solid white', 
              boxShadow: '0 8px 30px rgba(249, 115, 22, 0.12)', 
              overflow: 'hidden' 
            }}>
              {techUser.profilePicture ? (
                <img 
                  src={`http://localhost:5000${techUser.profilePicture}`} 
                  alt="Avatar" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <User size={48} color="#f97316" />
              )}
            </div>
          </div>
          
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: '#0f172a' }}>{techUser.name}</h2>
          <p style={{ color: '#ff6b00', fontWeight: '700', fontSize: '0.85rem', margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {translateRole(techUser.role)}
          </p>

          {/* Details Card */}
          <div className="tech-card tech-card-blue" style={{ width: '100%', padding: '1.2rem', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FileText size={18} color="#2563eb" style={{ opacity: 0.8 }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>ID PEGAWAI</span>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                    TK-{techUser.email.split('@')[0].toUpperCase()}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={18} color="#2563eb" style={{ opacity: 0.8 }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>ALAMAT EMAIL</span>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{techUser.email}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={18} color="#2563eb" style={{ opacity: 0.8 }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>NOMOR TELEPON</span>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                    {techUser.phone || 'Belum diisi'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              onClick={() => setIsEditing(true)}
              className="btn-full btn-orange"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              <Edit2 size={18} /> Edit Profil
            </button>
            
            <button 
              onClick={handleLogout}
              className="btn-full" 
              style={{ backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              <LogOut size={18} /> Logout Akun
            </button>
          </div>
        </div>
      ) : (
        /* INTERACTIVE PROFILE EDIT FORM */
        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Avatar Upload Container */}
          <div style={{ alignSelf: 'center', position: 'relative', marginBottom: '1rem' }}>
            <div style={{ 
              width: '100px', height: '100px', 
              backgroundColor: '#fff7ed', 
              borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              border: '4px solid white', 
              boxShadow: '0 8px 30px rgba(249, 115, 22, 0.12)', 
              overflow: 'hidden' 
            }}>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : techUser.profilePicture ? (
                <img src={`http://localhost:5000${techUser.profilePicture}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={48} color="#f97316" />
              )}
            </div>

            {/* Upload Button Overlay */}
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              backgroundColor: '#ff6b00', color: 'white',
              borderRadius: '50%', padding: '6px',
              boxShadow: '0 4px 10px rgba(255, 107, 0, 0.3)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
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
                style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#475569' }}>Nama Lengkap</label>
              <input 
                type="text" 
                name="name"
                defaultValue={techUser.name}
                required
                placeholder="Masukkan nama lengkap"
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#475569' }}>Alamat Email</label>
              <input 
                type="email" 
                name="email"
                defaultValue={techUser.email}
                required
                placeholder="Masukkan alamat email"
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#475569' }}>Nomor Telepon</label>
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
            className="btn-full btn-orange"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '1rem' }}
          >
            {isLoading ? (
              <><Loader2 size={18} className="spin" /> Menyimpan...</>
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

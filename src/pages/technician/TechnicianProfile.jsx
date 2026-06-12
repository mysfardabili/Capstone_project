import React, { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TechnicianProfile = () => {
  const navigate = useNavigate();
  const [techUser, setTechUser] = useState({
    name: 'Teknisi',
    email: 'teknisi@amk.com',
    role: 'technician'
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setTechUser(JSON.parse(savedUser));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const translateRole = (role) => {
    if (role === 'technician') return 'Teknisi Lapangan - BioMed';
    if (role === 'admin') return 'Administrator Sistem';
    return role;
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out', textAlign: 'center', paddingTop: '2rem' }}>
      <div style={{ width: '100px', height: '100px', backgroundColor: '#e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
        <User size={48} color="#9ca3af" />
      </div>
      
      <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>{techUser.name}</h2>
      <p style={{ color: '#6b7280', margin: '0 0 2rem 0' }}>{translateRole(techUser.role)}</p>

      <div style={{ textAlign: 'left', backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
        <p style={{ margin: '0 0 1rem 0' }}><strong>ID Pegawai:</strong> TK-{techUser.email.split('@')[0].toUpperCase()}</p>
        <p style={{ margin: '0 0 1rem 0' }}><strong>Email:</strong> {techUser.email}</p>
        <p style={{ margin: '0' }}><strong>No. HP:</strong> 0812-3456-7890 (Kantor)</p>
      </div>

      <button 
        onClick={handleLogout}
        className="btn-full" 
        style={{ background: '#ff4d4f', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default TechnicianProfile;

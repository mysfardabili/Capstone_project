import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TechnicianProfile = () => {
  const navigate = useNavigate();

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out', textAlign: 'center', paddingTop: '2rem' }}>
      <div style={{ width: '100px', height: '100px', backgroundColor: '#e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
        <User size={48} color="#9ca3af" />
      </div>
      
      <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Nanami Kento</h2>
      <p style={{ color: '#6b7280', margin: '0 0 2rem 0' }}>Senior Technician - BioMed</p>

      <div style={{ textAlign: 'left', backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
        <p style={{ margin: '0 0 1rem 0' }}><strong>ID Pegawai:</strong> TK-20934</p>
        <p style={{ margin: '0 0 1rem 0' }}><strong>Email:</strong> nanami@amk.com</p>
        <p style={{ margin: '0' }}><strong>No. HP:</strong> 0812-3456-7890</p>
      </div>

      <button 
        onClick={() => navigate('/login')}
        className="btn-full" 
        style={{ background: '#ff4d4f', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default TechnicianProfile;

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <ShieldAlert size={120} color="#cbd5e1" style={{ marginBottom: '2rem' }} />
      <h1 style={{ fontSize: '4rem', margin: '0 0 1rem 0', color: '#0f172a', fontWeight: '800' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#334155' }}>Halaman Tidak Ditemukan</h2>
      <p style={{ color: '#64748b', maxWidth: '500px', marginBottom: '2.5rem', lineHeight: '1.6' }}>
        Maaf, rute yang Anda tuju tidak tersedia atau telah dipindahkan. Silakan kembali ke halaman utama untuk melanjutkan.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={18} /> Beranda
        </Link>
        <Link to="/dashboard" className="btn-primary">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

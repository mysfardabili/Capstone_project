import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
        profilePicture: response.profilePicture || null,
      }));

      if (response.role === 'technician') {
        navigate('/technician');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login gagal, silakan periksa kembali email dan kata sandi Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo" style={{ marginBottom: '1rem' }}>
            <img 
              src="/asetra-oren.png" 
              alt="Logo ASETRA" 
              style={{ width: '200px', objectFit: 'contain' }} 
            />
          </div>
          <h2>Selamat Datang Kembali</h2>
          <p>Silakan masuk ke akun Anda</p>
        </div>
        
        {errorMsg && (
          <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: '500' }}>
            {errorMsg}
          </div>
        )}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email / ID Pengguna</label>
            <input 
              type="text" 
              id="email"
              className="form-input" 
              placeholder="Masukkan email atau ID Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <input 
              type="password" 
              id="password"
              className="form-input" 
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-login" disabled={isSubmitting}>
            {isSubmitting ? 'Memproses Masuk...' : 'Masuk'}
          </button>
        </form>

        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default Login;

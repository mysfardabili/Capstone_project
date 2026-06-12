import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy login logic
    if (email && password) {
      if (email.toLowerCase().includes('teknisi')) {
        navigate('/technician');
      } else {
        navigate('/dashboard');
      }
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
          
          <button type="submit" className="btn-login">Masuk</button>
        </form>

        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default Login;

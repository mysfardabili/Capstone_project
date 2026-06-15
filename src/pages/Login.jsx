import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-200 p-3 md:p-4">
      <div className="bg-white/95 backdrop-blur-[10px] p-6 md:p-12 rounded-custom-lg shadow-custom-lg w-full max-w-[450px] border border-white/50">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/asetra-oren.png" 
              alt="Logo ASETRA" 
              className="w-[160px] md:w-[200px] object-contain"
            />
          </div>
          <h2 className="text-xl md:text-[1.75rem] text-text-main mb-2">Selamat Datang Kembali</h2>
          <p className="text-text-muted">Silakan masuk ke akun Anda</p>
        </div>
        
        {errorMsg && (
          <div className="text-red-500 bg-red-100 p-3 rounded-[10px] mb-4 text-sm text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-text-main">Email / ID Pengguna</label>
            <input 
              type="text" 
              id="email"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md outline-none transition-[border-color,box-shadow] duration-200 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)] bg-surface text-text-main" 
              placeholder="Masukkan email atau ID Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-text-main">Kata Sandi</label>
            <input 
              type="password" 
              id="password"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md outline-none transition-[border-color,box-shadow] duration-200 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)] bg-surface text-text-main" 
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="bg-orange-500 text-white py-[0.875rem] rounded-custom-md font-semibold text-base transition-colors duration-200 mt-2 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-70" disabled={isSubmitting}>
            {isSubmitting ? 'Memproses Masuk...' : 'Masuk'}
          </button>
        </form>

        <Link to="/" className="flex items-center justify-center gap-2 mt-6 text-text-muted text-sm hover:text-orange-500 transition-colors">
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default Login;

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-gray-900 p-4 md:p-8 text-center">
      <ShieldAlert size={80} className="md:size-[120px] text-slate-300 dark:text-slate-600 mb-6 md:mb-8" />
      <h1 className="text-[3rem] md:text-[4rem] font-extrabold m-0 mb-4 text-slate-900 dark:text-white">404</h1>
      <h2 className="text-2xl font-bold m-0 mb-4 text-slate-700 dark:text-slate-300">Halaman Tidak Ditemukan</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-[500px] mb-10 leading-relaxed">
        Maaf, rute yang Anda tuju tidak tersedia atau telah dipindahkan. Silakan kembali ke halaman utama untuk melanjutkan.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
        <Link to="/" className="bg-transparent text-text-main border border-border px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-background hover:border-text-muted transition-all duration-200 justify-center">
          <ArrowLeft size={18} /> Beranda
        </Link>
        <Link to="/dashboard" className="bg-primary text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-primary-dark transition-colors duration-200 justify-center">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

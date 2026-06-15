import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Activity, Database, AlertTriangle, 
  RefreshCw, QrCode, ShieldPlus, ChevronDown,
  MapPin, Mail, Phone, ScanLine, Smartphone, CheckCircle, ShieldAlert, Bell,
  Moon, Sun
} from 'lucide-react';

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const faqs = [
    {
      question: "Apa manfaat utama dari sistem ini?",
      answer: "Sistem ini membantu rumah sakit menghemat waktu pencarian alat, mengurangi risiko kehilangan aset, dan memastikan jadwal kalibrasi alat medis selalu tepat waktu sehingga pelayanan pasien menjadi lebih optimal."
    },
    {
      question: "Apakah sistem dapat diakses melalui smartphone?",
      answer: "Tentu saja! Asetra memiliki desain responsif dan menyediakan akses khusus bagi teknisi maupun staf untuk memantau status alat serta melakukan scan QR Code langsung dari browser smartphone tanpa perlu menginstal aplikasi tambahan."
    },
    {
      question: "Bagaimana cara kerja fitur QR Code?",
      answer: "Setiap alat medis akan ditempelkan stiker QR Code unik. Saat dipindai dengan smartphone, sistem akan langsung menampilkan halaman detail yang berisi spesifikasi, riwayat perbaikan, manual book, dan tombol pelaporan kerusakan."
    }
  ];

  return (
    <div className="font-jakarta text-stone-900 dark:text-slate-100 bg-white dark:bg-slate-900 min-h-screen overflow-x-hidden leading-relaxed">
      
      {/* Container for Top Nav and Hero */}
      <div className="max-w-[1200px] mx-auto px-8">
        
        {/* Navbar */}
        <nav className="flex justify-between items-center py-6 border-b border-stone-200 dark:border-slate-700">
          <div className="nav-logo">
            <img 
              src="/asetra-oren.png" 
              alt="Logo ASETRA" 
              className="h-[45px] object-contain"
            />
          </div>
          <div className="max-md:hidden flex gap-10 items-center">
            <a href="#beranda" className="text-stone-600 dark:text-slate-300 font-bold text-sm hover:text-orange-500 transition-colors">Beranda</a>
            <a href="#fitur" className="text-stone-600 dark:text-slate-300 font-bold text-sm hover:text-orange-500 transition-colors">Fitur</a>
            <a href="#tentang" className="text-stone-600 dark:text-slate-300 font-bold text-sm hover:text-orange-500 transition-colors">Tentang</a>
            <a href="#faq" className="text-stone-600 dark:text-slate-300 font-bold text-sm hover:text-orange-500 transition-colors">FaQ</a>
            <a href="#kontak" className="text-stone-600 dark:text-slate-300 font-bold text-sm hover:text-orange-500 transition-colors">Kontak</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="bg-stone-100 dark:bg-slate-700 p-2.5 rounded-full flex items-center justify-center transition-colors border-none cursor-pointer"
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-stone-600" />}
            </button>
            <Link to="/login" className="bg-orange-500 text-white px-6 py-3 rounded-[30px] font-bold inline-flex items-center gap-2 border-none cursor-pointer transition-all duration-200 shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600 hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)]">
              Login
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="beranda" className="py-10 pb-16 md:py-16 md:pb-24 flex items-center justify-between gap-16">
          <div className="flex-1">
            <div className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-[6px] rounded-[20px] text-sm font-bold mb-6">Sistem Informasi Manajemen Aset Rumah Sakit</div>
            <h1 className="text-[3.5rem] font-extrabold leading-[1.15] mb-6 tracking-tight max-md:text-[2.5rem]">Kelola Aset Medis Rumah Sakit dengan Lebih Cepat dan <span className="text-orange-500">Terintegrasi</span></h1>
            <p className="text-lg mb-8 max-w-[500px]">
              Asetra membantu rumah sakit dalam mengelola aset medis secara terpusat, memantau kondisi, melakukan permintaan, perbaikan, mutasi, hingga identifikasi aset dengan QR Code.
            </p>
            <Link to="/login" className="bg-orange-500 text-white px-8 py-4 rounded-[30px] font-bold inline-flex items-center gap-2 border-none cursor-pointer transition-all duration-200 shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600 hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] text-lg mt-4">
              Explore Dashboard <ArrowRight size={20} />
            </Link>
            
            <div className="flex gap-x-6 gap-y-3 mt-12 flex-wrap">
              <span className="flex items-center gap-2 text-sm font-bold text-stone-500 dark:text-slate-300"><Activity size={16} className="text-orange-500 bg-orange-100 dark:bg-orange-900/30 p-1 rounded-full" /> Real-time Monitoring</span>
              <span className="flex items-center gap-2 text-sm font-bold text-stone-500 dark:text-slate-300"><QrCode size={16} className="text-orange-500 bg-orange-100 dark:bg-orange-900/30 p-1 rounded-full" /> QR Code Scanner</span>
              <span className="flex items-center gap-2 text-sm font-bold text-stone-500 dark:text-slate-300"><Smartphone size={16} className="text-orange-500 bg-orange-100 dark:bg-orange-900/30 p-1 rounded-full" /> Akses Mobile</span>
            </div>
          </div>
          
          <div className="max-md:hidden flex-1 relative flex justify-end">
            <div className="flex items-center justify-center">
              <img src="/hero-mockup.png" alt="Asetra Dashboard Mockup" className="w-[120%] max-w-[750px] object-contain translate-x-[5%]" />
            </div>
          </div>
        </section>

      </div>

      {/* Fitur Utama */}
      <section id="fitur" className="bg-stone-50 dark:bg-slate-800 py-24 border-t border-stone-100 dark:border-slate-700">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-xl text-xs font-extrabold tracking-wider mb-4">+ FITUR UTAMA</span>
            <h2 className="text-[2.2rem] font-extrabold mb-4">Semua yang Anda Butuhkan dalam Satu Sistem</h2>
            <p className="max-w-[600px] mx-auto">Asetra merupakan sistem informasi manajemen aset rumah sakit berbasis web dan mobile yang membantu rumah sakit dalam mengelola aset medis secara terpusat, modern, dan terintegrasi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-700 border border-stone-100 dark:border-slate-600 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-200">
              <div className="w-[50px] h-[50px] bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6"><Database size={24} /></div>
              <h3 className="text-lg font-extrabold mb-2">Manajemen Aset Terpusat</h3>
              <p className="text-sm dark:text-slate-300">Kelola seluruh data aset medis secara terpusat dan mudah diakses kapan saja.</p>
            </div>
            <div className="bg-white dark:bg-slate-700 border border-stone-100 dark:border-slate-600 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-200">
              <div className="w-[50px] h-[50px] bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6"><ShieldPlus size={24} /></div>
              <h3 className="text-lg font-extrabold mb-2">Permintaan Aset</h3>
              <p className="text-sm dark:text-slate-300">Ajukan permintaan aset baru atau penggantian dengan proses yang terstruktur.</p>
            </div>
            <div className="bg-white dark:bg-slate-700 border border-stone-100 dark:border-slate-600 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-200">
              <div className="w-[50px] h-[50px] bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6"><WrenchIcon /></div>
              <h3 className="text-lg font-extrabold mb-2">Perbaikan Aset</h3>
              <p className="text-sm dark:text-slate-300">Laporkan kerusakan aset dan pantau proses perbaikan hingga selesai.</p>
            </div>
            <div className="bg-white dark:bg-slate-700 border border-stone-100 dark:border-slate-600 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-200">
              <div className="w-[50px] h-[50px] bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6"><RefreshCw size={24} /></div>
              <h3 className="text-lg font-extrabold mb-2">Mutasi Aset</h3>
              <p className="text-sm dark:text-slate-300">Kelola perpindahan aset antar ruangan atau unit kerja dengan mudah.</p>
            </div>
            <div className="bg-white dark:bg-slate-700 border border-stone-100 dark:border-slate-600 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-200">
              <div className="w-[50px] h-[50px] bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6"><QrCode size={24} /></div>
              <h3 className="text-lg font-extrabold mb-2">QR Code Scanner</h3>
              <p className="text-sm dark:text-slate-300">Identifikasi aset dengan cepat menggunakan kamera smartphone.</p>
            </div>
            <div className="bg-white dark:bg-slate-700 border border-stone-100 dark:border-slate-600 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-200">
              <div className="w-[50px] h-[50px] bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6"><BellIcon /></div>
              <h3 className="text-lg font-extrabold mb-2">Notifikasi Real-time</h3>
              <p className="text-sm dark:text-slate-300">Dapatkan notifikasi instan untuk setiap aktivitas penting terkait aset.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Banner */}
      <div className="py-16 bg-slate-50 dark:bg-slate-800/50">
        <div className="text-center mb-8">
          <h2 className="text-[1.8rem] font-extrabold">Informasi Aset Lebih Akurat</h2>
          <p className="text-stone-500 dark:text-slate-400">Pantau kondisi dan aktivitas aset rumah sakit secara real-time melalui dashboard yang modern dan terintegrasi.</p>
        </div>
        <div className="max-w-[900px] mx-auto px-8">
          <img src="/hero-mockup.png" alt="Hospital Context" className="w-full rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]" />
        </div>
      </div>

      {/* Cara Kerja */}
      <section className="py-20 bg-orange-50 dark:bg-slate-800/30">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-[2.2rem] font-extrabold mb-4">Cara Kerja Asetra</h2>
            <p className="max-w-[600px] mx-auto">Alur kerja sederhana untuk produktivitas maksimal.</p>
          </div>

          <div className="flex justify-between gap-4 relative mt-12 flex-col md:flex-row">
            <div className="hidden md:block absolute top-1/2 left-[5%] right-[5%] h-[2px] bg-[repeating-linear-gradient(to_right,#d6d3d1_0,#d6d3d1_50%,transparent_50%,transparent_10px)] dark:bg-[repeating-linear-gradient(to_right,#475569_0,#475569_50%,transparent_50%,transparent_10px)] z-0"></div>
            
            <div className="flex-1 bg-white dark:bg-slate-700 rounded-2xl px-4 py-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)] relative z-10">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4"><ScanLine size={24} /></div>
              <h4 className="text-[0.85rem] text-orange-600 dark:text-orange-400 uppercase font-extrabold mb-2">LANGKAH 1</h4>
              <h3 className="text-base font-extrabold mb-2">Scan QR Code Aset</h3>
              <p className="text-xs text-stone-500 dark:text-slate-300">Pindai label QR pada alat medis dengan web asetra.</p>
            </div>
            <div className="flex-1 bg-white dark:bg-slate-700 rounded-2xl px-4 py-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)] relative z-10">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4"><Database size={24} /></div>
              <h4 className="text-[0.85rem] text-orange-600 dark:text-orange-400 uppercase font-extrabold mb-2">LANGKAH 2</h4>
              <h3 className="text-base font-extrabold mb-2">Lihat Detail</h3>
              <p className="text-xs text-stone-500 dark:text-slate-300">Akses status, riwayat, dan manual alat.</p>
            </div>
            <div className="flex-1 bg-white dark:bg-slate-700 rounded-2xl px-4 py-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)] relative z-10">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} /></div>
              <h4 className="text-[0.85rem] text-orange-600 dark:text-orange-400 uppercase font-extrabold mb-2">LANGKAH 3</h4>
              <h3 className="text-base font-extrabold mb-2">Lapor/Mutasi</h3>
              <p className="text-xs text-stone-500 dark:text-slate-300">Ajukan perbaikan atau pindahkan unit.</p>
            </div>
            <div className="flex-1 bg-white dark:bg-slate-700 rounded-2xl px-4 py-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)] relative z-10">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4"><Bell size={24} /></div>
              <h4 className="text-[0.85rem] text-orange-600 dark:text-orange-400 uppercase font-extrabold mb-2">LANGKAH 4</h4>
              <h3 className="text-base font-extrabold mb-2">Notifikasi Alert</h3>
              <p className="text-xs text-stone-500 dark:text-slate-300">Teknisi menerima pesan peringatan secara real-time.</p>
            </div>
            <div className="flex-1 bg-white dark:bg-slate-700 rounded-2xl px-4 py-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)] relative z-10">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4"><CheckCircle size={24} /></div>
              <h4 className="text-[0.85rem] text-orange-600 dark:text-orange-400 uppercase font-extrabold mb-2">LANGKAH 5</h4>
              <h3 className="text-base font-extrabold mb-2">Monitoring</h3>
              <p className="text-xs text-stone-500 dark:text-slate-300">Pantau progress pengerjaan real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Akses & Komparasi */}
      <section className="bg-orange-50 dark:bg-slate-800/30 py-20 text-center">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-[2.2rem] font-extrabold mb-4">Akses Berdasarkan Peran</h2>
            <p className="max-w-[600px] mx-auto">Personalisasi tampilan untuk efisiensi kerja tim.</p>
          </div>

          <div className="flex gap-8 justify-center mb-24 flex-col md:flex-row items-center">
            <div className="bg-white dark:bg-slate-700 rounded-[20px] p-12 pt-12 w-full max-w-[400px] text-left shadow-[0_10px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <ShieldPlus size={40} color="#f97316" />
              <h3 className="text-xl mt-4 mb-2">Admin</h3>
              <p className="text-[0.9rem] dark:text-slate-300">Kontrol penuh pengelolaan data aset, manajemen user, dan konfigurasi sistem.</p>
              <span className="text-[0.7rem] font-extrabold text-orange-600 dark:text-orange-400 mt-6 block">FULL CONTROL</span>
            </div>
            <div className="bg-white dark:bg-slate-700 rounded-[20px] p-12 pt-12 w-full max-w-[400px] text-left shadow-[0_10px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <WrenchIcon size={40} color="#f97316" />
              <h3 className="text-xl mt-4 mb-2">Teknisi</h3>
              <p className="text-[0.9rem] dark:text-slate-300">Kelola work-order pemeliharaan berkala dan update status perbaikan alat.</p>
              <span className="text-[0.7rem] font-extrabold text-orange-600 dark:text-orange-400 mt-6 block">MAINTENANCE</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-[2.2rem] font-extrabold mb-4">Tinggalkan Cara Lama, Sambut Efisiensi<br/>Digital Terpadu</h2>
          </div>

          <div className="flex gap-8 justify-center mt-12 flex-col md:flex-row items-center">
            <div className="bg-white dark:bg-slate-700 rounded-[20px] p-10 w-full max-w-[450px] text-left shadow-[0_10px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)]" style={{ borderTop: '4px solid #ef4444' }}>
              <div className="flex items-center gap-3 mb-6 font-extrabold text-lg">
                <ShieldAlert size={28} color="#ef4444" /> Sistem Manual (Lama)
              </div>
              <ul className="list-none p-0 m-0">
                <li className="mb-3 text-sm relative pl-[15px] text-stone-500 dark:text-slate-300 before:content-['•'] before:absolute before:left-0 before:text-stone-900 dark:before:text-slate-300">Risiko human error tinggi</li>
                <li className="mb-3 text-sm relative pl-[15px] text-stone-500 dark:text-slate-300 before:content-['•'] before:absolute before:left-0 before:text-stone-900 dark:before:text-slate-300">Pelaporan kerusakan lambat</li>
                <li className="mb-3 text-sm relative pl-[15px] text-stone-500 dark:text-slate-300 before:content-['•'] before:absolute before:left-0 before:text-stone-900 dark:before:text-slate-300">Data aset tidak sinkron antar divisi</li>
                <li className="mb-3 text-sm relative pl-[15px] text-stone-500 dark:text-slate-300 before:content-['•'] before:absolute before:left-0 before:text-stone-900 dark:before:text-slate-300">Sulit melacak riwayat pemeliharaan</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-700 rounded-[20px] p-10 w-full max-w-[450px] text-left shadow-[0_10px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)]" style={{ borderTop: '4px solid #f97316' }}>
              <div className="flex items-center gap-3 mb-6 font-extrabold text-lg">
                <Activity size={28} color="#f97316" /> Asetra Digital (Baru)
              </div>
              <ul className="list-none p-0 m-0">
                <li className="mb-3 text-sm relative pl-[15px] text-stone-500 dark:text-slate-300 before:content-['•'] before:absolute before:left-0 before:text-stone-900 dark:before:text-slate-300">Automasi data real-time</li>
                <li className="mb-3 text-sm relative pl-[15px] text-stone-500 dark:text-slate-300 before:content-['•'] before:absolute before:left-0 before:text-stone-900 dark:before:text-slate-300">Lapor kerusakan instan via mobile</li>
                <li className="mb-3 text-sm relative pl-[15px] text-stone-500 dark:text-slate-300 before:content-['•'] before:absolute before:left-0 before:text-stone-900 dark:before:text-slate-300">Single Source of Truth terpusat</li>
                <li className="mb-3 text-sm relative pl-[15px] text-stone-500 dark:text-slate-300 before:content-['•'] before:absolute before:left-0 before:text-stone-900 dark:before:text-slate-300">Penjadwalan maintenance prediktif</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-orange-50 dark:bg-slate-800/30 pb-32">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-[2.2rem] font-extrabold mb-4">Pertanyaan Umum</h2>
          </div>
          
          <div className="max-w-[800px] mx-auto flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-700 rounded-2xl px-8 py-6 flex flex-col cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all duration-300" 
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">{faq.question}</h3>
                  <ChevronDown 
                    size={24} 
                    className="text-stone-400 dark:text-slate-400 transition-transform duration-300"
                    style={{ 
                      transform: activeFaq === index ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} 
                  />
                </div>
                {activeFaq === index && (
                  <div className="mt-4 text-stone-500 dark:text-slate-300 text-sm leading-relaxed border-t border-stone-100 dark:border-slate-600 pt-4 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / CTA Area */}
      <section className="bg-orange-50 dark:bg-slate-800/30">
        
        {/* Floating CTA Banner */}
        <div className="max-w-[1200px] mx-auto px-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-[1200px] mx-auto bg-white dark:bg-slate-700 rounded-3xl px-8 md:pl-16 shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] md:translate-y-[-50px] overflow-hidden">
            <div className="flex-1 py-8 md:py-16 md:pr-16">
              <h2 className="text-[2.2rem] font-extrabold leading-tight mb-4">Tingkatkan Efisiensi<br/>Pengelolaan Aset Rumah<br/>Sakit Bersama <span className="text-orange-500">Asetra</span></h2>
              <p className="my-4 mb-8 text-lg dark:text-slate-300">Kelola aset medis, maintenance, dan monitoring secara real-time dalam satu sistem terintegrasi.</p>
              <Link to="/login" className="bg-orange-500 text-white px-10 py-4 rounded-[30px] font-bold inline-flex items-center gap-2 border-none cursor-pointer transition-all duration-200 shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600 hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] text-xl">
                Login
              </Link>
            </div>
            <div className="max-md:hidden flex-1 h-[300px] md:h-[400px] bg-cover bg-center md:[clip-path:polygon(15%_0,100%_0,100%_100%,0%_100%)]"></div>
          </div>
        </div>

        {/* Real Footer Links */}
        <footer className="max-w-[1200px] mx-auto p-8 flex flex-col md:flex-row justify-between border-t border-orange-200 dark:border-slate-600 mt-8 gap-8">
          <div className="flex-1">
            <img src="/asetra-oren.png" alt="ASETRA" className="h-[30px] mb-6" />
            <h4 className="font-extrabold mb-4">Kontak</h4>
            <p className="dark:text-slate-300"><MapPin size={16} color="#ea580c"/> PT Adi Multi Kalibrasi</p>
            <p className="dark:text-slate-300"><Mail size={16} color="#ea580c"/> Info@Asetra.id</p>
            <p className="dark:text-slate-300"><Phone size={16} color="#ea580c"/> +62 8xx xxxx xxxx</p>
          </div>
          
          <div className="flex-[0.5]">
            <h4 className="font-extrabold mb-4">Menu</h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-2"><a href="#beranda" className="text-stone-500 dark:text-slate-300 text-sm font-semibold">Beranda</a></li>
              <li className="mb-2"><a href="#tentang" className="text-stone-500 dark:text-slate-300 text-sm font-semibold">Tentang</a></li>
              <li className="mb-2"><a href="#fitur" className="text-stone-500 dark:text-slate-300 text-sm font-semibold">Fitur</a></li>
              <li className="mb-2"><a href="#beranda" className="text-stone-500 dark:text-slate-300 text-sm font-semibold">Monitoring</a></li>
              <li className="mb-2"><a href="#kontak" className="text-stone-500 dark:text-slate-300 text-sm font-semibold">Kontak</a></li>
              <li className="mb-2"><Link to="/login" className="text-stone-500 dark:text-slate-300 text-sm font-semibold">Login</Link></li>
            </ul>
          </div>

          <div className="flex-1">
            <h4 className="font-extrabold mb-4">Fitur Utama</h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-2"><a href="#" className="text-stone-500 dark:text-slate-300 text-sm font-semibold">Dashboard Aset</a></li>
              <li className="mb-2"><a href="#" className="text-stone-500 dark:text-slate-300 text-sm font-semibold">QR Code Scanner</a></li>
              <li className="mb-2"><a href="#" className="text-stone-500 dark:text-slate-300 text-sm font-semibold">Monitoring Aset</a></li>
              <li className="mb-2"><a href="#" className="text-stone-500 dark:text-slate-300 text-sm font-semibold">Mutasi Aset</a></li>
              <li className="mb-2"><a href="#" className="text-stone-500 dark:text-slate-300 text-sm font-semibold">Permintaan Perbaikan</a></li>
              <li className="mb-2"><a href="#" className="text-stone-500 dark:text-slate-300 text-sm font-semibold">Permintaan Aset</a></li>
            </ul>
          </div>
        </footer>
      </section>

    </div>
  );
};

// Helper internal icons to avoid cluttering imports
const WrenchIcon = ({size=24, color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const BellIcon = ({size=24, color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;

export default LandingPage;

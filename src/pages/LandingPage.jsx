import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Activity, Database, AlertTriangle, 
  RefreshCw, QrCode, ShieldPlus, ChevronDown,
  MapPin, Mail, Phone, ScanLine, Smartphone, CheckCircle, ShieldAlert, Bell
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

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
    <div className="landing-page-wrapper">
      
      {/* Container for Top Nav and Hero */}
      <div className="container">
        
        {/* Navbar */}
        <nav className="landing-navbar">
          <div className="nav-logo">
            <img 
              src="/asetra-oren.png" 
              alt="Logo ASETRA" 
              style={{ height: '45px', objectFit: 'contain' }} 
            />
          </div>
          <div className="nav-links phone-hide">
            <a href="#beranda">Beranda</a>
            <a href="#fitur">Fitur</a>
            <a href="#tentang">Tentang</a>
            <a href="#faq">FaQ</a>
            <a href="#kontak">Kontak</a>
          </div>
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        </nav>

        {/* Hero Section */}
        <section id="beranda" className="hero-section">
          <div className="hero-left">
            <div className="hero-badge">Sistem Informasi Manajemen Aset Rumah Sakit</div>
            <h1>Kelola Aset Medis Rumah Sakit dengan Lebih Cepat dan <span className="text-orange">Terintegrasi</span></h1>
            <p>
              Asetra membantu rumah sakit dalam mengelola aset medis secara terpusat, memantau kondisi, melakukan permintaan, perbaikan, mutasi, hingga identifikasi aset dengan QR Code.
            </p>
            <Link to="/login" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', marginTop: '1rem' }}>
              Explore Dashboard <ArrowRight size={20} />
            </Link>
            
            <div className="hero-tags">
              <span className="hero-tag"><Activity size={16} /> Real-time Monitoring</span>
              <span className="hero-tag"><QrCode size={16} /> QR Code Scanner</span>
              <span className="hero-tag"><Smartphone size={16} /> Akses Mobile</span>
            </div>
          </div>
          
          <div className="hero-right phone-hide">
            <div className="hero-mockup-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/hero-mockup.png" alt="Asetra Dashboard Mockup" style={{ width: '120%', maxWidth: '750px', objectFit: 'contain', transform: 'translateX(5%)' }} />
            </div>
          </div>
        </section>

      </div>

      {/* Fitur Utama */}
      <section id="fitur" className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">+ FITUR UTAMA</span>
            <h2>Semua yang Anda Butuhkan dalam Satu Sistem</h2>
            <p>Asetra merupakan sistem informasi manajemen aset rumah sakit berbasis web dan mobile yang membantu rumah sakit dalam mengelola aset medis secara terpusat, modern, dan terintegrasi.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-box"><Database size={24} /></div>
              <h3>Manajemen Aset Terpusat</h3>
              <p>Kelola seluruh data aset medis secara terpusat dan mudah diakses kapan saja.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-box"><ShieldPlus size={24} /></div>
              <h3>Permintaan Aset</h3>
              <p>Ajukan permintaan aset baru atau penggantian dengan proses yang terstruktur.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-box"><WrenchIcon /></div>
              <h3>Perbaikan Aset</h3>
              <p>Laporkan kerusakan aset dan pantau proses perbaikan hingga selesai.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-box"><RefreshCw size={24} /></div>
              <h3>Mutasi Aset</h3>
              <p>Kelola perpindahan aset antar ruangan atau unit kerja dengan mudah.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-box"><QrCode size={24} /></div>
              <h3>QR Code Scanner</h3>
              <p>Identifikasi aset dengan cepat menggunakan kamera smartphone.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-box"><BellIcon /></div>
              <h3>Notifikasi Real-time</h3>
              <p>Dapatkan notifikasi instan untuk setiap aktivitas penting terkait aset.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Banner */}
      <div className="image-divider" style={{ padding: '4rem 0', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Informasi Aset Lebih Akurat</h2>
          <p>Pantau kondisi dan aktivitas aset rumah sakit secara real-time melalui dashboard yang modern dan terintegrasi.</p>
        </div>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          <img src="/hero-mockup.png" alt="Hospital Context" style={{ width: '100%', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }} />
        </div>
      </div>

      {/* Cara Kerja */}
      <section className="steps-section">
        <div className="container">
          <div className="section-header">
            <h2>Cara Kerja Asetra</h2>
            <p>Alur kerja sederhana untuk produktivitas maksimal.</p>
          </div>

          <div className="steps-container">
            <div className="steps-line"></div>
            
            <div className="step-card">
              <div className="step-icon"><ScanLine size={24} /></div>
              <h4>LANGKAH 1</h4>
              <h3>Scan QR Code Aset</h3>
              <p>Pindai label QR pada alat medis dengan web asetra.</p>
            </div>
            <div className="step-card">
              <div className="step-icon"><Database size={24} /></div>
              <h4>LANGKAH 2</h4>
              <h3>Lihat Detail</h3>
              <p>Akses status, riwayat, dan manual alat.</p>
            </div>
            <div className="step-card">
              <div className="step-icon"><AlertTriangle size={24} /></div>
              <h4>LANGKAH 3</h4>
              <h3>Lapor/Mutasi</h3>
              <p>Ajukan perbaikan atau pindahkan unit.</p>
            </div>
            <div className="step-card">
              <div className="step-icon"><Bell size={24} /></div>
              <h4>LANGKAH 4</h4>
              <h3>Notifikasi Alert</h3>
              <p>Teknisi menerima pesan peringatan secara real-time.</p>
            </div>
            <div className="step-card">
              <div className="step-icon"><CheckCircle size={24} /></div>
              <h4>LANGKAH 5</h4>
              <h3>Monitoring</h3>
              <p>Pantau progress pengerjaan real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Akses & Komparasi */}
      <section className="compare-section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <h2>Akses Berdasarkan Peran</h2>
            <p>Personalisasi tampilan untuk efisiensi kerja tim.</p>
          </div>

          <div className="role-cards">
            <div className="role-card">
              <ShieldPlus size={40} color="#f97316" />
              <h3>Admin</h3>
              <p style={{ fontSize: '0.9rem' }}>Kontrol penuh pengelolaan data aset, manajemen user, dan konfigurasi sistem.</p>
              <span className="role-label">FULL CONTROL</span>
            </div>
            <div className="role-card">
              <WrenchIcon size={40} color="#f97316" />
              <h3>Teknisi</h3>
              <p style={{ fontSize: '0.9rem' }}>Kelola work-order pemeliharaan berkala dan update status perbaikan alat.</p>
              <span className="role-label">MAINTENANCE</span>
            </div>
          </div>

          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <h2>Tinggalkan Cara Lama, Sambut Efisiensi<br/>Digital Terpadu</h2>
          </div>

          <div className="compare-cards">
            <div className="comp-card" style={{ borderTop: '4px solid #ef4444' }}>
              <div className="comp-header">
                <ShieldAlert size={28} color="#ef4444" /> Sistem Manual (Lama)
              </div>
              <ul>
                <li>Risiko human error tinggi</li>
                <li>Pelaporan kerusakan lambat</li>
                <li>Data aset tidak sinkron antar divisi</li>
                <li>Sulit melacak riwayat pemeliharaan</li>
              </ul>
            </div>
            <div className="comp-card" style={{ borderTop: '4px solid #f97316' }}>
              <div className="comp-header">
                <Activity size={28} color="#f97316" /> Asetra Digital (Baru)
              </div>
              <ul>
                <li>Automasi data real-time</li>
                <li>Lapor kerusakan instan via mobile</li>
                <li>Single Source of Truth terpusat</li>
                <li>Penjadwalan maintenance prediktif</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="faq-section">
        <div className="container">
          <div className="section-header">
            <h2>Pertanyaan Umum</h2>
          </div>
          
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="faq-item" 
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <ChevronDown 
                    size={24} 
                    color="#a8a29e" 
                    style={{ 
                      transform: activeFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                </div>
                {activeFaq === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / CTA Area */}
      <section className="cta-footer-section">
        
        {/* Floating CTA Banner */}
        <div className="container" style={{ position: 'relative' }}>
          <div className="cta-banner">
            <div className="cta-content">
              <h2>Tingkatkan Efisiensi<br/>Pengelolaan Aset Rumah<br/>Sakit Bersama <span className="text-orange">Asetra</span></h2>
              <p style={{ margin: '1rem 0 2rem 0', fontSize: '1.1rem' }}>Kelola aset medis, maintenance, dan monitoring secara real-time dalam satu sistem terintegrasi.</p>
              <Link to="/login" className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.2rem' }}>
                Login
              </Link>
            </div>
            <div className="cta-image"></div>
          </div>
        </div>

        {/* Real Footer Links */}
        <footer className="footer-bottom">
          <div className="footer-col">
            <img src="/asetra-oren.png" alt="ASETRA" style={{ height: '30px', marginBottom: '1.5rem' }} />
            <h4>Kontak</h4>
            <p><MapPin size={16} color="#ea580c"/> PT Adi Multi Kalibrasi</p>
            <p><Mail size={16} color="#ea580c"/> Info@Asetra.id</p>
            <p><Phone size={16} color="#ea580c"/> +62 8xx xxxx xxxx</p>
          </div>
          
          <div className="footer-col" style={{ flex: 0.5 }}>
            <h4>Menu</h4>
            <ul className="footer-links">
              <li><a href="#beranda">Beranda</a></li>
              <li><a href="#tentang">Tentang</a></li>
              <li><a href="#fitur">Fitur</a></li>
              <li><a href="#beranda">Monitoring</a></li>
              <li><a href="#kontak">Kontak</a></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Fitur Utama</h4>
            <ul className="footer-links">
              <li><a href="#">Dashboard Aset</a></li>
              <li><a href="#">QR Code Scanner</a></li>
              <li><a href="#">Monitoring Aset</a></li>
              <li><a href="#">Mutasi Aset</a></li>
              <li><a href="#">Permintaan Perbaikan</a></li>
              <li><a href="#">Permintaan Aset</a></li>
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

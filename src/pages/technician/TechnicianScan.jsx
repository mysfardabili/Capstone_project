import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, Scan, Search, MapPin, CalendarCheck, FileOutput, CheckCircle2, RotateCcw, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const TechnicianScan = () => {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState('scanning'); // 'scanning', 'processing', 'result'
  const [assets, setAssets] = useState([]);
  const [scannedAsset, setScannedAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await api.get('/assets');
        setAssets(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    let timer;
    if (scanState === 'scanning') {
      timer = setTimeout(() => {
        setScanState('processing');
      }, 2000);
    } else if (scanState === 'processing') {
      timer = setTimeout(async () => {
        // Select random asset from database
        if (assets.length > 0) {
          const randomIndex = Math.floor(Math.random() * assets.length);
          const chosen = assets[randomIndex];
          setIsLoading(true);
          try {
            // Get full detail including histories
            const fullDetail = await api.get(`/assets/${chosen.id}`);
            setScannedAsset(fullDetail);
            setScanState('result');
          } catch (err) {
            console.error(err);
            setScanState('scanning');
          } finally {
            setIsLoading(false);
          }
        } else {
          setScanState('scanning');
        }
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [scanState, assets]);

  const renderScanning = () => (
    <div style={{ 
      position: 'relative', 
      height: 'calc(100vh - 120px)', 
      margin: '-1.5rem', 
      backgroundColor: '#000',
      backgroundImage: 'url("https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)' }}></div>

      <div style={{ position: 'relative', zIndex: 10, padding: '1.5rem', display: 'flex', alignItems: 'center', color: 'white' }}>
        <button style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: '700' }}>
          <Scan size={24} color="#f97316" /> SCAN ASET
        </button>
      </div>

      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {scanState === 'scanning' ? (
          <>
            <div className="scanner-frame">
              <div className="scanner-corner top-left"></div>
              <div className="scanner-corner top-right"></div>
              <div className="scanner-corner bottom-left"></div>
              <div className="scanner-corner bottom-right"></div>
              <div style={{ position: 'absolute', inset: '0', backdropFilter: 'blur(0px)' }}></div>
              <div className="smooth-scan-line"></div>
              <div className="scanner-flare"></div>
            </div>
            
            <div className="pulse-text" style={{ marginTop: '2rem', color: 'rgba(255,255,255,0.9)', fontWeight: '600', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={18} /> MENCARI KODE QR...
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.3s ease-out' }}>
            <div className="success-circle">
              <CheckCircle2 size={50} color="white" />
            </div>
            <h3 style={{ color: 'white', marginTop: '1rem', fontWeight: '800', letterSpacing: '1px' }}>KODE DITEMUKAN</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Membaca data aset...</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderResult = () => {
    if (!scannedAsset) return null;

    const recentRepairs = scannedAsset.repairs || [];
    const recentMutations = scannedAsset.mutations || [];
    const activities = [
      ...recentRepairs.map(r => ({
        title: `Perbaikan: ${r.description}`,
        notes: r.notes || 'Perbaikan selesai dilakukan.',
        time: new Date(r.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        pic: r.technicianName || 'Teknisi',
      })),
      ...recentMutations.map(m => ({
        title: `Mutasi Ruangan`,
        notes: `Dipindahkan dari ${m.sourceLocation} ke ${m.targetLocation}.`,
        time: new Date(m.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        pic: m.requesterName,
      })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time));

    return (
      <div style={{ animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <button 
          onClick={() => setScanState('scanning')}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#64748b', fontWeight: '700', padding: 0, marginBottom: '1.5rem', cursor: 'pointer', fontSize: '1rem' }}
        >
          <RotateCcw size={18} /> Scan Ulang
        </button>

        {/* Modern Asset Card Identity */}
        <div className="tech-card" style={{ padding: 0, marginBottom: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
            <img 
              src={scannedAsset.img || "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"} 
              alt="Asset" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', color: '#0f172a' }}>
              ID: {scannedAsset.id}
            </div>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className={`task-badge ${scannedAsset.condition === 'Baik' ? 'badge-green' : 'badge-orange'}`}>
                {scannedAsset.condition === 'Baik' ? 'Berfungsi Baik' : `Kondisi: ${scannedAsset.condition}`}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>{scannedAsset.category.toUpperCase()}</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 1rem 0', color: '#0f172a', letterSpacing: '-0.5px' }}>{scannedAsset.name}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '10px' }}><MapPin size={18} color="#f97316" /></div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>LOKASI</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#0f172a', fontWeight: '700' }}>{scannedAsset.room}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '10px' }}><CalendarCheck size={18} color="#3b82f6" /></div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>PEMBELIAN</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#0f172a', fontWeight: '700' }}>{scannedAsset.purchaseDate || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.2rem', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Log Aktivitas Terkini</h3>
        
        {/* Activity Timeline */}
        <div className="timeline-list" style={{ marginBottom: '2.5rem' }}>
          {activities.length > 0 ? (
            activities.map((act, index) => (
              <div className="timeline-card" style={{ padding: '1rem' }} key={index}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>{act.title}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: '1.5' }}>{act.notes}</p>
                <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8' }}>
                  {act.time} - Oleh: {act.pic}
                </span>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '16px' }}>Belum ada log aktivitas.</div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/technician/repairs')} className="btn-full" style={{ flex: 1, background: '#fef2f2', border: '2px solid #fecaca', color: '#ef4444', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> Tugas Perbaikan
          </button>
          <button onClick={() => navigate('/technician')} className="btn-full" style={{ flex: 1, background: '#eff6ff', border: '2px solid #bfdbfe', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            Kembali Ke Dashboard
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        .scanner-frame {
          width: 260px;
          height: 260px;
          position: relative;
          border-radius: 20px;
          box-shadow: 0 0 0 9999px rgba(0,0,0,0.4);
          overflow: hidden;
        }

        .scanner-corner {
          position: absolute;
          width: 40px;
          height: 40px;
          border-color: #f97316;
          border-style: solid;
          border-width: 0;
          z-index: 20;
          border-radius: 8px;
        }

        .top-left { top: 0; left: 0; border-top-width: 5px; border-left-width: 5px; border-top-left-radius: 20px; }
        .top-right { top: 0; right: 0; border-top-width: 5px; border-right-width: 5px; border-top-right-radius: 20px; }
        .bottom-left { bottom: 0; left: 0; border-bottom-width: 5px; border-left-width: 5px; border-bottom-left-radius: 20px; }
        .bottom-right { bottom: 0; right: 0; border-bottom-width: 5px; border-right-width: 5px; border-bottom-right-radius: 20px; }

        @keyframes smoothScan {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(130px); }
          90% { opacity: 1; }
          100% { transform: translateY(260px); opacity: 0; }
        }

        .smooth-scan-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 8px;
          background: linear-gradient(to bottom, rgba(249,115,22,0), rgba(249,115,22,1));
          box-shadow: 0 5px 20px 5px rgba(249, 115, 22, 0.4);
          animation: smoothScan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
          z-index: 15;
          border-radius: 4px;
        }

        .scanner-flare {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(249,115,22,0.1) 0%, rgba(0,0,0,0) 70%);
          animation: pulse-red 2s infinite;
          z-index: 5;
        }

        @keyframes pulseText {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .pulse-text {
          animation: pulseText 1.5s ease-in-out infinite;
        }

        .success-circle {
          width: 80px;
          height: 80px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 10px rgba(16,185,129,0.3);
          animation: scaleUpBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes scaleUpBounce {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      {scanState === 'scanning' || scanState === 'processing' ? renderScanning() : renderResult()}
    </>
  );
};

export default TechnicianScan;

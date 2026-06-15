import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, Scan, Search, MapPin, CalendarCheck, CheckCircle2, RotateCcw, Loader2, QrCode, Camera, CameraOff, X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { api } from '../../services/api';

// Utilitas untuk mengekstrak Asset ID dari teks QR Code (bisa berupa teks biasa atau URL)
const extractAssetId = (text) => {
  const trimmed = text.trim();
  try {
    const url = new URL(trimmed);
    const id = url.searchParams.get('assetId') || url.searchParams.get('id');
    if (id) return id.toUpperCase();

    const paths = url.pathname.split('/');
    const last = paths[paths.length - 1];
    if (last && last.toUpperCase().startsWith('AST-')) {
      return last.toUpperCase();
    }
  } catch (e) {
    // Bukan URL, gunakan teks mentah
  }
  return trimmed.toUpperCase();
};


const TechnicianScan = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [scanState, setScanState] = useState('idle'); // 'idle', 'camera', 'loading', 'result', 'error'
  const [scannedAsset, setScannedAsset] = useState(null);
  const [assetIdInput, setAssetIdInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const html5QrcodeRef = useRef(null);
  const scannerDivId = 'qr-reader';

  // Cleanup kamera saat unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = async () => {
    if (html5QrcodeRef.current) {
      try {
        const state = html5QrcodeRef.current.getState();
        // State 2 = SCANNING
        if (state === 2) {
          await html5QrcodeRef.current.stop();
        }
        html5QrcodeRef.current.clear();
      } catch (err) {
        // ignore
      }
      html5QrcodeRef.current = null;
    }
  };

  const startCamera = async () => {
    setCameraError('');
    setScanState('camera');

    // Tunggu DOM render dulu
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      const html5Qrcode = new Html5Qrcode(scannerDivId);
      html5QrcodeRef.current = html5Qrcode;

      await html5Qrcode.start(
        { facingMode: 'environment' }, // Kamera belakang (HP)
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        async (decodedText) => {
          // QR berhasil terbaca
          await stopCamera();
          const assetId = extractAssetId(decodedText);
          fetchAsset(assetId);
        },
        (errorMessage) => {
          // Ignore scan errors (terjadi terus saat tidak ada QR)
        }
      );
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Gagal mengakses kamera. Pastikan izin kamera diaktifkan di browser.');
      setScanState('idle');
    }
  };

  const fetchAsset = async (assetId) => {
    setIsLoading(true);
    setScanState('loading');
    setErrorMsg('');

    try {
      const fullDetail = await api.get(`/assets/${assetId}`);
      setScannedAsset(fullDetail);
      setScanState('result');
    } catch (err) {
      setErrorMsg(`Aset dengan ID "${assetId}" tidak ditemukan di sistem.`);
      setScanState('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch jika assetId dilewatkan via URL query parameter (misal: scan kamera HP bawaan)
  useEffect(() => {
    const assetId = searchParams.get('assetId') || searchParams.get('id');
    if (assetId) {
      fetchAsset(assetId.trim().toUpperCase());
    }
  }, [searchParams]);

  const handleManualSearch = async (e) => {
    e.preventDefault();
    const query = assetIdInput.trim().toUpperCase();
    if (!query) return;
    await stopCamera();
    fetchAsset(query);
  };

  const handleReset = async () => {
    await stopCamera();
    setScanState('idle');
    setScannedAsset(null);
    setAssetIdInput('');
    setErrorMsg('');
    setCameraError('');
  };

  // ─── Render: Idle / Camera / Loading ────────────────────────────────────────
  const renderScanView = () => (
    <div style={{
      position: 'relative',
      height: 'calc(100vh - 120px)',
      margin: '-1.5rem',
      backgroundColor: '#000',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Background blur (hanya saat idle, bukan saat kamera aktif) */}
      {scanState !== 'camera' && (
        <>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url("https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800")',
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(3px)' }} />
        </>
      )}

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 20, padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: '700' }}>
          <Scan size={24} color="#f97316" /> SCAN ASET
        </div>
        {scanState === 'camera' && (
          <button
            onClick={handleReset}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: 'white', display: 'flex' }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Konten Utama */}
        <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 1rem md:px-6', gap: '1.5rem', maxWidth: '600px', margin: '0 auto', width: '100%' }}>

        {/* Loading overlay */}
        {scanState === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'white' }}>
            <Loader2 size={48} color="#f97316" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ fontWeight: '700', fontSize: '1rem', letterSpacing: '1px' }}>MEMBACA DATA ASET...</p>
          </div>
        )}

        {/* Camera view */}
        {scanState === 'camera' && (
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <div id={scannerDivId} style={{ width: '100%', borderRadius: '20px', overflow: 'hidden' }} />
            <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontSize: '0.85rem', fontWeight: '600', marginTop: '1rem' }}>
              Arahkan kamera ke QR Code aset
            </p>
          </div>
        )}

        {/* Idle view */}
        {(scanState === 'idle' || scanState === 'error') && (
          <>
            {/* Scanner frame dekoratif */}
            <div className="scanner-frame">
              <div className="scanner-corner top-left"></div>
              <div className="scanner-corner top-right"></div>
              <div className="scanner-corner bottom-left"></div>
              <div className="scanner-corner bottom-right"></div>
              <div className="smooth-scan-line"></div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
                <QrCode size={60} color="rgba(249,115,22,0.5)" />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '1px' }}>ARAHKAN KE QR CODE</span>
              </div>
            </div>

            {/* Tombol Buka Kamera */}
            <button
              onClick={startCamera}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: '#f97316', color: 'white',
                border: 'none', borderRadius: '16px',
                padding: '0.9rem 2rem', fontSize: '1rem',
                fontWeight: '800', cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(249,115,22,0.4)',
                letterSpacing: '0.5px',
              }}
            >
              <Camera size={22} /> BUKA KAMERA
            </button>

            {cameraError && (
              <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: '12px', padding: '0.75rem 1.25rem', color: '#fca5a5', fontSize: '0.85rem', fontWeight: '600', textAlign: 'center', maxWidth: '340px' }}>
                ⚠️ {cameraError}
              </div>
            )}

            {/* Pembatas */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '340px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: '700' }}>ATAU</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
            </div>

            {/* Input manual */}
            <div style={{ width: '100%', maxWidth: '340px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.2)' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: '700', textAlign: 'center', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>
                INPUT ID ASET MANUAL
              </p>
              <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={assetIdInput}
                  onChange={(e) => setAssetIdInput(e.target.value)}
                  placeholder="Contoh: AST-001"
                  style={{
                    flex: 1, padding: '0.75rem 1rem', borderRadius: '12px',
                    border: '2px solid rgba(249,115,22,0.5)',
                    background: 'rgba(255,255,255,0.15)', color: 'white',
                    fontSize: '0.95rem', fontWeight: '700', outline: 'none',
                  }}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!assetIdInput.trim()}
                  style={{
                    padding: '0.75rem 1rem', borderRadius: '12px',
                    background: '#f97316', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: !assetIdInput.trim() ? 0.5 : 1,
                  }}
                >
                  <Search size={20} color="white" />
                </button>
              </form>

              {scanState === 'error' && (
                <div style={{ marginTop: '0.75rem', padding: '0.65rem', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: '12px', color: '#fca5a5', fontSize: '0.8rem', fontWeight: '600', textAlign: 'center' }}>
                  ❌ {errorMsg}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  // ─── State for creating repair from scan ────────────────────────────────────
  const [showRepairModal, setShowRepairModal] = useState(false);
  const [repairDescription, setRepairDescription] = useState('');
  const [repairPriority, setRepairPriority] = useState('sedang');
  const [isSubmittingRepair, setIsSubmittingRepair] = useState(false);
  const [repairSuccess, setRepairSuccess] = useState(false);

  const handleCreateRepairFromScan = async () => {
    if (!scannedAsset || !repairDescription.trim()) return;
    setIsSubmittingRepair(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const formData = new FormData();
      formData.append('assetId', scannedAsset.id);
      formData.append('description', repairDescription.trim());
      formData.append('priority', repairPriority);
      formData.append('reporterName', currentUser.name || 'Teknisi');

      await api.post('/repairs', formData, true);
      setRepairSuccess(true);
      setRepairDescription('');
      setTimeout(() => {
        setShowRepairModal(false);
        setRepairSuccess(false);
      }, 2000);
    } catch (err) {
      alert(`Gagal membuat laporan perbaikan: ${err.message}`);
    } finally {
      setIsSubmittingRepair(false);
    }
  };

  // ─── Render: Result ──────────────────────────────────────────────────────────
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
        {/* Success Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '1rem', marginBottom: '1.5rem' }}>
          <CheckCircle2 size={28} color="#10b981" />
          <div>
            <p style={{ margin: 0, fontWeight: '800', color: '#065f46', fontSize: '0.9rem' }}>ASET DITEMUKAN</p>
            <p style={{ margin: 0, color: '#059669', fontSize: '0.8rem' }}>ID: {scannedAsset.id}</p>
          </div>
          <button
            onClick={handleReset}
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: '1.5px solid #10b981', borderRadius: '10px', color: '#10b981', fontWeight: '700', padding: '6px 12px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            <RotateCcw size={14} /> Scan Lagi
          </button>
        </div>

        {/* Asset Card */}
        <div className="tech-card" style={{ padding: 0, marginBottom: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
            <img
              src={scannedAsset.img ? `http://localhost:5000${scannedAsset.img}` : 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'}
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
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>{(scannedAsset.category || '').toUpperCase()}</span>
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
        <div className="timeline-list" style={{ marginBottom: '2.5rem' }}>
          {activities.length > 0 ? activities.map((act, index) => (
            <div className="timeline-card" style={{ padding: '1rem' }} key={index}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>{act.title}</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: '1.5' }}>{act.notes}</p>
              <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8' }}>
                {act.time} - Oleh: {act.pic}
              </span>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '16px' }}>Belum ada log aktivitas.</div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowRepairModal(true)} className="btn-full" style={{ flex: 1, background: '#fef2f2', border: '2px solid #fecaca', color: '#ef4444', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> Tugas Perbaikan
          </button>
          <button onClick={() => navigate('/technician')} className="btn-full" style={{ flex: 1, background: '#eff6ff', border: '2px solid #bfdbfe', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            Dashboard
          </button>
        </div>

        {/* Repair Creation Modal */}
        {showRepairModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease-in-out' }}
            onClick={() => { if (!isSubmittingRepair) setShowRepairModal(false); }}
          >
            <div 
              style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', maxWidth: '400px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {repairSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <CheckCircle2 size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '800', color: '#065f46' }}>Laporan Terkirim!</h3>
                  <p style={{ margin: 0, color: '#059669', fontSize: '0.9rem' }}>Laporan perbaikan berhasil dibuat untuk {scannedAsset.name}.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Buat Laporan Perbaikan</h3>
                    <button onClick={() => setShowRepairModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '12px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                      <X size={18} color="#64748b" />
                    </button>
                  </div>

                  <div style={{ background: '#fff7ed', borderRadius: '12px', padding: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle size={20} color="#f97316" />
                    <div>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>{scannedAsset.name}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>ID: {scannedAsset.id} | {scannedAsset.room}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '800', display: 'block', marginBottom: '6px', color: '#475569' }}>DESKRIPSI KERUSAKAN</label>
                      <textarea
                        value={repairDescription}
                        onChange={(e) => setRepairDescription(e.target.value)}
                        placeholder="Jelaskan kerusakan yang ditemukan..."
                        style={{ width: '100%', minHeight: '80px', padding: '0.75rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '0.9rem', resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '800', display: 'block', marginBottom: '6px', color: '#475569' }}>PRIORITAS</label>
                      <select
                        value={repairPriority}
                        onChange={(e) => setRepairPriority(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', background: 'white' }}
                      >
                        <option value="rendah">Rendah</option>
                        <option value="sedang">Sedang</option>
                        <option value="tinggi">Tinggi (Cito)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateRepairFromScan}
                    disabled={!repairDescription.trim() || isSubmittingRepair}
                    style={{
                      width: '100%', marginTop: '1.25rem', padding: '0.85rem',
                      background: '#ef4444', color: 'white', border: 'none',
                      borderRadius: '14px', fontSize: '0.95rem', fontWeight: '800',
                      cursor: !repairDescription.trim() || isSubmittingRepair ? 'not-allowed' : 'pointer',
                      opacity: !repairDescription.trim() || isSubmittingRepair ? 0.6 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {isSubmittingRepair ? (
                      <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Mengirim...</>
                    ) : (
                      <><AlertTriangle size={18} /> Kirim Laporan Perbaikan</>
                    )}
                  </button>

                  <button
                    onClick={() => { setShowRepairModal(false); navigate('/technician/repairs'); }}
                    style={{ width: '100%', marginTop: '0.5rem', padding: '0.7rem', background: 'none', border: '1.5px solid #e2e8f0', borderRadius: '14px', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', cursor: 'pointer' }}
                  >
                    Lihat Daftar Tugas Perbaikan
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{`
        .scanner-frame {
          width: 260px; height: 260px;
          position: relative; border-radius: 20px;
          box-shadow: 0 0 0 9999px rgba(0,0,0,0.4);
          overflow: hidden;
        }
        .scanner-corner {
          position: absolute; width: 40px; height: 40px;
          border-color: #f97316; border-style: solid; border-width: 0;
          z-index: 20; border-radius: 8px;
        }
        .top-left    { top: 0; left: 0;  border-top-width: 5px; border-left-width: 5px;  border-top-left-radius: 20px; }
        .top-right   { top: 0; right: 0; border-top-width: 5px; border-right-width: 5px; border-top-right-radius: 20px; }
        .bottom-left { bottom: 0; left: 0;  border-bottom-width: 5px; border-left-width: 5px;  border-bottom-left-radius: 20px; }
        .bottom-right{ bottom: 0; right: 0; border-bottom-width: 5px; border-right-width: 5px; border-bottom-right-radius: 20px; }
        @keyframes smoothScan {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 1; }
          50%  { transform: translateY(130px); }
          90%  { opacity: 1; }
          100% { transform: translateY(260px); opacity: 0; }
        }
        .smooth-scan-line {
          position: absolute; left: 0; right: 0; top: 0; height: 8px;
          background: linear-gradient(to bottom, rgba(249,115,22,0), rgba(249,115,22,1));
          box-shadow: 0 5px 20px 5px rgba(249,115,22,0.4);
          animation: smoothScan 2.5s cubic-bezier(0.4,0,0.2,1) infinite alternate;
          z-index: 15; border-radius: 4px;
        }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        /* Override html5-qrcode default styles */
        #qr-reader { border: none !important; }
        #qr-reader video { border-radius: 16px; }
        #qr-reader__scan_region { border-radius: 16px; }
        #qr-reader__dashboard { display: none !important; }
      `}</style>
      {scanState === 'result' ? renderResult() : renderScanView()}
    </>
  );
};

export default TechnicianScan;

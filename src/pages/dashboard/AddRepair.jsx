import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, QrCode, ArrowLeft, Loader2 } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { api } from '../../services/api';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const AddRepair = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillAssetId = searchParams.get('assetId') || '';
  const [assetId, setAssetId] = useState(prefillAssetId);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const html5QrcodeRef = useRef(null);
  const scannerDivId = 'admin-qr-reader';

  // Get current user name for reporterName field
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const reporterName = currentUser.name || 'Admin';

  useEffect(() => {
    return () => {
      if (html5QrcodeRef.current) {
        try {
          const state = html5QrcodeRef.current.getState();
          if (state === 2) {
            html5QrcodeRef.current.stop().then(() => {
              html5QrcodeRef.current.clear();
            }).catch(() => { });
          } else {
            html5QrcodeRef.current.clear();
          }
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const stopScanner = async () => {
    if (html5QrcodeRef.current) {
      try {
        const state = html5QrcodeRef.current.getState();
        if (state === 2) {
          await html5QrcodeRef.current.stop();
        }
        html5QrcodeRef.current.clear();
      } catch {
        // ignore
      }
      html5QrcodeRef.current = null;
    }
    setIsScanning(false);
  };

  const startScanner = async () => {
    setCameraError('');
    setIsScanning(true);

    setTimeout(async () => {
      try {
        const html5Qrcode = new Html5Qrcode(scannerDivId);
        html5QrcodeRef.current = html5Qrcode;

        await html5Qrcode.start(
          { facingMode: 'user' },
          {
            fps: 10,
            qrbox: { width: 200, height: 200 },
            aspectRatio: 1.0,
          },
          async (decodedText) => {
            setAssetId(decodedText.trim().toUpperCase());
            await stopScanner();
          },
          () => {
            // ignore
          }
        );
      } catch (err) {
        console.error('Camera access error:', err);
        setCameraError('Gagal mengakses kamera. Pastikan izin kamera aktif.');
      }
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      await api.post('/repairs', formData, true);

      setIsLoading(false);
      setShowToast(true);

      setTimeout(() => {
        navigate('/dashboard/repairs');
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal melaporkan kerusakan. Pastikan ID Aset benar.');
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      {showToast && <Toast message="Laporan kerusakan berhasil dikirim!" onClose={() => setShowToast(false)} />}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-outline" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="page-title" style={{ margin: 0 }}>Form Pelaporan Kerusakan</h1>
      </div>

      <div className="form-container" style={{ borderTop: '4px solid var(--danger)' }}>
        {errorMsg && (
          <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>ID Aset / Scan QR</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  name="assetId"
                  className="form-control"
                  placeholder="Contoh: AST-002"
                  required
                  style={{ flex: 1 }}
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-outline"
                  style={{ padding: '0 1rem', backgroundColor: 'var(--secondary)' }}
                  title="Scan QR Code"
                  onClick={startScanner}
                >
                  <QrCode size={20} />
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Tingkat Prioritas</label>
              <select name="priority" className="form-control" required defaultValue="sedang">
                <option value="rendah">Rendah (Dapat ditunda)</option>
                <option value="sedang">Sedang (Perlu penanganan)</option>
                <option value="tinggi">Tinggi (Berpengaruh pada pasien / Cito)</option>
              </select>
            </div>
          </div>

          {/* Hidden field: reporterName auto-filled from logged in user */}
          <input type="hidden" name="reporterName" value={reporterName} />

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Deskripsi Kerusakan</label>
            <textarea name="description" className="form-control" placeholder="Jelaskan secara rinci kerusakan yang terjadi..." required></textarea>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Unggah Foto Bukti Kerusakan (Opsional)</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="form-control"
              style={{ padding: '0.5rem', background: '#f8fafc' }}
            />
          </div>

          <div className="form-actions">
            <Link to="/dashboard/repairs" className="btn-outline">Batal</Link>
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ backgroundColor: 'var(--danger)', opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? (
                <><Loader2 size={18} className="spin" /> Melaporkan...</>
              ) : (
                <><AlertTriangle size={18} /> Lapor Kerusakan</>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      {isScanning && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--surface)', borderRadius: '20px', padding: '1.5rem', maxWidth: '400px', width: '90%', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Scan QR Code Aset</h3>

            {cameraError ? (
              <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: '500' }}>
                {cameraError}
              </div>
            ) : (
              <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                <div id={scannerDivId} style={{ width: '100%' }} />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-outline" onClick={stopScanner}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRepair;

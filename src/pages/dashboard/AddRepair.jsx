import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, QrCode, ArrowLeft, Loader2 } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { api } from '../../services/api';
import Toast from '../../components/Toast';

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
            setAssetId(extractAssetId(decodedText));
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
    <div className="flex flex-col gap-6 h-full">
      {showToast && <Toast message="Laporan kerusakan berhasil dikirim!" onClose={() => setShowToast(false)} />}
      <div className="flex justify-between items-center" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="bg-transparent text-text-main border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="text-2xl font-bold text-text-main" style={{ margin: 0 }}>Form Pelaporan Kerusakan</h1>
      </div>

      <div className="bg-surface p-8 rounded-xl shadow-custom-sm border border-border max-w-[800px] border-t-4 border-t-red-500">
        {errorMsg && (
          <div className="text-red-500 bg-red-100 p-3 rounded-[10px] mb-6 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">ID Aset / Scan QR</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  name="assetId"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]"
                  placeholder="Contoh: AST-002"
                  required
                  style={{ flex: 1 }}
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-transparent text-text-main border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  style={{ padding: '0 1rem' }}
                  title="Scan QR Code"
                  onClick={startScanner}
                >
                  <QrCode size={20} />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-text-main">Tingkat Prioritas</label>
              <select name="priority" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" required defaultValue="sedang">
                <option value="rendah">Rendah (Dapat ditunda)</option>
                <option value="sedang">Sedang (Perlu penanganan)</option>
                <option value="tinggi">Tinggi (Berpengaruh pada pasien / Cito)</option>
              </select>
            </div>
          </div>

          {/* Hidden field: reporterName auto-filled from logged in user */}
          <input type="hidden" name="reporterName" value={reporterName} />

          <div className="flex flex-col gap-2 flex-1 mb-6">
            <label className="text-sm font-semibold text-text-main">Deskripsi Kerusakan</label>
            <textarea name="description" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]" placeholder="Jelaskan secara rinci kerusakan yang terjadi..." required></textarea>
          </div>

          <div className="flex flex-col gap-2 flex-1 mb-6">
            <label className="text-sm font-semibold text-text-main">Unggah Foto Bukti Kerusakan (Opsional)</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-custom-md text-sm outline-none bg-surface text-text-main transition-all focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.2)]"
              style={{ padding: '0.5rem', background: '#f8fafc' }}
            />
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
            <Link to="/dashboard/repairs" className="bg-transparent text-text-main border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Batal</Link>
            <button type="submit" className="bg-red-500 text-white px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-red-600 transition-colors disabled:opacity-70" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-surface rounded-[20px] p-6 max-w-[400px] w-[90%] shadow-custom-lg border border-border">
            <h3 className="m-0 mb-4 text-text-main">Scan QR Code Aset</h3>

            {cameraError ? (
              <div className="text-red-500 bg-red-100 p-3 rounded-[10px] text-sm font-medium mb-4">
                {cameraError}
              </div>
            ) : (
              <div className="w-full rounded-xl overflow-hidden border border-border mb-4">
                <div id={scannerDivId} className="w-full" />
              </div>
            )}

            <div className="flex justify-end">
              <button type="button" className="bg-transparent text-text-main border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all" onClick={stopScanner}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRepair;

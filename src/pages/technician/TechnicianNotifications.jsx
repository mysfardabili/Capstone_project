import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, AlertTriangle, CheckCircle, Package, RefreshCw, Clock, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import Toast from '../../components/Toast';

const TechnicianNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`, {});
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await handleMarkAsRead(notif.id);
    }
    if (notif.type === 'warning') {
      navigate('/technician/repairs');
    } else {
      navigate('/technician');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.isRead);
      await Promise.all(unread.map(n => api.put(`/notifications/${n.id}/read`, {})));
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setToastMsg("Semua notifikasi telah ditandai sudah dibaca");
      setShowToast(true);
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTitle = (type) => {
    if (type === 'danger') return 'Kalibrasi Jatuh Tempo';
    if (type === 'warning') return 'Laporan Kerusakan';
    return 'Mutasi Aset';
  };

  const getIcon = (type) => {
    switch (type) {
      case 'danger': return <AlertTriangle size={18} color="#ef4444" />;
      case 'warning': return <Clock size={18} color="#eab308" />;
      case 'mutation': return <RefreshCw size={18} color="#3b82f6" />;
      default: return <Package size={18} color="#22c55e" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'danger': return '#fef2f2';
      case 'warning': return '#fef9c3';
      case 'mutation': return '#eff6ff';
      default: return '#f0fdf4';
    }
  };

  const formatTimeDiff = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins}m yang lalu`;
    if (diffHours < 24) return `${diffHours}j yang lalu`;
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}

      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/technician')}
            className="bg-slate-100 dark:bg-slate-700 border-none rounded-xl p-2 cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-slate-900 dark:text-white" />
          </button>
          <h2 className="m-0 text-[1.4rem] font-extrabold text-slate-900 dark:text-white">
            Notifikasi
            {unreadCount > 0 && (
              <span className="text-xs px-2 py-[2px] rounded-[10px] bg-red-500 text-white ml-1.5 font-extrabold align-middle">
                {unreadCount}
              </span>
            )}
          </h2>
        </div>

        <button 
          onClick={markAllAsRead} 
          disabled={unreadCount === 0}
          className={`text-xs text-blue-600 font-bold no-underline bg-blue-100/50 dark:bg-blue-900/50 px-3 py-[6px] rounded-[20px] hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors border-none outline-none flex items-center gap-1 ${unreadCount === 0 ? 'opacity-50 cursor-default' : 'cursor-pointer'}`}
        >
          <CheckCircle size={12} /> Baca Semua
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-slate-500">
            <Loader2 size={36} className="spin text-orange-500" />
            <span>Memuat notifikasi...</span>
            <style>{`
              .spin { animation: spin 1s linear infinite; }
              @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-16 bg-white dark:bg-slate-800 rounded-[20px] border border-slate-200 dark:border-slate-700 text-slate-500">
            <Bell size={48} className="opacity-30 mb-4 text-orange-500 mx-auto" />
            <h3 className="text-lg font-extrabold m-0 mb-1 text-slate-900 dark:text-white">Belum Ada Notifikasi</h3>
            <p className="text-sm m-0 text-slate-500 dark:text-slate-400">Anda belum memiliki notifikasi baru saat ini.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className="flex gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.01)] transition-all duration-200 cursor-pointer relative overflow-hidden"
              style={{ opacity: notif.isRead ? 0.75 : 1 }}
            >
              {!notif.isRead && (
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-orange-500"></div>
              )}

              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: getBg(notif.type) }}
              >
                {getIcon(notif.type)}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="m-0 text-sm text-slate-900 dark:text-white" style={{ fontWeight: notif.isRead ? 700 : 800 }}>
                    {getTitle(notif.type)}
                  </h4>
                  <span className="text-[0.7rem] text-slate-400 flex items-center gap-0.5 shrink-0">
                    <Clock size={10} /> {formatTimeDiff(notif.date)}
                  </span>
                </div>
                <p className="m-0 text-sm text-slate-500 dark:text-slate-400 leading-[1.4]">
                  {notif.message}
                </p>
              </div>

              {!notif.isRead && (
                <div className="w-2 h-2 bg-orange-500 rounded-full self-center shrink-0"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TechnicianNotifications;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, CheckCircle, Package, RefreshCw, Clock, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import Toast from '../../components/Toast';

const Notifications = () => {
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
      navigate('/dashboard/repairs');
    } else if (notif.type === 'danger') {
      navigate('/dashboard/calibration');
    } else if (notif.type === 'mutation') {
      navigate('/dashboard/mutation');
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
      case 'danger': return <AlertTriangle size={20} color="var(--icon-color-red)" />;
      case 'warning': return <Clock size={20} color="var(--icon-color-yellow)" />;
      case 'mutation': return <RefreshCw size={20} color="var(--icon-color-blue)" />;
      default: return <Package size={20} color="var(--icon-color-green)" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'danger': return 'var(--icon-bg-red)';
      case 'warning': return 'var(--icon-bg-yellow)';
      case 'mutation': return 'var(--icon-bg-blue)';
      default: return 'var(--icon-bg-green)';
    }
  };

  const formatTimeDiff = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">Notifikasi {unreadCount > 0 && <span className="bg-red-500 text-white text-sm px-2 py-0.5 rounded-full ml-2">{unreadCount} Baru</span>}</h2>
        <button className="bg-transparent text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-5 py-[0.6rem] rounded-custom-md font-semibold text-sm inline-flex items-center gap-2 no-underline hover:bg-gray-100 dark:hover:bg-gray-700 transition-all justify-center w-full md:w-auto" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <CheckCircle size={18} /> Tandai Semua Dibaca
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-custom-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-500 dark:text-gray-400">
            <Loader2 size={36} className="animate-spin text-orange-500" />
            <span>Memuat notifikasi...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-12 text-gray-500 dark:text-gray-400">
            <Bell size={48} className="opacity-50 mb-4" />
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Belum Ada Notifikasi</h3>
            <p>Anda belum memiliki notifikasi baru saat ini.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                onClick={() => handleNotificationClick(notif)}
                className={`flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-custom-md transition-all cursor-pointer ${notif.isRead ? '' : 'bg-[var(--table-row-hover)]'}`}
              >
                <div 
                  style={{ background: getBg(notif.type) }}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                >
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <h4 className={`m-0 text-base ${notif.isRead ? 'font-medium' : 'font-bold'} text-gray-800 dark:text-gray-100`}>{getTitle(notif.type)}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock size={12} /> {formatTimeDiff(notif.date)}
                    </span>
                  </div>
                  <p className="m-0 text-sm text-gray-500 dark:text-gray-400">{notif.message}</p>
                </div>
                {!notif.isRead && (
                  <div className="w-2.5 h-2.5 bg-orange-500 rounded-full self-center"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

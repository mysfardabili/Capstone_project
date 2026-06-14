import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, CheckCircle, Package, RefreshCw, Clock, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import '../../components/SharedUI.css';
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
      // Update local state
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
    <div className="page-container">
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
      
      <div className="page-header">
        <h2 className="page-title">Notifikasi {unreadCount > 0 && <span style={{ background: 'var(--danger)', color: 'white', fontSize: '0.9rem', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px' }}>{unreadCount} Baru</span>}</h2>
        <button className="btn-outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <CheckCircle size={18} /> Tandai Semua Dibaca
        </button>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem', color: 'var(--text-muted)' }}>
            <Loader2 size={36} className="spin" style={{ color: 'var(--primary)' }} />
            <span>Memuat notifikasi...</span>
            <style>{`
              .spin { animation: spin 1s linear infinite; }
              @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Bell size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <h3>Belum Ada Notifikasi</h3>
            <p>Anda belum memiliki notifikasi baru saat ini.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                onClick={() => handleNotificationClick(notif)}
                style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  padding: '1rem', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius-md)',
                  background: notif.isRead ? 'transparent' : 'var(--table-row-hover)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
              >
                <div style={{ 
                  background: getBg(notif.type), 
                  width: '40px', height: '40px', 
                  borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getIcon(notif.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: notif.isRead ? 500 : 700 }}>{getTitle(notif.type)}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {formatTimeDiff(notif.date)}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{notif.message}</p>
                </div>
                {!notif.isRead && (
                  <div style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '50%', alignSelf: 'center' }}></div>
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

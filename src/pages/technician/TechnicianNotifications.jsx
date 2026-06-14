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

      {/* Mobile-style Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => navigate('/technician')}
            style={{ background: '#f1f5f9', border: 'none', borderRadius: '12px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ArrowLeft size={20} color="#0f172a" />
          </button>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
            Notifikasi
            {unreadCount > 0 && (
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: '#ef4444', color: 'white', marginLeft: '6px', fontWeight: '800', verticalAlign: 'middle' }}>
                {unreadCount}
              </span>
            )}
          </h2>
        </div>

        <button 
          onClick={markAllAsRead} 
          disabled={unreadCount === 0}
          className="tech-card-link"
          style={{ border: 'none', outline: 'none', cursor: unreadCount === 0 ? 'default' : 'pointer', opacity: unreadCount === 0 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <CheckCircle size={12} /> Baca Semua
        </button>
      </div>

      {/* Main Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem', color: '#64748b' }}>
            <Loader2 size={36} className="spin" style={{ color: '#ff6b00' }} />
            <span>Memuat notifikasi...</span>
            <style>{`
              .spin { animation: spin 1s linear infinite; }
              @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', color: '#64748b' }}>
            <Bell size={48} style={{ opacity: 0.3, marginBottom: '1rem', color: '#ff6b00' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 4px 0', color: '#0f172a' }}>Belum Ada Notifikasi</h3>
            <p style={{ fontSize: '0.85rem', margin: 0 }}>Anda belum memiliki notifikasi baru saat ini.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '1rem',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                transition: 'all 0.2s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                opacity: notif.isRead ? 0.75 : 1,
              }}
            >
              {/* Left Status Bar */}
              {!notif.isRead && (
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '4px', backgroundColor: '#ff6b00' }}></div>
              )}

              {/* Icon */}
              <div style={{ 
                backgroundColor: getBg(notif.type), 
                width: '36px', height: '36px', 
                borderRadius: '12px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                {getIcon(notif.type)}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a', fontWeight: notif.isRead ? '700' : '800' }}>
                    {getTitle(notif.type)}
                  </h4>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                    <Clock size={10} /> {formatTimeDiff(notif.date)}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                  {notif.message}
                </p>
              </div>

              {/* Unread circle indicator */}
              {!notif.isRead && (
                <div style={{ width: '8px', height: '8px', backgroundColor: '#ff6b00', borderRadius: '50%', alignSelf: 'center', flexShrink: 0 }}></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TechnicianNotifications;

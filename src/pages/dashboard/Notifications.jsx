import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Package, RefreshCw, Clock } from 'lucide-react';
import '../../components/SharedUI.css';
import Toast from '../../components/Toast';

const dummyNotifications = [
  { id: 1, type: 'warning', title: 'Kalibrasi Jatuh Tempo', message: 'Defibrillator Zoll di Ruang Operasi 2 harus dikalibrasi dalam 2 hari.', time: '2 jam yang lalu', read: false },
  { id: 2, type: 'info', title: 'Permintaan Aset Baru', message: 'IGD mengajukan permintaan 2 unit Kursi Roda Bariatrik.', time: '5 jam yang lalu', read: false },
  { id: 3, type: 'success', title: 'Perbaikan Selesai', message: 'USG Machine Voluson telah selesai diperbaiki oleh Teknisi.', time: 'Kemarin, 14:30', read: true },
  { id: 4, type: 'mutation', title: 'Mutasi Aset', message: 'Bed Pasien dipindahkan ke Kamar Melati 202.', time: 'Kemarin, 09:15', read: true }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [showToast, setShowToast] = useState(false);

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setShowToast(true);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={20} color="var(--icon-color-red)" />;
      case 'success': return <CheckCircle size={20} color="var(--icon-color-green)" />;
      case 'mutation': return <RefreshCw size={20} color="var(--icon-color-blue)" />;
      default: return <Package size={20} color="var(--icon-color-yellow)" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'warning': return 'var(--icon-bg-red)';
      case 'success': return 'var(--icon-bg-green)';
      case 'mutation': return 'var(--icon-bg-blue)';
      default: return 'var(--icon-bg-yellow)';
    }
  };

  return (
    <div className="page-container">
      {showToast && <Toast message="Semua notifikasi telah ditandai sudah dibaca" onClose={() => setShowToast(false)} />}
      
      <div className="page-header">
        <h2 className="page-title">Notifikasi {unreadCount > 0 && <span style={{ background: 'var(--danger)', color: 'white', fontSize: '0.9rem', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px' }}>{unreadCount} Baru</span>}</h2>
        <button className="btn-outline" onClick={markAllAsRead}>
          <CheckCircle size={18} /> Tandai Semua Dibaca
        </button>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        {notifications.length === 0 ? (
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
                style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  padding: '1rem', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius-md)',
                  background: notif.read ? 'transparent' : 'var(--table-row-hover)',
                  transition: 'all 0.2s'
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
                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: notif.read ? 500 : 700 }}>{notif.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {notif.time}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{notif.message}</p>
                </div>
                {!notif.read && (
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

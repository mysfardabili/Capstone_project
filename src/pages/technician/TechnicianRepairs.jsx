import React, { useState } from 'react';
import { Search, ChevronLeft, CheckCircle, Image as ImageIcon, AlertTriangle, MapPin, Wrench, FileText } from 'lucide-react';
import Toast from '../../components/Toast';

const repairsData = [
  { id: 'A-38920', ticket: 'REP-2390', name: 'Kursi Roda', status: 'Tertunda', date: 'Hari ini', location: 'UGD Bed 3', problem: 'Roda goyang', reporter: 'Ns. Siti', img: 'https://images.unsplash.com/photo-1599045118108-bf9954418b76?auto=format&fit=crop&q=80&w=400', priority: 'Menengah' },
  { id: 'A-38921', ticket: 'REP-2391', name: 'Bed Pasien', status: 'Maintenance', date: 'Kemarin', location: 'Kamar Mawar 101', problem: 'Motor macet', reporter: 'Dr. Hendra', img: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&q=80&w=400', priority: 'Rendah' },
  { id: 'A-38922', ticket: 'REP-2392', name: 'Ventilator', status: 'Mendesak', date: 'Hari ini', location: 'ICU Isolasi', problem: 'Power error', reporter: 'Ns. Rini', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400', priority: 'Kritis' },
];

const TechnicianRepairs = () => {
  const [view, setView] = useState('list'); // 'list', 'detail', 'note'
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = repairsData.filter(item => {
    // Check Status Pill Filter
    if (activeFilter !== 'Semua' && item.status !== activeFilter) return false;
    
    // Check Search Term
    const term = (searchTerm || '').toLowerCase();
    if (!term) return true;
    
    return item.name.toLowerCase().includes(term) || item.id.toLowerCase().includes(term) || item.ticket.toLowerCase().includes(term);
  });

  const openDetail = (item) => {
    setSelectedItem(item);
    setView('detail');
  };

  const renderList = () => (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Daftar Tugas</h2>
      <p style={{ margin: '0 0 1.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>{filteredTasks.length} perbaikan membutuhkan atensi.</p>

      {/* Quick Filter Pills */}
      <div className="filter-pills">
        {['Semua', 'Mendesak', 'Tertunda', 'Maintenance'].map(filter => (
          <button 
            key={filter} 
            className={`pill-btn ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="search-bar-container">
        <div className="search-bar">
          <Search size={18} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Cari ID tiket atau aset..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="tasks-list">
        {filteredTasks.length > 0 ? filteredTasks.map((item, idx) => (
          <div key={idx} className={`task-card ${item.status === 'Maintenance' ? 'grey' : ''}`}>
            
            <div className="location-badge">
              <MapPin size={12} color="#f97316" /> {item.location}
            </div>

            <div className="task-header" style={{ marginBottom: '1rem' }}>
              <div>
                <h3 className="task-title">{item.name}</h3>
                <p className="task-id">ID: {item.id}</p>
              </div>
              <span className={`task-badge ${item.status === 'Maintenance' ? 'badge-grey' : item.status === 'Mendesak' ? 'badge-orange' : 'badge-green'}`}>
                {item.status}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem', alignItems: 'center' }}>
              <Wrench size={14} /> <span>{item.problem}</span>
            </div>

            {item.status === 'Maintenance' ? (
              <button className="btn-full btn-grey" onClick={() => openDetail(item)}>Detail Maintenance</button>
            ) : (
              <button className="btn-full btn-orange" onClick={() => openDetail(item)}>Mulai Perbaikan</button>
            )}
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <Search size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
            <p style={{ margin: 0, fontWeight: 600 }}>Tidak ada tugas ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderDetail = () => (
    <div style={{ animation: 'slideInRight 0.3s ease-in-out' }}>
      <button 
        onClick={() => setView('list')}
        style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#f97316', fontWeight: '700', padding: 0, marginBottom: '1.5rem', cursor: 'pointer', fontSize: '1rem' }}
      >
        <ChevronLeft size={20} /> Kembali
      </button>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <img src={selectedItem.img} alt={selectedItem.name} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '24px', margin: '0 0 1rem 0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
      </div>

      <div className="location-badge" style={{ backgroundColor: '#fff7ed', color: '#ea580c', padding: '6px 14px' }}>
        <MapPin size={14} /> {selectedItem.location}
      </div>

      <h2 style={{ margin: '0.5rem 0 1.5rem 0', fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>{selectedItem.name}</h2>

      <div className="tech-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.8rem', marginBottom: '0.8rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: '700', margin: '0 0 4px 0', color: '#64748b' }}>ID TIKET</p>
            <p style={{ fontSize: '0.9rem', color: '#0f172a', margin: 0, fontWeight: '700' }}>{selectedItem.ticket}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '700', margin: '0 0 4px 0', color: '#64748b' }}>PELAPOR</p>
            <p style={{ fontSize: '0.9rem', color: '#0f172a', margin: 0, fontWeight: '700' }}>{selectedItem.reporter}</p>
          </div>
        </div>

        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: '700', margin: '0 0 4px 0', color: '#64748b' }}>KELUHAN / MASALAH</p>
          <p style={{ fontSize: '0.9rem', color: '#0f172a', margin: 0, fontWeight: '500' }}>"{selectedItem.problem}"</p>
        </div>
      </div>

      <button className="btn-full btn-outline-blue" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '1rem', border: '2px dashed #3b82f6', backgroundColor: '#eff6ff' }} onClick={() => setView('note')}>
        <FileText size={20} /> Isi Laporan & Selesaikan
      </button>
    </div>
  );

  const renderNote = () => (
    <div style={{ animation: 'slideInRight 0.3s ease-in-out', paddingBottom: '80px' }}>
      <button 
        onClick={() => setView('detail')}
        style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#64748b', fontWeight: '700', padding: 0, marginBottom: '1.5rem', cursor: 'pointer', fontSize: '1rem' }}
      >
        <ChevronLeft size={20} /> Batal
      </button>

      <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Laporan Perbaikan</h2>
      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 2rem 0' }}>{selectedItem.name} - {selectedItem.id}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Interactive Radio Cards for Status */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: '800', display: 'block', marginBottom: '1rem', color: '#0f172a' }}>STATUS PEKERJAAN</label>
          <div className="radio-card-grid">
            <label className="radio-card-label">
              <input type="radio" name="status" className="radio-card-input" defaultChecked />
              <div className="radio-card-box">
                <CheckCircle size={28} />
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Berhasil</span>
              </div>
            </label>
            <label className="radio-card-label">
              <input type="radio" name="status" className="radio-card-input danger" />
              <div className="radio-card-box">
                <AlertTriangle size={28} />
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Afkir</span>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: '800', display: 'block', marginBottom: '0.5rem', color: '#0f172a' }}>JENIS PERBAIKAN</label>
          <input type="text" className="form-input" placeholder="Contoh: Ganti roda depan" />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: '800', display: 'block', marginBottom: '0.5rem', color: '#0f172a' }}>FOTO BUKTI SELESAI</label>
          <label style={{ width: '100%', height: '120px', background: 'white', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '2px dashed #cbd5e1', cursor: 'pointer' }}>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={() => setShowToast(true)} />
            <ImageIcon size={36} style={{ marginBottom: '8px' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Tap untuk ambil foto</span>
          </label>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: '800', display: 'block', marginBottom: '0.5rem', color: '#0f172a' }}>CATATAN TAMBAHAN (OPSIONAL)</label>
          <textarea className="form-input" style={{ height: '100px', resize: 'none' }} placeholder="Ketik di sini..."></textarea>
        </div>
      </div>

      {/* FAB Container */}
      <div className="fab-container" onClick={() => setView('list')}>
        <button className="fab-btn">
          <CheckCircle size={28} color="white" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {showToast && <Toast message="Kamera/Galeri dibuka. Foto siap dilampirkan." onClose={() => setShowToast(false)} />}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
      {view === 'list' && renderList()}
      {view === 'detail' && renderDetail()}
      {view === 'note' && renderNote()}
    </>
  );
};

export default TechnicianRepairs;

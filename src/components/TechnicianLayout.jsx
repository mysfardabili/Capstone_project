import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wrench, ScanLine, History, User, Bell, LogOut } from 'lucide-react';
import './TechnicianMobile.css';

const TechnicianLayout = () => {
  const navigate = useNavigate();
  return (
    <div className="tech-container">
      {/* Topbar */}
      <header className="tech-topbar" style={{ display: 'flex', gap: '12px' }}>
        <img 
          src="/asetra-oren.png" 
          alt="ASETRA Logo" 
          style={{ height: '32px', objectFit: 'contain' }}
        />
        
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Bell size={24} color="#64748b" />
            <span style={{
              position: 'absolute', top: 0, right: 0,
              width: '8px', height: '8px', backgroundColor: '#ef4444',
              borderRadius: '50%', border: '2px solid white'
            }}></span>
          </div>
          
          {/* Tombol Kembali / Keluar */}
          <button 
            onClick={() => navigate('/login')} 
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '12px'
            }}
          >
            <LogOut size={20} color="#ef4444" style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="tech-content">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="tech-bottom-nav">
        <NavLink 
          to="/technician" 
          end
          className={({ isActive }) => `tech-nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={24} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/technician/repairs" 
          className={({ isActive }) => `tech-nav-item ${isActive ? 'active' : ''}`}
        >
          <Wrench size={24} />
          <span>Perbaikan</span>
        </NavLink>
        
        <NavLink 
          to="/technician/scan" 
          className={({ isActive }) => `tech-nav-item ${isActive ? 'active' : ''}`}
        >
          <ScanLine size={24} />
          <span>Scan</span>
        </NavLink>
        
        <NavLink 
          to="/technician/history" 
          className={({ isActive }) => `tech-nav-item ${isActive ? 'active' : ''}`}
        >
          <History size={24} />
          <span>History</span>
        </NavLink>

        <NavLink 
          to="/technician/profile" 
          className={({ isActive }) => `tech-nav-item ${isActive ? 'active' : ''}`}
        >
          <User size={24} />
          <span>Profil</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default TechnicianLayout;

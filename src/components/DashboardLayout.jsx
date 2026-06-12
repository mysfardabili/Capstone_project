import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, PenTool, RefreshCw, LogOut, Search, Bell, Settings, Menu, Moon, Sun } from 'lucide-react';
import './DashboardLayout.css';
import Toast from './Toast';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Efek untuk dark mode
  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleSignOut = () => {
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/dashboard/assets', label: 'Assets', icon: <Package size={20} /> },
    { path: '/dashboard/requests', label: 'Requests', icon: <ClipboardList size={20} /> },
    { path: '/dashboard/repairs', label: 'Repairs', icon: <PenTool size={20} /> },
    { path: '/dashboard/calibration', label: 'Kalibrasi', icon: <ClipboardList size={20} /> },
    { path: '/dashboard/mutation', label: 'Mutation', icon: <RefreshCw size={20} /> },
  ];

  return (
    <div className="dashboard-container">
      
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ padding: '1.5rem', justifyContent: 'center' }}>
          <img 
            src="/asetra-putih.png" 
            alt="Logo ASETRA" 
            style={{ width: '100%', maxWidth: '160px', objectFit: 'contain' }} 
          />
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-signout" onClick={handleSignOut}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              <Menu size={24} color="var(--text-main)" />
            </button>
            <h1 className="topbar-title">Dashboard</h1>
          </div>
          
          <div className="topbar-search">
            <Search size={18} />
            <input type="text" placeholder="Search by asset id" />
          </div>

          <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ cursor: 'pointer', padding: '5px', borderRadius: '50%', background: 'var(--bg-color)' }}>
              {isDarkMode ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="var(--text-muted)" />}
            </button>
            <div 
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => navigate('/dashboard/notifications')}
            >
              <Bell size={22} className="action-icon" />
              <div style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', background: 'var(--danger)', borderRadius: '50%', border: '2px solid var(--surface)' }}></div>
            </div>
            <Settings 
              size={22} 
              className="action-icon" 
              onClick={() => navigate('/dashboard/settings')}
            />
            <div className="user-avatar">AD</div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

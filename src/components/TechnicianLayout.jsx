import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wrench, ScanLine, History, User, Bell, LogOut, Moon, Sun } from 'lucide-react';
import { api } from '../services/api';

const TechnicianLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await api.get('/notifications');
        const count = data.filter(n => !n.isRead).length;
        setUnreadCount(count);
      } catch (err) {
        console.error('Failed to fetch notifications count:', err);
      }
    };
    fetchUnreadCount();
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-jakarta">
      {/* Topbar */}
      <header className="flex justify-between items-center px-6 py-[1.2rem] bg-white/85 dark:bg-slate-800/85 backdrop-blur-[12px] sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <img 
          src="/asetra-oren.png" 
          alt="ASETRA Logo" 
          className="h-8 object-contain"
        />
        
        <div className="ml-auto flex items-center gap-[15px]">
          <button
            onClick={() => setIsDark(!isDark)}
            className="bg-none border-none cursor-pointer flex items-center justify-center p-2 rounded-xl"
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-500" />}
          </button>
          <button
            onClick={() => navigate('/technician/notifications')}
            className="bg-none border-none cursor-pointer flex items-center justify-center p-2 rounded-xl relative"
          >
            <Bell size={24} className="text-slate-500 dark:text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute top-[6px] right-[6px] w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            )}
          </button>
          
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }} 
            className="bg-none border-none cursor-pointer flex items-center justify-center bg-slate-100 dark:bg-slate-700 p-2 rounded-xl"
          >
            <LogOut size={20} color="#ef4444" className="rotate-180" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 pb-[110px] overflow-y-auto max-w-[600px] mx-auto w-full md:border-x md:border-gray-200 dark:md:border-slate-700 md:shadow-[0_0_40px_rgba(0,0,0,0.03)] md:bg-white dark:md:bg-slate-800 md:min-h-screen">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-[15px] flex justify-around px-2 pb-6 pt-3 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-[100] rounded-t-3xl md:max-w-[600px] md:left-1/2 md:-translate-x-1/2">
        <NavLink 
          to="/technician" 
          end
          className={({ isActive }) => `flex flex-col items-center gap-[6px] text-slate-400 dark:text-slate-500 text-[0.7rem] font-bold no-underline transition-all duration-300 px-3 py-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 ${isActive ? 'text-[#ff6b00] dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 -translate-y-[2px] [&>svg]:scale-110' : ''}`}
        >
          <LayoutDashboard size={24} className="transition-transform duration-300" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/technician/repairs" 
          className={({ isActive }) => `flex flex-col items-center gap-[6px] text-slate-400 dark:text-slate-500 text-[0.7rem] font-bold no-underline transition-all duration-300 px-3 py-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 ${isActive ? 'text-[#ff6b00] dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 -translate-y-[2px] [&>svg]:scale-110' : ''}`}
        >
          <Wrench size={24} className="transition-transform duration-300" />
          <span>Perbaikan</span>
        </NavLink>
        
        <NavLink 
          to="/technician/scan" 
          className={({ isActive }) => `flex flex-col items-center gap-[6px] text-slate-400 dark:text-slate-500 text-[0.7rem] font-bold no-underline transition-all duration-300 px-3 py-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 ${isActive ? 'text-[#ff6b00] dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 -translate-y-[2px] [&>svg]:scale-110' : ''}`}
        >
          <ScanLine size={24} className="transition-transform duration-300" />
          <span>Scan</span>
        </NavLink>
        
        <NavLink 
          to="/technician/history" 
          className={({ isActive }) => `flex flex-col items-center gap-[6px] text-slate-400 dark:text-slate-500 text-[0.7rem] font-bold no-underline transition-all duration-300 px-3 py-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 ${isActive ? 'text-[#ff6b00] dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 -translate-y-[2px] [&>svg]:scale-110' : ''}`}
        >
          <History size={24} className="transition-transform duration-300" />
          <span>History</span>
        </NavLink>

        <NavLink 
          to="/technician/profile" 
          className={({ isActive }) => `flex flex-col items-center gap-[6px] text-slate-400 dark:text-slate-500 text-[0.7rem] font-bold no-underline transition-all duration-300 px-3 py-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 ${isActive ? 'text-[#ff6b00] dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 -translate-y-[2px] [&>svg]:scale-110' : ''}`}
        >
          <User size={24} className="transition-transform duration-300" />
          <span>Profil</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default TechnicianLayout;

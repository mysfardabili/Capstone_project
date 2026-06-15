import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, PenTool, RefreshCw, LogOut, Search, Bell, Settings, Menu, Moon, Sun } from 'lucide-react';
import { api } from '../services/api';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Jika tidak ada di localStorage, ikuti mode dari sistem operasi
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [currentUser, setCurrentUser] = useState({ name: 'Admin', profilePicture: '' });
  const [searchParams] = useSearchParams();
  const querySearch = searchParams.get('search') || '';
  const [searchVal, setSearchVal] = useState(querySearch);
  const [prevQuerySearch, setPrevQuerySearch] = useState(querySearch);

  if (querySearch !== prevQuerySearch) {
    setSearchVal(querySearch);
    setPrevQuerySearch(querySearch);
  }

  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notifications count when pathname changes
  React.useEffect(() => {
    let active = true;
    const fetchUnreadCount = async () => {
      try {
        const data = await api.get('/notifications');
        const count = data.filter(n => !n.isRead).length;
        if (active) {
          setUnreadCount(count);
        }
      } catch (err) {
        console.error('Failed to fetch unread count:', err);
      }
    };
    fetchUnreadCount();
    return () => { active = false; };
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/dashboard/assets?search=${encodeURIComponent(searchVal)}`);
  };

  // Load user from localStorage (updated on profile save)
  React.useEffect(() => {
    const loadUser = () => {
      const saved = localStorage.getItem('user');
      if (saved) {
        try { setCurrentUser(JSON.parse(saved)); } catch { /* ignore invalid JSON */ }
      }
    };
    loadUser();
    // Listen for profile updates (e.g., after Settings saves)
    window.addEventListener('userProfileUpdated', loadUser);
    return () => window.removeEventListener('userProfileUpdated', loadUser);
  }, []);

  const getUserInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  // Efek untuk dark mode - terapkan class dan simpan ke localStorage
  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
    <div className="flex h-screen overflow-hidden bg-background text-gray-800 dark:text-gray-100 transition-colors duration-300">

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[999]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-[1000] md:z-auto h-full w-[250px] bg-orange-500 dark:bg-gray-800 text-white flex flex-col shrink-0 transition-all duration-300 -translate-x-full md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : ''}`}>
        <div className="px-8 py-6 flex items-center justify-center">
          <img
            src="/asetra-putih.png"
            alt="Logo ASETRA"
            onClick={() => navigate('/dashboard')}
            className="w-full max-w-[160px] object-contain cursor-pointer"
          />
        </div>

        <nav className="flex flex-col gap-2 py-6 pl-4 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-4 px-4 py-3 font-semibold rounded-l-[2rem] transition-all duration-200 ${isActive
                  ? "bg-background text-orange-500 dark:text-orange-400 " +
                  "before:content-[''] before:absolute before:right-0 before:-top-5 before:w-5 before:h-5 before:bg-transparent before:rounded-br-[20px] before:shadow-[0_10px_0_0_var(--bg-color)] " +
                  "after:content-[''] after:absolute after:right-0 after:-bottom-5 after:w-5 after:h-5 after:bg-transparent after:rounded-tr-[20px] after:shadow-[0_-10px_0_0_var(--bg-color)]"
                  : "text-white hover:bg-white/10 dark:hover:bg-white/5"
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ); 
          })}
        </nav>

        <div className="p-6">
          <button
            className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-orange-500 dark:text-orange-400 p-3 rounded-lg font-semibold hover:bg-orange-50 dark:hover:bg-gray-600 transition-colors"
            onClick={handleSignOut}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center gap-[10px]">
            <button className="block md:hidden bg-none border-none text-orange-500 dark:text-blue-400 text-2xl cursor-pointer" onClick={toggleSidebar}>
              <Menu size={24} className="text-gray-800 dark:text-gray-100" />
            </button>
            <h1 className="text-2xl font-bold text-orange-500 dark:text-blue-400">Dashboard</h1>
          </div>

          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-[2rem] px-4 py-2 w-[300px] gap-2 border border-gray-200 dark:border-gray-600 transition-colors duration-300">
            <Search size={18} className="text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search by asset id"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="border-none bg-transparent outline-none w-full text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </form>

          <div className="flex items-center gap-5">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="cursor-pointer p-[5px] rounded-full bg-gray-100 dark:bg-gray-700">
              {isDarkMode ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} className="text-gray-500" />}
            </button>
            <div
              className="relative cursor-pointer"
              onClick={() => navigate('/dashboard/notifications')}
            >
              <Bell size={22} className="text-orange-500 dark:text-blue-400 cursor-pointer hover:opacity-70 transition-opacity" />
              {unreadCount > 0 && (
                <div className="absolute top-0 right-0 w-[10px] h-[10px] bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>
            <Settings
              size={22}
              className="text-orange-500 dark:text-blue-400 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => navigate('/dashboard/settings?tab=preferences')}
            />
            <div
              onClick={() => navigate('/dashboard/settings?tab=profile')}
              className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center font-semibold text-sm cursor-pointer overflow-hidden"
              title={currentUser.name || 'Profil'}
            >
              {currentUser.profilePicture ? (
                <img
                  src={`http://localhost:5000${currentUser.profilePicture}`}
                  alt="Foto Profil"
                  className="w-full h-full object-cover"
                />
              ) : getUserInitials(currentUser.name)}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-background text-gray-800 dark:text-gray-100 transition-colors duration-300">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

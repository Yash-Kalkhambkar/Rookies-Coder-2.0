import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', path: '/dashboard', adminOnly: false },
  { icon: 'map', label: 'Learning Path', path: '/path', adminOnly: false },
  { icon: 'book_4', label: 'Courses', path: '/lesson', adminOnly: false },
  { icon: 'forum', label: 'Community', path: '/community', adminOnly: false },
  { icon: 'monitoring', label: 'Progress', path: '/progress', adminOnly: false },
  { icon: 'emoji_events', label: 'Contests', path: '/contests', adminOnly: false },
  { icon: 'admin_panel_settings', label: 'Admin', path: '/admin', adminOnly: true },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isAuthPage = location.pathname === '/' || location.pathname === '/login';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const initials = profile?.display_name
    ? profile.display_name.slice(0, 2).toUpperCase()
    : profile?.username?.slice(0, 2).toUpperCase() ?? 'RC';

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="min-h-screen flex bg-neutral">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: '5rem' }}
        animate={{ width: isHovered ? '16rem' : '5rem' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed left-0 top-0 h-screen border-r border-outline bg-outline-variant flex flex-col z-40 overflow-hidden whitespace-nowrap shadow-xl"
      >
        <div className="h-16 flex items-center px-6 border-b border-outline min-w-[16rem]">
          <span className="material-symbols-outlined text-primary mr-4">menu_book</span>
          <motion.span
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="font-serif font-black text-xl tracking-tight"
          >
            Rookie's Coder
          </motion.span>
        </div>

        <nav className="flex-1 py-6 space-y-1 min-w-[16rem]">
          {NAV_ITEMS.filter(item => !item.adminOnly || profile?.role === 'admin').map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-mono uppercase tracking-tight font-medium transition-colors ${
                  isActive
                    ? 'bg-neutral text-primary border-l-4 border-primary'
                    : 'text-slate-600 hover:bg-[#f4f3f0] border-l-4 border-transparent'
                }`}
              >
                <span className="material-symbols-outlined mr-4 text-[20px]">{item.icon}</span>
                <motion.span animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.2 }}>
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        <div className="py-4 border-t border-outline min-w-[16rem]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-6 py-2 text-sm font-mono uppercase tracking-tight font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors border-l-4 border-transparent"
          >
            <span className="material-symbols-outlined mr-4 text-[20px]">logout</span>
            <motion.span animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.2 }}>Sign Out</motion.span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 ml-20 flex flex-col min-h-screen bg-neutral">
        {/* TopNav */}
        <header className="sticky top-0 h-16 border-b border-outline bg-neutral flex items-center justify-between px-8 z-30">
          <div className="flex items-center text-sm font-mono text-slate-500">
            <span>Rookie's Coder</span>
            <span className="mx-2">/</span>
            <span className="text-slate-900 capitalize">{location.pathname.substring(1).split('/')[0]}</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search manuscript..."
                className="pl-9 pr-4 py-1.5 bg-white border border-outline font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64"
              />
            </div>

            <button className="w-8 h-8 flex items-center justify-center border border-outline hover:bg-white transition-colors relative">
              <span className="material-symbols-outlined text-[20px] text-slate-600">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {/* User avatar + dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 bg-secondary text-white flex items-center justify-center font-mono text-sm font-bold cursor-pointer hover:bg-teal-700 transition-colors"
              >
                {initials}
              </button>
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-10 w-56 bg-white border border-outline shadow-[4px_4px_0px_0px_rgba(30,30,47,1)] z-50"
                  >
                    <div className="p-4 border-b border-outline">
                      <p className="font-bold text-sm text-tertiary">{profile?.display_name || profile?.username}</p>
                      <p className="font-mono text-xs text-slate-500">@{profile?.username}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-mono text-xs text-primary font-bold">{profile?.xp?.toLocaleString() ?? 0} XP</span>
                        <span className="font-mono text-xs text-secondary">{profile?.streak_days ?? 0} day streak</span>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center px-4 py-3 font-mono text-xs uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <span className="material-symbols-outlined mr-2 text-[16px]">logout</span>
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 p-10 lg:p-12" onClick={() => setShowUserMenu(false)}>
          {children}
        </main>
      </div>
    </div>
  );
}

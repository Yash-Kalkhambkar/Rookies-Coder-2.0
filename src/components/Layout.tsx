import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { icon: 'map', label: 'Learning Path', path: '/path' },
  { icon: 'book_4', label: 'Courses', path: '/lesson' },
  { icon: 'forum', label: 'Community', path: '/community' },
  { icon: 'monitoring', label: 'Progress', path: '/progress' },
  { icon: 'emoji_events', label: 'Contests', path: '/contests' },
  { icon: 'admin_panel_settings', label: 'Admin', path: '/admin' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const isAuthPage = location.pathname === '/' || location.pathname === '/login';

  if (isAuthPage) {
    return <>{children}</>;
  }

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
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
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
                <motion.span
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        <div className="py-4 border-t border-outline min-w-[16rem]">
          <Link to="/settings" className="flex items-center px-6 py-2 text-sm font-mono uppercase tracking-tight font-medium text-slate-600 hover:bg-[#f4f3f0] transition-colors border-l-4 border-transparent">
            <span className="material-symbols-outlined mr-4 text-[20px]">settings</span>
            <motion.span animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.2 }}>Settings</motion.span>
          </Link>
          <Link to="/support" className="flex items-center px-6 py-2 text-sm font-mono uppercase tracking-tight font-medium text-slate-600 hover:bg-[#f4f3f0] transition-colors mt-1 border-l-4 border-transparent">
            <span className="material-symbols-outlined mr-4 text-[20px]">help</span>
            <motion.span animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.2 }}>Support</motion.span>
          </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 ml-20 flex flex-col min-h-screen bg-neutral">
        {/* TopNav */}
        <header className="sticky top-0 h-16 border-b border-outline bg-neutral flex items-center justify-between px-8 z-30">
          <div className="flex items-center text-sm font-mono text-slate-500">
            <span>Rookie's Coder</span>
            <span className="mx-2">/</span>
            <span className="text-slate-900 capitalize">{location.pathname.substring(1)}</span>
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
            <button className="flex items-center px-3 py-1.5 bg-tertiary text-white font-mono text-sm hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined mr-1.5 text-[18px]">play_arrow</span>
              Execute
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-outline hover:bg-white transition-colors relative">
              <span className="material-symbols-outlined text-[20px] text-slate-600">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-secondary text-white flex items-center justify-center font-mono text-sm font-bold cursor-pointer">
              RC
            </div>
          </div>
        </header>

        <main className="flex-1 p-10 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}

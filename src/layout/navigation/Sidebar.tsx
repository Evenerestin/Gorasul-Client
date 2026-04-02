import { IconChevronLeft, IconMenu2, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import SidebarAuthFooter from './SidebarAuthFooter';
import SidebarLogo from './SidebarLogo';
import SidebarNavigation from './SidebarNavigation';

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-red-primary dark:bg-red-primary-light px-4 h-14">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/gorasul-light.png" alt="Logo" className="h-8 w-8 rounded-md object-contain" />
          <span className="text-sm font-semibold text-white tracking-tight">Gorasul</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Otwórz menu"
        >
          <IconMenu2 size={20} stroke={1.5} />
        </button>
      </header>

      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        inert={!mobileOpen ? true : undefined}
      />

      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-red-primary dark:bg-red-primary-light flex flex-col h-screen transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        inert={!mobileOpen ? true : undefined}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <SidebarLogo onClick={() => setMobileOpen(false)} />
          <button
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Zamknij menu"
          >
            <IconX size={18} stroke={1.5} />
          </button>
        </div>
        <SidebarNavigation onLinkClick={() => setMobileOpen(false)} />
        <SidebarAuthFooter onLogout={() => setMobileOpen(false)} />
      </div>

      <aside
        className={`hidden lg:flex sticky z-10 shrink-0 flex-col bg-red-primary dark:bg-red-primary-light h-screen top-0 transition-[width] duration-300 ${
          collapsed ? 'w-16' : 'w-56'
        }`}
        aria-label="Nawigacja główna"
      >
        <div
          className={`flex py-5 px-2 transition-all duration-300 ${
            collapsed
              ? 'flex-col items-center gap-0.5 justify-center'
              : 'items-center justify-between px-4'
          }`}
        >
          <SidebarLogo collapsed={collapsed} />
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={collapsed ? 'Rozwiń sidebar' : 'Zwiń sidebar'}
          >
            <IconChevronLeft
              size={16}
              stroke={2}
              className={`transition-transform duration-300 border-none outline-none ${collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
        <SidebarNavigation collapsed={collapsed} />
        <SidebarAuthFooter collapsed={collapsed} />
      </aside>
    </>
  );
}

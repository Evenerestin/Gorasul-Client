import { Outlet } from 'react-router';
import ThemeButton from './ThemeButton';
import { Sidebar } from './navigation/Sidebar';

export default function AppLayout() {
  return (
    <div className="flex bg-gray-200 dark:bg-neutral-900 min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
      >
        Przejdź do treści
      </a>
      <Sidebar />
      <main id="main-content" className="relative flex-1 p-4 pb-6 pt-18 lg:pt-4" tabIndex={-1}>
        <div className="absolute top-2.5 right-2.5 z-20">
          <ThemeButton />
        </div>
        <Outlet />
      </main>
    </div>
  );
}

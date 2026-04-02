import { useLocation } from 'react-router';
import { navSections, seasonalConfig } from '../../config/routes';
import { useAuth } from '../../contexts/useAuth';

import { useEffect, useState } from 'react';
import SidebarLink from './SidebarLink';
import SidebarSection from './SidebarSection';

export default function SidebarNavigation({
  collapsed,
  onLinkClick
}: {
  collapsed?: boolean;
  onLinkClick?: () => void;
}) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const visibleSections = (
    import.meta.env.DEV
      ? navSections
      : navSections.filter((section) => !section.protected || isAuthenticated)
  ).filter((section) => !section.seasonal || seasonalConfig[section.seasonal]);

  const [wikiOpen, setWikiOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith('/wiki')) {
      setWikiOpen(true);
    }
  }, [location.pathname]);

  return (
    <nav className="sidebar-scroll flex-1 min-h-0 overflow-y-auto">
      <div className="space-y-6 px-3 pt-2 pb-2">
        {visibleSections.map((section) => {
          const visibleItems = import.meta.env.DEV
            ? section.items
            : section.items.filter((item) => !item.adminOnly || user?.isAdmin);
          if (visibleItems.length === 0) return null;
          return (
            <div key={section.label}>
              <SidebarSection label={section.label} collapsed={collapsed} />
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  if (item.label === 'Wiki' && item.submenu) {
                    const isWikiActive = location.pathname.startsWith('/wiki');
                    return (
                      <div key={item.path}>
                        <div className="relative group">
                          <SidebarLink
                            icon={item.icon}
                            label={item.label}
                            path={item.path}
                            active={isWikiActive}
                            collapsed={collapsed}
                            onClick={onLinkClick}
                          />
                          {!collapsed && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setWikiOpen((open) => !open);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded transition-colors text-white/60 hover:text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                              aria-label={wikiOpen ? 'Zwiń podmenu Wiki' : 'Rozwiń podmenu Wiki'}
                              aria-expanded={wikiOpen}
                              aria-controls="wiki-submenu"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`transition-transform duration-200 ${wikiOpen ? '' : '-rotate-90'}`}
                              >
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            </button>
                          )}
                        </div>
                        {wikiOpen && !collapsed && (
                          <div
                            id="wiki-submenu"
                            role="group"
                            aria-label="Podmenu Wiki"
                            className="mt-1 ml-4 flex flex-col gap-0.5 border-l border-white/10 pl-2"
                          >
                            {item.submenu.map((sub) => (
                              <SidebarLink
                                key={sub.path}
                                icon={undefined}
                                label={sub.label}
                                path={sub.path}
                                active={location.pathname === sub.path}
                                collapsed={collapsed}
                                onClick={onLinkClick}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <SidebarLink
                      key={item.path}
                      icon={item.icon}
                      label={item.label}
                      path={item.path}
                      active={location.pathname === item.path}
                      collapsed={collapsed}
                      onClick={onLinkClick}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

import { Link } from 'react-router';
import { type NavItem } from '../../config/routes';

export default function SidebarLink({
  icon: Icon,
  label,
  path,
  active,
  collapsed,
  onClick
}: {
  icon?: NavItem['icon'];
  label: string;
  path: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={path}
      onClick={onClick}
      tabIndex={0}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-2 rounded-lg py-1.5 px-3 text-[13px] font-medium transition-colors duration-200 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
        active ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
      } ${collapsed ? 'justify-center' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      {Icon && (
        <span className="flex shrink-0 items-center leading-0">
          <Icon size={22} stroke={1.5} />
        </span>
      )}
      {!collapsed && (
        <span className="overflow-hidden whitespace-nowrap transition-[opacity,max-width] duration-300">
          {label}
        </span>
      )}
    </Link>
  );
}

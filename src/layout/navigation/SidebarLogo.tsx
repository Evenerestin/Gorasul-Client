import { Link } from 'react-router';

export default function SidebarLogo({
  collapsed,
  onClick
}: {
  collapsed?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to="/"
      title={collapsed ? 'Strona główna' : undefined}
      onClick={onClick}
      tabIndex={0}
      aria-label="Strona główna — Gorasul"
      className={`flex items-center shrink-0 rounded-lg transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${collapsed ? 'justify-center mb-2' : 'gap-3'}`}
    >
      <img
        src="/gorasul-light.png"
        alt="Logo"
        className="h-9 w-9 rounded-md object-contain shrink-0"
      />
      {/* <img
        src="/gorasul-dark.png"
        alt="Logo"
        className="h-9 w-9 rounded-md object-contain shrink-0"
      /> */}
      <span
        className={`overflow-hidden whitespace-nowrap text-base font-semibold tracking-tight text-white transition-all duration-300 ${
          collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
        }`}
      >
        Gorasul
      </span>
    </Link>
  );
}

export default function SidebarSection({
  label,
  collapsed
}: {
  label: string;
  collapsed?: boolean;
}) {
  return (
    <p
      className={`overflow-hidden whitespace-nowrap px-3 text-[11px] font-semibold uppercase tracking-widest text-white/50 transition-all duration-300 mb-2 max-h-8 ${
        collapsed ? 'opacity-0 w-0 h-0' : 'opacity-100 w-auto'
      }`}
    >
      {label}
    </p>
  );
}

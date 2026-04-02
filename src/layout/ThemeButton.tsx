import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeButton() {
  const { colorScheme, toggleColorScheme } = useTheme();

  return (
    <button
      onClick={toggleColorScheme}
      className="w-10 h-10 flex items-center justify-center rounded-md border text-black dark:text-white border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60 dark:focus-visible:ring-white/60"
      aria-label="Toggle color scheme"
    >
      {colorScheme === 'light' ? <IconSun stroke={1.5} /> : <IconMoon stroke={1.5} />}
    </button>
  );
}

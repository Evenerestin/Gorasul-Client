import { createContext, useContext, useEffect, useState } from 'react';

type ColorScheme = 'light' | 'dark';

interface ThemeContextValue {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const stored = localStorage.getItem('color-scheme');
    return (stored as ColorScheme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('color-scheme', colorScheme);
    document.documentElement.classList.toggle('dark', colorScheme === 'dark');
  }, [colorScheme]);

  const toggleColorScheme = () => setColorScheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

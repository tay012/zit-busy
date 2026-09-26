import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ isDark: false, toggleTheme: () => {} });

function systemDark(): boolean {
  return !!window.matchMedia?.('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [manual, setManual] = useState<string | null>(null);
  const isDark = manual === null ? systemDark() : manual === 'dark';

  const paint = useCallback((dark: boolean) => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', dark ? '#0F1115' : '#ffffff');
  }, []);

  useEffect(() => {
    paint(isDark);
  }, [isDark, paint]);

  useEffect(() => {
    if (manual !== null) return;
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const handler = () => paint(systemDark());
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [manual, paint]);

  const toggleTheme = useCallback(() => {
    setManual(isDark ? 'light' : 'dark');
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

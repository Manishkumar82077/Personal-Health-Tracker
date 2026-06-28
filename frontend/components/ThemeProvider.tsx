'use client';
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;                 // user preference
  resolvedTheme: 'light' | 'dark'; // what's actually applied
  setTheme: (t: Theme) => void;
  toggle: () => void;           // flip between light/dark
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'theme';

function systemPrefersDark() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyClass(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Initialise from localStorage on mount.
  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'system';
    setThemeState(stored);
  }, []);

  // Apply the theme whenever the preference changes, and follow the system
  // when in 'system' mode.
  useEffect(() => {
    const resolve = () => {
      const r = theme === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : theme;
      applyClass(r);
      setResolvedTheme(r);
    };
    resolve();

    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', resolve);
    return () => mq.removeEventListener('change', resolve);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    localStorage.setItem(STORAGE_KEY, t);
    setThemeState(t);
  }, []);

  const toggle = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

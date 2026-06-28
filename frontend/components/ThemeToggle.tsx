'use client';
import { useState, useEffect } from 'react';
import { LuSun, LuMoon } from 'react-icons/lu';
import { useTheme } from '@/components/ThemeProvider';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — the resolved theme is only known on the client.
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
    >
      {mounted && isDark ? <LuSun className="w-5 h-5" /> : <LuMoon className="w-5 h-5" />}
    </button>
  );
}

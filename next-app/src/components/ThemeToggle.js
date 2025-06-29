'use client';

import { useTheme } from '@/context/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2 bg-background text-foreground rounded">
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}

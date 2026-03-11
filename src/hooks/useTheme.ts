import { useState, useEffect, useCallback } from 'react';

type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'newshub_theme';

function getStoredTheme(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {}
  return 'system';
}

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolveIsDark(theme: ThemePreference): boolean {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return getSystemDark();
}

function applyDarkClass(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemePreference>(getStoredTheme);
  const [isDark, setIsDark] = useState<boolean>(() => resolveIsDark(getStoredTheme()));

  const setTheme = useCallback((newTheme: ThemePreference) => {
    localStorage.setItem(STORAGE_KEY, newTheme);
    setThemeState(newTheme);
    const dark = resolveIsDark(newTheme);
    setIsDark(dark);
    applyDarkClass(dark);
  }, []);

  // Apply dark class on mount
  useEffect(() => {
    applyDarkClass(isDark);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDark(e.matches);
        applyDarkClass(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  return { theme, isDark, setTheme };
}

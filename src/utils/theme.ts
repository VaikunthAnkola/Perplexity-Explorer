import { Theme } from '../types';

const THEME_KEY = 'perplexity_explorer_theme';

export function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch (e) {
    // fallback
  }
  return 'light'; // Whitish-cyan theme by default as requested
}

export function applyTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  } catch (e) {
    console.error('Failed to apply theme', e);
  }
}

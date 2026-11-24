import { HistoryItem } from '../types';

const STORAGE_KEY = 'perplexity_explorer_history_v2';
const MAX_HISTORY = 30;

export function getStoredHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load history from localStorage', e);
    return [];
  }
}

export function saveHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem[] {
  try {
    const current = getStoredHistory();
    const newItem: HistoryItem = {
      ...item,
      id: 'calc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toLocaleString()
    };
    
    // Avoid immediate duplicate sentence
    const filtered = current.filter(h => h.sentence.trim() !== item.sentence.trim());
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save calculation history', e);
    return [];
  }
}

export function clearStoredHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear calculation history', e);
  }
}

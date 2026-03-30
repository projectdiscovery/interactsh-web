import { StoredData, defaultStoredData } from '../types/storedData';

const STORAGE_KEY = 'app';

export { defaultStoredData };

// Debounce timer for localStorage writes
let writeDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let pendingData: StoredData | null = null;

// Debounced write to prevent blocking main thread on rapid updates
export const writeStoredData = (data: StoredData): void => {
  if (typeof window === 'undefined') return;

  pendingData = data;

  // Clear existing timer
  if (writeDebounceTimer) {
    clearTimeout(writeDebounceTimer);
  }

  // Debounce writes by 300ms to batch rapid updates
  writeDebounceTimer = setTimeout(() => {
    if (pendingData) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingData));
      } catch (error) {
        console.error('Failed to write to localStorage:', error);
      }
      pendingData = null;
    }
    writeDebounceTimer = null;
  }, 300);
};

// Force immediate write (for critical updates like before page unload)
export const flushStoredData = (): void => {
  if (writeDebounceTimer) {
    clearTimeout(writeDebounceTimer);
    writeDebounceTimer = null;
  }
  if (pendingData && typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingData));
    } catch (error) {
      console.error('Failed to write to localStorage:', error);
    }
    pendingData = null;
  }
};

export const getStoredData = (): StoredData => {
  if (typeof window === 'undefined') {
    return defaultStoredData;
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...defaultStoredData,
        ...parsed,
        filter: { ...defaultStoredData.filter, ...parsed.filter },
      };
    }
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
  }
  
  return defaultStoredData;
};

'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Manages state synchronized with localStorage.
 * Handles SSR gracefully and updates across browser tabs.
 *
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns A tuple of [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const subscribe = useCallback(
    (callback: () => void) => {
      window.addEventListener('storage', callback);
      window.addEventListener(`localStorage-${key}`, callback);

      return () => {
        window.removeEventListener('storage', callback);
        window.removeEventListener(`localStorage-${key}`, callback);
      };
    },
    [key]
  );

  const getSnapshot = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const getServerSnapshot = useCallback((): T => {
    return initialValue;
  }, [initialValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new Event(`localStorage-${key}`));
      } catch {
        // Silently fail in environments where localStorage is not available
      }
    },
    [key, value]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      window.dispatchEvent(new Event(`localStorage-${key}`));
    } catch {
      // Silently fail in environments where localStorage is not available
    }
  }, [key]);

  return [value, setValue, removeValue];
}

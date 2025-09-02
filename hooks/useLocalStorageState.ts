
import { useState, useEffect } from 'react';

// A custom hook to persist state in localStorage
export function useLocalStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    // This function runs only once on initial render
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
    // If no stored value or if it's the first run, return default
    if (typeof defaultValue === 'function') {
        return defaultValue();
    }
    return defaultValue;
  });

  useEffect(() => {
    // This effect runs whenever the state changes
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

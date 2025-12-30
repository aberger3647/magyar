import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) return defaultValue;
    
    try {
      // Try to parse as JSON first
      return JSON.parse(storedValue) as T;
    } catch {
      // If not valid JSON, return as string (for backwards compatibility)
      return storedValue as unknown as T;
    }
  });

  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          // Try to parse as JSON first
          setValue(JSON.parse(e.newValue) as T);
        } catch {
          // If not valid JSON, return as string (for backwards compatibility)
          setValue(e.newValue as unknown as T);
        }
      }
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, [key]);

  const setStorageValue = (newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue); // Update state to trigger re-render
  };

  return [value, setStorageValue];
}

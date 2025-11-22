import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer that will update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay has passed
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
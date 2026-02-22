'use client';

import { useCallback, useState } from 'react';

/**
 * Manages a boolean state with toggle, setTrue, and setFalse functions.
 * Useful for modals, dropdowns, and other UI components with open/closed states.
 *
 * @param initialValue - Initial boolean value (default: false)
 * @returns A tuple containing [value, toggle, setTrue, setFalse]
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, () => void, () => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse];
}

import React, { useCallback, useState } from 'react';
import { useIsMounted } from './use-is-mounted';

export function useSafeState<T>(initialValue: T | (() => T)) {
  const [value, setValue] = useState(initialValue);
  const isMounted = useIsMounted();

  const safeSetValue = useCallback((newValue: React.SetStateAction<T>) => {
    if (isMounted()) return;
    setValue(newValue);
  }, []);

  return [value, safeSetValue] as const;
}

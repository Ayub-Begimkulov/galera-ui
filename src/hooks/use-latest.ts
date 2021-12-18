import { useCallback, useLayoutEffect, useRef } from 'react';

export function useLatest<T>(value: T) {
  const valueRef = useRef(value);

  useLayoutEffect(() => {
    valueRef.current = value;
  });

  const getter = useCallback(() => valueRef.current, []);

  return getter;
}

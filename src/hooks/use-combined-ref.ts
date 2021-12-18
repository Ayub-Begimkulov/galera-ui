import React, { useCallback } from 'react';
import { isFunction } from '../utils/is-function';

type Ref<T> = React.MutableRefObject<T> | React.RefCallback<T>;

export function useCombinedRef<T>(...refs: Ref<T>[]) {
  const combinedRef = useCallback((value: T) => {
    refs.forEach(ref => {
      if (isFunction(ref)) {
        ref(value);
      } else {
        ref.current = value;
      }
    });
  }, refs);

  return combinedRef;
}

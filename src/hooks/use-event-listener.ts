import { useEffect } from 'react';
import { useLatest } from './use-latest';

type EventListener = {
  bivarianceHack(event: Event): void;
}['bivarianceHack'];

interface UseEventListenerOptions {
  type: string;
  listener: EventListener;
  element?: EventTarget;
}

export function useEventListener({
  type,
  listener,
  element = window,
}: UseEventListenerOptions) {
  const latestListener = useLatest(listener);

  useEffect(() => {
    const actualListener = (event: Event) => latestListener()(event);

    element.addEventListener(type, actualListener);

    return () => element.removeEventListener(type, actualListener);
  }, [type, element]);
}

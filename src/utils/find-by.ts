import { AnyObject } from '../types';

export function findBy<T extends AnyObject, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K]
) {
  return items.find(item => item[key] === value);
}

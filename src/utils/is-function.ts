import { AnyFunction } from '../types/index';

export function isFunction(val: unknown): val is AnyFunction {
  return typeof val === 'function';
}

import { useEffect, DependencyList } from "react";

export function useDebounceEffect<T extends unknown[]>(
  fn: (...args: T) => void,
  waitTime: number,
  deps: DependencyList = []
) {
  useEffect(() => {
    const t = setTimeout(() => {
      const dependencies = [...deps] as T;
      fn.apply(undefined, dependencies);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

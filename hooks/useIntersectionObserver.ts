import { useState, useEffect } from "react";

export function useIntersectionObserver(
  ref: React.MutableRefObject<any>,
  {
    threshold = 0,
    root,
    rootMargin = "50%",
    reset = false,
  }: IntersectionObserverInit & { reset?: boolean }
) {
  const supportsFeature = Boolean(
    window &&
      "IntersectionObserver" in window &&
      "IntersectionObserverEntry" in window &&
      "intersectionRatio" in window.IntersectionObserverEntry.prototype &&
      "isIntersecting" in window.IntersectionObserverEntry.prototype
  );

  const [state, setState] = useState<{
    isInView: boolean;
    hasTriggered: boolean;
    entry: IntersectionObserver | undefined;
  }>({
    isInView: false,
    hasTriggered: false,
    entry: undefined,
  });

  let observer: IntersectionObserver | undefined = !supportsFeature
    ? undefined
    : new IntersectionObserver(
        (entries, observerInstance) => {
          const ratio = entries[0].intersectionRatio;
          if (ratio > 0) {
            setState({
              isInView: ratio <= 1 && ratio >= threshold,
              hasTriggered: true,
              entry: observerInstance,
            });

            if (!reset) {
              observerInstance.unobserve(ref.current);
            }
          }
          return;
        },
        {
          threshold: threshold || 0,
          root: root || null,
          rootMargin: rootMargin || "0%",
        }
      );

  useEffect(() => {
    if (ref.current && !state.hasTriggered && observer) {
      observer.observe(ref.current);
    }
  });

  return { ...state, supportsFeature };
}

"use client";

import { useEffect, useState, RefObject } from "react";

export function useInView<T extends HTMLElement>(
  ref: RefObject<T | null>,
  rootMargin = "400px"
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, inView, rootMargin]);

  return inView;
}

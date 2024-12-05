import { useEffect, useRef } from "react";

interface UseObserverOptions {
  root?: HTMLElement | null; // The root element for the observer
  threshold?: number | number[]; // Threshold(s) for the observer
  onIntersectTop?: () => void; // Callback when the top sentinel intersects
  onIntersectBottom?: () => void; // Callback when the bottom sentinel intersects
}

export const useIntersectionObserver = ({
  root = null,
  threshold = 0.5,
  onIntersectTop,
  onIntersectBottom,
}: UseObserverOptions) => {
  const topRef = useRef<HTMLDivElement | null>(null); // Top sentinel ref
  const bottomRef = useRef<HTMLDivElement | null>(null); // Bottom sentinel ref

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === topRef.current && onIntersectTop) {
              onIntersectTop();
            } else if (
              entry.target === bottomRef.current &&
              onIntersectBottom
            ) {
              onIntersectBottom();
            }
          }
        });
      },
      { root, threshold }
    );

    if (topRef.current) observer.observe(topRef.current);
    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => {
      if (topRef.current) observer.unobserve(topRef.current);
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [root, threshold, onIntersectTop, onIntersectBottom]);

  return { topRef, bottomRef };
};

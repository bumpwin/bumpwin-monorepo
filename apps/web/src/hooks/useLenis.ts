"use client";

import Lenis from "lenis";
import { useEffect, useState } from "react";

export interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  orientation?: "vertical" | "horizontal";
  gestureOrientation?: "vertical" | "horizontal";
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  smoothTouch?: boolean;
  touchMultiplier?: number;
  infinite?: boolean;
}

export type LenisInstance = Lenis | null;

/**
 * React hook for integrating Lenis smooth scrolling in a modern way.
 * @param options Lenis configuration options
 * @returns Lenis instance or null if initialization failed
 */
export function useLenis(options: LenisOptions = {}): LenisInstance {
  const [lenis, setLenis] = useState<LenisInstance>(null);

  useEffect(() => {
    // Default options merged with provided options
    const defaultOptions: LenisOptions = {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    };

    try {
      // Create Lenis instance with merged options
      const lenisInstance = new Lenis({
        ...defaultOptions,
        ...options,
      });

      // Initialize the animation loop
      function raf(time: number) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Store the instance
      setLenis(lenisInstance);

      // Clean up on unmount
      return () => {
        lenisInstance.destroy();
      };
    } catch (error) {
      console.error("Failed to initialize Lenis:", error);
      return () => {};
    }
  }, [options]);

  return lenis;
}

/**
 * Helper function to scroll to a target element or position using Lenis
 * @param lenis Lenis instance
 * @param target Target element or position
 * @param options Scroll options
 */
export function scrollTo(
  lenis: LenisInstance,
  target: HTMLElement | string | number,
  options?: { offset?: number; duration?: number; immediate?: boolean },
) {
  if (!lenis) return;
  lenis.scrollTo(target, options);
}

export default useLenis;

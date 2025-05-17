'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';

// Define types for Lenis options
type LenisOrientation = 'vertical' | 'horizontal';
type LenisGestureOrientation = 'vertical' | 'horizontal' | 'both';

interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  orientation?: LenisOrientation;
  gestureOrientation?: LenisGestureOrientation;
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  smoothTouch?: boolean;
  touchMultiplier?: number;
  infinite?: boolean;
  [key: string]: any;
}

// Define the context interfaces
interface LenisContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: any) => void;
}

// Create context with default values
const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
});

// Define provider props
interface LenisProviderProps {
  children: ReactNode;
  options?: LenisOptions;
}

export function LenisProvider({ children, options = {} }: LenisProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Default options
    const defaultOptions: LenisOptions = {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    };
    
    // Create Lenis instance
    let lenisInstance: Lenis | null = null;
    try {
      lenisInstance = new Lenis({
        ...defaultOptions,
        ...options,
      });

      // Set up animation loop
      function raf(time: number) {
        if (lenisInstance) {
          lenisInstance.raf(time);
        }
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Store instance in state
      setLenis(lenisInstance);
    } catch (error) {
      console.error('Failed to initialize Lenis:', error);
    }

    // Cleanup on unmount
    return () => {
      if (lenisInstance) {
        lenisInstance.destroy();
      }
    };
  }, [options]);

  // Scroll helper function
  const scrollToFn = (
    target: string | number | HTMLElement, 
    scrollOptions: any = {}
  ) => {
    if (lenis) {
      lenis.scrollTo(target, scrollOptions);
    }
  };

  return (
    <LenisContext.Provider value={{ lenis, scrollTo: scrollToFn }}>
      {children}
    </LenisContext.Provider>
  );
}

// Hook to use Lenis context
export function useLenis() {
  return useContext(LenisContext);
} 
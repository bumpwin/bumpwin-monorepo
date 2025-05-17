"use client";

import { useEffect } from 'react';
import ParallaxScroller from '../../components/ParallaxScroller';
import { useLenis } from '../../providers/LenisProvider';

type AboutClientProps = {
  children: React.ReactNode;
};

export default function AboutClient({ children }: AboutClientProps) {
  const { lenis } = useLenis();
  
  useEffect(() => {
    if (!lenis) return;
    
    // Set up scroll snap alignments
    const scrollSnapSections = document.querySelectorAll('[data-lenis-scroll-snap-align]');
    for (const section of scrollSnapSections) {
      section.classList.add('scroll-snap-align');
    }
    
    // Configure additional Lenis settings for this page
    lenis.on('scroll', ({ progress }) => {
      // Update scroll progress for animations
      document.documentElement.style.setProperty('--scroll-progress', progress.toString());
    });

    return () => {
      if (lenis) {
        // Remove scroll event listeners
        lenis.off('scroll', () => {});
      }
      document.documentElement.style.removeProperty('--scroll-progress');
    };
  }, [lenis]);

  return (
    <ParallaxScroller>
      {children}
    </ParallaxScroller>
  );
} 
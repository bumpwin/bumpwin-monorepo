"use client";

import { useEffect, useRef } from 'react';
// No direct Lenis import needed here

interface ParallaxScrollerProps {
  children: React.ReactNode;
}

const ParallaxScroller = ({ children }: ParallaxScrollerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Handle parallax and pinning effects with pure JS
    const parallaxElements = document.querySelectorAll('[data-parallax-depth]');
    const pinElements = document.querySelectorAll('[data-parallax-pin="true"]');
    const stickyContainers = document.querySelectorAll('.sticky-container');
    
    // Setup Intersection Observer for optimization
    const observerOptions = {
      root: null,
      rootMargin: '20% 0px',
      threshold: 0.1
    };
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        // Add or remove active class based on visibility
        if (entry.isIntersecting) {
          target.classList.add('parallax-active');
        } else {
          target.classList.remove('parallax-active');
        }
      }
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe all parallax elements
    for (const el of Array.from(parallaxElements)) {
      observer.observe(el);
    }
    
    for (const el of Array.from(pinElements)) {
      observer.observe(el);
    }
    
    for (const el of Array.from(stickyContainers)) {
      observer.observe(el);
    }
    
    // Scroll handler for parallax effects
    const handleScroll = () => {
      // Get scroll position
      const scrollY = window.scrollY || window.pageYOffset;
      
      // Process visible elements (with 'parallax-active' class)
      for (const element of document.querySelectorAll('.parallax-active[data-parallax-depth]')) {
        const el = element as HTMLElement;
        const depth = Number.parseFloat(el.getAttribute('data-parallax-depth') || '0');
        const offset = Number.parseFloat(el.getAttribute('data-parallax-offset') || '0');
        
        // Get scroll position relative to the element
        const rect = el.getBoundingClientRect();
        const scrollPosition = window.innerHeight - rect.top;
        const scrollFactor = scrollPosition * depth * 0.1;
        
        // Apply transform based on scroll position
        el.style.transform = `translate3d(0, ${scrollFactor + offset}px, 0)`;
      }
      
      // Handle pin elements
      for (const element of document.querySelectorAll('.parallax-active[data-parallax-pin="true"]')) {
        const el = element as HTMLElement;
        const pinOffset = Number.parseFloat(el.getAttribute('data-parallax-pin-offset') || '0');
        
        // Calculate how far the element's parent is from the top
        const container = el.closest('.pin-background') as HTMLElement;
        if (!container) continue;
        
        const containerRect = container.getBoundingClientRect();
        const scrollProgress = 1 - (containerRect.top / window.innerHeight);
        
        // Visual effect: subtle scale and position adjustments
        if (scrollProgress >= 0 && scrollProgress <= 1) {
          const scale = 1 + (scrollProgress * 0.05); // Subtle scale effect
          const yOffset = -pinOffset * scrollProgress * 50; // Controlled vertical movement
          el.style.transform = `translate3d(0, ${yOffset}px, 0) scale(${scale})`;
        }
      }
      
      // Handle sticky elements
      for (const element of document.querySelectorAll('.sticky-element')) {
        const el = element as HTMLElement;
        const container = el.closest('.sticky-container') as HTMLElement;
        if (!container) continue;
        
        const containerRect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Create sticky effect within container bounds
        if (containerRect.top < viewportHeight * 0.2 && containerRect.bottom > viewportHeight * 0.8) {
          el.style.position = 'sticky';
          el.style.top = '20%';
        }
      }
    };
    
    // Set up scroll listener - will be overridden by Lenis if available from context
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call to set initial positions
    handleScroll();
    
    // Return cleanup function
    return () => {
      observer.disconnect();
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Add CSS for parallax effects
  useEffect(() => {
    // Add custom CSS for parallax elements
    const style = document.createElement('style');
    style.textContent = `
      .parallax-bg, .parallax-pin {
        will-change: transform;
        transform-style: preserve-3d;
        backface-visibility: hidden;
      }
      
      .parallax-image-container {
        overflow: hidden;
        position: relative;
      }
      
      .parallax-image {
        transform-origin: center center;
        transform: scale(1.05);
        transition: transform 0.3s ease-out;
      }
      
      .parallax-layer {
        will-change: transform;
      }
      
      .sticky-element {
        position: relative;
        z-index: 10;
      }
      
      .pin-element {
        transform-style: preserve-3d;
        will-change: transform;
      }
      
      .sticky-chart {
        position: relative;
        z-index: 5;
      }
      
      /* CSS Variables for scroll animations */
      :root {
        --scroll-progress: 0;
      }
      
      /* Ensure smooth transitions */
      [data-parallax-depth], [data-parallax-pin="true"] {
        transition: transform 0.05s linear;
      }
      
      /* Scroll Snap Points */
      [data-lenis-scroll-snap-align] {
        scroll-snap-align: start;
      }
      
      /* Reduce motion for users who prefer it */
      @media (prefers-reduced-motion: reduce) {
        [data-parallax-depth], [data-parallax-pin="true"] {
          transform: none !important;
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div ref={scrollRef} className="parallax-container">
      {children}
    </div>
  );
};

export default ParallaxScroller; 
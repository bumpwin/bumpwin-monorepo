'use client';

import { MouseEvent, type ReactNode } from 'react';
import { useLenis } from '../providers/LenisProvider';

interface SmoothScrollLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  offset?: number;
  duration?: number;
  onClick?: () => void;
}

/**
 * A component that handles smooth scrolling to anchor links using Lenis
 */
export default function SmoothScrollLink({
  href,
  children,
  className = '',
  offset = 0,
  duration = 1.2,
  onClick,
}: SmoothScrollLinkProps) {
  const { lenis, scrollTo } = useLenis();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Only intercept anchor links
    if (href.startsWith('#')) {
      e.preventDefault();

      // Call user's onClick if provided
      if (onClick) onClick();

      // Handle smooth scrolling
      if (lenis) {
        scrollTo(href, { 
          offset, 
          duration,
        });
      } else {
        // Fallback if Lenis is not available
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset + offset;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      }
    }
  };

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
} 
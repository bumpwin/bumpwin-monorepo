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

    // Battle progress bar related elements
    const progressBar = document.querySelector('.battle-progress-bar');
    const progressContainer = document.querySelector('.battle-progress-container');
    const daytimeMarker = document.querySelector('.phase-daytime-marker');
    const darknightMarker = document.querySelector('.phase-darknight-marker');
    const sunriseMarker = document.querySelector('.phase-sunrise-marker');
    const battleSection = document.querySelector('.battle-phases-section');
    const predictionChart = document.querySelector('.sticky-chart');
    let battleSectionTop = 0;
    let battleSectionHeight = 0;
    let battleSectionBottom = 0;
    
    // Function to calculate positions
    const calculatePositions = () => {
      if (battleSection) {
        const rect = battleSection.getBoundingClientRect();
        battleSectionTop = rect.top + window.scrollY;
        battleSectionHeight = rect.height;
        battleSectionBottom = battleSectionTop + battleSectionHeight;
        
        // Immediately check scroll position after calculating
        updateElementsBasedOnScroll(window.scrollY);
      }
    };
    
    // Function to update UI elements based on scroll position
    const updateElementsBasedOnScroll = (scrollPosition: number) => {
      if (progressContainer && predictionChart && battleSection) {
        // Only show progress bar and chart when near or within the battle section
        if (scrollPosition >= battleSectionTop - window.innerHeight/2 && 
            scrollPosition <= battleSectionBottom + window.innerHeight/4) {
          progressContainer.classList.remove('opacity-0', 'pointer-events-none');
          progressContainer.classList.add('opacity-100');
          
          predictionChart.classList.remove('opacity-0', 'pointer-events-none');
          predictionChart.classList.add('opacity-100');
        } else {
          progressContainer.classList.add('opacity-0', 'pointer-events-none');
          progressContainer.classList.remove('opacity-100');
          
          predictionChart.classList.add('opacity-0', 'pointer-events-none');
          predictionChart.classList.remove('opacity-100');
        }
      }
      
      if (progressBar && battleSection) {
        // Get current scroll position relative to battle section
        const scrollPos = scrollPosition - battleSectionTop;
        const maxScroll = battleSectionHeight;
        const scrollPercentage = Math.max(0, Math.min(100, (scrollPos / maxScroll) * 100));
        
        // Update progress bar width
        progressBar.setAttribute('style', `width: ${scrollPercentage}%`);
        
        // Update phase markers based on scroll position
        if (daytimeMarker && darknightMarker && sunriseMarker) {
          // First phase marker is always active
          daytimeMarker.classList.add('bg-blue-500');
          daytimeMarker.classList.remove('bg-gray-600');
          
          const daytimeLabel = document.querySelector('.phase-daytime-label');
          if (daytimeLabel) {
            daytimeLabel.classList.add('text-blue-400');
            daytimeLabel.classList.remove('text-gray-400');
          }
          
          if (scrollPercentage >= 40) {
            darknightMarker.classList.add('bg-purple-500');
            darknightMarker.classList.remove('bg-gray-600');
            
            const darknightLabel = document.querySelector('.phase-darknight-label');
            if (darknightLabel) {
              darknightLabel.classList.add('text-purple-400');
              darknightLabel.classList.remove('text-gray-400');
            }
          } else {
            darknightMarker.classList.remove('bg-purple-500');
            darknightMarker.classList.add('bg-gray-600');
            
            const darknightLabel = document.querySelector('.phase-darknight-label');
            if (darknightLabel) {
              darknightLabel.classList.remove('text-purple-400');
              darknightLabel.classList.add('text-gray-400');
            }
          }
          
          if (scrollPercentage >= 80) {
            sunriseMarker.classList.add('bg-yellow-500');
            sunriseMarker.classList.remove('bg-gray-600');
            
            const sunriseLabel = document.querySelector('.phase-sunrise-label');
            if (sunriseLabel) {
              sunriseLabel.classList.add('text-yellow-400');
              sunriseLabel.classList.remove('text-gray-400');
            }
          } else {
            sunriseMarker.classList.remove('bg-yellow-500');
            sunriseMarker.classList.add('bg-gray-600');
            
            const sunriseLabel = document.querySelector('.phase-sunrise-label');
            if (sunriseLabel) {
              sunriseLabel.classList.remove('text-yellow-400');
              sunriseLabel.classList.add('text-gray-400');
            }
          }
        }
      }
    };

    // Calculate initial positions
    calculatePositions();
    
    // Configure additional Lenis settings for this page
    lenis.on('scroll', ({ progress, scroll }) => {
      // Update scroll progress for animations
      document.documentElement.style.setProperty('--scroll-progress', progress.toString());
      
      // Update elements based on current scroll position
      updateElementsBasedOnScroll(scroll);
    });

    // Handle window resize
    window.addEventListener('resize', calculatePositions);
    window.addEventListener('load', calculatePositions);

    return () => {
      if (lenis) {
        // Remove scroll event listeners
        lenis.off('scroll', () => {});
      }
      document.documentElement.style.removeProperty('--scroll-progress');
      window.removeEventListener('resize', calculatePositions);
      window.removeEventListener('load', calculatePositions);
    };
  }, [lenis]);

  return (
    <ParallaxScroller>
      {children}
    </ParallaxScroller>
  );
} 
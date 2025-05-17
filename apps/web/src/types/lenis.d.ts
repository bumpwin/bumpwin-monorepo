declare module 'lenis' {
  export interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    orientation?: 'vertical' | 'horizontal';
    gestureOrientation?: 'vertical' | 'horizontal' | 'both';
    smoothWheel?: boolean;
    wheelMultiplier?: number;
    smoothTouch?: boolean;
    touchMultiplier?: number;
    infinite?: boolean;
    [key: string]: any;
  }

  export interface LenisScrollEventData {
    scroll: number;
    limit: number;
    velocity: number;
    direction: number;
    progress: number;
    [key: string]: any;
  }

  type EventCallback = (data: LenisScrollEventData) => void;

  export default class Lenis {
    constructor(options?: LenisOptions);
    
    // Core methods
    raf(time: number): void;
    scrollTo(target: number | string | HTMLElement, options?: any): void;
    destroy(): void;
    
    // Event handling
    on(event: string, callback: EventCallback): void;
    off(event: string, callback: EventCallback): void;
    
    // Properties
    get scroll(): number;
    get limit(): number;
    get velocity(): number;
    get direction(): number;
    get progress(): number;
  }
} 
import React, { useEffect, useRef } from 'react';

/**
 * Hook to attach high-performance cursor tracking & proximity calculations
 * for interactive-glow cards, feature blocks, and buttons.
 * Sets CSS custom properties:
 * --mouse-x, --mouse-y (relative cursor position in px)
 * --mouse-x-pct, --mouse-y-pct (relative cursor position in %)
 * --proximity (0 to 1 representing distance as cursor travels across the viewport)
 * --is-hovered (1 when cursor is directly over the element, 0 otherwise)
 */
export function useInteractiveGlow<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = ref.current;
    if (!el || !el.style) return;

    if (typeof window.matchMedia === 'function') {
      try {
        if (window.matchMedia('(hover: none)')?.matches || window.matchMedia('(prefers-reduced-motion: reduce)')?.matches) {
          return;
        }
      } catch {
        // Continue safely if matchMedia throws
      }
    }

    let frameId: number | null = null;
    let latestX = 0;
    let latestY = 0;
    let isInside = false;

    const updateCSS = () => {
      if (!el || !el.style) return;
      el.style.setProperty('--mouse-x', `${latestX}px`);
      el.style.setProperty('--mouse-y', `${latestY}px`);
      frameId = null;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!el || typeof el.getBoundingClientRect !== 'function') return;
      const rect = el.getBoundingClientRect();
      latestX = e.clientX - rect.left;
      latestY = e.clientY - rect.top;

      if (!frameId) {
        frameId = requestAnimationFrame(updateCSS);
      }
    };

    const handlePointerEnter = (e: PointerEvent) => {
      isInside = true;
      if (!el || !el.style || typeof el.getBoundingClientRect !== 'function') return;
      const rect = el.getBoundingClientRect();
      latestX = e.clientX - rect.left;
      latestY = e.clientY - rect.top;
      el.style.setProperty('--mouse-x', `${latestX}px`);
      el.style.setProperty('--mouse-y', `${latestY}px`);
      el.style.setProperty('--proximity', '1');
      el.style.setProperty('--is-hovered', '1');
      el.setAttribute('data-hovered', 'true');
    };

    const handlePointerLeave = () => {
      isInside = false;
      if (!el || !el.style) return;
      el.removeAttribute('data-hovered');
      el.style.setProperty('--is-hovered', '0');
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    el.addEventListener('pointerenter', handlePointerEnter, { passive: true });
    el.addEventListener('pointermove', handlePointerMove, { passive: true });
    el.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      el.removeEventListener('pointerenter', handlePointerEnter);
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return ref;
}

interface InteractiveGlowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  glowColor?: 'silver' | 'graphite' | 'sky' | 'amber' | 'emerald';
}

/**
 * Reusable InteractiveGlow component
 * High-precision cursor-following graphite/silver lighting for dark & light surfaces.
 */
export const InteractiveGlow: React.FC<InteractiveGlowProps> = ({
  children,
  className = '',
  as: Component = 'div',
  glowColor = 'silver',
  ...props
}) => {
  const ref = useInteractiveGlow<HTMLDivElement>();

  return (
    <Component
      ref={ref}
      className={`interactive-glow interactive-glow-${glowColor} ${className}`}
      {...props}
    >
      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full pointer-events-auto">
        {children}
      </div>
    </Component>
  );
};

/**
 * Global delegated cursor and proximity tracker.
 * Continuously tracks the cursor across the viewport and illuminates
 * nearby cards, buttons, tabs, and icon containers before and during hover.
 */
export const GlobalInteractiveGlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (typeof window.matchMedia === 'function') {
      try {
        if (window.matchMedia('(hover: none)')?.matches || window.matchMedia('(prefers-reduced-motion: reduce)')?.matches) {
          return;
        }
      } catch {
        // Fallback safely
      }
    }

    let frameId: number | null = null;
    let clientX = -1000;
    let clientY = -1000;

    const updateAllGlowElements = () => {
      try {
        const elements = document.querySelectorAll<HTMLElement>(
          '.interactive-glow, .interactive-glow-card, .interactive-glow-subtle, .case-card, .tab-btn, button.bg-slate-900, button.bg-sky-600'
        );

        const maxProximityDistance = 240; // Detection radius around elements

        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          if (!el || !el.style || typeof el.getBoundingClientRect !== 'function') continue;
          const rect = el.getBoundingClientRect();

          // Calculate distance from cursor to element bounding box
          const closestX = Math.max(rect.left, Math.min(clientX, rect.right));
          const closestY = Math.max(rect.top, Math.min(clientY, rect.bottom));
          const dx = clientX - closestX;
          const dy = clientY - closestY;
          const dist = Math.hypot(dx, dy);

          // Relative coordinates inside the element
          const relX = clientX - rect.left;
          const relY = clientY - rect.top;

          el.style.setProperty('--mouse-x', `${relX}px`);
          el.style.setProperty('--mouse-y', `${relY}px`);

          if (dist <= 0) {
            // Inside element
            el.style.setProperty('--proximity', '1');
            el.style.setProperty('--is-hovered', '1');
          } else if (dist < maxProximityDistance) {
            // Nearby element - continuous smooth proximity fade
            const prox = Math.pow(1 - dist / maxProximityDistance, 1.8);
            el.style.setProperty('--proximity', prox.toFixed(3));
            el.style.setProperty('--is-hovered', '0');
          } else {
            // Out of range
            if (el.style.getPropertyValue('--proximity') !== '0') {
              el.style.setProperty('--proximity', '0');
              el.style.setProperty('--is-hovered', '0');
            }
          }
        }
      } catch {
        // Suppress any DOM measurement errors
      }

      frameId = null;
    };

    const handlePointerMove = (e: PointerEvent) => {
      clientX = e.clientX;
      clientY = e.clientY;

      if (!frameId) {
        frameId = requestAnimationFrame(updateAllGlowElements);
      }
    };

    const handlePointerLeave = () => {
      clientX = -1000;
      clientY = -1000;
      if (!frameId) {
        frameId = requestAnimationFrame(updateAllGlowElements);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return <>{children}</>;
};

// Aliases for backwards compatibility with earlier imports
export const useElementSpotlightTrail = useInteractiveGlow;
export const SpotlightBox = InteractiveGlow;
export const GlobalSpotlightProvider = GlobalInteractiveGlowProvider;

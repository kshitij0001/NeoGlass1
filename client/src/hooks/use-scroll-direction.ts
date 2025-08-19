import { useState, useEffect, useRef } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';
      
      if (direction !== scrollDirection && (currentScrollY - lastScrollY.current > 10 || currentScrollY - lastScrollY.current < -10)) {
        setScrollDirection(direction);
      }
      
      lastScrollY.current = currentScrollY > 0 ? currentScrollY : 0;
      setScrollY(currentScrollY);
    };

    const handleScroll = () => requestAnimationFrame(updateScrollDirection);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollDirection]);

  return { scrollDirection, scrollY };
}

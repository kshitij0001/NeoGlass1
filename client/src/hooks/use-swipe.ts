import { useRef, useCallback } from 'react';

interface SwipeInput {
  onSwipedLeft?: () => void;
  onSwipedRight?: () => void;
  onSwipedUp?: () => void;
  onSwipedDown?: () => void;
  onSwipeMove?: (direction: 'left' | 'right' | 'up' | 'down' | null, progress: number) => void;
  preventDefaultTouchmoveEvent?: boolean;
  delta?: number;
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

export function useSwipe({
  onSwipedLeft,
  onSwipedRight,
  onSwipedUp,
  onSwipedDown,
  onSwipeMove,
  preventDefaultTouchmoveEvent = false,
  delta = 50,
}: SwipeInput) {
  const touchStart = useRef<TouchPosition | null>(null);
  const touchEnd = useRef<TouchPosition | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const isSwipingRef = useRef<boolean>(false);

  const minSwipeDistance = delta;
  const maxSwipeTime = 1000; // ms
  const swipeThreshold = 20; // Minimum distance to start showing feedback

  const onTouchStart = useCallback((e: TouchEvent) => {
    // Ensure it's a valid touch event with at least one touch point
    if (e.targetTouches.length === 0) return;

    touchEnd.current = null;
    isSwipingRef.current = false;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now(),
    };
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    // Ensure it's a valid touch event with at least one touch point
    if (e.targetTouches.length === 0 || !touchStart.current) return;

    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now(),
    };

    touchEnd.current = currentTouch;

    const distanceX = touchStart.current.x - currentTouch.x;
    const distanceY = touchStart.current.y - currentTouch.y;
    const absDistanceX = Math.abs(distanceX);
    const absDistanceY = Math.abs(distanceY);

    // Only prevent default for intentional swipe gestures, allow normal scrolling otherwise
    const isHorizontalSwipe = absDistanceX > swipeThreshold && absDistanceX > absDistanceY * 1.5;
    const isVerticalSwipeDown = distanceY < -swipeThreshold && absDistanceY > absDistanceX * 1.5;
    
    // Only prevent scrolling for clear swipe gestures
    if (isHorizontalSwipe || isVerticalSwipeDown) {
      e.preventDefault();
      isSwipingRef.current = true;
      
      let direction: 'left' | 'right' | 'up' | 'down' | null = null;
      let progress = 0;

      if (isHorizontalSwipe) {
        // Horizontal swipe
        if (distanceX > swipeThreshold) {
          direction = 'left';
          progress = Math.min(distanceX / (minSwipeDistance * 2), 1);
        } else if (distanceX < -swipeThreshold) {
          direction = 'right';
          progress = Math.min(absDistanceX / (minSwipeDistance * 2), 1);
        }
      } else if (isVerticalSwipeDown) {
        // Only downward swipe for snoozing
        direction = 'down';
        progress = Math.min(absDistanceY / (minSwipeDistance * 2), 1);
      }

      if (onSwipeMove && direction) {
        onSwipeMove(direction, progress);
      }
    } else {
      // Allow normal scrolling for ambiguous touches
      isSwipingRef.current = false;
    }
  }, [preventDefaultTouchmoveEvent, onSwipeMove, minSwipeDistance, swipeThreshold]);

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) {
      // Reset feedback if no valid swipe
      if (onSwipeMove) {
        onSwipeMove(null, 0);
      }
      return;
    }

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const elapsedTime = touchEnd.current.time - touchStart.current.time;
    const absDistanceX = Math.abs(distanceX);
    const absDistanceY = Math.abs(distanceY);

    // Reset feedback
    if (onSwipeMove) {
      onSwipeMove(null, 0);
    }

    // Ignore if too slow or too short
    if (elapsedTime > maxSwipeTime || (absDistanceX < minSwipeDistance && absDistanceY < minSwipeDistance)) {
      isSwipingRef.current = false;
      return;
    }

    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    // Determine primary direction and only trigger that action
    if (absDistanceX > absDistanceY) {
      // Horizontal swipe is dominant
      if (isLeftSwipe && onSwipedLeft) {
        onSwipedLeft();
      } else if (isRightSwipe && onSwipedRight) {
        onSwipedRight();
      }
    } else {
      // Vertical swipe is dominant
      if (isUpSwipe && onSwipedUp) {
        onSwipedUp();
      } else if (isDownSwipe && onSwipedDown) {
        onSwipedDown();
      }
    }

    isSwipingRef.current = false;
  }, [onSwipedLeft, onSwipedRight, onSwipedUp, onSwipedDown, onSwipeMove, minSwipeDistance, maxSwipeTime]);

  const attachSwipeListeners = (element: HTMLElement) => {
    if (elementRef.current === element) return; // Avoid re-attaching if it's the same element

    // Clean up previous listeners if they exist
    if (elementRef.current) {
      elementRef.current.removeEventListener('touchstart', onTouchStart);
      elementRef.current.removeEventListener('touchmove', onTouchMove);
      elementRef.current.removeEventListener('touchend', onTouchEnd);
    }

    elementRef.current = element;
    element.addEventListener('touchstart', onTouchStart, { passive: false });
    element.addEventListener('touchmove', onTouchMove, { passive: !preventDefaultTouchmoveEvent });
    element.addEventListener('touchend', onTouchEnd, { passive: false });
  };

  // Cleanup listeners when the component unmounts
  // Removed the useEffect for global listeners as we are attaching to specific elements now.
  // The cleanup is handled within attachSwipeListeners and implicitly when the component using the hook unmounts.

  return {
    attachSwipeListeners,
    elementRef,
  };
}

import { useEffect } from 'react';

export const MouseTrail = () => {
  useEffect(() => {
    let trails: HTMLElement[] = [];
    
    const createTrail = (x: number, y: number) => {
      const trail = document.createElement('div');
      trail.className = 'mouse-trail';
      trail.style.left = `${x - 10}px`;
      trail.style.top = `${y - 10}px`;
      document.body.appendChild(trail);
      
      trails.push(trail);
      
      setTimeout(() => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
        trails = trails.filter(t => t !== trail);
      }, 500);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.8) { // Only create trail 20% of the time
        createTrail(e.clientX, e.clientY);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      trails.forEach(trail => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
      });
    };
  }, []);

  return null;
};

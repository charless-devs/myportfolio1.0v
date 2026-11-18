import { useEffect, useState, useRef } from 'react';

const matchesReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch] = useState(() => (typeof window !== 'undefined' ? !window.matchMedia('(pointer: fine)').matches : false));
  const [reducedMotion, setReducedMotion] = useState(matchesReducedMotion);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (isTouch || reducedMotion) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleOver = (e) => {
      const target = e.target;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[data-cursor-hover]') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isTouch, reducedMotion]);

  // Smooth trailing ring loop
  useEffect(() => {
    if (isTouch || reducedMotion) return;

    const followMouse = () => {
      setTrailingPos((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.2,
          y: prev.y + dy * 0.2,
        };
      });
      animationFrameRef.current = requestAnimationFrame(followMouse);
    };

    animationFrameRef.current = requestAnimationFrame(followMouse);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [position, isTouch, reducedMotion]);

  if (isTouch || reducedMotion || !isVisible) return null;

  return (
    <>
      {/* Center Dot */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '8px' : '6px',
          height: isHovered ? '8px' : '6px',
          borderRadius: '50%',
          backgroundColor: 'var(--deep-blue)',
          boxShadow: '0 0 10px rgba(var(--theme-accent-rgb), 0.9)',
          pointerEvents: 'none',
          zIndex: 999999,
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
          transition: 'width 0.2s, height 0.2s',
        }}
      />

      {/* Outer Ring */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '48px' : '32px',
          height: isHovered ? '48px' : '32px',
          borderRadius: '50%',
          border: isHovered ? '1.5px solid var(--sky)' : '1px solid rgba(var(--theme-accent-rgb), 0.65)',
          backgroundColor: isHovered ? 'rgba(var(--theme-accent-rgb), 0.18)' : 'transparent',
          boxShadow: isHovered ? '0 0 18px rgba(var(--theme-accent-rgb), 0.5)' : 'none',
          pointerEvents: 'none',
          zIndex: 999998,
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0) translate(-50%, -50%)`,
          transition: 'width 0.25s ease-out, height 0.25s ease-out, background-color 0.25s, border-color 0.25s, box-shadow 0.25s',
        }}
      />
    </>
  );
}

import { useState, useEffect } from 'react';

export default function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPos = window.scrollY;
      setProgress(totalHeight > 0 ? (scrollPos / totalHeight) * 100 : 0);
      setIsVisible(scrollPos > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progress, isVisible };
}

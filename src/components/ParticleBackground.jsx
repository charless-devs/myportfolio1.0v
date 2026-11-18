import { useEffect, useRef } from 'react';

export default function ParticleBackground({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const gridColor =
      getComputedStyle(canvas).getPropertyValue('--sky-light').trim() ||
      '#B8E4F5';

    let width = 0;
    let height = 0;
    let animationFrameId;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const mouse = {
      x: -1000,
      y: -1000,
    };

    /* ========================================
       RESIZE CANVAS
    ======================================== */
    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    /* ========================================
       MOUSE MOVEMENT
    ======================================== */
    const handleMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    /* ========================================
       DRAW WAVING GRID
    ======================================== */
    function drawGrid() {
      ctx.clearRect(0, 0, width, height);

      const spacing = 40;
      const radius = 220;

      /* Vertical lines */
      for (let x = 0; x <= width; x += spacing) {
        ctx.beginPath();

        for (let y = 0; y <= height; y += 6) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let wave = 0;

          if (distance < radius) {
            const strength = 1 - distance / radius;
            wave = Math.sin(distance * 0.09) * strength * 28;
          }

          const newX = x + wave;

          if (y === 0) {
            ctx.moveTo(newX, y);
          } else {
            ctx.lineTo(newX, y);
          }
        }

        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      /* Horizontal lines */
      for (let y = 0; y <= height; y += spacing) {
        ctx.beginPath();

        for (let x = 0; x <= width; x += 6) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let wave = 0;

          if (distance < radius) {
            const strength = 1 - distance / radius;
            wave = Math.sin(distance * 0.09) * strength * 28;
          }

          const newY = y + wave;

          if (x === 0) {
            ctx.moveTo(x, newY);
          } else {
            ctx.lineTo(x, newY);
          }
        }

        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Reduced motion: draw one static frame instead of a continuous loop
      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(drawGrid);
      }
    }

    drawGrid();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      id="retroCanvas"
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.45, // Soft sky-blue grid against the cloud-white background
      }}
    />
  );
}

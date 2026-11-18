import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TECH_ITEMS } from '../data/techItems';

/* The hero features exactly 7 orbiting clay spheres */
const ORBITING_ITEMS = TECH_ITEMS.slice(0, 7);

export default function FloatingTech() {
  const [activeTech, setActiveTech] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const smooth = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Spheres drift with the cursor (parallax), eased like water
  useEffect(() => {
    if (reducedMotion) return;

    const onMove = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reducedMotion]);

  // Ease the parallax value so spheres trail the cursor softly
  useEffect(() => {
    if (reducedMotion) return;
    const tick = () => {
      smooth.current.x += (mouse.x - smooth.current.x) * 0.06;
      smooth.current.y += (mouse.y - smooth.current.y) * 0.06;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mouse, reducedMotion]);

  const parallax = reducedMotion
    ? { x: 0, y: 0 }
    : {
        x: mouse.x * 16,
        y: mouse.y * 12,
      };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'visible',
      }}
    >
      {ORBITING_ITEMS.map((item, i) => (
        <TechSphere
          key={item.id}
          item={item}
          index={i}
          parallax={parallax}
          reducedMotion={reducedMotion}
          isActive={activeTech?.id === item.id}
          onSelect={() =>
            setActiveTech(activeTech?.id === item.id ? null : item)
          }
        />
      ))}

      {/* Floating description tooltip */}
      <AnimatePresence>
        {activeTech && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'absolute',
              bottom: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
              pointerEvents: 'auto',
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.96)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
              boxShadow:
                '0 26px 54px -24px rgba(var(--theme-primary-rgb), 0.5), inset 0 3px 6px rgba(var(--theme-surface-rgb), 1)',
              borderRadius: '22px',
              padding: '18px 26px',
              maxWidth: '380px',
              width: '90%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '6px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{activeTech.iconText}</span>
              <h4
                style={{
                  margin: 0,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--navy)',
                  letterSpacing: '0.04em',
                }}
              >
                {activeTech.name}
              </h4>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--sky-soft)',
                  color: 'var(--deep-blue)',
                  boxShadow: 'inset 0 2px 4px rgba(var(--theme-primary-rgb), 0.16)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {activeTech.category}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                maxWidth: 'none',
              }}
            >
              {activeTech.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TechSphere({
  item,
  index,
  parallax,
  reducedMotion,
  isActive,
  onSelect,
}) {
  const [hovered, setHovered] = useState(false);

  // Each sphere orbits at its own depth — deeper ones move more
  const depth = 0.5 + (index % 4) * 0.25;
  const orbitX = parallax.x * depth;
  const orbitY = parallax.y * depth;

  return (
    <motion.div
      animate={
        reducedMotion
          ? {}
          : item.floatAnim
      }
      transition={{
        duration: item.duration,
        repeat: reducedMotion ? 0 : Infinity,
        ease: 'easeInOut',
        delay: item.delay,
      }}
      style={{
        position: 'absolute',
        ...item.pos,
        pointerEvents: 'auto',
        cursor: 'pointer',
        userSelect: 'none',
        x: orbitX,
        y: orbitY,
      }}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={{ scale: hovered || isActive ? 1.14 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {/* Soft-clay tech sphere */}
        <div
          style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 32% 28%, var(--white) 0%, var(--cloud) 38%, var(--sky-soft) 100%)',
            border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
            boxShadow:
              hovered || isActive
                ? '0 20px 36px -14px rgba(var(--theme-primary-rgb), 0.55), inset 0 4px 8px rgba(var(--theme-surface-rgb), 1), inset 0 -8px 16px rgba(var(--theme-primary-rgb), 0.16)'
                : '0 16px 30px -16px rgba(var(--theme-primary-rgb), 0.45), inset 0 4px 8px rgba(var(--theme-surface-rgb), 1), inset 0 -7px 14px rgba(var(--theme-primary-rgb), 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            color: 'var(--deep-blue)',
            position: 'relative',
            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          }}
        >
          {/* Tiny clay highlight dot */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '9px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 35% 30%, var(--white), var(--sky-light))',
              boxShadow: 'inset 0 1px 2px rgba(var(--theme-surface-rgb), 0.9)',
            }}
          />
          <span style={{ filter: 'drop-shadow(0 1px 2px rgba(var(--theme-primary-rgb), 0.25))' }}>
            {item.iconText}
          </span>
        </div>

        {/* Tech Label */}
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.75rem',
            fontWeight: 600,
            color: hovered || isActive ? 'var(--navy)' : 'var(--text-secondary)',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            textShadow: '0 1px 6px rgba(248, 252, 255, 0.9)',
          }}
        >
          {item.name}
        </span>
      </motion.div>
    </motion.div>
  );
}

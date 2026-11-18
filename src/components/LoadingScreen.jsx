import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('PREPARING THE SKY');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.floor(Math.random() * 12) + 5;
        const next = Math.min(prev + diff, 100);

        if (next > 75) setStatusText('READY TO EXPLORE');
        else if (next > 45) setStatusText('SHAPING SOFT CLAY 3D');
        else if (next > 20) setStatusText('BUILDING THE INTERFACE');

        return next;
      });
    }, 70);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const exitTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 600);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.04 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background:
            'linear-gradient(180deg, var(--cloud) 0%, var(--white) 50%, var(--sky-soft) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          overflow: 'hidden',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {/* Subtle soft-blue dot grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(rgba(var(--theme-primary-rgb), 0.28) 2px, transparent 2px)',
            backgroundSize: '34px 34px',
            opacity: 0.7,
            pointerEvents: 'none',
          }}
        />

        {/* Ambient sky glow */}
        <div
          style={{
            position: 'absolute',
            width: '460px',
            height: '460px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(var(--theme-accent-rgb), 0.35) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        {/* Content Container */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '26px',
            maxWidth: '450px',
            width: '90%',
          }}
        >
          {/* Logo / Name */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1
              style={{
                fontSize: 'clamp(2.2rem, 6vw, 3.6rem)',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: 'var(--navy)',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              CHARLES
            </h1>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.82rem',
                letterSpacing: '0.28em',
                color: 'var(--deep-blue)',
                textTransform: 'uppercase',
                marginTop: '8px',
                fontWeight: 600,
              }}
            >
              Soft Clay 3D Portfolio
            </p>
          </motion.div>

          {/* Puffy progress bar */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '14px',
                backgroundColor: 'var(--theme-soft)',
                borderRadius: '999px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow:
                  'inset 0 3px 7px rgba(var(--theme-primary-rgb), 0.2), inset 0 -1px 2px rgba(var(--theme-surface-rgb), 0.9)',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background:
                    'linear-gradient(90deg, var(--deep-blue) 0%, var(--sky) 70%, var(--sky-light) 100%)',
                  boxShadow:
                    'inset 0 2px 3px rgba(var(--theme-surface-rgb), 0.55), 0 2px 8px -2px rgba(var(--theme-primary-rgb), 0.5)',
                  borderRadius: '999px',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.76rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.1em',
              }}
            >
              <span>{statusText}</span>
              <span style={{ color: 'var(--deep-blue)', fontWeight: 700 }}>
                {progress}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

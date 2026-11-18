import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Send, FolderGit2 } from 'lucide-react';
import IDCard3D from './IDCard3D';
import FloatingTech from './FloatingTech';

export default function Hero({ content }) {
  const displayName = content.name.trim().split(/\s+/)[0] || content.name;
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '110px',
        paddingBottom: '60px',
        overflow: 'visible',
        background:
          'linear-gradient(180deg, var(--cloud) 0%, var(--white) 45%, var(--sky-soft) 100%)',
      }}
    >
      {/* ─── Soft sky ambient blobs ─── */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '640px',
          height: '640px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(var(--theme-accent-rgb), 0.3) 0%, rgba(var(--theme-light-rgb), 0.15) 50%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          right: '4%',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(var(--theme-soft-rgb), 0.95) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '-60px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(var(--theme-light-rgb), 0.7) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ─── Hero Container ─── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 5,
        }}
      >
        {/* ─── Hanging 3D ID card + 7 orbiting clay tech spheres ─── */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            minHeight: '490px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible',
          }}
        >
          <FloatingTech />
          <IDCard3D
            profileImage={content.profileImage}
            displayName={displayName}
            role={content.aboutRole}
            idCard={content.idCard}
          />
        </div>

        {/* ─── MY NAME (water-flow cursor effect) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            textAlign: 'center',
            marginTop: '34px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '950px',
          }}
        >
          <WaterFlowName text={content.name} reducedMotion={reducedMotion} />

          {/* Title / Subtitle */}
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(0.95rem, 2.6vw, 1.35rem)',
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: 'var(--deep-blue)',
              textTransform: 'uppercase',
              margin: '14px 0 12px 0',
            }}
          >
            {content.role}
          </h2>

          {/* Short Introduction */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(0.95rem, 1.8vw, 1.12rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: '650px',
              margin: '0 0 34px 0',
            }}
          >
            {content.intro}
          </p>

          {/* Puffy clay CTA buttons */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <button
              onClick={() => scrollTo('#projects')}
              className="btn-primary"
              style={{ fontSize: '0.95rem', padding: '15px 30px' }}
            >
              <FolderGit2 size={18} />
              <span>Explore My Projects</span>
            </button>

            <button
              onClick={() => scrollTo('#contact')}
              className="btn-outline"
              style={{ fontSize: '0.95rem', padding: '15px 30px' }}
            >
              <Send size={18} />
              <span>Contact Me</span>
            </button>
          </div>
        </motion.div>

        {/* Scroll Down Hint */}
        <motion.div
          animate={reducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => scrollTo('#about')}
          style={{
            marginTop: '50px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            opacity: 0.65,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.65')}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
            }}
          >
            SCROLL TO EXPLORE
          </span>
          <ArrowDown size={16} color="var(--deep-blue)" />
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Water-flow cursor animation on the hero name.
   An SVG turbulence filter (feTurbulence + feDisplacementMap)
   warps the text; cursor proximity ramps the displacement
   scale so the letters ripple like water where you point.
   ───────────────────────────────────────────────────────── */
function WaterFlowName({ text, reducedMotion }) {
  const containerRef = useRef(null);
  const turbRef = useRef(null);
  const dispRef = useRef(null);
  const rippleRef = useRef(null);
  const target = useRef({ x: 0.5, y: 0.5, strength: 0 });
  const current = useRef({ x: 0.5, y: 0.5, strength: 0 });
  const rafRef = useRef(null);

  const onPointerMove = useCallback(
    (e) => {
      if (reducedMotion) return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // Distance from cursor to name center, normalised (0 near → 1 far)
      const dx = (e.clientX - cx) / (rect.width * 0.9);
      const dy = (e.clientY - cy) / (rect.height * 1.6);
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 1);
      target.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
        // Strong ripple close to the name, gentle swell further away
        strength: (1 - dist) * 26 + 4,
      };
    },
    [reducedMotion]
  );

  const onPointerLeave = useCallback(() => {
    target.current = { x: 0.5, y: 0.5, strength: 0 };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const tick = () => {
      const c = current.current;
      const t = target.current;
      // Elastic easing toward the target — water settles, never snaps
      c.x += (t.x - c.x) * 0.08;
      c.y += (t.y - c.y) * 0.08;
      c.strength += (t.strength - c.strength) * 0.06;

      const turb = turbRef.current;
      const disp = dispRef.current;
      if (turb) {
        // Drifting turbulence base frequency = constant gentle current
        turb.setAttribute(
          'baseFrequency',
          `${(0.008 + Math.sin(Date.now() / 2600) * 0.003).toFixed(4)} ${(
            0.014 +
            Math.cos(Date.now() / 3100) * 0.004
          ).toFixed(4)}`
        );
        turb.setAttribute(
          'seed',
          String(Math.floor(Date.now() / 90) % 100)
        );
      }
      if (disp) {
        disp.setAttribute('scale', String(c.strength.toFixed(2)));
      }
      if (rippleRef.current) {
        rippleRef.current.style.left = `${(c.x * 100).toFixed(1)}%`;
        rippleRef.current.style.top = `${(c.y * 100).toFixed(1)}%`;
        rippleRef.current.style.opacity = String(
          Math.min(c.strength / 26, 1) * 0.55
        );
        rippleRef.current.style.transform = `translate(-50%, -50%) scale(${
          1 + c.strength / 30
        })`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '10px 26px',
        borderRadius: '26px',
        background:
          'linear-gradient(180deg, rgba(var(--theme-surface-rgb), 0.95) 0%, rgba(var(--theme-soft-rgb), 0.9) 100%)',
        border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
        boxShadow:
          '0 26px 50px -26px rgba(var(--theme-primary-rgb), 0.45), inset 0 3px 6px rgba(var(--theme-surface-rgb), 1), inset 0 -6px 14px rgba(var(--theme-primary-rgb), 0.1)',
        cursor: 'default',
        overflow: 'hidden',
        marginBottom: '6px',
        maxWidth: '100%',
      }}
    >
      {/* Ripple glow that follows the cursor inside the name plate */}
      <div
        ref={rippleRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(var(--theme-accent-rgb), 0.55) 0%, rgba(var(--theme-light-rgb), 0.25) 45%, transparent 70%)',
          opacity: 0,
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* SVG turbulence displacement filter */}
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        style={{ position: 'absolute', width: 0, height: 0 }}
      >
        <defs>
          <filter id="water-flow" x="-20%" y="-40%" width="140%" height="180%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.010 0.014"
              numOctaves="2"
              seed="4"
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <h1
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(1.7rem, 5.6vw, 4.4rem)',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          margin: 0,
          color: 'var(--navy)',
          lineHeight: 1.12,
          position: 'relative',
          zIndex: 1,
          filter: reducedMotion ? 'none' : 'url(#water-flow)',
          textShadow: '0 6px 24px rgba(var(--theme-accent-rgb), 0.45)',
          maxWidth: '100%',
          wordBreak: 'break-word',
        }}
      >
        {text}
      </h1>
    </div>
  );
}

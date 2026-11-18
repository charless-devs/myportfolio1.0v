import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Check } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About Me', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
];

const moodOptions = [
  { id: 'sky', name: 'Sky', swatch: '#87CEEB' },
  { id: 'night', name: 'Night', swatch: '#162235' },
  { id: 'sunset', name: 'Sunset', swatch: '#EF795F' },
  { id: 'forest', name: 'Forest', swatch: '#6BAD79' },
];

export default function Navbar({ theme, onThemeChange }) {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);
  const activeMood = moodOptions.find((mood) => mood.id === theme) ?? moodOptions[0];
  const [isMac] = useState(() =>
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = [
        'home',
        'about',
        'skills',
        'projects',
        'experience',
        'contact',
      ];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!themeMenuOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!themeMenuRef.current?.contains(event.target)) setThemeMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setThemeMenuOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [themeMenuOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)',
        maxWidth: '1120px',
        zIndex: 1000,
        transition: 'all 0.3s ease',
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 22px',
          borderRadius: '9999px',
          backgroundColor: scrolled
            ? 'rgba(var(--theme-surface-rgb), 0.9)'
            : 'rgba(var(--theme-surface-rgb), 0.72)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
          boxShadow: scrolled
            ? '0 24px 48px -24px rgba(var(--theme-primary-rgb), 0.45), inset 0 2px 3px rgba(var(--theme-surface-rgb), 1), inset 0 -4px 10px rgba(var(--theme-primary-rgb), 0.07)'
            : '0 14px 30px -18px rgba(var(--theme-primary-rgb), 0.35), inset 0 2px 3px rgba(var(--theme-surface-rgb), 1)',
        }}
      >
        {/* Brand */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'baseline',
            gap: '2px',
            userSelect: 'none',
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '1.35rem',
              color: 'var(--navy)',
              letterSpacing: '0.05em',
            }}
          >
            HI
          </span>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '1.35rem',
              color: 'var(--deep-blue)',
              letterSpacing: '0.02em',
            }}
          >
            devs
          </span>
        </a>

        {/* Desktop Nav Items */}
        <div
          className="desktop-nav"
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                style={{
                  position: 'relative',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--navy)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '8px 15px',
                  borderRadius: '999px',
                  transition: 'all 0.25s ease',
                  background: isActive
                    ? 'linear-gradient(160deg, var(--white) 0%, var(--sky-soft) 100%)'
                    : 'transparent',
                  boxShadow: isActive
                    ? '0 8px 18px -12px rgba(var(--theme-primary-rgb), 0.5), inset 0 2px 3px rgba(var(--theme-surface-rgb), 1)'
                    : 'none',
                }}
                className="nav-link-item"
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-indicator"
                    style={{
                      position: 'absolute',
                      bottom: '3px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '16px',
                      height: '3px',
                      background:
                        'linear-gradient(90deg, var(--sky), var(--sky-light))',
                      boxShadow: 'inset 0 1px 2px rgba(var(--theme-primary-rgb), 0.35)',
                      borderRadius: '999px',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}

          {/* ⌘K search chip */}
          <button
            onClick={openPalette}
            aria-label="Open command palette"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              marginLeft: '8px',
              padding: '8px 14px',
              borderRadius: '999px',
              background:
                'linear-gradient(160deg, var(--white) 0%, var(--sky-soft) 100%)',
              border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
              boxShadow:
                '0 8px 18px -12px rgba(var(--theme-primary-rgb), 0.45), inset 0 2px 3px rgba(var(--theme-surface-rgb), 1), inset 0 -3px 6px rgba(var(--theme-primary-rgb), 0.08)',
              color: 'var(--deep-blue)',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 14px 26px -12px rgba(var(--theme-primary-rgb), 0.55), inset 0 2px 3px rgba(var(--theme-surface-rgb), 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 8px 18px -12px rgba(var(--theme-primary-rgb), 0.45), inset 0 2px 3px rgba(var(--theme-surface-rgb), 1), inset 0 -3px 6px rgba(var(--theme-primary-rgb), 0.08)';
            }}
          >
            <Search size={14} />
            <span>{isMac ? '⌘ K' : 'Ctrl K'}</span>
          </button>
        </div>

        {/* Mobile: search + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={openPalette}
            aria-label="Open command palette"
            className="mobile-search-btn"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--deep-blue)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--navy)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} color="var(--deep-blue)" /> : <Menu size={24} />}
          </button>
          <div ref={themeMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              aria-label={`Choose mood; current mood is ${activeMood.name}`}
              aria-haspopup="menu"
              aria-expanded={themeMenuOpen}
              aria-controls="mood-selector-menu"
              onClick={() => setThemeMenuOpen((open) => !open)}
              style={{
                width: '38px',
                height: '38px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                borderRadius: '50%',
                border: '1px solid var(--glass-border)',
                background: 'var(--white)',
                boxShadow: 'var(--clay-shadow-soft), var(--clay-inner)',
                cursor: 'pointer',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: '19px',
                  height: '19px',
                  borderRadius: '50%',
                  background: activeMood.swatch,
                  border: '2px solid var(--white)',
                  boxShadow: '0 0 0 1px var(--glass-border)',
                }}
              />
            </button>
            <AnimatePresence>
              {themeMenuOpen && (
                <motion.div
                  id="mood-selector-menu"
                  role="menu"
                  aria-label="Choose a color mood"
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    right: 0,
                    width: '174px',
                    padding: '10px',
                    borderRadius: '18px',
                    background: 'var(--white)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--clay-shadow-lg)',
                    zIndex: 1200,
                  }}
                >
                  <p
                    style={{
                      padding: '4px 8px 8px',
                      color: 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Choose mood
                  </p>
                  {moodOptions.map((mood) => {
                    const selected = mood.id === theme;
                    return (
                      <button
                        key={mood.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={selected}
                        onClick={() => {
                          onThemeChange(mood.id);
                          setThemeMenuOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px',
                          border: 0,
                          borderRadius: '12px',
                          background: selected ? 'var(--sky-soft)' : 'transparent',
                          color: 'var(--navy)',
                          font: 'inherit',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            width: '18px',
                            height: '18px',
                            flex: '0 0 18px',
                            borderRadius: '50%',
                            background: mood.swatch,
                            boxShadow: '0 0 0 1px var(--glass-border)',
                          }}
                        />
                        <span style={{ flex: 1 }}>{mood.name}</span>
                        {selected && <Check size={15} color="var(--deep-blue)" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu (soft clay sheet) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            style={{
              marginTop: '10px',
              borderRadius: '26px',
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              boxShadow:
                '0 30px 60px -28px rgba(var(--theme-primary-rgb), 0.5), inset 0 2px 3px rgba(var(--theme-surface-rgb), 1)',
            }}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '1rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--navy)' : 'var(--text-secondary)',
                    textDecoration: 'none',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    backgroundColor: isActive ? 'var(--sky-soft)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: isActive
                      ? 'inset 0 2px 6px rgba(var(--theme-primary-rgb), 0.14)'
                      : 'none',
                  }}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--sky)',
                        boxShadow: 'inset 0 1px 2px rgba(var(--theme-primary-rgb), 0.4)',
                      }}
                    />
                  )}
                </a>
              );
            })}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openPalette();
              }}
              style={{
                marginTop: '8px',
                padding: '13px 16px',
                borderRadius: '16px',
                background:
                  'linear-gradient(160deg, var(--sky-light) 0%, var(--sky) 100%)',
                border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
                boxShadow:
                  '0 12px 24px -14px rgba(var(--theme-primary-rgb), 0.55), inset 0 2px 3px rgba(var(--theme-surface-rgb), 0.9)',
                color: 'var(--navy)',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Search size={15} />
              Quick jump… ({isMac ? '⌘K' : 'Ctrl+K'})
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 899px) {
          .mobile-search-btn {
            display: none !important;
          }
        }
        .nav-link-item:hover {
          color: var(--navy) !important;
          background: rgba(var(--theme-surface-rgb), 0.8) !important;
          box-shadow: inset 0 2px 3px rgba(var(--theme-surface-rgb), 1) !important;
        }
      `}</style>
    </header>
  );
}

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Home,
  User,
  Layers,
  FolderGit2,
  Briefcase,
  Mail,
  ArrowUp,
} from 'lucide-react';
import { GithubIcon } from './Icons';

const commands = [
  { id: 'home', label: 'Go to Home', section: 'Jump to section', icon: Home, href: '#home' },
  { id: 'about', label: 'Go to About Me', section: 'Jump to section', icon: User, href: '#about' },
  { id: 'skills', label: 'Go to Skills', section: 'Jump to section', icon: Layers, href: '#skills' },
  { id: 'projects', label: 'Go to Projects', section: 'Jump to section', icon: FolderGit2, href: '#projects' },
  { id: 'experience', label: 'Go to Experience & Education', section: 'Jump to section', icon: Briefcase, href: '#experience' },
  { id: 'contact', label: 'Go to Contact', section: 'Jump to section', icon: Mail, href: '#contact' },
  { id: 'top', label: 'Scroll to Top', section: 'Quick actions', icon: ArrowUp, action: 'top' },
  {
    id: 'github',
    label: 'Open GitHub Profile',
    section: 'Quick actions',
    icon: GithubIcon,
    action: 'github',
  },
  {
    id: 'resume',
    label: 'Download Resume / CV',
    section: 'Quick actions',
    icon: ArrowUp,
    action: 'resume',
  },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Open via ⌘K / Ctrl+K, or the navbar's custom event
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery('');
        setActiveIndex(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onOpen = () => {
      setOpen(true);
      setQuery('');
      setActiveIndex(0);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-command-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-command-palette', onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      // Focus input after the enter animation
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.section.toLowerCase().includes(q)
    );
  }, [query]);

  const runCommand = (cmd) => {
    if (!cmd) return;
    setOpen(false);

    if (cmd.href) {
      const el = document.querySelector(cmd.href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (cmd.action === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (cmd.action === 'github') {
      window.open('https://github.com/', '_blank', 'noopener,noreferrer');
    } else if (cmd.action === 'resume') {
      const a = document.createElement('a');
      a.href = '/files/charles-resume.pdf';
      a.download = 'Charles-Resume.pdf';
      a.click();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(results[activeIndex]);
    }
  };

  // Keep the active item in view
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector('[data-active="true"]');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(35, 68, 92, 0.28)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '14vh 20px 20px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: 'var(--white)',
              borderRadius: '26px',
              overflow: 'hidden',
              boxShadow:
                '0 40px 90px -30px rgba(var(--theme-primary-rgb), 0.55), inset 0 2px 3px rgba(var(--theme-surface-rgb), 0.95)',
              border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
            }}
          >
            {/* Search input row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '18px 22px',
                borderBottom: '1px solid var(--sky-soft)',
                background:
                  'linear-gradient(180deg, var(--white) 0%, var(--cloud) 100%)',
              }}
            >
              <Search size={18} color="var(--deep-blue)" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Search sections and actions…"
                aria-label="Search commands"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.98rem',
                  color: 'var(--navy)',
                }}
              />
              <kbd
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: 'var(--deep-blue)',
                  backgroundColor: 'var(--sky-soft)',
                  padding: '4px 9px',
                  borderRadius: '8px',
                  boxShadow: 'inset 0 2px 4px rgba(var(--theme-primary-rgb), 0.16)',
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results list */}
            <div
              ref={listRef}
              style={{
                maxHeight: '340px',
                overflowY: 'auto',
                padding: '10px',
              }}
            >
              {results.length === 0 && (
                <div
                  style={{
                    padding: '26px 16px',
                    textAlign: 'center',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  No matches for “{query}”
                </div>
              )}
              {results.map((cmd, i) => {
                const Icon = cmd.icon;
                const showSection = i === 0 || cmd.section !== results[i - 1].section;
                const isActive = i === activeIndex;
                return (
                  <div key={cmd.id}>
                    {showSection && (
                      <div
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: 'var(--deep-blue)',
                          padding: '12px 14px 6px',
                        }}
                      >
                        {cmd.section}
                      </div>
                    )}
                    <button
                      data-active={isActive}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => runCommand(cmd)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '16px',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.93rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--navy)' : 'var(--text-secondary)',
                        background: isActive
                          ? 'linear-gradient(160deg, var(--white) 0%, var(--sky-soft) 100%)'
                          : 'transparent',
                        boxShadow: isActive
                          ? '0 10px 20px -14px rgba(var(--theme-primary-rgb), 0.5), inset 0 2px 3px rgba(var(--theme-surface-rgb), 1)'
                          : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isActive ? 'var(--white)' : 'var(--cloud)',
                          boxShadow: isActive
                            ? 'inset 0 2px 4px rgba(var(--theme-primary-rgb), 0.14)'
                            : 'inset 0 1px 3px rgba(var(--theme-primary-rgb), 0.1)',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={16} color="var(--deep-blue)" />
                      </span>
                      {cmd.label}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer hint */}
            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid var(--sky-soft)',
                background: 'var(--cloud)',
                display: 'flex',
                gap: '16px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
              }}
            >
              <span>↑ ↓ to navigate</span>
              <span>↵ to select</span>
              <span>Esc to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

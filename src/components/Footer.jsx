import { ArrowUp, Mail } from 'lucide-react';
import { GithubIcon, FacebookIcon, LinkedinIcon, InstagramIcon } from './Icons';

const iconMap = {
  Github: GithubIcon,
  Facebook: FacebookIcon,
  Linkedin: LinkedinIcon,
  Instagram: InstagramIcon,
  Mail: Mail,
};

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About Me', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
];

export default function Footer({ content }) {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        position: 'relative',
        background:
          'linear-gradient(180deg, var(--sky-soft) 0%, var(--sky-light) 60%, var(--sky) 100%)',
        padding: '70px 24px 34px 24px',
        overflow: 'hidden',
      }}
    >
      {/* Soft white top glow bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '6px',
          background:
            'linear-gradient(90deg, transparent, rgba(var(--theme-surface-rgb), 0.95), transparent)',
          borderRadius: '999px',
          boxShadow: '0 4px 14px -4px rgba(var(--theme-surface-rgb), 0.9)',
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '44px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Top Tier: 3 columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '36px',
            alignItems: 'start',
          }}
        >
          {/* Col 1: Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '3px',
                marginBottom: '14px',
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.8rem',
                  letterSpacing: '0.08em',
                  color: 'var(--navy)',
                }}
              >
                {content.name.trim().split(/\s+/)[0].toUpperCase()}
              </span>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--white)',
                  boxShadow:
                    'inset 0 2px 3px rgba(var(--theme-primary-rgb), 0.3), 0 3px 8px -3px rgba(var(--theme-primary-rgb), 0.4)',
                }}
              />
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.92rem',
                color: 'var(--navy)',
                opacity: 0.85,
                lineHeight: 1.7,
                maxWidth: '330px',
                margin: '0 0 18px 0',
              }}
            >
              {content.intro}
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: 'var(--navy)',
                textTransform: 'uppercase',
                margin: '0 0 16px 0',
              }}
            >
              Quick Navigation
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '11px',
              }}
            >
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.href);
                    }}
                    style={{
                      color: 'var(--navy)',
                      opacity: 0.82,
                      textDecoration: 'none',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.92rem',
                      fontWeight: 500,
                      transition: 'all 0.2s',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.82';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Social Links & Back to Top */}
          <div>
            <h4
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: 'var(--navy)',
                textTransform: 'uppercase',
                margin: '0 0 16px 0',
              }}
            >
              Stay Connected
            </h4>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '22px',
              }}
            >
              {content.socialLinks.map((social) => {
                const Icon = iconMap[social.icon] || Mail;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '15px',
                      backgroundColor: 'rgba(var(--theme-surface-rgb), 0.85)',
                      border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--deep-blue)',
                      transition: 'all 0.25s ease',
                      boxShadow:
                        '0 10px 20px -12px rgba(var(--theme-primary-rgb), 0.45), inset 0 3px 6px rgba(var(--theme-surface-rgb), 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.backgroundColor = 'var(--white)';
                      e.currentTarget.style.boxShadow =
                        '0 18px 30px -14px rgba(var(--theme-primary-rgb), 0.55), inset 0 3px 6px rgba(var(--theme-surface-rgb), 1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.backgroundColor =
                        'rgba(var(--theme-surface-rgb), 0.85)';
                      e.currentTarget.style.boxShadow =
                        '0 10px 20px -12px rgba(var(--theme-primary-rgb), 0.45), inset 0 3px 6px rgba(var(--theme-surface-rgb), 1)';
                    }}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>

            <button
              onClick={scrollToTop}
              className="btn-outline"
              style={{
                fontSize: '0.8rem',
                padding: '10px 20px',
                background: 'rgba(var(--theme-surface-rgb), 0.9)',
                color: 'var(--navy)',
              }}
            >
              <ArrowUp size={14} />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Tech */}
        <div
          style={{
            borderTop: '1px solid rgba(35, 68, 92, 0.15)',
            paddingTop: '26px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.84rem',
            fontFamily: "'Inter', sans-serif",
            color: 'var(--navy)',
            opacity: 0.8,
          }}
        >
          <span>
            © {new Date().getFullYear()} {content.name.trim().split(/\s+/)[0].toUpperCase()}. All Rights Reserved.
            Student Portfolio.
          </span>
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            Built with React, Vite, Three.js &amp; Framer Motion
          </span>
        </div>
      </div>
    </footer>
  );
}

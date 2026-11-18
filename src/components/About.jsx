import { motion } from 'framer-motion';
import { GraduationCap, Globe, Code, Rocket, FileDown } from 'lucide-react';

const infoCards = [
  {
    icon: GraduationCap,
    title: 'Education',
    detail: 'Bachelor of Science in Information Technology',
    sub: 'College Student',
  },
  {
    icon: Globe,
    title: 'Developer Interest',
    detail: 'Modern Web Development & Interactive 3D',
    sub: 'Creative & Functional UIs',
  },
  {
    icon: Code,
    title: 'Technical Focus',
    detail: 'Full-Stack Architecture',
    sub: 'Frontend & Backend Integration',
  },
  {
    icon: Rocket,
    title: 'Personal Goals',
    detail: 'Building Real-World Digital Solutions',
    sub: 'Continuous Growth & Mastery',
  },
];

export default function About({ content }) {
  const displayName = content.name.trim().split(/\s+/)[0] || content.name;

  return (
    <section
      id="about"
      style={{
        position: 'relative',
        padding: '120px 24px',
        backgroundColor: 'var(--white)',
        overflow: 'hidden',
      }}
    >
      {/* Soft sky ambient blob */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(var(--theme-light-rgb), 0.5) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-eyebrow">DISCOVER MY JOURNEY</span>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: 'var(--navy)',
                textTransform: 'uppercase',
                margin: '8px 0 16px 0',
              }}
            >
              ABOUT ME
            </h2>
            <div className="section-divider" style={{ margin: '0 auto' }} />
          </motion.div>
        </div>

        {/* Two-Column Layout: Left (Photo & Bio), Right (Info Cards) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Visual Profile Card & Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Story Card — white clay */}
            <div
              style={{
                backgroundColor: 'var(--white)',
                borderRadius: '30px',
                padding: '34px',
                border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
                boxShadow:
                  '0 26px 54px -26px rgba(var(--theme-primary-rgb), 0.4), inset 0 3px 6px rgba(var(--theme-surface-rgb), 1), inset 0 -8px 18px rgba(var(--theme-primary-rgb), 0.07)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  marginBottom: '24px',
                }}
              >
                {/* Profile Photo in soft clay frame */}
                <div
                  style={{
                    width: '78px',
                    height: '78px',
                    borderRadius: '24px',
                    padding: '5px',
                    background:
                      'linear-gradient(160deg, var(--sky-light) 0%, var(--sky) 100%)',
                    boxShadow:
                      '0 14px 28px -14px rgba(var(--theme-primary-rgb), 0.5), inset 0 3px 6px rgba(var(--theme-surface-rgb), 0.85)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    boxSizing: 'border-box',
                  }}
                >
                  <img
                    src={content.profileImage}
                    alt={`${content.name} profile`}
                    onError={(e) => {
                      if (!e.target.dataset.triedJpg) {
                        e.target.dataset.triedJpg = 'true';
                        e.target.src = '/images/charles-profile.jpg';
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '19px',
                      display: 'block',
                    }}
                  />
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: 'var(--navy)',
                      margin: 0,
                    }}
                  >
                    {displayName.toUpperCase()}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--deep-blue)',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {content.aboutRole}
                  </span>
                </div>
              </div>

              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.98rem',
                  lineHeight: 1.8,
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {content.aboutBio
                  .split(/\n\s*\n/)
                  .filter((paragraph) => paragraph.trim())
                  .map((paragraph, index) => (
                    <p
                      key={index}
                      style={{ margin: 0, maxWidth: 'none', color: 'inherit' }}
                    >
                      {paragraph.replaceAll('{name}', displayName)}
                    </p>
                  ))}
              </div>

              {/* Download Resume / CV Button */}
              <div style={{ marginTop: '30px' }}>
                <a
                  href="/files/charles-resume.pdf"
                  download="Charles-Resume.pdf"
                  className="btn-primary"
                  style={{ fontSize: '0.88rem', padding: '13px 26px' }}
                >
                  <FileDown size={18} />
                  <span>Download CV / Resume</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 2x2 Information Grid — clay cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
            }}
          >
            {infoCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={card.title}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="clay-card"
                  style={{
                    padding: '26px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    cursor: 'default',
                  }}
                >
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '17px',
                      background:
                        'linear-gradient(160deg, var(--white) 0%, var(--sky-soft) 100%)',
                      boxShadow:
                        '0 10px 20px -12px rgba(var(--theme-primary-rgb), 0.4), inset 0 3px 6px rgba(var(--theme-surface-rgb), 1), inset 0 -4px 8px rgba(var(--theme-primary-rgb), 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconComponent size={23} color="var(--deep-blue)" />
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        color: 'var(--deep-blue)',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '5px',
                      }}
                    >
                      {card.title}
                    </span>
                    <h4
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.98rem',
                        fontWeight: 700,
                        color: 'var(--navy)',
                        margin: '0 0 4px 0',
                        lineHeight: 1.4,
                      }}
                    >
                      {card.detail}
                    </h4>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {card.sub}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

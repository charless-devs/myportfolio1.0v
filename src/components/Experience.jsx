import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Code2, Award } from 'lucide-react';

const timeline = [
  {
    type: 'education',
    icon: GraduationCap,
    period: 'Present',
    title: 'BS in Information Technology',
    org: 'College Student — Philippines',
    details:
      'Bachelor of Science in Information Technology, with coursework spanning programming fundamentals, web development, databases, and networking.',
  },
  {
    type: 'project',
    icon: Code2,
    period: 'Recent',
    title: 'Full-Stack Project Development',
    org: 'Personal & Academic Builds',
    details:
      'Designed and built QuizNova, DIDAS, and a reusable Auth & Admin System — from MySQL schema and Express APIs through to server-rendered interfaces.',
  },
  {
    type: 'project',
    icon: Award,
    period: 'Recent',
    title: 'Enterprise OSPF / Inter-VLAN Network Lab',
    org: 'Networking Specialization',
    details:
      'Planned and documented a multi-router enterprise lab with OSPF multi-area design, inter-VLAN routing, DHCP scoping, and verification walkthroughs.',
  },
  {
    type: 'goal',
    icon: Briefcase,
    period: 'Next',
    title: 'Aspiring Full-Stack Developer',
    org: 'Career Goal',
    details:
      'Continuously improving development skills to grow into a professional software developer building real-world digital solutions.',
  },
];

const typeMeta = {
  education: { label: 'Education', color: 'var(--sky)' },
  project: { label: 'Experience', color: 'var(--sky-light)' },
  goal: { label: 'Goal', color: 'var(--deep-blue)' },
};

export default function Experience() {
  return (
    <section
      id="experience"
      style={{
        position: 'relative',
        padding: '120px 24px',
        background:
          'linear-gradient(180deg, var(--white) 0%, var(--cloud) 55%, var(--white) 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Soft ambient blobs */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '-100px',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(var(--theme-light-rgb), 0.55) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '-80px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(var(--theme-soft-rgb), 0.9) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '940px',
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
            <span className="section-eyebrow">MY PATH SO FAR</span>
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
              EXPERIENCE & EDUCATION
            </h2>
            <div className="section-divider" style={{ margin: '0 auto' }} />
          </motion.div>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Soft blue spine */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '23px',
              top: '10px',
              bottom: '10px',
              width: '6px',
              borderRadius: '999px',
              background:
                'linear-gradient(180deg, var(--sky) 0%, var(--sky-light) 55%, var(--sky-soft) 100%)',
              boxShadow: 'inset 0 2px 5px rgba(var(--theme-primary-rgb), 0.25)',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
            }}
          >
            {timeline.map((item, i) => {
              const Icon = item.icon;
              const meta = typeMeta[item.type];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '26px',
                    position: 'relative',
                  }}
                >
                  {/* Indicator node */}
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '20px',
                      background: 'var(--white)',
                      border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
                      boxShadow:
                        '0 14px 28px -14px rgba(var(--theme-primary-rgb), 0.5), inset 0 3px 6px rgba(var(--theme-surface-rgb), 1), inset 0 -5px 10px rgba(var(--theme-primary-rgb), 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  >
                    <Icon size={22} color="var(--deep-blue)" />
                  </div>

                  {/* White clay card */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    style={{
                      flex: 1,
                      backgroundColor: 'var(--white)',
                      borderRadius: '26px',
                      padding: '26px 30px',
                      border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
                      boxShadow:
                        '0 22px 46px -24px rgba(var(--theme-primary-rgb), 0.4), inset 0 2px 3px rgba(var(--theme-surface-rgb), 0.95), inset 0 -6px 14px rgba(var(--theme-primary-rgb), 0.06)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap',
                        marginBottom: '10px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--navy)',
                          backgroundColor: meta.color,
                          padding: '4px 12px',
                          borderRadius: '999px',
                          boxShadow:
                            'inset 0 2px 4px rgba(var(--theme-primary-rgb), 0.22), inset 0 -2px 3px rgba(var(--theme-surface-rgb), 0.55)',
                        }}
                      >
                        {meta.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--text-secondary)',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.period}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--navy)',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {item.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: 'var(--deep-blue)',
                        display: 'block',
                        marginBottom: '10px',
                      }}
                    >
                      {item.org}
                    </span>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.9rem',
                        lineHeight: 1.7,
                        color: 'var(--text-secondary)',
                        margin: 0,
                        maxWidth: 'none',
                      }}
                    >
                      {item.details}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

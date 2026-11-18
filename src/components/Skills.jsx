import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Server, Code, Database, Wrench, Network } from 'lucide-react';
import skillsData from '../data/skills';

const iconMap = {
  Monitor: Monitor,
  Server: Server,
  Code: Code,
  Database: Database,
  Wrench: Wrench,
  Network: Network,
};

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState(skillsData[0].category);

  const activeCategoryData =
    skillsData.find((c) => c.category === selectedCategory) || skillsData[0];

  return (
    <section
      id="skills"
      style={{
        position: 'relative',
        padding: '120px 24px',
        background:
          'linear-gradient(180deg, var(--white) 0%, var(--cloud) 50%, var(--white) 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Soft sky ambient blob */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '-110px',
          width: '440px',
          height: '440px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(var(--theme-accent-rgb), 0.28) 0%, rgba(var(--theme-soft-rgb), 0.5) 45%, transparent 70%)',
          filter: 'blur(45px)',
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
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-eyebrow">TECHNICAL CAPABILITIES</span>
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
              MY TECH STACK
            </h2>
            <div className="section-divider" style={{ margin: '0 auto' }} />
          </motion.div>
        </div>

        {/* Category Filter Tabs — soft clay pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '48px',
          }}
        >
          {skillsData.map((cat) => {
            const isSelected = selectedCategory === cat.category;
            const Icon = iconMap[cat.icon] || Code;
            return (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                aria-pressed={isSelected}
                className={`clay-pill${isSelected ? ' active' : ''}`}
                style={{
                  fontSize: '0.88rem',
                  padding: '11px 22px',
                  cursor: 'pointer',
                }}
              >
                <Icon size={16} />
                <span>{cat.category}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Cards Grid — 3D clay cards with hover tilt */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {activeCategoryData.items.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function SkillCard({ skill, index }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    // Gentle clay tilt — max ~7°
    setTilt({ rx: -py * 14, ry: px * 14 });
  };

  const onMouseLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        backgroundColor: 'var(--white)',
        borderRadius: '26px',
        padding: '26px',
        border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
        boxShadow:
          '0 22px 46px -24px rgba(var(--theme-primary-rgb), 0.4), inset 0 3px 6px rgba(var(--theme-surface-rgb), 1), inset 0 -7px 16px rgba(var(--theme-primary-rgb), 0.07)',
        transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${
          tilt.rx === 0 && tilt.ry === 0 ? '0' : '-6px'
        })`,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        cursor: 'default',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background:
                'linear-gradient(160deg, var(--white) 0%, var(--sky-soft) 100%)',
              boxShadow:
                '0 10px 20px -12px rgba(var(--theme-primary-rgb), 0.4), inset 0 3px 6px rgba(var(--theme-surface-rgb), 1), inset 0 -4px 8px rgba(var(--theme-primary-rgb), 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--deep-blue)',
              fontWeight: 700,
              fontSize: '0.85rem',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {skill.name.slice(0, 2).toUpperCase()}
          </div>
          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--navy)',
              margin: 0,
            }}
          >
            {skill.name}
          </h3>
        </div>

        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--deep-blue)',
            backgroundColor: 'var(--sky-soft)',
            padding: '3px 10px',
            borderRadius: '999px',
            boxShadow: 'inset 0 2px 4px rgba(var(--theme-primary-rgb), 0.16)',
          }}
        >
          {skill.level}%
        </span>
      </div>

      {/* Level bar — inset clay groove with soft blue fill */}
      <div
        style={{
          width: '100%',
          height: '10px',
          backgroundColor: 'var(--theme-soft)',
          borderRadius: '999px',
          overflow: 'hidden',
          boxShadow:
            'inset 0 3px 6px rgba(var(--theme-primary-rgb), 0.18), inset 0 -1px 2px rgba(var(--theme-surface-rgb), 0.9)',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: index * 0.05 }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--deep-blue) 0%, var(--sky) 75%, var(--sky-light) 100%)',
            borderRadius: '999px',
            boxShadow:
              'inset 0 2px 3px rgba(var(--theme-surface-rgb), 0.55), 0 2px 6px -2px rgba(var(--theme-primary-rgb), 0.5)',
          }}
        />
      </div>
    </motion.div>
  );
}

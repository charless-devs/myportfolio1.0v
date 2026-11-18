import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code2, X, Layers, ArrowRight } from 'lucide-react';
import { GithubIcon } from './Icons';
import projectsData from '../data/projects';

const filterCategories = [
  { label: 'All Projects', value: 'all' },
  { label: 'Full-Stack', value: 'fullstack' },
  { label: 'Networking Labs', value: 'networking' },
];

export default function Projects({ projects = projectsData }) {
  const [filter, setFilter] = useState('all');
  const [activeProject, setActiveProject] = useState(null);

  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section
      id="projects"
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
          top: '35%',
          right: '-120px',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(var(--theme-accent-rgb), 0.25) 0%, rgba(var(--theme-light-rgb), 0.12) 45%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          left: '-80px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(var(--theme-soft-rgb), 0.9) 0%, transparent 70%)',
          filter: 'blur(30px)',
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
            <span className="section-eyebrow">PORTFOLIO SHOWCASE</span>
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
              FEATURED PROJECTS
            </h2>
            <div className="section-divider" style={{ margin: '0 auto' }} />
          </motion.div>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '48px',
          }}
        >
          {filterCategories.map((cat) => {
            const isSelected = filter === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                aria-pressed={isSelected}
                className={`clay-pill${isSelected ? ' active' : ''}`}
                style={{
                  fontSize: '0.88rem',
                  padding: '11px 24px',
                  cursor: 'pointer',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '32px',
            }}
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={() => setActiveProject(project)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Live Preview / Case Study Modal */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({ project, onOpen }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: 'var(--white)',
        border: '1px solid rgba(var(--theme-surface-rgb), 0.9)',
        borderRadius: '28px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: hovered
          ? '0 30px 60px -24px rgba(var(--theme-primary-rgb), 0.4), inset 0 2px 3px rgba(var(--theme-surface-rgb), 0.95)'
          : '0 18px 38px -18px rgba(var(--theme-primary-rgb), 0.3), inset 0 2px 3px rgba(var(--theme-surface-rgb), 0.95)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Soft clay banner */}
      <div
        style={{
          height: '170px',
          width: '100%',
          position: 'relative',
          background:
            'linear-gradient(150deg, var(--sky-soft) 0%, var(--sky-light) 55%, var(--sky) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(var(--theme-surface-rgb), 0.9)',
        }}
      >
        {/* Subtle clay dot grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(rgba(var(--theme-surface-rgb), 0.75) 2px, transparent 2px)',
            backgroundSize: '26px 26px',
            opacity: 0.7,
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            padding: '0 20px',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '18px',
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.85)',
              boxShadow:
                '0 10px 20px -10px rgba(var(--theme-primary-rgb), 0.5), inset 0 2px 3px rgba(var(--theme-surface-rgb), 1), inset 0 -4px 8px rgba(var(--theme-primary-rgb), 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px auto',
            }}
          >
            <Code2 size={26} color="var(--deep-blue)" />
          </div>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.3rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'var(--navy)',
            }}
          >
            {project.title}
          </span>
        </div>

        {/* Category pill in top-right */}
        <span
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            backgroundColor: 'rgba(var(--theme-surface-rgb), 0.9)',
            boxShadow:
              '0 6px 14px -8px rgba(var(--theme-primary-rgb), 0.45), inset 0 1px 2px rgba(var(--theme-surface-rgb), 1)',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '0.7rem',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            color: 'var(--deep-blue)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            zIndex: 3,
          }}
        >
          {project.category}
        </span>
      </div>

      {/* Card Body */}
      <div
        style={{
          padding: '26px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.8rem',
            color: 'var(--deep-blue)',
            fontWeight: 600,
            marginBottom: '4px',
          }}
        >
          {project.subtitle}
        </span>

        <h3
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.35rem',
            fontWeight: 700,
            color: 'var(--navy)',
            margin: '0 0 12px 0',
            letterSpacing: '0.03em',
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.9rem',
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            margin: '0 0 20px 0',
            flex: 1,
          }}
        >
          {project.description}
        </p>

        {/* Tech Stack Tags */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '22px',
          }}
        >
          {project.technologies.map((tech) => (
            <span key={tech} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}
        >
          <button
            onClick={onOpen}
            className="btn-primary"
            style={{
              padding: '11px 14px',
              fontSize: '0.85rem',
              width: '100%',
            }}
          >
            <ExternalLink size={15} />
            <span>Live Preview</span>
          </button>

          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            style={{
              padding: '11px 14px',
              fontSize: '0.85rem',
              width: '100%',
            }}
          >
            <GithubIcon size={15} />
            <span>GitHub</span>
          </a>
        </div>

        <button
          onClick={onOpen}
          style={{
            marginTop: '14px',
            background: 'none',
            border: 'none',
            color: 'var(--deep-blue)',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 0',
          }}
        >
          Read case study <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

function ProjectModal({ project, onClose }) {
  // Lock scroll while modal is open + close on Escape
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(35, 68, 92, 0.35)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflowY: 'auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} case study`}
        style={{
          backgroundColor: 'var(--white)',
          borderRadius: '32px',
          maxWidth: '860px',
          width: '100%',
          maxHeight: '88vh',
          overflowY: 'auto',
          boxShadow:
            '0 40px 90px -30px rgba(var(--theme-primary-rgb), 0.55), inset 0 2px 3px rgba(var(--theme-surface-rgb), 0.95)',
          border: '1px solid rgba(var(--theme-surface-rgb), 0.9)',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close case study"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '1px solid rgba(var(--theme-surface-rgb), 0.9)',
            backgroundColor: 'rgba(var(--theme-surface-rgb), 0.9)',
            boxShadow:
              '0 10px 20px -10px rgba(var(--theme-primary-rgb), 0.45), inset 0 2px 3px rgba(var(--theme-surface-rgb), 1)',
            color: 'var(--deep-blue)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          <X size={20} />
        </button>

        {/* Modal banner */}
        <div
          style={{
            height: '150px',
            background:
              'linear-gradient(150deg, var(--sky-soft) 0%, var(--sky-light) 55%, var(--sky) 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '32px 32px 0 0',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(rgba(var(--theme-surface-rgb), 0.75) 2px, transparent 2px)',
              backgroundSize: '26px 26px',
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width: '58px',
              height: '58px',
              borderRadius: '20px',
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.9)',
              boxShadow:
                '0 12px 24px -12px rgba(var(--theme-primary-rgb), 0.5), inset 0 2px 3px rgba(var(--theme-surface-rgb), 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={28} color="var(--deep-blue)" />
          </div>
        </div>

        {/* Modal body */}
        <div style={{ padding: '32px 36px 40px' }}>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.82rem',
              color: 'var(--deep-blue)',
              fontWeight: 600,
            }}
          >
            {project.subtitle}
          </span>
          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              color: 'var(--navy)',
              margin: '6px 0 16px 0',
            }}
          >
            {project.title}
          </h3>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.95rem',
              lineHeight: 1.75,
              color: 'var(--text-secondary)',
              margin: '0 0 28px 0',
              maxWidth: 'none',
            }}
          >
            {project.longDescription}
          </p>

          {/* Architecture highlights */}
          <h4
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--navy)',
              margin: '0 0 14px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Layers size={16} color="var(--deep-blue)" />
            Architecture Highlights
          </h4>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px',
              marginBottom: '28px',
            }}
          >
            {project.architecture.map((step) => (
              <div
                key={step.label}
                style={{
                  backgroundColor: 'var(--cloud)',
                  borderRadius: '20px',
                  padding: '16px 18px',
                  boxShadow:
                    'inset 0 2px 6px rgba(var(--theme-primary-rgb), 0.12), inset 0 -2px 4px rgba(var(--theme-surface-rgb), 0.9)',
                  border: '1px solid rgba(var(--theme-surface-rgb), 0.9)',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--deep-blue)',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  {step.label}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.85rem',
                    lineHeight: 1.55,
                    color: 'var(--navy)',
                  }}
                >
                  {step.detail}
                </span>
              </div>
            ))}
          </div>

          {/* Key features */}
          <h4
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--navy)',
              margin: '0 0 14px 0',
            }}
          >
            Key Features
          </h4>
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              margin: '0 0 28px 0',
              padding: 0,
              listStyle: 'none',
            }}
          >
            {project.highlights.map((h) => (
              <li
                key={h}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--sky)',
                    boxShadow: 'inset 0 1px 2px rgba(var(--theme-primary-rgb), 0.4)',
                    marginTop: '7px',
                    flexShrink: 0,
                  }}
                />
                {h}
              </li>
            ))}
          </ul>

          {/* Tech tags */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '30px',
            }}
          >
            {project.technologies.map((tech) => (
              <span key={tech} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>

          {/* Modal actions */}
          <div
            style={{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: '0.9rem' }}
            >
              <ExternalLink size={16} />
              <span>Open Live Preview</span>
            </a>
            <a
              href={project.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ fontSize: '0.9rem' }}
            >
              <GithubIcon size={16} />
              <span>View Source on GitHub</span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import useScrollProgress from '../hooks/useScrollProgress';

export default function BackToTop() {
  const { isVisible } = useScrollProgress();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'linear-gradient(160deg, var(--white) 0%, var(--sky-soft) 100%)',
            border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
            color: 'var(--deep-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 999,
            boxShadow:
              '0 18px 34px -16px rgba(var(--theme-primary-rgb), 0.5), inset 0 3px 6px rgba(var(--theme-surface-rgb), 1), inset 0 -5px 10px rgba(var(--theme-primary-rgb), 0.1)',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(160deg, var(--sky-light) 0%, var(--sky) 100%)';
            e.currentTarget.style.boxShadow =
              '0 24px 44px -18px rgba(var(--theme-primary-rgb), 0.6), inset 0 3px 6px rgba(var(--theme-surface-rgb), 0.9)';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(160deg, var(--white) 0%, var(--sky-soft) 100%)';
            e.currentTarget.style.boxShadow =
              '0 18px 34px -16px rgba(var(--theme-primary-rgb), 0.5), inset 0 3px 6px rgba(var(--theme-surface-rgb), 1), inset 0 -5px 10px rgba(var(--theme-primary-rgb), 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <ArrowUp size={20} color="var(--deep-blue)" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

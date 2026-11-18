import { useEffect, useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import CommandPalette from './components/CommandPalette';
import ManagerPage from './components/ManagerPage';
import {
  loadPortfolioContent,
  PORTFOLIO_CONTENT_KEY,
} from './data/portfolioContent';

const MOODS = new Set(['sky', 'night', 'sunset', 'forest']);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [portfolioContent, setPortfolioContent] = useState(loadPortfolioContent);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'sky';
    const savedTheme = window.localStorage.getItem('portfolio-mood');
    return MOODS.has(savedTheme) ? savedTheme : 'sky';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('portfolio-mood', theme);
  }, [theme]);

  const isManagerRoute =
    window.location.pathname.replace(/\/+$/, '') === '/manageraddition';

  const savePortfolioContent = (content) => {
    window.localStorage.setItem(PORTFOLIO_CONTENT_KEY, JSON.stringify(content));
    setPortfolioContent(content);
  };

  if (isManagerRoute) {
    return (
      <div data-theme={theme}>
        <ManagerPage content={portfolioContent} onSave={savePortfolioContent} />
      </div>
    );
  }

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <div
      data-theme={theme}
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'var(--cloud)',
        color: 'var(--navy)',
        overflowX: 'hidden',
      }}
    >
      {/* Soft trailing clay cursor (desktop only) */}
      <CustomCursor />

      {/* Waving soft-blue grid canvas background */}
      <ParticleBackground theme={theme} />

      {/* Floating pill navbar + ⌘K command palette trigger */}
      <Navbar theme={theme} onThemeChange={setTheme} />

      {/* Quick Command Palette (⌘K / Ctrl+K) */}
      <CommandPalette />

      {/* Main Sections */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero content={portfolioContent} />
        <About content={portfolioContent} />
        <Skills />
        <Projects projects={portfolioContent.projects} />
        <Experience />
        <Contact
          socialLinks={portfolioContent.socialLinks}
          name={portfolioContent.name}
        />
      </main>

      {/* Footer */}
      <Footer content={portfolioContent} />

      {/* Floating Back to Top Button */}
      <BackToTop />
    </div>
  );
}

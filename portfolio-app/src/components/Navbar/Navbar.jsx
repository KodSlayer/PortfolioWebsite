import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Projects', href: '#work' },
  { label: 'Playground', href: '#playground' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > 40) {
      setScrolled(true);
      if (latest > previous && latest > 150) {
        setHidden(true);
        setMenuOpen(false); // Close menu on scroll down
      } else {
        setHidden(false);
      }
    } else {
      setScrolled(false);
      setHidden(false);
    }
  });

  useEffect(() => {
    // IntersectionObserver for active section detection
    // Using IntersectionObserver avoids the offsetTop bug caused by CSS transforms in ScrollCamera
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section that is most visible
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    const sections = ['about', 'certifications', 'work', 'playground', 'contact'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} 
      id="navbar"
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <a className="navbar__logo text-headline-md" href="#hero">
        <img src="/mylogo.png" alt="Logo" className="navbar__logo-image" />
      </a>

      {/* Right Controls */}
      <div className="navbar__controls">

        {/* Theme Toggle */}
        <button
          className="navbar__theme-btn"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Night Mode'}
          id="theme-toggle-btn"
        >
          <span className="material-symbols-outlined navbar__theme-icon">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Hamburger Toggle */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(p => !p)}
          aria-label="Toggle menu"
          id="menu-toggle-btn"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Dropdown Menu */}
      <div className={`navbar__dropdown-menu ${menuOpen ? 'navbar__dropdown-menu--open' : ''}`}>
        {NAV_LINKS.map(link => (
          <a
            key={link.href}
            className={`navbar__dropdown-link text-label-md ${activeSection === link.href.slice(1) ? 'navbar__dropdown-link--active' : ''}`}
            href={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.label.toUpperCase()}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}

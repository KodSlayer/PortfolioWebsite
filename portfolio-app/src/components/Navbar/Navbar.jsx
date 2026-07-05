import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#work' },
  { label: 'Playground', href: '#playground' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Active section detection
      const sections = ['about', 'work', 'playground', 'contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="navbar">
      {/* Logo */}
      <a className="navbar__logo text-headline-md" href="#hero">
        <img src="/mylogo.png" alt="Logo" className="navbar__logo-image" />
      </a>

      {/* Desktop Nav */}
      <div className="navbar__links">
        {NAV_LINKS.map(link => (
          <a
            key={link.href}
            className={`navbar__link text-label-md ${activeSection === link.href.slice(1) ? 'navbar__link--active' : ''}`}
            href={link.href}
          >
            {link.label.toUpperCase()}
          </a>
        ))}
      </div>

      {/* Right Controls */}
      <div className="navbar__controls">
        <span className="navbar__version text-label-sm">Portfolio v1.0</span>

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

        {/* CTA */}
        <a className="navbar__cta text-label-md" href="#contact">
          HIRE ME
        </a>

        {/* Mobile Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(p => !p)}
          aria-label="Toggle menu"
          id="menu-toggle-btn"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        {NAV_LINKS.map(link => (
          <a
            key={link.href}
            className="navbar__mobile-link text-label-md"
            href={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.label.toUpperCase()}
          </a>
        ))}
        <a
          className="navbar__mobile-cta text-label-md"
          href="#contact"
          onClick={() => setMenuOpen(false)}
        >
          HIRE ME
        </a>
      </div>
    </nav>
  );
}

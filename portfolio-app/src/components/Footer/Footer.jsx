import React, { useEffect, useRef } from 'react';
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp, FaGithub, FaLinkedin } from 'react-icons/fa';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  { label: 'GITHUB', icon: <FaGithub size={24} />, href: 'https://github.com/KodSlayer' },
  { label: 'LINKEDIN', icon: <FaLinkedin size={24} />, href: 'https://www.linkedin.com/in/yashaas-m-267108324/' },
  { label: 'INSTAGRAM', icon: <FaInstagram size={24} />, href: '#' },
  { label: 'TWITTER', icon: <FaTwitter size={24} />, href: '#' },
  { label: 'WHATSAPP', icon: <FaWhatsapp size={24} />, href: '#' },
];

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade upward for main text
      gsap.fromTo(
        ['.footer__label', '.footer__email', '.footer__meta'],
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.footer',
            start: 'top 90%',
            once: true,
          },
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          clearProps: 'all'
        }
      );

      // Bounce for icons
      gsap.fromTo(
        '.footer__link',
        { y: 50, opacity: 0, scale: 0.8 },
        {
          scrollTrigger: {
            trigger: '.footer',
            start: 'top 85%',
            once: true,
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          clearProps: 'all'
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer" id="footer" ref={footerRef}>
      <div className="footer__bg-pattern" />

      <div className="container footer__inner">
        <div className="footer__label text-label-sm"></div>

        <a
          className="footer__email"
          href="mailto:yashasteshi08@gmail.com"
          id="footer-email-link"
        >
          YASHASTESHI08@GMAIL.COM
        </a>

        <div className="footer__links">
          {SOCIAL_LINKS.map(link => (
            <a
              key={link.label}
              className="footer__link text-label-md"
              href={link.href}
              title={link.label}
              target="_blank"
              rel="noreferrer"
              id={`footer-${link.label.toLowerCase()}-link`}
            >
              {link.icon}
            </a>
          ))}
        </div>

        <div className="footer__divider" />

        <div className="footer__meta">
          <span className="text-label-sm footer__meta-text">
            © 2026 YASHAAS M. Built with passion.
          </span>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp, FaGithub, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const SOCIAL_LINKS = [
  { label: 'GITHUB', icon: <FaGithub size={24} />, href: 'https://github.com/KodSlayer' },
  { label: 'LINKEDIN', icon: <FaLinkedin size={24} />, href: 'https://www.linkedin.com/in/yashaas-m-267108324/' },
  { label: 'INSTAGRAM', icon: <FaInstagram size={24} />, href: '#' },
  { label: 'FACEBOOK', icon: <FaFacebook size={24} />, href: '#' },
  { label: 'TWITTER', icon: <FaTwitter size={24} />, href: '#' },
  { label: 'WHATSAPP', icon: <FaWhatsapp size={24} />, href: '#' },
];

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__bg-pattern" />

      <div className="container footer__inner">
        <div className="footer__label text-label-sm"></div>

        <a
          className="footer__email text-display-lg"
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

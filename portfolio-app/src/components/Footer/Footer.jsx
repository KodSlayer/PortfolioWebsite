import React from 'react';
import './Footer.css';

const SOCIAL_LINKS = [
  { label: 'GITHUB', href: 'https://github.com/KodSlayer' },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/yashaas-m-267108324/' },
  { label: 'EMAIL', href: 'mailto:yashasteshi08@gmail.com' },
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
              id={`footer-${link.label.toLowerCase()}-link`}
            >
              {link.label}
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

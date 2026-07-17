import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './Certifications.css';

gsap.registerPlugin(ScrollTrigger);

const CERTS = [
  {
    id: '01',
    title: 'Claude with the Anthropic API',
    issuer: 'Anthropic',
    date: '2024',
    credId: 'ANTHROPIC-CERT',
    verifyUrl: '/Clause_with_API.pdf',
    badge: '/Claude_API.png',
  },
  {
    id: '02',
    title: 'Claude Code in Action',
    issuer: 'Anthropic',
    date: '2024',
    credId: 'ANTHROPIC-CERT',
    verifyUrl: '/ClaudeCode_in_Action.pdf',
    badge: '/ClaudeCode.png',
  },
  {
    id: '03',
    title: 'Introduction to MCP',
    issuer: 'Anthropic',
    date: '2024',
    credId: 'ANTHROPIC-CERT',
    verifyUrl: '/Introduction_to_MCP.pdf',
    badge: '/Intro_to_mcp.png',
  },
  {
    id: '04',
    title: 'Introduction to Agent Skills',
    issuer: 'Anthropic',
    date: '2024',
    credId: 'ANTHROPIC-CERT',
    verifyUrl: '/Introductio_to_agentic_skills.pdf',
    badge: '/Intro_to_agentic_skills.png',
  },
  {
    id: '05',
    title: 'Introduction to Subagents',
    issuer: 'Anthropic',
    date: '2024',
    credId: 'ANTHROPIC-CERT',
    verifyUrl: '/Introductio_to_Subagents.pdf',
    badge: '/Intro_to_subagents.png',
  },
  {
    id: '06',
    title: 'AI Fluency: Framework & Foundations',
    issuer: 'Anthropic',
    date: '2024',
    credId: 'ANTHROPIC-CERT',
    verifyUrl: '/AI_fluency_framework.pdf',
    badge: '/AI_fluency.png',
  },
  {
    id: '07',
    title: 'Claude Code 101',
    issuer: 'Anthropic',
    date: '2024',
    credId: 'ANTHROPIC-CERT',
    verifyUrl: '/ClaudeCode_101.pdf',
    badge: '/ClaudeCode_101.png',
  },
  {
    id: '08',
    title: 'Claude 101',
    issuer: 'Anthropic',
    date: '2024',
    credId: 'ANTHROPIC-CERT',
    verifyUrl: '/Claude_101.pdf',
    badge: '/Claude_101.png',
  },
];

export default function Certifications() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = sectionRef.current.querySelectorAll('.cert__animate');

      gsap.set(elements, { opacity: 0, y: 32 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'expo.out',
            clearProps: 'all'
          });
        }
      });

      // Sticky Gallery logic (Active State Tracking)
      const textBlocks = gsap.utils.toArray('.cert__text-block');
      textBlocks.forEach((block, index) => {
        ScrollTrigger.create({
          trigger: block,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) {
              setActiveIndex(index);
            }
          }
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="certifications" id="certifications" ref={sectionRef}>
      <div className="container">

        {/* Header */}
        <div className="cert__header cert__animate">
          <div className="cert__section-title-card">CERTIFICATIONS</div>
          <p className="cert__subtitle cert__animate">
            Verified credentials &amp; professional achievements.
          </p>
        </div>

        {/* Sticky Scroll Gallery */}
        <div className="cert__gallery">
          
          {/* Left: Sticky Visual Frame (Desktop only) */}
          <div className="cert__sticky-col">
            <div className="cert__sticky-frame">
              {CERTS.map((cert, idx) => (
                <div 
                  key={`img-${cert.id}`}
                  className={`cert__sticky-img-wrap ${idx === activeIndex ? 'is-active' : ''}`}
                >
                  {cert.badge ? (
                    <img src={cert.badge} alt={cert.title} className="cert__sticky-img" />
                  ) : (
                    <div className="cert__badge-placeholder">
                      <span className="cert__badge-icon">✦</span>
                      <span className="cert__badge-num">{cert.id}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Scrolling Text List */}
          <div className="cert__scroll-col">
            {CERTS.map((cert, idx) => (
              <div 
                className={`cert__text-block ${idx === activeIndex ? 'is-active' : ''}`} 
                key={`text-${cert.id}`}
              >
                
                {/* Mobile visual (hidden on desktop, shows inside the text block) */}
                <div className="cert__mobile-visual">
                  {cert.badge ? (
                    <img src={cert.badge} alt={cert.title} className="cert__mobile-img" />
                  ) : (
                    <div className="cert__badge-placeholder">
                      <span className="cert__badge-icon">✦</span>
                      <span className="cert__badge-num">{cert.id}</span>
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="cert__text-content">
                  <div className="cert__card-meta">
                    <span className="cert__card-id">{cert.id}</span>
                    <div className="cert__card-meta-line" />
                    <span className="cert__card-date">{cert.date}</span>
                  </div>

                  <h3 className="cert__card-title">{cert.title}</h3>
                  <p className="cert__card-issuer">{cert.issuer}</p>

                  <div className="cert__card-cred">
                    <span className="cert__cred-key">ID</span>
                    <span className="cert__cred-val">{cert.credId}</span>
                  </div>

                  <a
                    href={cert.verifyUrl}
                    className="cert__verify-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    VERIFY CREDENTIAL
                    <span className="cert__btn-arrow">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

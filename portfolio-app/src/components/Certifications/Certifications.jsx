import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './Certifications.css';

gsap.registerPlugin(ScrollTrigger);

const CERTS = [
  {
    id: '01',
    title: 'Certification Title One',
    issuer: 'ISSUER ORGANIZATION',
    date: 'Jan 2024',
    credId: 'CRED-XXXX-0001',
    verifyUrl: '#',
    badge: null,
  },
  {
    id: '02',
    title: 'Certification Title Two',
    issuer: 'ISSUER ORGANIZATION',
    date: 'Mar 2024',
    credId: 'CRED-XXXX-0002',
    verifyUrl: '#',
    badge: null,
  },
  {
    id: '03',
    title: 'Certification Title Three',
    issuer: 'ISSUER ORGANIZATION',
    date: 'Jun 2024',
    credId: 'CRED-XXXX-0003',
    verifyUrl: '#',
    badge: null,
  },
  {
    id: '04',
    title: 'Certification Title Four',
    issuer: 'ISSUER ORGANIZATION',
    date: 'Aug 2024',
    credId: 'CRED-XXXX-0004',
    verifyUrl: '#',
    badge: null,
  },
  {
    id: '05',
    title: 'Certification Title Five',
    issuer: 'ISSUER ORGANIZATION',
    date: 'Oct 2024',
    credId: 'CRED-XXXX-0005',
    verifyUrl: '#',
    badge: null,
  },
  {
    id: '06',
    title: 'Certification Title Six',
    issuer: 'ISSUER ORGANIZATION',
    date: 'Dec 2024',
    credId: 'CRED-XXXX-0006',
    verifyUrl: '#',
    badge: null,
  },
];

// Slight rotations for brutalist personality
const ROTATIONS = [-1, 0.8, -0.5, 1.2, -0.7, 0.4];

export default function Certifications() {
  const sectionRef = useRef(null);

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

        {/* Grid */}
        <div className="cert__grid">
          {CERTS.map((cert, idx) => (
            <div
              className="cert__card cert__animate"
              key={cert.id}
              style={{ '--rotation': `${ROTATIONS[idx]}deg` }}
            >
              {/* Badge Image Area */}
              <div className="cert__badge-wrap">
                {cert.badge ? (
                  <img src={cert.badge} alt={cert.title} className="cert__badge-img" />
                ) : (
                  <div className="cert__badge-placeholder">
                    <span className="cert__badge-icon">✦</span>
                    <span className="cert__badge-num">{cert.id}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="cert__card-body">
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
                  id={`cert-verify-${cert.id}`}
                >
                  VERIFY CREDENTIAL
                  <span className="cert__btn-arrow">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

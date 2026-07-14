import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const TECH_STACK = [
  'Python', 'FastAPI', 'LangGraph', 'LangChain',
  'Vector DBs', 'LLMs', 'RAG', 'PostgreSQL', 'Docker', 'mcp servers', 'Computer Vision', 'version control', 'React.js'
];

const SKILLS = [
  'Python', 'FastAPI / REST', 'LangGraph / AutoGen', 'LangChain',
  'RAG Pipelines', 'ChromaDB', 'PostgreSQL', 'Docker', 'AWS / Azure',
  'Git & GitHub', 'Postman API Testing', 'HTML/CSS/JS',
];

export default function About() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Find all elements with about__animate class
      const elements = sectionRef.current.querySelectorAll('.about__animate');

      // Set initial state
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
    <section className="about-brutalist" id="about" ref={sectionRef}>
      <div className="container">

        {/* Header */}
        <div className="about-b__header about__animate">
          <div className="about-b__section-title-card">ABOUT ME</div>
        </div>

        <div className="about-b__grid">

          {/* ── Left: Explanation & Manifesto ── */}
          <div className="about-b__left">
            <div className="about-b__main-card about__animate">

              <h3 className="about-b__manifesto-title about__animate">
                ENGINEERING <br />
                FOR THE <span className="about-b__manifesto-accent">AI-DRIVEN</span> <br />
                SYSTEMS.
              </h3>

              <p className="about-b__bio about__animate">
                I am an Associate Engineer with hands-on experience in designing, developing, and deploying scalable backend architectures and intelligent cognitive applications.
              </p>
              <p className="about-b__bio-sub about__animate">
                My work centers on the intersection of robust backend frameworks and multi-agent workflows. I specialize in building autonomous agent systems, designing high-throughput RAG pipelines, and integrating vector databases like ChromaDB to deliver reliable, context-aware software solutions.
              </p>

              {/* Tech Stack Panel (Accent) moved inside main card */}
              <div className="about-b__tech-panel about__animate">
                <div className="about-b__panel-title" style={{ color: '#000' }}>"BUILDING SCALABLE CLOUD-NATIVE ARCHITECTURES."</div>
                <div className="about-b__tech-tags">
                  {TECH_STACK.map(tech => (
                    <span className="about-b__tech-tag" key={tech}>{tech.toUpperCase()}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Image & Status ── */}
          <div className="about-b__right">

            {/* Photo Card */}
            <div className="about-b__photo-card about__animate">
              <img
                src="/My professional image.jpeg"
                alt="Yashaas"
                className="about-b__photo"
              />
            </div>

            {/* Status Panel (Dark) */}
            <div className="about-b__status-panel about__animate">

              <div className="about-b__status-items">
                <div className="about-b__status-row">
                  <span className="about-b__status-key">ROLE</span>
                  <span className="about-b__status-val">ASSOCIATE ENGINEER</span>
                </div>
                <div className="about-b__status-row">
                  <span className="about-b__status-key">STATUS</span>
                  <span className="about-b__status-val">ACTIVE @ RANDOMTREES</span>
                </div>
                <div className="about-b__status-row">
                  <span className="about-b__status-key">FOCUS</span>
                  <span className="about-b__status-val">BACKEND / RAG / LLM</span>
                </div>
                <div className="about-b__status-row">
                  <span className="about-b__status-key">SPECIALTY</span>
                  <span className="about-b__status-val">AI & RAG ENABLED SYSTEMS</span>
                </div>
              </div>

              {/* Resume Actions */}
              <div className="about-b__resume-actions" style={{ marginTop: '32px' }}>
                <button onClick={() => setIsResumeOpen(true)} className="about-b__resume-btn">
                  VIEW RESUME
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>visibility</span>
                </button>
                <a href="/YashaasResume.pdf" download="YashaasResume.pdf" className="about-b__resume-btn about-b__resume-btn--primary">
                  DOWNLOAD
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Resume Modal */}
      {isResumeOpen && (
        <div className="resume-modal" onClick={() => setIsResumeOpen(false)}>
          <div className="resume-modal__content" onClick={e => e.stopPropagation()}>
            <div className="resume-modal__header">
              <span className="resume-modal__title">YASHAAS_RESUME.PDF</span>
              <button className="resume-modal__close" onClick={() => setIsResumeOpen(false)} aria-label="Close Resume">
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>close</span>
              </button>
            </div>
            <iframe
              src="/YashaasResume.pdf"
              className="resume-modal__iframe"
              title="Yashaas Resume"
            />
          </div>
        </div>
      )}
    </section>
  );
}

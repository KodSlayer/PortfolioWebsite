import React, { useEffect, useRef } from 'react';
import './About.css';

const TECH_STACK = [
  { label: 'LANGUAGES', value: 'Python / Java / JS' },
  { label: 'AI_FRAMEWORKS', value: 'LangGraph / AutoGen / LangChain' },
  { label: 'AI_DATASTORE', value: 'ChromaDB / Vector Search' },
  { label: 'BACKEND', value: 'FastAPI / REST APIs / RAG' },
  { label: 'INFRASTRUCTURE', value: 'Docker / AWS / Azure / Git' },
  { label: 'DATABASES', value: 'PostgreSQL' },
];

const SKILLS = [
  'Python / Java', 'FastAPI / REST', 'LangGraph / AutoGen', 'LangChain',
  'RAG Pipelines', 'ChromaDB', 'PostgreSQL', 'Docker', 'AWS / Azure',
  'Git & GitHub', 'Postman API Testing', 'HTML/CSS/JS',
];

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.about__animate').forEach((el, i) => {
              el.style.transitionDelay = `${i * 0.08}s`;
              el.classList.add('about__animate--in');
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="about circuit-bg" id="about" ref={sectionRef}>
      <div className="container">
        {/* Section label */}
        <div className="about__label text-label-sm about__animate">
          <span className="about__label-code">01</span> // ABOUT ME
        </div>

        <div className="about__grid">
          {/* ── Left: Photo + Status ── */}
          <div className="about__left">
            {/* Profile Photo */}
            <div className="about__photo-wrap about__animate">
              <div className="about__photo-glow" />
              <div className="about__photo-border">
                <img
                  src="/My professional image.jpeg"
                  alt="Professional Headshot"
                  className="about__photo"
                />
              </div>
            </div>

            {/* Status Card */}
            <div className="glass-panel about__status-card about__animate">
              <div className="about__status-header">
                <div className="about__status-led led-active" />
                <span className="text-label-sm about__status-text">System Status: Active</span>
              </div>
              <div className="about__status-rows">
                {[
                  { key: 'Role', val: 'Associate Engineer' },
                  { key: 'Location', val: 'Chennai // India' },
                  { key: 'Status', val: 'Active @ RandomTrees' },
                  { key: 'Protocols', val: 'FastAPI / RAG / LangGraph' },
                ].map(row => (
                  <div className="about__status-row" key={row.key}>
                    <span className="text-label-sm about__status-key">{row.key}</span>
                    <span className="text-label-sm about__status-val">{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Bio + Stack + Methodology ── */}
          <div className="about__right">
            {/* Header */}
            <div className="about__animate">
              <span className="about__eyebrow text-label-md">IDENTITY // YASHAAS_M_V2.0</span>
              <h2 className="about__title text-display-md">
                ENGINEERING <br />
                <span style={{ color: 'var(--primary-container)', fontStyle: 'italic' }}>AI-DRIVEN</span> SYSTEMS.
              </h2>
            </div>

            {/* Bio */}
            <div className="about__bio about__animate">
              <p className="text-body-lg">
                I am an <span className="about__highlight">Associate Engineer</span> with hands-on experience designing, developing, and deploying scalable backend architectures and intelligent AI-driven applications.
              </p>
              <p className="text-body-md about__bio-sub">
                My work centers on the intersection of robust backend frameworks and cognitive systems. I specialize in building multi-agent systems, designing high-throughput RAG pipelines, and integrating vector databases like ChromaDB to deliver reliable, context-aware software solutions.
              </p>
            </div>

            {/* Core Stack */}
            <div className="about__stack-section about__animate">
              <h3 className="about__section-heading text-headline-md">
                <span className="material-symbols-outlined" style={{ color: 'var(--primary-container)' }}>terminal</span>
                CORE_STACK
              </h3>
              <div className="about__tech-grid">
                {TECH_STACK.map(item => (
                  <div className="about__tech-badge tech-badge glass-panel" key={item.label}>
                    <span className="text-label-sm about__tech-label">{item.label}</span>
                    <span className="text-body-md about__tech-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Chips */}
            <div className="about__chips-section about__animate">
              {SKILLS.map(s => (
                <span className="about__chip text-label-sm" key={s}>{s}</span>
              ))}
            </div>

            {/* Methodology */}
            <div className="about__methodology about__animate">
              <h3 className="about__section-heading text-headline-md">
                <span className="material-symbols-outlined" style={{ color: 'var(--primary-container)' }}>schema</span>
                METHODOLOGY
              </h3>
              <div className="about__method-grid">
                <div className="glass-panel about__method-card about__method-card--wide">
                  <h4 className="text-headline-md about__method-title">Agentic Workflows</h4>
                  <p className="text-body-md about__method-desc">
                    Designing multi-agent architectures using AutoGen, LangChain, and LangGraph. Building systems with multi-session chat tracking, context window persistence, and multi-step reasoning.
                  </p>
                  <div className="about__method-tags">
                    <span className="about__method-tag text-label-sm">AUTOGEN</span>
                    <span className="about__method-tag text-label-sm">LANGGRAPH</span>
                  </div>
                </div>

                <div className="about__method-card about__method-card--accent">
                  <span className="material-symbols-outlined about__method-icon">query_stats</span>
                  <h4 className="text-label-md" style={{ fontWeight: 700 }}>SEMANTIC_SEARCH</h4>
                  <p className="text-label-sm">Converting document feeds into vector collections on ChromaDB for efficient context retrieval.</p>
                </div>

                <div className="about__method-card about__method-card--primary">
                  <h4 className="text-headline-md about__method-title">CLOUD_SCALE</h4>
                  <p className="text-body-md">Assisting in migrating legacy backend APIs from Azure environments into scalable, cloud-native AWS infrastructures.</p>
                  <span className="material-symbols-outlined about__method-icon-end">cloud</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useRef } from 'react';
import './About.css';

const TECH_STACK = [
  'Python', 'Java', 'FastAPI', 'LangGraph', 'AutoGen', 'LangChain',
  'ChromaDB', 'PostgreSQL', 'Docker', 'AWS', 'Azure'
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
              el.style.transitionDelay = `${i * 0.1}s`;
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
                <div className="about-b__status-row">
                  <span className="about-b__status-key">ARCHITECTURE</span>
                  <span className="about-b__status-val">MULTI-AGENT WORKFLOWS</span>
                </div>
              </div>
            </div>



          </div>

        </div>
      </div>
    </section>
  );
}

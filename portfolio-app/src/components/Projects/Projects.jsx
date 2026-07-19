import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: '01',
    category: 'Agentic Workflows',
    title: 'SkillSync',
    specs: ['Next.js', 'FastAPI', 'LangGraph', 'PostgreSQL'],
    desc: 'An AI-powered Career Trajectory & Resume Analyzer. Parses PDFs with PyMuPDF, streams real-time AI workflow via SSE, and utilizes multi-actor LangGraph agents with Tinyfish API for job matching.',
    status: 'Active',
    version: 'v1.0.0',
    statusColor: 'green',
    accentColor: 'var(--primary-container)',
    image: '/assets/skillsync.png',
    github: 'https://github.com/KodSlayer/SkillSync'
  },
  {
    id: '02',
    category: 'AI EdTech',
    title: 'Note2Quiz',
    specs: ['Next.js', 'FastAPI', 'LangGraph', 'OpenSearch'],
    desc: 'An AI-powered RAG examination platform. Accepts syllabus notes via unstructured.io, chunks & vectorizes them in OpenSearch, and dynamically generates session-based contextual multiple-choice questions.',
    status: 'Active',
    version: 'v1.0.0',
    statusColor: 'cyan',
    accentColor: 'var(--secondary-container)',
    image: '/assets/note2quiz.png',
    github: 'https://github.com/KodSlayer/Note2Quiz'
  },
  {
    id: '03',
    category: 'Multi-Agent Systems',
    title: 'AI Agents Sandbox',
    specs: ['LangChain', 'AutoGen', 'Tavily API', 'Groq'],
    desc: 'A sandbox of simple AI agents built during an exploration phase. Explores multi-agent systems, internet browsing, and workflow orchestration using LangChain and AutoGen.',
    status: 'Stable',
    version: 'v1.0.0',
    statusColor: 'green',
    accentColor: 'var(--primary-container)',
    image: '/assets/ai_sandbox.png',
    github: 'https://github.com/KodSlayer/LangChain-Agents'
  },
  {
    id: '04',
    category: 'Web Applications',
    title: 'AI Developer Portfolio',
    specs: ['React', 'GSAP', 'CSS Brutalism', 'Vite'],
    desc: 'This very portfolio! A highly interactive developer portfolio featuring advanced GSAP scroll animations, parallax effects, and an integrated interactive AI Chat Assistant.',
    status: 'Active',
    version: 'v1.0.0',
    statusColor: 'cyan',
    accentColor: 'var(--secondary-container)',
    image: '/assets/hero_screenshot.png',
    github: 'https://github.com/KodSlayer/PortfolioWebsite'
  },
];

export default function Projects() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.projects__stacked-card');

      // Entrance animation
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              once: true
            }
          }
        );
      });



    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="projects" id="work" ref={sectionRef}>
      <div className="container">

        {/* Header */}
        <div className="projects__header">
          <div className="projects__section-title-card">MY PROJECTS</div>
          <p className="projects__subtitle">
            Selected works &amp; exploratory builds.
          </p>
        </div>

        {/* Stacked Cards */}
        <div className="projects__stack">
          {PROJECTS.map((project, idx) => {
            // Calculate top position for sticky stacking
            const topOffset = `calc(15vh + ${idx * 40}px)`;

            return (
              <article
                className="projects__stacked-card"
                key={project.id}
                style={{ top: topOffset, zIndex: idx }}
              >
                {/* Image Side */}
                <div className="projects__sc-image-wrap">
                  <div
                    className="projects__sc-image"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  <div className="projects__sc-overlay" />
                </div>

                {/* Content Side */}
                <div className="projects__sc-content">
                  <div className="projects__sc-meta">
                    <span className="projects__sc-id" style={{ color: project.accentColor }}>{project.id}</span>
                    <div className="projects__sc-line" style={{ background: project.accentColor }} />
                    <span className="projects__sc-cat">{project.category}</span>
                  </div>

                  <h3 className="projects__sc-title">{project.title}</h3>

                  <div className="projects__sc-specs">
                    {project.specs.map((s, i) => (
                      <React.Fragment key={s}>
                        <span>{s}</span>
                        {i < project.specs.length - 1 && <span className="projects__spec-sep">|</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  <p className="projects__sc-desc">{project.desc}</p>

                  <div className="projects__sc-bottom-row">
                    <a
                      href={project.github || "#"}
                      className="projects__github-link"
                      aria-label="View on Github"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GITHUB
                      <span className="material-symbols-outlined">code</span>
                    </a>
                  </div>
                </div>

              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

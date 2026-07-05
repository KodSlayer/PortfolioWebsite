import React, { useRef } from 'react';
import Reveal from '../Reveal/Reveal';
import './Projects.css';

const PROJECTS = [
  {
    id: '01',
    category: 'Agentic Mesh',
    title: 'Multi-Agent Systems',
    specs: ['AutoGen', 'LangGraph', 'LangChain', 'Groq API', 'Tavily Search'],
    desc: 'A robust orchestration framework deploying specialized AI agents (Blog Writer, Chess Player, Weather Forecaster) equipped with advanced context window tracking, session persistence, and multi-step reasoning capabilities.',
    status: 'Active',
    version: 'v1.1.0',
    statusColor: 'green',
    accentColor: 'var(--primary-container)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF5IL5iRFgQ0Wtk7aJ-YstGH8LeulQBEGB0h2H-guzmVUGNF7-7SwHHjKSrjL9Epvrj81dSPGgEKE_Cs8jOLM5uXSOni_i7-9wPkI5tjST-y4eUx6LEX22HVqbpO8fXP--j5K8z26v_-nFvfwQd0evsMUapqNvL2U9mk4sRqXnM79Ejpv9vSaY4R-s0XbIP1sewrDl5EHwxFyy-cesjwXivH3hpK5RCMUvTdX5k7E9_YPHf2CPkiL1FSveaV7qesIhINiTzQcvC7w',
  },
  {
    id: '02',
    category: 'Enterprise AI',
    title: 'ETRM Terminal & BOL',
    specs: ['RAG Pipeline', 'ChromaDB', 'FastAPI', 'Azure & AWS Cloud'],
    desc: 'Production-grade cognitive agents designed for the Oil and Gas domain. Implemented document embeddings vectorization in ChromaDB for high-throughput semantic retrieval, multi-session chat logging, SAS security resolver, and transitioned APIs to AWS.',
    status: 'Active',
    version: 'v2.0.0',
    statusColor: 'cyan',
    accentColor: 'var(--secondary-container)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjN8pPPhyQ1DaeL6VUIMHWP3iH8_rIpyLjy8oZWnY59SEjHpfLS0Z2L_VJXMfNUEjDKY1y4q5Pp9eWrA7ly-ta20_h8GCp2ShcX9DzR9th9-Wb2T1b78vhMyYghop8B3WC9Xs1_RBfp3rAwZsuyaflYEOcEwP853dkjqTRPN9wJhrWl7ZAFR_2stgcvgY9jLiuPD8_izpB_vTCeNCXNlEqsgG29ulGSqa1z4oUE7U5VX23uHtcJjtTaUhFfijX55b1CLQkTjnsLqc',
  },
  {
    id: '03',
    category: 'Web Applications',
    title: 'FreshJobHub',
    specs: ['React', 'FastAPI', 'PostgreSQL', 'Modern UI/UX'],
    desc: 'A comprehensive job portal web application designed to optimize and automate the recruitment application workflow. Features clean UX/UI transitions, persistent user profiles, and a robust FastAPI backend connection.',
    status: 'Stable',
    version: 'v1.0.0',
    statusColor: 'green',
    accentColor: 'var(--primary-container)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL_NRakobkbUuVYtd4jfs_q6IIzHExvwnkzxMghTKet_zEZcFNzCLiGlZloUtGHeBmValExoi43ETUsJ8WgpHzJIWQclmyBz9pW4CRmt05sj23dH8sz5N3aAYRWnFZK3g9DYgVOCBveNzwrzIk1WnYsd67e5HYiKDKIyVPdxpKU_BA7f8DcM_KcwdxHOYTMEBkJnQYHof6fFcO7IY5mNsZYAxS2bejRbUQ5TYUYXs3EWfWtg8v4YORwwYhtXBHAB0OlBe-HC1nDVk',
  },
];

export default function Projects() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.querySelector('.project-card')?.offsetWidth || 720;
      scrollRef.current.scrollBy({ left: dir * (cardWidth + 32), behavior: 'smooth' });
    }
  };

  return (
    <section className="projects" id="work">
      {/* Header */}
      <Reveal direction="up">
        <div className="container">
          <div className="projects__header">
            <div>
              <span className="projects__eyebrow text-label-sm">02 // MY PROJECTS</span>
              <h2 className="projects__title text-headline-lg">
                Selected Work.
                <span className="projects__title-cursor text-label-sm" />
              </h2>
            </div>
            <div className="projects__nav-btns">
              <button
                className="projects__nav-btn"
                onClick={() => scroll(-1)}
                aria-label="Previous project"
                id="projects-prev-btn"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button
                className="projects__nav-btn"
                onClick={() => scroll(1)}
                aria-label="Next project"
                id="projects-next-btn"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Horizontal scroll */}
      <Reveal direction="up" delay={0.2}>
        <div className="projects__scroll-track hide-scrollbar" ref={scrollRef}>
          <div className="projects__scroll-inner">
            {PROJECTS.map(project => (
              <article className="project-card" key={project.id}>
                {/* Background image */}
                <div
                  className="project-card__img"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
                {/* Gradient overlay */}
                <div className="project-card__overlay" />

                {/* Top badges */}
                <div className="project-card__top">
                  <span className={`project-card__status project-card__status--${project.statusColor} text-label-sm`}>
                    <span className="project-card__status-dot" />
                    {project.status}
                  </span>
                  <span className="project-card__version text-label-sm">{project.version}</span>
                </div>

                {/* Bottom content */}
                <div className="project-card__bottom">
                  <div className="project-card__meta">
                    <span className="project-card__num text-label-md" style={{ color: project.accentColor }}>
                      {project.id}
                    </span>
                    <div className="project-card__meta-line" style={{ background: project.accentColor }} />
                    <span className="project-card__cat text-label-sm">{project.category}</span>
                  </div>

                  <h3 className="project-card__title text-headline-lg">{project.title}</h3>

                  <div className="project-card__specs text-label-sm">
                    {project.specs.map((s, i) => (
                      <React.Fragment key={s}>
                        <span>{s}</span>
                        {i < project.specs.length - 1 && <span className="project-card__sep">|</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  <p className="project-card__desc text-body-md">{project.desc}</p>

                  <div className="project-card__actions">
                    <button className="project-card__btn text-label-sm">
                      VIEW_PROJECT
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>north_east</span>
                    </button>
                    <button className="project-card__btn project-card__btn--ghost text-label-sm">
                      GITHUB
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

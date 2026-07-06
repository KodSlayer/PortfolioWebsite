import React, { useState } from 'react';
import Reveal from '../Reveal/Reveal';
import './Contact.css';

const SERVICES = ['Development', 'Architecture', 'Infrastructure', 'Consulting', 'Research', 'AI / ML'];
const SOCIAL_LINKS = [
  { icon: 'terminal', label: 'GitHub', href: 'https://github.com/KodSlayer' },
  { icon: 'share', label: 'LinkedIn', href: 'https://www.linkedin.com/in/yashaas-m-267108324/' },
  { icon: 'mail', label: 'Email', href: 'mailto:yashasteshi08@gmail.com' },
  { icon: 'call', label: 'Phone', href: 'tel:+917892343265' },
];

export default function Contact() {
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | sending | done

  const toggleService = (s) => {
    setSelected(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('done');
      setTimeout(() => {
        setStatus('idle');
        e.target.reset();
        setSelected([]);
      }, 3000);
    }, 1500);
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        {/* Section Title */}
        <div className="contact__section-title-card">GET IN TOUCH</div>
        <div className="contact__grid">
          {/* ── Left: Context ── */}
          <Reveal direction="left" delay={0.1}>
            <div className="contact__left">
              <span className="contact__eyebrow text-label-sm">04 // GET IN TOUCH</span>
              <h2 className="text-display-md contact__title">
                LET'S WORK<br />TOGETHER.
              </h2>
              <p className="text-body-lg contact__subtitle">
                Have a project in mind or want to explore how AI can power your next product?
                Drop me a message — I'm currently open to new opportunities.
              </p>

              {/* Status Indicator */}
              <div className="contact__status">
                <div className="contact__status-dot">
                  <div className="contact__status-pulse" />
                  <div className="contact__status-inner" />
                </div>
                <div>
                  <p className="text-label-md contact__status-label">Availability</p>
                  <p className="text-label-sm contact__status-value">OPEN TO WORK // Chennai, India</p>
                </div>
              </div>

              {/* Secure Channels */}
              <div className="contact__channels">
                <h3 className="text-headline-md contact__channels-title">FIND ME ON</h3>
                <div className="contact__channels-grid">
                  {SOCIAL_LINKS.map(link => (
                    <a
                      key={link.label}
                      className="contact__channel-link"
                      href={link.href}
                      id={`social-${link.label.toLowerCase().replace(/[\s()]/g, '-')}-link`}
                    >
                      <div className="contact__channel-left">
                        <span className="material-symbols-outlined contact__channel-icon">{link.icon}</span>
                        <span className="text-label-md contact__channel-label">{link.label}</span>
                      </div>
                      <span className="material-symbols-outlined contact__channel-arrow">arrow_forward</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── Right: Form ── */}
          <Reveal direction="right" delay={0.2}>
            <div className="contact__right">
              <div className="contact__form-card">
                <form className="contact__form" onSubmit={handleSubmit} id="connection-form">
                  {/* Name + Email */}
                  <div className="contact__form-row">
                    <div className="contact__field">
                      <label className="text-label-sm contact__label" htmlFor="client_id">
                        Identifier [NAME]
                      </label>
                      <input
                        className="contact__input"
                        id="client_id"
                        type="text"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="contact__field">
                      <label className="text-label-sm contact__label" htmlFor="client_email">
                        Uplink [EMAIL]
                      </label>
                      <input
                        className="contact__input"
                        id="client_email"
                        type="email"
                        placeholder="name@domain.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Services */}
                  <div className="contact__field">
                    <label className="text-label-sm contact__label">Parameters [SERVICE]</label>
                    <div className="contact__services">
                      {SERVICES.map(s => (
                        <button
                          key={s}
                          type="button"
                          className={`contact__service-chip text-label-md ${selected.includes(s) ? 'contact__service-chip--active' : ''}`}
                          onClick={() => toggleService(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="contact__field">
                    <label className="text-label-sm contact__label" htmlFor="packet_payload">
                      Payload [MESSAGE]
                    </label>
                    <textarea
                      className="contact__input contact__textarea"
                      id="packet_payload"
                      rows={5}
                      placeholder="Describe the project scope or technical requirements..."
                      required
                    />
                  </div>

                  {/* Submit */}
                  <button
                    className={`contact__submit btn-primary ${status !== 'idle' ? 'contact__submit--loading' : ''}`}
                    type="submit"
                    disabled={status !== 'idle'}
                    id="submit-connection-btn"
                  >
                    {status === 'idle' && (
                      <>
                        START CONNECTION
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
                      </>
                    )}
                    {status === 'sending' && (
                      <>
                        <span className="contact__spinner" />
                        SYNCHRONIZING...
                      </>
                    )}
                    {status === 'done' && (
                      <>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
                        HANDSHAKE COMPLETE
                      </>
                    )}
                  </button>
                </form>

                {/* Tech Meta */}
                <div className="contact__form-meta">
                  <div className="contact__meta-item">
                    <p className="text-label-sm contact__meta-key">Encryption</p>
                    <p className="text-label-md contact__meta-val">AES-256 E2EE</p>
                  </div>
                  <div className="contact__meta-item">
                    <p className="text-label-sm contact__meta-key">Response Time</p>
                    <p className="text-label-md contact__meta-val">&lt; 12.0 Hours</p>
                  </div>
                  <div className="contact__meta-item">
                    <p className="text-label-sm contact__meta-key">Protocol</p>
                    <p className="text-label-md contact__meta-val">HTTPS / E2E</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

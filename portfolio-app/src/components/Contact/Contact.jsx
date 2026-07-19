import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = ['Development', 'Architecture', 'Infrastructure', 'Consulting', 'Research', 'AI / ML'];
const SOCIAL_LINKS = [
  { icon: 'terminal', label: 'GitHub', href: 'https://github.com/KodSlayer' },
  { icon: 'share', label: 'LinkedIn', href: 'https://www.linkedin.com/in/yashaas-m-267108324/' },
  { icon: 'mail', label: 'Email', href: 'mailto:yashasteshi08@gmail.com' },
  { icon: 'forum', label: 'WhatsApp', href: 'https://wa.me/7892343265' },
];

export default function Contact() {
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | sending | done

  const toggleService = (s) => {
    setSelected(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const formData = new FormData(e.target);
      
      // Use the access key from environment variables (or placeholder if missing)
      formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE");
      
      if (selected.length > 0) {
        formData.append("services", selected.join(", "));
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStatus('done');
        setTimeout(() => {
          setStatus('idle');
          e.target.reset();
          setSelected([]);
        }, 3000);
      } else {
        console.error("Form error:", data);
        setStatus('idle');
        alert("Failed to send message: " + data.message);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setStatus('idle');
      alert("An error occurred. Please try again later.");
    }
  };

  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger Left content
      gsap.fromTo(
        '.contact__left > *, .contact__channel-link',
        { opacity: 0, x: -30 },
        {
          scrollTrigger: {
            trigger: '.contact__left',
            start: 'top 80%',
            once: true,
          },
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'all'
        }
      );

      // Stagger Right Form fields
      gsap.fromTo(
        '.contact__field, .contact__submit',
        { opacity: 0, x: 30 },
        {
          scrollTrigger: {
            trigger: '.contact__right',
            start: 'top 80%',
            once: true,
          },
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'all'
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="container">
        {/* Section Title */}
        <div className="contact__section-title-card">GET IN TOUCH</div>
        <div className="contact__grid">
          {/* ── Left: Context ── */}
          <div className="contact__left">
            <h2 className="text-display-md contact__title">
              LET'S WORK<br />TOGETHER.
            </h2>
            <p className="text-body-lg contact__subtitle">
              Have a project in mind or want to explore how AI can power your next product?
              Drop me a message — I'm currently open to new opportunities.
            </p>

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
                    target={link.href.startsWith('http') ? "_blank" : undefined}
                    rel={link.href.startsWith('http') ? "noopener noreferrer" : undefined}
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

          {/* ── Right: Form ── */}
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
                      name="name"
                      type="text"
                      placeholder="Your Name"
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
                      name="email"
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
                    name="message"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

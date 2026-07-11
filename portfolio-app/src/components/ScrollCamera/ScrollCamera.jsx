import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './ScrollCamera.css';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollCamera({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reset initial state for GSAP
    gsap.set(el, { opacity: 0, y: 60 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'expo.out',
            clearProps: 'all' // Cleanup after animation to avoid transform conflicts
          });
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="scroll-camera" ref={ref}>
      {children}
    </div>
  );
}

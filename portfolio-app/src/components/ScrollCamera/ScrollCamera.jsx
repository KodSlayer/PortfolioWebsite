import { useEffect, useRef } from 'react';
import './ScrollCamera.css';

/**
 * ScrollCamera — Scroll-driven zoom-through transition.
 *
 * KEY FIX: We store the section's document-level layout offset ONCE on mount
 * (before any transforms). Progress is then calculated purely from window.scrollY
 * against that stored offset — never from getBoundingClientRect() — which avoids
 * the feedback loop where our own scale() transforms corrupt the rect readings.
 */
export default function ScrollCamera({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // ── Read layout metrics ONCE before any transform is applied ──
    let docTop   = el.getBoundingClientRect().top + window.scrollY;
    let sectionH = el.offsetHeight;

    let raf = null;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);   // smooth entry
    const easeIn  = (t) => t * t;                      // sharp exit

    function update() {
      const winH   = window.innerHeight;
      const scrollY = window.scrollY;

      // rawP: 0 = section bottom just entered viewport bottom
      //       1 = section fully above viewport
      const rawP = (scrollY + winH - docTop) / (winH + sectionH);

      // ── Below viewport ──
      if (rawP <= 0) {
        el.style.opacity   = '0';
        el.style.transform = 'scale(0.92) translateY(56px)';
        raf = null;
        return;
      }

      // ── Fully above viewport ──
      if (rawP >= 1) {
        el.style.opacity   = '1';
        el.style.transform = 'none';
        raf = null;
        return;
      }

      const ENTRY = 0.13;  // 0–13%: zoom in from depth
      const EXIT  = 0.82;  // 82–100%: recede into depth

      let scale, opacity, ty;

      if (rawP < ENTRY) {
        const t = easeOut(rawP / ENTRY);
        scale   = 0.92 + t * 0.08;
        opacity = t;
        ty      = (1 - t) * 56;
      } else if (rawP < EXIT) {
        scale   = 1;
        opacity = 1;
        ty      = 0;
      } else {
        const t = easeIn((rawP - EXIT) / (1 - EXIT));
        scale   = 1 - t * 0.055;
        opacity = 1 - t * 0.28;
        ty      = -t * 20;
      }

      el.style.opacity   = opacity.toFixed(4);
      el.style.transform = `scale(${scale.toFixed(5)}) translateY(${ty.toFixed(1)}px)`;
      raf = null;
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    function onResize() {
      // Re-read layout position after resize (reset transform first so rect is accurate)
      el.style.transform = 'none';
      el.style.opacity   = '1';
      requestAnimationFrame(() => {
        docTop   = el.getBoundingClientRect().top + window.scrollY;
        sectionH = el.offsetHeight;
        update();
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    update(); // Paint initial state

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="scroll-camera" ref={ref}>
      {children}
    </div>
  );
}

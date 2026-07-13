import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTheme } from '../../contexts/ThemeContext';
import './Loader.css';

const MESSAGES = [
  'ESTABLISHING_SECURE_CONNECTION...',
  'LOADING_NEURAL_WEIGHTS...',
  'COMPILING_SHADERS...',
  'INITIALIZING_PHYSICS_ENGINE...',
  'DEPLOYING_PORTFOLIO_v2.0...',
  'SYSTEM_READY_0x00',
];

export default function Loader({ onComplete }) {
  const { isDark } = useTheme();
  const loaderRef = useRef(null);
  const barRef = useRef(null);
  const textRef = useRef(null);
  const percentRef = useRef(null);
  const canvasContainerRef = useRef(null);

  // Three.js background particle field in the loader
  useEffect(() => {
    let animId;
    let THREE;

    import('three').then((mod) => {
      THREE = mod;
      const container = canvasContainerRef.current;
      if (!container) return;

      const scene = new THREE.Scene();
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const particleCount = 200;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const c1 = new THREE.Color(0x0066FF);
      const c2 = new THREE.Color(0x00D1FF);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
        const mix = Math.random();
        colors[i * 3] = THREE.MathUtils.lerp(c1.r, c2.r, mix);
        colors[i * 3 + 1] = THREE.MathUtils.lerp(c1.g, c2.g, mix);
        colors[i * 3 + 2] = THREE.MathUtils.lerp(c1.b, c2.b, mix);
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: isDark ? 0.9 : 0.5,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      function animate(t) {
        animId = requestAnimationFrame(animate);
        points.rotation.y += 0.001;
        points.rotation.x += 0.0005;
        renderer.render(scene, camera);
      }
      animate(0);

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    });

    return () => cancelAnimationFrame(animId);
  }, [isDark]);

  // Loading progress simulation
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 3;
      if (progress >= 100) progress = 100;

      if (barRef.current) barRef.current.style.width = `${progress}%`;
      if (percentRef.current) percentRef.current.textContent = `${progress}%`;

      const idx = Math.floor((progress / 100) * (MESSAGES.length - 1));
      if (textRef.current) textRef.current.textContent = MESSAGES[Math.min(idx, MESSAGES.length - 1)];

      if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (loaderRef.current) {
            gsap.to(loaderRef.current, {
              yPercent: -100,
              duration: 1.2,
              ease: 'expo.inOut',
              onComplete: () => {
                onComplete?.();
              }
            });
          } else {
             onComplete?.();
          }
        }, 600);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="loader-overlay" ref={loaderRef}>
      {/* Three.js bg */}
      <div className="loader-three-bg" ref={canvasContainerRef} />

      {/* Brutalist content card */}
      <div className="loader-card">
        <div className="loader-spinner" />

        <div className="loader-brand">
          <span className="loader-brand-dot" />
          YASHAAS<span className="loader-brand-accent">.M</span>
        </div>

        <div className="loader-message-wrap">
          <div className="loader-message text-label-md" ref={textRef}>
            ESTABLISHING_SECURE_CONNECTION...
          </div>
          <div className="loader-percent text-label-sm" ref={percentRef}>0%</div>
        </div>

        <div className="loader-bar-track">
          <div className="loader-bar-fill" ref={barRef} />
        </div>

        <div className="loader-meta text-label-sm">
          YASHAAS M // Associate Engineer // GenAI & Backend
        </div>
      </div>

      {/* Scan line effect */}
      <div className="loader-scanline" />
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './Hero.css';

export default function Hero() {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  const sceneRef = useRef({});

  useEffect(() => {
    let animId;

    import('three').then((THREE) => {
      const container = canvasRef.current;
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
      sceneRef.current.renderer = renderer;

      // Particle network
      const particleCount = 180;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const c1 = new THREE.Color(isDark ? 0x0088FF : 0x0066FF);
      const c2 = new THREE.Color(isDark ? 0x00FFFF : 0x00D1FF);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 18;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
        const mix = Math.random();
        colors[i * 3] = THREE.MathUtils.lerp(c1.r, c2.r, mix);
        colors[i * 3 + 1] = THREE.MathUtils.lerp(c1.g, c2.g, mix);
        colors[i * 3 + 2] = THREE.MathUtils.lerp(c1.b, c2.b, mix);
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: isDark ? 0.15 : 0.1,
        vertexColors: true,
        transparent: true,
        opacity: isDark ? 0.9 : 0.7,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
      sceneRef.current.points = points;

      // Connection lines
      const lineMaterial = new THREE.LineBasicMaterial({
        color: isDark ? 0x0088FF : 0x0066FF,
        transparent: true,
        opacity: isDark ? 0.35 : 0.18,
      });

      let lines;
      const maxDist = 2.8;

      function updateConnections() {
        if (lines) scene.remove(lines);
        const linePositions = [];
        const pos = points.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          for (let j = i + 1; j < particleCount; j++) {
            const dx = pos[i * 3] - pos[j * 3];
            const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
            const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
            if (Math.sqrt(dx * dx + dy * dy + dz * dz) < maxDist) {
              linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
              linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
            }
          }
        }
        const lg = new THREE.BufferGeometry();
        lg.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lines = new THREE.LineSegments(lg, lineMaterial);
        scene.add(lines);
      }

      const mouse = new THREE.Vector2();
      window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      });

      function animate(t) {
        animId = requestAnimationFrame(animate);
        points.rotation.y += 0.0008;
        points.rotation.x += 0.0004;

        const pos = points.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3 + 1] += Math.sin(t * 0.001 + pos[i * 3]) * 0.001;
        }
        points.geometry.attributes.position.needsUpdate = true;

        camera.position.x += (mouse.x * 2 - camera.position.x) * 0.04;
        camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);

        updateConnections();
        renderer.render(scene, camera);
      }

      animate(0);

      const handleResize = () => {
        const w2 = container.clientWidth || window.innerWidth;
        const h2 = container.clientHeight || window.innerHeight;
        camera.aspect = w2 / h2;
        camera.updateProjectionMatrix();
        renderer.setSize(w2, h2);
      };
      window.addEventListener('resize', handleResize);
      sceneRef.current.cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };
    });

    return () => {
      cancelAnimationFrame(animId);
      sceneRef.current.cleanup?.();
    };
  }, [isDark]);

  return (
    <section className="hero" id="hero">
      {/* Three.js canvas */}
      <div className="hero__canvas" ref={canvasRef} />

      {/* Content */}
      <div className="hero__content">
        <div className="hero__badge text-label-sm">
          <span className="hero__badge-dot" />
          Available for Work // Chennai, India
        </div>

        <h1 className="hero__title text-display-lg">
          Hi, I'm <br />
          <span className="gradient-text">Yashaas M</span>
        </h1>

        <p className="hero__desc text-body-lg">
          Associate Engineer building intelligent backend systems & multi-agent AI pipelines.
          I turn complex problems into scalable, production-ready solutions with Python,
          LangGraph, FastAPI, and ChromaDB.
        </p>

        <div className="hero__cta-group">
          <a className="btn-primary" href="#work">
            VIEW MY WORK
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
          </a>
          <a className="btn-secondary" href="#about">
            ABOUT ME
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero__scroll">
        <span className="text-label-sm hero__scroll-text">SCROLL DOWN</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}

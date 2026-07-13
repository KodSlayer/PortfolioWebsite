import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTheme } from '../../contexts/ThemeContext';
import './Hero.css';

export default function Hero() {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  const sceneRef = useRef({});
  const sectionRef = useRef(null);
  const animStateRef = useRef({ progress: 0 });

  // Initial setup: hide elements immediately with a premium blurred state
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(['.hero__title-line', '.hero__manifesto', '.hero__scroll'], { 
        y: 50, 
        opacity: 0,
        filter: 'blur(10px)',
        scale: 0.96,
        rotationX: 10
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Premium Entrance Stagger Animation
  useEffect(() => {
    
    const ctx = gsap.context(() => {
      // Animate Three.js Network Spawning first
      gsap.to(animStateRef.current, {
        progress: 1,
        duration: 3.5,
        ease: 'power2.inOut',
        delay: 0.2 // Starts immediately after loader
      });

      // Animate Text Entrance (starts when network is ~50-60% formed)
      gsap.to(
        ['.hero__title-line', '.hero__manifesto', '.hero__scroll'],
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1,
          rotationX: 0,
          duration: 1.6,
          stagger: 0.18,
          ease: 'power4.out',
          delay: 2.0, // Delay until network is mostly formed (0.2 + ~1.8s)
          clearProps: 'all'
        }
      );
    }, sectionRef);
    return () => ctx.revert(); // clean up animation if component unmounts
  }, []);

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

      // Particle network — brutalist palette
      const particleCount = 180;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const c1 = new THREE.Color(isDark ? 0xffffff : 0x000000);
      const c2 = new THREE.Color(isDark ? 0x0066ff : 0x0066ff);

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
        size: isDark ? 0.12 : 0.08,
        vertexColors: true,
        transparent: true,
        opacity: isDark ? 0.9 : 0.55,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
      sceneRef.current.points = points;

      // Connection lines
      const lineMaterial = new THREE.LineBasicMaterial({
        color: isDark ? 0x0066FF : 0x191c1e,
        transparent: true,
        opacity: isDark ? 0.4 : 0.12,
      });

      let lines;
      
      function updateConnections() {
        if (lines) scene.remove(lines);
        const linePositions = [];
        const pos = points.geometry.attributes.position.array;
        
        // Connections grow as progress increases
        const currentMaxDist = 2.8 * animStateRef.current.progress;
        
        for (let i = 0; i < particleCount; i++) {
          for (let j = i + 1; j < particleCount; j++) {
            const dx = pos[i * 3] - pos[j * 3];
            const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
            const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
            if (Math.sqrt(dx * dx + dy * dy + dz * dz) < currentMaxDist) {
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

      // Lightning System
      const pulseGeo = new THREE.SphereGeometry(0.12, 10, 10);
      const activePulses = [];
      let lastSpawnTime = 0;

      function getNeighborNodes(nodeIdx) {
        const pos = points.geometry.attributes.position.array;
        const neighbors = [];
        // Max distance for lightning is always 2.8 regardless of spawn progress
        for (let j = 0; j < particleCount; j++) {
          if (j === nodeIdx) continue;
          const dx = pos[nodeIdx * 3] - pos[j * 3];
          const dy = pos[nodeIdx * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[nodeIdx * 3 + 2] - pos[j * 3 + 2];
          if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 2.8) neighbors.push(j);
        }
        return neighbors;
      }

      function addPulse(fromNode, toNode, hopsLeft) {
        if (hopsLeft <= 0) return;
        const mat = new THREE.MeshBasicMaterial({
          color: isDark ? 0x00d1ff : 0x0066ff,
          transparent: true,
          opacity: 1.0,
          blending: THREE.AdditiveBlending,
        });
        const orb = new THREE.Mesh(pulseGeo, mat);
        const haloGeo = new THREE.SphereGeometry(0.22, 10, 10);
        const haloMat = new THREE.MeshBasicMaterial({
          color: isDark ? 0x0066ff : 0x000000,
          transparent: true,
          opacity: 0.3,
          blending: THREE.AdditiveBlending,
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        orb.add(halo);
        scene.add(orb);
        activePulses.push({ fromNode, toNode, progress: 0, hopsLeft, orb, haloMat });
      }

      function spawnChain(startNode, hopsLeft = 7) {
        const neighbors = getNeighborNodes(startNode);
        if (neighbors.length === 0) return;
        const toNode = neighbors[Math.floor(Math.random() * neighbors.length)];
        addPulse(startNode, toNode, hopsLeft);
      }

      function updateLightning(t) {
        if (t - lastSpawnTime > 1500) {
          lastSpawnTime = t;
          spawnChain(Math.floor(Math.random() * particleCount), 7);
          if (Math.random() > 0.5) {
            setTimeout(() => spawnChain(Math.floor(Math.random() * particleCount), 5), 400);
          }
        }
        const pos = points.geometry.attributes.position.array;
        for (let i = activePulses.length - 1; i >= 0; i--) {
          const p = activePulses[i];
          p.progress += 0.038;
          const sx = pos[p.fromNode * 3], sy = pos[p.fromNode * 3 + 1], sz = pos[p.fromNode * 3 + 2];
          const ex = pos[p.toNode * 3], ey = pos[p.toNode * 3 + 1], ez = pos[p.toNode * 3 + 2];
          if (p.progress >= 1) {
            scene.remove(p.orb);
            p.orb.material.dispose();
            if (p.haloMat) p.haloMat.dispose();
            activePulses.splice(i, 1);
            if (p.hopsLeft > 1) {
              const neighbors = getNeighborNodes(p.toNode);
              if (neighbors.length > 0) {
                addPulse(p.toNode, neighbors[Math.floor(Math.random() * neighbors.length)], p.hopsLeft - 1);
              }
            }
          } else {
            const fade = p.progress < 0.75 ? 1 : 1 - ((p.progress - 0.75) / 0.25);
            p.orb.material.opacity = fade;
            if (p.haloMat) p.haloMat.opacity = fade * 0.3;
            p.orb.position.set(
              sx + (ex - sx) * p.progress,
              sy + (ey - sy) * p.progress,
              sz + (ez - sz) * p.progress,
            );
          }
        }
      }

      const mouse = new THREE.Vector2();
      window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      });

      function animate(t) {
        animId = requestAnimationFrame(animate);
        
        // Dynamically update opacities based on spawn progress
        if (material) {
          material.opacity = (isDark ? 0.9 : 0.55) * animStateRef.current.progress;
        }
        if (lineMaterial) {
          lineMaterial.opacity = (isDark ? 0.4 : 0.12) * Math.min(1, animStateRef.current.progress * 1.5);
        }

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
        updateLightning(t);
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
        activePulses.forEach(p => {
          scene.remove(p.orb);
          p.orb.material.dispose();
          if (p.haloMat) p.haloMat.dispose();
        });
        activePulses.length = 0;
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
    <section className="hero" id="hero" ref={sectionRef}>
      {/* Three.js canvas */}
      <div className="hero__canvas" ref={canvasRef} />

      <div className="hero__inner container">
        {/* Left content column */}
        <div className="hero__content">

          <span>  </span>
          {/* Stacked title blocks */}
          <h1 className="hero__title">
            <span className="hero__title-line hero__title-line--label">HELLO, I AM</span>
            <span className="hero__title-line hero__title-line--block">YASHAAS M.</span>
            <span className="hero__title-line hero__title-line--outline">ENGINEER</span>
            <span className="hero__title-line hero__title-line--accent">&amp; AI BUILDER.</span>
          </h1>

          {/* Manifesto block */}
          <div className="hero__manifesto">
            <p className="hero__manifesto-text">
              I build intelligent backend systems &amp; multi-agent AI pipelines —
              turning complex engineering problems into scalable, production-ready solutions.
            </p>
          </div>
        </div>

      </div>

      {/* Scroll cue */}
      <div className="hero__scroll">
        <span className="hero__scroll-text">SCROLL</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}

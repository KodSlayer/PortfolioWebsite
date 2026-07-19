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

      // Particle network — brutalist free-floating blocks
      const particleLayers = [
        { count: 600, size: 0.06 },
        { count: 200, size: 0.15 },
        { count: 50, size: 0.3 }
      ];

      const c1 = new THREE.Color(isDark ? 0x4cd6ff : 0x0066ff);
      const c2 = new THREE.Color(isDark ? 0x001f28 : 0xb7eaff);

      const pointClouds = [];

      particleLayers.forEach(layer => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(layer.count * 3);
        const colors = new Float32Array(layer.count * 3);

        for (let i = 0; i < layer.count; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 40;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

          const mix = Math.random();
          colors[i * 3] = THREE.MathUtils.lerp(c1.r, c2.r, mix);
          colors[i * 3 + 1] = THREE.MathUtils.lerp(c1.g, c2.g, mix);
          colors[i * 3 + 2] = THREE.MathUtils.lerp(c1.b, c2.b, mix);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
          size: layer.size,
          vertexColors: true,
          transparent: true,
          opacity: isDark ? 0.7 : 0.6,
          sizeAttenuation: true,
          blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);
        pointClouds.push(points);
      });
      sceneRef.current.pointClouds = pointClouds;

      const mouse = new THREE.Vector2();

      const handleMouseMove = (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };

      const handleDeviceOrientation = (e) => {
        if (e.gamma !== null && e.beta !== null) {
          let x = e.gamma / 45;
          let y = (e.beta - 45) / 45;
          mouse.x = Math.max(-1, Math.min(1, x));
          mouse.y = -Math.max(-1, Math.min(1, y));
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('deviceorientation', handleDeviceOrientation);

      function animate(t) {
        animId = requestAnimationFrame(animate);

        pointClouds.forEach((points, index) => {
          // Dynamically update opacities based on spawn progress
          if (points.material) {
            points.material.opacity = (isDark ? 0.7 : 0.6) * animStateRef.current.progress;
          }

          // Different rotation speeds for parallax depth
          points.rotation.y += 0.0003 + (index * 0.0001);
          points.rotation.x += 0.0001 + (index * 0.00005);

          const pos = points.geometry.attributes.position.array;
          for (let i = 0; i < pos.length / 3; i++) {
            // Gentle floating up and down
            pos[i * 3 + 1] += Math.sin(t * 0.001 + pos[i * 3]) * 0.001 * (index + 1);
          }
          points.geometry.attributes.position.needsUpdate = true;
        });

        camera.position.x += (mouse.x * 2 - camera.position.x) * 0.04;
        camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);

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
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('deviceorientation', handleDeviceOrientation);

        pointClouds.forEach(points => {
          scene.remove(points);
          points.geometry.dispose();
          points.material.dispose();
        });

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
            <span className="hero__title-line hero__title-line--blue-block">YASHAAS M</span>
            <span className="hero__title-line hero__title-line--outline">ENGINEER &amp;</span>
            <span className="hero__title-line hero__title-line--blue-text">AI BUILDER.</span>
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

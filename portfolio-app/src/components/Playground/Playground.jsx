import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Reveal from '../Reveal/Reveal';
import './Playground.css';

export default function Playground() {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  const logRef = useRef(null);
  const sceneRef = useRef({});

  function addLog(msg) {
    if (logRef.current) {
      const line = document.createElement('div');
      line.className = 'playground__log-line';
      line.innerHTML = `<span class="playground__log-accent">[SYS]:</span> ${msg}`;
      logRef.current.appendChild(line);
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    let animId;

    import('three').then((THREE) => {
      const container = canvasRef.current;
      if (!container) return;

      const w = container.clientWidth;
      const h = container.clientHeight;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(isDark ? 0x060810 : 0xf2f4f6);

      const camera = new THREE.PerspectiveCamera(70, w / h, 0.1, 500);
      camera.position.set(0, 7, 12);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);
      sceneRef.current.renderer = renderer;

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, isDark ? 0.5 : 0.8));
      const pLight = new THREE.PointLight(0x0066FF, 2.5);
      pLight.position.set(5, 8, 5);
      scene.add(pLight);
      const pLight2 = new THREE.PointLight(0x00FFFF, 1.5);
      pLight2.position.set(-5, 4, -5);
      scene.add(pLight2);

      // Floor
      const floorGeo = new THREE.PlaneGeometry(30, 30);
      const floorMat = new THREE.MeshPhongMaterial({
        color: isDark ? 0x0a0c14 : 0xf0f2f6,
        transparent: true,
        opacity: 0.9,
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      // Grid
      const grid = new THREE.GridHelper(30, 30, 0x0066FF, isDark ? 0x1a2040 : 0xd0d4e8);
      grid.position.y = 0.01;
      scene.add(grid);

      const objects = [];
      const geometryPool = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.6, 32, 32),
        new THREE.CylinderGeometry(0.5, 0.5, 1.2, 32),
        new THREE.TetrahedronGeometry(0.8),
        new THREE.OctahedronGeometry(0.7),
        new THREE.TorusGeometry(0.5, 0.2, 16, 32),
      ];
      const colorPool = [0x0066FF, 0x00D1FF, 0xBF00FF, 0xFF0066, 0x00FF88, 0xFFAA00];

      function spawnShape(x, z) {
        const geo = geometryPool[Math.floor(Math.random() * geometryPool.length)];
        const color = colorPool[Math.floor(Math.random() * colorPool.length)];
        const mat = new THREE.MeshPhongMaterial({
          color,
          emissive: new THREE.Color(color).multiplyScalar(0.15),
          shininess: 80,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 10 + Math.random() * 5, z);
        mesh.castShadow = true;
        scene.add(mesh);
        objects.push({
          mesh,
          vel: new THREE.Vector3(
            (Math.random() - 0.5) * 0.05,
            0,
            (Math.random() - 0.5) * 0.05
          ),
          gravity: -0.018,
          bounce: 0.5 + Math.random() * 0.2,
          rotVel: new THREE.Vector3(
            (Math.random() - 0.5) * 0.04,
            (Math.random() - 0.5) * 0.04,
            (Math.random() - 0.5) * 0.04
          ),
        });
        addLog(`Shape spawned at (${x.toFixed(1)}, ${z.toFixed(1)}) — ${['BOX','SPHERE','CYLINDER','TETRA','OCTA','TORUS'][geometryPool.indexOf(geo) % 6]}`);
      }

      // Raycaster for click
      const raycaster = new THREE.Raycaster();
      const mouse2d = new THREE.Vector2();
      function onMouseDown(e) {
        const rect = container.getBoundingClientRect();
        mouse2d.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse2d.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse2d, camera);
        const hits = raycaster.intersectObject(floor);
        if (hits.length > 0) {
          spawnShape(hits[0].point.x, hits[0].point.z);
        }
      }
      container.addEventListener('mousedown', onMouseDown);

      // WASD vehicle
      const vehicleGroup = new THREE.Group();
      const bodyMat = new THREE.MeshPhongMaterial({ color: isDark ? 0x191c1e : 0x1e2030, shininess: 100 });
      const cockpitMat = new THREE.MeshPhongMaterial({ color: 0x0066FF, shininess: 200 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 2.4), bodyMat);
      const cockpit = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.9), cockpitMat);
      cockpit.position.y = 0.45;
      cockpit.position.z = -0.2;
      vehicleGroup.add(body, cockpit);
      vehicleGroup.position.y = 0.5;
      scene.add(vehicleGroup);

      const state = {
        pos: new THREE.Vector3(0, 0.5, 0),
        vel: new THREE.Vector3(),
        rot: 0,
        keys: {},
      };
      const keyDown = (e) => (state.keys[e.code] = true);
      const keyUp = (e) => (state.keys[e.code] = false);
      window.addEventListener('keydown', keyDown);
      window.addEventListener('keyup', keyUp);

      addLog('WebGL Engine loaded. Physics simulation active.');
      addLog('Click on floor to spawn shapes. WASD to drive.');

      function animate() {
        animId = requestAnimationFrame(animate);

        // Physics objects
        objects.forEach(obj => {
          obj.vel.y += obj.gravity;
          obj.mesh.position.add(obj.vel);
          const half = 0.5;
          if (obj.mesh.position.y < half) {
            obj.mesh.position.y = half;
            obj.vel.y *= -obj.bounce;
            obj.vel.x *= 0.92;
            obj.vel.z *= 0.92;
          }
          obj.mesh.rotation.x += obj.rotVel.x;
          obj.mesh.rotation.y += obj.rotVel.y;
        });

        // Vehicle
        const speed = state.keys['ShiftLeft'] || state.keys['ShiftRight'] ? 0.18 : 0.1;
        if (state.keys['KeyW'] || state.keys['ArrowUp']) {
          state.vel.z -= Math.cos(state.rot) * speed;
          state.vel.x -= Math.sin(state.rot) * speed;
        }
        if (state.keys['KeyS'] || state.keys['ArrowDown']) {
          state.vel.z += Math.cos(state.rot) * speed;
          state.vel.x += Math.sin(state.rot) * speed;
        }
        if (state.keys['KeyA'] || state.keys['ArrowLeft']) state.rot += 0.045;
        if (state.keys['KeyD'] || state.keys['ArrowRight']) state.rot -= 0.045;

        state.pos.add(state.vel);
        state.vel.multiplyScalar(0.88);
        vehicleGroup.position.copy(state.pos);
        vehicleGroup.rotation.y = state.rot;

        const camOff = new THREE.Vector3(
          Math.sin(state.rot) * 14,
          8,
          Math.cos(state.rot) * 14
        );
        camera.position.lerp(state.pos.clone().add(camOff), 0.08);
        camera.lookAt(state.pos);

        renderer.render(scene, camera);
      }
      animate();

      const handleResize = () => {
        const w2 = container.clientWidth;
        const h2 = container.clientHeight;
        camera.aspect = w2 / h2;
        camera.updateProjectionMatrix();
        renderer.setSize(w2, h2);
      };
      window.addEventListener('resize', handleResize);

      sceneRef.current.cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', keyDown);
        window.removeEventListener('keyup', keyUp);
        container.removeEventListener('mousedown', onMouseDown);
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };
    });

    return () => sceneRef.current.cleanup?.();
  }, [isDark]);

  return (
    <section className="playground" id="playground">
      <Reveal direction="up" threshold={0.05}>
        <div className="container">
          {/* Header */}
          <div className="playground__header">
            <div className="playground__header-tag glass-panel">
              <span className="text-label-sm playground__header-label">03 // PLAYGROUND</span>
              <h2 className="text-display-md playground__header-title">
                THE<br /><span style={{ color: 'var(--primary-container)' }}>PLAYGROUND</span>
              </h2>
            </div>
            <p className="text-body-md playground__header-desc">
              My digital garden. Test physics engines, shader logic, and generative kernels.
              <br />
              <strong>WASD</strong> to drive · <strong>Click</strong> to spawn shapes · <strong>Shift</strong> for turbo
            </p>
          </div>

          {/* Terminal */}
          <div className="playground__terminal">
            {/* Terminal chrome */}
            <div className="playground__terminal-chrome">
              <div className="playground__dots">
                <div className="playground__dot playground__dot--red" />
                <div className="playground__dot playground__dot--yellow" />
                <div className="playground__dot playground__dot--green" />
              </div>
              <span className="text-label-sm playground__terminal-title">
                yashaas@portfolio:~/playground
              </span>
              <div className="playground__terminal-status">
                <span className="playground__terminal-dot" />
                <span className="text-label-sm">ENGINE_ACTIVE</span>
              </div>
            </div>

            {/* Canvas */}
            <div className="playground__canvas-wrap">
              <div className="playground__canvas" ref={canvasRef} />

              {/* Log overlay */}
              <div className="playground__log" ref={logRef}>
                <div className="playground__log-header text-label-sm">
                  [SYSTEM_LOG]
                </div>
              </div>

              {/* Controls overlay */}
              <div className="playground__controls-hint">
                <span className="playground__key text-label-sm">W/A/S/D</span>
                <span className="text-label-sm playground__controls-sep">MOVE</span>
                <span className="playground__key text-label-sm">CLICK</span>
                <span className="text-label-sm playground__controls-sep">SPAWN</span>
                <span className="playground__key text-label-sm">SHIFT</span>
                <span className="text-label-sm playground__controls-sep">TURBO</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

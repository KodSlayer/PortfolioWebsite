import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Reveal from '../Reveal/Reveal';
import './Playground.css';

const SVGS = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>'
];
const ICON_NAMES = ['INSTAGRAM', 'FACEBOOK', 'TWITTER', 'WHATSAPP'];

const HACKER_CODE = `
// INITIALIZING BOOT SEQUENCE...
function bypassMainframe(targetId) {
    const node = cluster.find(n => n.id === targetId);
    if (!node.hasVulnerability()) {
        forceBrute(node.ports[22]);
    }
    return node.decrypt();
}

class QuantumEngine {
    constructor() {
        this.state = 'UNSTABLE';
        this.entropy = 0.99;
    }
    stabilize() {
        while(this.entropy > 0.01) {
            sys.applyDamping(0.1);
        }
    }
}
// SYSTEM OVERRIDE ACCEPTED
`.repeat(20);

const KERNELS = [
  { id: 'snake', label: 'SNAKE' },
  { id: 'hacker', label: 'HACKER' },
];

export default function Playground() {
  const { isDark } = useTheme();
  const [activeKernel, setActiveKernel] = useState('snake');
  const canvasRef = useRef(null);
  const logRef = useRef(null);

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
    addLog(`KERNEL SWITCHED TO [${activeKernel.toUpperCase()}]`);
  }, [activeKernel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let isActive = true;
    
    const resize = () => {
      const wrap = canvas.parentElement;
      canvas.width = wrap.clientWidth;
      canvas.height = wrap.clientHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const listeners = [];
    const addListener = (element, event, handler) => {
      element.addEventListener(event, handler);
      listeners.push({ element, event, handler });
    };

    let lastTime = 0;

    // ----- KERNEL: SNAKE -----
    if (activeKernel === 'snake') {
      const images = SVGS.map(svg => {
        const img = new Image();
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        return img;
      });

      const gridSize = 20;
      let snake = [{ x: 10, y: 10 }];
      let dir = { x: 0, y: 0 };
      let food = { x: 5, y: 5, iconIndex: Math.floor(Math.random() * 4) };
      let score = 1;

      const handleKeyDown = (e) => {
        // Prevent default scrolling only if the game is active
        if (dir.x !== 0 || dir.y !== 0) {
          if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].indexOf(e.code) > -1) {
              e.preventDefault();
          }
        }
  
        switch (e.key.toLowerCase()) {
          case 'w':
          case 'arrowup':
            if (dir.y === 0) dir = { x: 0, y: -1 };
            break;
          case 's':
          case 'arrowdown':
            if (dir.y === 0) dir = { x: 0, y: 1 };
            break;
          case 'a':
          case 'arrowleft':
            if (dir.x === 0) dir = { x: -1, y: 0 };
            break;
          case 'd':
          case 'arrowright':
            if (dir.x === 0) dir = { x: 1, y: 0 };
            break;
        }
      };
      addListener(window, 'keydown', handleKeyDown);

      const resetGame = () => {
        // Limit snake to the left side (avoiding the system log on the right)
        // System log is 280px + 16px right margin = ~300px
        const safeWidth = Math.max(canvas.width - 320, 200); 
        const maxCol = Math.floor(safeWidth / gridSize);
        const maxRow = Math.floor(canvas.height / gridSize);
        
        snake = [{ 
          x: Math.floor(Math.random() * (maxCol - 4)) + 2, 
          y: Math.floor(Math.random() * (maxRow - 4)) + 2 
        }];
        dir = { x: 0, y: 0 };
        score = 1;
        addLog('Collision detected. Rebooting...');
      };

      const spawnFood = () => {
        const safeWidth = Math.max(canvas.width - 320, 200); 
        const maxCol = Math.floor(safeWidth / gridSize);
        const maxRow = Math.floor(canvas.height / gridSize);
        if (maxCol <= 0 || maxRow <= 0) return;
        food = {
          x: Math.floor(Math.random() * maxCol),
          y: Math.floor(Math.random() * maxRow),
          iconIndex: Math.floor(Math.random() * images.length)
        };
      };
      spawnFood();

      const update = () => {
        if (dir.x === 0 && dir.y === 0) return; // Waiting to start
  
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        
        // Boundaries (preventing it from going under the log on the right)
        const safeWidth = Math.max(canvas.width - 320, 200); 
        const maxCol = Math.floor(safeWidth / gridSize);
        const maxRow = Math.floor(canvas.height / gridSize);
  
        // Wall collision
        if (head.x < 0 || head.x >= maxCol || head.y < 0 || head.y >= maxRow) {
          resetGame();
          return;
        }
  
        // Self collision
        for (let i = 0; i < snake.length; i++) {
          if (snake[i].x === head.x && snake[i].y === head.y) {
            resetGame();
            return;
          }
        }
  
        snake.unshift(head);
  
        // Food collision
        if (head.x === food.x && head.y === food.y) {
          score++;
          addLog(`Consumed ${ICON_NAMES[food.iconIndex]}. Length: ${score}`);
          spawnFood();
        } else {
          snake.pop();
        }
      };

      const draw = () => {
        // Clear background
        ctx.fillStyle = isDark ? '#060810' : '#f2f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
  
        // Grid lines (draw over entire canvas for aesthetic)
        ctx.strokeStyle = isDark ? '#1a2040' : '#d0d4e8';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += gridSize) {
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += gridSize) {
          ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        // Draw boundary line showing the safe area
        const safeWidth = Math.max(canvas.width - 320, 200);
        const safeBoundary = Math.floor(safeWidth / gridSize) * gridSize;
        ctx.strokeStyle = 'rgba(255, 0, 102, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(safeBoundary, 0);
        ctx.lineTo(safeBoundary, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
  
        // Draw Food (Icon)
        const fX = food.x * gridSize;
        const fY = food.y * gridSize;
        const img = images[food.iconIndex];
        
        // Draw a highly visible box behind the icon
        ctx.fillStyle = '#0066FF';
        ctx.fillRect(fX, fY, gridSize, gridSize);
        if (img.complete && img.naturalHeight !== 0) {
          ctx.drawImage(img, fX + 2, fY + 2, gridSize - 4, gridSize - 4);
        }
  
        // Draw Snake segments
        ctx.fillStyle = isDark ? '#ffffff' : '#000000';
        for (let i = 0; i < snake.length; i++) {
          const seg = snake[i];
          // Shrink segments slightly for a brutalist block effect
          ctx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2);
        }
      };

      const loop = (timestamp) => {
        if (!isActive) return;
        if (timestamp - lastTime >= 80) { // Approx 12.5 FPS for a retro snake feel
          update();
          draw();
          lastTime = timestamp;
        }
        animationFrameId = requestAnimationFrame(loop);
      };
      loop(0);
    }

    // ----- KERNEL: HACKER -----
    else if (activeKernel === 'hacker') {
      let typedIndex = 0;
      addLog('Awaiting keyboard input to compile code.');
      
      const draw = () => {
        ctx.fillStyle = isDark ? '#060810' : '#f2f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = '14px monospace';
        ctx.fillStyle = '#00ff00';
        ctx.textBaseline = 'top';

        const text = HACKER_CODE.substring(0, typedIndex);
        const lines = text.split('\n');
        
        let y = 20;
        // Keep scrolling up if it goes beyond canvas height
        const lineHeight = 20;
        if (lines.length * lineHeight > canvas.height - 40) {
            y = canvas.height - 40 - (lines.length * lineHeight);
        }

        lines.forEach(line => {
          ctx.fillText(line, 20, y);
          y += lineHeight;
        });
      };

      draw();

      addListener(window, 'keydown', (e) => {
        // Exclude system keys like F5, F12 etc so users can refresh
        if (e.key.startsWith('F') || e.ctrlKey || e.altKey || e.metaKey) return;
        e.preventDefault();
        
        typedIndex += Math.floor(Math.random() * 10) + 5;
        if (typedIndex >= HACKER_CODE.length) typedIndex = 0;
        
        if (typedIndex % 200 < 15) {
          addLog(`Compiling block 0x${Math.floor(Math.random()*9999).toString(16)}...`);
        }
        draw();
      });
    }

    return () => {
      isActive = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      listeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
    };
  }, [activeKernel, isDark]);

  return (
    <section className="playground" id="playground">
      <Reveal direction="wipe-down" threshold={0.05}>
        <div className="container">
          <div className="playground__grid">
            {/* Header */}
            <div className="playground__header">
              <div className="playground__header-tag">
                <span className="text-label-sm playground__header-label">03 // PLAYGROUND</span>
                <h2 className="text-display-md playground__header-title">
                  THE<br /><span style={{ color: 'var(--primary-container)' }}>PLAY<br />GROUND</span>
                </h2>
              </div>
              <p className="text-body-md playground__header-desc">
                My digital garden. Select a kernel below to run a technical simulation.
              </p>
            </div>

            {/* Terminal */}
            <div className="playground__terminal">
              
              {/* Kernel Switcher Chrome */}
              <div className="playground__terminal-chrome">
                <div className="playground__dots">
                  <div className="playground__dot playground__dot--red" />
                  <div className="playground__dot playground__dot--yellow" />
                  <div className="playground__dot playground__dot--green" />
                </div>
                
                <div className="playground__kernel-tabs">
                  {KERNELS.map(k => (
                    <button
                      key={k.id}
                      className={`playground__tab ${activeKernel === k.id ? 'active' : ''}`}
                      onClick={() => setActiveKernel(k.id)}
                    >
                      {k.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Canvas Wrap */}
              <div className="playground__canvas-wrap">
                <canvas ref={canvasRef} className="playground__canvas" />

                {/* Log overlay */}
                <div className="playground__log" ref={logRef}>
                  <div className="playground__log-header text-label-sm">
                    [SYSTEM_LOG]
                  </div>
                </div>

                {/* Controls overlay */}
                <div className="playground__controls-hint">
                  {activeKernel === 'snake' && <><span className="playground__key text-label-sm">W/A/S/D</span><span className="text-label-sm playground__controls-sep">PLAY</span></>}
                  {activeKernel === 'hacker' && <><span className="playground__key text-label-sm">KEYBOARD</span><span className="text-label-sm playground__controls-sep">HACK</span></>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

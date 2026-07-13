import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Cursor.css';

export default function Cursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e) => {
      const target = e.target;
      // Trigger magnetic effect/enlargement on buttons and links
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      <motion.div
        className="custom-cursor-dot"
        animate={{
          x: mousePosition.x - 4, // center dot (8px / 2)
          y: mousePosition.y - 4,
          scale: isHovered ? 0 : 1, // hide dot when hovered
        }}
        transition={{ type: 'tween', ease: 'linear', duration: 0 }}
      />
      <motion.div
        className="custom-cursor-ring"
        animate={{
          x: mousePosition.x - 16, // center ring (32px / 2)
          y: mousePosition.y - 16,
          scale: isHovered ? 1.5 : 1, // enlarge ring on hover
          backgroundColor: isHovered ? 'rgba(var(--primary-container-rgb), 0.1)' : 'transparent',
          borderColor: isHovered ? 'transparent' : 'var(--on-surface)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 0.5 }}
      />
    </>
  );
}

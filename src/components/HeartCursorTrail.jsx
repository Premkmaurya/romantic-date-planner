import React, { useEffect, useState, useRef } from 'react';

export const HeartCursorTrail = () => {
  const [hearts, setHearts] = useState([]);
  const lastPosition = useRef({ x: 0, y: 0 });
  const idCounter = useRef(0);

  useEffect(() => {
    // Only run on desktop devices (pointer: fine)
    const isDesktop = window.matchMedia('(pointer: fine)').matches;
    if (!isDesktop) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const dx = clientX - lastPosition.current.x;
      const dy = clientY - lastPosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Spawn a heart every 35 pixels of cursor travel
      if (distance > 35) {
        const icons = ['❤️', '💖', '💕', '✨', '🌸'];
        const icon = icons[Math.floor(Math.random() * icons.length)];
        const size = Math.random() * 8 + 10; // 10px to 18px
        const angle = Math.random() * 360;

        const newHeart = {
          id: idCounter.current++,
          x: clientX,
          y: clientY,
          size,
          icon,
          angle,
        };

        setHearts((prev) => [...prev.slice(-15), newHeart]); // Keep max 15 hearts in state
        lastPosition.current = { x: clientX, y: clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Remove heart after animation finishes (1000ms)
  useEffect(() => {
    if (hearts.length === 0) return;
    const timer = setTimeout(() => {
      setHearts((prev) => prev.slice(1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [hearts]);

  return (
    <>
      {hearts.map((h) => (
        <span
          key={h.id}
          className="cursor-heart select-none pointer-events-none"
          style={{
            left: `${h.x}px`,
            top: `${h.y}px`,
            fontSize: `${h.size}px`,
            transform: `translate(-50%, -50%) rotate(${h.angle}deg)`,
          }}
        >
          {h.icon}
        </span>
      ))}
    </>
  );
};
export default HeartCursorTrail;

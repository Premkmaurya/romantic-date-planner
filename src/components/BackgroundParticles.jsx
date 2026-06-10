import React, { useEffect, useState } from 'react';

export const BackgroundParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate a set of static random particle configs
    const newParticles = Array.from({ length: 22 }).map((_, i) => {
      const size = Math.random() * 20 + 10; // 10px to 30px
      const left = Math.random() * 100; // 0% to 100%
      const duration = Math.random() * 10 + 10; // 10s to 20s
      const delay = Math.random() * -15; // negative delay so they start pre-filled across screen height
      const opacity = Math.random() * 0.4 + 0.15; // 0.15 to 0.55 opacity
      
      // select heart shapes or star shapes
      const icons = ['❤️', '💖', '💝', '💕', '💗', '🌸'];
      const icon = icons[Math.floor(Math.random() * icons.length)];

      return {
        id: i,
        size,
        left,
        duration,
        delay,
        opacity,
        icon
      };
    });
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <span
          key={p.id}
          className="floating-heart-particle select-none filter drop-shadow-[0_2px_5px_rgba(244,63,94,0.15)]"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        >
          {p.icon}
        </span>
      ))}
    </div>
  );
};
export default BackgroundParticles;

import React, { useEffect, useState } from 'react';

interface InteractiveBackgroundProps {
    isLightMode: boolean;
}

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ isLightMode }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const rotateX = mousePos.y * 8; 
  const rotateY = mousePos.x * -8;
  const translateX = mousePos.x * -20;
  const translateY = mousePos.y * -20;

  return (
    <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center transition-colors duration-1000 ${isLightMode ? 'bg-slate-50' : 'bg-slate-950'}`}>
      {/* 3D Container */}
      <div 
        className="relative w-[150vmax] h-[150vmax] transition-transform duration-100 ease-out will-change-transform flex items-center justify-center"
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(${translateX}px) translateY(${translateY}px) scale(1.2)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Layer 1: Hex Grid Base */}
        <div className={`absolute inset-0 ${isLightMode ? 'bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_60%)]' : 'bg-[radial-gradient(circle_at_center,rgba(22,78,99,0.2)_0%,transparent_60%)]'}`}></div>
        <div 
            className="absolute inset-0"
            style={{
                backgroundImage: isLightMode 
                    ? `linear-gradient(rgba(30,41,59,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.1) 1px, transparent 1px)`
                    : `linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)`,
                backgroundSize: '120px 120px',
                maskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
                opacity: isLightMode ? 0.6 : 0.1
            }}
        ></div>

        {/* Layer 2: Massive Outer Gear (Slow Spin) */}
        <div className={`absolute w-[90%] h-[90%] rounded-full border animate-[spin_180s_linear_infinite] ${isLightMode ? 'border-slate-300/30' : 'border-cyan-900/10'}`}>
             {/* Large "Teeth" */}
             {Array.from({ length: 12 }).map((_, i) => (
                <div 
                    key={i} 
                    className={`absolute top-0 left-1/2 w-20 h-8 -translate-x-1/2 -translate-y-1/2 ${isLightMode ? 'bg-slate-300/20' : 'bg-cyan-900/20'}`}
                    style={{ transform: `rotate(${i * 30}deg) translateY(0) translateZ(0)`, transformOrigin: 'center 45vmax' }}
                ></div>
             ))}
        </div>

        {/* Layer 3: Middle Tech Ring (Reverse Spin) */}
        <div className={`absolute w-[60%] h-[60%] rounded-full border border-dashed animate-[spin_100s_linear_infinite_reverse] ${isLightMode ? 'border-slate-400/20' : 'border-cyan-800/20'}`}>
             <div className={`absolute inset-[-4px] border-[8px] border-dotted rounded-full ${isLightMode ? 'border-slate-300/20' : 'border-cyan-900/10'}`}></div>
        </div>

        {/* Layer 4: Segmented Robotic Ring */}
        <div className="absolute w-[45%] h-[45%] rounded-full animate-[spin_60s_linear_infinite]">
             <svg viewBox="0 0 100 100" className={`w-full h-full fill-none stroke-[0.2] ${isLightMode ? 'stroke-slate-400 opacity-30' : 'stroke-cyan-500 opacity-20'}`}>
                <circle cx="50" cy="50" r="49" strokeDasharray="10 5" />
                <path d="M50 0 L50 10 M50 90 L50 100 M0 50 L10 50 M90 50 L100 50" strokeWidth="0.5" />
             </svg>
        </div>

        {/* Layer 5: Dynamic Crosshairs & HUD Lines */}
        <div className="absolute inset-0 z-0">
             {/* Diagonal Lines */}
             <div className={`absolute top-1/2 left-1/2 w-[200%] h-[1px] -translate-x-1/2 -translate-y-1/2 rotate-45 ${isLightMode ? 'bg-slate-300/30' : 'bg-cyan-900/20'}`}></div>
             <div className={`absolute top-1/2 left-1/2 w-[200%] h-[1px] -translate-x-1/2 -translate-y-1/2 -rotate-45 ${isLightMode ? 'bg-slate-300/30' : 'bg-cyan-900/20'}`}></div>
             
             {/* Horizon Line */}
             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
        </div>

      </div>
    </div>
  );
};

export default InteractiveBackground;
import React, { useEffect, useRef } from 'react';

interface ArcReactorProps {
  analyser: AnalyserNode | null;
  active: boolean;
  isLightMode: boolean;
}

const ArcReactor: React.FC<ArcReactorProps> = ({ analyser, active, isLightMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const dataArray = new Uint8Array(analyser ? analyser.frequencyBinCount : 0);

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Only draw dynamic audio bars if we have the context
      if (active && analyser) {
        analyser.getByteFrequencyData(dataArray);
      }

      // Audio reactive bars - Outer Ring
      const bars = 180;
      const radius = 180; 
      const step = (Math.PI * 2) / bars;

      for (let i = 0; i < bars; i++) {
        const value = active && dataArray.length > 0 ? dataArray[i % dataArray.length] : 5;
        // Scale the bar height
        const barHeight = Math.max(2, (value / 255) * 100); 
        
        const angle = i * step;
        
        // Start from outside the core
        const startRadius = radius + 60; 
        const endRadius = startRadius + barHeight;

        const x1 = centerX + Math.cos(angle) * startRadius;
        const y1 = centerY + Math.sin(angle) * startRadius;
        const x2 = centerX + Math.cos(angle) * endRadius;
        const y2 = centerY + Math.sin(angle) * endRadius;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        
        // Dynamic color based on intensity
        const intensity = value / 255;
        // Dark Mode: Cyan (180) to Blue. Light Mode: Darker Blue/Cyan for visibility
        const hue = 180 + (intensity * 40); 
        const saturation = isLightMode ? '80%' : '100%';
        const lightness = isLightMode ? '40%' : '50%';
        const alpha = isLightMode ? 0.2 + (intensity * 0.8) : 0.1 + (intensity * 0.8);
        
        ctx.strokeStyle = `hsla(${hue}, ${saturation}, ${lightness}, ${alpha})`; 
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [analyser, active, isLightMode]);

  return (
    <div className="relative flex items-center justify-center w-full h-full">
        
        {/* --- CSS GENERATED REACTOR CORE --- */}
        <div className={`relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center transition-all duration-700 ${active ? 'scale-105' : 'scale-100 opacity-80'} ${isLightMode ? '' : 'drop-shadow-[0_0_50px_rgba(6,182,212,0.6)]'}`}>
            
            {/* Layer 1: Outermost Dashed Ring (Slow Spin) */}
            <div className={`absolute inset-0 rounded-full border border-dashed animate-[spin_30s_linear_infinite] ${isLightMode ? 'border-slate-400/30' : 'border-cyan-500/30'}`}></div>
            
            {/* Layer 2: Tech Segments (Reverse Spin) */}
            <div className={`absolute inset-2 rounded-full border-[10px] border-transparent rotate-45 animate-[spin_20s_linear_infinite_reverse] ${isLightMode ? 'border-t-slate-300 border-b-slate-300' : 'border-t-cyan-900/40 border-b-cyan-900/40'}`}></div>
            
            {/* Layer 3: Glowing Ring (Pulse) */}
            <div className={`absolute inset-6 rounded-full border-2 shadow-[0_0_15px_rgba(6,182,212,0.2)] ${isLightMode ? 'border-cyan-600/30' : 'border-cyan-400/20'} ${active ? 'animate-pulse' : ''}`}></div>
            
            {/* Layer 4: Mechanical Inner Ring (Medium Spin) */}
            <div className={`absolute inset-8 rounded-full border-4 animate-[spin_3s_linear_infinite] ${isLightMode ? 'border-slate-200 border-l-cyan-600 border-r-cyan-600' : 'border-slate-900 border-l-cyan-500 border-r-cyan-500'}`}></div>
            
            {/* Layer 5: Inner Detail Ring (Reverse Fast) */}
            <div className={`absolute inset-12 rounded-full border-2 border-dashed animate-[spin_8s_linear_infinite_reverse] ${isLightMode ? 'border-cyan-600/30' : 'border-cyan-300/40'}`}></div>

            {/* Layer 6: Center Core Background */}
            <div className={`absolute inset-16 rounded-full flex items-center justify-center border ${isLightMode ? 'bg-white border-cyan-200 shadow-inner' : 'bg-slate-950 border-cyan-500/50 box-shadow-[inset_0_0_20px_rgba(6,182,212,0.5)]'}`}>
               
               {/* Center Energy Source */}
               <div className={`w-20 h-20 rounded-full bg-gradient-to-tr opacity-80 blur-md transition-all duration-200 ${isLightMode ? 'from-cyan-400 to-blue-300' : 'from-cyan-600 to-blue-400'} ${active ? 'scale-110 opacity-100 animate-pulse' : 'scale-100 opacity-60'}`}></div>
               
               {/* Center Hard Core */}
               <div className={`absolute w-16 h-16 rounded-full border flex items-center justify-center z-10 ${isLightMode ? 'bg-slate-100 border-cyan-600' : 'bg-slate-900 border-cyan-400'}`}>
                  <div className={`w-8 h-8 rounded-full transition-all ${isLightMode ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-cyan-400 shadow-[0_0_15px_cyan]'} ${active ? 'opacity-100 animate-ping' : 'opacity-20'}`}></div>
               </div>
            </div>

            {/* Decorative Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-full h-[1px] ${isLightMode ? 'bg-slate-400/20' : 'bg-cyan-500/10'}`}></div>
                <div className={`h-full w-[1px] absolute ${isLightMode ? 'bg-slate-400/20' : 'bg-cyan-500/10'}`}></div>
            </div>
        </div>

        {/* The Audio Visualizer Canvas (Behind the core) */}
        <canvas 
            ref={canvasRef} 
            width={800} 
            height={800} 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[140%] h-[140%] z-0 opacity-60"
        />

        {/* Status Indicator Overlay - Adjusted Position (Lowered to -45px) */}
        <div className={`absolute bottom-[-45px] whitespace-nowrap font-mono text-xs tracking-[0.3em] px-4 py-1 rounded border backdrop-blur-sm shadow-md z-20 ${isLightMode ? 'bg-white/80 border-slate-300 text-slate-600' : 'bg-black/60 border-cyan-900/50 text-cyan-400'}`}>
            {active ? 'SYSTEM ENGAGED' : 'AWAITING INPUT'}
        </div>
    </div>
  );
};

export default ArcReactor;
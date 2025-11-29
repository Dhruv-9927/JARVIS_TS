import React from 'react';

interface InfoPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  side?: 'left' | 'right';
  isLightMode: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ title, children, className = '', side = 'left', isLightMode }) => {
  return (
    <div className={`
      relative overflow-hidden transition-all duration-300 p-4 border
      ${isLightMode 
        ? 'bg-white/80 border-cyan-500/30 shadow-lg text-slate-800 backdrop-blur-md hover:bg-white/90' 
        : 'bg-slate-950/70 border-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] text-cyan-100 backdrop-blur-md hover:bg-slate-900/80'}
      ${className}
    `}>
        {/* Animated Corner Accents */}
        <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${isLightMode ? 'border-cyan-600' : 'border-cyan-400/50'}`}></div>
        <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${isLightMode ? 'border-cyan-600' : 'border-cyan-400/50'}`}></div>
        <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${isLightMode ? 'border-cyan-600' : 'border-cyan-400/50'}`}></div>
        <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${isLightMode ? 'border-cyan-600' : 'border-cyan-400/50'}`}></div>
        
        {/* Scanline effect */}
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-[5px] w-full animate-[float_4s_linear_infinite] pointer-events-none ${isLightMode ? 'opacity-10' : 'opacity-30'}`}></div>

        {/* Title Bar */}
        <div className={`flex items-center gap-3 mb-4 border-b pb-2 ${isLightMode ? 'border-cyan-900/10' : 'border-cyan-800/40'}`}>
            <div className={`h-1.5 w-1.5 bg-cyan-400 shadow-[0_0_5px_cyan] rounded-full ${side === 'right' ? 'order-last' : ''}`}></div>
            <h3 className={`font-mono text-sm font-bold uppercase tracking-widest flex-grow text-center ${isLightMode ? 'text-cyan-700' : 'text-cyan-400 text-shadow-glow'}`}>{title}</h3>
            <div className={`h-1.5 w-1.5 bg-cyan-400 shadow-[0_0_5px_cyan] rounded-full ${side === 'right' ? 'order-first' : ''}`}></div>
        </div>
        
        {/* Content */}
        <div className={`font-sans relative z-10 ${isLightMode ? 'text-slate-700' : 'text-cyan-100'}`}>
            {children}
        </div>
    </div>
  );
};

export default InfoPanel;
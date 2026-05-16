import React from 'react';
import { X, Cpu, Globe, Zap, MessageSquare } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLightMode: boolean;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, isLightMode }) => {
  if (!isOpen) return null;

  const textColor = isLightMode ? 'text-slate-700' : 'text-cyan-100';
  const borderColor = isLightMode ? 'border-cyan-500/30' : 'border-cyan-500/50';
  const bgColor = isLightMode ? 'bg-white/95' : 'bg-slate-950/95';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className={`
        relative w-full max-w-2xl transform transition-all scale-100 
        ${bgColor} border ${borderColor} shadow-[0_0_30px_rgba(6,182,212,0.2)]
        rounded-lg overflow-hidden
      `}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${borderColor}`}>
            <div className="flex items-center gap-2">
                <Cpu size={20} className="text-cyan-500" />
                <h2 className={`text-xl font-mono font-bold tracking-widest ${isLightMode ? 'text-slate-800' : 'text-cyan-400'}`}>
                    SYSTEM PROTOCOLS
                </h2>
            </div>
            <button 
                onClick={onClose}
                className={`p-1 rounded-full hover:bg-cyan-500/20 transition-colors ${textColor}`}
            >
                <X size={24} />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            
            {/* BIO SECTION */}
            <div className={`p-4 rounded border ${borderColor} ${isLightMode ? 'bg-cyan-50/50' : 'bg-cyan-900/10'}`}>
                <h3 className="text-sm font-mono uppercase tracking-widest text-cyan-500 mb-2">/ BIO_DATA</h3>
                <p className={`text-lg font-sans font-medium leading-relaxed ${textColor}`}>
                    "JARVIS TS is a next-generation neural interface powered by Google's Gemini Multimodal Live API. It bridges the gap between human intent and machine execution, providing real-time voice and text interaction with advanced cognitive capabilities in English and Hindi."
                </p>
            </div>

            {/* FEATURES GRID */}
            <div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-cyan-500 mb-4">/ TECHNICAL_SPECS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Feature 1 */}
                    <div className={`flex gap-3 p-3 rounded hover:bg-cyan-500/5 transition-colors`}>
                        <Zap className="text-yellow-500 shrink-0" size={24} />
                        <div>
                            <h4 className={`font-bold text-sm ${isLightMode ? 'text-slate-900' : 'text-white'}`}>Multimodal Core</h4>
                            <p className={`text-xs mt-1 opacity-80 ${textColor}`}>
                                Powered by Gemini 2.5 Flash, processing voice streams and text inputs with ultra-low latency.
                            </p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className={`flex gap-3 p-3 rounded hover:bg-cyan-500/5 transition-colors`}>
                        <Globe className="text-green-500 shrink-0" size={24} />
                        <div>
                            <h4 className={`font-bold text-sm ${isLightMode ? 'text-slate-900' : 'text-white'}`}>Bilingual Link</h4>
                            <p className={`text-xs mt-1 opacity-80 ${textColor}`}>
                                Native fluency in English and Hindi. Dynamically switches context based on user preference.
                            </p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className={`flex gap-3 p-3 rounded hover:bg-cyan-500/5 transition-colors`}>
                        <Cpu className="text-blue-500 shrink-0" size={24} />
                        <div>
                            <h4 className={`font-bold text-sm ${isLightMode ? 'text-slate-900' : 'text-white'}`}>Live Grounding</h4>
                            <p className={`text-xs mt-1 opacity-80 ${textColor}`}>
                                Integrated Google Search capability for retrieving up-to-date real-world information.
                            </p>
                        </div>
                    </div>

                    {/* Feature 4 */}
                    <div className={`flex gap-3 p-3 rounded hover:bg-cyan-500/5 transition-colors`}>
                        <MessageSquare className="text-purple-500 shrink-0" size={24} />
                        <div>
                            <h4 className={`font-bold text-sm ${isLightMode ? 'text-slate-900' : 'text-white'}`}>Holographic UI</h4>
                            <p className={`text-xs mt-1 opacity-80 ${textColor}`}>
                                React-based visual system with real-time audio analysis and futuristic aesthetic.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`text-xs font-mono text-center pt-4 border-t ${borderColor} opacity-60`}>
                DEVELOPED BY PREM • SYSTEM VERSION 2.1.0 • SECURE
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
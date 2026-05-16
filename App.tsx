import React, { useState, useEffect } from 'react';
import { useJarvis } from './hooks/useJarvis';
import { ConnectionState } from './types';
import ArcReactor from './components/ArcReactor';
import ChatLog from './components/ChatLog';
import SystemStats from './components/SystemStats';
import InfoPanel from './components/InfoPanel';
import InteractiveBackground from './components/InteractiveBackground';
import HoloToggle from './components/HoloToggle';
import GlitchButton from './components/GlitchButton';
import SessionControls from './components/SessionControls';
import TextInput from './components/TextInput';
import AboutModal from './components/AboutModal';
import { Mic, MicOff, Power, Radio, ShieldCheck, Activity, BrainCircuit, Keyboard, Languages, Info } from 'lucide-react';

const App: React.FC = () => {
  const { connectionState, connect, disconnect, clearLogs, sendTextMessage, changeLanguage, logs, analyser, setMicMuted } = useJarvis();
  const [isLightMode, setIsLightMode] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const isActive = connectionState === ConnectionState.CONNECTED;
  const isConnecting = connectionState === ConnectionState.CONNECTING;

  // Manage Mic Mute state based on Input Mode
  useEffect(() => {
    if (isActive) {
        setMicMuted(inputMode === 'text');
    }
  }, [inputMode, isActive, setMicMuted]);

  // Handle Language Change dynamically
  const handleLanguageChange = (lang: 'english' | 'hindi') => {
      setLanguage(lang);
      if (isActive) {
          changeLanguage(lang);
      }
  };

  const toggleConnection = () => {
    if (isActive || isConnecting) {
      disconnect();
    } else {
      connect(language);
    }
  };

  const handleTextSend = (text: string) => {
      sendTextMessage(text, language);
  };

  return (
    <div className={`min-h-screen w-full font-sans relative overflow-hidden flex flex-col transition-colors duration-1000 ${isLightMode ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-cyan-50'}`}>
      {/* Dynamic Interactive Background */}
      <InteractiveBackground isLightMode={isLightMode} />
      
      {/* Overlay Gradients */}
      <div className={`absolute inset-0 bg-radial-glow pointer-events-none z-0 transition-opacity duration-1000 ${isLightMode ? 'opacity-30' : 'opacity-100'}`}></div>
      
      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} isLightMode={isLightMode} />

      {/* Header */}
      <header className={`relative z-10 p-5 flex flex-col md:flex-row gap-4 justify-between items-center border-b transition-colors duration-300 backdrop-blur-md ${isLightMode ? 'border-slate-200 bg-white/70' : 'border-cyan-900/30 bg-slate-950/80'}`}>
        <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
                <div className={`absolute inset-0 border-2 rounded-full border-t-transparent animate-spin ${isLightMode ? 'border-cyan-600' : 'border-cyan-500'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLightMode ? 'bg-slate-200 text-cyan-700' : 'bg-cyan-900/50 text-cyan-400'}`}>
                    <BrainCircuit size={20} />
                </div>
            </div>
            <div>
                <h1 className={`text-3xl font-mono tracking-[0.15em] font-bold ${isLightMode ? 'text-slate-800 drop-shadow-sm' : 'text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]'}`}>
                    JARVIS <span className="text-cyan-500 text-lg align-top opacity-80">TS</span>
                </h1>
                <p className={`text-[10px] uppercase tracking-[0.3em] font-semibold ${isLightMode ? 'text-slate-500' : 'text-cyan-600'}`}>Advanced Voice Neural Network</p>
            </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 items-center">
            {/* Dark/Light Mode Toggle */}
            <div className="flex items-center gap-2 scale-90">
                <HoloToggle checked={isLightMode} onChange={setIsLightMode} />
            </div>

            {/* About Button */}
            <button 
                onClick={() => setIsAboutOpen(true)}
                className={`p-2 rounded-full border transition-all duration-300 hover:scale-110 ${isLightMode ? 'border-slate-300 text-slate-500 hover:bg-slate-100' : 'border-cyan-900/50 text-cyan-500 hover:bg-cyan-950/50 hover:shadow-[0_0_10px_cyan]'}`}
                title="System Info"
            >
                <Info size={20} />
            </button>
        </div>
      </header>

      {/* Main Interface */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center lg:items-stretch justify-center p-4 gap-6 overflow-hidden">
        
        {/* Left Panel: System Stats & Status */}
        <aside className="w-full lg:w-72 flex flex-col gap-4 transition-all duration-500 order-2 lg:order-1">
            <SystemStats isLightMode={isLightMode} />
            
            <InfoPanel title="Protocol Status" isLightMode={isLightMode}>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className={`text-xs ${isLightMode ? 'text-slate-500' : 'text-cyan-400/70'}`}>CONNECTION</span>
                        <div className={`flex items-center gap-2 text-xs font-bold ${
                            isActive ? 'text-green-500' : 
                            isConnecting ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                            <div className={`w-2 h-2 rounded-full ${
                                isActive ? 'bg-green-500 animate-pulse' : 
                                isConnecting ? 'bg-yellow-500 animate-bounce' : 'bg-red-500'
                            }`}></div>
                            {connectionState}
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className={`text-xs ${isLightMode ? 'text-slate-500' : 'text-cyan-400/70'}`}>SECURE LINK</span>
                         <ShieldCheck size={14} className={isActive ? "text-green-500" : "text-gray-500"} />
                    </div>

                    <div className="flex justify-between items-center">
                        <span className={`text-xs ${isLightMode ? 'text-slate-500' : 'text-cyan-400/70'}`}>AUDIO STREAM</span>
                        <Activity size={14} className={isActive && !inputMode ? "text-cyan-400 animate-pulse" : "text-gray-500"} />
                    </div>
                </div>
            </InfoPanel>
        </aside>

        {/* Center Panel: Arc Reactor */}
        <section className="flex-1 w-full relative flex items-center justify-center min-h-[300px] lg:min-h-0 order-1 lg:order-2">
            <ArcReactor analyser={analyser} active={isActive} isLightMode={isLightMode} />
        </section>

        {/* Right Panel: Chat Log */}
        <aside className="w-full lg:w-96 h-[300px] lg:h-auto flex flex-col order-3 transition-all duration-500">
             <ChatLog logs={logs} isLightMode={isLightMode} />
        </aside>

      </main>

      {/* Footer Controls */}
      <footer className={`relative z-20 p-4 border-t backdrop-blur-md transition-colors duration-300 ${isLightMode ? 'border-slate-200 bg-white/70' : 'border-cyan-900/30 bg-slate-950/80'}`}>
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
            
            {/* Top Row: Primary Controls */}
            <div className="flex flex-wrap justify-center items-center gap-6">
                
                {/* Connect Button */}
                <div className="relative group">
                    <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${isActive ? 'animate-pulse' : ''}`}></div>
                    <GlitchButton 
                        text={isActive ? "DEACTIVATE SYSTEM" : isConnecting ? "INITIALIZING..." : "INITIALIZE JARVIS"} 
                        onClick={toggleConnection}
                        isLightMode={isLightMode}
                        isActive={isActive}
                        variant={isActive ? 'danger' : 'default'}
                    />
                </div>

                {/* Controls Group */}
                <div className="flex items-center gap-4 bg-black/10 p-2 rounded-lg border border-cyan-900/10">
                    
                    {/* Input Mode Toggle */}
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setInputMode('voice')}
                            className={`p-2 rounded transition-all ${inputMode === 'voice' 
                                ? (isLightMode ? 'bg-cyan-100 text-cyan-700 shadow-sm' : 'bg-cyan-900/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]') 
                                : 'text-gray-500 hover:text-gray-400'}`}
                            title="Voice Mode"
                        >
                            <Mic size={20} />
                        </button>
                        <button 
                            onClick={() => setInputMode('text')}
                            className={`p-2 rounded transition-all ${inputMode === 'text' 
                                ? (isLightMode ? 'bg-cyan-100 text-cyan-700 shadow-sm' : 'bg-cyan-900/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]') 
                                : 'text-gray-500 hover:text-gray-400'}`}
                            title="Text Mode"
                        >
                            <Keyboard size={20} />
                        </button>
                    </div>

                    <div className={`w-[1px] h-6 ${isLightMode ? 'bg-slate-300' : 'bg-cyan-900/50'}`}></div>

                    {/* Language Toggle */}
                    <div className="flex items-center gap-2">
                        <Languages size={18} className={isLightMode ? "text-slate-400" : "text-cyan-700"} />
                        <button 
                            onClick={() => handleLanguageChange('english')}
                            className={`text-xs font-mono font-bold px-2 py-1 rounded transition-colors ${language === 'english' 
                                ? (isLightMode ? 'text-cyan-700 bg-cyan-50' : 'text-cyan-300 bg-cyan-900/30') 
                                : 'text-gray-500 hover:text-gray-400'}`}
                        >
                            ENG
                        </button>
                        <button 
                            onClick={() => handleLanguageChange('hindi')}
                            className={`text-xs font-mono font-bold px-2 py-1 rounded transition-colors ${language === 'hindi' 
                                ? (isLightMode ? 'text-cyan-700 bg-cyan-50' : 'text-cyan-300 bg-cyan-900/30') 
                                : 'text-gray-500 hover:text-gray-400'}`}
                        >
                            HIN
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Text Input (Conditional) */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden flex justify-center ${inputMode === 'text' ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                <TextInput onSend={handleTextSend} isLightMode={isLightMode} disabled={!isActive} />
            </div>

        </div>
      </footer>
    </div>
  );
};

export default App;
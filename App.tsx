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
import { Mic, MicOff, Power, Radio, ShieldCheck, Activity, BrainCircuit, Keyboard, Languages } from 'lucide-react';

const App: React.FC = () => {
  const { connectionState, connect, disconnect, clearLogs, sendTextMessage, changeLanguage, logs, analyser, setMicMuted } = useJarvis();
  const [isLightMode, setIsLightMode] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');

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

            <div className="hidden md:flex flex-col items-end">
                <span className={`text-[10px] font-mono ${isLightMode ? 'text-slate-500' : 'text-cyan-700'}`}>SYSTEM INTEGRITY</span>
                <div className="flex gap-1 mt-1">
                    {[1,2,3,4,5].map(i => <div key={i} className={`w-4 h-1 transition-opacity duration-500 ${isLightMode ? 'bg-cyan-600/50' : 'bg-cyan-500/50'} ${isLightMode ? 'opacity-100' : 'opacity-100'}`}></div>)}
                </div>
            </div>
            <div className={`flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-sm transition-all duration-500 ${
                isActive 
                    ? isLightMode 
                        ? 'border-cyan-500 bg-white shadow-md' 
                        : 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                    : isLightMode
                        ? 'border-slate-300 bg-slate-100'
                        : 'border-slate-800 bg-slate-900/50'
            }`}>
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`}></div>
                <span className={`text-xs font-mono font-bold tracking-wider ${isActive ? (isLightMode ? 'text-cyan-700' : 'text-cyan-300') : 'text-slate-400'}`}>
                    {isActive ? 'ONLINE' : 'OFFLINE'}
                </span>
            </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 relative z-10 p-4 lg:p-8 flex flex-col lg:flex-row gap-8 items-center lg:items-stretch justify-center max-w-[1600px] mx-auto w-full">
        
        {/* Left Column: Chat Log (Primary Interaction) */}
        <div className="w-full lg:w-1/4 h-full order-2 lg:order-1 flex flex-col gap-6 animate-[fadeIn_0.5s_ease-out_0.2s]">
             <ChatLog logs={logs} isLightMode={isLightMode} />
             <div className={`p-4 rounded border text-center transition-colors hidden lg:block ${isLightMode ? 'bg-white border-cyan-200 shadow-sm' : 'bg-cyan-950/20 border-cyan-900/30'}`}>
                 <p className={`text-[10px] font-mono mb-1 ${isLightMode ? 'text-slate-400' : 'text-cyan-500'}`}>CURRENT MODEL</p>
                 <p className={`text-xs font-bold tracking-widest ${isLightMode ? 'text-cyan-700' : 'text-cyan-300'}`}>GEMINI 2.5 FLASH AUDIO</p>
            </div>
        </div>

        {/* Center: The Core */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center min-h-[500px] order-1 lg:order-2 relative">
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                 {/* Background HUD Rings */}
                <div className={`w-[600px] h-[600px] border rounded-full absolute transition-all duration-1000 ${isActive ? 'scale-110 opacity-60' : 'scale-100 opacity-30'} ${isLightMode ? 'border-slate-300' : 'border-cyan-800/20'}`}></div>
                <div className={`w-[800px] h-[800px] border rounded-full absolute transition-all duration-[2000ms] ${isActive ? 'scale-105' : 'scale-100'} ${isLightMode ? 'border-slate-200' : 'border-cyan-800/10'}`}></div>
             </div>
             
             {/* Input Mode & Language Toggles */}
             <div className="relative z-20 flex flex-col gap-4 mb-6 items-center">
                 {/* Modes */}
                 <div className="flex gap-6 items-center">
                    <div className="flex items-center gap-2">
                        <Mic size={16} className={inputMode === 'voice' ? 'text-cyan-400' : 'text-slate-500'} />
                        <GlitchButton 
                            text="VOICE"
                            isLightMode={isLightMode} 
                            isActive={inputMode === 'voice'} 
                            onClick={() => setInputMode('voice')}
                            size="sm"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Keyboard size={16} className={inputMode === 'text' ? 'text-cyan-400' : 'text-slate-500'} />
                        <GlitchButton 
                            text="TEXT"
                            isLightMode={isLightMode} 
                            isActive={inputMode === 'text'} 
                            onClick={() => setInputMode('text')}
                            size="sm"
                        />
                    </div>
                 </div>

                 {/* Language Selection */}
                 <div className="flex items-center gap-4 border-t pt-4 border-dashed border-cyan-500/20">
                    <Languages size={14} className={isLightMode ? 'text-slate-400' : 'text-cyan-700'} />
                    <div className="flex gap-2">
                        <GlitchButton 
                            text="ENG"
                            isLightMode={isLightMode} 
                            isActive={language === 'english'} 
                            onClick={() => handleLanguageChange('english')}
                            size="sm"
                        />
                        <GlitchButton 
                            text="HIN"
                            isLightMode={isLightMode} 
                            isActive={language === 'hindi'} 
                            onClick={() => handleLanguageChange('hindi')}
                            size="sm"
                        />
                    </div>
                 </div>
             </div>
             
             {/* The Reactor Component - Increased margin-bottom to 24 (96px) to fix overlap */}
             <div className="relative z-10 w-full h-[320px] flex items-center justify-center mb-24">
                <ArcReactor analyser={analyser} active={isActive} isLightMode={isLightMode} />
             </div>

             {/* Connection Controls Area */}
             <div className="relative z-20 w-full flex flex-col items-center gap-4 min-h-[80px]">
                {isActive ? (
                    inputMode === 'voice' ? (
                        <div className="flex flex-col items-center gap-4">
                            <SessionControls onStop={disconnect} onReset={clearLogs} />
                            <p className={`text-[10px] tracking-widest animate-pulse ${isLightMode ? 'text-cyan-600' : 'text-cyan-400'}`}>
                                LISTENING ({language.toUpperCase()})...
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 w-full px-8">
                            <TextInput 
                                onSend={handleTextSend} 
                                isLightMode={isLightMode} 
                                disabled={!isActive} 
                            />
                            <div className="scale-75 origin-top">
                                 <SessionControls onStop={disconnect} onReset={clearLogs} />
                            </div>
                        </div>
                    )
                ) : (
                  <GlitchButton 
                      text={isConnecting ? 'CONNECTING...' : 'INITIALIZE SYSTEM'}
                      onClick={toggleConnection}
                      isLightMode={isLightMode}
                      variant='default'
                      size="lg"
                  />
                )}
             </div>
        </div>

        {/* Right Column: Stats & Diagnostics (Secondary) */}
        <div className="w-full lg:w-1/4 flex flex-col gap-6 order-3 lg:order-3 animate-[fadeIn_0.5s_ease-out]">
            <SystemStats isLightMode={isLightMode} />
            <InfoPanel title="Operational Status" side="right" isLightMode={isLightMode}>
                <ul className={`space-y-3 text-sm font-mono ${isLightMode ? 'text-slate-600' : 'text-cyan-300'}`}>
                    <li className={`flex items-center justify-between p-2 rounded border ${isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-cyan-950/20 border-cyan-900/30'}`}>
                        <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-cyan-500"/> Firewall</span>
                        <span className="text-green-500 text-xs">ACTIVE</span>
                    </li>
                    <li className={`flex items-center justify-between p-2 rounded border ${isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-cyan-950/20 border-cyan-900/30'}`}>
                        <span className="flex items-center gap-2"><Activity size={14} className="text-cyan-500"/> Neural Link</span>
                        <span className={`text-xs ${isLightMode ? 'text-cyan-600' : 'text-cyan-400'}`}>{isActive ? 'CONNECTED' : 'STANDBY'}</span>
                    </li>
                    <li className={`flex items-center justify-between p-2 rounded border ${isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-cyan-950/20 border-cyan-900/30'}`}>
                        <span className="flex items-center gap-2"><Languages size={14} className="text-cyan-500"/> Language</span>
                        <span className="text-xs uppercase font-bold text-cyan-500">{language.substring(0,3)}</span>
                    </li>
                </ul>
            </InfoPanel>
        </div>

      </main>

      {/* Footer */}
      <footer className={`relative z-10 p-3 text-center border-t backdrop-blur ${isLightMode ? 'bg-white/80 border-slate-200' : 'bg-slate-950/90 border-cyan-900/30'}`}>
        <p className={`text-[10px] font-mono tracking-[0.3em] ${isLightMode ? 'text-slate-400' : 'text-cyan-700'}`}>
          JARVIS TS SYSTEMS • SECURE CONNECTION • V.2.1.0
        </p>
      </footer>
    </div>
  );
};

export default App;
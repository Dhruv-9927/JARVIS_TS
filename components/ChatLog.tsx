
import React, { useEffect, useRef } from 'react';
import { LogMessage } from '../types';
import InfoPanel from './InfoPanel';
import { ExternalLink } from 'lucide-react';

interface ChatLogProps {
  logs: LogMessage[];
  isLightMode: boolean;
}

const ChatLog: React.FC<ChatLogProps> = ({ logs, isLightMode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <InfoPanel title="Transcription Log" className="h-full flex flex-col" side="right" isLightMode={isLightMode}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto max-h-[200px] lg:max-h-[300px] space-y-3 pr-2">
        {logs.length === 0 && (
            <div className={`text-center text-xs italic mt-10 ${isLightMode ? 'text-slate-400' : 'text-cyan-800'}`}>Awaiting audio input...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className={`flex flex-col ${log.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <span className={`text-[10px] font-mono uppercase mb-0.5 ${isLightMode ? 'text-cyan-700' : 'text-cyan-600'}`}>
              {log.sender} • {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
            </span>
            <div className={`
              max-w-[90%] p-2 text-sm border-l-2 
              ${log.sender === 'user' 
                ? isLightMode 
                    ? 'border-cyan-500 bg-cyan-50 text-right text-slate-800' 
                    : 'border-cyan-400 bg-cyan-900/20 text-right text-cyan-50'
                : log.sender === 'jarvis' 
                  ? isLightMode
                    ? 'border-slate-300 bg-white text-left text-slate-700 shadow-sm'
                    : 'border-cyan-200 bg-cyan-950/40 text-left text-cyan-100' 
                  : 'border-yellow-500 text-yellow-600 font-mono text-xs'}
            `}>
              {log.text}
              
              {/* Display Search Sources if available */}
              {log.sources && log.sources.length > 0 && (
                  <div className={`mt-2 pt-2 border-t ${isLightMode ? 'border-slate-100' : 'border-cyan-800/30'}`}>
                      <p className={`text-[10px] font-mono font-bold mb-1 ${isLightMode ? 'text-slate-400' : 'text-cyan-500/70'}`}>SEARCH SOURCES:</p>
                      <div className="flex flex-col gap-1">
                          {log.sources.map((source, idx) => (
                              <a 
                                key={idx} 
                                href={source.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`flex items-center gap-1 text-[11px] hover:underline ${isLightMode ? 'text-blue-500' : 'text-cyan-300'}`}
                              >
                                  <ExternalLink size={10} />
                                  <span className="truncate max-w-[200px]">{source.title}</span>
                              </a>
                          ))}
                      </div>
                  </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </InfoPanel>
  );
};

export default ChatLog;

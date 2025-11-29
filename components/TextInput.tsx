
import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface TextInputProps {
  onSend: (text: string) => void;
  isLightMode: boolean;
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ onSend, isLightMode, disabled }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value);
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg relative group">
      <div className={`
        absolute -inset-1 rounded-lg blur opacity-25 transition duration-1000 group-hover:opacity-75
        ${isLightMode ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gradient-to-r from-cyan-600 to-blue-600'}
      `}></div>
      
      <div className="relative flex items-center">
        <input 
          type="text" 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          placeholder={disabled ? "INITIALIZE SYSTEM FIRST..." : "ASK IN ENGLISH OR HINDI..."}
          className={`
            w-full px-5 py-4 pr-12 rounded-lg border font-mono tracking-wider outline-none transition-all duration-300
            ${isLightMode 
              ? 'bg-white/90 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-cyan-500 shadow-sm' 
              : 'bg-slate-950/80 border-cyan-800/50 text-cyan-100 placeholder-cyan-800 focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
        
        <button 
          type="submit"
          disabled={!value.trim() || disabled}
          className={`
            absolute right-2 p-2 rounded-md transition-all duration-300
            ${!value.trim() || disabled 
               ? 'opacity-30 cursor-not-allowed text-slate-500' 
               : isLightMode 
                 ? 'text-cyan-600 hover:bg-cyan-50' 
                 : 'text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-200 hover:shadow-[0_0_10px_cyan]'
            }
          `}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default TextInput;

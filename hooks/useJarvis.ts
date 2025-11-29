import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { ConnectionState, LogMessage } from '../types';
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';

export const useJarvis = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);

  // Audio Contexts
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  
  // Chat History for Text Mode
  const chatHistoryRef = useRef<any[]>([]);

  // Add a new log message
  const addLog = useCallback((sender: 'user' | 'jarvis' | 'system', text: string) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      sender,
      text,
      timestamp: new Date()
    }]);
  }, []);

  // Stream text to the last log message if it matches sender, otherwise create new
  const streamLog = useCallback((sender: 'user' | 'jarvis', text: string) => {
    setLogs(prev => {
      const lastLog = prev[prev.length - 1];
      // If the last log is from the same sender and recent (e.g. streaming), append to it
      if (lastLog && lastLog.sender === sender) {
        return [
          ...prev.slice(0, -1),
          { ...lastLog, text: lastLog.text + text }
        ];
      } else {
        // Create new log
        return [...prev, {
          id: Math.random().toString(36).substring(7),
          sender,
          text,
          timestamp: new Date()
        }];
      }
    });
  }, []);

  // Attach sources to the last log message
  const attachSources = useCallback((sources: { title: string; url: string }[]) => {
    setLogs(prev => {
        const lastLog = prev[prev.length - 1];
        if (lastLog && lastLog.sender === 'jarvis') {
            return [
                ...prev.slice(0, -1),
                { ...lastLog, sources: sources }
            ];
        }
        return prev;
    });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    addLog('system', 'System logs cleared.');
  }, [addLog]);

  const setMicMuted = useCallback((muted: boolean) => {
    setIsMicMuted(muted);
    if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(track => {
            track.enabled = !muted;
        });
    }
  }, []);

  const playAudioData = useCallback(async (base64Audio: string) => {
      if (!outputAudioContextRef.current) {
           const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
           outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      }

      const outCtx = outputAudioContextRef.current!;
      
      // CRITICAL: Ensure context is running (it might be suspended by the browser)
      if (outCtx.state === 'suspended') {
          await outCtx.resume();
      }

      // Re-attach analyser if needed
      if (!analyser) {
          const analyserNode = outCtx.createAnalyser();
          analyserNode.fftSize = 512;
          analyserNode.smoothingTimeConstant = 0.8;
          analyserNode.connect(outCtx.destination);
          setAnalyser(analyserNode);
      }

      // Ensure time is moving forward
      if (nextStartTimeRef.current < outCtx.currentTime) {
          nextStartTimeRef.current = outCtx.currentTime;
      }

      try {
        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            outCtx,
            24000,
            1
        );

        const source = outCtx.createBufferSource();
        source.buffer = audioBuffer;
        
        // Connect to analyser if it exists, otherwise destination
        if (analyser) {
             source.connect(analyser);
        } else {
             source.connect(outCtx.destination);
        }

        source.addEventListener('ended', () => {
            sourcesRef.current.delete(source);
        });

        source.start(nextStartTimeRef.current);
        nextStartTimeRef.current += audioBuffer.duration;
        sourcesRef.current.add(source);
      } catch (e) {
          console.error("Audio playback error", e);
      }
  }, [analyser]);

  const getSystemInstruction = (language: 'english' | 'hindi') => {
      const langName = language === 'hindi' ? 'Hindi' : 'English';
      return `You are JARVIS TS, an advanced intelligent interface. You are helpful, concise, and knowledgeable. 
      You have access to Google Search to provide up-to-date information. 
      CRITICAL: The user has selected ${langName} as their preferred language. You MUST respond in ${langName} primarily.
      If the user speaks a different language, reply in ${langName}.
      Keep responses spoken-style: concise, direct, and avoiding markdown or complex lists unless necessary.
      Maintain a professional, slightly futuristic persona.`;
  };

  const connect = useCallback(async (language: 'english' | 'hindi') => {
    try {
      setConnectionState(ConnectionState.CONNECTING);
      addLog('system', `Initializing JARVIS TS core protocols (${language.toUpperCase()})...`);

      if (!process.env.API_KEY) {
        throw new Error("API_KEY not found in environment.");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // Setup Audio Contexts IMMEDIATELY on click/connect
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      
      // Close existing if any
      if (inputAudioContextRef.current) inputAudioContextRef.current.close();
      if (outputAudioContextRef.current) outputAudioContextRef.current.close();

      inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });

      // FORCE RESUME to unlock audio autoplay
      await outputAudioContextRef.current.resume();

      // Output Analyzer for visualization
      const outCtx = outputAudioContextRef.current!;
      const analyserNode = outCtx.createAnalyser();
      analyserNode.fftSize = 512;
      analyserNode.smoothingTimeConstant = 0.8;
      analyserNode.connect(outCtx.destination);
      setAnalyser(analyserNode);

      // Microphone Stream
      addLog('system', 'Accessing audio input sensors...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const config = {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
        },
        tools: [{ googleSearch: {} }],
        systemInstruction: getSystemInstruction(language),
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      };

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config,
        callbacks: {
          onopen: () => {
            setConnectionState(ConnectionState.CONNECTED);
            addLog('system', 'JARVIS TS Online. Awaiting command.');

            // Setup Input Processing
            const inCtx = inputAudioContextRef.current!;
            const source = inCtx.createMediaStreamSource(stream);
            const scriptProcessor = inCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;
            
            scriptProcessor.onaudioprocess = (e) => {
              // Don't send audio if muted (Text Mode)
              if (scriptProcessorRef.current && !streamRef.current?.getAudioTracks()[0].enabled) return;

              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              
              if (sessionPromiseRef.current) {
                sessionPromiseRef.current.then((session: any) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              }
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcriptions
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              if (text) streamLog('jarvis', text);
            } 
            
            if (message.serverContent?.turnComplete && message.serverContent?.inputTranscription) {
                 addLog('user', message.serverContent.inputTranscription.text);
            }

            // Handle Grounding Metadata (Search Results)
            const groundingMetadata = (message.serverContent as any)?.groundingMetadata;
            if (groundingMetadata && groundingMetadata.groundingChunks) {
                const sources = groundingMetadata.groundingChunks
                    .map((chunk: any) => chunk.web ? { title: chunk.web.title, url: chunk.web.uri } : null)
                    .filter(Boolean);
                
                if (sources.length > 0) {
                    attachSources(sources);
                }
            }

            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                playAudioData(base64Audio);
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              addLog('system', 'Interruption detected.');
              sourcesRef.current.forEach(source => source.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setConnectionState(ConnectionState.DISCONNECTED);
            addLog('system', 'Connection closed.');
          },
          onerror: (err) => {
            console.error(err);
            setConnectionState(ConnectionState.ERROR);
            addLog('system', 'Critical Error: Connection failure.');
          }
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (error: any) {
      setConnectionState(ConnectionState.ERROR);
      addLog('system', `Initialization failed: ${error.message}`);
    }
  }, [addLog, streamLog, attachSources, playAudioData]);

  const disconnect = useCallback(() => {
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then((session: any) => {
            if(session.close) session.close();
        }).catch(() => {});
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();

    setConnectionState(ConnectionState.DISCONNECTED);
    addLog('system', 'JARVIS TS Deactivated.');
    sessionPromiseRef.current = null;
  }, [addLog]);

  const changeLanguage = useCallback((language: 'english' | 'hindi') => {
      // If active, we can inform the model via text injection to switch context
      if (sessionPromiseRef.current) {
          sessionPromiseRef.current.then((session: any) => {
              // We send a client content message telling the model to switch language
              // Note: Live API doesn't have a direct 'system instruction update' method mid-stream, 
              // but telling it as a user turn works effectively.
              const langName = language === 'hindi' ? 'Hindi' : 'English';
              session.send({ 
                  clientContent: { 
                      turns: [{ 
                          role: 'user', 
                          parts: [{ text: `System Override: Switch output language to ${langName}. Respond in ${langName} from now on.` }] 
                      }], 
                      turnComplete: true 
                  } 
              });
              addLog('system', `Language protocol switched to ${langName.toUpperCase()}`);
          });
      }
  }, [addLog]);

  const sendTextMessage = useCallback(async (text: string, language: 'english' | 'hindi') => {
    // 1. Log the user message
    addLog('user', text);
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // --- Step 1: Get Text Response ---
        const systemInstruction = getSystemInstruction(language);
        
        const history = chatHistoryRef.current.map(h => ({
             role: h.role,
             parts: h.parts
        }));

        const userContent = { role: 'user', parts: [{ text: text }] };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: systemInstruction,
            },
            contents: [...history, userContent]
        });

        const responseText = response.text || "";
        
        // Update History
        chatHistoryRef.current.push(userContent);
        chatHistoryRef.current.push({ role: 'model', parts: [{ text: responseText }] });

        addLog('jarvis', responseText);

        // --- Step 2: Generate Audio (TTS) ---
        // Use the TTS model to speak the response
        const ttsResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: responseText }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } }
                }
            }
        });

        const audioData = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (audioData) {
            await playAudioData(audioData);
        }

    } catch (err: any) {
        console.error("Text Mode Error:", err);
        addLog('system', `Processing Error: ${err.message}`);
    }
  }, [addLog, playAudioData]);

  return {
    connectionState,
    connect,
    disconnect,
    clearLogs,
    sendTextMessage,
    setMicMuted,
    changeLanguage,
    logs,
    analyser
  };
};
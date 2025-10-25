




import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from "@google/genai";
import { MicrophoneIcon } from './Icons';

// Audio utility functions from Gemini API documentation
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const KaiLiveView: React.FC<{ subject: string }> = ({ subject }) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopSession = () => {
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
        sessionPromiseRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }

    if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
    }
    
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      inputAudioContextRef.current.close();
    }
    
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
      outputAudioContextRef.current.close();
    }
    
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();

    setIsSessionActive(false);
  };

  const startSession = async () => {
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // FIX: Cast `window` to `any` to allow access to `webkitAudioContext` for cross-browser compatibility.
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      // FIX: Cast `window` to `any` to allow access to `webkitAudioContext` for cross-browser compatibility.
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      nextStartTimeRef.current = 0;

      const outputNode = outputAudioContextRef.current.createGain();

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsSessionActive(true);
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            sourceNodeRef.current = source;
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              if (sessionPromiseRef.current) {
                  sessionPromiseRef.current.then((session) => {
                    session.sendRealtimeInput({ media: pcmBlob });
                  });
              }
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
            if (base64EncodedAudioString && outputAudioContextRef.current) {
              const outputCtx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);

              const audioBuffer = await decodeAudioData(decode(base64EncodedAudioString), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: ErrorEvent) => {
            console.error('Gemini Live API Error:', e);
            setError('En feil oppstod under samtalen.');
            stopSession();
          },
          onclose: (e: CloseEvent) => {
            console.debug('Gemini Live API connection closed.');
            stopSession();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: `Du er KAI, en AI-lærer for en 6. klassing. Målet ditt er å hjelpe eleven med å lære om faget ${subject} ved å veilede dem, ikke ved å gi dem det direkte svaret. Svar KUN på norsk. Vær oppmuntrende, vennlig og tålmodig.`,
        },
      });
    } catch (err) {
        console.error('Failed to start session:', err);
        setError('Kunne ikke starte samtalen. Sjekk mikrofontillatelser.');
    }
  };

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      stopSession();
    };
  }, []);

  return (
    <div className="text-center text-gray-700 py-16 flex flex-col items-center justify-center h-full">
        <h3 className="font-semibold text-xl mb-2">Klar for å lære?</h3>
        <p className="max-w-md mx-auto mb-8">
            Trykk på knappen under for å starte en samtale med KAI om {subject}. Still spørsmål om oppgaver, temaer du lurer på, eller bare for å få hjelp til å komme i gang.
        </p>

        {!isSessionActive ? (
            <button
                onClick={startSession}
                className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
                <MicrophoneIcon className="w-6 h-6" />
                Start Samtale
            </button>
        ) : (
            <div className="flex flex-col items-center gap-6">
                <button
                    onClick={stopSession}
                    className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                    <MicrophoneIcon className="w-6 h-6" />
                    Avslutt Samtale
                </button>
                <div className="flex items-center gap-3 text-green-600 font-medium">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    KAI lytter...
                </div>
            </div>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default KaiLiveView;
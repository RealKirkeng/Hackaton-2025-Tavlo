
import React, { useState, useEffect } from 'react';
import { CloseIcon, MagicWandIcon, PlayCircleIcon, StarIcon } from './Icons';
import { generateImageFromSketch, generateVideoFromSketch } from '../services/geminiService';

interface CreativeToolsModalProps {
    isOpen: boolean;
    onClose: () => void;
    drawingData: string;
    subject: string;
}

const CreativeToolsModal: React.FC<CreativeToolsModalProps> = ({ isOpen, onClose, drawingData, subject }) => {
    const [mode, setMode] = useState<'menu' | 'image' | 'video'>('menu');
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setMode('menu');
            setPrompt('');
            setResultUrl(null);
            setError(null);
            setIsLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleGenerateImage = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateImageFromSketch(drawingData, prompt, subject);
            setResultUrl(result);
        } catch (e) {
            setError('Kunne ikke generere bilde. Prøv igjen.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateVideo = async () => {
        // Veo requires a selected paid key
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                await window.aistudio.openSelectKey();
                // We don't continue immediately to avoid race conditions, user clicks button again
                return;
            }
        }

        setIsLoading(true);
        setError(null);
        try {
            // Default prompt if empty, to ensure animation happens
            const actualPrompt = prompt.trim() || `Animate this drawing in a fun way related to ${subject}.`;
            const result = await generateVideoFromSketch(drawingData, actualPrompt);
            setResultUrl(result);
        } catch (e) {
            console.error(e);
            setError('Kunne ikke generere video. Sjekk at du har valgt en gyldig API-nøkkel.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderMenu = () => (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-center text-gray-800">Velg Magi</h3>
            <p className="text-center text-gray-600 mb-4">Hva vil du gjøre med tegningen din?</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                    onClick={() => setMode('image')}
                    className="flex flex-col items-center justify-center p-6 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 hover:border-purple-400 transition-all"
                >
                    <StarIcon className="w-12 h-12 text-purple-600 mb-3" />
                    <span className="font-bold text-purple-800 text-lg">Forvandle til Bilde</span>
                    <span className="text-sm text-purple-600 text-center mt-2">Gjør skissen om til en ferdig illustrasjon.</span>
                </button>

                <button 
                    onClick={() => setMode('video')}
                    className="flex flex-col items-center justify-center p-6 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-400 transition-all"
                >
                    <PlayCircleIcon className="w-12 h-12 text-blue-600 mb-3" />
                    <span className="font-bold text-blue-800 text-lg">Levendegjør (Video)</span>
                    <span className="text-sm text-blue-600 text-center mt-2">Animer figuren din så den beveger seg.</span>
                </button>
            </div>
        </div>
    );

    const renderGeneration = () => (
        <div className="flex flex-col h-full">
            <h3 className="text-lg font-bold text-center text-gray-800 mb-4">
                {mode === 'image' ? 'Generer Bilde' : 'Generer Video'}
            </h3>
            
            <div className="flex-grow flex flex-col md:flex-row gap-6 overflow-hidden">
                {/* Input Side */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="bg-white border border-stone-300 rounded-lg p-2 h-48 md:h-64 flex items-center justify-center bg-stone-50">
                        <img src={drawingData} alt="Din tegning" className="max-h-full max-w-full object-contain" />
                    </div>
                    
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Beskriv hva som skal skje (valgfritt):</label>
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={mode === 'image' ? "F.eks: Gjør den fargerik og realistisk..." : "F.eks: Få figuren til å hoppe og vinke..."}
                            className="w-full mt-1 p-3 border border-stone-300 rounded-lg h-24 text-sm"
                        />
                    </div>
                    
                    <button 
                        onClick={mode === 'image' ? handleGenerateImage : handleGenerateVideo}
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-md transition-all ${
                            isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : mode === 'image' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>{mode === 'video' ? 'Genererer video (dette tar litt tid)...' : 'Genererer...'}</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <MagicWandIcon className="w-6 h-6" />
                                <span>Start Magi</span>
                            </div>
                        )}
                    </button>
                    {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
                </div>

                {/* Output Side */}
                {(resultUrl || isLoading) && (
                    <div className="flex-1 bg-stone-900 rounded-xl flex items-center justify-center overflow-hidden relative min-h-[300px]">
                        {isLoading ? (
                            <div className="text-center text-white/80 p-6">
                                <MagicWandIcon className="w-12 h-12 mx-auto mb-4 animate-pulse text-purple-400" />
                                <p className="text-lg font-semibold">Magien jobber...</p>
                                {mode === 'video' && <p className="text-sm mt-2 opacity-70">Video kan ta opptil et minutt.</p>}
                            </div>
                        ) : resultUrl ? (
                            mode === 'image' ? (
                                <img src={resultUrl} alt="Generated result" className="max-w-full max-h-full object-contain" />
                            ) : (
                                <video src={resultUrl} controls autoPlay loop className="max-w-full max-h-full" />
                            )
                        ) : null}
                    </div>
                )}
            </div>
             <div className="mt-4 flex justify-start">
                <button onClick={() => setMode('menu')} className="text-gray-500 hover:text-black underline text-sm">
                    &larr; Tilbake til meny
                </button>
            </div>
        </div>
    );

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-stone-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 max-h-[90vh]">
                <header className="flex items-center justify-between p-4 border-b border-stone-200 bg-white">
                    <div className="flex items-center gap-2 text-purple-700">
                        <MagicWandIcon className="w-6 h-6" />
                        <h2 className="text-lg font-bold">Kreative Verktøy</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200">
                        <CloseIcon className="w-5 h-5 text-gray-600" />
                    </button>
                </header>
                
                <div className="flex-grow p-6 overflow-y-auto">
                    {mode === 'menu' ? renderMenu() : renderGeneration()}
                </div>
            </div>
        </div>
    );
};

export default CreativeToolsModal;

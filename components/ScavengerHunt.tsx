
import React, { useState, useEffect, useRef } from 'react';
import { GroupGame, Student } from '../data/content';
import { SparklesIcon, SendIcon, UsersIcon } from './Icons';

interface ScavengerHuntProps {
    hunt: GroupGame;
    currentStepIndex: number;
    onCorrectAnswer: () => void;
    team: Student[];
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const ScavengerHuntView: React.FC<ScavengerHuntProps> = ({ hunt, currentStepIndex, onCorrectAnswer, team }) => {
    const [userInput, setUserInput] = useState('');
    const [isWrong, setIsWrong] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const currentStep = hunt.steps[currentStepIndex];
    const progress = (currentStepIndex / hunt.steps.length) * 100;

    useEffect(() => {
        setUserInput('');
        setIsWrong(false);
        inputRef.current?.focus();
    }, [currentStepIndex]);

    const handleSubmit = () => {
        if (userInput.trim().toLowerCase() === currentStep.answer.toLowerCase()) {
            onCorrectAnswer();
        } else {
            setIsWrong(true);
            setTimeout(() => setIsWrong(false), 800);
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };
    
    const wrongAnswerClass = isWrong ? 'animate-shake' : '';

    return (
        <div className="flex-grow bg-amber-50 flex flex-col p-4 md:p-8 overflow-hidden">
            <header className="flex-shrink-0 text-center mb-6">
                <h1 className="text-sm font-semibold text-amber-700 uppercase tracking-wider">{hunt.subject}</h1>
                <h2 className="mt-1 font-serif text-3xl md:text-4xl text-gray-800">
                    {hunt.title}
                </h2>
            </header>
            
            <div className="w-full max-w-2xl mx-auto flex-grow flex flex-col justify-between">
                <div className="flex-grow flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-lg border border-stone-200">
                    <div className="w-full mb-6">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-amber-600">Fremgang</span>
                            <span className="text-sm font-bold text-gray-600">{currentStepIndex} / {hunt.steps.length}</span>
                        </div>
                        <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 transition-all duration-500" style={{width: `${progress}%`}}></div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-600 mb-2">Spørsmål {currentStepIndex + 1}</p>
                        <p className="font-serif text-2xl text-gray-800 leading-relaxed">
                            {currentStep.clue}
                        </p>
                    </div>

                    <div className={`mt-8 w-full max-w-sm ${wrongAnswerClass}`}>
                        <div className="flex items-center gap-2 bg-white rounded-xl border-2 border-gray-300 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500">
                            <input
                                ref={inputRef}
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ditt svar..."
                                className="w-full p-3 bg-transparent border-none focus:ring-0 text-md"
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={!userInput.trim()}
                                className="p-2 m-1 rounded-md bg-amber-500 text-white hover:bg-amber-600 disabled:bg-amber-200 disabled:cursor-not-allowed transition-colors"
                                aria-label="Send Svar"
                            >
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 mt-6">
                     <div className="flex items-center justify-center gap-3 mb-2">
                        <UsersIcon className="w-6 h-6 text-gray-600" />
                        <h3 className="text-md font-bold text-gray-700">Ditt lag</h3>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        {team.map(member => (
                             <div key={member.id} className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full border border-stone-200" title={member.name}>
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xs text-gray-600">
                                    {getInitials(member.name)}
                                </div>
                                <span className="font-medium text-sm text-gray-700 hidden sm:inline">{member.name.split(' ')[0]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes shake {
                    10%, 90% { transform: translateX(-1px); }
                    20%, 80% { transform: translateX(2px); }
                    30%, 50%, 70% { transform: translateX(-4px); }
                    40%, 60% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div>
    );
};

export default ScavengerHuntView;
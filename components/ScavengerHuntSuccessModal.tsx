
import React, { useEffect, useState } from 'react';
import { Student, GroupGame } from '../data/content';
import { CloseIcon, TrophyIcon, UsersIcon } from './Icons';

interface ScavengerHuntSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    team: Student[];
    hunt: GroupGame;
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};


const ScavengerHuntSuccessModal: React.FC<ScavengerHuntSuccessModalProps> = ({ isOpen, onClose, team, hunt }) => {
    const [startTime] = useState(Date.now());
    const [timeTaken, setTimeTaken] = useState('0s');

    useEffect(() => {
      if (isOpen) {
        const duration = Math.round((Date.now() - startTime) / 1000);
        setTimeTaken(`${duration}s`);
      }
    }, [isOpen, startTime]);


    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-amber-200 animate-fade-in-scale">
                <header className="flex items-center justify-end p-2">
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200">
                        <CloseIcon className="w-5 h-5 text-gray-600" />
                    </button>
                </header>

                <div className="p-6 pt-0 text-center">
                    <div className="flex justify-center">
                        <TrophyIcon className="w-20 h-20 text-amber-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mt-4">Godt jobbet!</h2>
                    <p className="text-gray-600 mt-1">Dere fullførte <span className="font-semibold">{hunt.title}</span>.</p>
                
                    <div className="flex justify-center gap-8 mt-6">
                        <div>
                            <p className="text-sm text-gray-500">Poeng</p>
                            <p className="text-2xl font-bold text-gray-800">{hunt.steps.length * 100}</p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-500">Tid</p>
                            <p className="text-2xl font-bold text-gray-800">{timeTaken}</p>
                        </div>
                    </div>

                     <div className="mt-6">
                         <div className="flex items-center justify-center gap-2 mb-3">
                            <UsersIcon className="w-5 h-5 text-gray-600" />
                            <h3 className="text-md font-bold text-gray-700">Teamet</h3>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            {team.map(member => (
                                <div key={member.id} className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200" title={member.name}>
                                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xs text-gray-600">
                                        {getInitials(member.name)}
                                    </div>
                                    <span className="font-medium text-sm text-gray-700">{member.name.split(' ')[0]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                 <footer className="p-4 mt-2">
                    <button 
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold shadow-sm"
                    >
                        Ferdig
                    </button>
                </footer>
            </div>
             <style>{`
                @keyframes fade-in-scale {
                    0% {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ScavengerHuntSuccessModal;
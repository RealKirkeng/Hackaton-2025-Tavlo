import React from 'react';
import { CloseIcon } from './Icons';

interface LearningObjectiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    subject: string;
    objectives: string[];
    onStartSession: (objective: string) => void;
}

const LearningObjectiveModal: React.FC<LearningObjectiveModalProps> = ({ isOpen, onClose, subject, objectives, onStartSession }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200">
                <header className="flex items-center justify-between p-4 border-b border-stone-200">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Start Live Økt</h2>
                        <p className="text-sm text-gray-600">Hva skal klassen lære i {subject} i dag?</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200">
                        <CloseIcon className="w-5 h-5 text-gray-600" />
                    </button>
                </header>

                <div className="p-6">
                    <h3 className="text-md font-semibold text-gray-700 mb-4">Velg dagens læremål:</h3>
                    {objectives.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {objectives.map(objective => (
                                <button
                                    key={objective}
                                    onClick={() => onStartSession(objective)}
                                    className="w-full text-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                                >
                                    {objective}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 bg-stone-100 p-4 rounded-md">
                            Ingen definerte læremål for dette faget.
                        </p>
                    )}
                </div>

                <footer className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-stone-200 border border-stone-300 transition-colors font-semibold"
                    >
                        Avbryt
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default LearningObjectiveModal;
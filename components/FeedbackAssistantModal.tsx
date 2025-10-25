
import React from 'react';
import { CloseIcon, MagicWandIcon } from './Icons';
import { Note } from '../data/content';
import { Feedback } from '../services/geminiService';

interface FeedbackAssistantModalProps {
    isOpen: boolean;
    onClose: () => void;
    note: Note | null;
    feedback: Feedback | null;
    isLoading: boolean;
    error: string | null;
    onGenerate: () => void;
}

const FeedbackSection: React.FC<{ title: string, items: string[], color: string }> = ({ title, items, color }) => (
    <div>
        <h4 className={`text-md font-semibold ${color} mb-2`}>{title}</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    </div>
);


const FeedbackAssistantModal: React.FC<FeedbackAssistantModalProps> = ({ isOpen, onClose, note, feedback, isLoading, error, onGenerate }) => {
    if (!isOpen || !note) return null;

    return (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 max-h-[90vh]">
                <header className="flex items-center justify-between p-4 border-b border-stone-200">
                     <h2 className="text-lg font-semibold text-gray-800">Tilbakemeldings-assistent</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200">
                        <CloseIcon className="w-5 h-5 text-gray-600" />
                    </button>
                </header>
                
                <div className="flex-grow p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Student's Note */}
                    <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                        <h3 className="font-bold text-gray-800 mb-2">{note.title}</h3>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.studentAnswer}</p>
                    </div>

                    {/* Feedback Section */}
                    <div>
                        {!feedback && !isLoading && !error && (
                             <div className="flex flex-col items-center justify-center h-full text-center">
                                <MagicWandIcon className="w-12 h-12 text-gray-400 mb-4"/>
                                <p className="text-gray-600">Klar til å generere konstruktiv tilbakemelding?</p>
                            </div>
                        )}
                         {isLoading && (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                <p className="mt-4 text-gray-600">Genererer forslag...</p>
                            </div>
                        )}
                        {error && !isLoading && (
                            <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
                                <h3 className="font-bold">Feil</h3>
                                <p>{error}</p>
                            </div>
                        )}
                        {feedback && !isLoading && !error && (
                            <div className="space-y-4">
                               <FeedbackSection title="👍 Hva var bra" items={feedback.positives} color="text-green-700" />
                               <FeedbackSection title="🤔 Hva kan forbedres" items={feedback.improvements} color="text-amber-700" />
                               <FeedbackSection title="❓ Spørsmål til refleksjon" items={feedback.questions} color="text-blue-700" />
                            </div>
                        )}
                    </div>
                </div>

                 <footer className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center">
                     <p className="text-xs text-gray-500">AI-generert innhold kan være unøyaktig.</p>
                    <button 
                        onClick={onGenerate}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-blue-300"
                    >
                        <MagicWandIcon className="w-5 h-5" />
                        {feedback ? 'Generer på nytt' : 'Generer Tilbakemelding'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default FeedbackAssistantModal;

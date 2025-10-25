
import React from 'react';
import { CloseIcon, ClipboardListIcon } from './Icons';
import { LessonPlan } from '../services/geminiService';

interface LessonPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: LessonPlan | null;
    isLoading: boolean;
    error: string | null;
}

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">{title}</h4>
        {children}
    </div>
);

const LessonPlanModal: React.FC<LessonPlanModalProps> = ({ isOpen, onClose, plan, isLoading, error }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 max-h-[90vh]">
                <header className="flex items-center justify-between p-4 border-b border-stone-200">
                    <div className="flex items-center gap-3">
                        <ClipboardListIcon className="w-6 h-6 text-blue-700" />
                        <h2 className="text-lg font-semibold text-gray-800">Leksjonsplan</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200">
                        <CloseIcon className="w-5 h-5 text-gray-600" />
                    </button>
                </header>
                
                <div className="flex-grow p-6 overflow-y-auto">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-600">Genererer leksjonsplan...</p>
                        </div>
                    )}
                    {error && !isLoading && (
                        <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
                            <h3 className="font-bold">Feil</h3>
                            <p>{error}</p>
                        </div>
                    )}
                    {plan && !isLoading && !error && (
                        <div className="space-y-6">
                            <Section title="Læringsmål">
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {plan.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                                </ul>
                            </Section>
                            <Section title="Aktiviteter">
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {plan.activities.map((act, i) => <li key={i}>{act}</li>)}
                                </ul>
                            </Section>
                            <Section title="Vurdering">
                                <p className="text-gray-700">{plan.assessment}</p>
                            </Section>
                        </div>
                    )}
                </div>
                 <footer className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                        Lukk
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default LessonPlanModal;

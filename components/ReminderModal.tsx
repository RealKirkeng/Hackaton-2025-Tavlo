import React from 'react';
import { ScheduleEvent } from '../data/content';
import { CloseIcon, ClockIcon } from './Icons';

interface ReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: ScheduleEvent | null;
    onGoToDashboard: () => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, event, onGoToDashboard }) => {
    if (!isOpen || !event) return null;

    return (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-24">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 animate-fade-in-down">
                <header className="flex items-center justify-between p-4 bg-blue-50 border-b border-blue-200">
                    <div className="flex items-center gap-3">
                        <ClockIcon className="w-6 h-6 text-blue-600"/>
                        <h2 className="text-lg font-semibold text-blue-800">Påminnelse</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-blue-100">
                        <CloseIcon className="w-5 h-5 text-blue-700" />
                    </button>
                </header>

                <div className="p-6 text-center">
                    <p className="text-gray-600">Neste time starter snart:</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{event.subject}</h3>
                    <p className="font-mono text-lg text-gray-700 mt-1">{event.time}</p>
                </div>

                 <footer className="p-4 bg-stone-50 border-t border-stone-200 flex justify-center gap-3">
                     <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-white text-gray-700 rounded-lg hover:bg-stone-200 border border-stone-300 transition-colors font-semibold"
                    >
                        Avbryt
                    </button>
                    <button 
                        onClick={onGoToDashboard}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm"
                    >
                        Gå til Dashbord
                    </button>
                </footer>
            </div>
            <style>{`
                @keyframes fade-in-down {
                    0% {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ReminderModal;

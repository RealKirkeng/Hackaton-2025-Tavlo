import React from 'react';
import { ClassStruggle } from '../data/content';
import { LightBulbIcon } from './Icons';

interface ClassStrugglesProps {
    struggles: ClassStruggle[];
    onAutoGroup: (struggle: ClassStruggle) => void;
}

const StruggleCard: React.FC<{ struggle: ClassStruggle, onAutoGroup: () => void }> = ({ struggle, onAutoGroup }) => {
    const handlePlanLecture = () => {
        alert(`En fellesforelesning for temaet "${struggle.topic}" er lagt til i kalenderen for neste time.`);
    };
    
    return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-grow">
                    <p className="text-sm font-semibold text-amber-800">{struggle.subject}</p>
                    <h4 className="text-lg font-bold text-gray-800 mt-1">{struggle.topic}</h4>
                    <p className="text-red-600 font-bold text-2xl mt-2">{struggle.strugglingPercentage}% 
                        <span className="text-sm text-gray-600 font-medium ml-2">av klassen sliter med dette</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{struggle.description}</p>
                </div>
                <div className="flex-shrink-0 flex flex-col md:items-end gap-2 w-full md:w-auto">
                     <button 
                        onClick={onAutoGroup}
                        className="w-full md:w-auto text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold shadow-sm"
                    >
                        Autogrupper elever
                    </button>
                    <button 
                        onClick={handlePlanLecture}
                        className="w-full md:w-auto text-sm px-4 py-2 bg-white text-blue-700 rounded-md hover:bg-blue-50 border border-blue-600 transition-colors font-semibold"
                    >
                        Planlegg fellesforelesning
                    </button>
                </div>
            </div>
        </div>
    );
};

const ClassStruggles: React.FC<ClassStrugglesProps> = ({ struggles, onAutoGroup }) => {
    if (struggles.length === 0) return null;

    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
                <LightBulbIcon className="w-6 h-6 text-amber-600"/>
                <h3 className="text-xl font-bold text-gray-800">Klassens Utfordringer</h3>
            </div>
            <div className="space-y-4">
                {struggles.map(struggle => (
                    <StruggleCard key={struggle.id} struggle={struggle} onAutoGroup={() => onAutoGroup(struggle)} />
                ))}
            </div>
        </div>
    );
};

export default ClassStruggles;
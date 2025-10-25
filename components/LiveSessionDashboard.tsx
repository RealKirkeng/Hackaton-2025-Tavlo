





import React, { useMemo } from 'react';
import { Student } from '../data/content';
import { UsersIcon, CloseIcon } from './Icons';
import { StudentProgress } from '../App';

interface LiveSessionDashboardProps {
    students: Student[];
    studentProgress: Record<string, StudentProgress>;
    learningObjective: string;
    onEndSession: () => void;
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
};

const StudentProgressItem: React.FC<{ student: Student; progress: number }> = ({ student, progress }) => (
    <div className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-stone-200">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center font-bold text-sm text-gray-600">
                {getInitials(student.name)}
            </div>
            <span className="font-medium text-gray-800">{student.name}</span>
        </div>
        <div className="flex items-center gap-3 w-1/2">
             <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-500 ease-linear" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-sm font-semibold text-gray-600 w-10 text-right">{progress}%</span>
        </div>
    </div>
);


const LiveSessionDashboard: React.FC<LiveSessionDashboardProps> = ({ students, studentProgress, learningObjective, onEndSession }) => {
    const overallProgress = useMemo(() => {
        const progressValues = Object.values(studentProgress);
        // FIX: Replaced reduce with a for...of loop to avoid type inference issues and fix the arithmetic error.
        let total = 0;
        for (const p of progressValues) {
            // FIX: Add type assertion for `p` to resolve `unknown` type from Object.values.
            total += (p as StudentProgress).completed.length;
        }
        
        if (progressValues.length === 0) {
            return 0;
        }

        return Math.round(total / progressValues.length);
    }, [studentProgress]);

    const progressColor = overallProgress > 70 ? 'bg-green-500' : overallProgress > 40 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <main className="flex-grow p-4 md:p-6 bg-stone-100 flex flex-col gap-6 overflow-hidden">
            <header className="flex-shrink-0 flex items-center justify-between pb-4 border-b border-stone-300">
                <div>
                    <h2 className="font-serif text-2xl md:text-3xl text-gray-800 font-semibold">Live Økt</h2>
                    <p className="text-gray-600">Dagens læremål: <span className="font-bold">{learningObjective}</span></p>
                </div>
                 <button 
                    onClick={onEndSession}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                    <CloseIcon className="w-5 h-5" />
                    Avslutt Økt
                </button>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-hidden">
                <div className="lg:col-span-2 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <UsersIcon className="w-6 h-6 text-gray-700"/>
                        <h3 className="text-xl font-bold text-gray-800">Elevprogresjon</h3>
                    </div>
                    <div className="space-y-2 flex-grow overflow-y-auto pr-2">
                        {students.map(student => (
                            <StudentProgressItem key={student.id} student={student} progress={(studentProgress[student.id]?.completed || []).length} />
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1 bg-white p-6 rounded-lg border border-stone-200 flex flex-col items-center justify-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Klasseforståelse</h3>
                     <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ease-linear ${progressColor}`} style={{ width: `${overallProgress}%` }}></div>
                    </div>
                    <p className="text-5xl font-bold text-gray-800 mt-4">{overallProgress}%</p>
                    <p className="text-gray-600 mt-1">Gjennomsnittlig fullføring</p>
                    {overallProgress < 50 && (
                        <div className="mt-6 text-center bg-amber-50 border border-amber-200 p-3 rounded-md">
                            <p className="text-sm text-amber-800 font-semibold">Dette kan være en utfordring for klassen.</p>
                            <p className="text-xs text-amber-700">Vurder å planlegge en fellesforelesning.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default LiveSessionDashboard;
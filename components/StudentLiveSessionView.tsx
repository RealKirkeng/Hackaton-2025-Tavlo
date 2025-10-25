import React from 'react';
import { QuestionSet } from '../data/content';
import { PauseIcon } from './Icons';

interface StudentLiveSessionViewProps {
  questionSet: QuestionSet;
  completedQuestions: string[];
  onProgressChange: (questionId: string, isCompleted: boolean) => void;
  isPaused: boolean;
}

const StudentLiveSessionView: React.FC<StudentLiveSessionViewProps> = ({ questionSet, completedQuestions, onProgressChange, isPaused }) => {
  return (
    <div className="flex-grow bg-blue-50 flex flex-col items-center justify-center p-4 md:p-8 relative">
        {isPaused && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center text-white p-4">
                <PauseIcon className="w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold">Økten er pauset</h2>
                <p className="mt-2 text-lg">Læreren gjennomgår et tema. Vennligst vent.</p>
            </div>
        )}
        <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-stone-200">
            <h1 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Dagens Oppgavesett</h1>
            <h2 className="mt-2 font-serif text-2xl md:text-3xl text-gray-800">
                {questionSet.title}
            </h2>
            <fieldset disabled={isPaused} className="mt-6 space-y-4">
                {questionSet.questions.map(q => (
                    <label 
                        key={q.id}
                        className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg border border-stone-200 has-[:checked]:bg-green-50 has-[:checked]:border-green-300 transition-colors cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                            checked={completedQuestions.includes(q.id)}
                            onChange={(e) => onProgressChange(q.id, e.target.checked)}
                        />
                        <span className="text-gray-700 text-md">{q.text}</span>
                    </label>
                ))}
            </fieldset>
        </div>
    </div>
  );
};

export default StudentLiveSessionView;
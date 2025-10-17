import React from 'react';
import { UserIcon, FolderIcon } from './Icons';

interface HomeViewProps {
  subjects: string[];
  onSelectSubject: (subject: string) => void;
}

const SubjectCard: React.FC<{ subject: string; onClick: () => void; }> = ({ subject, onClick }) => {
    return (
        <button 
            onClick={onClick} 
            className="w-full text-left bg-white p-5 rounded-lg border border-stone-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 flex items-center gap-4"
        >
            <FolderIcon className="w-7 h-7 text-blue-600 flex-shrink-0" />
            <h3 className="font-semibold text-lg text-gray-800 truncate">{subject}</h3>
        </button>
    );
};


const HomeView: React.FC<HomeViewProps> = ({ subjects, onSelectSubject }) => {
  return (
    <main className="flex-grow p-4 md:p-8 overflow-y-auto bg-stone-100 flex flex-col">
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-stone-300">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center ring-2 ring-white">
            <UserIcon className="w-9 h-9 text-gray-600" />
        </div>
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Velkommen!</h2>
            <p className="text-gray-600 mt-1">Dine fag er klare for deg.</p>
        </div>
      </div>
      
      {/* Subjects Section */}
      <div>
        <h3 className="font-serif text-2xl text-gray-800 font-semibold mb-4">Mine Fag</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(subject => (
              <SubjectCard key={subject} subject={subject} onClick={() => onSelectSubject(subject)} />
            ))}
        </div>
      </div>
    </main>
  );
};

export default HomeView;
import React from 'react';
import { BookOpenIcon, CloseIcon } from './Icons';
import { subjectContent } from '../data/content';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubject: (subject: string) => void;
  activeSubject: string;
}

const subjects = Object.keys(subjectContent);

const MenuItem: React.FC<{ children: React.ReactNode; onClick: () => void; isActive: boolean }> = ({ children, onClick, isActive }) => (
    <button 
        onClick={onClick}
        className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-md font-medium ${
            isActive 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-stone-200 hover:text-black'
        }`}
    >
        {children}
    </button>
);

const Menu: React.FC<MenuProps> = ({ isOpen, onClose, onSelectSubject, activeSubject }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 z-20 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      
      {/* Menu Panel */}
      <div
        className={`absolute top-0 left-0 h-full w-72 bg-stone-100 shadow-xl z-30 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <header className="flex-shrink-0 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between border-b border-stone-200">
            <div className="flex items-center gap-3">
                <BookOpenIcon className="w-6 h-6 text-gray-700"/>
                <h1 className="text-xl font-semibold text-gray-800">Tavlo</h1>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                <CloseIcon className="w-5 h-5 text-gray-600" />
            </button>
        </header>
        
        <nav className="flex-grow p-4 space-y-2">
            <h2 className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">Subjects</h2>
            {subjects.map((subject) => (
                <MenuItem 
                    key={subject}
                    onClick={() => onSelectSubject(subject)}
                    isActive={activeSubject === subject}
                >
                    {subject}
                </MenuItem>
            ))}
        </nav>

        <footer className="p-4 border-t border-stone-200">
            <p className="text-xs text-center text-gray-500">Tavlo Digital Notebook</p>
        </footer>
      </div>
    </>
  );
};

export default Menu;

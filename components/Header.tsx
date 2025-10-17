import React from 'react';
import { MenuIcon, UserIcon, WifiIcon, BackIcon } from './Icons';

interface HeaderProps {
  onMenuClick: () => void;
  isNoteView: boolean;
  onBackClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isNoteView, onBackClick }) => {
  return (
    <header className="flex-shrink-0 bg-stone-100 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between border-b border-stone-200">
      <div className="flex items-center gap-4">
        {isNoteView ? (
           <button onClick={onBackClick} className="text-gray-600 hover:text-black">
            <BackIcon className="w-6 h-6" />
          </button>
        ) : (
          <button onClick={onMenuClick} className="text-gray-600 hover:text-black">
            <MenuIcon className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-semibold text-gray-800">Tavlo</h1>
      </div>
      <div className="flex items-center gap-4 text-gray-500">
        <WifiIcon className="w-5 h-5" />
        <span className="text-sm font-medium">98%</span>
        <button className="text-gray-600 hover:text-black">
          <UserIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;

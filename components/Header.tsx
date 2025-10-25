import React from 'react';
import { MenuIcon, UserIcon, WifiIcon, BackIcon, SearchIcon } from './Icons';

interface HeaderProps {
  onMenuClick: () => void;
  showBackButton: boolean;
  onBackClick: () => void;
  viewMode: 'student' | 'teacher';
  onProfileClick: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isSearchVisible?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, showBackButton, onBackClick, viewMode, onProfileClick, searchQuery, onSearchChange, isSearchVisible }) => {
  return (
    <header className="flex-shrink-0 bg-stone-100 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between gap-4 border-b border-stone-200">
      <div className="flex items-center gap-4">
        {showBackButton ? (
           <button onClick={onBackClick} className="text-gray-600 hover:text-black">
            <BackIcon className="w-6 h-6" />
          </button>
        ) : (
          <button onClick={onMenuClick} className="text-gray-600 hover:text-black">
            <MenuIcon className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">Tavlo</h1>
      </div>

      {isSearchVisible && (
        <div className="relative flex-1 max-w-md mx-auto">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Søk i alle notater..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full bg-stone-200/80 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      )}

      <div className="flex items-center gap-4 text-gray-500">
        <WifiIcon className="w-5 h-5" />
        <span className="text-sm font-medium">98%</span>
        <button 
          onClick={onProfileClick}
          className="text-gray-600 hover:text-black"
          aria-label={viewMode === 'teacher' ? 'Filter subjects' : 'User profile'}
        >
          <UserIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { PencilIcon, HighlighterIcon, EraserIcon, ShareIcon, ChatIcon } from './Icons';

interface ToolbarProps {
  onChatClick: () => void;
}

const ToolbarButton: React.FC<{ children: React.ReactNode; onClick?: () => void; isActive?: boolean }> = ({ children, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-lg transition-colors ${
      isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-200 hover:text-black'
    }`}
  >
    {children}
  </button>
);

const Toolbar: React.FC<ToolbarProps> = ({ onChatClick }) => {
  return (
    <footer className="flex-shrink-0 bg-stone-100/80 backdrop-blur-sm border-t border-stone-200 p-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        <ToolbarButton isActive={true}>
          <PencilIcon className="w-7 h-7" />
        </ToolbarButton>
        <ToolbarButton>
          <HighlighterIcon className="w-7 h-7" />
        </ToolbarButton>
        <ToolbarButton>
          <EraserIcon className="w-7 h-7" />
        </ToolbarButton>
        <ToolbarButton>
          <ShareIcon className="w-7 h-7" />
        </ToolbarButton>
        <div className="w-px h-8 bg-stone-300 mx-2"></div>
        <ToolbarButton onClick={onChatClick}>
          <ChatIcon className="w-7 h-7" />
        </ToolbarButton>
      </div>
    </footer>
  );
};

export default Toolbar;

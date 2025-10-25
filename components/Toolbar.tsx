


import React from 'react';
import { PenIcon, EraserIcon, ShareIcon, ChatIcon, CpuChipIcon, CheckCircleIcon } from './Icons';
import { Tool } from '../App';

interface ToolbarProps {
  onChatClick: () => void;
  activeTool: Tool;
  onToolClick: (tool: Tool) => void;
  onShareClick: () => void;
  penColor: string;
  onPenColorChange: (color: string) => void;
  penSize: number;
  onPenSizeChange: (size: number) => void;
  onRecognizeText: () => void;
  isRecognizingText: boolean;
  hasDrawing: boolean;
  isTaskNote?: boolean;
  isSubmitted?: boolean;
  onSubmit?: () => void;
}

const ToolbarButton: React.FC<{ 
    children: React.ReactNode; 
    onClick?: () => void; 
    isActive?: boolean, 
    'aria-label': string,
    disabled?: boolean 
}> = ({ children, onClick, isActive, 'aria-label': ariaLabel, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={`p-3 rounded-lg transition-colors flex items-center justify-center w-12 h-12 ${
      isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-200 hover:text-black'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

const Toolbar: React.FC<ToolbarProps> = ({ onChatClick, activeTool, onToolClick, onShareClick, penColor, onPenColorChange, penSize, onPenSizeChange, onRecognizeText, isRecognizingText, hasDrawing, isTaskNote, isSubmitted, onSubmit }) => {
  const penColors = ['#333333', '#ef4444', '#3b82f6', '#22c55e'];
  const penSizes = [5, 10, 20];

  return (
    <footer className="flex-shrink-0 bg-stone-100/80 backdrop-blur-sm border-t border-stone-200 p-2">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-1">
        {/* Left side: Tools and options */}
        <div className="flex items-center gap-2">
            <ToolbarButton 
                isActive={activeTool === 'pencil'} 
                onClick={() => onToolClick('pencil')}
                aria-label="Pen Tool"
            >
                <PenIcon className="w-6 h-6" />
            </ToolbarButton>
            <ToolbarButton 
                isActive={activeTool === 'eraser'}
                onClick={() => onToolClick('eraser')}
                aria-label="Eraser Tool"
            >
                <EraserIcon className="w-6 h-6" />
            </ToolbarButton>
            
            <ToolbarButton
                onClick={onRecognizeText}
                disabled={isRecognizingText || !hasDrawing}
                aria-label="Recognize Handwriting"
            >
                {isRecognizingText ? (
                    <div className="w-6 h-6 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin"></div>
                ) : (
                    <CpuChipIcon className="w-6 h-6" />
                )}
            </ToolbarButton>

            <div className="w-px h-8 bg-stone-300 mx-1"></div>
            
            {/* Colors */}
            <div className="flex items-center gap-2">
                {penColors.map(color => (
                    <button
                        key={color}
                        onClick={() => onPenColorChange(color)}
                        disabled={activeTool !== 'pencil'}
                        className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${penColor === color && activeTool === 'pencil' ? 'ring-2 ring-offset-1 ring-offset-stone-100 ring-blue-500' : ''} disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                    />
                ))}
            </div>

            <div className="w-px h-8 bg-stone-300 mx-1"></div>

            {/* Sizes */}
            <div className="flex items-center gap-1">
                {penSizes.map(size => (
                    <button
                        key={size}
                        onClick={() => onPenSizeChange(size)}
                        disabled={activeTool !== 'pencil'}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed ${penSize === size && activeTool === 'pencil' ? 'bg-blue-100' : 'hover:bg-stone-200'}`}
                        aria-label={`Select pen size ${size}px`}
                    >
                        <span className="flex items-center justify-center rounded-full bg-gray-700" style={{ width: `${size/2 + 4}px`, height: `${size/2 + 4}px` }}></span>
                    </button>
                ))}
            </div>
        </div>
        
        {/* Right side: Action Buttons */}
        <div className="flex items-center gap-1">
            {isTaskNote && (
              <>
                <button
                  onClick={onSubmit}
                  disabled={isSubmitted}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isSubmitted 
                      ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSubmitted && <CheckCircleIcon className="w-5 h-5" />}
                  {isSubmitted ? 'Levert' : 'Lever inn'}
                </button>
                <div className="w-px h-8 bg-stone-300 mx-1"></div>
              </>
            )}
            <ToolbarButton 
                onClick={onShareClick}
                aria-label="Share Note"
            >
                <ShareIcon className="w-6 h-6" />
            </ToolbarButton>
            <div className="w-px h-8 bg-stone-300 mx-1"></div>
            <ToolbarButton 
                onClick={onChatClick}
                aria-label="Open AI Assistant"
            >
                <ChatIcon className="w-6 h-6" />
            </ToolbarButton>
        </div>
      </div>
    </footer>
  );
};

export default Toolbar;
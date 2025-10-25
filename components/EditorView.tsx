

import React from 'react';
import Editor from './Editor';
import { Tool } from '../App';

interface EditorViewProps {
  title: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  activeTool: Tool;
  drawingData: string;
  onDrawingChange: (data: string) => void;
  penColor: string;
  penSize: number;
  isRecognizingText: boolean;
}

const EditorView: React.FC<EditorViewProps> = ({ title, value, onChange, onTitleChange, activeTool, drawingData, onDrawingChange, penColor, penSize, isRecognizingText }) => {
  return (
    <main className="flex-grow p-4 md:p-8 overflow-y-auto bg-stone-100 flex flex-col">
      <div className="mb-6 pb-4 border-b border-stone-300">
        <input
          type="text"
          value={title}
          onChange={onTitleChange}
          className="font-serif text-2xl md:text-3xl text-gray-800 font-semibold bg-transparent border-none focus:ring-0 w-full p-0"
          placeholder="Gi notatet en tittel..."
        />
      </div>
      <div className="flex-grow relative">
          {isRecognizingText && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600 font-semibold">Gjenkjenner tekst...</p>
              </div>
          )}
          <Editor 
            value={value} 
            onChange={onChange} 
            activeTool={activeTool}
            drawingData={drawingData}
            onDrawingChange={onDrawingChange}
            penColor={penColor}
            penSize={penSize}
          />
      </div>
    </main>
  );
};

export default EditorView;
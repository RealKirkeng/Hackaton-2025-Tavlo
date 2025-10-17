import React from 'react';
import Editor from './Editor';

interface EditorViewProps {
  question: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const EditorView: React.FC<EditorViewProps> = ({ question, value, onChange }) => {
  return (
    <main className="flex-grow p-4 md:p-8 overflow-y-auto bg-stone-100 flex flex-col">
      <div className="mb-6 pb-4 border-b border-stone-300">
        <h2 className="font-serif text-2xl md:text-3xl text-gray-800 font-semibold">{question}</h2>
      </div>
      <div className="flex-grow">
          <Editor value={value} onChange={onChange} />
      </div>
    </main>
  );
};

export default EditorView;

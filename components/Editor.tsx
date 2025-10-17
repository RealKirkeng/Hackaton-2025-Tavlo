
import React from 'react';

interface EditorProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  return (
    <textarea
      className="w-full h-full bg-transparent border-none focus:ring-0 resize-none font-serif text-xl md:text-2xl text-gray-800 leading-loose"
      value={value}
      onChange={onChange}
      placeholder="Start writing..."
    />
  );
};

export default Editor;

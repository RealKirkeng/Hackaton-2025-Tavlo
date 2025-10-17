import React from 'react';
import { Note } from '../data/content';
import { PlusIcon } from './Icons';

interface SubjectViewProps {
  subject: string;
  notes: Note[];
  onSelectNote: (noteId: string) => void;
  onNewNote: () => void;
}

const NoteCard: React.FC<{ note: Note; onClick: () => void; }> = ({ note, onClick }) => {
    const formattedDate = new Date(note.date).toLocaleDateString('nb-NO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <button onClick={onClick} className="w-full text-left bg-white p-4 rounded-lg border border-stone-200 hover:border-blue-500 hover:shadow-md transition-all duration-200">
            <p className="text-sm text-gray-500 mb-1">{formattedDate}</p>
            <h3 className="font-semibold text-gray-800 truncate">{note.question}</h3>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{note.studentAnswer}</p>
        </button>
    );
};

const SubjectView: React.FC<SubjectViewProps> = ({ subject, notes, onSelectNote, onNewNote }) => {
  // Sort notes by date, newest first
  const sortedNotes = [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="flex-grow p-4 md:p-8 overflow-y-auto bg-stone-100 flex flex-col">
      <header className="mb-6 pb-4 border-b border-stone-300 flex items-center justify-between">
        <h2 className="font-serif text-2xl md:text-3xl text-gray-800 font-semibold">{subject}</h2>
        <button 
            onClick={onNewNote}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
            <PlusIcon className="w-5 h-5" />
            Nytt Notat
        </button>
      </header>
      <div className="flex-grow">
        {sortedNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedNotes.map(note => (
              <NoteCard key={note.id} note={note} onClick={() => onSelectNote(note.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-16">
            <p>Ingen notater i dette faget ennå.</p>
            <p>Klikk på "Nytt Notat" for å starte.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default SubjectView;

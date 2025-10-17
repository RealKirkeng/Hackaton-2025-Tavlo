import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import EditorView from './components/EditorView';
import Toolbar from './components/Toolbar';
import AiChat from './components/AiChat';
import Menu from './components/Menu';
import SubjectView from './components/SubjectView';
import HomeView from './components/HomeView';
import { subjectContent as initialSubjectContent, Note } from './data/content';

const App: React.FC = () => {
  const [subjectContent, setSubjectContent] = useState(initialSubjectContent);
  const [currentSubject, setCurrentSubject] = useState<string>("Hjem");
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(subjectContent["Hjem"].notes[0].id);

  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleSelectSubject = (subject: string) => {
    setCurrentSubject(subject);
    // When changing subjects, go to the subject view, not a specific note
    setCurrentNoteId(subject === "Hjem" ? subjectContent["Hjem"].notes[0].id : null);
    setIsMenuOpen(false);
  };

  const handleSelectNote = (noteId: string) => {
    setCurrentNoteId(noteId);
  };

  const handleNoteChange = (noteId: string, newText: string) => {
    setSubjectContent(prevContent => {
      const newSubjectData = { ...prevContent[currentSubject] };
      const noteIndex = newSubjectData.notes.findIndex(n => n.id === noteId);
      if (noteIndex > -1) {
        const updatedNotes = [...newSubjectData.notes];
        updatedNotes[noteIndex] = { ...updatedNotes[noteIndex], studentAnswer: newText };
        return {
          ...prevContent,
          [currentSubject]: { ...newSubjectData, notes: updatedNotes }
        };
      }
      return prevContent;
    });
  };

  const handleNewNote = () => {
    const newNote: Note = {
      id: `${currentSubject.toLowerCase()}-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      question: "Nytt Notat",
      studentAnswer: "Begynn å skrive her..."
    };
    setSubjectContent(prevContent => {
       const updatedNotes = [newNote, ...prevContent[currentSubject].notes];
       return {
         ...prevContent,
         [currentSubject]: { ...prevContent[currentSubject], notes: updatedNotes }
       }
    });
    setCurrentNoteId(newNote.id);
  }

  const currentNote = useMemo(() => {
    if (!currentSubject || !currentNoteId || currentSubject === "Hjem") return null;
    return subjectContent[currentSubject]?.notes.find(n => n.id === currentNoteId) || null;
  }, [currentSubject, currentNoteId, subjectContent]);

  const documentContext = currentNote ? currentNote.studentAnswer : '';
  
  const navigateBackToSubject = () => {
    setCurrentNoteId(null);
  }

  return (
    <div className="bg-stone-200 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] max-h-[1200px] bg-black rounded-3xl shadow-2xl p-2 md:p-4 flex flex-col overflow-hidden border-4 border-gray-800">
        <div className="flex-grow bg-stone-100 rounded-2xl flex flex-col relative overflow-hidden">
          <Menu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)}
            onSelectSubject={handleSelectSubject}
            activeSubject={currentSubject}
          />
          <Header 
            onMenuClick={() => setIsMenuOpen(true)}
            isNoteView={!!currentNoteId && currentSubject !== "Hjem"}
            onBackClick={navigateBackToSubject}
          />

          {currentSubject === "Hjem" ? (
            <HomeView 
              subjects={Object.keys(subjectContent).filter(s => s !== "Hjem")}
              onSelectSubject={handleSelectSubject}
            />
          ) : currentNote ? (
            <EditorView
              key={currentNote.id} // Add key to force re-mount on note change
              question={currentNote.question}
              value={currentNote.studentAnswer}
              onChange={(e) => handleNoteChange(currentNote.id, e.target.value)}
            />
          ) : (
            <SubjectView 
              subject={currentSubject}
              notes={subjectContent[currentSubject]?.notes || []}
              onSelectNote={handleSelectNote}
              onNewNote={handleNewNote}
            />
          )}

          <Toolbar onChatClick={() => setIsAiChatOpen(true)} />
          <AiChat
            isOpen={isAiChatOpen}
            onClose={() => setIsAiChatOpen(false)}
            documentContext={documentContext}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
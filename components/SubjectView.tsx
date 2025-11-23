

import React, { useState } from 'react';
import { Note, Objective, GroupGame } from '../data/content';
import { PlusIcon, SparklesIcon, ClipboardIcon, CpuChipIcon, PlayCircleIcon, CheckCircleIcon } from './Icons';
import KaiLiveView from './KaiLiveView';

type Tab = 'notes' | 'objectives' | 'games' | 'kai';

interface SubjectViewProps {
  subject: string;
  notes: Note[];
  objectives: Objective[];
  groupGames: GroupGame[];
  onSelectNote: (noteId: string) => void;
  onNewNote: () => void;
  onStartGroupGame: (game: GroupGame) => void;
  onStartObjective: (objective: Objective) => void;
  isKaiVoiceEnabled: boolean;
  objectiveFilters: Record<string, string[]>;
  onObjectiveFilterChange: (subject: string, theme: string) => void;
  onGenerateAdaptiveGame: (subject: string) => void;
  isGeneratingGame: boolean;
  gameGenerationError: string | null;
}

const NoteCard: React.FC<{ note: Note; onClick: () => void; }> = ({ note, onClick }) => {
    const formattedDate = new Date(note.date).toLocaleDateString('nb-NO', {
        day: 'numeric',
        month: 'long',
    });

    return (
        <button onClick={onClick} className="w-full text-left bg-white p-4 rounded-lg border border-stone-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 flex flex-col">
            <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-500">{formattedDate}</p>
                {note.isTeacherNote && (
                    <span className="text-xs bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full">Fra Lærer</span>
                )}
            </div>
            <h3 className="font-semibold text-gray-800 truncate mt-1">{note.title}</h3>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2 flex-grow">{note.studentAnswer}</p>
        </button>
    );
};

const ObjectiveCard: React.FC<{
  objective: Objective;
  themeColor: string;
  onStart: () => void;
  onContinue: () => void;
  linkedNote: Note | undefined;
}> = ({ objective, themeColor, onStart, onContinue, linkedNote }) => {
  const isStarted = !!linkedNote;
  const isSubmitted = linkedNote?.isSubmitted;

  const buttonAction = isStarted ? onContinue : onStart;
  const buttonText = isSubmitted ? "Levert" : isStarted ? "Fortsett" : "Start oppgave";
  const buttonIcon = isSubmitted ? <CheckCircleIcon className="w-5 h-5" /> : <PlayCircleIcon className="w-5 h-5" />;

  return (
    <div className={`w-full flex flex-col gap-4 bg-white p-4 rounded-lg border border-stone-200 border-l-4 ${themeColor}`}>
        <div className="flex items-start gap-4">
            <ClipboardIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <p className="text-gray-800 flex-grow">{objective.text}</p>
        </div>
        <div className="self-end">
            <button
              onClick={buttonAction}
              disabled={isSubmitted}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                isSubmitted 
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {buttonIcon}
              {buttonText}
            </button>
        </div>
    </div>
  );
};

const GameCard: React.FC<{ game: GroupGame, onStart: () => void }> = ({ game, onStart }) => (
    <div className="w-full text-left bg-white p-4 rounded-lg border border-stone-200 flex flex-col items-start relative">
        {game.isAiGenerated && (
            <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1" title="AI-generert spill">
                <CpuChipIcon className="w-4 h-4" />
                <span>AI</span>
            </div>
        )}
        <div className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-amber-500" />
            <h3 className="font-semibold text-lg text-gray-800">{game.title}</h3>
        </div>
        <p className="text-sm text-gray-600 mt-2 flex-grow">En morsom og interaktiv måte å lære på. Løs gåter med laget ditt!</p>
        <button 
            onClick={onStart}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold self-start"
        >
            Start {game.title}
        </button>
    </div>
);

const AiGameGeneratorCard: React.FC<{ onClick: () => void, isLoading: boolean, error: string | null }> = ({ onClick, isLoading, error }) => (
    <div className="w-full text-left bg-blue-50 p-4 rounded-lg border-2 border-dashed border-blue-300 flex flex-col items-center justify-center text-center">
        <SparklesIcon className="w-10 h-10 text-blue-500" />
        <h3 className="font-semibold text-lg text-gray-800 mt-2">Lag et personlig spill</h3>
        <p className="text-sm text-gray-600 mt-1 mb-4">La KAI lage et unikt spill basert på dine notater og læringsmål.</p>
        
        {isLoading ? (
             <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg font-semibold w-full cursor-not-allowed">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Lager spill...</span>
            </div>
        ) : (
            <button 
                onClick={onClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
                Start generering
            </button>
        )}
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
);


const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            isActive
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:bg-stone-200/70'
        }`}
    >
        {children}
    </button>
);

// FIX: Moved themeColors and defaultColor outside of the component to prevent re-creation on each render.
const themeColors: Record<string, { border: string, bg: string }> = {
    // Matte
    'Geometri': { border: 'border-blue-500', bg: 'bg-blue-500' },
    'Areal': { border: 'border-green-500', bg: 'bg-green-500' },
    'Eksponenter': { border: 'border-red-500', bg: 'bg-red-500' },
    // Norsk
    'Dikt analyse': { border: 'border-purple-500', bg: 'bg-purple-500' },
    'Tekstproduksjon': { border: 'border-pink-500', bg: 'bg-pink-500' },
    // English
    'Vocabulary': { border: 'border-teal-500', bg: 'bg-teal-500' },
    'Creative Writing': { border: 'border-orange-500', bg: 'bg-orange-500' },
    'Grammar': { border: 'border-cyan-500', bg: 'bg-cyan-500' },
    // Samfunnsfag
    'Demokrati': { border: 'border-yellow-500', bg: 'bg-yellow-500' },
    // Naturfag
    'Biologi': { border: 'border-lime-500', bg: 'bg-lime-500' },
    'Kjemi': { border: 'border-indigo-500', bg: 'bg-indigo-500' },
    'Astronomi': { border: 'border-sky-500', bg: 'bg-sky-500' },
    // KRLE
    'Kristendom': { border: 'border-fuchsia-500', bg: 'bg-fuchsia-500' },
    'Islam': { border: 'border-emerald-500', bg: 'bg-emerald-500' },
    'Etikk': { border: 'border-rose-500', bg: 'bg-rose-500' },
};
const defaultColor = { border: 'border-stone-300', bg: 'bg-stone-300' };

const SubjectView: React.FC<SubjectViewProps> = ({ 
    subject, notes, objectives, groupGames, onSelectNote, onNewNote, onStartGroupGame, 
    isKaiVoiceEnabled, objectiveFilters, onObjectiveFilterChange, onStartObjective,
    onGenerateAdaptiveGame, isGeneratingGame, gameGenerationError
 }) => {
  const [activeTab, setActiveTab] = useState<Tab>('notes');
  
  const sortedNotes = [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const renderContent = () => {
    switch (activeTab) {
        case 'notes':
            return (
                <>
                    <div className="flex items-center justify-end mb-4">
                        <button 
                            onClick={onNewNote}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Nytt Notat
                        </button>
                    </div>
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
                </>
            );
        case 'objectives':
             const allThemes = Array.from(new Set(objectives.map((obj: Objective) => obj.theme)));
             // FIX: Add type assertion to `subject` to prevent "Type 'unknown' cannot be used as an index type." error under strict TypeScript configurations.
             const activeFilters = objectiveFilters[subject as string] || [];
             const filteredObjectives = objectives.filter((obj: Objective) => 
                 activeFilters.length === 0 || activeFilters.includes(obj.theme)
             );

             return (
                <>
                    {/* Filter Bar */}
                    {allThemes.length > 0 && (
                        <div className="flex items-center gap-2 mb-6 flex-wrap pb-4 border-b border-stone-200">
                             <span className="text-sm font-semibold text-gray-500 mr-2">Filter:</span>
                            {allThemes.map(theme => {
                                const isActive = activeFilters.includes(theme);
                                const color = themeColors[theme] || defaultColor;
                                return (
                                    <button
                                        key={theme}
                                        onClick={() => onObjectiveFilterChange(subject, theme)}
                                        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-full transition-colors border ${
                                            isActive
                                                ? `${color.bg} text-white border-transparent shadow-sm`
                                                : 'bg-white text-gray-600 border-stone-300 hover:bg-stone-100 hover:border-stone-400'
                                        }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white/70' : color.bg}`}></span>
                                        {theme}
                                    </button>
                                )
                            })}
                            {activeFilters.length > 0 && (
                                <button
                                    onClick={() => onObjectiveFilterChange(subject, '')} // Special case to clear filters
                                    className="px-3 py-1.5 text-xs text-blue-600 hover:text-red-600 hover:underline"
                                >
                                    Tøm filter
                                </button>
                            )}
                        </div>
                    )}

                    {/* Objectives List */}
                    {filteredObjectives.length > 0 ? (
                        <div className="space-y-4">
                            {filteredObjectives.map((obj: Objective) => {
                               const color = themeColors[obj.theme] || defaultColor;
                               const linkedNote = notes.find(note => note.objectiveId === obj.id);
                               return (
                                   <ObjectiveCard 
                                       key={obj.id} 
                                       objective={obj} 
                                       themeColor={color.border}
                                       linkedNote={linkedNote}
                                       onStart={() => onStartObjective(obj)}
                                       onContinue={() => onSelectNote(linkedNote!.id)}
                                   />
                               );
                            })}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 mt-16">
                            <p>{activeFilters.length > 0 ? 'Ingen oppgaver matcher de valgte filtrene.' : 'Ingen oppgaver eller læremål er definert for dette faget ennå.'}</p>
                        </div>
                    )}
                </>
            );
        case 'games':
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AiGameGeneratorCard 
                        onClick={() => onGenerateAdaptiveGame(subject)}
                        isLoading={isGeneratingGame}
                        error={gameGenerationError}
                    />
                    {groupGames.map(game => (
                         <GameCard key={game.id} game={game} onStart={() => onStartGroupGame(game)} />
                    ))}
                </div>
            );
        case 'kai':
            return <KaiLiveView subject={subject} />;
        default:
            return null;
    }
  }

  return (
    <main className="flex-grow p-4 md:p-8 overflow-y-auto bg-stone-100 flex flex-col">
      <header className="mb-6 pb-4 border-b border-stone-300">
        <h2 className="font-serif text-2xl md:text-3xl text-gray-800 font-semibold">{subject}</h2>
      </header>
      
      <div className="flex-shrink-0 mb-6 bg-stone-200/80 p-1 rounded-lg flex items-center gap-2 self-start flex-wrap">
          <TabButton isActive={activeTab === 'notes'} onClick={() => setActiveTab('notes')}>Notater</TabButton>
          <TabButton isActive={activeTab === 'objectives'} onClick={() => setActiveTab('objectives')}>Oppgaver</TabButton>
          <TabButton isActive={activeTab === 'games'} onClick={() => setActiveTab('games')}>Gruppespill</TabButton>
          {isKaiVoiceEnabled && (
            <TabButton isActive={activeTab === 'kai'} onClick={() => setActiveTab('kai')}>Snakk med KAI</TabButton>
          )}
      </div>

      <div className="flex-grow">
        {renderContent()}
      </div>
    </main>
  );
};

export default SubjectView;
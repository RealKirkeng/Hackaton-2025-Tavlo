// FIX: Import `useEffect` from React to fix the "Cannot find name 'useEffect'" error.
import React, { useMemo, useState, useEffect } from 'react';
import { Student, ClassStruggle, QuestionSet, Class } from '../data/content';
import { UsersIcon, FolderIcon, PlayCircleIcon, CloseIcon, LightBulbIcon, PauseIcon, CheckCircleIcon, XCircleIcon, ClipboardListIcon, ChevronDownIcon, BookOpenIcon } from './Icons';
import ClassStruggles from './ClassStruggles';
import { StudentProgress } from '../App';

interface TeacherViewProps {
  students: Student[];
  classes: Class[];
  allSubjects: string[];
  selectedClassId: string | null;
  selectedSubject: string | null;
  onSelectClass: (classId: string) => void;
  onSelectSubject: (subject: string) => void;
  classStruggles: ClassStruggle[];
  onSelectStudent: (studentId: string) => void;
  onAutoGroup: (struggle: ClassStruggle) => void;
  isLiveSessionActive: boolean;
  questionSets: QuestionSet[];
  onStartLiveSession: (questionSetId: string) => void;
  onEndLiveSession: () => void;
  studentProgress: Record<string, StudentProgress>;
  activeQuestionSet: QuestionSet | null;
  isSessionPaused: boolean;
  collectiveStruggle: { questionId: string; studentIds: string[] } | null;
  onPauseSession: () => void;
  onResumeSession: () => void;
  isKaiVoiceEnabled: boolean;
  onToggleKaiVoice: () => void;
  onGenerateLessonPlan: (subject: string, topic: string, numLessons: number) => void;
  onDistributeNote: (subject: string, title: string, content: string) => void;
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const StudentListItem: React.FC<{ student: Student; onClick: () => void; }> = ({ student, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-stone-200 hover:border-blue-500 hover:shadow-sm transition-all duration-150">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center font-bold text-sm text-gray-600">
                {getInitials(student.name)}
            </div>
            <span className="font-medium text-gray-800">{student.name}</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">{student.progress}%</span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${student.progress}%` }}></div>
            </div>
        </div>
    </button>
);

const LiveStudentProgressItem: React.FC<{ student: Student; progress: StudentProgress; questions: QuestionSet['questions'] }> = ({ student, progress, questions }) => (
    <div className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-stone-200">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center font-bold text-sm text-gray-600">
                {getInitials(student.name)}
            </div>
            <span className="font-medium text-gray-800">{student.name}</span>
        </div>
        <div className="flex items-center gap-2">
            {questions.map(q => {
                const isCompleted = progress.completed.includes(q.id);
                const hasStruggled = progress.struggled.includes(q.id);
                if (hasStruggled) {
                    return <XCircleIcon key={q.id} className="w-6 h-6 text-red-500" title={`Struggled with: ${q.text}`} />;
                }
                if (isCompleted) {
                    return <CheckCircleIcon key={q.id} className="w-6 h-6 text-green-500" title={`Completed: ${q.text}`} />;
                }
                return <div key={q.id} className="w-6 h-6 rounded-full bg-stone-200" title={`Not started: ${q.text}`}></div>
            })}
        </div>
    </div>
);

const QuestionSetCard: React.FC<{ set: QuestionSet; onStart: () => void }> = ({ set, onStart }) => (
    <div className="bg-white p-4 rounded-lg border border-stone-200 flex flex-col">
        <p className="text-sm font-semibold text-blue-700">{set.subject}</p>
        <h4 className="font-bold text-gray-800 mt-1">{set.title}</h4>
        <ul className="text-sm text-gray-600 mt-2 list-disc list-inside space-y-1">
            {set.questions.map(q => <li key={q.id}>{q.text}</li>)}
        </ul>
        <button
            onClick={onStart}
            className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
            <PlayCircleIcon className="w-5 h-5" />
            Start Økt
        </button>
    </div>
);

const CollectiveStruggleAlert: React.FC<{
    struggle: { questionId: string; studentIds: string[] };
    questionSet: QuestionSet;
    totalStudents: number;
    onPause: () => void;
}> = ({ struggle, questionSet, totalStudents, onPause }) => {
    const question = questionSet.questions.find(q => q.id === struggle.questionId);
    if (!question) return null;

    const percentage = Math.round((struggle.studentIds.length / totalStudents) * 100);

    return (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-grow">
                     <div className="flex items-center gap-2">
                        <LightBulbIcon className="w-6 h-6 text-amber-600"/>
                        <h3 className="text-lg font-bold text-gray-800">Felles Utfordring</h3>
                    </div>
                    <p className="text-red-600 font-bold text-2xl mt-2">{percentage}% 
                        <span className="text-sm text-gray-600 font-medium ml-2">av klassen sliter med:</span>
                    </p>
                    <p className="text-md text-gray-800 mt-1 font-semibold">"{question.text}"</p>
                </div>
                <div className="flex-shrink-0">
                     <button 
                        onClick={onPause}
                        className="w-full md:w-auto text-sm px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors font-semibold shadow-sm flex items-center gap-2"
                    >
                        <PauseIcon className="w-5 h-5" />
                        Pauser og gjennomgå
                    </button>
                </div>
            </div>
        </div>
    );
};

const TeachingMomentOverlay: React.FC<{
    question: any; // Question type
    onClose: () => void;
}> = ({ question, onClose }) => (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 border-4 border-blue-500">
            <h2 className="text-center text-sm font-semibold text-blue-600 uppercase tracking-wider">Undervisningsøyeblikk</h2>
            <p className="text-center font-serif text-2xl text-gray-800 mt-4">"{question.text}"</p>
            
            {question.commonStruggle && (
                 <div className="mt-6 text-center bg-stone-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700">Vanlig misforståelse:</h4>
                    <p className="text-gray-600 mt-1">{question.commonStruggle.description}</p>
                    <p className="mt-2 font-mono bg-stone-200 text-stone-700 p-2 rounded text-sm inline-block">{question.commonStruggle.example}</p>
                </div>
            )}
           
            <div className="mt-8 flex justify-center">
                <button
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                    <PlayCircleIcon className="w-6 h-6" />
                    Gjenoppta Økt
                </button>
            </div>
        </div>
    </div>
);


const TeacherView: React.FC<TeacherViewProps> = (props) => {
  const { 
    students, classes, allSubjects, selectedClassId, selectedSubject, 
    onSelectClass, onSelectSubject, classStruggles, onSelectStudent, onAutoGroup, 
    isLiveSessionActive, questionSets, onStartLiveSession, onEndLiveSession, 
    studentProgress, activeQuestionSet, isSessionPaused, collectiveStruggle, 
    onPauseSession, onResumeSession, isKaiVoiceEnabled, onToggleKaiVoice, onGenerateLessonPlan,
    onDistributeNote
  } = props;
  
  const [lessonSubject, setLessonSubject] = useState(selectedSubject || 'Matte');
  const [lessonTopic, setLessonTopic] = useState('');
  const [numLessons, setNumLessons] = useState(1);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isDistributing, setIsDistributing] = useState(false);


  useEffect(() => {
    if (selectedSubject) {
      setLessonSubject(selectedSubject);
    }
  }, [selectedSubject]);
  
  const pausedQuestion = useMemo(() => {
      if (!isSessionPaused || !collectiveStruggle || !activeQuestionSet) return null;
      return activeQuestionSet.questions.find(q => q.id === collectiveStruggle.questionId) || null;
  }, [isSessionPaused, collectiveStruggle, activeQuestionSet]);
  
  const handleGenerateClick = () => {
      if (lessonTopic.trim() && selectedSubject) {
          onGenerateLessonPlan(selectedSubject, lessonTopic, numLessons);
      }
  };

  const handleDistribute = () => {
      if (selectedSubject && newNoteTitle.trim() && newNoteContent.trim()) {
          setIsDistributing(true);
          onDistributeNote(selectedSubject, newNoteTitle, newNoteContent);
          setTimeout(() => {
              setNewNoteTitle('');
              setNewNoteContent('');
              setIsDistributing(false);
          }, 1000); 
      }
  };
  
  const selectedClassName = useMemo(() => {
    if (!selectedClassId) return '';
    return classes.find(c => c.id === selectedClassId)?.name || '';
  }, [selectedClassId, classes]);

  if (isLiveSessionActive && activeQuestionSet) {
    return (
      <main className="flex-grow p-4 md:p-6 bg-stone-100 flex flex-col gap-6 overflow-hidden relative">
          {isSessionPaused && pausedQuestion && (
              <TeachingMomentOverlay question={pausedQuestion} onClose={onResumeSession} />
          )}
          <header className="flex-shrink-0 flex items-center justify-between pb-4 border-b border-stone-300">
              <div>
                  <h2 className="font-serif text-2xl md:text-3xl text-gray-800 font-semibold">Live Økt: {activeQuestionSet.title}</h2>
                  <p className="text-gray-600">{activeQuestionSet.questions.length} deloppgaver</p>
              </div>
               <button 
                  onClick={onEndLiveSession}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                  <CloseIcon className="w-5 h-5" />
                  Avslutt Økt
              </button>
          </header>

          {collectiveStruggle && (
              <CollectiveStruggleAlert 
                struggle={collectiveStruggle}
                questionSet={activeQuestionSet}
                totalStudents={students.length}
                onPause={onPauseSession}
              />
          )}

          <div className="flex flex-col flex-grow overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
                <UsersIcon className="w-6 h-6 text-gray-700"/>
                <h3 className="text-xl font-bold text-gray-800">Elevprogresjon</h3>
            </div>
            <div className="space-y-2 flex-grow overflow-y-auto pr-2">
                {students.map(student => (
                    <LiveStudentProgressItem 
                      key={student.id} 
                      student={student} 
                      progress={studentProgress[student.id] || { completed: [], struggled: [] }}
                      questions={activeQuestionSet.questions}
                    />
                ))}
            </div>
          </div>
      </main>
    );
  }

  return (
    <main className="flex-grow p-4 md:p-8 overflow-y-auto bg-stone-100 flex flex-col gap-8">
        <h2 className="font-serif text-2xl md:text-3xl text-gray-800 font-semibold pb-4 border-b border-stone-300">Lærerdashbord</h2>
        
        {/* Selection Area */}
        <div className="space-y-8">
          {/* Step 1: Class Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">1. Velg Klasse</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {classes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectClass(c.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                    selectedClassId === c.id
                      ? 'bg-blue-50 border-blue-500 shadow-sm'
                      : 'bg-white border-stone-200 hover:border-blue-400 hover:shadow-sm'
                  }`}
                >
                  <UsersIcon className={`w-8 h-8 mb-2 ${selectedClassId === c.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`font-semibold ${selectedClassId === c.id ? 'text-blue-800' : 'text-gray-700'}`}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Subject Selection */}
          {selectedClassId && (
            <div className="animate-fade-in">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">2. Velg Fag</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {allSubjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => onSelectSubject(subject)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                      selectedSubject === subject
                        ? 'bg-blue-50 border-blue-500 shadow-sm'
                        : 'bg-white border-stone-200 hover:border-blue-400 hover:shadow-sm'
                    }`}
                  >
                    <FolderIcon className={`w-8 h-8 mb-2 ${selectedSubject === subject ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`font-semibold ${selectedSubject === subject ? 'text-blue-800' : 'text-gray-700'}`}>{subject}</span>
                  </button>
                ))}
              </div>
              <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                  animation: fadeIn 0.4s ease-out forwards;
                }
              `}</style>
            </div>
          )}
        </div>

        {selectedClassId && selectedSubject ? (
          <>
            <div>
                <ClassStruggles struggles={classStruggles} onAutoGroup={onAutoGroup} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Lærerverktøy</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-stone-200">
                    <div className="flex items-start gap-3">
                        <ClipboardListIcon className="w-6 h-6 text-blue-700 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-gray-800">Øktplanlegger</h4>
                            <p className="text-sm text-gray-500">Generer en leksjonsplan ved hjelp av AI.</p>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                        <div>
                            <label className="text-xs font-medium text-gray-600">Tema</label>
                            <input type="text" placeholder="f.eks. Brøkregning" value={lessonTopic} onChange={e => setLessonTopic(e.target.value)} className="w-full mt-1 p-2 border border-stone-300 rounded-md text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Antall økter</label>
                            <input type="number" value={numLessons} onChange={e => setNumLessons(Math.max(1, parseInt(e.target.value, 10)))} min="1" className="w-full mt-1 p-2 border border-stone-300 rounded-md text-sm" />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button onClick={handleGenerateClick} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm">
                            Generer Plan
                        </button>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-stone-200">
                    <div className="flex items-start gap-3">
                        <BookOpenIcon className="w-6 h-6 text-green-700 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-gray-800">Distribuer Notat</h4>
                            <p className="text-sm text-gray-500">Del et notat med hele klassen.</p>
                        </div>
                    </div>
                    <div className="mt-4 space-y-3">
                        <input
                            type="text"
                            placeholder="Tittel på notatet"
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            className="w-full p-2 border border-stone-300 rounded-md text-sm"
                            disabled={isDistributing}
                        />
                        <textarea
                            placeholder="Skriv innholdet som skal deles med elevene..."
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            className="w-full p-2 border border-stone-300 rounded-md text-sm h-32 resize-y"
                            disabled={isDistributing}
                        />
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleDistribute}
                            disabled={!newNoteTitle.trim() || !newNoteContent.trim() || isDistributing}
                            className="w-48 text-center px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isDistributing ? 'Distribuerer...' : `Distribuer til ${selectedClassName}`}
                        </button>
                    </div>
                </div>

              </div>
          </div>
            
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Innstillinger</h3>
                <div className="bg-white p-4 rounded-lg border border-stone-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-gray-800">KAI Stemmeassistent</h4>
                            <p className="text-sm text-gray-500">Tillat elever å snakke med KAI for hjelp.</p>
                        </div>
                        <button
                            onClick={onToggleKaiVoice}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                isKaiVoiceEnabled ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    isKaiVoiceEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Start Live Økt</h3>
                {questionSets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {questionSets.map(set => (
                            <QuestionSetCard key={set.id} set={set} onStart={() => onStartLiveSession(set.id)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 bg-stone-50 p-6 rounded-lg">
                        <p>Ingen tilgjengelige oppgavesett for valgte fag.</p>
                    </div>
                )}
            </div>

            <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                    <UsersIcon className="w-6 h-6 text-gray-700"/>
                    <h3 className="text-xl font-bold text-gray-800">Klasseoversikt</h3>
                </div>
                <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-2">
                    {students.map(student => (
                        <StudentListItem key={student.id} student={student} onClick={() => onSelectStudent(student.id)} />
                    ))}
                </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 bg-stone-50 p-10 rounded-lg">
            <p className="font-semibold">Vennligst velg en klasse og et fag for å se informasjon.</p>
          </div>
        )}
    </main>
  );
};

export default TeacherView;
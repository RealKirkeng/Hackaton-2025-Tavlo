

import React from 'react';
import { Student, Note, SubjectData } from '../data/content';
import { MagicWandIcon } from './Icons';

interface StudentDetailViewProps {
  student: Student;
  subjects: string[];
  allNotes: Record<string, SubjectData>;
  onOpenFeedbackModal: (note: Note) => void;
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const getProgressColor = (progress: number) => {
    if (progress > 80) return 'bg-green-500';
    if (progress > 60) return 'bg-yellow-500';
    return 'bg-red-500';
}

const SubjectProgressCard: React.FC<{ subjectName: string; progress: number }> = ({ subjectName, progress }) => (
    <div className="bg-white p-4 rounded-lg border border-stone-200">
        <h4 className="font-semibold text-gray-800">{subjectName}</h4>
        <div className="flex items-center gap-3 mt-2">
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <span className="font-bold text-gray-700 text-sm">{progress}%</span>
        </div>
    </div>
);

const NoteFeedbackCard: React.FC<{ note: Note, subject: string, onGetFeedback: () => void }> = ({ note, subject, onGetFeedback }) => (
    <div className="bg-white p-4 rounded-lg border border-stone-200">
        <div className="flex justify-between items-start gap-2">
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">{subject}</span>
                    {note.isTeacherNote && (
                        <span className="text-xs bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full">Fra Lærer</span>
                    )}
                </div>
                <h4 className="font-semibold text-gray-800 mt-2">{note.title}</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{note.studentAnswer}</p>
            </div>
            {!note.isTeacherNote && (
                <button 
                    onClick={onGetFeedback}
                    className="flex items-center gap-2 text-sm px-3 py-1.5 bg-white text-blue-700 rounded-md hover:bg-blue-50 border border-blue-600 transition-colors font-semibold flex-shrink-0"
                >
                    <MagicWandIcon className="w-4 h-4" />
                    <span>Feedback</span>
                </button>
            )}
        </div>
    </div>
);


const StudentDetailView: React.FC<StudentDetailViewProps> = ({ student, subjects, allNotes, onOpenFeedbackModal }) => {
  const relevantNotes = subjects.flatMap(subject => 
      (allNotes[subject]?.notes || []).map(note => ({ ...note, subject }))
  );
  
  return (
    <main className="flex-grow p-4 md:p-8 overflow-y-auto bg-stone-100 flex flex-col gap-8">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-stone-300">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center ring-4 ring-white">
            <span className="text-3xl font-bold text-gray-600">{getInitials(student.name)}</span>
        </div>
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-gray-600 mt-1">Samlet fremgang: <span className="font-semibold">{student.progress}%</span></p>
        </div>
      </div>

      {/* Subjects Progress */}
      <div>
        <h3 className="font-serif text-2xl text-gray-800 font-semibold mb-4">Fremgang i fag</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjects.map(subject => (
                <SubjectProgressCard 
                    key={subject}
                    subjectName={subject}
                    progress={student.subjectProgress[subject] || 0}
                />
            ))}
        </div>
      </div>

       {/* Submitted Work */}
      <div>
          <h3 className="font-serif text-2xl text-gray-800 font-semibold mb-4">Innlevert Arbeid</h3>
          {relevantNotes.length > 0 ? (
              <div className="space-y-3">
                  {relevantNotes.map(note => (
                      <NoteFeedbackCard 
                          key={note.id} 
                          note={note} 
                          subject={note.subject}
                          onGetFeedback={() => onOpenFeedbackModal(note)} 
                      />
                  ))}
              </div>
          ) : (
              <p className="text-gray-500 bg-stone-50 p-4 rounded-lg">Ingen notater funnet for de valgte fagene.</p>
          )}
      </div>
    </main>
  );
};

export default StudentDetailView;
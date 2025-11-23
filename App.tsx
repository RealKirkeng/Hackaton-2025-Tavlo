


import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from './components/Header';
import EditorView from './components/EditorView';
import Toolbar from './components/Toolbar';
import AiChat from './components/AiChat';
import Menu from './components/Menu';
import SubjectView from './components/SubjectView';
import HomeView from './components/HomeView';
import ViewToggle from './components/ViewToggle';
import TeacherView from './components/TeacherView';
import StudentDetailView from './components/StudentDetailView';
import { subjectContent as initialSubjectContent, Note, students, Student, classStruggles, SubjectData, ClassStruggle, scheduleData, ScheduleEvent, questionSets, QuestionSet, groupGames, GroupGame, Objective, classes, Class } from './data/content';
import GroupingModal, { GroupedStudent } from './components/GroupingModal';
import ShareModal from './components/ShareModal';
import ScheduleView from './components/ScheduleView';
import ReminderModal from './components/ReminderModal';
import StudentLiveSessionView from './components/StudentLiveSessionView';
import ScavengerHuntView from './components/ScavengerHunt';
import ScavengerHuntSuccessModal from './components/ScavengerHuntSuccessModal';
import SearchView, { SearchResult } from './components/SearchView';
import { CloseIcon } from './components/Icons';
import StudentProfileView from './components/StudentProfileView';
import { generateLessonPlan, getFeedbackSuggestions, LessonPlan, Feedback, generateAdaptiveGame, recognizeHandwriting } from './services/geminiService';
import LessonPlanModal from './components/LessonPlanModal';
import FeedbackAssistantModal from './components/FeedbackAssistantModal';
import LoginView from './components/LoginView';


type ViewMode = 'student' | 'teacher';
export type Tool = 'text' | 'pencil' | 'eraser';

export interface StudentProgress {
  completed: string[];
  struggled: string[];
}

const App: React.FC = () => {
  const [subjectContent, setSubjectContent] = useState<Record<string, SubjectData>>(initialSubjectContent);
  const [currentSubject, setCurrentSubject] = useState<string>("Hjem");
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(subjectContent["Hjem"].notes[0].id);
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('student');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Toolbar state
  const [activeTool, setActiveTool] = useState<Tool>('text');
  const [penColor, setPenColor] = useState<string>('#333333');
  const [penSize, setPenSize] = useState<number>(10);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRecognizingText, setIsRecognizingText] = useState(false);
  
  // Teacher selection state
  const [teacherSelectedClassId, setTeacherSelectedClassId] = useState<string | null>(null);
  const [teacherSelectedSubject, setTeacherSelectedSubject] = useState<string | null>(null);
  const allSubjects = useMemo(() => Object.keys(initialSubjectContent).filter(s => s !== "Hjem" && s !== "Timeplan"), []);

  // Auto-grouping modal state
  const [isGroupingModalOpen, setIsGroupingModalOpen] = useState<boolean>(false);
  const [generatedGroups, setGeneratedGroups] = useState<GroupedStudent[][]>([]);
  const [groupingTopic, setGroupingTopic] = useState<string>('');
  
  // Reminder modal state
  const [isReminderOpen, setIsReminderOpen] = useState<boolean>(false);
  const [upcomingEvent, setUpcomingEvent] = useState<ScheduleEvent | null>(null);
  const [hasShownReminder, setHasShownReminder] = useState<boolean>(false);

  // Live Session State
  const [isLiveSessionActive, setIsLiveSessionActive] = useState<boolean>(false);
  const [isSessionPaused, setIsSessionPaused] = useState<boolean>(false);
  const [activeQuestionSetId, setActiveQuestionSetId] = useState<string | null>(null);
  const [studentProgress, setStudentProgress] = useState<Record<string, StudentProgress>>({});
  const [collectiveStruggle, setCollectiveStruggle] = useState<{ questionId: string; studentIds: string[] } | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  
  // Group Game State
  const [activeGroupGame, setActiveGroupGame] = useState<GroupGame | null>(null);
  const [groupGameStep, setGroupGameStep] = useState<number>(0);
  const [isGroupGameSuccess, setIsGroupGameSuccess] = useState<boolean>(false);
  const scavengerTeam = useMemo(() => [students[0], students[2], students[4]], []);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // KAI Voice Assistant State
  const [isKaiVoiceEnabled, setIsKaiVoiceEnabled] = useState<boolean>(true);

  // Objective Filter State
  const [objectiveFilters, setObjectiveFilters] = useState<Record<string, string[]>>({});

  const [isProfileViewOpen, setIsProfileViewOpen] = useState<boolean>(false);
  
  // State for Teacher Tools
  const [isLessonPlanModalOpen, setIsLessonPlanModalOpen] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [isLessonPlanLoading, setIsLessonPlanLoading] = useState(false);
  const [lessonPlanError, setLessonPlanError] = useState<string | null>(null);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedNoteForFeedback, setSelectedNoteForFeedback] = useState<Note | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  
  // State for AI Game Generation
  const [isGeneratingGame, setIsGeneratingGame] = useState(false);
  const [gameGenerationError, setGameGenerationError] = useState<string | null>(null);

  // Student Login State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);


  const isGroupGameActive = !!activeGroupGame;


  const activeQuestionSet = useMemo(() => {
    if (!activeQuestionSetId) return null;
    return questionSets.find(qs => qs.id === activeQuestionSetId) || null;
  }, [activeQuestionSetId]);


  // Effect to show reminder modal for teacher
  useEffect(() => {
    // Only show the reminder once per session for the teacher
    if (viewMode === 'teacher' && !isLiveSessionActive && !hasShownReminder) {
      const mathClass = scheduleData.find(event => event.subject === 'Matte');
      if (mathClass) {
        setUpcomingEvent(mathClass);
        const timer = setTimeout(() => {
          setIsReminderOpen(true);
          setHasShownReminder(true); // Mark that the reminder has been shown
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [viewMode, isLiveSessionActive, hasShownReminder]);

  // Effect to simulate live progress with struggles
  useEffect(() => {
    if (isLiveSessionActive && !isSessionPaused && viewMode === 'teacher' && activeQuestionSet) {
      progressIntervalRef.current = window.setInterval(() => {
        setStudentProgress(prev => {
          const newProgress = { ...prev };
          const randomStudent = students[Math.floor(Math.random() * students.length)];
          const studentData = newProgress[randomStudent.id] || { completed: [], struggled: [] };
          const allQuestionIds = activeQuestionSet.questions.map(q => q.id);

          if (studentData.completed.length < allQuestionIds.length) {
            const nextQuestion = allQuestionIds.find(qId => !studentData.completed.includes(qId));

            if (nextQuestion) {
              const knowledge = students.find(s => s.id === randomStudent.id)?.knowledgeLevel || 'medium';
              let struggleChance = 0.3; // Medium
              if (knowledge === 'low') struggleChance = 0.6;
              if (knowledge === 'high') struggleChance = 0.1;

              // Simulate struggle
              if (Math.random() < struggleChance && !studentData.struggled.includes(nextQuestion)) {
                studentData.struggled = [...studentData.struggled, nextQuestion];
              }

              // After a "delay", they complete it
              studentData.completed = [...studentData.completed, nextQuestion];
              newProgress[randomStudent.id] = studentData;
            }
          }

          const allDone = students.every(s => (newProgress[s.id]?.completed.length || 0) === allQuestionIds.length);
          if (allDone && progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          return newProgress;
        });
      }, 2000); // Slower interval for more realistic progress
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isLiveSessionActive, isSessionPaused, viewMode, activeQuestionSet]);

  // Effect to detect collective struggles
  useEffect(() => {
    if (!isLiveSessionActive || Object.keys(studentProgress).length === 0) {
      setCollectiveStruggle(null);
      return;
    }

    const struggleCounts: Record<string, string[]> = {};
    for (const studentId in studentProgress) {
      const progress = studentProgress[studentId];
      progress.struggled.forEach(questionId => {
        if (!struggleCounts[questionId]) {
          struggleCounts[questionId] = [];
        }
        struggleCounts[questionId].push(studentId);
      });
    }

    let maxStruggle: { questionId: string; studentIds: string[] } | null = null;
    for (const questionId in struggleCounts) {
      if (!maxStruggle || struggleCounts[questionId].length > maxStruggle.studentIds.length) {
        maxStruggle = { questionId, studentIds: struggleCounts[questionId] };
      }
    }

    // Threshold: more than 30% of the class
    if (maxStruggle && maxStruggle.studentIds.length > students.length * 0.3) {
      // Avoid flickering by only setting if it's a new struggle
      if (collectiveStruggle?.questionId !== maxStruggle.questionId) {
        setCollectiveStruggle(maxStruggle);
      }
    } else {
        setCollectiveStruggle(null);
    }
  }, [studentProgress, isLiveSessionActive]);

  const searchResults = useMemo((): SearchResult[] => {
    if (!searchQuery.trim()) {
        return [];
    }
    const results: SearchResult[] = [];
    const lowerCaseQuery = searchQuery.toLowerCase();

    Object.entries(subjectContent).forEach(([subject, data]) => {
        if (subject === "Hjem" || subject === "Timeplan") return;
        // FIX: Added type assertion for `data` to address potential `unknown` type from `Object.entries` in some TS configurations.
        (data as SubjectData).notes.forEach(note => {
            const inTitle = note.title.toLowerCase().includes(lowerCaseQuery);
            const inAnswer = note.studentAnswer.toLowerCase().includes(lowerCaseQuery);
            if (inTitle || inAnswer) {
                results.push({ note, subject });
            }
        });
    });
    return results;
  }, [searchQuery, subjectContent]);

  const handleSearchChange = (query: string) => {
      setSearchQuery(query);
  };

  const handleSelectSearchResult = (result: SearchResult) => {
      setCurrentSubject(result.subject);
      setCurrentNoteId(result.note.id);
      setSearchQuery('');
  };


  const handleStartLiveSession = (questionSetId: string) => {
    const newStudentProgress: Record<string, StudentProgress> = {};
    students.forEach(student => {
      newStudentProgress[student.id] = { completed: [], struggled: [] };
    });
    setStudentProgress(newStudentProgress);
    setActiveQuestionSetId(questionSetId);
    setIsLiveSessionActive(true);
    setIsSessionPaused(false);
    setCollectiveStruggle(null);
  };
  
  const handleEndLiveSession = () => {
    setIsLiveSessionActive(false);
    setIsSessionPaused(false);
    setActiveQuestionSetId(null);
    setStudentProgress({});
    setCollectiveStruggle(null);
     if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
    }
  };
  
  const handleStudentProgressUpdate = (studentId: string, questionId: string, isCompleted: boolean) => {
    setStudentProgress(prev => {
      const currentProgress = prev[studentId] || { completed: [], struggled: [] };
      const newCompleted = isCompleted
        ? [...currentProgress.completed, questionId]
        : currentProgress.completed.filter(id => id !== questionId);
      return { ...prev, [studentId]: { ...currentProgress, completed: Array.from(new Set(newCompleted)) } };
    });
  };

  const handleAutoGroup = (struggle: ClassStruggle) => {
    const strugglingStudents = teacherFilteredStudents.filter(s => 
      s.strugglingTopics.some(t => t.subject === struggle.subject && t.topic === struggle.topic)
    ).map(s => ({ ...s, isStruggling: true }));

    const knowingStudents = teacherFilteredStudents.filter(s => 
      !s.strugglingTopics.some(t => t.subject === struggle.subject && t.topic === struggle.topic)
    ).map(s => ({ ...s, isStruggling: false }));
    
    const shuffle = (array: any[]) => array.sort(() => Math.random() - 0.5);
    const shuffledKnowing = shuffle(knowingStudents);
    const shuffledStruggling = shuffle(strugglingStudents);

    const groups: GroupedStudent[][] = [];
    const allStudentsShuffled = [...shuffledKnowing, ...shuffledStruggling];
    const idealGroupSize = 3;
    const numGroups = Math.ceil(allStudentsShuffled.length / idealGroupSize);

    for (let i = 0; i < numGroups; i++) {
        groups.push([]);
    }

    shuffledKnowing.forEach((student, index) => {
        groups[index % numGroups].push(student);
    });

    shuffledStruggling.forEach(student => {
        groups.sort((a, b) => a.length - b.length);
        groups[0].push(student);
    });
    
    setGeneratedGroups(groups);
    setGroupingTopic(`${struggle.subject}: ${struggle.topic}`);
    setIsGroupingModalOpen(true);
  };

  const handleSelectSubject = (subject: string) => {
    setCurrentSubject(subject);
    setCurrentNoteId(subject === "Hjem" ? subjectContent["Hjem"].notes[0].id : null);
    setIsMenuOpen(false);
    setSelectedStudentId(null);
    setActiveGroupGame(null);
  };

  const handleSelectNote = (noteId: string) => {
    setCurrentNoteId(noteId);
  };
  
  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
  }

  const handleNoteChange = (noteId: string, newText: string) => {
    setSubjectContent(prevContent => {
      const currentSubjectData = prevContent[currentSubject];
      if (!currentSubjectData) {
        return prevContent;
      }

      const noteIndex = currentSubjectData.notes.findIndex(n => n.id === noteId);
      if (noteIndex > -1) {
        const updatedNotes = [...currentSubjectData.notes];
        updatedNotes[noteIndex] = { ...updatedNotes[noteIndex], studentAnswer: newText };
        const updatedSubjectData = { ...currentSubjectData, notes: updatedNotes };
        return {
          ...prevContent,
          [currentSubject]: updatedSubjectData
        };
      }
      return prevContent;
    });
  };
  
  const handleNoteTitleChange = (noteId: string, newTitle: string) => {
    setSubjectContent(prevContent => {
      const currentSubjectData = prevContent[currentSubject];
      if (!currentSubjectData) {
        return prevContent;
      }
      const noteIndex = currentSubjectData.notes.findIndex(n => n.id === noteId);
      if (noteIndex > -1) {
        const updatedNotes = [...currentSubjectData.notes];
        updatedNotes[noteIndex] = { ...updatedNotes[noteIndex], title: newTitle };
        return {
          ...prevContent,
          [currentSubject]: { ...currentSubjectData, notes: updatedNotes }
        };
      }
      return prevContent;
    });
  };

  const handleDrawingChange = (noteId: string, dataUrl: string) => {
    setSubjectContent(prevContent => {
      const currentSubjectData = prevContent[currentSubject];
      if (!currentSubjectData) {
        return prevContent;
      }
      const noteIndex = currentSubjectData.notes.findIndex(n => n.id === noteId);
      if (noteIndex > -1) {
        const updatedNotes = [...currentSubjectData.notes];
        updatedNotes[noteIndex] = { ...updatedNotes[noteIndex], drawingData: dataUrl };
        return {
          ...prevContent,
          [currentSubject]: { ...currentSubjectData, notes: updatedNotes }
        };
      }
      return prevContent;
    });
  };

  const handleNewNote = () => {
    const newNote: Note = {
      id: `${currentSubject.toLowerCase()}-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: "Nytt Notat",
      studentAnswer: "Begynn å skrive her...",
      submissions: 0,
      totalStudents: 25,
      drawingData: "",
    };
    setSubjectContent(prevContent => {
      const currentSubjectData = prevContent[currentSubject];
      if (!currentSubjectData) {
        return prevContent;
      }
      const updatedNotes = [newNote, ...currentSubjectData.notes];
      return {
        ...prevContent,
        [currentSubject]: { ...currentSubjectData, notes: updatedNotes }
      };
    });
    setCurrentNoteId(newNote.id);
  }
  
    const handleDistributeNewNote = (subject: string, title: string, content: string) => {
    const newNote: Note = {
      id: `teacher-${subject.toLowerCase()}-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: title,
      studentAnswer: content,
      submissions: 0,
      totalStudents: students.length,
      drawingData: "",
      isTeacherNote: true,
    };

    setSubjectContent(prevContent => {
      const currentSubjectData = prevContent[subject];
      if (!currentSubjectData) {
        return prevContent;
      }
      const updatedNotes = [newNote, ...currentSubjectData.notes];
      return {
        ...prevContent,
        [subject]: { ...currentSubjectData, notes: updatedNotes }
      };
    });
  };
  
  const handleToolClick = (tool: Tool) => {
    setActiveTool(prevTool => (prevTool === tool ? 'text' : tool));
  };

  const handleStartGroupGame = (game: GroupGame) => {
    setActiveGroupGame(game);
    setGroupGameStep(0);
    setIsGroupGameSuccess(false);
    setCurrentNoteId(null);
  };

  const handleAdvanceGroupGame = () => {
    if (!activeGroupGame) return;
    if (groupGameStep < activeGroupGame.steps.length - 1) {
      setGroupGameStep(prev => prev + 1);
    } else {
      setIsGroupGameSuccess(true);
    }
  };
  
  const handleCloseGroupGame = () => {
    setActiveGroupGame(null);
    setIsGroupGameSuccess(false);
  }
  
  const handleToggleKaiVoice = () => {
    setIsKaiVoiceEnabled(prev => !prev);
  };
  
  const handleObjectiveFilterChange = (subject: string, theme: string) => {
    setObjectiveFilters(prev => {
        const currentFilters = prev[subject] || [];
        // Special case to clear filters
        if (theme === '') {
            return { ...prev, [subject]: [] };
        }
        const newFilters = currentFilters.includes(theme)
            ? currentFilters.filter(t => t !== theme)
            : [...currentFilters, theme];
        return { ...prev, [subject]: newFilters };
    });
  };

  const handleRecognizeText = async () => {
    if (!currentNote || !currentNote.drawingData) return;

    setIsRecognizingText(true);
    try {
        const recognizedText = await recognizeHandwriting(currentNote.drawingData);

        setSubjectContent(prevContent => {
            const currentSubjectData = prevContent[currentSubject];
            if (!currentSubjectData) return prevContent;

            const noteIndex = currentSubjectData.notes.findIndex(n => n.id === currentNote.id);
            if (noteIndex > -1) {
                const updatedNotes = [...currentSubjectData.notes];
                const existingNote = updatedNotes[noteIndex];
                
                const newStudentAnswer = existingNote.studentAnswer === "Begynn å skrive her..."
                    ? recognizedText
                    : `${existingNote.studentAnswer}\n${recognizedText}`;
                
                updatedNotes[noteIndex] = { 
                    ...existingNote, 
                    studentAnswer: newStudentAnswer,
                    drawingData: "" // Clear the drawing
                };

                return {
                    ...prevContent,
                    [currentSubject]: { ...currentSubjectData, notes: updatedNotes }
                };
            }
            return prevContent;
        });

    } catch (error) {
        console.error("Failed to recognize handwriting:", error);
    } finally {
        setIsRecognizingText(false);
    }
  };

  const handleStartObjective = (objective: Objective) => {
    const newNote: Note = {
      id: `task-${objective.id}-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: objective.text,
      studentAnswer: "Skriv svaret ditt her...",
      submissions: 0,
      totalStudents: 1, 
      drawingData: "",
      objectiveId: objective.id,
      isSubmitted: false,
    };

    setSubjectContent(prevContent => {
      const currentSubjectData = prevContent[currentSubject];
      if (!currentSubjectData) {
        return prevContent;
      }
      const updatedNotes = [newNote, ...currentSubjectData.notes];
      return {
        ...prevContent,
        [currentSubject]: { ...currentSubjectData, notes: updatedNotes }
      };
    });
    setCurrentNoteId(newNote.id);
  }

  const handleSubmitNote = async (noteId: string) => {
    const noteToSubmit = subjectContent[currentSubject]?.notes.find(n => n.id === noteId);
    if (!noteToSubmit) return;

    let recognizedText: string | undefined = undefined;
    if (noteToSubmit.drawingData) {
        try {
            recognizedText = await recognizeHandwriting(noteToSubmit.drawingData);
        } catch (error) {
            console.error("Failed to recognize handwriting on submission:", error);
        }
    }

    setSubjectContent(prevContent => {
      const currentSubjectData = prevContent[currentSubject];
      if (!currentSubjectData) return prevContent;

      const noteIndex = currentSubjectData.notes.findIndex(n => n.id === noteId);
      if (noteIndex > -1) {
        const updatedNotes = [...currentSubjectData.notes];
        const submittedNote: Note = {
            ...updatedNotes[noteIndex], 
            isSubmitted: true, 
            date: new Date().toISOString().split('T')[0]
        };
        if (recognizedText !== undefined) {
            submittedNote.recognizedText = recognizedText;
        }
        updatedNotes[noteIndex] = submittedNote;
        
        return { ...prevContent, [currentSubject]: { ...currentSubjectData, notes: updatedNotes } };
      }
      return prevContent;
    });
  };
  
  // Handlers for Teacher Tools
  const handleGenerateLessonPlan = async (subject: string, topic: string, numLessons: number) => {
      setIsLessonPlanModalOpen(true);
      setIsLessonPlanLoading(true);
      setLessonPlanError(null);
      setLessonPlan(null);
      try {
          const plan = await generateLessonPlan(subject, topic, numLessons);
          setLessonPlan(plan);
      } catch (e) {
          setLessonPlanError(e instanceof Error ? e.message : 'En ukjent feil oppstod.');
      } finally {
          setIsLessonPlanLoading(false);
      }
  };

  const handleOpenFeedbackModal = (note: Note) => {
      setSelectedNoteForFeedback(note);
      setFeedback(null);
      setFeedbackError(null);
      setIsFeedbackModalOpen(true);
  };

  const handleGenerateFeedback = async () => {
      if (!selectedNoteForFeedback) return;
      setIsFeedbackLoading(true);
      setFeedbackError(null);
      setFeedback(null);
      try {
          const fb = await getFeedbackSuggestions(selectedNoteForFeedback.studentAnswer);
          setFeedback(fb);
      } catch(e) {
          setFeedbackError(e instanceof Error ? e.message : 'En ukjent feil oppstod.');
      } finally {
          setIsFeedbackLoading(false);
      }
  };
  
  const handleGenerateAdaptiveGame = async (subject: string) => {
      setIsGeneratingGame(true);
      setGameGenerationError(null);
      try {
          const notes = subjectContent[subject]?.notes || [];
          const objectives = subjectContent[subject]?.objectives || [];
          const newGame = await generateAdaptiveGame(subject, notes, objectives);
          
          setSubjectContent(prev => {
              const subjectData = prev[subject];
              if (subjectData) {
                  const updatedGames = [...(subjectData.groupGames || []), newGame];
                  return {
                      ...prev,
                      [subject]: { ...subjectData, groupGames: updatedGames }
                  };
              }
              return prev;
          });

      } catch (e) {
          setGameGenerationError(e instanceof Error ? e.message : 'En ukjent feil oppstod.');
      } finally {
          setIsGeneratingGame(false);
      }
  };


  const currentNote = useMemo(() => {
    if (!currentSubject || !currentNoteId || currentSubject === "Hjem" || currentSubject === "Timeplan") return null;
    return subjectContent[currentSubject]?.notes.find(n => n.id === currentNoteId) || null;
  }, [currentSubject, currentNoteId, subjectContent]);
  
  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) return null;
    return students.find(s => s.id === selectedStudentId) || null;
  }, [selectedStudentId]);

  // Teacher View Data Filtering
  const teacherFilteredStudents = useMemo(() => {
    if (!teacherSelectedClassId) return [];
    return students.filter(student => student.classId === teacherSelectedClassId);
  }, [teacherSelectedClassId]);

  const teacherFilteredClassStruggles = useMemo(() => {
    if (!teacherSelectedSubject) return [];
    return classStruggles.filter(struggle => struggle.subject === teacherSelectedSubject);
  }, [teacherSelectedSubject]);
  
  const teacherFilteredQuestionSets = useMemo(() => {
    if (!teacherSelectedSubject) return [];
    return questionSets.filter(qs => qs.subject === teacherSelectedSubject);
  }, [teacherSelectedSubject]);

  const handleTeacherSelectClass = (classId: string) => {
    setTeacherSelectedClassId(classId);
    setTeacherSelectedSubject(null); // Reset subject when class changes
  };
  
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileViewOpen(false);
    setCurrentSubject("Hjem");
    setCurrentNoteId(subjectContent["Hjem"].notes[0].id);
  };

  const documentContext = currentNote ? currentNote.studentAnswer : '';
  const navigateBackToSubject = () => {
    if (isGroupGameActive) {
      setActiveGroupGame(null);
    } else {
      setCurrentNoteId(null);
    }
  }
  const navigateBackToDashboard = () => setSelectedStudentId(null);
  
  const handleViewChange = (newView: ViewMode) => {
    setViewMode(newView);
    handleEndLiveSession();
    setActiveGroupGame(null);
    setIsGroupGameSuccess(false);
    setCurrentSubject("Hjem");
    setCurrentNoteId(subjectContent["Hjem"].notes[0].id);
    setSelectedStudentId(null);
    setHasShownReminder(false); // Reset reminder state
    setSearchQuery('');
    setIsProfileViewOpen(false);
    setTeacherSelectedClassId(null);
    setTeacherSelectedSubject(null);
    if (newView === 'student') {
        setIsLoggedIn(false);
    }
  }

  const renderStudentView = () => {
    if (!isLoggedIn) {
        return <LoginView onLoginSuccess={handleLogin} />;
    }
    if (isProfileViewOpen) {
        return <StudentProfileView student={students[0]} onLogout={handleLogout} />;
    }
     if (searchQuery) {
        return <SearchView 
            query={searchQuery} 
            results={searchResults} 
            onSelectResult={handleSelectSearchResult} 
        />;
    }
     if (isLiveSessionActive && activeQuestionSet) {
      const myProgress = studentProgress[students[0].id]?.completed || []; // Mocking for first student
      return <StudentLiveSessionView 
                questionSet={activeQuestionSet} 
                completedQuestions={myProgress}
                onProgressChange={(questionId, isCompleted) => handleStudentProgressUpdate(students[0].id, questionId, isCompleted)}
                isPaused={isSessionPaused}
              />;
    }
    if (isGroupGameActive) {
      return <ScavengerHuntView 
        hunt={activeGroupGame}
        currentStepIndex={groupGameStep}
        onCorrectAnswer={handleAdvanceGroupGame}
        team={scavengerTeam}
      />
    }
    if (currentSubject === "Timeplan") return <ScheduleView schedule={scheduleData} />;
    if (currentSubject === "Hjem") return <HomeView subjects={Object.keys(subjectContent).filter(s => s !== "Hjem" && s !== "Timeplan")} onSelectSubject={handleSelectSubject}/>;
    if (currentNote) {
      return <EditorView 
        key={currentNote.id} 
        title={currentNote.title} 
        value={currentNote.studentAnswer} 
        onChange={(e) => handleNoteChange(currentNote.id, e.target.value)} 
        onTitleChange={(e) => handleNoteTitleChange(currentNote.id, e.target.value)}
        drawingData={currentNote.drawingData || ''} 
        onDrawingChange={(data) => handleDrawingChange(currentNote.id, data)} 
        activeTool={activeTool}
        penColor={penColor}
        penSize={penSize}
        isRecognizingText={isRecognizingText}
      />;
    }
    return <SubjectView 
            subject={currentSubject} 
            notes={subjectContent[currentSubject]?.notes || []} 
            objectives={subjectContent[currentSubject]?.objectives || []} 
            groupGames={subjectContent[currentSubject]?.groupGames || []}
            onSelectNote={handleSelectNote} 
            onNewNote={handleNewNote} 
            onStartGroupGame={handleStartGroupGame} 
            onStartObjective={handleStartObjective}
            isKaiVoiceEnabled={isKaiVoiceEnabled} 
            objectiveFilters={objectiveFilters}
            onObjectiveFilterChange={handleObjectiveFilterChange}
            onGenerateAdaptiveGame={handleGenerateAdaptiveGame}
            isGeneratingGame={isGeneratingGame}
            gameGenerationError={gameGenerationError}
          />;
  }
  
  const renderTeacherView = () => {
    if (currentSubject === "Timeplan") return <ScheduleView schedule={scheduleData} />;
    if (selectedStudent) return <StudentDetailView 
        student={selectedStudent} 
        subjects={teacherSelectedSubject ? [teacherSelectedSubject] : []}
        allNotes={subjectContent}
        onOpenFeedbackModal={handleOpenFeedbackModal}
      />;
    return <TeacherView 
              students={teacherFilteredStudents} 
              allSubjects={allSubjects}
              classes={classes}
              selectedClassId={teacherSelectedClassId}
              selectedSubject={teacherSelectedSubject}
              onSelectClass={handleTeacherSelectClass}
              onSelectSubject={setTeacherSelectedSubject}
              classStruggles={teacherFilteredClassStruggles} 
              onSelectStudent={handleSelectStudent} 
              onAutoGroup={handleAutoGroup}
              isLiveSessionActive={isLiveSessionActive}
              questionSets={teacherFilteredQuestionSets}
              onStartLiveSession={handleStartLiveSession}
              onEndLiveSession={handleEndLiveSession}
              studentProgress={studentProgress}
              activeQuestionSet={activeQuestionSet}
              isSessionPaused={isSessionPaused}
              collectiveStruggle={collectiveStruggle}
              onPauseSession={() => setIsSessionPaused(true)}
              onResumeSession={() => setIsSessionPaused(false)}
              isKaiVoiceEnabled={isKaiVoiceEnabled}
              onToggleKaiVoice={handleToggleKaiVoice}
              onGenerateLessonPlan={handleGenerateLessonPlan}
              onDistributeNote={handleDistributeNewNote}
            />;
  }
  
  const handleBackClick = viewMode === 'teacher'
    ? navigateBackToDashboard
    : () => {
        if (isProfileViewOpen) {
            setIsProfileViewOpen(false);
        } else if (searchQuery) {
            setSearchQuery('');
        } else {
            navigateBackToSubject();
        }
    };

  const showBackButton = (viewMode === 'student' && isLoggedIn && (isProfileViewOpen || !!searchQuery || ((!!currentNoteId || isGroupGameActive) && currentSubject !== "Hjem" && currentSubject !== "Timeplan"))) || (viewMode === 'teacher' && !!selectedStudentId);
  const showHeader = (viewMode === 'student' && isLoggedIn) || viewMode === 'teacher';
  const isSearchVisible = viewMode === 'student' && isLoggedIn && !isLiveSessionActive && !isGroupGameActive && !isProfileViewOpen;

  return (
    <div className="bg-stone-200 min-h-screen flex flex-col items-center justify-center p-4 gap-4">
      <ViewToggle currentView={viewMode} onViewChange={handleViewChange} />
      <div className="w-full max-w-4xl h-[90vh] max-h-[1200px] bg-black rounded-3xl shadow-2xl p-2 md:p-4 flex flex-col overflow-hidden border-4 border-gray-800">
        <div className="flex-grow bg-stone-100 rounded-2xl flex flex-col relative overflow-hidden">
          {showHeader && !isLiveSessionActive && !isGroupGameActive && (
            <>
              <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onSelectSubject={handleSelectSubject} activeSubject={currentSubject} />
              <Header 
                onMenuClick={() => setIsMenuOpen(true)} 
                showBackButton={showBackButton} 
                onBackClick={handleBackClick} 
                viewMode={viewMode} 
                onProfileClick={viewMode === 'teacher' ? () => {} : () => setIsProfileViewOpen(true)}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                isSearchVisible={isSearchVisible}
              />
            </>
          )}

           {isGroupGameActive && (
            <Header onMenuClick={() => {}} showBackButton={true} onBackClick={handleBackClick} viewMode={viewMode} onProfileClick={() => {}} />
          )}

          {viewMode === 'student' ? renderStudentView() : renderTeacherView()}

          {viewMode === 'student' && currentNote && isLoggedIn && !isLiveSessionActive && !searchQuery && (
            <Toolbar 
              onChatClick={() => setIsAiChatOpen(true)} 
              activeTool={activeTool} 
              onToolClick={handleToolClick} 
              onShareClick={() => setIsShareModalOpen(true)}
              penColor={penColor}
              onPenColorChange={setPenColor}
              penSize={penSize}
              onPenSizeChange={setPenSize}
              onRecognizeText={handleRecognizeText}
              isRecognizingText={isRecognizingText}
              hasDrawing={!!currentNote?.drawingData}
              isTaskNote={!!currentNote?.objectiveId}
              isSubmitted={!!currentNote?.isSubmitted}
              onSubmit={() => handleSubmitNote(currentNote.id)}
            />
          )}
          {viewMode === 'student' && isLoggedIn && <AiChat isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} documentContext={documentContext} />}
          
          <GroupingModal isOpen={isGroupingModalOpen} onClose={() => setIsGroupingModalOpen(false)} topic={groupingTopic} groups={generatedGroups} />
          <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} content={currentNote?.studentAnswer || ''} />
          <ReminderModal 
            isOpen={isReminderOpen} 
            onClose={() => setIsReminderOpen(false)} 
            event={upcomingEvent} 
            onGoToDashboard={() => {
              setIsReminderOpen(false);
              setCurrentSubject("Hjem");
              setSelectedStudentId(null);
            }}
          />
           <ScavengerHuntSuccessModal 
            isOpen={isGroupGameSuccess}
            onClose={handleCloseGroupGame}
            team={scavengerTeam}
            hunt={activeGroupGame!}
          />
           <LessonPlanModal 
              isOpen={isLessonPlanModalOpen}
              onClose={() => setIsLessonPlanModalOpen(false)}
              plan={lessonPlan}
              isLoading={isLessonPlanLoading}
              error={lessonPlanError}
          />
          <FeedbackAssistantModal
              isOpen={isFeedbackModalOpen}
              onClose={() => setIsFeedbackModalOpen(false)}
              note={selectedNoteForFeedback}
              feedback={feedback}
              isLoading={isFeedbackLoading}
              error={feedbackError}
              onGenerate={handleGenerateFeedback}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
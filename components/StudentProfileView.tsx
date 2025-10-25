import React from 'react';
import { Student, Achievement, allAchievements } from '../data/content';
import { TrophyIcon, StarIcon } from './Icons';

// Helper to get initials
const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const getProgressColor = (progress: number) => {
    if (progress > 80) return 'text-green-500';
    if (progress > 60) return 'text-yellow-500';
    return 'text-red-500';
};

const CircularProgress: React.FC<{ progress: number }> = ({ progress }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-stone-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className={getProgressColor(progress)}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-800">
                {progress}%
            </span>
        </div>
    );
};


const SubjectProgressCard: React.FC<{ subjectName: string; progress: number }> = ({ subjectName, progress }) => (
    <div className="bg-white p-4 rounded-lg border border-stone-200">
        <h4 className="font-semibold text-gray-800">{subjectName}</h4>
        <div className="flex items-center gap-3 mt-2">
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ${progress > 80 ? 'bg-green-500' : progress > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <span className="font-bold text-gray-700 text-sm">{progress}%</span>
        </div>
    </div>
);

const AchievementCard: React.FC<{ achievement: Achievement, isUnlocked: boolean }> = ({ achievement, isUnlocked }) => {
    const icon = achievement.icon === 'trophy' 
        ? <TrophyIcon className={`w-8 h-8 ${isUnlocked ? 'text-amber-500' : 'text-gray-300'}`} /> 
        : <StarIcon className={`w-8 h-8 ${isUnlocked ? 'text-yellow-500' : 'text-gray-300'}`} />;

    return (
        <div className={`p-4 rounded-lg border flex flex-col items-center text-center transition-all ${isUnlocked ? 'bg-white shadow-sm' : 'bg-stone-50'}`} title={achievement.description}>
            {icon}
            <h5 className={`mt-2 font-semibold ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>{achievement.title}</h5>
            <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
        </div>
    );
};

interface StudentProfileViewProps {
    student: Student;
}

const StudentProfileView: React.FC<StudentProfileViewProps> = ({ student }) => {
    const subjects = Object.keys(student.subjectProgress);

    return (
        <main className="flex-grow p-4 md:p-8 overflow-y-auto bg-stone-100 flex flex-col">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-stone-300">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center ring-4 ring-white shadow-sm">
                    <span className="text-4xl font-bold text-gray-600">{getInitials(student.name)}</span>
                </div>
                <div className="flex-grow text-center sm:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{student.name}</h2>
                    <p className="text-gray-600 mt-1 text-lg">Samlet Fremgang</p>
                </div>
                <div className="flex-shrink-0">
                    <CircularProgress progress={student.progress} />
                </div>
            </div>

            {/* Subjects Progress */}
            <div className="mb-10">
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
            
             {/* Trophies */}
            <div>
                <h3 className="font-serif text-2xl text-gray-800 font-semibold mb-4">Troféer</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {allAchievements.map(achieve => (
                        <AchievementCard 
                            key={achieve.id}
                            achievement={achieve}
                            isUnlocked={student.achievements.includes(achieve.id)}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default StudentProfileView;

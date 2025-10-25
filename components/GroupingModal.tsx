import React from 'react';
import { Student } from '../data/content';
import { CloseIcon, CheckCircleIcon, QuestionMarkCircleIcon } from './Icons';

export interface GroupedStudent extends Student {
    isStruggling: boolean;
}

interface GroupingModalProps {
    isOpen: boolean;
    onClose: () => void;
    topic: string;
    groups: GroupedStudent[][];
}

const StudentRow: React.FC<{ student: GroupedStudent }> = ({ student }) => (
    <div className="flex items-center justify-between py-2 px-3 hover:bg-stone-50 rounded-md">
        <span className="text-gray-800">{student.name}</span>
        {student.isStruggling ? (
            <QuestionMarkCircleIcon className="w-5 h-5 text-amber-600" title="Trenger hjelp med temaet" />
        ) : (
            <CheckCircleIcon className="w-5 h-5 text-green-600" title="Mestrer temaet" />
        )}
    </div>
);

const GroupCard: React.FC<{ groupNumber: number, students: GroupedStudent[] }> = ({ groupNumber, students }) => (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <h4 className="text-md font-bold text-gray-800 bg-stone-100 px-4 py-2 border-b border-stone-200">
            Gruppe {groupNumber}
        </h4>
        <div className="p-2 space-y-1">
            {students.map(student => (
                <StudentRow key={student.id} student={student} />
            ))}
        </div>
    </div>
);


const GroupingModal: React.FC<GroupingModalProps> = ({ isOpen, onClose, topic, groups }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-stone-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 max-h-[85vh]">
                <header className="flex items-center justify-between p-4 border-b border-stone-200 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Automatisk Gruppering</h2>
                        <p className="text-sm text-gray-600">Forslag til grupper for: <span className="font-bold">{topic}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200">
                        <CloseIcon className="w-5 h-5 text-gray-600" />
                    </button>
                </header>

                <div className="flex-grow p-4 md:p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groups.map((group, index) => (
                            <GroupCard key={index} groupNumber={index + 1} students={group} />
                        ))}
                    </div>
                </div>

                 <footer className="p-4 border-t border-stone-200 flex-shrink-0 text-center">
                    <p className="text-xs text-gray-500">
                        <CheckCircleIcon className="w-4 h-4 inline mr-1 text-green-600"/> = Mestrer temaet &nbsp;&nbsp;
                        <QuestionMarkCircleIcon className="w-4 h-4 inline mr-1 text-amber-600"/> = Trenger hjelp
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default GroupingModal;

import React from 'react';

interface SubjectSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  allSubjects: string[];
  selectedSubjects: string[];
  onToggleSubject: (subject: string) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  isOpen,
  onClose,
  allSubjects,
  selectedSubjects,
  onToggleSubject,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-30"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute top-16 right-4 z-40 w-64 bg-white rounded-lg shadow-lg border border-stone-200">
        <div className="p-4 border-b border-stone-200">
          <h3 className="font-semibold text-gray-800">Velg fag</h3>
          <p className="text-sm text-gray-500">Filtrer dashbordvisning</p>
        </div>
        <div className="p-2 max-h-64 overflow-y-auto">
          {allSubjects.map((subject) => (
            <label
              key={subject}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-stone-100 cursor-pointer"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={selectedSubjects.includes(subject)}
                onChange={() => onToggleSubject(subject)}
              />
              <span className="text-sm font-medium text-gray-700">{subject}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
};

export default SubjectSelector;

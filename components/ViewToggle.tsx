import React from 'react';

type ViewMode = 'student' | 'teacher';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  const baseStyle = "px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-200 focus:ring-blue-500";
  const activeStyle = "bg-white text-gray-800 shadow";
  const inactiveStyle = "bg-transparent text-gray-500 hover:text-gray-800";

  return (
    <div className="bg-stone-300/70 p-1 rounded-lg flex items-center gap-1">
      <button
        onClick={() => onViewChange('student')}
        className={`${baseStyle} ${currentView === 'student' ? activeStyle : inactiveStyle}`}
      >
        Elev
      </button>
      <button
        onClick={() => onViewChange('teacher')}
        className={`${baseStyle} ${currentView === 'teacher' ? activeStyle : inactiveStyle}`}
      >
        Lærer
      </button>
    </div>
  );
};

export default ViewToggle;

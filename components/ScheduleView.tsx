import React from 'react';
import { ScheduleEvent } from '../data/content';
import { ClockIcon } from './Icons';

interface ScheduleViewProps {
  schedule: ScheduleEvent[];
}

const ScheduleItem: React.FC<{ event: ScheduleEvent }> = ({ event }) => {
  const isBreak = event.type === 'break';
  const itemBg = isBreak ? 'bg-green-50' : 'bg-white';
  const borderColor = isBreak ? 'border-green-200' : 'border-blue-200';
  const textColor = isBreak ? 'text-green-800' : 'text-blue-800';

  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border ${itemBg} ${borderColor}`}>
      <div className="flex-shrink-0 w-24 text-center">
        <p className="font-mono font-semibold text-gray-700">{event.time}</p>
      </div>
      <div className={`w-1 h-10 rounded-full ${isBreak ? 'bg-green-300' : 'bg-blue-300'}`}></div>
      <div>
        <h3 className={`font-bold text-lg ${isBreak ? 'text-gray-700' : 'text-gray-800'}`}>
          {event.subject}
        </h3>
      </div>
    </div>
  );
};

const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule }) => {
  return (
    <main className="flex-grow p-4 md:p-8 overflow-y-auto bg-stone-100 flex flex-col">
      <header className="mb-6 pb-4 border-b border-stone-300 flex items-center gap-3">
        <ClockIcon className="w-8 h-8 text-gray-700" />
        <h2 className="font-serif text-2xl md:text-3xl text-gray-800 font-semibold">Timeplan for dagen</h2>
      </header>
      <div className="space-y-3">
        {schedule.map(event => (
          <ScheduleItem key={event.id} event={event} />
        ))}
      </div>
    </main>
  );
};

export default ScheduleView;

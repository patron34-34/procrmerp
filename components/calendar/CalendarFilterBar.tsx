

import React from 'react';
import { EventType } from '../../types';

interface CalendarFilterBarProps {
    visibleTypes: Set<EventType>;
    onVisibilityChange: (newSet: Set<EventType>) => void;
}

const eventTypes: { key: EventType, label: string, color: string }[] = [
    { key: 'project', label: 'Projeler', color: 'bg-blue-500' },
    { key: 'deal', label: 'Anlaşmalar', color: 'bg-green-500' },
    { key: 'invoice', label: 'Faturalar', color: 'bg-orange-500' },
    { key: 'task', label: 'Görevler', color: 'bg-purple-500' },
];

const CalendarFilterBar: React.FC<CalendarFilterBarProps> = ({ visibleTypes, onVisibilityChange }) => {

    const handleToggle = (type: EventType) => {
        const newSet = new Set(visibleTypes);
        if (newSet.has(type)) {
            newSet.delete(type);
        } else {
            newSet.add(type);
        }
        onVisibilityChange(newSet);
    };

    return (
        <div className="flex items-center gap-4">
            {eventTypes.map(({ key, label, color }) => (
                <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={visibleTypes.has(key)}
                        onChange={() => handleToggle(key)}
                        className={`form-checkbox h-4 w-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:checked:bg-primary-500`}
                        style={{ accentColor: 'var(--primary-color, #3b82f6)' }}
                    />
                    <span className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
                        {label}
                    </span>
                </label>
            ))}
        </div>
    );
};

export default CalendarFilterBar;

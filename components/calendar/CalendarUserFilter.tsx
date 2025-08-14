import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getUserColor } from '../../utils/colorUtils';
import Button from '../ui/Button';

interface CalendarUserFilterProps {
    selectedUserIds: Set<number>;
    onSelectionChange: (newSet: Set<number>) => void;
}

const CalendarUserFilter: React.FC<CalendarUserFilterProps> = ({ selectedUserIds, onSelectionChange }) => {
    const { employees } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = (userId: number) => {
        const newSet = new Set(selectedUserIds);
        if (newSet.has(userId)) {
            newSet.delete(userId);
        } else {
            newSet.add(userId);
        }
        onSelectionChange(newSet);
    };

    const filteredEmployees = useMemo(() => {
        return employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [employees, searchTerm]);

    const buttonText = `${selectedUserIds.size} Takvim`;

    return (
        <div className="w-64 flex-shrink-0 bg-card dark:bg-dark-card rounded-lg p-4" ref={wrapperRef}>
            <h3 className="font-bold text-lg mb-3">Takvimler</h3>
            <div className="relative">
                <Button variant="secondary" onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center">
                    <span>{buttonText}</span>
                    <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </Button>

                {isOpen && (
                    <div className="absolute top-full mt-2 w-full bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-lg z-20">
                        <div className="p-2 border-b dark:border-dark-border">
                            <input
                                type="text"
                                placeholder="Çalışan ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                            />
                        </div>
                        <ul className="space-y-1 p-2 max-h-60 overflow-y-auto">
                            {filteredEmployees.map(user => (
                                <li key={user.id}>
                                    <label className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedUserIds.has(user.id)}
                                            onChange={() => handleToggle(user.id)}
                                            className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:checked:bg-primary-500"
                                            style={{ accentColor: getUserColor(user.id) }}
                                        />
                                        <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                                        <span className="text-sm">{user.name}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarUserFilter;

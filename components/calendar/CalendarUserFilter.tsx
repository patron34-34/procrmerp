import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ICONS } from '../../constants';
import { Employee } from '../../types';

interface CalendarUserFilterProps {
    selectedUsers: number[];
    onSelectionChange: (selected: number[]) => void;
}

const CalendarUserFilter: React.FC<CalendarUserFilterProps> = ({ selectedUsers, onSelectionChange }) => {
    const { employees } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const handleToggleUser = (userId: number) => {
        const newSelection = new Set(selectedUsers);
        if(newSelection.has(userId)) {
            newSelection.delete(userId);
        } else {
            newSelection.add(userId);
        }
        onSelectionChange(Array.from(newSelection));
    };

    const handleSelectAll = () => {
        onSelectionChange(employees.map(e => e.id));
    };
    
    const handleClearAll = () => {
        onSelectionChange([]);
    };

    const selectedCount = selectedUsers.length;
    const buttonText = selectedCount === 0 ? 'Kullanıcı Seç' : selectedCount === 1 ? employees.find(e => e.id === selectedUsers[0])?.name : `${selectedCount} Kullanıcı`;

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-slate-600"
            >
                {ICONS.customers}
                <span className="text-sm">{buttonText}</span>
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 right-0 bg-card dark:bg-dark-card border dark:border-dark-border rounded-lg shadow-lg z-20 w-72">
                    <div className="p-2 border-b dark:border-dark-border flex justify-between">
                        <button onClick={handleSelectAll} className="text-xs text-primary-600 hover:underline">Tümünü Seç</button>
                        <button onClick={handleClearAll} className="text-xs text-primary-600 hover:underline">Temizle</button>
                    </div>
                    <div className="max-h-60 overflow-y-auto p-2">
                        {employees.map(emp => (
                            <label key={emp.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(emp.id)}
                                    onChange={() => handleToggleUser(emp.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full"/>
                                <div>
                                    <p className="font-semibold text-sm">{emp.name}</p>
                                    <p className="text-xs text-text-secondary">{emp.position}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// FIX: Add default export to make the component a module.
export default CalendarUserFilter;

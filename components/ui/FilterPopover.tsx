import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { ICONS } from '../../constants';

interface FilterPopoverProps {
    children: ReactNode;
    isFilterActive: boolean;
    onClear: () => void;
    buttonText?: string;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({ children, isFilterActive, onClear, buttonText = "Daha Fazla Filtre" }) => {
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

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center gap-2 p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-slate-600"
            >
                {ICONS.filter}
                {buttonText}
                {isFilterActive && <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-primary-500 ring-2 ring-white dark:ring-slate-700"></span>}
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 right-0 bg-card dark:bg-dark-card border dark:border-dark-border rounded-lg shadow-lg z-20 w-80">
                    <div className="p-4 space-y-4">
                        {children}
                         <div className="flex justify-end pt-4 mt-4 border-t dark:border-dark-border">
                            <button onClick={() => { onClear(); setIsOpen(false); }} className="text-sm text-primary-600 hover:underline">
                                Filtreleri Temizle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterPopover;
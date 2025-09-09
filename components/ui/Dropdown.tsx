import React, { useState, useRef, useEffect, ReactNode, memo } from 'react';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  menuWidth?: string;
  menuPosition?: string;
}

const Dropdown: React.FC<DropdownProps> = memo(({ trigger, children, menuWidth = 'w-48', menuPosition = 'right-0' }) => {
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

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div onClick={toggleDropdown} className="cursor-pointer">
                {trigger}
            </div>
            {isOpen && (
                <div 
                    className={`absolute mt-2 ${menuWidth} ${menuPosition} bg-card rounded-md shadow-lg z-20 border border-border dark:bg-dark-card dark:border-dark-border py-1`}
                >
                    {React.Children.map(children, child =>
                        React.isValidElement(child)
                            ? React.cloneElement(child as React.ReactElement<any>, {
                                closeDropdown: () => setIsOpen(false)
                              })
                            : child
                    )}
                </div>
            )}
        </div>
    );
});

interface DropdownItemProps {
    onClick: (e: React.MouseEvent) => void;
    children: ReactNode;
    // This prop will be injected by Dropdown
    closeDropdown?: () => void;
}


export const DropdownItem: React.FC<DropdownItemProps> = memo(({ onClick, children, closeDropdown }) => {
    const handleClick = (e: React.MouseEvent) => {
        onClick(e); // First, execute the original action
        if (closeDropdown) {
            closeDropdown(); // Then, close the dropdown
        }
    };
    
    return (
        <button 
            onClick={handleClick}
            className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-slate-100 dark:text-dark-text-secondary dark:hover:bg-slate-700"
        >
            {children}
        </button>
    );
});

export default Dropdown;

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Account } from '../../types';

interface AccountSelectorProps {
    value: number;
    onChange: (accountId: number) => void;
    accounts: Account[];
}

const AccountSelector: React.FC<AccountSelectorProps> = ({ value, onChange, accounts }) => {
    const getAccountDisplay = (account?: Account) => account ? `${account.accountNumber} - ${account.name}` : '';
    
    const selectedAccount = accounts.find(a => a.id === value);
    const [searchTerm, setSearchTerm] = useState(getAccountDisplay(selectedAccount));
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSearchTerm(getAccountDisplay(accounts.find(a => a.id === value)));
    }, [value, accounts]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm(getAccountDisplay(accounts.find(a => a.id === value)));
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value, accounts]);

    const filteredAccounts = useMemo(() => {
        if (!isOpen) return [];
        const lowerSearchTerm = searchTerm.toLowerCase();
        return accounts.filter(acc =>
            getAccountDisplay(acc).toLowerCase().includes(lowerSearchTerm)
        );
    }, [searchTerm, accounts, isOpen]);

    const handleSelect = (account: Account) => {
        onChange(account.id);
        setSearchTerm(getAccountDisplay(account));
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <input
                type="text"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); if (!isOpen) setIsOpen(true); }}
                onFocus={() => setIsOpen(true)}
                placeholder="Hesap Kodu/Adı Ara..."
                className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-dark-border"
            />
            {isOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-card dark:bg-dark-card border dark:border-dark-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredAccounts.length > 0 ? filteredAccounts.map(acc => (
                        <li
                            key={acc.id}
                            onClick={() => handleSelect(acc)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center"
                        >
                            <span className="font-mono text-sm text-slate-500 mr-2 w-16">{acc.accountNumber}</span>
                            <span className="font-medium text-sm">{acc.name}</span>
                        </li>
                    )) : <li className="p-2 text-text-secondary">Sonuç bulunamadı.</li>}
                </ul>
            )}
        </div>
    );
};

export default AccountSelector;

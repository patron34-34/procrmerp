import React, { useState, useEffect } from 'react';
import { JournalEntryItem, Account } from '../../types';
import AccountSelector from './AccountSelector';
import { ICONS } from '../../constants';

interface JournalEntryRowProps {
    item: Partial<JournalEntryItem>;
    index: number;
    onChange: (index: number, updatedItem: Partial<JournalEntryItem>) => void;
    onDelete: (index: number) => void;
    accounts: Account[];
    isLastRow: boolean;
    globalMemo: string;
    globalDate: string;
    globalDocNumber: string;
}

const JournalEntryRow: React.FC<JournalEntryRowProps> = ({ item, index, onChange, onDelete, accounts, isLastRow, globalMemo, globalDate, globalDocNumber }) => {
    const [localItem, setLocalItem] = useState(item);
    
    useEffect(() => {
        setLocalItem(item);
    }, [item]);
    
    const handleChange = (field: keyof JournalEntryItem, value: any) => {
        const updatedItem = { ...localItem, [field]: value };

        if (field === 'debit' && parseFloat(value) > 0) {
            updatedItem.credit = 0;
        }
        if (field === 'credit' && parseFloat(value) > 0) {
            updatedItem.debit = 0;
        }

        setLocalItem(updatedItem);
        onChange(index, updatedItem);
    };

    const handleFocus = () => {
        const updatedItem = { ...localItem };
        let itemChanged = false;

        if (!updatedItem.description && globalMemo) {
            updatedItem.description = globalMemo;
            itemChanged = true;
        }
        if (!updatedItem.documentDate && globalDate) {
            updatedItem.documentDate = globalDate;
            itemChanged = true;
        }
        if (!updatedItem.documentNumber && globalDocNumber) {
            updatedItem.documentNumber = globalDocNumber;
            itemChanged = true;
        }
        
        if (itemChanged) {
            setLocalItem(updatedItem);
            onChange(index, updatedItem);
        }
    };
    
    return (
        <div className="group grid grid-cols-[2.5fr_3fr_1.5fr_1.5fr_1fr_1fr_auto] gap-4 items-center p-1 rounded-md focus-within:bg-primary-50 dark:focus-within:bg-primary-900/30">
            <div onFocus={handleFocus}>
               <AccountSelector 
                    accounts={accounts} 
                    value={localItem.accountId || 0} 
                    onChange={accId => handleChange('accountId', accId)} 
                />
            </div>
            <input
                type="text"
                placeholder="Satır açıklaması"
                value={localItem.description || ''}
                onChange={e => handleChange('description', e.target.value)}
                onFocus={handleFocus}
                className="w-full"
            />
            <input
                type="date"
                value={localItem.documentDate || ''}
                onChange={e => handleChange('documentDate', e.target.value)}
                onFocus={handleFocus}
                className="w-full"
            />
            <input
                type="text"
                placeholder="Satır belge no"
                value={localItem.documentNumber || ''}
                onChange={e => handleChange('documentNumber', e.target.value)}
                onFocus={handleFocus}
                className="w-full"
            />
            <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={localItem.debit || ''}
                onChange={e => handleChange('debit', e.target.value)}
                onFocus={handleFocus}
                className="w-full text-right"
            />
            <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={localItem.credit || ''}
                onChange={e => handleChange('credit', e.target.value)}
                onFocus={handleFocus}
                className="w-full text-right"
            />
            <div className="flex items-center justify-center">
                <button
                    type="button"
                    onClick={() => onDelete(index)}
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                    aria-label="Satırı sil"
                    tabIndex={-1}
                    disabled={isLastRow}
                >
                    {ICONS.trash}
                </button>
            </div>
        </div>
    );
};

export default JournalEntryRow;
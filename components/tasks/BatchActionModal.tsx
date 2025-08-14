
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { TaskStatus, TaskPriority } from '../../types';

interface BatchActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (value: string | number) => void;
    action: 'assign' | 'status' | 'priority';
    itemCount: number;
}

const BatchActionModal: React.FC<BatchActionModalProps> = ({ isOpen, onClose, onConfirm, action, itemCount }) => {
    const { employees } = useApp();
    const [selectedValue, setSelectedValue] = useState<string | number>('');

    const titleMap = {
        assign: 'Sorumlu Değiştir',
        status: 'Durum Değiştir',
        priority: 'Öncelik Değiştir'
    };

    const renderInput = () => {
        switch (action) {
            case 'assign':
                return (
                    <select value={selectedValue} onChange={(e) => setSelectedValue(Number(e.target.value))} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                        <option value="" disabled>Sorumlu seçin...</option>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                );
            case 'status':
                return (
                    <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                         <option value="" disabled>Durum seçin...</option>
                        {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                );
            case 'priority':
                 return (
                    <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                         <option value="" disabled>Öncelik seçin...</option>
                        {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                );
            default:
                return null;
        }
    };
    
    const handleConfirm = () => {
        if(selectedValue) {
            onConfirm(selectedValue);
            onClose();
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={titleMap[action]}>
            <div className="space-y-4">
                <p>{itemCount} görev için yeni değeri seçin.</p>
                {renderInput()}
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" onClick={onClose}>İptal</Button>
                    <Button onClick={handleConfirm} disabled={!selectedValue}>Onayla</Button>
                </div>
            </div>
        </Modal>
    );
};

export default BatchActionModal;
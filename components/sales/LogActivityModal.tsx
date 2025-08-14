

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SalesActivityType } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ICONS } from '../../constants';

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealId: number;
  activityType?: SalesActivityType;
}

const LogActivityModal: React.FC<LogActivityModalProps> = ({ isOpen, onClose, dealId, activityType = SalesActivityType.Call }) => {
    const { addSalesActivity, currentUser } = useApp();
    const [type, setType] = useState<SalesActivityType>(activityType);
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (notes.trim()) {
            addSalesActivity({
                dealId,
                type,
                notes,
                userId: currentUser.id,
            });
            onClose();
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Aktivite Kaydet">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Aktivite Türü</label>
                    <div className="flex gap-2 mt-2">
                        {Object.values(SalesActivityType).filter(t => t !== SalesActivityType.System).map(t => (
                            <Button 
                                key={t}
                                type="button"
                                variant={type === t ? 'primary' : 'secondary'}
                                onClick={() => setType(t)}
                            >
                                {t}
                            </Button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Notlar *</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={5}
                        className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:border-dark-border dark:text-white"
                        placeholder={`${type} ile ilgili detayları buraya yazın...`}
                        required
                    />
                </div>
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">Kaydet</Button>
                </div>
            </form>
        </Modal>
    );
};

export default LogActivityModal;
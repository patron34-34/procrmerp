

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CommunicationLog, CommunicationLogType } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ICONS } from '../../constants';

interface CommunicationLogFormProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: number;
  logType?: CommunicationLogType;
  logToEdit?: CommunicationLog | null;
}

const CommunicationLogForm: React.FC<CommunicationLogFormProps> = ({ isOpen, onClose, customerId, logType = CommunicationLogType.Note, logToEdit = null }) => {
    const { addCommunicationLog, updateCommunicationLog } = useApp();
    const [content, setContent] = useState('');
    const [currentType, setCurrentType] = useState(logType);

    useEffect(() => {
        if (logToEdit) {
            setContent(logToEdit.content);
            setCurrentType(logToEdit.type);
        } else {
            setContent('');
            setCurrentType(logType);
        }
    }, [logToEdit, logType, isOpen]);

    const title = logToEdit ? "İletişim Kaydını Düzenle" : `Yeni ${currentType} Ekle`;
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            if (logToEdit) {
                updateCommunicationLog({ ...logToEdit, content, type: currentType });
            } else {
                addCommunicationLog(customerId, currentType, content);
            }
            onClose();
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Aktivite Türü</label>
                    <div className="flex gap-2 mt-2">
                        {Object.values(CommunicationLogType).map(t => (
                            <Button 
                                key={t}
                                type="button"
                                variant={currentType === t ? 'primary' : 'secondary'}
                                onClick={() => setCurrentType(t)}
                            >
                                {t}
                            </Button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Detaylar</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                        className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:border-dark-border dark:text-white"
                        placeholder={`${currentType} ile ilgili detayları buraya yazın...`}
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

export default CommunicationLogForm;
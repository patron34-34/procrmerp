

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: number | null;
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ isOpen, onClose, parentId }) => {
    const { addFolder } = useApp();
    const [folderName, setFolderName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (folderName.trim()) {
            addFolder(folderName.trim(), parentId);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni Klasör Oluştur">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="folderName" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Klasör Adı</label>
                    <input
                        type="text"
                        id="folderName"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        className="mt-1 block w-full p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border"
                        required
                        autoFocus
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" type="button" onClick={onClose}>İptal</Button>
                    <Button type="submit">Oluştur</Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateFolderModal;
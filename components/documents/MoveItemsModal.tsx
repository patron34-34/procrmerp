
import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Document } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ICONS } from '../../constants';

interface MoveItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemsToMove: number[];
  currentFolderId: number | null;
}

const FolderTree: React.FC<{
    folders: Document[];
    currentParentId: number | null;
    selectedFolderId: number | null;
    onSelect: (id: number | null) => void;
    itemsToMove: number[];
    level?: number;
}> = ({ folders, currentParentId, selectedFolderId, onSelect, itemsToMove, level = 0 }) => {
    const childFolders = folders.filter(f => f.parentId === currentParentId && !itemsToMove.includes(f.id));
    
    return (
        <div style={{ paddingLeft: level * 20 }}>
            {childFolders.map(folder => (
                <div key={folder.id}>
                    <button 
                        onClick={() => onSelect(folder.id)}
                        className={`w-full text-left p-2 my-1 rounded-md flex items-center gap-2 ${selectedFolderId === folder.id ? 'bg-primary-100 dark:bg-primary-900/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        {ICONS.folder} {folder.name}
                    </button>
                    <FolderTree
                        folders={folders}
                        currentParentId={folder.id}
                        selectedFolderId={selectedFolderId}
                        onSelect={onSelect}
                        itemsToMove={itemsToMove}
                        level={level + 1}
                    />
                </div>
            ))}
        </div>
    );
};


const MoveItemsModal: React.FC<MoveItemsModalProps> = ({ isOpen, onClose, itemsToMove, currentFolderId }) => {
    const { documents, moveDocuments } = useApp();
    const [targetFolderId, setTargetFolderId] = useState<number | null>(null);

    const allFolders = useMemo(() => documents.filter(d => d.type === 'folder'), [documents]);

    const handleSubmit = () => {
        if (itemsToMove.length > 0) {
            moveDocuments(itemsToMove, targetFolderId);
            onClose();
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Öğeleri Taşı">
            <div className="space-y-4">
                <p>Nereye taşımak istersiniz?</p>
                <div className="max-h-60 overflow-y-auto border rounded-md p-2 dark:border-dark-border">
                    <button 
                        onClick={() => setTargetFolderId(null)}
                        className={`w-full text-left p-2 my-1 rounded-md flex items-center gap-2 ${targetFolderId === null ? 'bg-primary-100 dark:bg-primary-900/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                       {ICONS.documents} Ana Dizin
                    </button>
                    <FolderTree
                        folders={allFolders}
                        currentParentId={null}
                        selectedFolderId={targetFolderId}
                        onSelect={setTargetFolderId}
                        itemsToMove={itemsToMove}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>İptal</Button>
                    <Button onClick={handleSubmit} disabled={targetFolderId === currentFolderId}>Buraya Taşı</Button>
                </div>
            </div>
        </Modal>
    );
};

export default MoveItemsModal;

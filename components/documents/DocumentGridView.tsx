import React, { useState } from 'react';
import { Document } from '../../types';
import { ICONS } from '../../constants';
import { useApp } from '../../context/AppContext';

interface DocumentGridViewProps {
    items: Document[];
    selectedIds: number[];
    onSelectionChange: (ids: number[]) => void;
    onFolderDoubleClick: (folderId: number) => void;
    onFileClick: (file: Document) => void;
    onContextMenu: (e: React.MouseEvent, item: Document) => void;
    onDrop: (targetFolderId: number | null, draggedItemId: number) => void;
}

const DocumentGridView: React.FC<DocumentGridViewProps> = ({ items, selectedIds, onSelectionChange, onFolderDoubleClick, onFileClick, onContextMenu, onDrop }) => {
    const { renameDocument, toggleDocumentStar } = useApp();
    const [renamingId, setRenamingId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [dragOverId, setDragOverId] = useState<number | null>(null);

    const handleSelectOne = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        const isSelected = selectedIds.includes(id);
        if (isSelected) {
            onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    const getFileIcon = (item: Document) => {
        if (item.type === 'folder') return <span className="text-yellow-500 h-12 w-12">{ICONS.folder}</span>;
        
        const style = "h-12 w-12";
        switch (item.documentType) {
            case 'PDF': return <span className={style}>{ICONS.filePdf}</span>;
            case 'Word': return <span className={style}>{ICONS.fileWord}</span>;
            case 'Excel': return <span className={style}>{ICONS.fileExcel}</span>;
            case 'Resim': return <span className={style}>{ICONS.fileImage}</span>;
            default: return <span className={style}>{ICONS.fileOther}</span>;
        }
    };
    
    const handleCardClick = (item: Document) => {
        if (item.type === 'file') {
            onFileClick(item);
        }
    };

    const startRename = (item: Document) => {
        setRenamingId(item.id);
        setName(item.name);
    };

    const handleRename = () => {
        if (renamingId && name.trim()) {
            renameDocument(renamingId, name.trim());
        }
        setRenamingId(null);
    };

    const handleDragStart = (e: React.DragEvent, item: Document) => {
        e.dataTransfer.setData('text/plain', item.id.toString());
    };

    const handleDragOver = (e: React.DragEvent, item: Document) => {
        if (item.type === 'folder') {
            e.preventDefault();
            setDragOverId(item.id);
        }
    };

    const handleDrop = (e: React.DragEvent, item: Document) => {
        e.preventDefault();
        setDragOverId(null);
        if (item.type === 'folder') {
            const draggedItemId = parseInt(e.dataTransfer.getData('text/plain'));
            onDrop(item.id, draggedItemId);
        }
    };
    
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map(item => (
                <div
                    key={item.id}
                    className={`relative p-4 border rounded-lg flex flex-col items-center text-center cursor-pointer transition-colors ${dragOverId === item.id ? 'bg-primary-100 border-primary-500 dark:bg-primary-900/50' : selectedIds.includes(item.id) ? 'bg-primary-100 border-primary-500 dark:bg-primary-900/50' : 'bg-slate-50 hover:bg-slate-100 dark:bg-dark-card/50 dark:hover:bg-slate-800/50 dark:border-dark-border'}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragOver={(e) => handleDragOver(e, item)}
                    onDragLeave={() => setDragOverId(null)}
                    onDrop={(e) => handleDrop(e, item)}
                    onClick={() => handleCardClick(item)}
                    onDoubleClick={() => item.type === 'folder' ? onFolderDoubleClick(item.id) : startRename(item)}
                    onContextMenu={(e) => onContextMenu(e, item)}
                >
                    <div 
                       onClick={(e) => handleSelectOne(e, item.id)}
                       className="absolute top-2 left-2 h-5 w-5 rounded border-2 border-slate-300 dark:border-slate-500 flex items-center justify-center cursor-pointer z-10"
                    >
                       {selectedIds.includes(item.id) && <div className="w-3 h-3 bg-primary-600 rounded-sm"></div>}
                    </div>
                     <button onClick={(e) => { e.stopPropagation(); toggleDocumentStar(item.id); }} className={`absolute top-2 right-2 text-slate-400 hover:text-yellow-500 z-10 ${item.isStarred ? 'text-yellow-400' : ''}`}>
                        {item.isStarred ? ICONS.starFilled : ICONS.starOutline}
                    </button>
                    
                    <div className="mb-2">
                        {getFileIcon(item)}
                    </div>
                    {renamingId === item.id ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={handleRename}
                            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                            className="text-sm p-1 border rounded bg-white dark:bg-slate-800 w-full"
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    ) : (
                         <p className="text-sm font-medium break-words w-full truncate" title={item.name}>{item.name}</p>
                    )}
                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary flex items-center gap-1">
                        {item.type === 'file' ? new Date(item.uploadDate).toLocaleDateString('tr-TR') : 'Klasör'}
                        {item.sharedWith && item.sharedWith.length > 0 && <span title={`${item.sharedWith.length} kişiyle paylaşıldı`}>{ICONS.share}</span>}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default DocumentGridView;
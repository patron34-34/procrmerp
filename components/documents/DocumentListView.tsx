import React, { useState } from 'react';
import { Document } from '../../types';
import { ICONS } from '../../constants';
import { useApp } from '../../context/AppContext';

interface DocumentListViewProps {
    items: Document[];
    selectedIds: number[];
    onSelectionChange: (ids: number[]) => void;
    onFolderDoubleClick: (folderId: number) => void;
    onFileClick: (file: Document) => void;
    onContextMenu: (e: React.MouseEvent, item: Document) => void;
    onDrop: (targetFolderId: number | null, draggedItemId: number) => void;
}

const DocumentListView: React.FC<DocumentListViewProps> = ({ items, selectedIds, onSelectionChange, onFolderDoubleClick, onFileClick, onContextMenu, onDrop }) => {
    const { renameDocument, toggleDocumentStar } = useApp();
    const [renamingId, setRenamingId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [dragOverId, setDragOverId] = useState<number | null>(null);
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            onSelectionChange(items.map(item => item.id));
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        if (e.target.checked) {
            onSelectionChange([...selectedIds, id]);
        } else {
            onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
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

    const getFileIcon = (item: Document) => {
        if (item.type === 'folder') return <span className="text-yellow-500">{ICONS.folder}</span>;
        
        switch (item.documentType) {
            case 'PDF': return ICONS.filePdf;
            case 'Word': return ICONS.fileWord;
            case 'Excel': return ICONS.fileExcel;
            case 'Resim': return ICONS.fileImage;
            default: return ICONS.fileOther;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b dark:border-dark-border">
                    <tr className="bg-slate-50 dark:bg-slate-900/50">
                        <th className="p-3 w-12"><input type="checkbox" onChange={handleSelectAll} checked={items.length > 0 && selectedIds.length === items.length} /></th>
                        <th className="p-3 w-12"></th>
                        <th className="p-3 font-semibold">Ad</th>
                        <th className="p-3 font-semibold">Yükleyen</th>
                        <th className="p-3 font-semibold">Tarih</th>
                        <th className="p-3 font-semibold">Boyut</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr 
                            key={item.id} 
                            className={`border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${dragOverId === item.id ? 'bg-primary-100 dark:bg-primary-900/50' : ''}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                            onDragOver={(e) => handleDragOver(e, item)}
                            onDragLeave={() => setDragOverId(null)}
                            onDrop={(e) => handleDrop(e, item)}
                            onDoubleClick={() => item.type === 'folder' && onFolderDoubleClick(item.id)}
                            onClick={() => item.type === 'file' && onFileClick(item)}
                            onContextMenu={(e) => onContextMenu(e, item)}
                        >
                            <td className="p-3" onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={(e) => handleSelectOne(e, item.id)} /></td>
                            <td className="p-3 text-center">
                                <button onClick={(e) => { e.stopPropagation(); toggleDocumentStar(item.id); }} className={`text-slate-400 hover:text-yellow-500 ${item.isStarred ? 'text-yellow-400' : ''}`}>
                                    {item.isStarred ? ICONS.starFilled : ICONS.starOutline}
                                </button>
                            </td>
                            <td className="p-3 font-medium flex items-center gap-3">
                                {getFileIcon(item)}
                                {renamingId === item.id ? (
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        onBlur={handleRename}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                                        className="p-1 border rounded bg-white dark:bg-slate-800"
                                        onClick={e => e.stopPropagation()}
                                        autoFocus
                                    />
                                ) : (
                                    <span onDoubleClick={(e) => { e.stopPropagation(); startRename(item); }} className="cursor-pointer">{item.name}</span>
                                )}
                                {item.sharedWith && item.sharedWith.length > 0 && <span className="ml-2 text-slate-400" title={`${item.sharedWith.length} kişiyle paylaşıldı`}>{ICONS.share}</span>}
                            </td>
                            <td className="p-3 text-sm text-text-secondary dark:text-dark-text-secondary">{item.uploadedByName}</td>
                            <td className="p-3 text-sm text-text-secondary dark:text-dark-text-secondary">{new Date(item.uploadDate).toLocaleDateString('tr-TR')}</td>
                            <td className="p-3 text-sm text-text-secondary dark:text-dark-text-secondary">
                                {item.type === 'file' && item.fileSize ? `${(item.fileSize / 1024).toFixed(2)} MB` : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentListView;
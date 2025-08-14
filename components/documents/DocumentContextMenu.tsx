import React from 'react';
import { Document } from '../../types';
import { ICONS } from '../../constants';

interface DocumentContextMenuProps {
  x: number;
  y: number;
  item: Document;
  onClose: () => void;
  onPreview: () => void;
  onMove: () => void;
  onDelete: () => void;
  onShare: () => void;
  onToggleStar: () => void;
}

const DocumentContextMenu: React.FC<DocumentContextMenuProps> = ({ x, y, item, onClose, onPreview, onMove, onDelete, onShare, onToggleStar }) => {
    
    const menuStyle: React.CSSProperties = {
        top: y,
        left: x,
        position: 'absolute',
    };
    
    const handleAction = (action: () => void) => {
        action();
        onClose();
    };

    return (
        <div style={menuStyle} className="z-50 bg-card dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-md shadow-lg w-48 py-1">
            {item.type === 'file' && (
                 <button onClick={() => handleAction(onPreview)} className="w-full text-left px-4 py-2 text-sm text-text-main dark:text-dark-text-main hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">Önizle</button>
            )}
            <button onClick={() => handleAction(onToggleStar)} className="w-full text-left px-4 py-2 text-sm text-text-main dark:text-dark-text-main hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                {item.isStarred ? ICONS.starFilled : ICONS.starOutline} {item.isStarred ? 'Yıldızı Kaldır' : 'Yıldızla'}
            </button>
             <button onClick={() => handleAction(onShare)} className="w-full text-left px-4 py-2 text-sm text-text-main dark:text-dark-text-main hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">{ICONS.share} Paylaş</button>
            <button onClick={() => handleAction(onMove)} className="w-full text-left px-4 py-2 text-sm text-text-main dark:text-dark-text-main hover:bg-slate-100 dark:hover:bg-slate-700">Taşı</button>
            <button onClick={() => handleAction(onDelete)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700">Sil</button>
        </div>
    );
};

export default DocumentContextMenu;
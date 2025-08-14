import React, { useState, useEffect } from 'react';
import { Document } from '../../types';
import Modal from '../ui/Modal';
import { ICONS } from '../../constants';
import Button from '../ui/Button';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Document | null;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ isOpen, onClose, item }) => {
    
    if (!item) return null;

    const getFileIcon = () => {
        if (item.type === 'folder') return <span className="text-yellow-500 h-20 w-20">{ICONS.folder}</span>;
        
        const style = "h-20 w-20";
        switch (item.documentType) {
            case 'PDF': return <span className={style}>{ICONS.filePdf}</span>;
            case 'Word': return <span className={style}>{ICONS.fileWord}</span>;
            case 'Excel': return <span className={style}>{ICONS.fileExcel}</span>;
            case 'Resim': return <span className={style}>{ICONS.fileImage}</span>;
            default: return <span className={style}>{ICONS.fileOther}</span>;
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Önizleme">
            <div className="flex flex-col items-center text-center">
                {getFileIcon()}
                <h3 className="text-xl font-bold mt-4 break-all">{item.name}</h3>
                
                <div className="mt-4 pt-4 border-t w-full dark:border-dark-border text-left space-y-2 text-sm">
                    <p><strong>Yükleyen:</strong> {item.uploadedByName}</p>
                    <p><strong>Yükleme Tarihi:</strong> {new Date(item.uploadDate).toLocaleString('tr-TR')}</p>
                    {item.type === 'file' && item.fileSize && (
                         <p><strong>Dosya Boyutu:</strong> {(item.fileSize / 1024).toFixed(2)} MB</p>
                    )}
                    {item.relatedEntityName && (
                        <p><strong>İlgili Kayıt:</strong> {item.relatedEntityName} ({item.relatedEntityType})</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default DocumentPreviewModal;
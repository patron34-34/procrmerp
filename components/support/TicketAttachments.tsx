import React, { useState, useRef } from 'react';
import { SupportTicket, Attachment, DocumentType } from '../../types';
import { ICONS } from '../../constants';
import Button from '../ui/Button';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';

interface TicketAttachmentsProps {
    ticket: SupportTicket;
    onAttachmentsChange: (newAttachments: Attachment[]) => void;
    canManage: boolean;
}

const TicketAttachments: React.FC<TicketAttachmentsProps> = ({ ticket, onAttachmentsChange, canManage }) => {
    const { currentUser } = useApp();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'pdf': return ICONS.filePdf;
            case 'doc':
            case 'docx': return ICONS.fileWord;
            case 'xls':
            case 'xlsx': return ICONS.fileExcel;
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif': return ICONS.fileImage;
            default: return ICONS.fileOther;
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newAttachments: Attachment[] = Array.from(e.target.files).map(file => ({
                id: Date.now() + Math.random(),
                fileName: file.name,
                fileType: 'Other', // A real implementation would determine this properly
                fileSize: Math.round(file.size / 1024), // in KB
                url: '#', // mock URL
                uploadedAt: new Date().toISOString(),
                uploadedById: currentUser.id,
            }));
            onAttachmentsChange([...(ticket.attachments || []), ...newAttachments]);
        }
        e.target.value = ''; // Reset file input
    };

    const handleRemoveAttachment = (attachmentId: number) => {
        const updatedAttachments = ticket.attachments.filter(att => att.id !== attachmentId);
        onAttachmentsChange(updatedAttachments);
    };

    return (
        <Card title="Dosya Ekleri">
             <input 
                type="file" 
                multiple 
                ref={fileInputRef} 
                onChange={handleFileSelect}
                className="hidden"
            />
            <div className="space-y-2">
                {(ticket.attachments && ticket.attachments.length > 0) ? (
                    ticket.attachments.map(att => (
                        <div key={att.id} className="group flex items-center justify-between p-2 rounded-md bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className="flex-shrink-0 text-slate-500">{getFileIcon(att.fileName)}</span>
                                <div className="truncate">
                                    <p className="font-medium text-sm truncate" title={att.fileName}>{att.fileName}</p>
                                    <p className="text-xs text-text-secondary">{att.fileSize} KB</p>
                                </div>
                            </div>
                            <div className="flex items-center flex-shrink-0">
                                {canManage && (
                                    <button onClick={() => handleRemoveAttachment(att.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                        {ICONS.trash}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : <p className="text-text-secondary text-sm text-center py-4">Bu talebe dosya eklenmemiş.</p>}
            </div>
             {canManage && (
                <Button onClick={handleUploadClick} variant="secondary" className="mt-4 w-full justify-center">
                    <span className="flex items-center gap-2">{ICONS.add} Dosya Yükle (Simülasyon)</span>
                </Button>
            )}
        </Card>
    );
};

export default TicketAttachments;
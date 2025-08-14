import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Document, DocumentShare, SharePermission, Employee } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ICONS } from '../../constants';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Document;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, item }) => {
    const { employees, shareDocument } = useApp();
    const [shares, setShares] = useState<DocumentShare[]>([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(0);

    useEffect(() => {
        if (item) {
            setShares(item.sharedWith || []);
            const firstUnsharedEmployee = employees.find(e => !(item.sharedWith || []).some(s => s.userId === e.id));
            setSelectedEmployeeId(firstUnsharedEmployee?.id || 0);
        }
    }, [item, employees]);

    const handleAddShare = () => {
        if (selectedEmployeeId && !shares.some(s => s.userId === selectedEmployeeId)) {
            setShares([...shares, { userId: selectedEmployeeId, permission: SharePermission.View }]);
        }
    };
    
    const handleRemoveShare = (userId: number) => {
        setShares(shares.filter(s => s.userId !== userId));
    };

    const handlePermissionChange = (userId: number, permission: SharePermission) => {
        setShares(shares.map(s => s.userId === userId ? { ...s, permission } : s));
    };

    const handleSave = () => {
        shareDocument(item.id, shares);
        onClose();
    };
    
    const getEmployee = (userId: number): Employee | undefined => employees.find(e => e.id === userId);
    
    const unsharedEmployees = employees.filter(e => !shares.some(s => s.userId === e.id));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`'${item.name}' Paylaş`}>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold mb-2">Yeni Kişi Ekle</h4>
                    <div className="flex gap-2">
                        <select
                            value={selectedEmployeeId}
                            onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
                            className="flex-grow p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                        >
                            {unsharedEmployees.length > 0 ? (
                                unsharedEmployees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)
                            ) : (
                                <option disabled>Paylaşılacak kimse kalmadı</option>
                            )}
                        </select>
                        <Button onClick={handleAddShare} disabled={!selectedEmployeeId}>Ekle</Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="font-semibold border-t pt-3 dark:border-dark-border">Kimler Erişebilir?</h4>
                     {shares.map(share => {
                         const employee = getEmployee(share.userId);
                         if (!employee) return null;
                         return (
                             <div key={share.userId} className="flex items-center justify-between p-2 rounded-md bg-slate-50 dark:bg-slate-700/50">
                                 <div className="flex items-center gap-3">
                                     <img src={employee.avatar} alt={employee.name} className="h-9 w-9 rounded-full"/>
                                     <div>
                                         <p className="font-semibold text-sm">{employee.name}</p>
                                         <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{employee.position}</p>
                                     </div>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <select
                                        value={share.permission}
                                        onChange={(e) => handlePermissionChange(share.userId, e.target.value as SharePermission)}
                                        className="p-1 border text-xs rounded-md dark:bg-slate-700 dark:border-dark-border"
                                     >
                                         <option value={SharePermission.View}>Görüntüleyebilir</option>
                                         <option value={SharePermission.Edit}>Düzenleyebilir</option>
                                     </select>
                                     <button onClick={() => handleRemoveShare(share.userId)} className="text-red-500 hover:text-red-700">{ICONS.trash}</button>
                                 </div>
                             </div>
                         )
                     })}
                </div>

                <div className="flex justify-end pt-4 gap-2 border-t dark:border-dark-border">
                    <Button variant="secondary" onClick={onClose}>İptal</Button>
                    <Button onClick={handleSave}>Kaydet</Button>
                </div>
            </div>
        </Modal>
    );
};

export default ShareModal;

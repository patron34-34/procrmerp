import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Candidate, CandidateStage } from '../../../types';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';

interface CandidateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
}

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({ isOpen, onClose, candidate }) => {
    const { updateCandidate, hasPermission } = useApp();
    const [notes, setNotes] = useState(candidate.notes || '');
    const [stage, setStage] = useState(candidate.stage);

    const canManage = hasPermission('ik:ise-alim-yonet');

    useEffect(() => {
        setNotes(candidate.notes || '');
        setStage(candidate.stage);
    }, [candidate]);

    const handleSave = () => {
        updateCandidate({ ...candidate, notes, stage });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Aday Detayları">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <img src={candidate.avatar} alt={candidate.name} className="h-16 w-16 rounded-full" />
                    <div>
                        <h3 className="text-xl font-bold">{candidate.name}</h3>
                        <p className="text-text-secondary">{candidate.jobTitle}</p>
                    </div>
                </div>
                <div className="text-sm">
                    <p><strong>E-posta:</strong> {candidate.email}</p>
                    <p><strong>Telefon:</strong> {candidate.phone}</p>
                    <p><strong>Başvuru Tarihi:</strong> {candidate.applicationDate}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium">Aşama</label>
                    <select
                        value={stage}
                        onChange={(e) => setStage(e.target.value as CandidateStage)}
                        disabled={!canManage}
                        className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                    >
                        {Object.values(CandidateStage).map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Notlar</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        disabled={!canManage}
                        rows={5}
                        className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                        placeholder="Mülakat notları, geri bildirimler..."
                    />
                </div>
                {canManage && (
                    <div className="flex justify-end pt-4 gap-2">
                        <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                        <Button onClick={handleSave}>Kaydet</Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default CandidateDetailModal;
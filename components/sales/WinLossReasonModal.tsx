

import React, { useState } from 'react';
import { DealStage } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { WIN_REASONS, LOSS_REASONS } from '../../constants';

interface WinLossReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  stage: DealStage.Won | DealStage.Lost;
}

const WinLossReasonModal: React.FC<WinLossReasonModalProps> = ({ isOpen, onClose, onSubmit, stage }) => {
    const [reason, setReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    
    const reasons = stage === DealStage.Won ? WIN_REASONS : LOSS_REASONS;

    const handleSubmit = () => {
        const finalReason = reason === 'Diğer' ? otherReason : reason;
        if (finalReason.trim()) {
            onSubmit(finalReason);
        } else {
            alert('Lütfen bir neden belirtin.');
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Anlaşma ${stage === DealStage.Won ? 'Kazanıldı' : 'Kaybedildi'} Nedeni`}
        >
            <div className="space-y-4">
                <p>Lütfen bu sonucun ana nedenini seçin veya belirtin.</p>
                <div className="flex flex-wrap gap-2">
                    {reasons.map(r => (
                        <Button
                            key={r}
                            variant={reason === r ? 'primary' : 'secondary'}
                            onClick={() => setReason(r)}
                        >
                            {r}
                        </Button>
                    ))}
                </div>
                {reason === 'Diğer' && (
                    <div>
                        <label htmlFor="otherReason" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Diğer Nedeni Belirtin</label>
                        <input
                            type="text"
                            id="otherReason"
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                            className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                            autoFocus
                        />
                    </div>
                )}
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button onClick={handleSubmit} disabled={!reason}>Kaydet</Button>
                </div>
            </div>
        </Modal>
    );
};

export default WinLossReasonModal;

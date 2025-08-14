import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Deal, DealStage } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { WIN_REASONS } from '../../constants';

interface DealWonModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal;
}

const DealWonModal: React.FC<DealWonModalProps> = ({ isOpen, onClose, deal }) => {
    const { updateDealWinLossReason, createProjectFromDeal, createTasksFromDeal, convertDealToSalesOrder } = useApp();
    const [winReason, setWinReason] = useState('');
    const [otherReason, setOtherReason] = useState('');

    const handleAction = (action: 'just_close' | 'create_project' | 'create_tasks') => {
        const finalReason = winReason === 'Diğer' ? otherReason : winReason;
        if (!finalReason.trim()) {
            alert('Lütfen bir kazanma nedeni belirtin.');
            return;
        }

        // First, update the deal status
        updateDealWinLossReason(deal.id, DealStage.Won, finalReason);

        // ALWAYS create a sales order upon winning
        convertDealToSalesOrder(deal);

        // Then, perform the optional follow-up action
        if (action === 'create_project') {
            createProjectFromDeal(deal);
        } else if (action === 'create_tasks') {
            createTasksFromDeal(deal);
        }
        
        onClose();
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`🎉 Tebrikler! '${deal.title}' Kazanıldı!`}
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Bu başarının arkasındaki ana neden neydi?</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {WIN_REASONS.map(r => (
                            <Button
                                key={r}
                                variant={winReason === r ? 'primary' : 'secondary'}
                                onClick={() => setWinReason(r)}
                            >
                                {r}
                            </Button>
                        ))}
                    </div>
                    {winReason === 'Diğer' && (
                        <input
                            type="text"
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                            className="mt-2 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                            placeholder="Diğer nedeni belirtin..."
                            autoFocus
                        />
                    )}
                </div>
                
                <div className="border-t pt-4 space-y-2 dark:border-dark-border">
                    <h4 className="font-semibold">Sonraki Adım Nedir?</h4>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                        Satış siparişiniz otomatik olarak oluşturuldu. Dilerseniz ek olarak aşağıdaki adımları da başlatabilirsiniz.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button onClick={() => handleAction('create_project')} className="w-full justify-center">
                            Proje Oluştur
                        </Button>
                        <Button onClick={() => handleAction('create_tasks')} className="w-full justify-center">
                            Başlangıç Görevleri Oluştur
                        </Button>
                    </div>
                </div>

                <div className="text-center pt-4">
                     <button onClick={() => handleAction('just_close')} className="text-sm text-primary-600 hover:underline">
                        Sadece Anlaşmayı Kapat
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DealWonModal;
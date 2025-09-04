import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Deal } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { WIN_REASONS } from '../../constants';
import { useNotification } from '../../context/NotificationContext';

interface DealWonModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal;
}

const DealWonModal: React.FC<DealWonModalProps> = ({ isOpen, onClose, deal }) => {
    const { api } = useApp();
    const { addToast } = useNotification();
    const [winReason, setWinReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [createProject, setCreateProject] = useState(true);
    const [createTasks, setCreateTasks] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleConfirm = async () => {
        const finalReason = winReason === 'Diğer' ? otherReason : winReason;
        if (!finalReason.trim()) {
            addToast('Lütfen bir kazanma nedeni belirtin.', 'warning');
            return;
        }

        setIsLoading(true);
        await api.winDeal(deal, finalReason, createProject, createTasks);
        setIsLoading(false);

        addToast(`'${deal.title}' anlaşması başarıyla kazanıldı!`, 'success');
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
                    <h4 className="font-semibold">Sonraki Adımlar</h4>
                     <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                        Anlaşma kalemleri varsa satış siparişiniz otomatik olarak oluşturulacaktır. Dilerseniz ek olarak aşağıdaki adımları da başlatabilirsiniz.
                    </p>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <input type="checkbox" checked={createProject} onChange={e => setCreateProject(e.target.checked)} className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500" />
                            <span>Bu anlaşma için otomatik bir proje oluştur.</span>
                        </label>
                         <label className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <input type="checkbox" checked={createTasks} onChange={e => setCreateTasks(e.target.checked)} className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500" />
                            <span>Başlangıç görevleri oluştur (şablondan).</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4 gap-2">
                     <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>İptal</Button>
                     <Button onClick={handleConfirm} disabled={!winReason.trim() || isLoading}>
                        {isLoading ? <div className="spinner !w-4 !h-4"></div> : 'Onayla'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DealWonModal;

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
    const { winDeal, taskTemplates } = useApp();
    const { addToast } = useNotification();
    
    const [winReason, setWinReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [createProject, setCreateProject] = useState(true);
    const [useTaskTemplate, setUseTaskTemplate] = useState(false);
    const [selectedTaskTemplateId, setSelectedTaskTemplateId] = useState<number | undefined>(taskTemplates[0]?.id);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        const finalReason = winReason === 'Diğer' ? otherReason : winReason;
        if (!finalReason.trim()) {
            addToast('Lütfen bir kazanma nedeni belirtin.', 'warning');
            return;
        }
        
        setIsLoading(true);
        try {
            await winDeal(deal, finalReason, createProject, useTaskTemplate, selectedTaskTemplateId);
            addToast(`'${deal.title}' anlaşması başarıyla kazanıldı! İlgili kayıtlar oluşturuldu.`, 'success');
            onClose();
        } catch (error) {
            console.error("Error winning deal:", error);
            addToast("Anlaşma kazanılırken bir hata oluştu.", "error");
        } finally {
            setIsLoading(false);
        }
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
                            className="mt-2 block w-full"
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
                            <input type="checkbox" checked={useTaskTemplate} onChange={e => setUseTaskTemplate(e.target.checked)} className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500" disabled={!createProject} />
                            <span>Başlangıç görevleri oluştur (şablondan).</span>
                        </label>
                        {createProject && useTaskTemplate && (
                            <div className="pl-8">
                                <label className="block text-sm font-medium text-text-secondary">Kullanılacak Görev Şablonu</label>
                                <select 
                                    value={selectedTaskTemplateId} 
                                    onChange={(e) => setSelectedTaskTemplateId(Number(e.target.value))}
                                    className="w-full"
                                >
                                    {taskTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                        )}
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

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Deal, DealStage } from '../../types';
import Button from '../ui/Button';
import { ICONS, WIN_REASONS } from '../../constants';
import SalesStats from '../sales/SalesStats';
import SalesFilterBar from '../sales/SalesFilterBar';
import DealFormModal from '../sales/DealFormModal';
import ConfirmationModal from '../ui/ConfirmationModal';
import SalesKanbanView from '../sales/SalesKanbanView';
import SalesListView from '../sales/SalesListView';
import WinLossReasonModal from '../sales/WinLossReasonModal';
import Modal from '../ui/Modal';
import { useNotification } from '../../context/NotificationContext';

type ViewMode = 'kanban' | 'list' | 'analytics';

const SalesPipeline: React.FC = () => {
  const { deals, hasPermission, api, updateDealWinLossReason, taskTemplates } = useApp();
  const { addToast } = useNotification();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  
  const [filters, setFilters] = useState({ assignedToId: 'all', closeDateStart: '', closeDateEnd: '', showStale: false });
  
  const [winLossModalState, setWinLossModalState] = useState<{isOpen: boolean, deal: Deal | null, newStage: DealStage.Lost | null}>({isOpen: false, deal: null, newStage: null});
  
  // State for the inlined DealWonModal
  const [dealWonModalState, setDealWonModalState] = useState<{isOpen: boolean, deal: Deal | null}>({isOpen: false, deal: null});
  const [winReason, setWinReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [createProject, setCreateProject] = useState(true);
  const [useTaskTemplate, setUseTaskTemplate] = useState(false);
  const [selectedTaskTemplateId, setSelectedTaskTemplateId] = useState<number | undefined>(taskTemplates[0]?.id);
  const [isLoading, setIsLoading] = useState(false);

  const canManageDeals = hasPermission('anlasma:yonet');

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      if (filters.assignedToId !== 'all' && deal.assignedToId !== parseInt(filters.assignedToId)) {
        return false;
      }
      if (deal.closeDate) {
          const dealDate = new Date(deal.closeDate);
          if (filters.closeDateStart && dealDate < new Date(filters.closeDateStart)) {
            return false;
          }
          if (filters.closeDateEnd) {
             const endDate = new Date(filters.closeDateEnd);
             endDate.setHours(23, 59, 59, 999);
             if(dealDate > endDate) return false;
          }
      }
      if (filters.showStale) {
        const daysSinceLastActivity = (new Date().getTime() - new Date(deal.lastActivityDate).getTime()) / (1000 * 3600 * 24);
        if (daysSinceLastActivity <= 14) return false;
      }
      return true;
    });
  }, [deals, filters]);
  
  const openModalForNew = () => {
    if (!canManageDeals) return;
    setEditingDeal(null);
    setIsFormModalOpen(true);
  };

  const openModalForEdit = (deal: Deal) => {
    if (!canManageDeals) return;
    setEditingDeal(deal);
    setIsFormModalOpen(true);
  };

  const handleDeleteRequest = (deal: Deal) => {
    if (!canManageDeals) return;
    setDealToDelete(deal);
  };

  const handleDeleteConfirm = async () => {
    if (dealToDelete) {
      await api.deleteDeal(dealToDelete.id);
      addToast('Anlaşma başarıyla silindi.', 'success');
      setDealToDelete(null);
    }
  };

  const handleStageChangeRequest = (deal: Deal, newStage: DealStage) => {
    if (newStage === DealStage.Won) {
        setWinReason('');
        setOtherReason('');
        setCreateProject(true);
        setUseTaskTemplate(false);
        setSelectedTaskTemplateId(taskTemplates[0]?.id);
        setDealWonModalState({ isOpen: true, deal });
    } else if (newStage === DealStage.Lost) {
      setWinLossModalState({ isOpen: true, deal, newStage });
    } else {
      api.updateDealStage(deal.id, newStage);
    }
  };
  
  const handleLossSubmit = (reason: string) => {
    if(winLossModalState.deal && winLossModalState.newStage) {
      updateDealWinLossReason(winLossModalState.deal.id, winLossModalState.newStage, reason);
    }
    setWinLossModalState({ isOpen: false, deal: null, newStage: null });
  };
  
  const handleWinConfirm = async () => {
    const deal = dealWonModalState.deal;
    if (!deal) return;

    const finalReason = winReason === 'Diğer' ? otherReason : winReason;
    if (!finalReason.trim()) {
        addToast('Lütfen bir kazanma nedeni belirtin.', 'warning');
        return;
    }
    
    setIsLoading(true);
    await api.winDeal(deal, finalReason, createProject, useTaskTemplate, selectedTaskTemplateId);
    setIsLoading(false);
    
    setDealWonModalState({ isOpen: false, deal: null });
    addToast(`'${deal.title}' anlaşması başarıyla kazanıldı!`, 'success');
  };


  return (
    <div className="space-y-6">
      <SalesStats deals={filteredDeals} />
      <SalesFilterBar filters={filters} setFilters={setFilters} />
      
      <div className="bg-card dark:bg-dark-card rounded-lg shadow-sm border dark:border-dark-border">
        <div className="p-4 border-b dark:border-dark-border flex justify-between items-center">
            <h3 className="font-bold text-lg">Satış Fırsatları</h3>
            <div className="flex items-center gap-2">
                <div className="p-1 bg-slate-200 dark:bg-slate-700 rounded-md">
                    <button onClick={() => setViewMode('kanban')} className={`p-1 rounded ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-500 shadow' : ''}`} title="Kanban Görünümü">{ICONS.kanban}</button>
                    <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-500 shadow' : ''}`} title="Liste Görünümü">{ICONS.list}</button>
                </div>
                {canManageDeals && (
                    <Button onClick={openModalForNew}>
                        <span className="flex items-center gap-2">{ICONS.add} Yeni Anlaşma</span>
                    </Button>
                )}
            </div>
        </div>

        <div className="p-4">
          {viewMode === 'kanban' && <SalesKanbanView deals={filteredDeals} onEditDeal={openModalForEdit} onDeleteDeal={handleDeleteRequest} onStageChangeRequest={handleStageChangeRequest} canManage={canManageDeals} />}
          {viewMode === 'list' && <SalesListView deals={filteredDeals} onEdit={openModalForEdit} onDelete={handleDeleteRequest} onStageChangeRequest={handleStageChangeRequest} />}
        </div>
      </div>

      {isFormModalOpen && (
        <DealFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          deal={editingDeal}
        />
      )}

      {dealToDelete && (
        <ConfirmationModal
          isOpen={!!dealToDelete}
          onClose={() => setDealToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Anlaşmayı Sil"
          message={`'${dealToDelete.title}' adlı anlaşmayı kalıcı olarak silmek istediğinizden emin misiniz?`}
        />
      )}
      
      {winLossModalState.isOpen && (
        <WinLossReasonModal
          isOpen={winLossModalState.isOpen}
          onClose={() => setWinLossModalState({ isOpen: false, deal: null, newStage: null })}
          onSubmit={handleLossSubmit}
          stage={winLossModalState.newStage!}
        />
      )}

      {dealWonModalState.isOpen && dealWonModalState.deal && (
         <Modal 
            isOpen={dealWonModalState.isOpen} 
            onClose={() => setDealWonModalState({isOpen: false, deal: null})} 
            title={`🎉 Tebrikler! '${dealWonModalState.deal.title}' Kazanıldı!`}
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
                            <input type="checkbox" checked={useTaskTemplate} onChange={e => setUseTaskTemplate(e.target.checked)} className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500" disabled={!createProject} />
                            <span>Başlangıç görevleri oluştur (şablondan).</span>
                        </label>
                        {createProject && useTaskTemplate && (
                            <div className="pl-8">
                                <label className="block text-sm font-medium text-text-secondary">Kullanılacak Görev Şablonu</label>
                                <select 
                                    value={selectedTaskTemplateId} 
                                    onChange={(e) => setSelectedTaskTemplateId(Number(e.target.value))}
                                    className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                >
                                    {taskTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4 gap-2">
                     <Button type="button" variant="secondary" onClick={() => setDealWonModalState({isOpen: false, deal: null})} disabled={isLoading}>İptal</Button>
                     <Button onClick={handleWinConfirm} disabled={!winReason.trim() || isLoading}>
                        {isLoading ? <div className="spinner !w-4 !h-4"></div> : 'Onayla'}
                    </Button>
                </div>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default SalesPipeline;
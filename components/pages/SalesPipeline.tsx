import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Deal, DealStage } from '../../types';
import Button from '../ui/Button';
import { ICONS, WIN_REASONS, LOSS_REASONS } from '../../constants';
import SalesStats from '../sales/SalesStats';
import SalesFilterBar from '../sales/SalesFilterBar';
import DealFormModal from '../sales/DealFormModal';
import ConfirmationModal from '../ui/ConfirmationModal';
import SalesKanbanView from '../sales/SalesKanbanView';
import SalesListView from '../sales/SalesListView';
import WinLossReasonModal from '../sales/WinLossReasonModal';
import DealWonModal from '../sales/DealWonModal'; 
import { useNotification } from '../../context/NotificationContext';
import Modal from '../ui/Modal';

type ViewMode = 'kanban' | 'list';

const SalesPipeline: React.FC = () => {
  const { deals, hasPermission, updateDealWinLossReason, deleteDeal, updateDealStage, bulkUpdateDealStage, deleteMultipleDeals } = useApp();
  const { addToast } = useNotification();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  
  const [filters, setFilters] = useState({ assignedToId: 'all', closeDateStart: '', closeDateEnd: '', showStale: false });
  
  const [winLossModalState, setWinLossModalState] = useState<{isOpen: boolean, deal: Deal | null, newStage: DealStage.Lost | null}>({isOpen: false, deal: null, newStage: null});
  const [dealWonModalState, setDealWonModalState] = useState<{isOpen: boolean, deal: Deal | null}>({isOpen: false, deal: null});
  
  // State for bulk actions
  const [selectedDealIds, setSelectedDealIds] = useState<number[]>([]);
  // FIX: Update the state type for 'bulkActionType' to include 'delete' to match the possible values passed to its setter function.
  const [bulkActionType, setBulkActionType] = useState<'won' | 'lost' | 'delete' | null>(null);
  const [isBulkWinLossModalOpen, setIsBulkWinLossModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

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

  const handleDeleteConfirm = () => {
    if (dealToDelete) {
      deleteDeal(dealToDelete.id);
      addToast('Anlaşma başarıyla silindi.', 'success');
      setDealToDelete(null);
    }
  };

  const handleStageChangeRequest = (deal: Deal, newStage: DealStage) => {
    if (newStage === DealStage.Won) {
        setDealWonModalState({ isOpen: true, deal });
    } else if (newStage === DealStage.Lost) {
      setWinLossModalState({ isOpen: true, deal, newStage });
    } else {
      updateDealStage(deal.id, newStage);
    }
  };
  
  const handleLossSubmit = (reason: string) => {
    if(winLossModalState.deal && winLossModalState.newStage) {
      updateDealWinLossReason(winLossModalState.deal.id, winLossModalState.newStage, reason);
    }
    setWinLossModalState({ isOpen: false, deal: null, newStage: null });
  };
  
  const handleBulkAction = (action: 'won' | 'lost' | 'delete') => {
      setBulkActionType(action);
      if(action === 'delete') {
          setIsBulkDeleteModalOpen(true);
      } else {
          setIsBulkWinLossModalOpen(true);
      }
  };
  
  const handleBulkDeleteConfirm = () => {
      deleteMultipleDeals(selectedDealIds);
      addToast(`${selectedDealIds.length} anlaşma başarıyla silindi.`, 'success');
      setSelectedDealIds([]);
      setIsBulkDeleteModalOpen(false);
  };

  const handleBulkWinLossSubmit = (reason: string) => {
      const stage = bulkActionType === 'won' ? DealStage.Won : DealStage.Lost;
      bulkUpdateDealStage(selectedDealIds, stage, reason);
      addToast(`${selectedDealIds.length} anlaşma durumu '${stage}' olarak güncellendi.`, 'success');
      setSelectedDealIds([]);
      setIsBulkWinLossModalOpen(false);
      setBulkActionType(null);
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

        {viewMode === 'list' && selectedDealIds.length > 0 && (
          <div className="p-4 bg-primary-100 dark:bg-primary-900/50 flex items-center gap-4">
            <span className="font-semibold">{selectedDealIds.length} anlaşma seçildi.</span>
            <Button size="sm" onClick={() => handleBulkAction('won')}>Kazanıldı Olarak İşaretle</Button>
            <Button size="sm" variant="secondary" onClick={() => handleBulkAction('lost')}>Kaybedildi Olarak İşaretle</Button>
            <Button size="sm" variant="danger" onClick={() => handleBulkAction('delete')}>Sil</Button>
            <Button size="sm" variant="secondary" onClick={() => setSelectedDealIds([])}>Seçimi Temizle</Button>
          </div>
        )}

        <div className="p-4">
          {viewMode === 'kanban' && <SalesKanbanView deals={filteredDeals} onEditDeal={openModalForEdit} onDeleteDeal={handleDeleteRequest} onStageChangeRequest={handleStageChangeRequest} canManage={canManageDeals} />}
          {viewMode === 'list' && <SalesListView deals={filteredDeals} onEdit={openModalForEdit} onDelete={handleDeleteRequest} onStageChangeRequest={handleStageChangeRequest} selectedIds={selectedDealIds} onSelectionChange={setSelectedDealIds} canManage={canManageDeals} />}
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
         <DealWonModal 
            isOpen={dealWonModalState.isOpen} 
            onClose={() => setDealWonModalState({isOpen: false, deal: null})} 
            deal={dealWonModalState.deal}
        />
      )}

      {isBulkWinLossModalOpen && bulkActionType && (
          <WinLossReasonModal
            isOpen={isBulkWinLossModalOpen}
            onClose={() => setIsBulkWinLossModalOpen(false)}
            onSubmit={handleBulkWinLossSubmit}
            stage={bulkActionType === 'won' ? DealStage.Won : DealStage.Lost}
          />
      )}
      
      {isBulkDeleteModalOpen && (
          <ConfirmationModal
              isOpen={isBulkDeleteModalOpen}
              onClose={() => setIsBulkDeleteModalOpen(false)}
              onConfirm={handleBulkDeleteConfirm}
              title={`${selectedDealIds.length} Anlaşmayı Sil`}
              message={`${selectedDealIds.length} adet anlaşmayı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
          />
      )}
    </div>
  );
};

export default SalesPipeline;
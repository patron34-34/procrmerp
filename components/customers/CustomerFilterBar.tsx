import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SortConfig } from '../../types';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import FilterPopover from '../ui/FilterPopover';

interface CustomerFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: { status: string; industry: string; assignedToId: string; leadSource: string; };
  setFilters: React.Dispatch<React.SetStateAction<{ status: string; industry: string; assignedToId: string; leadSource: string; }>>;
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
  onLoadView: (viewId: string) => void;
}

const CustomerFilterBar: React.FC<CustomerFilterBarProps> = ({
  searchTerm, setSearchTerm, filters, setFilters, sortConfig, setSortConfig, onLoadView
}) => {
  const { customers, employees, savedViews, addSavedView, hasPermission, systemLists } = useApp();
  const [isSaveViewModalOpen, setIsSaveViewModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  
  const canManageCustomers = hasPermission('musteri:yonet');
  
  const industries = useMemo(() => [...new Set(customers.map(c => c.industry).filter(Boolean))], [customers]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({ status: 'all', industry: 'all', assignedToId: 'all', leadSource: 'all' });
    setSortConfig({ key: 'name', direction: 'ascending' });
  };
  
  const clearAdvancedFilters = () => {
      setFilters(prev => ({ ...prev, industry: 'all', leadSource: 'all' }));
  };
  
  const isAnyFilterActive = useMemo(() => {
    return searchTerm !== '' ||
           filters.status !== 'all' ||
           filters.industry !== 'all' ||
           filters.assignedToId !== 'all' ||
           filters.leadSource !== 'all';
  }, [searchTerm, filters]);

  const handleSaveView = () => {
    if (newViewName.trim()) {
      addSavedView(newViewName, filters, sortConfig);
      setIsSaveViewModalOpen(false);
      setNewViewName('');
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.358 3.358a1 1 0 01-1.414 1.414l-3.358-3.358A7 7 0 012 9z" clipRule="evenodd" /></svg>
          </div>
          <input 
            type="text"
            placeholder="Müşteri veya şirket ara..."
            className="w-full p-2 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
          <option value="all">Tüm Durumlar</option>
          {systemLists.customerStatus.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select value={filters.assignedToId} onChange={e => setFilters({...filters, assignedToId: e.target.value})} className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
          <option value="all">Tüm Sorumlular</option>
          {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>

        <FilterPopover isFilterActive={filters.industry !== 'all' || filters.leadSource !== 'all'} onClear={clearAdvancedFilters}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Sektör</label>
              <select value={filters.industry} onChange={e => setFilters(prev => ({...prev, industry: e.target.value}))} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                <option value="all">Tüm Sektörler</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Kaynak</label>
              <select value={filters.leadSource} onChange={e => setFilters(prev => ({...prev, leadSource: e.target.value}))} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                <option value="all">Tüm Kaynaklar</option>
                {systemLists.leadSource.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </FilterPopover>

        {isAnyFilterActive && <Button variant="secondary" onClick={handleClearFilters}>Filtreleri Temizle</Button>}

        <div className="flex-grow"></div> 

        <div className="flex items-center gap-2">
          <select 
            onChange={(e) => onLoadView(e.target.value)}
            className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border appearance-none"
            value=""
          >
            <option value="" disabled>Kayıtlı Görünüm Seç...</option>
            {savedViews.map(view => (
              <option key={view.id} value={view.id}>{view.name}</option>
            ))}
          </select>
          {canManageCustomers && <Button onClick={() => setIsSaveViewModalOpen(true)} variant="secondary" className="flex-shrink-0">Kaydet</Button>}
        </div>
      </div>
      
      {isSaveViewModalOpen && (
        <Modal isOpen={isSaveViewModalOpen} onClose={() => setIsSaveViewModalOpen(false)} title="Görünümü Kaydet">
          <div className="space-y-4">
            <input 
              type="text" 
              value={newViewName} 
              onChange={e => setNewViewName(e.target.value)} 
              placeholder="Görünüm adı..."
              className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsSaveViewModalOpen(false)}>İptal</Button>
              <Button onClick={handleSaveView}>Kaydet</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CustomerFilterBar;
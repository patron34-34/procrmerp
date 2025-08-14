
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SortConfig } from '../../types';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface CustomerFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: { status: string; industry: string; assignedToId: string; leadSource: string; };
  setFilters: (filters: { status: string; industry: string; assignedToId: string; leadSource: string; }) => void;
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
  onLoadView: (viewId: string) => void;
}

const CustomerFilterBar: React.FC<CustomerFilterBarProps> = ({
  searchTerm, setSearchTerm, filters, setFilters, sortConfig, setSortConfig, onLoadView
}) => {
  const { customers: allCustomers, employees, savedViews, addSavedView, hasPermission } = useApp();
  const [isSaveViewModalOpen, setIsSaveViewModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  
  const canManageCustomers = hasPermission('musteri:yonet');

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({ status: 'all', industry: 'all', assignedToId: 'all', leadSource: 'all' });
    setSortConfig({ key: 'name', direction: 'ascending' });
  };

  const handleSaveView = () => {
    if (newViewName.trim()) {
      addSavedView(newViewName, filters, sortConfig);
      setIsSaveViewModalOpen(false);
      setNewViewName('');
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <input 
            type="text"
            placeholder="Müşteri veya şirket ara..."
            className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border col-span-1 lg:col-span-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
            <option value="all">Tüm Durumlar</option>
            <option value="aktif">Aktif</option><option value="potensiyel">Potensiyel</option><option value="kaybedilmiş">Kaybedilmiş</option>
        </select>
        <select value={filters.assignedToId} onChange={e => setFilters({...filters, assignedToId: e.target.value})} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
            <option value="all">Tüm Sorumlular</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <div className="flex items-center gap-2 col-span-1 lg:col-span-2">
            <div className="relative w-full group">
                <select 
                    onChange={(e) => onLoadView(e.target.value)}
                    className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border appearance-none"
                    value=""
                >
                    <option value="" disabled>Kayıtlı Görünüm Seç...</option>
                    {savedViews.map(view => (
                        <option key={view.id} value={view.id}>{view.name}</option>
                    ))}
                </select>
            </div>
            {canManageCustomers && <Button onClick={() => setIsSaveViewModalOpen(true)} variant="secondary" className="flex-shrink-0">Görünümü Kaydet</Button>}
            <Button onClick={handleClearFilters} variant="secondary" className="flex-shrink-0">Temizle</Button>
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

import React, { useState, useMemo, useCallback, useRef, useEffect, ReactNode } from 'react';
import { useApp } from '../../context/AppContext';
import { SortConfig } from '../../types';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { ICONS } from '../../constants';

type Filters = {
    status: string[];
    industry: string[];
    assignedToId: number[];
    leadSource: string[];
};

interface CustomerFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
  onLoadView: (viewId: string) => void;
}

const FilterSection: React.FC<{title: string, children: ReactNode}> = ({title, children}) => (
    <div>
        <h4 className="font-semibold text-sm mb-2">{title}</h4>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-2">{children}</div>
    </div>
);

const CheckboxItem: React.FC<{id: string, label: string, checked: boolean, onChange: () => void}> = ({id, label, checked, onChange}) => (
    <label htmlFor={id} className="flex items-center gap-2 text-sm p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
        <input id={id} type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"/>
        {label}
    </label>
);


const CustomerFilterBar: React.FC<CustomerFilterBarProps> = ({
  searchTerm, setSearchTerm, filters, setFilters, sortConfig, setSortConfig, onLoadView
}) => {
  const { customers, employees, savedViews, addSavedView, hasPermission, systemLists } = useApp();
  const [isSaveViewModalOpen, setIsSaveViewModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Filters>(filters);
  const popoverRef = useRef<HTMLDivElement>(null);
  
  const canManageCustomers = hasPermission('musteri:yonet');
  
  const industries = useMemo(() => [...new Set(customers.map(c => c.industry).filter(Boolean))], [customers]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isPopoverOpen]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
            setIsPopoverOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({ status: [], industry: [], assignedToId: [], leadSource: [] });
    setSortConfig({ key: 'name', direction: 'ascending' });
  };
  
  const handleLocalFilterChange = (category: keyof Filters, value: string | number) => {
    setLocalFilters(prev => {
        const currentValues = prev[category] as (string | number)[];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        return { ...prev, [category]: newValues };
    });
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    setIsPopoverOpen(false);
  };

  const handleClearLocalFilters = () => {
    setLocalFilters({ status: [], industry: [], assignedToId: [], leadSource: [] });
  };

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).reduce((acc, val) => acc + val.length, 0);
  }, [filters]);

  const filterButtonText = activeFiltersCount > 0 ? `Filtrele (${activeFiltersCount})` : "Filtrele";

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
            {ICONS.search}
          </div>
          <input 
            type="text"
            placeholder="Müşteri veya şirket ara..."
            className="w-full p-2 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative" ref={popoverRef}>
            <button
                onClick={() => setIsPopoverOpen(prev => !prev)}
                className="relative flex items-center gap-2 p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-slate-600"
            >
                {ICONS.filter}
                {filterButtonText}
                {activeFiltersCount > 0 && <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-primary-500 ring-2 ring-white dark:ring-slate-700"></span>}
            </button>
            {isPopoverOpen && (
                <div 
                    onClick={e => e.stopPropagation()}
                    className="absolute top-full mt-2 left-0 bg-card dark:bg-dark-card border dark:border-dark-border rounded-lg shadow-lg z-20 w-96"
                >
                    <div className="p-4 grid grid-cols-2 gap-4">
                        <FilterSection title="Durum">
                            {systemLists.customerStatus.map(s => <CheckboxItem key={s.id} id={`status-${s.id}`} label={s.label} checked={localFilters.status.includes(s.id)} onChange={() => handleLocalFilterChange('status', s.id)} />)}
                        </FilterSection>
                        <FilterSection title="Sorumlu">
                            {employees.map(e => <CheckboxItem key={e.id} id={`assignee-${e.id}`} label={e.name} checked={localFilters.assignedToId.includes(e.id)} onChange={() => handleLocalFilterChange('assignedToId', e.id)} />)}
                        </FilterSection>
                        <FilterSection title="Sektör">
                            {industries.map(i => <CheckboxItem key={i} id={`industry-${i}`} label={i} checked={localFilters.industry.includes(i)} onChange={() => handleLocalFilterChange('industry', i)} />)}
                        </FilterSection>
                         <FilterSection title="Kaynak">
                            {systemLists.leadSource.map(s => <CheckboxItem key={s.id} id={`source-${s.id}`} label={s.label} checked={localFilters.leadSource.includes(s.id)} onChange={() => handleLocalFilterChange('leadSource', s.id)} />)}
                        </FilterSection>
                    </div>
                    <div className="flex justify-between items-center p-2 border-t dark:border-dark-border bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
                        <button onClick={handleClearLocalFilters} className="text-sm font-semibold text-text-secondary hover:text-text-main">Temizle</button>
                        <Button onClick={handleApplyFilters}>Uygula</Button>
                    </div>
                </div>
            )}
        </div>
        
        {activeFiltersCount > 0 && <Button variant="secondary" onClick={handleClearFilters}>Tüm Filtreleri Temizle</Button>}

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
          {canManageCustomers && <Button onClick={() => setIsSaveViewModalOpen(true)} variant="secondary" className="flex-shrink-0">Görünümü Kaydet</Button>}
        </div>
      </div>
      
      {isSaveViewModalOpen && (
        <Modal isOpen={isSaveViewModalOpen} onClose={() => setIsSaveViewModalOpen(false)} title="Görünümü Kaydet">
          <div className="space-y-4">
            <p className="text-sm">Mevcut arama, filtre ve sıralama ayarlarınız kaydedilecek.</p>
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
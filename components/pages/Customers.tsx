


import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, SortConfig } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import CustomerListView from '../customers/CustomerListView';
import CustomerKanbanView from '../customers/CustomerKanbanView';
import CustomerForm from '../customers/CustomerForm';
import CustomerStats from '../customers/CustomerStats';
import CustomerImportModal from '../customers/CustomerImportModal';
import Modal from '../ui/Modal';
import ConfirmationModal from '../ui/ConfirmationModal';
import CustomerFilterBar from '../customers/CustomerFilterBar';
import CustomerMapView from '../customers/CustomerMapView';


type ViewMode = 'list' | 'kanban' | 'map';

const Customers: React.FC = () => {
    const { customers, employees, hasPermission, assignCustomersToEmployee, addTagsToCustomers, deleteMultipleCustomers, updateCustomerStatus, updateCustomer, savedViews } = useApp();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ status: 'all', industry: 'all', assignedToId: 'all', leadSource: 'all' });
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'ascending' });
    
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [assigneeId, setAssigneeId] = useState<number>(employees[0]?.id || 0);
    const [tagsToAdd, setTagsToAdd] = useState<string[]>([]);
    
    const canManageCustomers = hasPermission('musteri:yonet');

    const handleOpenNewForm = () => {
        setEditingCustomer(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditForm = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsFormModalOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormModalOpen(false);
        setEditingCustomer(null);
    };
    
    const handleAssignConfirm = () => {
        assignCustomersToEmployee(selectedCustomerIds, assigneeId);
        setIsAssignModalOpen(false);
        setSelectedCustomerIds([]);
    };
    
    const handleTagConfirm = () => {
        addTagsToCustomers(selectedCustomerIds, tagsToAdd);
        setIsTagModalOpen(false);
        setTagsToAdd([]);
        setSelectedCustomerIds([]);
    };

    const handleDeleteConfirm = () => {
        deleteMultipleCustomers(selectedCustomerIds);
        setIsDeleteModalOpen(false);
        setSelectedCustomerIds([]);
    };

    const handleLoadView = (viewId: string) => {
        const view = savedViews.find(v => v.id === parseInt(viewId));
        if (view) {
            setFilters(view.filters);
            setSortConfig(view.sortConfig);
        }
    };
    
    const enrichedCustomers = useMemo(() => {
        return customers.map(customer => {
            const assignee = employees.find(e => e.id === customer.assignedToId);
            return { ...customer, assignedToName: assignee?.name || 'Atanmamış' };
        });
    }, [customers, employees]);
    
    const filteredAndSortedCustomers = useMemo(() => {
        let filtered = enrichedCustomers.filter(c => 
          (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (filters.status === 'all' || c.status === filters.status) &&
          (filters.industry === 'all' || c.industry === filters.industry) &&
          (filters.assignedToId === 'all' || c.assignedToId === parseInt(filters.assignedToId)) &&
          (filters.leadSource === 'all' || c.leadSource === filters.leadSource)
        );

        if (sortConfig !== null) {
          filtered.sort((a, b) => {
            const key = sortConfig.key;
            const valA = a[key as keyof typeof a];
            const valB = b[key as keyof typeof b];

            if (valA === undefined || valA === null) return 1;
            if (valB === undefined || valB === null) return -1;
            
            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
          });
        }
        return filtered;
    }, [enrichedCustomers, searchTerm, filters, sortConfig]);


    const renderBulkActionToolbar = () => {
        if (selectedCustomerIds.length === 0 || !canManageCustomers) return null;
        return (
            <div className="flex items-center gap-4 p-4 bg-primary-100 dark:bg-primary-900/50 rounded-lg mb-4">
                <p className="font-semibold">{selectedCustomerIds.length} müşteri seçildi.</p>
                <Button variant="secondary" onClick={() => setIsAssignModalOpen(true)}>Sorumlu Değiştir</Button>
                <Button variant="secondary" onClick={() => setIsTagModalOpen(true)}>Etiket Ekle</Button>
                <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>Sil</Button>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <CustomerStats customers={filteredAndSortedCustomers} />
            <Card>
                <div className="p-4 border-b dark:border-dark-border">
                    <CustomerFilterBar 
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filters={filters}
                        setFilters={setFilters}
                        sortConfig={sortConfig}
                        setSortConfig={setSortConfig}
                        onLoadView={handleLoadView}
                    />
                </div>
                <div className="p-4 border-b dark:border-dark-border flex justify-between items-center">
                    <h3 className="font-bold text-lg">Tüm Müşteriler</h3>
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-slate-200 dark:bg-slate-700 rounded-md">
                            <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-500 shadow' : ''}`}>{ICONS.list}</button>
                            <button onClick={() => setViewMode('kanban')} className={`p-1 rounded ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-500 shadow' : ''}`}>{ICONS.kanban}</button>
                            <button onClick={() => setViewMode('map')} className={`p-1 rounded ${viewMode === 'map' ? 'bg-white dark:bg-slate-500 shadow' : ''}`}>{ICONS.map}</button>
                        </div>
                        {canManageCustomers && (
                            <>
                                <Button onClick={() => setIsImportModalOpen(true)} variant="secondary">
                                    <span className="flex items-center gap-2">{ICONS.import} İçeri Aktar</span>
                                </Button>
                                <Button onClick={handleOpenNewForm}>
                                    <span className="flex items-center gap-2">{ICONS.add} Yeni Ekle</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="p-4">
                    {renderBulkActionToolbar()}
                    {viewMode === 'list' && (
                        <CustomerListView 
                            customers={filteredAndSortedCustomers}
                            onEdit={handleOpenEditForm} 
                            onUpdate={updateCustomer}
                            onSelectionChange={setSelectedCustomerIds}
                        />
                    )}
                    {viewMode === 'kanban' && (
                        <CustomerKanbanView 
                            customers={filteredAndSortedCustomers} 
                            onUpdateStatus={updateCustomerStatus}
                        />
                    )}
                    {viewMode === 'map' && (
                        <CustomerMapView
                            customers={filteredAndSortedCustomers}
                        />
                    )}
                </div>
            </Card>
            
            {isFormModalOpen && canManageCustomers && (
                <CustomerForm 
                    isOpen={isFormModalOpen}
                    onClose={handleCloseForm}
                    customer={editingCustomer}
                />
            )}
            
            {isImportModalOpen && canManageCustomers && (
                <CustomerImportModal 
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                />
            )}
            
            {canManageCustomers && <>
                <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Sorumlu Ata">
                    <div className="space-y-4">
                        <p>{selectedCustomerIds.length} müşteriyi yeni bir sorumluya atayın:</p>
                        <select value={assigneeId} onChange={e => setAssigneeId(Number(e.target.value))} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => setIsAssignModalOpen(false)}>İptal</Button>
                            <Button onClick={handleAssignConfirm}>Ata</Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={isTagModalOpen} onClose={() => setIsTagModalOpen(false)} title="Etiket Ekle">
                    <p className="mb-4">{selectedCustomerIds.length} müşteriye yeni etiketler ekleyin:</p>
                    <input type="text" placeholder="vip, yeni-fırsat" onChange={e => setTagsToAdd(e.target.value.split(',').map(t => t.trim()))} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border mb-4"/>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setIsTagModalOpen(false)}>İptal</Button>
                        <Button onClick={handleTagConfirm}>Ekle</Button>
                    </div>
                </Modal>
                <ConfirmationModal 
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Müşterileri Sil"
                    message={`${selectedCustomerIds.length} müşteriyi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
                />
            </>}
        </div>
    );
};

export default Customers;
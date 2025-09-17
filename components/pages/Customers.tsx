import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, SortConfig } from '../../types';
import CustomerFilterBar from '../customers/CustomerFilterBar';
import CustomerStats from '../customers/CustomerStats';
import CustomerListView from '../customers/CustomerListView';
import CustomerKanbanView from '../customers/CustomerKanbanView';
import CustomerMapView from '../customers/CustomerMapView';
import ConfirmationModal from '../ui/ConfirmationModal';
import CustomerImportModal from '../customers/CustomerImportModal';
import { useNotification } from '../../context/NotificationContext';
import { ICONS } from '../../constants';
import Button from '../ui/Button';
import { exportToCSV } from '../../utils/csvExporter';
import Modal from '../ui/Modal';
import Card from '../ui/Card';

type ViewMode = 'list' | 'kanban' | 'map';

type Filters = {
    status: string[];
    industry: string[];
    assignedToId: number[];
    leadSource: string[];
};

const Customers: React.FC = () => {
    const { 
        customers, employees, updateCustomerStatus, deleteCustomer, deleteMultipleCustomers, 
        assignCustomersToEmployee, addTagsToCustomers, bulkUpdateCustomerStatus,
        savedViews, hasPermission, systemLists, setIsCustomerFormOpen
    } = useApp();
    const { addToast } = useNotification();

    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<Filters>({ status: [], industry: [], assignedToId: [], leadSource: [] });
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);

    const [batchAction, setBatchAction] = useState<'status' | 'assign' | 'tags' | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [statusToSet, setStatusToSet] = useState('');
    const [assigneeToSet, setAssigneeToSet] = useState(0);
    const [tagsToAdd, setTagsToAdd] = useState('');
    
    const canManageCustomers = hasPermission('musteri:yonet');

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            const searchMatch = searchTerm === '' ||
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase());
            
            const statusMatch = filters.status.length === 0 || filters.status.includes(customer.status);
            const industryMatch = filters.industry.length === 0 || filters.industry.includes(customer.industry);
            const assignedToMatch = filters.assignedToId.length === 0 || filters.assignedToId.includes(customer.assignedToId);
            const leadSourceMatch = filters.leadSource.length === 0 || filters.leadSource.includes(customer.leadSource);

            return searchMatch && statusMatch && industryMatch && assignedToMatch && leadSourceMatch;
        });
    }, [customers, searchTerm, filters]);

    const sortedCustomers = useMemo(() => {
        let sortableItems = [...filteredCustomers];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key as keyof typeof a;
                if (a[key] < b[key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredCustomers, sortConfig]);

    const paginatedCustomers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedCustomers.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedCustomers, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);

    const handleOpenNewForm = () => {
        if (!canManageCustomers) return;
        setIsCustomerFormOpen(true, null);
    };

    const handleOpenEditForm = (customer: Customer) => {
        if (!canManageCustomers) return;
        setIsCustomerFormOpen(true, customer);
    };
    
    const handleDeleteRequest = (customer: Customer) => {
        if (!canManageCustomers) return;
        setCustomerToDelete(customer);
    };

    const handleDeleteConfirm = () => {
        if (customerToDelete) {
            deleteCustomer(customerToDelete.id);
            addToast("Müşteri başarıyla silindi.", "success");
            setCustomerToDelete(null);
        }
    };
    
    const handleBatchStatusUpdate = () => {
        bulkUpdateCustomerStatus(selectedCustomerIds, statusToSet);
        addToast(`${selectedCustomerIds.length} müşteri durumu güncellendi.`, 'success');
        setBatchAction(null);
        setSelectedCustomerIds([]);
    };
    
    const handleBatchAssign = () => {
        assignCustomersToEmployee(selectedCustomerIds, assigneeToSet);
        addToast(`${selectedCustomerIds.length} müşteri atandı.`, 'success');
        setBatchAction(null);
        setSelectedCustomerIds([]);
    };

    const handleBatchAddTags = () => {
        const tags = tagsToAdd.split(',').map(t => t.trim()).filter(Boolean);
        if (tags.length > 0) {
            addTagsToCustomers(selectedCustomerIds, tags);
            addToast(`${selectedCustomerIds.length} müşteriye etiket eklendi.`, 'success');
        }
        setBatchAction(null);
        setSelectedCustomerIds([]);
    };

    const handleBatchDelete = () => {
        deleteMultipleCustomers(selectedCustomerIds);
        addToast(`${selectedCustomerIds.length} müşteri silindi.`, 'success');
        setIsDeleteConfirmOpen(false);
        setSelectedCustomerIds([]);
    };

    const handleLoadView = (viewIdStr: string) => {
        const viewId = parseInt(viewIdStr, 10);
        const view = savedViews.find(v => v.id === viewId);
        if (view) {
            setFilters(view.filters);
            setSortConfig(view.sortConfig);
            addToast(`'${view.name}' görünümü yüklendi.`, "info");
        }
    };
    
    const handleExport = useCallback(() => {
        const itemsToExport = selectedCustomerIds.length > 0 
            ? sortedCustomers.filter(c => selectedCustomerIds.includes(c.id))
            : sortedCustomers;

        if (itemsToExport.length === 0) {
            addToast("Dışa aktarılacak müşteri bulunmuyor.", "info");
            return;
        }
    
        const dataToExport = itemsToExport.map(customer => ({
            'ID': customer.id, 'Müşteri Adı': customer.name, 'Şirket': customer.company, 'E-posta': customer.email,
            'Telefon': customer.phone, 'Durum': customer.status, 'Sektör': customer.industry, 'Sorumlu': customer.assignedToName,
            'Kaynak': customer.leadSource, 'Son İletişim': customer.lastContact, 'Şehir': customer.billingAddress.city,
            'Ülke': customer.billingAddress.country,
        }));
    
        exportToCSV(dataToExport, 'musteriler.csv');
        addToast(`${itemsToExport.length} müşteri dışa aktarıldı.`, "success");
    }, [sortedCustomers, selectedCustomerIds, addToast]);

    const handleUpdateAssignee = (customerId: number, employeeId: number) => {
        assignCustomersToEmployee([customerId], employeeId);
    };
    
    const handleSort = useCallback((config: SortConfig) => {
      setSortConfig(config);
    }, []);

    return (
        <div className="space-y-6">
            <CustomerStats customers={filteredCustomers} />
            
             <Card>
                <div className="p-4 border-b border-border flex justify-between items-center flex-wrap gap-4">
                     <div className="flex items-center gap-4 flex-wrap">
                        <CustomerFilterBar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            filters={filters}
                            setFilters={setFilters}
                            sortConfig={sortConfig}
                            setSortConfig={handleSort}
                            onLoadView={handleLoadView}
                        />
                         <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center">
                            <button onClick={() => setViewMode('list')} className={`px-3 py-1 text-sm font-semibold rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}>{ICONS.list} Liste</button>
                            <button onClick={() => setViewMode('kanban')} className={`px-3 py-1 text-sm font-semibold rounded-md ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}>{ICONS.kanban} Kanban</button>
                            <button onClick={() => setViewMode('map')} className={`px-3 py-1 text-sm font-semibold rounded-md ${viewMode === 'map' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}>{ICONS.map} Harita</button>
                        </div>
                    </div>
                     {canManageCustomers && (
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" onClick={() => setIsImportModalOpen(true)}>
                                <span className="flex items-center gap-2">{ICONS.import} İçeri Aktar</span>
                            </Button>
                            <Button variant="secondary" onClick={handleExport}>
                                <span className="flex items-center gap-2">{ICONS.export} Dışa Aktar</span>
                            </Button>
                            <Button onClick={handleOpenNewForm}>
                                <span className="flex items-center gap-2">{ICONS.add} Yeni Müşteri</span>
                            </Button>
                        </div>
                    )}
                </div>
                
                 {canManageCustomers && selectedCustomerIds.length > 0 && (
                    <div className="p-4 bg-primary-50 dark:bg-primary-900/30 flex items-center gap-4 flex-wrap border-b border-border">
                        <span className="font-semibold">{selectedCustomerIds.length} müşteri seçildi.</span>
                        <Button size="sm" onClick={() => setBatchAction('status')}>Durum Değiştir</Button>
                        <Button size="sm" onClick={() => setBatchAction('assign')}>Sorumlu Ata</Button>
                        <Button size="sm" onClick={() => setBatchAction('tags')}>Etiket Ekle</Button>
                        <Button size="sm" variant="danger" onClick={() => setIsDeleteConfirmOpen(true)}>Sil</Button>
                        <Button size="sm" variant="secondary" onClick={() => setSelectedCustomerIds([])}>Seçimi Temizle</Button>
                    </div>
                )}
                 
                 <div className="p-4">
                    {viewMode === 'list' && (
                        <CustomerListView
                            customers={paginatedCustomers}
                            onEdit={handleOpenEditForm}
                            onDeleteRequest={handleDeleteRequest}
                            onUpdateStatus={updateCustomerStatus}
                            onUpdateAssignee={handleUpdateAssignee}
                            onSelectionChange={setSelectedCustomerIds}
                            selectedIds={selectedCustomerIds}
                            sortConfig={sortConfig}
                            onSort={handleSort}
                            canManageCustomers={canManageCustomers}
                            totalCustomers={sortedCustomers.length}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    )}
                    {viewMode === 'kanban' && <CustomerKanbanView customers={filteredCustomers} onUpdateStatus={updateCustomerStatus as any} />}
                    {viewMode === 'map' && <CustomerMapView customers={filteredCustomers} />}
                 </div>
            </Card>
            
            {isImportModalOpen && ( <CustomerImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} /> )}
            {customerToDelete && ( <ConfirmationModal isOpen={!!customerToDelete} onClose={() => setCustomerToDelete(null)} onConfirm={handleDeleteConfirm} title="Müşteriyi Sil" message={`'${customerToDelete.name}' adlı müşteriyi kalıcı olarak silmek istediğinizden emin misiniz?`} /> )}
            {batchAction === 'status' && (<Modal isOpen={true} onClose={() => setBatchAction(null)} title="Toplu Durum Güncelleme"><div className="space-y-4"><select onChange={e => setStatusToSet(e.target.value)} defaultValue="" className="w-full"><option value="" disabled>Durum Seç...</option>{systemLists.customerStatus.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select><Button onClick={handleBatchStatusUpdate}>Güncelle</Button></div></Modal>)}
            {batchAction === 'assign' && (<Modal isOpen={true} onClose={() => setBatchAction(null)} title="Toplu Sorumlu Atama"><div className="space-y-4"><select onChange={e => setAssigneeToSet(Number(e.target.value))} defaultValue={0} className="w-full"><option value={0} disabled>Sorumlu Seç...</option>{employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select><Button onClick={handleBatchAssign}>Ata</Button></div></Modal>)}
            {batchAction === 'tags' && (<Modal isOpen={true} onClose={() => setBatchAction(null)} title="Toplu Etiket Ekle"><div className="space-y-4"><input type="text" onChange={e => setTagsToAdd(e.target.value)} placeholder="Etiketleri virgülle ayırın" className="w-full" /><Button onClick={handleBatchAddTags}>Ekle</Button></div></Modal>)}
            {isDeleteConfirmOpen && (<ConfirmationModal isOpen={true} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={handleBatchDelete} title="Müşterileri Sil" message={`${selectedCustomerIds.length} müşteriyi kalıcı olarak silmek istediğinizden emin misiniz?`} />)}
        </div>
    );
};

export default Customers;
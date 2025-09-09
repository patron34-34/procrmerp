

import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, SortConfig } from '../../types';
import CustomerFilterBar from '../customers/CustomerFilterBar';
import CustomerStats from '../customers/CustomerStats';
import CustomerListView from '../customers/CustomerListView';
import CustomerKanbanView from '../customers/CustomerKanbanView';
import CustomerMapView from '../customers/CustomerMapView';
import CustomerForm from '../customers/CustomerForm';
import ConfirmationModal from '../ui/ConfirmationModal';
import CustomerImportModal from '../customers/CustomerImportModal';
import { useNotification } from '../../context/NotificationContext';
import { ICONS } from '../../constants';
import Button from '../ui/Button';
import { exportToCSV } from '../../utils/csvExporter';

type ViewMode = 'list' | 'kanban' | 'map';

type Filters = {
    status: string[];
    industry: string[];
    assignedToId: number[];
    leadSource: string[];
};

const Customers: React.FC = () => {
    const { customers, employees, updateCustomerStatus, deleteCustomer, deleteMultipleCustomers, assignCustomersToEmployee, addTagsToCustomers, savedViews, hasPermission } = useApp();
    const { addToast } = useNotification();

    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<Filters>({ status: [], industry: [], assignedToId: [], leadSource: [] });
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
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
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
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
        setEditingCustomer(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditForm = (customer: Customer) => {
        if (!canManageCustomers) return;
        setEditingCustomer(customer);
        setIsFormModalOpen(true);
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
        if (sortedCustomers.length === 0) {
            addToast("Dışa aktarılacak müşteri bulunmuyor.", "info");
            return;
        }
    
        const dataToExport = sortedCustomers.map(customer => {
            const assignedToEmployee = employees.find(e => e.id === customer.assignedToId);
            return {
                'ID': customer.id,
                'Müşteri Adı': customer.name,
                'Şirket': customer.company,
                'E-posta': customer.email,
                'Telefon': customer.phone,
                'Durum': customer.status,
                'Sektör': customer.industry,
                'Sorumlu': assignedToEmployee ? assignedToEmployee.name : 'Bilinmiyor',
                'Kaynak': customer.leadSource,
                'Son İletişim': customer.lastContact,
                'Şehir': customer.billingAddress.city,
                'Ülke': customer.billingAddress.country,
            };
        });
    
        exportToCSV(dataToExport, 'musteriler.csv');
        addToast("Müşteri listesi dışa aktarıldı.", "success");
    }, [sortedCustomers, employees, addToast]);

    return (
        <div className="space-y-6">
            <CustomerStats customers={filteredCustomers} />
            
             <div className="bg-card dark:bg-dark-card rounded-lg shadow-sm border dark:border-dark-border">
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
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-slate-200 dark:bg-slate-700 rounded-md">
                            <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-500 shadow' : ''}`}>{ICONS.list}</button>
                            <button onClick={() => setViewMode('kanban')} className={`p-1 rounded ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-500 shadow' : ''}`}>{ICONS.kanban}</button>
                            <button onClick={() => setViewMode('map')} className={`p-1 rounded ${viewMode === 'map' ? 'bg-white dark:bg-slate-500 shadow' : ''}`}>{ICONS.map}</button>
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
                 <div className="p-4">
                    {viewMode === 'list' && (
                        <CustomerListView
                            customers={paginatedCustomers}
                            onEdit={handleOpenEditForm}
                            onDeleteRequest={handleDeleteRequest}
                            onUpdate={updateCustomerStatus as any} // The hook returns a slightly different signature
                            onSelectionChange={() => {}} // Batch actions would be implemented here
                            sortConfig={sortConfig}
                            onSort={setSortConfig as any}
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
            </div>
            
            {isFormModalOpen && (
                <CustomerForm 
                    isOpen={isFormModalOpen}
                    onClose={() => setIsFormModalOpen(false)}
                    customer={editingCustomer}
                    onSubmitSuccess={() => setIsFormModalOpen(false)}
                />
            )}
            {isImportModalOpen && (
                <CustomerImportModal 
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                />
            )}
            {customerToDelete && (
                <ConfirmationModal
                    isOpen={!!customerToDelete}
                    onClose={() => setCustomerToDelete(null)}
                    onConfirm={handleDeleteConfirm}
                    title="Müşteriyi Sil"
                    message={`'${customerToDelete.name}' adlı müşteriyi kalıcı olarak silmek istediğinizden emin misiniz?`}
                />
            )}
        </div>
    );
};

export default Customers;
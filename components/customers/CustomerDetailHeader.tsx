import React, { useState } from 'react';
import { Customer } from '../../types';
import Button from '../ui/Button';
import { useApp } from '../../context/AppContext';
import CustomerForm from './CustomerForm';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import { ICONS } from '../../constants';
import DealFormModal from '../sales/DealFormModal';
import ProjectFormModal from '../projects/ProjectFormModal';
import InvoiceFormModal from '../invoicing/InvoiceFormModal';
import TicketFormModal from '../support/TicketFormModal';
import SalesOrderFormModal from '../inventory/SalesOrderFormModal';

interface CustomerDetailHeaderProps {
    customer: Customer & { healthScore: number };
    onAddNewTask: () => void;
}

const CustomerDetailHeader: React.FC<CustomerDetailHeaderProps> = ({ customer, onAddNewTask }) => {
    const { hasPermission, systemLists } = useApp();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDealFormOpen, setIsDealFormOpen] = useState(false);
    const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
    const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
    const [isTicketFormOpen, setIsTicketFormOpen] = useState(false);
    const [isSalesOrderFormOpen, setIsSalesOrderFormOpen] = useState(false);

    const canManageCustomers = hasPermission('musteri:yonet');
    const statusInfo = systemLists.customerStatus.find(s => s.id === customer.status);
    const prefilledData = { customerId: customer.id };


    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex items-center gap-4">
                    <img src={customer.avatar} alt={customer.name} className="w-20 h-20 rounded-full" />
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-3xl font-bold">{customer.name}</h2>
                            {statusInfo && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}>
                                    {statusInfo.label}
                                </span>
                            )}
                        </div>
                        <p className="text-lg text-text-secondary">{customer.company}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                            {customer.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
                {canManageCustomers && (
                    <div className="flex gap-2 flex-shrink-0 w-full md:w-auto">
                        <Dropdown
                            trigger={
                                <Button className="flex-1 justify-center">
                                    Yeni Ekle
                                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </Button>
                            }
                            menuPosition="right-0"
                        >
                            <DropdownItem onClick={onAddNewTask}><span className="w-5">{ICONS.tasks}</span> Görev</DropdownItem>
                            <DropdownItem onClick={() => setIsDealFormOpen(true)}><span className="w-5">{ICONS.sales}</span> Anlaşma</DropdownItem>
                            <DropdownItem onClick={() => setIsSalesOrderFormOpen(true)}><span className="w-5">{ICONS.salesOrder}</span> Satış Siparişi</DropdownItem>
                            <DropdownItem onClick={() => setIsProjectFormOpen(true)}><span className="w-5">{ICONS.projects}</span> Proje</DropdownItem>
                            <DropdownItem onClick={() => setIsInvoiceFormOpen(true)}><span className="w-5">{ICONS.invoices}</span> Fatura</DropdownItem>
                            <DropdownItem onClick={() => setIsTicketFormOpen(true)}><span className="w-5">{ICONS.support}</span> Destek Talebi</DropdownItem>
                        </Dropdown>
                         <Dropdown
                            trigger={
                                <Button variant="secondary" className="!px-2">
                                    {ICONS.ellipsisVertical}
                                </Button>
                            }
                            menuPosition="right-0"
                        >
                             <DropdownItem onClick={() => setIsFormModalOpen(true)}><span className="w-5">{ICONS.edit}</span> Müşteriyi Düzenle</DropdownItem>
                             {/* Add more actions like delete, etc. here */}
                        </Dropdown>
                    </div>
                )}
            </div>
            
            {isFormModalOpen && canManageCustomers && <CustomerForm isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} customer={customer} />}
            {isDealFormOpen && <DealFormModal isOpen={isDealFormOpen} onClose={() => setIsDealFormOpen(false)} deal={null} prefilledData={prefilledData} />}
            {isProjectFormOpen && <ProjectFormModal isOpen={isProjectFormOpen} onClose={() => setIsProjectFormOpen(false)} project={null} prefilledData={prefilledData} />}
            {isInvoiceFormOpen && <InvoiceFormModal isOpen={isInvoiceFormOpen} onClose={() => setIsInvoiceFormOpen(false)} invoice={null} prefilledData={prefilledData} />}
            {isTicketFormOpen && <TicketFormModal isOpen={isTicketFormOpen} onClose={() => setIsTicketFormOpen(false)} ticket={null} prefilledData={prefilledData} />}
            {isSalesOrderFormOpen && <SalesOrderFormModal isOpen={isSalesOrderFormOpen} onClose={() => setIsSalesOrderFormOpen(false)} order={null} prefilledData={prefilledData} />}
        </>
    );
};

export default CustomerDetailHeader;
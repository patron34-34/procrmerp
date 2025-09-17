import React, { useState, useMemo } from 'react';
import { Customer, InvoiceStatus, DealStage } from '../../types';
import Button from '../ui/Button';
import { useApp } from '../../context/AppContext';
import CustomerForm from './CustomerForm';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import { ICONS } from '../../constants';
import HealthScoreIndicator from './HealthScoreIndicator';
import CommunicationLogForm from './CommunicationLogForm';

interface CustomerDetailHeaderV2Props {
    customer: Customer & { healthScore: number; healthScoreBreakdown?: string[] };
    onEdit: () => void;
    onDelete: () => void;
    onLogActivity: () => void;
    onAddNewTask: () => void;
    onAddNewDeal: () => void;
    onAddNewProject: () => void;
    onAddNewInvoice: () => void;
    onAddNewTicket: () => void;
}

const Stat: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div className="text-center md:text-left">
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="text-2xl font-bold text-text-main">{value}</p>
    </div>
);


const CustomerDetailHeaderV2: React.FC<CustomerDetailHeaderV2Props> = ({ 
    customer, onEdit, onDelete, onLogActivity, onAddNewTask, onAddNewDeal, onAddNewProject, onAddNewInvoice, onAddNewTicket 
}) => {
    const { deals, invoices, hasPermission } = useApp();
    
    const canManageCustomers = hasPermission('musteri:yonet');
    
    const stats = useMemo(() => {
        const lifetimeValue = invoices
            .filter(i => i.customerId === customer.id && i.status === InvoiceStatus.Paid)
            .reduce((sum, i) => sum + i.grandTotal, 0);

        const openDealsValue = deals
            .filter(d => d.customerId === customer.id && d.stage !== DealStage.Won && d.stage !== DealStage.Lost)
            .reduce((sum, d) => sum + d.value, 0);

        return { lifetimeValue, openDealsValue };
    }, [customer.id, invoices, deals]);

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                {/* Left Side: Info */}
                <div className="flex items-center gap-4">
                    <img src={customer.avatar} alt={customer.name} className="w-20 h-20 rounded-full" />
                    <div>
                        <h2 className="text-3xl font-bold">{customer.name}</h2>
                        <p className="text-lg text-text-secondary">{customer.company}</p>
                    </div>
                </div>
                {/* Right Side: Actions */}
                {canManageCustomers && (
                    <div className="flex gap-2 flex-shrink-0">
                         <Dropdown
                            trigger={
                                <Button>
                                    Eylemler
                                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </Button>
                            }
                            menuPosition="right-0"
                        >
                            <DropdownItem onClick={onEdit}><span className="w-5">{ICONS.edit}</span> Düzenle</DropdownItem>
                            <DropdownItem onClick={onLogActivity}><span className="w-5">{ICONS.add}</span> Aktivite Ekle</DropdownItem>
                            <DropdownItem onClick={onAddNewTask}><span className="w-5">{ICONS.tasks}</span> Yeni Görev Ekle</DropdownItem>
                            <DropdownItem onClick={onAddNewDeal}><span className="w-5">{ICONS.sales}</span> Yeni Anlaşma</DropdownItem>
                            <DropdownItem onClick={onAddNewProject}><span className="w-5">{ICONS.projects}</span> Yeni Proje</DropdownItem>
                            <DropdownItem onClick={onAddNewInvoice}><span className="w-5">{ICONS.invoices}</span> Yeni Fatura</DropdownItem>
                            <DropdownItem onClick={onAddNewTicket}><span className="w-5">{ICONS.support}</span> Yeni Destek Talebi</DropdownItem>
                            <DropdownItem onClick={onDelete}><span className="w-5">{ICONS.trash}</span> Sil</DropdownItem>
                        </Dropdown>
                    </div>
                )}
            </div>
            {/* Bottom Stats */}
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                <div>
                    <p className="text-sm text-text-secondary mb-1">Sağlık Skoru</p>
                    <HealthScoreIndicator score={customer.healthScore} breakdown={customer.healthScoreBreakdown} />
                </div>
                <Stat label="Yaşam Boyu Değeri" value={`$${stats.lifetimeValue.toLocaleString()}`} />
                <Stat label="Açık Fırsat Değeri" value={`$${stats.openDealsValue.toLocaleString()}`} />
            </div>
        </div>
    );
};

export default CustomerDetailHeaderV2;
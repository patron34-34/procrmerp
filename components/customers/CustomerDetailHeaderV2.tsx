import React, { useMemo, useState } from 'react';
import { Customer, DealStage, InvoiceStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import HealthScoreIndicator from './HealthScoreIndicator';
import CustomerForm from './CustomerForm';
import CommunicationLogForm from './CommunicationLogForm';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import { ICONS } from '../../constants';

interface CustomerDetailHeaderV2Props {
    customer: Customer & { healthScore: number };
    onAddNewTask: () => void;
}

const Stat: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div className="text-center md:text-left">
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{label}</p>
        <p className="text-2xl font-bold text-text-main dark:text-dark-text-main">{value}</p>
    </div>
);


const CustomerDetailHeaderV2: React.FC<CustomerDetailHeaderV2Props> = ({ customer, onAddNewTask }) => {
    const { deals, invoices, hasPermission } = useApp();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    
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
        <>
            <div className="bg-card dark:bg-dark-card rounded-xl border border-border dark:border-dark-border shadow-sm p-6">
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
                                        Eylemler...
                                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </Button>
                                }
                                menuPosition="right-0"
                            >
                                <DropdownItem onClick={() => setIsFormModalOpen(true)}>
                                    <span className="w-5">{ICONS.edit}</span> Düzenle
                                </DropdownItem>
                                <DropdownItem onClick={() => setIsLogModalOpen(true)}>
                                    <span className="w-5">{ICONS.add}</span> Aktivite Ekle
                                </DropdownItem>
                                <DropdownItem onClick={onAddNewTask}>
                                    <span className="w-5">{ICONS.tasks}</span> Yeni Görev Ekle
                                </DropdownItem>
                            </Dropdown>
                        </div>
                    )}
                </div>
                {/* Bottom Stats */}
                <div className="mt-6 pt-6 border-t dark:border-dark-border grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-1">Sağlık Skoru</p>
                        <HealthScoreIndicator score={customer.healthScore} />
                    </div>
                    <Stat label="Yaşam Boyu Değeri" value={`$${stats.lifetimeValue.toLocaleString()}`} />
                    <Stat label="Açık Fırsat Değeri" value={`$${stats.openDealsValue.toLocaleString()}`} />
                </div>
            </div>

            {isFormModalOpen && canManageCustomers && (
                <CustomerForm 
                    isOpen={isFormModalOpen}
                    onClose={() => setIsFormModalOpen(false)}
                    customer={customer}
                />
            )}
            {isLogModalOpen && canManageCustomers && (
                <CommunicationLogForm 
                    isOpen={isLogModalOpen}
                    onClose={() => setIsLogModalOpen(false)}
                    customerId={customer.id}
                />
            )}
        </>
    );
};

export default CustomerDetailHeaderV2;
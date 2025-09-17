import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { calculateHealthScore } from '../../utils/healthScoreCalculator';
import CustomerRelatedLists from '../customers/CustomerRelatedLists';
import CustomerSidebarTabs from '../customers/CustomerSidebarTabs';
import CustomerDetailHeaderV2 from '../customers/CustomerDetailHeaderV2';
import ConfirmationModal from '../ui/ConfirmationModal';

const CustomerDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const {
        deals, invoices, tickets, customers, deleteCustomer,
        setIsTaskFormOpen, setIsDealFormOpen, setIsProjectFormOpen,
        setIsTicketFormOpen, setIsSalesOrderFormOpen, setIsCustomerFormOpen,
        setIsLogModalOpen
    } = useApp();
    const customerId = parseInt(id || '', 10);
    const navigate = useNavigate();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const customer = React.useMemo(() => {
        const cust = customers.find(c => c.id === customerId);
        if (!cust) return null;
        const { score, breakdown } = calculateHealthScore(cust, deals, invoices, tickets);
        return { ...cust, healthScore: score, healthScoreBreakdown: breakdown };
    }, [customers, customerId, deals, invoices, tickets]);

    if (!customer) {
        return <div className="p-4"><p>Müşteri bulunamadı. Lütfen <Link to="/customers">Müşteriler sayfasına</Link> geri dönün.</p></div>;
    }
    
    const handleDeleteConfirm = () => {
        deleteCustomer(customer.id);
        setIsDeleteModalOpen(false);
        navigate('/customers');
    };

    return (
        <div className="space-y-6">
            <CustomerDetailHeaderV2 
                customer={customer}
                onEdit={() => setIsCustomerFormOpen(true, customer)}
                onDelete={() => setIsDeleteModalOpen(true)}
                onLogActivity={() => setIsLogModalOpen(true, customer.id)}
                onAddNewTask={() => setIsTaskFormOpen(true, null, { relatedEntityType: 'customer', relatedEntityId: customer.id })}
                onAddNewDeal={() => setIsDealFormOpen(true, null, { customerId: customer.id })}
                onAddNewProject={() => setIsProjectFormOpen(true, null, { customerId: customer.id })}
                onAddNewInvoice={() => navigate('/invoicing/new', { state: { customerId: customer.id } })}
                onAddNewTicket={() => setIsTicketFormOpen(true, null, { customerId: customer.id })}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2">
                    <CustomerRelatedLists 
                        customerId={customer.id}
                        onAddNewTask={() => setIsTaskFormOpen(true, null, { relatedEntityType: 'customer', relatedEntityId: customer.id })}
                        onAddNewDeal={() => setIsDealFormOpen(true, null, { customerId: customer.id })}
                        onAddNewProject={() => setIsProjectFormOpen(true, null, { customerId: customer.id })}
                        onAddNewInvoice={() => navigate('/invoicing/new', { state: { customerId: customer.id } })}
                        onAddNewTicket={() => setIsTicketFormOpen(true, null, { customerId: customer.id })}
                        onAddNewSalesOrder={() => setIsSalesOrderFormOpen(true, null, { customerId: customer.id })}
                    />
                </div>

                <div className="lg:col-span-1 space-y-6 sticky top-24">
                    <CustomerSidebarTabs customer={customer} />
                </div>
            </div>
            
            <ConfirmationModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                onConfirm={handleDeleteConfirm}
                title="Müşteriyi Sil"
                message={`'${customer.name}' adlı müşteriyi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
            />
        </div>
    );
};

export default CustomerDetail;

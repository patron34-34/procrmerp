import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { calculateHealthScore } from '../../utils/healthScoreCalculator';
import CustomerDetailHeader from '../customers/CustomerDetailHeader';
import CustomerStatsBar from '../customers/CustomerStatsBar';
import CustomerRelatedLists from '../customers/CustomerRelatedLists';
import { Task } from '../../types';
import TaskFormModal from '../tasks/TaskFormModal';
import CustomerSidebarTabs from '../customers/CustomerSidebarTabs';
import DealFormModal from '../sales/DealFormModal';
import ProjectFormModal from '../projects/ProjectFormModal';
import TicketFormModal from '../support/TicketFormModal';
import SalesOrderFormModal from '../inventory/SalesOrderFormModal';

const CustomerDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { deals, invoices, tickets, addTask, customers, addProject } = useApp();
    const customerId = parseInt(id || '', 10);
    const navigate = useNavigate();

    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
    const [isDealFormOpen, setIsDealFormOpen] = useState(false);
    const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
    const [isTicketFormOpen, setIsTicketFormOpen] = useState(false);
    const [isSalesOrderFormOpen, setIsSalesOrderFormOpen] = useState(false);

    const customer = React.useMemo(() => {
        const cust = customers.find(c => c.id === customerId);
        if (!cust) return null;
        const { score, breakdown } = calculateHealthScore(cust, deals, invoices, tickets);
        return { ...cust, healthScore: score, healthScoreBreakdown: breakdown };
    }, [customers, customerId, deals, invoices, tickets]);

    if (!customer) {
        return <div className="p-4"><p>Müşteri bulunamadı. Lütfen <Link to="/customers">Müşteriler sayfasına</Link> geri dönün.</p></div>;
    }

    const prefilledTaskData = {
        relatedEntityType: 'customer' as const,
        relatedEntityId: customer.id,
    };

    const prefilledGenericData = {
        customerId: customer.id,
    };
    
    const handleTaskSubmit = (formData: Omit<Task, 'id' | 'assignedToName' | 'relatedEntityName'>, subtaskTitles: string[]) => {
        addTask(formData, subtaskTitles);
        setIsTaskFormOpen(false);
    };

    return (
        <div className="space-y-6">
            <CustomerDetailHeader 
                customer={customer}
                onAddNewTask={() => setIsTaskFormOpen(true)}
                onAddNewDeal={() => setIsDealFormOpen(true)}
                onAddNewProject={() => setIsProjectFormOpen(true)}
                onAddNewInvoice={() => navigate('/invoicing/new', { state: { customerId: customer.id } })}
                onAddNewTicket={() => setIsTicketFormOpen(true)}
                onAddNewSalesOrder={() => setIsSalesOrderFormOpen(true)}
            />
            <CustomerStatsBar customerId={customer.id} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Main Content Area (Left) */}
                <div className="lg:col-span-2">
                    <CustomerRelatedLists 
                        customerId={customer.id}
                        onAddNewDeal={() => setIsDealFormOpen(true)}
                        onAddNewProject={() => setIsProjectFormOpen(true)}
                        onAddNewInvoice={() => navigate('/invoicing/new', { state: { customerId: customer.id } })}
                        onAddNewTicket={() => setIsTicketFormOpen(true)}
                        onAddNewSalesOrder={() => setIsSalesOrderFormOpen(true)}
                    />
                </div>

                {/* Persistent Sidebar (Right) */}
                <div className="lg:col-span-1 space-y-6 sticky top-24">
                    <CustomerSidebarTabs customer={customer} />
                </div>
            </div>
            
            {isTaskFormOpen && <TaskFormModal isOpen={isTaskFormOpen} onClose={() => setIsTaskFormOpen(false)} task={null} prefilledData={prefilledTaskData} onSubmit={handleTaskSubmit} />}
            {isDealFormOpen && <DealFormModal isOpen={isDealFormOpen} onClose={() => setIsDealFormOpen(false)} deal={null} prefilledData={prefilledGenericData} />}
            {isProjectFormOpen && <ProjectFormModal isOpen={isProjectFormOpen} onClose={() => setIsProjectFormOpen(false)} project={null} prefilledData={prefilledGenericData} />}
            {isTicketFormOpen && <TicketFormModal isOpen={isTicketFormOpen} onClose={() => setIsTicketFormOpen(false)} ticket={null} prefilledData={prefilledGenericData} />}
            {isSalesOrderFormOpen && <SalesOrderFormModal isOpen={isSalesOrderFormOpen} onClose={() => setIsSalesOrderFormOpen(false)} order={null} prefilledData={prefilledGenericData} />}
        </div>
    );
};

export default CustomerDetail;
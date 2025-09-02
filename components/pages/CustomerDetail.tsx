import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { calculateHealthScore } from '../../utils/healthScoreCalculator';
import CustomerDetailHeader from '../customers/CustomerDetailHeader';
import CustomerStatsBar from '../customers/CustomerStatsBar';
import CustomerRelatedLists from '../customers/CustomerRelatedLists';
import { Task } from '../../types';
import TaskFormModal from '../tasks/TaskFormModal';
import CustomerSidebarTabs from '../customers/CustomerSidebarTabs';

const CustomerDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { customers, deals, invoices, tickets, addTask } = useApp();
    const customerId = parseInt(id || '', 10);

    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

    const customer = useMemo(() => {
        const cust = customers.find(c => c.id === customerId);
        if (!cust) return null;
        const healthScore = calculateHealthScore(cust, deals, invoices, tickets);
        return { ...cust, healthScore };
    }, [customers, customerId, deals, invoices, tickets]);

    if (!customer) {
        return <div className="p-4"><p>Müşteri bulunamadı. Lütfen <Link to="/customers">Müşteriler sayfasına</Link> geri dönün.</p></div>;
    }

    const prefilledTaskData = {
        relatedEntityType: 'customer' as const,
        relatedEntityId: customer.id,
    };
    
    const handleTaskSubmit = (formData: Omit<Task, 'id' | 'assignedToName' | 'relatedEntityName'>, subtaskTitles: string[]) => {
        addTask(formData, subtaskTitles);
        setIsTaskFormOpen(false);
    };

    return (
        <div className="space-y-6">
            <CustomerDetailHeader customer={customer} onAddNewTask={() => setIsTaskFormOpen(true)} />
            <CustomerStatsBar customerId={customer.id} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Main Content Area (Left) */}
                <div className="lg:col-span-2">
                    <CustomerRelatedLists 
                        customerId={customer.id}
                        // Dummy props to satisfy component, will be handled by new buttons
                        onAddNewDeal={() => {}}
                        onAddNewProject={() => {}}
                        onAddNewInvoice={() => {}}
                        onAddNewTicket={() => {}}
                        onAddNewSalesOrder={() => {}}
                    />
                </div>

                {/* Persistent Sidebar (Right) */}
                <div className="lg:col-span-1 space-y-6 sticky top-24">
                    <CustomerSidebarTabs customer={customer} />
                </div>
            </div>
            
            {isTaskFormOpen && <TaskFormModal isOpen={isTaskFormOpen} onClose={() => setIsTaskFormOpen(false)} task={null} prefilledData={prefilledTaskData} onSubmit={handleTaskSubmit} />}
        </div>
    );
};

export default CustomerDetail;



import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { Link } from 'react-router-dom';

const KanbanCard: React.FC<{ customer: Customer; onDragStart: (e: React.DragEvent<HTMLDivElement>, customerId: number) => void; canManage: boolean }> = ({ customer, onDragStart, canManage }) => {
    return (
        <div 
            draggable={canManage}
            onDragStart={(e) => canManage && onDragStart(e, customer.id)}
            className={`bg-white p-3 mb-3 rounded-md shadow-sm border border-slate-200 dark:bg-dark-card/50 dark:border-dark-border ${canManage ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
        >
            <div className="flex items-center gap-3">
                <img src={customer.avatar} alt={customer.name} className="h-10 w-10 rounded-full" />
                <div>
                    <Link to={`/customers/${customer.id}`} className="font-bold text-sm hover:text-primary-600 dark:hover:text-primary-400">{customer.name}</Link>
                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{customer.company}</p>
                </div>
            </div>
             <div className="mt-2 flex flex-wrap gap-1">
                {customer.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">{tag}</span>
                ))}
            </div>
        </div>
    );
};

const KanbanColumn: React.FC<{
  status: Customer['status'];
  customers: Customer[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, customerId: number) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: Customer['status']) => void;
  canManage: boolean;
}> = ({ status, customers, onDragStart, onDrop, canManage }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); if (canManage) setIsOver(true); };
    const handleDragLeave = () => setIsOver(false);
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { if (canManage) { onDrop(e, status); setIsOver(false); } };

    const statusConfig = {
        potensiyel: { title: 'Potensiyel', color: 'border-t-blue-500' },
        aktif: { title: 'Aktif', color: 'border-t-green-500' },
        kaybedilmiş: { title: 'Kaybedilmiş', color: 'border-t-red-500' },
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 min-w-[300px] bg-slate-100 rounded-lg p-3 transition-colors duration-300 dark:bg-dark-card/30 ${isOver ? 'bg-slate-200 dark:bg-dark-card/60' : ''}`}
        >
            <div className={`p-2 mb-3 rounded-t-md border-t-4 ${statusConfig[status].color}`}>
                <h3 className="font-bold text-text-main dark:text-dark-text-main">{statusConfig[status].title}</h3>
                <span className="text-sm text-text-secondary dark:text-dark-text-secondary">{customers.length} müşteri</span>
            </div>
            <div className="max-h-[calc(100vh-450px)] overflow-y-auto pr-2">
                {customers.map(customer => (
                    <KanbanCard key={customer.id} customer={customer} onDragStart={onDragStart} canManage={canManage} />
                ))}
            </div>
        </div>
    );
};

interface CustomerKanbanViewProps {
    customers: Customer[];
    onUpdateStatus: (customerId: number, newStatus: Customer['status']) => void;
}

const CustomerKanbanView: React.FC<CustomerKanbanViewProps> = ({ customers, onUpdateStatus }) => {
    const { hasPermission } = useApp();
    const canManageCustomers = hasPermission('musteri:yonet');

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, customerId: number) => {
        e.dataTransfer.setData('customerId', customerId.toString());
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: Customer['status']) => {
        const customerId = parseInt(e.dataTransfer.getData('customerId'), 10);
        onUpdateStatus(customerId, newStatus);
    };

    const statuses: Customer['status'][] = ['potensiyel', 'aktif', 'kaybedilmiş'];

    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {statuses.map(status => (
                <KanbanColumn
                    key={status}
                    status={status}
                    customers={customers.filter(c => c.status === status)}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    canManage={canManageCustomers}
                />
            ))}
        </div>
    );
};

export default CustomerKanbanView;

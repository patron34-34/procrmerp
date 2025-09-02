import React from 'react';
import { useApp } from '../../context/AppContext';
import { TicketStatus, TicketPriority } from '../../types';

interface SupportTicketFilterBarProps {
    filters: {
        status: string;
        priority: string;
        assignedToId: string;
        searchTerm: string;
    };
    setFilters: (filters: SupportTicketFilterBarProps['filters']) => void;
}

const SupportTicketFilterBar: React.FC<SupportTicketFilterBarProps> = ({ filters, setFilters }) => {
    const { employees } = useApp();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
                type="text"
                name="searchTerm"
                placeholder="Konu, talep no veya müşteri ara..."
                value={filters.searchTerm}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border col-span-1"
            />
            <select name="status" value={filters.status} onChange={handleInputChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                <option value="all">Tüm Durumlar</option>
                {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select name="priority" value={filters.priority} onChange={handleInputChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                <option value="all">Tüm Öncelikler</option>
                {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select name="assignedToId" value={filters.assignedToId} onChange={handleInputChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                <option value="all">Tüm Sorumlular</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
        </div>
    );
};

export default SupportTicketFilterBar;

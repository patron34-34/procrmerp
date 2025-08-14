import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Deal, DealStage } from '../../types';
import { Link } from 'react-router-dom';
import { ICONS } from '../../constants';

interface SalesListViewProps {
    deals: Deal[];
    onEdit: (deal: Deal) => void;
    onDelete: (deal: Deal) => void;
    onStageChangeRequest: (deal: Deal, newStage: DealStage) => void;
}

const SalesListView: React.FC<SalesListViewProps> = ({ deals, onEdit, onDelete, onStageChangeRequest }) => {
    const { employees, updateDeal, hasPermission } = useApp();
    const [editingCell, setEditingCell] = useState<{ id: number; key: 'stage' | 'assignedToId' } | null>(null);

    const canManageDeals = hasPermission('anlasma:yonet');

    const handleInlineUpdate = (deal: Deal, key: 'stage' | 'assignedToId', value: string | number) => {
        if (key === 'stage') {
            onStageChangeRequest(deal, value as DealStage);
        } else {
            const employee = employees.find(e => e.id === value);
            if(employee){
                updateDeal({ ...deal, assignedToId: employee.id });
            }
        }
        setEditingCell(null);
    };

    const isStale = (deal: Deal) => {
        const daysSinceLastActivity = (new Date().getTime() - new Date(deal.lastActivityDate).getTime()) / (1000 * 3600 * 24);
        return daysSinceLastActivity > 14 && deal.stage !== DealStage.Won && deal.stage !== DealStage.Lost;
    };
    
    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-left">
                <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                    <th className="p-3 font-semibold">Anlaşma Adı</th>
                    <th className="p-3 font-semibold">Müşteri</th>
                    <th className="p-3 font-semibold">Değer</th>
                    <th className="p-3 font-semibold">Aşama</th>
                    <th className="p-3 font-semibold">Sorumlu</th>
                    <th className="p-3 font-semibold">Kapanış Tarihi</th>
                    {canManageDeals && <th className="p-3 font-semibold">Eylemler</th>}
                </tr></thead>
                <tbody>
                    {deals.map((deal) => (
                    <tr key={deal.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-medium">
                           <div className="flex items-center gap-2">
                                {isStale(deal) && <span title="Bu anlaşma 14 günden uzun süredir işlem görmedi." className="text-orange-500">⚠️</span>}
                                <Link to={`/deals/${deal.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">{deal.title}</Link>
                           </div>
                        </td>
                        <td className="p-3 text-text-secondary dark:text-dark-text-secondary"><Link to={`/customers/${deal.customerId}`} className="hover:text-primary-600 dark:hover:text-primary-400">{deal.customerName}</Link></td>
                        <td className="p-3 font-semibold text-primary-600">${deal.value.toLocaleString()}</td>
                        <td className="p-3" onClick={() => canManageDeals && setEditingCell({ id: deal.id, key: 'stage' })}>
                            {editingCell?.id === deal.id && editingCell.key === 'stage' ? (
                                <select
                                    defaultValue={deal.stage}
                                    onBlur={() => setEditingCell(null)}
                                    onChange={(e) => handleInlineUpdate(deal, 'stage', e.target.value)}
                                    autoFocus
                                    className="p-1 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                >
                                    {Object.values(DealStage).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            ) : (
                                <span className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 p-1 rounded">{deal.stage}</span>
                            )}
                        </td>
                        <td className="p-3" onClick={() => canManageDeals && setEditingCell({ id: deal.id, key: 'assignedToId' })}>
                            {editingCell?.id === deal.id && editingCell.key === 'assignedToId' ? (
                                <select
                                    defaultValue={deal.assignedToId}
                                    onBlur={() => setEditingCell(null)}
                                    onChange={(e) => handleInlineUpdate(deal, 'assignedToId', parseInt(e.target.value))}
                                    autoFocus
                                    className="p-1 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                >
                                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                            ) : (
                                <span className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 p-1 rounded">{deal.assignedToName}</span>
                            )}
                        </td>
                        <td className="p-3 text-text-secondary dark:text-dark-text-secondary">{deal.closeDate}</td>
                        {canManageDeals && <td className="p-3"><div className="flex items-center gap-3">
                            <button onClick={() => onEdit(deal)} className="text-slate-500 hover:text-primary-600">{ICONS.edit}</button>
                            <button onClick={() => onDelete(deal)} className="text-slate-500 hover:text-red-600">{ICONS.trash}</button>
                        </div></td>}
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesListView;
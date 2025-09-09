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
    selectedIds: number[];
    onSelectionChange: (ids: number[]) => void;
    canManage: boolean;
}

const SalesListView: React.FC<SalesListViewProps> = ({ deals, onEdit, onDelete, onStageChangeRequest, selectedIds, onSelectionChange, canManage }) => {
    const { employees, updateDeal } = useApp();
    const [editingCell, setEditingCell] = useState<{ id: number; key: 'stage' | 'assignedToId' } | null>(null);
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            onSelectionChange(deals.map(d => d.id));
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        if (e.target.checked) {
            onSelectionChange([...selectedIds, id]);
        } else {
            onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
        }
    };

    const handleInlineUpdate = (deal: Deal, key: 'stage' | 'assignedToId', value: string | number) => {
        if (key === 'stage') {
            onStageChangeRequest(deal, value as DealStage);
        } else {
            const employee = employees.find(e => e.id === value);
            if(employee){
                updateDeal({ ...deal, assignedToId: employee.id, assignedToName: employee.name });
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
                    {canManage && <th className="p-3"><input type="checkbox" onChange={handleSelectAll} checked={deals.length > 0 && selectedIds.length === deals.length} /></th>}
                    <th className="p-3 font-semibold">Anlaşma Adı</th>
                    <th className="p-3 font-semibold">Müşteri</th>
                    <th className="p-3 font-semibold">Değer</th>
                    <th className="p-3 font-semibold">Aşama</th>
                    <th className="p-3 font-semibold">Sorumlu</th>
                    <th className="p-3 font-semibold">Kapanış Tarihi</th>
                    {canManage && <th className="p-3 font-semibold">Eylemler</th>}
                </tr></thead>
                <tbody>
                    {deals.map((deal) => (
                    <tr key={deal.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        {canManage && <td className="p-3"><input type="checkbox" checked={selectedIds.includes(deal.id)} onChange={(e) => handleSelectOne(e, deal.id)} /></td>}
                        <td className="p-3 font-medium">
                           <div className="flex items-center gap-2">
                                {isStale(deal) && <span title="Bu anlaşma 14 günden uzun süredir işlem görmedi." className="text-orange-500">⚠️</span>}
                                <Link to={`/deals/${deal.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">{deal.title}</Link>
                           </div>
                        </td>
                        <td className="p-3 text-text-secondary dark:text-dark-text-secondary"><Link to={`/customers/${deal.customerId}`} className="hover:text-primary-600 dark:hover:text-primary-400">{deal.customerName}</Link></td>
                        <td className="p-3 font-semibold text-primary-600">${deal.value.toLocaleString()}</td>
                        <td className="p-3" onClick={() => canManage && setEditingCell({ id: deal.id, key: 'stage' })}>
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
                        <td className="p-3" onClick={() => canManage && setEditingCell({ id: deal.id, key: 'assignedToId' })}>
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
                        {canManage && <td className="p-3"><div className="flex items-center gap-3">
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
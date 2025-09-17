
import React, { useState, useMemo, ReactNode } from 'react';
import { Invoice, Bill, InvoiceStatus, BillStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../../constants';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { exportInvoicesToCSV } from '../../utils/invoiceExporter';

interface GenericInvoiceListProps<T extends Invoice | Bill> {
    title: string;
    items: T[];
    type: 'invoice' | 'bill';
    statusFilterOptions: (InvoiceStatus | BillStatus)[];
    onPreview: (item: T) => void;
    onDelete: (item: T) => void;
    onBulkUpdateStatus: (ids: number[], newStatus: any) => void;
    emptyStateTitle: string;
    emptyStateDescription: string;
    emptyStateAction?: ReactNode;
}

const GenericInvoiceList = <T extends Invoice | Bill>({
    title,
    items,
    type,
    statusFilterOptions,
    onPreview,
    onDelete,
    onBulkUpdateStatus,
    emptyStateTitle,
    emptyStateDescription,
    emptyStateAction,
}: GenericInvoiceListProps<T>) => {
    const navigate = useNavigate();
    const { hasPermission, customers, suppliers } = useApp();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [statusForBulkUpdate, setStatusForBulkUpdate] = useState(statusFilterOptions[0]);
    const canManage = type === 'invoice' ? hasPermission('fatura:yonet') : hasPermission('muhasebe:yonet');

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(items.map(i => i.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        setSelectedIds(prev => e.target.checked ? [...prev, id] : prev.filter(i => i !== id));
    };

    const handleBulkUpdate = () => {
        onBulkUpdateStatus(selectedIds, statusForBulkUpdate);
        setSelectedIds([]);
    };
    
    const handleExport = () => {
        const selectedItems = items.filter(i => selectedIds.includes(i.id));
        const entities = type === 'invoice' ? customers : suppliers;
        exportInvoicesToCSV(selectedItems.length > 0 ? selectedItems : items, entities);
    };

    const getStatusBadge = (status: InvoiceStatus | BillStatus) => {
        const getStatusStyle = (status: InvoiceStatus | BillStatus): string => {
            switch (status) {
                case InvoiceStatus.Draft:
                case BillStatus.PendingApproval:
                    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
                case InvoiceStatus.Sent:
                case BillStatus.Approved:
                    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
                case InvoiceStatus.Paid:
                case BillStatus.Paid:
                    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
                case InvoiceStatus.Overdue:
                case BillStatus.Rejected:
                    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                case InvoiceStatus.Archived:
                case BillStatus.Archived:
                    return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
                default:
                    return 'bg-gray-100 text-gray-800';
            }
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(status)}`}>{status}</span>;
    };

    const totalAmount = useMemo(() => items.reduce((sum, item) => sum + ('grandTotal' in item ? item.grandTotal : item.totalAmount), 0), [items]);

    return (
        <div>
            {canManage && selectedIds.length > 0 && (
                <div className="p-4 bg-primary-100 dark:bg-primary-900/50 rounded-lg mb-4 flex items-center gap-4">
                    <span className="font-semibold">{selectedIds.length} öğe seçildi.</span>
                    <select value={statusForBulkUpdate} onChange={e => setStatusForBulkUpdate(e.target.value as (InvoiceStatus | BillStatus))} className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                        {statusFilterOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <Button onClick={handleBulkUpdate}>Durumu Güncelle</Button>
                </div>
            )}
             <div className="overflow-x-auto">
                {items.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            {canManage && <th className="p-3"><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === items.length && items.length > 0} /></th>}
                            <th className="p-3 font-semibold">{type === 'invoice' ? 'Fatura No' : 'Gider No'}</th>
                            <th className="p-3 font-semibold">{type === 'invoice' ? 'Müşteri' : 'Tedarikçi'}</th>
                            <th className="p-3 font-semibold">Tarih</th>
                            <th className="p-3 font-semibold">Vade Tarihi</th>
                            <th className="p-3 font-semibold text-right">Tutar</th>
                            <th className="p-3 font-semibold">Durum</th>
                            <th className="p-3 font-semibold">Eylemler</th>
                        </tr></thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    {canManage && <td className="p-3"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={e => handleSelectOne(e, item.id)} /></td>}
                                    <td className="p-3 font-mono">
                                         <button onClick={() => onPreview(item)} className="text-primary-600 hover:underline">
                                            {'invoiceNumber' in item ? item.invoiceNumber : item.billNumber}
                                        </button>
                                    </td>
                                    <td className="p-3">{'customerName' in item ? item.customerName : item.supplierName}</td>
                                    <td className="p-3">{item.issueDate}</td>
                                    <td className="p-3">{item.dueDate}</td>
                                    <td className="p-3 text-right font-mono">${'grandTotal' in item ? item.grandTotal.toLocaleString() : item.totalAmount.toLocaleString()}</td>
                                    <td className="p-3">{getStatusBadge(item.status)}</td>
                                    <td className="p-3"><div className="flex gap-2">
                                        <button onClick={() => onPreview(item)} className="p-1 text-slate-500 hover:text-primary-600">{ICONS.view}</button>
                                        {canManage && type === 'invoice' && <button onClick={() => navigate(`/invoicing/edit/${item.id}`)} className="p-1 text-slate-500 hover:text-primary-600">{ICONS.edit}</button>}
                                        {canManage && <button onClick={() => onDelete(item)} className="p-1 text-slate-500 hover:text-red-600">{ICONS.trash}</button>}
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                         <tfoot>
                            <tr className="font-bold bg-slate-100 dark:bg-slate-800/50">
                                <td colSpan={canManage ? 5 : 4} className="p-3 text-right">Toplam</td>
                                <td className="p-3 text-right font-mono">${totalAmount.toLocaleString()}</td>
                                <td colSpan={2}></td>
                            </tr>
                        </tfoot>
                    </table>
                ) : <EmptyState icon={ICONS.invoices} title={emptyStateTitle} description={emptyStateDescription} action={emptyStateAction} />}
            </div>
        </div>
    );
};
export default GenericInvoiceList;

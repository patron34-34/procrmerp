import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Customer, SortConfig } from '../../types';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { ICONS } from '../../constants';
import HealthScoreIndicator from './HealthScoreIndicator';

interface CustomerListViewProps {
    customers: (Customer & { assignedToName: string, healthScoreBreakdown?: string[] })[];
    onEdit: (customer: Customer) => void;
    onDeleteRequest: (customer: Customer) => void;
    onUpdateStatus: (customerId: number, newStatus: string) => void;
    onUpdateAssignee: (customerId: number, newAssigneeId: number) => void;
    selectedIds: number[];
    onSelectionChange: (selectedIds: number[]) => void;
    sortConfig: SortConfig;
    onSort: (config: SortConfig) => void;
    canManageCustomers: boolean;
    totalCustomers: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (size: number) => void;
}

const CustomerListView: React.FC<CustomerListViewProps> = (props) => {
  const { employees, systemLists } = useApp();
  const { 
      customers, onEdit, onDeleteRequest, onUpdateStatus, onUpdateAssignee, selectedIds, onSelectionChange, sortConfig, onSort, canManageCustomers,
      totalCustomers, currentPage, totalPages, itemsPerPage, onPageChange, onItemsPerPageChange
  } = props;
  
  const [editingCell, setEditingCell] = useState<{ id: number; key: 'status' | 'assignedToId' } | null>(null);
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.checked) {
        onSelectionChange(customers.map(c => c.id));
    } else {
        onSelectionChange([]);
    }
  };

  const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if(e.target.checked) {
        onSelectionChange([...selectedIds, id]);
    } else {
        onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };
  
  const handleInlineUpdate = (customer: Customer, key: 'status' | 'assignedToId', value: string | number) => {
    if (key === 'status') {
        onUpdateStatus(customer.id, value as string);
    } else {
        onUpdateAssignee(customer.id, value as number);
    }
    setEditingCell(null);
  };

  const getStatusChip = (statusId: Customer['status']) => {
    const statusInfo = systemLists.customerStatus.find(s => s.id === statusId);
    const color = statusInfo?.color || '#64748b'; // default slate color
    return <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: `${color}20`, color }}>{statusInfo?.label || statusId}</span>;
  };

  const formatLastContact = (dateString: string) => {
    const lastContactDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - lastContactDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let relativeTime;
    if (diffDays <= 0) {
        relativeTime = 'Bugün';
    } else if (diffDays === 1) {
        relativeTime = 'Dün';
    } else {
        relativeTime = `${diffDays} gün önce`;
    }
    return (
        <div>
            <span>{new Date(dateString).toLocaleDateString('tr-TR')}</span>
            <span className="block text-xs text-gray-500">{relativeTime}</span>
        </div>
    );
  };

  const SortableHeader: React.FC<{ columnKey: keyof (Customer & { assignedToName: string }); title: string; }> = ({ columnKey, title }) => {
    const isSorted = sortConfig?.key === columnKey;
    const directionIcon = sortConfig?.direction === 'ascending' ? '▲' : '▼';

    const handleSort = () => {
        const direction = isSorted && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        onSort({ key: columnKey, direction });
    };

    return (
        <th className="p-3 font-semibold cursor-pointer" onClick={handleSort}>
            <div className="flex items-center gap-2">
                {title}
                {isSorted && <span className="text-xs">{directionIcon}</span>}
            </div>
        </th>
    );
  };

  return (
    <>
    <div className="overflow-x-auto">
      {customers.length > 0 ? (
          <table className="w-full text-left">
          <thead className="border-b border-border"><tr className="bg-slate-50 dark:bg-sidebar text-xs uppercase text-text-secondary">
              {canManageCustomers && <th className="p-3"><input type="checkbox" onChange={handleSelectAll} checked={customers.length > 0 && selectedIds.length === customers.length} /></th>}
              <SortableHeader columnKey="company" title="Müşteri Adı" />
              <SortableHeader columnKey="assignedToName" title="Sorumlu" />
              <SortableHeader columnKey="lastContact" title="Son İletişim" />
              <SortableHeader columnKey="healthScore" title="Sağlık Skoru" />
              <SortableHeader columnKey="status" title="Durum" />
              {canManageCustomers && <th className="p-3 font-semibold">Eylemler</th>}
          </tr></thead>
          <tbody>
              {customers.map((customer) => (
              <tr key={customer.id} className="group odd:bg-white even:bg-slate-50 dark:odd:bg-card dark:even:bg-slate-800/50">
                  {canManageCustomers && <td className="p-4"><input type="checkbox" checked={selectedIds.includes(customer.id)} onChange={(e) => handleSelectOne(e, customer.id)} /></td>}
                  <td className="p-4 flex items-center gap-4">
                      <img src={customer.avatar} alt={customer.name} className="h-10 w-10 rounded-full" />
                      <div>
                        <Link to={`/customers/${customer.id}`} className="font-medium hover:text-primary-600">{customer.company}</Link>
                        <p className="text-sm text-text-secondary">{customer.email}</p>
                      </div>
                  </td>
                  <td className="p-4 text-text-secondary" onClick={() => canManageCustomers && setEditingCell({ id: customer.id, key: 'assignedToId' })}>
                    {editingCell?.id === customer.id && editingCell.key === 'assignedToId' ? (
                        <select
                            defaultValue={customer.assignedToId}
                            onBlur={() => setEditingCell(null)}
                            onChange={(e) => handleInlineUpdate(customer, 'assignedToId', parseInt(e.target.value))}
                            autoFocus
                            className="p-1 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                        >
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    ) : (
                        <span className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 p-1 rounded">{customer.assignedToName}</span>
                    )}
                  </td>
                  <td className="p-4 text-text-secondary">{formatLastContact(customer.lastContact)}</td>
                  <td className="p-4"><HealthScoreIndicator score={customer.healthScore || 0} breakdown={customer.healthScoreBreakdown} /></td>
                  <td className="p-4" onClick={() => canManageCustomers && setEditingCell({ id: customer.id, key: 'status' })}>
                    {editingCell?.id === customer.id && editingCell.key === 'status' ? (
                         <select
                            defaultValue={customer.status}
                            onBlur={() => setEditingCell(null)}
                            onChange={(e) => handleInlineUpdate(customer, 'status', e.target.value)}
                            autoFocus
                            className="p-1 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                        >
                             {systemLists.customerStatus.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                    ) : (
                        <div className="cursor-pointer">{getStatusChip(customer.status)}</div>
                    )}
                  </td>
                  {canManageCustomers && <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => onEdit(customer)} 
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Düzenle"
                            title="Düzenle"
                        >
                            {React.cloneElement(ICONS.edit, { className: 'h-5 w-5' })}
                        </button>
                        <button 
                            onClick={() => onDeleteRequest(customer)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Sil"
                            title="Sil"
                        >
                            {React.cloneElement(ICONS.trash, { className: 'h-5 w-5' })}
                        </button>
                    </div>
                  </td>}
              </tr>
              ))}
          </tbody>
          </table>
      ) : (
          <EmptyState
              icon={ICONS.customers}
              title="Sonuç Bulunamadı"
              description="Filtre kriterlerinize uyan müşteri bulunamadı."
          />
      )}
    </div>
    {totalPages > 1 && (
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
        <div className="text-sm text-text-secondary flex items-center gap-4">
           <select 
              value={itemsPerPage} 
              onChange={e => onItemsPerPageChange(Number(e.target.value))}
              className="p-1 border rounded-md dark:bg-slate-700 dark:border-dark-border"
            >
              {[10, 20, 50].map(size => <option key={size} value={size}>Sayfa başına {size}</option>)}
            </select>
            <span>Toplam {totalCustomers} müşteri</span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} variant="secondary">Önceki</Button>
          <span>Sayfa {currentPage} / {totalPages}</span>
          <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="secondary">Sonraki</Button>
        </div>
      </div>
    )}
    </>
  );
};

export default CustomerListView;
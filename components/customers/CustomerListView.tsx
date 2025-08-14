
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import ConfirmationModal from '../ui/ConfirmationModal';
import { ICONS } from '../../constants';

interface CustomerListViewProps {
    customers: (Customer & { assignedToName: string })[];
    onEdit: (customer: Customer) => void;
    onUpdate: (customer: Customer) => void;
    onSelectionChange: (selectedIds: number[]) => void;
}

const HealthIndicator: React.FC<{ score: number; factors: string[] }> = ({ score, factors }) => {
    const getHealthInfo = () => {
        if (score > 75) return { color: 'bg-green-500', text: 'İyi' };
        if (score > 40) return { color: 'bg-yellow-500', text: 'Riskli' };
        return { color: 'bg-red-500', text: 'Zayıf' };
    };
    const { color, text } = getHealthInfo();
    const tooltipText = `Sağlık Puanı: ${score}/100\n${factors.join('\n')}`;

    return (
        <div className="flex items-center gap-2" title={tooltipText}>
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span>{text}</span>
        </div>
    );
};


const CustomerListView: React.FC<CustomerListViewProps> = (props) => {
  const { employees, deleteCustomer, hasPermission, systemLists, getCustomerHealthScore } = useApp();
  const { customers, onEdit, onUpdate, onSelectionChange } = props;
  
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingCell, setEditingCell] = useState<{ id: number; key: 'status' | 'assignedToId' } | null>(null);
  
  const canManageCustomers = hasPermission('musteri:yonet');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  useEffect(() => {
    onSelectionChange(selectedIds);
  }, [selectedIds, onSelectionChange]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [customers]);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return customers.slice(startIndex, startIndex + itemsPerPage);
  }, [customers, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(customers.length / itemsPerPage);
  
  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id);
      setCustomerToDelete(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.checked) {
        const newSelectedIds = paginatedCustomers.map(c => c.id)
        setSelectedIds(newSelectedIds);
    } else {
        setSelectedIds([]);
    }
  };

  const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    let newSelectedIds;
    if(e.target.checked) {
        newSelectedIds = [...selectedIds, id];
    } else {
        newSelectedIds = selectedIds.filter(selectedId => selectedId !== id);
    }
    setSelectedIds(newSelectedIds);
  };
  
  const handleInlineUpdate = (customer: Customer, key: 'status' | 'assignedToId', value: string | number) => {
    onUpdate({ ...customer, [key]: value });
    setEditingCell(null);
  };

  const getStatusChip = (status: Customer['status']) => {
    const statusInfo = systemLists.customerStatus.find(s => s.id === status);
    const styles: { [key in Customer['status']]: string } = {
      aktif: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      kaybedilmiş: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      potensiyel: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{statusInfo?.label || status}</span>;
  };

  return (
    <>
    <div className="overflow-x-auto">
      {customers.length > 0 ? (
          <table className="w-full text-left">
          <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
              {canManageCustomers && <th className="p-3"><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === paginatedCustomers.length && paginatedCustomers.length > 0} /></th>}
              <th className="p-3 font-semibold">Müşteri Adı</th>
              <th className="p-3 font-semibold">Sağlık</th>
              <th className="p-3 font-semibold">Sorumlu</th>
              <th className="p-3 font-semibold">Son İletişim</th>
              <th className="p-3 font-semibold">Durum</th>
              {canManageCustomers && <th className="p-3 font-semibold">Eylemler</th>}
          </tr></thead>
          <tbody>
              {paginatedCustomers.map((customer) => {
                  const health = getCustomerHealthScore(customer.id);
                  return (
              <tr key={customer.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  {canManageCustomers && <td className="p-3"><input type="checkbox" checked={selectedIds.includes(customer.id)} onChange={(e) => handleSelectOne(e, customer.id)} /></td>}
                  <td className="p-3 flex items-center gap-4">
                      <img src={customer.avatar} alt={customer.name} className="h-10 w-10 rounded-full" />
                      <div>
                        <Link to={`/customers/${customer.id}`} className="font-medium hover:text-primary-600 dark:hover:text-primary-400">{customer.company}</Link>
                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{customer.email}</p>
                      </div>
                  </td>
                  <td className="p-3"><HealthIndicator score={health.score} factors={health.factors} /></td>
                  <td className="p-3 text-text-secondary dark:text-dark-text-secondary" onClick={() => canManageCustomers && setEditingCell({ id: customer.id, key: 'assignedToId' })}>
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
                  <td className="p-3 text-text-secondary dark:text-dark-text-secondary">{customer.lastContact}</td>
                  <td className="p-3" onClick={() => canManageCustomers && setEditingCell({ id: customer.id, key: 'status' })}>
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
                  {canManageCustomers && <td className="p-3"><div className="flex items-center gap-3">
                     <button onClick={() => onEdit(customer)} className="text-slate-500 hover:text-primary-600">{ICONS.edit}</button>
                     <button onClick={() => setCustomerToDelete(customer)} className="text-slate-500 hover:text-red-600">{ICONS.trash}</button>
                  </div></td>}
              </tr>
                  )
              })}
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
      <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-dark-border">
        <div className="text-sm text-text-secondary">Toplam {customers.length} müşteri</div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} variant="secondary">Önceki</Button>
          <span>Sayfa {currentPage} / {totalPages}</span>
          <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} variant="secondary">Sonraki</Button>
        </div>
      </div>
    )}
    
    {canManageCustomers && <ConfirmationModal 
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Müşteriyi Sil"
        message={`'${customerToDelete?.name}' adlı müşteriyi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
    />}
    </>
  );
};

export default CustomerListView;

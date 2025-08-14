
import React from 'react';
import { useApp } from '../../context/AppContext';
import { DealStage, InvoiceStatus, TaskStatus, TicketStatus, TransactionType } from '../../types';

interface StatCardWidgetProps {
  widgetId: string;
}

const StatCardWidget: React.FC<StatCardWidgetProps> = ({ widgetId }) => {
  const { customers, deals, invoices, bankAccounts, transactions, tickets, documents } = useApp();

  const calculateStat = () => {
    switch (widgetId) {
      case 'stat-total-cash':
        const totalCash = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
        return { value: `$${totalCash.toLocaleString()}`, color: 'text-green-600' };
      case 'stat-net-cash-flow':
        const totalIncome = transactions.filter(t => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions.filter(t => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);
        const netCashFlow = totalIncome - totalExpense;
        return { value: `$${netCashFlow.toLocaleString()}`, color: netCashFlow >= 0 ? 'text-green-600' : 'text-red-600' };
      case 'stat-total-revenue':
        const totalRevenue = deals.filter(d => d.stage === DealStage.Won).reduce((sum, deal) => sum + deal.value, 0);
        return { value: `$${totalRevenue.toLocaleString()}`, color: 'text-primary-600' };
      case 'stat-unpaid-invoices':
        const totalUnpaid = invoices.filter(inv => inv.status === InvoiceStatus.Sent || inv.status === InvoiceStatus.Overdue).reduce((sum, inv) => sum + inv.grandTotal, 0);
        return { value: `$${totalUnpaid.toLocaleString()}`, color: 'text-orange-500' };
      case 'stat-active-customers':
        const activeCustomers = customers.filter(c => c.status === 'aktif').length;
        return { value: activeCustomers.toLocaleString(), color: 'text-text-main dark:text-dark-text-main' };
      case 'stat-open-tickets':
        const openTickets = tickets.filter(t => t.status === TicketStatus.Open || t.status === TicketStatus.Pending).length;
        return { value: openTickets.toLocaleString(), color: 'text-text-main dark:text-dark-text-main' };
      default:
        return { value: 'N/A', color: 'text-text-main dark:text-dark-text-main' };
    }
  };

  const { value, color } = calculateStat();

  return (
    <div className="flex items-center justify-center h-full">
      <p className={`text-4xl font-bold ${color}`}>{value}</p>
    </div>
  );
};

export default StatCardWidget;

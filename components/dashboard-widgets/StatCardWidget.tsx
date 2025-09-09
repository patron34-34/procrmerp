import React, { memo } from 'react';
import { useApp } from '../../context/AppContext';
import { DealStage, InvoiceStatus, TaskStatus, TicketStatus, TransactionType } from '../../types';
import { AVAILABLE_WIDGETS, ICONS } from '../../constants';
import Card from '../ui/Card';

interface StatCardWidgetProps {
  widgetId: string;
}

const StatCardWidget: React.FC<StatCardWidgetProps> = memo(({ widgetId }) => {
  const { customers, deals, invoices, bankAccounts, transactions, tickets } = useApp();

  const calculateStat = () => {
    switch (widgetId) {
      case 'stat-total-cash':
        const totalCash = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
        return { value: `$${totalCash.toLocaleString()}` };
      case 'stat-net-cash-flow':
        const totalIncome = transactions.filter(t => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions.filter(t => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);
        const netCashFlow = totalIncome - totalExpense;
        return { value: `$${netCashFlow.toLocaleString()}`};
      case 'stat-total-revenue':
        const totalRevenue = deals.filter(d => d.stage === DealStage.Won).reduce((sum, deal) => sum + deal.value, 0);
        return { value: `$${totalRevenue.toLocaleString()}` };
      case 'stat-unpaid-invoices':
        const totalUnpaid = invoices.filter(inv => inv.status === InvoiceStatus.Sent || inv.status === InvoiceStatus.Overdue).reduce((sum, inv) => sum + inv.grandTotal, 0);
        return { value: `$${totalUnpaid.toLocaleString()}` };
      case 'stat-active-customers':
        const activeCustomers = customers.filter(c => c.status === 'aktif').length;
        return { value: activeCustomers.toLocaleString() };
      case 'stat-open-tickets':
        const openTickets = tickets.filter(t => t.status === TicketStatus.Open || t.status === TicketStatus.Pending).length;
        return { value: openTickets.toLocaleString() };
      default:
        return { value: 'N/A' };
    }
  };

  const { value } = calculateStat();
  const config = AVAILABLE_WIDGETS.find(w => w.id === widgetId);

  // Fallback icon
  const icon = config && 'icon' in config ? config.icon : ICONS.dashboard;
  const color = config && 'color' in config ? config.color : 'bg-slate-500';

  return (
     <Card className="!p-4 flex flex-col justify-between h-full !shadow-none">
        <div className="flex justify-between items-center">
            <h4 className="font-semibold text-text-secondary">{config?.name}</h4>
            <div className={`p-2 rounded-lg ${color}`}>
                {React.cloneElement(icon as JSX.Element, { className: 'h-5 w-5 text-white' })}
            </div>
        </div>
        <div>
            <p className={`text-3xl font-bold text-text-main`}>{value}</p>
        </div>
    </Card>
  );
});

export default StatCardWidget;



import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';
import { InvoiceStatus, TransactionType } from '../../types';

interface ChartWidgetProps {
  widgetId: string;
}

const ChartWidget: React.FC<ChartWidgetProps> = memo(({ widgetId }) => {
  const { transactions, invoices } = useApp();

  if (widgetId === 'chart-financial-summary') {
    const getMonthlyFinancials = () => {
      const monthlyData: { [key: string]: { income: number, expense: number } } = {};
      const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
      
      transactions.forEach(t => {
          const month = new Date(t.date).getMonth();
          const monthKey = monthNames[month];
          if(!monthlyData[monthKey]) {
              monthlyData[monthKey] = { income: 0, expense: 0 };
          }
          if(t.type === TransactionType.Income) monthlyData[monthKey].income += t.amount;
          else monthlyData[monthKey].expense += t.amount;
      });

      return monthNames.map(name => ({
          name,
          Gelir: monthlyData[name]?.income || 0,
          Gider: monthlyData[name]?.expense || 0,
      })).slice(-6); // Last 6 months
    };
    const financialSummaryData = getMonthlyFinancials();

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={financialSummaryData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128, 128, 128, 0.3)" />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip wrapperClassName="!bg-card !border-slate-200 dark:!bg-dark-card dark:!border-dark-border rounded-md" contentStyle={{ backgroundColor: 'transparent' }}/>
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
          <Bar dataKey="Gelir" fill="#16a34a" />
          <Bar dataKey="Gider" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (widgetId === 'chart-invoice-status') {
    const invoiceStatusData = Object.values(InvoiceStatus).map(status => ({
      name: status,
      value: invoices.filter(inv => inv.status === status).length,
    })).filter(item => item.value > 0);
    
    const INVOICE_PIE_COLORS: { [key: string]: string } = {
      [InvoiceStatus.Paid]: '#16a34a',
      [InvoiceStatus.Sent]: '#3b82f6',
      [InvoiceStatus.Overdue]: '#ef4444',
      [InvoiceStatus.Draft]: '#64748b',
    };

    return (
      <ResponsiveContainer width="100%" height="100%">
          <PieChart>
              <Pie data={invoiceStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" label>
              {invoiceStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={INVOICE_PIE_COLORS[entry.name as InvoiceStatus]} />
              ))}
              </Pie>
              <Tooltip wrapperClassName="!bg-card !border-slate-200 dark:!bg-dark-card dark:!border-dark-border rounded-md" contentStyle={{ backgroundColor: 'transparent' }}/>
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
          </PieChart>
      </ResponsiveContainer>
    );
  }

  return <div>Bilinmeyen Grafik Bileşeni</div>;
});

export default ChartWidget;

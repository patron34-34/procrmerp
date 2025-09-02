import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Invoice, InvoiceStatus } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { exportToCSV } from '../../../utils/csvExporter';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InvoiceSummaryReport: React.FC = () => {
    const { invoices } = useApp();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');

    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.issueDate);
            if (startDate && invoiceDate < new Date(startDate)) return false;
            if (endDate && invoiceDate > new Date(endDate)) return false;
            if (statusFilter !== 'all' && invoice.status !== statusFilter) return false;
            return true;
        });
    }, [invoices, startDate, endDate, statusFilter]);

    const totalBilled = filteredInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    const totalPaid = filteredInvoices.filter(i => i.status === InvoiceStatus.Paid).reduce((sum, inv) => sum + inv.grandTotal, 0);
    const totalOverdue = filteredInvoices.filter(i => i.status === InvoiceStatus.Overdue).reduce((sum, inv) => sum + inv.grandTotal, 0);
    const totalOutstanding = totalBilled - totalPaid;

    const statusChartData = Object.values(InvoiceStatus).map(status => ({
        name: status,
        value: filteredInvoices.filter(inv => inv.status === status).length,
    })).filter(item => item.value > 0);

    const STATUS_COLORS: { [key in InvoiceStatus]: string } = {
        [InvoiceStatus.Paid]: '#16a34a',
        [InvoiceStatus.Sent]: '#3b82f6',
        [InvoiceStatus.Overdue]: '#ef4444',
        [InvoiceStatus.Draft]: '#64748b',
        [InvoiceStatus.Archived]: '#64748b',
    };

    const handleExport = () => {
        const dataToExport = filteredInvoices.map(({ id, customerId, items, ...rest }) => rest);
        exportToCSV(dataToExport, 'fatura_durum_raporu.csv');
    };

    return (
        <div className="space-y-6">
            <Card title="Filtreler">
                <div className="flex flex-wrap items-center gap-4">
                     <div>
                        <label htmlFor="startDate" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Başlangıç Tarihi</label>
                        <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Bitiş Tarihi</label>
                        <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="statusFilter" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Durum</label>
                        <select id="statusFilter" value={statusFilter} onChange={e => setStatusFilter(e.target.value as InvoiceStatus | 'all')} className="mt-1 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border dark:text-white">
                            <option value="all">Tümü</option>
                            {Object.values(InvoiceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="self-end">
                        <Button onClick={handleExport} variant="secondary">
                            <span className="flex items-center gap-2">{ICONS.export} Dışa Aktar</span>
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Toplam Faturalanan</h4><p className="text-3xl font-bold">${totalBilled.toLocaleString()}</p></Card>
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Toplam Ödenen</h4><p className="text-3xl font-bold text-green-600">${totalPaid.toLocaleString()}</p></Card>
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Ödenmemiş Bakiye</h4><p className="text-3xl font-bold text-orange-500">${totalOutstanding.toLocaleString()}</p></Card>
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Gecikmiş Toplam</h4><p className="text-3xl font-bold text-red-600">${totalOverdue.toLocaleString()}</p></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Fatura Durum Dağılımı">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={statusChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {statusChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as InvoiceStatus]} />
                                ))}
                            </Pie>
                            <Tooltip wrapperClassName="!bg-card !border-slate-200 dark:!bg-dark-card dark:!border-dark-border rounded-md" contentStyle={{ backgroundColor: 'transparent' }}/>
                            <Legend wrapperStyle={{ color: '#94a3b8' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Detaylı Fatura Listesi" className="lg:col-span-1">
                     <div className="overflow-y-auto max-h-80">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-card dark:bg-dark-card border-b border-slate-200 dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3 font-semibold">Fatura No</th>
                                <th className="p-3 font-semibold">Müşteri</th>
                                <th className="p-3 font-semibold">Tutar</th>
                            </tr></thead>
                            <tbody>
                                {filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/50">
                                        <td className="p-3 font-medium">{invoice.invoiceNumber}</td>
                                        <td className="p-3">{invoice.customerName}</td>
                                        <td className="p-3">${invoice.grandTotal.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

        </div>
    );
};

export default InvoiceSummaryReport;

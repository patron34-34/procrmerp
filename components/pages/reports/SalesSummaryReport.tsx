

import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Deal, DealStage } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { exportToCSV } from '../../../utils/csvExporter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesSummaryReport: React.FC = () => {
    const { deals } = useApp();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filteredDeals = useMemo(() => {
        return deals.filter(deal => {
            if (deal.stage !== DealStage.Won) return false;
            const dealDate = new Date(deal.closeDate);
            if (startDate && dealDate < new Date(startDate)) return false;
            if (endDate && dealDate > new Date(endDate)) return false;
            return true;
        });
    }, [deals, startDate, endDate]);

    const totalRevenue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
    const wonDealsCount = filteredDeals.length;
    const averageDealSize = wonDealsCount > 0 ? totalRevenue / wonDealsCount : 0;

    const monthlyRevenue = useMemo(() => {
        const data: { [key: string]: number } = {};
        filteredDeals.forEach(deal => {
            const month = new Date(deal.closeDate).toLocaleDateString('tr-TR', { year: '2-digit', month: 'short' });
            if (!data[month]) data[month] = 0;
            data[month] += deal.value;
        });
        return Object.keys(data).map(key => ({ name: key, Gelir: data[key] }));
    }, [filteredDeals]);

    const handleExport = () => {
        const dataToExport = filteredDeals.map(({ id, stage, ...rest }) => rest);
        exportToCSV(dataToExport, 'satis_performans_raporu.csv');
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
                    <div className="self-end">
                        <Button onClick={handleExport} variant="secondary">
                            <span className="flex items-center gap-2">{ICONS.export} Dışa Aktar</span>
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Toplam Gelir</h4><p className="text-3xl font-bold text-primary-600">${totalRevenue.toLocaleString()}</p></Card>
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Kazanılan Anlaşma Sayısı</h4><p className="text-3xl font-bold">{wonDealsCount}</p></Card>
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Ortalama Anlaşma Değeri</h4><p className="text-3xl font-bold">${averageDealSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p></Card>
            </div>

            <Card title="Aylık Gelir Dağılımı">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                        <YAxis tick={{ fill: '#94a3b8' }} />
                        <Tooltip wrapperClassName="!bg-card !border-slate-200 dark:!bg-dark-card dark:!border-dark-border rounded-md" contentStyle={{ backgroundColor: 'transparent' }}/>
                        <Bar dataKey="Gelir" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card title="Detaylı Anlaşma Listesi">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-200 dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-4 font-semibold">Anlaşma Başlığı</th>
                            <th className="p-4 font-semibold">Müşteri</th>
                            <th className="p-4 font-semibold">Değer</th>
                            <th className="p-4 font-semibold">Kapanış Tarihi</th>
                        </tr></thead>
                        <tbody>
                            {filteredDeals.map((deal) => (
                                <tr key={deal.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/50">
                                    <td className="p-4 font-medium">{deal.title}</td>
                                    <td className="p-4">{deal.customerName}</td>
                                    <td className="p-4 font-semibold text-green-600">${deal.value.toLocaleString()}</td>
                                    <td className="p-4">{deal.closeDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default SalesSummaryReport;
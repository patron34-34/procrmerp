import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { LeaveRequest, LeaveStatus, LeaveType } from '../../../types';
import Card from '../../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { exportToCSV } from '../../../utils/csvExporter';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';

const LeaveStatisticsReport: React.FC = () => {
    const { leaveRequests } = useApp();
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const [startDate, setStartDate] = useState(firstDayOfYear.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

    const filteredRequests = useMemo(() => {
        return leaveRequests.filter(req =>
            req.status === LeaveStatus.Approved &&
            req.startDate >= startDate &&
            req.endDate <= endDate
        );
    }, [leaveRequests, startDate, endDate]);

    const stats = useMemo(() => {
        let totalDays = 0;
        const byType: { [key in LeaveType]?: number } = {};

        filteredRequests.forEach(req => {
            const start = new Date(req.startDate);
            const end = new Date(req.endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            totalDays += diffDays;
            byType[req.leaveType] = (byType[req.leaveType] || 0) + diffDays;
        });

        const pieData = Object.entries(byType).map(([name, value]) => ({ name, value }));
        
        return { totalDays, pieData };
    }, [filteredRequests]);

    const monthlyData = useMemo(() => {
        const months: { [key: string]: number } = {};
        filteredRequests.forEach(req => {
            const month = new Date(req.startDate).toLocaleString('tr-TR', { month: 'short', year: '2-digit' });
            const start = new Date(req.startDate);
            const end = new Date(req.endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            months[month] = (months[month] || 0) + diffDays;
        });
        return Object.keys(months).map(name => ({ name, 'İzin Günü': months[name] }));
    }, [filteredRequests]);

    const handleExport = () => {
        const dataToExport = filteredRequests.map(req => ({
            'Çalışan': req.employeeName,
            'İzin Tipi': req.leaveType,
            'Başlangıç': req.startDate,
            'Bitiş': req.endDate,
            'Sebep': req.reason
        }));
        exportToCSV(dataToExport, `izin-raporu-${startDate}-${endDate}.csv`);
    };

    const PIE_COLORS = ['#3b82f6', '#ef4444', '#f97316', '#8b5cf6'];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">İzin İstatistikleri Raporu</h1>
            <Card title="Filtreler">
                 <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <label className="block text-sm font-semibold">Başlangıç Tarihi</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">Bitiş Tarihi</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1" />
                    </div>
                    <div className="self-end">
                        <Button onClick={handleExport} variant="secondary">
                            <span className="flex items-center gap-2">{ICONS.export} Dışa Aktar</span>
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h4 className="text-text-secondary">Toplam Kullanılan İzin Günü</h4>
                    <p className="text-3xl font-bold">{stats.totalDays}</p>
                </Card>
                <Card title="İzin Türüne Göre Dağılım">
                     <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={stats.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {stats.pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <Card title="Aylara Göre İzin Kullanımı">
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="İzin Günü" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default LeaveStatisticsReport;

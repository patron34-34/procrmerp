import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { exportToCSV } from '../../../utils/csvExporter';
import { Employee } from '../../../types';

const TurnoverReport: React.FC = () => {
    const { employees } = useApp();
    
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    const [startDate, setStartDate] = useState(firstDayOfYear.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

    const reportData = useMemo(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const employeesAtStart = employees.filter(e => {
            const hireDate = new Date(e.hireDate);
            const termDate = e.istenCikisTarihi ? new Date(e.istenCikisTarihi) : null;
            return hireDate < start && (!termDate || termDate >= start);
        }).length;

        const employeesAtEnd = employees.filter(e => {
            const hireDate = new Date(e.hireDate);
            const termDate = e.istenCikisTarihi ? new Date(e.istenCikisTarihi) : null;
            return hireDate <= end && (!termDate || termDate > end);
        }).length;
        
        const employeesWhoLeft = employees.filter(e => {
            if (!e.istenCikisTarihi) return false;
            const termDate = new Date(e.istenCikisTarihi);
            return termDate >= start && termDate <= end;
        });

        const numLeft = employeesWhoLeft.length;
        const avgEmployees = (employeesAtStart + employeesAtEnd) / 2;
        const turnoverRate = avgEmployees > 0 ? (numLeft / avgEmployees) * 100 : 0;

        return {
            employeesAtStart,
            employeesAtEnd,
            leftEmployees: employeesWhoLeft,
            numLeft,
            avgEmployees,
            turnoverRate,
        };

    }, [employees, startDate, endDate]);

    const handleExport = () => {
        if (reportData.leftEmployees.length === 0) return;
        const dataToExport = reportData.leftEmployees.map(e => ({
            'Çalışan ID': e.employeeId,
            'Ad Soyad': e.name,
            'Departman': e.department,
            'Pozisyon': e.position,
            'İşe Giriş Tarihi': e.hireDate,
            'Ayrılış Tarihi': e.istenCikisTarihi,
            'Ayrılış Nedeni': e.istenCikisNedeni,
        }));
        exportToCSV(dataToExport, `devir-orani-raporu-${startDate}-${endDate}.csv`);
    };


    return (
        <div className="space-y-6">
            <Card title="Filtreler">
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-semibold text-text-secondary">Başlangıç Tarihi</label>
                        <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-semibold text-text-secondary">Bitiş Tarihi</label>
                        <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                    </div>
                    <div className="self-end">
                        <Button onClick={handleExport} variant="secondary" disabled={reportData.leftEmployees.length === 0}>
                            <span className="flex items-center gap-2">{ICONS.export} Dışa Aktar</span>
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><h4 className="text-text-secondary">Devir Oranı (%)</h4><p className="text-3xl font-bold text-primary-600">{reportData.turnoverRate.toFixed(2)}%</p></Card>
                <Card><h4 className="text-text-secondary">Ayrılan Çalışan Sayısı</h4><p className="text-3xl font-bold">{reportData.numLeft}</p></Card>
                <Card><h4 className="text-text-secondary">Ortalama Çalışan Sayısı</h4><p className="text-3xl font-bold">{reportData.avgEmployees.toFixed(1)}</p></Card>
                 <Card>
                    <h4 className="text-text-secondary">Dönem Başı/Sonu Çalışan</h4>
                    <p className="text-3xl font-bold">
                        {reportData.employeesAtStart} / <span className="text-green-600">{reportData.employeesAtEnd}</span>
                    </p>
                </Card>
            </div>

            <Card title="Dönem İçinde Ayrılan Çalışanlar">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold">Ad Soyad</th>
                            <th className="p-3 font-semibold">Pozisyon</th>
                            <th className="p-3 font-semibold">İşe Giriş</th>
                            <th className="p-3 font-semibold">Ayrılış</th>
                            <th className="p-3 font-semibold">Ayrılış Nedeni</th>
                        </tr></thead>
                        <tbody>
                            {reportData.leftEmployees.map(employee => (
                                <tr key={employee.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-medium">{employee.name}</td>
                                    <td className="p-3">{employee.position}</td>
                                    <td className="p-3">{employee.hireDate}</td>
                                    <td className="p-3 font-semibold text-red-500">{employee.istenCikisTarihi}</td>
                                    <td className="p-3 text-sm">{employee.istenCikisNedeni}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {reportData.leftEmployees.length === 0 && (
                        <p className="text-center p-8 text-text-secondary">Seçilen dönemde ayrılan çalışan bulunmamaktadır.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default TurnoverReport;

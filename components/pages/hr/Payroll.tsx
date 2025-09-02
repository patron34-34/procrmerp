

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { PayrollRun } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import EmptyState from '../../ui/EmptyState';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../../ui/Modal';
import { useNotification } from '../../../context/NotificationContext';

const Payroll: React.FC = () => {
    const { payrollRuns, addPayrollRun, hasPermission } = useApp();
    const { addToast } = useNotification();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const currentYear = new Date().getFullYear();
    const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('tr-TR', { month: 'long' }));
    const [selectedYear, setSelectedYear] = useState(currentYear);
    
    const canManage = hasPermission('ik:bordro-yonet');

    const months = [
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    const years = [currentYear + 1, currentYear, currentYear - 1];


    const handleCreateRun = () => {
        const payPeriod = `${selectedMonth} ${selectedYear}`;
        if (payPeriod.trim()) {
            const newRun = addPayrollRun(payPeriod.trim());
            setIsModalOpen(false);
            if (newRun) {
                navigate(`/hr/payroll/${newRun.id}`);
            }
        } else {
            addToast("Lütfen bir bordro dönemi belirtin.", "warning");
        }
    };

    const getStatusBadge = (status: PayrollRun['status']) => {
        const styles: { [key in PayrollRun['status']]: string } = {
            'Taslak': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            'Onaylandı': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'Muhasebeleşti': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };


    return (
        <>
            <Card
                title="Bordro Dönemleri"
                action={canManage && <Button onClick={() => setIsModalOpen(true)}><span className="flex items-center gap-2">{ICONS.add} Yeni Bordro Dönemi</span></Button>}
            >
                <div className="overflow-x-auto">
                    {payrollRuns.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3 font-semibold">Dönem</th>
                                <th className="p-3 font-semibold">Oluşturma Tarihi</th>
                                <th className="p-3 font-semibold">Çalışan Sayısı</th>
                                <th className="p-3 font-semibold text-right">Toplam Net Maaş</th>
                                <th className="p-3 font-semibold text-center">Durum</th>
                                <th className="p-3 font-semibold">Eylemler</th>
                            </tr></thead>
                            <tbody>
                                {payrollRuns.map(run => (
                                    <tr key={run.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3 font-medium">{run.payPeriod}</td>
                                        <td className="p-3">{run.runDate}</td>
                                        <td className="p-3">{run.employeeCount}</td>
                                        <td className="p-3 text-right font-mono font-semibold text-green-600">${run.totalNetPay.toLocaleString()}</td>
                                        <td className="p-3 text-center">
                                            {getStatusBadge(run.status)}
                                        </td>
                                        <td className="p-3">
                                            <Link to={`/hr/payroll/${run.id}`} className="text-primary-600 hover:underline text-sm">
                                                Yönet
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <EmptyState
                            icon={ICONS.payroll}
                            title="Henüz Bordro Dönemi Yok"
                            description="İlk bordro döneminizi oluşturarak maaş ödemelerini yönetmeye başlayın."
                            action={canManage ? <Button onClick={() => setIsModalOpen(true)}>Bordro Dönemi Oluştur</Button> : undefined}
                        />
                    )}
                </div>
            </Card>
            {canManage && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Bordro Dönemi Oluştur">
                     <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="payPeriodMonth" className="block text-sm font-medium">Dönem Ayı *</label>
                                <select
                                    id="payPeriodMonth"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                >
                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="payPeriodYear" className="block text-sm font-medium">Dönem Yılı *</label>
                                <select
                                    id="payPeriodYear"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                >
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4 gap-2">
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>İptal</Button>
                            <Button onClick={handleCreateRun}>Oluştur</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default Payroll;
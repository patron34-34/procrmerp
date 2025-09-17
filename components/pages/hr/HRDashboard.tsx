import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LeaveStatus, ExpenseStatus } from '../../../types';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';

const HRDashboard: React.FC = () => {
    const { employees, leaveRequests, expenses } = useApp();

    const pendingLeaves = useMemo(() => leaveRequests.filter(lr => lr.status === LeaveStatus.Pending), [leaveRequests]);
    const pendingExpenses = useMemo(() => expenses.filter(e => e.status === ExpenseStatus.Pending), [expenses]);

    const quickLinks = [
        { name: 'Çalışanlar', to: '/hr/employees', icon: ICONS.employees },
        { name: 'Bordro', to: '/hr/payroll', icon: ICONS.payroll },
        { name: 'İzin Yönetimi', to: '/hr/leaves', icon: ICONS.leave },
        { name: 'Masraf Yönetimi', to: '/hr/expenses', icon: ICONS.expenses },
        { name: 'Raporlar', to: '/hr/reports', icon: ICONS.reports },
        { name: 'Organizasyon Şeması', to: '/hr/organization-chart', icon: ICONS.team },
        { name: 'İşe Alım', to: '/hr/recruitment/jobs', icon: ICONS.search },
        { name: 'Oryantasyon', to: '/hr/onboarding/workflows', icon: ICONS.projects },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">İK Kontrol Paneli</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title={`Onay Bekleyen Talepler (${pendingLeaves.length + pendingExpenses.length})`}>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                             {pendingLeaves.length === 0 && pendingExpenses.length === 0 ? (
                                <p className="text-text-secondary text-center py-4">Onayınızı bekleyen bir talep bulunmuyor.</p>
                            ) : (
                                <>
                                    {pendingLeaves.map(req => (
                                        <div key={`leave-${req.id}`} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex justify-between items-center">
                                            <div>
                                                <p><span className="font-semibold">{req.employeeName}</span> - İzin Talebi</p>
                                                <p className="text-sm text-text-secondary">{req.leaveType}: {req.startDate} / {req.endDate}</p>
                                            </div>
                                            <Link to="/hr/leaves">
                                                <Button size="sm" variant="secondary">İncele</Button>
                                            </Link>
                                        </div>
                                    ))}
                                    {pendingExpenses.map(exp => (
                                         <div key={`exp-${exp.id}`} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex justify-between items-center">
                                            <div>
                                                <p><span className="font-semibold">{exp.employeeName}</span> - Masraf Talebi</p>
                                                <p className="text-sm text-text-secondary" title={exp.description}>{exp.category}: <span className="font-mono">${exp.amount}</span></p>
                                            </div>
                                            <Link to="/hr/expenses">
                                                <Button size="sm" variant="secondary">İncele</Button>
                                            </Link>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card title="Hızlı Bağlantılar">
                        <div className="grid grid-cols-2 gap-4">
                            {quickLinks.map(link => (
                                <Link key={link.to} to={link.to} className="block p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    <div className="w-8 h-8 mx-auto text-primary-600">{link.icon}</div>
                                    <p className="mt-2 text-sm font-semibold">{link.name}</p>
                                </Link>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HRDashboard;
